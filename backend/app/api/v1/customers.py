from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List

from app.core.db import get_db
from app.models.domain import Customer, Invoice, Payment
from app.schemas.domain import CustomerCreate, CustomerOut

router = APIRouter()


@router.get("", response_model=List[CustomerOut])
async def list_customers(company_id: int = 1, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Customer).where(Customer.company_id == company_id))
    customers = result.scalars().all()

    customer_out_list = []
    for c in customers:
        # Calculate total billed total_amount - total payments received
        inv_res = await db.execute(
            select(func.coalesce(func.sum(Invoice.total_amount), 0.0)).where(Invoice.customer_id == c.id)
        )
        total_billed = inv_res.scalar() or 0.0

        pay_res = await db.execute(
            select(func.coalesce(func.sum(Payment.amount), 0.0))
            .join(Invoice, Payment.invoice_id == Invoice.id)
            .where(Invoice.customer_id == c.id)
        )
        total_paid = pay_res.scalar() or 0.0

        outstanding = max(0.0, total_billed - total_paid)

        c_out = CustomerOut.model_validate(c)
        c_out.computed_outstanding = outstanding
        customer_out_list.append(c_out)

    return customer_out_list


@router.post("", response_model=CustomerOut, status_code=status.HTTP_201_CREATED)
async def create_customer(payload: CustomerCreate, company_id: int = 1, db: AsyncSession = Depends(get_db)):
    customer = Customer(company_id=company_id, **payload.model_dump())
    db.add(customer)
    await db.commit()
    await db.refresh(customer)

    c_out = CustomerOut.model_validate(customer)
    c_out.computed_outstanding = 0.0
    return c_out
