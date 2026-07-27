from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.db import get_db
from app.models.domain import Vehicle
from app.schemas.domain import VehicleCreate, VehicleOut

router = APIRouter()


@router.get("", response_model=List[VehicleOut])
async def list_vehicles(company_id: int = 1, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.company_id == company_id))
    vehicles = result.scalars().all()
    return [VehicleOut.model_validate(v) for v in vehicles]


@router.post("", response_model=VehicleOut, status_code=status.HTTP_201_CREATED)
async def create_vehicle(payload: VehicleCreate, company_id: int = 1, db: AsyncSession = Depends(get_db)):
    vehicle = Vehicle(company_id=company_id, **payload.model_dump())
    db.add(vehicle)
    await db.commit()
    await db.refresh(vehicle)
    return VehicleOut.model_validate(vehicle)


@router.get("/{vehicle_id}", response_model=VehicleOut)
async def get_vehicle(vehicle_id: int, company_id: int = 1, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id, Vehicle.company_id == company_id))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return VehicleOut.model_validate(vehicle)
