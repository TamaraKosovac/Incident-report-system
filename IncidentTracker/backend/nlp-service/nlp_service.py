from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime, timedelta
from math import radians, cos, sin, asin, sqrt

app = FastAPI(
    title="NLP Service",
    description="Detects duplicate or valid incident reports (text + location + time)."
)

class IncidentDTO(BaseModel):
    text: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    createdAt: datetime

class IncidentNlpRequestDTO(BaseModel):
    newIncident: IncidentDTO
    existing: List[IncidentDTO] = []


def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return 2 * R * asin(sqrt(a))


@app.post("/analyze")
def analyze(data: IncidentNlpRequestDTO):
    new_incident = data.newIncident
    existing_incidents = data.existing

    if not existing_incidents:
        return {"status": "PENDING"}

    texts = [e.text for e in existing_incidents] + [new_incident.text]

    vectorizer = TfidfVectorizer(analyzer="char", ngram_range=(3, 5)).fit(texts)
    existing_vectors = vectorizer.transform(texts[:-1])
    new_vector = vectorizer.transform([texts[-1]])

    sim_matrix = cosine_similarity(new_vector, existing_vectors)[0]

    TEXT_THRESHOLD = 0.6
    DISTANCE_THRESHOLD = 1.0
    TIME_THRESHOLD = timedelta(hours=24)

    for i, e in enumerate(existing_incidents):
        text_sim = sim_matrix[i]

        if (
            e.latitude is not None and e.longitude is not None and
            new_incident.latitude is not None and new_incident.longitude is not None
        ):
            distance = haversine(new_incident.latitude, new_incident.longitude,
                                 e.latitude, e.longitude)
        else:
            distance = float("inf")

        time_diff = abs(new_incident.createdAt - e.createdAt)

        if text_sim >= TEXT_THRESHOLD and distance <= DISTANCE_THRESHOLD and time_diff <= TIME_THRESHOLD:
            return {"status": "DUPLICATE"}

    return {"status": "PENDING"}