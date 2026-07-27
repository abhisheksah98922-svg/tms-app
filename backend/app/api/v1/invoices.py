from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import date
from typing import List

from app.core.db import get_db
from app.models.domain import Invoice, Payment, Customer, Company, Trip, Vehicle, InvoiceStatus
from app.schemas.domain import InvoiceCreate, CustomInvoiceCreate, InvoiceOut, PaymentCreate, PaymentOut

router = APIRouter()


async def build_invoice_out(inv: Invoice, db: AsyncSession) -> InvoiceOut:
    pay_res = await db.execute(
        select(func.coalesce(func.sum(Payment.amount), 0.0)).where(Payment.invoice_id == inv.id)
    )
    paid_sum = pay_res.scalar() or 0.0

    balance = max(0.0, inv.total_amount - paid_sum)
    inv_out = InvoiceOut.model_validate(inv)
    inv_out.paid_amount = paid_sum
    inv_out.balance_due = balance

    c_res = await db.execute(select(Customer).where(Customer.id == inv.customer_id))
    cust = c_res.scalar_one_or_none()
    if cust:
        inv_out.customer_name = cust.name

    t_res = await db.execute(select(Trip).where(Trip.id == inv.trip_id))
    t = t_res.scalar_one_or_none()
    if t:
        inv_out.weight_tons = t.weight_tons
        v_res = await db.execute(select(Vehicle).where(Vehicle.id == t.vehicle_id))
        v = v_res.scalar_one_or_none()
        if v:
            inv_out.vehicle_reg_no = v.reg_no

    return inv_out


@router.get("", response_model=List[InvoiceOut])
async def list_invoices(company_id: int = 1, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Invoice).where(Invoice.company_id == company_id).order_by(Invoice.created_at.desc()))
    invoices = result.scalars().all()

    inv_list = []
    for inv in invoices:
        inv_list.append(await build_invoice_out(inv, db))
    return inv_list


@router.post("/custom", response_model=InvoiceOut, status_code=status.HTTP_201_CREATED)
async def create_custom_invoice(payload: CustomInvoiceCreate, company_id: int = 1, db: AsyncSession = Depends(get_db)):
    # Total freight from all vehicles + demurrage + handling
    sum_freight = sum(vt.freight_amount for vt in payload.vehicle_trips) if payload.vehicle_trips else payload.freight_taxable_value
    taxable = sum_freight + payload.demurrage_charges + payload.handling_charges

    if payload.gst_scheme == "INTRA_STATE":
        cgst_rate = 6.0
        cgst_amount = round(taxable * 0.06, 2)
        sgst_rate = 6.0
        sgst_amount = round(taxable * 0.06, 2)
        igst_rate = 0.0
        igst_amount = 0.0
    elif payload.gst_scheme == "INTER_STATE":
        cgst_rate = 0.0
        cgst_amount = 0.0
        sgst_rate = 0.0
        sgst_amount = 0.0
        igst_rate = 12.0
        igst_amount = round(taxable * 0.12, 2)
    else: # RCM
        cgst_rate = 0.0
        cgst_amount = 0.0
        sgst_rate = 0.0
        sgst_amount = 0.0
        igst_rate = 0.0
        igst_amount = 0.0

    total_amount = round(taxable + cgst_amount + sgst_amount + igst_amount, 2)

    count_res = await db.execute(select(func.count(Invoice.id)).where(Invoice.company_id == company_id))
    inv_count = (count_res.scalar() or 0) + 1
    invoice_no = f"INV-2026-MULTI{inv_count:03d}"

    first_vehicle = payload.vehicle_trips[0].vehicle_reg_no if payload.vehicle_trips else "MULTIPLE"
    total_weight = sum(vt.weight_tons for vt in payload.vehicle_trips) if payload.vehicle_trips else 12.5

    invoice = Invoice(
        company_id=company_id,
        trip_id=1,
        customer_id=1,
        invoice_no=invoice_no,
        invoice_date=date.today(),
        hsn_sac="996511",
        taxable_value=taxable,
        cgst_rate=cgst_rate,
        cgst_amount=cgst_amount,
        sgst_rate=sgst_rate,
        sgst_amount=sgst_amount,
        igst_rate=igst_rate,
        igst_amount=igst_amount,
        total_amount=total_amount,
        status=InvoiceStatus.ISSUED.value
    )
    db.add(invoice)
    await db.commit()
    await db.refresh(invoice)

    inv_out = InvoiceOut.model_validate(invoice)
    inv_out.customer_name = payload.customer_name
    inv_out.vehicle_reg_no = f"{first_vehicle} (+{len(payload.vehicle_trips)-1} vehicles)" if len(payload.vehicle_trips) > 1 else first_vehicle
    inv_out.weight_tons = total_weight
    inv_out.paid_amount = 0.0
    inv_out.balance_due = total_amount
    return inv_out


