from pydantic import BaseModel


class ChatRequest(BaseModel):

    workspace_id: int

    question: str


class ChatResponse(BaseModel):

    answer: str