// Tests de la lógica pura. Ejecutar: npm test
const test = require('node:test');
const assert = require('node:assert/strict');
const FP = require('../logic.js');

const T = (y, mo, d, h = 12) => new Date(y, mo - 1, d, h).getTime();
const ana = { id: 'a', name: 'Ana', order: 0 };
const leo = { id: 'l', name: 'Leo', order: 1 };
const mv = (memberId, points, date, kind = 'rule') => ({ id: FP.uid(), memberId, points, date, kind, title: 'x', ruleId: kind === 'rule' ? 'r' + points : '' });

test('saldo = movimientos − canjes', () => {
  const movs = [mv('a', 5, T(2026, 10, 1)), mv('a', -2, T(2026, 10, 2)), mv('l', 3, T(2026, 10, 2))];
  const reds = [{ memberId: 'a', cost: 1, date: T(2026, 10, 3) }];
  assert.equal(FP.balance('a', movs, reds), 2);
  assert.equal(FP.balance('l', movs, reds), 3);
  assert.deepEqual(FP.balances([ana, leo], movs, reds), { a: 2, l: 3 });
});

test('saldo antes de una fecha de corte', () => {
  const movs = [mv('a', 5, T(2026, 10, 1)), mv('a', 4, T(2026, 10, 10))];
  assert.equal(FP.balance('a', movs, [], T(2026, 10, 5)), 5);
});

test('el saldo puede ser negativo', () => {
  assert.equal(FP.balance('a', [mv('a', -3, T(2026, 10, 1))], []), -3);
});

test('canje permitido solo con saldo suficiente y recompensa activa', () => {
  const reward = { id: 'r', title: 'Helado', icon: '🍦', cost: 10, active: true };
  assert.deepEqual(FP.canRedeem(10, reward), { ok: true, reason: '', missing: 0 });
  assert.deepEqual(FP.canRedeem(7, reward), { ok: false, reason: 'balance', missing: 3 });
  assert.equal(FP.canRedeem(50, { ...reward, active: false }).ok, false);
  assert.equal(FP.makeRedemption(ana, reward, 9, Date.now()), null);
  const r = FP.makeRedemption(ana, reward, 12, 1000);
  assert.equal(r.cost, 10); assert.equal(r.memberId, 'a'); assert.equal(r.date, 1000);
});

test('un canje descuenta el saldo', () => {
  const movs = [mv('a', 12, T(2026, 10, 1))];
  const reward = { id: 'r', title: 'Helado', icon: '🍦', cost: 10, active: true };
  const r = FP.makeRedemption(ana, reward, FP.balance('a', movs, []), T(2026, 10, 2));
  assert.equal(FP.balance('a', movs, [r]), 2);
});

test('reinicio manual deja todos los saldos a cero y conserva el historial', () => {
  const movs = [mv('a', 7, T(2026, 10, 1)), mv('l', -2, T(2026, 10, 1))];
  const reds = [{ memberId: 'a', cost: 3, date: T(2026, 10, 2) }];
  const resets = FP.resetMovements([ana, leo], movs, reds, T(2026, 10, 3));
  assert.equal(resets.length, 2);
  const all = movs.concat(resets);
  assert.equal(FP.balance('a', all, reds), 0);
  assert.equal(FP.balance('l', all, reds), 0);
  assert.ok(resets.every(r => r.kind === 'reset'));
});

test('reinicio no crea movimientos si el saldo ya es cero', () => {
  assert.equal(FP.resetMovements([ana], [], [], Date.now()).length, 0);
});

test('reinicio con fecha de corte respeta movimientos posteriores', () => {
  const movs = [mv('a', 10, T(2026, 9, 30)), mv('a', 3, T(2026, 10, 6, 9))];
  const resets = FP.resetMovements([ana], movs, [], T(2026, 10, 5, 0));
  assert.equal(resets[0].points, -10);
  assert.equal(FP.balance('a', movs.concat(resets), []), 3);
});

