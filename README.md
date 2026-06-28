# 🔬 Distributed Systems Lab Monorepo

Welcome to the **Distributed Systems Lab** monorepo! This repository is a technical showcase of high-scale, polyglot distributed systems architecture, advanced AI/LLM engineering (RAG, vector search, agentic workflows), and Data Structures & Algorithms (DSA).

---

## 🧭 Repository Navigation Map

| Component       | Description                                                | Links                                                                    |
| :-------------- | :--------------------------------------------------------- | :----------------------------------------------------------------------- |
| **`apps/`**     | User-facing frontend applications (Next.js Super-App)      | 📖 [Docs](./apps/README.md) · 🤖 [Agent Rules](./apps/AGENTS.md)         |
| **`services/`** | Polyglot backend microservices across 6 capability domains | 📖 [Docs](./services/README.md) · 🤖 [Agent Rules](./services/AGENTS.md) |
| **`packages/`** | Shared versioned `@yuvadevlab/` utility libraries          | 📖 [Docs](./packages/README.md) · 🤖 [Agent Rules](./packages/AGENTS.md) |
| **`infra/`**    | Docker Compose, Kubernetes manifests, and Terraform IaC    | 📖 [Docs](./infra/README.md) · 🤖 [Agent Rules](./infra/AGENTS.md)       |
| **`libs/`**     | Internal non-publishable domain and infrastructure helpers | 📖 [Docs](./libs/README.md) · 🤖 [Agent Rules](./libs/AGENTS.md)         |
| **`docs/`**     | Deep-dive architectural blueprints and service catalogs    | 📖 [Browse Docs](./docs/README.md)                                       |

---

## 🛠️ Tech Stack Overview

- **Core Runtimes**: Node.js v22+ (LTS), TypeScript 5.x (Strict), Python 3.12+
- **Frameworks**: Next.js 14+ (App Router), NestJS 10+, FastAPI (Python)
- **AI & Data Core**: PostgreSQL (`pgvector`, `pg_trgm`), LangChain, Ollama, Apache Kafka, Redis
- **Monorepo Tooling**: Nx v23+, pnpm v11.6+ workspaces

---

## 🚀 Quick Start Guide

```bash
# 1. Install dependencies
pnpm install

# 2. Start local infrastructure backing services (Postgres, Kafka, Redis)
docker-compose up -d

# 3. Launch Super-App frontend portal
pnpm nx run web-super-app:dev

# 4. Run tests across workspace
pnpm nx run-many -t test
```

---

## 🎓 AI Tutor & Mentorship Instructions

AI coding assistants pairing in this workspace adhere to strict guidelines outlined in **[`AGENTS.md`](./AGENTS.md)**. The AI assistant acts as an expert tutor while implementing code — explaining underlying Data Structures & Algorithms, Big-O time/space complexity, distributed system design trade-offs, and AI/LLM engineering concepts.
