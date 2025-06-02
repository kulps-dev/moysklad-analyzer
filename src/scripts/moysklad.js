document.addEventListener('DOMContentLoaded', function() {
    initDatePickers();
    setupEventListeners();
    
    setTimeout(() => {
        const statusBar = document.getElementById('status-bar');
        statusBar.classList.add('show');
    }, 500);
    
    animateCards();
});

// Константы для API
const MOYSKLAD_API_URL = 'https://api.moysklad.ru/api/remap/1.2';
const MOYSKLAD_TOKEN = 'eba6f80476e5a056ef25f953a117d660be5d5687';
const SERVER_URL = 'http://45.12.230.148/api/save-shipments'; // Адрес вашего сервера

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
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const project = document.getElementById('project-filter').value;
    const channel = document.getElementById('channel-filter').value;

    updateStatus('loading', '<i class="fas fa-spinner spinner"></i> Получение данных из МойСклад...');
    toggleButtonLoading('export-excel-btn', true);
    document.getElementById('export-excel-btn').classList.add('pulse');

    try {
        // Получаем данные отгрузок
        const shipments = await fetchShipments(startDate, endDate);
        
        // Сохраняем данные на сервер
        await saveShipmentsToServer(shipments, startDate, endDate);
        
        // Формируем Excel файл
        generateExcelFromShipments(shipments, startDate, endDate);
        
        updateStatus('success', '<i class="fas fa-check-circle"></i> Excel файл готов к скачиванию');
        animateSuccess();
        showCustomAlert('Данные успешно загружены и сохранены!', 'success');
    } catch (error) {
        console.error('Ошибка при экспорте:', error);
        updateStatus('error', `<i class="fas fa-exclamation-circle"></i> Ошибка: ${error.message}`);
        showCustomAlert('Произошла ошибка при получении данных', 'error');
    } finally {
        toggleButtonLoading('export-excel-btn', false);
        document.getElementById('export-excel-btn').classList.remove('pulse');
    }
}

async function fetchShipments(startDate, endDate) {
    // Преобразуем даты в формат для API МойСклад
    const formattedStartDate = formatDateForAPI(startDate);
    const formattedEndDate = formatDateForAPI(endDate);
    
    // Формируем URL запроса с фильтром по дате
    const url = new URL(`${MOYSKLAD_API_URL}/entity/demand`);
    url.searchParams.append('filter', `moment<=${formattedEndDate};moment>=${formattedStartDate}`);
    url.searchParams.append('limit', '1000'); // Максимальное количество записей
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${btoa(MOYSKLAD_TOKEN + ':')}`,
            'Accept-Encoding': 'gzip',
            'Accept': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.rows || [];
}

function formatDateForAPI(dateString) {
    // Преобразуем дату из формата "dd.mm.yyyy" в "yyyy-mm-dd"
    const [day, month, year] = dateString.split('.');
    return `${year}-${month}-${day} 00:00:00`;
}

async function saveShipmentsToServer(shipments, startDate, endDate) {
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                startDate,
                endDate,
                shipments
            })
        });
        
        if (!response.ok) {
            throw new Error('Ошибка при сохранении данных на сервер');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Ошибка сохранения на сервер:', error);
        // Продолжаем работу даже если сохранение на сервер не удалось
    }
}

function generateExcelFromShipments(shipments, startDate, endDate) {
    // Подготавливаем данные для Excel
    const excelData = [
        ['Дата', 'Номер', 'Контрагент', 'Сумма', 'Статус', 'Проект', 'Канал продаж']
    ];
    
    shipments.forEach(shipment => {
        excelData.push([
            shipment.moment ? shipment.moment.split(' ')[0] : '',
            shipment.name || '',
            shipment.agent ? shipment.agent.name : '',
            shipment.sum ? `${shipment.sum / 100} ₽` : '0 ₽',
            shipment.state ? shipment.state.name : '',
            shipment.project ? shipment.project.name : '',
            shipment.salesChannel ? shipment.salesChannel.name : ''
        ]);
    });
    
    // Создаем Excel файл
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "Отгрузки");
    XLSX.writeFile(wb, `Отгрузки_${startDate}_${endDate}.xlsx`);
}

function exportToGoogleSheets() {
    // Реализация аналогична exportToExcel, но с отправкой в Google Sheets
    // Пока оставим вашу текущую реализацию
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
        showCustomAlert('Данные успешно отправлены в Google Sheets!', 'success');
        animateSuccess();
    }, 2000);
}

// Остальные вспомогательные функции остаются без изменений
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