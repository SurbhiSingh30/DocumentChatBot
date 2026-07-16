from sqlalchemy.orm import Session
from database.models import Documents


def create_documents(
        db: Session,
        user_id:int,
        filename: str,
        file_path: str,
        file_type: str,
        file_size: int,
        chunks_count: int
        ):
    document = Documents(
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