from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os

from app.database.database import get_db
from app.database.models import Document

from app.rag.retriever import Retriever
from app.services.gemini_service import ask_gemini

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

    document = db.query(Document).filter(
        Document.workspace_id == request.workspace_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="No document found."
        )

    index_path = f"indexes/workspace_{request.workspace_id}.index"

    if not os.path.exists(index_path):

        raise HTTPException(
            status_code=404,
            detail="Vector index not found."
        )

    retriever = Retriever(index_path)

    chunks = retriever.retrieve(
        request.question,
        k=5
    )

    context = "\n\n".join(chunks)

    answer = ask_gemini(
        context,
        request.question
    )

    return {
        "question": request.question,
        "context": chunks,
        "answer": answer
    }