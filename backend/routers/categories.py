from fastapi import APIRouter, HTTPException
from supabase_client import supabase

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("/")
async def get_categories():
    try:
        response = supabase.table("categories").select("*").execute()
        return response.data
    except Exception as e:
        print(f"Error fetching categories: {e}")
        raise HTTPException(status_code=500, detail=str(e))
