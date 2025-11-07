import pandas as pd
import numpy as np
from model_registry import MODEL_REGISTRY
from feature_builder import *   # ✅ fixed import
from prophet import Prophet 


def run_inference(csv_path):
    """
    Auto-detects dataset type and runs prediction using the correct model.
    Works for all 10 datasets.
    """
    df = pd.read_csv(csv_path)
    cols = set(df.columns)

    try:
        # 1️⃣ Convictions → Performance Model
        if {"ipc_trials", "ipc_convictions", "sll_trials"}.issubset(cols):
            model = MODEL_REGISTRY.get("conviction_model")
            X, _, _ = create_conviction_features(df)
            preds = model.predict(X)
            return {"dataset": "Convictions", "predictions": preds.tolist()}

        # 2️⃣ Crime Pendency → Prophet Forecast
        elif {"pendency_percent", "target_close"}.issubset(cols):
            results = {}
            for district in df["district"].unique():
                district_df = df[df["district"] == district]
                if len(district_df) < 3:
                    continue
                m = Prophet(daily_seasonality=False, weekly_seasonality=False, yearly_seasonality=True)
                district_df["ds"] = pd.to_datetime(district_df["month"], format="%Y-%m")
                district_df["y"] = district_df["pendency_percent"]
                m.fit(district_df[["ds", "y"]])
                future = m.make_future_dataframe(periods=3, freq="MS")
                forecast = m.predict(future)
                results[district] = forecast[["ds", "yhat"]].tail(3).to_dict(orient="records")
            return {"dataset": "CrimePendancy", "forecast": results}

        # 3️⃣ Excise Act → Efficiency Model
        elif {"cases_registered", "persons_arrested"}.issubset(cols) and "details_of_seizure" in cols:
            # Distinguish from OPG by keyword check
            if "fermented wash" in str(df["details_of_seizure"].iloc[0]).lower():
                model = MODEL_REGISTRY.get("excise_efficiency_model")
                X, _, _ = create_excise_features(df)
                preds = model.predict(X)
                return {"dataset": "Excise_Act", "predictions": preds.tolist()}

        # 4️⃣ Firearms → Efficiency Model
        elif {"gun_rifle", "pistol", "ammunition"}.issubset(cols):
            model = MODEL_REGISTRY.get("firearms_efficiency_model")
            X, _, _ = create_firearms_features(df)
            preds = model.predict(X)
            return {"dataset": "Firearms_Drive", "predictions": preds.tolist()}

        # 5️⃣ Missing Persons → Recovery Efficiency
        elif {"missing_boys_start", "traced_boys"}.issubset(cols):
            model = MODEL_REGISTRY.get("missing_persons_efficiency_model")
            X, _, _ = create_missing_features(df)
            preds = model.predict(X)
            return {"dataset": "MissingPersons_Drive", "predictions": preds.tolist()}

        # 6️⃣ NBW Drive → Execution Efficiency
        elif {"nbw_pending_start", "nbw_received", "nbw_executed_drive"}.issubset(cols) and "ganja_kg" not in cols:
            model = MODEL_REGISTRY.get("nbw_efficiency_model")
            X, _, _ = create_nbw_features(df)
            preds = model.predict(X)
            return {"dataset": "NBW_Drive", "predictions": preds.tolist()}

        # 7️⃣ Narcotics Drive → Operations Efficiency
        elif {"ganja_kg", "brownsugar_g", "cough_syrup_bottles"}.issubset(cols):
            model = MODEL_REGISTRY.get("narcotics_efficiency_model")
            X, _, _ = create_narcotics_features(df)
            preds = model.predict(X)
            return {"dataset": "Narcotics_Drive", "predictions": preds.tolist()}

        # 8️⃣ OPG Act → Cash/Mobile Seizure Efficiency
        elif {"details_of_seizure"}.issubset(cols) and "mobile" in str(df["details_of_seizure"].iloc[0]).lower():
            model = MODEL_REGISTRY.get("opg_efficiency_model")
            X, _, _ = create_opg_features(df)
            preds = model.predict(X)
            return {"dataset": "OPG_Act", "predictions": preds.tolist()}

        # 9️⃣ Preventive Measures → Law Enforcement Efficiency
        elif {"notice_129_bnss", "bound_126_bnss"}.issubset(cols):
            model = MODEL_REGISTRY.get("preventive_efficiency_model")
            X, _, _ = create_preventive_features(df)
            preds = model.predict(X)
            return {"dataset": "PreventiveMeasures", "predictions": preds.tolist()}

        # 🔟 Sand Mining → Resource Efficiency
        elif {"vehicles_seized", "notices_served"}.issubset(cols):
            model = MODEL_REGISTRY.get("sand_mining_efficiency_model")
            X, _, _ = create_mining_features(df)
            preds = model.predict(X)
            return {"dataset": "SandMining", "predictions": preds.tolist()}

        # 🚨 Unknown Dataset
        else:
            return {"status": "error", "message": "❌ Unknown dataset structure"}

    except Exception as e:
        return {"status": "error", "message": f"⚠️ Inference failed: {str(e)}"}