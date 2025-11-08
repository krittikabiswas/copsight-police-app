from sqlalchemy import create_engine, text
import json
from datetime import datetime
from urllib.parse import quote_plus

# ⚙️ Database connection configuration
DB_USER = "myuser"
DB_PASSWORD = quote_plus("Kingsammo@123")  # safely encode @
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "postgres"

# Full SQLAlchemy connection string
DB_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Initialize SQLAlchemy engine
engine = create_engine(DB_URL, pool_pre_ping=True)


def init_db():
    """
    Ensures that the ai_predictions table exists.
    If missing, creates it automatically.
    """
    try:
        with engine.begin() as conn:
            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS ai_predictions (
                id SERIAL PRIMARY KEY,
                dataset_name TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                file_name TEXT,
                predictions JSONB,
                analysis_report JSONB,
                graphs_path TEXT
            );
            """))
        print("✅ Verified ai_predictions table exists.")
    except Exception as e:
        print(f"⚠️ Database initialization failed: {str(e)}")


def save_prediction_to_db(dataset_name, file_name, preds, report, graphs_path):
    """
    Saves AI prediction results, reports, and graph metadata into PostgreSQL.
    All fields are JSON-safe.
    """
    try:
        # --- Prepare serializable data ---
        preds_json = json.dumps(preds.tolist() if not isinstance(preds, list) else preds, ensure_ascii=False)
        report_json = json.dumps(report, ensure_ascii=False) if isinstance(report, dict) else report
        timestamp = datetime.now()

        query = text("""
            INSERT INTO ai_predictions (dataset_name, timestamp, file_name, predictions, analysis_report, graphs_path)
            VALUES (:dataset_name, :timestamp, :file_name, :predictions, :analysis_report, :graphs_path)
        """)

        # --- Execute safely ---
        with engine.begin() as conn:
            conn.execute(query, {
                "dataset_name": dataset_name,
                "timestamp": timestamp,
                "file_name": file_name,
                "predictions": preds_json,
                "analysis_report": report_json,
                "graphs_path": graphs_path
            })

        print(f"✅ Saved {dataset_name} results into PostgreSQL.")
        return True

    except Exception as e:
        print(f"⚠️ Database insert failed: {str(e)}")
        return False


def fetch_all_predictions(limit=10):
    """
    Fetches the most recent prediction records.
    Returns a list of dicts.
    """
    try:
        query = text("""
            SELECT id, dataset_name, timestamp, file_name,
                   predictions, analysis_report, graphs_path
            FROM ai_predictions
            ORDER BY timestamp DESC
            LIMIT :limit
        """)
        with engine.begin() as conn:
            result = conn.execute(query, {"limit": limit}).mappings().all()

        # Convert JSONB text to Python dicts
        for row in result:
            if isinstance(row["predictions"], str):
                try:
                    row["predictions"] = json.loads(row["predictions"])
                except:
                    pass
            if isinstance(row["analysis_report"], str):
                try:
                    row["analysis_report"] = json.loads(row["analysis_report"])
                except:
                    pass

        return [dict(r) for r in result]

    except Exception as e:
        print(f"⚠️ Fetch failed: {str(e)}")
        return []


def fetch_summary_reports():
    """
    Fetches dataset names and summaries for quick dashboard view.
    """
    try:
        query = text("""
            SELECT 
                dataset_name,
                analysis_report->>'summary' AS summary,
                analysis_report->>'headline' AS headline,
                timestamp,
                graphs_path
            FROM ai_predictions
            ORDER BY timestamp DESC
        """)
        with engine.begin() as conn:
            result = conn.execute(query).mappings().all()
        return [dict(r) for r in result]

    except Exception as e:
        print(f"⚠️ Summary fetch failed: {str(e)}")
        return []