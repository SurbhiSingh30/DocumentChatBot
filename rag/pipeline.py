import os
from config import TOP_K
from parser.pdf_parser import extract_text_from_pdf
from processing.cleaner import clean_text
from processing.chunker import create_chunks
from processing.embeddings import EmbeddingModel
from vector_store.chroma_manager import ChromaManager
from llm.groq_client import GroqClient
from parser.docx_parse import extract_text_from_docx
from utils.logger import logger
class RAGPipeline:

    def __init__(self):

        self.embedding_model = EmbeddingModel()
        self.chroma_manager = ChromaManager()
        self.llm = GroqClient()

    def ingest(self, file_path, replace=False):

        filename = os.path.basename(file_path)
        if self.chroma_manager.document_exists(filename) and not replace:
            logger.info(f"'{filename}' already exists. Skipping ingestion.")
            return False
        
        # Extract text
        if filename.endswith(".pdf"):
            raw_text = extract_text_from_pdf(file_path)
        elif filename.endswith(".docx"):
            raw_text = extract_text_from_docx(file_path)
        else:
            raise ValueError("Unsupported file format. Please upload a PDF or DOCX file.")
        logger.info("Raw text length: %d", len(raw_text))

        # Clean text
        cleaned_text = clean_text(raw_text)
        logger.info("Cleaned text length: %d", len(cleaned_text))

        # Create chunks
        chunks = create_chunks(cleaned_text)
        logger.info("Chunks: %d", len(chunks))
        if not chunks:
            raise ValueError(
            "No extractable text found in the uploaded document."
            )

        # Generate embeddings
        embeddings = self.embedding_model.embed_documents(chunks)

        # Store in ChromaDB
        self.chroma_manager.add_documents(
            chunks=chunks,
            embeddings=embeddings,
            filename=filename
        )

        print(f"\n Stored {len(chunks)} chunks from '{filename}'")

        return True

    def ask(self, question, top_k=TOP_K):

        # Convert question into embedding
        query_embedding = self.embedding_model.embed_query(question)

        # Search ChromaDB
        results = self.chroma_manager.search(
            query_embedding=query_embedding,
            top_k=top_k
        )
        # Extract retrieved documents
        documents = results["documents"][0]

        # Build context
        context = "\n\n".join(documents)

        # Generate answer
        answer = self.llm.generate_answer(
            question=question,
            context=context
        )

        return answer

    def list_documents(self):
        return self.chroma_manager.list_documents()
    
    def replace_document(self, file_path):
        """
        Replace an existing document with a newly uploaded version.
        """

        filename = os.path.basename(file_path)

        # Delete old embeddings
        self.chroma_manager.delete_document(filename)

        # Re-ingest the new document
        return self.ingest(
            file_path,
            replace=True
        )

    def delete_document(self, filename):
        return self.chroma_manager.delete_document(filename)    

    def get_document_info(self, filename):
        return self.chroma_manager.get_document_info(filename)
    
    def search_documents(self, query):
       return self.chroma_manager.search_documents(query)