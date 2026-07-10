import os

from dotenv import load_dotenv
from groq import Groq


class GroqClient:
    """
    Handles communication with the Groq LLM.
    """

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
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0
        )

        return response.choices[0].message.content