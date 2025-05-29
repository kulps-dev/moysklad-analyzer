document.addEventListener('DOMContentLoaded', function () {
    // Инициализация datepicker
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
 
    // Обработчик кнопки экспорта в Excel
    document.getElementById('export-excel-btn').addEventListener('click', function () {
       exportToExcel();
    });
 
    // Обработчик кнопки экспорта в Google Sheets
    document.getElementById('export-gsheet-btn').addEventListener('click', function () {
       exportToGoogleSheets();
    });
 
    // Функция экспорта в Excel
    function exportToExcel() {
       const startDate = document.getElementById('start-date').value;
       const endDate = document.getElementById('end-date').value;
       const project = document.getElementById('project-filter').value;
       const channel = document.getElementById('channel-filter').value;
 
       // Показать статус загрузки
       const statusBar = document.getElementById('status-bar');
       statusBar.innerHTML = '<i class="fas fa-spinner spinner"></i> Подготовка Excel файла...';
       statusBar.className = 'status-bar loading';
 
       // Показать анимацию загрузки на кнопке
       const exportBtn = document.getElementById('export-excel-btn');
       const originalBtnText = exportBtn.innerHTML;
       exportBtn.innerHTML = '<i class="fas fa-spinner spinner"></i> Подготовка...';
       exportBtn.disabled = true;
 
       // Имитация загрузки данных и создания Excel
       setTimeout(() => {
          // Создаем тестовые данные
          const data = [
             ['Дата', 'Номер заказа', 'Клиент', 'Сумма', 'Прибыль', 'Статус'],
             ['15.05.2023', '#12345', 'ООО "ТехноПром"', '45 200 ₽', '12 450 ₽', 'Выполнен'],
             ['14.05.2023', '#12344', 'ИП Смирнов А.В.', '18 700 ₽', '5 210 ₽', 'Выполнен'],
             ['12.05.2023', '#12340', 'ООО "СтройГарант"', '102 500 ₽', '-2 300 ₽', 'Возврат']
          ];
 
          // Создаем книгу Excel
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet(data);
          XLSX.utils.book_append_sheet(wb, ws, "Отгрузки");
 
          // Генерируем файл и скачиваем
          XLSX.writeFile(wb, `Отгрузки_${startDate}_${endDate}.xlsx`);
 
          // Обновить статус
          statusBar.innerHTML = '<i class="fas fa-check-circle"></i> Excel файл готов к скачиванию';
          statusBar.className = 'status-bar success';
 
          // Восстановить кнопку
          exportBtn.innerHTML = originalBtnText;
          exportBtn.disabled = false;
       }, 1500);
    }
 
    // Функция экспорта в Google Sheets
    function exportToGoogleSheets() {
       const startDate = document.getElementById('start-date').value;
       const endDate = document.getElementById('end-date').value;
       const project = document.getElementById('project-filter').value;
       const channel = document.getElementById('channel-filter').value;
 
       // Показать статус загрузки
       const statusBar = document.getElementById('status-bar');
       statusBar.innerHTML = '<i class="fas fa-spinner spinner"></i> Отправка данных в Google Sheets...';
       statusBar.className = 'status-bar loading';
 
       // Показать анимацию загрузки на кнопке
       const exportBtn = document.getElementById('export-gsheet-btn');
       const originalBtnText = exportBtn.innerHTML;
       exportBtn.innerHTML = '<i class="fas fa-spinner spinner"></i> Отправка...';
       exportBtn.disabled = true;
 
       // Имитация отправки данных
       setTimeout(() => {
          // Здесь должна быть реальная логика отправки в Google Sheets
          // Например, через Google Apps Script или API
          
          // Обновить статус
          statusBar.innerHTML = '<i class="fas fa-check-circle"></i> Данные успешно отправлены в Google Sheets';
          statusBar.className = 'status-bar success';
 
          // Восстановить кнопку
          exportBtn.innerHTML = originalBtnText;
          exportBtn.disabled = false;
          
          // Показать сообщение об успехе
          alert('Данные успешно отправлены в Google Sheets!');
       }, 2000);
    }
});