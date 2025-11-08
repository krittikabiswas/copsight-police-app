from fastapi import FastAPI, UploadFile, File, HTTPException
from models_engine import run_inference
from model_registry import load_models
import shutil
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Hack4Safety AI Backend", version="2.1")

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/graphs",
    StaticFiles(directory="C:/Users/SAPTARSHI MONDAL/Copsight/copsight-police-app/sapcop/generated_graphs"),
    name="graphs",
)

# --- Load Models Once at Startup ---
@app.on_event("startup")
def startup_event():
    load_models("C:\\Users\\SAPTARSHI MONDAL\\Copsight\\copsight-police-app\\sapcop\\saved_models")


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    """
    Predict from uploaded CSV file.
    Works for both:
    - Full datasets (multi-row CSVs)
    - Single-row datasets (one record)
    """
    try:
        # --- Save temporary uploaded CSV ---
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # --- Run model inference ---
        result = run_inference(temp_path)

        # --- Clean up temporary file ---
        if os.path.exists(temp_path):
            os.remove(temp_path)

        # --- Add info for clarity ---
        result["file_name"] = file.filename
        result["status"] = "success"
        result["mode"] = "single_row" if len(result.get("predictions", [])) == 1 else "batch_csv"

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))