import pandas as pd  # type: ignore
import numpy as np  # type: ignore
from model_registry import MODEL_REGISTRY
from feature_builder import *   # ✅ fixed import
from prophet import Prophet  # type: ignore
from report_generator import generate_analysis_report
from visualizer import generate_graphs
from db_manager import save_prediction_to_db
import os
from geo_mapper import get_geo_location


def _normalise_predictions(preds):
    arr = np.array(preds, dtype=float).flatten()
    if arr.size == 0:
        return arr

    arr = np.nan_to_num(arr, nan=0.0, posinf=0.0, neginf=0.0)
    min_val, max_val = arr.min(), arr.max()
    if max_val == min_val:
        return np.full_like(arr, 85.0)

    scaled = 70 + ((arr - min_val) / (max_val - min_val)) * 30
    return np.round(scaled, 2)


def _extract_month(df_row):
    month = df_row.get("month") if isinstance(df_row, dict) else df_row
    if month is None:
        return None
    if hasattr(month, "strftime"):
        return month.strftime("%Y-%m")
    return str(month)


def _determine_band(efficiency: float) -> str:
    if efficiency >= 85:
        return "high"
    if efficiency >= 75:
        return "moderate"
    return "watch"


def _build_map_points(dataset_label: str, df_proc: pd.DataFrame, preds) -> list:
    if "district" not in df_proc.columns:
        return []

    normalised = _normalise_predictions(preds)
    results = {}

    for idx, (district, normalised_score, raw_score) in enumerate(
        zip(df_proc["district"], normalised, np.array(preds).flatten())
    ):
        if pd.isna(district):
            continue

        location = get_geo_location(str(district))
        if not location:
            continue

        month_value = None
        if "month" in df_proc.columns:
            month_col_value = df_proc.iloc[idx]["month"]
            month_value = _extract_month(month_col_value)

        band = _determine_band(float(normalised_score))

        payload = {
            "district": str(district),
            "state": location.get("state"),
            "latitude": float(location["lat"]),
            "longitude": float(location["lng"]),
            "efficiency": float(normalised_score),
            "raw_score": float(raw_score),
            "dataset": dataset_label,
            "category": dataset_label.replace("_", " "),
            "month": month_value,
            "band": band,
        }

        key = str(district).strip().lower()
        existing = results.get(key)
        if existing is None:
            results[key] = payload
        else:
            existing_month = existing.get("month")
            if month_value and (existing_month is None or month_value > existing_month):
                results[key] = payload

    return list(results.values())


