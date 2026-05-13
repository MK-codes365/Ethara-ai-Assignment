const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

// Validation rules
const createProjectValidation = [
  body('name').trim().notEmpty().withMessage('Project name is required')
];

/*
  POST /api/projects
  Creates a new project. The creator automatically becomes Admin.
*/
async function createProject(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description: description || '',
      createdBy: req.user._id,
      members: [{ userId: req.user._id, role: 'Admin' }]
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully!',
      project
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/*
  GET /api/projects
  Lists all projects where the current user is a member.
*/
async function getMyProjects(req, res) {
  try {
    const projects = await Project.find({
      'members.userId': req.user._id
    })
      .populate('members.userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/*
  GET /api/projects/:id
  Returns a single project's details with member info.
*/
async function getProjectById(req, res) {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members.userId', 'name email')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    // Check if user is a member
    const isMember = project.members.some(
      (m) => m.userId._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/*
  POST /api/projects/:id/members
  Adds a user to the project (Admin only). Accepts email of user to add.
*/
async function addMember(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Find the user to add
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email.'
      });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    // Check if already a member
    const alreadyMember = project.members.some(
      (m) => m.userId.toString() === userToAdd._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'This user is already a member.'
      });
    }

    // Add as Member role
    project.members.push({ userId: userToAdd._id, role: 'Member' });
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('members.userId', 'name email');

    res.json({
      success: true,
      message: `${userToAdd.name} added to the project!`,
      project: updatedProject
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/*
  DELETE /api/projects/:id/members/:userId
  Removes a member from the project (Admin only).
  Admin cannot remove themselves.
*/
async function removeMember(req, res) {
  try {
    const { userId } = req.params;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    // Prevent admin from removing themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot remove yourself from the project.'
      });
    }

    // Remove member
    project.members = project.members.filter(
      (m) => m.userId.toString() !== userId
    );
    await project.save();

    // Also unassign any tasks assigned to this user in this project
    await Task.updateMany(
      { projectId: project._id, assignedTo: userId },
      { assignedTo: null }
    );

    const updatedProject = await Project.findById(project._id)
      .populate('members.userId', 'name email');

    res.json({
      success: true,
      message: 'Member removed successfully.',
      project: updatedProject
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  createProject,
  getMyProjects,
  getProjectById,
  addMember,
  removeMember,
  createProjectValidation
};
