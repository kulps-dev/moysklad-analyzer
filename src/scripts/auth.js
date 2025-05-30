<<<<<<< HEAD
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
=======
class AuthService {
    constructor() {
        this.users = [
            { username: 'admin', password: 'admin123', name: 'Администратор', avatar: '👨‍💼' },
            { username: 'manager', password: 'manager123', name: 'Менеджер', avatar: '👩‍💼' },
            { username: 'analyst', password: 'analyst123', name: 'Аналитик', avatar: '🧑‍💻' }
        ];
        this.currentUser = null;
        this.init();
    }

    init() {
        // Проверяем сохраненные данные во всех хранилищах
        const savedUser = localStorage.getItem('currentUser') || 
                         sessionStorage.getItem('currentUser');
        
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                // Проверяем, что пользователь существует в системе
                if (!this.users.find(u => u.username === this.currentUser.username)) {
                    this.logout();
                }
            } catch (e) {
                console.error('Ошибка при чтении данных пользователя:', e);
                this.logout();
            }
        }
    }

    login(username, password, remember) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = this.users.find(u => 
                    u.username === username && u.password === password
                );
                
                if (user) {
                    this.currentUser = user;
                    const userData = JSON.stringify(user);
                    
                    if (remember) {
                        localStorage.setItem('currentUser', userData);
                        localStorage.setItem('rememberMe', 'true');
                    } else {
                        sessionStorage.setItem('currentUser', userData);
                        localStorage.removeItem('rememberMe');
                    }
                    
                    resolve(user);
                } else {
                    reject(new Error('Неверный логин или пароль'));
                }
            }, 300); // Уменьшил задержку для тестирования
        });
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberMe');
        sessionStorage.removeItem('currentUser');
    }

    isAuthenticated() {
        // Дополнительная проверка на случай, если пользователь был удален из системы
        if (this.currentUser) {
            return !!this.users.find(u => u.username === this.currentUser.username);
        }
        return false;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // Новый метод для проверки состояния
    checkAuth() {
        if (!this.isAuthenticated() && !window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }
}

const authService = new AuthService();

// Проверяем авторизацию при загрузке скрипта
authService.checkAuth();
>>>>>>> HEAD@{1}
