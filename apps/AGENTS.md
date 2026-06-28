# 🌐 AGENTS.md — User Applications Component Guidelines

This folder contains user-facing applications and deployment targets, starting with `web/super-app`.

---

## 🧭 App Architecture

- **`web/super-app`**: Central Next.js portal unifying all lab microservices into a coherent user interface.

---

## 📏 Application Rules & Design System

1. **Design System Mandate**: Always import UI primitives, layout containers, and styling tokens directly from `@yourorg/design-system`. Avoid inline custom styling or ad-hoc Tailwind classes unless requested.
2. **Authentication Flow**: Use `@yourorg/auth-client` to handle OAuth2 redirects to `sso` (Project 02) and store returned JWTs in `httpOnly` cookies.
3. **API Interactions**: All calls to downstream microservices must route through the `api-gateway` (`Project 08`). Never hardcode direct backend service IPs/URLs in frontend components.
4. **App Router Conventions**: Follow Next.js 14 App Router standards (use Server Components by default; add `'use client'` only when statefulness or browser APIs are required).

---

## 💻 Commands

```bash
# Start Super-App development server
pnpm nx run web-super-app:dev

# Build production bundle
pnpm nx run web-super-app:build
```
