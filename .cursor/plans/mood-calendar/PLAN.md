# Plan de Implementación - Calendario de Moods

## Paso 1: Análisis de Alcance

**Veredicto: `[FULLSTACK]`**

El endpoint actual `GET /list` devuelve todos los moods sin filtrado temporal. Para el calendario se requiere un nuevo endpoint `GET /calendar` que devuelva moods agrupados por día para un mes específico. El frontend necesita un componente de calendario nuevo que renderice una grilla mensual.

Planes detallados:
- [BACKEND.md](./BACKEND.md)
- [FRONTEND.md](./FRONTEND.md)

---

## Paso 4: Orden de Implementación

| Orden | Archivo                                                         | Módulo   | Dependencia         |
|-------|-----------------------------------------------------------------|----------|---------------------|
| 1     | `backend/models.py`                                            | Backend  | Ninguna             |
| 2     | `backend/schemas.py`                                           | Backend  | models.py           |
| 3     | `backend/routes/moods.py`                                      | Backend  | schemas.py, models  |
| 4     | `frontend/src/app/models/mood.model.ts`                        | Frontend | Contrato API        |
| 5     | `frontend/src/app/services/mood.service.ts`                    | Frontend | mood.model.ts       |
| 6     | `frontend/src/app/components/mood-calendar/mood-calendar.component.ts`  | Frontend | mood.model.ts       |
| 7     | `frontend/src/app/components/mood-calendar/mood-calendar.component.html` | Frontend | component.ts        |
| 8     | `frontend/src/app/components/mood-calendar/mood-calendar.component.css`  | Frontend | CSS_GUIDE.md (BEM)  |
| 9     | `frontend/src/app/app.component.ts`                            | Frontend | mood-calendar, service |
| 10    | `frontend/src/app/app.component.html`                          | Frontend | app.component.ts    |

---

## Paso 5: Resumen Ejecutivo

| #  | Archivo                              | Acción    | Módulo   | Descripción                                                    |
|----|--------------------------------------|-----------|----------|----------------------------------------------------------------|
| 1  | `backend/models.py`                  | Modificar | Backend  | Método `get_entries_by_month(year, month)` en `MoodDatabase`   |
| 2  | `backend/schemas.py`                 | Modificar | Backend  | Nuevo schema `CalendarMonthResponse`                           |
| 3  | `backend/routes/moods.py`            | Modificar | Backend  | Endpoint `GET /calendar?year=&month=` con agrupación por día   |
| 4  | `frontend/.../mood.model.ts`         | Modificar | Frontend | Interfaces `CalendarMonthResponse` y `CalendarDay`             |
| 5  | `frontend/.../mood.service.ts`       | Modificar | Frontend | Método `getCalendar(year, month)`                              |
| 6  | `frontend/.../mood-calendar.component.ts`  | Crear | Frontend | Lógica: grilla semanal, agrupación de moods, detección de hoy  |
| 7  | `frontend/.../mood-calendar.component.html` | Crear | Frontend | Template: grilla 7 columnas con días, moods e indicadores      |
| 8  | `frontend/.../mood-calendar.component.css`  | Crear | Frontend | Estilos BEM: grilla CSS, modifiers today/has-mood/outside      |
| 9  | `frontend/.../app.component.ts`      | Modificar | Frontend | Importar calendario, cargar datos del endpoint, propiedades    |
| 10 | `frontend/.../app.component.html`    | Modificar | Frontend | Insertar `<app-mood-calendar>` entre formulario y lista        |

**Total:** 3 archivos modificados (backend) + 3 archivos creados + 4 archivos modificados (frontend) = **10 cambios**

---

## Decisiones de Diseño

1. **Múltiples moods por día:** El endpoint retorna todos los moods de cada día. El componente muestra el más reciente como indicador visual.
2. **Grilla del calendario:** Semana comienza en lunes (estándar europeo/español). Días fuera del mes se muestran con opacidad reducida.
3. **Refresco automático:** Al guardar un nuevo mood, se recarga tanto la lista como el calendario.
4. **Endpoint separado:** Se creó `GET /calendar` en lugar de agregar filtros a `GET /list` para mantener responsabilidades separadas y evitar breaking changes.
