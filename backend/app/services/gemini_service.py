import os

import google.generativeai as genai

from dotenv import load_dotenv

from app.services.prompt_builder import get_prompt_style

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def ask_gemini(context, question):

    style = get_prompt_style(question)

    prompt = f"""

You are Nexora AI.

You are an expert research assistant.

STRICT RULES

1.

Answer ONLY using the uploaded document.

2.

Never invent information.

3.

If information is unavailable say

"I couldn't find that information in the uploaded document."

4.

Always follow the formatting requested.

--------------------------------

Formatting

{style}

--------------------------------

Document

{context}

--------------------------------

Question

{question}

"""

    try:

        response = model.generate_content(prompt)

        return response.text

    except Exception:

        return (

            "AI service is currently busy.\n"

            "Please wait a few seconds and try again."

        )