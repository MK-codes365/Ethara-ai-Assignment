const Task = require('../models/Task');
const Project = require('../models/Project');

/*
  GET /api/dashboard/stats
  Returns aggregated dashboard statistics for the logged-in user:
  - Total tasks across all projects
  - Tasks by status (To Do, In Progress, Done)
  - Tasks per project
  - Overdue tasks
*/
async function getDashboardStats(req, res) {
  try {
    const userId = req.user._id;

    // Get all projects where user is a member
    const userProjects = await Project.find({ 'members.userId': userId });
    const projectIds = userProjects.map((p) => p._id);

    // Get all tasks from user's projects
    const allTasks = await Task.find({ projectId: { $in: projectIds } })
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name');

    // Total tasks
    const totalTasks = allTasks.length;

    // Tasks by status
    const tasksByStatus = {
      'To Do': allTasks.filter((t) => t.status === 'To Do').length,
      'In Progress': allTasks.filter((t) => t.status === 'In Progress').length,
      'Done': allTasks.filter((t) => t.status === 'Done').length
    };

    // Tasks assigned to current user
    const myTasks = allTasks.filter(
      (t) => t.assignedTo && t.assignedTo._id.toString() === userId.toString()
    );

    // Overdue tasks (due date is in the past and not Done)
    const now = new Date();
    const overdueTasks = allTasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Done'
    );

    // Tasks per project
    const tasksPerProject = userProjects.map((project) => ({
      projectName: project.name,
      projectId: project._id,
      taskCount: allTasks.filter(
        (t) => t.projectId._id.toString() === project._id.toString()
      ).length
    }));

    // Tasks per user (across all projects)
    const userTaskMap = {};
    allTasks.forEach((task) => {
      if (task.assignedTo) {
        const key = task.assignedTo._id.toString();
        if (!userTaskMap[key]) {
          userTaskMap[key] = {
            userName: task.assignedTo.name,
            taskCount: 0
          };
        }
        userTaskMap[key].taskCount++;
      }
    });
    const tasksPerUser = Object.values(userTaskMap);

    res.json({
      success: true,
      stats: {
        totalTasks,
        tasksByStatus,
        myTasksCount: myTasks.length,
        overdueCount: overdueTasks.length,
        overdueTasks: overdueTasks.map((t) => ({
          _id: t._id,
          title: t.title,
          dueDate: t.dueDate,
          projectName: t.projectId.name
        })),
        tasksPerProject,
        tasksPerUser,
        totalProjects: userProjects.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getDashboardStats };
