---
description: Genera un plan de implementación para una feature, determinando si afecta backend, frontend o ambos.
---

Eres un arquitecto de software fullstack. Tu trabajo es analizar la siguiente descripción de tarea y producir un plan de implementación estructurado.

## Descripción de la tarea

$ARGUMENTS

## Instrucciones

### Paso 1: Análisis de alcance

Lee los archivos `AGENTS.md` de la raíz, `backend/AGENTS.md` y `frontend/AGENTS.md` para comprender las reglas y tecnologías del proyecto.

Examina el código existente del proyecto para entender la estructura actual:

- **Backend:** `backend/main.py`, `backend/models.py`, `backend/schemas.py`, `backend/routes/`
- **Frontend:** `frontend/src/app/components/`, `frontend/src/app/services/`, `frontend/src/app/models/`

Determina qué módulos se ven afectados por la tarea:

- **Solo Backend**: la tarea involucra únicamente lógica de servidor, modelos de datos, endpoints o validaciones.
- **Solo Frontend**: la tarea involucra únicamente UI, componentes, estilos o interacciones del cliente que consumen endpoints ya existentes.
- **Ambos (Fullstack)**: la tarea requiere nuevos endpoints o cambios en la API que el frontend debe consumir.

Declara explícitamente tu veredicto: `[BACKEND]`, `[FRONTEND]` o `[FULLSTACK]`.

### Paso 2: Plan de Backend (si aplica)

Si la tarea afecta al backend, genera el plan siguiendo este formato:

#### 2.1 Contrato de API

Define primero el contrato de la API que se expondrá. Para cada endpoint:

- **Método HTTP y ruta** (ej: `POST /api/moods`)
- **Request body** (schema Pydantic con tipos)
- **Response body** (schema Pydantic con tipos y `response_model`)
- **Códigos de estado** (200, 201, 404, 422, etc.)

#### 2.2 Modelo de datos

- Campos necesarios en `models.py` con sus tipos Python.
- Relaciones con modelos existentes si las hay.

#### 2.3 Schemas (Pydantic)

- Schemas de entrada (`*Create`, `*Update`) y salida (`*Response`) en `schemas.py`.
- Validaciones y restricciones.

#### 2.4 Rutas

- Archivo de rutas en `routes/` (nuevo o existente).
- Registro del router en `main.py` si es nuevo.
- Lógica de cada endpoint paso a paso.

#### 2.5 Archivos a crear o modificar

Lista exacta de archivos con la acción (crear/modificar) y un resumen de cambios.

### Paso 3: Plan de Frontend (si aplica)

Si la tarea afecta al frontend, genera el plan tomando como entrada el contrato de API definido en el Paso 2 (si existe). Si la tarea es solo frontend, revisa los endpoints existentes del backend que se consumirán.

#### 3.1 Modelo TypeScript

- Interfaces en `models/` que reflejen los schemas de respuesta del backend.

#### 3.2 Servicio HTTP

- Métodos en el servicio correspondiente dentro de `services/` que llamen a los endpoints definidos.
- Uso de `HttpClient` con tipos genéricos.
- Manejo de errores.

#### 3.3 Componentes

Para cada componente nuevo o modificado:

- **Selector** (con prefijo `app-`)
- **Responsabilidad** (qué hace, qué datos consume)
- **Inputs/Outputs** si los hay
- **Template** (estructura HTML resumida)
- **Estilos** (consultar `docs/CSS_GUIDE.md` antes de definir estilos)

#### 3.4 Integración

- Cómo se conectan los componentes nuevos con `app.component`.
- Flujo de datos entre servicio, componente y template.

#### 3.5 Archivos a crear o modificar

Lista exacta de archivos con la acción (crear/modificar) y un resumen de cambios.

### Paso 4: Orden de implementación

Genera una lista numerada con el orden exacto de implementación de los archivos, respetando estas reglas:

1. Backend siempre antes que frontend.
2. Dentro de backend: modelos, schemas, rutas, registro en main.
3. Dentro de frontend: modelos, servicios, componentes, integración en app.

### Paso 5: Resumen ejecutivo

Tabla resumen con columnas: `#`, `Archivo`, `Acción`, `Módulo`, `Descripción`.

## Restricciones del plan

- No generes código, solo el plan.
- Genera los planes en @.cursor/plans/{feature_name}/(BACKEND|FRONTEND).md.
    - Si la feature es demasiado grande haz vertical slice y genera los planes @.cursor/plans/{feature_name}/{SLICE_NAME}/(BACKEND|FRONTEND).md.
- Respeta las convenciones de cada `AGENTS.md`.
- Si hay ambigüedad en la tarea, pregunta y no hagas suposiciones.
- El plan debe ser lo suficientemente detallado para que un desarrollador lo implemente sin preguntas adicionales.
