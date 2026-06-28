# 🌐 Applications (`apps/`)

This directory contains user-facing frontend applications and deployment targets within the **Distributed Systems Lab**.

---

## 🧭 Directory Map

- **[`web/super-app`](./web)**: The central Next.js portal unifying all lab microservices into a single user interface.

---

## 🛠️ Technology Stack & Standards

- **Framework**: Next.js 14+ (App Router)
- **UI & Components**: Sourced exclusively from `@yuvadevlab/design-system`
- **Authentication**: Single Sign-On via `@yuvadevlab/auth-client`

---

## 💻 Commands

```bash
# Start Super-App development server
pnpm nx run web-super-app:dev

# Build production bundle
pnpm nx run web-super-app:build
```
