from pydantic import BaseModel


class ChatResponse(BaseModel):
    success: bool
    question: str
    answer: str