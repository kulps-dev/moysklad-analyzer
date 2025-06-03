from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from .moysklad import get_moysklad_data

app = FastAPI(title="МойСклад API Прокси")

# Настройки CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/get_moysklad_data")
async def export_moysklad_data():
    try:
        data = get_moysklad_data()
        return Response(
            content=data,
            media_type="text/plain",
            headers={"Content-Disposition": "attachment; filename=moysklad_data.txt"}
        )
    except Exception as e:
        return {"error": str(e)}