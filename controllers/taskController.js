const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');

// Validation rules
const createTaskValidation = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('status').optional().isIn(['To Do', 'In Progress', 'Done']).withMessage('Invalid status')
];

/*
  POST /api/projects/:projectId/tasks
  Creates a new task within a project (Admin only).
*/
async function createTask(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, assignedTo, priority, dueDate, status } = req.body;

    const task = await Task.create({
      title,
      description: description || '',
      projectId: req.params.projectId,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      priority: priority || 'Medium',
      status: status || 'To Do',
      dueDate: dueDate || null
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task: populatedTask
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/*
  GET /api/projects/:projectId/tasks
  Lists all tasks in a project.
  Members only see tasks assigned to them.
  Admins see all tasks.
*/
async function getProjectTasks(req, res) {
  try {
    let query = { projectId: req.params.projectId };

    // Members can only see their own assigned tasks
    if (req.memberRole === 'Member') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/*
  PUT /api/projects/:projectId/tasks/:taskId
  Updates a task.
  Admin: can update all fields.
  Member: can only update the status of tasks assigned to them.
*/
async function updateTask(req, res) {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      projectId: req.params.projectId
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Member can only update status of their own tasks
    if (req.memberRole === 'Member') {
      if (task.assignedTo?.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only update tasks assigned to you.'
        });
      }
      // Only allow status change
      if (req.body.status) {
        task.status = req.body.status;
      }
    } else {
      // Admin can update everything
      if (req.body.title) task.title = req.body.title;
      if (req.body.description !== undefined) task.description = req.body.description;
      if (req.body.assignedTo !== undefined) task.assignedTo = req.body.assignedTo || null;
      if (req.body.status) task.status = req.body.status;
      if (req.body.priority) task.priority = req.body.priority;
      if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate || null;
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Task updated successfully!',
      task: updatedTask
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/*
  DELETE /api/projects/:projectId/tasks/:taskId
  Deletes a task (Admin only).
*/
async function deleteTask(req, res) {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      projectId: req.params.projectId
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.json({ success: true, message: 'Task deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
  createTaskValidation
};
