// src/scripts/auth.js
export function initAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn && !window.location.pathname.endsWith('/login.html')) {
        window.location.href = 'login.html';
    }
}

export function login(username, password) {
    // Здесь должна быть проверка с сервером, пока заглушка
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
        return true;
    }
    return false;
}

export function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

export function isAuthenticated() {
    return localStorage.getItem('isLoggedIn') === 'true';
}


async function serverLogin(username, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) throw new Error('Ошибка авторизации');
        
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}

// Обновите функцию login:
export async function login(username, password) {
    const success = await serverLogin(username, password);
    if (success) {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
    }
    return success;
}