@router.post("", response_model=InvoiceOut, status_code=status.HTTP_201_CREATED)
async def create_invoice(payload: InvoiceCreate, company_id: int = 1, db: AsyncSession = Depends(get_db)):
    cust_res = await db.execute(select(Customer).where(Customer.id == payload.customer_id))
    customer = cust_res.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    comp_res = await db.execute(select(Company).where(Company.id == company_id))
    company = comp_res.scalar_one_or_none()
    company_state = company.state_code if company else "27"

    count_res = await db.execute(select(func.count(Invoice.id)).where(Invoice.company_id == company_id))
    inv_count = (count_res.scalar() or 0) + 1
    invoice_no = f"INV-2026-{inv_count:04d}"

    taxable = payload.taxable_value
    is_same_state = (customer.state_code == company_state)

    if is_same_state:
        cgst_rate = 6.0
        cgst_amount = round(taxable * 0.06, 2)
        sgst_rate = 6.0
        sgst_amount = round(taxable * 0.06, 2)
        igst_rate = 0.0
        igst_amount = 0.0
    else:
        cgst_rate = 0.0
        cgst_amount = 0.0
        sgst_rate = 0.0
        sgst_amount = 0.0
        igst_rate = 12.0
        igst_amount = round(taxable * 0.12, 2)

    total_amount = round(taxable + cgst_amount + sgst_amount + igst_amount, 2)

    invoice = Invoice(
        company_id=company_id,
        trip_id=payload.trip_id,
        customer_id=payload.customer_id,
        invoice_no=invoice_no,
        invoice_date=date.today(),
        hsn_sac="996511",
        taxable_value=taxable,
        cgst_rate=cgst_rate,
        cgst_amount=cgst_amount,
        sgst_rate=sgst_rate,
        sgst_amount=sgst_amount,
        igst_rate=igst_rate,
        igst_amount=igst_amount,
        total_amount=total_amount,
        status=InvoiceStatus.ISSUED.value
    )
    db.add(invoice)
    await db.commit()
    await db.refresh(invoice)

    return await build_invoice_out(invoice, db)


@router.post("/payments", response_model=PaymentOut, status_code=status.HTTP_201_CREATED)
async def record_payment(payload: PaymentCreate, company_id: int = 1, db: AsyncSession = Depends(get_db)):
    inv_res = await db.execute(select(Invoice).where(Invoice.id == payload.invoice_id, Invoice.company_id == company_id))
    invoice = inv_res.scalar_one_or_none()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    pay_count = await db.execute(select(func.count(Payment.id)).where(Payment.company_id == company_id))
    p_seq = (pay_count.scalar() or 0) + 1
    payment_no = f"PAY-2026-{p_seq:04d}"

    payment = Payment(
        company_id=company_id,
        invoice_id=payload.invoice_id,
        payment_no=payment_no,
        payment_date=date.today(),
        amount=payload.amount,
        method=payload.method,
        reference_no=payload.reference_no
    )
    db.add(payment)
    await db.flush()

    sum_pay = await db.execute(select(func.coalesce(func.sum(Payment.amount), 0.0)).where(Payment.invoice_id == invoice.id))
    total_paid = sum_pay.scalar() or 0.0

    if total_paid >= invoice.total_amount:
        invoice.status = InvoiceStatus.PAID.value
    elif total_paid > 0:
        invoice.status = InvoiceStatus.PARTIAL.value

    await db.commit()
    await db.refresh(payment)
    return PaymentOut.model_validate(payment)
