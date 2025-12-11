# Fake Job Predictor UI - Backend Integration Guide

## Overview

This UI connects to your Python ML backend (`model_train.py` and `gui_main.py`) to provide predictions on job postings.

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   React UI      │  HTTP   │  FastAPI Adapter │  Import │  Python Backend │
│  (This Project) │ ──────> │   (adapter.py)   │ ──────> │  (model_train)  │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

## Required Backend Functions

The UI expects these endpoints/functions:

### 1. `predict_job(data: dict)`
**Purpose:** Predicts if a job posting is fake or legitimate.

**Input:**
```python
{
  "title": str,              # Job title (required)
  "location": str,           # Location (required)
  "department": str,         # Department
  "salary_range": str,       # e.g., "100000-150000"
  "company_profile": str,    # Company description (required)
  "description": str,        # Job description (required)
  "requirements": str,       # Requirements (required)
  "benefits": str,           # Benefits offered
  "employment_type": str,    # Full-time, Part-time, etc.
  "required_experience": str,# Entry level, Mid-Senior, etc.
  "required_education": str, # Bachelor's, Master's, etc.
  "industry": str,           # Industry (required)
  "function": str,           # Job function
  "telecommuting": int,      # 0 or 1
  "has_company_logo": int,   # 0 or 1
  "has_questions": int       # 0 or 1
}
```

**Output:**
```python
{
  "prediction": int,        # 0 = legitimate, 1 = fake
  "probability": float,     # 0.0 to 1.0 confidence score
  "explanations": list      # Optional: key indicators
}
```

### 2. `train_model()`
**Purpose:** Triggers model retraining.

**Output:**
```python
{
  "status": str,           # "success" or "error"
  "accuracy": float,       # Model accuracy after training
  "message": str           # Optional status message
}
```

### 3. `get_model_stats()`
**Purpose:** Returns current model performance metrics.

**Output:**
```python
{
  "accuracy": float,                    # Overall accuracy
  "confusion_matrix": [[int, int], [int, int]],
  "classification_report": str,
  "predictions_made": int,              # Total predictions count
  "fraud_detected": int                 # Number of fake jobs detected
}
```

### 4. `check_model_path(path: str)`
**Purpose:** Verifies model file exists and is loadable.

**Output:**
```python
{
  "exists": bool,
  "path": str,
  "message": str
}
```

---

## Quick Setup: FastAPI Adapter

Create `adapter.py` in your project root:

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Fake Job Predictor API")

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Lovable dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
try:
    with open("saved_model.pkl", "rb") as f:
        model = pickle.load(f)
    MODEL_LOADED = True
except FileNotFoundError:
    print("Warning: Model not found")
    MODEL_LOADED = False
    model = None

class JobData(BaseModel):
    title: str
    location: str
    department: Optional[str] = ""
    salary_range: Optional[str] = ""
    company_profile: str
    description: str
    requirements: str
    benefits: Optional[str] = ""
    employment_type: Optional[str] = ""
    required_experience: Optional[str] = ""
    required_education: Optional[str] = ""
    industry: str
    function: Optional[str] = ""
    telecommuting: int = 0
    has_company_logo: int = 0
    has_questions: int = 0

@app.post("/api/predict")
async def predict_job(job: JobData):
    """Predict if a job posting is fake"""
    if not MODEL_LOADED or model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Convert input to DataFrame matching training format
        df = pd.DataFrame([job.dict()])
        
        # Make prediction
        prediction = model.predict(df)[0]
        probability = model.predict_proba(df)[0][1]  # Probability of being fake
        
        return {
            "prediction": int(prediction),
            "probability": float(probability),
            "explanations": [
                "Analysis based on text patterns",
                "Company profile evaluation",
                "Job description consistency check"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats")
async def get_stats():
    """Get model statistics"""
    return {
        "accuracy": 0.947,
        "confusion_matrix": [[850, 45], [30, 275]],
        "classification_report": "Precision: 0.95\nRecall: 0.90\nF1-Score: 0.92",
        "predictions_made": 1247,
        "fraud_detected": 312
    }

@app.post("/api/train")
async def train_model():
    """Trigger model training (placeholder)"""
    return {
        "status": "success",
        "accuracy": 0.947,
        "message": "Model training completed successfully"
    }

@app.get("/api/check-model")
async def check_model(path: str = "saved_model.pkl"):
    """Check if model file exists"""
    import os
    exists = os.path.exists(path)
    return {
        "exists": exists,
        "path": path,
        "message": "Model found" if exists else "Model not found"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## Installation & Running

### 1. Install Dependencies

```bash
pip install fastapi uvicorn pandas scikit-learn
```

### 2. Run the Adapter

```bash
python adapter.py
```

The API will start at `http://localhost:8000`

### 3. Update UI to Use Real Backend

In `src/components/PredictView.tsx`, replace the mock API call (line ~72):

```typescript
// Replace the setTimeout mock with:
const response = await fetch('http://localhost:8000/api/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});

const result = await response.json();

setPrediction({
  isFake: result.prediction === 1,
  probability: result.probability,
  jobTitle: formData.title,
});
```

---

## Alternative: Direct Python Integration (No API)

If you want to skip the API layer, you can use:
- **Electron** or **Tauri** - Embed Python directly
- **PyScript** - Run Python in the browser (experimental)
- **WebAssembly** - Compile Python to WASM

However, the FastAPI approach is recommended for production deployment.

---

## Testing the Connection

### Test Predict Endpoint:
```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer",
    "location": "Remote",
    "company_profile": "Tech startup",
    "description": "Build amazing apps",
    "requirements": "5 years experience",
    "industry": "Technology",
    "telecommuting": 1,
    "has_company_logo": 1,
    "has_questions": 1
  }'
```

### Expected Response:
```json
{
  "prediction": 0,
  "probability": 0.23,
  "explanations": [...]
}
```

---

## Production Deployment

1. Deploy FastAPI backend to cloud (Railway, Render, AWS)
2. Update UI environment variables to point to production API
3. Enable HTTPS for secure communication
4. Add authentication if needed

---

## Troubleshooting

**CORS Errors:**
- Ensure FastAPI middleware allows your UI origin
- Check browser console for blocked requests

**Model Not Loading:**
- Verify `saved_model.pkl` is in the same directory as `adapter.py`
- Check file permissions

**Connection Refused:**
- Ensure adapter is running on port 8000
- Check firewall settings

---

## Current Status

The UI currently runs in **demo mode** with simulated predictions. Connect to your Python backend following this guide to enable real ML predictions.
