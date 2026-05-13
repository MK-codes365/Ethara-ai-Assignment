const Project = require('../models/Project');

/*
  checkProjectRole
  Factory function that returns middleware to check if the user
  has the required role(s) in a project.

  Usage:
    checkProjectRole('Admin')          - only Admins
    checkProjectRole('Admin', 'Member') - Admins or Members
*/
function checkProjectRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const projectId = req.params.projectId || req.params.id;
      const userId = req.user._id.toString();

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found.'
        });
      }

      // Find the user in the project members list
      const member = project.members.find(
        (m) => m.userId.toString() === userId
      );

      if (!member) {
        return res.status(403).json({
          success: false,
          message: 'You are not a member of this project.'
        });
      }

      if (!allowedRoles.includes(member.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
        });
      }

      // Attach project and member role to request for later use
      req.project = project;
      req.memberRole = member.role;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking project role.'
      });
    }
  };
}

module.exports = checkProjectRole;
