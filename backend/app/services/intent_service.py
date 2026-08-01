def detect_intent(question):

    q = question.lower()

    if any(word in q for word in [

        "summary",

        "summarize"

    ]):

        return "summary"

    if any(word in q for word in [

        "bullet",

        "points"

    ]):

        return "bullet"

    if "table" in q:

        return "table"

    if "mcq" in q:

        return "mcq"

    if "flashcard" in q:

        return "flashcard"

    if "quiz" in q:

        return "quiz"

    if "timeline" in q:

        return "timeline"

    if "interview" in q:

        return "interview"

    return "normal"