from fastapi import APIRouter, HTTPException
from supabase_client import supabase
from datetime import datetime, timezone

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard-stats")
async def get_dashboard_stats():
    try:
        errors = []

        # 1. Total Revenue (sum of Completed orders)
        try:
            revenue_response = supabase.table("orders").select("total_amount").eq("status", "Completed").execute()
            total_revenue = sum(item["total_amount"] for item in (revenue_response.data or []))
        except Exception as e:
            errors.append(f"revenue: {e}")
            total_revenue = 0

        # 2. Orders Today
        try:
            today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
            orders_today_response = supabase.table("orders").select("id", count="exact").gte("created_at", today.isoformat()).execute()
            orders_today = orders_today_response.count if orders_today_response.count is not None else 0
        except Exception as e:
            errors.append(f"orders_today: {e}")
            orders_today = 0

        # 3. Active Products
        try:
            active_products_response = supabase.table("medicines").select("id", count="exact").gt("stock", 0).execute()
            active_products = active_products_response.count if active_products_response.count is not None else 0
        except Exception as e:
            errors.append(f"active_products: {e}")
            active_products = 0

        # 4. Total Customers — try admin API, fallback to unique user_ids from orders
        total_customers = 0
        try:
            users_response = supabase.auth.admin.list_users()
            for user in users_response:
                metadata = getattr(user, 'user_metadata', {})
                role = metadata.get('role') if isinstance(metadata, dict) else getattr(metadata, 'role', None)
                if role != 'admin':
                    total_customers += 1
        except Exception as e:
            errors.append(f"customers_admin_api: {e}")
            # Fallback: count unique user_ids from orders table
            try:
                all_orders = supabase.table("orders").select("user_id").execute()
                unique_users = {o["user_id"] for o in (all_orders.data or []) if o.get("user_id")}
                total_customers = len(unique_users)
            except Exception as e2:
                errors.append(f"customers_fallback: {e2}")
                total_customers = 0

        if errors:
            print(f"[Analytics] Non-fatal errors: {errors}")

        return {
            "totalRevenue": f"₹{total_revenue:,.0f}",
            "ordersToday": orders_today,
            "activeProducts": active_products,
            "totalCustomers": total_customers
        }
    except Exception as e:
        print(f"[Analytics] Fatal error in dashboard-stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/recent-activity")
async def get_recent_activity():
    try:
        response = supabase.table("orders").select("id, total_amount, status, created_at, user_id").order("created_at", desc=True).limit(5).execute()

        recent_orders = []
        for order in (response.data or []):
            try:
                date_str = datetime.fromisoformat(order["created_at"].replace('Z', '+00:00')).strftime("%b %d")
            except Exception:
                date_str = "N/A"

            recent_orders.append({
                "id": str(order["id"])[:8].upper(),
                "customer": "Customer",
                "amount": f"₹{order['total_amount']}",
                "status": order["status"],
                "date": date_str
            })

        return recent_orders
    except Exception as e:
        print(f"[Analytics] Error in recent-activity: {e}")
        raise HTTPException(status_code=500, detail=str(e))
