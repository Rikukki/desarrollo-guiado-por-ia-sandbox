# Plan Backend - Calendario de Moods

## Alcance: `[FULLSTACK]` - Parte Backend

---

## 2.1 Contrato de API

### `GET /calendar`

Devuelve los moods registrados para un mes y año específicos, agrupados por día.

**Query Parameters:**

| Parámetro | Tipo  | Requerido | Validación           | Descripción              |
|-----------|-------|-----------|----------------------|--------------------------|
| `year`    | `int` | Sí        | >= 2000, <= 2100     | Año a consultar          |
| `month`   | `int` | Sí        | >= 1, <= 12          | Mes a consultar (1-12)   |

**Response body (200):**

```json
{
  "year": 2026,
  "month": 2,
  "total_days": 28,
  "days": {
    "5": [
      {
        "id": 1,
        "mood": "happy",
        "note": "Good day",
        "category": "Personal",
        "timestamp": "2026-02-05T10:30:00",
        "date_formatted": "2026-02-05 10:30:00",
        "day_of_week": "Thursday",
        "is_weekend": false,
        "age_in_seconds": 691200.0
      }
    ],
    "13": [
      { "...MoodResponse" },
      { "...MoodResponse" }
    ]
  }
}
```

**Semántica del campo `days`:**
- Clave: número de día del mes (como string, por ser clave JSON).
- Valor: lista de `MoodResponse` para ese día, ordenados cronológicamente (más antiguo primero).
- Los días sin mood registrado NO aparecen en el diccionario.

**Códigos de estado:**

| Código | Condición                                      |
|--------|-------------------------------------------------|
| 200    | Consulta exitosa (incluso si no hay moods)      |
| 422    | `year` o `month` fuera de rango o tipo inválido |

---

## 2.2 Modelo de datos

No se requieren cambios en `MoodEntry`. Se añade un método de consulta en `MoodDatabase`.

**Nuevo método en `MoodDatabase`:**

- `get_entries_by_month(year: int, month: int) -> List[MoodEntry]`
  - Filtra `self._entries` por `entry.timestamp.year == year` y `entry.timestamp.month == month`.
  - Retorna la lista filtrada ordenada por `timestamp` ascendente.

---

## 2.3 Schemas (Pydantic)

### Nuevo schema en `schemas.py`:

**`CalendarMonthResponse`**

| Campo        | Tipo                          | Descripción                                        |
|--------------|-------------------------------|----------------------------------------------------|
| `year`       | `int`                         | Año consultado                                     |
| `month`      | `int`                         | Mes consultado                                     |
| `total_days` | `int`                         | Total de días del mes (28, 29, 30 o 31)            |
| `days`       | `dict[int, list[MoodResponse]]` | Diccionario día -> lista de moods de ese día    |

Validaciones:
- `year`: `Field(..., ge=2000, le=2100)`
- `month`: `Field(..., ge=1, le=12)`
- `total_days`: `Field(..., ge=28, le=31)`

---

## 2.4 Rutas

### Archivo: `routes/moods.py` (modificar)

**Nuevo endpoint `get_calendar`:**

1. Recibir `year: int` y `month: int` como query parameters con `Query(...)`.
2. Validar rangos (year 2000-2100, month 1-12). FastAPI/Pydantic se encarga con `ge`/`le`.
3. Calcular `total_days` usando `calendar.monthrange(year, month)[1]`.
4. Llamar a `mood_db.get_entries_by_month(year, month)`.
5. Agrupar resultados por `entry.timestamp.day`.
6. Construir `MoodResponse` para cada entry, incluyendo `age_in_seconds`.
7. Retornar `CalendarMonthResponse`.

**Import adicional necesario:** `calendar` (stdlib), `Query` de fastapi.

---

## 2.5 Archivos a crear o modificar

| #  | Archivo             | Acción   | Descripción                                                    |
|----|---------------------|----------|----------------------------------------------------------------|
| 1  | `models.py`         | Modificar | Añadir método `get_entries_by_month(year, month)` a `MoodDatabase` |
| 2  | `schemas.py`        | Modificar | Añadir `CalendarMonthResponse`                                 |
| 3  | `routes/moods.py`   | Modificar | Añadir endpoint `GET /calendar` con response_model             |

---
