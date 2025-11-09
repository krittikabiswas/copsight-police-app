from sqlalchemy import create_engine, text
import json
from datetime import datetime
from urllib.parse import quote_plus
import bcrypt

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


# ---------------------- INITIALIZATION ----------------------

def init_db():
    """
    Ensures that both ai_predictions and users tables exist.
    """
    try:
        with engine.begin() as conn:
            # ✅ AI Predictions Table
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

            # ✅ Users Table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    full_name TEXT NOT NULL,
                    police_id TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    mobile TEXT,
                    password_hash TEXT NOT NULL,
                    rank TEXT,
                    district TEXT,
                    terms_accepted BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """))

            # ✅ Community Posts Table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS community_posts (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    author_name TEXT NOT NULL,
                    district TEXT NOT NULL,
                    category TEXT NOT NULL,
                    content TEXT NOT NULL,
                    likes_count INTEGER DEFAULT 0,
                    comments_count INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """))

            # ✅ Community Likes Table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS community_likes (
                    id SERIAL PRIMARY KEY,
                    post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(post_id, user_id)
                );
            """))

            # ✅ Community Comments Table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS community_comments (
                    id SERIAL PRIMARY KEY,
                    post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    author_name TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """))

        print("✅ Verified all tables exist: ai_predictions, users, community_posts, community_likes, community_comments.")
    except Exception as e:
        print(f"⚠️ Database initialization failed: {str(e)}")


# Run table creation immediately when file loads
init_db()


# ---------------------- USER MANAGEMENT ----------------------

