from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User, WorkspaceMember, WorkspaceInvitation
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse
)
from app.utils.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ======================================================
# Register User
# ======================================================

@router.post(
    "/register",
    response_model=TokenResponse
)
def register_user(
    request: UserRegister,
    db: Session = Depends(get_db)
):
    name = request.name.strip()
    email = request.email.strip().lower()
    password = request.password

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Please enter your name"
        )

    if not email or "@" not in email:
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid email"
        )

    if not password or len(password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters"
        )

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists"
        )

    hashed = hash_password(password)

    new_user = User(
        name=name,
        email=email,
        password_hash=hashed
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Link existing WorkspaceMembers or pending WorkspaceInvitations to user.id
    members = db.query(WorkspaceMember).filter(WorkspaceMember.email == email).all()
    for member in members:
        member.user_id = new_user.id
    if members:
        db.commit()

    token = create_access_token(data={"sub": new_user.id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user
    }


# ======================================================
# Login User
# ======================================================

@router.post(
    "/login",
    response_model=TokenResponse
)
def login_user(
    request: UserLogin,
    db: Session = Depends(get_db)
):
    email = request.email.strip().lower()
    password = request.password

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Please enter your email"
        )

    if not password:
        raise HTTPException(
            status_code=400,
            detail="Please enter your password"
        )

    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )

    token = create_access_token(data={"sub": user.id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


# ======================================================
# Current Authenticated User
# ======================================================

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user


# ======================================================
# Logout
# ======================================================

@router.post(
    "/logout"
)
def logout_user():
    return {
        "message": "Logged out successfully."
    }
