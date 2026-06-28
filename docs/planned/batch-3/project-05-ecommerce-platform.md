# Project 5: Event-Driven E-Commerce Platform

The "Crown Jewel" of System Design.

## 📁 Folder-Level Architecture

This is a true microservices repo. Each service has its own database and deployment cycle.

```text
apps/05-ecommerce-platform/
├── services/
│   ├── order-service/             # NestJS + Postgres
│   │   ├── src/
│   │   │   ├── commands/          # CQRS Write side (CreateOrder)
│   │   │   ├── queries/           # CQRS Read side (GetOrderHistory)
│   │   │   ├── events/            # Kafka Emitters (OrderCreated)
│   │   │   └── outbox/            # Outbox pattern implementation
│   │   └── Dockerfile
│   │
│   ├── inventory-service/         # NestJS + Postgres (Advisory Locks)
│   │   ├── src/
│   │   │   ├── listeners/         # Kafka Consumers (OrderCreated)
│   │   │   └── inventory.logic.ts
│   │
│   ├── payment-service/           # NestJS + Redis (Idempotency)
│   │   ├── src/
│   │   │   ├── strategies/        # Stripe/PayPal logic
│   │   │   └── idempotency.ts     # Prevent double charging
│   │
│   ├── notification-service/      # NestJS + MongoDB (Schemaless logs)
│   │   ├── src/
│   │   │   ├── templates/         # Email/Push templates
│   │   │   └── consumer.ts        # Listen to all "Success/Fail" events
│   │
│   └── shipping-service/          # NestJS + Postgres
│
├── storefront-nextjs/             # Next.js (ISR/SSR)
│   ├── app/
│   │   ├── products/              # ISR (Incremental Static Regeneration)
│   │   └── checkout/              # Pure CSR
│
└── infra/
    ├── kafka-cluster/             # Docker Compose for Kafka/Zookeeper
    └── k8s-manifests/             # HPA (Horizontal Pod Autoscaler) configs
```

---

# 📄 Engineering Specification (`docs/batch-3/project-05-ecommerce-platform.md`)

## 1. Purpose & Problem Statement

To handle high-concurrency transactions where data consistency is required across multiple physical databases.

The main problem is the "Distributed Transaction": if the Payment fails, how does the Inventory service know to put the items back?

---

## 2. Tech Stack & Justification

### Kafka

Chosen over RabbitMQ because Kafka is a log-based system. If the Notification service crashes, it can "replay" the events from 2 hours ago to catch up. RabbitMQ deletes messages after consumption.

### PostgreSQL

Used for Order/Inventory due to ACID compliance.

### MongoDB

Used for Notifications because the data structure varies wildly between an Email, SMS, and Push notification.

### Redis

Used for "Idempotency Keys" in the Payment service to ensure that if a user clicks "Pay" twice, they are only charged once.

---

## 3. Design Patterns & Application

### Saga Pattern (Choreography)

There is no central coordinator. Each service listens to events and decides the next move.

```text
OrderCreated
      ↓
InventoryReserved
      ↓
PaymentProcessed
      ↓
OrderConfirmed
```

### CQRS (Command Query Responsibility Segregation)

The Order-Service uses different models for writing an order (Strict validation) and reading the order history (Fast, denormalized view).

### Outbox Pattern

To prevent "Dual Write" problems.

The service saves the Order to the DB and an "Outbox" table in one transaction. A separate relay then pushes the Outbox entry to Kafka.

---

## 4. Detailed Design

### Inventory Locking

Uses `SELECT FOR UPDATE` (Pessimistic Locking) in Postgres to prevent two people from buying the last item at the exact same millisecond.

### Saga Failure Flow

```text
PaymentProcessed fails
          ↓
PaymentFailed event emitted
          ↓
Inventory-Service consumes event
          ↓
Stock incremented back
```

---

## 5. API & Route Design

### Create Order

```http
POST /orders
```

Creates a "Pending" order and emits `OrderCreated`.

### Order History

```http
GET /orders/history
```

Hits the CQRS Read-model for sub-100ms response.

### Payment Webhook

```http
POST /payments/webhook
```

Stripe callback that triggers `PaymentProcessed`.

---

## 6. Core Logic Flow

```text
User Checkout
       ↓
Order Service (Outbox)
       ↓
Kafka
       ↓
Inventory Service (Reserve)
       ↓
Kafka
       ↓
Payment Service (Charge)
       ↓
Kafka
       ↓
Order Service (Mark Paid)
```

---

## 7. E2E Expectation

```text
User buys an item
        ↓
Stock decreases
        ↓
Payment is made
        ↓
Order status becomes "Paid"
        ↓
Notification sent
```

Failure scenario:

```text
Payment fails
       ↓
PaymentFailed event emitted
       ↓
Inventory service restores stock
       ↓
Order marked failed/cancelled
```
