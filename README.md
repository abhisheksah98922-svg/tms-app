# Enterprise Transport Management System (TMS)

An end-to-end multi-tenant Transport Management System built for logistics, fleet, and billing operations.

## Architecture & Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Hook Form + Zod, TanStack Query, Recharts.
- **Backend**: FastAPI, SQLAlchemy 2 (async), Alembic migrations, Pydantic v2.
- **Database & Caching**: PostgreSQL 16 (shared schema multi-tenancy with RLS), Redis 7 (cache + task broker).
- **Asynchronous Tasks**: Celery / Redis worker.
- **Containerization**: Docker & Docker Compose.

---

## Service Ports (Local Dev)

| Service | Port | Description |
|---|---|---|
| Frontend | `3000` | Next.js Dashboard & Management Interface |
| Backend | `8000` | FastAPI Web API & Swagger Docs (`/docs`) |
| Postgres | `5432` | PostgreSQL Database |
| Redis | `6379` | Redis In-Memory Cache & Broker |

---

## Quickstart

1. **Clone repository and set up environment variables**:
   ```bash
   cp .env.example .env
   ```

2. **Launch all services via Docker Compose**:
   ```bash
   docker compose up --build
   ```

3. **Check health status**:
   - Backend API: `http://localhost:8000/api/v1/health`
   - API Documentation: `http://localhost:8000/docs`
   - Frontend App: `http://localhost:3000`

---

## Integration Status Table (Phase 0 Baseline)

| Integration / Subsystem | Status | Provider Interface | Implementation / Driver |
|---|---|---|---|
| **Database** | ✅ Configured | `AsyncSession` | `postgresql+asyncpg` |
| **Cache & Broker** | ✅ Configured | `Redis` | `redis.asyncio` / Celery |
| **File Storage** | 🔌 Interface | `BaseStorageDriver` | `LocalStorageDriver` (Mock) / `S3StorageDriver` |
| **Notifications** | 🔌 Interface | `BaseNotificationProvider` | `MockNotificationProvider` |
| **GPS Tracking** | 🔌 Interface | `BaseGPSProvider` | `MockGPSProvider` |
| **WhatsApp / SMS** | 🔌 Interface | `BaseSMSProvider` | `MockSMSProvider` |
| **AI Features** | 🔌 Interface | `BaseAIProvider` | `MockAIProvider` |

---

## Phase Roadmap & Progress

- [x] **Phase 0**: Scaffold, Compose, CI, `.env.example`
- [ ] **Phase 1**: Schema + ER diagram + migrations + seed
- [ ] **Phase 2**: Auth, RBAC, forgot-password/OTP
- [ ] **Phase 3**: Vehicle/Driver/Customer CRUD + docs/expiry
- [ ] **Phase 4**: Trip/Booking + status workflow + P&L
- [ ] **Phase 5**: GST Invoice (PDF) + Payments (partial)
- [ ] **Phase 6**: Expense/Fuel/Maintenance
- [ ] **Phase 7**: Dashboard + Reports (PDF/Excel/CSV)
- [ ] **Phase 8**: Notifications via outbox + provider interface
- [ ] **Phase 9**: Security hardening + audit review
- [ ] **Phase 10**: Optional hooks (GPS/QR/lang/AI)
