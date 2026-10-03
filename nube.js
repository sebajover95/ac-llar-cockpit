// nube.js — Capa de nube del Cockpit AC-LLAR (Supabase)
// ------------------------------------------------------------------
// motor.js sigue usando la MISMA API de siempre:
//   window.storage      -> get/set/delete/list de claves (antes localStorage)
//   window.acllarPhotos -> fotos de daños
//   window.acllarCloud  -> login, sincronización y buzón de HQ
//
// GUARDADO FICHA POR FICHA
//   Los datos grandes (estado del cockpit, presupuestos, repositorio, memoria de
//   piezas, flota) NO se suben como un paquete: se parten en fichas (cada
//   vehículo, daño, recambio, evento, presupuesto...) y solo se sube lo que
//   cambió. Al llegar un cambio de otro dispositivo se mezcla SOLO esa ficha,
//   sin pisar lo que este dispositivo tenga sin subir.
//   Tabla: cockpit_items (doc, col, id, data, deleted).
//   El resto de claves pequeñas va entero en cockpit_kv; algunas son solo de
//   este dispositivo (borrador del cuantificador, filtros de pantalla).
// ------------------------------------------------------------------
(function () {
  const SUPABASE_URL = "https://mvpibmwvmluxstitecqc.supabase.co";
  const SUPABASE_KEY = "sb_publishable_hfgeruPRIDzswATlpbi3ww_ohEzZap0";
  const PREFIX = "aclla_";
  const MAIN_KEY = "ac-cockpit-data-v1";
  const ITEM_DOCS = [MAIN_KEY, "ac_history", "ac_repo", "ac_pieza_mem", "ac_flota"]; // ficha por ficha
  const LOCAL_ONLY = ["ac_doc2", "global_sede_filter", "today_collapsed_sections"];  // no se sincronizan
  const QUANT_DOCS = ["ac_history", "ac_repo", "ac_pieza_mem", "ac_flota", "ac_extra_mem", "ac_consultas"];
  const UPLOAD_DELAY = 800;
  const SEP = "\u0001";

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
  const who = () => userEmail + "·" + DEVICE;

  // ================= utilidades =================
  const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
  // JSON con claves ordenadas: para comparar sin que importe el orden de las claves.
  function canon(v) {
    if (v === undefined) return "null";
    if (v === null || typeof v !== "object") return JSON.stringify(v);
    if (Array.isArray(v)) return "[" + v.map(canon).join(",") + "]";
    return "{" + Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => JSON.stringify(k) + ":" + canon(v[k])).join(",") + "}";
  }
  function hash(str) { // FNV-1a 52 bits
    let h1 = 0x811c9dc5, h2 = 0x1000193;
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
      h2 = Math.imul(h2 ^ c, 2246822519) >>> 0;
    }
    return h1.toString(36) + h2.toString(36);
  }
  function readLocal(key) { try { return localStorage.getItem(PREFIX + key); } catch { return null; } }
  function writeLocal(key, value) {
    try { localStorage.setItem(PREFIX + key, value); } catch (e) { console.error("[nube] localStorage lleno", e); }
  }

  // ================= partir / recomponer en fichas =================
  // Devuelve Map(clave -> {col, id, data}). Cada colección lleva además una
  // ficha "__order__" con el orden, para reconstruir el array tal cual.
  function decompose(doc, value) {
    const items = new Map();
    const addCollection = (col, v, skipKeys) => {
      if (Array.isArray(v)) {
        const ids = [], seen = new Set(), counts = {};
        for (const el of v) {
          let id;
          if (isObj(el) && (typeof el.id === "string" || typeof el.id === "number") && el.id !== "" && !seen.has("i:" + el.id)) id = "i:" + el.id;
          else if (typeof el === "string" && !seen.has("s:" + el)) id = "s:" + el;
          else { const h = hash(canon(el)); counts[h] = (counts[h] || 0) + 1; id = "h:" + h + "#" + counts[h]; }
          seen.add(id); ids.push(id);
          items.set(col + SEP + id, { col, id, data: el });
        }
        items.set("__order__" + SEP + col, { col: "__order__", id: col, data: { t: "a", ids } });
      } else {
        const keys = Object.keys(v).filter((k) => !(skipKeys && skipKeys.includes(k)) && v[k] !== undefined);
        for (const k of keys) items.set(col + SEP + "k:" + k, { col, id: "k:" + k, data: v[k] });
        items.set("__order__" + SEP + col, { col: "__order__", id: col, data: { t: "o", ids: keys.map((k) => "k:" + k) } });
      }
    };
    if (doc === MAIN_KEY && isObj(value)) {
      for (const f of Object.keys(value)) {
        const v = value[f];
        if (v === undefined) continue;
        if (Array.isArray(v) || isObj(v)) addCollection(f, v, f === "meta" ? ["lastModifiedAt"] : null);
        else items.set("__scalar__" + SEP + f, { col: "__scalar__", id: f, data: v });
      }
    } else if (Array.isArray(value) || isObj(value)) {
      addCollection("", value);
    } else {
      items.set("__scalar__" + SEP + "", { col: "__scalar__", id: "", data: value });
    }
    return items;
  }
  function recompose(doc, items, localValue) {
    const cols = new Map(), orders = new Map(), scalars = {};
    for (const it of items.values()) {
      if (it.col === "__order__") orders.set(it.id, it.data);
      else if (it.col === "__scalar__") scalars[it.id] = it.data;
      else { if (!cols.has(it.col)) cols.set(it.col, new Map()); cols.get(it.col).set(it.id, it.data); }
    }
    const build = (col) => {
      const m = cols.get(col) || new Map();
      const ord = orders.get(col);
      const isArr = ord ? ord.t === "a" : ![...m.keys()].some((id) => id.startsWith("k:"));
      const ids = (ord && Array.isArray(ord.ids) ? ord.ids : []).filter((id) => m.has(id));
      const seen = new Set(ids);
      for (const id of [...m.keys()].sort()) if (!seen.has(id)) ids.push(id); // fichas nuevas que el orden aún no conoce
      if (isArr) return ids.map((id) => m.get(id));
      const o = {}; for (const id of ids) o[id.slice(2)] = m.get(id); return o;
    };
    const colNames = new Set([...cols.keys(), ...orders.keys()]);
    if (doc === MAIN_KEY) {
      const out = { ...scalars };
      for (const c of colNames) out[c] = build(c);
      if (isObj(out.meta) && localValue && isObj(localValue.meta) && localValue.meta.lastModifiedAt) out.meta.lastModifiedAt = localValue.meta.lastModifiedAt;
      return out;
    }
    if (colNames.has("")) return build("");
    return "" in scalars ? scalars[""] : null;
  }

  // ================= estado de sincronización =================
  const synced = {};      // doc -> Map(clave -> canon) = lo que tiene la nube (según sabemos)
  const awaiting = {};    // doc -> true: entró un cambio remoto y la app aún no lo recargó
  const kvSynced = {};    // clave blob -> valor que coincide con la nube
  const kvSeenAt = {};
  const pending = {};     // clave -> timer
  let failing = false, cursor = null, booted = false;

  // ---------- indicador ----------
  let badge;
  function setBadge(kind, text) {
    if (!badge) { badge = document.createElement("div"); badge.id = "nube-badge"; document.body.appendChild(badge); }
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
    if (failing) setBadge("err", "Sin conexión · cambios pendientes de subir");
    else if (n) setBadge("busy", "Guardando en la nube…");
    else setBadge("ok", "☁ Sincronizado");
  }
  const notify = (key) => window.dispatchEvent(new CustomEvent("acllar-remote-update", { detail: { key } }));

  // ---------- subida ----------
  function schedule(key) {
    clearTimeout(pending[key]);
    pending[key] = setTimeout(() => upload(key), UPLOAD_DELAY);
    refreshBadge();
  }
  async function upload(key) {
    clearTimeout(pending[key]);
    try {
      if (ITEM_DOCS.includes(key)) await uploadItems(key); else await uploadKv(key);
      delete pending[key];
      failing = false;
      channel && channel.send({ type: "broadcast", event: "kv", payload: { key, by: DEVICE } });
    } catch (e) {
      failing = true;
      console.warn("[nube] fallo al subir", key, e && e.message);
      pending[key] = setTimeout(() => upload(key), 15000);
    }
    refreshBadge();
  }
  async function uploadKv(key) {
    const value = readLocal(key);
    if (value === null || value === kvSynced[key]) return;
    const { data, error } = await sb.from("cockpit_kv").upsert({ key, value, updated_at: new Date().toISOString(), updated_by: who() }).select("updated_at");
    if (error) throw error;
    kvSynced[key] = value;
    if (data && data[0]) kvSeenAt[key] = data[0].updated_at;
  }
  async function uploadItems(doc) {
    const raw = readLocal(doc);
    if (raw === null) return;
    let value; try { value = JSON.parse(raw); } catch { return; }
    const cur = decompose(doc, value);
    const base = synced[doc] || (synced[doc] = new Map());
    const rows = [], tomb = [];
    let readded = false;
    for (const [k, it] of cur) {
      const c = canon(it.data);
      if (base.get(k) !== c) rows.push({ k, c, row: { doc, col: it.col, id: it.id, data: it.data, deleted: false, updated_by: who() } });
    }
    for (const [k, c] of base) {
      if (cur.has(k)) continue;
      if (awaiting[doc]) {
        // La app escribió una versión que aún no tenía los cambios remotos:
        // eso NO es un borrado. Se vuelve a poner la ficha.
        const [col, id] = k.split(SEP);
        cur.set(k, { col, id, data: JSON.parse(c) });
        readded = true;
      } else {
        const [col, id] = k.split(SEP);
        tomb.push({ k, row: { doc, col, id, data: null, deleted: true, updated_by: who() } });
      }
    }
    if (readded) writeLocal(doc, JSON.stringify(recompose(doc, cur, value)));
    const all = rows.concat(tomb);
    for (let i = 0; i < all.length; i += 400) {
      const chunk = all.slice(i, i + 400);
      const { error } = await sb.from("cockpit_items").upsert(chunk.map((x) => x.row));
      if (error) throw error;
      for (const x of chunk) { if (x.row.deleted) base.delete(x.k); else base.set(x.k, x.c); }
      if (all.length > 400) setBadge("busy", "Guardando en la nube… " + Math.min(i + 400, all.length) + "/" + all.length);
    }
  }
  async function flushAll() { await Promise.all(Object.keys(pending).map(upload)); }
  window.addEventListener("beforeunload", (e) => {
    if (Object.keys(pending).length) { flushAll(); e.preventDefault(); e.returnValue = ""; }
  });

  // ---------- bajada ----------
  async function fetchItems(filter) {
    const out = []; const PAGE = 1000;
    for (let from = 0; ; from += PAGE) {
      let q = sb.from("cockpit_items").select("doc,col,id,data,deleted,updated_at");
      q = filter(q).order("updated_at").order("doc").order("col").order("id").range(from, from + PAGE - 1);
      const { data, error } = await q;
      if (error) throw error;
      out.push(...(data || []));
      if (!data || data.length < PAGE) break;
    }
    return out;
  }
  function bumpCursor(rows) { for (const r of rows) if (!cursor || r.updated_at > cursor) cursor = r.updated_at; }

  // Mezcla fichas remotas en la copia local, sin pisar cambios locales sin subir.
  function mergeRemote(doc, rows) {
    const raw = readLocal(doc);
    let value = null; try { value = raw ? JSON.parse(raw) : null; } catch {}
    const local = value ? decompose(doc, value) : new Map();
    const base = synced[doc] || (synced[doc] = new Map());
    let changed = false;
    for (const r of rows) {
      const k = r.col + SEP + r.id;
      const localC = local.has(k) ? canon(local.get(k).data) : undefined;
      const unsyncedLocal = localC !== base.get(k);           // este dispositivo la tocó y aún no la subió
      if (r.deleted) {
        if (!base.has(k) && !local.has(k)) continue;
        base.delete(k);
        if (!unsyncedLocal && local.has(k)) { local.delete(k); changed = true; }
      } else {
        const rc = canon(r.data);
        if (base.get(k) === rc && (localC === rc || unsyncedLocal)) continue;
        base.set(k, rc);
        if (!unsyncedLocal && localC !== rc) { local.set(k, { col: r.col, id: r.id, data: r.data }); changed = true; }
      }
    }
    if (changed) {
      writeLocal(doc, JSON.stringify(recompose(doc, local, value)));
      awaiting[doc] = true;
      notify(doc);
    }
    return changed;
  }
  async function pullItems() {
    if (!userEmail) return;
    const since = cursor ? new Date(new Date(cursor).getTime() - 15000).toISOString() : null;
    const rows = await fetchItems((q) => (since ? q.gt("updated_at", since) : q));
    bumpCursor(rows);
    const byDoc = {};
    for (const r of rows) (byDoc[r.doc] = byDoc[r.doc] || []).push(r);
    for (const doc of Object.keys(byDoc)) if (ITEM_DOCS.includes(doc)) mergeRemote(doc, byDoc[doc]);
  }
  async function pullKv(keys) {
    let q = sb.from("cockpit_kv").select("key,value,updated_at");
    if (keys) q = q.in("key", keys);
    const { data, error } = await q;
    if (error) throw error;
    for (const row of data || []) {
      if (ITEM_DOCS.includes(row.key) || LOCAL_ONLY.includes(row.key)) continue;
      if (pending[row.key] || kvSeenAt[row.key] === row.updated_at) continue;
      const value = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
      kvSeenAt[row.key] = row.updated_at;
      if (value === readLocal(row.key)) { kvSynced[row.key] = value; continue; }
      writeLocal(row.key, value); kvSynced[row.key] = value;
      if (booted) notify(row.key);
    }
    return data || [];
  }
  async function checkAll() {
    try { await pullItems(); await pullKv(); if (failing) { failing = false; refreshBadge(); } }
    catch (e) { /* sin conexión: se reintenta en el siguiente ciclo */ }
  }

  // ---------- tiempo real ----------
  let channel = null;
  function startRealtime() {
    channel = sb.channel("cockpit-sync")
      .on("broadcast", { event: "kv" }, ({ payload }) => {
        if (!payload || payload.by === DEVICE) return;
        if (ITEM_DOCS.includes(payload.key)) pullItems().catch(() => {});
        else pullKv([payload.key]).catch(() => {});
      })
      .subscribe();
    sb.channel("revisiones")
      .on("postgres_changes", { event: "*", schema: "public", table: "revisiones" }, () => {
        window.dispatchEvent(new CustomEvent("acllar-revisiones"));
      })
      .subscribe();
    sb.channel("hq-buzon")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "hq_buzon" }, () => {
        window.dispatchEvent(new CustomEvent("acllar-buzon"));
      })
      .subscribe();
    document.addEventListener("visibilitychange", () => { if (!document.hidden) checkAll(); });
    setInterval(checkAll, 60000);
  }

  // ================= window.storage (misma API que antes) =================
  window.storage = {
    async get(key) {
      const v = readLocal(key);
      return v === null ? null : { key, value: v };
    },
    async set(key, value) {
      writeLocal(key, value);
      if (!LOCAL_ONLY.includes(key) && booted) schedule(key);
      return { key, value };
    },
    async delete(key) {
      try { localStorage.removeItem(PREFIX + key); } catch (e) {}
      clearTimeout(pending[key]); delete pending[key];
      if (!LOCAL_ONLY.includes(key) && !ITEM_DOCS.includes(key)) {
        delete kvSynced[key];
        const { error } = await sb.from("cockpit_kv").delete().eq("key", key);
        if (!error) channel && channel.send({ type: "broadcast", event: "kv", payload: { key, by: DEVICE } });
      }
      refreshBadge();
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
    const seed = [];
    try {
      // 1) Claves pequeñas (enteras)
      const kvRows = await pullKv();
      // 2) Fichas
      const rows = await fetchItems((q) => q.eq("deleted", false));
      bumpCursor(rows);
      const byDoc = {};
      for (const r of rows) (byDoc[r.doc] = byDoc[r.doc] || new Map()).set(r.col + SEP + r.id, { col: r.col, id: r.id, data: r.data });
      for (const doc of ITEM_DOCS) {
        const m = byDoc[doc];
        if (m && m.size) {
          let localValue = null; try { localValue = JSON.parse(readLocal(doc)); } catch {}
          writeLocal(doc, JSON.stringify(recompose(doc, m, localValue)));
          synced[doc] = new Map([...m].map(([k, it]) => [k, canon(it.data)]));
        } else {
          // Primera vez: la nube solo tiene el paquete antiguo -> se parte en fichas y se sube.
          const old = kvRows.find((r) => r.key === doc);
          if (old) { writeLocal(doc, typeof old.value === "string" ? old.value : JSON.stringify(old.value)); seed.push(doc); }
          synced[doc] = new Map();
        }
      }
      window.acllarCloud.empty = !(byDoc[MAIN_KEY] && byDoc[MAIN_KEY].size) && !seed.includes(MAIN_KEY);
      failing = false;
    } catch (e) {
      // Sin la versión de la nube no arrancamos: trabajar sobre una copia vieja
      // y luego subirla pisaría los cambios hechos desde otro dispositivo.
      setBadge("err", "Sin conexión con la nube");
      throw new Error("No se pudo conectar con la nube (" + (e.message || e) + "). Revisa la conexión y recarga la página.");
    }
    booted = true;
    for (const doc of seed) schedule(doc);
    startRealtime();
    refreshBadge();
  }

  // ---------- OT que llegan desde la app de revisiones ----------
  const revisiones = {
    // OT pendientes de confirmar (nuevas o editadas), de la más antigua a la más nueva.
    async pendientes() {
      const { data, error } = await sb.from("revisiones")
        .select("id,veh_id,fecha,inspector,revnum,estado,updated_at,data")
        .in("estado", ["pendiente", "editada"]).eq("deleted", false).order("fecha");
      if (error) throw error;
      return data || [];
    },
    // Genera el HTML de la OT (igual que el que descargaba la app) con sus fotos.
    async otFile(row) {
      const rec = JSON.parse(JSON.stringify(row.data || {}));
      const cache = {};
      const res = async (p) => {
        if (typeof p !== "string" || !p.startsWith("sb:")) return p;
        if (cache[p]) return cache[p];
        const { data, error } = await sb.storage.from("revisiones").download(p.slice(3));
        if (error) throw error;
        const url = await new Promise((ok, ko) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = ko; r.readAsDataURL(new Blob([data], { type: "image/jpeg" })); });
        return (cache[p] = url);
      };
      for (const d of rec.dmgs || []) if (Array.isArray(d.photos)) d.photos = await Promise.all(d.photos.map(res));
      if (Array.isArray(rec.genPhotos)) rec.genPhotos = await Promise.all(rec.genPhotos.map(res));
      const html = window.AcOT.buildExportHTML(rec, row.revnum);
      const name = `OT · ${row.veh_id} · ${(rec.veh && rec.veh.plate) || ""} (${row.revnum}).html`;
      return new File([html], name, { type: "text/html" });
    },
    // Marca la OT como confirmada, solo si no cambió desde que se abrió.
    async confirmar(row) {
      const { data, error } = await sb.from("revisiones")
        .update({ estado: "confirmada", confirmada_at: new Date().toISOString(), confirmada_por: who() })
        .eq("id", row.id).eq("updated_at", row.updated_at).select("id");
      if (error) throw error;
      return !!(data && data.length);
    },
  };

  window.acllarCloud = {
    sb, buzon, flushAll, revisiones, device: DEVICE, empty: false,
    MAIN_KEY, QUANT_DOCS,
    // La app avisa de que ya recargó un doc tras un cambio remoto.
    ack(doc) { delete awaiting[doc]; },
    // Para pruebas / diagnóstico
    _debug: { decompose, recompose, canon, synced, awaiting, pending },
  };
  window.acllarCloud.ready = boot();
})();
