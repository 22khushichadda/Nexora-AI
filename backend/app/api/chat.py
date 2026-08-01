from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os

from app.database.database import get_db
from app.database.models import Document

from app.services.rag_service import ask_question

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    workspace_id: int
    question: str


@router.post("/")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    document = (
        db.query(Document)
        .filter(Document.workspace_id == request.workspace_id)
        .order_by(Document.id.desc())
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="No document found."
        )

    if document.status != "ready":
        return {
            "answer": "🧠 Your document is still being processed.\n\nPlease wait a few seconds."
        }

    q = request.question.lower()

    if "how many pages" in q:
        return {
            "answer": f"This document contains {document.pages} pages."
        }

    if "author" in q:
        return {
            "answer": document.author or "Author information unavailable."
        }

    if "title" in q:
        return {
            "answer": document.title or document.filename
        }

    index_path = f"indexes/workspace_{request.workspace_id}.index"

    if not os.path.exists(index_path):
        raise HTTPException(
            status_code=404,
            detail="Vector index not found."
        )

    try:

        response = ask_question(
            request.workspace_id,
            request.question
        )

        return {
            "question": request.question,
            "answer": response["answer"],
            "sources": response["sources"]
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )