# ⚙️ Backend Microservices (`services/`)

This directory contains polyglot backend microservices organized into capability domains.

---

## 🧭 Microservices Domains

| Domain              | Services                                                 | Primary Tech                              | Purpose                                                       |
| :------------------ | :------------------------------------------------------- | :---------------------------------------- | :------------------------------------------------------------ |
| **`platform/`**     | `sso`, `api-gateway`                                     | NestJS, Express                           | Central OAuth2 identity and request proxy routing             |
| **`intelligence/`** | `semantic-search`, `doc-intelligence`, `code-review-bot` | FastAPI, Python 3.12, LangChain, pgvector | AI RAG pipelines, vector search, and document analysis        |
| **`automation/`**   | `web-scraper`                                            | Puppeteer, Distributed Queues             | Scalable web crawling and data extraction                     |
| **`experience/`**   | `ecommerce-core`, `collaboration`, `notifications`       | NestJS, WebSockets, Kafka                 | Transaction processing, CRDT state, multi-channel alerting    |
| **`media/`**        | `video-streaming`, `rendering-lab`                       | HLS, GPU worker threads                   | Adaptive media streaming and heavy compute tasks              |
| **`operations/`**   | `ci-cd-engine`, `performance-suite`, `auto-healing`      | Node.js, Go/Python                        | Build orchestration, load testing, self-healing K8s operators |

---

## 💻 Commands

```bash
# Start a specific microservice
pnpm nx run <service-name>:dev

# Run tests for a microservice
pnpm nx test <service-name>
```
