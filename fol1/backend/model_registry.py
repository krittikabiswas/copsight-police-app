import joblib
import os

MODEL_REGISTRY = {}

def load_models(model_dir="C:\\Users\\SAPTARSHI MONDAL\\Hack4Safety\\saved_models"):
    """
    Loads all trained models (.pkl) into a registry dictionary.
    """
    global MODEL_REGISTRY
    MODEL_REGISTRY.clear()

    for file in os.listdir(model_dir):
        if file.endswith(".pkl"):
            name = os.path.splitext(file)[0]
            MODEL_REGISTRY[name] = joblib.load(os.path.join(model_dir, file))

    print(f"✅ Loaded {len(MODEL_REGISTRY)} models into registry.")
    return MODEL_REGISTRY