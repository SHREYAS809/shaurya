from fastapi import APIRouter, HTTPException, Header, Depends
from supabase_client import supabase
from pydantic import BaseModel
from typing import List, Optional
from utils.whatsapp import send_whatsapp_notification, get_status_message

router = APIRouter(prefix="/orders", tags=["Orders"])

class OrderItem(BaseModel):
    medicine_id: int
    quantity: int
    price: float

class OrderCreate(BaseModel):
    user_id: str
    items: List[OrderItem]
    total_amount: float
    phone: str
    customer_name: str

class OrderStatusUpdate(BaseModel):
    status: str


@router.post("/")
async def create_order(order: OrderCreate):
    try:
        # 1. Create Order entry
        order_response = supabase.table("orders").insert({
            "user_id": order.user_id,
            "total_amount": order.total_amount,
            "status": "New",
            "phone": order.phone
        }).execute()
        
        if not order_response.data:
            raise HTTPException(status_code=500, detail="Failed to create order")
            
        order_id = order_response.data[0]["id"]

        # 2. Create Order Items
        items_data = [
            {
                "order_id": order_id,
                "medicine_id": item.medicine_id,
                "quantity": item.quantity,
                "price_at_purchase": item.price
            } for item in order.items
        ]
        
        items_response = supabase.table("order_items").insert(items_data).execute()
        
        # 3. Send WhatsApp Notification
        msg = get_status_message(order.customer_name, order_id, "New")
        send_whatsapp_notification(order.phone, msg)
        
        return {"order_id": order_id, "message": "Order placed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_all_orders():
    try:
        response = supabase.table("orders").select("*, order_items(*)").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}")
async def get_user_orders(user_id: str):
    try:
        response = supabase.table("orders").select("*, order_items(*)").eq("user_id", user_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{order_id}/status")
async def update_order_status(order_id: str, update: OrderStatusUpdate):
    try:
        # Fetch order directly (no profiles table in schema)
        order_query = supabase.table("orders").select("*").eq("id", order_id).execute()
        if not order_query.data:
            raise HTTPException(status_code=404, detail="Order not found")

        order_data = order_query.data[0]
        phone = order_data.get("phone")
        customer_name = "Customer"

        # Update status
        response = supabase.table("orders").update({"status": update.status}).eq("id", order_id).execute()

        # Send WhatsApp notification
        if phone:
            msg = get_status_message(customer_name, order_id, update.status)
            send_whatsapp_notification(phone, msg)

        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

