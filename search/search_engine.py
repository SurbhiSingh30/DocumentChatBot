def search_paragraphs(paragraphs, query):

    matches = []

    query = query.lower()

    for paragraph in paragraphs:

        if query in paragraph.lower():
            matches.append(paragraph)

    return matches