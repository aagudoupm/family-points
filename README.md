# Family Points

Estrellas por portarse bien y premios para canjearlas. Pensada para usarla en familia sobre el iPad.

## Aspecto
Estilo videojuego: fondo de rayos azul, tarjetas con contorno grueso, botones que se hunden y títulos con borde.
Iconos propios dibujados a mano para lo principal y [Fluent Emoji 3D](https://github.com/microsoft/fluentui-emoji) de Microsoft (licencia MIT) para el resto.
Las ilustraciones de personajes, recuerdos y trofeos van en `art/` (mientras no estén, se ve un dibujo provisional).

## La vuelta al mundo
- **Cada nivel es un país.** Cada 150 estrellas ganadas (configurable en Ajustes) se viaja al siguiente: 10 de Europa empezando por España
  y después América, África, Asia y Oceanía, de los países con más habitantes a los que menos. No se incluyen países en guerra.
- **Personajes**: cada niño elige uno de los 16 personajes (8 chicos y 8 chicas). Con el viaje sube de **rango** (10, de Novato a Gran viajero;
  los primeros llegan pronto y luego se espacian). El marco del retrato sube de material, de madera a diamante, y **cada rango nuevo regala 10 estrellas**.
- El **perfil** se viste del país donde está: colores de su bandera, cómo se saluda, la ficha del país
  (bandera, capital, idioma, gentilicio y monumento), un dato curioso y el pasaporte del continente.
- Al llegar a un país nuevo sale un **billete de avión** y entra un **recuerdo en el baúl**: la maqueta del monumento del país.
  Al terminar un continente, un **trofeo legendario**. Las estrellas siguen siendo para los premios reales.
- **Mapa del mundo** (botón 🌍 del panel o «Más → Mapa del mundo»): la ruta de los 50 países y el personaje de cada uno en el país donde está.
  Se puede acercar a cada continente y, al tocar a un viajero, se abre su perfil. Mapa: Natural Earth (dominio público) vía world-atlas (ISC).

## Qué hace
- **Panel**: una tarjeta por persona con su personaje, sus estrellas, el país donde está, su rango y el vuelo hacia el siguiente, y el ranking de la semana.
- **Perfil**: al tocar a alguien se abre su ficha del viaje, su baúl, su racha, insignias y retos. Al final, el apartado para darle estrellas.
- **Dar puntos**: en el perfil, elige una regla. Las verdes suman y las rojas restan. Puedes dar puntos personalizados
  con un motivo libre, y deshacer al momento con el botón «Deshacer».
- **Historial**: filtra por persona, tipo y fechas. Toca un movimiento para editarlo o borrarlo. Puedes exportarlo a CSV o PDF.
- **Premios**: elige quién canjea y toca el premio. No deja canjear sin estrellas suficientes.
- **Retos**: cinco tipos (constancia, racha, semana limpia, en familia y libre), para cada niño o para todos, con estrellas
  extra configurables. Se comprueban solos y un adulto confirma antes de dar las estrellas. Al superarlos hay celebración e insignia.
- **Más**: la vuelta al mundo, historial y gráficos (días, semanas o meses), insignias, exportar, copia de seguridad y ajustes.
- **Ajustes**: miembros (con su personaje), reglas, premios y retos (crear, editar, borrar y reordenar), estrellas por país, plantillas, reinicio de puntos
  (manual, semanal o mensual), PIN parental, sonido y confeti.

## Cómo instalarla en el iPad
1. En el iPad, abre **Safari** e inicia sesión en **claude.ai** con tu cuenta.
2. Abre el enlace de la app.
3. Toca el botón **Compartir** (el cuadrado con la flecha hacia arriba) y elige **Añadir a pantalla de inicio**.
4. Ya tienes el icono en la pantalla de inicio, como cualquier otra app.

La primera vez, toca **Empezar con un ejemplo** para cargar 3 miembros, 10 reglas y 5 premios. Después ve a **Ajustes**
para poner los nombres y fotos de tu familia y **crear el PIN**, que solo deben saber los adultos.

### Dónde se guardan los datos
En tu cuenta de Claude, dentro de la propia app. No se pierden aunque borres la caché de Safari, y puedes abrirla
desde otro dispositivo con la misma cuenta. Necesita conexión a internet.

### Limitaciones de la versión web (frente a una app nativa)
- No hay vibración: Safari en iPad no la permite. En su lugar hay animaciones y sonidos.
- No hay widget en la pantalla de inicio.
- El PIN se guarda cifrado (con hash y sal) en los datos de la app, no en el llavero (Keychain) del iPad.

## Versión independiente (sin Claude)
La carpeta `docs/` contiene una versión que no depende de claude.ai. Se publica con GitHub Pages en
`https://<usuario>.github.io/family-points/`.
- Se instala desde Safari con **Compartir → Añadir a pantalla de inicio** y se abre a pantalla completa con su icono.
- Funciona **sin conexión**.
- **Con nube (Firebase)**: si existe `firebase-config.js`, la app pide entrar con la cuenta de la familia y los datos se
  guardan en internet, sincronizados entre el iPad y el iPhone. Reglas de seguridad: `firestore.rules`.
- **Sin nube**: los datos se guardan en el propio dispositivo y el iPhone y el iPad no se sincronizan entre sí.
- **Haz una copia de seguridad** de vez en cuando en **Ajustes → Datos → Guardar copia**. Si borras el icono de la
  pantalla de inicio, iOS borra también sus datos. Con **Restaurar copia** los recuperas o los pasas a otro dispositivo.

## Para desarrolladores
```bash
npm test        # tests unitarios de la lógica (saldo, canjes, reinicios, PIN…)
npm run e2e     # prueba completa en un iPad simulado con Chromium + Playwright
npm run build   # regenera docs/ (versión independiente)
npm run e2e:standalone  # prueba docs/ por HTTP: recorrido, instalación, sin conexión y copias
```
Los detalles de arquitectura están en `CLAUDE.md`.
