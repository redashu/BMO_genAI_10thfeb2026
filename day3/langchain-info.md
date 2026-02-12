# 🧠 Chapter 7 – LangChain & Memory (With Bedrock)

We’ll structure this properly:

1. **What LangChain actually is**
2. **Why orchestration is needed**
3. **Memory storage patterns**
4. **Hands-on lab (LangChain + Bedrock)**
5. **Production architecture insights**

---

## 🔥 1️⃣ What Is LangChain?

LangChain is **not** a model.

It is a framework for:

- Prompt templating
- Model chaining
- Tool calling
- Memory handling
- Retrieval integration
- Agent orchestration

**Think of it as:**

- **Bedrock = Brain**
- **LangChain = Conductor**

---

## 🧠 Why You Need Orchestration

Right now your Lambda does:

```
Input → Bedrock → Output
```

That’s single-step.

But real systems need:

- Multi-step workflows
- Context memory
- Tool execution
- RAG + LLM blending
- Conditional routing

**Example:**

> **User:**  
> “Summarize my leave policy and create an email draft requesting leave.”

That requires:

1. Retrieve policy
2. Summarize
3. Generate email
4. Maintain conversation context

That’s orchestration.

---

## 🧱 2️⃣ LangChain + Bedrock Architecture

```
User
 ↓
API
 ↓
LangChain
    ├── Prompt Template
    ├── Memory Store
    ├── Retriever
    ├── Model
    └── Tools
 ↓
Bedrock Runtime
 ↓
Response
```

- **LangChain handles logic.**
- **Bedrock handles inference.**

---

## 🧠 3️⃣ Memory Storage Patterns

Very important for conversational AI.

There are 4 major patterns:

### 🟢 1. Buffer Memory (Simple)

Stores entire conversation in memory.

**Pros:**

- Easy
- Good for short chats

**Cons:**

- Token cost increases
- Not scalable

---

### 🟡 2. Window Memory

Stores last N messages.

**Example:**  
Keep last 5 exchanges.

**Better for:**

- Cost control
- Stable context

---

### 🔵 3. Summary Memory

Instead of storing everything:

- Summarize conversation
- Store summary
- Pass summary to model

Great for long-running conversations.

---

### 🔴 4. Persistent Memory (Production)

Store conversation in:

- DynamoDB
- Redis
- Aurora
- S3

Then retrieve based on `sessionId`.

This is what ChatGPT-style systems use.
