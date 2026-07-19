from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from api.routes.upload import router as upload_router
from api.routes.chat import router as chat_router
from api.routes.documents import router as documents_router
from api.routes.auth import router as auth_router
from api.handlers.exception_handler import (
    value_error_handler,
    generic_exception_handler
)

app = FastAPI(
    title="Document ChatBot API",
    version="1.0.0"
)


# def custom_openapi():
#     if app.openapi_schema:
#         return app.openapi_schema

#     openapi_schema = get_openapi(
#         title=app.title,
#         version=app.version,
#         routes=app.routes,
#     )

#     openapi_schema["components"]["securitySchemes"] = {
#         "BearerAuth": {
#             "type": "http",
#             "scheme": "bearer",
#             "bearerFormat": "JWT"
#         }
#     }

#     app.openapi_schema = openapi_schema
#     return app.openapi_schema


# app.openapi = custom_openapi
app.add_exception_handler(ValueError, value_error_handler)
app.add_exception_handler(Exception, generic_exception_handler)

app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(documents_router)


@app.get("/")
def home():
    return {
        "message": "Document ChatBot API is running."
    }