from app.rag.chunker import chunk_text

text = "Artificial Intelligence " * 1200

chunks = chunk_text(text)

print("Total Chunks:", len(chunks))

for i, chunk in enumerate(chunks):
    print(f"Chunk {i+1}: {len(chunk.split())} words")