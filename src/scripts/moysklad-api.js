/**
 * Модуль для работы с API МойСклад
 */
const MoySkladAPI = {
    token: 'eba6f80476e5a056ef25f953a117d660be5d5687',
    login: 'admin@allzakaz',

    /**
     * Получает отгрузки за указанный период
     * @param {string} startDate - Дата начала в формате DD.MM.YYYY
     * @param {string} endDate - Дата окончания в формате DD.MM.YYYY
     * @returns {Promise<object>} - Данные отгрузок
     */
    async getShipments(startDate, endDate) {
        const credentials = btoa(`${this.login}:${this.token}`);
        
        // Форматируем даты для фильтра
        const formattedStartDate = this._formatDateForApi(startDate, '00:00:00');
        const formattedEndDate = this._formatDateForApi(endDate, '23:59:59');
        
        const filter = `moment<=${formattedEndDate};moment>=${formattedStartDate}`;
        const url = `https://api.moysklad.ru/api/remap/1.2/entity/demand?filter=${encodeURIComponent(filter)}`;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Accept-Encoding': 'gzip'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка при запросе к API МойСклад:', error);
            throw error;
        }
    },

    /**
     * Форматирует дату для API МойСклад
     * @private
     */
    _formatDateForApi(date, time) {
        const [day, month, year] = date.split('.');
        return `${year}-${month}-${day}T${time}`;
    }
};

export default MoySkladAPI;