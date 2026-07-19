from sqlalchemy.orm import Session
from database.models import Document, Chat, Message


def create_documents(
    db: Session,
    user_id: int,
    filename: str,
    file_path: str,
    file_type: str,
    file_size: int,
    chunks_count: int
):
    document = Document(
        user_id=user_id,
        filename=filename,
        file_path=file_path,
        file_type=file_type,
        file_size=file_size,
        chunks_count=chunks_count
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


def create_chat(
    db: Session,
    user_id: int,
    document_id: int
):
    chat = Chat(
        user_id=user_id,
        document_id=document_id
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat


def create_message(
    db: Session,
    chat_id: int,
    sender: str,
    content: str
):
    message = Message(
        chat_id=chat_id,
        sender=sender,
        content=content
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message