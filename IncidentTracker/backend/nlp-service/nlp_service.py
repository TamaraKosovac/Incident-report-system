from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="NLP Service", description="Detects duplicate or valid incident reports")

class IncidentText(BaseModel):
    text: str
    existing: list[str] = []

@app.post("/analyze")
def analyze(data: IncidentText):
    new_text = data.text
    existing_texts = data.existing

    if not existing_texts:
        return {"status": "PENDING"}

    texts = existing_texts + [new_text]
    vectorizer = TfidfVectorizer().fit_transform(texts)
    vectors = vectorizer.toarray()

    sim_matrix = cosine_similarity([vectors[-1]], vectors[:-1])
    max_sim = max(sim_matrix[0]) if len(sim_matrix[0]) > 0 else 0

    if max_sim > 0.8:  
        return {"status": "DUPLICATE"}
    return {"status": "PENDING"}