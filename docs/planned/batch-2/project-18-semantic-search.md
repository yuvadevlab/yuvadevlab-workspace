# Project 18: Semantic Search Engine

## 📁 Folder-Level Architecture

A data pipeline and a search API.

```text
apps/18-semantic-search/
├── ingestion-pipeline/          # Python pipeline to process data
│   ├── src/
│   │   ├── embedders/           # Sentence-Transformer logic
│   │   ├── indexer/             # pgvector + BM25 indexing
│   │   └── main.py
├── search-api/                  # FastAPI Search Engine
│   ├── src/
│   │   ├── retrieval/           # Hybrid search logic
│   │   ├── reranking/           # Cross-Encoder logic
│   │   └── main.py
└── search-ui-nextjs/            # User Interface
    ├── app/
    └── components/
```

---

# 📄 Engineering Specification (`docs/batch-2/project-18-semantic-search.md`)

## 1. Purpose & Problem Statement

Keyword search (BM25) fails when a user searches for "How to fix a car" but the document says "Automotive repair guide." This project implements Hybrid Search (combining meaning and keywords) and Reranking to achieve professional-grade search accuracy.

---

## 2. Tech Stack & Justification

### Sentence-Transformers (all-MiniLM-L6-v2)

A lightweight, high-performance model that turns text into a 384-dimension vector.

### pgvector + pg_trgm

`pgvector` handles the "meaning" (cosine similarity), while `pg_trgm` handles the "keywords" (trigram index).

### Cross-Encoders

Used for the "Reranking" stage. While cosine similarity is fast, a Cross-Encoder is significantly more accurate for the final top 10 results.

### FastAPI

High-performance async API to handle the search requests.

---

## 3. Design Patterns & Application

### RRF (Reciprocal Rank Fusion)

A mathematical pattern used to merge two different result sets (Vector results and Keyword results) into one unified ranked list.

### Pipeline Pattern

```text
Query → Embed → Retrieve → Rerank → Return
```

---

## 4. Detailed Design

### The Hybrid Pipeline

#### Dense Retrieval

Use pgvector to find results based on semantic meaning.

#### Sparse Retrieval

Use BM25/Trigram search to find exact keyword matches.

#### Fusion

Use RRF to combine the lists.

#### Reranking

Pass the top 20 results through a Cross-Encoder model to pick the absolute best top 5.

---

## 5. API Design

### Search Documents

```http
GET /search?q=query
```

Returns:

```json
{
  "results": [
    {
      "text": "string",
      "score": 0.95,
      "source": "string"
    }
  ],
  "total_time": "ms"
}
```

### Index Document

```http
POST /index/document
```

Ingests a new document into the vector store.

---

## 6. Core Logic Flow

```text
User Query
        ↓
Embedding Model
        ↓
pgvector Cosine Search
        +
Postgres Keyword Search
        ↓
     RRF Fusion
        ↓
Cross-Encoder Rerank
        ↓
     UI Result
```

---

## 7. E2E Expectation

Searching for "financial stability" should return a document about "money management" even if the word "stability" never appears in the text.
