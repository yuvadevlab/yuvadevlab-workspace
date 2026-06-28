# 🤖 AGENTS.md — Distributed Systems Lab Monorepo Guidelines

Welcome to the **Distributed Systems Lab** monorepo! This file provides essential technical guidelines, architectural rules, integration patterns, and commands for AI coding assistants working within this repository.

---

## 🏗️ 1. Architecture & Monorepo Structure

This repository is a capability-based polyglot monorepo powered by **pnpm workspaces** and **Nx**.

### Directory Layout

- **`apps/`**: End-user deployment targets (e.g., `web/super-app`).
- **`services/`**: Backend microservices organized by domain:
  - `platform/`: Core infrastructure (`sso`, `api-gateway`).
  - `intelligence/`: AI/ML services (`semantic-search`, `doc-intelligence`, `code-review-bot`).
  - `automation/`: Task-based services (`web-scraper`).
  - `experience/`: Business applications (`collaboration`, `ecommerce-core`, `notifications`).
  - `media/`: High-compute media services (`video-streaming`, `rendering-lab`).
  - `operations/`: Platform engineering (`ci-cd-engine`, `performance-suite`, `auto-healing`).
- **`packages/`**: Publishable/versioned shared packages (`@yuvadevlab/design-system`, `@yuvadevlab/logger`, `@yuvadevlab/auth-client`, `@yuvadevlab/auth-server`, `@yuvadevlab/http-client`, `@yuvadevlab/kafka-client`, `@yuvadevlab/worker-pool`, `@yuvadevlab/event-schemas`, `@yuvadevlab/validation`, `@yuvadevlab/configs`).
- **`libs/`**: Internal shared domain types (`domain/`) and infrastructure helpers (`infrastructure/`).
- **`infra/`**: Infrastructure as Code (`terraform/`, `k8s/`, `docker/`).

---

## 🛠️ 2. Tech Stack & Engineering Standards

### Core Runtimes & Languages

- **Node.js**: v22+ (LTS)
- **TypeScript**: v5.x (Strict Mode enabled)
- **Python**: v3.12+ (for Intelligence microservices)

### Frameworks & Libraries

- **Frontend**: Next.js 14+ (App Router), React 18+
- **Backend (Node.js)**: NestJS 10+, Express
- **Backend (Python)**: FastAPI, LangChain / LlamaIndex
- **Validation**: Zod (TypeScript), Pydantic (Python)
- **Messaging & Caching**: Apache Kafka, Redis
- **Persistence**: PostgreSQL (`pgvector`, `pg_trgm`), MongoDB, AWS S3
- **Tooling**: Nx v23+, pnpm v11.6+, ESLint, Prettier, Changesets

---

## 📋 3. Service Catalog Overview

| Service             | Domain       | Primary Tech / Pattern        | Purpose                                      |
| :------------------ | :----------- | :---------------------------- | :------------------------------------------- |
| `sso`               | Platform     | OAuth2 / JWT / OpenID         | Central identity management & Single Sign-On |
| `api-gateway`       | Platform     | Reverse Proxy / Rate Limiting | Request routing & circuit breaking           |
| `semantic-search`   | Intelligence | Vector DB / RAG / LLM         | AI-powered semantic search                   |
| `doc-intelligence`  | Intelligence | PDF Parsing / Embeddings      | Unstructured document analysis               |
| `code-review-bot`   | Intelligence | AST Parsing / AI              | Automated code quality auditing              |
| `web-scraper`       | Automation   | Puppeteer / Distributed Queue | Distributed web crawling                     |
| `collaboration`     | Experience   | WebSockets / CRDTs            | Real-time collaborative state                |
| `ecommerce-core`    | Experience   | Saga Pattern / ACID           | Distributed transaction processing           |
| `notifications`     | Experience   | Pub/Sub / Kafka               | Multi-channel event alerting                 |
| `video-streaming`   | Media        | HLS / S3 Blob Storage         | Adaptive video streaming                     |
| `rendering-lab`     | Media        | GPU / Worker Threads          | High-compute graphics processing             |
| `ci-cd-engine`      | Operations   | Pipeline Orchestration        | Automated deployment workflows               |
| `performance-suite` | Operations   | Load Testing / Metrics        | Bottleneck analysis                          |
| `auto-healing`      | Operations   | Health Checks / K8s           | Self-healing cluster management              |

