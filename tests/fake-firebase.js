// Firebase de mentira para las pruebas (misma interfaz «compat» que usa app.js).
// Habla con un almacén en Node a través de window.__fb, simulando la nube compartida.
window.firebase = (function () {
  const apps = [], listeners = [];
  let user = null;
  try { user = JSON.parse(localStorage.getItem('fakeUser') || 'null'); } catch (e) { user = null; }
  const call = (op, ...a) => window.__fb(op, ...a);
  const fail = code => { const e = new Error(code); e.code = code; throw e; };
  const setUser = u => { user = u; if (u) localStorage.setItem('fakeUser', JSON.stringify(u)); else localStorage.removeItem('fakeUser'); listeners.forEach(f => f(u)); };
  const auth = {
    onAuthStateChanged(cb) { listeners.push(cb); setTimeout(() => cb(user), 0); return () => {}; },
    async signInWithEmailAndPassword(email, pass) { const r = await call('signin', email, pass); if (r.error) fail(r.error); setUser({ uid: r.uid, email }); },
    async createUserWithEmailAndPassword(email, pass) { const r = await call('signup', email, pass); if (r.error) fail(r.error); setUser({ uid: r.uid, email }); },
    async signOut() { setUser(null); },
    async sendPasswordResetEmail() {},
    get currentUser() { return user; }
  };
  const store = {
    enablePersistence: () => Promise.resolve(),
    doc: p => ({ set: d => call('set', p, JSON.parse(JSON.stringify(d))), delete: () => call('del', p) }),
    collection: c => ({
      onSnapshot(next) {
        let last = null, alive = true;
        (async function tick() {
          if (!alive) return;
          const docs = await call('list', c);
          const key = JSON.stringify(docs);
          if (alive && key !== last) { last = key; next({ docs: docs.map(d => ({ id: d.id, data: () => d.data })), metadata: { fromCache: false, hasPendingWrites: false } }); }
          setTimeout(tick, 250);
        })();
        return () => { alive = false; };
      }
    })
  };
  return { apps, initializeApp(cfg) { apps.push(cfg); return {}; }, app: () => ({}), auth: () => auth, firestore: () => store };
})();
