// Redirect if already logged in
if (isLoggedIn()) window.location.href = '/';

function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  if (tab === 'login') {
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
    document.getElementById('loginForm').classList.add('active');
  } else {
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
    document.getElementById('signupForm').classList.add('active');
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  btn.textContent = 'Signing in...'; btn.disabled = true;
  try {
    const data = await apiPost('/auth/login', {
      email: document.getElementById('loginEmail').value,
      password: document.getElementById('loginPassword').value
    });
    saveToken(data.token);
    saveUser(data.user);
    showToast('Welcome back!');
    setTimeout(() => window.location.href = '/', 500);
  } catch (err) {
    showToast(err.message, 'error');
    btn.textContent = 'Sign In'; btn.disabled = false;
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const btn = document.getElementById('signupBtn');
  btn.textContent = 'Creating account...'; btn.disabled = true;
  try {
    const data = await apiPost('/auth/signup', {
      name: document.getElementById('signupName').value,
      email: document.getElementById('signupEmail').value,
      password: document.getElementById('signupPassword').value
    });
    saveToken(data.token);
    saveUser(data.user);
    showToast('Account created!');
    setTimeout(() => window.location.href = '/', 500);
  } catch (err) {
    showToast(err.message, 'error');
    btn.textContent = 'Create Account'; btn.disabled = false;
  }
}
