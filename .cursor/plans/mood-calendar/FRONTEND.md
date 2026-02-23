# Plan Frontend - Calendario de Moods

## Alcance: `[FULLSTACK]` - Parte Frontend

Consume el endpoint `GET /calendar?year=&month=` definido en `BACKEND.md`.

---

## 3.1 Modelo TypeScript

### Archivo: `models/mood.model.ts` (modificar)

**Nueva interfaz `CalendarMonthResponse`:**

```
CalendarMonthResponse {
  year: number;
  month: number;
  total_days: number;
  days: Record<number, MoodEntry[]>;
}
```

**Nueva interfaz `CalendarDay`** (auxiliar para el componente):

```
CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  moods: MoodEntry[];
}
```

`CalendarDay` es un modelo de presentación (no viene del backend). Se construye en el componente a partir de `CalendarMonthResponse`.

---

## 3.2 Servicio HTTP

### Archivo: `services/mood.service.ts` (modificar)

**Nuevo método `getCalendar`:**

```
getCalendar(year: number, month: number): Observable<CalendarMonthResponse>
```

- Llama a `GET http://localhost:8000/calendar?year={year}&month={month}`.
- Retorna el observable tipado con `CalendarMonthResponse`.
- Sin transformación adicional (el componente se encarga de la lógica de presentación).

---

## 3.3 Componentes

### Nuevo componente: `mood-calendar`

**Archivos:**
- `components/mood-calendar/mood-calendar.component.ts`
- `components/mood-calendar/mood-calendar.component.html`
- `components/mood-calendar/mood-calendar.component.css`

**Selector:** `app-mood-calendar`

**Responsabilidad:** Renderizar un calendario visual tipo grilla para el mes actual. Cada celda muestra el número de día y un indicador del mood registrado (el más reciente del día). Permite al usuario visualizar de un vistazo su estado anímico diario.

**Inputs:**

| Input   | Tipo          | Descripción                      |
|---------|---------------|----------------------------------|
| `moods` | `MoodEntry[]` | Lista plana de moods del mes     |
| `year`  | `number`      | Año del calendario a mostrar     |
| `month` | `number`      | Mes del calendario a mostrar     |
| `totalDays` | `number`  | Total de días del mes            |

**Outputs:**

Ninguno. Componente de solo lectura.

**Lógica del componente (`mood-calendar.component.ts`):**

1. Propiedad computada `calendarWeeks: CalendarDay[][]` que genera la grilla.
2. Al recibir cambios en los inputs (`ngOnChanges`), recalcular la grilla:
   a. Determinar el día de la semana del primer día del mes (lunes=0).
   b. Rellenar celdas previas (del mes anterior) con `isCurrentMonth: false`.
   c. Generar celdas del 1 al `totalDays`.
   d. Para cada día, buscar en `moods` los entries cuyo `timestamp` corresponda a ese día.
   e. Rellenar celdas restantes (del mes siguiente) con `isCurrentMonth: false`.
   f. Agrupar en semanas (arrays de 7 elementos).
3. Método `getDisplayMood(day: CalendarDay): string` que retorna el mood más reciente del día, o cadena vacía.
4. Detectar si un día es hoy comparando con `new Date()`.

**Template (`mood-calendar.component.html`) - Estructura:**

```
<div class="mood-calendar">
  <div class="mood-calendar__header">
    <h3 class="mood-calendar__title">{Nombre del mes} {Año}</h3>
  </div>
  <div class="mood-calendar__weekdays">
    <span class="mood-calendar__weekday">Lun</span>
    <span class="mood-calendar__weekday">Mar</span>
    ...
    <span class="mood-calendar__weekday">Dom</span>
  </div>
  <div class="mood-calendar__grid">
    <!-- Para cada semana -->
    <div class="mood-calendar__week">
      <!-- Para cada día -->
      <div class="mood-calendar__day mood-calendar__day--[modifier]">
        <span class="mood-calendar__day-number">{número}</span>
        <span class="mood-calendar__day-mood">{mood text}</span>
      </div>
    </div>
  </div>
</div>
```

**Estilos (`mood-calendar.component.css`) - Guía BEM:**

Bloque raíz: `.mood-calendar`

