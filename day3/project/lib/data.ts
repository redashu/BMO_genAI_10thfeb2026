import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class BedrockRagDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // =============================
    // 1️⃣ Lambda (RAG + Llama)
    // =============================
    const ragLambda = new lambda.Function(this, 'BedrockRagLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        KNOWLEDGE_BASE_ID: 'EHLDBBDLXP',
        MODEL_ARN:
          'arn:aws:bedrock:us-east-1::foundation-model/meta.llama3-8b-instruct-v1:0',
      },
    });

    ragLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'bedrock:RetrieveAndGenerate',
          'bedrock:Retrieve',
          'bedrock:InvokeModel',
          'bedrock:InvokeModelWithResponseStream',
        ],
        resources: ['*'],
      })
    );

    // =============================
    // 2️⃣ API Gateway (CORS Enabled)
    // =============================
    const api = new apigateway.RestApi(this, 'BedrockRagApi', {
      restApiName: 'Bedrock RAG API',
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowMethods: ['POST'],
        allowHeaders: ['Content-Type'],
      },
      deployOptions: { stageName: 'prod' },
    });

    const ragResource = api.root.addResource('rag');

    ragResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(ragLambda)
    );

    // =============================
    // 3️⃣ S3 Website Bucket (Private)
    // =============================
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // =============================
    // 4️⃣ Deploy Frontend Folder
    // =============================
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('./frontend')],
      destinationBucket: websiteBucket,
    });

    // =============================
    // 5️⃣ CloudFront Distribution (FIXED)
    // =============================

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'OAI'
    );

    websiteBucket.grantRead(originAccessIdentity);

    const distribution = new cloudfront.Distribution(
      this,
      'WebsiteDistribution',
      {
        defaultRootObject: 'index.html', // 🔥 IMPORTANT FIX
        defaultBehavior: {
          origin: new origins.S3Origin(websiteBucket, {
            originAccessIdentity,
          }),
        },
      }
    );

    // =============================
    // 6️⃣ Outputs
    // =============================
    new cdk.CfnOutput(this, 'RagApiUrl', {
      value: `${api.url}rag`,
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: `https://${distribution.domainName}`,
    });
  }
}