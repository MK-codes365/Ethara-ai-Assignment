TaskFlow - Team Task Manager
============================

Live URL: https://mukut-task-manager.up.railway.app
GitHub:   https://github.com/MK-codes365/Ethara-ai-Assignment


What is this?
-------------
This is a team task management app I built for the Ethara AI internship assignment.
It lets teams create projects, add members, assign tasks, and track everything
on a kanban board. There's also a dashboard that shows stats like how many tasks
are done, in progress, or overdue.

The whole thing runs on Node.js with Express for the backend, MongoDB for storing
data, and plain HTML/CSS/JS on the frontend. No React or anything — just vanilla JS.
I deployed it on Railway so you can try it out using the link above.


Tech I used
-----------
- Node.js & Express.js for the server
- MongoDB Atlas with Mongoose for the database
- JWT for login/auth, bcryptjs for hashing passwords
- HTML, CSS, JS for the frontend (dark theme with glassmorphism style)
- Railway for hosting


What it can do
--------------
- Sign up / Log in (JWT based auth)
- Create projects and invite team members by email
- Kanban board with 3 columns: To Do, In Progress, Done
- Create tasks, set priority (Low/Medium/High), assign to members, set due dates
- Dashboard with bar charts showing task stats and overdue alerts
- Role based access — Admins can do everything, Members can only update their own tasks
- Mobile responsive


How the roles work
------------------
Admins can:
  - Create and delete tasks
  - Edit any field on any task
  - Add or remove team members

Members can:
  - View tasks assigned to them
  - Update the status of their own tasks (like moving from To Do to In Progress)
  - They can't delete tasks or manage members


Project files
-------------
server.js              -> main entry point, sets up Express
config/database.js     -> connects to MongoDB
models/                -> User, Project, Task schemas
middleware/            -> auth check (JWT) and role check (Admin/Member)
controllers/           -> all the logic for auth, projects, tasks, dashboard
routes/                -> API route definitions
public/                -> frontend files (HTML pages, CSS, JS)


API routes
----------
POST   /api/auth/signup              - register
POST   /api/auth/login               - login, get token
GET    /api/auth/me                  - get logged in user

POST   /api/projects                 - create a project
GET    /api/projects                 - get all my projects
GET    /api/projects/:id             - get one project
POST   /api/projects/:id/members     - add a member (admin only)
DELETE /api/projects/:id/members/:uid - remove a member (admin only)

POST   /api/projects/:id/tasks       - create task (admin only)
GET    /api/projects/:id/tasks       - list tasks
PUT    /api/projects/:id/tasks/:tid  - update a task
DELETE /api/projects/:id/tasks/:tid  - delete task (admin only)

GET    /api/dashboard/stats          - get dashboard numbers


How to run it locally
---------------------
1. Clone the repo
   git clone https://github.com/MK-codes365/Ethara-ai-Assignment.git

2. Install packages
   npm install

3. Make a .env file with:
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=some_secret_key
   PORT=3000

4. Run it
   npm run dev

5. Go to http://localhost:3000


- Mukut Kumar
