function getApiBase() {
    const host = window.location.hostname;
    const protocol = window.location.protocol || 'http:';
    return host ? `${protocol}//${host}:5000/api` : 'http://localhost:5000/api';
}

const API_BASE = getApiBase();

// DOM elements
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        showError('Please fill in all fields.');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (!res.ok) {
            console.error('Login response error:', res.status, data);
            showError(data.message || res.statusText || 'Invalid username or password');
            return;
        }

        localStorage.setItem('salama-token', data.token);
        localStorage.setItem('salama-user', JSON.stringify(data.user));

        if (data.user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else if (data.user.role === 'provider') {
            window.location.href = 'provider-dashboard.html';
        } else {
            window.location.href = 'customer-dashboard.html';
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Login failed. Please check the backend and try again.');
    }
});

// Show error message
function showError(message) {
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-600 mt-3';
        loginForm.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}
