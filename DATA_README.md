# Dataset Setup

## Required Files

This project requires the following files that are NOT included in the repository:

### 1. Training Dataset
- **File**: `backend/fake_job_postings.csv`
- **Source**: [Kaggle - Fake Job Postings Dataset](https://www.kaggle.com/datasets/shivamb/real-or-fake-fake-jobposting-prediction)
- **Size**: ~18,000 job postings
- **License**: Check Kaggle dataset page

### 2. Trained Model
- **File**: `backend/saved_model.pkl`
- **Generation**: Run `python backend/model_train.py` after downloading the dataset
- **Size**: ~100MB (excluded from Git for performance)

## Setup Instructions

```bash
# 1. Download dataset from Kaggle
# Place fake_job_postings.csv in backend/ directory

# 2. Train the model
cd backend
python model_train.py

# 3. Verify files exist
ls saved_model.pkl  # Should exist after training
```

## Why These Files Are Excluded

- **Dataset**: Large file (5MB+), licensing considerations, should be downloaded from source
- **Model**: Very large file (100MB+), should be versioned separately using DVC/MLflow
- **Best Practice**: Models and data should not be in Git for performance and versioning

## Alternative: Model Hosting

For production, consider:
- AWS S3 + Model versioning
- MLflow Model Registry
- DVC (Data Version Control)
- Hugging Face Model Hub