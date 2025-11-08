# 🚀 Scalable Job Importer with Queue Processing & History Tracking

This project implements a **scalable background job import system** that:
- Fetches job data from multiple external XML-based APIs.
- Converts it to JSON.
- Queues the jobs using **Redis + BullMQ**.
- Imports them into **MongoDB** through worker processes.
- Tracks the **import history** and displays it in a **Next.js Admin Dashboard**.

---

## 🧠 Features

| Category | Description |
|-----------|-------------|
| **Job Source Integration** | Fetches jobs from multiple APIs (RSS/XML → JSON). |
| **Queue System** | Background job management via BullMQ & Redis. |
| **Worker System** | Concurrency-controlled job imports, retry logic, and failure handling. |
| **Cron Scheduler** | Automatically fetches and imports jobs every hour. |
| **Database** | MongoDB stores job data and import logs. |
| **Import Tracking** | Tracks total, new, updated, and failed jobs per feed. |
| **Admin Dashboard (Next.js)** | View import history, refresh data, and monitor automation. |

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js (App Router) + Tailwind CSS + Axios |
| **Backend** | Node.js (Express) |
| **Queue** | BullMQ |
| **Queue Store** | Redis |
| **Database** | MongoDB + Mongoose |
| **Scheduler** | node-cron |
| **Parser** | xml2js (for XML → JSON conversion) |
| **Logging** | Pino |

---

## 📂 Folder Structure

.
├── client/ # Next.js Admin Dashboard
│ ├── src/
│ │ ├── app/ # Pages & Layouts
│ │ └── components/ # Reusable UI Components
│ └── .env.local # Frontend environment config
│
├── server/ # Backend Application
│ ├── src/
│ │ ├── config/ # Mongo, Redis, env setup
│ │ ├── models/ # Mongoose Models (Job, ImportLog)
│ │ ├── queues/ # BullMQ Queues
│ │ ├── workers/ # BullMQ Workers
│ │ ├── services/ # Business logic (XML fetch + import)
│ │ ├── routes/ # Express Routes
│ │ ├── jobs/ # Cron Jobs (hourly imports)
│ │ └── utils/ # Logger, helpers
│ └── .env # Backend environment config
│
├── docs/
│ └── architecture.md # System Design Explanation
│
└── README.md

yaml

## ⚙️ Environment Variables

### Backend (`server/.env`)
PORT=4000
MONGO_URI=mongodb://localhost:27017/job_importer
REDIS_URL=redis://localhost:6379
QUEUE_PREFIX=job-importer
IMPORT_WORKER_CONCURRENCY=5

Frontend (client/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:4000/api

🧩 Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/scalable-job-importer.git
cd scalable-job-importer

2️⃣ Setup Backend
cd server
npm install
npm run dev
Backend runs on http://localhost:4000

3️⃣ Setup Frontend
cd ../client
npm install
npm run dev
Frontend runs on http://localhost:3000

🔁 How It Works
🔹 Cron Job Scheduler
Runs every hour (0 * * * *)

Enqueues all feed URLs into the BullMQ queue.

🔹 Worker Process
Listens for new jobs in the Redis queue.

Fetches XML feed → converts to JSON.

Inserts or updates job data into MongoDB.

Logs stats in the importlogs collection.

🔹 Admin Dashboard
Fetches logs via GET /api/logs.

Displays totals, new, updated, and failed jobs.

Auto-refreshes every 30 seconds.

📊 API Endpoints
Method	Endpoint	Description
GET	/api/health	Health check
POST /api/import/run	Manually trigger an import (feed URL in body)
GET	/api/logs	Get all import logs
GET	/api/logs/:id	Get a specific import log

🧱 Bonus Features Implemented
✅ Retry & backoff logic for failed imports
✅ Environment-configurable concurrency
✅ Auto-run cron on startup
✅ Auto-refresh dashboard
✅ Responsive & clean Tailwind UI