def hash_password(password: str) -> str:
    """Hashes password using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def check_password(password: str, hashed: str) -> bool:
    """Verifies a plain-text password against a hash."""
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def register_user(data: dict):
    """
    Registers a new user if Police ID or Email is not already taken.
    """
    try:
        with engine.begin() as conn:
            # Check for duplicates
            result = conn.execute(
                text("SELECT * FROM users WHERE police_id = :pid OR email = :email"),
                {"pid": data["police_id"], "email": data["email"]}
            ).fetchone()

            if result:
                return {"status": "error", "message": "User with this Police ID or Email already exists."}

            # Hash password
            hashed_pw = hash_password(data["password"])

            # Insert new user
            conn.execute(text("""
                INSERT INTO users (full_name, police_id, email, mobile, password_hash, rank, district, terms_accepted)
                VALUES (:full_name, :police_id, :email, :mobile, :password_hash, :rank, :district, :terms_accepted)
            """), {
                "full_name": data["full_name"],
                "police_id": data["police_id"],
                "email": data["email"],
                "mobile": data["mobile"],
                "password_hash": hashed_pw,
                "rank": data["rank"],
                "district": data["district"],
                "terms_accepted": data["terms_accepted"]
            })

        print(f"✅ User registered: {data['police_id']}")
        return {"status": "success", "message": "User registered successfully."}

    except Exception as e:
        print(f"⚠️ User registration failed: {str(e)}")
        return {"status": "error", "message": str(e)}


def validate_login(police_id: str, password: str):
    """
    Validates login credentials by checking stored hash.
    """
    try:
        with engine.begin() as conn:
            result = conn.execute(
                text("SELECT * FROM users WHERE police_id = :pid"),
                {"pid": police_id}
            ).mappings().fetchone()

            if not result:
                return {"status": "error", "message": "User not found."}

            if not check_password(password, result["password_hash"]):
                return {"status": "error", "message": "Invalid password."}

            # Return basic user info (excluding password)
            user_data = {
                "id": result["id"],
                "full_name": result["full_name"],
                "police_id": result["police_id"],
                "email": result["email"],
                "rank": result["rank"],
                "district": result["district"],
            }
            return {"status": "success", "message": "Login successful.", "user": user_data}

    except Exception as e:
        print(f"⚠️ Login validation failed: {str(e)}")
        return {"status": "error", "message": str(e)}


# ---------------------- AI PREDICTIONS ----------------------

def save_prediction_to_db(dataset_name, file_name, preds, report, graphs_path):
    """Saves AI prediction results."""
    try:
        preds_json = json.dumps(preds.tolist() if not isinstance(preds, list) else preds, ensure_ascii=False)
        report_json = json.dumps(report, ensure_ascii=False) if isinstance(report, dict) else report
        timestamp = datetime.now()

        query = text("""
            INSERT INTO ai_predictions (dataset_name, timestamp, file_name, predictions, analysis_report, graphs_path)
            VALUES (:dataset_name, :timestamp, :file_name, :predictions, :analysis_report, :graphs_path)
        """)

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
    """Fetches latest prediction records."""
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
    """Fetches dataset names and summaries for dashboard."""
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


# ---------------------- COMMUNITY POSTS ----------------------

def create_community_post(user_id: int, author_name: str, district: str, category: str, content: str):
    """Creates a new community post."""
    try:
        query = text("""
            INSERT INTO community_posts (user_id, author_name, district, category, content)
            VALUES (:user_id, :author_name, :district, :category, :content)
            RETURNING id, user_id, author_name, district, category, content, likes_count, comments_count, created_at
        """)
        with engine.begin() as conn:
            result = conn.execute(query, {
                "user_id": user_id,
                "author_name": author_name,
                "district": district,
                "category": category,
                "content": content
            }).mappings().fetchone()
        
        print(f"✅ Community post created: {result['id']}")
        return {"status": "success", "post": dict(result)}
    except Exception as e:
        print(f"⚠️ Failed to create post: {str(e)}")
        return {"status": "error", "message": str(e)}


def fetch_community_posts(limit: int = 20, offset: int = 0):
    """Fetches all community posts with pagination."""
    try:
        query = text("""
            SELECT id, user_id, author_name, district, category, content, 
                   likes_count, comments_count, created_at
            FROM community_posts
            ORDER BY created_at DESC
            LIMIT :limit OFFSET :offset
        """)
        with engine.begin() as conn:
            result = conn.execute(query, {"limit": limit, "offset": offset}).mappings().all()
        return [dict(r) for r in result]
    except Exception as e:
        print(f"⚠️ Failed to fetch posts: {str(e)}")
        return []


def get_community_post(post_id: int):
    """Fetches a single community post with comments."""
    try:
        query = text("""
            SELECT id, user_id, author_name, district, category, content, 
                   likes_count, comments_count, created_at
            FROM community_posts
            WHERE id = :post_id
        """)
        with engine.begin() as conn:
            post = conn.execute(query, {"post_id": post_id}).mappings().fetchone()
            
            if not post:
                return None
            
            # Fetch comments for this post
            comments_query = text("""
                SELECT id, user_id, author_name, content, created_at
                FROM community_comments
                WHERE post_id = :post_id
                ORDER BY created_at ASC
            """)
            comments = conn.execute(comments_query, {"post_id": post_id}).mappings().all()
        
        return {**dict(post), "comments": [dict(c) for c in comments]}
    except Exception as e:
        print(f"⚠️ Failed to fetch post: {str(e)}")
        return None


def delete_community_post(post_id: int, user_id: int):
    """Deletes a community post (only by creator)."""
    try:
        query = text("""
            DELETE FROM community_posts
            WHERE id = :post_id AND user_id = :user_id
            RETURNING id
        """)
        with engine.begin() as conn:
            result = conn.execute(query, {"post_id": post_id, "user_id": user_id}).fetchone()
        
        if result:
            print(f"✅ Post deleted: {post_id}")
            return {"status": "success"}
        else:
            return {"status": "error", "message": "Post not found or unauthorized"}
    except Exception as e:
        print(f"⚠️ Failed to delete post: {str(e)}")
        return {"status": "error", "message": str(e)}


# ---------------------- COMMUNITY LIKES ----------------------

def like_post(post_id: int, user_id: int):
    """Adds a like to a post."""
    try:
        # Insert like
        like_query = text("""
            INSERT INTO community_likes (post_id, user_id)
            VALUES (:post_id, :user_id)
            ON CONFLICT DO NOTHING
            RETURNING id
        """)
        
        with engine.begin() as conn:
            like_result = conn.execute(like_query, {"post_id": post_id, "user_id": user_id}).fetchone()
            
            if like_result:
                # Update post likes count
                update_query = text("""
                    UPDATE community_posts
                    SET likes_count = (SELECT COUNT(*) FROM community_likes WHERE post_id = :post_id)
                    WHERE id = :post_id
                """)
                conn.execute(update_query, {"post_id": post_id})
                print(f"✅ Post liked: {post_id}")
                return {"status": "success", "liked": True}
            else:
                return {"status": "info", "message": "Already liked"}
    except Exception as e:
        print(f"⚠️ Failed to like post: {str(e)}")
        return {"status": "error", "message": str(e)}


def unlike_post(post_id: int, user_id: int):
    """Removes a like from a post."""
    try:
        unlike_query = text("""
            DELETE FROM community_likes
            WHERE post_id = :post_id AND user_id = :user_id
            RETURNING id
        """)
        
        with engine.begin() as conn:
            unlike_result = conn.execute(unlike_query, {"post_id": post_id, "user_id": user_id}).fetchone()
            
            if unlike_result:
                # Update post likes count
                update_query = text("""
                    UPDATE community_posts
                    SET likes_count = (SELECT COUNT(*) FROM community_likes WHERE post_id = :post_id)
                    WHERE id = :post_id
                """)
                conn.execute(update_query, {"post_id": post_id})
                print(f"✅ Post unliked: {post_id}")
                return {"status": "success", "liked": False}
            else:
                return {"status": "error", "message": "Like not found"}
    except Exception as e:
        print(f"⚠️ Failed to unlike post: {str(e)}")
        return {"status": "error", "message": str(e)}


def check_if_liked(post_id: int, user_id: int):
    """Checks if a user has liked a post."""
    try:
        query = text("""
            SELECT id FROM community_likes
            WHERE post_id = :post_id AND user_id = :user_id
        """)
        with engine.begin() as conn:
            result = conn.execute(query, {"post_id": post_id, "user_id": user_id}).fetchone()
        return result is not None
    except Exception as e:
        print(f"⚠️ Failed to check like: {str(e)}")
        return False


# ---------------------- COMMUNITY COMMENTS ----------------------

def add_comment_to_post(post_id: int, user_id: int, author_name: str, content: str):
    """Adds a comment to a post."""
    try:
        comment_query = text("""
            INSERT INTO community_comments (post_id, user_id, author_name, content)
            VALUES (:post_id, :user_id, :author_name, :content)
            RETURNING id, user_id, author_name, content, created_at
        """)
        
        with engine.begin() as conn:
            comment = conn.execute(comment_query, {
                "post_id": post_id,
                "user_id": user_id,
                "author_name": author_name,
                "content": content
            }).mappings().fetchone()
            
            # Update post comments count
            update_query = text("""
                UPDATE community_posts
                SET comments_count = (SELECT COUNT(*) FROM community_comments WHERE post_id = :post_id)
                WHERE id = :post_id
            """)
            conn.execute(update_query, {"post_id": post_id})
        
        print(f"✅ Comment added to post: {post_id}")
        return {"status": "success", "comment": dict(comment)}
    except Exception as e:
        print(f"⚠️ Failed to add comment: {str(e)}")
        return {"status": "error", "message": str(e)}


def get_post_comments(post_id: int, limit: int = 50):
    """Fetches all comments for a post."""
    try:
        query = text("""
            SELECT id, user_id, author_name, content, created_at
            FROM community_comments
            WHERE post_id = :post_id
            ORDER BY created_at ASC
            LIMIT :limit
        """)
        with engine.begin() as conn:
            result = conn.execute(query, {"post_id": post_id, "limit": limit}).mappings().all()
        return [dict(c) for c in result]
    except Exception as e:
        print(f"⚠️ Failed to fetch comments: {str(e)}")
        return []


def delete_comment(comment_id: int, user_id: int):
    """Deletes a comment (only by creator)."""
    try:
        # Get post_id first
        get_query = text("""
            SELECT post_id FROM community_comments
            WHERE id = :comment_id AND user_id = :user_id
        """)
        
        with engine.begin() as conn:
            post_info = conn.execute(get_query, {"comment_id": comment_id, "user_id": user_id}).fetchone()
            
            if not post_info:
                return {"status": "error", "message": "Comment not found or unauthorized"}
            
            post_id = post_info[0]
            
            # Delete comment
            delete_query = text("""
                DELETE FROM community_comments
                WHERE id = :comment_id AND user_id = :user_id
            """)
            conn.execute(delete_query, {"comment_id": comment_id, "user_id": user_id})
            
            # Update post comments count
            update_query = text("""
                UPDATE community_posts
                SET comments_count = (SELECT COUNT(*) FROM community_comments WHERE post_id = :post_id)
                WHERE id = :post_id
            """)
            conn.execute(update_query, {"post_id": post_id})
        
        print(f"✅ Comment deleted: {comment_id}")
        return {"status": "success"}
    except Exception as e:
        print(f"⚠️ Failed to delete comment: {str(e)}")
        return {"status": "error", "message": str(e)}