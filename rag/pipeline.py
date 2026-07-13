import os
from config import TOP_K
from parser.pdf_parser import extract_text_from_pdf
from processing.cleaner import clean_text
from processing.chunker import create_chunks
from processing.embeddings import EmbeddingModel
from vector_store.chroma_manager import ChromaManager
from llm.groq_client import GroqClient


class RAGPipeline:

    def __init__(self):

        self.embedding_model = EmbeddingModel()
        self.chroma_manager = ChromaManager()
        self.llm = GroqClient()

    def ingest(self, file_path):

        filename = os.path.basename(file_path)

        # Step 1: Extract text
        raw_text = extract_text_from_pdf(file_path)

        # Step 2: Clean text
        cleaned_text = clean_text(raw_text)

        # Step 3: Create chunks
        chunks = create_chunks(cleaned_text)

        # Step 4: Generate embeddings
        embeddings = self.embedding_model.embed_documents(chunks)

        # Step 5: Store in ChromaDB
        self.chroma_manager.add_documents(
            chunks=chunks,
            embeddings=embeddings,
            filename=filename
        )

        print(f"\n Stored {len(chunks)} chunks from '{filename}'")

    def ask(self, question, top_k=TOP_K):

        # Step 1: Convert question into embedding
        query_embedding = self.embedding_model.embed_query(question)

        # Step 2: Search ChromaDB
        results = self.chroma_manager.search(
            query_embedding=query_embedding,
            top_k=top_k
        )

        # Step 3: Extract retrieved documents
        documents = results["documents"][0]

        # Step 4: Build context
        context = "\n\n".join(documents)

        # Step 5: Generate answer
        answer = self.llm.generate_answer(
            question=question,
            context=context
        )

        return answer
        