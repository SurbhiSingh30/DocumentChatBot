def extract_text_from_txt(file_path):
    paragraphs = []

    with open(file_path, "r", encoding="utf-8") as file:
        for line_number, line in enumerate(file, start=1):
            text = line.strip()

            if text:
                paragraphs.append({
                    "text": text,
                    "location_type": "line",
                    "location": line_number
                })

    return paragraphs