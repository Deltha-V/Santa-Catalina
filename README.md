# Proyecto Inmobiliaria - Lotes

## Stack
- Frontend: React + TypeScript (Vite)
- Backend: FastAPI (Python)
- Base de datos: PostgreSQL + SQLAlchemy + Alembic

## Modelo de datos
- Cliente: `id`, `email`
- Lote: `numero_lote` (PK), `manzana`, `estado`, `comercializable`, `frente_m`, `fondo_m`, `area_m2`, `plano_imagen_url`

## Backend
1. `cd backend`
2. `python -m venv .venv`
3. `.venv\Scripts\activate`
4. `pip install -r requirements.txt`
5. Crear `.env` (puedes copiar desde `.env.example`)
6. Levantar Postgres local (opcion recomendada):
   - desde la raiz del proyecto: `docker compose up -d postgres`
7. `alembic upgrade head`
8. `uvicorn app.main:app --reload`

API base: `http://127.0.0.1:8000`

### Migraciones (Alembic)
- Crear migracion nueva: `alembic revision --autogenerate -m "descripcion"`
- Aplicar migraciones: `alembic upgrade head`
- Volver una migracion atras: `alembic downgrade -1`

### Desarrollo vs Produccion
- Desarrollo recomendado: Postgres en Docker (simula entorno real sin instalar Postgres en Windows).
- Produccion (Hostinger): usar `DATABASE_URL` del servidor gestionado y ejecutar `alembic upgrade head` en deploy.

### Carga masiva de lotes por Excel
- Endpoint: `POST /lotes/import-excel`
- Campo multipart: `file` (archivo `.xlsx`)
- Hojas esperadas: `MZ 1`, `MZ 2`, etc.
- Columnas usadas en cada hoja:
  - `K`: nombre de lote (ej. `LOTE 1`)
  - `L`: medidas (ej. `16,25 x 32,00`)
  - `M`: disponibilidad
- El id interno se guarda como `MZ{manzana}-L{numero}` para asegurar unicidad.

## Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

App: `http://127.0.0.1:5173`
