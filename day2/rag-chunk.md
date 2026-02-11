# What Are Embeddings (In RAG Context)?

An embedding is a dense numerical vector representation of text.

Instead of storing text like:

> "The capital of France is Paris"

We convert it into something like:

```
[0.021, -0.334, 0.876, ..., 0.112]
```

Usually 384, 768, 1024, or 1536+ dimensions depending on the model.

The idea:  
👉 **Similar meanings → similar vectors → close in vector space.**

---

## Why Embeddings Matter in RAG

In Retrieval-Augmented Generation, embeddings power:

- Document indexing
- Query understanding
- Similarity search
- Context retrieval

Without embeddings, RAG collapses.

---

## RAG Pipeline (Where Embeddings Fit)

Here’s the simplified flow:

1. Chunk documents
2. Convert each chunk → embedding
3. Store embeddings in vector database
4. User asks question
5. Convert query → embedding
6. Perform similarity search
7. Retrieve top-k relevant chunks
8. Send chunks + question to LLM

Embeddings are used in steps 2 and 5, and drive step 6.

---

## How Embeddings Actually Work

Most embedding models are transformer-based (BERT-style or contrastively trained models).

They are trained so that:

- Semantically similar text → close vectors
- Unrelated text → far apart

Distance is measured using:

- **Cosine similarity** (most common)
- Dot product
- Euclidean distance

**Cosine similarity formula:**

```
cos(θ) = (A · B) / (||A|| ||B||)
```

Higher cosine similarity → more relevant.

---

## Example in Practice

**Documents:**

1. "Python is a programming language."
2. "The stock market crashed yesterday."
3. "Python supports object-oriented programming."

**User query:**

> "What is Python used for?"

The query embedding will be closest to documents 1 and 3 — not 2.

No keyword matching required.

That’s the power.

---

## Types of Embedding Models Used in RAG

1. **Sentence Transformers**
    - Optimized for semantic similarity
    - Good for most RAG systems
2. **OpenAI / Proprietary Embeddings**
    - Large, high-quality
    - General purpose
3. **Domain-Specific Embeddings**
    - Trained on legal, medical, finance data
    - Better retrieval in niche domains

---

## Where Embeddings Are Stored

**Vector Databases:**

- Pinecone
- Weaviate
- Milvus
- FAISS
- Qdrant

They support:

- ANN (Approximate Nearest Neighbor)
- HNSW indexing
- Hybrid search (BM25 + vector)

---

## Key Engineering Decisions in RAG Embeddings

This is where things get interesting.

1. **Chunk Size**
    - Too small → loses context
    - Too big → embedding becomes noisy
    - Typical sweet spot: 200–500 tokens with overlap.

2. **Embedding Model Choice**
    - Cheap model → faster, lower quality retrieval
    - High-quality model → better relevance, higher cost
    - Mismatch between embedding model & LLM can hurt answer quality.

3. **Dimensionality**
    - Higher dimension ≠ always better.
    - It increases:
      - Storage cost
      - Indexing complexity
      - Latency

4. **Normalization**
    - Often embeddings are L2-normalized for cosine similarity efficiency.
