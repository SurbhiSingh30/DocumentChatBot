from fastapi import APIRouter

from rag.pipeline_instance import pipeline

router = APIRouter()


@router.get("/documents")
def list_documents():

    documents = pipeline.list_documents()

    return {
        "success": True,
        "count": len(documents),
        "documents": documents
    }