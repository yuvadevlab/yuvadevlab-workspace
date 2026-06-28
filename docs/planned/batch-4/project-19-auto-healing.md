# Project 19: Infrastructure Monitoring & Auto-Healing

The "SRE" Capstone.

## 📁 Folder-Level Architecture

A Kubernetes Operator project.

```text
apps/19-auto-healing/
├── operator-python/              # The K8s Controller
│   ├── src/
│   │   ├── controllers/          # Kopf (Kubernetes Operator Framework) handlers
│   │   │   └── health_policy.py  # Watches for HealthPolicy CRDs
│   │   ├── analyzer/             # Prometheus query logic
│   │   └── actions/              # Pod restart/scale logic
│   └── main.py
│
├── crds/                         # Custom Resource Definitions
│   └── healthpolicy.yaml         # Definition of "What is a healthy pod?"
│
└── dashboards/
    └── grafana-healing.json      # Visualizes auto-healing events
```

---

# 📄 Engineering Specification (`docs/batch-4/project-19-auto-healing.md`)

## 1. Purpose & Problem Statement

Kubernetes' default health checks (liveness probes) only check if a process is running.

They don't check if the process is "stuck" (e.g., 100% CPU but not crashing).

This project builds an Intelligent Operator that heals the system based on application metrics.

---

## 2. Tech Stack & Justification

### Kopf (Kubernetes Operator Framework)

A Python framework that makes it easy to write "Event-Driven" controllers for Kubernetes.

### Prometheus API

The operator queries Prometheus to see if a service's error rate has spiked.

---

## 3. Design Patterns & Application

### Operator Pattern

The standard Kubernetes pattern of:

```text
Observe
   ↓
Analyze
   ↓
Act
```

### Control Loop

The operator continuously compares the current state:

```text
Error rate = 10%
```

with the desired state:

```text
Error rate < 1%
```

---

## 4. Detailed Design

### The "Healing" Logic

#### Observe

Query Prometheus for:

```promql
http_requests_total{status="500"}
```

#### Analyze

If error rate `> 5%` for 3 minutes, mark pod as:

```text
Degraded
```

#### Act

Trigger:

```text
kubectl rollout restart
```

or

```text
Increase Replica Count
```

---

## 5. API Design (CRD)

The user defines a `HealthPolicy` in YAML:

```yaml
apiVersion: healing.yourorg/v1
kind: HealthPolicy
spec:
  targetService: 'order-service'
  maxErrorRate: 0.05
  action: 'RestartPod'
```

---

## 6. E2E Expectation

```text
Memory Leak Introduced
          ↓
Prometheus Metrics Increase
          ↓
Operator Observes Trend
          ↓
Memory Growth Detected
          ↓
Pod Marked Degraded
          ↓
Auto-Healing Action Triggered
          ↓
Pod Restarted Before Crash
          ↓
Service Remains Available
```

Introduce a memory leak in the Order-Service.

The operator sees the memory growing linearly in Prometheus, predicts a crash, and restarts the pod before it crashes, ensuring zero downtime.
