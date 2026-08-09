import os
from config import LLM_MODEL
from dotenv import load_dotenv
from groq import Groq


class GroqClient:
    def __init__(self):

        load_dotenv()

        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise ValueError("Groq API Key not found.")

        self.client = Groq(api_key=api_key)

    def generate_answer(self, question, context):

        prompt = f"""
You are an AI assistant that answers questions ONLY from the provided document context.

Rules:
1. Use ONLY the context below.
2. Do NOT use outside knowledge.
3. If the answer is not present, reply:
   "I could not find the answer in the uploaded document."
4. Give a concise and accurate answer.

-----------------------
Context
-----------------------

{context}

-----------------------
Question
-----------------------

{question}

-----------------------
Answer
-----------------------
"""

        response = self.client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0
        )
        return response.choices[0].message.content

def generate_summary(self, context, summary_length="medium"):

    length_instructions = {
        "short": "Give a very concise summary in 3-5 bullet points.",
        "medium": "Give a clear summary with 5-8 important bullet points.",
        "detailed": "Give a detailed summary covering all major points, findings, and important information."
    }

    instruction = length_instructions.get(
        summary_length,
        length_instructions["medium"]
    )

    prompt = f"""
You are an AI document summarization assistant.

Your task is to summarize ONLY the provided document context.

Rules:

1. Use ONLY the context below.
2. Do NOT use outside knowledge.
3. Do NOT invent or assume information.
4. {instruction}
5. Keep the summary clear, accurate and easy to read.
6. If the context does not contain enough information, say:
   "I could not generate a summary from the uploaded document."

---

## Document Context

{context}

---

## Summary

"""

    response = self.client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    return response.choices[0].message.content