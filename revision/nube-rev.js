// nube-rev.js — App de revisiones AC·LLAR conectada a la nube (Supabase)
// ---------------------------------------------------------------------------
// La app sigue funcionando igual en el móvil. Lo que cambia por debajo:
//  · Login (el mismo usuario que el cockpit).
//  · La flota y las bajas vienen del cockpit.
//  · Al guardar, la revisión queda en el móvil y se sube sola a la nube en
//    cuanto hay conexión (cola "pendiente de subir"). Sin cobertura no se pierde.
//  · Las fotos se suben al almacenamiento de la nube; en la revisión quedan
//    como referencia 'sb:<ruta>' y se descargan cuando hacen falta.
//  · El historial es compartido entre todos los usuarios.
//  · El número de OT (N) lo asigna la nube, sin repetir entre dispositivos.
//  · Cada revisión nueva queda "pendiente de confirmar" para el cockpit.
// ---------------------------------------------------------------------------
(function () {
  const SB_URL = "https://mvpibmwvmluxstitecqc.supabase.co";
  const SB_KEY = "sb_publishable_hfgeruPRIDzswATlpbi3ww_ohEzZap0";
  const AUTH_KEY = "sb-mvpibmwvmluxstitecqc-auth-token";
  const MAIN_DOC = "ac-cockpit-data-v1";
  const BUCKET = "revisiones";
  const sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true } });

  const Nube = window.Nube = { sb, user: "", syncing: false, lastSync: null, error: null, ready: false };
  const isRef = (p) => typeof p === "string" && p.startsWith("sb:");
  const online = () => navigator.onLine !== false;
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // ================= base de datos local (añade almacén de fotos) =================
  window.openDB = function () {
    return new Promise((resolve, reject) => {
      if (dbInstance) { resolve(dbInstance); return; }
      const req = indexedDB.open(DB_NAME, 2);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("inspections")) db.createObjectStore("inspections", { keyPath: "id" });
        if (!db.objectStoreNames.contains("cache")) db.createObjectStore("cache", { keyPath: "vehId" });
        if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta", { keyPath: "key" });
        if (!db.objectStoreNames.contains("photos")) db.createObjectStore("photos", { keyPath: "path" });
      };
      req.onsuccess = (e) => { dbInstance = e.target.result; resolve(dbInstance); };
      req.onerror = (e) => reject(e.target.error);
    });
  };
  const metaGet = async (k) => { try { const m = await dbGet("meta", k); return m ? m.value : undefined; } catch { return undefined; } };
  const metaSet = (k, v) => dbPut("meta", { key: k, value: v });

  // ================= fotos =================
  async function sha1(str) {
    const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(str));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  function dataUrlToBlob(dataUrl) {
    const [head, b64] = dataUrl.split(",");
    const mime = (head.match(/data:([^;]+)/) || [])[1] || "image/jpeg";
    const bin = atob(b64); const u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return new Blob([u], { type: mime });
  }
  const blobToDataUrl = (blob) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(blob); });
  const NO_PHOTO = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#F1F5F9"/><text x="100" y="92" font-size="13" text-anchor="middle" fill="#64748B" font-family="sans-serif">Foto en la OT de OneDrive</text><text x="100" y="115" font-size="10" text-anchor="middle" fill="#94A3B8" font-family="sans-serif">(más de 45 días) o sin conexión</text></svg>');

  // keepLocal=false: no guardar copia en el móvil (historial antiguo importado).
  async function uploadPhoto(recId, dataUrl, keepLocal = true) {
    if (isRef(dataUrl) || typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) return dataUrl;
    const path = recId + "/" + (await sha1(dataUrl)) + ".jpg";
    const cached = await dbGet("photos", path).catch(() => null);
    if (!(cached && cached.up)) {
      const { error } = await sb.storage.from(BUCKET).upload(path, dataUrlToBlob(dataUrl), { contentType: "image/jpeg", upsert: true });
      if (error) throw error;
      await dbPut("photos", keepLocal ? { path, data: dataUrl, up: true, at: Date.now() } : { path, up: true, at: Date.now() });
    }
    return "sb:" + path;
  }
  // Reduce una foto ya hecha (para el historial antiguo, que se guardó a 2000 px).
  const recompress = (dataUrl, maxPx, q) => new Promise((resolve) => {
    if (isRef(dataUrl) || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image")) return resolve(dataUrl);
    const img = new Image();
    img.onload = () => {
      try {
        const sc = Math.min(maxPx / img.width, maxPx / img.height, 1);
        const cv = document.createElement("canvas");
        cv.width = Math.round(img.width * sc); cv.height = Math.round(img.height * sc);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        const out = cv.toDataURL("image/jpeg", q);
        resolve(out.length < dataUrl.length ? out : dataUrl);
      } catch (e) { resolve(dataUrl); }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
  async function resolvePhoto(p) {
    if (!isRef(p)) return p;
    const path = p.slice(3);
    const cached = await dbGet("photos", path).catch(() => null);
    if (cached && cached.data) return cached.data;
    if (!online()) return NO_PHOTO;
    try {
      const { data, error } = await sb.storage.from(BUCKET).download(path);
      if (error) throw error;
      const url = await blobToDataUrl(new Blob([data], { type: "image/jpeg" }));
      await dbPut("photos", { path, data: url, up: true, at: Date.now() });
      return url;
    } catch (e) { return NO_PHOTO; }
  }
  // Aplica fn a todas las fotos de una revisión (o de una entrada de caché).
  async function mapPhotos(rec, fn) {
    const r = JSON.parse(JSON.stringify(rec));
    const arr = async (a) => (Array.isArray(a) ? Promise.all(a.map(fn)) : a);
    if (Array.isArray(r.genPhotos)) r.genPhotos = await arr(r.genPhotos);
    for (const d of r.dmgs || []) { if (d.photos) d.photos = await arr(d.photos); if (d.d && d.d.photos) d.d.photos = await arr(d.d.photos); }
    for (const k of Object.keys(r.itemsSnapshot || {})) { const it = r.itemsSnapshot[k]; if (it && it.d && it.d.photos) it.d.photos = await arr(it.d.photos); }
    return r;
  }
  const hydrate = (rec) => mapPhotos(rec, resolvePhoto);

  // ================= caché de daños (sale del historial) =================
  function recomputeCache() {
    const latest = {};
    for (const r of state.records) {
      if (!r.veh || !r.veh.id) continue;
      const cur = latest[r.veh.id];
      if (!cur || new Date(r.date) > new Date(cur.date)) latest[r.veh.id] = r;
    }
    state.cache = {};
    for (const [vehId, r] of Object.entries(latest)) {
      if (r.dmgs && r.dmgs.length) {
        state.cache[vehId] = { vehId, date: r.date, plate: r.veh.plate, dmgs: r.dmgs.map((d) => ({ code: d.c, name: d.name, d: { ty: d.ty, gr: d.gr, rep: d.rep, pt: d.pt, fc: d.fc, photos: d.photos || [] } })) };
      }
    }
  }
  function sortRecords() { state.records.sort((a, b) => new Date(b.date) - new Date(a.date)); }
  function setLocal(rec) {
    const i = state.records.findIndex((x) => x.id === rec.id);
    if (i >= 0) state.records[i] = rec; else state.records.push(rec);
  }
  const stripLocal = (r) => { const o = { ...r }; for (const k of Object.keys(o)) if (k.startsWith("_")) delete o[k]; return o; };
  const pendingCount = () => state.records.filter((r) => r._sync === "pendiente" || r._sync === "borrar").length;
  function softRender() { if (state.view === "home" || state.view === "settings") render(); else refreshPill(); }

  // ================= subida =================
  async function push() {
    if (Nube.syncing || !online() || !Nube.user) return;
    Nube.syncing = true; refreshPill();
    try {
      const queue = state.records.filter((r) => r._sync === "pendiente" || r._sync === "borrar").sort((a, b) => new Date(a.date) - new Date(b.date));
      for (const rec of queue) {
        try {
          if (rec._sync === "borrar") {
            const { error } = await sb.from("revisiones").update({ deleted: true }).eq("id", rec.id);
            if (error) throw error;
            await dbDelete("inspections", rec.id);
            state.records = state.records.filter((x) => x.id !== rec.id);
            continue;
          }
          const src = rec._historica ? await mapPhotos(rec, (p) => recompress(p, 1600, 0.75)) : rec;
          const withRefs = await mapPhotos(src, (p) => uploadPhoto(rec.id, p, !rec._historica));
          const payload = stripLocal(withRefs);
          delete payload.revNum;
          const { data, error } = await sb.rpc("guardar_revision", {
            p_id: rec.id, p_veh: rec.veh.id, p_fecha: rec.date, p_data: payload,
            p_historica: !!rec._historica, p_revnum: rec.revNum != null ? rec.revNum : null,
          });
          if (error) throw error;
          // Si mientras subía se volvió a editar, no pisar la versión nueva.
          const now = state.records.find((x) => x.id === rec.id);
          if (now && now !== rec && now._sync === "pendiente" && now._rev !== rec._rev) continue;
          const done = { ...withRefs, revNum: data.revnum, _estado: data.estado, _inspector: rec._inspector || Nube.user, _sync: "ok" };
          await dbPut("inspections", done);
          setLocal(done);
        } catch (e) {
          Nube.error = (e && e.message) || String(e);
          console.warn("[revisiones] no se pudo subir", rec.id, e);
        }
      }
      if (!state.records.some((r) => r._sync === "pendiente")) Nube.error = null;
      sortRecords(); recomputeCache();
    } finally {
      Nube.syncing = false; Nube.lastSync = new Date();
      softRender();
    }
  }

  // ================= bajada =================
  async function pullFleet() {
    const { data, error } = await sb.from("cockpit_items").select("data,deleted").eq("doc", MAIN_DOC).eq("col", "vehicles");
    if (error) throw error;
    const vs = (data || []).filter((r) => !r.deleted && r.data && r.data.id).map((r) => r.data);
    if (!vs.length) return;
    state.fleet = vs.map((v) => ({ id: v.id, plate: v.plate || "", vin: v.vin || "", brand: v.brand || "", model: v.model || "", sede: v.location || "" }));
    state.bajas = {}; for (const v of vs) if (v.baja) state.bajas[v.id] = true;
    await metaSet("fleet", state.fleet); await metaSet("bajas", state.bajas);
  }
  async function pullOffsets() {
    const { data, error } = await sb.from("rev_offsets").select("veh_id,offset");
    if (error) throw error;
    state.revOffsets = {}; for (const r of data || []) state.revOffsets[r.veh_id] = r.offset;
    await metaSet("revOffsets", state.revOffsets);
  }
  async function pullRevisiones() {
    let cursor = await metaGet("cursor");
    const since = cursor ? new Date(new Date(cursor).getTime() - 15000).toISOString() : null;
    const PAGE = 200;
    for (let from = 0; ; from += PAGE) {
      let q = sb.from("revisiones").select("id,veh_id,revnum,estado,inspector,data,deleted,updated_at");
      if (since) q = q.gt("updated_at", since);
      const { data, error } = await q.order("updated_at").order("id").range(from, from + PAGE - 1);
      if (error) throw error;
      for (const row of data || []) {
        if (!cursor || row.updated_at > cursor) cursor = row.updated_at;
        const id = Number(row.id);
        const local = state.records.find((x) => x.id === id);
        if (local && (local._sync === "pendiente" || local._sync === "borrar")) continue; // lo de este móvil manda hasta subirlo
        if (row.deleted) {
          if (local) { await dbDelete("inspections", id).catch(() => {}); state.records = state.records.filter((x) => x.id !== id); }
          continue;
        }
        const rec = { ...row.data, id, revNum: row.revnum, _estado: row.estado, _inspector: row.inspector, _sync: "ok" };
        await dbPut("inspections", rec);
        setLocal(rec);
      }
      if (!data || data.length < PAGE) break;
    }
    if (cursor) await metaSet("cursor", cursor);
  }
  async function pull() {
    if (!online() || !Nube.user) return;
    try {
      await pullFleet();
      await pullOffsets().catch(() => {});
      await pullRevisiones();
      sortRecords(); recomputeCache();
      Nube.lastSync = new Date();
    } catch (e) {
      console.warn("[revisiones] no se pudo actualizar", e);
    }
    softRender();
  }
  async function syncAll() { await push(); await pull(); }
  Nube.sync = syncAll;

  // Limpieza: las fotos guardadas en el móvil de hace más de 30 días ya están en la nube.
  async function cleanupLocalPhotos() {
    try {
      const all = await dbGetAll("photos");
      const limit = Date.now() - 30 * 864e5;
      for (const p of all) if (p.up && p.at < limit) await dbDelete("photos", p.path);
    } catch {}
  }

  // ================= indicador de estado =================
  function pillHtml() {
    const n = pendingCount();
    let txt, bg, fg;
    if (!online()) { txt = n ? "📴 Sin conexión · " + n + " por subir" : "📴 Sin conexión"; bg = "#FEF3C7"; fg = "#92400E"; }
    else if (Nube.syncing) { txt = "⏳ Subiendo…"; bg = "#FFEDD5"; fg = "#9A3412"; }
    else if (n) { txt = "⚠️ " + n + " por subir"; bg = "#FEE2E2"; fg = "#991B1B"; }
    else { txt = "☁ Al día"; bg = "#DCFCE7"; fg = "#166534"; }
    return `<span id="nube-pill" data-action="sync-now" style="display:inline-block;margin-top:4px;font-size:11px;font-weight:700;padding:3px 8px;border-radius:10px;background:${bg};color:${fg};cursor:pointer">${txt}</span>`;
  }
  function refreshPill() { const el = document.getElementById("nube-pill"); if (el) el.outerHTML = pillHtml(); }
  window.nubePill = pillHtml;
  window.syncBadge = function (r) {
    let b = "";
    if (r._sync === "pendiente") b = `<span style="background:#FEE2E2;color:#991B1B">⏳ Pendiente de subir</span>`;
    else if (r._estado === "pendiente") b = `<span style="background:#FFEDD5;color:#9A3412">🕓 En el cockpit · por confirmar</span>`;
    else if (r._estado === "editada") b = `<span style="background:#FEF3C7;color:#92400E">✏️ Editada · por confirmar</span>`;
    else if (r._estado === "confirmada") b = `<span style="background:#DCFCE7;color:#166534">✅ Confirmada en cockpit</span>`;
    const who = r._inspector ? `<span style="background:#F1F5F9;color:#475569">👤 ${esc(String(r._inspector).split("@")[0])}</span>` : "";
    return `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;font-size:11px;font-weight:700">${b.replace(/<span style="/, '<span style="padding:2px 7px;border-radius:6px;')}${who.replace(/<span style="/, '<span style="padding:2px 7px;border-radius:6px;')}</div>`;
  };

  // ================= funciones de la app que cambian =================
  // Guardar: igual que antes, pero queda en cola para subir a la nube.
  window.saveInspection = async function () {
    const c = state.currentInsp;
    const items = c.items;
    const dmgList = Object.entries(items).filter(([, v]) => v && v.s === "dmg");
    const missB = EQB.filter((e) => c.equip[e.id] === "miss");
    const missO = EQO.filter((e) => c.optInc[e.id] && c.optRet[e.id] === "miss");
    const missAll = [...missB, ...missO];
    const now = new Date().toISOString();
    const prev = state.records.find((r) => r.id === c.id);
    const insp = {
      id: c.id, date: c.date, startedAt: c.startedAt || c.date,
      finishedAt: c.finishedAt || now,
      editedAt: state.editingId ? now : undefined,
      revNum: c.revNum, veh: c.veh, fuel: c.fuel, km: c.km != null ? c.km : null, notes: c.notes || "",
      ag: c.ag, equip: c.equip, optInc: c.optInc, optRet: c.optRet, genPhotos: c.genPhotos,
      itemsSnapshot: JSON.parse(JSON.stringify(items)),
      dmgs: dmgList.map(([code, v]) => ({ c: code, name: (ALL.find((i) => i.code === code) || {}).name, ...v.d })),
      miss: missAll.map((e) => e.name),
      stats: {
        tot: ALL.length, rev: Object.keys(items).length,
        ok: Object.values(items).filter((i) => i && i.s === "ok").length,
        dmg: dmgList.length, na: Object.values(items).filter((i) => i && i.s === "na").length, miss: missAll.length,
      },
      _sync: "pendiente", _rev: Date.now(),
      _estado: prev ? prev._estado : undefined,
      _inspector: (prev && prev._inspector) || Nube.user,
      _historica: prev ? prev._historica : undefined,
    };
    try {
      await dbPut("inspections", insp);
      setLocal(insp); sortRecords(); recomputeCache();
      toast(online() ? "✅ Guardada · subiendo a la nube…" : "✅ Guardada en el móvil · se subirá al tener conexión", "ok");
      state.currentInsp = null; state.editingId = null; state.view = "home"; state.tab = "history";
      render();
      push();
    } catch (e) {
      toast("❌ Error al guardar: " + (e.message || e), "err");
    }
  };

  window.deleteRecord = async function (id) {
    const rec = state.records.find((r) => r.id === id);
    if (!rec) return;
    const aviso = rec._estado === "confirmada" ? "\n\nOjo: esta OT ya está confirmada en el cockpit. Borrarla aquí NO quita sus daños del cockpit." : "";
    if (!confirm("¿Borrar esta inspección para todos los usuarios? No se puede deshacer." + aviso)) return;
    const mark = { ...rec, _sync: "borrar" };
    await dbPut("inspections", mark);
    setLocal(mark); recomputeCache();
    toast("Borrada", "ok");
    render();
    push();
  };

  const origLoadRecord = window.loadRecord;
  window.loadRecord = async function (r) {
    toast("Cargando fotos…");
    const full = await hydrate(r);
    if (state.cache[r.veh.id]) state.cache[r.veh.id] = await hydrate(state.cache[r.veh.id]);
    return origLoadRecord(full);
  };
  const origNewInspection = window.newInspection;
  window.newInspection = async function (veh) {
    if (state.cache[veh.id]) state.cache[veh.id] = await hydrate(state.cache[veh.id]);
    return origNewInspection(veh);
  };

  window.downloadReport = async function (r) {
    if (r.revNum == null && r._estado !== "historica") {
      toast("Esta OT aún no tiene número: se asigna al subirla a la nube. Prueba de nuevo con conexión.", "err");
      if (online()) push();
      return;
    }
    try {
      toast("Preparando OT…");
      const full = await hydrate(r);
      const html = buildExportHTML(full, r.revNum);
      const fname = `OT · ${r.veh?.id || "SIN-ID"} · ${r.veh?.plate || ""}${r.revNum != null ? " (" + r.revNum + ")" : ""}.html`;
      downloadBlob(new Blob([html], { type: "text/html;charset=utf-8" }), fname);
      toast("📥 Descargado como " + fname, "ok");
    } catch (e) { toast("Error: " + (e.message || e), "err"); }
  };

  window.rescueAll = async function () {
    const ts = new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-");
    downloadText(JSON.stringify(state.records.map(stripLocal), null, 2), `HISTORIAL_${ts}.json`, "application/json");
    toast("Historial descargado (sin fotos; las fotos están en la nube)", "ok");
  };

  window.editSingleOffset = async function () {
    const raw = prompt("¿Qué vehículo? (ej: AC-271)");
    if (!raw) return;
    const vehId = raw.trim().toUpperCase();
    const current = state.revOffsets[vehId] || 0;
    const nuevo = prompt(`Número inicial de ${vehId}: ${current}\n\n¿Nuevo valor? (el número (N) más alto que existe en OneDrive)`, current);
    if (nuevo === null) return;
    const n = parseInt(nuevo, 10);
    if (isNaN(n) || n < 0) { toast("Debe ser un número >= 0", "err"); return; }
    const { error } = await sb.from("rev_offsets").upsert({ veh_id: vehId, offset: n });
    if (error) { toast("Error: " + error.message, "err"); return; }
    state.revOffsets[vehId] = n; await metaSet("revOffsets", state.revOffsets);
    toast(`✅ ${vehId} → ${n}`, "ok"); render();
  };

  // Migración: importar el historial de la app antigua (JSON de "Rescate").
  // El archivo puede pesar cientos de MB: se lee por trozos y se procesa UNA
  // revisión cada vez (fotos reducidas → nube), sin cargarlo entero en memoria.
  // Si se corta, se puede volver a lanzar: salta las que ya están en la nube.
  async function* streamJsonArray(file) {
    const CH = 4 * 1024 * 1024;
    const dec = new TextDecoder();
    let buf = "", depth = 0, inStr = false, esc = false, start = -1, scanned = 0;
    for (let off = 0; off < file.size; off += CH) {
      buf += dec.decode(await file.slice(off, off + CH).arrayBuffer(), { stream: off + CH < file.size });
      for (let i = scanned; i < buf.length; i++) {
        const ch = buf[i];
        if (inStr) { if (esc) esc = false; else if (ch === "\\") esc = true; else if (ch === '"') inStr = false; continue; }
        if (ch === '"') { inStr = true; continue; }
        if (ch === "{") { if (depth === 1 && start < 0) start = i; depth++; }
        else if (ch === "}") { depth--; if (depth === 1 && start >= 0) { yield JSON.parse(buf.slice(start, i + 1)); buf = buf.slice(i + 1); i = -1; start = -1; } }
        else if (ch === "[") depth++;
        else if (ch === "]") depth--;
      }
      scanned = buf.length;
      if (start >= 0) scanned = buf.length; // objeto a medias: seguir leyendo
    }
  }
  window.importInspections = async function (file) {
    if (!online()) { toast("Necesitas conexión para traer el historial", "err"); return; }
    if (Nube.importing) return;
    Nube.importing = { done: 0, skip: 0, err: 0, total: 0 };
    const prog = () => { const el = document.getElementById("import-progress"); const p = Nube.importing; if (el && p) el.textContent = `Procesadas ${p.done + p.skip + p.err} · subidas ${p.done} · ya estaban ${p.skip}${p.err ? " · con error " + p.err : ""}`; };
    try {
      const { data: ex } = await sb.from("revisiones").select("id");
      const yaEnNube = new Set((ex || []).map((r) => Number(r.id)));
      for await (const r of streamJsonArray(file)) {
        if (!r || !r.id || !r.veh || !r.veh.id) continue;
        if (yaEnNube.has(r.id)) { Nube.importing.skip++; prog(); continue; }
        try {
          const small = await mapPhotos(r, (p) => recompress(p, 1600, 0.75));
          const withRefs = await mapPhotos(small, (p) => uploadPhoto(r.id, p, false));
          const payload = stripLocal(withRefs); delete payload.revNum;
          const { data, error } = await sb.rpc("guardar_revision", {
            p_id: r.id, p_veh: r.veh.id, p_fecha: r.date, p_data: payload, p_historica: true,
            p_revnum: typeof r.revNum === "number" ? r.revNum : null,
          });
          if (error) throw error;
          const rec = { ...withRefs, revNum: data.revnum, _estado: data.estado, _sync: "ok" };
          await dbPut("inspections", rec); setLocal(rec);
          Nube.importing.done++;
        } catch (e) { Nube.importing.err++; console.warn("[importar]", r.id, e); }
        prog();
      }
      const p = Nube.importing;
      sortRecords(); recomputeCache(); render();
      toast(`✅ Historial: ${p.done} subidas, ${p.skip} ya estaban${p.err ? ", " + p.err + " con error (vuelve a importar el mismo archivo para reintentarlas)" : ""}`, p.err ? "err" : "ok");
    } catch (e) { toast("Error: " + (e.message || e), "err"); }
    finally { Nube.importing = null; }
  };

  window.renderSettings = function () {
    const n = pendingCount();
    const offs = Object.keys(state.revOffsets || {}).length;
    const last = Nube.lastSync ? Nube.lastSync.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "—";
    return `
    <div class="hdr"><div class="hdr-top">
      <button style="background:none;color:#fff;font-size:24px;padding:0;border:none" data-action="back-home">‹</button>
      <div><h1 style="font-size:17px">Ajustes</h1></div><div style="width:24px"></div>
    </div></div>
    <div class="container">
      <div class="settings-section">
        <div class="settings-title">👤 Cuenta</div>
        <div class="settings-desc">Conectado como <b>${esc(Nube.user)}</b></div>
        <button class="settings-btn" data-action="logout">Cerrar sesión</button>
      </div>
      <div class="settings-section">
        <div class="settings-title">☁ Nube</div>
        <div class="settings-desc">
          <b>Conexión:</b> ${online() ? "sí" : "no (las revisiones se guardan en el móvil)"}<br>
          <b>Pendientes de subir:</b> ${n}<br>
          <b>Última sincronización:</b> ${last}
          ${Nube.error ? `<br><span style="color:#B91C1C"><b>Último error:</b> ${esc(Nube.error)}</span>` : ""}
        </div>
        <button class="settings-btn primary" data-action="sync-now">🔄 Sincronizar ahora</button>
      </div>
      <div class="settings-section">
        <div class="settings-title">🚐 Flota</div>
        <div class="settings-desc">La flota viene del cockpit (${state.fleet.length} vehículos). Las altas, bajas y cambios se hacen en el cockpit.</div>
      </div>
      <div class="settings-section">
        <div class="settings-title">🔢 Numeración de OT</div>
        <div class="settings-desc">La nube asigna el número (N) de cada OT, sin repetir aunque revisen varias personas. Vehículos con número inicial de OneDrive: <b>${offs}</b>.</div>
        <button class="settings-btn" data-action="edit-single-offset">✏️ Ajustar número inicial de un vehículo</button>
      </div>
      <div class="settings-section">
        <div class="settings-title">📥 Traer historial de la app antigua</div>
        <div class="settings-desc">Carga el JSON de "🆘 Rescate" de la app anterior. Se sube como historial (NO va al cockpit como pendiente: esas OT ya están en el cockpit). Hazlo desde el PC con wifi y no cierres la página hasta que termine. Si se corta, vuelve a cargar el mismo archivo: salta las que ya subió.</div>
        <label class="settings-btn" style="display:block;text-align:center">📥 Importar historial JSON
          <input type="file" accept=".json" style="display:none" id="import-insp-file"></label>
        <div id="import-progress" style="font-size:13px;font-weight:700;color:#1E3A5F;margin-top:6px">${Nube.importing ? "Importando…" : ""}</div>
      </div>
      <div class="settings-section">
        <div class="settings-title">🆘 Descargar historial</div>
        <div class="settings-desc">Descarga los datos de todas las revisiones (sin fotos).</div>
        <button class="settings-btn" data-action="rescue">🆘 Descargar historial (datos)</button>
      </div>
    </div>`;
  };

  // ================= acciones extra (delegación) =================
  document.addEventListener("click", async (e) => {
    const el = e.target.closest && e.target.closest("[data-action]");
    if (!el) return;
    const a = el.dataset.action;
    if (a === "sync-now") { e.stopPropagation(); toast(online() ? "Sincronizando…" : "Sin conexión"); syncAll(); }
    if (a === "logout") {
      if (pendingCount() && !confirm("Hay revisiones sin subir. Si cierras sesión se subirán cuando vuelvas a entrar. ¿Cerrar sesión?")) return;
      await sb.auth.signOut(); location.reload();
    }
  }, true);

  // ================= login =================
  function storedEmail() {
    try { const s = JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); return s && s.user && s.user.email || ""; } catch { return ""; }
  }
  function showLogin(msg) {
    return new Promise((resolve) => {
      document.getElementById("app").innerHTML = `
        <div class="hdr"><div class="hdr-top"><div><h1>AC·LLAR</h1><div class="sub">Revisión de flota</div></div></div></div>
        <div class="container"><div class="settings-section">
          <div class="settings-title">Iniciar sesión</div>
          <div class="settings-desc">Usa el mismo usuario que el cockpit.</div>
          <form id="login-form">
            <input class="search-input" type="email" name="email" placeholder="Email" autocomplete="username" required>
            <input class="search-input" type="password" name="password" placeholder="Contraseña" autocomplete="current-password" required>
            <div id="login-err" style="color:#B91C1C;font-size:13px;min-height:18px;margin-bottom:8px">${esc(msg || "")}</div>
            <button class="settings-btn primary" style="width:100%" type="submit">Entrar</button>
          </form>
        </div></div>`;
      const f = document.getElementById("login-form");
      f.onsubmit = async (ev) => {
        ev.preventDefault();
        if (!online()) { document.getElementById("login-err").textContent = "Necesitas conexión para entrar la primera vez."; return; }
        const { data, error } = await sb.auth.signInWithPassword({ email: f.email.value.trim(), password: f.password.value });
        if (error) { document.getElementById("login-err").textContent = "Email o contraseña incorrectos."; return; }
        resolve(data.session.user.email);
      };
    });
  }

  // ================= arranque =================
  window.init = async function () {
    document.getElementById("app").innerHTML = '<div class="empty" style="padding-top:60px"><div class="spinner"></div><div class="empty-title" style="margin-top:14px">Cargando...</div></div>';
    try {
      await openDB();
      // 1) Sesión: sin conexión vale la sesión guardada en el móvil.
      let email = storedEmail();
      if (online()) {
        try { const { data } = await sb.auth.getSession(); email = (data.session && data.session.user.email) || ""; } catch {}
      }
      if (!email) email = await showLogin();
      Nube.user = email;
      // 2) Lo que ya hay en el móvil (funciona sin conexión).
      const f = await metaGet("fleet"); if (Array.isArray(f) && f.length) state.fleet = f;
      const b = await metaGet("bajas"); if (b && typeof b === "object") state.bajas = b;
      const o = await metaGet("revOffsets"); if (o && typeof o === "object") state.revOffsets = o;
      state.records = await dbGetAll("inspections");
      sortRecords(); recomputeCache();
      Nube.ready = true;
      render();
      // 3) Nube: subir lo pendiente y traer lo nuevo.
      syncAll();
      cleanupLocalPhotos();
      window.addEventListener("online", () => { refreshPill(); syncAll(); });
      window.addEventListener("offline", refreshPill);
      document.addEventListener("visibilitychange", () => { if (!document.hidden) syncAll(); });
      setInterval(syncAll, 60000);
    } catch (e) {
      document.getElementById("app").innerHTML = `<div style="padding:20px;color:#DC2626">Error inicial: ${esc(e.message || e)}</div>`;
    }
  };

  // App instalable y usable sin cobertura
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});

  window.init();
})();
