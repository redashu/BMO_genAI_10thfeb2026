# 🏗 Simple Chatbot Architecture (Production-Ready Mental Model)

## 🎯 Use Case

User types:

> "Explain AWS Lambda in simple terms."

System returns AI-generated answer.

## 🔷 High-Level Architecture

```
                 ┌─────────────────────────────┐
                 │        Control Plane        │
                 │   (Management & Config)     │
                 └─────────────────────────────┘
                          │
                          │  Admin Setup Only
                          ▼
        Enable Model Access / Configure Guardrails / Agents

──────────────────────────────────────────────────────────

                 ┌─────────────────────────────┐
                 │         Data Plane          │
                 │    (Runtime Inference)      │
                 └─────────────────────────────┘

User
 ↓
Frontend (React / Web App)
 ↓
API Gateway
 ↓
Lambda (Backend)
 ↓
Bedrock Runtime (InvokeModel)
 ↓
Foundation Model
 ↓
Generated Response
 ↓
User
```

## 🧭 Step 1 — Control Plane (Admin Layer)

This is used during setup, not during every chat request.

**What happens here?**

An admin or DevOps engineer:

- Enables access to Claude / Titan models
- Configures guardrails
- Creates knowledge bases (if needed)
- Creates Bedrock Agents (if needed)

**APIs used:**

- `ListFoundationModels`
- `CreateAgent`
- `ConfigureGuardrail`

**Endpoint:**

- `bedrock` (control plane endpoint)

> ⚠️ **Important:**
> This plane does NOT generate text.
> It only manages configuration.

**IAM Example:**

- DevOps role → `bedrock:*`
- Application Lambda → NO control plane access

## 🚀 Step 2 — Data Plane (Runtime Inference)

This is where actual chatbot messages flow.

Every time user sends a message:

Lambda calls:

- `InvokeModel`

**Endpoint:**

- `bedrock-runtime` (data plane endpoint)

This is where:

- Prompt is processed
- Tokens are generated
- Cost is incurred

## 🧠 Detailed Runtime Flow (Chat Message)

Let's walk through a real request.

### 1️⃣ User sends message

Frontend sends:

```json
{
  "message": "Explain AWS Lambda simply"
}
```

### 2️⃣ API Gateway

Routes request to Lambda.

### 3️⃣ Lambda Backend

Lambda does:

- Input validation
- Adds system prompt (optional)
- Prepares request body
- Calls Bedrock Runtime

Example logical call:

```
modelId: "anthropic.claude-3-sonnet"
messages: [
  { role: "user", content: "Explain AWS Lambda simply" }
]
```

### 4️⃣ Bedrock Runtime (Data Plane)

Flow inside AWS:

```
Lambda
→ bedrock-runtime endpoint
→ Model container executes inference
→ Tokens generated
→ Response returned
```

This is pure data plane execution.

### 5️⃣ Response Returned

Lambda receives:

```json
{
  "content": "AWS Lambda is a serverless compute service..."
}
```

Returns to frontend.

User sees answer.

## 🔐 IAM Separation (Very Important)

**Lambda Role Permissions:**

```json
{
  "Action": [
    "bedrock:InvokeModel",
    "bedrock:InvokeModelWithResponseStream"
  ],
  "Effect": "Allow"
}
```

Lambda does NOT need:

- `CreateAgent`
- `ListFoundationModels`
- `ConfigureGuardrail`

That's control plane.

## 🌐 Enterprise Networking Setup

In private architecture:

Create two VPC interface endpoints:

**1️⃣** `com.amazonaws.<region>.bedrock`
(Control Plane)

**2️⃣** `com.amazonaws.<region>.bedrock-runtime`
(Data Plane)

**Most applications only require:**
→ `bedrock-runtime`

This keeps inference traffic private.

## 🧩 Clean Separation Summary

| Layer | Purpose | Used By | Generates Tokens? |
|-------|---------|---------|-------------------|
| Control Plane | Configure Bedrock resources | Admin / DevOps | ❌ No |
| Data Plane | Run inference | Application backend | ✅ Yes |