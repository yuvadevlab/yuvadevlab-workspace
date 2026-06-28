# Project 10: Real-time Chat + Notification Service

Scaling the "Fan-out".

## 📁 Folder-Level Architecture

Separates the high-frequency chat from the async notification system.

```text
apps/10-chat-notification/
├── chat-service/                 # NestJS + MongoDB
│   ├── src/
│   │   ├── rooms/                # Channel & DM logic
│   │   ├── messages/             # Message persistence
│   │   └── socket-gateway/       # Socket.io handlers
│   └── package.json
│
├── notification-service/         # NestJS + Redis + BullMQ
│   ├── src/
│   │   ├── providers/            # FCM, SendGrid, SSE
│   │   ├── queue-processor/      # BullMQ worker
│   │   └── dispatch.logic.ts     # Decides: Push vs Email
│   └── package.json
│
└── frontend-react/
    ├── components/
    │   ├── ChatWindow.tsx
    │   └── NotificationBell.tsx  # SSE-powered real-time alert
```

---

# 📄 Engineering Specification (`docs/batch-3/project-10-chat-notification.md`)

## 1. Purpose & Problem Statement

A chat app is easy for 2 users. It is hard for 2,000 users in one channel.

When one message is sent, it must be "fanned out" to 1,999 other people instantly.

This project teaches the Fan-out pattern and the difference between WebSockets (bidirectional) and SSE (unidirectional).

---

## 2. Tech Stack & Justification

### MongoDB

Perfect for chat messages. Messages are essentially "streams" of documents. MongoDB's capping and indexing on `createdAt` make it faster than Postgres for this specific use case.

### Redis Pub/Sub

Used to broadcast messages across multiple server instances.

### BullMQ

Used for notifications. Sending an email is slow (1–2 seconds). We push the notification to a queue so the chat service can return a "success" response immediately.

### SSE (Server-Sent Events)

Used for the "Notification Bell." Since the bell only needs data from the server (not to), SSE is more battery-efficient and lighter than WebSockets.

---

## 3. Design Patterns & Application

### Pub/Sub Pattern

Every chat room is a Redis channel. When a message is sent, it is published to that channel.

### Strategy Pattern

Used in the Notification service to choose the delivery method:

- `EmailStrategy`
- `PushStrategy`
- `InAppStrategy`

---

## 4. Detailed Design

### Message Persistence

Messages are stored in MongoDB with a composite index on:

```text
roomId + createdAt
```

### Presence System

Redis `HSET` is used to track who is "Online" vs "Away" with a 30-second TTL.

---

## 5. API & Route Design

### Send Message

```http
POST /messages
```

Sends a message → triggers Kafka event `message_sent`.

### Notification Stream

```http
GET /notifications/stream
```

Opens an SSE connection for real-time alerts.

### Read Receipt

```http
PATCH /messages/:id/read
```

Updates the "read receipt" status.

---

## 6. Core Logic Flow

```text
User sends message
        ↓
    Chat Service
        ↓
  Saves to MongoDB
        ↓
 Publishes to Redis
        ↓
Socket.io sends to all online members
```

Concurrent Event:

```text
Notification Service
        ↓
Consumes Kafka event
        ↓
 Push to BullMQ
        ↓
Worker sends FCM Push Notification
```

---

## 7. E2E Expectation

User A sends a message to a group of 100 people.

```text
User A sends message
        ↓
 Chat Service persists message
        ↓
 Redis Pub/Sub broadcasts event
        ↓
 Socket.io fans out to recipients
        ↓
 All online users receive message
```

All 100 people see the message in `<200ms`.

Users who are offline receive a Push Notification via FCM.
