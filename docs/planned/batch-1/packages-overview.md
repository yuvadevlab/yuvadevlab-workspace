# The Shared Utility Ecosystem (@yourorg/)

## 🗺️ Architecture Overview

All packages reside in `/packages` and are treated as internal dependencies.

They are published to a private registry and versioned using Semantic Versioning (SemVer).

---

# 📂 Package Directory Structure

```text
packages/
├── auth-client/        # Frontend: Token management, Interceptors
├── auth-server/        # Backend: Guards, Strategies, Decorators
├── logger/             # Observability: Pino + AsyncLocalStorage
├── http-client/        # Resilience: Axios + Opossum (Circuit Breaker)
├── kafka-client/       # Messaging: KafkaJS + Zod Schema Enforcement
├── validation/         # Type Safety: Shared Zod Schemas
├── config/             # Environment: Type-safe env loader
├── testing/            # QA: MSW, Faker, Test Factories
└── event-schemas/      # Contracts: Shared Event Interfaces (Avro/TS)
```

---

# 🛠️ Detailed Package Specifications

## 1. @yourorg/auth-client (Frontend Identity Logic)

### Purpose

To standardize how every frontend app (Next.js, React) interacts with the SSO server.

### Key Logic

#### Token Manager

Handles storage of Access/Refresh tokens in httpOnly cookies.

#### Axios Interceptor

A "Silent Refresh" mechanism.

If a request returns `401`, the interceptor:

```text
Pause all outgoing requests
        ↓
Call /auth/refresh
        ↓
Update token
        ↓
Retry original request
        ↓
User sees no flicker
```

#### Auth Hooks

```ts
useAuth();
usePermissions();
useUser();
```

Hooks for easy access to session state.

### Justification

Prevents every frontend developer from writing their own token-refresh logic, which is a common source of security bugs.

---

## 2. @yourorg/auth-server (Backend Identity Logic)

### Purpose

To provide "Plug-and-Play" security for any NestJS/Express microservice.

### Key Logic

#### JWT Guards

Pre-built guards that verify:

- JWT signature
- Token expiration

using the SSO Public Key.

#### Permission Decorators

```ts
@RequirePermission('order:write')
```

Used to declaratively protect routes.

#### Passport Strategies

Pre-configured strategies for:

- JWT
- OAuth2

### Justification

Ensures that "Authorization" is handled identically across 20 services.

Changing the token algorithm in this package updates security for the entire ecosystem.

---

## 3. @yourorg/logger (Structured Observability)

### Purpose

To implement distributed tracing across microservices.

### Key Logic

#### Correlation ID

Uses AsyncLocalStorage to attach a `correlationId` to every log statement automatically.

#### Pino Wrapper

Implements high-performance JSON logging.

#### Log Levels

Strictly enforces:

```text
trace
debug
info
warn
error
fatal
```

### Justification

Standard `console.log` is useless in microservices.

This allows you to search a single ID in the Log Analytics project and see the request flow across 5 different services.

---

## 4. @yourorg/http-client (Resilient Communication)

### Purpose

To prevent "Cascading Failures" when one service calls another.

### Key Logic

#### Circuit Breaker (Opossum)

Wraps every request.

If the target service fails `$N$` times:

```text
Circuit Opens
      ↓
Return 503 Immediately
      ↓
Prevent Event Loop Hanging
```

#### Retry Logic

Implements Exponential Backoff with Jitter.

Example:

```text
Retry #1 → 100ms
Retry #2 → 200ms
Retry #3 → 400ms
+ Random Offset
```

This avoids DOS-ing a recovering service.

### Justification

In a distributed system, the "Network is Unreliable."

This package makes inter-service communication "Fault Tolerant."

---

## 5. @yourorg/kafka-client (Typed Event Bus)

### Purpose

To eliminate "Schema Drift" in event-driven architecture.

### Key Logic

#### Zod Integration

Every message published must be validated against a Zod schema.

If validation fails:

```text
Producer
   ↓
Validation Failure
   ↓
Reject Publish
```

The error occurs at the Producer level, not the Consumer level.

#### Dead Letter Queue (DLQ)

Automatically routes failed messages to a `.dlq` topic for manual inspection.

### Justification

Without this, a change in the `OrderCreated` event in the Order service could crash the Inventory service silently.

---

## 6. @yourorg/validation (Shared Type Safety)

### Purpose

The single source of truth for all data shapes.

### Key Logic

#### Domain Schemas

Centralized Zod definitions for:

```text
User
Order
Address
PaymentPayload
```

#### Custom Validators

Reusable validation logic for:

- Emails
- Phone Numbers
- UUIDs

### Justification

Allows you to share the exact same validation logic between:

```text
Frontend Form Validation
            ↕
Backend API Validation
```

---

## 7. @yourorg/config (Safe Environment Loading)

### Purpose

To prevent "Cold Start" crashes due to missing environment variables.

### Key Logic

#### Strict Validation

