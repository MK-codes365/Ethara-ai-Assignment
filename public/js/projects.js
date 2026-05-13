if (!requireAuth()) throw new Error('Not authenticated');
const user = getUser();
if (user) {
  document.getElementById('navAvatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('navName').textContent = user.name;
}

async function loadProjects() {
  try {
    const { projects } = await apiGet('/projects');
    const container = document.getElementById('projectsList');
    if (projects.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon">📁</div>
          <h3>No projects yet</h3>
          <p>Create your first project to get started</p>
        </div>`;
      return;
    }
    container.innerHTML = projects.map(p => {
      const myRole = p.members.find(m => m.userId._id === user._id)?.role || 'Member';
      return `
        <div class="card project-card" onclick="window.location.href='/project.html?id=${p._id}'">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <h3>${escHtml(p.name)}</h3>
            <span class="badge badge-${myRole.toLowerCase()}">${myRole}</span>
          </div>
          <p class="project-desc">${escHtml(p.description || 'No description')}</p>
          <div class="project-meta">
            <span>👥 ${p.members.length} member${p.members.length !== 1 ? 's' : ''}</span>
            <span>📅 ${formatDate(p.createdAt)}</span>
          </div>
        </div>`;
    }).join('');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function openCreateModal() { document.getElementById('createModal').classList.add('active'); }
function closeCreateModal() { document.getElementById('createModal').classList.remove('active'); }

async function handleCreateProject(e) {
  e.preventDefault();
  const btn = document.getElementById('createBtn');
  btn.textContent = 'Creating...'; btn.disabled = true;
  try {
    await apiPost('/projects', {
      name: document.getElementById('projectName').value,
      description: document.getElementById('projectDesc').value
    });
    showToast('Project created!');
    closeCreateModal();
    document.getElementById('projectName').value = '';
    document.getElementById('projectDesc').value = '';
    loadProjects();
  } catch (err) {
    showToast(err.message, 'error');
  }
  btn.textContent = 'Create Project'; btn.disabled = false;
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

loadProjects();
