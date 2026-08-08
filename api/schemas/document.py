from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class DocumentResponse(BaseModel):
    user_id: int
    filename: str
    file_path: str
    file_type: str
    file_size: int
    chunks_count: int

    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    success: bool
    documents: List[DocumentResponse]


class DeleteResponse(BaseModel):
    success: bool
    message: str


class DocumentInfo(BaseModel):
    filename: str
    chunks: int


class DocumentInfoResponse(BaseModel):
    success: bool
    document: Optional[DocumentInfo]