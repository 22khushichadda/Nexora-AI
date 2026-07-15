from app.rag.embedding import create_embeddings

chunks = [
    "Artificial Intelligence is changing the world.",
    "Machine Learning is a subset of AI.",
    "Deep Learning is based on neural networks."
]

embeddings = create_embeddings(chunks)

print("Number of embeddings:", len(embeddings))
print("Embedding size:", len(embeddings[0]))