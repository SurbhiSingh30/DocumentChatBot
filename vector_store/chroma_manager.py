import os
import chromadb
from chromadb.config import Settings


class ChromaManager:
    """
    Handles creation, storage and retrieval
    of document embeddings using ChromaDB.
    """

    def __init__(self, user_id="default"):
        self.user_id = user_id

        # Create user-specific database directory
        self.db_path = os.path.join(
            "storage",
            "users",
            user_id,
            "chroma_db"
        )

        os.makedirs(self.db_path, exist_ok=True)

        # Create persistent Chroma client
        self.client = chromadb.PersistentClient(path=self.db_path)

        # Create (or load) collection
        self.collection = self.client.get_or_create_collection(
            name="documents"
        )

    def add_documents(self, chunks, embeddings, filename):
        """
        Store chunks, embeddings and metadata in ChromaDB.
        """

        ids = []
        metadatas = []

        for i, chunk in enumerate(chunks):
            ids.append(f"{filename}_{i}")

            metadatas.append({
                "filename": filename,
                "chunk_number": i
            })

        self.collection.add(
            ids=ids,
            documents=chunks,
            embeddings=embeddings,
            metadatas=metadatas
        )

        print(f"\n Stored {len(chunks)} chunks in ChromaDB.")

    def search(self, query_embedding, top_k=4):
        """
        Search the vector database using a query embedding.
        """

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            include=["documents", "metadatas", "distances"]
        )

        return results