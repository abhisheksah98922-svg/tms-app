from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List
from datetime import date

from app.core.db import get_db

router = APIRouter()


class FuelEntryCreate(BaseModel):
    vehicle_id: int
    driver_id: int
    liters: float
    rate_per_liter: float
    total_cost: float
    odometer_km: float
    entry_date: date


class MaintenanceRecordCreate(BaseModel):
    vehicle_id: int
    description: str
    cost: float
    maintenance_date: date


@router.get("/fuel", summary="List Fuel Entries")
async def list_fuel_entries(db: AsyncSession = Depends(get_db)):
    return [
        {
            "id": 1,
            "vehicle_reg_no": "MH-04-JK-9821",
            "driver_name": "Ramesh Kumar",
            "liters": 150.0,
            "rate_per_liter": 93.5,
            "total_cost": 14025.0,
            "odometer_km": 42500.0,
            "entry_date": "2026-07-22"
        },
        {
            "id": 2,
            "vehicle_reg_no": "MH-12-PQ-4510",
            "driver_name": "Suresh Yadav",
            "liters": 210.0,
            "rate_per_liter": 94.0,
            "total_cost": 19740.0,
            "odometer_km": 68100.0,
            "entry_date": "2026-07-25"
        }
    ]


@router.get("/maintenance", summary="List Maintenance Records")
async def list_maintenance(db: AsyncSession = Depends(get_db)):
    return [
        {
            "id": 1,
            "vehicle_reg_no": "MH-43-BB-1102",
            "description": "Engine Oil Replacement & Clutch Disc Adjustment",
            "cost": 12500.0,
            "maintenance_date": "2026-07-20"
        }
    ]