test('reinicio automático semanal y mensual', () => {
  const mon = T(2026, 10, 5, 8); // lunes
  assert.equal(FP.dueAutoReset({ resetMode: 'manual', lastResetKey: 'x' }, mon), null);
  // Recién activado: guarda el periodo actual, no reinicia
  assert.equal(FP.dueAutoReset({ resetMode: 'weekly', lastResetKey: FP.periodKey('weekly', mon) }, mon), null);
  const due = FP.dueAutoReset({ resetMode: 'weekly', lastResetKey: FP.periodKey('weekly', T(2026, 9, 30)) }, mon);
  assert.equal(due.at, T(2026, 10, 5, 0));
  const dueM = FP.dueAutoReset({ resetMode: 'monthly', lastResetKey: 'M2026-09' }, T(2026, 10, 15));
  assert.equal(dueM.at, T(2026, 10, 1, 0));
  assert.equal(dueM.key, 'M2026-10');
});

test('la semana empieza el lunes', () => {
  assert.equal(FP.weekStart(T(2026, 10, 4)), T(2026, 9, 28, 0)); // domingo → lunes anterior
  assert.equal(FP.weekStart(T(2026, 10, 5)), T(2026, 10, 5, 0));
});

test('ranking semanal ignora reinicios y semanas anteriores', () => {
  const now = T(2026, 10, 7);
  const movs = [mv('a', 2, T(2026, 10, 6)), mv('l', 5, T(2026, 10, 6)), mv('a', 50, T(2026, 9, 30)), mv('l', -20, T(2026, 10, 6), 'reset')];
  const r = FP.weeklyRanking([ana, leo], movs, now);
  assert.deepEqual(r.map(x => [x.member.id, x.points]), [['l', 5], ['a', 2]]);
});

test('filtros del historial', () => {
  const movs = [mv('a', 2, T(2026, 10, 1)), mv('a', -1, T(2026, 10, 2)), mv('l', 3, T(2026, 10, 3)), mv('a', -1, T(2026, 10, 4), 'reset')];
  const reds = [{ id: 'x', memberId: 'a', cost: 5, title: 'Helado', date: T(2026, 10, 5) }];
  const all = FP.historyEntries(movs, reds);
  assert.equal(all[0].type, 'reward');
  assert.equal(FP.filterHistory(all, { memberId: 'a' }).length, 4);
  assert.equal(FP.filterHistory(all, { type: 'negative' }).length, 1);
  assert.equal(FP.filterHistory(all, { type: 'reset' }).length, 1);
  assert.equal(FP.filterHistory(all, { from: T(2026, 10, 3, 0), to: T(2026, 10, 4, 0) }).length, 1);
});

test('series semanales de estadísticas', () => {
  const now = T(2026, 10, 7);
  const movs = [mv('a', 2, T(2026, 10, 6)), mv('a', 3, T(2026, 9, 29)), mv('a', 9, T(2026, 9, 29), 'reset')];
  const s = FP.series([ana], movs, 'week', 3, now);
  assert.equal(s.starts.length, 3);
  assert.deepEqual(s.data.a, [0, 3, 2]);
});

test('comportamientos más frecuentes', () => {
  const movs = [mv('a', 2, 1), mv('a', 2, 2), mv('a', -1, 3)];
  const top = FP.topBehaviors(movs);
  assert.equal(top[0].count, 2);
  assert.equal(top[0].positive, true);
});

test('CSV con separador ; y comillas escapadas', () => {
  const e = FP.historyEntries([{ id: '1', memberId: 'a', points: 2, date: T(2026, 10, 1, 9), kind: 'custom', title: 'Dijo "gracias"; bien', note: '' }], []);
  const csv = FP.toCSV(e, [ana]);
  assert.ok(csv.startsWith('﻿Fecha;Hora;Miembro'));
  assert.ok(csv.includes('2026-10-01;09:00;Ana;Positivo;"Dijo ""gracias""; bien";2;'));
});

test('PIN: formato, hash con sal y verificación', async () => {
  assert.equal(FP.isValidPin('1234'), true);
  assert.equal(FP.isValidPin('12a4'), false);
  assert.equal(FP.isValidPin('123'), false);
  const rec = await FP.createPinRecord('4321');
  assert.notEqual(rec.pinHash, '4321');
  assert.equal(rec.pinHash.length, 64);
  assert.equal(await FP.verifyPin('4321', rec), true);
  assert.equal(await FP.verifyPin('1111', rec), false);
  const rec2 = await FP.createPinRecord('4321');
  assert.notEqual(rec.pinHash, rec2.pinHash); // sal distinta
  assert.equal(await FP.verifyPin('0000', {}), true); // sin PIN no se bloquea
  await assert.rejects(FP.createPinRecord('12'));
});

