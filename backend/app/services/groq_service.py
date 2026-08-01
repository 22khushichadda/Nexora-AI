from groq import Groq

from app.database.config import GROQ_API_KEY, GROQ_MODEL
from app.services.prompt_builder import get_prompt_style

client = Groq(api_key=GROQ_API_KEY)


def ask_groq(context: str, question: str):

    style = get_prompt_style(question)

    prompt = f"""
You are Nexora AI.

You are an expert AI Research Assistant.

STRICT RULES

1. Answer ONLY using the uploaded document.

2. Never hallucinate.

3. If the answer is not available in the document,
reply exactly:

"I couldn't find that information in the uploaded document."

4. Follow all formatting instructions.

----------------------------------------------------

Formatting Instructions

{style}

----------------------------------------------------

DOCUMENT

{context}

----------------------------------------------------

QUESTION

{question}

ANSWER
"""

    try:

        response = client.chat.completions.create(

            model=GROQ_MODEL,

            temperature=0.2,

            max_completion_tokens=2048,

            messages=[

                {
                    "role": "system",
                    "content": "You answer ONLY using the supplied document."
                },

                {
                    "role": "user",
                    "content": prompt
                }

            ]

        )

        return response.choices[0].message.content

    except Exception as e:

        return f"Groq Error : {str(e)}"