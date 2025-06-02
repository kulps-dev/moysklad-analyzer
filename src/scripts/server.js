// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Включение CORS
app.use(cors());
app.use(bodyParser.json());

// Папка для хранения данных
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Endpoint для сохранения отгрузок
app.post('/api/save-shipments', (req, res) => {
    try {
        const { startDate, endDate, shipments } = req.body;
        
        // Создаем имя файла на основе дат
        const fileName = `shipments_${startDate}_to_${endDate}.json`;
        const filePath = path.join(DATA_DIR, fileName);
        
        // Сохраняем данные в файл
        fs.writeFileSync(filePath, JSON.stringify({
            timestamp: new Date().toISOString(),
            startDate,
            endDate,
            shipments
        }, null, 2));
        
        res.json({
            success: true,
            message: 'Данные успешно сохранены',
            file: fileName
        });
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при сохранении данных'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});