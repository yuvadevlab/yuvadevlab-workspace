# 🚀 Setup Guide

Follow these steps to boot the Distributed Systems Lab on your local machine.

## 📋 Prerequisites

- **Node.js**: v22+
- **pnpm**: `corepack enable`
- **Docker**: Installed and running
- **Python**: v3.12+ (for intelligence services)

## 🛠️ Installation

1. **Clone the repo**

   ```bash
   git clone <repo-url>
   cd yuvadevlab-workspace
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Initialize Environment**
   ```bash
   cp .env.example .env
   # Fill in your secrets (AWS, DB, Kafka)
   ```

## 🏃 Running the Lab

### Start the Infrastructure

```bash
docker-compose up -d
```

### Start the Super-App (Frontend)

```bash
pnpm nx run web-super-app
```

### Start a Specific Service

```bash
pnpm nx run service-name
```

## 🧪 Testing

Run the entire suite of integration tests:

```bash
pnpm nx run test
```
