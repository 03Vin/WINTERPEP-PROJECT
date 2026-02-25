<div align="center">

# ⚡ PEP — Academic Management System

### *A next-generation institutional intelligence platform*

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Role-Based Access](#-role-based-access)
- [Seeding Data](#-seeding-data)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌌 Overview

**PEP** (Professional Education Platform) is a full-stack academic management system built for modern educational institutions. It features a premium **cyberpunk-inspired UI**, intelligent scheduling, dynamic QR-based attendance with anti-proxy fraud detection, and role-segregated portals for Admins, Teachers, and Students — all backed by a secure, scalable REST API.

> Built with a "Command Center" philosophy — every interaction feels like operating a high-security institutional intelligence terminal.

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with role-based access control (Admin / Teacher / Student)
- Encrypted passwords using `bcryptjs`
- Protected API routes with middleware authorization

### 🎯 Dynamic QR Attendance System
- **Session-linked rotating QR codes** — refreshes every 10 seconds, preventing screenshot/proxy abuse
- Teacher generates a live session; students scan to mark presence
- **Bulk attendance marking** via the teacher portal
- Historical attendance logs, statistics, and `Integrity Index` dashboard
- Behavioral analytics with anomaly detection for flagging suspicious patterns

### 🗓️ AI-Powered Timetable
- **Conflict-free schedule generation** with a staggered slot algorithm
- Admin can trigger AI Optimization per section from the Command Center
- Role-filtered views: Admin sees all, Teachers see their own, Students see their section
- Interactive day-selector with animated transitions

### 🏛️ Admin Command Center
- Institution-wide stats: enrollment, budget, staff efficiency, system health
- **Unified User Directory** — deploy, modify, or revoke any user
- Departmental performance charts (Recharts)
- AI Risk Scan — automatically flags at-risk students based on attendance patterns
- Integrated curriculum progress overview

### 👨‍🏫 Teacher Faculty Portal
- **Today's Schedule** — live-synced class grid for the active day
- Full **Lecture Registry** — sorted weekly schedule with 1-click "Mark Presence"
- AI-powered student **Feedback Draft Generator**
- System logs for lecture history with status tracking

### 🎓 Student Dashboard
- QR **Optical Check-In** portal — scan the session QR with the camera to mark attendance
- Attendance statistics with visual charts
- Curriculum progress tracker per subject
- Academic resources browser

### 📚 Other Modules
- **Curriculum** — Subject & topic tracker with completion status and resource links
- **Resources** — Organized academic resource browser with a slide-out drawer
- **Timetable** — Holographic schedule view with per-day slot filtering
- **Profile** — Neural Identity card with yield metrics

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, TailwindCSS 3, Framer Motion |
| **UI Components** | Lucide React, Recharts, html5-qrcode, qrcode.react, Swiper |
| **Backend** | Node.js, Express 4 |
| **Database** | MongoDB, Mongoose 8 |
| **Auth** | JSON Web Tokens (JWT), bcryptjs |
| **AI** | Google Generative AI (`@google/generative-ai`) |
| **Dev Tools** | Nodemon, ESLint, PostCSS, Autoprefixer |

---

## 📁 Project Structure

```
PEP-Project/
├── client/                    # React + Vite Frontend
│   ├── public/
│   └── src/
│       ├── components/        # Reusable components
│       │   ├── AIAssistant.jsx
│       │   ├── CurriculumSummary.jsx
│       │   ├── GlassCard.jsx
│       │   ├── Layout.jsx
│       │   ├── QRScanner.jsx
│       │   ├── ResourceDrawer.jsx
│       │   └── Sidebar.jsx
│       ├── context/
│       │   └── AuthContext.jsx    # Global auth state
│       ├── pages/
│       │   ├── AdminDashboard.jsx
│       │   ├── Attendance.jsx
│       │   ├── Curriculum.jsx
│       │   ├── Login.jsx
│       │   ├── Profile.jsx
│       │   ├── Register.jsx
│       │   ├── Resources.jsx
│       │   ├── StudentDashboard.jsx
│       │   ├── TeacherDashboard.jsx
│       │   └── Timetable.jsx
│       ├── App.jsx
│       ├── index.css          # Global Cyber-Grid design system
│       └── main.jsx
│
└── server/                    # Node.js + Express Backend
    ├── controllers/
    │   ├── attendanceController.js
    │   ├── attendanceSessionController.js
    │   ├── authController.js
    │   ├── curriculumController.js
    │   ├── resourceController.js
    │   └── timetableController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── Attendance.js
    │   ├── AttendanceSession.js
    │   ├── Curriculum.js
    │   ├── Resource.js
    │   ├── Timetable.js
    │   └── User.js
    ├── routes/
    │   ├── attendanceRoutes.js
    │   ├── authRoutes.js
    │   ├── curriculumRoutes.js
    │   ├── resourceRoutes.js
    │   └── timetableRoutes.js
    ├── seedTimetable.js       # Conflict-free timetable seeder
    └── index.js               # App entry point
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/your-username/PEP-Project.git
cd PEP-Project
```

### 2. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server/` directory:

```bash
cp server/.env.example server/.env
```

Then fill in your values (see [Environment Variables](#-environment-variables)).

### 4. Seed the timetable

After registering teachers through the app, run the timetable seeder to generate a conflict-free schedule:

```bash
cd server
node seedTimetable.js
```

### 5. Run the application

Open two terminals:

```bash
# Terminal 1 — Backend (from /server)
npm run dev

# Terminal 2 — Frontend (from /client)
npm run dev
```

The frontend will be available at **http://localhost:5173** and the API at **http://localhost:5000**.

---

## 🔑 Environment Variables

Create `server/.env` with the following:

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/academic-system

# JWT Secret — use a long, random string in production
JWT_SECRET=your_super_secret_jwt_key_here

# Server Port
PORT=5000

# Google Generative AI Key (for AI features)
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Never commit your `.env` file.** It is excluded by `.gitignore`.

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login and receive JWT | ❌ |
| `GET` | `/profile` | Get current user profile | ✅ |

### Attendance Routes — `/api/attendance`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/session/start` | Teacher starts a QR session | ✅ Teacher |
| `GET` | `/session/active/:section` | Get active session for section | ✅ |
| `POST` | `/session/verify` | Student verifies QR token | ✅ Student |
| `GET` | `/my-attendance` | Student's own attendance stats | ✅ Student |
| `GET` | `/roster/:section` | Get student list for a section | ✅ Teacher |
| `POST` | `/bulk-mark` | Mark attendance for a class | ✅ Teacher |
| `GET` | `/analytics` | Behavioral analytics data | ✅ Teacher/Admin |

### Timetable Routes — `/api/timetable`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/` | Fetch role-filtered timetable | ✅ |
| `POST` | `/optimize` | AI-generate conflict-free schedule | ✅ Admin/Teacher |

### Curriculum Routes — `/api/curriculum`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/` | List all subjects | ✅ |
| `PUT` | `/:id/topic/:topicId` | Toggle topic completion | ✅ |

### Resources Routes — `/api/resources`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/` | List all resources | ✅ |

---

## 👥 Role-Based Access

| Feature | Admin | Teacher | Student |
|---|:---:|:---:|:---:|
| View own timetable | ✅ | ✅ | ✅ |
| Start QR attendance session | ❌ | ✅ | ❌ |
| Mark own attendance via QR | ❌ | ❌ | ✅ |
| View all users | ✅ | ❌ | ❌ |
| Generate AI timetable | ✅ | ✅ | ❌ |
| View analytics dashboard | ✅ | ✅ | ❌ |
| View section roster | ❌ | ✅ | ❌ |
| Add / Revoke users | ✅ | ❌ | ❌ |

---

## 🌱 Seeding Data

The project includes a timetable seeder (`server/seedTimetable.js`) that generates a **conflict-free weekly schedule** from real teacher accounts in the database.

**Algorithm:** For each teacher `t` and section `s`, the assigned time slot is `(t + s) % numSlots`. This staggering ensures no teacher is booked at the same time in two different sections.

```bash
# From the /server directory
node seedTimetable.js
```

> Run this **after** registering teacher accounts. Re-run it anytime to reset the schedule.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ and an extraordinary amount of neon purple**

</div>
