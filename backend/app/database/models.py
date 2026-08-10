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

    members = relationship(
        "WorkspaceMember",
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

    uploaded_by = Column(
        String(100),
        default="Nexora User"
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

    title = Column(
        String(255),
        nullable=True
    )

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

    bookmarks = relationship(
        "Bookmark",
        cascade="all, delete-orphan"
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

    message_id = Column(
        Integer,
        ForeignKey("messages.id", ondelete="CASCADE"),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    message = relationship(
        "Message"
    )


# ======================================================
# Workspace Members
# ======================================================

class WorkspaceMember(Base):

    __tablename__ = "workspace_members"

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

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(255),
        nullable=False
    )

    role = Column(
        String(20),
        default="Member"
    )

    joined_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    workspace = relationship(
        "Workspace",
        back_populates="members"
    )