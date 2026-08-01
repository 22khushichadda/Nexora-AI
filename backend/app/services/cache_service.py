from time import time

CACHE = {}

CACHE_TIME = 300


def get_cached_answer(question):

    if question not in CACHE:

        return None

    answer, timestamp = CACHE[question]

    if time() - timestamp > CACHE_TIME:

        del CACHE[question]

        return None

    return answer


def save_answer(question, answer):

    CACHE[question] = (

        answer,

        time()

    )