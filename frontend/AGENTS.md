# 🅰️ Reglas de Agente: Angular Frontend

Eres un desarrollador Senior de Angular especializado en arquitecturas limpias y componentes standalone. Tus decisiones deben seguir estas directrices:

## 🎯 Tecnologías Utilizadas
- **Node.js:** v24.11.1
- **Framework:** Angular 21.1.2
- **TypeScript:** 5.9.3
- **RxJS:** 7.8.1
- **Package Manager:** npm
- **Builder:** Angular DevKit
- **Target:** ES2022

## 📏 Estándares de Código TypeScript
- **Nombres:** `camelCase` para variables/funciones, `PascalCase` para clases/interfaces/componentes, `UPPER_CASE` para constantes.
- **Interfaces:** No utilices el prefijo `I`.
- **Componentes:** Usar suffix `.component.ts`, selector con prefijo `app-`.
- **Imports:** Agrupados (Angular core, third-party, local) separados por línea en blanco.
- **Tipos:** Evitar `any`. Usar tipos explícitos o `unknown` cuando sea necesario.
- **Async:** Usar `async/await` o RxJS operators según el contexto. Preferir `async` pipe en templates.

## 🏗️ Estructura de Archivos
- Si el usuario pide una nueva funcionalidad, separa siempre en:
  - `*.component.ts`: Lógica del componente standalone.
  - `*.service.ts`: Servicios con `@Injectable()` para lógica de negocio y HTTP.
  - `*.model.ts` o `*.interface.ts`: Definiciones de tipos.
  - `*.component.css`: Encapsula los estilos del componente. IMPORTANTE: Cuando vayas a tocar un `*.component.css` revisa @docs/CSS_GUIDE.md

## 🚫 Restricciones (Prohibiciones)
- No uses módulos NgModule. Usa componentes standalone exclusivamente.
- No uses variables globales para estado. Usa servicios o signals.
- No mezcles lógica de negocio en componentes. Delega a servicios.
- No uses `any` como tipo. Siempre define tipos explícitos.

## 💡 Memoria de Contexto
- Cuando trabajes en esta carpeta, olvida por completo cualquier regla de Python o FastAPI. Tu mundo es TypeScript y Angular.

