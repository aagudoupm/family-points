# Family Points

Estrellas por portarse bien y premios para canjearlas. Pensada para usarla en familia sobre el iPad.

## Qué hace
- **Panel**: una tarjeta grande por persona con su saldo de estrellas, y el ranking de la semana (de lunes a domingo).
- **Dar puntos**: toca a alguien y elige una regla. Las verdes suman y las rojas restan. Puedes dar puntos personalizados
  con un motivo libre, y deshacer al momento con el botón «Deshacer».
- **Historial**: filtra por persona, tipo y fechas. Toca un movimiento para editarlo o borrarlo. Puedes exportarlo a CSV o PDF.
- **Premios**: elige quién canjea y toca el premio. No deja canjear sin estrellas suficientes.
- **Estadísticas**: puntos por semana o por mes de cada persona y lo que más se repite.
- **Ajustes**: miembros, reglas y premios (crear, editar, borrar y reordenar), plantillas, reinicio de puntos
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

## Para desarrolladores
```bash
npm test        # tests unitarios de la lógica (saldo, canjes, reinicios, PIN…)
npm run e2e     # prueba completa en un iPad simulado con Chromium + Playwright
```
Los detalles de arquitectura están en `CLAUDE.md`.
