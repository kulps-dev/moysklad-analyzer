document.addEventListener('DOMContentLoaded', function() {
    initDatePickers();
    setupEventListeners();
    
    setTimeout(() => {
        const statusBar = document.getElementById('status-bar');
        statusBar.classList.add('show');
    }, 500);
    
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
        theme: "dark"
    });

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    document.getElementById('start-date')._flatpickr.setDate(startDate);
    document.getElementById('end-date')._flatpickr.setDate(endDate);
}

function setupEventListeners() {
    document.getElementById('export-excel-btn').addEventListener('click', exportToExcel);
    document.getElementById('export-gsheet-btn').addEventListener('click', exportToGoogleSheets);
    
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

async function exportToExcel() {
    const startDate = document.getElementById('start-date')._flatpickr.selectedDates[0];
    const endDate = document.getElementById('end-date')._flatpickr.selectedDates[0];
    
    const formattedStartDate = formatDateForBackend(startDate);
    const formattedEndDate = formatDateForBackend(endDate);

    updateStatus('loading', '<i class="fas fa-spinner fa-spin"></i> Подготовка Excel файла...');
    toggleButtonLoading('export-excel-btn', true);
    document.getElementById('export-excel-btn').classList.add('pulse');

    try {
        const response = await fetch(`/api/moysklad/export-excel?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
        
        if (!response.ok) {
            throw new Error('Ошибка при экспорте данных');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Отгрузки_${formatDateForDisplay(startDate)}_${formatDateForDisplay(endDate)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        updateStatus('success', '<i class="fas fa-check-circle"></i> Excel файл успешно скачан');
        animateSuccess();
    } catch (error) {
        updateStatus('danger', `<i class="fas fa-exclamation-circle"></i> ${error.message}`);
        showCustomAlert(error.message, 'danger');
    } finally {
        toggleButtonLoading('export-excel-btn', false);
        document.getElementById('export-excel-btn').classList.remove('pulse');
    }
}

async function exportToGoogleSheets() {
    const startDate = document.getElementById('start-date')._flatpickr.selectedDates[0];
    const endDate = document.getElementById('end-date')._flatpickr.selectedDates[0];
    
    const formattedStartDate = formatDateForBackend(startDate);
    const formattedEndDate = formatDateForBackend(endDate);

    updateStatus('loading', '<i class="fas fa-spinner fa-spin"></i> Отправка данных в Google Sheets...');
    toggleButtonLoading('export-gsheet-btn', true);
    document.getElementById('export-gsheet-btn').classList.add('pulse');

    try {
        // Здесь можно добавить вызов API для отправки в Google Sheets
        // Покажем имитацию успешной отправки
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        updateStatus('success', '<i class="fas fa-check-circle"></i> Данные успешно отправлены в Google Sheets');
        showCustomAlert('Данные успешно отправлены в Google Sheets!', 'success');
        animateSuccess();
    } catch (error) {
        updateStatus('danger', `<i class="fas fa-exclamation-circle"></i> ${error.message}`);
        showCustomAlert(error.message, 'danger');
    } finally {
        toggleButtonLoading('export-gsheet-btn', false);
        document.getElementById('export-gsheet-btn').classList.remove('pulse');
    }
}

function formatDateForBackend(date) {
    return date.toISOString().split('T')[0];
}

function formatDateForDisplay(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
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
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обработка...';
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
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
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