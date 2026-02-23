# CSS Guide - BEM Methodology

## 1. Objetivo y Alcance

### Aplicabilidad

- Todos los archivos `*.component.css` del proyecto Angular.
- Aplica a estilos nuevos y refactorizaciones de estilos existentes.
- No aplica a estilos inline o bibliotecas de terceros.

---

## 2. Convencion BEM - Sintaxis

### Definicion

BEM (Block Element Modifier) es una metodologia de nombrado CSS que estructura clases en tres niveles:

- **Block**: entidad independiente con significado propio (ej. `menu`, `button`, `card`).
- **Element**: parte de un bloque sin significado independiente (ej. `menu__item`, `button__icon`).
- **Modifier**: variante o estado de un bloque o elemento (ej. `button--disabled`, `menu__item--active`).

### Sintaxis Obligatoria

```
.block
.block__element
.block--modifier
.block__element--modifier
```

### Reglas de Nombrado

1. **Separadores**:
   - `__` (doble guion bajo): separa bloque de elemento.
   - `--` (doble guion): separa entidad de modificador.

2. **Case Style**: kebab-case para palabras multiples.
   - Correcto: `.mood-form__submit-button--disabled`
   - Incorrecto: `.moodForm__submitButton--disabled`

3. **Profundidad**: maximo 2 niveles de profundidad (bloque + elemento).
   - Correcto: `.mood-form__input`
   - Incorrecto: `.mood-form__fieldset__input` (encadenamiento prohibido)

---

## 3. Mapeo BEM a Componentes Angular

### Regla de Bloque

El **Block** corresponde al selector del componente Angular sin el prefijo `app-`:

| Selector Angular | Bloque BEM |
|-----------------|------------|
| `app-mood-form` | `mood-form` |
| `app-mood-list` | `mood-list` |
| `app-root` | `root` |

### Regla de Elemento

Los **Elements** son hijos directos del bloque dentro del HTML del componente:

```html
<!-- Componente app-mood-form -->
<div class="mood-form">
  <label class="mood-form__label">Mood</label>
  <input class="mood-form__input" />
  <button class="mood-form__button">Submit</button>
</div>
```

### Regla de Modificador

Los **Modifiers** representan estados o variantes:

```html
<!-- Estados -->
<button class="mood-form__button mood-form__button--disabled">Submit</button>

<!-- Variantes -->
<input class="mood-form__input mood-form__input--error" />
<input class="mood-form__input mood-form__input--large" />
```

**Importante**: el modificador se aplica junto con la clase base:

- Correcto: `class="mood-form__input mood-form__input--error"`
- Incorrecto: `class="mood-form__input--error"` (sin clase base)

---

## 4. Ejemplos Concretos del Proyecto

### Tabla de Conversion

Conversion de clases actuales a BEM:

| Clase Actual | Clase BEM | Tipo |
|--------------|-----------|------|
| `.app-container` | `.root` | Block |
| `.app-title` | `.root__title` | Element |
| `.mood-form-container` | `.mood-form` | Block |
| `.mood-input` | `.mood-form__input` | Element |
| `.mood-select` | `.mood-form__select` | Element |
| `.mood-textarea` | `.mood-form__textarea` | Element |
| `.submit-button` | `.mood-form__button` | Element |
| `.submit-button:hover` | `.mood-form__button--hover` | Modifier |
| `.mood-list-container` | `.mood-list` | Block |
| `.mood-item` | `.mood-list__item` | Element |
| `.mood-text` | `.mood-list__text` | Element |
| `.delete-button` | `.mood-list__delete-button` | Element |

### Ejemplo Completo - Componente mood-form

**HTML (mood-form.component.html)**:

```html
<div class="mood-form">
  <h2 class="mood-form__title">Add New Mood</h2>
  
  <form class="mood-form__form" (ngSubmit)="onSubmit()">
    <div class="mood-form__field">
      <label class="mood-form__label" for="mood">Mood Type</label>
      <select class="mood-form__select" id="mood" name="mood">
        <option value="happy">Happy</option>
        <option value="sad">Sad</option>
      </select>
    </div>
    
    <div class="mood-form__field">
      <label class="mood-form__label" for="notes">Notes</label>
      <textarea 
        class="mood-form__textarea" 
        id="notes" 
        name="notes">
      </textarea>
    </div>
    
    <button 
      class="mood-form__button mood-form__button--primary" 
      type="submit">
      Submit
    </button>
  </form>
</div>
```

