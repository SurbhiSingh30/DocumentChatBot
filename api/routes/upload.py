import os

from fastapi import APIRouter, UploadFile, File, HTTPException
from rag.pipeline_instance import pipeline

router = APIRouter()

UPLOAD_FOLDER = "documents"


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    try:
        # Validate file type
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

        processed = pipeline.ingest(file_path)

        if processed:
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

    except HTTPException:
        raise

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Internal server error."
        )