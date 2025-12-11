import pandas as pd
import numpy as np
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline

# ==============================
# Load Dataset
# ==============================
print("[INFO] Loading dataset...")
df = pd.read_csv("fake_job_postings.csv")

# Drop rows with missing target
df = df.dropna(subset=["fraudulent"])

# ==============================
# Feature Engineering
# ==============================
df["combined_text"] = (
    df["title"].fillna("") + " " +
    df["company_profile"].fillna("") + " " +
    df["description"].fillna("") + " " +
    df["requirements"].fillna("") + " " +
    df["benefits"].fillna("")
)

def parse_salary_range(s):
    try:
        parts = str(s).replace(",", "").split("-")
        if len(parts) == 2:
            return float(parts[0]), float(parts[1])
    except:
        return np.nan, np.nan
    return np.nan, np.nan

df[["min_salary", "max_salary"]] = df["salary_range"].apply(
    lambda x: pd.Series(parse_salary_range(x))
)

# Define features
text_features = ["combined_text"]
cat_features = [
    "employment_type",
    "required_experience",
    "required_education",
    "industry",
    "function",
    "location",
    "department"
]
num_features = ["telecommuting", "has_company_logo", "has_questions", "min_salary", "max_salary"]

X = df[text_features + cat_features + num_features]
y = df["fraudulent"]

# ==============================
# Train-Test Split
# ==============================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ==============================
# Preprocessor
# ==============================
text_transformer = TfidfVectorizer(
    stop_words="english", max_features=10000, ngram_range=(1, 2)
)

cat_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

num_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="constant", fill_value=0)),
    ("scaler", StandardScaler(with_mean=False))
])

preprocessor = ColumnTransformer(
    transformers=[
        ("text", text_transformer, "combined_text"),
        ("cat", cat_transformer, cat_features),
        ("num", num_transformer, num_features)
    ]
)

# ==============================
# Models to Try
# ==============================
models = {
    "Logistic Regression": LogisticRegression(max_iter=1000, class_weight="balanced"),
    "Random Forest": RandomForestClassifier(class_weight="balanced", n_jobs=-1),
    "SVM": SVC(probability=True, class_weight="balanced")
}

best_model = None
best_acc = 0

print("[INFO] Training models with SMOTE...")

for name, model in models.items():
    # Pipeline: preprocessor + SMOTE + classifier
    clf = ImbPipeline(steps=[
        ("preprocessor", preprocessor),
        ("smote", SMOTE(random_state=42)),
        ("classifier", model)
    ])
    
    clf.fit(X_train, y_train)
    preds = clf.predict(X_test)
    acc = accuracy_score(y_test, preds)
    
    print(f"\n{name} Accuracy: {acc:.4f}")
    print("Classification Report:")
    print(classification_report(y_test, preds))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, preds))
    
    if acc > best_acc:
        best_acc = acc
        best_model = clf

print("\n[INFO] Best Model:", best_model.named_steps["classifier"].__class__.__name__,
      "Accuracy:", best_acc)

# ==============================
# Save Model
# ==============================
with open("saved_model.pkl", "wb") as f:
    pickle.dump(best_model, f)

print("[INFO] Model + Preprocessor saved as saved_model.pkl")
