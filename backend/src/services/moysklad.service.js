const axios = require('axios');
const moment = require('moment');

const MOYSKLAD_API_URL = 'https://api.moysklad.ru/api/remap/1.2';
const TOKEN = process.env.MOYSKLAD_TOKEN;

exports.fetchDemands = async (startDate, endDate) => {
  try {
    const filter = `moment<=${endDate} 23:59:59;moment>=${startDate} 00:00:00`;
    const url = `${MOYSKLAD_API_URL}/entity/demand?filter=${encodeURIComponent(filter)}`;
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Accept-Encoding': 'gzip'
      }
    });
    
    return response.data.rows || [];
  } catch (error) {
    console.error('Error fetching demands:', error);
    throw error;
  }
};