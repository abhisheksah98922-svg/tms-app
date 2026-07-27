from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from app.core.config import settings
from app.core.logging import setup_logging
from app.core.db import engine, Base, AsyncSessionLocal
from app.api.v1.router import api_router
from app.models.domain import User

setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.on_event("startup")
async def on_startup():
    # Ensure database schema exists
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Auto-seed if database is empty
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User))
        user = result.scalars().first()
        if not user:
            from seed import seed_data
            try:
                await seed_data()
            except Exception as e:
                print(f"Auto-seed exception: {e}")


@app.get("/", summary="Root Endpoint")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "environment": settings.ENV,
        "docs": "/docs"
    }
