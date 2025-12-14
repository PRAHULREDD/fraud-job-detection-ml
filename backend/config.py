"""Configuration settings for the application"""
import os

# API Configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", 8000))

# CORS Configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8501"
).split(",")

# Model Configuration
MODEL_PATH = os.getenv("MODEL_PATH", "saved_model.pkl")
DATA_PATH = os.getenv("DATA_PATH", "fake_job_postings.csv")

# Model versioning
MODEL_VERSION = "1.0.0"
MODEL_NAME = "fake_job_detector"