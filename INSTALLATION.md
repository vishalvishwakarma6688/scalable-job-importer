# ⚙️ Installation & Run Instructions

This guide explains how to quickly **run the Scalable Job Importer project** (both backend and frontend) locally.

---

## 🧠 Project Overview

This project has two parts:

| Component | Description |
|------------|-------------|
| **Backend** | Node.js + Express + MongoDB + Redis + BullMQ |
| **Frontend** | Next.js + Tailwind CSS (Admin Dashboard) |

---

## 🚀 1️⃣ Clone the Repository

```bash
git clone https://github.com/vishalvishwakarma6688/scalable-job-importer.git
cd scalable-job-importer


🧩 2️⃣ Start MongoDB and Redis

You can run MongoDB and Redis locally or via Docker.

▶️ Option 1: Run using Docker (Recommended)

If you have Docker installed, simply run:
docker run -d --name mongo -p 27017:27017 mongo
docker run -d --name redis -p 6379:6379 redis


This will:
Start MongoDB on port 27017
Start Redis on port 6379

To verify they’re running:
docker ps


⚙️ 3️⃣ Setup Backend
cd server
npm install

Create a .env file inside /server and add:
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/job_importer
REDIS_URL=redis://localhost:6379
QUEUE_PREFIX=job-importer
IMPORT_WORKER_CONCURRENCY=5

Now run the backend:
npm run dev

✅ You should see:
[INFO] Redis connected
[INFO] MongoDB connected
[INFO] Worker started on queue "job-importer-job-import"
[INFO] API running on http://localhost:4000





💻 4️⃣ Setup Frontend

Open a new terminal (keep the backend running):
cd client
npm install


Create .env.local inside /client:
NEXT_PUBLIC_API_URL=http://localhost:4000/api


Now start the frontend:
npm run dev



🧩 Bonus (Manual API Test)
To manually trigger a feed import:
POST http://localhost:4000/api/import/run
Content-Type: application/json
{
  "sourceUrl": "https://jobicy.com/?feed=job_feed&job_categories=data-science"
}


Expected response:
{
  "message": "Import job queued",
  "sourceUrl": "https://jobicy.com/?feed=job_feed&job_categories=data-science"
}