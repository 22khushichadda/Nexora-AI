def format_answer(answer):

    answer = answer.replace("•", "\n•")

    answer = answer.replace("-", "\n-")

    answer = answer.strip()

    return answer