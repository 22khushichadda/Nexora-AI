from app.database.database import SessionLocal
from app.database.models import Document

from app.services.pdf_service import extract_pdf_data

from app.rag.chunker import chunk_text
from app.rag.embedding import create_embeddings
from app.rag.vector_store import VectorStore

import os

INDEX_FOLDER = "indexes"


def build_document_index(document_id: int):

    db = SessionLocal()

    try:

        document = (
            db.query(Document)
            .filter(Document.id == document_id)
            .first()
        )

        if not document:
            return

        # ----------------------------
        # Extract PDF Content
        # ----------------------------

        pdf = extract_pdf_data(document.filepath)

        document.content = pdf["text"]
        document.pages = pdf["pages"]
        document.title = pdf["title"]
        document.author = pdf["author"]
        document.creator = pdf["creator"]
        document.producer = pdf["producer"]
        document.filesize = pdf["filesize"]

        # ----------------------------
        # Create Chunks
        # ----------------------------

        chunks = chunk_text(document.content)

        # ----------------------------
        # Create Embeddings
        # ----------------------------

        embeddings = create_embeddings(chunks)

        # ----------------------------
        # Build FAISS Index
        # ----------------------------

        store = VectorStore()

        store.create(embeddings)

        store.add_documents(chunks)

        os.makedirs(
            INDEX_FOLDER,
            exist_ok=True
        )

        index_path = os.path.join(
            INDEX_FOLDER,
            f"workspace_{document.workspace_id}.index"
        )

        store.save(index_path)

        # ----------------------------
        # Update Status
        # ----------------------------

        document.status = "ready"

        db.commit()

    except Exception as e:

        print("\n==============================")
        print("BACKGROUND INDEXER ERROR")
        print("==============================")
        print(e)
        print("==============================\n")

        db.rollback()

    finally:

        db.close()