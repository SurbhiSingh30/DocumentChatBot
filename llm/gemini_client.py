import os
import time

from dotenv import load_dotenv
from google import genai


class GeminiClient:

    def __init__(self):

        load_dotenv()

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("Gemini API Key not found.")

        self.client = genai.Client(api_key=api_key)

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

        for attempt in range(3):
            try:
                response = self.client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=prompt
                )

                return response.text

            except Exception as e:
                print(f"Attempt {attempt + 1} failed: {e}")

                if attempt < 2:
                    print("Retrying in 5 seconds...\n")
                    time.sleep(5)
                else:
                    raise