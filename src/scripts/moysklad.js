document.addEventListener('DOMContentLoaded', function() {
    // Инициализация элементов
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
    });
}

function initDatePickers() {
    flatpickr(".datepicker", {
        locale: "ru",
        dateFormat: "d.m.Y",
        defaultDate: new Date(),
        maxDate: new Date(),
        theme: "dark" // Новая тема для datepicker
    });

    // Установка дат по умолчанию
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    document.getElementById('start-date')._flatpickr.setDate(startDate);
    document.getElementById('end-date')._flatpickr.setDate(endDate);
}

function setupEventListeners() {
    document.getElementById('export-excel-btn').addEventListener('click', exportToExcel);
    document.getElementById('export-gsheet-btn').addEventListener('click', exportToGoogleSheets);
    
    // Добавить эффект при наведении на кнопки
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.classList.add('float');
        });
        
        btn.addEventListener('mouseleave', function() {
            this.classList.remove('float');
        });
    });
}

function exportToExcel() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const project = document.getElementById('project-filter').value;
    const channel = document.getElementById('channel-filter').value;

    // Показать статус загрузки
    updateStatus('loading', '<i class="fas fa-spinner spinner"></i> Подготовка Excel файла...');
    toggleButtonLoading('export-excel-btn', true);
    
    // Добавить эффект пульсации
    document.getElementById('export-excel-btn').classList.add('pulse');

    // Имитация загрузки данных
    setTimeout(() => {
        const data = [
            ['Дата', 'Номер заказа', 'Клиент', 'Сумма', 'Прибыль', 'Статус'],
            ['15.05.2023', '#12345', 'ООО "ТехноПром"', '45 200 ₽', '12 450 ₽', 'Выполнен'],
            ['14.05.2023', '#12344', 'ИП Смирнов А.В.', '18 700 ₽', '5 210 ₽', 'Выполнен'],
            ['12.05.2023', '#12340', 'ООО "СтройГарант"', '102 500 ₽', '-2 300 ₽', 'Возврат']
        ];

        generateExcelFile(data, `Отгрузки_${startDate}_${endDate}.xlsx`);
        
        // Успешное завершение
        updateStatus('success', '<i class="fas fa-check-circle"></i> Excel файл готов к скачиванию');
        toggleButtonLoading('export-excel-btn', false);
        document.getElementById('export-excel-btn').classList.remove('pulse');
        
        // Анимация успеха
        animateSuccess();
    }, 1500);
}

function exportToGoogleSheets() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const project = document.getElementById('project-filter').value;
    const channel = document.getElementById('channel-filter').value;

    updateStatus('loading', '<i class="fas fa-spinner spinner"></i> Отправка данных в Google Sheets...');
    toggleButtonLoading('export-gsheet-btn', true);
    document.getElementById('export-gsheet-btn').classList.add('pulse');

    setTimeout(() => {
        updateStatus('success', '<i class="fas fa-check-circle"></i> Данные успешно отправлены в Google Sheets');
        toggleButtonLoading('export-gsheet-btn', false);
        document.getElementById('export-gsheet-btn').classList.remove('pulse');
        
        // Показать красивый алерт
        showCustomAlert('Данные успешно отправлены в Google Sheets!', 'success');
        animateSuccess();
    }, 2000);
}

function generateExcelFile(data, fileName) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Отгрузки");
    XLSX.writeFile(wb, fileName);
}

function updateStatus(statusClass, message) {
    const statusBar = document.getElementById('status-bar');
    statusBar.className = `status-bar ${statusClass} show`;
    statusBar.innerHTML = message;
}

function toggleButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    const originalContent = button.innerHTML;
    
    if (isLoading) {
        button.innerHTML = '<i class="fas fa-spinner spinner"></i> Обработка...';
        button.disabled = true;
    } else {
        button.innerHTML = originalContent;
        button.disabled = false;
    }
}

function animateSuccess() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.transform = 'translateY(-5px)';
        setTimeout(() => {
            card.style.transform = 'translateY(0)';
        }, 300);
    });
}

function showCustomAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `custom-alert ${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-check-circle"></i>
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