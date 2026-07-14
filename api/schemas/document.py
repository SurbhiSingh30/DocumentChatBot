from pydantic import BaseModel
from typing import List
from typing import Optional

class DocumentListResponse(BaseModel):
    success: bool
    documents: List[str]


class DeleteResponse(BaseModel):
    success: bool
    message: str

class DocumentInfo(BaseModel):
    filename: str
    chunks: int


class DocumentInfoResponse(BaseModel):
    success: bool
    document: Optional[DocumentInfo]