/*
  api.js — Shared API Helper
  Wraps fetch() with auth token handling.
*/
const API_BASE = '/api';

function getToken() { return localStorage.getItem('token'); }
function saveToken(token) { localStorage.setItem('token', token); }
function saveUser(user) { localStorage.setItem('user', JSON.stringify(user)); }
function getUser() {
  const d = localStorage.getItem('user');
  return d ? JSON.parse(d) : null;
}
function clearAuth() { localStorage.removeItem('token'); localStorage.removeItem('user'); }
function isLoggedIn() { return !!getToken(); }
function requireAuth() {
  if (!isLoggedIn()) { window.location.href = '/login.html'; return false; }
  return true;
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const config = {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...options
  };
  if (config.body && typeof config.body === 'object') config.body = JSON.stringify(config.body);
  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

function apiGet(ep) { return apiRequest(ep, { method: 'GET' }); }
function apiPost(ep, body) { return apiRequest(ep, { method: 'POST', body }); }
function apiPut(ep, body) { return apiRequest(ep, { method: 'PUT', body }); }
function apiDelete(ep) { return apiRequest(ep, { method: 'DELETE' }); }

function showToast(message, type = 'success') {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = message;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}

function formatDate(d) {
  if (!d) return '\u2014';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function isOverdue(d) { return d ? new Date(d) < new Date() : false; }
function logout() { clearAuth(); window.location.href = '/login.html'; }
