from rag.pipeline import RAGPipeline

try:
    pipeline = RAGPipeline()
    print("Pipeline initialized successfully")
except Exception as e:
    print("Pipeline initialization failed")
    print(type(e).__name__, e)
    raise