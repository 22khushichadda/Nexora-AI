from app.rag.embedding import create_embeddings
from app.rag.vector_store import VectorStore

chunks = [
    "Artificial Intelligence is changing the world.",
    "Machine Learning is a subset of AI.",
    "Deep Learning uses neural networks.",
    "Cats are domestic animals.",
    "Dogs are loyal pets."
]

embeddings = create_embeddings(chunks)

store = VectorStore()

store.build(embeddings, chunks)

query = create_embeddings(["Tell me about Machine Learning"])[0]

results = store.search(query)

print()

print("Retrieved Chunks:")

print("-------------------------")

for r in results:
    print(r)