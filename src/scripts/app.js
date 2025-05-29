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
 
    // Обработчик кнопки анализа
    document.getElementById('analyze-btn').addEventListener('click', function () {
       analyzeData();
    });
 
    // Обработчики вкладок
    document.querySelectorAll('.tab').forEach(tab => {
       tab.addEventListener('click', function () {
          // Удаляем active у всех вкладок и контента
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
 
          // Добавляем active текущей вкладке и соответствующему контенту
          this.classList.add('active');
          const tabId = this.getAttribute('data-tab');
          document.getElementById(`${tabId}-tab`).classList.add('active');
       });
    });
 
    // Функция анализа данных (заглушка)
    function analyzeData() {
       const startDate = document.getElementById('start-date').value;
       const endDate = document.getElementById('end-date').value;
       const project = document.getElementById('project-filter').value;
       const channel = document.getElementById('channel-filter').value;
 
       // Показать статус загрузки
       const statusBar = document.getElementById('status-bar');
       statusBar.innerHTML = '<i class="fas fa-spinner spinner"></i> Анализируем данные...';
       statusBar.className = 'status-bar loading';
 
       // Показать анимацию загрузки на кнопке
       const analyzeBtn = document.getElementById('analyze-btn');
       const originalBtnText = analyzeBtn.innerHTML;
       analyzeBtn.innerHTML = '<i class="fas fa-spinner spinner"></i> Обработка...';
       analyzeBtn.disabled = true;
 
       // Имитация загрузки данных
       setTimeout(() => {
          // Генерация тестовых данных
          generateTestData();
 
          // Обновить статус
          statusBar.innerHTML = '<i class="fas fa-check-circle"></i> Анализ завершен успешно';
          statusBar.className = 'status-bar success';
 
          // Восстановить кнопку
          analyzeBtn.innerHTML = originalBtnText;
          analyzeBtn.disabled = false;
 
          // Показать результаты
          document.getElementById('results-container').style.display = 'block';
       }, 2000);
    }
 
    // Генерация тестовых данных
    function generateTestData() {
       // Генерация карточек с показателями
       const summaryCards = document.getElementById('summary-cards');
       summaryCards.innerHTML = `
                     <div class="form-group" style="flex: 1; background: rgba(67, 97, 238, 0.1); padding: 1rem; border-radius: 8px;">
                         <h3 style="font-size: 0.9rem; color: #6c757d; margin-bottom: 0.5rem;">Общий объем продаж</h3>
                         <p style="font-size: 1.5rem; font-weight: 700; color: var(--primary-color);">1 245 780 ₽</p>
                         <p style="font-size: 0.8rem; color: #6c757d;"><i class="fas fa-arrow-up" style="color: var(--success-color);"></i> 12% за период</p>
                     </div>
                     <div class="form-group" style="flex: 1; background: rgba(247, 37, 133, 0.1); padding: 1rem; border-radius: 8px;">
                         <h3 style="font-size: 0.9rem; color: #6c757d; margin-bottom: 0.5rem;">Количество заказов</h3>
                         <p style="font-size: 1.5rem; font-weight: 700; color: var(--danger-color);">87</p>
                         <p style="font-size: 0.8rem; color: #6c757d;"><i class="fas fa-arrow-down" style="color: var(--danger-color);"></i> 5% за период</p>
                     </div>
                     <div class="form-group" style="flex: 1; background: rgba(76, 201, 240, 0.1); padding: 1rem; border-radius: 8px;">
                         <h3 style="font-size: 0.9rem; color: #6c757d; margin-bottom: 0.5rem;">Средний чек</h3>
                         <p style="font-size: 1.5rem; font-weight: 700; color: var(--success-color);">14 319 ₽</p>
                         <p style="font-size: 0.8rem; color: #6c757d;"><i class="fas fa-arrow-up" style="color: var(--success-color);"></i> 18% за период</p>
                     </div>
                 `;
 
       // Генерация таблицы с детализацией
       const detailsTable = document.getElementById('details-table');
       detailsTable.innerHTML = `
                     <table>
                         <thead>
                             <tr>
                                 <th>Дата</th>
                                 <th>Номер заказа</th>
                                 <th>Клиент</th>
                                 <th>Сумма</th>
                                 <th>Прибыль</th>
                                 <th>Статус</th>
                             </tr>
                         </thead>
                         <tbody>
                             <tr>
                                 <td>15.05.2023</td>
                                 <td>#12345</td>
                                 <td>ООО "ТехноПром"</td>
                                 <td>45 200 ₽</td>
                                 <td class="positive-profit">12 450 ₽</td>
                                 <td><span style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Выполнен</span></td>
                             </tr>
                             <tr>
                                 <td>14.05.2023</td>
                                 <td>#12344</td>
                                 <td>ИП Смирнов А.В.</td>
                                 <td>18 700 ₽</td>
                                 <td class="positive-profit">5 210 ₽</td>
                                 <td><span style="color: var(--success-color);"><i class="fas fa-check-circle"></i> Выполнен</span></td>
                             </tr>
                             <tr>
                                 <td>12.05.2023</td>
                                 <td>#12340</td>
                                 <td>ООО "СтройГарант"</td>
                                 <td>102 500 ₽</td>
                                 <td class="negative-profit">-2 300 ₽</td>
                                 <td><span style="color: var(--danger-color);"><i class="fas fa-exclamation-circle"></i> Возврат</span></td>
                             </tr>
                         </tbody>
                     </table>
                 `;
 
       // Инициализация графика
       initChart();
    }
 
    // Инициализация графика
    function initChart() {
       const ctx = document.getElementById('sales-chart').getContext('2d');
 
       // Данные для графика
       const labels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
       const salesData = [650000, 590000, 800000, 810000, 560000, 1245780];
       const profitData = [120000, 110000, 150000, 140000, 90000, 210000];
 
       new Chart(ctx, {
          type: 'line',
          data: {
             labels: labels,
             datasets: [{
                   label: 'Объем продаж',
                   data: salesData,
                   borderColor: 'rgba(67, 97, 238, 1)',
                   backgroundColor: 'rgba(67, 97, 238, 0.1)',
                   borderWidth: 2,
                   tension: 0.3,
                   fill: true
                },
                {
                   label: 'Прибыль',
                   data: profitData,
                   borderColor: 'rgba(76, 201, 240, 1)',
                   backgroundColor: 'rgba(76, 201, 240, 0.1)',
                   borderWidth: 2,
                   tension: 0.3,
                   fill: true
                }
             ]
          },
          options: {
             responsive: true,
             maintainAspectRatio: false,
             plugins: {
                legend: {
                   position: 'top',
                },
                tooltip: {
                   mode: 'index',
                   intersect: false,
                   callbacks: {
                      label: function (context) {
                         return context.dataset.label + ': ' + context.parsed.y.toLocaleString('ru-RU') + ' ₽';
                      }
                   }
                }
             },
             scales: {
                y: {
                   beginAtZero: true,
                   ticks: {
                      callback: function (value) {
                         return value.toLocaleString('ru-RU') + ' ₽';
                      }
                   }
                }
             }
          }
       });
    }
 });