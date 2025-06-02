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
        app.logger.info("Received request: %s", request.json)
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if not start_date or not end_date:
            return jsonify({"error": "Both start_date and end_date are required"}), 400

        # Формируем фильтр для API МойСклад
        filter_str = f"moment>={start_date}T00:00:00;moment<={end_date}T23:59:59"
        
        headers = {
            "Authorization": f"Bearer {MOYSKLAD_TOKEN}",
            "Accept": "application/json",
            "Accept-Encoding": "gzip"
        }
        
        params = {
            "filter": filter_str,
            "limit": 100
        }

        app.logger.info(f"Requesting Moysklad API with params: {params}")
        
        response = requests.get(
            MOYSKLAD_API_URL,
            headers=headers,
            params=params,
            timeout=10
        )
        
        app.logger.info(f"Moysklad API response status: {response.status_code}")
        
        if response.status_code == 401:
            return jsonify({"error": "Unauthorized - check your API token"}), 401
        if response.status_code == 403:
            return jsonify({"error": "Forbidden - insufficient permissions"}), 403
        
        response.raise_for_status()
        
        # Логируем первые 200 символов ответа для отладки
        app.logger.info(f"API response sample: {response.text[:200]}...")
        
        file_data = BytesIO()
        file_data.write(response.text.encode('utf-8'))
        file_data.seek(0)
        
        return send_file(
            file_data,
            mimetype='text/plain',
            as_attachment=True,
            download_name=f'moysklad_data_{start_date}_{end_date}.txt'
        )

    except requests.exceptions.RequestException as e:
        app.logger.error(f"Request error: {str(e)}")
        return jsonify({"error": f"API request failed: {str(e)}"}), 500
    except Exception as e:
        app.logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)