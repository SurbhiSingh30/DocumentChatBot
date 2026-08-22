from fastapi.security import OAuth2PasswordRequestForm
from  fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db
from api.schemas.auth import UserRegister
from auth.auth import register_user, login_user, verify_password, hash_password


router = APIRouter(prefix="/auth", tags=["Authentication"] )

@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    new_user = register_user(db=db, username=user.username, email=user.email, password=user.password)
    if not new_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    return {"message": "User registered successfully", "user_id": new_user.user_id, "username": new_user.username, "email": new_user.email}

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    token = login_user(
        db=db,
        email=form_data.username,
        password=form_data.password
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

def change_password(db, user, current_password, new_password):

    if not verify_password(
        current_password,
        user.password_hash
        ):
            return False
    user.password_hash = hash_password(new_password)
                    
    db.commit()
    db.refresh(user)
                            
    return True     

               
            
                    