from pydantic import BaseModel
from datetime import datetime


class BookmarkCreate(BaseModel):

    workspace_id: int

    question: str

    answer: str


class BookmarkResponse(BaseModel):

    id: int

    workspace_id: int

    question: str

    answer: str

    created_at: datetime

    class Config:

        from_attributes = True