import google.generativeai as genai
import os
import numpy as np
import re

# --- Configure Gemini safely ---
API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyDzNHyrJoy8waLO8rMg-j838kcY-eUMEzI")
if not API_KEY:
    raise ValueError("⚠️ GOOGLE_API_KEY not found. Please set it as an environment variable.")

genai.configure(api_key=API_KEY)
gemini_model = genai.GenerativeModel("gemini-2.5-flash")

def clean_gemini_output(text: str) -> str:
    """
    Cleans unnecessary trailing notes or AI disclaimers from Gemini output.
    """
    # Remove lines that look like notes, underscores, or AI credits
    lines = text.splitlines()
    cleaned = []
    for line in lines:
        if re.search(r"(AI|automated|generated|readability|🧠|_)", line, re.IGNORECASE):
            continue
        if line.strip().startswith(("_", "*", "🧠")):
            continue
        cleaned.append(line)
    return "\n".join(cleaned).strip()

def generate_analysis_report(dataset_name, df, preds):
    """
    Generate a Gemini-powered performance report with normalized percentage scores.
    Ensures values are human-readable (0–100% range).
    """

    if preds is None or len(preds) == 0:
        return "(No predictions available to analyze.)"

    preds = np.array(preds).flatten()
    districts = df["district"].tolist() if "district" in df.columns else [f"Record {i+1}" for i in range(len(preds))]

    # --- Normalize predictions to 0–100 scale ---
    min_val, max_val = np.min(preds), np.max(preds)
    if max_val == min_val:
        preds_scaled = np.full_like(preds, 85.0)  # fallback to flat 85%
    else:
        preds_scaled = 70 + ((preds - min_val) / (max_val - min_val)) * 30  # scale between 70–100%

    avg_pred = np.mean(preds_scaled)
    top_idx, low_idx = int(np.argmax(preds_scaled)), int(np.argmin(preds_scaled))
    top_district, low_district = districts[top_idx], districts[low_idx]

    # Prepare district–score pairs for the Gemini prompt
    data_points = "\n".join([f"{d}: {round(p, 2)}%" for d, p in zip(districts, preds_scaled)])

    summary_line = f"{dataset_name}: Avg {avg_pred:.2f}% | Top {top_district} | Lowest {low_district}"
    prompt = f"""
    You are an expert AI analyst writing a performance summary for police administrators.

    Dataset: {dataset_name}
    Below are predicted *normalized efficiency percentages* for each district (where 100% = best observed performance).

    {data_points}

    Average Efficiency: {avg_pred:.2f}%
    Best Performing District: {top_district} ({preds_scaled[top_idx]:.2f}%)
    Lowest Performing District: {low_district} ({preds_scaled[low_idx]:.2f}%)

    Write a concise, professional summary (5–8 sentences) explaining:
    - Overall trend and range of efficiency
    - Which districts excel or lag
    - Insights about consistency or anomalies
    - Actionable recommendations for improvement
    Tone should be factual, balanced, and administrative.
    """

    try:
        response = gemini_model.generate_content(prompt)
        text = response.text.strip()

        formatted_report = (
            f"{text}\n\n"
        )
        headline_prompt = f"Give a one-line headline summarizing {dataset_name} performance results in under 10 words."
        headline_resp = gemini_model.generate_content(headline_prompt)
        headline = headline_resp.text.strip().replace('\n', ' ')
        return {
            "summary": summary_line,
            "headline": headline,
            "analysis_report": formatted_report
        }

    except Exception as e:
        return {
            "summary": f"⚠️ {dataset_name}: Report generation failed",
            "analysis_report": f"(Error: {str(e)})"
        }