test('hitos', () => {
  assert.equal(FP.milestoneCrossed(24, 26, 25), 25);
  assert.equal(FP.milestoneCrossed(26, 30, 25), 0);
  assert.equal(FP.milestoneCrossed(30, 20, 25), 0);
});

test('datos de ejemplo: 3 miembros, 10 reglas, 5 recompensas', () => {
  const d = FP.exampleData(1);
  assert.equal(d.members.length, 3);
  assert.equal(d.rules.length, 10);
  assert.equal(d.rewards.length, 5);
  assert.ok(d.rules.some(r => r.points > 0) && d.rules.some(r => r.points < 0));
});

test('copia de seguridad: ida y vuelta y validación', () => {
  const d = FP.exampleData(1);
  const mv0 = { id: 'm1', memberId: d.members[0].id, points: 2, date: T(2026, 10, 1), kind: 'rule', title: 'x' };
  const b = FP.makeBackup({ ...d, logs: { '2026-10': { movements: [mv0], redemptions: [] } }, settings: { sound: false } }, 5);
  const r = FP.parseBackup(JSON.stringify(b));
  assert.equal(r.members.length, 3);
  assert.equal(r.rules.length, 10);
  assert.equal(r.logs['2026-10'].movements.length, 1);
  assert.equal(r.settings.sound, false);
  assert.throws(() => FP.parseBackup('no es json'), /no es una copia/);
  assert.throws(() => FP.parseBackup(JSON.stringify({ app: 'otra' })), /no es una copia/);
  const bad = FP.parseBackup(JSON.stringify({ ...b, logs: { 'zz': {}, '2026-11': { movements: [{ foo: 1 }] } } }));
  assert.deepEqual(Object.keys(bad.logs), ['2026-11']);
  assert.equal(bad.logs['2026-11'].movements.length, 0);
});

test('series diarias: últimos 30 días', () => {
  const now = T(2026, 10, 8, 18);
  const movs = [mv('a', 2, T(2026, 10, 8, 9)), mv('a', 1, T(2026, 10, 7)), mv('a', 5, T(2026, 9, 9, 10)), mv('a', 9, T(2026, 9, 8, 10)), mv('a', 4, T(2026, 10, 7), 'reset')];
  const s = FP.series([ana], movs, 'day', 30, now);
  assert.equal(s.starts.length, 30);
  assert.equal(s.starts[29], T(2026, 10, 8, 0));
  assert.equal(s.starts[0], T(2026, 9, 9, 0));
  assert.equal(s.data.a[29], 2);
  assert.equal(s.data.a[28], 1); // el reinicio no cuenta
  assert.equal(s.data.a[0], 5);  // 9 sept entra; 8 sept queda fuera
  assert.equal(s.data.a.reduce((x, y) => x + y, 0), 8);
});

// ---------- Retos ----------
const kidA = { id: 'a', name: 'Ana', role: 'child', order: 0 };
const kidL = { id: 'l', name: 'Leo', role: 'child', order: 1 };
const dad = { id: 'p', name: 'Papá', role: 'adult', order: 2 };
const fam = [kidA, kidL, dad];
const rmv = (memberId, ruleId, points, date) => ({ id: FP.uid(), memberId, ruleId, points, date, kind: 'rule', title: ruleId });
const MON = T(2026, 10, 5, 0); // lunes
const ch = (o) => Object.assign({ id: 'c' + Math.random(), active: true, period: 'weekly', memberIds: [], createdAt: T(2026, 9, 1), stars: 5, title: 'Reto' }, o);

test('reto de constancia: N veces una regla en la semana', () => {
  const c = ch({ type: 'count', ruleId: 'cama', target: 3 });
  const now = T(2026, 10, 8, 20);
  const p = FP.challengePeriod(c, now, 0);
  assert.equal(p.start, MON);
  const movs = [rmv('a', 'cama', 1, T(2026, 10, 5, 8)), rmv('a', 'cama', 1, T(2026, 10, 6, 8)), rmv('a', 'otra', 1, T(2026, 10, 6, 9)), rmv('a', 'cama', 1, T(2026, 10, 4, 8))];
  assert.deepEqual(FP.challengeProgress(c, ['a'], movs, p, now), { value: 2, target: 3, done: false, failed: false });
  movs.push(rmv('a', 'cama', 1, T(2026, 10, 8, 8)));
  assert.equal(FP.challengeProgress(c, ['a'], movs, p, now).done, true);
  assert.equal(FP.challengeProgress(c, ['l'], movs, p, now).value, 0); // cada niño cuenta por separado
});

