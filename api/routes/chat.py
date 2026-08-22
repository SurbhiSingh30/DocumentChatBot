from sqlalchemy.orm import Session
from database.session import get_db

from database.crud import (
    create_chat,
    create_message,
    get_chat,
    get_chats_by_user,
    get_chat_by_id,
    get_messages_by_chat,
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


# =========================================================
# REQUEST MODEL
# =========================================================

class QuestionRequest(BaseModel):
    question: str
    filename: str
    chat_id: int | None = None


# =========================================================
# ASK QUESTION
# =========================================================

@router.post("/ask")
async def ask(
    request: QuestionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # =====================================================
    # FIND USER DOCUMENT
    # =====================================================

    document = db.query(Document).filter(
        Document.user_id == current_user.user_id,
        Document.filename == request.filename
    ).first()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="No document found for this user."
        )

    # =====================================================
    # GET EXISTING CHAT OR CREATE NEW CHAT
    # =====================================================

    chat = None

    if request.chat_id is not None:

        chat = get_chat(
            db=db,
            user_id=current_user.user_id,
            chat_id=request.chat_id
        )

        if chat is None:
            raise HTTPException(
                status_code=404,
                detail="Chat not found."
            )

        # Make sure this chat belongs to the selected document
        if chat.document_id != document.document_id:
            raise HTTPException(
                status_code=400,
                detail="Chat does not belong to the selected document."
            )

    else:

        chat = create_chat(
            db=db,
            user_id=current_user.user_id,
            document_id=document.document_id
        )

    # =====================================================
    # SET CHAT TITLE FROM FIRST QUESTION
    # =====================================================

    if chat.title == "New Chat":

        chat_title = request.question.strip()

        if len(chat_title) > 80:
            chat_title = chat_title[:77] + "..."

        chat.title = chat_title

        db.commit()
        db.refresh(chat)

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
        "chat_id": chat.chat_id,
        "chat_title": chat.title,
        "question": request.question,
        "answer": answer,
        "sources": sources
    }


# =========================================================
# GET USER CHATS
# =========================================================

@router.get("")
async def get_user_chats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    chats = get_chats_by_user(
        db=db,
        user_id=current_user.user_id
    )

    return {
        "success": True,
        "chats": [
            {
                "chat_id": chat.chat_id,
                "title": chat.title,
                "document_id": chat.document_id,
                "document_name": (
                    chat.document.filename
                    if chat.document
                    else None
                ),
                "created_at": chat.created_at
            }
            for chat in chats
        ]
    }


# =========================================================
# GET ALL CHATS
# =========================================================

@router.get("/chats")
async def get_all_chats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    chats = get_chats_by_user(
        db=db,
        user_id=current_user.user_id
    )

    return {
        "success": True,
        "chats": [
            {
                "chat_id": chat.chat_id,
                "title": chat.title,
                "document_id": chat.document_id,
                "document_name": (
                    chat.document.filename
                    if chat.document
                    else None
                ),
                "created_at": chat.created_at,
            }
            for chat in chats
        ]
    }


# =========================================================
# GET SINGLE CHAT + MESSAGES
# =========================================================

@router.get("/chats/{chat_id}")
async def get_single_chat(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    chat = get_chat_by_id(
        db=db,
        user_id=current_user.user_id,
        chat_id=chat_id
    )

    if chat is None:
        raise HTTPException(
            status_code=404,
            detail="Chat not found."
        )

    messages = get_messages_by_chat(
        db=db,
        chat_id=chat.chat_id
    )

    return {
        "success": True,

        "chat": {
            "chat_id": chat.chat_id,
            "title": chat.title,
            "document_id": chat.document_id,
            "document_name": (
                chat.document.filename
                if chat.document
                else None
            ),
            "created_at": chat.created_at,
        },

        "messages": [
            {
                "message_id": message.message_id,
                "sender": message.sender,
                "content": message.content,
                "created_at": message.created_at,
            }
            for message in messages
        ]
    }