import asyncio
from datetime import date, datetime, timedelta
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import engine, Base, AsyncSessionLocal
from app.models.domain import (
    Company, Branch, User, Vehicle, Driver, DriverWallet, Customer,
    Trip, Invoice, Payment, VehicleStatus, DriverStatus, TripStatus, InvoiceStatus
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def seed_data():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        print("Seeding TMS Database...")

        # 1. Company
        company = Company(
            name="Apex Logistics India Pvt Ltd",
            state_code="27",
            state_name="Maharashtra",
            gstin="27AAACA1234A1Z5",
            address="Plot 42, Logistics Park, Bhiwandi, Thane, Maharashtra - 421302"
        )
        session.add(company)
        await session.flush()

        # 2. Branches
        b1 = Branch(company_id=company.id, name="Mumbai Central HQ", city="Mumbai")
        b2 = Branch(company_id=company.id, name="Pune Express Hub", city="Pune")
        session.add_all([b1, b2])
        await session.flush()

        # 3. Users (Admin, Fleet Manager, Accountant)
        hashed_pwd = pwd_context.hash("admin123")
        u_admin = User(
            company_id=company.id,
            branch_id=b1.id,
            email="admin@apexlogistics.in",
            hashed_password=hashed_pwd,
            full_name="Rajesh Sharma",
            role="ADMIN"
        )
        u_fleet = User(
            company_id=company.id,
            branch_id=b1.id,
            email="fleet@apexlogistics.in",
            hashed_password=hashed_pwd,
            full_name="Venkatesh Rao",
            role="FLEET_MANAGER"
        )
        u_acct = User(
            company_id=company.id,
            branch_id=b2.id,
            email="accountant@apexlogistics.in",
            hashed_password=hashed_pwd,
            full_name="Priya Patel",
            role="ACCOUNTANT"
        )
        session.add_all([u_admin, u_fleet, u_acct])

        # 4. Vehicles (3 vehicles - 1 Available, 1 In Transit, 1 Maintenance)
        v1 = Vehicle(
            company_id=company.id,
            reg_no="MH-04-JK-9821",
            vehicle_type="Container 32ft MX",
            capacity_tons=15.0,
            status=VehicleStatus.IN_TRANSIT.value,
            fitness_expiry=date.today() + timedelta(days=180),
            insurance_expiry=date.today() + timedelta(days=90)
        )
        v2 = Vehicle(
            company_id=company.id,
            reg_no="MH-12-PQ-4510",
            vehicle_type="10 Wheeler Open Body",
            capacity_tons=20.0,
            status=VehicleStatus.AVAILABLE.value,
            fitness_expiry=date.today() + timedelta(days=240),
            insurance_expiry=date.today() + timedelta(days=120)
        )
        v3 = Vehicle(
            company_id=company.id,
            reg_no="MH-43-BB-1102",
            vehicle_type="Trailer 40ft Multi-Axle",
            capacity_tons=30.0,
            status=VehicleStatus.MAINTENANCE.value,
            fitness_expiry=date.today() + timedelta(days=30),
            insurance_expiry=date.today() + timedelta(days=15)
        )
        session.add_all([v1, v2, v3])
        await session.flush()

        # 5. Drivers (3 drivers)
        d1 = Driver(
            company_id=company.id,
            name="Ramesh Kumar",
            phone="+91 98765 43210",
            license_no="MH-04-201800987",
            license_expiry=date.today() + timedelta(days=365),
            salary_monthly=28000.0,
            status=DriverStatus.ON_TRIP.value
        )
        d2 = Driver(
            company_id=company.id,
            name="Suresh Yadav",
            phone="+91 98123 45678",
            license_no="MH-12-201600456",
            license_expiry=date.today() + timedelta(days=500),
            salary_monthly=26000.0,
            status=DriverStatus.AVAILABLE.value
        )
        d3 = Driver(
            company_id=company.id,
            name="Anil Singh",
            phone="+91 99887 76655",
            license_no="MH-43-202000123",
            license_expiry=date.today() + timedelta(days=200),
            salary_monthly=25000.0,
            status=DriverStatus.ON_LEAVE.value
        )
        session.add_all([d1, d2, d3])
        await session.flush()

        # Driver Wallet initial credit
        session.add(DriverWallet(driver_id=d1.id, transaction_type="CREDIT", amount=5000.0, description="Advance trip allocation"))

        # 6. Customers (1 same-state MH, 1 cross-state GJ)
        c1 = Customer(
            company_id=company.id,
            name="Reliance Retail Ltd",
            phone="+91 22 6789 0000",
            email="logistics@relianceretail.com",
            gstin="27AAACR5432A1Z9",
            state_code="27",
            state_name="Maharashtra",
            address="BKC, Bandra East, Mumbai, Maharashtra",
            credit_days=30,
            credit_limit=1000000.0
        )
        c2 = Customer(
            company_id=company.id,
            name="Adani Ports & SEZ Ltd",
            phone="+91 79 2656 5555",
            email="billing@adaniports.com",
            gstin="24AAACA5678B1Z2",
            state_code="24",
            state_name="Gujarat",
            address="Mundra Port, Kutch, Gujarat",
            credit_days=45,
            credit_limit=1500000.0
        )
        session.add_all([c1, c2])
        await session.flush()

        # 7. Trips (5 trips covering all statuses)
        t1 = Trip(
            company_id=company.id,
            trip_no="TRIP-2026-001",
            vehicle_id=v1.id,
            driver_id=d1.id,
            customer_id=c1.id,
            origin="Bhiwandi, MH",
            destination="Pune, MH",
            goods_description="FMCG Retail Cartons",
            start_date=date.today() - timedelta(days=5),
            end_date=date.today() - timedelta(days=3),
            status=TripStatus.COMPLETED.value,
            freight_rate=45000.0,
            fuel_cost=14000.0,
            toll_cost=2200.0,
            police_cost=500.0,
            loading_cost=1500.0,
            unloading_cost=1500.0,
            labour_cost=1000.0,
            other_cost=300.0,
            driver_salary_alloc=4000.0
        )
        t2 = Trip(
            company_id=company.id,
            trip_no="TRIP-2026-002",
            vehicle_id=v1.id,
            driver_id=d1.id,
            customer_id=c2.id,
            origin="Mumbai, MH",
            destination="Mundra, GJ",
            goods_description="Heavy Industrial Equipment",
            start_date=date.today() - timedelta(days=2),
            end_date=None,
            status=TripStatus.IN_TRANSIT.value,
            freight_rate=85000.0,
            fuel_cost=32000.0,
            toll_cost=4500.0,
            police_cost=1000.0,
            loading_cost=3000.0,
            unloading_cost=0.0,
            labour_cost=2000.0,
            other_cost=500.0,
            driver_salary_alloc=7000.0
        )
        t3 = Trip(
            company_id=company.id,
            trip_no="TRIP-2026-003",
            vehicle_id=v2.id,
            driver_id=d2.id,
            customer_id=c1.id,
            origin="Nagpur, MH",
            destination="Mumbai, MH",
            goods_description="Agricultural Grains",
            start_date=date.today() + timedelta(days=1),
            end_date=None,
            status=TripStatus.DISPATCHED.value,
            freight_rate=62000.0,
            fuel_cost=20000.0,
            toll_cost=3100.0,
            police_cost=400.0,
            loading_cost=2000.0,
            unloading_cost=0.0,
            labour_cost=1500.0,
            other_cost=200.0,
            driver_salary_alloc=5000.0
        )
        t4 = Trip(
            company_id=company.id,
            trip_no="TRIP-2026-004",
            vehicle_id=v2.id,
            driver_id=d2.id,
            customer_id=c2.id,
            origin="Surat, GJ",
            destination="Nashik, MH",
            goods_description="Textile Rolls",
            start_date=date.today() + timedelta(days=3),
            end_date=None,
            status=TripStatus.DRAFT.value,
            freight_rate=38000.0,
            fuel_cost=11000.0,
            toll_cost=1800.0,
            police_cost=0.0,
            loading_cost=1200.0,
            unloading_cost=0.0,
            labour_cost=1000.0,
            other_cost=0.0,
            driver_salary_alloc=3000.0
        )
        t5 = Trip(
            company_id=company.id,
            trip_no="TRIP-2026-005",
            vehicle_id=v3.id,
            driver_id=d3.id,
            customer_id=c1.id,
            origin="Thane, MH",
            destination="Kolhapur, MH",
            goods_description="Steel Coils",
            start_date=date.today() - timedelta(days=10),
            end_date=date.today() - timedelta(days=9),
            status=TripStatus.CANCELLED.value,
            freight_rate=50000.0,
            fuel_cost=3000.0,
            toll_cost=500.0,
            police_cost=0.0,
            loading_cost=0.0,
            unloading_cost=0.0,
            labour_cost=0.0,
            other_cost=0.0,
            driver_salary_alloc=1000.0
        )
        session.add_all([t1, t2, t3, t4, t5])
        await session.flush()

        # 8. Invoices (2 invoices: 1 Paid same-state CGST+SGST, 1 Partial cross-state IGST)
        # Invoice 1: Same State (MH to MH) -> CGST 6% + SGST 6% (or 2.5% + 2.5% for GTA)
        inv1_taxable = 45000.0
        inv1_cgst = inv1_taxable * 0.06
        inv1_sgst = inv1_taxable * 0.06
        inv1_total = inv1_taxable + inv1_cgst + inv1_sgst

        inv1 = Invoice(
            company_id=company.id,
            trip_id=t1.id,
            customer_id=c1.id,
            invoice_no="INV-2026-0001",
            invoice_date=date.today() - timedelta(days=3),
            hsn_sac="996511",
            taxable_value=inv1_taxable,
            cgst_rate=6.0,
            cgst_amount=inv1_cgst,
            sgst_rate=6.0,
            sgst_amount=inv1_sgst,
            igst_rate=0.0,
            igst_amount=0.0,
            total_amount=inv1_total,
            status=InvoiceStatus.PAID.value
        )

        # Invoice 2: Cross State (MH to GJ) -> IGST 12%
        inv2_taxable = 85000.0
        inv2_igst = inv2_taxable * 0.12
        inv2_total = inv2_taxable + inv2_igst

        inv2 = Invoice(
            company_id=company.id,
            trip_id=t2.id,
            customer_id=c2.id,
            invoice_no="INV-2026-0002",
            invoice_date=date.today() - timedelta(days=1),
            hsn_sac="996511",
            taxable_value=inv2_taxable,
            cgst_rate=0.0,
            cgst_amount=0.0,
            sgst_rate=0.0,
            sgst_amount=0.0,
            igst_rate=12.0,
            igst_amount=inv2_igst,
            total_amount=inv2_total,
            status=InvoiceStatus.PARTIAL.value
        )
        session.add_all([inv1, inv2])
        await session.flush()

        # 9. Payments (Full payment for INV-0001, Partial payment for INV-0002)
        p1 = Payment(
            company_id=company.id,
            invoice_id=inv1.id,
            payment_no="PAY-2026-0001",
            payment_date=date.today() - timedelta(days=2),
            amount=inv1_total,
            method="BANK_TRANSFER",
            reference_no="NEFT-HDFC98765432"
        )
        p2 = Payment(
            company_id=company.id,
            invoice_id=inv2.id,
            payment_no="PAY-2026-0002",
            payment_date=date.today(),
            amount=50000.0,
            method="UPI",
            reference_no="UPI-7890123456"
        )
        session.add_all([p1, p2])

        await session.commit()
        print("Database Seeding Completed Successfully!")


if __name__ == "__main__":
    asyncio.run(seed_data())
