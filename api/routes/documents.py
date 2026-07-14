from fastapi import APIRouter, HTTPException
from rag.pipeline_instance import pipeline

router = APIRouter()


@router.get("/documents")
def get_documents():
    return {
        "success": True,
        "documents": pipeline.list_documents()
    }


@router.delete("/documents/{filename}")
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
