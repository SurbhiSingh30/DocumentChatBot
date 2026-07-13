from rag.pipeline import RAGPipeline


def main():

    pipeline = RAGPipeline()

    pipeline.ingest(
        "documents/Physics_sample.pdf.pdf"
    )

    question = "What is Classical Free Electron Theory?"

    answer = pipeline.ask(question)

    print("\n" + "=" * 80)
    print("AI ANSWER")
    print("=" * 80)
    print(answer)


if __name__ == "__main__":
    main()