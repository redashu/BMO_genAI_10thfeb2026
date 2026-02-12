import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class BedrockLangchainCleanStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const invokeLambda = new NodejsFunction(this, 'InvokeLambda', {
  runtime: lambda.Runtime.NODEJS_18_X,
  entry: path.join(__dirname, '../lambda/index.ts'),
  handler: 'handler',
  timeout: cdk.Duration.seconds(30),
  memorySize: 512,
  bundling: {
    externalModules: [],   // 🔥 bundle everything including AWS SDK
    minify: false,
    sourceMap: false,
  },
  environment: {
    MODEL_ID: 'meta.llama3-8b-instruct-v1:0',
  },
});


    invokeLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'bedrock:InvokeModel',
          'bedrock:InvokeModelWithResponseStream'
        ],
        resources: ['*'],
      })
    );

    const api = new apigateway.RestApi(this, 'BedrockApi', {
      restApiName: 'Bedrock Minimal API',
      deployOptions: { stageName: 'prod' },
    });

    const resource = api.root.addResource('invoke');

    resource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(invokeLambda)
    );

    new cdk.CfnOutput(this, 'InvokeUrl', {
      value: `${api.url}invoke`,
    });
  }
}