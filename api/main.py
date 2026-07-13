from fastapi import FastAPI

from api.routes.upload import router as upload_router
from api.routes.chat import router as chat_router

app = FastAPI(
    title="Document ChatBot API",
    version="1.0.0"
)

app.include_router(upload_router)
app.include_router(chat_router)


@app.get("/")
def home():
    return {
        "message": "Document ChatBot API is running."
    }