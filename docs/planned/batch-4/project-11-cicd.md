# Project 11: CI/CD Pipeline & DevOps Tooling

The "Glue" that moves code to Production.

## 📁 Folder-Level Architecture

This isn't a single app, but a set of configuration repos.

```text
infra/
├── jenkins/
│   ├── pipelines/
│   │   ├── shared-library/      # Reusable Groovy scripts for Build/Test/Deploy
│   │   └── Jenkinsfile          # Main pipeline definition
│   └── Dockerfile               # Jenkins agent image
│
├── terraform/
│   ├── envs/
│   │   ├── dev/                 # Dev environment variables
│   │   └── prod/                # Prod environment variables
│   │
│   ├── modules/
│   │   ├── vpc.tf               # Network setup
│   │   ├── eks.tf               # Kubernetes cluster setup
│   │   └── rds.tf               # Postgres setup
│   │
│   └── main.tf
│
└── helm/
    ├── charts/
    │   ├── base-service/        # Generic chart used by all NestJS apps
│   │   │   ├── values.yaml
│   │   │   └── templates/
│   │
│   └── super-app/              # Specific chart for the final integration
```

---

# 📄 Engineering Specification (`docs/batch-4/project-11-cicd.md`)

## 1. Purpose & Problem Statement

Manual deployment is error-prone.

We need a "Zero-Touch" pipeline where a commit to `main` automatically triggers tests, builds a Docker image, and deploys it to a Kubernetes cluster with zero downtime.

---

## 2. Tech Stack & Justification

### Jenkins

Used for the pipeline because of its "Pipeline as Code" (Groovy) and massive plugin ecosystem.

### Helm

Used over raw K8s YAMLs.

Helm allows us to create a "Template" for a service and just change the `values.yaml` for different environments (Dev vs Prod).

### Terraform

Used for "Infrastructure as Code" (IaC).

It ensures the AWS network and DBs are identical across environments.

### Docker Multi-stage Builds

Used to keep images small.

```text
Stage 1 (Build)
        ↓
Stage 2 (Runtime)
```

---

## 3. Design Patterns & Application

### Blue-Green Deployment

The pipeline deploys a "Green" version.

If health checks pass, Nginx flips traffic from:

```text
Blue → Green
```

### Canary Release

Deploy to only 10% of pods first.

If error rates increase, auto-rollback.

---

## 4. Detailed Design

### The Pipeline Stages

```text
Lint
 ↓
Unit Test
 ↓
Build Image
 ↓
Push to ECR
 ↓
Helm Upgrade
 ↓
Smoke Test
 ↓
Promote to Prod
```

---

## 5. E2E Expectation

```text
Developer pushes code
          ↓
    Jenkins triggers
          ↓
 Docker image is created
          ↓
 Kubernetes deployment starts
          ↓
 Rolling update performed
          ↓
 Health checks pass
          ↓
 New version becomes live
```

New version is deployed with zero dropped requests.
