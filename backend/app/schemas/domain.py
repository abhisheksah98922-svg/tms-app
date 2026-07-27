from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime


# Auth & User
class UserLogin(BaseModel):
    email: EmailStr
    password: str


class CompanyRegister(BaseModel):
    company_name: str
    full_name: str
    email: EmailStr
    password: str
    gstin: Optional[str] = "27AAACA1234A1Z5"
    state_code: Optional[str] = "27"
    state_name: Optional[str] = "Maharashtra"


class UserOut(BaseModel):
    id: int
    company_id: int
    branch_id: Optional[int] = None
    email: str
    full_name: str
    role: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# Vehicles
class VehicleCreate(BaseModel):
    reg_no: str
    vehicle_type: str
    capacity_tons: float = 10.0
    status: str = "AVAILABLE"
    fitness_expiry: Optional[date] = None
    insurance_expiry: Optional[date] = None


class VehicleOut(VehicleCreate):
    id: int
    company_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Drivers & Wallet
class DriverCreate(BaseModel):
    name: str
    phone: str
    license_no: str
    license_expiry: date
    salary_monthly: float = 25000.0
    status: str = "AVAILABLE"


class DriverWalletOut(BaseModel):
    id: int
    driver_id: int
    transaction_type: str
    amount: float
    description: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DriverOut(DriverCreate):
    id: int
    company_id: int
    created_at: datetime
    wallet_balance: float = 0.0

    model_config = ConfigDict(from_attributes=True)


# Customers
class CustomerCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    gstin: str
    state_code: str
    state_name: str
    address: Optional[str] = None
    credit_days: int = 30
    credit_limit: float = 500000.0


class CustomerOut(CustomerCreate):
    id: int
    company_id: int
    created_at: datetime
    computed_outstanding: float = 0.0

    model_config = ConfigDict(from_attributes=True)


# Trips & P&L
class TripCreate(BaseModel):
    trip_no: str
    vehicle_id: int
    driver_id: int
    customer_id: int
    origin: str
    destination: str
    goods_description: str = "General Freight"
    weight_tons: float = 12.5
    start_date: date
    end_date: Optional[date] = None
    freight_rate: float
    fuel_cost: float = 0.0
    toll_cost: float = 0.0
    police_cost: float = 0.0
    loading_cost: float = 0.0
    unloading_cost: float = 0.0
    labour_cost: float = 0.0
    other_cost: float = 0.0
    driver_salary_alloc: float = 0.0
    status: str = "DISPATCHED"


class TripOut(TripCreate):
    id: int
    company_id: int
    created_at: datetime
    total_expenses: float
    net_profit: float
    vehicle_reg_no: Optional[str] = None
    driver_name: Optional[str] = None
    customer_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# Invoices & GST
class VehicleTripItem(BaseModel):
    dispatch_time_date: str
    vehicle_reg_no: str
    origin: str
    destination: str
    weight_tons: float
    rate_per_ton: float
    freight_amount: float


class InvoiceCreate(BaseModel):
    trip_id: int
    customer_id: int
    taxable_value: float
    hsn_sac: str = "996511"


class CustomInvoiceCreate(BaseModel):
    customer_name: str
    customer_gstin: str
    customer_state_code: str = "27"
    vehicle_trips: List[VehicleTripItem] = []
    freight_taxable_value: float
    demurrage_charges: float = 0.0
    handling_charges: float = 0.0
    gst_scheme: str = "INTRA_STATE"


class PaymentOut(BaseModel):
    id: int
    company_id: int
    invoice_id: int
    payment_no: str
    payment_date: date
    amount: float
    method: str
    reference_no: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InvoiceOut(BaseModel):
    id: int
    company_id: int
    trip_id: int
    customer_id: int
    invoice_no: str
    invoice_date: date
    hsn_sac: str
    taxable_value: float
    cgst_rate: float
    cgst_amount: float
    sgst_rate: float
    sgst_amount: float
    igst_rate: float
    igst_amount: float
    total_amount: float
    status: str
    created_at: datetime
    paid_amount: float = 0.0
    balance_due: float = 0.0
    vehicle_reg_no: Optional[str] = None
    customer_name: Optional[str] = None
    weight_tons: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)


class PaymentCreate(BaseModel):
    invoice_id: int
    amount: float
    method: str = "BANK_TRANSFER"
    reference_no: Optional[str] = None


# Dashboard Metrics
class DashboardOut(BaseModel):
    total_revenue: float
    total_net_profit: float
    total_trips: int
    active_vehicles: int
    pending_receivables: float
    recent_trips: List[TripOut]
