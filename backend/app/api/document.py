from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    BackgroundTasks
)

from sqlalchemy.orm import Session

import os
import shutil

from app.database.database import get_db
from app.database.models import Document
from app.schemas.document import DocumentResponse

from app.services.pdf_service import extract_pdf_data
from app.services.background_indexer import build_document_index


router = APIRouter(
    tags=["Documents"]
)


UPLOAD_FOLDER = "uploads"
INDEX_FOLDER = "indexes"


os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

os.makedirs(
    INDEX_FOLDER,
    exist_ok=True
)


# ======================================================
# Upload Document
# ======================================================

@router.post(
    "/documents/upload/{workspace_id}",
    response_model=DocumentResponse
)
def upload_document(

    workspace_id: int,

    background_tasks: BackgroundTasks,

    file: UploadFile = File(...),

    db: Session = Depends(get_db)

):

    filepath = os.path.join(

        UPLOAD_FOLDER,

        file.filename

    )

    with open(filepath, "wb") as buffer:

        shutil.copyfileobj(

            file.file,

            buffer

        )

    # ------------------------------------------
    # Extract PDF Metadata
    # ------------------------------------------

    pdf = extract_pdf_data(

        filepath

    )

    # ------------------------------------------
    # Create Document
    # ------------------------------------------

    document = Document(

        filename=file.filename,

        filepath=filepath,

        filetype=file.content_type,

        filesize=pdf["filesize"],

        pages=pdf["pages"],

        title=pdf["title"],

        author=pdf["author"],

        creator=pdf["creator"],

        producer=pdf["producer"],

        content="",

        status="processing",

        uploaded_by="Khushi",

        workspace_id=workspace_id

    )

    db.add(document)

    db.commit()

    db.refresh(document)

    # ------------------------------------------
    # Background Processing
    # ------------------------------------------

    background_tasks.add_task(

        build_document_index,

        document.id

    )

    return document


# ======================================================
# Get Documents
# ======================================================

@router.get(
    "/documents/{workspace_id}"
)
def get_documents(

    workspace_id: int,

    db: Session = Depends(get_db)

):

    documents = (

        db.query(Document)

        .filter(

            Document.workspace_id == workspace_id

        )

        .order_by(

            Document.id.desc()

        )

        .all()

    )

    return documents


# ======================================================
# Document Status
# ======================================================

@router.get(
    "/documents/status/{workspace_id}"
)
def document_status(

    workspace_id: int,

    db: Session = Depends(get_db)

):

    document = (

        db.query(Document)

        .filter(

            Document.workspace_id == workspace_id

        )

        .order_by(

            Document.id.desc()

        )

        .first()

    )

    if not document:

        return {

            "status": "no_document"

        }

    return {

        "status": document.status

    }