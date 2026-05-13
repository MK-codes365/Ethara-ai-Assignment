if (!requireAuth()) throw new Error('Not authenticated');

// Set nav user info
const user = getUser();
if (user) {
  document.getElementById('navAvatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('navName').textContent = user.name;
}

async function loadDashboard() {
  try {
    const { stats } = await apiGet('/dashboard/stats');

    // Update stat cards
    document.getElementById('totalTasks').textContent = stats.totalTasks;
    document.getElementById('totalProjects').textContent = stats.totalProjects;
    document.getElementById('doneTasks').textContent = stats.tasksByStatus['Done'];
    document.getElementById('myTasks').textContent = stats.myTasksCount;
    document.getElementById('overdueTasks').textContent = stats.overdueCount;

    // Status bar chart
    const statusChart = document.getElementById('statusChart');
    const maxStatus = Math.max(stats.tasksByStatus['To Do'], stats.tasksByStatus['In Progress'], stats.tasksByStatus['Done'], 1);
    statusChart.innerHTML = `
      ${makeBar('To Do', stats.tasksByStatus['To Do'], maxStatus, 'info')}
      ${makeBar('In Progress', stats.tasksByStatus['In Progress'], maxStatus, 'warning')}
      ${makeBar('Done', stats.tasksByStatus['Done'], maxStatus, 'success')}
    `;

    // Project bar chart
    const projectChart = document.getElementById('projectChart');
    if (stats.tasksPerProject.length === 0) {
      projectChart.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">No projects yet</p>';
    } else {
      const maxP = Math.max(...stats.tasksPerProject.map(p => p.taskCount), 1);
      projectChart.innerHTML = stats.tasksPerProject.map(p =>
        makeBar(p.projectName.substring(0,15), p.taskCount, maxP, 'accent')
      ).join('');
    }

    // Overdue section
    if (stats.overdueTasks.length > 0) {
      document.getElementById('overdueSection').style.display = 'block';
      const overdueCountEl = document.getElementById('overdueCount');
      if (overdueCountEl) overdueCountEl.textContent = stats.overdueTasks.length;
      document.getElementById('overdueList').innerHTML = stats.overdueTasks.map(t => `
        <div class="overdue-item">
          <div>
            <div class="task-title">${t.title}</div>
            <div class="project-name">${t.projectName}</div>
          </div>
          <span class="badge badge-overdue">Due ${formatDate(t.dueDate)}</span>
        </div>
      `).join('');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function makeBar(label, value, max, color) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return `
    <div class="bar-row">
      <span class="bar-label">${label}</span>
      <div class="bar-track">
        <div class="bar-fill ${color}" style="width:${Math.max(pct, 2)}%">${value}</div>
      </div>
    </div>
  `;
}

loadDashboard();
