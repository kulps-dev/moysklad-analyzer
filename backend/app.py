from flask import Flask, request, jsonify, send_file
import requests
from io import StringIO
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

MOYSKLAD_API_URL = "https://api.moysklad.ru/api/remap/1.2/entity/demand"
MOYSKLAD_TOKEN = "eba6f80476e5a056ef25f953a117d660be5d5687"

def convert_date_format(date_str):
    """Конвертирует дату из формата dd.mm.yyyy в yyyy-mm-dd"""
    try:
        return datetime.strptime(date_str, "%d.%m.%Y").strftime("%Y-%m-%d")
    except ValueError:
        raise ValueError("Неверный формат даты. Используйте DD.MM.YYYY")

@app.route('/api/moysklad', methods=['GET'])
def get_moysklad_data():
    try:
        # Получаем параметры из запроса
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        
        if not start_date or not end_date:
            return jsonify({"error": "Необходимо указать startDate и endDate"}), 400
        
        # Конвертируем даты в формат API МойСклад
        start_date_api = convert_date_format(start_date)
        end_date_api = convert_date_format(end_date)
        
        # Формируем фильтр
        filter_str = f"moment<{end_date_api} 00:00;moment>{start_date_api} 00:00"
        
        # Делаем запрос к API МойСклад
        headers = {
            "Authorization": f"Basic {MOYSKLAD_TOKEN}",
            "Accept-Encoding": "gzip"
        }
        params = {
            "filter": filter_str
        }
        
        response = requests.get(MOYSKLAD_API_URL, headers=headers, params=params)
        response.raise_for_status()  # Проверка на ошибки HTTP
        
        # Возвращаем данные как JSON
        return jsonify(response.json())
        
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Ошибка при запросе к МойСклад: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Внутренняя ошибка сервера: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)