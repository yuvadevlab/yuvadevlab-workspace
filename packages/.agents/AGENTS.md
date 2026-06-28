# 📦 AGENTS.md — Shared Packages Component Guidelines

This folder contains versioned, publishable shared packages under the `@yuvadevlab/` scope.

---

## 🧭 Packages Inventory & Hierarchy

| Package                               | Purpose                                   | Dependencies Allowed      |
| :------------------------------------ | :---------------------------------------- | :------------------------ |
| `configs`                             | Monorepo tsconfig, eslint, prettier bases | None                      |
| `validation`                          | Shared Zod / Pydantic schemas             | `configs`                 |
| `logger`                              | Standardized structured logging           | `configs`                 |
| `http-client`                         | Resilient Axios / fetch wrapper           | `logger`                  |
| `worker-pool`                         | Multiprocess / thread pool utilities      | `logger`                  |
| `auth` (`auth-client`, `auth-server`) | JWT validation & SSO integration          | `http-client`, `logger`   |
| `event-schemas`                       | Kafka topic & message contracts           | `validation`              |
| `kafka-client`                        | Kafka pub/sub wrapper                     | `logger`, `event-schemas` |
| `design-system`                       | Shared UI components & design tokens      | `configs`                 |
| `testing`                             | Mock utilities & test runners             | All                       |

---

## 📏 Standards & Rules for Packages

1. **Zero Circular Dependencies**: Shared packages MUST NEVER import code from `apps/` or `services/`.
2. **Explicit Exports**: All public functionality must be exported via clear entrypoints defined in `package.json` (`exports` field). Avoid exporting internal implementation details.
3. **Type Strictness**: Always use explicit types for public function signatures and exported classes.
4. **Versioning**: Use Changesets (`pnpm changeset`) when updating package APIs to ensure SemVer compliance.
5. **Pedagogical Mandate**: Act as a DSA & Architecture Tutor when implementing utility packages (explain underlying data structures, concurrency primitives like semaphores, queues, and complexity bounds).

---

## 💻 Commands

```bash
# Test package
pnpm nx test <package-name>

# Build package
pnpm nx build <package-name>
```
