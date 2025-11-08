🧩 docs/architecture.md
# 🧠 System Architecture – Scalable Job Importer

---

## 🎯 Objective

The goal of this project is to design and build a **scalable, maintainable, and fault-tolerant job import system** that:
- Periodically imports job listings from multiple **external XML-based APIs**.
- Converts them into structured JSON.
- Processes them asynchronously using **Redis Queues (BullMQ)**.
- Persists them into **MongoDB**.
- Tracks import history for visibility and analysis.
- Provides a **Next.js Admin Dashboard** for monitoring.

---

## 🏗️ High-Level Architecture

```text
          ┌───────────────────────────────┐
          │ External Job APIs (XML Feeds) │
          │ jobicy.com / higheredjobs.com │
          └───────────────┬───────────────┘
                          │  (Axios Fetch)
                          ▼
               ┌────────────────────────┐
               │ Express Backend Server │
               │ - REST APIs            │
               │ - Cron Scheduler       │
               │ - Job Enqueuer (BullMQ)│
               └──────────┬─────────────┘
                          │  (Redis Queue)
                          ▼
               ┌────────────────────────┐
               │ Redis (BullMQ Queue)   │
               │ - Stores job imports   │
               │ - Manages concurrency  │
               └──────────┬─────────────┘
                          │
                          ▼
               ┌────────────────────────┐
               │ Worker Process         │
               │ - Fetch feed data      │
               │ - Parse XML → JSON     │
               │ - Upsert MongoDB jobs  │
               │ - Record import logs   │
               └──────────┬─────────────┘
                          │
                          ▼
               ┌────────────────────────┐
               │ MongoDB Database        │
               │ - Jobs Collection       │
               │ - Import Logs           │
               └──────────┬─────────────┘
                          │
                          ▼
               ┌────────────────────────┐
               │ Next.js Admin Dashboard │
               │ - Fetch logs from API   │
               │ - Display history table │
               │ - Auto-refresh updates  │
               └────────────────────────┘

⚙️ Workflow Steps
1️⃣ Scheduler (node-cron)

Runs every hour (0 * * * *).

Enqueues all feed URLs from the predefined list.

Also runs immediately once on server startup for quick data availability.

2️⃣ Queue System (Redis + BullMQ)

Each feed URL is enqueued as a job in Redis.

The worker processes these jobs concurrently (configurable via .env).

Failed jobs are retried automatically with exponential backoff.

3️⃣ Worker Process

Fetches XML feed data using Axios.

Parses XML → JSON using xml2js (with strict: false to handle malformed feeds).

Performs upsert operations in MongoDB:

Inserts new jobs.

Updates existing jobs.

Records import details in importlogs collection:

totalFetched

newJobs

updatedJobs

failedJobs

sourceUrl

timestamps

4️⃣ Database (MongoDB)

Stores two collections:

jobs → Actual job data.

importlogs → History of each import operation.

5️⃣ Frontend (Next.js Dashboard)

Fetches data from GET /api/logs.

Displays:

Feed URL

Total, New, Updated, and Failed counts

Timestamp of import

Auto-refreshes every 30 seconds and allows manual refresh.

🗄️ Database Schema

🧩 Job Collection
{
  "_id": "ObjectId",
  "externalId": "string",
  "title": "string",
  "link": "string",
  "company": "string",
  "description": "string",
  "category": "string",
  "location": "string",
  "pubDate": "Date",
  "rawData": "object",
  "createdAt": "Date",
  "updatedAt": "Date"
}

🧩 ImportLog Collection
{
  "_id": "ObjectId",
  "sourceUrl": "string",
  "totalFetched": "number",
  "newJobs": "number",
  "updatedJobs": "number",
  "failedJobs": "number",
  "failedReasons": ["string"],
  "startedAt": "Date",
  "finishedAt": "Date"
}

🧠 Design Decisions
Concern	Design Choice
Scalability	Queue-based system allows horizontal scaling of workers.
Fault Tolerance	Automatic retries with exponential backoff on failures.
Maintainability	Clean modular structure — routes, services, models, queues separated.
Extensibility	Adding new feed sources requires only updating feed list.
Performance	Upsert operations prevent duplicates and minimize writes.
Observability	Logging through Pino for all major events (import start, success, fail).

🧰 Technology Stack
Layer	Tool / Library	Purpose
Backend Framework	Express.js	REST API & routes
Queue Manager	BullMQ	Job queuing and concurrency control
Queue Store	Redis	Stores queued jobs
Database	MongoDB + Mongoose	Job & log persistence
Scheduler	node-cron	Triggers hourly imports
XML Parser	xml2js	Converts XML feeds to JSON
Frontend	Next.js + Tailwind CSS	Dashboard UI
HTTP Client	Axios	Fetch external feeds
Logger	Pino	Structured application logs

🌐 Deployment Architecture
Component	Hosting Platform	Description
Frontend	Vercel	Next.js admin dashboard
Backend	Render	Node.js + Express API
Database	MongoDB Atlas	Cloud-based MongoDB cluster
Queue Store	Redis Cloud	BullMQ queue storage

🔒 Future Enhancements
Improvement	Description
Real-time updates	Use Socket.IO or Server-Sent Events to push new import logs to UI instantly.
Dockerization	Add docker-compose.yml for quick multi-service setup.
Monitoring	Integrate Prometheus + Grafana for job success/failure metrics.
Authentication	Add admin login for restricted dashboard access.
Batching	Handle very large feeds using pagination or streaming.

⚙️ Scalability Roadmap

Extract worker process into a separate microservice.

Deploy multiple worker containers for high concurrency.

Use Kubernetes or AWS ECS for orchestration.

Implement caching and rate limiting for external API calls.

Add central logging (ELK stack or CloudWatch).

🧭 Example Data Flow

Cron triggers import → enqueues job in Redis.

Worker picks up job → fetches XML feed.

Feed parsed → upserts into MongoDB.

ImportLog created → dashboard displays results.

Next cron cycle repeats automatically.

📊 System Summary

This project demonstrates:

Event-driven, queue-based architecture.

Background job processing using Redis and BullMQ.

Automated hourly scheduling.

Robust logging and import tracking.

Real-time dashboard monitoring.