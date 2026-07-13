from fastapi import APIRouter
from pydantic import BaseModel

from rag.pipeline_instance import pipeline

router = APIRouter()


class QuestionRequest(BaseModel):
    question: str


@router.post("/ask")
def ask_question(request: QuestionRequest):

    answer = pipeline.ask(request.question)

    return {
        "success": True,
        "question": request.question,
        "answer": answer
    }