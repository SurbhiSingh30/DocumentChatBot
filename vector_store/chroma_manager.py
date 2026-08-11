import os
import chromadb

from config import COLLECTION_NAME
from utils.logger import logger


class ChromaManager:
    """
    Handles creation, storage and retrieval
    of document embeddings using ChromaDB.
    """

    def __init__(self, user_id="default"):

        self.user_id = user_id

        # User-specific ChromaDB directory
        self.db_path = os.path.join(
            "storage",
            "users",
            user_id,
            "chroma_db"
        )

        os.makedirs(
            self.db_path,
            exist_ok=True
        )

        # Persistent Chroma client
        self.client = chromadb.PersistentClient(
            path=self.db_path
        )

        # User collection
        self.collection = self.client.get_or_create_collection(
            name=COLLECTION_NAME
        )

    # =========================================================
    # ADD DOCUMENTS
    # =========================================================

    def add_documents(
        self,
        chunks,
        embeddings,
        filename,
        metadata=None
    ):

        ids = []
        metadatas = []

        for i, chunk in enumerate(chunks):

            ids.append(
                f"{filename}_{i}"
            )

            chunk_metadata = {
                "filename": filename,
                "chunk_number": i
            }

            # Add source location metadata
            if metadata and i < len(metadata):

                chunk_metadata.update({
                    "location_type": metadata[i].get(
                        "location_type",
                        "chunk"
                    ),
                    "location": str(
                        metadata[i].get(
                            "location",
                            i + 1
                        )
                    )
                })

            else:

                chunk_metadata.update({
                    "location_type": "chunk",
                    "location": str(i + 1)
                })

            metadatas.append(
                chunk_metadata
            )

        print("\n===== STORING METADATA =====")
        print(metadatas)
        print("============================\n")

        self.collection.add(
            ids=ids,
            documents=chunks,
            embeddings=embeddings,
            metadatas=metadatas
        )

        logger.info(
            "Stored %d chunks from '%s' in ChromaDB.",
            len(chunks),
            filename
        )

    # =========================================================
    # DOCUMENT EXISTS
    # =========================================================

    def document_exists(self, filename):

        results = self.collection.get(
            where={
                "filename": filename
            }
        )

        return len(
            results["ids"]
        ) > 0

    # =========================================================
    # LIST DOCUMENTS
    # =========================================================

    def list_documents(self):

        results = self.collection.get(
            include=["metadatas"]
        )

        filenames = set()

        for metadata in results["metadatas"]:

            if metadata and "filename" in metadata:
                filenames.add(
                    metadata["filename"]
                )

        return sorted(
            list(filenames)
        )

    # =========================================================
    # SEARCH DOCUMENT NAMES
    # =========================================================

    def search(
    self,
    query_embedding,
    top_k=4,
    filename=None
    ):
        where_filter = None

        if filename:
            where_filter = {
                "filename": filename
            }

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=where_filter,
            include=[
                "documents",
                "metadatas",
                "distances"
            ]
        )

        return results

    # =========================================================
    # DOCUMENT INFO
    # =========================================================

    def get_document_info(self, filename):

        results = self.collection.get(
            where={
                "filename": filename
            },
            include=[
                "documents",
                "metadatas"
            ]
        )

        if len(results["ids"]) == 0:
            return None

        return {
            "filename": filename,
            "chunks": len(results["ids"]),
            "documents": results["documents"],
            "metadatas": results["metadatas"]
        }

    # =========================================================
    # DELETE DOCUMENT
    # =========================================================

    def delete_document(self, filename):

        results = self.collection.get(
            where={
                "filename": filename
            }
        )

        if len(results["ids"]) == 0:
            return False

        self.collection.delete(
            ids=results["ids"]
        )

        logger.info(
            "Deleted document '%s' from ChromaDB.",
            filename
        )

        return True