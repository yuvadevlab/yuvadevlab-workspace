# Project 3: Real-time Collaboration Tool

The "Google Docs" Challenge.

## 📁 Folder-Level Architecture

Focuses on the synchronization layer.

```text
apps/03-collab-tool/
├── backend-nestjs/
│   ├── src/
│   │   ├── collaboration/
│   │   │   ├── yjs-provider.ts        # Bridge between Socket.io and Yjs
│   │   │   ├── awareness.service.ts   # Manages live cursors
│   │   │   └── persistence.ts         # Binary storage to Postgres
│   │   └── main.ts
│
├── frontend-nextjs/
│   ├── components/
│   │   ├── editor/
│   │   │   ├── TiptapEditor.tsx       # Rich text editor
│   │   │   └── CursorLayer.tsx        # Renders other users' cursors
│   │   └── PresenceBar.tsx            # "Who is online" list
│   └── hooks/
│       └── useYjs.ts                  # Syncs local state to server
│
└── infra/
    └── redis-pubsub.conf              # Scaling WebSockets across pods
```

---

# 📄 Engineering Specification (`docs/batch-3/project-03-collab-tool.md`)

## 1. Purpose & Problem Statement

When two people edit the same line at the same time, the server usually "wins" (Last Write Wins), and one person's work is deleted.

This project solves this using CRDTs (Conflict-free Replicated Data Types) to ensure everyone sees the same state regardless of network lag.

---

## 2. Tech Stack & Justification

### Yjs

The gold standard for CRDTs. It allows local edits to be immediate and merges remote edits mathematically, guaranteeing that all users converge to the same document state.

### Socket.io

Used over raw WebSockets because it provides built-in "Rooms" and automatic reconnection logic.

### Redis Pub/Sub

Crucial for horizontal scaling. If User A is on Server 1 and User B is on Server 2, Redis syncs the Yjs updates between the two servers.

### PostgreSQL (BYTEA)

Yjs documents are binary blobs. We store the binary state in Postgres rather than JSON to prevent data corruption.

---

## 3. Design Patterns & Application

### Observer Pattern

The editor observes the Yjs document. When a remote change arrives, the editor is notified to update the view.

### Command Pattern

Every edit (insert character, delete word) is treated as a command that can be undone/redone.

### Mediator Pattern

The `YjsProvider` acts as the mediator between the Tiptap editor, the Socket.io connection, and the Postgres DB.

---

## 4. Detailed Design

### Awareness Protocol

A separate, ephemeral stream of data (not saved to DB) that tracks:

```json
{
  "userId": "string",
  "cursorPosition": 0,
  "color": "string",
  "name": "string"
}
```

### Binary Convergence

Instead of sending:

```text
Insert 'X' at position 10
```

Yjs sends a state vector. The receiver merges this vector with their own.

---

## 5. API & Route Design

### Fetch Document

```http
GET /doc/:id
```

Fetches the initial binary state from Postgres.

### Real-Time Collaboration Socket

```text
WS /collab/:id
```

The WebSocket upgrade point for real-time sync.

---

## 6. Core Logic Flow

```text
User types 'H'
        ↓
Yjs creates local update
        ↓
Socket.io broadcasts update
        ↓
Redis Pub/Sub syncs to other servers
        ↓
Other users' Yjs docs merge update
        ↓
UI renders 'H'
```

---

## 7. E2E Expectation

Two users in different cities edit a document. Even with 200ms lag, their cursors move smoothly, and no characters are lost or duplicated.
