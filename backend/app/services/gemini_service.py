import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-flash-latest")


def ask_gemini(document: str, question: str):

    prompt = f"""
You are Nexora AI.

You are a research assistant.

Answer ONLY using the document below.

If the answer is not present,
reply exactly:

"I couldn't find that information in the uploaded document."

-------------------------

DOCUMENT

{document}

-------------------------

QUESTION

{question}

"""

    try:
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        return f"Gemini Error: {str(e)}"