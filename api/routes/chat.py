from sqlalchemy.orm import Session
from database.session import get_db

from database.crud import (
    create_chat,
    create_message,
    get_chat
)

from database.models import Document, User

from fastapi import (
    HTTPException,
    APIRouter,
    Depends
)

from pydantic import BaseModel

from auth.dependencies import get_current_user
from rag.pipeline_instance import pipeline


router = APIRouter()


class QuestionRequest(BaseModel):
    question: str
    filename: str


@router.post("/ask")
async def ask(
    request: QuestionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # =====================================================
    # FIND USER DOCUMENT
    # =====================================================

    
    filename = request.filename

    document = db.query(Document).filter(
        Document.user_id == current_user.user_id,
        Document.filename == filename
    ).first()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="No document found for this user."
        )

    # =====================================================
    # GET OR CREATE CHAT
    # =====================================================

    chat = get_chat(
        db=db,
        user_id=current_user.user_id,
        document_id=document.document_id
    )

    if chat is None:

        chat = create_chat(
            db=db,
            user_id=current_user.user_id,
            document_id=document.document_id
        )

    # =====================================================
    # SAVE USER MESSAGE
    # =====================================================

    create_message(
        db=db,
        chat_id=chat.chat_id,
        sender="user",
        content=request.question
    )

    # =====================================================
    # ASK RAG PIPELINE
    # =====================================================

    pipeline.set_user(
        current_user.user_id
    )

    result = pipeline.ask(
    question=request.question,
    filename=request.filename
    )

    answer = result["answer"]
    sources = result["sources"]

    # =====================================================
    # SAVE ASSISTANT MESSAGE
    # =====================================================

    create_message(
        db=db,
        chat_id=chat.chat_id,
        sender="assistant",
        content=answer
    )

    # =====================================================
    # RESPONSE
    # =====================================================

    return {
        "success": True,
        "question": request.question,
        "answer": answer,
        "sources": sources
    }