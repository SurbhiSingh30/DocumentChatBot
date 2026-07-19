import os

from sqlalchemy.orm import Session
from database.session import get_db
from auth.dependencies import get_current_user
from database.models import User
from fastapi import Depends
from api.schemas.upload import UploadResponse
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from database.crud import create_documents as create_document

from rag.pipeline_instance import pipeline

router = APIRouter(prefix="/documents", tags=["documents"])

UPLOAD_FOLDER = "documents"

@router.post("/upload", response_model=UploadResponse)
async def upload_document(
    file: UploadFile = File(...), 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db), 
    replace: bool = Query(False)
    ):

        if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
            raise HTTPException(
                status_code=400,
                detail="Only PDF and DOCX files are supported."
            )

        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        file_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        if replace:
            processed = pipeline.replace_document(file_path)
        else:
            processed = pipeline.ingest(file_path)

        if processed:
            create_document(
                db=db,
                user_id=current_user.user_id,
                filename=file.filename,
                file_path=file_path,
                file_type=file.filename.split(".")[-1],
                file_size=os.path.getsize(file_path),
                chunks_count=0
           )
            return {
                "success": True,
                "status": "processed",
                "message": "Document uploaded and indexed successfully."
            }

        return {
            "success": True,
            "status": "already_exists",
            "message": "Document already exists."
        }

    