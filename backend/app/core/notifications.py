from abc import ABC, abstractmethod
from typing import Dict, Any
import logging

logger = logging.getLogger("tms_notifications")


class BaseNotificationProvider(ABC):
    @abstractmethod
    async def send_notification(self, recipient: str, message: str, metadata: Dict[str, Any] = None) -> bool:
        pass


class MockNotificationProvider(BaseNotificationProvider):
    async def send_notification(self, recipient: str, message: str, metadata: Dict[str, Any] = None) -> bool:
        logger.info(f"[OUTBOX MOCK NOTIFICATION] To: {recipient} | Msg: {message} | Meta: {metadata or {}}")
        return True


def get_notification_provider() -> BaseNotificationProvider:
    return MockNotificationProvider()
