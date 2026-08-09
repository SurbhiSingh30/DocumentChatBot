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

        # Prevent duplicate ingestion unless replacing
        if self.chroma_manager.document_exists(filename) and not replace:

            logger.info(
                f"'{filename}' already exists. Skipping ingestion."
            )

            return False

        # =====================================================
        # EXTRACT TEXT
        # =====================================================

        if filename.lower().endswith(".pdf"):

            raw_text = extract_text_from_pdf(file_path)

        elif filename.lower().endswith(".docx"):

            raw_text = extract_text_from_docx(file_path)

        elif filename.lower().endswith(".txt"):

            with open(
                file_path,
                "r",
                encoding="utf-8"
            ) as file:

                raw_text = file.read()

        else:

            raise ValueError(
                "Unsupported file format. "
                "Please upload a PDF, DOCX or TXT file."
            )

        logger.info(
            "Raw text length: %d",
            len(raw_text)
        )

        # =====================================================
        # CLEAN TEXT
        # =====================================================

        cleaned_text = clean_text(raw_text)

        logger.info(
            "Cleaned text length: %d",
            len(cleaned_text)
        )

        # =====================================================
        # CREATE CHUNKS
        # =====================================================

        chunks = create_chunks(cleaned_text)

        logger.info(
            "Chunks: %d",
            len(chunks)
        )

        if not chunks:

            raise ValueError(
                "No extractable text found in the uploaded document."
            )

        # =====================================================
        # GENERATE EMBEDDINGS
        # =====================================================

        embeddings = self.embedding_model.embed_documents(
            chunks
        )

        # =====================================================
        # STORE IN CHROMADB
        # =====================================================

        self.chroma_manager.add_documents(
            chunks=chunks,
            embeddings=embeddings,
            filename=filename
        )

        logger.info(
            "Stored %d chunks from '%s'",
            len(chunks),
            filename
        )

        return len(chunks)

    # =========================================================
    # ASK QUESTION
    # =========================================================

    def ask(self, question, top_k=TOP_K):

        if self.chroma_manager is None:

            raise RuntimeError(
                "User is not set. Call set_user() before asking questions."
            )

        # Convert question into embedding
        query_embedding = self.embedding_model.embed_query(
            question
        )

        # Search ChromaDB
        results = self.chroma_manager.search(
            query_embedding=query_embedding,
            top_k=top_k
        )

        documents = results["documents"][0]

        # Build context
        context = "\n\n".join(documents)

        # Generate answer
        answer = self.llm.generate_answer(
            question=question,
            context=context
        )

        return answer

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

        # Get document information and chunks
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

        # Combine all chunks into one context
        context = "\n\n".join(
            documents
        )

        # Generate summary using existing Groq client
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
                "User is not set. "
                "Call set_user() before replacing documents."
            )

        filename = os.path.basename(file_path)

        # Delete old Chroma chunks
        self.chroma_manager.delete_document(
            filename
        )

        # Ingest new version
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
                "User is not set. "
                "Call set_user() before deleting documents."
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
                "User is not set. "
                "Call set_user() before getting document info."
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