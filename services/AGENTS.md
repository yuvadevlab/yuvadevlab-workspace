# ⚙️ AGENTS.md — Backend Services Component Guidelines

This folder contains backend microservices categorized by technical domain.

---

## 🧭 Microservices Domain Architecture

```text
services/
├── platform/      # SSO (Project 02), API Gateway (Project 08)
├── intelligence/  # Semantic Search (18), Doc Intelligence (07), Code Bot (04)
├── automation/    # Web Scraper (Project 12)
├── experience/    # Ecommerce Core (05), Collaboration (03), Notifications (10)
├── media/         # Video Streaming (16), Rendering Lab (09)
└── operations/    # CI/CD (11), Performance Suite (14), Auto-Healing (19)
```

---

## 📏 Microservice Architecture Standards

1. **Framework Choice**:
   - **TypeScript / Node.js**: NestJS 10+ for enterprise microservices; Express for lightweight proxy layers.
   - **Python**: FastAPI (v0.110+) for AI, ML, and data-heavy services (`intelligence/`, `automation/`).
2. **Authentication & Security**:
   - Verify JWT signatures using `@yuvadevlab/auth-server`.
   - Never accept unverified tenant IDs from request params; validate DB session state (e.g., `SET LOCAL app.current_tenant_id = ...`) in PostgreSQL connection pools.
3. **Event Communication**:
   - Publish and consume events exclusively using `@yuvadevlab/kafka-client`.
   - Validate event payloads against `@yuvadevlab/event-schemas` before processing.
4. **Error Handling & Circuit Breaking**:
   - Wrap inter-service REST calls in `@yuvadevlab/http-client` with exponential backoff and circuit breakers.
5. **Pedagogical & Tutoring Mandate**: When implementing microservices, actively teach the user advanced architectural patterns (Saga Pattern, Vector DB hybrid search, CRDTs, Rate-Limiting algorithms, AST parsing) and provide Big-$O$ complexity analysis.

---

## 💻 Commands

```bash
# Start a specific service (e.g., sso)
pnpm nx run sso:dev

# Run unit tests for a service
pnpm nx test sso
```
