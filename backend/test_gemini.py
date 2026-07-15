from app.services.gemini_service import ask_gemini

doc = """
Artificial Intelligence is the simulation of human intelligence by machines.

Machine Learning is a subset of Artificial Intelligence.
"""

question = "What is Machine Learning?"

answer = ask_gemini(doc, question)

print(answer)