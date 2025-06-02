/**
 * Модуль для работы с сервером
 */
const ServerAPI = {
    baseUrl: 'http://45.12.230.148/api',

    /**
     * Сохраняет данные отгрузок на сервер
     * @param {object} shipmentsData - Данные отгрузок
     * @returns {Promise<object>} - Ответ сервера
     */
    async saveShipments(shipmentsData) {
        const url = `${this.baseUrl}/save-shipments`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shipmentsData)
            });
            
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка при сохранении данных на сервер:', error);
            throw error;
        }
    },

    /**
     * Получает сохраненные отгрузки с сервера
     * @returns {Promise<object>} - Данные отгрузок
     */
    async getSavedShipments() {
        const url = `${this.baseUrl}/shipments`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка при получении данных с сервера:', error);
            throw error;
        }
    }
};

export default ServerAPI;