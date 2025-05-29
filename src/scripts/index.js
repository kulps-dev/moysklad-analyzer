document.addEventListener('DOMContentLoaded', function() {
    // Ждем загрузки всех шрифтов и изображений
    Promise.all([
        document.fonts.ready,
        new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        })
    ]).then(() => {
        // Активируем анимацию карточек
        activateCardsAnimation();
        
        // Добавляем эффекты при наведении
        setupHoverEffects();
    });
});

function activateCardsAnimation() {
    const appCards = document.querySelectorAll('.app-card');
    
    // Делаем карточки видимыми перед анимацией
    appCards.forEach(card => {
        card.style.visibility = 'visible';
    });
    
    // Добавляем обработчики для плавного появления
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
}

function setupHoverEffects() {
    const appCards = document.querySelectorAll('.app-card');
    
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