Uses Zod to validate `.env` files on startup.

Example:

```text
DATABASE_URL Missing
          ↓
Process Exit
          ↓
Clear Error Message
```

#### Type Casting

Automatically converts:

```env
PORT=3000
```

from:

```text
"3000" (string)
```

to:

```text
3000 (number)
```

### Justification

Prevents the "It works on my machine" problem.

---

## 8. @yourorg/testing (QA Toolset)

### Purpose

To make testing predictable and fast.

### Key Logic

#### MSW (Mock Service Worker)

Provides a shared set of API mocks so frontend developers can work without the backend being ready.

#### Faker Factories

Standardized functions to generate:

```text
Fake User
Fake Order
Fake Payment
Fake Address
```

for unit and integration tests.

### Justification

Ensures that tests across all 20 projects use the same data shapes and mocking strategies.

---

## 9. @yourorg/event-schemas (The Contract Layer)

### Purpose

The "API Documentation" for Kafka.

### Key Logic

#### TS Interfaces

Pure TypeScript definitions of every event in the system.

Example:

```ts
IOrderPlacedEvent;
```

#### Avro Schemas (Optional)

Binary schemas for high-performance serialization.

### Justification

Acts as the "Contract" between teams.

If the Order team changes an event:

```text
Order Team Changes Event
            ↓
TypeScript Compilation Error
            ↓
Inventory Team Immediately Knows
```

This prevents silent breaking changes across services.

---

## 10. @yourorg/worker-pool (Concurrency & Workload Management)

### Purpose

To standardize concurrency management across the ecosystem and eliminate repeated implementations of:

- Node.js Clustering
- Worker Threads
- Distributed Queues

Different workloads require different execution models:

```text
API Requests
      ↓
Cluster Processes

CPU-Intensive Tasks
      ↓
Worker Threads

Distributed Background Jobs
      ↓
BullMQ Queues
```

This package provides a unified abstraction layer for all three patterns.

---

### Tech Stack & Justification

#### Node.js cluster module

Used for vertical scaling of API servers.

Allows a single application to utilize all CPU cores instead of being limited to one Node.js event loop.

#### Node.js worker_threads

Used for CPU-intensive workloads that would otherwise block the main thread.

Examples:

- AST Parsing
- Hash Generation
- Image Processing
- Data Transformation

#### BullMQ

Used for distributed task execution across multiple machines.

Ideal for:

- Video Transcoding
- AI Processing
- Large Crawling Jobs
- Notification Processing

#### Zod

Validates job payloads before execution.

Prevents worker crashes caused by malformed input.

---

### Design Patterns & Application

#### Worker Pool Pattern

Manages a fixed number of workers.

```text
Task
  ↓
Worker Pool
  ↓
Available Worker
  ↓
Execution
```

Prevents:

- RAM exhaustion
- CPU oversubscription
- Resource starvation

---

#### Producer-Consumer Pattern

Decouples request submission from execution.

```text
Producer
   ↓
Queue
   ↓
Consumer
```

Used heavily with BullMQ.

---

#### Strategy Pattern

Allows selecting the appropriate execution strategy.

```text
CPU Task
   ↓
runInThread()

Distributed Task
   ↓
pushToQueue()

API Scaling
   ↓
createCluster()
```

---

### Key Components

#### ClusterManager

Automatically detects:

```ts
os.cpus().length;
```

and spawns worker processes.

Responsibilities:

- Worker creation
- Worker restart on crash
- Graceful shutdown
- Process monitoring

---

#### ThreadExecutor

Wrapper around Node.js worker threads.

Responsibilities:

- Spawn worker
- Transfer payload
- Execute task
- Return result as Promise

---

#### BaseQueue

Preconfigured BullMQ implementation.

Built-in features:

- Retries
- Exponential Backoff
- Dead Letter Queue (DLQ)
- Job Validation
- Error Handling

---

### API Design

#### Create Cluster

```ts
createCluster(app);
```

Boots an Express/NestJS application in cluster mode.

---

#### Offload To Thread

```ts
offloadToThread(filePath, data);
```

Signature:

```ts
(path: string, data: any) => Promise<any>;
```

Executes CPU-heavy work in a worker thread.

---

#### Enqueue Job

```ts
enqueueJob(queueName, payload);
```

Validates payload and pushes the job to BullMQ.

---

### Core Logic Flow

```text
Developer Calls
offloadToThread()
        ↓
Worker Pool
Checks Capacity
        ↓
Assign Available Thread
        ↓
Execute Task
        ↓
Return Result
        ↓
Promise Resolves
In Main Thread
```

---

### E2E Expectation

A heavy CPU-intensive operation is executed.

```text
API Request
      ↓
offloadToThread()
      ↓
Worker Thread
Handles Calculation
      ↓
Main API Thread
Remains Responsive
      ↓
Result Returned
```

Example:

A hash-generation or AST-parsing task runs in a worker thread while the API continues serving requests without blocking the event loop.
