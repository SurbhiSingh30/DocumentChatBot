from fastapi import APIRouter
from pydantic import BaseModel
from api.schemas.chat import ChatResponse
from rag.pipeline_instance import pipeline

router = APIRouter()


class QuestionRequest(BaseModel):
    question: str


@router.post("/ask", response_model=ChatResponse    )
def ask_question(request: QuestionRequest):

    answer = pipeline.ask(request.question)

    return {
        "success": True,
        "question": request.question,
        "answer": answer
    }