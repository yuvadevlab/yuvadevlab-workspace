# Project 12: Web Scraper + Crawler Platform

## 📁 Folder-Level Architecture

A distributed worker-based system.

```text
apps/12-web-scraper/
├── api-gateway/                 # Job submission & Monitoring
│   ├── src/
│   │   ├── jobs/                # Queue management logic
│   │   └── routes/              # Job status endpoints
│   └── package.json
├── crawler-worker/              # The scraping engine (Node.js)
│   ├── src/
│   │   ├── engine/              # Playwright implementation
│   │   ├── proxy/               # Proxy rotation logic
│   │   └── parsers/             # Site-specific extraction rules
│   └── package.json
├── data-processor/              # Python cleaning service
│   ├── processors/              # Boilerplate removal (BeautifulSoup)
│   └── main.py
└── infra/
    └── redis-queue-config.conf  # BullMQ persistence settings
```

---

# 📄 Engineering Specification (`docs/batch-2/project-12-web-scraper.md`)

## 1. Purpose & Problem Statement

Modern websites are SPAs (Single Page Apps) that require JS execution. Simple HTTP requests aren't enough. This project builds a Distributed Headless Browser Pool that can crawl thousands of pages while avoiding bot detection.

---

## 2. Tech Stack & Justification

### Playwright

Chosen over Puppeteer because it supports multiple browsers (Chromium, Firefox, WebKit) and has better "Auto-wait" logic for dynamic content.

### BullMQ

The industry standard for Node.js job queues. It allows for prioritization (e.g., "User-requested pages" processed before "Background crawl").

### Semaphore-based Pooling

Headless browsers are RAM-heavy. We implement a strict pool limit to prevent "Out of Memory" (OOM) kills.

### MongoDB

Used for storing crawled pages. Since every website has a different HTML structure, a schemaless document store is required.

### Python (BeautifulSoup)

Used in a separate service for "Boilerplate Removal" (removing headers/footers) because Python's NLP libraries are better for content cleaning.

---

## 3. Design Patterns & Application

### Worker Pool Pattern

Manages a "Slot" system. If we have 5 slots, only 5 browsers are open. The 6th URL waits in the queue.

### Visitor Pattern

Used for "Extraction Rules." An `AmazonVisitor` extracts price/title, while a `WikipediaVisitor` extracts the main body text.

---

## 4. Detailed Design

### The Browser Pool

A manager that tracks `ActiveBrowsers`. It uses a Promise queue to ensure that `browser.launch()` is only called when a slot is free.

### Proxy Rotator

A middleware that rotates the proxy-server IP for every 5 requests to avoid IP banning.

### Politeness Layer

Checks `robots.txt` and implements a `Crawl-Delay` to avoid DOS-ing the target website.

---

## 5. API Design

### Create Crawl Job

```http
POST /jobs/crawl
```

```json
{
  "url": "string",
  "depth": 2,
  "priority": "high",
  "rules": {}
}
```

Returns `jobId`.

### Get Job Status

```http
GET /jobs/:id/status
```

Returns `% complete` and `error_count`.

### Export Data

```http
GET /data/export
```

Downloads cleaned JSON data.

---

## 6. Core Logic Flow

```text
API
 ↓
BullMQ Queue
 ↓
Wait for Available Browser Slot
 ↓
Launch Playwright
 ↓
Render JS
 ↓
Extract HTML
 ↓
Close Browser
 ↓
Release Slot
 ↓
MongoDB
 ↓
Python Processor
 ↓
Cleaned Data
```

---

## 7. E2E Expectation

Queue 1,000 URLs.

```text
Submit Crawl Jobs
        ↓
BullMQ Queue
        ↓
Browser Pool
(5 Active Browsers)
        ↓
Batch Processing
        ↓
Store Raw Data
        ↓
Python Cleaning
        ↓
MongoDB
```

The system maintains a steady RAM usage (e.g., 2GB) and processes the URLs in batches of 5, rather than trying to open 1,000 browsers and crashing the OS.
