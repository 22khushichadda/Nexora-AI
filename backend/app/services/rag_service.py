from groq import Groq

from app.rag.retriever import Retriever
from app.database.config import GROQ_API_KEY, GROQ_MODEL

INDEX_FOLDER = "indexes"


client = Groq(api_key=GROQ_API_KEY)


def ask_question(workspace_id: int, question: str):

    index_path = f"{INDEX_FOLDER}/workspace_{workspace_id}.index"

    retriever = Retriever(index_path)

    chunks = retriever.retrieve(question)

    context = "\n\n".join(chunks)

    prompt = f"""
You are Nexora AI.

Answer ONLY from the provided context.

If the answer is not present in the context,
reply with:

"I couldn't find that information in the uploaded documents."

-------------------------

Context:

{context}

-------------------------

Question:

{question}

Answer:
"""

    response = client.chat.completions.create(

        model=GROQ_MODEL,

        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],

        temperature=0.2

    )

    return {

        "answer": response.choices[0].message.content,

        "sources": chunks

    }