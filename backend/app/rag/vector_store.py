import faiss
import numpy as np
import os


class VectorStore:

    def __init__(self):
        self.index = None
        self.chunks = []

    def build(self, embeddings, chunks):

        dimension = embeddings.shape[1]

        self.index = faiss.IndexFlatL2(dimension)

        self.index.add(
            np.array(embeddings).astype("float32")
        )

        self.chunks = chunks

    def search(self, query_embedding, k=5):

        distances, indices = self.index.search(
            np.array([query_embedding]).astype("float32"),
            k
        )

        results = []

        for idx in indices[0]:

            if idx != -1:

                results.append(self.chunks[idx])

        return results

    def save(self, filepath):

        faiss.write_index(
            self.index,
            filepath
        )

        chunk_file = filepath + ".txt"

        with open(chunk_file, "w", encoding="utf-8") as f:

            for chunk in self.chunks:

                f.write(chunk.replace("\n", " ") + "\n<END>\n")

    def load(self, filepath):

        self.index = faiss.read_index(filepath)

        chunk_file = filepath + ".txt"

        with open(chunk_file, "r", encoding="utf-8") as f:

            text = f.read()

        self.chunks = text.split("\n<END>\n")

        self.chunks = [
            c for c in self.chunks
            if c.strip() != ""
        ]