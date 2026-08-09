from sqlalchemy.orm import Session
from datetime import datetime
from database.models import Document, Chat, Message


# =========================
# DOCUMENTS
# =========================

def create_document(
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


def get_documents_by_user(
    db: Session,
    user_id: int
):
    return db.query(Document).filter(
        Document.user_id == user_id
    ).order_by(
        Document.document_id.desc()
    ).all()


def get_document_by_filename(
    db: Session,
    user_id: int,
    filename: str
):
    return db.query(Document).filter(
        Document.user_id == user_id,
        Document.filename == filename
    ).first()


def update_document(
    db: Session,
    user_id: int,
    filename: str,
    file_path: str,
    file_type: str,
    file_size: int,
    chunks_count: int
):
    document = db.query(Document).filter(
        Document.user_id == user_id,
        Document.filename == filename
    ).first()

    if not document:
        return None

    document.file_path = file_path
    document.file_type = file_type
    document.file_size = file_size
    document.chunks_count = chunks_count
    document.indexed_at = datetime.utcnow()

    db.commit()
    db.refresh(document)

    return document


def delete_document_record(
    db: Session,
    user_id: int,
    filename: str
):
    document = db.query(Document).filter(
        Document.user_id == user_id,
        Document.filename == filename
    ).first()

    if not document:
        return False

    db.delete(document)
    db.commit()

    return True


def search_documents_by_user(
    db: Session,
    user_id: int,
    query: str
):
    return db.query(Document).filter(
        Document.user_id == user_id,
        Document.filename.ilike(f"%{query}%")
    ).order_by(
        Document.document_id.desc()
    ).all()


# =========================
# CHATS
# =========================

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


def get_chat(
    db: Session,
    user_id: int,
    document_id: int
):
    return db.query(Chat).filter(
        Chat.user_id == user_id,
        Chat.document_id == document_id
    ).first()


# =========================
# MESSAGES
# =========================

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