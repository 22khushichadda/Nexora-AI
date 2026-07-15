from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

import os
import shutil

from app.database.database import get_db
from app.database.models import Document
from app.schemas.document import DocumentResponse

from app.services.pdf_service import extract_text_from_pdf

from app.rag.chunker import chunk_text
from app.rag.embedding import create_embeddings
from app.rag.vector_store import VectorStore

router = APIRouter(tags=["Documents"])

UPLOAD_FOLDER = "uploads"
INDEX_FOLDER = "indexes"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(INDEX_FOLDER, exist_ok=True)


# -----------------------------
# Upload Document
# -----------------------------
@router.post(
    "/documents/upload/{workspace_id}",
    response_model=DocumentResponse
)
def upload_document(
    workspace_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    filepath = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_text_from_pdf(filepath)

    document = Document(
        filename=file.filename,
        filepath=filepath,
        filetype=file.content_type,
        content=extracted_text,
        workspace_id=workspace_id
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    chunks = chunk_text(extracted_text)

    embeddings = create_embeddings(chunks)

    vector_store = VectorStore()

    vector_store.build(
        embeddings,
        chunks
    )

    index_path = os.path.join(
        INDEX_FOLDER,
        f"workspace_{workspace_id}.index"
    )

    vector_store.save(index_path)

    return document


# -----------------------------
# Get Documents
# -----------------------------
@router.get("/documents/{workspace_id}")
def get_documents(
    workspace_id: int,
    db: Session = Depends(get_db)
):

    documents = db.query(Document).filter(
        Document.workspace_id == workspace_id
    ).all()

    return documents