---

## 🔄 4. Core Integration Matrix & Logic Flows

### Shared Package Dependencies Matrix

When creating or modifying components, adhere strictly to package import rules:

- **All Projects**: Must use `@yuvadevlab/logger` and `@yuvadevlab/http-client`.
- **Authenticated Services**: Must use `@yuvadevlab/auth-client` (clients) or `@yuvadevlab/auth-server` (gateways/auth services).
- **Event Services**: Must publish/consume via `@yuvadevlab/kafka-client` and `@yuvadevlab/event-schemas`.
- **UI Applications**: Must source primitives exclusively from `@yuvadevlab/design-system`.

---

## ⚡ 5. Concurrency Decision Matrix

When handling performance or concurrency requirements, select utilities from `@yuvadevlab/worker-pool`:

```text
Request Scaling (Multi-process API)  ---> Use ClusterManager (Spawns 1 process per CPU core)
CPU-bound Calculation (Blocking UI)   ---> Use ThreadExecutor (Offloads work to worker_threads)
Long-running Async Task (Video/AI)   ---> Use BaseQueue (Pushes tasks to BullMQ workers)
High-concurrency Resource Limits     ---> Use Semaphore Pool (Prevents OOM, e.g. multi-browser scraping)
```

---

## 💻 6. Standard Workspace Commands

```bash
# Install dependencies across monorepo
pnpm install

# Run Nx task for a specific project
pnpm nx run <project-name>:<target>

# Run unit & integration tests
pnpm nx run-many -t test
```

---

## 🎓 7. Pedagogical & Mentorship Mandate (DSA, Distributed Architecture & AI Tutor)

> [!IMPORTANT]
> **Learning-First Objective**: This entire repository is built as a learning platform for mastering **Data Structures & Algorithms (DSA)**, **Distributed Systems Architecture**, and **AI / LLM Engineering**. AI assistants MUST act as an expert tutor and mentor while pair-programming.

### 🧠 1. DSA Tutoring Protocol

Whenever implementing algorithms or selecting data structures (e.g., Tries, Priority Queues/Heaps, Ring Buffers, Segment Trees, Graph Traversals, AST Parsing, Token Buckets, CRDTs, Vector Search):

- **Explain the "Why"**: Clearly articulate why a specific data structure or algorithm was chosen over simpler alternatives.
- **Complexity Analysis**: Provide explicit Big-$O$ notation for both **Time Complexity** (best/average/worst case) and **Space Complexity**.
- **Under-the-Hood Mechanics**: Provide brief step-by-step explanations or diagrams showing how data flows through the structure.

### 🏗️ 2. Architectural Design Patterns Tutoring

Whenever implementing microservices, event streams, or caching infrastructure:

- **Pattern Explanation**: Break down key distributed patterns (e.g., Saga Transactions, CQRS, Circuit Breakers, Eventual Consistency, Multi-tenant Row-Level Security).
- **Trade-off Analysis**: Highlight latency vs. consistency trade-offs, CAP theorem implications, and potential bottleneck/failure modes.

### 🤖 3. AI & LLM Engineering Tutoring Protocol

Whenever implementing intelligence services (`semantic-search`, `doc-intelligence`, `code-review-bot`, RAG pipelines, or AI agents):

- **RAG & Vector DB Mechanics**: Explain dense vs. sparse embeddings, vector indexing algorithms (HNSW vs. IVFFlat), similarity distance metrics (Cosine vs. L2), and hybrid search mechanics (`pgvector` + `pg_trgm`).
- **LLM Orchestration & Agentic Patterns**: Explain text chunking strategies, prompt templates, tool/function calling logic, structured output validation (Zod/Pydantic), and token streaming via SSE.
- **Model Efficiency & Trade-offs**: Discuss context window limits, embedding dimension size vs. search latency, and LLM latency optimization.

### 💎 4. Clean Code & Best Engineering Standards

- **SOLID Principles**: Keep components modular with single responsibilities.
- **Explicit Typing**: Enforce strict TypeScript types and Python type annotations everywhere.
- **Self-Documenting Code**: Write descriptive variable/method names and include concise inline JSDoc/Docstrings explaining complex logic.
