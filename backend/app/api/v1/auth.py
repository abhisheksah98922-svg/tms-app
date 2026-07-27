from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

from app.core.db import get_db
from app.core.config import settings
from app.models.domain import User, Company, Branch
from app.schemas.domain import UserLogin, CompanyRegister, TokenResponse, UserOut

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
    return encoded_jwt


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_company(payload: CompanyRegister, db: AsyncSession = Depends(get_db)):
    # Check existing user
    exist_res = await db.execute(select(User).where(User.email == payload.email))
    if exist_res.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account with this email already exists"
        )

    # 1. Create New Company with 0 dummy data
    company = Company(
        name=payload.company_name,
        state_code=payload.state_code or "27",
        state_name=payload.state_name or "Maharashtra",
        gstin=payload.gstin or "27AAACA1234A1Z5",
        address="Head Office"
    )
    db.add(company)
    await db.flush()

    # 2. Create Default Branch
    branch = Branch(
        company_id=company.id,
        name="Main Branch",
        city="Headquarters"
    )
    db.add(branch)
    await db.flush()

    # 3. Create Admin User
    hashed_pwd = pwd_context.hash(payload.password)
    user = User(
        company_id=company.id,
        branch_id=branch.id,
        email=payload.email,
        hashed_password=hashed_pwd,
        full_name=payload.full_name,
        role="ADMIN",
        is_active=True
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token(data={"sub": user.email, "company_id": user.company_id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserOut.model_validate(user)
    }


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    if not user or not pwd_context.verify(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    token = create_access_token(data={"sub": user.email, "company_id": user.company_id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserOut.model_validate(user)
    }


@router.get("/me", response_model=UserOut)
async def get_current_user(email: str = "admin@apexlogistics.in", db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut.model_validate(user)
