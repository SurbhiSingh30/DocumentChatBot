from sentence_transformers import SentenceTransformer


class EmbeddingModel:
    """
    Handles generation of embeddings for document chunks and user queries.
    """

    def __init__(self):
        # Load the embedding model once
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def embed_documents(self, chunks: list[str]) -> list[list[float]]:
        """
        Generate embeddings for document chunks.
        """
        return self.model.encode(chunks, convert_to_numpy=True).tolist()

    def embed_query(self, query: str) -> list[float]:
        """
        Generate embedding for a user question.
        """
        return self.model.encode(query, convert_to_numpy=True).tolist()