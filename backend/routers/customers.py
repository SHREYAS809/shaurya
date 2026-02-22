from fastapi import APIRouter, HTTPException
from supabase_client import supabase
from typing import List

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("/")
async def get_customers():
    try:
        # Use Supabase Admin API to list users
        # Note: This requires the service_role key which should be configured in supabase_client.py
        response = supabase.auth.admin.list_users()
        
        # Filter users who are not admins
        customers = []
        for user in response:
            metadata = getattr(user, 'user_metadata', {})
            # If metadata is a dict-like object (depending on supabase-py version)
            if isinstance(metadata, dict):
                role = metadata.get('role')
                name = metadata.get('full_name', 'Unknown User')
                phone = metadata.get('phone', 'N/A')
            else:
                # Handle cases where user_metadata might be an object
                role = getattr(metadata, 'role', None)
                name = getattr(metadata, 'full_name', 'Unknown User')
                phone = getattr(metadata, 'phone', 'N/A')

            if role != 'admin':
                customers.append({
                    "id": user.id,
                    "email": user.email,
                    "name": name,
                    "phone": phone,
                    "created_at": user.created_at,
                    "last_sign_in_at": user.last_sign_in_at
                })
        
        return customers
    except Exception as e:
        print(f"Error fetching customers: {e}")
        raise HTTPException(status_code=500, detail=str(e))
