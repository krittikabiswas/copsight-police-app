import google.generativeai as genai  # type: ignore
import os
import numpy as np  # type: ignore
import re

# --- Configure Gemini safely ---
API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyDzNHyrJoy8waLO8rMg-j838kcY-eUMEzI")
if not API_KEY:
    raise ValueError("⚠️ GOOGLE_API_KEY not found. Please set it as an environment variable.")

genai.configure(api_key=API_KEY)
gemini_model = genai.GenerativeModel("gemini-2.5-flash")


def clean_gemini_output(text: str) -> str:
    """
    Cleans unnecessary AI disclaimers or formatting artifacts from Gemini output.
    """
    if not text:
        return ""
    lines = text.splitlines()
    cleaned = []
    for line in lines:
        if re.search(r"(AI|automated|generated|readability|Disclaimer)", line, re.IGNORECASE):
            continue
        if line.strip().startswith(("_", "*", "•", "#")):
            continue
        cleaned.append(line.strip())
    return "\n".join(cleaned).strip()


def build_fallback_narrative(dataset_name: str, districts: list[str], preds_scaled: np.ndarray) -> str:
    if preds_scaled.size == 0:
        return "No performance records were available to analyse."

    avg = float(np.mean(preds_scaled))
    top_idx = int(np.argmax(preds_scaled))
    low_idx = int(np.argmin(preds_scaled))
    top_value = float(preds_scaled[top_idx])
    low_value = float(preds_scaled[low_idx])
    top_name = districts[top_idx] if districts else f"Record {top_idx + 1}"
    low_name = districts[low_idx] if districts else f"Record {low_idx + 1}"
    spread = top_value - low_value
    std_dev = float(np.std(preds_scaled))
    above_target = sum(1 for score in preds_scaled if score >= avg)

    narrative_lines = [
        f"Operational briefing for {dataset_name.replace('_', ' ')} indicates an average efficiency of {avg:.1f}% across {preds_scaled.size} districts.",
        f"{top_name} currently leads the drive with {top_value:.1f}%, while {low_name} trails at {low_value:.1f}%, creating a performance gap of {spread:.1f} points.",
        f"Variation in the data is {'limited' if std_dev < 4 else 'moderate' if std_dev < 8 else 'high'}, with a standard deviation of {std_dev:.1f} points and {above_target} districts operating at or above the statewide average.",
        f"Focus supervisory support on the bottom quartile to raise field execution rates and share the playbooks from {top_name} to accelerate catch-up.",
        "Ensure data validation for districts showing steep swings and align weekly targets with the average benchmark for faster normalisation.",
    ]

    return " ".join(narrative_lines)


def generate_analysis_report(dataset_name, df, preds):
    """
    Generate a Gemini-powered performance report with normalized percentage scores.
    Returns: dict with {summary, headline, analysis_report}
    """

    if preds is None or len(preds) == 0:
        return {
            "summary": f"{dataset_name}: (No predictions available)",
            "headline": "No predictions",
            "analysis_report": "(No data available for analysis.)"
        }

    preds = np.array(preds).flatten()
    districts = (
        df["district"].tolist()
        if "district" in df.columns
        else [f"Record {i+1}" for i in range(len(preds))]
    )

    # --- Normalize predictions to 70–100% scale for human readability ---
    min_val, max_val = np.min(preds), np.max(preds)
    if max_val == min_val:
        preds_scaled = np.full_like(preds, 85.0)
    else:
        preds_scaled = 70 + ((preds - min_val) / (max_val - min_val)) * 30
    preds_scaled = np.round(preds_scaled, 2)

    avg_pred = float(np.mean(preds_scaled))
    top_idx, low_idx = int(np.argmax(preds_scaled)), int(np.argmin(preds_scaled))
    top_district, low_district = districts[top_idx], districts[low_idx]

    # Prepare data summary string
    data_points = "\n".join([f"{d}: {p:.2f}%" for d, p in zip(districts, preds_scaled)])
    summary_line = f"{dataset_name}: Avg {avg_pred:.2f}% | Top {top_district} | Lowest {low_district}"

    # --- Gemini prompt ---
    prompt = f"""
You are a senior data intelligence officer for a State Police Headquarters.
You are preparing an operational briefing note for the DGP about the performance of the **{dataset_name.replace('_', ' ')}**.

DATA:
{data_points}

KEY STATS:
- Average Efficiency: {avg_pred:.2f}%
- Best Performing District: {top_district} ({preds_scaled[top_idx]:.2f}%)
- Lowest Performing District: {low_district} ({preds_scaled[low_idx]:.2f}%)

CONTEXT:
The '{dataset_name.replace('_', ' ')}' represents a major police operational drive focused on measurable field performance — such as NBW (Non-Bailable Warrant) execution, conviction follow-ups, or seizure effectiveness. Each district’s efficiency indicates ground-level responsiveness, inter-departmental coordination, and data accuracy in CCTNS records.

TASK:
Write a *strategic insight summary* (6–8 sentences) for the DGP that:
1. Identifies operational strengths and weaknesses.
2. Comments on performance distribution — e.g., if high-performing zones cluster geographically.
3. Provides possible underlying causes (like manpower, coordination, or planning).
4. Ends with 2 crisp, actionable recommendations — phrased as “should” or “must” statements.

STYLE:
- Tone: Authoritative, executive, precise.
- Avoid repeating data values verbatim unless meaningful.
- Prefer sentences that sound like: "The data indicates...", "Operational trends suggest...", "District-level variance implies..."
- Do **not** use any motivational language or generic AI phrasing.
"""

    try:
        response = gemini_model.generate_content(prompt)
        report_text = clean_gemini_output(response.text.strip())

        if not report_text:
            report_text = build_fallback_narrative(dataset_name, districts, preds_scaled)

        # --- Headline generation ---
        headline_prompt = f"""
Summarize the key outcome of this {dataset_name} efficiency report in under 10 words.
Tone: crisp, analytical, formal.
Context:
Top District: {top_district}, Lowest District: {low_district}, Average: {avg_pred:.2f}%.
"""
        headline_resp = gemini_model.generate_content(headline_prompt)
        headline = clean_gemini_output(headline_resp.text.strip())
        if not headline:
            headline = f"{dataset_name.replace('_', ' ')} performance snapshot"
        headline = headline.replace("\n", " ").strip()

        return {
            "summary": summary_line,
            "headline": headline,
            "analysis_report": report_text,
        }

    except Exception as e:
        print(f"⚠️ Report generation failed: {e}")
        fallback_text = build_fallback_narrative(dataset_name, districts, preds_scaled)
        return {
            "summary": summary_line,
            "headline": f"{dataset_name.replace('_', ' ')} performance snapshot",
            "analysis_report": fallback_text,
        }