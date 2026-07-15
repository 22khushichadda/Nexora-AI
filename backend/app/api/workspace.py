from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Workspace
from app.schemas.workspace import WorkspaceCreate, WorkspaceResponse

router = APIRouter(tags=["Workspace"])


# -----------------------------
# Get All Workspaces
# -----------------------------
@router.get("/workspace", response_model=list[WorkspaceResponse])
def get_workspaces(db: Session = Depends(get_db)):
    return db.query(Workspace).all()


# -----------------------------
# Get Workspace by ID
# -----------------------------
@router.get("/workspace/{workspace_id}", response_model=WorkspaceResponse)
def get_workspace(workspace_id: int, db: Session = Depends(get_db)):
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id
    ).first()

    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    return workspace


# -----------------------------
# Create Workspace
# -----------------------------
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


# -----------------------------
# Update Workspace
# -----------------------------
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
        raise HTTPException(status_code=404, detail="Workspace not found")

    workspace.name = updated_workspace.name
    workspace.description = updated_workspace.description

    db.commit()
    db.refresh(workspace)

    return workspace


# -----------------------------
# Delete Workspace
# -----------------------------
@router.delete("/workspace/{workspace_id}")
def delete_workspace(
    workspace_id: int,
    db: Session = Depends(get_db)
):

    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id
    ).first()

    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    db.delete(workspace)
    db.commit()

    return {
        "message": "Workspace deleted successfully"
    }