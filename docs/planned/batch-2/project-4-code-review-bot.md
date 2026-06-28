# Project 4: AI-Powered Code Review Bot

## 📁 Folder-Level Architecture

Since this requires both a fast webhook receiver (Node.js) and a heavy ML pipeline (Python), this is a multi-service repo.

```text
apps/04-code-review-bot/
├── gateway-node/                # Fast webhook receiver
│   ├── src/
│   │   ├── controllers/         # GitHub webhook handlers
│   │   ├── services/            # Kafka producer logic
│   │   ├── middleware/          # HMAC Signature validation
│   │   └── index.ts
│   ├── package.json
│   └── Dockerfile
├── ai-service-python/           # The RAG & LLM Logic
│   ├── app/
│   │   ├── api/                 # FastAPI endpoints
│   │   ├── core/                # LLM prompts & config
│   │   ├── services/
│   │   │   ├── chunker.py       # AST-based code splitting
│   │   │   ├── embedder.py      # Sentence-transformer logic
│   │   │   └── retriever.py     # pgvector search
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
└── infra/
    └── pgvector-init.sql        # Database schema for vectors
```

---

# 📄 Engineering Specification (`docs/batch-2/project-04-code-review-bot.md`)

## 1. Purpose & Problem Statement

Generic AI reviews are too broad. This project implements a RAG (Retrieval-Augmented Generation) pipeline that indexes the project's existing codebase. The bot doesn't just check for syntax; it checks if the PR follows the specific architectural patterns used elsewhere in the same repository.

---

## 2. Tech Stack & Justification

### Python/FastAPI

The industry standard for ML. FastAPI is used over Flask because of its native async support, which is critical when waiting for LLM responses.

### Node.js worker_threads

Used in the Node.js Gateway to handle the initial AST (Abstract Syntax Tree) parsing of large files. Parsing a 5,000-line file is CPU-intensive; doing it on the main thread would block the GitHub webhook response.

### pgvector (PostgreSQL)

Used instead of Pinecone/Milvus. Since the bot needs to filter by `file_path` or `commit_sha`, having vectors and metadata in one relational DB is more efficient than syncing two different databases.

### Ollama (Local LLM)

Used to ensure code privacy. Running CodeLlama locally means proprietary code never leaves the infrastructure.

### Kafka

GitHub webhooks can burst. Kafka buffers these requests so the Python AI service can process them at its own pace without timing out the GitHub request.

---

## 3. Design Patterns & Application

### Pipeline Pattern

The indexing process is a linear pipeline:

```text
Fetch Code → AST Chunking → Embedding → Upsert to DB
```

### Strategy Pattern

Different "Chunking Strategies" are used based on file extension (e.g., a `PythonChunker` uses AST, while a `MarkdownChunker` uses headers).

### CPU Offloading

Moves the "Heavy Parsing" stage from the main event loop to a separate worker thread.

---

## 4. Detailed Design

### The Worker Split

#### Main Thread

Handles HTTP request and Kafka communication.

#### Worker Thread

Executes the `tree-sitter` parsing logic to chunk the code.

### The Chunker

Uses the `tree-sitter` library to parse code into a syntax tree. It chunks code by function boundaries rather than character count, ensuring the LLM receives complete logical units.

### The Vector Store

Each row in pgvector stores:

- `embedding` (vector)
- `content` (text)
- `file_path`
- `start_line`
- `end_line`
- `commit_hash`

---

## 5. API & Route Design

### Gateway (Node)

```http
POST /webhooks/github
```

Validates HMAC → Pushes to Kafka topic `pr-events`.

### AI Service (Python)

```http
POST /review/generate
```

Receives PR diff → Queries pgvector → Streams review to GitHub API.

---

## 6. Core Logic Flow

```text
GitHub Webhook
        ↓
Node Gateway
        ↓
Spawn Worker Thread
        ↓
Parse AST
        ↓
Push Chunked Code To Kafka
        ↓
Python AI Service
        ↓
LLM Review
```

---

## 7. E2E Expectation

### Pattern-Aware Review

When a developer pushes code that violates a pattern (e.g., using a raw DB query instead of a Repository), the bot finds a similar file where the Repository pattern was used and comments:

> "In UserRepository.ts, we use the Repository pattern; please apply the same here."

### Large PR Handling

Push a massive PR with a 20,000-line file. The Gateway responds `200 OK` to GitHub in `<100ms` because the heavy parsing is happening in a background worker thread.
