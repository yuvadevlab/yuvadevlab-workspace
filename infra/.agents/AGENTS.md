# 🏗️ AGENTS.md — Infrastructure & DevOps Guidelines

This folder contains Infrastructure as Code (IaC), container configurations, and orchestration manifests.

---

## 🧭 Directory Layout

- **`docker/`**: Base Dockerfiles and `docker-compose.yml` for running local backing services (PostgreSQL, Redis, Kafka, MongoDB).
- **`k8s/`**: Kubernetes deployment manifests, services, ingress, and auto-healing operator configs.
- **`terraform/`**: Terraform modules provisioning cloud infrastructure (AWS S3, EC2, Lambda, IAM).

---

## 📏 IaC & Containerization Rules

1. **Local Development Parity**: All local environment containers must align with production configurations in `k8s/`.
2. **Container Security**: Ensure Dockerfiles use multi-stage builds and run processes under non-root users.
3. **Secret Management**: Never commit hardcoded secrets, API keys, or certificates. Use environment variable templates (`.env.example`).
4. **Terraform Best Practices**: Use explicit version pinning for providers and modularize cloud resource blocks.

---

## 💻 Commands

```bash
# Start local infrastructure dependencies
docker-compose up -d

# Stop local infrastructure dependencies
docker-compose down
```
