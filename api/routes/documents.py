from fastapi.responses import FileResponse
import os
from fastapi import APIRouter, HTTPException
from rag.pipeline_instance import pipeline
from api.schemas.document import DocumentInfoResponse
from fastapi import HTTPException
from api.schemas.document import (DocumentListResponse, DeleteResponse)
from fastapi import Depends
from auth.dependencies import get_current_user
from database.models import User
from api.schemas.chat import ChatResponse

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get("", response_model=DocumentListResponse)
def get_documents(request: ChatResponse, current_user: User = Depends(get_current_user)):
    answer = pipeline.list_documents()
    return {
        "success": True,
        "documents": answer
    }


@router.delete("/{filename}", response_model=DeleteResponse)
def delete_document(filename: str,request: ChatResponse, current_user: User = Depends(get_current_user)):

    deleted = pipeline.delete_document(filename)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return {
        "success": True,
        "message": f"{filename} deleted successfully."
    }

@router.get("/{filename}/info", response_model=DocumentInfoResponse)
def get_document_info(filename: str, request: ChatResponse, current_user: User = Depends(get_current_user)):

    document = pipeline.get_document_info(filename)

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return {
        "success": True,
        "document": document
    }
@router.get("/{filename}/download")
def download_document(filename: str, request: ChatResponse, current_user: User = Depends(get_current_user)):

    file_path = os.path.join("documents", filename)

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream"
    )

@router.get("/search")
def search_documents(query: str, request: ChatResponse, current_user: User = Depends(get_current_user) ):

    documents = pipeline.search_documents(query)

    return {
        "success": True,
        "documents": documents
    }
