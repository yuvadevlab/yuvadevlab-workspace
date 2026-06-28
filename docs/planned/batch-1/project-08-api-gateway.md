# Project 8: API Gateway + Service Mesh

## 1. Purpose

The "Front Door" that handles routing, auth validation, and rate limiting.

---

## 2. Tech Stack & Justification

- Node.js/Express: High-concurrency I/O.
- Node.js cluster module: Essential for the Gateway. By spawning a process per CPU core, we multiply the throughput of the Gateway, ensuring that a single-threaded event loop doesn't become the bottleneck for 20 microservices.
- Consul: Dynamic Service Discovery.
- Redis: Global Rate Limiting.
- Opossum.

---

## 3. Design Patterns

### Chain of Responsibility

Middleware pipeline.

### Proxy Pattern

Masks internal IPs.

### Master-Worker Pattern

The Master process manages the network socket and load-balances requests to Worker processes.

---

## 4. Folder Structure

```text
apps/08-api-gateway/
├── src/
│   ├── middleware/
│   │   ├── correlation.ts     # Inject Correlation ID
│   │   ├── auth.ts            # JWT Signature check
│   │   └── ratelimit.ts       # Redis-based limiting
│   │
│   ├── services/
│   │   ├── consul.service.ts  # Discovery logic
│   │   └── proxy.service.ts   # http-proxy implementation
│   │
│   └── index.ts
│
└── package.json
```

---

## 5. Detailed Design

### Cluster Logic

Upon startup, the app checks `cluster.isMaster`.

- If `true`, it spawns `os.cpus().length` workers.
- If `false`, it starts the Express server.

### Dynamic Routing

Uses Consul service discovery to dynamically resolve service instances and route requests to the correct destination.

---

## 6. API Design

### Gateway Status

```http
GET /gateway/status
```

Returns health of all Consul services.

### Reload Routes

```http
POST /gateway/reload
```

Hot-reloads `routes.json`.

---

## 7. Core Logic Flow

```text
Client Request
      ↓
Master Process
      ↓
Round-Robin Distribution
      ↓
Worker Process
      ↓
Middleware Chain
(Auth / Rate Limit / Circuit Breaker)
      ↓
Consul Lookup
      ↓
Proxy To Target Service
```

---

## 8. E2E Expectation

### Circuit Breaker Protection

```text
User Request
      ↓
API Gateway
      ↓
Order Service
Under Heavy Load
      ↓
Circuit Breaker Detects Failures
      ↓
Circuit Opens
      ↓
Gateway Returns 503
Immediately
      ↓
System Protected
From Cascading Failure
```

If the Order Service is under heavy load, the Gateway's Circuit Breaker trips, returning `503` instantly to protect the system from a total crash.

### Gateway Scalability Validation

```text
Run Gateway
      ↓
8-Core Machine
      ↓
Execute k6 Load Test
      ↓
Master Process Distributes Requests
Across Workers
      ↓
CPU Utilization Spread
Across All 8 Cores
      ↓
No Single-Core Bottleneck
```

Run the Gateway on an 8-core machine. Use a load-testing tool (k6). Verify that CPU usage is spread across all 8 cores equally, rather than 100% on one core and 0% on others.