def run_inference(csv_path, single_input=None):
    """
    Auto-detects dataset type and runs prediction using the correct model.
    Works for all 10 datasets.
    """
    if csv_path:
        df = pd.read_csv(csv_path)
    elif single_input:
        df = pd.DataFrame([single_input])
    else:
        return {"status": "error", "message": "No input provided"}
    cols = set(df.columns)

    try:
        # 1️⃣ Convictions → Performance Model
        if {"ipc_trials", "ipc_convictions", "sll_trials"}.issubset(cols):
            model = MODEL_REGISTRY.get("conviction_model")
            X, _, df_proc = create_conviction_features(df)
            preds = model.predict(X)
            graphs_info = generate_graphs("Convictions", df_proc, preds)
            report = generate_analysis_report("Convictions", df_proc, preds)
            save_prediction_to_db("Convictions", os.path.basename(csv_path), preds, report, graphs_info["folder"])
            map_points = _build_map_points("Convictions", df_proc, preds)
            return {
                "dataset": "Convictions",
                "predictions": preds.tolist(),
                "districts": df_proc["district"].tolist() if "district" in df_proc.columns else [],
                "analysis_report": report,
                "graphs": graphs_info,
                "map_points": map_points,
            }

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
                X, _, df_proc = create_excise_features(df)
                preds = model.predict(X)
                graphs_info = generate_graphs("Fermented_wash", df_proc, preds)
                report = generate_analysis_report("Fermented_wash", df_proc, preds)
                save_prediction_to_db("Excise_Act", os.path.basename(csv_path), preds, report, graphs_info["folder"])
                map_points = _build_map_points("Excise_Act", df_proc, preds)
                return {
                    "dataset": "Excise_Act",
                    "predictions": preds.tolist(),
                    "districts": df_proc["district"].tolist() if "district" in df_proc.columns else [],
                    "analysis_report": report,
                    "graphs": graphs_info["files"],
                    "map_points": map_points,
                }

        # 4️⃣ Firearms → Efficiency Model
        elif {"gun_rifle", "pistol", "ammunition"}.issubset(cols):
            model = MODEL_REGISTRY.get("firearms_efficiency_model")
            X, _, df_proc = create_firearms_features(df)
            preds = model.predict(X)
            graphs_info = generate_graphs("Firearms", df_proc, preds)
            report = generate_analysis_report("Firearms", df_proc, preds)
            save_prediction_to_db("Firearms", os.path.basename(csv_path), preds, report, graphs_info["folder"])
            map_points = _build_map_points("Firearms_Drive", df_proc, preds)
            return {
                "dataset": "Firearms_Drive",
                "predictions": preds.tolist(),
                "districts": df_proc["district"].tolist() if "district" in df_proc.columns else [],
                "analysis_report": report,
                "graphs": graphs_info,
                "map_points": map_points,
            }

        # 5️⃣ Missing Persons → Recovery Efficiency
        elif {"missing_boys_start", "traced_boys"}.issubset(cols):
            model = MODEL_REGISTRY.get("missing_persons_efficiency_model")
            X, _, df_proc = create_missing_features(df)
            preds = model.predict(X)
            graphs_info = generate_graphs("MissingPersons", df_proc, preds)
            report = generate_analysis_report("MissingPersons", df_proc, preds)
            save_prediction_to_db("MissingPersons", os.path.basename(csv_path), preds, report, graphs_info["folder"])
            map_points = _build_map_points("MissingPersons_Drive", df_proc, preds)
            return {
                "dataset": "MissingPersons_Drive",
                "predictions": preds.tolist(),
                "districts": df_proc["district"].tolist() if "district" in df_proc.columns else [],
                "analysis_report": report,
                "graphs": graphs_info,
                "map_points": map_points,
            }

        # 6️⃣ NBW Drive → Execution Efficiency
        elif {"nbw_pending_start", "nbw_received", "nbw_executed_drive"}.issubset(cols) and "ganja_kg" not in cols:
            model = MODEL_REGISTRY.get("nbw_efficiency_model")
            X, _, df_proc = create_nbw_features(df)
            preds = model.predict(X)
            graphs_info = generate_graphs("NBW", df_proc, preds)
            report = generate_analysis_report("NBW", df_proc, preds)
            save_prediction_to_db("NBW", os.path.basename(csv_path), preds, report, graphs_info["folder"])
            map_points = _build_map_points("NBW_Drive", df_proc, preds)
            return {
                "dataset": "NBW_Drive",
                "predictions": preds.tolist(),
                "districts": df_proc["district"].tolist() if "district" in df_proc.columns else [],
                "analysis_report": report,
                "graphs": graphs_info,
                "map_points": map_points,
            }

        # 7️⃣ Narcotics Drive → Operations Efficiency
        elif {"ganja_kg", "brownsugar_g", "cough_syrup_bottles"}.issubset(cols):
            model = MODEL_REGISTRY.get("narcotics_efficiency_model")
            X, _, df_proc = create_narcotics_features(df)
            preds = model.predict(X)
            graphs_info = generate_graphs("Narcotics", df_proc, preds)
            report = generate_analysis_report("Narcotics", df_proc, preds)
            save_prediction_to_db("Narcotics", os.path.basename(csv_path), preds, report, graphs_info["folder"])
            map_points = _build_map_points("Narcotics_Drive", df_proc, preds)
            return {
                "dataset": "Narcotics_Drive",
                "predictions": preds.tolist(),
                "districts": df_proc["district"].tolist() if "district" in df_proc.columns else [],
                "analysis_report": report,
                "graphs": graphs_info,
                "map_points": map_points,
            }

        # 8️⃣ OPG Act → Cash/Mobile Seizure Efficiency
        elif {"details_of_seizure"}.issubset(cols) and "mobile" in str(df["details_of_seizure"].iloc[0]).lower():
            model = MODEL_REGISTRY.get("opg_efficiency_model")
            X, _, df_proc = create_opg_features(df)
            preds = model.predict(X)
            graphs_info = generate_graphs("OPG_Act", df_proc, preds)
            report = generate_analysis_report("OPG_Act", df_proc, preds)
            save_prediction_to_db("OPG_Act", os.path.basename(csv_path), preds, report, graphs_info["folder"])
            map_points = _build_map_points("OPG_Act", df_proc, preds)
            return {
                "dataset": "OPG_Act",
                "predictions": preds.tolist(),
                "districts": df_proc["district"].tolist() if "district" in df_proc.columns else [],
                "analysis_report": report,
                "graphs": graphs_info,
                "map_points": map_points,
            }

        # 9️⃣ Preventive Measures → Law Enforcement Efficiency
        elif {"notice_129_bnss", "bound_126_bnss"}.issubset(cols):
            model = MODEL_REGISTRY.get("preventive_efficiency_model")
            X, _, df_proc = create_preventive_features(df)
            preds = model.predict(X)
            graphs_info = generate_graphs("PreventiveMeasures", df_proc, preds)
            report = generate_analysis_report("PreventiveMeasures", df_proc, preds)
            save_prediction_to_db("PreventiveMeasures", os.path.basename(csv_path), preds, report, graphs_info["folder"])
            map_points = _build_map_points("PreventiveMeasures", df_proc, preds)
            return {
                "dataset": "PreventiveMeasures",
                "predictions": preds.tolist(),
                "districts": df_proc["district"].tolist() if "district" in df_proc.columns else [],
                "analysis_report": report,
                "graphs": graphs_info,
                "map_points": map_points,
            }

        # 🔟 Sand Mining → Resource Efficiency
        elif {"vehicles_seized", "notices_served"}.issubset(cols):
            model = MODEL_REGISTRY.get("sand_mining_efficiency_model")
            X, _, df_proc = create_mining_features(df)
            preds = model.predict(X)
            graphs_info = generate_graphs("Sand_Mining", df_proc, preds)
            report = generate_analysis_report("Sand_Mining", df_proc, preds)
            save_prediction_to_db("Sand_Mining", os.path.basename(csv_path), preds, report, graphs_info["folder"])
            map_points = _build_map_points("SandMining", df_proc, preds)
            return {
                "dataset": "SandMining",
                "predictions": preds.tolist(),
                "districts": df_proc["district"].tolist() if "district" in df_proc.columns else [],
                "analysis_report": report,
                "graphs": graphs_info,
                "map_points": map_points,
            }

        # 🚨 Unknown Dataset
        else:
            return {"status": "error", "message": "❌ Unknown dataset structure"}

    except Exception as e:
        return {"status": "error", "message": f"⚠️ Inference failed: {str(e)}"}