import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class BedrockRagDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda
    const ragLambda = new lambda.Function(this, 'BedrockRagLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        KNOWLEDGE_BASE_ID: 'EHLDBBDLXP',
        MODEL_ARN: 'arn:aws:bedrock:us-east-1::foundation-model/meta.llama3-8b-instruct-v1:0',
      },
    });
    // IAM for RAG
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
    // API Gateway
    const api = new apigateway.RestApi(this, 'BedrockRagApi', {
      restApiName: 'Bedrock RAG API',
      deployOptions: { stageName: 'prod' },
    });

    const ragResource = api.root.addResource('rag');

    ragResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(ragLambda)
    );

    new cdk.CfnOutput(this, 'RagUrl', {
      value: `${api.url}rag`,
    });
  }
}