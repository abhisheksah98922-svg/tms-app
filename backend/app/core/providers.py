from abc import ABC, abstractmethod
from typing import Dict, Any, List


# 1. GPS Tracking Hook
class BaseGPSProvider(ABC):
    @abstractmethod
    async def get_vehicle_location(self, vehicle_reg_no: str) -> Dict[str, Any]:
        pass


class MockGPSProvider(BaseGPSProvider):
    async def get_vehicle_location(self, vehicle_reg_no: str) -> Dict[str, Any]:
        return {
            "vehicle_reg_no": vehicle_reg_no,
            "latitude": 19.0760,
            "longitude": 72.8777,
            "city": "Mumbai",
            "speed_kmh": 45.5,
            "ignition_on": True,
            "last_updated": "2026-07-27T17:00:00Z"
        }


# 2. WhatsApp / SMS Hook
class BaseSMSProvider(ABC):
    @abstractmethod
    async def send_sms(self, phone: str, message: str) -> bool:
        pass


class MockSMSProvider(BaseSMSProvider):
    async def send_sms(self, phone: str, message: str) -> bool:
        print(f"[SMS MOCK PROVIDER] Sent to {phone}: {message}")
        return True


# 3. AI Features Hook (Route Optimization & Freight Rate Estimation)
class BaseAIProvider(ABC):
    @abstractmethod
    async def predict_optimal_freight_rate(self, origin: str, destination: str, payload_tons: float) -> Dict[str, Any]:
        pass


class MockAIProvider(BaseAIProvider):
    async def predict_optimal_freight_rate(self, origin: str, destination: str, payload_tons: float) -> Dict[str, Any]:
        estimated_distance_km = 150.0
        base_rate = estimated_distance_km * 250.0 + (payload_tons * 500.0)
        return {
            "origin": origin,
            "destination": destination,
            "recommended_freight_rate": base_rate,
            "estimated_fuel_liters": round(estimated_distance_km / 3.5, 1),
            "estimated_toll_cost": 2200.0,
            "confidence_score": 0.94
        }
