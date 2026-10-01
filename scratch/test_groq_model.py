import os
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

env_path = Path(__file__).resolve().parents[1] / "backend" / ".env"
load_dotenv(env_path)

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

for m in ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"]:
    try:
        res = client.chat.completions.create(
            model=m,
            temperature=0.2,
            max_completion_tokens=500,
            messages=[
                {"role": "system", "content": "You answer ONLY using the supplied document."},
                {"role": "user", "content": "DOCUMENT:\nNexora AI is a document synthesis platform.\n\nQUESTION:\nWhat is Nexora AI?"}
            ]
        )
        print(f"=== {m} ===")
        print(res.choices[0].message.content)
    except Exception as e:
        print(f"FAILED {m}: {e}")
