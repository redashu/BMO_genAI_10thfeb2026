# 🧠 PART 1 — What Is RAG (Really)?

**RAG = Retrieval-Augmented Generation**

It solves the biggest LLM problem:

> LLMs hallucinate and don’t know your private data.

Instead of training the model, we:

1. Store company documents
2. Convert them into embeddings
3. Store embeddings in a vector store
4. Retrieve relevant chunks at query time
5. Inject them into the prompt
6. Let LLM generate answer

So the model becomes:

- 🧠 **General Intelligence**
- +
- 📚 **Your Private Knowledge**

## 🏢 Enterprise AI

### 🏗 Conceptual RAG Flow

```
User Question
    ↓
Embedding Model
    ↓
Vector Search
    ↓
Relevant Chunks
    ↓
Prompt Construction
    ↓
LLM (Generation)
    ↓
Final Answer
```

That’s pure RAG.

# 🔥 PART 2 — RAG with Bedrock Knowledge Bases

Now AWS simplifies this using:

**Bedrock Knowledge Bases**

Instead of building:

- OpenSearch
- Chunking logic
- Embedding pipelines
- Retrieval logic

AWS manages it.

## 🧭 Architecture with Knowledge Bases

```
S3 (Documents)
    ↓
Bedrock Knowledge Base
    ↓
Managed Embeddings + Vector Store
    ↓
User Query
    ↓
Retrieve + Generate API
    ↓
LLM
    ↓
Answer
```

You don’t manually manage embeddings.

AWS handles:

- Chunking
- Embedding
- Vector indexing
- Retrieval

## 🧠 Components in Knowledge Base RAG

1. **Data Source** (S3 bucket)
2. **Embedding Model** (Titan embeddings)
3. **Vector Store** (managed or OpenSearch)
4. **Foundation Model** (Claude, etc.)
5. **RetrieveAndGenerate API**

> This is mostly Control Plane setup, but runtime calls are Data Plane.