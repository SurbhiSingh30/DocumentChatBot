from fastapi.responses import FileResponse
import os
from fastapi import APIRouter, HTTPException
from rag.pipeline_instance import pipeline
from api.schemas.document import DocumentInfoResponse
from fastapi import HTTPException
from api.schemas.document import (DocumentListResponse, DeleteResponse)


router = APIRouter(prefix="/chat", tags=["Chat"])


@router.get("/documents", response_model=DocumentListResponse)
def get_documents():
    return {
        "success": True,
        "documents": pipeline.list_documents()
    }


@router.delete("/documents/{filename}", response_model=DeleteResponse)
def delete_document(filename: str):

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

@router.get("/documents/{filename}/info", response_model=DocumentInfoResponse)
def get_document_info(filename: str):

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
@router.get("/documents/{filename}/download")
def download_document(filename: str):

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

@router.get("/documents/search")
def search_documents(query: str):

    documents = pipeline.search_documents(query)

    return {
        "success": True,
        "documents": documents
    }
