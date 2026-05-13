const mongoose = require('mongoose');

/*
  Project Schema
  - name: project title
  - description: optional details about the project
  - createdBy: the user who created this project (auto becomes Admin)
  - members: array of { userId, role } pairs
*/
const memberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Member'],
    default: 'Member'
  }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [memberSchema]
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
