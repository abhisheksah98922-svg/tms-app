from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import csv
import io

from app.core.db import get_db
from app.models.domain import Trip, Invoice

router = APIRouter()


@router.get("/export/trips", summary="Export Trips CSV Report")
async def export_trips_csv(company_id: int = 1, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trip).where(Trip.company_id == company_id))
    trips = result.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Trip No", "Origin", "Destination", "Freight Rate", "Total Expenses", "Net Profit", "Status"])

    for t in trips:
        writer.writerow([t.trip_no, t.origin, t.destination, t.freight_rate, t.total_expenses, t.net_profit, t.status])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=trips_report.csv"}
    )
