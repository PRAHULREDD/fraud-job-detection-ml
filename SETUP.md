# Setup Guide

## Prerequisites

- Python 3.10 or higher
- pip package manager
- 4GB RAM minimum
- Internet connection for dataset download

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/FakeJobPrediction.git
cd FakeJobPrediction
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Download Dataset

1. Go to [Kaggle Dataset](https://www.kaggle.com/datasets/shivamb/real-or-fake-fake-jobposting-prediction)
2. Download `fake_job_postings.csv`
3. Place it in `backend/` directory

### 5. Train Model

```bash
cd backend
python model_train.py
```

This will:
- Load and preprocess data
- Train 3 models (SVM, Random Forest, Logistic Regression)
- Select best model based on F1-score
- Save model as `saved_model.pkl`
- Generate `model_metadata.json`

Training takes ~5-10 minutes.

### 6. Run Application

**Terminal 1 - Start API:**
```bash
cd backend
python api_server.py
```

**Terminal 2 - Start Streamlit UI:**
```bash
streamlit run streamlit_app.py
```

### 7. Access Application

- **Streamlit UI**: http://localhost:8501
- **API Docs**: http://localhost:8000/docs
- **API Endpoint**: http://localhost:8000/predict

## Troubleshooting

### Import Errors

```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### Model Not Found

```bash
# Retrain model
cd backend
python model_train.py
```

### API Connection Failed

- Ensure backend is running on port 8000
- Check firewall settings
- Verify no other service is using port 8000

### Dataset Not Found

- Verify `fake_job_postings.csv` is in `backend/` directory
- Check file permissions
- Re-download from Kaggle if corrupted

### Port Already in Use

```bash
# Change API port
# Edit backend/api_server.py, line: uvicorn.run(app, host="0.0.0.0", port=8001)

# Change Streamlit port
streamlit run streamlit_app.py --server.port 8502
```

## Verification

Test the installation:

```bash
# Test API
curl http://localhost:8000/docs

# Test prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Job","location":"NYC","company_profile":"Test","description":"Test","requirements":"Test","industry":"IT","telecommuting":"0","has_company_logo":"1","has_questions":"1"}'
```

## Development Setup

For development with code quality tools:

```bash
pip install -r requirements-dev.txt
pre-commit install
```

## Docker Setup (Optional)

Coming soon...

## Need Help?

- Check [README.md](README.md) for overview
- See [DATA_README.md](DATA_README.md) for dataset info
- Open an issue on GitHub