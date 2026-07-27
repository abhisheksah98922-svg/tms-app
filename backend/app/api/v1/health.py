from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import redis.asyncio as redis
from datetime import datetime

from app.core.db import get_db
from app.core.redis import get_redis

router = APIRouter()


@router.get("/health", summary="Health Check")
async def health_check(
    db: AsyncSession = Depends(get_db),
    redis_conn: redis.Redis = Depends(get_redis)
):
    postgres_status = "error"
    redis_status = "error"

    # Test PostgreSQL
    try:
        result = await db.execute(text("SELECT 1"))
        if result.scalar() == 1:
            postgres_status = "connected"
    except Exception as e:
        postgres_status = f"error: {str(e)}"

    # Test Redis
    try:
        if await redis_conn.ping():
            redis_status = "connected"
    except Exception as e:
        redis_status = f"error: {str(e)}"

    overall_healthy = (postgres_status == "connected" and redis_status == "connected")

    response_data = {
        "status": "ok" if overall_healthy else "degraded",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "services": {
            "postgres": postgres_status,
            "redis": redis_status
        }
    }

    if not overall_healthy:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=response_data
        )

    return response_data
