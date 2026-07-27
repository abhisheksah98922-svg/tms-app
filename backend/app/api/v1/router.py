from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.vehicles import router as vehicles_router
from app.api.v1.drivers import router as drivers_router
from app.api.v1.customers import router as customers_router
from app.api.v1.trips import router as trips_router
from app.api.v1.invoices import router as invoices_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.ops import router as ops_router
from app.api.v1.reports import router as reports_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["Health"])
api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(vehicles_router, prefix="/vehicles", tags=["Vehicles"])
api_router.include_router(drivers_router, prefix="/drivers", tags=["Drivers"])
api_router.include_router(customers_router, prefix="/customers", tags=["Customers"])
api_router.include_router(trips_router, prefix="/trips", tags=["Trips"])
api_router.include_router(invoices_router, prefix="/invoices", tags=["Invoices & GST"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(ops_router, prefix="/ops", tags=["Operations"])
api_router.include_router(reports_router, prefix="/reports", tags=["Reports & CSV"])
