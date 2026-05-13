const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const checkProjectRole = require('../middleware/roleMiddleware');
const {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
  createTaskValidation
} = require('../controllers/taskController');

// All task routes need authentication
router.use(authMiddleware);

// Create task (Admin only)
router.post(
  '/:projectId/tasks',
  checkProjectRole('Admin'),
  createTaskValidation,
  createTask
);

// List tasks (Admin sees all, Member sees own)
router.get(
  '/:projectId/tasks',
  checkProjectRole('Admin', 'Member'),
  getProjectTasks
);

// Update task (Admin full edit, Member status only)
router.put(
  '/:projectId/tasks/:taskId',
  checkProjectRole('Admin', 'Member'),
  updateTask
);

// Delete task (Admin only)
router.delete(
  '/:projectId/tasks/:taskId',
  checkProjectRole('Admin'),
  deleteTask
);

module.exports = router;
