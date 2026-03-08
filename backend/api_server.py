import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.security import APIKeyHeader
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel
import pickle
import pandas as pd
import uvicorn

limiter = Limiter(key_func=get_remote_address)

# Global model variable
model = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the trained model on startup
    global model
    try:
        with open("saved_model.pkl", "rb") as f:
            model = pickle.load(f)
        print("Successfully loaded model: saved_model.pkl")
    except Exception as e:
        print(f"CRITICAL ERROR: Failed to load model `saved_model.pkl`. Cause: {e}")
        # Fail fast: exit completely if the model fails to load
        sys.exit(1)
        
    yield
    
    # Cleanup on shutdown (if any)
    model = None

app = FastAPI(title="Fake Job Prediction API", lifespan=lifespan)
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security: API Key setup
API_KEY = os.getenv("API_KEY", "your-default-dev-key")
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=True)

async def get_api_key(api_key: str = Depends(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Could not validate API Key")
    return api_key

# Allow CORS only from Vercel & Localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fraud-job-detection-ml.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model loading is now handled in the lifespan context manager
class JobData(BaseModel):
    title: str
    location: str
    department: str = ""
    salary_range: str = ""
    company_profile: str
    description: str
    requirements: str
    benefits: str = ""
    employment_type: str = ""
    required_experience: str = ""
    required_education: str = ""
    industry: str
    function: str = ""
    telecommuting: int = 0
    has_company_logo: int = 0
    has_questions: int = 0

@app.get("/health")
async def health_check():
    """
    Health check endpoint for hosting providers (e.g., Render, Railway).
    Returns 503 Service Unavailable if the model footprint fails to load.
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Service Unavailable: Model not loaded")
    return {"status": "ok", "model_loaded": True}

def sync_predict_logic(job_data: JobData, min_salary: float, max_salary: float, loaded_model) -> dict:
    """Synchronous function to handle heavy CPU-bound pandas and sklearn logic."""
    data = {
        "combined_text": " ".join([
            job_data.title, job_data.company_profile,
            job_data.description, job_data.requirements,
            job_data.benefits
        ]),
        "employment_type": job_data.employment_type,
        "required_experience": job_data.required_experience,
        "required_education": job_data.required_education,
        "industry": job_data.industry,
        "function": job_data.function,
        "location": job_data.location,
        "department": job_data.department,
        "telecommuting": job_data.telecommuting,
        "has_company_logo": job_data.has_company_logo,
        "has_questions": job_data.has_questions,
        "min_salary": min_salary,
        "max_salary": max_salary
    }

    df = pd.DataFrame([data])
    df[["telecommuting", "has_company_logo", "has_questions", "min_salary", "max_salary"]] = df[["telecommuting", "has_company_logo", "has_questions", "min_salary", "max_salary"]].astype('float64')

    # Make prediction
    probabilities = loaded_model.predict_proba(df)[0]
    is_fake_prob = probabilities[1]
    is_fake = is_fake_prob > 0.5

    return {
        "isFake": bool(is_fake),
        "probability": float(is_fake_prob),
        "jobTitle": job_data.title
    }

@app.post("/predict")
@limiter.limit("20/minute") # Protect against spam
async def predict_job(request: Request, job_data: JobData, api_key: str = Depends(get_api_key)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded. Please check server logs.")

    try:
        # Parse salary range
        min_salary, max_salary = 0, 0
        if job_data.salary_range and "-" in job_data.salary_range:
            try:
                parts = job_data.salary_range.replace(",", "").split("-")
                min_salary = float(parts[0])
                max_salary = float(parts[1])
            except (ValueError, IndexError):
                pass  # Ignore malformed salary ranges

        # Offload CPU-bound pandas and machine learning logic to a separate thread
        prediction_result = await run_in_threadpool(sync_predict_logic, job_data, min_salary, max_salary, model)
        return prediction_result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
