// Family Points — lógica pura (sin DOM). La usan app.js y los tests de Node.
// Todas las fechas son milisegundos en hora local del dispositivo.
(function (root) {
  'use strict';

  const DAY = 86400000;

  function uid() {
    const c = root.crypto;
    if (c && c.randomUUID) return c.randomUUID().replace(/-/g, '').slice(0, 20);
    return (Date.now().toString(36) + Math.random().toString(36).slice(2, 12));
  }

  // ---------- Fechas y periodos ----------
  function pad(n) { return String(n).padStart(2, '0'); }
  function ymd(t) { const d = new Date(t); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function dayStart(t) { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }
  // Semana de lunes a domingo.
  function weekStart(t) {
    const d = new Date(t); d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d.getTime();
  }
  function monthStart(t) { const d = new Date(t); return new Date(d.getFullYear(), d.getMonth(), 1).getTime(); }
  function addWeeks(t, n) { const d = new Date(t); d.setDate(d.getDate() + 7 * n); return d.getTime(); }
  function addDays(t, n) { const d = new Date(t); d.setDate(d.getDate() + n); return d.getTime(); }
  function addMonths(t, n) { const d = new Date(t); return new Date(d.getFullYear(), d.getMonth() + n, 1).getTime(); }
  function monthKey(t) { const d = new Date(t); return d.getFullYear() + '-' + pad(d.getMonth() + 1); }
  function periodStart(mode, t) { return mode === 'monthly' ? monthStart(t) : weekStart(t); }
  function periodKey(mode, t) {
    if (mode === 'weekly') return 'W' + ymd(weekStart(t));
    if (mode === 'monthly') return 'M' + monthKey(t);
    return '';
  }

  // ---------- Saldo ----------
  // El saldo nunca se guarda: Σ puntos de movimientos − Σ coste de canjes.
  function balance(memberId, movements, redemptions, before) {
    let total = 0;
    for (const m of movements) {
      if (m.memberId === memberId && (before == null || m.date < before)) total += Number(m.points) || 0;
    }
    for (const r of redemptions) {
      if (r.memberId === memberId && (before == null || r.date < before)) total -= Number(r.cost) || 0;
    }
    return total;
  }

  function balances(members, movements, redemptions) {
    const out = {};
    for (const m of members) out[m.id] = 0;
    for (const mv of movements) if (mv.memberId in out) out[mv.memberId] += Number(mv.points) || 0;
    for (const r of redemptions) if (r.memberId in out) out[r.memberId] -= Number(r.cost) || 0;
    return out;
  }

  // ---------- Ranking semanal ----------
  // Puntos ganados (netos) desde el lunes, sin contar reinicios ni canjes.
  function weeklyRanking(members, movements, now) {
    const from = weekStart(now);
    const pts = {};
    for (const m of members) pts[m.id] = 0;
    for (const mv of movements) {
      if (mv.kind === 'reset' || mv.date < from || mv.date > now || !(mv.memberId in pts)) continue;
      pts[mv.memberId] += Number(mv.points) || 0;
    }
    return members
      .map(m => ({ member: m, points: pts[m.id] }))
      .sort((a, b) => b.points - a.points || (a.member.order || 0) - (b.member.order || 0));
  }

  // ---------- Canjes ----------
  function canRedeem(currentBalance, reward) {
    if (!reward || reward.active === false) return { ok: false, reason: 'inactive', missing: 0 };
    const cost = Number(reward.cost) || 0;
    if (currentBalance < cost) return { ok: false, reason: 'balance', missing: cost - currentBalance };
    return { ok: true, reason: '', missing: 0 };
  }

  function makeRedemption(member, reward, currentBalance, now) {
    const check = canRedeem(currentBalance, reward);
    if (!check.ok) return null;
    return {
      id: uid(), memberId: member.id, rewardId: reward.id,
      title: reward.title, icon: reward.icon, cost: Number(reward.cost) || 0, date: now
    };
  }

  // ---------- Movimientos ----------
  function movementFromRule(member, rule, now, note) {
    return {
      id: uid(), memberId: member.id, ruleId: rule.id, kind: 'rule',
      title: rule.title, icon: rule.icon, points: Number(rule.points) || 0, date: now, note: note || ''
    };
  }
  function customMovement(member, points, reason, now, note) {
    return {
      id: uid(), memberId: member.id, ruleId: '', kind: 'custom',
      title: (reason || '').trim(), icon: points >= 0 ? '⭐' : '⚠️', points: Number(points) || 0, date: now, note: note || ''
    };
  }

  // ---------- Reinicios ----------
  // Un reinicio añade un movimiento "Reinicio" que deja a cero el saldo
  // que había antes de `at`. El historial se conserva.
  function resetMovements(members, movements, redemptions, at) {
    const out = [];
    for (const m of members) {
      const b = balance(m.id, movements, redemptions, at);
      if (b !== 0) {
        out.push({ id: uid(), memberId: m.id, ruleId: '', kind: 'reset', title: 'Reinicio', icon: '🔄', points: -b, date: at, note: '' });
      }
    }
    return out;
  }

  // ¿Toca un reinicio automático? Devuelve la fecha de corte o null.
  // Al activar el modo se guarda la clave del periodo actual para no reiniciar al momento.
  function dueAutoReset(settings, now) {
    const mode = settings && settings.resetMode;
    if (mode !== 'weekly' && mode !== 'monthly') return null;
    const key = periodKey(mode, now);
    if (!settings.lastResetKey || settings.lastResetKey === key) return null;
    return { key, at: periodStart(mode, now) };
  }

  // ---------- Historial ----------
  function historyEntries(movements, redemptions) {
    const a = movements.map(m => ({
      type: m.kind === 'reset' ? 'reset' : (m.points >= 0 ? 'positive' : 'negative'),
      id: m.id, memberId: m.memberId, title: m.title, icon: m.icon, points: m.points, date: m.date, note: m.note || '', source: m
    }));
    const b = redemptions.map(r => ({
      type: 'reward', id: r.id, memberId: r.memberId, title: r.title, icon: r.icon, points: -r.cost, date: r.date, note: '', source: r
    }));
    return a.concat(b).sort((x, y) => y.date - x.date);
  }

  function filterHistory(entries, f) {
    f = f || {};
    return entries.filter(e =>
      (!f.memberId || e.memberId === f.memberId) &&
      (!f.type || f.type === 'all' || e.type === f.type) &&
      (f.from == null || e.date >= f.from) &&
      (f.to == null || e.date < f.to));
  }

  // ---------- Estadísticas ----------
  // Puntos netos por periodo para cada miembro (sin reinicios). gran: 'day' | 'week' | 'month'.
  function series(members, movements, gran, count, now) {
    const first = { day: dayStart, week: weekStart, month: monthStart }[gran] || weekStart;
    const step = (t, n) => gran === 'month' ? addMonths(t, n) : gran === 'day' ? addDays(t, n) : addWeeks(t, n);
    const starts = [];
    let s = first(now);
    for (let i = 0; i < count; i++) { starts.unshift(s); s = step(s, -1); }
    const end = step(starts[starts.length - 1], 1);
    const data = {};
    for (const m of members) data[m.id] = starts.map(() => 0);
    for (const mv of movements) {
      if (mv.kind === 'reset' || !(mv.memberId in data) || mv.date < starts[0] || mv.date >= end) continue;
      let i = starts.length - 1;
      while (i > 0 && mv.date < starts[i]) i--;
      data[mv.memberId][i] += Number(mv.points) || 0;
    }
    return { starts, data };
  }

  function topBehaviors(movements, opts) {
    opts = opts || {};
    const groups = new Map();
    for (const mv of movements) {
      if (mv.kind === 'reset') continue;
      if (opts.memberId && mv.memberId !== opts.memberId) continue;
      if (opts.from != null && mv.date < opts.from) continue;
      const key = mv.ruleId ? 'r:' + mv.ruleId : 'c:' + (mv.title || '').toLowerCase() + ':' + (mv.points >= 0 ? '+' : '-');
      const g = groups.get(key) || { key, title: mv.title || '', icon: mv.icon, count: 0, points: 0, positive: mv.points >= 0 };
      g.count++; g.points += Number(mv.points) || 0;
      groups.set(key, g);
    }
    return [...groups.values()].sort((a, b) => b.count - a.count || Math.abs(b.points) - Math.abs(a.points)).slice(0, opts.limit || 8);
  }

  // ---------- Exportar ----------
  const TYPE_LABEL = { positive: 'Positivo', negative: 'Negativo', reward: 'Canje', reset: 'Reinicio' };
  function csvCell(v) {
    const s = String(v == null ? '' : v);
    return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function toCSV(entries, members) {
    const names = {};
    for (const m of members) names[m.id] = m.name;
    const rows = [['Fecha', 'Hora', 'Miembro', 'Tipo', 'Concepto', 'Puntos', 'Nota']];
    for (const e of entries) {
      const d = new Date(e.date);
      rows.push([ymd(e.date), pad(d.getHours()) + ':' + pad(d.getMinutes()), names[e.memberId] || '—',
        TYPE_LABEL[e.type] || e.type, e.title, e.points, e.note]);
    }
    return '﻿' + rows.map(r => r.map(csvCell).join(';')).join('\r\n') + '\r\n';
  }

  // ---------- PIN parental ----------
  function isValidPin(pin) { return /^\d{4}$/.test(String(pin)); }
  function toHex(buf) { return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join(''); }
  function newSalt() { const a = new Uint8Array(16); root.crypto.getRandomValues(a); return toHex(a); }
  async function hashPin(pin, salt) {
    const enc = new TextEncoder();
    const key = await root.crypto.subtle.importKey('raw', enc.encode(String(pin)), 'PBKDF2', false, ['deriveBits']);
    const bits = await root.crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: 120000 }, key, 256);
    return toHex(bits);
  }
  async function createPinRecord(pin) {
    if (!isValidPin(pin)) throw new Error('El PIN debe tener 4 cifras');
    const salt = newSalt();
    return { pinSalt: salt, pinHash: await hashPin(pin, salt) };
  }
  async function verifyPin(pin, settings) {
    if (!settings || !settings.pinHash) return true;
    if (!isValidPin(pin)) return false;
    return (await hashPin(pin, settings.pinSalt)) === settings.pinHash;
  }

  // ---------- Hitos ----------
  // Devuelve el hito (múltiplo de `step`) cruzado al subir de `before` a `after`, o 0.
  function milestoneCrossed(before, after, step) {
    step = step || 25;
    if (after <= before || after < step) return 0;
    const m = Math.floor(after / step) * step;
    return m > before ? m : 0;
  }

  // ---------- Plantillas ----------
  const MEMBER_COLORS = ['#E5603D', '#00978C', '#C28A00', '#8452D6', '#2E9B5A', '#A85A16', '#2B7FD4', '#D6458C'];
  const RULE_TEMPLATES = [
    { title: 'Hacer la cama', icon: '🛏️', points: 1, category: 'Rutinas' },
    { title: 'Lavarse los dientes', icon: '🪥', points: 1, category: 'Rutinas' },
    { title: 'Recoger los juguetes', icon: '🧸', points: 1, category: 'Casa' },
    { title: 'Ayudar en casa', icon: '🧹', points: 2, category: 'Casa' },
    { title: 'Hacer los deberes', icon: '📚', points: 2, category: 'Colegio' },
    { title: 'Comer bien', icon: '🥦', points: 1, category: 'Rutinas' },
    { title: 'Pelearse', icon: '😠', points: -2, category: 'Comportamiento' },
    { title: 'Gritar', icon: '📢', points: -1, category: 'Comportamiento' },
    { title: 'No hacer caso', icon: '🙉', points: -1, category: 'Comportamiento' },
    { title: 'Mentir', icon: '🤥', points: -3, category: 'Comportamiento' },
    // Plantillas adicionales (no se cargan en el ejemplo inicial)
    { title: 'Leer un rato', icon: '📖', points: 2, category: 'Colegio' },
    { title: 'Vestirse solo', icon: '👕', points: 1, category: 'Rutinas' },
    { title: 'Poner la mesa', icon: '🍽️', points: 1, category: 'Casa' },
    { title: 'Ser amable', icon: '💛', points: 2, category: 'Comportamiento' },
    { title: 'Dormir a su hora', icon: '😴', points: 1, category: 'Rutinas' },
    { title: 'Compartir', icon: '🤝', points: 2, category: 'Comportamiento' },
    { title: 'Ducharse sin protestar', icon: '🚿', points: 1, category: 'Rutinas' },
    { title: 'Pantallas sin permiso', icon: '📵', points: -2, category: 'Comportamiento' },
    { title: 'Desordenar', icon: '🌪️', points: -1, category: 'Casa' },
    { title: 'Decir palabrotas', icon: '🤬', points: -2, category: 'Comportamiento' }
  ];
  const REWARD_TEMPLATES = [
    { title: '30 min de tablet', icon: '📱', cost: 10 },
    { title: 'Elegir la peli', icon: '🎬', cost: 15 },
    { title: 'Un helado', icon: '🍦', cost: 20 },
    { title: 'Tarde en el parque', icon: '🛝', cost: 40 },
    { title: 'Juguete pequeño', icon: '🎁', cost: 60 },
    // Plantillas adicionales
    { title: 'Elegir la cena', icon: '🍕', cost: 15 },
    { title: 'Acostarse 15 min más tarde', icon: '🌙', cost: 10 },
    { title: 'Noche de juegos', icon: '🎲', cost: 25 },
    { title: 'Excursión especial', icon: '🏞️', cost: 80 },
    { title: 'Invitar a un amigo', icon: '🧒', cost: 30 }
  ];

  function exampleData(now) {
    now = now || Date.now();
    const members = [
      { name: 'Lucía', emoji: '🦊', role: 'child' },
      { name: 'Mateo', emoji: '🐼', role: 'child' },
      { name: 'Papá', emoji: '🦁', role: 'adult' }
    ].map((m, i) => ({ id: uid(), name: m.name, emoji: m.emoji, photo: '', color: MEMBER_COLORS[i], role: m.role, order: i, createdAt: now }));
    const rules = RULE_TEMPLATES.slice(0, 10).map((r, i) => ({ id: uid(), ...r, order: i }));
    const rewards = REWARD_TEMPLATES.slice(0, 5).map((r, i) => ({ id: uid(), ...r, active: true, order: i }));
    return { members, rules, rewards };
  }

  // ---------- Retos ----------
  // Tipos: 'count' (una regla N veces en la semana), 'streak' (una regla N días seguidos),
  // 'clean' (ninguna vez una regla negativa en toda la semana), 'family' (entre todos N estrellas)
  // y 'free' (objetivo libre que marca un adulto).
  // Duración (period): 'weekly' (se repite cada semana), 'week' (solo la semana weekStart) u 'open' (sin fecha).
  // Un reto conseguido nunca se premia solo: queda «listo para confirmar» hasta que un adulto lo acepta o lo descarta.
  // Cada decisión se guarda como un logro (achievement): {challengeId, periodKey, memberId, status: 'confirmed'|'dismissed'}.
  const CHALLENGE_TYPES = ['count', 'streak', 'clean', 'family', 'free'];
  const CHALLENGE_ICONS = { count: '🔁', streak: '🔥', clean: '🧼', family: '👨‍👩‍👧', free: '✍️' };

  // Periodo del reto: offset 0 = el actual, -1 = el anterior. null si no aplica.
  function challengePeriod(ch, now, offset) {
    offset = offset || 0;
    if (ch.period === 'open') return offset === 0 ? { key: 'open', start: ch.createdAt || 0, end: Infinity, ended: false } : null;
    const cur = weekStart(now);
    let start;
    if (ch.period === 'week') { start = ch.weekStart; if (start !== addWeeks(cur, offset)) return null; }
    else start = addWeeks(cur, offset);
    const end = addWeeks(start, 1);
    if ((ch.createdAt || 0) >= end) return null; // el reto aún no existía
    return { key: ymd(start), start, end, ended: now >= end };
  }

  // Miembros a los que se aplica: los elegidos o, si no hay, todos los niños (o todos si no hay niños).
  function challengeMembers(ch, members) {
    if (ch.memberIds && ch.memberIds.length) return members.filter(m => ch.memberIds.includes(m.id));
    const kids = members.filter(m => m.role !== 'adult');
    return kids.length ? kids : members;
  }

  // Progreso de un reto en un periodo. ids: miembros que cuentan (uno, o varios en 'family').
  // Devuelve {value, target, done, failed}.
  function challengeProgress(ch, ids, movements, period, now) {
    const until = Math.min(period.end, now + 1);
    const inP = m => ids.includes(m.memberId) && m.date >= period.start && m.date < until;
    const target = Math.max(1, Number(ch.target) || 1);
    if (ch.type === 'count') {
      const n = movements.filter(m => inP(m) && m.kind === 'rule' && m.ruleId === ch.ruleId).length;
      return { value: n, target, done: n >= target, failed: false };
    }
    if (ch.type === 'streak') {
      const days = new Set(movements.filter(m => inP(m) && m.kind === 'rule' && m.ruleId === ch.ruleId).map(m => dayStart(m.date)));
      let best = 0, run = 0;
      for (let d = dayStart(period.start); d < until && d <= now; d = addDays(d, 1)) {
        run = days.has(d) ? run + 1 : 0; best = Math.max(best, run);
      }
      return { value: Math.min(best, target), target, done: best >= target, failed: false };
    }
    if (ch.type === 'clean') {
      const n = movements.filter(m => inP(m) && m.kind === 'rule' && m.ruleId === ch.ruleId).length;
      const elapsed = Math.min(7, Math.max(0, Math.ceil((Math.min(period.end, now) - period.start) / DAY)));
      return { value: n ? 0 : elapsed, target: 7, done: n === 0 && period.ended, failed: n > 0 };
    }
    if (ch.type === 'family') {
      const total = movements.filter(m => inP(m) && (m.kind === 'rule' || m.kind === 'custom') && m.points > 0).reduce((a, m) => a + m.points, 0);
      return { value: total, target, done: total >= target, failed: false };
    }
    return { value: 0, target: 1, done: false, failed: false }; // 'free': lo marca un adulto
  }

  function findAchievement(achievements, ch, periodKey, memberId) {
    return achievements.find(a => a.challengeId === ch.id && a.periodKey === periodKey && (ch.type === 'family' || a.memberId === memberId));
  }

  // Estado de un reto para un miembro (o para la familia) en el periodo actual.
  function challengeState(ch, members, movements, achievements, now) {
    const period = challengePeriod(ch, now, 0);
    if (!period) return null;
    const who = challengeMembers(ch, members);
    const status = (prog, rec) => rec ? rec.status : prog.done ? 'ready' : prog.failed ? 'failed' : 'active';
    if (ch.type === 'family') {
      const ids = who.map(m => m.id);
      const prog = challengeProgress(ch, ids, movements, period, now);
      return { period, family: true, rows: [{ memberIds: ids, prog, status: status(prog, findAchievement(achievements, ch, period.key)) }] };
    }
    return {
      period, family: false,
      rows: who.map(m => {
        const prog = challengeProgress(ch, [m.id], movements, period, now);
        return { memberIds: [m.id], prog, status: status(prog, findAchievement(achievements, ch, period.key, m.id)) };
      })
    };
  }

  // Retos conseguidos que esperan la confirmación de un adulto (semana actual y la anterior).
  function pendingChallenges(challenges, members, movements, achievements, now) {
    const out = [];
    for (const ch of challenges) {
      if (ch.pool || ch.active === false || ch.type === 'free') continue;
      for (const offset of [0, -1]) {
        const period = challengePeriod(ch, now, offset);
        if (!period) continue;
        const who = challengeMembers(ch, members);
        if (ch.type === 'family') {
          const ids = who.map(m => m.id);
          if (!findAchievement(achievements, ch, period.key) && challengeProgress(ch, ids, movements, period, now).done) out.push({ ch, period, memberIds: ids, family: true });
        } else {
          for (const m of who) {
            if (!findAchievement(achievements, ch, period.key, m.id) && challengeProgress(ch, [m.id], movements, period, now).done) out.push({ ch, period, memberIds: [m.id], family: false });
          }
        }
      }
    }
    return out;
  }

  // Al confirmar: un logro (insignia) y, si hay estrellas, un movimiento de bonificación por cada miembro.
  function confirmChallenge(ch, period, memberIds, now) {
    const achievements = [], movements = [];
    for (const id of memberIds) {
      const a = { id: uid(), challengeId: ch.id, periodKey: period.key, memberId: id, status: 'confirmed', title: ch.title, icon: ch.icon || CHALLENGE_ICONS[ch.type], stars: Number(ch.stars) || 0, family: ch.type === 'family', date: now };
      achievements.push(a);
      if (a.stars > 0) movements.push({ id: uid(), memberId: id, ruleId: '', kind: 'challenge', achievementId: a.id, title: 'Reto: ' + ch.title, icon: '🏆', points: a.stars, date: now, note: '' });
    }
    return { achievements, movements };
  }
  function dismissChallenge(ch, period, memberIds, now) {
    return memberIds.map(id => ({ id: uid(), challengeId: ch.id, periodKey: period.key, memberId: id, status: 'dismissed', title: ch.title, icon: ch.icon, stars: 0, family: ch.type === 'family', date: now }));
  }

  // Insignias por miembro: [{title, icon, count, last}] agrupadas por reto.
  function badgesFor(memberId, achievements) {
    const g = new Map();
    for (const a of achievements) {
      if (a.memberId !== memberId || a.status !== 'confirmed') continue;
      const k = a.challengeId + '|' + a.title;
      const b = g.get(k) || { key: k, title: a.title, icon: a.icon, count: 0, last: 0, family: a.family };
      b.count++; b.last = Math.max(b.last, a.date);
      g.set(k, b);
    }
    return [...g.values()].sort((x, y) => y.last - x.last);
  }

  // Título por defecto según el tipo
  function challengeTitle(ch, rule) {
    const r = rule ? rule.title : '';
    if (ch.type === 'count') return r + ' ' + ch.target + (Number(ch.target) === 1 ? ' vez' : ' veces');
    if (ch.type === 'streak') return r + ' ' + ch.target + ' días seguidos';
    if (ch.type === 'clean') return 'Semana sin «' + r + '»';
    if (ch.type === 'family') return 'Entre todos, ' + ch.target + ' estrellas';
    return 'Reto especial';
  }

  // Ideas para la ruleta a partir de las reglas existentes
  function defaultPool(rules, now) {
    const pos = rules.filter(r => r.points > 0).slice(0, 4), neg = rules.filter(r => r.points < 0).slice(0, 2);
    const mk = (o, rule) => Object.assign({ id: uid(), pool: true, active: true, period: 'week', memberIds: [], createdAt: now || Date.now(), ruleId: rule ? rule.id : '', reward: '' }, o, { title: challengeTitle(o, rule) });
    const out = [];
    pos.forEach(r => {
      out.push(mk({ type: 'count', target: 4, stars: 4, icon: r.icon }, r));
      out.push(mk({ type: 'streak', target: 3, stars: 5, icon: '🔥' }, r));
    });
    neg.forEach(r => out.push(mk({ type: 'clean', target: 7, stars: 6, icon: '🧼' }, r)));
    out.push(mk({ type: 'family', target: 40, stars: 0, icon: '👨‍👩‍👧', reward: 'Noche de peli en familia' }));
    return out;
  }

  // Ruleta: convierte ideas del bote en retos de esta semana. mode 'each' = uno por niño; 'all' = uno para todos.
  function rouletteChallenges(pool, members, mode, now, rnd) {
    rnd = rnd || Math.random;
    const ideas = pool.filter(c => c.active !== false);
    if (!ideas.length) return [];
    const make = (tpl, memberIds) => Object.assign({}, tpl, { id: uid(), pool: false, active: true, period: 'week', weekStart: weekStart(now), memberIds, source: 'roulette', createdAt: now });
    if (mode === 'all') return [make(ideas[Math.floor(rnd() * ideas.length)], [])];
    const kids = members.filter(m => m.role !== 'adult');
    const individual = ideas.filter(c => c.type !== 'family');
    const list = individual.length ? individual : ideas;
    return (kids.length ? kids : members).map(m => make(list[Math.floor(rnd() * list.length)], [m.id]));
  }

  // ---------- Copia de seguridad ----------
  function makeBackup(data, now) {
    return {
      app: 'family-points', version: 1, exportedAt: now || Date.now(),
      members: data.members || [], rules: data.rules || [], rewards: data.rewards || [],
      challenges: data.challenges || [], logs: data.logs || {}, settings: data.settings || {}
    };
  }
  // Valida y normaliza una copia. Lanza un Error con un mensaje para la familia si no es válida.
  function parseBackup(text) {
    let b;
    try { b = typeof text === 'string' ? JSON.parse(text) : text; } catch (e) { throw new Error('El archivo no es una copia de Family Points'); }
    if (!b || b.app !== 'family-points' || !Array.isArray(b.members) || !Array.isArray(b.rules) || !Array.isArray(b.rewards)) {
      throw new Error('El archivo no es una copia de Family Points');
    }
    const okId = x => x && typeof x.id === 'string' && x.id.length > 0 && /^[A-Za-z0-9_\-.~:@+]{1,200}$/.test(x.id);
    const logs = {};
    for (const k of Object.keys(b.logs || {})) {
      if (!/^\d{4}-\d{2}$/.test(k)) continue;
      const l = b.logs[k] || {};
      logs[k] = {
        movements: (Array.isArray(l.movements) ? l.movements : []).filter(m => m && m.memberId && typeof m.date === 'number'),
        redemptions: (Array.isArray(l.redemptions) ? l.redemptions : []).filter(r => r && r.memberId && typeof r.date === 'number'),
        achievements: (Array.isArray(l.achievements) ? l.achievements : []).filter(a => a && a.challengeId && typeof a.date === 'number')
      };
    }
    return {
      members: b.members.filter(okId), rules: b.rules.filter(okId), rewards: b.rewards.filter(okId),
      challenges: (Array.isArray(b.challenges) ? b.challenges : []).filter(okId),
      logs, settings: (b.settings && typeof b.settings === 'object') ? b.settings : {}, exportedAt: b.exportedAt || 0
    };
  }

  const api = {
    DAY, uid, ymd, dayStart, weekStart, monthStart, addDays, addWeeks, addMonths, monthKey, periodStart, periodKey,
    balance, balances, weeklyRanking, canRedeem, makeRedemption, movementFromRule, customMovement,
    resetMovements, dueAutoReset, historyEntries, filterHistory, series, topBehaviors, toCSV,
    isValidPin, hashPin, createPinRecord, verifyPin, milestoneCrossed,
    MEMBER_COLORS, RULE_TEMPLATES, REWARD_TEMPLATES, exampleData, makeBackup, parseBackup,
    CHALLENGE_TYPES, CHALLENGE_ICONS, challengePeriod, challengeMembers, challengeProgress, challengeState, pendingChallenges,
    confirmChallenge, dismissChallenge, badgesFor, challengeTitle, defaultPool, rouletteChallenges
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FP = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
