from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import shutil
import os
import json
from models_engine import run_inference
from model_registry import load_models
from db_manager import (
    register_user, validate_login,
    create_community_post, fetch_community_posts, get_community_post, delete_community_post,
    like_post, unlike_post, check_if_liked,
    add_comment_to_post, get_post_comments, delete_comment
)
from document_analyzer import process_uploaded_document


# ----------------------- PYDANTIC MODELS -----------------------
class CreatePostRequest(BaseModel):
    user_id: int
    author_name: str
    district: str
    category: str
    content: str


class AddCommentRequest(BaseModel):
    user_id: int
    author_name: str
    content: str

app = FastAPI(title="Hack4Safety AI Backend", version="2.2")

# ----------------------- CORS -----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # (Adjust to frontend origin if needed)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------- STATIC FILES -----------------------
app.mount(
    "/graphs",
    StaticFiles(directory="C:/Users/SAPTARSHI MONDAL/Copsight/copsight-police-app/fol1/generated_graphs"),
    name="graphs",
)

# ----------------------- MODEL LOAD -----------------------
@app.on_event("startup")
def startup_event():
    load_models("C:/Users/SAPTARSHI MONDAL/Copsight/copsight-police-app/fol1/saved_models")
    print("✅ Models loaded successfully!")


# ----------------------- AUTH: REGISTER -----------------------
@app.post("/auth/register")
async def register_user_route(
    full_name: str = Form(...),
    police_id: str = Form(...),
    email: str = Form(...),
    mobile: str = Form(...),
    password: str = Form(...),
    rank: str = Form(...),
    district: str = Form(...),
    terms_accepted: str = Form(...)
):
    try:
        data = {
            "full_name": full_name,
            "police_id": police_id,
            "email": email,
            "mobile": mobile,
            "password": password,
            "rank": rank,
            "district": district,
            "terms_accepted": terms_accepted.lower() == "true",
        }

        result = register_user(data)
        return {"status": "success", "message": "User registered successfully", "details": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


# ----------------------- AUTH: LOGIN -----------------------
@app.post("/auth/login")
async def login_user_route(
    police_id: str = Form(...),
    password: str = Form(...)
):
    try:
        result = validate_login(police_id, password)
        if not result.get("status") == "success":
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {"status": "success", "message": "Login successful", "user": result.get("user")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


# ----------------------- PREDICTION -----------------------
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    """
    Predict from uploaded CSV file.
    Works for both:
    - Full datasets (multi-row CSVs)
    - Single-row datasets (one record)
    """
    temp_path = f"temp_{file.filename}"
    try:
        # --- Save temporary uploaded CSV ---
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # --- Run model inference ---
        result = run_inference(temp_path)

        # --- Build response ---
        result["file_name"] = file.filename
        result["status"] = "success"
        result["mode"] = "single_row" if len(result.get("predictions", [])) == 1 else "batch_csv"
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # --- Clean up temporary file ---
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/analyze_case_document/")
async def analyze_case_document(file: UploadFile = File(...)):
    """
    Upload a police case document (PDF, TXT, or Image).
    Extracts text and performs AI-based legal analysis.
    """
    allowed_exts = [".pdf", ".txt", ".jpg", ".jpeg", ".png"]
    if not any(file.filename.lower().endswith(ext) for ext in allowed_exts):
        raise HTTPException(status_code=400, detail="Only PDF, TXT, and image files are supported.")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")

    result = process_uploaded_document(file_bytes, file.filename)
    return result


# ----------------------- COMMUNITY POSTS -----------------------

@app.post("/community/posts/create")
async def create_post(request: CreatePostRequest):
    """Create a new community post."""
    try:
        result = create_community_post(
            user_id=request.user_id,
            author_name=request.author_name,
            district=request.district,
            category=request.category,
            content=request.content
        )
        if result.get("status") == "success":
            return {"status": "success", "data": result.get("post")}
        else:
            raise HTTPException(status_code=400, detail=result.get("message"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/community/posts")
async def get_posts(limit: int = 20, offset: int = 0):
    """Fetch all community posts with pagination."""
    try:
        posts = fetch_community_posts(limit=limit, offset=offset)
        return {"status": "success", "data": posts, "count": len(posts)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/community/posts/{post_id}")
async def get_single_post(post_id: int):
    """Fetch a single community post with comments."""
    try:
        post = get_community_post(post_id)
        if post:
            return {"status": "success", "data": post}
        else:
            raise HTTPException(status_code=404, detail="Post not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/community/posts/{post_id}")
async def remove_post(post_id: int, user_id: int):
    """Delete a community post (only by creator)."""
    try:
        result = delete_community_post(post_id, user_id)
        if result.get("status") == "success":
            return {"status": "success", "message": "Post deleted"}
        else:
            raise HTTPException(status_code=403, detail=result.get("message"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ----------------------- COMMUNITY LIKES -----------------------

@app.post("/community/posts/{post_id}/like")
async def like_community_post(post_id: int, user_id: int):
    """Like a community post."""
    try:
        result = like_post(post_id, user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/community/posts/{post_id}/unlike")
async def unlike_community_post(post_id: int, user_id: int):
    """Unlike a community post."""
    try:
        result = unlike_post(post_id, user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/community/posts/{post_id}/liked")
async def is_liked(post_id: int, user_id: int):
    """Check if user has liked a post."""
    try:
        liked = check_if_liked(post_id, user_id)
        return {"status": "success", "liked": liked}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ----------------------- COMMUNITY COMMENTS -----------------------

@app.post("/community/posts/{post_id}/comments")
async def add_comment(post_id: int, request: AddCommentRequest):
    """Add a comment to a post."""
    try:
        result = add_comment_to_post(
            post_id=post_id,
            user_id=request.user_id,
            author_name=request.author_name,
            content=request.content
        )
        if result.get("status") == "success":
            return {"status": "success", "data": result.get("comment")}
        else:
            raise HTTPException(status_code=400, detail=result.get("message"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/community/posts/{post_id}/comments")
async def get_comments(post_id: int, limit: int = 50):
    """Fetch all comments for a post."""
    try:
        comments = get_post_comments(post_id, limit=limit)
        return {"status": "success", "data": comments, "count": len(comments)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/community/comments/{comment_id}")
async def remove_comment(comment_id: int, user_id: int):
    """Delete a comment (only by creator)."""
    try:
        result = delete_comment(comment_id, user_id)
        if result.get("status") == "success":
            return {"status": "success", "message": "Comment deleted"}
        else:
            raise HTTPException(status_code=403, detail=result.get("message"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ----------------------- ROOT TEST -----------------------
@app.get("/")
async def root():
    return {"message": "🚓 Hack4Safety AI Backend running successfully."}