import os
import chromadb
from chromadb.config import Settings
from config import COLLECTION_NAME
from utils.logger import logger
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
            name=COLLECTION_NAME
        )

    def add_documents(self, chunks, embeddings, filename):
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

        logger.info(f"\n Stored {len(chunks)} chunks in ChromaDB.")

    def search(self, query_embedding, top_k=4):
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            include=["documents", "metadatas", "distances"]
        )

        return results
    
    def document_exists(self, filename):
        results = self.collection.get(
            where={"filename": filename}
        )

        return len(results["ids"]) > 0
    
    def list_documents(self):
        results = self.collection.get(
            include=["metadatas"]
        )

        filenames = set()

        for metadata in results["metadatas"]:
            filenames.add(metadata["filename"])

        return sorted(list(filenames))
    
    def search_documents(self, query):
        documents = self.list_documents()

        return [doc for doc in documents
            if query.lower() in doc.lower()]
        
    def get_document_info(self, filename):
        results = self.collection.get(
            where={"filename": filename},
            include=["metadatas"]
        )

        if len(results["ids"]) == 0:
            return None

        metadata = results["metadatas"][0]

        return {
            "filename": metadata["filename"],
            "chunks": len(results["ids"])
        }
    
    def delete_document(self, filename):
        results = self.collection.get(
            where={"filename": filename}
        )

        if len(results["ids"]) == 0:
            return False

        self.collection.delete(
            ids=results["ids"]
        )

        return True
    
    
        
    