const express = require('express');
const router = express.Router();
const moyskladController = require('../controllers/moysklad.controller');

router.get('/moysklad/demands', moyskladController.getDemands);
router.post('/moysklad/save', moyskladController.saveData);
router.get('/moysklad/export-excel', moyskladController.exportToExcel);

module.exports = router;