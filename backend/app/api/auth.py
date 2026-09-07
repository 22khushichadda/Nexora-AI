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


from sqlalchemy import func


def _get_user_role(user: User, db: Session, workspace_id: int = 7) -> str:
    member = db.query(WorkspaceMember).filter(
        (WorkspaceMember.user_id == user.id) | (func.lower(WorkspaceMember.email) == func.lower(user.email))
    ).first()

    if member:
        if member.user_id is None:
            member.user_id = user.id
            db.commit()

        target_ws_id = member.workspace_id or workspace_id

        oldest_member = db.query(WorkspaceMember).filter(
            WorkspaceMember.workspace_id == target_ws_id
        ).order_by(WorkspaceMember.id.asc()).first()

        if oldest_member and oldest_member.id == member.id:
            if (member.role or "").strip().lower() != "owner":
                member.role = "Owner"
                db.commit()
                db.refresh(member)

        return (member.role or "Member").strip().capitalize()

    first_in_ws = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id
    ).first()

    owner_exists = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        func.lower(WorkspaceMember.role) == "owner"
    ).first()

    new_role = "Owner" if (not first_in_ws or not owner_exists) else "Member"

    new_member = WorkspaceMember(
        workspace_id=workspace_id,
        name=user.name,
        email=user.email.lower(),
        role=new_role,
        user_id=user.id
    )
    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    return new_role


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
    role = _get_user_role(new_user, db)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "created_at": new_user.created_at,
            "role": role
        }
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
    role = _get_user_role(user, db)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "created_at": user.created_at,
            "role": role
        }
    }


# ======================================================
# Current Authenticated User
# ======================================================

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    role = _get_user_role(current_user, db)
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "created_at": current_user.created_at,
        "role": role
    }


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

