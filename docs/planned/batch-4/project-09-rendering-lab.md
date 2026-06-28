# Project 9: Multi-Rendering Next.js Lab

**Purpose:** Mastering the Frontend Delivery Layer.

## 📁 Folder-Level Architecture

This project is designed as a "Living Textbook" of rendering strategies.

```text
apps/09-rendering-lab/
├── app/
│   ├── (marketing)/             # SSG: Static Site Generation
│   │   └── page.tsx             # Pre-rendered at build time
│   │
│   ├── (dashboard)/             # SSR: Server Side Rendering
│   │   └── profile/page.tsx     # Dynamic, per-user data
│   │
│   ├── (catalog)/               # ISR: Incremental Static Regeneration
│   │   └── product/[id]/page.tsx # Revalidated every 60s
│   │
│   ├── (interactive)/           # CSR: Client Side Rendering
│   │   └── canvas/page.tsx      # Heavy JS, no SEO needed
│   │
│   └── (streaming)/             # PPR: Partial Prerendering
│       └── feed/page.tsx        # Static shell + Streaming dynamic content
│
├── components/
│   ├── SuspenseBoundaries/      # Custom loading skeletons
│   └── ServerComponents/        # Data fetching logic
│
└── package.json
```

---

# 📄 Engineering Specification (`docs/batch-4/project-09-rendering-lab.md`)

## 1. Purpose & Problem Statement

Choosing the wrong rendering method leads to either slow Page Load (SSR) or stale data (SSG).

This project serves as a benchmark to determine exactly when to use each strategy based on SEO and Data Volatility.

---

## 2. Tech Stack & Justification

### Next.js 14 (App Router)

Essential for React Server Components (RSC).

RSCs allow us to fetch data on the server and send zero JavaScript to the client for static parts of the page.

### Edge Runtime

Used for the marketing pages to ensure they are served from the nearest global CDN node, reducing Time to First Byte (TTFB).

---

## 3. Design Patterns & Application

### Container/Presenter Pattern

Separating the "Server Component" (Data fetcher) from the "Client Component" (Interactive UI).

### Skeleton Screen Pattern

Implemented via `loading.tsx` and `<Suspense>` to prevent layout shift (CLS) while data streams in.

---

## 4. Detailed Design

### SSG Path

`generateStaticParams` is used to pre-render 1,000+ pages at build time.

### ISR Path

```ts
export const revalidate = 60;
```

Tells Next.js to serve the cached page but trigger a background update every minute.

### PPR Path

The page shell is static, but the "User Profile" section is wrapped in `<Suspense>`, allowing the rest of the page to load instantly while the profile streams in.

---

## 5. API Design

Since this is a rendering lab, the "API" is the interaction between the Page and the Server Component.

```ts
async function getData();
```

Called directly in the server component.

---

## 6. Core Logic Flow

```text
User Request
      ↓
Next.js Router
      ↓
 Check Cache
      ↓
If ISR (Expired)
      ↓
Background Revalidate
      ↓
Stream HTML to Browser
```

---

## 7. E2E Expectation

### Marketing Page (SSG)

```text
User Request
      ↓
Static HTML Served
      ↓
Page loads in <200ms
```

### Product Page (ISR)

```text
Product Updated
      ↓
Cache Expires
      ↓
Background Revalidation
      ↓
New Price Visible
```

Without a full redeploy.

### Feed Page (Streaming)

```text
User Opens Feed
      ↓
Static Shell Rendered
      ↓
Skeleton Displayed
      ↓
Data Streams In
      ↓
Content Replaces Skeleton
```

The "Feed" page shows a skeleton immediately and fills in data as it arrives (Streaming).
