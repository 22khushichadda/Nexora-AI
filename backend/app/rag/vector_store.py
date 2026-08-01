import faiss
import numpy as np
import pickle
import os


class VectorStore:

    def __init__(self):
        self.index = None
        self.documents = []

    # ----------------------------
    # Create FAISS Index
    # ----------------------------
    def create(self, embeddings):

        embeddings = np.array(embeddings).astype("float32")

        dimension = embeddings.shape[1]

        self.index = faiss.IndexFlatL2(dimension)

        self.index.add(embeddings)

    # ----------------------------
    # Store Chunks
    # ----------------------------
    def add_documents(self, documents):

        self.documents = documents

    # ----------------------------
    # Save Index & Documents
    # ----------------------------
    def save(self, index_path):

        os.makedirs(os.path.dirname(index_path), exist_ok=True)

        # Save FAISS index
        faiss.write_index(
            self.index,
            index_path
        )

        # Save document chunks
        with open(index_path + ".pkl", "wb") as f:
            pickle.dump(self.documents, f)

    # ----------------------------
    # Load Index & Documents
    # ----------------------------
    def load(self, index_path):

        self.index = faiss.read_index(index_path)

        with open(index_path + ".pkl", "rb") as f:
            self.documents = pickle.load(f)

    # ----------------------------
    # Search
    # ----------------------------
    def search(self, query_embedding, k=5):

        query_embedding = np.array(
            [query_embedding]
        ).astype("float32")

        distances, indices = self.index.search(
            query_embedding,
            k
        )

        results = []

        for idx in indices[0]:

            if idx != -1:

                results.append(self.documents[idx])

        return results