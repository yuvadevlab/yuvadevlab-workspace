# Project 2: Auth Platform (Own SSO)

## 1. Purpose

A centralized Identity Provider (IdP) managing users and permissions.

---

## 2. Tech Stack & Justification

- NestJS
- PostgreSQL (Relational data)
- Redis (Session caching)
- Next.js (Admin Portal)

---

## 3. Design Patterns

### Repository Pattern

DB abstraction.

### Guard Pattern

Role-based access.

---

## 4. Folder Structure

```text
apps/02-sso-platform/
├── backend-api/
│   ├── src/
│   │   ├── auth/           # Login, MFA, Token Rotation logic
│   │   ├── users/          # Profile & User management
│   │   └── roles/          # RBAC & Permission Mapping
│   └── package.json
│
└── admin-portal/
    ├── app/                # User/Role management pages
    └── package.json
```

---

## 5. API Design

### Setup MFA

```http
POST /auth/mfa/setup
```

Returns QR Code.

### Verify MFA

```http
POST /auth/mfa/verify
```

Validates TOTP.

### Assign Role

```http
PATCH /admin/users/:id/role
```

Assigns new role.

---

## 6. Core Logic Flow

```text
User Register
      ↓
Verify Email
      ↓
Setup MFA
      ↓
Login
      ↓
Issue JWT
with Role Claims
```

---

## 7. E2E Expectation

```text
Admin Creates
Manager Role
      ↓
User X Assigned
Manager Role
      ↓
Access Granted
/admin/reports
      ↓
Access Denied
/admin/settings
```

Admin creates a "Manager" role.

User X is assigned the role and can now access the `/admin/reports` page but not the `/admin/settings` page.
