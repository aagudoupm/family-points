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
| `countries.js` | La vuelta al mundo (`window.FP_WORLD`): 5 continentes × 10 países con capital, monumento, idioma, gentilicio, saludo (y voz), algo típico, dato curioso y colores de la bandera. |
| `characters.js` | Los 16 personajes fijos (8 chicos y 8 chicas, `window.FP_CHARACTERS`) y los 5 rangos del viaje (uno por continente, con el color del marco). |
| `avatar.js` | Dibujo provisional de un personaje en SVG (`window.FP_AVATAR.svg(look, color)`), mientras no haya ilustración. |
| `art/` + `art.js` | Ilustraciones (personajes, recuerdos, trofeos y baúl). `node scripts/build-art.js` genera `art.js` con las que existen; lo hacen también los builds. |
| `icons.js` | Iconos propios dibujados a mano (`window.FP_OWN_ICONS`): estrella, moneda, avión, corona, candado, baúl (🧰) y cromos. Tienen prioridad sobre los de Fluent. |
| `tests/logic.test.js` | Tests unitarios (node:test) de la lógica. |
| `scripts/e2e.js` | Prueba de extremo a extremo con Playwright en un iPad simulado. Deja capturas en `shots/`. |
| `scripts/build-standalone.js` | Genera `docs/` (versión independiente para GitHub Pages): HTML completo, manifiesto, iconos y service worker sin conexión. **Regenera `docs/` tras cada cambio** (`npm run build`). |
| `scripts/e2e-standalone.js` | Sirve `docs/` por HTTP y prueba el recorrido, la instalación, el modo sin conexión y la copia de seguridad en un iPhone simulado. |
| `scripts/make-icons.js` | Genera `icons/*.png`. |
| `scripts/build-preview.js` | Envuelve `index.html` con el esqueleto del visor en `dist/` para probar en local. |

Patrón: estado + vista. Las vistas son funciones `renderX()` que devuelven nodos. Cada mutación llama a
`changed()`, que vuelve a pintar en el siguiente frame. Las hojas pueden registrar `ctx.update` para refrescarse.

### Modelo de datos (documentos del `db`)
- `members/{id}`: `{id, name, character (id de characters.js), color, role:'child'|'adult', order, createdAt}`
  (`emoji`, `photo`, `look`, `outfit` y `owned` son de versiones antiguas y ya no se usan; sin `character` se muestra una interrogación y el botón «¡Elige tu personaje!»).
- `rules/{id}`: `{id, title, icon, points(±), category, order}`
- `rewards/{id}`: `{id, title, icon, cost, active, order}`
- `log/{YYYY-MM}`: `{movements:[...], redemptions:[...]}`. Se agrupa por mes para no superar el límite de documentos.
  - movimiento: `{id, memberId, ruleId, kind:'rule'|'custom'|'reset', title, icon, points, date(ms), note}`
  - canje: `{id, memberId, rewardId, title, icon, cost, date}`
- `config/settings`: `{resetMode, lastResetKey, sound, confetti, pinForPoints, pinHash, pinSalt, onboarded, levelStep}` (`levelStep`: estrellas por país, 150 por defecto).

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

### Retos (`challenges/{id}`)
`{id, type: 'count'|'streak'|'clean'|'family'|'free', title, icon, ruleId, target, stars, memberIds[] (vacío = todos los niños),
period: 'weekly'|'week'|'open', weekStart, reward, active, order, createdAt}`.
- La ruleta de retos se eliminó: los retos antiguos con `pool: true` se ignoran y se borran al cargar (`onReady`).
- El progreso se calcula siempre a partir de los movimientos (`FP.challengeProgress`); nunca se guarda.
- Un reto conseguido queda **pendiente de confirmar** (`FP.pendingChallenges`, semana actual y anterior). Al confirmar (con PIN) se crean
  logros en `log/{YYYY-MM}.achievements` (`status: 'confirmed'`) que son las insignias, y movimientos `kind: 'challenge'` con las estrellas extra.
  «No contar» guarda un logro `status: 'dismissed'` para no volver a preguntar.