test('reto de racha: días seguidos', () => {
  const c = ch({ type: 'streak', ruleId: 'dientes', target: 3 });
  const now = T(2026, 10, 10, 20);
  const p = FP.challengePeriod(c, now, 0);
  const days = [5, 6, 8, 9];
  const movs = days.map(d => rmv('a', 'dientes', 1, T(2026, 10, d, 21)));
  let r = FP.challengeProgress(c, ['a'], movs, p, now);
  assert.equal(r.value, 2); assert.equal(r.done, false); // 5-6 y 8-9: se cortó el 7
  movs.push(rmv('a', 'dientes', 1, T(2026, 10, 10, 9)));
  r = FP.challengeProgress(c, ['a'], movs, p, now);
  assert.equal(r.done, true);
});

test('reto semana limpia: solo se consigue al acabar la semana y falla con una vez', () => {
  const c = ch({ type: 'clean', ruleId: 'pelea', target: 7 });
  const during = T(2026, 10, 8, 12);
  const p = FP.challengePeriod(c, during, 0);
  assert.equal(FP.challengeProgress(c, ['a'], [], p, during).done, false);
  const after = T(2026, 10, 12, 12);
  const prev = FP.challengePeriod(c, after, -1);
  assert.equal(prev.key, '2026-10-05');
  assert.equal(FP.challengeProgress(c, ['a'], [], prev, after).done, true);
  const r = FP.challengeProgress(c, ['a'], [rmv('a', 'pelea', -2, T(2026, 10, 7))], prev, after);
  assert.equal(r.done, false); assert.equal(r.failed, true);
});

test('reto en familia: suma de estrellas positivas de los participantes', () => {
  const c = ch({ type: 'family', target: 10 });
  const now = T(2026, 10, 8, 20);
  const p = FP.challengePeriod(c, now, 0);
  const movs = [rmv('a', 'x', 4, T(2026, 10, 6)), rmv('l', 'x', 5, T(2026, 10, 7)), rmv('l', 'y', -3, T(2026, 10, 7)),
    { id: 'b', memberId: 'a', points: 9, date: T(2026, 10, 7), kind: 'challenge' }];
  assert.equal(FP.challengeProgress(c, ['a', 'l'], movs, p, now).value, 9); // los bonus de retos no cuentan
  movs.push({ id: 'c', memberId: 'a', points: 1, date: T(2026, 10, 8), kind: 'custom' });
  assert.equal(FP.challengeProgress(c, ['a', 'l'], movs, p, now).done, true);
});

test('retos por niño: participantes por defecto (niños) o elegidos', () => {
  assert.deepEqual(FP.challengeMembers(ch({}), fam).map(m => m.id), ['a', 'l']);
  assert.deepEqual(FP.challengeMembers(ch({ memberIds: ['l'] }), fam).map(m => m.id), ['l']);
  assert.deepEqual(FP.challengeMembers(ch({}), [dad]).map(m => m.id), ['p']);
});

test('pendientes de confirmar, confirmar y descartar', () => {
  const c = ch({ id: 'cama3', type: 'count', ruleId: 'cama', target: 2, stars: 5 });
  const now = T(2026, 10, 8, 20);
  const movs = [rmv('a', 'cama', 1, T(2026, 10, 6)), rmv('a', 'cama', 1, T(2026, 10, 7))];
  let pend = FP.pendingChallenges([c], fam, movs, [], now);
  assert.equal(pend.length, 1); assert.deepEqual(pend[0].memberIds, ['a']);
  const res = FP.confirmChallenge(c, pend[0].period, pend[0].memberIds, now);
  assert.equal(res.achievements.length, 1); assert.equal(res.movements[0].points, 5); assert.equal(res.movements[0].kind, 'challenge');
  assert.equal(FP.pendingChallenges([c], fam, movs, res.achievements, now).length, 0);
  const st = FP.challengeState(c, fam, movs, res.achievements, now);
  assert.equal(st.rows.find(r => r.memberIds[0] === 'a').status, 'confirmed');
  assert.equal(st.rows.find(r => r.memberIds[0] === 'l').status, 'active');
  const dis = FP.dismissChallenge(c, pend[0].period, ['a'], now);
  assert.equal(FP.pendingChallenges([c], fam, movs, dis, now).length, 0);
  // Sin estrellas no hay movimiento, pero sí insignia
  assert.equal(FP.confirmChallenge({ ...c, stars: 0 }, pend[0].period, ['a'], now).movements.length, 0);
});

