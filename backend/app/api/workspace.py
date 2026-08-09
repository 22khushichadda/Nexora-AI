from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db
from app.database.models import (
    Workspace,
    WorkspaceMember
)

from app.schemas.workspace import (
    WorkspaceCreate,
    WorkspaceResponse
)

router = APIRouter(tags=["Workspace"])


# ======================================================
# Member Request Model
# ======================================================

class MemberRequest(BaseModel):

    workspace_id: int

    name: str

    email: str

    role: str = "Member"


# ======================================================
# Get All Workspaces
# ======================================================

@router.get("/workspace", response_model=list[WorkspaceResponse])
def get_workspaces(
    db: Session = Depends(get_db)
):

    return db.query(Workspace).all()


# ======================================================
# Get Workspace by ID
# ======================================================

@router.get("/workspace/{workspace_id}", response_model=WorkspaceResponse)
def get_workspace(
    workspace_id: int,
    db: Session = Depends(get_db)
):

    workspace = db.query(Workspace).filter(

        Workspace.id == workspace_id

    ).first()

    if not workspace:

        raise HTTPException(

            status_code=404,

            detail="Workspace not found"

        )

    return workspace


# ======================================================
# Create Workspace
# ======================================================

@router.post("/workspace", response_model=WorkspaceResponse)
def create_workspace(

    workspace: WorkspaceCreate,

    db: Session = Depends(get_db)

):

    new_workspace = Workspace(

        name=workspace.name,

        description=workspace.description

    )

    db.add(new_workspace)

    db.commit()

    db.refresh(new_workspace)

    return new_workspace


# ======================================================
# Update Workspace
# ======================================================

@router.put("/workspace/{workspace_id}", response_model=WorkspaceResponse)
def update_workspace(

    workspace_id: int,

    updated_workspace: WorkspaceCreate,

    db: Session = Depends(get_db)

):

    workspace = db.query(Workspace).filter(

        Workspace.id == workspace_id

    ).first()

    if not workspace:

        raise HTTPException(

            status_code=404,

            detail="Workspace not found"

        )

    workspace.name = updated_workspace.name

    workspace.description = updated_workspace.description

    db.commit()

    db.refresh(workspace)

    return workspace


# ======================================================
# Delete Workspace
# ======================================================

@router.delete("/workspace/{workspace_id}")
def delete_workspace(

    workspace_id: int,

    db: Session = Depends(get_db)

):

    workspace = db.query(Workspace).filter(

        Workspace.id == workspace_id

    ).first()

    if not workspace:

        raise HTTPException(

            status_code=404,

            detail="Workspace not found"

        )

    db.delete(workspace)

    db.commit()

    return {

        "message": "Workspace deleted successfully"

    }


# ======================================================
# Invite Member
# ======================================================

@router.post("/workspace/member")
def add_member(

    request: MemberRequest,

    db: Session = Depends(get_db)

):

    existing = db.query(WorkspaceMember).filter(

        WorkspaceMember.workspace_id == request.workspace_id,

        WorkspaceMember.email == request.email

    ).first()

    if existing:

        raise HTTPException(

            status_code=400,

            detail="Member already exists."

        )

    member = WorkspaceMember(

        workspace_id=request.workspace_id,

        name=request.name,

        email=request.email,

        role=request.role

    )

    db.add(member)

    db.commit()

    db.refresh(member)

    return {

        "message": "Member added successfully.",

        "member_id": member.id

    }

    # ======================================================
# Get Workspace Members
# ======================================================

@router.get("/workspace/members/{workspace_id}")
def get_members(

    workspace_id: int,

    db: Session = Depends(get_db)

):

    members = (

        db.query(WorkspaceMember)

        .filter(

            WorkspaceMember.workspace_id == workspace_id

        )

        .order_by(

            WorkspaceMember.joined_at.asc()

        )

        .all()

    )

    return [

        {

            "id": member.id,

            "name": member.name,

            "email": member.email,

            "role": member.role,

            "joined_at": member.joined_at

        }

        for member in members

    ]