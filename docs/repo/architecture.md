# 🏗️ Distributed Systems Lab: Architecture Overview

This repository is a technical showcase of a high-scale, polyglot distributed system. It is designed to demonstrate the integration of various cloud-native patterns and technologies.

## 🗺️ Workspace Map

The project follows a capability-based monorepo structure:

- **`apps/`**: User-facing deployment targets.
  - `web/super-app`: The central portal demonstrating all technical capabilities.
- **`services/`**: Backend microservices organized by domain.
  - `platform/`: Core infrastructure (SSO, API Gateway).
  - `intelligence/`: AI/ML services (RAG, Semantic Search).
  - `automation/`: Task-based services (Web Scrapers).
  - `experience/`: Business logic (E-commerce, Collaboration).
  - `media/`: High-compute services (Video Streaming, Rendering).
  - `operations/`: Platform engineering (CI/CD, Auto-healing).
- **`packages/`**: Versioned, publishable shared utilities (@yuvadevlab/).
  - Includes the `design-system` and core utilities like `auth-client`, `logger`, and `kafka-client`.
- **`libs/`**: Internal shared logic and domain types.
- **`infra/`**: Infrastructure as Code (Terraform, K8s, Docker).

## 🔄 Integration Flow

All services communicate via a combination of:

1. **Synchronous**: REST/gRPC via the `api-gateway`.
2. **Asynchronous**: Event-driven architecture using `kafka-client` and shared `event-schemas`.
3. **Shared State**: Redis for caching and PostgreSQL/MongoDB for persistence.
