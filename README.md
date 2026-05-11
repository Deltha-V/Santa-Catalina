# Proyecto Inmobiliaria - Lotes

## Stack
- Frontend: React + TypeScript (Vite)
- Backend: FastAPI (Python)
- Base de datos: SQLAlchemy (SQLite por defecto)

## Modelo de datos
- Cliente: `id`, `email`
- Lote: `numero_lote` (PK), `manzana`, `estado`, `comercializable`, `frente_m`, `fondo_m`, `area_m2`, `plano_imagen_url`

## Backend
1. `cd backend`
2. `python -m venv .venv`
3. `.venv\Scripts\activate`
4. `pip install -r requirements.txt`
5. `uvicorn app.main:app --reload`

API base: `http://127.0.0.1:8000`

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


