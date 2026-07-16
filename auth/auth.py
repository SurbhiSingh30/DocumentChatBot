from sqlalchemy.orm import Session
from database.models import User
from auth.security import hash_password
from auth.security import verify_password
from auth.jwt_handler import create_access_token

def register_user(db, username, email, password):
    print("Password:", password)
    print("Type:", type(password))
    print("Length:", len(password.encode("utf-8")))

    existing_user = db.query(User).filter(
        (User.username == username) | (User.email == email)
    ).first()

    if existing_user:
        return None

    user = User(
        username=username,
        email=email,
        password_hash=hash_password(password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def login_user(db, email, password):

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        return None

    if not verify_password(
        password,
        user.password_hash
    ):
        return None

    token = create_access_token(
        {
            "sub": user.email,
            "user_id": user.user_id
        }
    )

    return token
