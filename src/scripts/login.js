// src/scripts/login.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const btnLogin = document.querySelector('.btn-login');
    
    // Инициализация частиц
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });
    
    // Переключение видимости пароля
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
    
    // Обработка формы входа
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Активируем состояние загрузки
        btnLogin.classList.add('loading');
        
        authService.login(username, password, remember)
            .then(user => {
                // Успешный вход
                showAlert(`Добро пожаловать, ${user.name}!`, 'success');
                
                // Перенаправляем на главную страницу после задержки
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            })
            .catch(error => {
                // Ошибка входа
                btnLogin.classList.remove('loading');
                showAlert(error.message, 'error');
                shakeForm();
            });
    });
    
    // Показать кастомный алерт
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `custom-alert ${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => {
                alert.remove();
            }, 500);
        }, 3000);
    }
    
    // Анимация тряски формы при ошибке
    function shakeForm() {
        const loginCard = document.querySelector('.login-card');
        loginCard.style.animation = 'none';
        void loginCard.offsetWidth; // Trigger reflow
        loginCard.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        
        setTimeout(() => {
            loginCard.style.animation = 'float 6s ease-in-out infinite';
        }, 500);
    }
    
    // Добавляем keyframe для тряски
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
    `;
    document.head.appendChild(style);
});