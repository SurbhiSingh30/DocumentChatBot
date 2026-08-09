import os

from sqlalchemy.orm import Session

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Query,
    Depends
)

from database.session import get_db
from database.models import User

from auth.dependencies import get_current_user

from api.schemas.upload import UploadResponse

from database.crud import (
    create_document,
    get_document_by_filename,
    update_document
)

from rag.pipeline_instance import pipeline


router = APIRouter(
    prefix="/documents",
    tags=["documents"]
)


UPLOAD_FOLDER = "documents"


@router.post(
    "/upload",
    response_model=UploadResponse
)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    replace: bool = Query(False)
):

    # =========================
    # VALIDATE FILE
    # =========================

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected."
        )

    allowed_extensions = {
        ".pdf",
        ".docx",
        ".txt"
    }

    extension = os.path.splitext(
        file.filename
    )[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOCX and TXT files are supported."
        )

    # =========================
    # CHECK EXISTING DOCUMENT
    # =========================

    existing_document = get_document_by_filename(
        db=db,
        user_id=current_user.user_id,
        filename=file.filename
    )

    if existing_document and not replace:
        raise HTTPException(
            status_code=409,
            detail="Document already exists."
        )

    # =========================
    # SAVE FILE
    # =========================

    os.makedirs(
        UPLOAD_FOLDER,
        exist_ok=True
    )

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        buffer.write(
            await file.read()
        )

    # =========================
    # SET USER FOR RAG
    # =========================

    pipeline.set_user(
        current_user.user_id
    )

    # =========================
    # PROCESS DOCUMENT
    # =========================

    if replace and existing_document:

        chunks_count = pipeline.replace_document(
            file_path
        )

    else:

        chunks_count = pipeline.ingest(
            file_path
        )

    # =========================
    # SAVE / UPDATE DATABASE
    # =========================

    if not chunks_count:
        raise HTTPException(
            status_code=500,
            detail="Document could not be processed."
        )

    file_type = extension.lstrip(".")

    file_size = os.path.getsize(
        file_path
    )

    if existing_document and replace:

        update_document(
            db=db,
            user_id=current_user.user_id,
            filename=file.filename,
            file_path=file_path,
            file_type=file_type,
            file_size=file_size,
            chunks_count=chunks_count
        )

        message = (
            "Document replaced and indexed successfully."
        )

    else:

        create_document(
            db=db,
            user_id=current_user.user_id,
            filename=file.filename,
            file_path=file_path,
            file_type=file_type,
            file_size=file_size,
            chunks_count=chunks_count
        )

        message = (
            "Document uploaded and indexed successfully."
        )

    return {
        "success": True,
        "status": "processed",
        "message": message
    }