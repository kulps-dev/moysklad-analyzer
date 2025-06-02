import MoySkladAPI from './moysklad-api.js';
import ServerAPI from './server-api.js';

/**
 * Модуль для экспорта данных
 */
const Exporter = {
    /**
     * Экспортирует данные в Excel
     */
    async exportToExcel() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        this._updateStatus('loading', '<i class="fas fa-spinner spinner"></i> Получение данных из МойСклад...');
        this._toggleButtonLoading('export-excel-btn', true);
        document.getElementById('export-excel-btn').classList.add('pulse');

        try {
            // 1. Получаем данные из МойСклад
            const shipments = await MoySkladAPI.getShipments(startDate, endDate);
            
            // 2. Сохраняем данные на сервер
            await ServerAPI.saveShipments(shipments);
            
            // 3. Формируем Excel файл
            const excelData = this._prepareExcelData(shipments);
            this._generateExcelFile(excelData, `Отгрузки_${startDate}_${endDate}.xlsx`);
            
            this._updateStatus('success', '<i class="fas fa-check-circle"></i> Excel файл готов к скачиванию');
            this._animateSuccess();
        } catch (error) {
            this._updateStatus('error', `<i class="fas fa-exclamation-circle"></i> Ошибка: ${error.message}`);
            this._showCustomAlert('Произошла ошибка при получении данных', 'error');
        } finally {
            this._toggleButtonLoading('export-excel-btn', false);
            document.getElementById('export-excel-btn').classList.remove('pulse');
        }
    },

    /**
     * Подготавливает данные для Excel
     * @private
     */
    _prepareExcelData(shipments) {
        const data = [
            ['Дата', 'Номер заказа', 'Клиент', 'Сумма', 'Статус']
        ];
        
        shipments.rows.forEach(shipment => {
            data.push([
                shipment.moment.split('T')[0],
                shipment.name,
                shipment.agent ? shipment.agent.name : 'Не указан',
                `${shipment.sum / 100} ₽`,
                shipment.state ? shipment.state.name : 'Новый'
            ]);
        });

        return data;
    },

    /**
     * Генерирует и скачивает Excel файл
     * @private
     */
    _generateExcelFile(data, fileName) {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Отгрузки");
        XLSX.writeFile(wb, fileName);
    },

    // Вспомогательные методы UI
    _updateStatus(statusClass, message) {
        const statusBar = document.getElementById('status-bar');
        statusBar.className = `status-bar ${statusClass} show`;
        statusBar.innerHTML = message;
    },

    _toggleButtonLoading(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        if (isLoading) {
            button.innerHTML = '<i class="fas fa-spinner spinner"></i> Обработка...';
            button.disabled = true;
        } else {
            button.innerHTML = 'Экспорт в Excel';
            button.disabled = false;
        }
    },

    _animateSuccess() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
            }, 300);
        });
    },

    _showCustomAlert(message, type) {
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
};

export default Exporter;