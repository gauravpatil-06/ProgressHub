# 🚀 ProgressHub — Learning & Consistency Ecosystem

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite-blue?style=for-the-badge&logo=react"/>
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=node.js"/>
  <img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb"/>
  <img src="https://img.shields.io/badge/Realtime-Socket.io-010101?style=for-the-badge&logo=socket.io"/>
</p>

---

## 🌟 Introduction

**ProgressHub** is a high-performance learning management dashboard designed for students who value speed and consistency. Built with an **at-least 0.1s response time** goal, it eliminates the lag traditional learning apps suffer from. Whether you are tracking 10 lectures or 200, ProgressHub stays instantaneous.

---

## 🔥 Why ProgressHub? (State-of-the-Art Architecture)

We didn't just build a UI; we built a high-speed data delivery engine.

| Feature | Technical Implementation |
| :--- | :--- |
| **🚀 Sub-0.1s Response** | **Optimistic UI Engine**: UI updates instantly (<100ms) before the backend even confirms. |
| **⚡ Unified Loading** | **One-Trip Login**: Login/Register returns User + Progress + Settings in a single API round-trip. |
| **🔌 Real-time Sync** | **Socket.io Integration**: Persistent bi-directional connection for low-latency synchronization. |
| **🎨 Premium Blue Theme** | **Standard Design System**: A high-fidelity, light blue glassmorphic UI designed for focus. |
| **📊 Global Leaderboard** | **Real-time Ranking**: Compete with other students and track your position instantly. |

---

## 🚀 Key Modules

1.  **Dashboard**: The command center. Interactive lecture tracking with instant completion toggles and quick-notes.
2.  **Progress Analytics**: Visual breakdown of your course completion rate using circular progress engines.
3.  **Global Leaderboard**: Live ranking of students based on their lecture completion and consistency.
4.  **Profile & Settings**: Manage your learning identity and customize your dashboard experience.
5.  **Admin Control**: Comprehensive tools for managing the curriculum size and monitoring student engagement.

---

## 📂 Project Architecture

```text
ProgressHub/
 ├── frontend/           # React + Vite Client
 │    ├── src/
 │    │    ├── context/  # Centralized Fast-Data AuthContext
 │    │    ├── services/ # High-speed API Client
 │    │    └── pages/    # Optimized User & Admin modules
 ├── backend/            # Express + Socket.io Server
 │    ├── controllers/   # Unified Data Controllers
 │    ├── routes/        # RESTful Endpoints
 │    └── models/        # MongoDB Data Models
 └── README.md
```

---

## ⚙️ Quick Installation

### 1. Clone & Core Setup
```bash
git clone https://github.com/gauravpatil-06/ProgressHub.git
cd ProgressHub
```

### 2. Backend Config
Create a `.env` in the `backend/` folder:
```env
MONGODB_URI=your_mongodb_atlas_uri
PORT=5000
JWT_SECRET=your_secret_key
```

### 3. Launching
```bash
# Start Backend
cd backend && npm start

# Start Frontend
cd frontend && npm run dev
```

---

## 🛡️ Reliability & Speed
*   **MongoDB Atlas**: Distributed cloud database for 99.9% uptime.
*   **Parallel Data Engine**: Settings and Progress are fetched in parallel to cut load times by 50%.
*   **Background Sync**: Silent database persistence ensures the UI never hangs waiting for a network response.

---

<div align="center">

✨ **Built for speed. Designed for focus. Master your progress.**

</div>