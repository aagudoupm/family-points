// Family Points — interfaz. Depende de logic.js (window.FP).
(function () {
  'use strict';
  const FP = window.FP;

  // =====================================================================
  // Textos (catálogo es). Toda cadena visible pasa por t().
  // =====================================================================
  const STR = {
    appName: 'Family Points',
    loading: 'Cargando los puntos de la familia…',
    tabPanel: 'Panel', tabHistory: 'Historial', tabRewards: 'Premios', tabStats: 'Gráficos', tabSettings: 'Ajustes',
    tabChallenges: 'Retos', tabSummary: 'Resumen', tabMore: 'Más', openSettings: 'Abrir ajustes',
    viewHistory: 'Historial', viewStats: 'Gráficos', viewCatalog: 'Catálogo', viewRedemptions: 'Canjes', viewBadges: 'Insignias',
    // Retos
    challengesTitle: 'Retos', challengesSub: 'Se comprueban solos con los puntos de cada día',
    typeCount: 'Constancia', typeStreak: 'Racha', typeClean: 'Semana limpia', typeFamily: 'En familia', typeFree: 'Libre',
    typeHelpCount: 'Hacer una regla varias veces en la semana.', typeHelpStreak: 'Hacer una regla varios días seguidos.',
    typeHelpClean: 'Que una regla negativa no ocurra en toda la semana. Se comprueba el domingo por la noche.',
    typeHelpFamily: 'Entre todos, conseguir un número de estrellas en la semana.', typeHelpFree: 'Un objetivo especial. Lo marca un adulto cuando se consiga.',
    newChallenge: 'Nuevo reto', editChallenge: 'Editar reto',
    challengeType: 'Tipo de reto', challengeRule: 'Regla', noRuleOfType: 'Primero crea una regla de ese tipo en Ajustes.', chooseRule: 'Elige una regla',
    targetCount: 'Veces en la semana', targetStreak: 'Días seguidos', targetFamily: 'Estrellas entre todos',
    bonusStars: 'Estrellas extra al conseguirlo', bonusStarsFamily: 'Estrellas extra para cada uno',
    familyReward: 'Premio familiar (opcional)', familyRewardPh: 'Por ejemplo: noche de pizza',
    titleAuto: 'Título (si lo dejas vacío se pone solo)', forWhom: 'Para quién', allKids: 'Todos los niños',
    duration: 'Duración', periodWeekly: 'Cada semana', periodWeek: 'Solo esta semana', periodOpen: 'Sin fecha',
    challengeActive: 'Reto activo', paused: 'Pausado', idea: 'Idea',
    statusActive: 'En curso', statusReady: '¡Conseguido!', statusConfirmed: 'Superado', statusDismissed: 'No contado', statusFailed: 'Esta semana no',
    progCount: v => v.value + ' de ' + v.target, progStreak: v => v.value + ' de ' + v.target + ' días',
    progClean: v => v.failed ? 'Ha pasado esta semana' : v.value + ' de 7 días', progFamily: v => v.value + ' de ' + v.target + ' ⭐', progFree: 'Lo marca un adulto',
    markDone: '¡Conseguido!', confirmNow: 'Confirmar',
    pendingBanner: v => v.n === 1 ? 'Hay 1 reto conseguido esperando confirmación' : 'Hay ' + v.n + ' retos conseguidos esperando confirmación', review: 'Revisar',
    pendingTitle: 'Retos conseguidos', pendingNone: 'No hay retos pendientes de confirmar',
    confirmBtn: 'Confirmar', dismissBtn: 'No contar', lastWeek: 'Semana pasada', thisWeekL: 'Esta semana', noDate: 'Sin fecha',
    freeDoneQ: v => '¿Ha conseguido ' + v.name + ' «' + v.title + '»?', freeDoneBody: 'Al confirmarlo recibirá la insignia y las estrellas extra.',
    celebrateTitle: '¡Reto superado!', newBadge: 'Nueva insignia', plusStarsEach: v => '+' + v.n + ' estrellas' + (v.many ? ' para cada uno' : ''),
    familyPrize: v => 'Premio familiar: ' + v.reward, great: '¡Genial!', dismissed: 'Reto no contado',
    noChallenges: 'Todavía no hay retos esta semana', noChallengesSub: 'Crea uno o empieza con los de ejemplo.', forAll: 'Para todos',
    exampleChallenges: 'Crear retos de ejemplo', exampleReward: 'Noche de peli en familia',
    cardChallenges: v => '🏆 ' + v.done + '/' + v.total, challengeRowLabel: v => v.name + ': ' + v.status + ', ' + v.prog,
    starsBonus: v => '+' + v.n + ' ⭐',
    // Insignias
    badgesTitle: 'Insignias', noBadges: 'Aún no hay insignias. ¡Supera retos para conseguirlas!', badgeLabel: v => v.title + ', conseguida ' + v.n + (v.n === 1 ? ' vez' : ' veces'),
    removeBadge: 'Quitar insignia', removeBadgeQ: v => '¿Quitar una insignia «' + v.title + '»?', removeBadgeBody: 'También se quitan las estrellas extra que dio.', badgeRemoved: 'Insignia quitada',
    // Más
    moreTitle: 'Más', moreSound: 'Sonido', moreBackup: 'Guardar copia',
    hello: '¡Hola, familia!',
    tapToGive: 'Toca a alguien para darle puntos',
    stars: v => v.n === 1 || v.n === -1 ? v.n + ' estrella' : v.n + ' estrellas',
    thisWeek: v => (v.n > 0 ? '+' : '') + v.n + ' esta semana',
    cardLabel: v => v.name + ', ' + v.stars + '. Toca para dar puntos',
    weekRanking: 'Ranking de la semana',
    sinceMonday: 'Desde el lunes',
    rankItem: v => 'Puesto ' + v.pos + ': ' + v.name + ', ' + v.pts + ' puntos esta semana',
    noMembers: 'Aún no hay nadie en la familia',
    addFirstMember: 'Añade miembros en Ajustes',
    goSettings: 'Ir a Ajustes',
    soundOn: 'Sonido activado', soundOff: 'Sonido desactivado',
    close: 'Cerrar', cancel: 'Cancelar', save: 'Guardar', delete: 'Borrar', add: 'Añadir', edit: 'Editar', undo: 'Deshacer', confirm: 'Confirmar',
    good: '¡Bien hecho!', bad: 'A mejorar',
    ruleLabel: v => v.title + ', ' + (v.points > 0 ? 'más ' : 'menos ') + Math.abs(v.points) + (Math.abs(v.points) === 1 ? ' punto' : ' puntos'),
    noRules: 'No hay reglas de este tipo',
    customPoints: 'Otros puntos', customReason: 'Motivo', customReasonPh: 'Por ejemplo: ayudó a la abuela',
    givePoints: 'Dar puntos', removePoints: 'Quitar puntos',
    pointsDelta: v => (v.n > 0 ? '+' : '') + v.n,
    gave: v => v.name + ': ' + (v.n > 0 ? '+' : v.n < 0 ? '−' : '') + Math.abs(v.n) + ' · ' + v.title,
    undone: 'Deshecho',
    milestone: v => '¡' + v.name + ' ha llegado a ' + v.n + ' estrellas!',
    lessPts: 'Menos puntos', morePts: 'Más puntos',
    // Historial
    historyTitle: 'Historial', everyone: 'Todos',
    typeAll: 'Todo', typePos: 'Positivos', typeNeg: 'Negativos', typeReward: 'Canjes', typeReset: 'Reinicios',
    rangeToday: 'Hoy', range7: '7 días', range30: '30 días', rangeAll: 'Siempre', rangeCustom: 'Elegir fechas',
    from: 'Desde', to: 'Hasta',
    today: 'Hoy', yesterday: 'Ayer',
    noHistory: 'No hay movimientos con estos filtros',
    historyRow: v => v.name + ', ' + v.title + ', ' + v.pts + ' puntos, ' + v.time + '. Toca para editar',
    editMovement: 'Editar movimiento', redemptionTitle: 'Canje', resetTitle: 'Reinicio',
    concept: 'Concepto', note: 'Nota (opcional)', member: 'Miembro', points: 'Puntos',
    deleted: 'Movimiento borrado', saved: 'Guardado',
    cancelRedemption: 'Anular canje', redemptionCancelled: 'Canje anulado, estrellas devueltas',
    deleteReset: 'Borrar reinicio',
    exportCSV: 'Exportar CSV', exportPDF: 'Exportar PDF',
    // Recompensas
    rewardsTitle: 'Premios', whoRedeems: '¿Quién canjea?',
    missing: v => 'Faltan ' + v.n,
    redeem: 'Canjear', redeemQ: v => '¿Canjear «' + v.title + '»?',
    redeemBody: v => v.name + ' usará ' + v.cost + ' estrellas. Le quedarán ' + v.left + '.',
    redeemed: v => '¡' + v.name + ' ha canjeado ' + v.title + '!',
    notEnough: v => 'A ' + v.name + ' le faltan ' + v.n + ' estrellas',
    rewardLabel: v => v.title + ', cuesta ' + v.cost + ' estrellas' + (v.ok ? '' : ', faltan ' + v.missing),
    noRewards: 'No hay premios activos', recentRedemptions: 'Últimos canjes', noRedemptions: 'Todavía no hay canjes',
    // Estadísticas
    statsTitle: 'Gráficos', days: 'Días', weeks: 'Semanas', months: 'Meses',
    evolution: 'Puntos por periodo', evolutionSubD: 'Puntos netos de cada día (últimos 30)', evolutionSubW: 'Puntos netos de cada semana (últimas 8)', evolutionSubM: 'Puntos netos de cada mes (últimos 6)',
    topBehaviors: 'Lo que más se repite', topSub: 'En el mismo periodo',
    earned: 'Ganados', lost: 'Perdidos', redemptionsN: 'Canjes',
    showTable: 'Ver tabla', hideTable: 'Ocultar tabla', period: 'Periodo',
    noStats: 'Aún no hay datos. Da puntos y aquí verás la evolución.',
    times: v => v.n + (v.n === 1 ? ' vez' : ' veces'),
    chartLabel: 'Gráfico de líneas con los puntos netos por periodo de cada miembro',
    // Ajustes
    settingsTitle: 'Ajustes', members: 'Miembros', rules: 'Reglas', rewards: 'Premios',
    child: 'Niño/a', adult: 'Adulto',
    newMember: 'Nuevo miembro', editMember: 'Editar miembro', name: 'Nombre', avatar: 'Avatar', color: 'Color', role: 'Rol',
    photo: 'Usar foto', removePhoto: 'Quitar foto', otherEmoji: 'Otro emoji',
    newRule: 'Nueva regla', editRule: 'Editar regla', title: 'Título', icon: 'Icono', category: 'Categoría', positive: 'Positiva', negative: 'Negativa',
    newReward: 'Nuevo premio', editReward: 'Editar premio', cost: 'Coste en estrellas', active: 'Disponible para canjear', inactive: 'Oculto',
    moveUp: v => 'Subir ' + v.name, moveDown: v => 'Bajar ' + v.name, editItem: v => 'Editar ' + v.name,
    deleteQ: v => '¿Borrar «' + v.name + '»?',
    deleteMemberBody: 'Su historial se conservará, pero dejará de aparecer en el panel.',
    deleteBody: 'Esta acción no se puede deshacer.',
    templates: 'Plantillas', templatesTitle: 'Añadir desde plantillas', addSelected: v => 'Añadir ' + v.n,
    templatesEmpty: 'Ya tienes todas las plantillas',
    resetTitleS: 'Reinicio de puntos', resetManual: 'Manual', resetWeekly: 'Cada semana', resetMonthly: 'Cada mes',
    resetNoteManual: 'Los puntos solo vuelven a cero cuando pulsas «Reiniciar ahora».',
    resetNoteWeekly: 'Cada lunes los saldos vuelven a cero. El historial se conserva.',
    resetNoteMonthly: 'El día 1 de cada mes los saldos vuelven a cero. El historial se conserva.',
    resetNow: 'Reiniciar ahora', resetQ: '¿Poner todos los saldos a cero?',
    resetBody: 'Se añadirá un movimiento «Reinicio» a cada miembro. El historial se conserva.',
    resetDone: 'Saldos reiniciados', autoResetDone: 'Nuevo periodo: saldos reiniciados',
    security: 'PIN parental', pinNone: 'Sin PIN: cualquiera puede cambiar reglas y canjear premios.',
    pinSet: 'PIN activo. Se pide para Ajustes, editar el historial y canjear.',
    createPin: 'Crear PIN', changePin: 'Cambiar PIN', removePin: 'Quitar PIN', lockNow: 'Bloquear ahora',
    pinForPoints: 'Pedir PIN también para dar puntos',
    pinBanner: 'Crea un PIN para que solo los adultos puedan cambiar reglas y canjear premios.',
    pinEnter: 'Introduce el PIN', pinNew: 'Elige un PIN de 4 cifras', pinRepeat: 'Repite el PIN',
    pinWrong: 'PIN incorrecto', pinMismatch: 'No coinciden. Vuelve a empezar.', pinWait: v => 'Demasiados intentos. Espera ' + v.n + ' s.',
    pinSaved: 'PIN guardado', pinRemoved: 'PIN quitado', locked: 'Bloqueado',
    digit: v => 'Cifra ' + v.n, backspace: 'Borrar cifra',
    effects: 'Sonido y efectos', sounds: 'Sonidos', confetti: 'Confeti',
    data: 'Datos', clearHistory: 'Borrar todo el historial', clearQ: '¿Borrar todo el historial?',
    clearBody: 'Se borran todos los movimientos y canjes y los saldos quedan a cero. Exporta antes si quieres conservarlo.',
    cleared: 'Historial borrado',
    storeCloud: 'Los datos se guardan en tu cuenta de Claude.',
    storeFirebase: v => 'Los datos se guardan en la nube de la familia (' + v.email + ') y se sincronizan entre dispositivos.',
    logout: 'Cerrar sesión', logoutQ: '¿Cerrar sesión en este dispositivo?', logoutBody: 'Los datos siguen guardados en la nube. Para volver a verlos, entra con el mismo correo y contraseña.',
    loginTitle: 'Family Points', loginText: 'Entra con la cuenta de la familia. Usa la misma en el iPad y en el iPhone para ver los mismos puntos.',
    registerText: 'Crea la cuenta de la familia. Después entra con ella en cada dispositivo.',
    email: 'Correo electrónico', password: 'Contraseña', password2: 'Repite la contraseña',
    login: 'Entrar', register: 'Crear la cuenta', toRegister: 'Primera vez: crear la cuenta de la familia', toLogin: 'Ya tengo cuenta: entrar',
    forgot: 'He olvidado la contraseña', resetSent: v => 'Te hemos enviado un correo a ' + v.email + ' para cambiar la contraseña.',
    needEmail: 'Escribe primero tu correo', pwMismatch: 'Las contraseñas no coinciden',
    authWrong: 'Correo o contraseña incorrectos', authExists: 'Ya existe una cuenta con ese correo. Entra con ella.',
    authWeak: 'La contraseña debe tener al menos 6 caracteres', authEmail: 'Ese correo no es válido',
    authNet: 'No hay conexión. Prueba de nuevo cuando tengas internet.', authMany: 'Demasiados intentos. Espera unos minutos.', authOther: 'No se ha podido entrar. Prueba de nuevo.',
    needOnline: 'La primera vez necesitas conexión a internet para abrir la app.', retry: 'Reintentar',
    storeLocal: 'Los datos se guardan en este dispositivo. Haz una copia de seguridad de vez en cuando.',
    backupTitle: 'Copia de seguridad', backupSave: 'Guardar copia', backupRestore: 'Restaurar copia',
    backupNote: 'Guarda un archivo con todos los datos. Sirve para no perderlos o para pasarlos a otro dispositivo.',
    restoreQ: '¿Restaurar esta copia?', restoreBody: v => 'Se sustituirán todos los datos actuales por los de la copia (' + v.members + ' miembros, ' + v.moves + ' movimientos).',
    restoreOk: 'Restaurar', restored: 'Copia restaurada',
    exportUnavailable: 'La descarga no está disponible aquí. Copia el texto:', copy: 'Copiar', copied: 'Copiado',
    exportDone: 'Archivo listo', exportError: 'No se pudo exportar',
    saveError: 'No se pudo guardar. Revisa la conexión.', quotaError: 'Se ha llenado el espacio. Borra historial antiguo.',
    // Bienvenida
    welcomeTitle: 'Family Points', welcomeText: 'Estrellas por portarse bien, premios para canjearlas. Empieza con un ejemplo y cámbialo a tu gusto.',
    startExample: 'Empezar con un ejemplo', startEmpty: 'Empezar desde cero',
    required: 'Escribe un nombre'
  };
  function t(key, vars) {
    const s = STR[key];
    if (typeof s === 'function') return s(vars || {});
    return s == null ? key : s;
  }

  // =====================================================================
  // Utilidades DOM
  // =====================================================================
  const $ = sel => document.querySelector(sel);
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    if (props) {
      for (const k in props) {
        const v = props[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'style') { for (const p in v) el.style.setProperty(p, v[p]); }
        else if (k === 'html') el.innerHTML = v;
        else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
        else if (k === 'value') el.value = v;
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : String(kid));
    }
    return el;
  }
  // Sustituye el contenido de un elemento ignorando los huecos vacíos (null/false), que si no se verían como «null».
  function fill(el, ...kids) { el.replaceChildren(...kids.flat(Infinity).filter(k => k != null && k !== false)); }
  const ICONS = {
    star: '<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.6l2.85 5.95 6.55.9-4.78 4.55 1.2 6.5L12 17.38 6.18 20.5l1.2-6.5L2.6 9.45l6.55-.9z"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/></svg>',
    history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3 4v4h4"/><path d="M12 7.5V12l3 2"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20"/><path d="M12 8.5S10.5 4 8 4.5 7 8.5 12 8.5zM12 8.5s1.5-4.5 4-4 1 4-4 4z"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V4"/><path d="M4 20h16"/><path d="m7 15 4-4 3 3 5-6"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></svg>',
    soundOn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    soundOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5v1.5A3 3 0 0 0 8 10.5M16 6h3v1.5a3 3 0 0 1-3 3"/><path d="M12 13v4M8.5 20.5h7M9.5 17h5v3.5h-5z"/></svg>',
    dots: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'
  };
  const icon = (name, cls) => h('span', { class: cls || '', html: ICONS[name], 'aria-hidden': 'true', style: { display: 'inline-flex' } });

  const fmtDay = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const fmtTime = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' });
  const fmtShort = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' });
  const fmtMonth = new Intl.DateTimeFormat('es-ES', { month: 'short' });
  const fmtMonthLong = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
  const signed = n => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  function dayLabel(t0) {
    const d = FP.dayStart(t0), today = FP.dayStart(Date.now());
    if (d === today) return t('today');
    if (d === FP.dayStart(today - 3600e3 * 12)) return t('yesterday');
    return cap(fmtDay.format(t0));
  }
  const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =====================================================================
  // Estado y persistencia
  // =====================================================================
  function defaultSettings() {
    return { resetMode: 'manual', lastResetKey: '', sound: true, confetti: true, pinForPoints: false, pinHash: '', pinSalt: '', onboarded: false,
    };
  }
  const S = {
    members: new Map(), rules: new Map(), rewards: new Map(), challenges: new Map(), logs: new Map(),
    settings: defaultSettings(),
    loaded: new Set(), ready: false, mode: 'loading',
    tab: 'panel', unlockedUntil: 0,
    hist: { memberId: '', type: 'all', range: '30', from: '', to: '' },
    stats: { gran: 'week', memberId: '', table: false },
    summaryView: 'history', rewardsView: 'catalog', chalMember: '',
    redeemMember: ''
  };
  let DB = null;

  const sorted = map => [...map.values()].sort((a, b) => (a.order || 0) - (b.order || 0) || String(a.id).localeCompare(String(b.id)));
  const members = () => sorted(S.members);
  const rules = () => sorted(S.rules);
  const rewards = () => sorted(S.rewards);
  function movements() { const out = []; for (const l of S.logs.values()) out.push(...(l.movements || [])); return out; }
  function redemptions() { const out = []; for (const l of S.logs.values()) out.push(...(l.redemptions || [])); return out; }
  function achievements() { const out = []; for (const l of S.logs.values()) out.push(...(l.achievements || [])); return out; }
  const challengesList = () => sorted(S.challenges);
  function balanceOf(id) { return FP.balance(id, movements(), redemptions()); }

  // Cola de escritura: una escritura a la vez por documento, siempre con el último estado.
  const pending = new Map(), running = new Set();
  const busy = path => pending.has(path) || running.has(path);
  function persist(path, getData) { pending.set(path, getData); if (!running.has(path)) drain(path); }
  async function drain(path) {
    running.add(path);
    try {
      while (pending.has(path)) {
        const get = pending.get(path); pending.delete(path);
        const data = get();
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            if (data == null) await DB.doc(path).delete(); else await DB.doc(path).set(data);
            break;
          } catch (e) {
            const code = e && e.code;
            if (code === 'unavailable' && attempt === 0) { await new Promise(r => setTimeout(r, 600 + Math.random() * 900)); continue; }
            toast(code === 'quota_exceeded' ? t('quotaError') : t('saveError'));
            console.error('Error al guardar', path, e);
            break;
          }
        }
      }
    } finally { running.delete(path); }
  }
  const clone = o => JSON.parse(JSON.stringify(o));
  function saveItem(coll, item) { S[coll].set(item.id, item); persist(coll + '/' + item.id, () => S[coll].has(item.id) ? clone(S[coll].get(item.id)) : null); changed(); }
  function deleteItem(coll, id) { S[coll].delete(id); persist(coll + '/' + id, () => S[coll].has(id) ? clone(S[coll].get(id)) : null); changed(); }
  function saveSettings(patch) { Object.assign(S.settings, patch); persist('config/settings', () => clone(S.settings)); changed(); }
  function logFor(key) {
    if (!S.logs.has(key)) S.logs.set(key, { movements: [], redemptions: [], achievements: [] });
    const l = S.logs.get(key); if (!l.achievements) l.achievements = [];
    return l;
  }
  function persistLog(key) {
    persist('log/' + key, () => {
      const l = S.logs.get(key);
      const ach = (l && l.achievements) || [];
      return l && (l.movements.length || l.redemptions.length || ach.length) ? clone({ movements: l.movements, redemptions: l.redemptions, achievements: ach }) : null;
    });
  }
  function addAchievement(a) { const k = FP.monthKey(a.date); logFor(k).achievements.push(a); persistLog(k); changed(); }
  function removeAchievement(id) {
    for (const [k, l] of S.logs) {
      const i = (l.achievements || []).findIndex(a => a.id === id);
      if (i >= 0) { const a = l.achievements.splice(i, 1)[0]; persistLog(k); changed(); return a; }
    }
    return null;
  }
  function addMovement(mv) { const k = FP.monthKey(mv.date); logFor(k).movements.push(mv); persistLog(k); changed(); }
  function addRedemption(r) { const k = FP.monthKey(r.date); logFor(k).redemptions.push(r); persistLog(k); changed(); }
  function findEntry(id) {
    for (const [k, l] of S.logs) {
      let i = l.movements.findIndex(m => m.id === id);
      if (i >= 0) return { key: k, list: 'movements', i, item: l.movements[i] };
      i = l.redemptions.findIndex(m => m.id === id);
      if (i >= 0) return { key: k, list: 'redemptions', i, item: l.redemptions[i] };
    }
    return null;
  }
  function removeEntry(id) {
    const f = findEntry(id); if (!f) return null;
    S.logs.get(f.key)[f.list].splice(f.i, 1); persistLog(f.key); changed();
    return f;
  }
  function restoreEntry(f) { logFor(f.key)[f.list].push(f.item); persistLog(f.key); changed(); }
  function updateMovement(id, patch) {
    const f = findEntry(id); if (!f) return;
    Object.assign(f.item, patch); persistLog(f.key); changed();
  }

  // Almacén local (si no hay base de datos de Claude): misma interfaz mínima.
  function localDB() {
    const KEY = 'familypoints.v1';
    let mem = {};
    try { mem = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { mem = {}; }
    const subs = new Set();
    const write = () => { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* sin almacenamiento */ } };
    const snapFor = coll => {
      const depth = coll.split('/').length + 1;
      const docs = Object.keys(mem).filter(p => p.startsWith(coll + '/') && p.split('/').length === depth)
        .map(p => ({ id: p.split('/').pop(), exists: true, data: () => mem[p] }));
      return { docs, size: docs.length, empty: !docs.length, metadata: { fromCache: false, hasPendingWrites: false }, docChanges: () => [] };
    };
    const notify = () => subs.forEach(s => setTimeout(() => s.next(snapFor(s.coll)), 0));
    return {
      doc: path => ({
        set: async d => { mem[path] = clone(d); write(); notify(); },
        delete: async () => { delete mem[path]; write(); notify(); }
      }),
      collection: coll => ({
        onSnapshot(next) { const s = { coll, next }; subs.add(s); setTimeout(() => next(snapFor(coll)), 0); return () => subs.delete(s); }
      })
    };
  }

  function applySnapshot(coll, snap) {
    if (coll === 'config') {
      for (const d of snap.docs) if (d.id === 'settings' && !busy('config/settings')) Object.assign(S.settings, d.data());
    } else if (coll === 'log') {
      const next = new Map();
      for (const d of snap.docs) {
        if (busy('log/' + d.id)) continue;
        const v = d.data() || {};
        next.set(d.id, { movements: clone(v.movements || []), redemptions: clone(v.redemptions || []), achievements: clone(v.achievements || []) });
      }
      for (const [k, l] of S.logs) if (busy('log/' + k)) next.set(k, l);
      S.logs = next;
    } else {
      const next = new Map();
      for (const d of snap.docs) { if (!busy(coll + '/' + d.id)) next.set(d.id, Object.assign(clone(d.data() || {}), { id: d.id })); }
      for (const [id, it] of S[coll]) if (busy(coll + '/' + id)) next.set(id, it);
      S[coll] = next;
    }
    // Solo damos por cargada una colección cuando llega la versión del servidor (o si no hay conexión),
    // para no mostrar la bienvenida ni reiniciar puntos con datos incompletos de la caché.
    if (!(snap.metadata && snap.metadata.fromCache) || navigator.onLine === false) markLoaded(coll);
    changed();
  }
  function markLoaded(coll) {
    S.loaded.add(coll);
    if (!S.ready && S.loaded.size === COLLS.length) { S.ready = true; onReady(); }
  }

  const COLLS = ['members', 'rules', 'rewards', 'challenges', 'log', 'config'];
  let unsubs = [], loadTimer = null;
  function subscribeAll() {
    unsubs = COLLS.map(coll => DB.collection(coll).onSnapshot(snap => applySnapshot(coll, snap), err => {
      console.error('Suscripción', coll, err);
      if (!S.loaded.has(coll)) { markLoaded(coll); changed(); }
    }));
    // Si el servidor tarda demasiado, seguimos con lo que haya
    clearTimeout(loadTimer);
    loadTimer = setTimeout(() => { COLLS.forEach(c => { if (!S.loaded.has(c)) markLoaded(c); }); changed(); }, 8000);
  }
  function unsubscribeAll() {
    unsubs.forEach(u => { try { u(); } catch (e) { /* ya cerrada */ } });
    unsubs = []; clearTimeout(loadTimer);
    S.members = new Map(); S.rules = new Map(); S.rewards = new Map(); S.challenges = new Map(); S.logs = new Map();
    S.settings = defaultSettings(); S.unlockedUntil = 0;
    S.loaded = new Set(); S.ready = false; shown.clear();
  }

  // Nube propia de la familia (Firebase), solo en la versión independiente
  const FB_CONFIG = window.FP_FIREBASE || null;
  function startFirebase() {
    if (!window.firebase) { S.mode = 'firebase'; S.auth = 'noscript'; render(); return; }
    if (!firebase.apps.length) firebase.initializeApp(FB_CONFIG);
    const fs = firebase.firestore();
    try { fs.enablePersistence({ synchronizeTabs: true }).catch(() => {}); } catch (e) { /* sin caché sin conexión */ }
    S.mode = 'firebase'; S.auth = 'checking';
    firebase.auth().onAuthStateChanged(user => {
      unsubscribeAll();
      if (user) {
        S.auth = 'in'; S.user = { email: user.email || '' };
        // Cada cuenta familiar tiene su propio espacio: users/{uid}/...
        const base = 'users/' + user.uid + '/';
        DB = { doc: p => fs.doc(base + p), collection: c => fs.collection(base + c) };
        subscribeAll();
      } else { S.auth = 'out'; S.user = null; DB = null; S.tab = 'panel'; }
      renderNav(); render();
    });
  }

  async function init() {
    renderNav();
    let db = null;
    try { if (window.claude && typeof window.claude.use === 'function') db = await window.claude.use('db'); } catch (e) { db = null; }
    if (db) { DB = db; S.mode = 'cloud'; subscribeAll(); return; }
    if (FB_CONFIG) { startFirebase(); return; }
    DB = localDB(); S.mode = 'local';
    // Pide al sistema que no borre los datos locales por falta de espacio
    if (navigator.storage && navigator.storage.persist) { try { navigator.storage.persist(); } catch (e) { /* opcional */ } }
    subscribeAll();
  }

  function onReady() {
    // La ruleta se eliminó: se borran las ideas que quedaran guardadas en el bote
    challengesList().filter(c => c.pool).forEach(c => deleteItem('challenges', c.id));
    // Reinicio automático semanal o mensual
    const due = FP.dueAutoReset(S.settings, Date.now());
    if (due) {
      FP.resetMovements(members(), movements(), redemptions(), due.at).forEach(m => addMovement(m));
      saveSettings({ lastResetKey: due.key });
      toast(t('autoResetDone'));
    }
  }

  // =====================================================================
  // Sonidos, confeti y animaciones
  // =====================================================================
  const Sound = {
    ctx: null,
    play(kind) {
      if (!S.settings.sound) return;
      try {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const seqs = {
          plus: [[660, 0], [990, .08]], minus: [[392, 0], [262, .12]],
          redeem: [[523, 0], [659, .09], [784, .18], [1047, .27]], milestone: [[784, 0], [988, .1], [1175, .2], [1568, .3]],
          challenge: [[523, 0], [659, .1], [784, .2], [1047, .32], [1319, .46], [1568, .6]]
        };
        const now = this.ctx.currentTime, len = .28, vol = .16;
        for (const [f, at] of seqs[kind] || []) {
          const o = this.ctx.createOscillator(), g = this.ctx.createGain();
          o.type = kind === 'minus' ? 'triangle' : 'sine';
          o.frequency.value = f;
          g.gain.setValueAtTime(0.0001, now + at);
          g.gain.exponentialRampToValueAtTime(vol, now + at + .01);
          g.gain.exponentialRampToValueAtTime(0.0001, now + at + len);
          o.connect(g).connect(this.ctx.destination);
          o.start(now + at); o.stop(now + at + len + .02);
        }
      } catch (e) { /* sin audio */ }
    }
  };
  function haptic(ms) { try { if (navigator.vibrate) navigator.vibrate(ms || 15); } catch (e) { /* no disponible */ } }

  function confetti(amount) {
    if (!S.settings.confetti || reduceMotion()) return;
    const cv = $('#confetti'), ctx = cv.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.scale(dpr, dpr);
    const colors = ['#F5B301', '#E5603D', '#00978C', '#8452D6', '#2B7FD4', '#D6458C', '#2E9B5A'];
    const parts = Array.from({ length: amount || 110 }, () => ({
      x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .4,
      vx: (Math.random() - .5) * 13, vy: -Math.random() * 13 - 4, r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3,
      w: 6 + Math.random() * 6, hh: 8 + Math.random() * 8, c: colors[Math.floor(Math.random() * colors.length)]
    }));
    const start = performance.now();
    (function frame(now) {
      const el = now - start;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of parts) {
        p.vy += .38; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.globalAlpha = Math.max(0, 1 - el / 1800); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.hh / 2, p.w, p.hh); ctx.restore();
      }
      if (el < 1800) requestAnimationFrame(frame); else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })(start);
  }

  function floatText(text, x, y, color) {
    if (reduceMotion()) return;
    const el = h('div', { class: 'float', 'aria-hidden': 'true', style: { left: (x - 30) + 'px', top: (y - 30) + 'px', color } }, text);
    document.body.append(el);
    setTimeout(() => el.remove(), 950);
  }

  // Contador animado de saldos
  const shown = new Map();
  function animateBalances(root) {
    root.querySelectorAll('[data-balance]').forEach(el => {
      const id = el.getAttribute('data-balance'), target = Number(el.getAttribute('data-value'));
      const numEl = el.querySelector('.n');
      const from = shown.has(id) ? shown.get(id) : target;
      shown.set(id, target);
      el.classList.toggle('neg', target < 0);
      if (from === target || reduceMotion()) { numEl.textContent = target; return; }
      el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
      const t0 = performance.now(), dur = 550;
      numEl.textContent = from;
      (function step(now) {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        numEl.textContent = Math.round(from + (target - from) * e);
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
  }

  // =====================================================================
  // Toasts y hojas
  // =====================================================================
  let toastTimer = null;
  function toast(msg, action, ms) {
    const root = $('#toasts');
    root.replaceChildren();
    clearTimeout(toastTimer);
    const el = h('div', { class: 'toast', role: 'status' }, h('span', null, msg),
      action ? h('button', { type: 'button', onclick: () => { root.replaceChildren(); action.fn(); } }, action.label) : null);
    root.append(el);
    toastTimer = setTimeout(() => el.remove(), ms || (action ? 6000 : 2800));
  }

  const sheetStack = [];
  let sheetSeq = 0;
  function openSheet(opts) {
    const opener = document.activeElement;
    const id = 'sheet-title-' + (++sheetSeq);
    const overlay = h('div', { class: 'overlay' });
    const sheet = h('div', { class: 'sheet' + (opts.wide ? ' wide' : ''), role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': id });
    const ctx = { titleId: id, sheet, update: null, closed: false, close };
    function close(result) {
      if (ctx.closed) return;
      ctx.closed = true; overlay.remove();
      const i = sheetStack.indexOf(ctx); if (i >= 0) sheetStack.splice(i, 1);
      setInert();
      if (opts.onClose) opts.onClose(result);
      if (opener && opener.focus && document.contains(opener)) opener.focus();
    }
    sheet.append(...[].concat(opts.build(ctx)).filter(x => x != null && x !== false));
    overlay.append(sheet);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    $('#sheets').append(overlay);
    sheetStack.push(ctx);
    setInert();
    const first = sheet.querySelector('[autofocus]') || sheet.querySelector('h2');
    if (first) { if (!first.hasAttribute('tabindex') && first.tagName === 'H2') first.setAttribute('tabindex', '-1'); first.focus({ preventScroll: true }); }
    return ctx;
  }
  // Con una hoja abierta, el resto de la app queda fuera del alcance de VoiceOver y del teclado.
  function setInert() {
    $('.app').inert = sheetStack.length > 0;
    [...$('#sheets').children].forEach((o, i, all) => { o.inert = i < all.length - 1; });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && sheetStack.length) sheetStack[sheetStack.length - 1].close(); });
  function sheetHead(ctx, title, lead) {
    return h('div', { class: 'sheet-head' }, lead || null, h('h2', { id: ctx.titleId }, title),
      h('button', { class: 'icon-btn', type: 'button', 'aria-label': t('close'), onclick: () => ctx.close() }, icon('close')));
  }
  function confirmSheet(o) {
    return new Promise(res => openSheet({
      onClose: r => res(r === true),
      build: ctx => [
        sheetHead(ctx, o.title, o.icon ? h('span', { style: { 'font-size': '2.6rem' }, 'aria-hidden': 'true' }, o.icon) : null),
        o.body ? h('p', { class: 'sub' }, o.body) : null,
        h('div', { class: 'form-actions' },
          h('button', { class: 'btn ghost', type: 'button', onclick: () => ctx.close(false) }, t('cancel')),
          h('button', { class: 'btn ' + (o.danger ? 'bad' : 'primary'), type: 'button', autofocus: true, onclick: () => ctx.close(true) }, o.ok || t('confirm')))
      ]
    }));
  }

  // ---------- PIN ----------
  let pinFails = 0, pinBlockedUntil = 0;
  function pinSheet(mode) {
    return new Promise(res => openSheet({
      onClose: r => res(r == null ? null : r),
      build: ctx => {
        let entered = '', first = null;
        const msg = h('p', { class: 'pin-msg', role: 'alert' });
        const dots = h('div', { class: 'pin-dots', 'aria-hidden': 'true' }, [0, 1, 2, 3].map(() => h('i')));
        const title = h('h2', { id: ctx.titleId }, mode === 'create' ? t('pinNew') : t('pinEnter'));
        const paint = () => [...dots.children].forEach((d, i) => d.classList.toggle('on', i < entered.length));
        const fail = text => { msg.textContent = text; dots.classList.remove('shake'); void dots.offsetWidth; dots.classList.add('shake'); entered = ''; paint(); haptic(60); };
        async function full() {
          if (mode === 'create') {
            if (first == null) { first = entered; entered = ''; paint(); title.textContent = t('pinRepeat'); msg.textContent = ''; return; }
            if (first === entered) { ctx.close(entered); return; }
            first = null; title.textContent = t('pinNew'); fail(t('pinMismatch')); return;
          }
          if (Date.now() < pinBlockedUntil) { fail(t('pinWait', { n: Math.ceil((pinBlockedUntil - Date.now()) / 1000) })); return; }
          if (await FP.verifyPin(entered, S.settings)) { pinFails = 0; ctx.close(true); return; }
          pinFails++;
          if (pinFails >= 5) { pinBlockedUntil = Date.now() + 30000; pinFails = 0; fail(t('pinWait', { n: 30 })); }
          else fail(t('pinWrong'));
        }
        const press = d => { if (entered.length >= 4) return; entered += d; paint(); if (entered.length === 4) full(); };
        const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(k => {
          if (!k) return h('button', { class: 'blank', type: 'button', tabindex: '-1', 'aria-hidden': 'true' });
          if (k === '⌫') return h('button', { type: 'button', 'aria-label': t('backspace'), onclick: () => { entered = entered.slice(0, -1); paint(); } }, '⌫');
          return h('button', { type: 'button', 'aria-label': t('digit', { n: k }), onclick: () => press(k) }, k);
        });
        ctx.sheet.addEventListener('keydown', e => { if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') { entered = entered.slice(0, -1); paint(); } });
        return [
          h('div', { class: 'sheet-head' }, icon('lock', 'icon-btn'), title,
            h('button', { class: 'icon-btn', type: 'button', 'aria-label': t('close'), onclick: () => ctx.close() }, icon('close'))),
          dots, msg, h('div', { class: 'pin-pad' }, keys)
        ];
      }
    }));
  }
  async function requirePin() {
    if (!S.settings.pinHash) return true;
    if (Date.now() < S.unlockedUntil) return true;
    const ok = await pinSheet('verify');
    if (ok) { S.unlockedUntil = Date.now() + 3 * 60 * 1000; return true; }
    return false;
  }

  // =====================================================================
  // Render
  // =====================================================================
  let renderQueued = false;
  function changed() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => {
      renderQueued = false;
      render();
      for (const s of sheetStack) if (s.update) s.update();
    });
  }

  // Barra inferior sencilla para los niños: 4 apartados. Historial, gráficos, exportar y ajustes (cosas de adultos) van en «Más».
  // Ajustes también está en la rueda del panel y, en la barra lateral del iPad, abajo del todo.
  const TABS = [
    { id: 'panel', icon: 'home', label: 'tabPanel' },
    { id: 'challenges', icon: 'trophy', label: 'tabChallenges' },
    { id: 'rewards', icon: 'gift', label: 'tabRewards' },
    { id: 'more', icon: 'dots', label: 'tabMore' },
    { id: 'settings', icon: 'gear', label: 'tabSettings', railOnly: true }
  ];
  async function goTab(id) {
    if (id === S.tab) return;
    if (id === 'settings' && !(await requirePin())) return;
    S.tab = id;
    renderNav(); render();
    window.scrollTo(0, 0);
    $('#view').focus({ preventScroll: true });
  }
  function renderNav() {
    $('#tabs').replaceChildren(
      h('div', { class: 'brand', 'aria-hidden': 'true', html: ICONS.star }),
      ...TABS.map(tb => h('button', { class: 'tab' + (tb.railOnly ? ' rail-only' : ''), type: 'button', 'aria-current': S.tab === tb.id || (tb.id === 'more' && S.tab === 'summary') ? 'page' : null, onclick: () => goTab(tb.id) },
        icon(tb.icon), h('span', null, t(tb.label)))));
  }

  function render() {
    const view = $('#view');
    let el;
    const out = S.mode === 'firebase' && S.auth !== 'in';
    $('#tabs').hidden = out;
    if (out && S.auth === 'out') el = renderLogin();
    else if (out && S.auth === 'noscript') el = h('div', { class: 'empty', role: 'alert' }, h('div', { class: 'big', 'aria-hidden': 'true' }, '📶'), h('p', null, t('needOnline')),
      h('button', { class: 'btn primary', type: 'button', onclick: () => location.reload() }, t('retry')));
    else if (!S.ready) el = h('div', { class: 'empty', role: 'status' }, h('div', { class: 'big', 'aria-hidden': 'true' }, '⭐'), h('p', null, t('loading')));
    else if (!S.settings.onboarded && S.members.size === 0 && S.rules.size === 0) el = renderWelcome();
    else el = ({ panel: renderPanel, challenges: renderChallenges, rewards: renderRewardsTab, summary: renderSummary, more: renderMore, settings: renderSettings })[S.tab]();
    view.replaceChildren(el);
    animateBalances(view);
  }

  function avatar(m, size) {
    return h('span', { class: 'avatar' + (size ? ' ' + size : ''), style: { '--c': m.color || '#888' }, 'aria-hidden': 'true' },
      m.photo ? h('img', { src: m.photo, alt: '' }) : (m.emoji || '🙂'));
  }
  function balanceEl(m, b) {
    return h('span', { class: 'balance', 'data-balance': m.id, 'data-value': b }, icon('star'), h('span', { class: 'n' }, shown.has(m.id) ? shown.get(m.id) : b));
  }

  // ---------- Entrar (cuenta familiar en la nube) ----------
  const login = { mode: 'login', email: '', msg: '', busy: false };
  function authMessage(e) {
    const c = (e && e.code) || '';
    if (/wrong-password|user-not-found|invalid-credential|invalid-login/.test(c)) return t('authWrong');
    if (/email-already-in-use/.test(c)) return t('authExists');
    if (/weak-password/.test(c)) return t('authWeak');
    if (/invalid-email/.test(c)) return t('authEmail');
    if (/network-request-failed/.test(c)) return t('authNet');
    if (/too-many-requests/.test(c)) return t('authMany');
    return t('authOther');
  }
  function renderLogin() {
    const reg = login.mode === 'register';
    const email = h('input', { class: 'input', id: 'l-email', type: 'email', autocomplete: 'username', inputmode: 'email', autocapitalize: 'off', value: login.email });
    const pass = h('input', { class: 'input', id: 'l-pass', type: 'password', autocomplete: reg ? 'new-password' : 'current-password', minlength: '6' });
    const pass2 = reg ? h('input', { class: 'input', id: 'l-pass2', type: 'password', autocomplete: 'new-password', minlength: '6' }) : null;
    const msg = h('p', { class: 'pin-msg', role: 'alert' }, login.msg);
    const submit = async e => {
      e.preventDefault();
      if (login.busy) return;
      login.email = email.value.trim();
      if (reg && pass.value !== pass2.value) { msg.textContent = t('pwMismatch'); return; }
      login.busy = true; btn.disabled = true; msg.textContent = '';
      try {
        if (reg) await firebase.auth().createUserWithEmailAndPassword(login.email, pass.value);
        else await firebase.auth().signInWithEmailAndPassword(login.email, pass.value);
        login.msg = '';
      } catch (err) { msg.textContent = login.msg = authMessage(err); }
      login.busy = false; btn.disabled = false;
    };
    const btn = h('button', { class: 'btn primary', type: 'submit' }, reg ? t('register') : t('login'));
    return h('section', { class: 'welcome' },
      h('div', { class: 'stars', 'aria-hidden': 'true', html: ICONS.star + ICONS.star + ICONS.star }),
      h('h1', null, t('loginTitle')),
      h('p', { class: 'sub' }, reg ? t('registerText') : t('loginText')),
      h('form', { class: 'form card', style: { padding: '1.25rem', width: '100%', 'max-width': '26rem', 'text-align': 'left' }, onsubmit: submit },
        h('label', { class: 'field', for: 'l-email' }, h('span', null, t('email')), email),
        h('label', { class: 'field', for: 'l-pass' }, h('span', null, t('password')), pass),
        reg ? h('label', { class: 'field', for: 'l-pass2' }, h('span', null, t('password2')), pass2) : null,
        msg, btn,
        h('button', { class: 'btn ghost small', type: 'button', onclick: () => { login.mode = reg ? 'login' : 'register'; login.email = email.value.trim(); login.msg = ''; render(); } }, reg ? t('toLogin') : t('toRegister')),
        reg ? null : h('button', { class: 'btn small', type: 'button', style: { background: 'transparent' }, onclick: async () => {
          const em = email.value.trim(); if (!em) { msg.textContent = t('needEmail'); email.focus(); return; }
          try { await firebase.auth().sendPasswordResetEmail(em); msg.textContent = t('resetSent', { email: em }); } catch (err) { msg.textContent = authMessage(err); }
        } }, t('forgot'))));
  }

  // ---------- Bienvenida ----------
  function renderWelcome() {
    return h('section', { class: 'welcome' },
      h('div', { class: 'stars', 'aria-hidden': 'true', html: ICONS.star + ICONS.star + ICONS.star }),
      h('h1', null, t('welcomeTitle')),
      h('p', { class: 'sub' }, t('welcomeText')),
      h('div', { class: 'actions' },
        h('button', { class: 'btn primary', type: 'button', onclick: loadExample }, t('startExample')),
        h('button', { class: 'btn ghost', type: 'button', onclick: () => { saveSettings({ onboarded: true }); S.tab = 'settings'; renderNav(); } }, t('startEmpty'))));
  }
  function loadExample() {
    const d = FP.exampleData(Date.now());
    d.members.forEach(m => saveItem('members', m));
    d.rules.forEach(r => saveItem('rules', r));
    d.rewards.forEach(r => saveItem('rewards', r));
    saveSettings({ onboarded: true });
  }

  // ---------- Panel ----------
  function renderPanel() {
    const ms = members();
    const movs = movements(), reds = redemptions();
    const bal = FP.balances(ms, movs, reds);
    const rank = FP.weeklyRanking(ms, movs, Date.now());
    const week = {}; rank.forEach(r => { week[r.member.id] = r.points; });
    const head = h('div', { class: 'page-head' },
      h('div', null, h('h1', null, t('hello')), h('p', { class: 'sub' }, ms.length ? t('tapToGive') : t('addFirstMember'))),
      h('div', { class: 'chips' },
        h('button', { class: 'icon-btn', type: 'button', 'aria-pressed': S.settings.sound ? 'true' : 'false', 'aria-label': S.settings.sound ? t('soundOn') : t('soundOff'),
          onclick: () => saveSettings({ sound: !S.settings.sound }) }, icon(S.settings.sound ? 'soundOn' : 'soundOff')),
        h('button', { class: 'icon-btn', type: 'button', 'aria-label': t('openSettings'), onclick: () => goTab('settings') }, icon('gear'))));
    if (!ms.length) {
      return h('div', null, head, h('div', { class: 'empty card' }, h('div', { class: 'big', 'aria-hidden': 'true' }, '👨‍👩‍👧'), h('p', null, t('noMembers')),
        h('button', { class: 'btn primary', type: 'button', onclick: () => goTab('settings') }, t('goSettings'))));
    }
    const board = currentBoard();
    const chalCount = id => {
      let total = 0, done = 0;
      for (const b of board) for (const r of b.st.rows) if (!b.st.family && r.memberIds[0] === id) { total++; if (r.status === 'confirmed' || r.status === 'ready') done++; }
      return { total, done };
    };
    const cards = h('div', { class: 'members' }, ms.map(m => h('button', {
      class: 'mcard', type: 'button', style: { '--c': m.color },
      'aria-label': t('cardLabel', { name: m.name, stars: t('stars', { n: bal[m.id] }) }),
      onclick: () => openAssign(m)
    }, avatar(m, 'lg'), h('span', { class: 'name' }, m.name), balanceEl(m, bal[m.id]),
    h('span', { class: 'week' }, t('thisWeek', { n: week[m.id] || 0 })),
    (c => c.total ? h('span', { class: 'week' }, t('cardChallenges', c)) : null)(chalCount(m.id)))));
    const medals = ['🥇', '🥈', '🥉'];
    const ranking = h('section', { class: 'ranking', 'aria-labelledby': 'rank-h' },
      h('h2', { id: 'rank-h' }, t('weekRanking')), h('p', { class: 'sub' }, t('sinceMonday')),
      h('ol', { class: 'rank-list' }, rank.map((r, i) => h('li', { class: i === 0 && r.points > 0 ? 'first' : '', 'aria-label': t('rankItem', { pos: i + 1, name: r.member.name, pts: r.points }) },
        h('span', { class: 'rank-pos', 'aria-hidden': 'true' }, medals[i] || String(i + 1)), avatar(r.member, 'md'),
        h('span', { class: 'rank-name', 'aria-hidden': 'true' }, r.member.name),
        h('span', { class: 'rank-pts', 'aria-hidden': 'true' }, signed(r.points))))));
    return h('div', null, head, challengeBanners(), h('div', { class: 'dash' }, cards, ranking));
  }

  // ---------- Asignar puntos ----------
  async function openAssign(m) {
    if (S.settings.pinForPoints && !(await requirePin())) return;
    openSheet({
      wide: true,
      build: ctx => {
        const balBox = h('span', null);
        const paintBal = () => {
          const cur = S.members.get(m.id); if (!cur) { ctx.close(); return; }
          balBox.replaceChildren(balanceEl(cur, balanceOf(m.id))); animateBalances(balBox);
        };
        ctx.update = paintBal;
        paintBal();
        const give = (mv, btn) => {
          const before = balanceOf(m.id);
          addMovement(mv);
          const after = before + mv.points;
          Sound.play(mv.points >= 0 ? 'plus' : 'minus');
          haptic(mv.points >= 0 ? 15 : 40);
          if (btn) { const r = btn.getBoundingClientRect(); floatText(signed(mv.points), r.left + r.width / 2, r.top, mv.points >= 0 ? 'var(--good)' : 'var(--bad)'); }
          const ms = FP.milestoneCrossed(before, after, 25);
          if (ms) { setTimeout(() => { Sound.play('milestone'); confetti(80); }, 250); toast(t('milestone', { name: m.name, n: ms }), { label: t('undo'), fn: () => { removeEntry(mv.id); toast(t('undone')); } }); return; }
          toast(t('gave', { name: m.name, n: mv.points, title: mv.title }), { label: t('undo'), fn: () => { removeEntry(mv.id); toast(t('undone')); } });
        };
        const ruleBtn = r => h('button', {
          class: 'rule ' + (r.points >= 0 ? 'pos' : 'neg'), type: 'button', 'aria-label': t('ruleLabel', r),
          onclick: e => give(FP.movementFromRule(m, r, Date.now()), e.currentTarget)
        }, h('span', { class: 'ico', 'aria-hidden': 'true' }, r.icon || '⭐'), h('span', { 'aria-hidden': 'true' }, r.title), h('span', { class: 'pts', 'aria-hidden': 'true' }, signed(r.points)));
        const pos = rules().filter(r => r.points >= 0), neg = rules().filter(r => r.points < 0);
        const col = (title, list, color) => h('section', null,
          h('h3', { class: 'col-title' }, h('span', { class: 'dot', style: { background: color }, 'aria-hidden': 'true' }), title),
          list.length ? h('div', { class: 'rule-grid' }, list.map(ruleBtn)) : h('p', { class: 'sub' }, t('noRules')));

        // Puntos personalizados
        let n = 1;
        const val = h('span', { class: 'val', 'aria-live': 'polite' }, '+1');
        const reason = h('input', { class: 'input', id: 'custom-reason', type: 'text', maxlength: '60', placeholder: t('customReasonPh') });
        const go = h('button', { class: 'btn good', type: 'button' }, t('givePoints'));
        const paintN = () => { val.textContent = signed(n); go.className = 'btn ' + (n > 0 ? 'good' : 'bad'); go.textContent = n > 0 ? t('givePoints') : t('removePoints'); };
        const stepN = d => { n += d; if (n === 0) n += d; n = Math.max(-50, Math.min(50, n)); paintN(); };
        go.addEventListener('click', e => {
          const r = reason.value.trim() || (n > 0 ? t('customPoints') : t('customPoints'));
          give(FP.customMovement(m, n, r, Date.now()), e.currentTarget);
          reason.value = '';
        });
        const custom = h('details', { class: 'custom-box' },
          h('summary', { class: 'col-title', style: { cursor: 'pointer', margin: '0' } }, h('span', { 'aria-hidden': 'true' }, '✏️'), t('customPoints')),
          h('div', { class: 'stepper' },
            h('button', { type: 'button', class: 'btn', 'aria-label': t('lessPts'), onclick: () => stepN(-1) }, '−'), val,
            h('button', { type: 'button', class: 'btn', 'aria-label': t('morePts'), onclick: () => stepN(1) }, '+')),
          h('label', { class: 'field', for: 'custom-reason' }, h('span', null, t('customReason')), reason),
          h('div', null, go));
        return [
          sheetHead(ctx, m.name, avatar(m, 'md')),
          h('div', { style: { margin: '-0.5rem 0 1rem' } }, balBox),
          h('div', { class: 'assign-cols' }, col(t('good'), pos, 'var(--good)'), col(t('bad'), neg, 'var(--bad)')),
          custom
        ];
      }
    });
  }

  // ---------- Historial ----------
  function histRange() {
    const f = S.hist, now = Date.now(), today = FP.dayStart(now);
    if (f.range === 'today') return { from: today, to: null };
    if (f.range === '7') return { from: today - 6 * FP.DAY, to: null };
    if (f.range === '30') return { from: today - 29 * FP.DAY, to: null };
    if (f.range === 'custom') {
      const from = f.from ? new Date(f.from + 'T00:00').getTime() : null;
      const to = f.to ? new Date(f.to + 'T00:00').getTime() + FP.DAY : null;
      return { from, to };
    }
    return { from: null, to: null };
  }
  function currentHistory() {
    const r = histRange();
    return FP.filterHistory(FP.historyEntries(movements(), redemptions()), { memberId: S.hist.memberId, type: S.hist.type, from: r.from, to: r.to });
  }
  function memberChips(selected, onPick, withAll, extra) {
    return h('div', { class: 'chips', role: 'group', 'aria-label': t('member') },
      withAll ? h('button', { class: 'chip text', type: 'button', 'aria-pressed': !selected ? 'true' : 'false', onclick: () => onPick('') }, t('everyone')) : null,
      members().map(m => h('button', { class: 'chip', type: 'button', 'aria-pressed': selected === m.id ? 'true' : 'false', onclick: () => onPick(m.id) },
        avatar(m), m.name, extra ? extra(m) : null)));
  }
  function seg(options, value, onPick, label) {
    return h('div', { class: 'seg', role: 'group', 'aria-label': label || null },
      options.map(([v, l]) => h('button', { type: 'button', 'aria-pressed': v === value ? 'true' : 'false', onclick: () => onPick(v) }, l)));
  }
  function renderHistory() {
    const f = S.hist;
    const setF = patch => { Object.assign(f, patch); render(); };
    const entries = currentHistory();
    const names = {}; S.members.forEach(m => { names[m.id] = m; });
    const filters = h('div', { class: 'filters' },
      memberChips(f.memberId, id => setF({ memberId: id }), true),
      seg([['all', t('typeAll')], ['positive', '＋ ' + t('typePos')], ['negative', '− ' + t('typeNeg')], ['reward', '🎁 ' + t('typeReward')], ['reset', '🔄 ' + t('typeReset')]], f.type, v => setF({ type: v })),
      h('div', { class: 'date-range' },
        seg([['today', t('rangeToday')], ['7', t('range7')], ['30', t('range30')], ['all', t('rangeAll')], ['custom', t('rangeCustom')]], f.range, v => setF({ range: v })),
        f.range === 'custom' ? [
          h('label', { class: 'sr', for: 'h-from' }, t('from')),
          h('input', { class: 'input', id: 'h-from', type: 'date', value: f.from, onchange: e => setF({ from: e.target.value }) }),
          h('span', { 'aria-hidden': 'true' }, '→'),
          h('label', { class: 'sr', for: 'h-to' }, t('to')),
          h('input', { class: 'input', id: 'h-to', type: 'date', value: f.to, onchange: e => setF({ to: e.target.value }) })
        ] : null));
    const groups = [];
    let curKey = null, cur = null;
    for (const e of entries.slice(0, 400)) {
      const k = FP.dayStart(e.date);
      if (k !== curKey) { curKey = k; cur = { label: dayLabel(e.date), items: [] }; groups.push(cur); }
      cur.items.push(e);
    }
    const list = entries.length ? groups.map(g => [
      h('h2', { class: 'day-head' }, g.label),
      h('ul', { class: 'list card' }, g.items.map(e => {
        const m = names[e.memberId] || { name: '—', emoji: '❔', color: '#999', id: '' };
        const time = fmtTime.format(e.date);
        const kind = e.type === 'reward' || e.type === 'reset' ? 'neu' : (e.points >= 0 ? 'pos' : 'neg');
        return h('li', null, h('button', {
          class: 'row', type: 'button', style: { width: '100%', 'text-align': 'left' },
          'aria-label': t('historyRow', { name: m.name, title: e.title, pts: signed(e.points), time }),
          onclick: () => openEntry(e)
        }, avatar(m), h('span', { class: 'ico', 'aria-hidden': 'true' }, e.icon || '⭐'),
        h('span', { class: 'grow', 'aria-hidden': 'true' }, h('div', { class: 'title' }, e.title || '—'),
          h('div', { class: 'meta' }, [m.name, time, e.note].filter(Boolean).join(' · '))),
        h('span', { class: 'pill ' + kind, 'aria-hidden': 'true' }, signed(e.points))));
      }))
    ]) : h('div', { class: 'empty card' }, h('div', { class: 'big', 'aria-hidden': 'true' }, '🗒️'), h('p', null, t('noHistory')));
    return h('div', null,
      h('div', { class: 'page-head' }, h('h1', null, t('historyTitle')),
        h('div', { class: 'chips' },
          h('button', { class: 'btn small', type: 'button', onclick: () => exportCSV(entries) }, t('exportCSV')),
          h('button', { class: 'btn small', type: 'button', onclick: () => exportPDF(entries) }, t('exportPDF')))),
      filters, list);
  }

  async function openEntry(e) {
    if (!(await requirePin())) return;
    const f = findEntry(e.id); if (!f) return;
    const item = f.item;
    if (e.type === 'reward' || e.type === 'reset') {
      const isReward = e.type === 'reward';
      const ok = await confirmSheet({
        title: isReward ? t('redemptionTitle') + ': ' + item.title : t('resetTitle'),
        icon: item.icon, body: (S.members.get(item.memberId) || { name: '—' }).name + ' · ' + cap(fmtDay.format(item.date)) + ' ' + fmtTime.format(item.date) + ' · ' + signed(e.points),
        ok: isReward ? t('cancelRedemption') : t('deleteReset'), danger: true
      });
      if (ok) { const removed = removeEntry(e.id); toast(isReward ? t('redemptionCancelled') : t('deleted'), { label: t('undo'), fn: () => restoreEntry(removed) }); }
      return;
    }
    openSheet({
      build: ctx => {
        let pts = item.points, memberId = item.memberId;
        const val = h('span', { class: 'val' }, signed(pts));
        const step = d => { pts += d; if (pts === 0) pts += d; val.textContent = signed(pts); };
        const title = h('input', { class: 'input', id: 'e-title', type: 'text', maxlength: '60', value: item.title });
        const note = h('input', { class: 'input', id: 'e-note', type: 'text', maxlength: '120', value: item.note || '' });
        const chipsBox = h('div');
        const paintChips = () => chipsBox.replaceChildren(memberChips(memberId, id => { memberId = id; paintChips(); }, false));
        paintChips();
        return [
          sheetHead(ctx, t('editMovement'), h('span', { style: { 'font-size': '2.4rem' }, 'aria-hidden': 'true' }, item.icon)),
          h('div', { class: 'form' },
            h('p', { class: 'sub', style: { margin: 0 } }, cap(fmtDay.format(item.date)) + ' · ' + fmtTime.format(item.date)),
            h('div', { class: 'field' }, h('span', null, t('member')), chipsBox),
            h('label', { class: 'field', for: 'e-title' }, h('span', null, t('concept')), title),
            h('div', { class: 'field' }, h('span', null, t('points')), h('div', { class: 'stepper' },
              h('button', { type: 'button', class: 'btn', 'aria-label': t('lessPts'), onclick: () => step(-1) }, '−'), val,
              h('button', { type: 'button', class: 'btn', 'aria-label': t('morePts'), onclick: () => step(1) }, '+'))),
            h('label', { class: 'field', for: 'e-note' }, h('span', null, t('note')), note),
            h('div', { class: 'form-actions' },
              h('button', { class: 'btn bad', type: 'button', onclick: () => {
                ctx.close();
                const removed = removeEntry(item.id);
                const badge = item.achievementId ? removeAchievement(item.achievementId) : null;
                toast(t('deleted'), { label: t('undo'), fn: () => { restoreEntry(removed); if (badge) addAchievement(badge); } });
              } }, t('delete')),
              h('span', { class: 'spacer' }),
              h('button', { class: 'btn ghost', type: 'button', onclick: () => ctx.close() }, t('cancel')),
              h('button', { class: 'btn primary', type: 'button', onclick: () => {
                updateMovement(item.id, { points: pts, memberId, title: title.value.trim() || item.title, note: note.value.trim() });
                ctx.close(); toast(t('saved'));
              } }, t('save'))))
        ];
      }
    });
  }

  // ---------- Exportar ----------
  async function offerFile(filename, data, fallbackText) {
    let dl = null;
    try { if (window.claude && window.claude.use) dl = await window.claude.use('downloads'); } catch (e) { dl = null; }
    if (dl) {
      try { await dl.save({ filename, data }); toast(t('exportDone')); return; }
      catch (e) { if (e && e.code === 'declined') return; if (e && e.code !== 'unavailable' && e.code !== 'not_granted') { toast(t('exportError')); return; } }
    }
    if (!window.claude) {
      // Versión independiente: hoja de compartir de iOS («Guardar en Archivos») o descarga normal
      const ext = filename.split('.').pop();
      const type = { csv: 'text/csv', pdf: 'application/pdf', json: 'application/json' }[ext] || 'application/octet-stream';
      const blob = new Blob([data], { type });
      try {
        const file = new File([blob], filename, { type });
        if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file] }); return; }
      } catch (e) { if (e && e.name === 'AbortError') return; }
      try {
        const url = URL.createObjectURL(blob);
        const a = h('a', { href: url, download: filename, style: { display: 'none' } });
        document.body.append(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        toast(t('exportDone')); return;
      } catch (e) { /* sigue con el texto */ }
    }
    if (fallbackText == null) { toast(t('exportError')); return; }
    openSheet({
      build: ctx => {
        const ta = h('textarea', { class: 'input', id: 'export-text', rows: '10', readonly: true, style: { 'font-family': 'ui-monospace, monospace', 'font-size': '.8rem' } });
        ta.value = fallbackText;
        return [sheetHead(ctx, filename), h('p', { class: 'sub' }, t('exportUnavailable')), ta,
          h('div', { class: 'form-actions' }, h('button', { class: 'btn primary', type: 'button', onclick: () => {
            navigator.clipboard.writeText(fallbackText).then(() => toast(t('copied')), () => { ta.focus(); ta.select(); });
          } }, t('copy')))];
      }
    });
  }
  function exportCSV(entries) {
    const csv = FP.toCSV(entries, members());
    offerFile('family-points-' + FP.ymd(Date.now()) + '.csv', csv, csv);
  }
  function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.append(s); });
  }
  async function exportPDF(entries) {
    try {
      if (!window.jspdf) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const clean = s => String(s == null ? '' : s).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}️‍\u{E0000}-\u{E007F}]/gu, '').replace(/\s+/g, ' ').trim();
      const names = {}; S.members.forEach(m => { names[m.id] = m.name; });
      const typeL = { positive: 'Positivo', negative: 'Negativo', reward: 'Canje', reset: 'Reinicio' };
      const cols = [[12, 'Fecha'], [40, 'Hora'], [58, 'Miembro'], [100, 'Tipo'], [130, 'Concepto'], [230, 'Puntos'], [250, 'Nota']];
      let y = 18;
      const headRow = () => { doc.setFont('helvetica', 'bold'); doc.setFontSize(10); cols.forEach(([x, l]) => doc.text(l, x, y)); y += 2; doc.line(12, y, 285, y); y += 6; doc.setFont('helvetica', 'normal'); };
      doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.text('Family Points · Historial', 12, y);
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.text('Generado el ' + FP.ymd(Date.now()) + ' · ' + entries.length + ' movimientos', 12, y + 6);
      y += 16; headRow();
      for (const e of entries) {
        if (y > 195) { doc.addPage(); y = 18; headRow(); }
        const vals = [FP.ymd(e.date), fmtTime.format(e.date), clean(names[e.memberId] || '—'), typeL[e.type], clean(e.title).slice(0, 55), signed(e.points).replace('−', '-'), clean(e.note).slice(0, 30)];
        cols.forEach(([x], i) => doc.text(String(vals[i]), x, y));
        y += 6.5;
      }
      const buf = doc.output('arraybuffer');
      await offerFile('family-points-' + FP.ymd(Date.now()) + '.pdf', buf, null);
    } catch (e) { console.error(e); toast(t('exportError')); }
  }

  // ---------- Recompensas ----------
  function renderRewards() {
    const ms = members();
    if (!S.redeemMember || !S.members.has(S.redeemMember)) S.redeemMember = (ms.find(m => m.role === 'child') || ms[0] || {}).id || '';
    const m = S.members.get(S.redeemMember);
    const bal = FP.balances(ms, movements(), redemptions());
    const list = rewards().filter(r => r.active !== false);
    const who = h('div', { class: 'who card' }, h('h2', { class: 'col-title', style: { margin: 0 } }, t('whoRedeems')),
      memberChips(S.redeemMember, id => { S.redeemMember = id; render(); }, false, mm => h('span', { class: 'pill neu' }, '★ ' + bal[mm.id])));
    const grid = list.length && m ? h('div', { class: 'rewards' }, list.map(r => {
      const check = FP.canRedeem(bal[m.id], r);
      const pct = Math.max(0, Math.min(100, (bal[m.id] / (r.cost || 1)) * 100));
      return h('button', {
        class: 'reward' + (check.ok ? '' : ' locked'), type: 'button',
        'aria-label': t('rewardLabel', { title: r.title, cost: r.cost, ok: check.ok, missing: check.missing }),
        onclick: e => tryRedeem(m, r, e.currentTarget)
      }, h('span', { class: 'ico', 'aria-hidden': 'true' }, r.icon || '🎁'), h('span', { class: 't', 'aria-hidden': 'true' }, r.title),
      h('span', { class: 'cost', 'aria-hidden': 'true' }, icon('star'), r.cost),
      h('span', { class: 'progress', 'aria-hidden': 'true' }, h('i', { style: { width: pct + '%' } })),
      h('span', { class: 'need', 'aria-hidden': 'true' }, check.ok ? t('redeem') : t('missing', { n: check.missing })));
    })) : h('div', { class: 'empty card' }, h('div', { class: 'big', 'aria-hidden': 'true' }, '🎁'), h('p', null, ms.length ? t('noRewards') : t('noMembers')));
    return h('div', null, ms.length ? who : null, grid);
  }
  function renderRedemptionsList() {
    const recent = redemptions().sort((a, b) => b.date - a.date).slice(0, 60);
    return h('div', null,
      recent.length ? h('ul', { class: 'list card' }, recent.map(r => {
        const mm = S.members.get(r.memberId) || { name: '—', emoji: '❔', color: '#999' };
        return h('li', { class: 'row' }, avatar(mm), h('span', { class: 'ico', 'aria-hidden': 'true' }, r.icon),
          h('span', { class: 'grow' }, h('div', { class: 'title' }, r.title), h('div', { class: 'meta' }, mm.name + ' · ' + dayLabel(r.date))),
          h('span', { class: 'pill neu' }, '−' + r.cost));
      })) : h('p', { class: 'sub' }, t('noRedemptions')));
  }
  function renderRewardsTab() {
    const v = S.rewardsView;
    return h('div', null,
      h('div', { class: 'page-head' }, h('h1', null, t('rewardsTitle')),
        seg([['catalog', '🎁 ' + t('viewCatalog')], ['redemptions', '🧾 ' + t('viewRedemptions')], ['badges', '🏅 ' + t('viewBadges')]], v, x => { S.rewardsView = x; render(); })),
      v === 'badges' ? renderBadges() : v === 'redemptions' ? renderRedemptionsList() : renderRewards());
  }
  function renderSummary() {
    const v = S.summaryView;
    return h('div', null,
      h('div', { class: 'view-switch' }, h('button', { class: 'btn small ghost', type: 'button', onclick: () => goTab('more') }, '‹ ' + t('tabMore')), seg([['history', '🗒️ ' + t('viewHistory')], ['stats', '📈 ' + t('viewStats')]], v, x => { S.summaryView = x; render(); }, t('tabSummary'))),
      v === 'stats' ? renderStats() : renderHistory());
  }
  function renderMore() {
    const tile = (ico, label, fn) => h('button', { class: 'more-tile card', type: 'button', onclick: fn }, h('span', { class: 'ico', 'aria-hidden': 'true' }, ico), h('span', null, label));
    const allEntries = () => FP.historyEntries(movements(), redemptions());
    return h('div', null,
      h('div', { class: 'page-head' }, h('h1', null, t('moreTitle'))),
      h('div', { class: 'more-grid' },
        tile('⚙️', t('tabSettings'), () => goTab('settings')),
        tile('🏅', t('badgesTitle'), () => { S.rewardsView = 'badges'; goTab('rewards'); }),
        tile('🗒️', t('viewHistory'), () => { S.summaryView = 'history'; goTab('summary'); }),
        tile('📈', t('viewStats'), () => { S.summaryView = 'stats'; goTab('summary'); }),
        tile('📄', t('exportCSV'), () => exportCSV(allEntries())),
        tile('📑', t('exportPDF'), () => exportPDF(allEntries())),
        tile('💾', t('moreBackup'), () => saveBackup()),
        tile(S.settings.sound ? '🔊' : '🔇', S.settings.sound ? t('soundOn') : t('soundOff'), () => saveSettings({ sound: !S.settings.sound }))));
  }
  async function tryRedeem(m, r, btn) {
    const b = balanceOf(m.id);
    const check = FP.canRedeem(b, r);
    if (!check.ok) {
      btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake'); haptic(60);
      toast(t('notEnough', { name: m.name, n: check.missing }));
      return;
    }
    const ok = await confirmSheet({ title: t('redeemQ', { title: r.title }), icon: r.icon, body: t('redeemBody', { name: m.name, cost: r.cost, left: b - r.cost }), ok: t('redeem') });
    if (!ok || !(await requirePin())) return;
    const red = FP.makeRedemption(m, r, balanceOf(m.id), Date.now());
    if (!red) { toast(t('notEnough', { name: m.name, n: FP.canRedeem(balanceOf(m.id), r).missing })); return; }
    addRedemption(red);
    Sound.play('redeem'); confetti(140); haptic(30);
    toast(t('redeemed', { name: m.name, title: r.title }));
  }

  // ---------- Estadísticas ----------
  function niceStep(span) {
    const raw = span / 4, p = Math.pow(10, Math.floor(Math.log10(raw || 1))), n = raw / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
  }
  function lineChart(labels, series) {
    const W = 640, H = 280, L = 40, R = 92, T = 14, B = 30;
    let lo = 0, hi = 0;
    series.forEach(s => s.values.forEach(v => { lo = Math.min(lo, v); hi = Math.max(hi, v); }));
    if (hi === lo) hi = lo + 5;
    const step = Math.max(1, niceStep(hi - lo));
    lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step;
    const x = i => L + (labels.length === 1 ? 0 : i * (W - L - R) / (labels.length - 1));
    const y = v => T + (hi - v) * (H - T - B) / (hi - lo);
    const NS = 'http://www.w3.org/2000/svg';
    const s = (tag, attrs, text) => { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); if (text != null) el.textContent = text; return el; };
    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': t('chartLabel') });
    for (let v = lo; v <= hi + 1e-9; v += step) {
      svg.append(s('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), class: v === 0 ? 'zero' : 'grid' }));
      svg.append(s('text', { x: L - 8, y: y(v) + 4, 'text-anchor': 'end', class: 'axis' }, v));
    }
    const every = Math.max(1, Math.ceil(labels.length / 7));
    labels.forEach((lab, i) => { if ((labels.length - 1 - i) % every === 0) svg.append(s('text', { x: x(i), y: H - 8, 'text-anchor': i === labels.length - 1 ? 'end' : 'middle', class: 'axis' }, lab)); });
    const cross = s('line', { y1: T, y2: H - B, x1: -10, x2: -10, stroke: 'var(--muted)', 'stroke-width': 1, 'stroke-dasharray': '3 3', opacity: 0 });
    svg.append(cross);
    series.forEach(se => {
      svg.append(s('polyline', { points: se.values.map((v, i) => x(i) + ',' + y(v)).join(' '), fill: 'none', stroke: se.color, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
      se.values.forEach((v, i) => svg.append(s('circle', { cx: x(i), cy: y(v), r: i === se.values.length - 1 ? 5 : labels.length > 12 ? 2.5 : 3.5, fill: se.color, stroke: 'var(--surface)', 'stroke-width': 2 })));
    });
    // Etiquetas directas al final de cada línea, separadas para que no se pisen
    const ends = series.map(se => ({ se, y: y(se.values[se.values.length - 1]) })).sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 16) ends[i].y = ends[i - 1].y + 16;
    ends.forEach(e => svg.append(s('text', { x: W - R + 10, y: e.y + 4, fill: 'var(--fg)', 'font-size': 13, 'font-weight': 600 }, e.se.name + ' ' + signed(e.se.values[e.se.values.length - 1]))));
    const tip = h('div', { class: 'tip', hidden: true });
    const wrap = h('div', { class: 'chart-wrap' }, svg, tip);
    const hit = s('rect', { x: L, y: T, width: W - L - R, height: H - T - B, fill: 'transparent' });
    svg.append(hit);
    const show = ev => {
      const rect = svg.getBoundingClientRect();
      const vx = (ev.clientX - rect.left) / rect.width * W;
      const i = Math.max(0, Math.min(labels.length - 1, Math.round((vx - L) / ((W - L - R) / Math.max(1, labels.length - 1)))));
      cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.setAttribute('opacity', 1);
      tip.replaceChildren(h('b', null, labels[i]), ...series.map(se => h('div', { class: 'r' },
        h('span', null, h('i', { class: 'k', style: { background: se.color } }), ' ', se.name), h('strong', null, signed(se.values[i])))));
      tip.hidden = false;
      const px = x(i) / W * rect.width;
      tip.style.left = Math.min(rect.width - tip.offsetWidth, Math.max(0, px + 12)) + 'px';
      tip.style.top = '4px';
    };
    hit.addEventListener('pointermove', show);
    hit.addEventListener('pointerdown', show);
    hit.addEventListener('pointerleave', () => { tip.hidden = true; cross.setAttribute('opacity', 0); });
    return wrap;
  }
  function renderStats() {
    const st = S.stats;
    const setS = p => { Object.assign(st, p); render(); };
    const all = members();
    const ms = st.memberId ? all.filter(m => m.id === st.memberId) : all;
    const now = Date.now();
    const count = { day: 30, week: 8, month: 6 }[st.gran] || 8;
    const ser = FP.series(ms, movements(), st.gran, count, now);
    const labels = ser.starts.map(s0 => st.gran === 'month' ? fmtMonth.format(s0) : fmtShort.format(s0));
    const from = ser.starts[0];
    const movs = movements().filter(m => m.kind !== 'reset' && m.date >= from && (!st.memberId || m.memberId === st.memberId) && S.members.has(m.memberId));
    const reds = redemptions().filter(r => r.date >= from && (!st.memberId || r.memberId === st.memberId));
    const earned = movs.filter(m => m.points > 0).reduce((a, m) => a + m.points, 0);
    const lost = movs.filter(m => m.points < 0).reduce((a, m) => a + m.points, 0);
    const top = FP.topBehaviors(movs, { limit: 8 });
    const maxC = Math.max(1, ...top.map(x => x.count));
    const series = ms.map(m => ({ name: m.name, color: m.color, values: ser.data[m.id] }));
    const hasData = movs.length > 0;
    const chartCard = h('section', { class: 'card chart-card', 'aria-labelledby': 'evo-h' },
      h('h2', { id: 'evo-h' }, t('evolution')), h('p', { class: 'sub' }, t({ day: 'evolutionSubD', week: 'evolutionSubW', month: 'evolutionSubM' }[st.gran] || 'evolutionSubW')),
      hasData ? [
        lineChart(labels, series),
        series.length > 1 ? h('div', { class: 'legend' }, series.map(se => h('span', null, h('i', { style: { background: se.color }, 'aria-hidden': 'true' }), se.name))) : null,
        h('button', { class: 'btn small ghost', type: 'button', style: { 'margin-top': '.75rem' }, 'aria-expanded': st.table ? 'true' : 'false', onclick: () => setS({ table: !st.table }) }, st.table ? t('hideTable') : t('showTable')),
        st.table ? h('div', { class: 'table-wrap' }, h('table', { class: 'data' },
          h('thead', null, h('tr', null, h('th', null, t('period')), series.map(se => h('th', null, se.name)))),
          h('tbody', null, labels.map((lab, i) => h('tr', null, h('td', null, lab), series.map(se => h('td', null, signed(se.values[i])))))))) : null
      ] : h('div', { class: 'empty' }, h('div', { class: 'big', 'aria-hidden': 'true' }, '📈'), h('p', null, t('noStats'))));
    const topCard = h('section', { class: 'card chart-card', 'aria-labelledby': 'top-h' },
      h('h2', { id: 'top-h' }, t('topBehaviors')), h('p', { class: 'sub' }, t('topSub')),
      top.length ? h('div', { class: 'bars' }, top.map(b => h('div', { class: 'bar-row', role: 'listitem', 'aria-label': b.title + ' (' + signed(b.points / b.count) + '): ' + t('times', { n: b.count }) },
        h('span', { 'aria-hidden': 'true', style: { 'font-size': '1.4rem' } }, b.icon),
        h('span', { class: 'lab', 'aria-hidden': 'true', title: b.title }, b.title),
        h('span', { class: 'track', 'aria-hidden': 'true' }, h('span', { class: 'fill ' + (b.positive ? 'pos' : 'neg'), style: { display: 'block', width: (b.count / maxC * 100) + '%' } })),
        h('span', { class: 'n', 'aria-hidden': 'true' }, '×' + b.count)))) : h('p', { class: 'sub' }, t('noStats')));
    return h('div', null,
      h('div', { class: 'page-head' }, h('h1', null, t('statsTitle')), seg([['day', t('days')], ['week', t('weeks')], ['month', t('months')]], st.gran, v => setS({ gran: v }))),
      h('div', { class: 'filters' }, memberChips(st.memberId, id => setS({ memberId: id }), true)),
      h('div', { class: 'tiles' },
        h('div', { class: 'card tile' }, h('span', { style: { 'font-size': '1.8rem' }, 'aria-hidden': 'true' }, '⬆️'), h('div', null, h('div', { class: 'v', style: { color: 'var(--good)' } }, signed(earned)), h('div', { class: 'l' }, t('earned')))),
        h('div', { class: 'card tile' }, h('span', { style: { 'font-size': '1.8rem' }, 'aria-hidden': 'true' }, '⬇️'), h('div', null, h('div', { class: 'v', style: { color: 'var(--bad)' } }, signed(lost)), h('div', { class: 'l' }, t('lost')))),
        h('div', { class: 'card tile' }, h('span', { style: { 'font-size': '1.8rem' }, 'aria-hidden': 'true' }, '🎁'), h('div', null, h('div', { class: 'v' }, reds.length), h('div', { class: 'l' }, t('redemptionsN'))))),
      h('div', { class: 'stats-grid' }, chartCard, topCard));
  }

  // ---------- Retos ----------
  const TYPE_LABEL = { count: 'typeCount', streak: 'typeStreak', clean: 'typeClean', family: 'typeFamily', free: 'typeFree' };
  const PERIOD_LABEL = { weekly: 'periodWeekly', week: 'periodWeek', open: 'periodOpen' };
  const STATUS_LABEL = { active: 'statusActive', ready: 'statusReady', confirmed: 'statusConfirmed', dismissed: 'statusDismissed', failed: 'statusFailed' };
  function progLabel(ch, prog) {
    return t({ count: 'progCount', streak: 'progStreak', clean: 'progClean', family: 'progFamily', free: 'progFree' }[ch.type], prog);
  }
  // Retos activos de este periodo con su estado
  function currentBoard() {
    const now = Date.now(), ms = members(), movs = movements(), ach = achievements();
    return challengesList().filter(c => !c.pool && c.active !== false)
      .map(ch => ({ ch, st: FP.challengeState(ch, ms, movs, ach, now) })).filter(x => x.st);
  }
  function pendingNow() {
    return FP.pendingChallenges(challengesList(), members(), movements(), achievements(), Date.now());
  }
  const namesOf = ids => ids.map(id => (S.members.get(id) || { name: '—' }).name).join(', ').replace(/, ([^,]*)$/, ' y $1');

  // Aviso del panel y de Retos: retos conseguidos por confirmar
  function challengeBanners() {
    const pend = pendingNow();
    return h('div', { class: 'banners' },
      pend.length ? h('div', { class: 'banner' }, h('span', { style: { 'font-size': '1.8rem' }, 'aria-hidden': 'true' }, '🏆'), h('p', null, t('pendingBanner', { n: pend.length })),
        h('button', { class: 'btn small primary', type: 'button', onclick: reviewPending }, t('review'))) : null);
  }

  function renderChallenges() {
    const board = currentBoard();
    const kids = members().filter(m => m.role !== 'adult');
    const sel = S.chalMember && S.members.has(S.chalMember) ? S.chalMember : '';
    const shown = board.filter(b => !sel || b.st.family || b.st.rows.some(r => r.memberIds.includes(sel)))
      .sort((a, b) => (b.st.family - a.st.family) || ((a.ch.order || 0) - (b.ch.order || 0)));
    const head = h('div', { class: 'page-head' },
      h('div', null, h('h1', null, t('challengesTitle')), h('p', { class: 'sub' }, t('challengesSub'))),
      h('div', { class: 'chips' },
        h('button', { class: 'btn small primary', type: 'button', onclick: async () => { if (await requirePin()) editChallenge(); } }, icon('plus'), t('newChallenge'))));
    if (!board.length) {
      return h('div', null, head, challengeBanners(), h('div', { class: 'empty card' }, h('div', { class: 'big', 'aria-hidden': 'true' }, '🏆'),
        h('p', null, h('strong', null, t('noChallenges'))), h('p', null, t('noChallengesSub')),
        h('div', { class: 'chips', style: { 'justify-content': 'center' } },
          h('button', { class: 'btn primary', type: 'button', onclick: createExampleChallenges }, t('exampleChallenges')))));
    }
    return h('div', null, head, challengeBanners(),
      kids.length > 1 ? h('div', { class: 'filters' }, memberChips(sel, id => { S.chalMember = id; render(); }, true)) : null,
      h('div', { class: 'chal-grid' }, shown.map(b => challengeCard(b.ch, b.st, sel))));
  }

  function challengeCard(ch, st, sel) {
    const rows = st.rows.filter(r => st.family || !sel || r.memberIds.includes(sel));
    const meta = [t(TYPE_LABEL[ch.type]), t(PERIOD_LABEL[ch.period] || 'periodWeekly')];
    if (ch.type === 'family' && ch.reward) meta.push('🎁 ' + ch.reward);
    return h('section', { class: 'chal card', 'aria-label': ch.title },
      h('button', { class: 'chal-head', type: 'button', 'aria-label': t('editItem', { name: ch.title }), onclick: async () => { if (await requirePin()) editChallenge(ch); } },
        h('span', { class: 'chal-ico', 'aria-hidden': 'true' }, ch.icon || FP.CHALLENGE_ICONS[ch.type]),
        h('span', { class: 'grow' }, h('span', { class: 'chal-title' }, ch.title), h('span', { class: 'chal-meta' }, meta.join(' · '))),
        ch.stars > 0 ? h('span', { class: 'pill pos' }, t('starsBonus', { n: ch.stars })) : null),
      rows.map(r => {
        const ms = r.memberIds.map(id => S.members.get(id)).filter(Boolean);
        const pct = ch.type === 'free' ? (r.status === 'confirmed' ? 100 : 0) : Math.min(100, Math.round(r.prog.value / r.prog.target * 100));
        const color = st.family ? 'var(--star)' : (ms[0] && ms[0].color) || 'var(--star)';
        const label = progLabel(ch, r.prog);
        const action = r.status === 'ready'
          ? h('button', { class: 'btn small primary', type: 'button', onclick: reviewPending }, t('confirmNow'))
          : ch.type === 'free' && r.status === 'active'
            ? h('button', { class: 'btn small', type: 'button', onclick: () => markFreeDone(ch, st.period, r.memberIds) }, t('markDone'))
            : h('span', { class: 'st ' + r.status }, t(STATUS_LABEL[r.status]));
        return h('div', { class: 'chal-row', 'aria-label': t('challengeRowLabel', { name: namesOf(r.memberIds), status: t(STATUS_LABEL[r.status]), prog: label }) },
          h('span', { class: 'chal-who', 'aria-hidden': 'true' }, ms.slice(0, 4).map(m => avatar(m))),
          h('span', { class: 'grow', 'aria-hidden': 'true' },
            h('span', { class: 'chal-name' }, st.family ? t('forAll') : namesOf(r.memberIds)),
            h('span', { class: 'bar' + (r.status === 'failed' ? ' failed' : '') }, h('i', { style: { width: pct + '%', background: color } })),
            h('span', { class: 'chal-meta' }, label)),
          action);
      }));
  }

  // Confirmación de retos conseguidos (siempre la decide un adulto)
  async function decide(item, accept) {
    if (!(await requirePin())) return false;
    const now = Date.now();
    if (accept) {
      const res = FP.confirmChallenge(item.ch, item.period, item.memberIds, now);
      res.achievements.forEach(addAchievement);
      res.movements.forEach(addMovement);
      celebrate(item.ch, item.memberIds);
    } else {
      FP.dismissChallenge(item.ch, item.period, item.memberIds, now).forEach(addAchievement);
      toast(t('dismissed'));
    }
    return true;
  }
  function reviewPending() {
    openSheet({
      build: ctx => {
        const list = h('div', { class: 'pending-list' });
        const paint = () => {
          const pend = pendingNow();
          if (!pend.length) { list.replaceChildren(h('p', { class: 'sub' }, t('pendingNone'))); return; }
          list.replaceChildren(...pend.map(item => h('div', { class: 'pending card' },
            h('span', { class: 'chal-ico', 'aria-hidden': 'true' }, item.ch.icon || FP.CHALLENGE_ICONS[item.ch.type]),
            h('span', { class: 'grow' },
              h('span', { class: 'chal-title' }, item.ch.title),
              h('span', { class: 'chal-meta' }, namesOf(item.memberIds) + ' · ' + (item.period.key === 'open' ? t('noDate') : item.period.start === FP.weekStart(Date.now()) ? t('thisWeekL') : t('lastWeek')) +
                (item.ch.stars > 0 ? ' · ' + t('starsBonus', { n: item.ch.stars }) : ''))),
            h('span', { class: 'chips' },
              h('button', { class: 'btn small ghost', type: 'button', onclick: () => decide(item, false) }, t('dismissBtn')),
              h('button', { class: 'btn small good', type: 'button', onclick: () => decide(item, true) }, '✓ ' + t('confirmBtn'))))));
        };
        ctx.update = paint; paint();
        return [sheetHead(ctx, t('pendingTitle'), h('span', { style: { 'font-size': '2.2rem' }, 'aria-hidden': 'true' }, '🏆')), list];
      }
    });
  }
  async function markFreeDone(ch, period, memberIds) {
    const ok = await confirmSheet({ title: t('freeDoneQ', { name: namesOf(memberIds), title: ch.title }), icon: ch.icon, body: t('freeDoneBody'), ok: t('confirmBtn') });
    if (ok) decide({ ch, period, memberIds, family: false }, true);
  }
  function celebrate(ch, memberIds) {
    Sound.play('challenge'); confetti(170); haptic(40);
    const ms = memberIds.map(id => S.members.get(id)).filter(Boolean);
    openSheet({
      build: ctx => [
        sheetHead(ctx, t('celebrateTitle')),
        h('div', { class: 'celebrate' },
          h('div', { class: 'big-badge', 'aria-hidden': 'true' }, ch.icon || FP.CHALLENGE_ICONS[ch.type]),
          h('div', { class: 'chal-who', 'aria-hidden': 'true' }, ms.map(m => avatar(m, 'md'))),
          h('p', { class: 'ct' }, namesOf(memberIds)),
          h('p', { class: 'cs' }, '«' + ch.title + '»'),
          h('p', { class: 'cb' }, '🏅 ' + t('newBadge') + (ch.stars > 0 ? ' · ' + t('plusStarsEach', { n: ch.stars, many: memberIds.length > 1 }) : '')),
          ch.type === 'family' && ch.reward ? h('p', { class: 'cb' }, '🎁 ' + t('familyPrize', { reward: ch.reward })) : null,
          h('button', { class: 'btn primary', type: 'button', autofocus: true, onclick: () => ctx.close() }, t('great')))
      ]
    });
  }

  // Insignias por miembro
  function renderBadges() {
    const ach = achievements();
    const ms = members();
    const any = ms.some(m => FP.badgesFor(m.id, ach).length);
    if (!any) return h('div', { class: 'empty card' }, h('div', { class: 'big', 'aria-hidden': 'true' }, '🏅'), h('p', null, t('noBadges')));
    return h('div', { style: { display: 'grid', gap: '1.25rem' } }, ms.map(m => {
      const badges = FP.badgesFor(m.id, ach);
      if (!badges.length) return null;
      return h('section', { class: 'card', style: { padding: '1rem' }, 'aria-label': m.name },
        h('h2', { class: 'col-title' }, avatar(m), m.name, h('span', { class: 'pill neu' }, '🏅 ' + badges.reduce((a, b) => a + b.count, 0))),
        h('div', { class: 'badges' }, badges.map(b => h('button', {
          class: 'badge', type: 'button', 'aria-label': t('badgeLabel', { title: b.title, n: b.count }),
          onclick: () => removeBadge(m, b)
        }, h('span', { class: 'medal', 'aria-hidden': 'true' }, b.icon), h('span', { class: 'bt', 'aria-hidden': 'true' }, b.title),
        b.count > 1 ? h('span', { class: 'pill neu', 'aria-hidden': 'true' }, '×' + b.count) : null))));
    }));
  }
  async function removeBadge(m, b) {
    if (!(await requirePin())) return;
    if (!(await confirmSheet({ title: t('removeBadgeQ', { title: b.title }), icon: b.icon, body: t('removeBadgeBody'), ok: t('removeBadge'), danger: true }))) return;
    const a = achievements().filter(x => x.memberId === m.id && x.status === 'confirmed' && (x.challengeId + '|' + x.title) === b.key).sort((x, y) => y.date - x.date)[0];
    if (!a) return;
    removeAchievement(a.id);
    const mv = movements().find(x => x.achievementId === a.id);
    if (mv) removeEntry(mv.id);
    toast(t('badgeRemoved'));
  }

  // Retos de ejemplo a partir de las reglas existentes
  async function createExampleChallenges() {
    if (!(await requirePin())) return;
    const rs = rules(), pos = rs.find(r => r.points > 0), neg = rs.find(r => r.points < 0), now = Date.now();
    let order = 0;
    const base = { active: true, period: 'weekly', memberIds: [], createdAt: now, pool: false, reward: '' };
    const list = [];
    if (pos) list.push(Object.assign({}, base, { type: 'count', ruleId: pos.id, target: 5, stars: 5, icon: pos.icon }));
    if (neg) list.push(Object.assign({}, base, { type: 'clean', ruleId: neg.id, target: 7, stars: 6, icon: '🧼' }));
    list.push(Object.assign({}, base, { type: 'family', target: 40, stars: 0, icon: '👨‍👩‍👧', reward: t('exampleReward') }));
    list.forEach(c => { c.id = FP.uid(); c.order = order++; c.title = FP.challengeTitle(c, rs.find(r => r.id === c.ruleId)); saveItem('challenges', c); });
  }

  // Editor de retos
  function editChallenge(existing) {
    const now = Date.now();
    const c = existing ? clone(existing) : { id: FP.uid(), type: 'count', title: '', icon: '', ruleId: '', target: 5, stars: 5, memberIds: [], period: 'weekly', reward: '', active: true, createdAt: now, order: nextOrder(challengesList()) };
    const DEF_TARGET = { count: 5, streak: 3, family: 40, clean: 7, free: 1 };
    openSheet({
      build: ctx => {
        const body = h('div', { class: 'form' });
        const err = h('p', { class: 'pin-msg', role: 'alert' });
        const titleIn = h('input', { class: 'input', id: 'c-title', type: 'text', maxlength: '60', value: c.title });
        titleIn.addEventListener('input', () => { c.title = titleIn.value; });
        const rewardIn = h('input', { class: 'input', id: 'c-reward', type: 'text', maxlength: '60', value: c.reward || '', placeholder: t('familyRewardPh') });
        rewardIn.addEventListener('input', () => { c.reward = rewardIn.value; });
        const stepper = (key, min, max, steps) => {
          const val = h('span', { class: 'val' }, c[key]);
          const st = d => { c[key] = Math.max(min, Math.min(max, (Number(c[key]) || 0) + d)); val.textContent = c[key]; };
          return h('div', { class: 'stepper' },
            steps.includes(5) ? h('button', { type: 'button', class: 'btn', 'aria-label': '−5', onclick: () => st(-5) }, '−5') : null,
            h('button', { type: 'button', class: 'btn', 'aria-label': t('lessPts'), onclick: () => st(-1) }, '−'), val,
            h('button', { type: 'button', class: 'btn', 'aria-label': t('morePts'), onclick: () => st(1) }, '+'),
            steps.includes(5) ? h('button', { type: 'button', class: 'btn', 'aria-label': '+5', onclick: () => st(5) }, '+5') : null);
        };
        const paint = () => {
          const needsRule = ['count', 'streak', 'clean'].includes(c.type);
          const ruleList = rules().filter(r => c.type === 'clean' ? r.points < 0 : r.points > 0);
          if (c.type !== 'free' && c.period === 'open') c.period = 'weekly';
          const rangeFor = { count: [1, 21], streak: [2, 7], family: [5, 999] }[c.type];
          if (rangeFor) c.target = Math.max(rangeFor[0], Math.min(rangeFor[1], Number(c.target) || DEF_TARGET[c.type]));
          fill(body,
            h('div', { class: 'field' }, h('span', null, t('challengeType')),
              seg(FP.CHALLENGE_TYPES.map(tp => [tp, FP.CHALLENGE_ICONS[tp] + ' ' + t(TYPE_LABEL[tp])]), c.type, v => {
                if (v === c.type) return;
                c.type = v; c.target = DEF_TARGET[v]; c.ruleId = ''; paint();
              }, t('challengeType')),
              h('p', { class: 'note', style: { margin: 0 } }, t({ count: 'typeHelpCount', streak: 'typeHelpStreak', clean: 'typeHelpClean', family: 'typeHelpFamily', free: 'typeHelpFree' }[c.type]))),
            needsRule ? h('div', { class: 'field' }, h('span', null, t('challengeRule')),
              ruleList.length ? h('div', { class: 'chips', role: 'group', 'aria-label': t('challengeRule') }, ruleList.map(r => h('button', {
                class: 'chip text', type: 'button', 'aria-pressed': c.ruleId === r.id ? 'true' : 'false', onclick: () => { c.ruleId = r.id; if (!c.icon || c.icon === FP.CHALLENGE_ICONS[c.type]) c.icon = c.type === 'count' ? r.icon : c.icon; paint(); }
              }, h('span', { 'aria-hidden': 'true' }, r.icon), ' ', r.title))) : h('p', { class: 'note' }, t('noRuleOfType'))) : null,
            rangeFor ? h('div', { class: 'field' }, h('span', null, t({ count: 'targetCount', streak: 'targetStreak', family: 'targetFamily' }[c.type])),
              stepper('target', rangeFor[0], rangeFor[1], c.type === 'family' ? [1, 5] : [1])) : null,
            h('div', { class: 'field' }, h('span', null, c.type === 'family' ? t('bonusStarsFamily') : t('bonusStars')), stepper('stars', 0, 100, [1, 5])),
            c.type === 'family' ? h('label', { class: 'field', for: 'c-reward' }, h('span', null, t('familyReward')), rewardIn) : null,
            h('label', { class: 'field', for: 'c-title' }, h('span', null, t('titleAuto')), titleIn),
            h('div', { class: 'field' }, h('span', null, t('icon')), emojiPicker(['🏆', '🎯', '🔥', '🧼', '🏅', '🌟', '💪', '📚', '🛏️', '🪥', '🧸', '🧹', '🥦', '🤝', '💛', '😴', '👟', '🎨', '🎵', '⚽', '👨‍👩‍👧', '🍕', '🎬'],
              c.icon || FP.CHALLENGE_ICONS[c.type], e => { c.icon = e; }, 'c-emoji')),
            h('div', { class: 'field' }, h('span', null, t('forWhom')),
              h('div', { class: 'chips', role: 'group', 'aria-label': t('forWhom') },
                h('button', { class: 'chip text', type: 'button', 'aria-pressed': c.memberIds.length ? 'false' : 'true', onclick: () => { c.memberIds = []; paint(); } }, t('allKids')),
                members().map(m => h('button', { class: 'chip', type: 'button', 'aria-pressed': c.memberIds.includes(m.id) ? 'true' : 'false', onclick: () => {
                  c.memberIds = c.memberIds.includes(m.id) ? c.memberIds.filter(x => x !== m.id) : c.memberIds.concat(m.id); paint();
                } }, avatar(m), m.name)))),
            h('div', { class: 'field' }, h('span', null, t('duration')),
              seg([['weekly', t('periodWeekly')], ['week', t('periodWeek')]].concat(c.type === 'free' ? [['open', t('periodOpen')]] : []), c.period, v => { c.period = v; paint(); }, t('duration'))),
            h('div', { class: 'switch' }, h('label', { for: 'c-active' }, t('challengeActive')), toggle('c-active', c.active !== false, v => { c.active = v; }, t('challengeActive'))),
            err,
            h('div', { class: 'form-actions' },
              existing ? deleteButton(ctx, c.title, t('deleteBody'), () => deleteItem('challenges', c.id)) : null,
              h('span', { class: 'spacer' }),
              h('button', { class: 'btn ghost', type: 'button', onclick: () => ctx.close() }, t('cancel')),
              h('button', { class: 'btn primary', type: 'button', onclick: () => {
                const rule = rules().find(r => r.id === c.ruleId);
                if (needsRule && !rule) { err.textContent = t('chooseRule'); return; }
                c.title = (c.title || '').trim() || FP.challengeTitle(c, rule);
                c.icon = c.icon || FP.CHALLENGE_ICONS[c.type];
                c.reward = (c.reward || '').trim();
                if (c.period === 'week' && (!existing || existing.period !== 'week')) c.weekStart = FP.weekStart(Date.now());
                saveItem('challenges', c); ctx.close(); toast(t('saved'));
              } }, t('save'))));
        };
        paint();
        return [sheetHead(ctx, existing ? t('editChallenge') : t('newChallenge')), body];
      }
    });
  }

  // ---------- Ajustes ----------
  const EMOJIS_AVATAR = ['🦊', '🐼', '🦁', '🐯', '🐨', '🐸', '🐵', '🐰', '🐻', '🐶', '🐱', '🦄', '🐲', '🐙', '🦖', '🐧', '🦉', '🐝', '🌻', '🚀', '⚽', '🎨', '👑', '🧑', '👩', '👨', '👧', '👦', '👶', '👵', '👴'];
  const EMOJIS_ITEM = ['⭐', '🛏️', '🪥', '🧸', '🧹', '📚', '🥦', '📖', '👕', '🍽️', '💛', '😴', '🤝', '🚿', '🐕', '🎒', '🧺', '🌱', '😠', '📢', '🙉', '🤥', '📵', '🌪️', '🤬', '😭', '👊', '📱', '🎬', '🍦', '🛝', '🎁', '🍕', '🌙', '🎲', '🏞️', '🧒', '🎮', '🍫', '🏊', '🚲', '🎟️', '💶'];

  function emojiPicker(list, current, onPick, idp) {
    const grid = h('div', { class: 'emoji-grid', role: 'group' });
    const other = h('input', { class: 'input', id: idp + '-other', type: 'text', maxlength: '8', placeholder: t('otherEmoji'), style: { 'max-width': '10rem' } });
    const paint = cur => grid.replaceChildren(...list.map(e => h('button', { type: 'button', 'aria-pressed': e === cur ? 'true' : 'false', 'aria-label': e, onclick: () => { onPick(e); paint(e); } }, e)));
    other.addEventListener('input', () => { const v = other.value.trim(); if (v) { onPick(v); paint(v); } });
    paint(current);
    return h('div', { style: { display: 'grid', gap: '.5rem' } }, grid, h('label', { class: 'sr', for: idp + '-other' }, t('otherEmoji')), other);
  }
  function toggle(id, checked, onChange, label) {
    const b = h('button', { class: 'toggle', id, type: 'button', role: 'switch', 'aria-checked': checked ? 'true' : 'false', 'aria-label': label });
    b.addEventListener('click', () => { const v = b.getAttribute('aria-checked') !== 'true'; b.setAttribute('aria-checked', v ? 'true' : 'false'); onChange(v); });
    return b;
  }
  function resizePhoto(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => {
        const img = new Image();
        img.onload = () => {
          const size = 192, c = document.createElement('canvas'); c.width = c.height = size;
          const s = Math.min(img.width, img.height);
          c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
          res(c.toDataURL('image/jpeg', .82));
        };
        img.onerror = rej; img.src = fr.result;
      };
      fr.onerror = rej; fr.readAsDataURL(file);
    });
  }
  function deleteButton(ctx, name, body, onDelete) {
    return h('button', { class: 'btn bad', type: 'button', onclick: async () => {
      const ok = await confirmSheet({ title: t('deleteQ', { name }), body, ok: t('delete'), danger: true });
      if (ok) { onDelete(); ctx.close(); }
    } }, t('delete'));
  }
  function nextOrder(list) { return list.reduce((a, x) => Math.max(a, (x.order || 0) + 1), 0); }

  function editMember(existing) {
    const m = existing ? clone(existing) : { id: FP.uid(), name: '', emoji: '🦊', photo: '', color: FP.MEMBER_COLORS[S.members.size % FP.MEMBER_COLORS.length], role: 'child', order: nextOrder(members()), createdAt: Date.now() };
    openSheet({
      build: ctx => {
        const preview = h('span');
        const paintPreview = () => preview.replaceChildren(avatar(m, 'lg'));
        paintPreview();
        const name = h('input', { class: 'input', id: 'm-name', type: 'text', maxlength: '24', value: m.name, autofocus: !existing });
        const err = h('p', { class: 'pin-msg', role: 'alert' });
        const roleBox = h('div');
        const paintRole = () => roleBox.replaceChildren(seg([['child', t('child')], ['adult', t('adult')]], m.role, v => { m.role = v; paintRole(); }, t('role')));
        paintRole();
        const swBox = h('div', { class: 'swatches', role: 'group', 'aria-label': t('color') });
        const paintSw = () => swBox.replaceChildren(...FP.MEMBER_COLORS.map((c, i) => h('button', { class: 'swatch', type: 'button', style: { background: c }, 'aria-label': t('color') + ' ' + (i + 1), 'aria-pressed': m.color === c ? 'true' : 'false', onclick: () => { m.color = c; paintSw(); paintPreview(); } })));
        paintSw();
        const file = h('input', { type: 'file', accept: 'image/*', id: 'm-photo', class: 'sr' });
        file.addEventListener('change', async () => { if (file.files[0]) { try { m.photo = await resizePhoto(file.files[0]); paintPreview(); } catch (e) { toast(t('saveError')); } } });
        return [
          sheetHead(ctx, existing ? t('editMember') : t('newMember')),
          h('div', { class: 'form' },
            h('div', { style: { display: 'flex', 'justify-content': 'center', padding: '.5rem' } }, preview),
            h('label', { class: 'field', for: 'm-name' }, h('span', null, t('name')), name), err,
            h('div', { class: 'field' }, h('span', null, t('role')), roleBox),
            h('div', { class: 'field' }, h('span', null, t('avatar')), emojiPicker(EMOJIS_AVATAR, m.emoji, e => { m.emoji = e; m.photo = ''; paintPreview(); }, 'm-emoji'),
              h('div', { class: 'chips' }, h('label', { class: 'btn small', for: 'm-photo' }, '📷 ' + t('photo')), file,
                h('button', { class: 'btn small ghost', type: 'button', onclick: () => { m.photo = ''; paintPreview(); } }, t('removePhoto')))),
            h('div', { class: 'field' }, h('span', null, t('color')), swBox),
            h('div', { class: 'form-actions' },
              existing ? deleteButton(ctx, m.name, t('deleteMemberBody'), () => deleteItem('members', m.id)) : null,
              h('span', { class: 'spacer' }),
              h('button', { class: 'btn ghost', type: 'button', onclick: () => ctx.close() }, t('cancel')),
              h('button', { class: 'btn primary', type: 'button', onclick: () => {
                m.name = name.value.trim(); if (!m.name) { err.textContent = t('required'); name.focus(); return; }
                saveItem('members', m); ctx.close(); toast(t('saved'));
              } }, t('save'))))
        ];
      }
    });
  }

  function editRule(existing, defaults) {
    const r = existing ? clone(existing) : Object.assign({ id: FP.uid(), title: '', icon: '⭐', points: 1, category: '', order: nextOrder(rules()) }, defaults || {});
    openSheet({
      build: ctx => {
        const title = h('input', { class: 'input', id: 'r-title', type: 'text', maxlength: '40', value: r.title, autofocus: !existing });
        const err = h('p', { class: 'pin-msg', role: 'alert' });
        let sign = r.points < 0 ? -1 : 1, mag = Math.abs(r.points) || 1;
        const val = h('span', { class: 'val' });
        const signBox = h('div');
        const paint = () => { val.textContent = signed(sign * mag); val.style.color = sign > 0 ? 'var(--good)' : 'var(--bad)'; signBox.replaceChildren(seg([[1, '＋ ' + t('positive')], [-1, '− ' + t('negative')]], sign, v => { sign = v; paint(); })); };
        paint();
        const cats = [...new Set(rules().map(x => x.category).filter(Boolean))];
        const cat = h('input', { class: 'input', id: 'r-cat', type: 'text', maxlength: '24', value: r.category || '', list: 'r-cats' });
        return [
          sheetHead(ctx, existing ? t('editRule') : t('newRule')),
          h('div', { class: 'form' },
            h('label', { class: 'field', for: 'r-title' }, h('span', null, t('title')), title), err,
            h('div', { class: 'field' }, h('span', null, t('points')), signBox, h('div', { class: 'stepper' },
              h('button', { type: 'button', class: 'btn', 'aria-label': t('lessPts'), onclick: () => { mag = Math.max(1, mag - 1); paint(); } }, '−'), val,
              h('button', { type: 'button', class: 'btn', 'aria-label': t('morePts'), onclick: () => { mag = Math.min(50, mag + 1); paint(); } }, '+'))),
            h('div', { class: 'field' }, h('span', null, t('icon')), emojiPicker(EMOJIS_ITEM, r.icon, e => { r.icon = e; }, 'r-emoji')),
            h('label', { class: 'field', for: 'r-cat' }, h('span', null, t('category')), cat, h('datalist', { id: 'r-cats' }, cats.map(c => h('option', { value: c })))),
            h('div', { class: 'form-actions' },
              existing ? deleteButton(ctx, r.title, t('deleteBody'), () => deleteItem('rules', r.id)) : null,
              h('span', { class: 'spacer' }),
              h('button', { class: 'btn ghost', type: 'button', onclick: () => ctx.close() }, t('cancel')),
              h('button', { class: 'btn primary', type: 'button', onclick: () => {
                r.title = title.value.trim(); if (!r.title) { err.textContent = t('required'); title.focus(); return; }
                r.points = sign * mag; r.category = cat.value.trim();
                saveItem('rules', r); ctx.close(); toast(t('saved'));
              } }, t('save'))))
        ];
      }
    });
  }

  function editReward(existing) {
    const r = existing ? clone(existing) : { id: FP.uid(), title: '', icon: '🎁', cost: 10, active: true, order: nextOrder(rewards()) };
    openSheet({
      build: ctx => {
        const title = h('input', { class: 'input', id: 'w-title', type: 'text', maxlength: '40', value: r.title, autofocus: !existing });
        const err = h('p', { class: 'pin-msg', role: 'alert' });
        const val = h('span', { class: 'val' }, r.cost);
        const step = d => { r.cost = Math.max(1, Math.min(999, r.cost + d)); val.textContent = r.cost; };
        return [
          sheetHead(ctx, existing ? t('editReward') : t('newReward')),
          h('div', { class: 'form' },
            h('label', { class: 'field', for: 'w-title' }, h('span', null, t('title')), title), err,
            h('div', { class: 'field' }, h('span', null, t('cost')), h('div', { class: 'stepper' },
              h('button', { type: 'button', class: 'btn', 'aria-label': '−5', onclick: () => step(-5) }, '−5'),
              h('button', { type: 'button', class: 'btn', 'aria-label': t('lessPts'), onclick: () => step(-1) }, '−'), val,
              h('button', { type: 'button', class: 'btn', 'aria-label': t('morePts'), onclick: () => step(1) }, '+'),
              h('button', { type: 'button', class: 'btn', 'aria-label': '+5', onclick: () => step(5) }, '+5'))),
            h('div', { class: 'field' }, h('span', null, t('icon')), emojiPicker(EMOJIS_ITEM, r.icon, e => { r.icon = e; }, 'w-emoji')),
            h('div', { class: 'switch' }, h('label', { for: 'w-active' }, t('active')), toggle('w-active', r.active !== false, v => { r.active = v; }, t('active'))),
            h('div', { class: 'form-actions' },
              existing ? deleteButton(ctx, r.title, t('deleteBody'), () => deleteItem('rewards', r.id)) : null,
              h('span', { class: 'spacer' }),
              h('button', { class: 'btn ghost', type: 'button', onclick: () => ctx.close() }, t('cancel')),
              h('button', { class: 'btn primary', type: 'button', onclick: () => {
                r.title = title.value.trim(); if (!r.title) { err.textContent = t('required'); title.focus(); return; }
                saveItem('rewards', r); ctx.close(); toast(t('saved'));
              } }, t('save'))))
        ];
      }
    });
  }

  function openTemplates(kind) {
    const isRule = kind === 'rules';
    const have = new Set((isRule ? rules() : rewards()).map(x => x.title.toLowerCase()));
    const avail = (isRule ? FP.RULE_TEMPLATES : FP.REWARD_TEMPLATES).filter(x => !have.has(x.title.toLowerCase()));
    const picked = new Set();
    openSheet({
      build: ctx => {
        const addBtn = h('button', { class: 'btn primary', type: 'button', disabled: true }, t('addSelected', { n: 0 }));
        const paintBtn = () => { addBtn.disabled = !picked.size; addBtn.textContent = t('addSelected', { n: picked.size }); };
        addBtn.addEventListener('click', () => {
          let order = nextOrder(isRule ? rules() : rewards());
          for (const tpl of avail) if (picked.has(tpl.title)) {
            saveItem(kind, isRule ? { id: FP.uid(), ...tpl, order: order++ } : { id: FP.uid(), ...tpl, active: true, order: order++ });
          }
          ctx.close(); toast(t('saved'));
        });
        return [sheetHead(ctx, t('templatesTitle')),
          avail.length ? h('ul', { class: 'list card' }, avail.map(tpl => {
            const pts = isRule ? tpl.points : -tpl.cost;
            const tg = toggle('tpl-' + FP.uid(), false, v => { v ? picked.add(tpl.title) : picked.delete(tpl.title); paintBtn(); }, tpl.title);
            return h('li', { class: 'row' }, h('span', { class: 'ico', 'aria-hidden': 'true' }, tpl.icon),
              h('span', { class: 'grow' }, h('div', { class: 'title' }, tpl.title), tpl.category ? h('div', { class: 'meta' }, tpl.category) : null),
              h('span', { class: 'pill ' + (isRule ? (pts >= 0 ? 'pos' : 'neg') : 'neu') }, isRule ? signed(pts) : '★ ' + tpl.cost), tg);
          })) : h('p', { class: 'sub' }, t('templatesEmpty')),
          h('div', { class: 'form-actions' }, h('button', { class: 'btn ghost', type: 'button', onclick: () => ctx.close() }, t('cancel')), addBtn)];
      }
    });
  }

  function move(coll, list, i, d) {
    const j = i + d; if (j < 0 || j >= list.length) return;
    const a = clone(list[i]), b = clone(list[j]);
    // Normaliza el orden y luego intercambia
    list.forEach((x, k) => { if (x.order !== k && k !== i && k !== j) saveItem(coll, Object.assign(clone(x), { order: k })); });
    a.order = j; b.order = i;
    saveItem(coll, a); saveItem(coll, b);
  }
  function orderedList(coll, list, rowContent, onEdit) {
    return h('ul', { class: 'list' }, list.map((it, i) => {
      const name = it.name || it.title;
      return h('li', { class: 'row' },
        h('button', { class: 'grow', type: 'button', 'aria-label': t('editItem', { name }), onclick: () => onEdit(it) }, rowContent(it)),
        h('span', { class: 'order-btns' },
          h('button', { class: 'icon-btn', type: 'button', disabled: i === 0, 'aria-label': t('moveUp', { name }), onclick: () => move(coll, list, i, -1) }, icon('up')),
          h('button', { class: 'icon-btn', type: 'button', disabled: i === list.length - 1, 'aria-label': t('moveDown', { name }), onclick: () => move(coll, list, i, 1) }, icon('down'))));
    }));
  }

  function renderSettings() {
    const st = S.settings;
    const addBtn = (label, fn) => h('button', { class: 'btn small primary', type: 'button', onclick: fn }, icon('plus'), label);
    const membersCard = h('section', { class: 'card set-card' },
      h('h2', null, t('members'), addBtn(t('add'), () => editMember())),
      orderedList('members', members(), m => [avatar(m, 'md'), h('span', { class: 'grow' }, h('div', { class: 'title' }, m.name), h('div', { class: 'meta' }, m.role === 'adult' ? t('adult') : t('child')))], editMember));
    const rulesCard = h('section', { class: 'card set-card' },
      h('h2', null, t('rules'), h('span', { class: 'chips' }, h('button', { class: 'btn small', type: 'button', onclick: () => openTemplates('rules') }, t('templates')), addBtn(t('add'), () => editRule()))),
      orderedList('rules', rules(), r => [h('span', { class: 'ico', 'aria-hidden': 'true' }, r.icon), h('span', { class: 'grow' }, h('div', { class: 'title' }, r.title), r.category ? h('div', { class: 'meta' }, r.category) : null),
        h('span', { class: 'pill ' + (r.points >= 0 ? 'pos' : 'neg') }, signed(r.points))], editRule));
    const rewardsCard = h('section', { class: 'card set-card' },
      h('h2', null, t('rewards'), h('span', { class: 'chips' }, h('button', { class: 'btn small', type: 'button', onclick: () => openTemplates('rewards') }, t('templates')), addBtn(t('add'), () => editReward()))),
      orderedList('rewards', rewards(), r => [h('span', { class: 'ico', 'aria-hidden': 'true' }, r.icon), h('span', { class: 'grow' }, h('div', { class: 'title' }, r.title), r.active === false ? h('div', { class: 'meta' }, t('inactive')) : null),
        h('span', { class: 'pill neu' }, '★ ' + r.cost)], editReward));
    const chalRow = c => [h('span', { class: 'ico', 'aria-hidden': 'true' }, c.icon || FP.CHALLENGE_ICONS[c.type]),
      h('span', { class: 'grow' }, h('div', { class: 'title' }, c.title),
        h('div', { class: 'meta' }, [t(TYPE_LABEL[c.type]), t(PERIOD_LABEL[c.period] || 'periodWeekly'), !c.memberIds || !c.memberIds.length ? '' : namesOf(c.memberIds), c.active === false ? t('paused') : ''].filter(Boolean).join(' · '))),
      c.stars > 0 ? h('span', { class: 'pill pos' }, '+' + c.stars) : null];
    const chalList = challengesList().filter(c => !c.pool && !(c.period === 'week' && c.weekStart < FP.weekStart(Date.now()) - 7 * FP.DAY));
    const challengesCard = h('section', { class: 'card set-card' },
      h('h2', null, t('challengesS'), addBtn(t('add'), () => editChallenge())),
      h('p', { class: 'note' }, t('challengesNote')),
      chalList.length ? orderedList('challenges', chalList, chalRow, c => editChallenge(c)) : h('p', { class: 'note' }, t('challengesNone')));
    const resetCard = h('section', { class: 'card set-card' },
      h('h2', null, t('resetTitleS')),
      seg([['manual', t('resetManual')], ['weekly', t('resetWeekly')], ['monthly', t('resetMonthly')]], st.resetMode, v => saveSettings({ resetMode: v, lastResetKey: FP.periodKey(v, Date.now()) })),
      h('p', { class: 'note' }, t(st.resetMode === 'weekly' ? 'resetNoteWeekly' : st.resetMode === 'monthly' ? 'resetNoteMonthly' : 'resetNoteManual')),
      h('div', { style: { 'padding-bottom': '.6rem' } }, h('button', { class: 'btn bad small', type: 'button', onclick: async () => {
        if (!(await confirmSheet({ title: t('resetQ'), body: t('resetBody'), ok: t('resetNow'), danger: true }))) return;
        FP.resetMovements(members(), movements(), redemptions(), Date.now()).forEach(m => addMovement(m));
        toast(t('resetDone'));
      } }, '🔄 ' + t('resetNow'))));
    const secCard = h('section', { class: 'card set-card' },
      h('h2', null, t('security')),
      h('p', { class: 'note' }, st.pinHash ? t('pinSet') : t('pinNone')),
      h('div', { class: 'chips', style: { 'margin-bottom': '.5rem' } },
        h('button', { class: 'btn small primary', type: 'button', onclick: setNewPin }, st.pinHash ? t('changePin') : t('createPin')),
        st.pinHash ? h('button', { class: 'btn small', type: 'button', onclick: () => { saveSettings({ pinHash: '', pinSalt: '' }); toast(t('pinRemoved')); } }, t('removePin')) : null,
        st.pinHash ? h('button', { class: 'btn small', type: 'button', onclick: () => { S.unlockedUntil = 0; S.tab = 'panel'; renderNav(); render(); toast(t('locked')); } }, icon('lock'), t('lockNow')) : null),
      st.pinHash ? h('div', { class: 'switch' }, h('label', { for: 's-pinpts' }, t('pinForPoints')), toggle('s-pinpts', st.pinForPoints, v => saveSettings({ pinForPoints: v }), t('pinForPoints'))) : null);
    const fxCard = h('section', { class: 'card set-card' },
      h('h2', null, t('effects')),
      h('div', { class: 'switch' }, h('label', { for: 's-sound' }, t('sounds')), toggle('s-sound', st.sound, v => saveSettings({ sound: v }), t('sounds'))),
      h('div', { class: 'switch' }, h('label', { for: 's-conf' }, t('confetti')), toggle('s-conf', st.confetti, v => saveSettings({ confetti: v }), t('confetti'))));
    const allEntries = () => FP.historyEntries(movements(), redemptions());
    const dataCard = h('section', { class: 'card set-card' },
      h('h2', null, t('data')),
      h('p', { class: 'note' }, S.mode === 'cloud' ? t('storeCloud') : S.mode === 'firebase' ? t('storeFirebase', { email: (S.user && S.user.email) || '' }) : t('storeLocal')),
      S.mode === 'firebase' ? h('div', { style: { 'padding-bottom': '.6rem' } }, h('button', { class: 'btn small', type: 'button', onclick: async () => {
        if (await confirmSheet({ title: t('logoutQ'), body: t('logoutBody'), ok: t('logout') })) { S.unlockedUntil = 0; firebase.auth().signOut(); }
      } }, t('logout'))) : null,
      h('div', { class: 'chips', style: { 'padding-bottom': '.6rem' } },
        h('button', { class: 'btn small', type: 'button', onclick: () => exportCSV(allEntries()) }, t('exportCSV')),
        h('button', { class: 'btn small', type: 'button', onclick: () => exportPDF(allEntries()) }, t('exportPDF')),
        h('button', { class: 'btn small bad', type: 'button', onclick: async () => {
          if (!(await confirmSheet({ title: t('clearQ'), body: t('clearBody'), ok: t('clearHistory'), danger: true }))) return;
          for (const k of [...S.logs.keys()]) { S.logs.delete(k); persistLog(k); }
          changed(); toast(t('cleared'));
        } }, t('clearHistory'))),
      h('h3', { class: 'col-title', style: { 'margin-top': '.5rem' } }, t('backupTitle')),
      h('p', { class: 'note' }, t('backupNote')),
      h('div', { class: 'chips', style: { 'padding-bottom': '.6rem' } },
        h('button', { class: 'btn small primary', type: 'button', onclick: saveBackup }, '💾 ' + t('backupSave')),
        h('label', { class: 'btn small', for: 'backup-file' }, '📂 ' + t('backupRestore')),
        h('input', { type: 'file', id: 'backup-file', class: 'sr', accept: '.json,application/json', onchange: e => { const f = e.target.files[0]; e.target.value = ''; if (f) restoreBackup(f); } })));
    return h('div', null,
      h('div', { class: 'page-head' }, h('h1', null, t('settingsTitle'))),
      !st.pinHash ? h('div', { class: 'banner' }, h('span', { style: { 'font-size': '1.8rem' }, 'aria-hidden': 'true' }, '🔒'), h('p', null, t('pinBanner')),
        h('button', { class: 'btn small primary', type: 'button', onclick: setNewPin }, t('createPin'))) : null,
      h('div', { class: 'settings' },
        h('div', { style: { display: 'grid', gap: '1.25rem', 'grid-template-columns': 'minmax(0, 1fr)' } }, membersCard, rulesCard, rewardsCard, challengesCard),
        h('div', { style: { display: 'grid', gap: '1.25rem', 'grid-template-columns': 'minmax(0, 1fr)' } }, secCard, resetCard, fxCard, dataCard)));
  }
  function saveBackup() {
    const logs = {};
    S.logs.forEach((l, k) => { logs[k] = { movements: l.movements, redemptions: l.redemptions, achievements: l.achievements || [] }; });
    const b = FP.makeBackup({ members: members(), rules: rules(), rewards: rewards(), challenges: challengesList(), logs, settings: S.settings }, Date.now());
    const json = JSON.stringify(b);
    offerFile('family-points-copia-' + FP.ymd(Date.now()) + '.json', json, json);
  }
  async function restoreBackup(file) {
    let b;
    try { b = FP.parseBackup(await file.text()); } catch (e) { toast(e.message); return; }
    const moves = Object.values(b.logs).reduce((a, l) => a + l.movements.length, 0);
    if (!(await confirmSheet({ title: t('restoreQ'), body: t('restoreBody', { members: b.members.length, moves }), ok: t('restoreOk'), danger: true }))) return;
    for (const coll of ['members', 'rules', 'rewards', 'challenges']) for (const id of [...S[coll].keys()]) deleteItem(coll, id);
    for (const k of [...S.logs.keys()]) { S.logs.delete(k); persistLog(k); }
    b.members.forEach(m => saveItem('members', m));
    b.rules.forEach(r => saveItem('rules', r));
    b.rewards.forEach(r => saveItem('rewards', r));
    b.challenges.forEach(c => saveItem('challenges', c));
    for (const k in b.logs) { S.logs.set(k, b.logs[k]); persistLog(k); }
    saveSettings(Object.assign({}, b.settings, { onboarded: true }));
    toast(t('restored'));
  }
  async function setNewPin() {
    const pin = await pinSheet('create');
    if (!pin) return;
    const rec = await FP.createPinRecord(pin);
    S.unlockedUntil = Date.now() + 3 * 60 * 1000;
    saveSettings(rec);
    toast(t('pinSaved'));
  }

  // Exponer lo mínimo para pruebas automatizadas
  window.__FP_APP__ = { S, t, balanceOf, achievements };

  render();
  init();
})();
