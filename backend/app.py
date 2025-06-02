from flask import Flask, request, jsonify, send_file
import requests
from io import StringIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для всех доменов

MOYSKLAD_API_URL = "https://api.moysklad.ru/api/remap/1.2/entity/demand"
MOYSKLAD_TOKEN = "eba6f80476e5a056ef25f953a117d660be5d5687"

@app.route('/api/get_moysklad_data', methods=['POST'])
def get_moysklad_data():
    try:
        # Получаем даты из запроса
        data = request.json
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        # Формируем фильтр для запроса
        filter_str = f"moment<={end_date}T23:59:59;moment>={start_date}T00:00:00"
        
        # Делаем запрос к API МойСклад
        headers = {
            "Authorization": f"Bearer {MOYSKLAD_TOKEN}",
            "Accept-Encoding": "gzip"
        }
        params = {
            "filter": filter_str
        }
        
        response = requests.get(MOYSKLAD_API_URL, headers=headers, params=params)
        response.raise_for_status()
        
        # Создаем текстовый файл в памяти
        file_data = StringIO()
        file_data.write(response.text)
        file_data.seek(0)
        
        # Отправляем файл как ответ
        return send_file(
            file_data,
            mimetype='text/plain',
            as_attachment=True,
            download_name='moysklad_data.txt'
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)