# auth_router.py
from fastapi import APIRouter, Form
from db_manager import register_user, validate_login

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
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
    return result


@router.post("/login")
async def login_user_route(
    police_id: str = Form(...),
    password: str = Form(...)
):
    result = validate_login(police_id, password)
    return result