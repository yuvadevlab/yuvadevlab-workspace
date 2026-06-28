# Project 20: Unified Super-App (Final Integration)

The Capstone Masterpiece.

## 📁 Folder-Level Architecture

The shell that ties everything together.

```text
apps/20-super-app/
├── shell-nextjs/                 # The Micro-Frontend Host
│   ├── app/
│   │   ├── layout.tsx            # Shared Nav, Sidebar, Auth State
│   │   └── pages/                # Dynamic route loaders
│   ├── components/
│   │   └── RemoteModule.tsx      # The Module Federation loader
│   └── webpack.config.js         # Module Federation setup
│
├── gateway-config/               # Final Nginx/Gateway mapping
│   └── nginx.conf
│
└── package.json
```

---

# 📄 Engineering Specification (`docs/batch-4/project-20-super-app.md`)

## 1. Purpose & Problem Statement

The final goal is to prove that 20 separate repos can act as one single product.

Instead of a giant monolith, we use Micro-Frontends to load different apps into a single shell.

---

## 2. Tech Stack & Justification

### Module Federation (Webpack 5)

The "Magic" that allows one Next.js app to import a component from another Next.js app at runtime via a URL, without needing an NPM install.

### Nginx

Acts as the L7 Load Balancer to route traffic to the correct micro-frontend.

---

## 3. Design Patterns & Application

### BFF (Backend for Frontend)

The API Gateway acts as the BFF, aggregating data from multiple services into a single response for the Super-App.

### Composite UI Pattern

The shell manages the "Global State" (User session, Theme), while sub-apps manage their "Local State."

---

## 4. Detailed Design

### The Federation Map

```text
/shop  → Load ecommerce-platform remote
/chat  → Load chat-notification remote
/ai    → Load doc-intelligence remote
```

---

## 5. Core Logic Flow

```text
User visits /shop
          ↓
    Super-App Shell
          ↓
   Check SSO Session
          ↓
Fetch Remote JS from
 E-commerce Server
          ↓
 Mount Component
      in Shell
          ↓
Request data via
   API Gateway
```

---

## 6. E2E Expectation

```text
User logs into Super-App
            ↓
Shared Authentication Created
            ↓
Navigate to AI Bot
            ↓
Navigate to Shopping Cart
            ↓
No Full Page Reload
            ↓
Shared Theme & Session
            ↓
Centralized Logging
```

A user logs into the Super-App.

They navigate from the "AI Bot" to the "Shopping Cart" without a page reload.

The design system is consistent, the auth is shared, and the logs are all flowing into the Log Dashboard.
