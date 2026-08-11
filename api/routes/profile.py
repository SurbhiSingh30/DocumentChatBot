import os
import uuid
import shutil

from sqlalchemy.orm import Session
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form
)

from database.session import get_db
from database.models import User
from auth.dependencies import get_current_user

router = APIRouter(
    prefix="/profile",
    tags=["profile"]
)


PROFILE_DIR = "storage/profile_images"

os.makedirs(
    PROFILE_DIR,
    exist_ok=True
)


ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
}

MAX_IMAGE_SIZE = 5 * 1024 * 1024


# =========================================================
# GET PROFILE
# =========================================================

@router.get("")
def get_profile(
    current_user: User = Depends(get_current_user)
):

    return {
        "success": True,
        "user_id": current_user.user_id,
        "username": current_user.username,
        "email": current_user.email,
        "organization": current_user.organization,
        "role": current_user.role,
        "bio": current_user.bio,
        "profile_image": current_user.profile_image,
        "created_at": current_user.created_at
    }


# =========================================================
# UPDATE PROFILE
# =========================================================

@router.put("")
def update_profile(
    username: str = Form(...),
    email: str = Form(...),
    organization: str = Form(""),
    role: str = Form(""),
    bio: str = Form(""),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    username = username.strip()
    email = email.strip()

    if not username:
        raise HTTPException(
            status_code=400,
            detail="Name cannot be empty."
        )

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email cannot be empty."
        )

    existing_user = db.query(User).filter(
        User.email == email,
        User.user_id != current_user.user_id
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email is already in use."
        )

    current_user.username = username
    current_user.email = email
    current_user.organization = organization.strip() or None
    current_user.role = role.strip() or None
    current_user.bio = bio.strip() or None

    db.commit()
    db.refresh(current_user)

    return {
        "success": True,
        "message": "Profile updated successfully."
    }


# =========================================================
# UPLOAD PROFILE IMAGE
# =========================================================

@router.post("/image")
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG and WEBP images are allowed."
        )

    contents = await file.read()

    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Profile image must be smaller than 5 MB."
        )

    extension = ALLOWED_IMAGE_TYPES[
        file.content_type
    ]

    filename = (
        f"user_{current_user.user_id}_"
        f"{uuid.uuid4().hex}"
        f"{extension}"
    )

    physical_path = os.path.join(
    PROFILE_DIR,
    filename
    )

    if current_user.profile_image:

        old_filename = os.path.basename(
            current_user.profile_image
        )

        old_path = os.path.join(
            PROFILE_DIR,
            old_filename
        )

        if os.path.exists(old_path):
            os.remove(old_path)

    with open(physical_path, "wb") as buffer:
        buffer.write(contents)

    current_user.profile_image = (
        f"/profile-images/{filename}"
    )

    db.commit()
    db.refresh(current_user)

    return {
        "success": True,
        "profile_image": current_user.profile_image
    }

    file_path = os.path.join(
        PROFILE_DIR,
        filename
    )

    # Delete old image
    if current_user.profile_image:

        old_path = current_user.profile_image

        if os.path.exists(old_path):
            os.remove(old_path)

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    current_user.profile_image = file_path

    db.commit()
    db.refresh(current_user)

    return {
        "success": True,
        "profile_image": file_path
    }


# =========================================================
# REMOVE PROFILE IMAGE
# =========================================================

@router.delete("/image")
def remove_profile_image(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.profile_image:

        if os.path.exists(
            current_user.profile_image
        ):
            os.remove(
                current_user.profile_image
            )

    current_user.profile_image = None

    db.commit()

    return {
        "success": True,
        "message": "Profile image removed."
    }