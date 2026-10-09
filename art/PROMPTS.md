# Instrucciones para generar las ilustraciones (ChatGPT o Gemini)

Todas las peticiones se hacen **en la misma conversación**, empezando por el mensaje 0 (estilo).
Cada imagen trae varias figuras en orden fijo; luego se recortan con ImageMagick y se guardan en
`art/personajes/<id>.webp`, `art/recuerdos/<código>.webp`, `art/trofeos/<continente>.webp` y `art/baul/{cerrado,abierto}.webp`.

## 0 · Estilo (primer mensaje)
Vamos a crear las ilustraciones de un juego educativo para niños de 6 a 12 años llamado «La vuelta al mundo». Todas las imágenes que te pida en esta conversación deben tener EXACTAMENTE el mismo estilo:
- Videojuego anime chibi en 2D, inspirado en los juegos online de los años 2000 como GunBound, pero con diseños originales.
- Proporciones chibi: cabeza grande, ojos grandes y brillantes, expresión alegre.
- Colores vivos y saturados, sombreado cel-shading, brillos marcados y contorno oscuro y limpio.
- Fondo blanco liso, sin sombra en el suelo, sin escenario y sin marcos.
- Sin texto, sin letras, sin números y sin logotipos.
- Cada figura completa, sin cortar y separada de las demás con mucho espacio.
Responde solo «Entendido» y espera mis peticiones.

## 1-4 · Personajes (4 por imagen, cuadrícula 2×2)
Plantilla: Crea una imagen cuadrada con 4 personajes en una cuadrícula de 2×2, en este orden: arriba a la izquierda, arriba a la derecha, abajo a la izquierda y abajo a la derecha. Son niños de unos 9 años, de cuerpo entero, de pie, mirando de frente, con pose alegre y todos de la misma altura. Llevan ropa de viajero aventurero con un detalle de su personalidad.
- Imagen 1: leo, hugo, omar, kenji · Imagen 2: marco, dani, bruno, kofi
- Imagen 3: sofia, vera, aitana, nora · Imagen 4: amaia, lina, zoe, ayo
(Las descripciones están en characters.js.)

## 5-14 · Recuerdos (5 por imagen, en fila)
Plantilla: Crea una imagen horizontal con 5 figuras de recuerdo en una sola fila, de izquierda a derecha en este orden. Cada una es una maqueta en miniatura, como un souvenir de resina pintada, sobre una pequeña peana redonda de madera; reconocible y simplificada con el estilo del juego.
Grupos en el orden de countries.js: Europa 1-5 y 6-10, América 1-5 y 6-10, África 1-5 y 6-10, Asia 1-5 y 6-10, Oceanía 1-5 y 6-10.

## 15 · Trofeos (5 en fila)
## 16 · Baúl (cerrado y abierto)

## 17-36 · Iconos (5 por imagen, en fila) → art/iconos/<código del emoji>.webp
Mensaje 17 fija el estilo de los iconos. Se piden en 5 imágenes de 4 filas × 5 columnas (la última de 3 filas), juntando los grupos de abajo
en orden de lectura: A = 18-21, B = 22-25, C = 26-29, D = 30-33, E = 34-36. Se recortan con cut-row.js (detecta las filas):
- 18: ⭐ 🏠 🏆 🎁 🧭
- 19: ⚙️ 🔊 🔇 🔒 ✈️
- 20: 🎫 ❔ 📶 🔄 ✏️
- 21: 💾 📂 📄 📑 🗒️
- 22: 📈 🧾 ⬆️ ⬇️ ⚠️
- 23: 🏅 🥇 🥈 🥉 🔥
- 24: 🌍 🌎 🌏 👋 📍
- 25: 🏙️ 🗣️ 🙋 🏛️ 💡
- 26: 🛂 👨‍👩‍👧 🙂 🔁 🧼
- 27: ✍️ 🎯 🌟 💪 👟
- 28: 🛏️ 🪥 🧸 🧹 📚
- 29: 🥦 📖 👕 🍽️ 💛
- 30: 😴 🤝 🚿 🐕 🎒
- 31: 🧺 🌱 🎨 🎵 ⚽
- 32: 😠 🤬 😭 🤥 🙉
- 33: 📢 📵 🌪️ 👊 📱
- 34: 🎬 🍦 🛝 🍕 🌙
- 35: 🎲 🏞️ 🧒 🎮 🍫
- 36: 🏊 🚲 🎟️ 💶 🎉
Las banderas siguen siendo las de Fluent. El icono típico de cada país se sustituye por su recuerdo (art/recuerdos).

## 37-41 · Fondos de continente (uno por imagen) → art/fondos/<europa|america|africa|asia|oceania>.webp
Plantilla: Crea una ilustración panorámica horizontal (16:9) con el mismo estilo del juego: un paisaje típico de <continente> visto de lejos,
sin personajes, sin animales en primer plano, sin edificios ni monumentos famosos, sin texto. Colores suaves y luminosos (tipo pastel) para que el texto
encima se lea bien. La mitad izquierda más despejada (cielo y suelo lisos); los detalles, hacia la derecha y abajo. Sin marco y sin bordes.
- Europa: colinas verdes, prados con flores, un bosque al fondo y montañas suaves.
- América: selva tropical frondosa con un río y montañas altas al fondo.
- África: sabana dorada con acacias y un gran sol al atardecer.
- Asia: montañas con nieve, arrozales en terrazas y cerezos en flor.
- Oceanía: playa de arena con palmeras, mar turquesa y un arrecife.
Guardar: `convert in.png -resize 1600x900 -quality 82 art/fondos/<id>.webp`.
