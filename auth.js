// Debug Authentication System
console.log('🔐 Auth.js loaded successfully!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Content Loaded');
    
    const loginForm = document.getElementById('loginForm');
    console.log('Login form element:', loginForm);
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('✅ Login form event listener added');
    } else {
        console.log('❌ Login form not found!');
    }
    
    // Check if already logged in
    checkAuthentication();
});

function handleLogin(event) {
    event.preventDefault();
    console.log('🚀 Login form submitted!');
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    console.log('Username:', username);
    console.log('Password:', password);
    
    // Clear previous error
    if (errorMessage) {
        errorMessage.textContent = '';
    }
    
    // Validate inputs
    if (!username || !password) {
        console.log('❌ Empty username or password');
        if (errorMessage) {
            errorMessage.textContent = 'Username dan password harus diisi!';
        }
        return;
    }
    
    // Check credentials - REDIRECT TANPA .html
    if (username === 'admin' && password === 'admin') {
        console.log('✅ Admin credentials correct');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('username', 'Admin');
        console.log('Redirecting to admin dashboard...');
        window.location.href = '/admin/dashboard'; // TANPA .html
    } 
    else if (username === 'user' && password === 'user') {
        console.log('✅ User credentials correct');
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('username', 'User');
        console.log('Redirecting to user dashboard...');
        window.location.href = '/user/dashboard'; // TANPA .html
    } 
    else {
        console.log('❌ Invalid credentials');
        if (errorMessage) {
            errorMessage.textContent = 'Username atau password salah!';
        }
    }
}

function checkAuthentication() {
    const userRole = localStorage.getItem('userRole');
    const currentPath = window.location.pathname;
    
    console.log('🔍 Auth Check:');
    console.log('- User Role:', userRole);
    console.log('- Current Path:', currentPath);
    
    // If on login page but already logged in, redirect to dashboard
    if (userRole && (currentPath === '/' || currentPath.endsWith('index.html'))) {
        console.log('Already logged in, redirecting...');
        if (userRole === 'admin') {
            window.location.href = '/admin/dashboard';
        } else {
            window.location.href = '/user/dashboard';
        }
        return;
    }
    
    // If accessing protected pages without login
    if ((currentPath.includes('/admin/') || currentPath.includes('/user/')) && !userRole) {
        console.log('No authentication, redirecting to login');
        window.location.href = '/';
        return;
    }
    
    // If role doesn't match page
    if (currentPath.includes('/admin/') && userRole === 'user') {
        console.log('User trying to access admin, redirecting...');
        window.location.href = '/user/dashboard';
    } else if (currentPath.includes('/user/') && userRole === 'admin') {
        console.log('Admin trying to access user, redirecting...');
        window.location.href = '/admin/dashboard';
    }
    
    // Update username display if on dashboard
    updateUsernameDisplay();
}

function updateUsernameDisplay() {
    const usernameElement = document.getElementById('userName');
    const storedUsername = localStorage.getItem('username');
    
    if (usernameElement && storedUsername) {
        usernameElement.textContent = storedUsername;
        console.log('✅ Username updated:', storedUsername);
    }
}

// Global logout function
function logout() {
    console.log('👋 Logging out...');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    window.location.href = '/';
}