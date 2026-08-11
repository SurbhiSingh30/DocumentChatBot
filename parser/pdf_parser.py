import fitz


def extract_text_from_pdf(file_path):
    document = fitz.open(file_path)

    pages = []

    for page_number, page in enumerate(document, start=1):
        text = page.get_text()

        if text.strip():
            pages.append({
                "text": text,
                "location_type": "page",
                "location": page_number
            })

    document.close()

    return pages