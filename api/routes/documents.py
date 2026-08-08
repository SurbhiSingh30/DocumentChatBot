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
from database.session import get_db
from database.crud import (
    get_documents_by_user,
    delete_document_record
)
from sqlalchemy.orm import Session
router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get("", response_model=DocumentListResponse)
def get_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    documents = get_documents_by_user(
        db=db,
        user_id=current_user.user_id
    )

    return {
        "success": True,
        "documents": documents
    }

@router.delete("/{filename}", response_model=DeleteResponse)
def delete_document(
    filename: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Set the current user's ChromaDB
    pipeline.set_user(current_user.user_id)

    # Delete from ChromaDB
    deleted_from_chroma = pipeline.delete_document(filename)

    if not deleted_from_chroma:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    # Delete from SQL database
    delete_document_record(
        db=db,
        user_id=current_user.user_id,
        filename=filename
    )

    # Delete physical file
    file_path = os.path.join("documents", filename)

    if os.path.exists(file_path):
        os.remove(file_path)

    return {
        "success": True,
        "message": f"{filename} deleted successfully."
    }

@router.get("/{filename}/info", response_model=DocumentInfoResponse)
def get_document_info(filename: str, current_user: User = Depends(get_current_user)):

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
def download_document(filename: str, current_user: User = Depends(get_current_user)):

    file_path = os.path.join("documents", filename)

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/pdf",
        headers={
            "Content-Disposition":"inline"
        }
    )

@router.get("/search")
def search_documents(query: str, current_user: User = Depends(get_current_user) ):

    documents = pipeline.search_documents(query)

    return {
        "success": True,
        "documents": documents
    }