- Los bonus de retos (`kind: 'challenge'`) y los reinicios no cuentan para los retos; sí para saldo, ranking y gráficos.

### La vuelta al mundo (niveles, personajes, rangos y baúl)
- **Nivel = país.** `FP.travelFor(total, step, 50)`: cada `levelStep` estrellas ganadas en total (`FP.earnedTotal`, no baja al canjear ni al reiniciar)
  se viaja al país siguiente. Orden: Europa (empieza en España), América, África, Asia y Oceanía; en cada continente, de más a menos habitantes.
  **No se incluyen países en guerra** (se salta al siguiente por población). En la app usa `travelAt(total)`/`travelOf(id)`, que añaden país (`c`), siguiente (`nx`) y continente (`ct`).
- **Personajes fijos** (`characters.js`): cada niño elige uno (`openCharacterPicker`, desde el perfil o al editar el miembro). No hay ropa ni personalización.
  Se pinta con `charArt(ch)` (ilustración de `art/personajes/<id>.webp` o, si no existe, el dibujo provisional de `avatar.js`), `portrait(m, v)` (con el marco del rango) y `avatar(m)` (la cara).
- **Rangos**: uno por continente (`CH.rankFor(i)`): Turista, Explorador/a, Aventurero/a, Trotamundos y Gran viajero/a. Cambian el color del marco.
- **Baúl de recuerdos** (`openChest`, `openSouvenir`): cada país visitado da la maqueta de su monumento (`art/recuerdos/<código>.webp`; si no, el icono del país)
  y cada continente terminado un trofeo legendario (`art/trofeos/<continente>.webp`). `FP.allSouvenirs`, `FP.souvenirsFor`, `FP.newSouvenirsAt`: 55 en total, derivados del nivel; nunca se guardan.
- **Nuevo país** (`checkLevelUp`): billete de avión, nuevo rango si cambia de continente y el baúl con lo que entra. Las celebraciones van en fila (`showCelebration`).
- **Perfil** (`openProfile`): ambientado en el país actual (colores de la bandera en `--stripes`, icono típico), retrato con rango, saludo con «Escuchar»
  (`speechSynthesis` en la voz del país; si el dispositivo no la tiene, lee el campo `es` con voz española), ficha del país (bandera, capital,
  idioma, gentilicio y monumento) con «Escuchar la ficha», dato curioso, pasaporte del continente, racha, insignias, retos y dar estrellas.
  En «Más» y en Ajustes, «La vuelta al mundo» (`openRoute`).
- No hay monedas: las estrellas son para los premios reales y el viaje da recuerdos.

### Ilustraciones (art/)
Nombres de archivo: `art/personajes/<id>.webp` (ids en characters.js), `art/recuerdos/<código ISO>.webp`, `art/trofeos/<europa|america|africa|asia|oceania>.webp`,
`art/baul/cerrado.webp` y `art/baul/abierto.webp`. Fondo transparente, WebP de unos 512 px (ImageMagick: `convert in.png -resize 512x512 -quality 82 out.webp`).
Las imágenes con varias figuras se recortan con `node scripts/cut-art.js <imagen> <cols>x<filas> <grupo> <ids>` (quita el fondo blanco). Instrucciones de generación en `art/PROMPTS.md`.
Después: `node scripts/build-art.js` (o cualquier build) y publicar también los archivos de `art/`.

### Aspecto (estilo videojuego)
- Fondo `.scene` de rayos (`repeating-conic-gradient`) en azul; de noche, azul oscuro. Tokens en `:root` para claro y oscuro.
- Superficies blancas con contorno grueso `--k` y sombra sólida; botones de gominola (`.btn` con `--b`) que se hunden; títulos con borde
  (`-webkit-text-stroke` + `paint-order`). Fuentes: Lilita One (títulos y números, un solo grosor: usa `font-weight: 400`) y Nunito.
- El texto que va directamente sobre el fondo usa `--on-bg`; dentro de superficies, `--fg`.
- **Iconos**: primero los propios (`icons.js`); si no hay, Fluent Emoji 3D (Microsoft, MIT) en `emoji/` con `emoji-map.js`. `h()` convierte en icono
  cualquier texto que sea un emoji (o empiece por uno); `emo(ch)` lo hace explícitamente. Si añades emojis al código o países,
  regenera: `node scripts/build-emoji.js <assets de @lobehub/fluent-emoji-3d>` (incluye las banderas de `countries.js`).