test('lo conseguido la semana pasada sigue pendiente; un reto creado después no cuenta hacia atrás', () => {
  const movs = [rmv('a', 'cama', 1, T(2026, 10, 6)), rmv('a', 'cama', 1, T(2026, 10, 7))];
  const nextWeek = T(2026, 10, 13, 10);
  const c = ch({ type: 'count', ruleId: 'cama', target: 2 });
  const pend = FP.pendingChallenges([c], fam, movs, [], nextWeek);
  assert.equal(pend.length, 1); assert.equal(pend[0].period.key, '2026-10-05');
  const late = ch({ type: 'count', ruleId: 'cama', target: 2, createdAt: T(2026, 10, 12, 9) });
  assert.equal(FP.pendingChallenges([late], fam, movs, [], nextWeek).length, 0);
  assert.equal(FP.pendingChallenges([{ ...c, active: false }], fam, movs, [], nextWeek).length, 0);
  assert.equal(FP.pendingChallenges([{ ...c, pool: true }], fam, movs, [], nextWeek).length, 0);
});

test('reto de una sola semana y reto sin fecha', () => {
  const once = ch({ type: 'count', ruleId: 'cama', target: 1, period: 'week', weekStart: MON });
  assert.ok(FP.challengePeriod(once, T(2026, 10, 8), 0));
  assert.equal(FP.challengePeriod(once, T(2026, 10, 14), 0), null);
  assert.ok(FP.challengePeriod(once, T(2026, 10, 14), -1));
  const open = ch({ type: 'free', period: 'open' });
  assert.equal(FP.challengePeriod(open, T(2027, 1, 1), 0).key, 'open');
  assert.equal(FP.pendingChallenges([open], fam, [], [], T(2027, 1, 1)).length, 0); // los libres los marca un adulto
});

test('insignias agrupadas por reto', () => {
  const c = ch({ id: 'x', type: 'count', title: 'Cama', icon: '🛏️' });
  const p1 = { key: 'w1' }, p2 = { key: 'w2' };
  const a = FP.confirmChallenge(c, p1, ['a'], 1).achievements.concat(FP.confirmChallenge(c, p2, ['a'], 2).achievements, FP.dismissChallenge(c, p2, ['l'], 3));
  const b = FP.badgesFor('a', a);
  assert.equal(b.length, 1); assert.equal(b[0].count, 2); assert.equal(b[0].icon, '🛏️');
  assert.equal(FP.badgesFor('l', a).length, 0);
});

test('copia de seguridad incluye retos y logros', () => {
  const c = ch({ id: 'cc1', type: 'free' });
  const ach = FP.confirmChallenge(c, { key: 'open' }, ['a'], 5).achievements;
  const b = FP.makeBackup({ members: [kidA], rules: [], rewards: [], challenges: [c], logs: { '2026-10': { movements: [], redemptions: [], achievements: ach } } });
  const r = FP.parseBackup(JSON.stringify(b));
  assert.equal(r.challenges.length, 1);
  assert.equal(r.logs['2026-10'].achievements.length, 1);
});

// ---------- Aventura ----------
test('racha de días ganando estrellas', () => {
  const now = T(2026, 10, 9, 18);
  const movs = [mv('a', 1, T(2026, 10, 6)), mv('a', 2, T(2026, 10, 7)), mv('a', -3, T(2026, 10, 7)), mv('a', 1, T(2026, 10, 8)), mv('a', 1, T(2026, 10, 9, 8)),
    mv('a', 1, T(2026, 10, 1)), mv('a', 1, T(2026, 10, 2)), mv('a', 5, T(2026, 10, 4), 'reset')];
  assert.deepEqual(FP.streakDays('a', movs, now), { current: 4, best: 4, today: true });
  // Si hoy aún no ha ganado, la racha de ayer sigue viva
  assert.equal(FP.streakDays('a', movs.slice(0, 4), now).current, 3);
  assert.equal(FP.streakDays('a', movs.slice(0, 4), now).today, false);
  // Un día sin estrellas la corta
  assert.equal(FP.streakDays('a', movs, T(2026, 10, 11, 9)).current, 0);
  assert.equal(FP.streakDays('a', [], now).best, 0);
  // Los puntos negativos no cuentan como día ganado
  assert.equal(FP.streakDays('a', [mv('a', -1, T(2026, 10, 9))], now).current, 0);
});

