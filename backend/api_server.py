from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
import uvicorn

app = FastAPI(title="Fake Job Prediction API")

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
try:
    with open("saved_model.pkl", "rb") as f:
        model = pickle.load(f)
except FileNotFoundError:
    model = None
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

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
    telecommuting: str = "0"
    has_company_logo: str = "0"
    has_questions: str = "0"

@app.post("/predict")
async def predict_job(job_data: JobData):
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

        # Prepare data for the model
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
            "telecommuting": int(job_data.telecommuting),
            "has_company_logo": int(job_data.has_company_logo),
            "has_questions": int(job_data.has_questions),
            "min_salary": min_salary,
            "max_salary": max_salary
        }

        df = pd.DataFrame([data])
        df[["telecommuting", "has_company_logo", "has_questions", "min_salary", "max_salary"]] = df[["telecommuting", "has_company_logo", "has_questions", "min_salary", "max_salary"]].astype('float64')

        # Make prediction
        probabilities = model.predict_proba(df)[0]
        is_fake_prob = probabilities[1]
        is_fake = is_fake_prob > 0.5

        return {
            "isFake": bool(is_fake),
            "probability": float(is_fake_prob),
            "jobTitle": job_data.title
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
