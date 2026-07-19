from sqlalchemy.orm import Session
from database.session import get_db
from database.crud import create_chat, create_message
from database.models import Document

from fastapi import HTTPException
from fastapi import APIRouter
from pydantic import BaseModel
from api.schemas.chat import ChatResponse
from rag.pipeline_instance import pipeline
from fastapi import Depends
from auth.dependencies import get_current_user
from database.models import User

router = APIRouter()


class QuestionRequest(BaseModel):
    question: str


@router.post("/ask")
async def ask(
    request: ChatResponse,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    document = db.query(Document).filter(
    Document.user_id == current_user.user_id
    ).first()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="No document found for this user."
        )

    chat = create_chat(
        db=db,
        user_id=current_user.user_id,
        document_id=document.document_id
    )

    create_message(
    db=db,
    chat_id=chat.chat_id,
    sender="user",
    content=request.question
)
    answer = pipeline.ask(request.question)

    create_message(
    db=db,
    chat_id=chat.chat_id,
    sender="assistant",
    content=answer
)
    
    return {
        "success": True,
        "question": request.question,
        "answer": answer
    }