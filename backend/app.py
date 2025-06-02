from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import requests
from io import BytesIO
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Конфигурация API МойСклад
MOYSKLAD_API_URL = "https://api.moysklad.ru/api/remap/1.2/entity/demand"
MOYSKLAD_TOKEN = "your_api_token_here"  # Замените на ваш действительный токен

def log_error(message):
    """Логирование ошибок"""
    print(f"[ERROR] {datetime.now()}: {message}")

@app.route('/api/get_moysklad_data', methods=['POST'])
def get_moysklad_data():
    try:
        # Валидация входных данных
        data = request.get_json()
        if not data or 'start_date' not in data or 'end_date' not in data:
            return jsonify({"error": "Необходимо указать start_date и end_date"}), 400

        # Формирование запроса к API МойСклад
        headers = {
            "Authorization": f"Bearer {MOYSKLAD_TOKEN}",
            "Accept": "application/json",
            "Accept-Encoding": "gzip"
        }
        
        # Формат дат для API МойСклад
        filter_str = f"moment>={data['start_date']}T00:00:00;moment<={data['end_date']}T23:59:59"
        
        params = {
            "filter": filter_str,
            "limit": 1000  # Лимит записей
        }

        # Выполнение запроса
        response = requests.get(MOYSKLAD_API_URL, headers=headers, params=params)
        response.raise_for_status()
        
        # Создание файла для скачивания
        file_data = BytesIO()
        file_data.write(response.text.encode('utf-8'))
        file_data.seek(0)
        
        return send_file(
            file_data,
            mimetype='text/plain',
            as_attachment=True,
            download_name=f'moysklad_data_{data["start_date"]}_{data["end_date"]}.txt'
        )

    except requests.exceptions.RequestException as e:
        log_error(f"Ошибка запроса к API МойСклад: {str(e)}")
        return jsonify({"error": f"Ошибка API МойСклад: {str(e)}"}), 500
    except Exception as e:
        log_error(f"Внутренняя ошибка сервера: {str(e)}")
        return jsonify({"error": f"Внутренняя ошибка сервера: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)