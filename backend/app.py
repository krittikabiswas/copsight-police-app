from fastapi import FastAPI, UploadFile, File
from models_engine import run_inference
from model_registry import load_models
import shutil
import os

app = FastAPI(title="Hack4Safety AI Backend", version="1.0")

# Load models once at startup
@app.on_event("startup")
def startup_event():
    load_models("C:\\Users\\SAPTARSHI MONDAL\\Hack4Safety\\saved_models")

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    """
    Upload a CSV file and get predictions.
    """
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = run_inference(temp_path)

    # Clean up uploaded temp file
    os.remove(temp_path)

    return result