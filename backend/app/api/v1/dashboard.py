from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List

from app.core.db import get_db
from app.models.domain import Trip, Vehicle, Invoice, Payment, VehicleStatus
from app.schemas.domain import DashboardOut, TripOut
from app.api.v1.trips import build_trip_out

router = APIRouter()


@router.get("", response_model=DashboardOut)
async def get_dashboard_summary(company_id: int = 1, db: AsyncSession = Depends(get_db)):
    # 1. Total revenue & trips
    trips_res = await db.execute(select(Trip).where(Trip.company_id == company_id))
    trips = trips_res.scalars().all()

    total_revenue = sum(t.freight_rate for t in trips if t.status != "CANCELLED")
    total_net_profit = sum(t.net_profit for t in trips if t.status != "CANCELLED")
    total_trips = len(trips)

    # 2. Active vehicles
    veh_res = await db.execute(
        select(func.count(Vehicle.id)).where(
            Vehicle.company_id == company_id,
            Vehicle.status.in_([VehicleStatus.AVAILABLE.value, VehicleStatus.IN_TRANSIT.value])
        )
    )
    active_vehicles = veh_res.scalar() or 0

    # 3. Pending receivables (Billed Invoices Total - Payments Total)
    inv_res = await db.execute(select(func.coalesce(func.sum(Invoice.total_amount), 0.0)).where(Invoice.company_id == company_id))
    total_billed = inv_res.scalar() or 0.0

    pay_res = await db.execute(select(func.coalesce(func.sum(Payment.amount), 0.0)).where(Payment.company_id == company_id))
    total_paid = pay_res.scalar() or 0.0

    pending_receivables = max(0.0, total_billed - total_paid)

    # 4. Recent trips (Top 5)
    recent_trips_res = await db.execute(
        select(Trip).where(Trip.company_id == company_id).order_by(Trip.created_at.desc()).limit(5)
    )
    recent_trips_raw = recent_trips_res.scalars().all()
    recent_trips = []
    for t in recent_trips_raw:
        recent_trips.append(await build_trip_out(t, db))

    return {
        "total_revenue": total_revenue,
        "total_net_profit": total_net_profit,
        "total_trips": total_trips,
        "active_vehicles": active_vehicles,
        "pending_receivables": pending_receivables,
        "recent_trips": recent_trips
    }
