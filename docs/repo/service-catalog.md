# 📋 Service Catalog

This table maps every service in the lab to the specific technical capability it is designed to prove.

| Service             | Domain       | Primary Tech/Pattern           | Purpose                              |
| :------------------ | :----------- | :----------------------------- | :----------------------------------- |
| `sso`               | Platform     | OAuth2 / JWT / OpenID          | Identity Management & Single Sign-On |
| `api-gateway`       | Platform     | Reverse Proxy / Caching        | Request Routing & Rate Limiting      |
| `semantic-search`   | Intelligence | Vector DB / RAG / LLM          | AI-powered information retrieval     |
| `doc-intelligence`  | Intelligence | PDF Parsing / Embeddings       | Unstructured data analysis           |
| `code-review-bot`   | Intelligence | AST Parsing / AI               | Automated code quality analysis      |
| `web-scraper`       | Automation   | Puppeteer / Distributed Queues | Large-scale data extraction          |
| `collaboration`     | Experience   | WebSockets / CRDTs             | Real-time multi-user interaction     |
| `ecommerce-core`    | Experience   | ACID Transactions / Saga       | Distributed transaction management   |
| `notifications`     | Experience   | Pub/Sub / Kafka                | Event-driven alerting system         |
| `video-streaming`   | Media        | HLS / Blob Storage             | High-bandwidth content delivery      |
| `rendering-lab`     | Media        | GPU Compute / Worker Threads   | CPU-intensive rendering tasks        |
| `ci-cd-engine`      | Operations   | Pipeline Orchestration         | Automated deployment workflows       |
| `performance-suite` | Operations   | Load Testing / Metrics         | System bottleneck analysis           |
| `auto-healing`      | Operations   | Health Checks / K8s Operators  | Self-healing infrastructure          |