test('viaje: un país cada 150 estrellas ganadas (no baja al canjear ni al reiniciar)', () => {
  const movs = [mv('a', 100, 1), mv('a', -3, 2), mv('a', 60, 3), mv('a', -22, 4, 'reset'), { id: 'x', memberId: 'a', points: 5, date: 5, kind: 'challenge' }];
  assert.equal(FP.earnedTotal('a', movs), 165);
  const v = FP.travelFor(165, 150, 50);
  assert.equal(v.i, 1); assert.equal(v.n, 2); assert.equal(v.min, 150); assert.equal(v.next, 300); assert.equal(v.missing, 135);
  assert.ok(Math.abs(v.progress - 15 / 150) < 1e-9);
  assert.equal(FP.travelFor(0, 150, 50).n, 1);
  assert.equal(FP.travelFor(149, 150, 50).n, 1);
  assert.equal(FP.travelFor(150, 150, 50).n, 2);
  const end = FP.travelFor(99999, 150, 50);
  assert.equal(end.n, 50); assert.equal(end.next, null); assert.equal(end.progress, 1); assert.equal(end.last, true);
  assert.equal(FP.travelFor(100, 50, 50).n, 3); // estrellas por país configurables
});

test('estrellas por país: valores válidos o 150', () => {
  assert.equal(FP.levelStep(200), 200);
  assert.equal(FP.levelStep('80'), 80);
  assert.equal(FP.levelStep(5), 150);
  assert.equal(FP.levelStep(undefined), 150);
  assert.equal(FP.levelStep('x'), 150);
});

test('baúl: un recuerdo por país y un trofeo por continente', () => {
  const W = require('../countries.js');
  assert.equal(W.COUNTRIES.length, 50);
  assert.equal(FP.allSouvenirs(W.CONTINENTS).length, 55);
  assert.deepEqual(FP.souvenirsFor(1, W.CONTINENTS).map(s => s.id), ['rec-ES']);
  assert.deepEqual(FP.newSouvenirsAt(2, W.CONTINENTS).map(s => s.code), [W.COUNTRIES[1].code]);
  const tenth = FP.newSouvenirsAt(10, W.CONTINENTS);
  assert.deepEqual(tenth.map(s => s.kind), ['souvenir', 'trophy']);
  assert.equal(tenth[1].continent, 'europa');
  assert.equal(FP.souvenirsFor(10, W.CONTINENTS).length, 11);
  assert.equal(FP.souvenirsFor(50, W.CONTINENTS).length, 55);
});

test('ruta: Europa empieza en España y los demás continentes van de más a menos habitantes', () => {
  const W = require('../countries.js');
  assert.deepEqual(W.CONTINENTS.map(c => c.name), ['Europa', 'América', 'África', 'Asia', 'Oceanía']);
  assert.equal(W.COUNTRIES[0].code, 'ES');
  W.CONTINENTS.forEach(c => assert.equal(c.countries.length, 10));
  for (const c of W.COUNTRIES) for (const k of ['capital', 'monument', 'language', 'demonym', 'hello', 'es', 'icon', 'iconName', 'fact']) assert.ok(c[k], c.code + ' sin ' + k);
  assert.equal(new Set(W.COUNTRIES.map(c => c.code)).size, 50);
  // Sin países en guerra
  for (const code of ['RU', 'UA', 'SD', 'CD', 'ET', 'IR', 'VE']) assert.ok(!W.COUNTRIES.some(c => c.code === code), code);
});

test('personajes: 8 chicos y 8 chicas, y un rango por continente', () => {
  const C = require('../characters.js'), A = require('../avatar.js');
  assert.equal(C.CHARACTERS.filter(c => c.g === 'boy').length, 8);
  assert.equal(C.CHARACTERS.filter(c => c.g === 'girl').length, 8);
  assert.equal(new Set(C.CHARACTERS.map(c => c.id)).size, 16);
  for (const c of C.CHARACTERS) {
    assert.ok(c.name && c.role && c.desc, c.id);
    assert.ok(!/undefined|NaN/.test(A.svg(c.look, c.color)), c.id); // dibujo provisional
  }
  assert.equal(C.RANKS.length, 10);
  assert.deepEqual(C.RANKS.map(r => r.lv), [1, 3, 6, 10, 15, 21, 28, 35, 42, 50]);
  assert.equal(C.rankFor(0).id, 'novato');   // nivel 1
  assert.equal(C.rankFor(1).id, 'novato');   // nivel 2
  assert.equal(C.rankFor(2).id, 'turista');  // nivel 3
  assert.equal(C.rankFor(9).id, 'explorador');
  assert.equal(C.rankFor(48).id, 'embajador');
  assert.equal(C.rankFor(49).id, 'granviajero');
  assert.equal(C.rankFor(9).girl, 'Exploradora');
});

