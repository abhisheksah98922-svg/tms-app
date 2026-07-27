from datetime import datetime, date
from typing import List
from sqlalchemy import String, Integer, Float, Boolean, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.core.db import Base


class VehicleStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    IN_TRANSIT = "IN_TRANSIT"
    MAINTENANCE = "MAINTENANCE"


class DriverStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    ON_TRIP = "ON_TRIP"
    ON_LEAVE = "ON_LEAVE"


class TripStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    DISPATCHED = "DISPATCHED"
    IN_TRANSIT = "IN_TRANSIT"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class InvoiceStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    ISSUED = "ISSUED"
    PARTIAL = "PARTIAL"
    PAID = "PAID"


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    state_code: Mapped[str] = mapped_column(String(5), nullable=False, default="27")
    state_name: Mapped[str] = mapped_column(String(100), nullable=False, default="Maharashtra")
    gstin: Mapped[str] = mapped_column(String(20), nullable=False)
    address: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    branches: Mapped[List["Branch"]] = relationship("Branch", back_populates="company")
    users: Mapped[List["User"]] = relationship("User", back_populates="company")


class Branch(Base):
    __tablename__ = "branches"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)

    company: Mapped["Company"] = relationship("Company", back_populates="branches")


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), nullable=False)
    branch_id: Mapped[int] = mapped_column(ForeignKey("branches.id"), nullable=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False, default="ADMIN")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    company: Mapped["Company"] = relationship("Company", back_populates="users")


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), nullable=False, index=True)
    reg_no: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    vehicle_type: Mapped[str] = mapped_column(String(100), nullable=False)
    capacity_tons: Mapped[float] = mapped_column(Float, default=10.0)
    status: Mapped[str] = mapped_column(String(50), default=VehicleStatus.AVAILABLE.value)
    fitness_expiry: Mapped[date] = mapped_column(Date, nullable=True)
    insurance_expiry: Mapped[date] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Driver(Base):
    __tablename__ = "drivers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    license_no: Mapped[str] = mapped_column(String(100), nullable=False)
    license_expiry: Mapped[date] = mapped_column(Date, nullable=False)
    salary_monthly: Mapped[float] = mapped_column(Float, default=25000.0)
    status: Mapped[str] = mapped_column(String(50), default=DriverStatus.AVAILABLE.value)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    wallet_ledger: Mapped[List["DriverWallet"]] = relationship("DriverWallet", back_populates="driver")


class DriverWallet(Base):
    __tablename__ = "driver_wallets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    driver_id: Mapped[int] = mapped_column(ForeignKey("drivers.id"), nullable=False, index=True)
    transaction_type: Mapped[str] = mapped_column(String(20), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    driver: Mapped["Driver"] = relationship("Driver", back_populates="wallet_ledger")


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=True)
    gstin: Mapped[str] = mapped_column(String(20), nullable=False)
    state_code: Mapped[str] = mapped_column(String(5), nullable=False)
    state_name: Mapped[str] = mapped_column(String(100), nullable=False)
    address: Mapped[str] = mapped_column(Text, nullable=True)
    credit_days: Mapped[int] = mapped_column(Integer, default=30)
    credit_limit: Mapped[float] = mapped_column(Float, default=500000.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), nullable=False, index=True)
    trip_no: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"), nullable=False)
    driver_id: Mapped[int] = mapped_column(ForeignKey("drivers.id"), nullable=False)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), nullable=False)
    origin: Mapped[str] = mapped_column(String(255), nullable=False)
    destination: Mapped[str] = mapped_column(String(255), nullable=False)
    goods_description: Mapped[str] = mapped_column(String(255), default="General Freight")
    weight_tons: Mapped[float] = mapped_column(Float, default=12.5) # Freight Weight in Tons
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default=TripStatus.DISPATCHED.value)

    freight_rate: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    fuel_cost: Mapped[float] = mapped_column(Float, default=0.0)
    toll_cost: Mapped[float] = mapped_column(Float, default=0.0)
    police_cost: Mapped[float] = mapped_column(Float, default=0.0)
    loading_cost: Mapped[float] = mapped_column(Float, default=0.0)
    unloading_cost: Mapped[float] = mapped_column(Float, default=0.0)
    labour_cost: Mapped[float] = mapped_column(Float, default=0.0)
    other_cost: Mapped[float] = mapped_column(Float, default=0.0)
    driver_salary_alloc: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    @property
    def total_expenses(self) -> float:
        return (
            self.fuel_cost + self.toll_cost + self.police_cost +
            self.loading_cost + self.unloading_cost + self.labour_cost +
            self.other_cost + self.driver_salary_alloc
        )

    @property
    def net_profit(self) -> float:
        return self.freight_rate - self.total_expenses


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), nullable=False, index=True)
    trip_id: Mapped[int] = mapped_column(ForeignKey("trips.id"), nullable=False)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), nullable=False)
    invoice_no: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    invoice_date: Mapped[date] = mapped_column(Date, nullable=False)
    hsn_sac: Mapped[str] = mapped_column(String(20), default="996511")
    taxable_value: Mapped[float] = mapped_column(Float, nullable=False)
    cgst_rate: Mapped[float] = mapped_column(Float, default=0.0)
    cgst_amount: Mapped[float] = mapped_column(Float, default=0.0)
    sgst_rate: Mapped[float] = mapped_column(Float, default=0.0)
    sgst_amount: Mapped[float] = mapped_column(Float, default=0.0)
    igst_rate: Mapped[float] = mapped_column(Float, default=0.0)
    igst_amount: Mapped[float] = mapped_column(Float, default=0.0)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default=InvoiceStatus.ISSUED.value)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    payments: Mapped[List["Payment"]] = relationship("Payment", back_populates="invoice")


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), nullable=False, index=True)
    invoice_id: Mapped[int] = mapped_column(ForeignKey("invoices.id"), nullable=False)
    payment_no: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    payment_date: Mapped[date] = mapped_column(Date, nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    method: Mapped[str] = mapped_column(String(50), default="BANK_TRANSFER")
    reference_no: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    invoice: Mapped["Invoice"] = relationship("Invoice", back_populates="payments")
