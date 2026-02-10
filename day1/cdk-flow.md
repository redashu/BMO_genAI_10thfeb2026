# 🧠 First Principle

CDK itself cannot list models at deploy time.

## Why?

- CDK synthesizes CloudFormation templates.
- `ListFoundationModels` is a runtime API call.
- CloudFormation has no native Bedrock resource for listing models.
- So we must introduce a runtime compute layer.

Now let's break down all realistic architectural flows.

## 🏗 FLOW 1 — Lambda (Most Common & Cleanest)

### Architecture

```text
CDK Stack
 ├── Lambda
 ├── IAM Role (bedrock:ListFoundationModels)
 └── (Optional) API Gateway
```

### Flow

- CDK deploys Lambda
- Lambda uses `@aws-sdk/client-bedrock`
- Calls `ListFoundationModels`
- Returns model list

### Use Case

- Backend admin API
- Internal tools
- DevOps utilities
- CLI-backed Lambda

### Pros

- ✔ Serverless  
- ✔ Clean IAM separation  
- ✔ Easy to expose via API  

This is the standard production approach.

## 🏗 FLOW 2 — API Gateway + Lambda (Admin API)

### Architecture

```text
Admin UI
    ↓
API Gateway
    ↓
Lambda
    ↓
Bedrock Control Plane
```

CDK deploys:

- Lambda
- API Gateway
- IAM role

### Use Case

- Admin dashboard
- Model discovery UI
- Multi-region model viewer

Same control plane call — just exposed over HTTP.

## 🏗 FLOW 3 — ECS / Fargate Service

### Architecture

```text
CDK Stack
 ├── ECS Service
 ├── Task Role (bedrock:ListFoundationModels)
 └── ALB (optional)
```

Containerized backend calls:

```js
new ListFoundationModelsCommand()
```

### Use Case

- Long-running backend services
- Enterprise microservices
- SaaS platform

## 🏗 FLOW 4 — EC2 (Not Common but Possible)

CDK provisions:

- EC2 instance
- IAM instance profile

Application running on EC2 calls Bedrock control plane.

### Use Case

- Legacy architecture
- Hybrid workloads

## 🏗 FLOW 5 — Step Functions + Lambda

### Architecture

```text
Step Function
    ↓
Lambda
    ↓
ListFoundationModels
```

### Use Case

- Scheduled model inventory checks
- Governance audits
- Multi-account compliance scanning

CDK deploys:

- State Machine
- Lambda
- IAM permissions

## 🏗 FLOW 6 — Custom Resource (Advanced / Tricky)

You can create:

```text
CDK Custom Resource
    ↓
Lambda-backed
    ↓
ListFoundationModels
```

This runs at deploy time.

**BUT ⚠️**

- Custom resources are meant for provisioning tasks
- Not ideal for dynamic API listing
- Risky if models change frequently

### Use Case

- You want model metadata stored in SSM Parameter Store at deploy
- Advanced, not typical.

## 🏗 FLOW 7 — CLI / Local Dev (No Runtime Infra)

CDK deploys nothing related.

You simply run:

```bash
aws bedrock list-foundation-models
```

or write a Node script locally.

This is outside application infra.

## 🧩 Clean Summary

| Flow           | Runtime Needed? | Best For           | Production Use?      |
| -------------- | --------------- | ------------------ | -------------------- |
| Lambda         | Yes             | Serverless apps    | ✅ Very Common        |
| API + Lambda   | Yes             | Admin dashboards   | ✅ Very Common        |
| ECS            | Yes             | Microservices      | ✅                   |
| EC2            | Yes             | Legacy systems     | ⚠️                   |
| Step Functions | Yes             | Automation         | ✅                   |
| Custom Resource| Yes (deploy-time)| Advanced infra tricks | ⚠️ Rare           |
| CLI            | No infra        | Dev only           | ❌ Not App           |

## 🧠 Architect-Level Insight

All flows share one thing:

They need:

```text
bedrock:ListFoundationModels
```

And they call:

Control Plane endpoint → bedrock

Not:

```text
bedrock-runtime
```
