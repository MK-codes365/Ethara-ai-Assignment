================================================================================
                    TASKFLOW - TEAM TASK MANAGER
================================================================================

Live Demo:  https://mukut-task-manager.up.railway.app
GitHub:     https://github.com/MK-codes365/Ethara-ai-Assignment

================================================================================
                           ABOUT THE PROJECT
================================================================================

TaskFlow is a full-stack collaborative task management web application where 
teams can create projects, assign tasks, and track progress with role-based 
access control (RBAC).

================================================================================
                            TECH STACK
================================================================================

  Backend:     Node.js + Express.js
  Database:    MongoDB Atlas (Mongoose ODM)
  Auth:        JWT (jsonwebtoken) + bcryptjs
  Frontend:    HTML5, CSS3, Vanilla JavaScript
  Deployment:  Railway (CI/CD from GitHub)
  Design:      Glassmorphism dark theme with animated gradients

================================================================================
                             FEATURES
================================================================================

  [1] User Authentication
      - Signup and Login with JWT token-based authentication
      - Passwords securely hashed with bcryptjs

  [2] Project Management
      - Create new projects
      - Add and remove team members by email
      - Each project has its own team and task board

  [3] Task Management (Kanban Board)
      - Visual board with 3 columns: To Do, In Progress, Done
      - Create, edit, assign, and delete tasks
      - Set priority (Low, Medium, High) and due dates

  [4] Dashboard with Analytics
      - Total tasks, projects, completed, and overdue counts
      - Bar charts showing tasks by status and per project
      - Overdue task alerts with due dates

  [5] Role-Based Access Control (RBAC)
      - Admin: Full control (create/delete tasks, manage members)
      - Member: Can only view and update status of assigned tasks

  [6] Responsive Design
      - Works on desktop, tablet, and mobile devices
      - Premium glassmorphism UI with dark theme

================================================================================
                         PROJECT STRUCTURE
================================================================================

  Team-Task-Manager/
  |
  |-- server.js                   Express entry point
  |-- config/
  |   |-- database.js             MongoDB connection
  |
  |-- models/
  |   |-- User.js                 User schema (name, email, password)
  |   |-- Project.js              Project schema (name, members, roles)
  |   |-- Task.js                 Task schema (title, status, priority)
  |
  |-- middleware/
  |   |-- authMiddleware.js       JWT token verification
  |   |-- roleMiddleware.js       Role-based access (Admin/Member)
  |
  |-- controllers/
  |   |-- authController.js       Signup, Login, Profile
  |   |-- projectController.js    CRUD + member management
  |   |-- taskController.js       CRUD with role restrictions
  |   |-- dashboardController.js  Aggregated stats & charts
  |
  |-- routes/
  |   |-- authRoutes.js
  |   |-- projectRoutes.js
  |   |-- taskRoutes.js
  |   |-- dashboardRoutes.js
  |
  |-- public/                     Frontend (served as static files)
      |-- index.html              Dashboard page
      |-- login.html              Auth page (Sign In / Sign Up)
      |-- projects.html           Projects listing
      |-- project.html            Kanban board + team panel
      |-- css/style.css           Complete design system
      |-- js/                     Client-side JavaScript

================================================================================
                          API ENDPOINTS
================================================================================

  AUTH
  ----
  POST   /api/auth/signup                     Register new user
  POST   /api/auth/login                      Login (returns JWT)
  GET    /api/auth/me                         Get current user

  PROJECTS
  --------
  POST   /api/projects                        Create project
  GET    /api/projects                        List my projects
  GET    /api/projects/:id                    Get project details
  POST   /api/projects/:id/members            Add member (Admin only)
  DELETE /api/projects/:id/members/:userId    Remove member (Admin only)

  TASKS
  -----
  POST   /api/projects/:id/tasks              Create task (Admin only)
  GET    /api/projects/:id/tasks              List tasks
  PUT    /api/projects/:id/tasks/:taskId      Update task
  DELETE /api/projects/:id/tasks/:taskId      Delete task (Admin only)

  DASHBOARD
  ---------
  GET    /api/dashboard/stats                 Get dashboard stats

================================================================================
                       ROLE PERMISSIONS (RBAC)
================================================================================

  Action                  | Admin    | Member
  ------------------------|----------|------------------
  Create/Delete tasks     | Yes      | No
  Edit all task fields    | Yes      | No
  Update task status      | Yes      | Yes (own tasks)
  Add/Remove members      | Yes      | No
  View project tasks      | Yes      | Yes (assigned)

================================================================================
                      SETUP & RUN LOCALLY
================================================================================

  Prerequisites:
    - Node.js 18+
    - MongoDB Atlas account (free tier)

  Steps:

  1. Clone the repository
     git clone https://github.com/MK-codes365/Ethara-ai-Assignment.git
     cd Ethara-ai-Assignment

  2. Install dependencies
     npm install

  3. Create .env file (copy from .env.example)
     MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/team-task-manager
     JWT_SECRET=your_secret_key_here
     PORT=3000

  4. Start the server
     npm run dev

  5. Open http://localhost:3000 in your browser

================================================================================
                           LICENSE
================================================================================

  MIT License

================================================================================

  Made with love by Mukut Kumar

================================================================================
