from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.session import get_db
from database.models import User
from auth.dependencies import get_current_user
from auth.auth import change_password

from api.schemas.settings import ChangePasswordRequest


router = APIRouter(
    prefix="/settings",
    tags=["Settings"]
)


@router.put("/password")
def update_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if len(request.new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="New password must be at least 8 characters."
        )

    success = change_password(
        db=db,
        user=current_user,
        current_password=request.current_password,
        new_password=request.new_password
    )

    if not success:
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect."
        )

    return {
        "success": True,
        "message": "Password changed successfully."
    }