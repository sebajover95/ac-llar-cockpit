// nube.js — Capa de nube del Cockpit AC-LLAR (Supabase)
// ------------------------------------------------------------------
// Sustituye al almacenamiento local de motor.js manteniendo la MISMA API:
//   window.storage      -> clave/valor (antes localStorage). Ahora: localStorage
//                          como copia local + tabla cockpit_kv en la nube.
//   window.acllarPhotos -> fotos de daños (antes IndexedDB). Ahora: tabla cockpit_fotos.
//   window.acllarCloud  -> login, estado de sincronización y buzón de HQ.
// motor.js no necesita saber nada de Supabase: sigue llamando a window.storage.
// ------------------------------------------------------------------
(function () {
  const SUPABASE_URL = "https://mvpibmwvmluxstitecqc.supabase.co";
  const SUPABASE_KEY = "sb_publishable_hfgeruPRIDzswATlpbi3ww_ohEzZap0";
  const PREFIX = "aclla_";
  const MAIN_KEY = "ac-cockpit-data-v1";
  const UPLOAD_DELAY = 800; // ms de espera antes de subir (agrupa cambios seguidos)

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true },
  });

  const DEVICE = (() => {
    try {
      let d = sessionStorage.getItem("acllar_device");
      if (!d) { d = Math.random().toString(36).slice(2, 10); sessionStorage.setItem("acllar_device", d); }
      return d;
    } catch { return Math.random().toString(36).slice(2, 10); }
  })();
  let userEmail = "";

  // Normaliza para comparar: ignora el sello lastModifiedAt que motor.js
  // re-escribe en cada guardado (si no, dos dispositivos se re-subirían sin fin).
  const norm = (key, v) => (key === MAIN_KEY && typeof v === "string") ? v.replace(/"lastModifiedAt":"[^"]*"/g, "") : v;

  const lastSynced = {};   // key -> valor normalizado que coincide con la nube
  const lastSeenAt = {};   // key -> updated_at de la nube que ya tenemos
  const pending = {};      // key -> { value, timer } subidas en espera
  let failing = false;

  // ---------- indicador de estado (abajo a la derecha) ----------
  let badge;
  function setBadge(kind, text) {
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "nube-badge";
      document.body.appendChild(badge);
    }
    badge.className = "nube-" + kind;
    badge.innerHTML = "";
    const t = document.createElement("span"); t.textContent = text; badge.appendChild(t);
    if (userEmail) {
      const out = document.createElement("button");
      out.textContent = "Salir"; out.title = "Cerrar sesión (" + userEmail + ")";
      out.onclick = async () => { await flushAll(); await sb.auth.signOut(); location.reload(); };
      badge.appendChild(out);
    }
  }
  function refreshBadge() {
    const n = Object.keys(pending).length;
    if (failing) setBadge("err", "Sin conexión · " + n + " cambio(s) pendiente(s)");
    else if (n) setBadge("busy", "Guardando en la nube…");
    else setBadge("ok", "☁ Sincronizado");
  }

  // ---------- subida a la nube ----------
  async function upload(key) {
    const p = pending[key];
    if (!p) return;
    clearTimeout(p.timer);
    const value = p.value;
    const at = new Date().toISOString();
    const { error } = await sb.from("cockpit_kv").upsert({ key, value, updated_at: at, updated_by: userEmail + "·" + DEVICE });
    if (error) {
      failing = true; refreshBadge();
      p.timer = setTimeout(() => upload(key), 15000); // reintento
      console.warn("[nube] fallo al subir", key, error.message);
      return;
    }
    if (pending[key] && pending[key].value === value) delete pending[key];
    lastSynced[key] = norm(key, value);
    lastSeenAt[key] = at;
    failing = false; refreshBadge();
    channel && channel.send({ type: "broadcast", event: "kv", payload: { key, by: DEVICE } });
  }
  function scheduleUpload(key, value) {
    if (pending[key]) clearTimeout(pending[key].timer);
    pending[key] = { value, timer: setTimeout(() => upload(key), UPLOAD_DELAY) };
    refreshBadge();
  }
  async function flushAll() { await Promise.all(Object.keys(pending).map(upload)); }
  window.addEventListener("beforeunload", (e) => {
    if (Object.keys(pending).length) { flushAll(); e.preventDefault(); e.returnValue = ""; }
  });

  // ---------- bajada desde la nube ----------
  function writeLocal(key, value) {
    try { localStorage.setItem(PREFIX + key, value); } catch (e) { console.error("[nube] localStorage lleno", e); }
  }
  async function pullKeys(keys) {
    if (!keys.length) return;
    const { data, error } = await sb.from("cockpit_kv").select("key,value,updated_at").in("key", keys);
    if (error) throw error;
    for (const row of data || []) applyRemote(row);
  }
  function applyRemote(row) {
    const value = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
    if (pending[row.key]) { clearTimeout(pending[row.key].timer); delete pending[row.key]; } // la nube manda
    writeLocal(row.key, value);
    lastSynced[row.key] = norm(row.key, value);
    lastSeenAt[row.key] = row.updated_at;
    window.dispatchEvent(new CustomEvent("acllar-remote-update", { detail: { key: row.key } }));
    refreshBadge();
  }
  // Compara fechas de la nube con las que tenemos y baja solo lo que cambió.
  async function checkFreshness() {
    if (!userEmail) return;
    const { data, error } = await sb.from("cockpit_kv").select("key,updated_at");
    if (error) return;
    const changed = (data || []).filter((r) => r.updated_at !== lastSeenAt[r.key] && !pending[r.key]).map((r) => r.key);
    if (changed.length) await pullKeys(changed).catch(() => {});
  }

  // ---------- tiempo real ----------
  let channel = null;
  function startRealtime() {
    channel = sb.channel("cockpit-sync")
      .on("broadcast", { event: "kv" }, ({ payload }) => {
        if (payload && payload.by !== DEVICE) pullKeys([payload.key]).catch(() => {});
      })
      .subscribe();
    sb.channel("hq-buzon")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "hq_buzon" }, () => {
        window.dispatchEvent(new CustomEvent("acllar-buzon"));
      })
      .subscribe();
    // Red de seguridad: si el portátil durmió o se perdió un aviso.
    document.addEventListener("visibilitychange", () => { if (!document.hidden) checkFreshness(); });
    setInterval(checkFreshness, 60000);
  }

  // ---------- window.storage (misma API que antes) ----------
  window.storage = {
    async get(key) {
      try { const v = localStorage.getItem(PREFIX + key); return v === null ? null : { key, value: v }; }
      catch (e) { return null; }
    },
    async set(key, value) {
      writeLocal(key, value);
      if (norm(key, value) !== lastSynced[key]) scheduleUpload(key, value);
      return { key, value };
    },
    async delete(key) {
      try { localStorage.removeItem(PREFIX + key); } catch (e) {}
      if (pending[key]) { clearTimeout(pending[key].timer); delete pending[key]; }
      delete lastSynced[key];
      const { error } = await sb.from("cockpit_kv").delete().eq("key", key);
      if (!error) channel && channel.send({ type: "broadcast", event: "kv", payload: { key, by: DEVICE } });
      return { key, deleted: true };
    },
    async list(prefix) {
      try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(PREFIX)) { const bare = k.slice(PREFIX.length); if (!prefix || bare.startsWith(prefix)) keys.push(bare); }
        }
        return { keys };
      } catch (e) { return { keys: [] }; }
    },
  };

  // ---------- window.acllarPhotos (fotos de daños en la nube) ----------
  const acDigitsOf = (vehicleId) => String(vehicleId || "").replace(/\D/g, "");
  const photoKey = (vehicleId, idk) => String(vehicleId || "") + "||" + (idk || "?");
  const compress = (dataUrl, maxDim, quality) => new Promise((resolve) => {
    try {
      if (typeof Image === "undefined" || !/^data:image\//i.test(dataUrl)) return resolve(dataUrl);
      const img = new Image();
      img.onload = () => {
        try {
          const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
          if (!w || !h) return resolve(dataUrl);
          const scale = Math.min(1, (maxDim || 1100) / Math.max(w, h));
          const cv = document.createElement("canvas");
          cv.width = Math.max(1, Math.round(w * scale)); cv.height = Math.max(1, Math.round(h * scale));
          cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
          const out = cv.toDataURL("image/jpeg", quality || 0.62);
          resolve(out && out.length < dataUrl.length ? out : dataUrl);
        } catch (e) { resolve(dataUrl); }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    } catch (e) { resolve(dataUrl); }
  });
  const toRow = (rec) => ({ key: rec.key, vehicle_id: rec.vehicleId || "", ac_digits: rec.acDigits || acDigitsOf(rec.vehicleId), rec, updated_at: new Date().toISOString() });
  window.acllarPhotos = {
    acDigitsOf, photoKey, compress,
    async put(rec) { const { error } = await sb.from("cockpit_fotos").upsert(toRow(rec)); return !error; },
    async deleteKey(vehicleId, idk) { const { error } = await sb.from("cockpit_fotos").delete().eq("key", photoKey(vehicleId, idk)); return !error; },
    async getKey(vehicleId, idk) {
      const { data } = await sb.from("cockpit_fotos").select("rec").eq("key", photoKey(vehicleId, idk)).maybeSingle();
      return data ? data.rec : null;
    },
    async getByAc(acDigits) {
      const { data } = await sb.from("cockpit_fotos").select("rec").eq("ac_digits", String(acDigits));
      return (data || []).map((r) => r.rec);
    },
    async exportAll() {
      const out = []; const PAGE = 40;
      for (let from = 0; ; from += PAGE) {
        const { data, error } = await sb.from("cockpit_fotos").select("rec").order("key").range(from, from + PAGE - 1);
        if (error || !data || !data.length) break;
        out.push(...data.map((r) => r.rec));
        if (data.length < PAGE) break;
      }
      return out;
    },
    async importAll(records, replace) {
      if (!Array.isArray(records)) return false;
      setBadge("busy", "Subiendo fotos a la nube…");
      if (replace) await sb.from("cockpit_fotos").delete().neq("key", "");
      let batch = [], size = 0, ok = true, done = 0;
      const send = async () => {
        if (!batch.length) return;
        const { error } = await sb.from("cockpit_fotos").upsert(batch);
        if (error) { ok = false; console.warn("[nube] fotos", error.message); }
        done += batch.length; setBadge("busy", "Subiendo fotos… " + done + "/" + records.length);
        batch = []; size = 0;
      };
      for (const rec of records) {
        if (!rec || !rec.key) continue;
        const s = JSON.stringify(rec).length;
        if (size + s > 1000000) await send();
        batch.push(toRow(rec)); size += s;
      }
      await send();
      refreshBadge();
      return ok;
    },
    async applyOps(ops) {
      try {
        if (!ops) return;
        for (const del of (ops.deletes || [])) await this.deleteKey(del.vehicleId, del.idk);
        for (const up of (ops.upserts || [])) {
          if (!up.fotos || !up.fotos.length) continue;
          const fotos = [];
          for (const f of up.fotos) fotos.push(await compress(f, 1100, 0.62));
          await this.put({
            key: photoKey(up.vehicleId, up.idk), vehicleId: up.vehicleId, acDigits: acDigitsOf(up.vehicleId), idk: up.idk,
            zona: up.zona || "", tipoDano: up.tipoDano || "", pdfCode: up.pdfCode || "", elementCode: up.elementCode || "", gravedad: up.gravedad || "",
            fotos, updatedAt: new Date().toISOString(),
          });
        }
      } catch (e) {}
    },
  };

  // ---------- buzón de HQ ----------
  const buzon = {
    async pendientes() {
      const { data, error } = await sb.from("hq_buzon").select("*").in("estado", ["pendiente", "importando"]).order("recibido_at");
      if (error) throw error;
      return data || [];
    },
    async reservar(id) {
      const { data, error } = await sb.rpc("hq_buzon_reservar", { p_id: id, p_quien: userEmail + "·" + DEVICE });
      return !error && data === true;
    },
    async descargar(path) {
      const { data, error } = await sb.storage.from("hq-buzon").download(path);
      if (error) throw error;
      return data;
    },
    async marcar(id, estado) {
      const upd = { estado };
      if (estado === "pendiente") { upd.importado_por = null; upd.importado_at = null; }
      if (estado === "importado") upd.importado_at = new Date().toISOString();
      await sb.from("hq_buzon").update(upd).eq("id", id);
    },
  };

  // ---------- login ----------
  function showLogin(msg) {
    return new Promise((resolve) => {
      const l = document.getElementById("loading"); if (l) l.style.display = "none";
      const box = document.createElement("div");
      box.id = "nube-login";
      box.innerHTML =
        '<form><div class="nl-title">Cockpit AC-LLAR</div>' +
        '<div class="nl-sub">Inicia sesión para continuar</div>' +
        '<label>Email<input type="email" name="email" autocomplete="username" required></label>' +
        '<label>Contraseña<input type="password" name="password" autocomplete="current-password" required></label>' +
        '<div class="nl-err"></div><button type="submit">Entrar</button></form>';
      document.body.appendChild(box);
      const form = box.querySelector("form"), err = box.querySelector(".nl-err");
      if (msg) err.textContent = msg;
      form.onsubmit = async (e) => {
        e.preventDefault();
        err.textContent = ""; form.querySelector("button").disabled = true;
        const { data, error } = await sb.auth.signInWithPassword({ email: form.email.value.trim(), password: form.password.value });
        form.querySelector("button").disabled = false;
        if (error) { err.textContent = "Email o contraseña incorrectos."; return; }
        box.remove();
        if (l) l.style.display = "";
        resolve(data.session);
      };
    });
  }

  async function boot() {
    let { data: { session } } = await sb.auth.getSession();
    if (!session) session = await showLogin();
    userEmail = (session.user && session.user.email) || "";
    setBadge("busy", "Cargando datos de la nube…");
    try {
      // Bajar TODO el estado de la nube y dejarlo en la copia local antes de arrancar la app.
      const { data, error } = await sb.from("cockpit_kv").select("key,value,updated_at");
      if (error) throw error;
      for (const row of data || []) {
        const value = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
        writeLocal(row.key, value);
        lastSynced[row.key] = norm(row.key, value);
        lastSeenAt[row.key] = row.updated_at;
      }
      window.acllarCloud.empty = !(data || []).some((r) => r.key === MAIN_KEY);
      failing = false;
    } catch (e) {
      // Sin la versión de la nube no arrancamos: trabajar sobre una copia vieja
      // y luego subirla pisaría los cambios hechos desde otro dispositivo.
      setBadge("err", "Sin conexión con la nube");
      throw new Error("No se pudo conectar con la nube (" + (e.message || e) + "). Revisa la conexión y recarga la página.");
    }
    startRealtime();
    refreshBadge();
  }

  window.acllarCloud = { sb, buzon, flushAll, device: DEVICE, empty: false };
  window.acllarCloud.ready = boot();
})();
