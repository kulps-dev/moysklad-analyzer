<<<<<<< HEAD
=======
// Модифицируем app.js
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    checkAuth();
   // Анимация элементов при загрузке
   animateElements();
   
   // Инициализация кастомных алертов
   initCustomAlerts();
   
   // Добавление эффектов при наведении
   setupHoverEffects();
});

function animateElements() {
   const elements = document.querySelectorAll('.animate__animated');
   elements.forEach((el, index) => {
       el.style.opacity = '0';
       el.style.animationDelay = `${index * 0.1}s`;
   });
   
   setTimeout(() => {
       elements.forEach(el => {
           el.style.opacity = '1';
       });
   }, 100);
}

function initCustomAlerts() {
   window.showAlert = function(message, type = 'success') {
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
}

function setupHoverEffects() {
   // Эффект при наведении на кнопки
   const buttons = document.querySelectorAll('.btn');
   buttons.forEach(btn => {
       btn.addEventListener('mouseenter', function() {
           this.classList.add('float');
       });
       
       btn.addEventListener('mouseleave', function() {
           this.classList.remove('float');
       });
   });
   
   // Эффект при наведении на карточки
   const cards = document.querySelectorAll('.card, .app-card');
   cards.forEach(card => {
       card.addEventListener('mouseenter', function() {
           this.style.transform = 'translateY(-5px)';
       });
       
       card.addEventListener('mouseleave', function() {
           this.style.transform = 'translateY(0)';
       });
   });
}

// Функция для отображения статуса загрузки
function updateStatus(statusClass, message) {
   const statusBar = document.getElementById('status-bar');
   if (statusBar) {
       statusBar.className = `status-bar ${statusClass} show`;
       statusBar.innerHTML = message;
   }
}

// Функция для переключения состояния кнопки
function toggleButtonLoading(buttonId, isLoading) {
   const button = document.getElementById(buttonId);
   if (button) {
       const originalContent = button.innerHTML;
       
       if (isLoading) {
           button.innerHTML = '<i class="fas fa-spinner spinner"></i> Обработка...';
           button.disabled = true;
           button.classList.add('pulse');
       } else {
           button.innerHTML = originalContent;
           button.disabled = false;
           button.classList.remove('pulse');
       }
   }
}

function checkAuth() {
    if (!authService.isAuthenticated() && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Обновляем информацию о пользователе
    updateUserProfile();
    
    // Обработчик кнопки выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            authService.logout();
            window.location.href = 'login.html';
        });
    }
}

function updateUserProfile() {
    const user = authService.getCurrentUser();
    if (user) {
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        
        if (userAvatar) userAvatar.textContent = user.avatar;
        if (userName) userName.textContent = user.name;
    }
}
>>>>>>> HEAD@{1}
