import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BedrockInvokeDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda
    const invokeLambda = new lambda.Function(this, 'BedrockInvokeLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    // IAM for Data Plane
    invokeLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'bedrock:InvokeModel',
          'bedrock:InvokeModelWithResponseStream'
        ],
        resources: ['*'],
      })
    );

    // API Gateway
    const api = new apigateway.RestApi(this, 'BedrockInvokeApi', {
      restApiName: 'Bedrock Invoke API',
      deployOptions: { stageName: 'prod' },
    });

    const invokeResource = api.root.addResource('invoke');

    invokeResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(invokeLambda)
    );

    new cdk.CfnOutput(this, 'InvokeUrl', {
      value: `${api.url}invoke`,
    });
  }
}