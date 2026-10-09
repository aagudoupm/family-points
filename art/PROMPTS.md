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
