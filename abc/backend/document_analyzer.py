import io
import os
import json
import pdfplumber
import google.generativeai as genai
from typing import Dict, Any
from PIL import Image

# ✅ Configure Gemini
os.environ["GOOGLE_API_KEY"] = "AIzaSyDzNHyrJoy8waLO8rMg-j838kcY-eUMEzI"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# -------------------------------------------------------
# 🧩 1. Extract text from PDF (text-based)
# -------------------------------------------------------
def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            texts = [page.extract_text() or "" for page in pdf.pages]
        full_text = "\n".join(texts)
        return full_text[:20000] if full_text.strip() else ""
    except Exception as e:
        print(f"⚠️ PDF extraction failed: {e}")
        return ""


# -------------------------------------------------------
# 🧩 2. Extract text from TXT
# -------------------------------------------------------
def extract_text_from_txt(file_bytes: bytes) -> str:
    try:
        return file_bytes.decode("utf-8", errors="ignore")[:20000]
    except Exception as e:
        print(f"⚠️ TXT extraction failed: {e}")
        return ""

import re, json

def clean_ai_output(raw_text):
    if not raw_text:
        return {}
    try:
        clean = re.sub(r'(?i)^json\s*', '', raw_text.strip())
        clean = clean.replace('\\n', '\n').strip()
        # Find the JSON body
        start = clean.find('{')
        if start > 0:
            clean = clean[start:]
        return json.loads(clean)
    except Exception as e:
        print(f"⚠️ Cleaning failed: {e}")
        return {"raw_text": raw_text}

# -------------------------------------------------------
# 🧩 3. Vision + OCR via Gemini (no Tesseract)
# -------------------------------------------------------
def extract_text_from_image_with_gemini(image_bytes: bytes) -> str:
    """
    Uses Gemini Vision model to read & transcribe any language text from image.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        model = genai.GenerativeModel("gemini-2.0-flash-vision")
        response = model.generate_content([
            "Read and transcribe all text visible in this image, in the *original language*. "
            "Do not translate. Maintain the exact writing language and tone.",
            image
        ])
        text = response.text.strip()
        return text[:20000]
    except Exception as e:
        print(f"⚠️ Gemini OCR failed: {e}")
        return ""


# -------------------------------------------------------
# 🧩 4. Detect Language
# -------------------------------------------------------
def detect_language_with_gemini(text: str) -> str:
    """
    Use Gemini to identify document language.
    """
    model = genai.GenerativeModel("gemini-2.5-flash")
    prompt = f"""
Detect the primary language of this text and respond with only the ISO language code.
Example: 'en' for English, 'hi' for Hindi, 'bn' for Bengali, 'or' for Odia.
Text:
{text[:800]}
"""
    try:
        response = model.generate_content(prompt)
        return response.text.strip().lower()[:5]
    except Exception:
        return "en"


# -------------------------------------------------------
# 🧩 5. Analysis with Same-Language Output
# -------------------------------------------------------
def analyse_document_with_gemini(document_text: str, language_code: str) -> Dict[str, Any]:
    """
    Performs multilingual legal analysis.
    Gemini interprets internally but replies in the *same language as input*.
    Cleans and normalizes Gemini's response (handles 'json\\n{...}' cases).
    """
    prompt = f"""
You are a multilingual Indian legal & police operations AI.
The document below is written in language code: {language_code}.

DOCUMENT:
{document_text}

TASKS:
1. Identify all relevant Indian laws, acts, or legal sections (IPC, CrPC, BNSS, NDPS, etc.).
2. Provide next-step recommendations and cautionary actions.
3. Identify missing procedural elements (like FIR number, evidence, witness info, etc.).
4. Respond strictly in the *same language* as the document ({language_code}), but maintain structure.
5. Format the output in valid JSON, as follows:
{{
  "language": "{language_code}",
  "laws": ["..."],
  "recommendations": ["..."],
  "missing_elements": ["..."]
}}
"""

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        raw_text = response.text.strip()

        # --- Clean Gemini output ---
        import re
        cleaned = re.sub(r'(?i)^json\s*', '', raw_text)  # remove 'json' prefix if present
        cleaned = cleaned.replace("\\n", "\n").strip()   # convert escaped \n to real newlines

        # Some responses embed JSON inside quotes or Markdown code blocks
        if "{" not in cleaned and "```" in cleaned:
            cleaned = cleaned.split("```")[1]
        if cleaned.startswith('"') and cleaned.endswith('"'):
            cleaned = cleaned.strip('"')

        # Find JSON body if extra text exists
        start = cleaned.find("{")
        if start > 0:
            cleaned = cleaned[start:]

        # --- Parse JSON if possible ---
        try:
            parsed = json.loads(cleaned)
            return parsed
        except json.JSONDecodeError:
            # If still not parsable, fallback through helper
            parsed = clean_ai_output(cleaned)
            return parsed

    except Exception as e:
        print(f"⚠️ Gemini analysis failed: {e}")
        return {"error": str(e), "language": language_code}

# -------------------------------------------------------
# 🧩 6. Unified Handler (PDF / TXT / Image)
# -------------------------------------------------------
def process_uploaded_document(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    filename = filename.lower()
    text = ""

    # Step 1: Extract text
    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_bytes)
        if not text:
            try:
                with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                    page = pdf.pages[0]
                    image = page.to_image(resolution=300)
                    img_bytes = io.BytesIO()
                    image.original.save(img_bytes, format="PNG")
                    img_bytes.seek(0)
                    text = extract_text_from_image_with_gemini(img_bytes.read())
            except Exception:
                pass

    elif filename.endswith(".txt"):
        text = extract_text_from_txt(file_bytes)
    elif filename.endswith((".jpg", ".jpeg", ".png")):
        text = extract_text_from_image_with_gemini(file_bytes)
    else:
        return {"error": "Unsupported file type. Please upload .pdf, .txt, .jpg, or .png"}

    if not text.strip():
        return {"error": "No readable text extracted."}

    # Step 2: Detect language dynamically
    language_code = detect_language_with_gemini(text)

    # Step 3: Perform same-language analysis
    analysis = analyse_document_with_gemini(text, language_code)

    return {
        "filename": filename,
        "language_detected": language_code,
        "text_excerpt": text[:1000],
        "analysis": analysis
    }