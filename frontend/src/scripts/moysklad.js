document.addEventListener('DOMContentLoaded', function() {
    initDatePickers();
    setupEventListeners();
    showStatusBar();
});

function initDatePickers() {
    flatpickr(".datepicker", {
        locale: "ru",
        dateFormat: "d.m.Y",
        defaultDate: new Date(),
        maxDate: new Date()
    });

    // Установка дат по умолчанию (последние 30 дней)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    document.getElementById('start-date')._flatpickr.setDate(startDate);
    document.getElementById('end-date')._flatpickr.setDate(endDate);
}

function setupEventListeners() {
    document.getElementById('export-excel-btn').addEventListener('click', exportToExcel);
    document.getElementById('export-gsheet-btn').addEventListener('click', exportToGoogleSheets);
    document.getElementById('export-txt-btn').addEventListener('click', exportToTxt);
}

async function exportToTxt() {
    const startDateInput = document.getElementById('start-date').value;
    const endDateInput = document.getElementById('end-date').value;
    
    if (!startDateInput || !endDateInput) {
        showAlert('Выберите даты начала и окончания периода', 'error');
        return;
    }

    // Преобразование дат в формат YYYY-MM-DD
    const [startDay, startMonth, startYear] = startDateInput.split('.');
    const [endDay, endMonth, endYear] = endDateInput.split('.');
    const startDate = `${startYear}-${startMonth}-${startDay}`;
    const endDate = `${endYear}-${endMonth}-${endDay}`;

    const btn = document.getElementById('export-txt-btn');
    const originalText = btn.innerHTML;
    
    try {
        // Показать статус загрузки
        updateStatus('loading', '<i class="fas fa-spinner fa-spin"></i> Загрузка данных...');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...';
        btn.disabled = true;

        // Отправка запроса на бэкенд
        const response = await fetch('http://localhost:5000/api/get_moysklad_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                start_date: startDate,
                end_date: endDate
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Неизвестная ошибка' }));
            throw new Error(error.error || 'Ошибка сервера');
        }

        // Скачивание файла
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `moysklad_data_${startDateInput}_${endDateInput}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Успешное завершение
        updateStatus('success', '<i class="fas fa-check-circle"></i> Данные успешно загружены');
        showAlert('Данные успешно экспортированы в TXT', 'success');
    } catch (error) {
        console.error('Export error:', error);
        updateStatus('error', `<i class="fas fa-exclamation-circle"></i> ${error.message}`);
        showAlert(`Ошибка: ${error.message}`, 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Вспомогательные функции
function showStatusBar() {
    setTimeout(() => {
        document.getElementById('status-bar').classList.add('show');
    }, 500);
}

function updateStatus(statusClass, message) {
    const statusBar = document.getElementById('status-bar');
    statusBar.className = `status-bar ${statusClass} show`;
    statusBar.innerHTML = message;
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `custom-alert ${type}`;
    alert.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(alert);
    
    setTimeout(() => alert.classList.add('show'), 10);
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 500);
    }, 3000);
}

// Заглушки для других функций экспорта
function exportToExcel() {
    showAlert('Экспорт в Excel временно недоступен', 'warning');
}

function exportToGoogleSheets() {
    showAlert('Экспорт в Google Sheets временно недоступен', 'warning');
}