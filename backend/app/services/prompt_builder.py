def get_prompt_style(question: str):

    q = question.lower()

    # -------------------------
    # Bullet Points
    # -------------------------

    if any(word in q for word in [
        "bullet",
        "points",
        "list"
    ]):

        return """
Return the answer as bullet points.

• Keep every point concise.

• Do not write paragraphs.

"""

    # -------------------------
    # Summary
    # -------------------------

    if any(word in q for word in [

        "summary",

        "summarize",

        "overview"

    ]):

        return """

Generate a structured summary.

Use headings.

Use bullet points.

Mention all important concepts.

"""

    # -------------------------
    # Table
    # -------------------------

    if "table" in q:

        return """

Return the answer as a Markdown table.

"""

    # -------------------------
    # MCQ
    # -------------------------

    if any(word in q for word in [

        "mcq",

        "quiz",

        "multiple choice"

    ]):

        return """

Generate 10 MCQs.

Each question should contain

A)

B)

C)

D)

Mention the correct answer.

"""

    # -------------------------
    # Flashcards
    # -------------------------

    if "flashcard" in q:

        return """

Generate flashcards.

Format:

Question:

Answer:

"""

    # -------------------------
    # Timeline
    # -------------------------

    if "timeline" in q:

        return """

Generate the answer in chronological order.

"""

    # -------------------------
    # Interview
    # -------------------------

    if "interview" in q:

        return """

Generate interview questions with answers.

"""

    # -------------------------
    # Default
    # -------------------------

    return """

Answer professionally.

Use headings.

Use bullet points whenever appropriate.

Never hallucinate.

"""