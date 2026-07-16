from  fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db
from api.schemas.auth import UserRegister
from auth.auth import register_user, login_user
from api.schemas.auth import UserLogin

router = APIRouter(prefix="/auth", tags=["Authentication"] )

@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    new_user = register_user(db=db, username=user.username, email=user.email, password=user.password)
    if not new_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    return {"message": "User registered successfully", "user_id": new_user.user_id, "username": new_user.username, "email": new_user.email}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    token = login_user(
        db=db,
        email=user.email,
        password=user.password
    )

    if token is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "access_token": token,
        "token_type": "bearer"
    }