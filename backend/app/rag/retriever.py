from app.rag.embedding import create_embeddings
from app.rag.vector_store import VectorStore


class Retriever:

    def __init__(self, index_path):

        self.store = VectorStore()

        self.store.load(index_path)

    def retrieve(self, question, k=8):

        query_embedding = create_embeddings([question])[0]

        results = self.store.search(
            query_embedding,
            k
        )

        return results