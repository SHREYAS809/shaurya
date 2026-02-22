from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

from routers import categories, medicines, orders, auth, customers, analytics

app = FastAPI(title="Sri Shaurya Medicals API")

# Register routers
app.include_router(categories.router)
app.include_router(medicines.router)
app.include_router(orders.router)
app.include_router(auth.router)
app.include_router(customers.router)
app.include_router(analytics.router)

# CORS — allow localhost in dev, Vercel domain in production
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Sri Shaurya Medicals Backend API is operational"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
