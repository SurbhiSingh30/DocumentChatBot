from langchain_text_splitters import RecursiveCharacterTextSplitter


def create_chunks(source_data):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=150,
        length_function=len,
        separators=[
            "\n\n",
            "\n",
            ". ",
            " ",
            ""
        ]
    )

    all_chunks = []

    for source in source_data:
        text = source["text"]

        chunks = splitter.split_text(text)

        for chunk in chunks:
            all_chunks.append({
                "text": chunk,
                "location_type": source["location_type"],
                "location": source["location"]
            })

    return all_chunks