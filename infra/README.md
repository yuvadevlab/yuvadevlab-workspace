# 🏗️ Infrastructure (`infra/`)

This directory contains Infrastructure as Code (IaC), local multi-container orchestration, and cloud manifests.

---

## 🧭 Infrastructure Components

- **`docker/`**: `docker-compose.yml` configurations for booting PostgreSQL (`pgvector`), Apache Kafka, Redis, and MongoDB locally.
- **`k8s/`**: Kubernetes manifests and Helm charts for cluster deployment.
- **`terraform/`**: Cloud infrastructure definitions for AWS services (S3, EC2, Lambda).

---

## 💻 Commands

```bash
# Start local backing services
docker-compose up -d

# Stop local backing services
docker-compose down
```
