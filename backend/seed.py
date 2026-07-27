import asyncio
import sys
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import engine, Base, AsyncSessionLocal
from app.models.domain import (
    Company, Branch, User, Vehicle, Driver, DriverWallet, Customer,
    Trip, Invoice, Payment
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def reset_clean_database():
    print("Resetting database to 100% CLEAN state (Removing all dummy sample data)...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Create 1 default clean company for zero-config local testing
        company = Company(
            name="My Transport Company",
            state_code="27",
            state_name="Maharashtra",
            gstin="27AAACA1234A1Z5",
            address="Head Office"
        )
        session.add(company)
        await session.flush()

        branch = Branch(company_id=company.id, name="Main Branch", city="Headquarters")
        session.add(branch)
        await session.flush()

        hashed_pwd = pwd_context.hash("admin123")
        admin_user = User(
            company_id=company.id,
            branch_id=branch.id,
            email="admin@transport.com",
            hashed_password=hashed_pwd,
            full_name="Transport Admin",
            role="ADMIN"
        )
        session.add(admin_user)
        await session.commit()

    print("Clean Database Initialized Successfully! (0 Dummy Trips, 0 Dummy Vehicles, 0 Dummy Invoices)")


if __name__ == "__main__":
    asyncio.run(reset_clean_database())
