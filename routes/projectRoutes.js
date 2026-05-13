const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const checkProjectRole = require('../middleware/roleMiddleware');
const {
  createProject,
  getMyProjects,
  getProjectById,
  addMember,
  removeMember,
  createProjectValidation
} = require('../controllers/projectController');

// All project routes need authentication
router.use(authMiddleware);

// Create and list projects
router.post('/', createProjectValidation, createProject);
router.get('/', getMyProjects);

// Single project details (any member can view)
router.get('/:id', getProjectById);

// Member management (Admin only)
router.post('/:id/members', checkProjectRole('Admin'), addMember);
router.delete('/:id/members/:userId', checkProjectRole('Admin'), removeMember);

module.exports = router;
