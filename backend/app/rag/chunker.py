from typing import List


def chunk_text(
    text: str,
    chunk_size: int = 800,
    overlap: int = 150
) -> List[str]:

    paragraphs = [

        p.strip()

        for p in text.split("\n")

        if p.strip()

    ]

    chunks = []

    current_chunk = ""

    for paragraph in paragraphs:

        if len(current_chunk) + len(paragraph) < chunk_size:

            current_chunk += paragraph + "\n"

        else:

            chunks.append(current_chunk.strip())

            overlap_text = current_chunk[-overlap:]

            current_chunk = overlap_text + "\n" + paragraph

    if current_chunk:

        chunks.append(current_chunk.strip())

    return chunks