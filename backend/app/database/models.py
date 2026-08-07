from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


# ======================================================
# Workspace Table
# ======================================================

class Workspace(Base):

    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=False)

    description = Column(String(500))

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # ------------------------
    # Relationships
    # ------------------------

    documents = relationship(
        "Document",
        back_populates="workspace",
        cascade="all, delete-orphan"
    )

    conversations = relationship(
        "Conversation",
        back_populates="workspace",
        cascade="all, delete-orphan"
    )


# ======================================================
# Documents Table
# ======================================================

class Document(Base):

    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String(255), nullable=False)

    filepath = Column(String(500), nullable=False)

    filetype = Column(String(100))

    filesize = Column(Integer)

    pages = Column(Integer)

    title = Column(String(255))

    author = Column(String(255))

    creator = Column(String(255))

    producer = Column(String(255))

    content = Column(String)

    status = Column(
        String(20),
        default="processing"
    )

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    workspace_id = Column(
        Integer,
        ForeignKey("workspaces.id"),
        nullable=False
    )

    workspace = relationship(
        "Workspace",
        back_populates="documents"
    )


# ======================================================
# Conversation Table
# ======================================================

class Conversation(Base):

    __tablename__ = "conversations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    workspace_id = Column(
        Integer,
        ForeignKey("workspaces.id"),
        nullable=False
    )

    workspace = relationship(
        "Workspace",
        back_populates="conversations"
    )

    # First question becomes history title
    title = Column(
        String(255),
        nullable=True
    )

    # Active conversation
    is_active = Column(
        Integer,
        default=1
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    messages = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan"
    )


# ======================================================
# Message Table
# ======================================================

class Message(Base):

    __tablename__ = "messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    conversation_id = Column(
        Integer,
        ForeignKey("conversations.id"),
        nullable=False
    )

    role = Column(
        String(20)
    )

    content = Column(
        String
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    conversation = relationship(
        "Conversation",
        back_populates="messages"
    )


# ======================================================
# Bookmark Table
# ======================================================

class Bookmark(Base):

    __tablename__ = "bookmarks"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    workspace_id = Column(
        Integer,
        ForeignKey("workspaces.id"),
        nullable=False
    )

    question = Column(
        String,
        nullable=False
    )

    answer = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )