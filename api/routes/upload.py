import os

from fastapi import APIRouter, UploadFile, File
from rag.pipeline_instance import pipeline

router =APIRouter()

UPLOAD_FOLDER="documents"

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    file_path = os.path.join(UPLOAD_FOLDER, file.filename) 

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    pipeline.ingest(file_path)
    return {
        "success": True,
        "message": "Document uploaded and processed successfully.",
        "filename": file.filename
    }
