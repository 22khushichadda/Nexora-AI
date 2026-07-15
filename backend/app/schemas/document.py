from pydantic import BaseModel
from datetime import datetime


class DocumentResponse(BaseModel):
    id: int
    filename: str
    filepath: str
    filetype: str | None
    content: str | None
    uploaded_at: datetime
    workspace_id: int

    class Config:
        from_attributes = True