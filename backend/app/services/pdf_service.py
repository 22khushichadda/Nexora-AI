from pypdf import PdfReader
import os


def extract_pdf_data(file_path: str):

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:

            text += page_text + "\n"

    metadata = reader.metadata or {}

    pdf_data = {

        "text": text,

        "pages": len(reader.pages),

        "title": metadata.get("/Title", ""),

        "author": metadata.get("/Author", ""),

        "producer": metadata.get("/Producer", ""),

        "creator": metadata.get("/Creator", ""),

        "filesize": os.path.getsize(file_path)

    }

    return pdf_data