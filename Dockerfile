# Use the official Python library 
FROM python:3.9-slim

# Set the working directory to /app
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all the backend files, model, etc.
COPY . .

# Move into the backend folder since that is where the server is
WORKDIR /app/backend

# Render will supply a PORT environment variable. We use standard uvicorn.
CMD uvicorn api_server:app --host 0.0.0.0 --port ${PORT:-8000}
