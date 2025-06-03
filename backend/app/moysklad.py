import requests
from fastapi import HTTPException

MOYSKLAD_API_URL = "https://api.moysklad.ru/api/remap/1.2"
MOYSKLAD_TOKEN = "eba6f80476e5a056ef25f953a117d660be5d5687"

def get_moysklad_data():
    headers = {
        "Authorization": f"Bearer {MOYSKLAD_TOKEN}",
        "Accept-Encoding": "gzip",
        "Accept": "application/json"
    }
    
    try:
        response = requests.get(
            f"{MOYSKLAD_API_URL}/entity/demand",
            headers=headers
        )
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при запросе к API МойСклад: {str(e)}"
        )