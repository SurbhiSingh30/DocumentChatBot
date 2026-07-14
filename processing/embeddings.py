from sentence_transformers import SentenceTransformer
from config import EMBEDDING_MODEL

class EmbeddingModel:
    """
    Handles generation of embeddings for document chunks and user queries.
    """

    def __init__(self):
        # Load the embedding model once
        self.model = SentenceTransformer(EMBEDDING_MODEL)

    def embed_documents(self, chunks: list[str]) -> list[list[float]]:
        return self.model.encode(chunks, convert_to_numpy=True).tolist()

    def embed_query(self, query: str) -> list[float]:
        return self.model.encode(query, convert_to_numpy=True).tolist()