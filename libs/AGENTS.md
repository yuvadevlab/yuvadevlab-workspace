# 📚 AGENTS.md — Internal Libraries Component Guidelines

This folder contains internal, non-publishable shared domain logic and infrastructure helpers.

---

## 🧭 Directory Layout

- **`domain/`**: Enterprise core entities, value objects, and domain interface specifications.
- **`infrastructure/`**: Database repositories, ORM mappers, and internal utility wrappers.

---

## 📏 Rules for Internal Libs

1. **Internal Scope**: Code in `libs/` is intended for internal monorepo reuse and should not be published to an external package registry.
2. **Domain Purity**: Code inside `domain/` must remain pure TypeScript business logic without coupling to web frameworks (NestJS/Express/FastAPI) or UI components.
