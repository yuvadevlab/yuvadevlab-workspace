# Project 14: Performance Testing & Profiling Suite

The "Stress Test" for the Ecosystem.

## 📁 Folder-Level Architecture

A specialized toolset for breaking the system to find its limits.

```text
apps/14-performance-suite/
├── load-tests/
│   ├── scenarios/
│   │   ├── checkout-flow.js     # k6 script for E-commerce
│   │   ├── chat-burst.js        # k6 script for Socket.io
│   │   └── rag-query.js         # k6 script for AI responses
│   └── summary.py              # Python script to parse JSON results
│
├── profiling/
│   ├── clinic-js/              # Memory/CPU flame graph configs
│   └── heap-dumps/             # Storage for .heapsnapshots
│
└── dashboards/
    └── grafana-perf.json       # Dashboard for P99 latency monitoring
```

---

# 📄 Engineering Specification (`docs/batch-4/project-14-performance-suite.md`)

## 1. Purpose & Problem Statement

A system that works for 1 user might crash for 1,000.

We need to find the "Breaking Point" of every service (CPU bottleneck, DB lock, or Memory leak) before the users do.

---

## 2. Tech Stack & Justification

### k6

Used over JMeter because k6 scripts are written in JavaScript.

This allows developers to write load tests in the same language as the app and version-control them in Git.

### Clinic.js

Used for "Flame Graphs."

It identifies exactly which function is hogging the CPU in the Node.js event loop.

### Prometheus

Scrapes metrics from the API Gateway and Services to correlate "High Load" with "High Latency."

---

## 3. Design Patterns & Application

### Baseline Pattern

Establish a "Normal" performance metric.

Any new PR that increases P99 latency by `>10%` is automatically blocked in CI.

### Soak Testing

Running the system at 70% load for 24 hours to detect slow-leak memory issues.

---

## 4. Detailed Design

### The Scenarios

#### Spike Test

```text
0 → 10,000 users in 10 seconds
```

#### Endurance Test

```text
Constant load for 12 hours
```

### The Metrics

Tracking **P99 Latency** (the worst 1% of requests) instead of Average, because Averages hide the "Long Tail" of slow requests.

---

## 5. E2E Expectation

```text
Run k6 Script
       ↓
Generate Load
       ↓
Observe Metrics
       ↓
Identify Bottleneck
       ↓
Analyze Flame Graphs
       ↓
Implement Fix
       ↓
Re-run Benchmark
```

Example:

```text
Run checkout-flow.js
       ↓
Order-Service crashes at 500 req/s
       ↓
Root cause: DB connection pool limit
       ↓
Implement PgBouncer
       ↓
Service handles higher throughput
```
