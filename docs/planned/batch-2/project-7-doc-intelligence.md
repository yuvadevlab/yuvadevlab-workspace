# Project 7: Document Intelligence SaaS (RAG)

## 📁 Folder-Level Architecture

This is a full SaaS product with a frontend, a management API, and a heavy ML worker.

```text
apps/07-doc-intelligence/
├── frontend-nextjs/             # User Dashboard & Chat UI
│   ├── app/                     # Next.js App Router
│   ├── components/              # Chat bubbles, File uploaders
│   └── hooks/                   # useStreamingResponse
├── api-nestjs/                  # SaaS Management & Auth
│   ├── src/
│   │   ├── tenant/              # Tenant isolation logic
│   │   ├── billing/             # Stripe integration
│   │   └── document/            # Metadata management
│   └── package.json
├── ml-worker-python/            # The Heavy Lifting (RAG)
│   ├── core/
│   │   ├── indexer.py           # LlamaIndex pipeline
│   │   ├── query_engine.py      # Hybrid Search logic
│   │   └── parser.py            # PDF/Docx extraction
│   └── main.py
└── infra/
    └── s3-bucket-config.json    # S3 Lifecycle & Permissions
```

---

# 📄 Engineering Specification (`docs/batch-2/project-07-doc-intelligence.md`)

## 1. Purpose & Problem Statement

Standard RAG systems fail on large documents because they lose context. This project implements Hierarchical Indexing (Parent-Child) and Multi-tenancy, allowing different companies to upload documents while ensuring their data is strictly isolated.

---

## 2. Tech Stack & Justification

### LlamaIndex

Chosen over LangChain for this project because of its superior Recursive Retrieval and NodePostprocessor capabilities, which are better for complex PDFs.

### AWS S3

Used for binary storage. Pre-signed URLs are used so the browser uploads directly to S3, bypassing the server to prevent memory overflows.

### PostgreSQL RLS (Row-Level Security)

The "Gold Standard" for SaaS. Every query automatically appends:

```sql
WHERE tenant_id = '...'
```

at the DB engine level, making it impossible for one tenant to see another's data.

### FastAPI SSE

Server-Sent Events are used to stream the LLM's answer token-by-token for a "ChatGPT-like" experience.

---

## 3. Design Patterns & Application

### Parent-Child Chunking Pattern

Documents are split into large "Parent" chunks (for context) and small "Child" chunks (for precise vector search). When a child is found, the parent is fed to the LLM.

### Strategy Pattern

Different parsers are used based on MIME type (`PDFParser`, `DocxParser`, `HtmlParser`).

---

## 4. Detailed Design

### Indexing Pipeline

```text
S3 Trigger → Text Extraction → Recursive Chunking → Embedding → pgvector
```

### Tenant Isolation

The NestJS API injects the `tenant_id` into the Postgres session via:

```sql
SET app.current_tenant_id = '...'
```

before every request.

---

## 5. API & Route Design

### Upload Document

```http
POST /docs/upload
```

Returns an S3 pre-signed URL.

### Trigger Indexing

```http
POST /docs/index
```

Triggers the LlamaIndex pipeline.

### Query Documents

```http
POST /chat/query
```

Streams the response via SSE.

---

## 6. Core Logic Flow

```text
User Uploads PDF
        ↓
        S3
        ↓
     ML Worker
        ↓
Hierarchical Indexing
        ↓
     pgvector

User asks Question
        ↓
Hybrid Search (Vector + Keyword)
        ↓
Parent Context Retrieval
        ↓
    LLM Synthesis
        ↓
     SSE Stream
```

---

## 7. E2E Expectation

A user uploads a 50-page manual. They ask a question about a specific detail on page 42. The system retrieves the small child chunk from page 42, pulls the rest of the page (Parent chunk) for context, and answers accurately with a citation.
