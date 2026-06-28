# 📦 Shared Packages (`packages/`)

This directory contains versioned, publishable shared libraries published under the `@yuvadevlab/` scope.

---

## 🧭 Packages Catalog

- **`@yuvadevlab/configs`**: Standardized tsconfig, ESLint, and Prettier rules.
- **`@yuvadevlab/validation`**: Cross-language Zod and Pydantic schema contracts.
- **`@yuvadevlab/logger`**: Structured JSON logging and observability primitives.
- **`@yuvadevlab/http-client`**: Resilient HTTP client with retry logic and circuit breakers.
- **`@yuvadevlab/worker-pool`**: Multiprocess ClusterManager, thread executors, and concurrency semaphores.
- **`@yuvadevlab/auth`**: SSO client redirect helpers (`auth-client`) and server JWT verifiers (`auth-server`).
- **`@yuvadevlab/event-schemas`**: Shared Kafka event topics and message payload definitions.
- **`@yuvadevlab/kafka-client`**: High-performance Kafka consumer and producer wrappers.
- **`@yuvadevlab/design-system`**: Accessible React UI components and design tokens.
- **`@yuvadevlab/testing`**: Shared test runners, mock factories, and integration suites.

---

## 💻 Commands

```bash
# Build a shared package
pnpm nx build <package-name>

# Run package tests
pnpm nx test <package-name>
```
