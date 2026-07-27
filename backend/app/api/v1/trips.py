from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.db import get_db
from app.models.domain import Trip, Vehicle, Driver, Customer, TripStatus
from app.schemas.domain import TripCreate, TripOut

router = APIRouter()


async def build_trip_out(trip: Trip, db: AsyncSession) -> TripOut:
    t_out = TripOut.model_validate(trip)
    t_out.total_expenses = trip.total_expenses
    t_out.net_profit = trip.net_profit

    # Fetch vehicle reg_no, driver name, customer name
    v_res = await db.execute(select(Vehicle).where(Vehicle.id == trip.vehicle_id))
    v = v_res.scalar_one_or_none()
    if v:
        t_out.vehicle_reg_no = v.reg_no

    d_res = await db.execute(select(Driver).where(Driver.id == trip.driver_id))
    d = d_res.scalar_one_or_none()
    if d:
        t_out.driver_name = d.name

    c_res = await db.execute(select(Customer).where(Customer.id == trip.customer_id))
    c = c_res.scalar_one_or_none()
    if c:
        t_out.customer_name = c.name

    return t_out


@router.get("", response_model=List[TripOut])
async def list_trips(company_id: int = 1, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trip).where(Trip.company_id == company_id).order_by(Trip.created_at.desc()))
    trips = result.scalars().all()

    trip_list = []
    for t in trips:
        trip_list.append(await build_trip_out(t, db))
    return trip_list


@router.post("", response_model=TripOut, status_code=status.HTTP_201_CREATED)
async def create_trip(payload: TripCreate, company_id: int = 1, db: AsyncSession = Depends(get_db)):
    trip = Trip(company_id=company_id, **payload.model_dump())
    db.add(trip)
    await db.commit()
    await db.refresh(trip)
    return await build_trip_out(trip, db)


@router.patch("/{trip_id}/status", response_model=TripOut)
async def update_trip_status(trip_id: int, new_status: str, company_id: int = 1, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trip).where(Trip.id == trip_id, Trip.company_id == company_id))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    trip.status = new_status
    await db.commit()
    await db.refresh(trip)
    return await build_trip_out(trip, db)
