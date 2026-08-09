from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

from database.session import get_db
from auth.dependencies import get_current_user
from database.models import User

from rag.pipeline_instance import pipeline

router = APIRouter(
    prefix="/documents",
    tags=["summary"]
)


@router.post("/{filename}/summary")
async def generate_document_summary(
    filename: str,
    length: str = "medium",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    try:

        pipeline.set_user(
            current_user.user_id
        )

        summary = pipeline.generate_summary(
            filename=filename,
            summary_length=length
        )

        return {
            "success": True,
            "filename": filename,
            "summary": summary
        }

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except Exception as error:

        print("SUMMARY ERROR:", repr(error))

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )