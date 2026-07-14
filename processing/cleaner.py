import re


def clean_text(text: str) -> str:
    # Remove extra spaces and tabs
    text = re.sub(r"[ \t]+", " ", text)

    # Normalize Windows and Unix line endings
    text = text.replace("\r\n", "\n")

    # Replace 3 or more newlines with 2
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()