| Clase BEM                               | Tipo      | Descripción                                  |
|-----------------------------------------|-----------|----------------------------------------------|
| `.mood-calendar`                        | Block     | Contenedor principal del calendario          |
| `.mood-calendar__header`                | Element   | Cabecera con título del mes                  |
| `.mood-calendar__title`                 | Element   | Texto "Febrero 2026"                         |
| `.mood-calendar__weekdays`             | Element   | Fila de nombres de días de la semana          |
| `.mood-calendar__weekday`              | Element   | Cada nombre individual (Lun, Mar...)          |
| `.mood-calendar__grid`                  | Element   | Contenedor de la grilla de días              |
| `.mood-calendar__week`                  | Element   | Fila de una semana (7 celdas)                |
| `.mood-calendar__day`                   | Element   | Celda individual de un día                    |
| `.mood-calendar__day--today`           | Modifier  | Día actual (borde o fondo destacado)          |
| `.mood-calendar__day--has-mood`        | Modifier  | Día con mood registrado (fondo color)         |
| `.mood-calendar__day--outside`         | Modifier  | Día fuera del mes actual (opacidad reducida)  |
| `.mood-calendar__day--weekend`         | Modifier  | Sábado o domingo (color sutil diferente)      |
| `.mood-calendar__day-number`           | Element   | Número del día dentro de la celda             |
| `.mood-calendar__day-mood`             | Element   | Texto del mood dentro de la celda             |

**Diseño visual:**
- Grilla CSS de 7 columnas con `display: grid; grid-template-columns: repeat(7, 1fr)`.
- Celdas cuadradas con `aspect-ratio: 1` o altura fija.
- Día actual: borde azul `#007bff`.
- Día con mood: fondo suave coloreado (ej. `#e8f5e9` para verde claro).
- Día fuera del mes: `opacity: 0.3`.
- Fin de semana: fondo ligeramente gris.
- Max-width: `800px`, centrado con `margin: 0 auto`.

---

## 3.4 Integración

### Archivo: `app.component.ts` (modificar)

1. Importar `MoodCalendarComponent`.
2. Añadir a `imports` del componente standalone.
3. Nuevas propiedades:
   - `calendarMoods: MoodEntry[] = []`
   - `calendarYear: number` (inicializado al año actual)
   - `calendarMonth: number` (inicializado al mes actual)
   - `calendarTotalDays: number` (inicializado a 0)
4. Nuevo método `loadCalendar(): void`:
   - Llama a `moodService.getCalendar(calendarYear, calendarMonth)`.
   - Asigna `calendarMoods` con la lista plana de moods extraída de `days`.
   - Asigna `calendarTotalDays` con `total_days`.
5. Llamar a `loadCalendar()` en `ngOnInit()` y en `onMoodSubmitted()` (para refrescar el calendario tras agregar un mood).

### Archivo: `app.component.html` (modificar)

Añadir el componente de calendario entre el formulario y la lista:

```html
<app-mood-calendar
  [moods]="calendarMoods"
  [year]="calendarYear"
  [month]="calendarMonth"
  [totalDays]="calendarTotalDays"
></app-mood-calendar>
```

---

## 3.5 Archivos a crear o modificar

| #  | Archivo                                              | Acción   | Descripción                                              |
|----|------------------------------------------------------|----------|----------------------------------------------------------|
| 1  | `src/app/models/mood.model.ts`                       | Modificar | Añadir `CalendarMonthResponse` y `CalendarDay`           |
| 2  | `src/app/services/mood.service.ts`                   | Modificar | Añadir método `getCalendar(year, month)`                 |
| 3  | `src/app/components/mood-calendar/mood-calendar.component.ts`  | Crear | Lógica del calendario: grilla, agrupación, detección hoy |
| 4  | `src/app/components/mood-calendar/mood-calendar.component.html` | Crear | Template con grilla BEM de 7 columnas                    |
| 5  | `src/app/components/mood-calendar/mood-calendar.component.css`  | Crear | Estilos BEM para grilla, modifiers de estado             |
| 6  | `src/app/app.component.ts`                           | Modificar | Importar calendario, cargar datos, propiedades nuevas    |
| 7  | `src/app/app.component.html`                         | Modificar | Insertar `<app-mood-calendar>` en el template            |

---
