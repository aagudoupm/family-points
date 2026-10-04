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
