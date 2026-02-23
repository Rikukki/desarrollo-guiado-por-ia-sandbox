# 📁 Mood Tracker - Monorepo

Proyecto fullstack de seguimiento de estados de ánimo con arquitectura desacoplada.

## 📂 Estructura del Proyecto

```
desarrollo-guiado-por-ia-sandbox/
├── backend/              # API REST (FastAPI)
│   ├── main.py          # Aplicación principal
│   ├── AGENTS.md        # Reglas específicas de backend
│   └── ...
├── frontend/            # SPA (Angular)
│   ├── src/            # Código fuente
│   ├── AGENTS.md       # Reglas específicas de frontend
│   └── ...
├── AGENTS.md           # Este archivo (reglas globales)
└── README.md           # Documentación del proyecto
```

## 🚀 Cómo Levantar el Proyecto

### Backend (Puerto 8000)

```bash
cd backend
make dev
```

O alternativamente:

```bash
cd backend
uv sync
uv run fastapi dev main.py
```

Acceso: `http://localhost:8000`

### Frontend (Puerto 4200)

```bash
cd frontend
npm install
npm start
```

Acceso: `http://localhost:4200`

### Orden Recomendado

1. Levantar primero el backend
2. Levantar el frontend
3. El frontend consume automáticamente los endpoints del backend

## 🎯 Arquitectura del Sistema
- **Comunicación**: HTTP con CORS habilitado para desarrollo local
- **Monorepo**: Dos carpetas independientes con sus propios gestores de paquetes
