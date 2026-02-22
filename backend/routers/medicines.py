from fastapi import APIRouter, HTTPException, Query
from supabase_client import supabase
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/medicines", tags=["Medicines"])

class MedicineCreate(BaseModel):
    name: str
    category_id: int
    price: float
    stock: int
    description: Optional[str] = None
    image_url: Optional[str] = None

class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

@router.get("/")
async def get_medicines(
    category: Optional[str] = None,
    search: Optional[str] = None
):
    try:
        query = supabase.table("medicines").select("*, categories(name)")
        
        if category:
            query = query.eq("category_id", category)
        if search:
            query = query.ilike("name", f"%{search}%")
            
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
async def create_medicine(medicine: MedicineCreate):
    try:
        response = supabase.table("medicines").insert(medicine.dict()).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{medicine_id}")
async def get_medicine(medicine_id: int):
    try:
        response = supabase.table("medicines").select("*").eq("id", medicine_id).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Medicine not found")
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{medicine_id}")
async def update_medicine(medicine_id: int, medicine: MedicineUpdate):
    try:
        response = supabase.table("medicines").update(medicine.dict(exclude_unset=True)).eq("id", medicine_id).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{medicine_id}")
async def delete_medicine(medicine_id: int):
    try:
        supabase.table("medicines").delete().eq("id", medicine_id).execute()
        return {"message": "Medicine deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
