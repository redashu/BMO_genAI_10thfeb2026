import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';


export class BedrockModelListerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here lambda funcation here 
    const modelListerLambda = new lambda.Function(this, 'ModelListerFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      timeout: cdk.Duration.seconds(30),
    });

     // IAM permission for Control Plane
    modelListerLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'bedrock:ListFoundationModels'
        ],
        resources: ['*'],
      })
    );
}
}