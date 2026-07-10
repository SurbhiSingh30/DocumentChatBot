import os
from parser.pdf_parser import extract_text_from_pdf
from processing.cleaner import clean_text
from processing.chunker import create_chunks
from processing.embeddings import EmbeddingModel
from vector_store.chroma_manager import ChromaManager
from llm.groq_client import GroqClient


def main():
    # Path to the uploaded document
    file_path = "documents/Physics_sample.pdf.pdf"
    filename = os.path.basename(file_path)
    # Step 1: Extract text from PDF
    raw_text = extract_text_from_pdf(file_path)

    # Step 2: Clean extracted text
    cleaned_text = clean_text(raw_text)

    # Step 3: Split text into chunks
    chunks = create_chunks(cleaned_text)

    # Step 4: Generate embeddings
    embedding_model = EmbeddingModel()
    embeddings = embedding_model.embed_documents(chunks)

    # Step 5: Store in ChromaDB
    chroma_manager = ChromaManager()
    chroma_manager.add_documents(
        chunks=chunks,
        embeddings=embeddings,
        filename=filename
        )
    # Step 6: Ask a question
    question = "What is Classical Free Electron Theory?"

    # Convert question into an embedding
    query_embedding = embedding_model.embed_query(question)

    # Step 7: Search the vector database
    results = chroma_manager.search(
        query_embedding=query_embedding,
        top_k=4
    )



    # Display information
    print(f"Total Embeddings Created: {len(embeddings)}")
    print(f"Embedding Dimension: {len(embeddings[0])}")

    # print("\n" + "=" * 80)
    # print("FIRST CHUNK")
    # print("=" * 80)
    # print(chunks[0])

    # print("\n" + "=" * 80)
    # print("FIRST EMBEDDING (First 10 Values)")
    # print("=" * 80)
    # print(embeddings[0][:10])

    print("\n" + "=" * 80)
    print("SEARCH RESULTS")
    print("=" * 80)

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]
    # Combine retrieved chunks into one context
    context = "\n\n".join(documents)

    groq = GroqClient()
    answer = groq.generate_answer(
    question=question,
    context=context
    )

    print("\n" + "=" * 80)
    print("AI ANSWER")
    print("=" * 80)
    print(answer)
        
            

if __name__ == "__main__":
    main()