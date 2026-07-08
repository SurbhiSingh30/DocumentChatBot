from parser.pdf_parser import extract_text_from_pdf
from search.search_engine import search_paragraphs


def main():

    file_path = "documents/Physics_sample.pdf.pdf"

    text = extract_text_from_pdf(file_path)

    paragraphs = text.split("\n\n")

    print(f"\nFound {len(paragraphs)} paragraphs\n")

    query = input("Enter keyword to search: ")

    results = search_paragraphs(paragraphs, query)

    print("\nRESULTS\n")

    if not results:
        print("No matches found.")

    else:
        for i, paragraph in enumerate(results, start=1):
            print(f"\n--- Match {i} ---\n")
            print(paragraph)


if __name__ == "__main__":
    main()