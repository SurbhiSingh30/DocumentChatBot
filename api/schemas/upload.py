from pydantic import BaseModel


class UploadResponse(BaseModel):
    success: bool
    status: str
    message: str