**CSS (mood-form.component.css)**:

```css
/* Block */
.mood-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

/* Elements */
.mood-form__title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.mood-form__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mood-form__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mood-form__label {
  font-weight: 600;
  font-size: 14px;
  color: #555;
}

.mood-form__select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.mood-form__textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
}

.mood-form__button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

/* Modifiers */
.mood-form__button--primary {
  background-color: #007bff;
  color: white;
}

.mood-form__button--primary:hover {
  opacity: 0.9;
}

.mood-form__button--disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

.mood-form__textarea--error {
  border-color: #dc3545;
}

.mood-form__select--error {
  border-color: #dc3545;
}
```

---

## 5. Reglas y Restricciones

### Reglas Obligatorias

1. **Flat CSS**: no anidar selectores BEM. Cada clase es independiente.
   - Correcto:
   ```css
   .mood-form {}
   .mood-form__input {}
   ```
   - Incorrecto:
   ```css
   .mood-form {
     .mood-form__input {}
   }
   ```

2. **No IDs**: prohibido usar selectores de ID.
   - Correcto: `.mood-form__input`
   - Incorrecto: `#moodInput`

3. **No !important**: prohibido usar `!important` salvo casos excepcionales documentados.

4. **Un bloque por archivo**: cada archivo `*.component.css` define un unico bloque raiz.
   - Archivo `mood-form.component.css`: bloque `.mood-form`
   - Archivo `mood-list.component.css`: bloque `.mood-list`

5. **No encadenamiento**: prohibido `block__el1__el2`.
   - Si necesitas jerarquia profunda, considera:
     - Crear un nuevo bloque independiente.
     - Renombrar el elemento para reflejar su funcion sin indicar jerarquia.
   - Ejemplo:
     ```html
     <!-- Incorrecto -->
     <div class="card">
       <div class="card__header">
         <h2 class="card__header__title">Title</h2>
       </div>
     </div>
     
     <!-- Correcto - Opcion 1: Elemento directo -->
     <div class="card">
       <div class="card__header">
         <h2 class="card__title">Title</h2>
       </div>
     </div>
     
     <!-- Correcto - Opcion 2: Nuevo bloque -->
     <div class="card">
       <div class="card-header">
         <h2 class="card-header__title">Title</h2>
       </div>
     </div>
     ```

### Restricciones Adicionales

- No combinar BEM con otras metodologias (ej. utility classes de Tailwind).
- No usar selectores de atributo salvo para pseudo-clases (`:hover`, `:focus`).
- No usar selectores descendientes genericos (ej. `.mood-form div`).

---

## 6. Checklist de Validacion

Antes de entregar CSS con BEM, verificar:

- [ ] Todas las clases siguen el patron `block`, `block__element`, o `block--modifier`.
- [ ] El nombre del bloque coincide con el selector del componente (sin `app-`).
- [ ] No hay encadenamiento de elementos (`__element__subelement`).
- [ ] Los modificadores se aplican junto con la clase base.
- [ ] No hay selectores anidados (CSS plano).
- [ ] No hay IDs como selectores.
- [ ] No hay `!important` sin justificacion.
- [ ] Todas las clases usan kebab-case.
- [ ] El archivo define un unico bloque raiz.
- [ ] Las pseudo-clases (`:hover`, `:focus`) se aplican directamente a las clases BEM.

### Ejemplo de Revision

**CSS a revisar**:

```css
.mood-form {}
.mood-form__input {}
.mood-form__input--error {}
.mood-form__button {}
.mood-form__button--primary {}
.mood-form__button--primary:hover {}
```

**Verificacion**:
- ✓ Patron BEM correcto
- ✓ Bloque `mood-form` coincide con componente `app-mood-form`
- ✓ Sin encadenamiento
- ✓ Sin anidamiento
- ✓ kebab-case aplicado
- ✓ Pseudo-clase aplicada correctamente

---

## Referencias

- [BEM Official Documentation](https://en.bem.info/)
- [BEM Naming Convention](https://en.bem.info/methodology/naming-convention/)
- Angular Component Styles: los estilos son encapsulados por defecto (ViewEncapsulation.Emulated), por lo que BEM aplica dentro del scope del componente.
