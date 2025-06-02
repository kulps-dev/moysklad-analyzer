import Exporter from './exporter.js';

document.addEventListener('DOMContentLoaded', function() {
    initDatePickers();
    setupEventListeners();
    
    // Показать статус бар с анимацией
    setTimeout(() => {
        const statusBar = document.getElementById('status-bar');
        statusBar.classList.add('show');
    }, 500);
    
    // Добавить анимацию карточкам
    animateCards();
});

function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

function initDatePickers() {
    // Инициализация datepicker с русской локализацией
    flatpickr(".datepicker", {
        locale: "ru",
        dateFormat: "d.m.Y",
        defaultDate: new Date(),
        maxDate: new Date(),
        theme: "dark",
        onChange: function(selectedDates, dateStr, instance) {
            validateDateRange();
        }
    });

    // Установка дат по умолчанию (последние 30 дней)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    document.getElementById('start-date')._flatpickr.setDate(startDate);
    document.getElementById('end-date')._flatpickr.setDate(endDate);
}

function validateDateRange() {
    const startDate = new Date(document.getElementById('start-date').value.split('.').reverse().join('-'));
    const endDate = new Date(document.getElementById('end-date').value.split('.').reverse().join('-'));
    
    if (startDate > endDate) {
        showCustomAlert('Дата начала не может быть больше даты окончания', 'error');
        document.getElementById('export-excel-btn').disabled = true;
        document.getElementById('export-gsheet-btn').disabled = true;
    } else {
        document.getElementById('export-excel-btn').disabled = false;
        document.getElementById('export-gsheet-btn').disabled = false;
    }
}

function setupEventListeners() {
    // Кнопка экспорта в Excel
    document.getElementById('export-excel-btn').addEventListener('click', () => Exporter.exportToExcel());
    
    // Кнопка экспорта в Google Sheets
    document.getElementById('export-gsheet-btn').addEventListener('click', exportToGoogleSheets);
    
    // Фильтры
    document.getElementById('project-filter').addEventListener('change', updateFilters);
    document.getElementById('channel-filter').addEventListener('change', updateFilters);
    
    // Эффекты при наведении на кнопки
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.classList.add('float');
        });
        
        btn.addEventListener('mouseleave', function() {
            this.classList.remove('float');
        });
    });
    
    // Адаптивное меню
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
}

function updateFilters() {
    const project = document.getElementById('project-filter').value;
    const channel = document.getElementById('channel-filter').value;
    
    // Здесь можно добавить логику фильтрации данных
    console.log(`Фильтры обновлены: Проект - ${project}, Канал - ${channel}`);
}

function exportToGoogleSheets() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const project = document.getElementById('project-filter').value;
    const channel = document.getElementById('channel-filter').value;

    Exporter.updateStatus('loading', '<i class="fas fa-spinner spinner"></i> Отправка данных в Google Sheets...');
    Exporter.toggleButtonLoading('export-gsheet-btn', true);
    document.getElementById('export-gsheet-btn').classList.add('pulse');

    // Имитация отправки в Google Sheets
    setTimeout(() => {
        Exporter.updateStatus('success', '<i class="fas fa-check-circle"></i> Данные успешно отправлены в Google Sheets');
        Exporter.toggleButtonLoading('export-gsheet-btn', false);
        document.getElementById('export-gsheet-btn').classList.remove('pulse');
        
        Exporter.showCustomAlert('Данные успешно отправлены в Google Sheets!', 'success');
        Exporter.animateSuccess();
    }, 2000);
}

function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('mobile-visible');
    
    const icon = document.getElementById('menu-toggle-icon');
    if (nav.classList.contains('mobile-visible')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Вспомогательные функции
function showCustomAlert(message, type) {
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

// Инициализация tooltips
function initTooltips() {
    const elements = document.querySelectorAll('[data-tooltip]');
    elements.forEach(el => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = el.getAttribute('data-tooltip');
        el.appendChild(tooltip);
        
        el.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });
        
        el.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
    });
}

// Инициализация всех компонентов
function init() {
    initDatePickers();
    initTooltips();
    setupEventListeners();
}

// Запуск приложения
init();