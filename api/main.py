from fastapi import FastAPI

from api.routes.upload import router as upload_router
from api.routes.chat import router as chat_router
from api.routes.documents import router as documents_router

from api.handlers.exception_handler import (
    value_error_handler,
    generic_exception_handler
)

app = FastAPI(
    title="Document ChatBot API",
    version="1.0.0"
)
app.add_exception_handler(ValueError, value_error_handler)
app.add_exception_handler(Exception, generic_exception_handler)


app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(documents_router)


@app.get("/")
def home():
    return {
        "message": "Document ChatBot API is running."
    }