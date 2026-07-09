from parser.pdf_parser import extract_text_from_pdf
from processing.cleaner import clean_text
from processing.chunker import create_chunks
from processing.embeddings import EmbeddingModel


def main():
    # Path to the uploaded document
    file_path = "documents/Physics_sample.pdf.pdf"

    # Step 1: Extract text from PDF
    raw_text = extract_text_from_pdf(file_path)

    # Step 2: Clean extracted text
    cleaned_text = clean_text(raw_text)

    # Step 3: Split text into chunks
    chunks = create_chunks(cleaned_text)

    embedding_model = EmbeddingModel()

    embeddings = embedding_model.embed_documents(chunks)

    # Display information
    print(f"Total Embeddings Created: {len(embeddings)}")
    print(f"Embedding Dimension: {len(embeddings[0])}")

    print("\n" + "=" * 80)
    print("FIRST CHUNK")
    print("=" * 80)
    print(chunks[0])

    print("\n" + "=" * 80)
    print("FIRST EMBEDDING (First 10 Values)")
    print("=" * 80)
    print(embeddings[0][:10])
        

if __name__ == "__main__":
    main()