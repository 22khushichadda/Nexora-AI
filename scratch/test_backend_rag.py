import sys
from pathlib import Path
backend_dir = Path(__file__).resolve().parents[1] / "backend"
sys.path.insert(0, str(backend_dir))

from app.database.config import GROQ_MODEL
from app.services.rag_service import ask_question

print("Startup GROQ_MODEL loaded:", GROQ_MODEL)

try:
    print("Testing ask_question on workspace_id: 7...")
    res = ask_question(workspace_id=7, question="Summarize this document in simple and easy words.")
    print("SUCCESS!")
    print("Answer:", res["answer"])
    print("Sources count:", len(res["sources"]))
    print("Source snippet 1:", res["sources"][0][:100] if res["sources"] else "None")
except Exception as e:
    print("Error during ask_question:", e)
