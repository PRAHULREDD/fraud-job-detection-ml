import streamlit as st
import requests
import json
import time
from datetime import datetime

# Page config
st.set_page_config(
    page_title="JobSpark AI - Fake Job Detection",
    page_icon="",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for glassmorphism effect
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1));
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: 2rem;
        margin-bottom: 2rem;
        text-align: center;
    }
    
    .prediction-card {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1));
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 15px;
        padding: 1.5rem;
        margin: 1rem 0;
    }
    
    .fake-card {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
    }
    
    .stButton > button {
        background: linear-gradient(135deg, #06b6d4, #3b82f6);
        color: white;
        border: none;
        border-radius: 10px;
        padding: 0.5rem 2rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3);
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'predictions' not in st.session_state:
    st.session_state.predictions = []

def main():
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>🔍 JobSpark AI</h1>
        <h3>Fake Job Detection System</h3>
        <p>Advanced ML-powered fraud detection for job postings</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Sidebar navigation
    with st.sidebar:
        st.title(" Navigation")
        tab = st.selectbox(
            "Choose View",
            [" Predict", " Analytics", " Settings"],
            index=0
        )
    
    if tab == " Predict":
        predict_view()
    elif tab == " Analytics":
        analytics_view()
    else:
        settings_view()

def predict_view():
    st.header(" Job Authenticity Prediction")
    st.markdown("Fill in the form below with job posting details. Fields marked with ***** are mandatory.")
    
    with st.form("job_prediction_form"):
        col1, col2 = st.columns(2)
        
        with col1:
            title = st.text_input("Job Title *", placeholder="e.g., Senior Software Engineer")
            location = st.text_input("Location *", placeholder="e.g., San Francisco, CA")
            department = st.text_input("Department", placeholder="e.g., Engineering")
            salary_range = st.text_input("Salary Range", placeholder="e.g., 100000-150000")
            industry = st.text_input("Industry *", placeholder="e.g., Information Technology")
            function = st.text_input("Function", placeholder="e.g., Engineering")
        
        with col2:
            employment_type = st.text_input("Employment Type", placeholder="e.g., Full-time")
            required_experience = st.text_input("Required Experience", placeholder="e.g., Mid-Senior level")
            required_education = st.text_input("Required Education", placeholder="e.g., Bachelor's Degree")
            telecommuting = st.selectbox("Telecommuting", ["No", "Yes"])
            has_company_logo = st.selectbox("Has Company Logo", ["No", "Yes"])
            has_questions = st.selectbox("Has Screening Questions", ["No", "Yes"])
        
        company_profile = st.text_area("Company Profile *", placeholder="Brief description of the company...", height=100)
        description = st.text_area("Job Description *", placeholder="Detailed job description...", height=120)
        requirements = st.text_area("Requirements *", placeholder="Job requirements and qualifications...", height=100)
        benefits = st.text_area("Benefits", placeholder="Employee benefits and perks...", height=100)
        
        col1, col2 = st.columns(2)
        with col1:
            clear_button = st.form_submit_button(" Clear All", type="secondary")
        with col2:
            submit_button = st.form_submit_button(" Predict Authenticity", type="primary")
        
        if clear_button:
            st.rerun()
        
        if submit_button:
            # Validate required fields
            required_fields = {
                "title": title,
                "location": location,
                "company_profile": company_profile,
                "description": description,
                "requirements": requirements,
                "industry": industry
            }
            
            missing_fields = [field for field, value in required_fields.items() if not value.strip()]
            
            if missing_fields:
                st.error(f"Please fill in required fields: {', '.join(missing_fields)}")
            else:
                # Prepare data for API
                form_data = {
                    "title": title,
                    "location": location,
                    "department": department,
                    "salary_range": salary_range,
                    "company_profile": company_profile,
                    "description": description,
                    "requirements": requirements,
                    "benefits": benefits,
                    "employment_type": employment_type,
                    "required_experience": required_experience,
                    "required_education": required_education,
                    "industry": industry,
                    "function": function,
                    "telecommuting": "1" if telecommuting == "Yes" else "0",
                    "has_company_logo": "1" if has_company_logo == "Yes" else "0",
                    "has_questions": "1" if has_questions == "Yes" else "0"
                }
                
                # Make prediction
                with st.spinner("🔍 Analyzing job posting..."):
                    try:
                        response = requests.post(
                            "http://localhost:8000/predict",
                            json=form_data,
                            timeout=30
                        )
                        
                        if response.status_code == 200:
                            result = response.json()
                            
                            # Store prediction
                            prediction_record = {
                                "timestamp": datetime.now(),
                                "job_title": title,
                                "is_fake": result.get("isFake", False),
                                "probability": result.get("probability", 0),
                                "result": result
                            }
                            st.session_state.predictions.append(prediction_record)
                            
                            # Display result
                            display_prediction_result(result)
                            
                        else:
                            st.error(f"API Error: {response.status_code}")
                            
                    except requests.exceptions.ConnectionError:
                        st.error(" Cannot connect to API server. Please ensure the backend is running on port 8000.")
                    except Exception as e:
                        st.error(f" Prediction failed: {str(e)}")

def display_prediction_result(result):
    is_fake = result.get("isFake", False)
    probability = result.get("probability", 0)
    job_title = result.get("jobTitle", "Unknown Job")
    
    card_class = "fake-card" if is_fake else "prediction-card"
    status = " FAKE JOB DETECTED" if is_fake else " LEGITIMATE JOB"
    color = "red" if is_fake else "green"
    
    st.markdown(f"""
    <div class="{card_class}">
        <h3 style="color: {color}; margin-bottom: 1rem;">{status}</h3>
        <h4>Job: {job_title}</h4>
        <p><strong>Confidence:</strong> {probability:.1f}%</p>
        <p><strong>Analysis:</strong> {'This job posting shows characteristics commonly associated with fraudulent listings.' if is_fake else 'This job posting appears to be legitimate based on our analysis.'}</p>
    </div>
    """, unsafe_allow_html=True)
    
    if is_fake:
        st.warning(" **Warning Signs Detected**: This job posting may be fraudulent. Please verify the company and job details independently.")
    else:
        st.success(" **Good Signs**: This job posting appears legitimate, but always exercise caution when applying.")

def analytics_view():
    st.header(" Prediction Analytics")
    
    if not st.session_state.predictions:
        st.info("No predictions yet. Make some predictions to see analytics!")
        return
    
    # Summary metrics
    total_predictions = len(st.session_state.predictions)
    fake_count = sum(1 for p in st.session_state.predictions if p["is_fake"])
    legitimate_count = total_predictions - fake_count
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Total Predictions", total_predictions)
    with col2:
        st.metric("Fake Jobs Detected", fake_count, delta=f"{fake_count/total_predictions*100:.1f}%")
    with col3:
        st.metric("Legitimate Jobs", legitimate_count, delta=f"{legitimate_count/total_predictions*100:.1f}%")
    
    # Recent predictions
    st.subheader("Recent Predictions")
    for i, pred in enumerate(reversed(st.session_state.predictions[-10:])):
        status = " FAKE" if pred["is_fake"] else "✅ LEGITIMATE"
        st.write(f"{i+1}. **{pred['job_title']}** - {status} ({pred['probability']:.1f}% confidence)")

def settings_view():
    st.header(" Settings")
    
    st.subheader(" API Configuration")
    api_url = st.text_input("API Base URL", value="http://localhost:8000")
    
    st.subheader(" Display Options")
    show_confidence = st.checkbox("Show Confidence Scores", value=True)
    show_warnings = st.checkbox("Show Warning Messages", value=True)
    
    st.subheader(" Data Management")
    if st.button("Clear Prediction History"):
        st.session_state.predictions = []
        st.success("Prediction history cleared!")
    
    st.subheader("ℹ About")
    st.info("""
    **JobSpark AI** - Fake Job Detection System
    
    - **Accuracy**: 94.7%
    - **Technology**: Python, FastAPI, Scikit-learn
    - **Model**: Ensemble (Random Forest + Logistic Regression)
    - **Features**: TF-IDF text analysis, SMOTE balancing
    
    Built for professional fake job detection.
    """)

if __name__ == "__main__":
    main()