- Panel: sonido y ajustes arriba a la derecha (`.top-actions`). Cada tarjeta: personaje con marco de rango, nombre, estrellas, país y nivel, rango y el vuelo hacia el siguiente país (`flightTrack`).

### Navegación
Barra inferior de 4, pensada para que la usen los niños: Panel · Retos · Premios (Catálogo | Canjes | Insignias) · Más.
«Más» reúne lo de adultos: Ajustes, Insignias, Historial y Gráficos (vista `summary`, con botón «‹ Más»), exportar, copia y sonido.
Ajustes también está en la rueda del panel y, en la barra lateral del iPad, abajo del todo (`.tab.rail-only`).
No añadir pestañas a la barra: lo nuevo va en «Más».

### Tres modos de datos (`S.mode`)
- `cloud`: Artifact de claude.ai (`db` del visor).
- `firebase`: versión independiente con `firebase-config.js` en la raíz (define `window.FP_FIREBASE`). Hay cuenta familiar
  con correo y contraseña; los datos van en Firestore bajo `users/{uid}/…` con las mismas rutas que el `db`. Reglas en
  `firestore.rules`. El SDK compat 10.14.1 está copiado en `vendor/firebase/` (sin CDN). Al cerrar sesión se vacía todo el estado.
- `local`: versión independiente sin configuración de Firebase (`localStorage`).
Una colección cuenta como cargada solo con un snapshot del servidor (`fromCache: false`), sin conexión o tras 8 s.

### Dos formas de publicarla
1. **Artifact de claude.ai**: datos en el `db` del artifact, sincronizados entre dispositivos. Necesita un Safari reciente.
2. **Independiente** (`docs/` en GitHub Pages): datos en `localStorage` del dispositivo, con copia de seguridad JSON
   (`FP.makeBackup` y `FP.parseBackup`). Fuera del visor (`!window.claude`), las exportaciones usan la hoja de compartir de iOS o una descarga normal.

## Comandos
```bash
npm test          # tests unitarios de logic.js
npm run e2e       # prueba completa en iPad simulado (Chromium); capturas en shots/
npm run build     # regenera docs/
npm run e2e:standalone  # prueba docs/ en iPhone simulado (instalación, sin conexión, copias)
npm run e2e:cloud # dos dispositivos con la misma cuenta familiar (Firebase simulado: tests/fake-firebase.js)
```
Para publicar, usa la herramienta Artifact con `index.html`, los archivos `logic.js`, `app.js`, `emoji-map.js`, `countries.js`, `avatar.js`, `characters.js`, `art.js`, `icons.js`, `emoji/*` y `art/**`
y `capabilities: {db: {}, downloads: true}`. Para actualizar, vuelve a publicar en la misma URL (ver README).

## Reglas de estilo
- Para rellenar un contenedor con partes opcionales usa `fill(el, ...)` (ignora `null`/`false`); `replaceChildren` y `append` los pintarían como «null».
- Todo texto visible pasa por `t('clave')` y el catálogo `STR` de `app.js` (español). No escribas literales en las vistas.
- Colores siempre con tokens CSS (`--bg`, `--fg`, `--good`, `--bad`, `--star`…), definidos para claro y oscuro.
- Tamaños en `rem`: el `html` usa `-apple-system-body`, así que la app sigue el tamaño de texto del iPad (Dynamic Type).
- Botones táctiles de al menos 44 px. Todo botón sin texto lleva `aria-label`. Los emojis decorativos llevan `aria-hidden`.
- Nada de `alert/confirm/prompt` (el visor los bloquea): usa `confirmSheet()`.
- Lógica nueva en `logic.js` con su test en `tests/logic.test.js`. Comprueba con `npm test && npm run e2e` antes de publicar.
- La paleta de colores de miembro (`FP.MEMBER_COLORS`) está validada para daltonismo en este orden: no la reordenes.
