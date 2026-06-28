# Project 16: Video Streaming + Transcoding Service

Binary Data Processing.

## 📁 Folder-Level Architecture

Separates the API from the CPU-heavy transcoding workers.

```text
apps/16-video-streaming/
├── api-server/                   # Node.js/NestJS
│   ├── src/
│   │   ├── upload/               # S3 Pre-signed URL logic
│   │   ├── video-meta/           # Postgres metadata
│   │   └── stream-proxy/         # Signed URL generation
│   └── package.json
│
├── transcode-worker/             # Python + FFmpeg
│   ├── src/
│   │   ├── ffmpeg-wrapper.py     # Subprocess management
│   │   ├── quality-profiles.py   # 360p, 720p, 1080p configs
│   │   └── worker.py             # Kafka consumer
│   └── Dockerfile                # Includes FFmpeg binary
│
└── frontend-react/
    ├── components/
    │   └── VideoPlayer.tsx       # Hls.js implementation
    └── hooks/
        └── useAdaptiveBitrate.ts
```

---

# 📄 Engineering Specification (`docs/batch-3/project-16-video-streaming.md`)

## 1. Purpose & Problem Statement

Uploading a 1GB MP4 file and serving it directly is inefficient (slow load, high bandwidth).

This project implements Adaptive Bitrate Streaming (ABS). It breaks a video into 10-second chunks at different resolutions, allowing the player to switch from 1080p to 360p automatically if the user's internet slows down.

---

## 2. Tech Stack & Justification

### Python + FFmpeg

The industry standard for video manipulation.

Python is chosen for the worker because FFmpeg is a CLI tool. Python's `subprocess` and `multiprocessing` libraries are superior for managing CPU-bound binary tasks.

### Distributed Worker Pool (BullMQ)

Because transcoding is the most CPU-heavy task in the ecosystem, we use a distributed pool. Workers can be scaled across different physical servers to avoid crashing the API.

### HLS (HTTP Live Streaming)

Chosen over DASH for its native compatibility with iOS/Safari. It creates a `.m3u8` playlist and many `.ts` segments.

### AWS S3 + CloudFront

S3 stores the segments; CloudFront caches them at the "Edge" so a user in London doesn't have to fetch a video segment from a server in New York.

---

## 3. Design Patterns & Application

### Worker Pool Pattern

A fixed number of FFmpeg slots per server. If a server has 16 cores, we allow exactly 16 concurrent transcode jobs.

### Pipeline Pattern

```text
Upload
   ↓
Validation
   ↓
Transcoding
   ↓
Segmenting
   ↓
S3 Upload
```

---

## 4. Detailed Design

### Concurrency Control

Each Python worker implements a "Concurrency Semaphore." It only picks up a new job from BullMQ when the current FFmpeg process exits.

### The Transcoding Ladder

The worker generates three versions of the video:

- 1080p (High bitrate, high quality)
- 720p (Medium)
- 360p (Low bitrate, for mobile/slow nets)

### S3 Multipart Upload

For files `>100MB`, the API uses multipart uploads to ensure that a network flicker doesn't restart the entire 1GB upload.

---

## 5. API & Route Design

### Upload Video

```http
POST /videos/upload
```

Returns a pre-signed S3 URL for the raw file.

### Get HLS Playlist

```http
GET /videos/:id/playlist.m3u8
```

Returns the HLS manifest file.

### Video Status

```http
GET /videos/:id/status
```

Returns:

```json
{
  "status": "Processing"
}
```

or

```json
{
  "status": "Ready"
}
```

---

## 6. Core Logic Flow

```text
Upload
      ↓
S3
      ↓
NestJS API
      ↓
Push To BullMQ
      ↓
Distributed Worker Picks Up
      ↓
FFmpeg (CPU Intensive)
      ↓
S3 Segments
      ↓
CloudFront
```

---

## 7. E2E Expectation

### Adaptive Streaming

A user uploads a 4K video.

```text
Upload Video
      ↓
Store Raw File in S3
      ↓
Background Transcoding
      ↓
Generate HLS Variants
      ↓
Upload Segments to S3
      ↓
Serve Through CloudFront
```

Once ready, the user can watch it.

If they switch from Wi-Fi to 3G, the player automatically drops the quality from 1080p to 360p without buffering.

### Distributed Processing

Upload 5 large videos simultaneously.

```text
Upload 5 Videos
       ↓
API Accepts Requests
       ↓
BullMQ Queue
       ↓
Distributed Workers
       ↓
Concurrency Semaphore
       ↓
FFmpeg Processing
       ↓
Controlled CPU Usage
```

The API remains lightning fast. The workers process the videos one-by-one (or according to CPU capacity), ensuring the server never hits 100% CPU and freezes.
