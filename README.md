# 🚀 TaskFlow — Team Task Manager

A full-stack collaborative task management web application where teams can create projects, assign tasks, and track progress with role-based access control.

## ✨ Features

- **User Authentication** — Signup/Login with JWT tokens
- **Project Management** — Create projects, add/remove team members
- **Task Management** — Create, assign, update, and delete tasks
- **Kanban Board** — Visual task board with To Do, In Progress, Done columns
- **Dashboard** — Stats overview with charts (tasks by status, per project, overdue)
- **Role-Based Access** — Admin (full control) and Member (view/update assigned tasks)

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Frontend | Vanilla HTML, CSS, JavaScript |
| Deployment | Railway |

## 📁 Project Structure

```
├── server.js              # Express entry point
├── config/database.js     # MongoDB connection
├── models/                # Mongoose schemas (User, Project, Task)
├── middleware/             # Auth & role-based access middleware
├── controllers/           # Business logic for each resource
├── routes/                # API route definitions
└── public/                # Frontend (HTML, CSS, JS)
```

## 🚀 Setup & Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd team-task-manager
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

## 🌐 Deployment (Railway)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variables:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a strong secret key
   - `PORT` — 3000 (Railway auto-assigns)
4. Deploy! Railway will auto-detect Node.js and run `npm start`

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create project |
| GET | `/api/projects` | List my projects |
| GET | `/api/projects/:id` | Get project details |
| POST | `/api/projects/:id/members` | Add member (Admin) |
| DELETE | `/api/projects/:id/members/:userId` | Remove member (Admin) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects/:id/tasks` | Create task (Admin) |
| GET | `/api/projects/:id/tasks` | List tasks |
| PUT | `/api/projects/:id/tasks/:taskId` | Update task |
| DELETE | `/api/projects/:id/tasks/:taskId` | Delete task (Admin) |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard stats |

## 👥 Role Permissions

| Action | Admin | Member |
|--------|-------|--------|
| Create/Delete tasks | ✅ | ❌ |
| Edit all task fields | ✅ | ❌ |
| Update task status | ✅ | ✅ (own tasks) |
| Add/Remove members | ✅ | ❌ |
| View project tasks | ✅ (all) | ✅ (assigned) |

## 📝 License

MIT
