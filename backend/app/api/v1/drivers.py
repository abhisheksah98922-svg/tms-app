from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List

from app.core.db import get_db
from app.models.domain import Driver, DriverWallet
from app.schemas.domain import DriverCreate, DriverOut, DriverWalletOut

router = APIRouter()


@router.get("", response_model=List[DriverOut])
async def list_drivers(company_id: int = 1, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Driver).where(Driver.company_id == company_id))
    drivers = result.scalars().all()

    driver_out_list = []
    for d in drivers:
        # Calculate wallet balance (CREDIT - DEBIT)
        wallet_res = await db.execute(
            select(
                func.coalesce(func.sum(DriverWallet.amount), 0.0)
            ).where(DriverWallet.driver_id == d.id)
        )
        balance = wallet_res.scalar() or 0.0

        d_dict = DriverOut.model_validate(d)
        d_dict.wallet_balance = balance
        driver_out_list.append(d_dict)

    return driver_out_list


@router.post("", response_model=DriverOut, status_code=status.HTTP_201_CREATED)
async def create_driver(payload: DriverCreate, company_id: int = 1, db: AsyncSession = Depends(get_db)):
    driver = Driver(company_id=company_id, **payload.model_dump())
    db.add(driver)
    await db.commit()
    await db.refresh(driver)

    d_out = DriverOut.model_validate(driver)
    d_out.wallet_balance = 0.0
    return d_out


@router.get("/{driver_id}/wallet", response_model=List[DriverWalletOut])
async def get_driver_wallet(driver_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(DriverWallet).where(DriverWallet.driver_id == driver_id).order_by(DriverWallet.created_at.desc())
    )
    entries = result.scalars().all()
    return [DriverWalletOut.model_validate(e) for e in entries]
