import pickle
import pandas as pd
import numpy as np

# Load the trained pipeline (preprocessor + model)
with open("saved_model.pkl", "rb") as f:
    model = pickle.load(f)

def parse_salary_range(s):
    """Convert '20000-50000' into (min_salary, max_salary)."""
    try:
        parts = str(s).replace(",", "").split("-")
        if len(parts) == 2:
            return float(parts[0]), float(parts[1])
    except:
        return np.nan, np.nan
    return np.nan, np.nan

def classify_job_posting(job_details: dict):
    """
    Classify job posting as Real (0) or Fake (1).
    job_details must contain all 16 features except 'fraudulent'.
    """
    # Convert dict to DataFrame (1 row)
    df = pd.DataFrame([job_details])

    # Build combined_text like in training
    df["combined_text"] = (
        df["title"].fillna("") + " " +
        df["company_profile"].fillna("") + " " +
        df["description"].fillna("") + " " +
        df["requirements"].fillna("") + " " +
        df["benefits"].fillna("")
    )

    # Parse salary_range -> min_salary, max_salary
    df[["min_salary", "max_salary"]] = df["salary_range"].apply(
        lambda x: pd.Series(parse_salary_range(x))
    )

    # Predict
    proba = model.predict_proba(df)[0]
    prediction = model.predict(df)[0]

    fake_proba = proba[1]

    # Add Suspicious thresholding
    if fake_proba > 0.6:
        label = "Fake Job Posting"
    elif fake_proba < 0.4:
        label = "Real Job Posting"
    else:
        label = "Suspicious / Uncertain"

    return label, proba

if __name__ == "__main__":
    print("=== Fake Job Posting Classifier ===")
    print("Please enter job details (leave blank if not available):\n")

    job_details = {
        # Job Details
        "title": input("Job Title: "),
        "location": input("Location: "),
        "department": input("Department: "),
        "salary_range": input("Salary Range (e.g., 20000-50000): "),
        "employment_type": input("Employment Type: "),
        "required_experience": input("Required Experience: "),
        "required_education": input("Required Education: "),
        "industry": input("Industry: "),
        "function": input("Function: "),

        # Company Details
        "company_profile": input("Company Profile: "),
        "description": input("Description: "),
        "requirements": input("Requirements: "),
        "benefits": input("Benefits: "),

        # Binary Flags
        "telecommuting": int(input("Telecommuting (0 or 1): ") or 0),
        "has_company_logo": int(input("Has Company Logo (0 or 1): ") or 0),
        "has_questions": int(input("Has Questions (0 or 1): ") or 0),
    }

    result, proba = classify_job_posting(job_details)

    print("\nPrediction:", result)
    print("Probabilities: [Real %.2f | Fake %.2f]" % (proba[0], proba[1]))