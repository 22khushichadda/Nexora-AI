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

    description = Column(String(500), nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # One Workspace can have multiple documents
    documents = relationship(
        "Document",
        back_populates="workspace",
        cascade="all, delete-orphan"
    )


# ======================================================
# Documents Table
# ======================================================
class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    # Original file name
    filename = Column(String(255), nullable=False)

    # Path where the file is stored
    filepath = Column(String(500), nullable=False)

    # MIME type (application/pdf, etc.)
    filetype = Column(String(100))

    # Extracted text from the PDF
    content = Column(String)

    # Upload timestamp
    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # Foreign key to Workspace
    workspace_id = Column(
        Integer,
        ForeignKey("workspaces.id"),
        nullable=False
    )

    # Relationship with Workspace
    workspace = relationship(
        "Workspace",
        back_populates="documents"
    )