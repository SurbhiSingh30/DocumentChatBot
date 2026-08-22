import os

from config import TOP_K

from parser.pdf_parser import extract_text_from_pdf
from parser.docx_parse import extract_text_from_docx

from processing.cleaner import clean_text
from processing.chunker import create_chunks
from processing.embeddings import EmbeddingModel

from vector_store.chroma_manager import ChromaManager
from llm.groq_client import GroqClient

from utils.logger import logger


class RAGPipeline:

    def __init__(self):
        self.embedding_model = EmbeddingModel()
        self.chroma_manager = None
        self.llm = GroqClient()

    # =========================================================
    # USER
    # =========================================================

    def set_user(self, user_id: int):

        self.chroma_manager = ChromaManager(
            user_id=str(user_id)
        )

    # =========================================================
    # INGEST DOCUMENT
    # =========================================================

    def ingest(self, file_path, replace=False):

        if self.chroma_manager is None:
            raise RuntimeError(
                "User is not set. Call set_user() before ingesting documents."
            )

        filename = os.path.basename(file_path)

        # Prevent duplicate ingestion
        if self.chroma_manager.document_exists(filename) and not replace:

            logger.info(
                f"'{filename}' already exists. Skipping ingestion."
            )

            return False

        # =====================================================
        # EXTRACT TEXT + SOURCE LOCATION
        # =====================================================

        if filename.lower().endswith(".pdf"):

            source_data = extract_text_from_pdf(
                file_path
            )

        elif filename.lower().endswith(".docx"):

            source_data = extract_text_from_docx(
                file_path
            )

        elif filename.lower().endswith(".txt"):

            source_data = self._extract_text_from_txt(
                file_path
            )

        else:

            raise ValueError(
                "Unsupported file format. "
                "Please upload a PDF, DOCX or TXT file."
            )

        print("\n========== PARSER DEBUG ==========")
        print("Type:", type(source_data))
        print("First 2 items:", source_data[:2])
        print("==================================\n")
        if not source_data:
            raise ValueError(
                "No extractable text found in the uploaded document."
            )

        # =====================================================
        # CLEAN TEXT
        # =====================================================

        cleaned_source_data = []

        for source in source_data:

            cleaned = clean_text(
                source["text"]
            )

            if cleaned.strip():

                cleaned_source_data.append({
                    "text": cleaned,
                    "location_type": source["location_type"],
                    "location": source["location"]
                })

        if not cleaned_source_data:
            raise ValueError(
                "No extractable text found in the uploaded document."
            )

        # =====================================================
        # CREATE CHUNKS
        # =====================================================

        chunks = create_chunks(
            cleaned_source_data
        )

        logger.info(
            "Chunks created: %d",
            len(chunks)
        )

        if not chunks:
            raise ValueError(
                "No extractable text found in the uploaded document."
            )

        # =====================================================
        # EXTRACT CHUNK TEXT
        # =====================================================

        chunk_texts = [
            chunk["text"]
            for chunk in chunks
        ]

        # =====================================================
        # GENERATE EMBEDDINGS
        # =====================================================

        embeddings = self.embedding_model.embed_documents(
            chunk_texts
        )

        # =====================================================
        # STORE IN CHROMADB
        # =====================================================

        self.chroma_manager.add_documents(
            chunks=chunk_texts,
            embeddings=embeddings,
            filename=filename,
            metadata=chunks
        )

        logger.info(
            "Stored %d chunks from '%s'",
            len(chunks),
            filename
        )

        return len(chunks)

    # =========================================================
    # TXT EXTRACTION
    # =========================================================

    def _extract_text_from_txt(self, file_path):

        source_data = []

        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as file:

            lines = file.readlines()

        for line_number, line in enumerate(
            lines,
            start=1
        ):

            text = line.strip()

            if text:

                source_data.append({
                    "text": text,
                    "location_type": "line",
                    "location": line_number
                })

        return source_data

    # =========================================================
    # ASK QUESTION
    # =========================================================

    def ask(
    self,
    question,
    filename=None,
    top_k=TOP_K
    ):

        if self.chroma_manager is None:
            raise RuntimeError(
                "User is not set. Call set_user() before asking questions."
            )

        # =====================================================
        # CREATE QUERY EMBEDDING
        # =====================================================

        query_embedding = self.embedding_model.embed_query(
            question
        )

        # =====================================================
        # SEARCH CHROMADB
        # =====================================================

        results = self.chroma_manager.search(
        query_embedding=query_embedding,
        top_k=top_k,
        filename=filename
    )

        documents = results.get(
            "documents",
            [[]]
        )[0]

        metadatas = results.get(
            "metadatas",
            [[]]
        )[0]

        distances = results.get(
            "distances",
            [[]]
        )[0]

        if not documents:
            return {
                "answer": (
                    "I could not find the answer "
                    "in the uploaded document."
                ),
                "sources": []
            }

        # =====================================================
        # BUILD CONTEXT
        # =====================================================

        context = "\n\n".join(
            documents
        )

        # =====================================================
        # GENERATE ANSWER
        # =====================================================

        answer = self.llm.generate_answer(
            question=question,
            context=context
        )

        # =====================================================
        # BUILD SOURCES
        # =====================================================

        sources = []

        for i, metadata in enumerate(metadatas):

            source = {
                "filename": metadata.get(
                    "filename"
                ),
                "location_type": metadata.get(
                    "location_type",
                    "chunk"
                ),
                "location": metadata.get(
                    "location"
                ),
                "chunk_number": metadata.get(
                    "chunk_number"
                ),
                "text": documents[i] if i < len(documents) else ""
            }

            if i < len(distances):
                source["distance"] = distances[i]

            sources.append(
                source
            )

        # =====================================================
        # RETURN ANSWER + SOURCES
        # =====================================================

        return {
            "answer": answer,
            "sources": sources
        }

    # =========================================================
    # GENERATE SUMMARY
    # =========================================================

    def generate_summary(
        self,
        filename: str,
        summary_length: str = "medium"
    ):

        if self.chroma_manager is None:
            raise RuntimeError(
                "User is not set. "
                "Call set_user() before generating summaries."
            )

        document_info = self.chroma_manager.get_document_info(
            filename
        )

        if not document_info:
            raise ValueError(
                "Document not found."
            )

        documents = document_info.get(
            "documents",
            []
        )

        if not documents:
            raise ValueError(
                "No content found for this document."
            )

        context = "\n\n".join(
            documents
        )

        summary = self.llm.generate_summary(
            context=context,
            summary_length=summary_length
        )

        return summary

    # =========================================================
    # LIST DOCUMENTS
    # =========================================================

    def list_documents(self):

        if self.chroma_manager is None:
            return []

        return self.chroma_manager.list_documents()

    # =========================================================
    # REPLACE DOCUMENT
    # =========================================================

    def replace_document(self, file_path):

        if self.chroma_manager is None:
            raise RuntimeError(
                "User is not set. Call set_user() before replacing documents."
            )

        filename = os.path.basename(
            file_path
        )

        self.chroma_manager.delete_document(
            filename
        )

        return self.ingest(
            file_path,
            replace=True
        )

    # =========================================================
    # DELETE DOCUMENT
    # =========================================================

    def delete_document(self, filename):

        if self.chroma_manager is None:
            raise RuntimeError(
                "User is not set. Call set_user() before deleting documents."
            )

        return self.chroma_manager.delete_document(
            filename
        )

    # =========================================================
    # DOCUMENT INFO
    # =========================================================

    def get_document_info(self, filename):

        if self.chroma_manager is None:
            raise RuntimeError(
                "User is not set. Call set_user() before getting document info."
            )

        return self.chroma_manager.get_document_info(
            filename
        )

    # =========================================================
    # SEARCH DOCUMENTS
    # =========================================================

    def search_documents(self, query):

        if self.chroma_manager is None:
            return []

        return self.chroma_manager.search_documents(
            query
        )