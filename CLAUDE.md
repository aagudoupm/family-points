# Family Points — guía para Claude

Web app familiar (iPad primero) para dar estrellas por comportamiento y canjearlas por premios.
Se publica como Artifact de claude.ai y se instala en el iPad con «Añadir a pantalla de inicio».

## Por qué web y no nativa
El usuario no tiene Mac, así que no puede compilar con Xcode. Se sustituyó el stack SwiftUI/SwiftData por
HTML + JS sin dependencias, con persistencia en la base de datos del Artifact (`db`) y respaldo en `localStorage`.

## Arquitectura
| Archivo | Papel |
|---|---|
| `index.html` | Contenido de la página (sin doctype: el visor añade el esqueleto). `<title>`, CSS con tokens claro/oscuro y contenedores. |
| `logic.js` | **Lógica pura** (`window.FP` / `module.exports`): saldo, ranking, canjes, reinicios, filtros, estadísticas, CSV, PIN, plantillas. Sin DOM. |
| `app.js` | Interfaz: estado `S`, persistencia, vistas (panel, historial, premios, estadísticas, ajustes), hojas, PIN, sonido y confeti. |
| `tests/logic.test.js` | Tests unitarios (node:test) de la lógica. |
| `scripts/e2e.js` | Prueba de extremo a extremo con Playwright en un iPad simulado. Deja capturas en `shots/`. |
| `scripts/build-preview.js` | Envuelve `index.html` con el esqueleto del visor en `dist/` para probar en local. |

Patrón: estado + vista. Las vistas son funciones `renderX()` que devuelven nodos. Cada mutación llama a
`changed()`, que vuelve a pintar en el siguiente frame. Las hojas pueden registrar `ctx.update` para refrescarse.

### Modelo de datos (documentos del `db`)
- `members/{id}`: `{id, name, emoji, photo(dataURL), color, role:'child'|'adult', order, createdAt}`
- `rules/{id}`: `{id, title, icon, points(±), category, order}`
- `rewards/{id}`: `{id, title, icon, cost, active, order}`
- `log/{YYYY-MM}`: `{movements:[...], redemptions:[...]}`. Se agrupa por mes para no superar el límite de documentos.
  - movimiento: `{id, memberId, ruleId, kind:'rule'|'custom'|'reset', title, icon, points, date(ms), note}`
  - canje: `{id, memberId, rewardId, title, icon, cost, date}`
- `config/settings`: `{resetMode, lastResetKey, sound, confetti, pinForPoints, pinHash, pinSalt, onboarded}`

**El saldo nunca se guarda**: se calcula como Σ movimientos − Σ canjes (`FP.balance`).
El reinicio añade un movimiento `kind:'reset'` que deja el saldo a cero y conserva el historial.
El reinicio automático se comprueba al cargar (`FP.dueAutoReset`).
Los movimientos guardan una copia del título y los puntos de la regla, así que editar una regla no cambia el historial.

### Persistencia
`persist(path, getData)` hace una escritura por documento a la vez, siempre con el último estado.
Los snapshots remotos no pisan los documentos con escritura pendiente (`busy`).
Si `claude.use('db')` devuelve `null`, se usa `localDB()` sobre `localStorage`.

### PIN parental
PBKDF2-SHA256 con sal aleatoria, guardado en `config/settings`; nunca se guarda el PIN en claro.
Se pide para: entrar en Ajustes, editar o borrar movimientos del historial, canjear y, si se activa la opción, dar puntos.
Tras introducirlo queda desbloqueado 3 minutos. Tras 5 fallos hay que esperar 30 s.

## Comandos
```bash
npm test          # tests unitarios de logic.js
npm run e2e       # prueba completa en iPad simulado (Chromium); capturas en shots/
```
Para publicar, usa la herramienta Artifact con `index.html`, los archivos `logic.js` y `app.js`
y `capabilities: {db: {}, downloads: true}`. Para actualizar, vuelve a publicar en la misma URL (ver README).

## Reglas de estilo
- Todo texto visible pasa por `t('clave')` y el catálogo `STR` de `app.js` (español). No escribas literales en las vistas.
- Colores siempre con tokens CSS (`--bg`, `--fg`, `--good`, `--bad`, `--star`…), definidos para claro y oscuro.
- Tamaños en `rem`: el `html` usa `-apple-system-body`, así que la app sigue el tamaño de texto del iPad (Dynamic Type).
- Botones táctiles de al menos 44 px. Todo botón sin texto lleva `aria-label`. Los emojis decorativos llevan `aria-hidden`.
- Nada de `alert/confirm/prompt` (el visor los bloquea): usa `confirmSheet()`.
- Lógica nueva en `logic.js` con su test en `tests/logic.test.js`. Comprueba con `npm test && npm run e2e` antes de publicar.
- La paleta de colores de miembro (`FP.MEMBER_COLORS`) está validada para daltonismo en este orden: no la reordenes.
