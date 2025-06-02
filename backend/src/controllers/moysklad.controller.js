const moyskladService = require('../services/moysklad.service');
const moment = require('moment');
const XLSX = require('xlsx');

exports.getDemands = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const demands = await moyskladService.fetchDemands(startDate, endDate);
    res.json(demands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.saveData = async (req, res) => {
  try {
    const { data } = req.body;
    // Здесь можно добавить логику сохранения в базу данных
    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exportToExcel = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const demands = await moyskladService.fetchDemands(startDate, endDate);
    
    // Преобразуем данные в формат для Excel
    const excelData = demands.map(demand => ({
      'Дата': moment(demand.moment).format('DD.MM.YYYY'),
      'Номер': demand.name,
      'Сумма': demand.sum / 100,
      'Статус': demand.state && demand.state.name ? demand.state.name : 'Не указан'
    }));
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "Отгрузки");
    
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Disposition', `attachment; filename="Отгрузки_${startDate}_${endDate}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};