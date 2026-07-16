from fastapi import APIRouter
from pydantic import BaseModel
from api.schemas.chat import ChatResponse
from rag.pipeline_instance import pipeline
from fastapi import Depends
from auth.dependencies import get_current_user
from database.models import User

router = APIRouter()


class QuestionRequest(BaseModel):
    question: str


@router.post("/ask")
async def ask( request: ChatResponse,current_user: User = Depends(get_current_user)):
    answer = pipeline.ask(request.question)

    return {
        "success": True,
        "question": request.question,
        "answer": answer
    }