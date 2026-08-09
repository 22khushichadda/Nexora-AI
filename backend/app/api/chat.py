from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os

from app.database.database import get_db
from app.database.models import (
    Document,
    Conversation,
    Message,
    Bookmark
)

from app.services.rag_service import ask_question

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


# ======================================================
# Request Model
# ======================================================

class ChatRequest(BaseModel):

    workspace_id: int

    question: str

    conversation_id: int | None = None


# ======================================================
# Chat Endpoint
# ======================================================

@router.post("/")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    # ---------------------------------
    # Find latest document
    # ---------------------------------

    document = (
        db.query(Document)
        .filter(
            Document.workspace_id == request.workspace_id
        )
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

            "answer":
            "🧠 Your document is still being processed.\n\nPlease wait a few seconds."

        }

    q = request.question.lower()

    if "how many pages" in q:

        return {

            "answer":
            f"This document contains {document.pages} pages."

        }

    if "author" in q:

        return {

            "answer":
            document.author or "Author information unavailable."

        }

    if "title" in q:

        return {

            "answer":
            document.title or document.filename

        }

    index_path = f"indexes/workspace_{request.workspace_id}.index"

    if not os.path.exists(index_path):

        raise HTTPException(

            status_code=404,

            detail="Vector index not found."

        )

    # ---------------------------------
    # Get or Create Conversation
    # ---------------------------------

    conversation = None

    if request.conversation_id:

        conversation = (

            db.query(Conversation)

            .filter(

                Conversation.id == request.conversation_id,

                Conversation.workspace_id == request.workspace_id

            )

            .first()

        )

    if conversation is None:

        db.query(Conversation).filter(

            Conversation.workspace_id == request.workspace_id

        ).update(

            {

                "is_active": 0

            }

        )

        db.commit()

        conversation = Conversation(

            workspace_id=request.workspace_id,

            title=request.question,

            is_active=1

        )

        db.add(conversation)

        db.commit()

        db.refresh(conversation)

    try:
                # ---------------------------------
        # Save User Message
        # ---------------------------------

        user_message = Message(

            conversation_id=conversation.id,

            role="user",

            content=request.question

        )

        db.add(user_message)

        db.commit()

        # ---------------------------------
        # Ask AI
        # ---------------------------------

        response = ask_question(

            request.workspace_id,

            request.question

        )

               # ---------------------------------
        # Save AI Message
        # ---------------------------------

        ai_message = Message(

            conversation_id=conversation.id,

            role="assistant",

            content=response["answer"]

        )

        db.add(ai_message)

        db.commit()

        db.refresh(ai_message)

        return {

            "conversation_id": conversation.id,

            "message_id": ai_message.id,

            "question": request.question,

            "answer": response["answer"],

            "sources": response["sources"]

        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )


# ======================================================
# Create New Conversation
# ======================================================

class NewConversationRequest(BaseModel):

    workspace_id: int


@router.post("/new")
def create_new_conversation(

    request: NewConversationRequest,

    db: Session = Depends(get_db)

):

    # Deactivate previous conversations

    db.query(Conversation).filter(

        Conversation.workspace_id == request.workspace_id

    ).update(

        {

            "is_active": 0

        }

    )

    db.commit()

    # Create new conversation

    conversation = Conversation(

        workspace_id=request.workspace_id,

        title="New Chat",

        is_active=1

    )

    db.add(conversation)

    db.commit()

    db.refresh(conversation)

    return {

        "conversation_id": conversation.id,

        "message": "New conversation created successfully."

    }

    # ======================================================
# Get Conversation History
# ======================================================

@router.get("/history/{workspace_id}")
def get_history(
    workspace_id: int,
    db: Session = Depends(get_db)
):

    conversations = (
        db.query(Conversation)
        .filter(
            Conversation.workspace_id == workspace_id
        )
        .order_by(
            Conversation.created_at.desc()
        )
        .all()
    )

    history = []

    for conversation in conversations:

        history.append({

            "id": conversation.id,

            "title": conversation.title,

            "created_at": conversation.created_at,

            "is_active": conversation.is_active

        })

    return history
# ======================================================
# Get One Conversation
# ======================================================

@router.get("/conversation/{conversation_id}")
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db)
):

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id
        )
        .first()
    )

    if conversation is None:

        raise HTTPException(
            status_code=404,
            detail="Conversation not found."
        )

    messages = (
        db.query(Message)
        .filter(
            Message.conversation_id == conversation_id
        )
        .order_by(
            Message.created_at.asc()
        )
        .all()
    )

    return {

        "conversation_id": conversation.id,

        "title": conversation.title,

        "messages": [

            {

    "id": msg.id,

    "sender": "user" if msg.role == "user" else "ai",

    "text": msg.content

}

            for msg in messages

        ]

    }
# ======================================================
# Add Bookmark
# ======================================================

@router.post("/bookmark/{message_id}")
def bookmark_message(
    message_id: int,
    db: Session = Depends(get_db)
):

    existing = db.query(Bookmark).filter(
        Bookmark.message_id == message_id
    ).first()

    if existing:

        return {

            "message": "Already bookmarked."

        }

    bookmark = Bookmark(

        message_id=message_id

    )

    db.add(bookmark)

    db.commit()

    db.refresh(bookmark)

    return {

        "message": "Bookmark added.",

        "bookmark_id": bookmark.id

    }

    # ======================================================
# Get All Bookmarks
# ======================================================

@router.get("/bookmarks")
def get_bookmarks(
    db: Session = Depends(get_db)
):

    bookmarks = db.query(Bookmark).all()

    result = []

    for bookmark in bookmarks:

        result.append({

    "bookmark_id": bookmark.id,

    "message_id": bookmark.message.id,

    "conversation_id": bookmark.message.conversation_id,

    "conversation_title":
        bookmark.message.conversation.title,

    "answer": bookmark.message.content,

    "created_at": bookmark.created_at

})

    return result
# ======================================================
# Delete Bookmark
# ======================================================

@router.delete("/bookmark/{message_id}")
def delete_bookmark(
    message_id: int,
    db: Session = Depends(get_db)
):

    bookmark = db.query(Bookmark).filter(

        Bookmark.message_id == message_id

    ).first()

    if bookmark is None:

        raise HTTPException(

            status_code=404,

            detail="Bookmark not found."

        )

    db.delete(bookmark)

    db.commit()

    return {

        "message": "Bookmark removed."

    }