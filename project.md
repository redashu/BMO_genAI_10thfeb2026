# Capstone Architecture (Production-Style)

Here’s what we’ll build conceptually:

```
User (Amazon Lex Chatbot)
    ↓
Lex → Lambda (Fulfillment)
    ↓
Retriever (Vector Store)
    ↓
Context Builder
    ↓
Llama (Bedrock)
    ↓
Final Answer
    ↓
Lex → User
```

## 🔥 High-Level Components

We’ll use:

- 📦 **S3** → document storage
- 🧠 **Embeddings model (Titan)**
- 🔎 **Vector store** (OpenSearch Serverless or Knowledge Base)
- 🦙 **Llama model (Bedrock)**
- ⚙️ **Lambda orchestration**
- 💬 **Amazon Lex as chatbot UI**

---

## 🧠 Step 1 — Content Ingestion Layer

You have 2 clean options:

### Option A (Managed & Cleaner)

Use **Bedrock Knowledge Base**:

- Automatically manages:
  - Embeddings
  - Chunking
  - Vector store
- Easiest path

### Option B (Full Control)

- S3
- Titan embedding model
- OpenSearch vector index
- Custom retrieval

> **For capstone speed + clarity:**  
> 👉 Knowledge Base + Llama invoke manually

---

## 🏗 Step 2 — Vector Store

If using **Knowledge Base**:

- AWS internally manages:
  - OpenSearch Serverless
  - Vector indexing
  - Chunking

If custom:

- Deploy OpenSearch Serverless collection
- Vector index mapping
- Embed via Titan model

> **Since you already built RAG earlier:**  
> 👉 Reuse Knowledge Base

---

## 🧠 Step 3 — Retrieval + LLM Orchestration (Lambda)

Your Lambda will:

1. Receive Lex input
2. Call Retrieve API
3. Get relevant chunks
4. Build prompt
5. Call Llama via InvokeModel
6. Return answer to Lex

---

## 🧱 Step 4 — Amazon Lex Integration

**Lex flow:**

```
User → Lex Bot
Lex → Lambda Fulfillment
Lambda → RAG + Llama
Lambda → Lex Response
Lex → User
```

**Lex does:**

- Intent detection
- Slot management
- Multi-turn memory

**LLM does:**

- Knowledge answering

---

## 🚀 Full Capstone Build Plan (Structured)

### Phase 1 — Knowledge Base Setup

- Create S3 bucket
- Upload documents
- Create Knowledge Base
- Sync
- Test retrieval

### Phase 2 — Lambda Orchestration

- Use BedrockAgentRuntimeClient or Retrieve API
- Call Llama
- Return clean answer

### Phase 3 — Lex Bot

- Create Lex bot
- Create intent: `AskKnowledgeQuestion`
- Fulfillment = Lambda

### Phase 4 — End-to-End Testing

- Chat via Lex test console
- Validate:
  - Retrieval working
  - LLM formatting good
  - Guardrails respected

---

## 🧠 Prompt Engineering for Capstone

Your Lambda prompt should look like:

```
You are a company knowledge assistant.
Answer only based on the provided context.
If answer not in context, say:
"I do not have enough information."

Context:
${retrieved_docs}

Question:
${user_question}
```

> **Never directly pass user input to LLM without context injection.**

---

## 🛡 Add Guardrail

Attach guardrail to:

- Llama invocation (if using Agent)
- Or manually validate output

Block:

- Medical advice
- Legal advice
- Political persuasion

---

## 🎯 Final Deliverable

You’ll have:

- Full RAG pipeline
- Managed vector store
- LLM invocation
- Chatbot UI
- Enterprise architecture
- Guardrails
