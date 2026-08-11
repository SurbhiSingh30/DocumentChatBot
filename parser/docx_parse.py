from docx import Document


def extract_text_from_docx(file_path):
    document = Document(file_path)

    paragraphs = []

    for paragraph_number, paragraph in enumerate(
        document.paragraphs,
        start=1
    ):
        text = paragraph.text.strip()

        if text:
            paragraphs.append({
                "text": text,
                "location_type": "paragraph",
                "location": paragraph_number
            })

    return paragraphs