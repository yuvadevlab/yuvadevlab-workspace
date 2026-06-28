# Project 17: Multi-Tenant SaaS Boilerplate

The "Business Logic" Foundation.

## 📁 Folder-Level Architecture

Designed for maximum reusability for any B2B product.

```text
apps/17-saas-boilerplate/
├── backend-nestjs/
│   ├── src/
│   │   ├── tenancy/                  # Postgres RLS Logic
│   │   │   ├── tenancy.guard.ts
│   │   │   └── tenant.context.ts
│   │   ├── billing/                  # Stripe Subscription logic
│   │   ├── features/                 # Feature Flag system
│   │   └── audit/                    # Append-only audit logs
│   └── package.json
│
├── frontend-nextjs/
│   ├── app/
│   │   ├── admin/                    # Tenant management
│   │   └── settings/                 # Billing & Team management
│   └── package.json
│
└── infra/
    └── postgres-rls-policies.sql     # SQL policies for data isolation
```

---

# 📄 Engineering Specification (`docs/batch-4/project-17-saas-boilerplate.md`)

## 1. Purpose & Problem Statement

In a B2B SaaS, the biggest risk is "Data Leakage" (Tenant A seeing Tenant B's data).

This project implements Database-Level Isolation and a billing engine.

---

## 2. Tech Stack & Justification

### Postgres RLS (Row-Level Security)

Instead of adding:

```sql
WHERE tenant_id = X
```

to every query, RLS is enforced by the DB engine.

If a developer forgets the WHERE clause, the DB still blocks the data.

### Stripe

The industry standard for subscription billing.

---

## 3. Design Patterns & Application

### Repository Pattern

The repository automatically injects the current `tenant_id` from the request context into all queries.

### Decorator Pattern

Used for Feature Flags.

```ts
@RequireFeature('advanced-analytics')
```

Applied on a controller method.

---

## 4. Detailed Design

### Tenant Isolation Flow

```text
Request
    ↓
Gateway
    ↓
Extract tenant_id from JWT
    ↓
NestJS
    ↓
DB Connection
    ↓
SET app.current_tenant_id = 'T1'
    ↓
Query
```

### Billing Logic

A "Metered Billing" system where the user is charged based on their usage.

Example:

```text
$0.01 per AI query
```

---

## 5. API Design

### Create Subscription

```http
POST /billing/subscribe
```

Creates a Stripe Checkout session.

### Tenant Usage

```http
GET /admin/tenant/usage
```

Returns total documents/users consumed by a tenant.

---

## 6. E2E Expectation

```text
User from Company A
          ↓
Attempts direct access to
Company B document ID
          ↓
Request reaches API
          ↓
tenant_id extracted from JWT
          ↓
RLS policy applied
          ↓
Database filters record
          ↓
404 Not Found
```

A user from "Company A" tries to access a document via a direct ID belonging to "Company B."

The database returns **"Not Found" (404)** even though the ID is correct, because the RLS policy blocks the access.
