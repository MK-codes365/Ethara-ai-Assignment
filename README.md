# 🚀 TaskFlow — Team Task Manager

<div align="center">

A full-stack collaborative task management web application where teams can create projects, assign tasks, and track progress with role-based access control.

### 🌐 [Live Demo → https://mukut-task-manager.up.railway.app](https://mukut-task-manager.up.railway.app)

---

### Built With

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

</div>

---

## ✨ Features

- 🔐 **User Authentication** — Signup/Login with JWT tokens & bcrypt password hashing
- 📁 **Project Management** — Create projects, add/remove team members
- ✅ **Task Management** — Create, assign, update, and delete tasks
- 📋 **Kanban Board** — Visual task board with To Do, In Progress, Done columns
- 📊 **Dashboard** — Real-time stats with charts (tasks by status, per project, overdue alerts)
- 🛡️ **Role-Based Access Control** — Admin (full control) vs Member (view/update assigned tasks)
- 🎨 **Premium UI** — Glassmorphism dark theme with animated gradients & micro-animations
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile devices

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| ⚙️ Backend | Node.js, Express.js | REST API server |
| 🗄️ Database | MongoDB Atlas (Mongoose ODM) | Cloud NoSQL database |
| 🔒 Auth | JWT + bcryptjs | Secure authentication |
| 🖥️ Frontend | HTML5, CSS3, Vanilla JS | UI with glassmorphism design |
| ☁️ Deployment | Railway | Cloud hosting & CI/CD |

---

## 📁 Project Structure

```
Team-Task-Manager/
├── server.js                 # Express entry point
├── config/
│   └── database.js           # MongoDB connection
├── models/
│   ├── User.js               # User schema (name, email, password)
│   ├── Project.js            # Project schema (name, members, roles)
│   └── Task.js               # Task schema (title, status, priority, assignee)
├── middleware/
│   ├── authMiddleware.js      # JWT token verification
│   └── roleMiddleware.js      # Role-based access (Admin/Member)
├── controllers/
│   ├── authController.js      # Signup, Login, Profile
│   ├── projectController.js   # CRUD + member management
│   ├── taskController.js      # CRUD with role restrictions
│   └── dashboardController.js # Aggregated stats & charts
├── routes/
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   ├── taskRoutes.js
│   └── dashboardRoutes.js
└── public/                    # Frontend (served as static files)
    ├── index.html             # Dashboard page
    ├── login.html             # Auth page (Sign In / Sign Up)
    ├── projects.html          # Projects listing
    ├── project.html           # Kanban board + team panel
    ├── css/style.css          # Complete design system
    └── js/                    # Client-side JavaScript
```

---

## 🚀 Setup & Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/MK-codes365/Ethara-ai-Assignment.git
cd Ethara-ai-Assignment
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file** (copy from `.env.example`)
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/team-task-manager
JWT_SECRET=your_secret_key_here
PORT=3000
```

4. **Start the server**
```bash
npm run dev
```

5. **Open** `http://localhost:3000` in your browser

---

## 🌐 Deployment (Railway)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variables:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a strong secret key
   - `PORT` — 3000
4. Deploy! Railway auto-detects Node.js and runs `npm start`

---

## 📡 API Endpoints

### 🔐 Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Get current user |

### 📁 Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create project |
| GET | `/api/projects` | List my projects |
| GET | `/api/projects/:id` | Get project details |
| POST | `/api/projects/:id/members` | Add member (Admin only) |
| DELETE | `/api/projects/:id/members/:userId` | Remove member (Admin only) |

### ✅ Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects/:id/tasks` | Create task (Admin only) |
| GET | `/api/projects/:id/tasks` | List tasks |
| PUT | `/api/projects/:id/tasks/:taskId` | Update task |
| DELETE | `/api/projects/:id/tasks/:taskId` | Delete task (Admin only) |

### 📊 Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard stats |

---

## 👥 Role Permissions (RBAC)

| Action | Admin | Member |
|--------|-------|--------|
| Create/Delete tasks | ✅ | ❌ |
| Edit all task fields | ✅ | ❌ |
| Update task status | ✅ | ✅ (own tasks) |
| Add/Remove members | ✅ | ❌ |
| View project tasks | ✅ (all) | ✅ (assigned) |

---

## 📝 License

MIT

---

<div align="center">

**Made with ❤️ by Mukut Kumar**

</div>
