if (!requireAuth()) throw new Error('Not authenticated');
const user = getUser();
document.getElementById('navAvatar').textContent = user.name.charAt(0).toUpperCase();
document.getElementById('navName').textContent = user.name;

const params = new URLSearchParams(window.location.search);
const projectId = params.get('id');
if (!projectId) { window.location.href = '/projects.html'; }

let currentProject = null;
let myRole = 'Member';

// --- Load Project ---
async function loadProject() {
  try {
    const { project } = await apiGet(`/projects/${projectId}`);
    currentProject = project;
    document.getElementById('projectTitle').textContent = project.name;
    document.getElementById('projectDesc').textContent = project.description || '';

    const me = project.members.find(m => m.userId._id === user._id);
    myRole = me ? me.role : 'Member';

    if (myRole === 'Admin') {
      document.getElementById('adminActions').style.display = 'block';
      document.getElementById('addMemberBtn').style.display = 'inline-flex';
    }

    renderMembers(project.members);
    loadTasks();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// --- Render Members ---
function renderMembers(members) {
  const list = document.getElementById('membersList');
  list.innerHTML = members.map(m => {
    const u = m.userId;
    const isMe = u._id === user._id;
    return `
      <div class="member-item">
        <div class="member-info">
          <div class="member-avatar">${u.name.charAt(0).toUpperCase()}</div>
          <div>
            <div class="member-name">${esc(u.name)}${isMe ? ' (You)' : ''}</div>
            <div class="member-email">${esc(u.email)}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="badge badge-${m.role.toLowerCase()}">${m.role}</span>
          ${myRole === 'Admin' && !isMe ? `<button class="btn btn-danger btn-sm" onclick="removeMember('${u._id}')">✕</button>` : ''}
        </div>
      </div>`;
  }).join('');

  // Populate assignee dropdown
  const sel = document.getElementById('taskAssignee');
  sel.innerHTML = '<option value="">Unassigned</option>' +
    members.map(m => `<option value="${m.userId._id}">${esc(m.userId.name)}</option>`).join('');
}

// --- Load Tasks ---
async function loadTasks() {
  try {
    const { tasks } = await apiGet(`/projects/${projectId}/tasks`);
    const todo = tasks.filter(t => t.status === 'To Do');
    const progress = tasks.filter(t => t.status === 'In Progress');
    const done = tasks.filter(t => t.status === 'Done');

    document.getElementById('todoCount').textContent = todo.length;
    document.getElementById('progressCount').textContent = progress.length;
    document.getElementById('doneCount').textContent = done.length;

    document.getElementById('todoTasks').innerHTML = todo.map(renderTaskCard).join('') || emptyCol();
    document.getElementById('progressTasks').innerHTML = progress.map(renderTaskCard).join('') || emptyCol();
    document.getElementById('doneTasks').innerHTML = done.map(renderTaskCard).join('') || emptyCol();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function renderTaskCard(t) {
  const prClass = t.priority === 'High' ? 'high' : t.priority === 'Low' ? 'low' : 'medium';
  const overdueClass = t.dueDate && isOverdue(t.dueDate) && t.status !== 'Done' ? 'overdue' : '';
  return `
    <div class="task-card" onclick="openEditTask('${t._id}')">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px">
        <h4>${esc(t.title)}</h4>
        <span class="badge badge-${prClass}">${t.priority}</span>
      </div>
      ${t.description ? `<p>${esc(t.description.substring(0, 80))}${t.description.length > 80 ? '...' : ''}</p>` : ''}
      <div class="task-meta">
        ${t.assignedTo ? `<span class="task-assignee">👤 ${esc(t.assignedTo.name)}</span>` : '<span class="task-assignee" style="opacity:0.5">Unassigned</span>'}
        ${t.dueDate ? `<span class="task-due ${overdueClass}">📅 ${formatDate(t.dueDate)}</span>` : ''}
      </div>
    </div>`;
}

function emptyCol() { return '<p style="font-size:12px;color:var(--text-muted);text-align:center;padding:16px">No tasks</p>'; }

// --- Task Modal ---
let allTasks = [];
function openTaskModal() {
  document.getElementById('editTaskId').value = '';
  document.getElementById('taskModalTitle').textContent = 'Create Task';
  document.getElementById('taskSubmitBtn').textContent = 'Create Task';
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDesc').value = '';
  document.getElementById('taskAssignee').value = '';
  document.getElementById('taskPriority').value = 'Medium';
  document.getElementById('taskStatus').value = 'To Do';
  document.getElementById('taskDue').value = '';
  document.getElementById('taskModal').classList.add('active');
}

async function openEditTask(taskId) {
  try {
    const { tasks } = await apiGet(`/projects/${projectId}/tasks`);
    const t = tasks.find(x => x._id === taskId);
    if (!t) return;

    document.getElementById('editTaskId').value = t._id;
    document.getElementById('taskModalTitle').textContent = 'Edit Task';
    document.getElementById('taskSubmitBtn').textContent = 'Save Changes';
    document.getElementById('taskTitle').value = t.title;
    document.getElementById('taskDesc').value = t.description || '';
    document.getElementById('taskAssignee').value = t.assignedTo?._id || '';
    document.getElementById('taskPriority').value = t.priority;
    document.getElementById('taskStatus').value = t.status;
    document.getElementById('taskDue').value = t.dueDate ? t.dueDate.substring(0,10) : '';

    // Disable fields for members (they can only change status)
    const isAdmin = myRole === 'Admin';
    document.getElementById('taskTitle').disabled = !isAdmin;
    document.getElementById('taskDesc').disabled = !isAdmin;
    document.getElementById('taskAssignee').disabled = !isAdmin;
    document.getElementById('taskPriority').disabled = !isAdmin;
    document.getElementById('taskDue').disabled = !isAdmin;

    // Add delete button for admin
    let delBtn = document.getElementById('deleteTaskBtn');
    if (isAdmin && !delBtn) {
      delBtn = document.createElement('button');
      delBtn.id = 'deleteTaskBtn';
      delBtn.className = 'btn btn-danger';
      delBtn.textContent = 'Delete';
      delBtn.type = 'button';
      delBtn.onclick = () => deleteTask(taskId);
      document.querySelector('#taskModal .modal-actions').prepend(delBtn);
    } else if (!isAdmin && delBtn) {
      delBtn.remove();
    } else if (isAdmin && delBtn) {
      delBtn.onclick = () => deleteTask(taskId);
    }

    document.getElementById('taskModal').classList.add('active');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function closeTaskModal() {
  document.getElementById('taskModal').classList.remove('active');
  // Re-enable fields
  ['taskTitle','taskDesc','taskAssignee','taskPriority','taskDue'].forEach(id => {
    document.getElementById(id).disabled = false;
  });
  const delBtn = document.getElementById('deleteTaskBtn');
  if (delBtn) delBtn.remove();
}

async function handleTaskSubmit(e) {
  e.preventDefault();
  const taskId = document.getElementById('editTaskId').value;
  const body = {
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('taskDesc').value,
    assignedTo: document.getElementById('taskAssignee').value || null,
    priority: document.getElementById('taskPriority').value,
    status: document.getElementById('taskStatus').value,
    dueDate: document.getElementById('taskDue').value || null
  };
  try {
    if (taskId) {
      await apiPut(`/projects/${projectId}/tasks/${taskId}`, body);
      showToast('Task updated!');
    } else {
      await apiPost(`/projects/${projectId}/tasks`, body);
      showToast('Task created!');
    }
    closeTaskModal();
    loadTasks();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteTask(taskId) {
  if (!confirm('Delete this task?')) return;
  try {
    await apiDelete(`/projects/${projectId}/tasks/${taskId}`);
    showToast('Task deleted!');
    closeTaskModal();
    loadTasks();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// --- Member Modal ---
function openMemberModal() { document.getElementById('memberModal').classList.add('active'); }
function closeMemberModal() { document.getElementById('memberModal').classList.remove('active'); }

async function handleAddMember(e) {
  e.preventDefault();
  try {
    const data = await apiPost(`/projects/${projectId}/members`, {
      email: document.getElementById('memberEmail').value
    });
    showToast(data.message);
    closeMemberModal();
    document.getElementById('memberEmail').value = '';
    loadProject();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function removeMember(userId) {
  if (!confirm('Remove this member?')) return;
  try {
    await apiDelete(`/projects/${projectId}/members/${userId}`);
    showToast('Member removed');
    loadProject();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

loadProject();
