document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    if (!authService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Обновляем профиль пользователя
    const user = authService.getCurrentUser();
    if (user) {
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        
        if (userAvatar) userAvatar.textContent = user.avatar;
        if (userName) userName.textContent = user.name;
    }

    // Настраиваем кнопку выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            authService.logout();
            window.location.href = 'login.html';
        });
    }

    // Инициализация анимаций
    initAnimations();
});

function initAnimations() {
    // Активация карточек
    const appCards = document.querySelectorAll('.app-card');
    
    appCards.forEach(card => {
        card.style.visibility = 'visible';
        card.style.opacity = '0';
        card.style.transition = 'opacity 0.5s ease';
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    appCards.forEach(card => {
        observer.observe(card);
    });

    // Эффекты при наведении
    appCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 15px 35px -10px rgba(0, 0, 0, 0.25)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 10px 30px -15px rgba(0, 0, 0, 0.2)';
        });
    });
}