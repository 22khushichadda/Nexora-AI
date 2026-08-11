from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db

from app.database.models import (
    Workspace,
    WorkspaceMember,
    WorkspaceInvitation
)

from app.schemas.workspace import (
    WorkspaceCreate,
    WorkspaceResponse
)

import secrets
from datetime import datetime, timedelta


router = APIRouter(
    tags=["Workspace"]
)


# ======================================================
# Member / Invitation Request Model
# ======================================================

class MemberRequest(BaseModel):

    workspace_id: int

    name: str

    email: str

    role: str = "Member"


# ======================================================
# Role Update Request
# ======================================================

class RoleUpdateRequest(BaseModel):

    role: str


# ======================================================
# Get All Workspaces
# ======================================================

@router.get(
    "/workspace",
    response_model=list[WorkspaceResponse]
)
def get_workspaces(
    db: Session = Depends(get_db)
):

    return db.query(Workspace).all()


# ======================================================
# Get Workspace by ID
# ======================================================

@router.get(
    "/workspace/{workspace_id}",
    response_model=WorkspaceResponse
)
def get_workspace(

    workspace_id: int,

    db: Session = Depends(get_db)

):

    workspace = (

        db.query(Workspace)

        .filter(
            Workspace.id == workspace_id
        )

        .first()

    )

    if not workspace:

        raise HTTPException(

            status_code=404,

            detail="Workspace not found"

        )

    return workspace


# ======================================================
# Create Workspace
# ======================================================

@router.post(
    "/workspace",
    response_model=WorkspaceResponse
)
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

@router.put(
    "/workspace/{workspace_id}",
    response_model=WorkspaceResponse
)
def update_workspace(

    workspace_id: int,

    updated_workspace: WorkspaceCreate,

    db: Session = Depends(get_db)

):

    workspace = (

        db.query(Workspace)

        .filter(
            Workspace.id == workspace_id
        )

        .first()

    )

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

@router.delete(
    "/workspace/{workspace_id}"
)
def delete_workspace(

    workspace_id: int,

    db: Session = Depends(get_db)

):

    workspace = (

        db.query(Workspace)

        .filter(
            Workspace.id == workspace_id
        )

        .first()

    )

    if not workspace:

        raise HTTPException(

            status_code=404,

            detail="Workspace not found"

        )

    db.delete(workspace)

    db.commit()

    return {

        "message":
        "Workspace deleted successfully"

    }


# ======================================================
# Create Workspace Invitation
# ======================================================

@router.post(
    "/workspace/member"
)
def add_member(

    request: MemberRequest,

    db: Session = Depends(get_db)

):

    # ------------------------------------------
    # Check Workspace
    # ------------------------------------------

    workspace = (

        db.query(Workspace)

        .filter(
            Workspace.id == request.workspace_id
        )

        .first()

    )

    if not workspace:

        raise HTTPException(

            status_code=404,

            detail="Workspace not found."

        )


    # ------------------------------------------
    # Check Existing Member
    # ------------------------------------------

    existing_member = (

        db.query(WorkspaceMember)

        .filter(

            WorkspaceMember.workspace_id ==
            request.workspace_id,

            WorkspaceMember.email ==
            request.email

        )

        .first()

    )

    if existing_member:

        raise HTTPException(

            status_code=400,

            detail="This person is already a workspace member."

        )


    # ------------------------------------------
    # Check Pending Invitation
    # ------------------------------------------

    existing_invitation = (

        db.query(WorkspaceInvitation)

        .filter(

            WorkspaceInvitation.workspace_id ==
            request.workspace_id,

            WorkspaceInvitation.email ==
            request.email,

            WorkspaceInvitation.status ==
            "pending"

        )

        .first()

    )

    if existing_invitation:

        raise HTTPException(

            status_code=400,

            detail="An invitation has already been sent to this email."

        )


    # ------------------------------------------
    # Generate Unique Token
    # ------------------------------------------

    token = secrets.token_urlsafe(32)


    # ------------------------------------------
    # Invitation Expiry
    # ------------------------------------------

    expires_at = (

        datetime.utcnow()

        + timedelta(days=7)

    )


    # ------------------------------------------
    # Create Invitation
    # ------------------------------------------

    invitation = WorkspaceInvitation(

        workspace_id=request.workspace_id,

        name=request.name,

        email=request.email,

        role=request.role,

        token=token,

        status="pending",

        expires_at=expires_at

    )


    db.add(invitation)

    db.commit()

    db.refresh(invitation)


    # ------------------------------------------
    # Temporary Response
    # ------------------------------------------
    #
    # IMPORTANT:
    # We are NOT sending an email yet.
    #
    # This token will later be included
    # in the actual email invitation link.
    # ------------------------------------------

    return {

        "message":
        "Invitation created successfully.",

        "invitation_id":
        invitation.id,

        "status":
        invitation.status,

        "email":
        invitation.email,

        "token":
        invitation.token,

        "expires_at":
        invitation.expires_at

    }


# ======================================================
# Get Workspace Members
# ======================================================

@router.get(
    "/workspace/members/{workspace_id}"
)
def get_members(

    workspace_id: int,

    db: Session = Depends(get_db)

):

    members = (

        db.query(WorkspaceMember)

        .filter(

            WorkspaceMember.workspace_id ==
            workspace_id

        )

        .order_by(

            WorkspaceMember.joined_at.asc()

        )

        .all()

    )


    return [

        {

            "id":
            member.id,

            "name":
            member.name,

            "email":
            member.email,

            "role":
            member.role,

            "joined_at":
            member.joined_at

        }

        for member in members

    ]


# ======================================================
# Remove Member
# ======================================================

@router.delete(
    "/workspace/member/{member_id}"
)
def remove_member(

    member_id: int,

    db: Session = Depends(get_db)

):

    member = (

        db.query(WorkspaceMember)

        .filter(

            WorkspaceMember.id ==
            member_id

        )

        .first()

    )


    if not member:

        raise HTTPException(

            status_code=404,

            detail="Member not found."

        )


    db.delete(member)

    db.commit()


    return {

        "message":
        "Member removed successfully."

    }


# ======================================================
# Update Member Role
# ======================================================

@router.put(
    "/workspace/member/{member_id}"
)
def update_member_role(

    member_id: int,

    request: RoleUpdateRequest,

    db: Session = Depends(get_db)

):

    member = (

        db.query(WorkspaceMember)

        .filter(

            WorkspaceMember.id ==
            member_id

        )

        .first()

    )


    if not member:

        raise HTTPException(

            status_code=404,

            detail="Member not found."

        )


    member.role = request.role

    db.commit()

    db.refresh(member)


    return {

        "message":
        "Role updated successfully."

    }


    # ======================================================
# Get Pending Workspace Invitations
# ======================================================

@router.get("/workspace/invitations/{workspace_id}")
def get_invitations(
    workspace_id: int,
    db: Session = Depends(get_db)
):

    invitations = (
        db.query(WorkspaceInvitation)
        .filter(
            WorkspaceInvitation.workspace_id == workspace_id,
            WorkspaceInvitation.status == "pending"
        )
        .order_by(
            WorkspaceInvitation.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": invitation.id,
            "name": invitation.name,
            "email": invitation.email,
            "role": invitation.role,
            "status": invitation.status,
            "expires_at": invitation.expires_at,
            "created_at": invitation.created_at
        }
        for invitation in invitations
    ]