test('rangos: 10 estrellas de regalo por cada rango nuevo, sin contar para la racha', () => {
  const C = require('../characters.js');
  assert.deepEqual(FP.ranksCrossed(1, 2, C.RANKS).map(r => r.id), []);
  assert.deepEqual(FP.ranksCrossed(2, 3, C.RANKS).map(r => r.id), ['turista']);
  assert.deepEqual(FP.ranksCrossed(2, 10, C.RANKS).map(r => r.id), ['turista', 'mochilero', 'explorador']);
  const b = FP.rankBonus({ id: 'a' }, C.RANKS[1], 'Nuevo rango: Turista', 5);
  assert.equal(b.points, 10); assert.equal(b.kind, 'rank'); assert.equal(b.rankId, 'turista');
  assert.equal(FP.earnedTotal('a', [b]), 10); // cuenta para el viaje
  assert.equal(FP.streakDays('a', [b], 5).current, 0); // pero no para la racha
});

test('prueba del país: capital, bandera y una más, 4 opciones distintas con la buena', () => {
  const W = require('../countries.js');
  let seed = 7; const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (const c of W.COUNTRIES) {
    const q = FP.quizFor(c, W.COUNTRIES, rand);
    assert.equal(q.length, 3);
    assert.deepEqual(q.slice(0, 2).map(x => x.kind), ['capital', 'flag']);
    for (const x of q) {
      assert.equal(x.options.length, 4, c.code + ' ' + x.kind);
      assert.equal(new Set(x.options).size, 4, c.code + ' ' + x.kind);
      assert.ok(x.options.includes(x.answer));
    }
    assert.equal(q[0].answer, c.capital); assert.equal(q[1].answer, c.name);
  }
  const mvq = FP.quizMovement({ id: 'a' }, { code: 'ES' }, 3, 'Prueba de España', 5);
  assert.equal(mvq.points, 3 * FP.QUIZ_STAR); assert.equal(mvq.kind, 'quiz');
  assert.equal(FP.quizResult('a', 'ES', [mvq]), mvq); assert.equal(FP.quizResult('a', 'FR', [mvq]), null);
  assert.equal(FP.earnedTotal('a', [mvq]), 6); // cuenta para el viaje
  assert.equal(FP.streakDays('a', [mvq], 5).current, 0); // no para la racha
});

test('pasaporte: fecha de llegada a cada país', () => {
  const ms = [mv('a', 100, 10), mv('a', 100, 20), mv('a', -50, 25), mv('a', 400, 30), mv('l', 900, 5)];
  const d = FP.arrivalDates('a', ms, 150, 50);
  assert.equal(d[0], 10); assert.equal(d[1], 20); assert.equal(d[2], 30); assert.equal(d[3], 30); assert.equal(d[4], 30); assert.equal(d[5], null);
  assert.deepEqual(FP.arrivalDates('x', ms, 150, 3), [null, null, null]);
});

test('recordatorio diario: evento .ics que se repite cada día con aviso', () => {
  const ics = FP.reminderIcs(19, 'https://ejemplo/app/');
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n') && ics.endsWith('END:VCALENDAR\r\n'));
  assert.match(ics, /DTSTART:20260101T190000\r\n/);
  assert.match(ics, /RRULE:FREQ=DAILY/);
  assert.match(ics, /BEGIN:VALARM[\s\S]*TRIGGER:-PT0M[\s\S]*END:VALARM/);
  assert.match(FP.reminderIcs(8, 'x'), /DTSTART:20260101T080000/);
  assert.deepEqual(FP.REMINDER_HOURS, [18, 19, 20, 21]);
});

test('recordatorio diario: ninguna línea pasa de 75 bytes', () => {
  for (const line of FP.reminderIcs(21, 'https://aagudoupm.github.io/family-points/').split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75, line);
});
