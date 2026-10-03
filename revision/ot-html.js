// ot-html.js — Genera el HTML de una OT exactamente igual que la app de revisiones
// (copia de buildExportHTML de revision/index.html). Lo usa el cockpit para
// precargar las OT que llegan desde la nube con su importador de siempre.
(function(){
const DMG_T=[{code:"RAY",name:"Rayadura"},{code:"GOL",name:"Golpe / Abolladura"},
  {code:"ROT",name:"Rotura"},{code:"FAL",name:"Faltante"},
  {code:"DOB",name:"Doblado"},{code:"FIS",name:"Fisura"},
  {code:"MAN",name:"Mancha"},{code:"DES",name:"Desgaste"},
  {code:"HUM",name:"Humedad"},{code:"QUE",name:"Quemadura"},
  {code:"REP-ANT",name:"Reparación antigua"},];
const REP=[{code:"T1",name:"In-situ",desc:"Sin mover el vehículo"},
  {code:"T2",name:"Taller propio",desc:"Cambio pieza / herramientas"},
  {code:"T3",name:"Taller externo",desc:"ROMISA / FORD / NEMESIO"},
  {code:"T3-PAR",name:"RALARSA (parabrisas)",desc:"Servicio externo en campa"},];
const PART=[{code:"P0",name:"Sin piezas nuevas"},{code:"P1",name:"Requiere piezas"}];
function fmtDateShort(iso){
  if(!iso)return '';
  const d=new Date(iso);
  return d.toLocaleString('es-ES',{day:'2-digit',month:'2-digit',year:'2-digit'});
}

function buildExportHTML(r,revNum){
  const ds=[...(r.dmgs||[])].sort((a,b)=>(b.gr||'').localeCompare(a.gr||''));
  const gL=g=>g==='G3'?'GRAVE':g==='G2'?'MODERADO':'LEVE';
  const rn=c=>REP.find(x=>x.code===c)?.name||c;
  const pn=c=>PART.find(x=>x.code===c)?.name||c;
  const dn=c=>DMG_T.find(x=>x.code===c)?.name||c;
  const dmgRows=ds.map((d,i)=>`<tr style="background:${i%2?'#f9f9f9':'#fff'}"><td style="padding:7px 10px;border:1px solid #ddd;font-size:12px;text-align:center">${i+1}</td><td style="padding:7px 10px;border:1px solid #ddd;font-size:12px;font-weight:600">${d.name}</td><td style="padding:7px 10px;border:1px solid #ddd;font-size:12px">${dn(d.ty)}</td><td style="padding:7px 10px;border:1px solid #ddd;font-size:12px;font-weight:700;text-align:center">${gL(d.gr)}</td><td style="padding:7px 10px;border:1px solid #ddd;font-size:12px">${rn(d.rep)}</td><td style="padding:7px 10px;border:1px solid #ddd;font-size:12px">${pn(d.pt)}</td><td style="padding:7px 10px;border:1px solid #ddd;font-size:11px;font-family:monospace">${d.fc||''}</td></tr>${d.photos&&d.photos.length>0?`<tr style="background:${i%2?'#f9f9f9':'#fff'}"><td style="padding:6px 10px;border:1px solid #ddd" colspan="7"><div style="display:flex;flex-wrap:wrap;gap:6px">${d.photos.map(p=>`<img src="${p}" style="width:120px;height:120px;object-fit:cover;border:1px solid #ccc;border-radius:4px"/>`).join('')}</div></td></tr>`:''}`).join('');
  const g3=ds.filter(d=>d.gr==='G3').length;
  const g2=ds.filter(d=>d.gr==='G2').length;
  const g1=ds.filter(d=>d.gr==='G1').length;
  // Título del documento con número de revisión — el PDF hereda este nombre al "Guardar como PDF"
  const revSuffix=revNum?` (${revNum})`:'';
  const docTitle=`OT · ${r.veh?.id||''} · ${r.veh?.plate||''}${revSuffix}`;
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${docTitle}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Times New Roman',Georgia,serif;font-size:13px;color:#000;background:#e8e8e8;padding:20px}.wrap{max-width:780px;margin:0 auto;background:#fff;padding:36px 40px;box-shadow:0 2px 12px rgba(0,0,0,.2)}.hdr{border-bottom:3px solid #000;padding-bottom:14px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.brand{font-size:24px;font-weight:700;letter-spacing:3px;font-family:Arial,sans-serif}.brand-sub{font-size:10px;color:#555;margin-top:2px;letter-spacing:1px;font-family:Arial,sans-serif}.ot-title{font-size:20px;font-weight:700;text-align:right;letter-spacing:1px;font-family:Arial,sans-serif}.ot-date{font-size:11px;color:#444;text-align:right;margin-top:3px}.section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1.5px solid #000;padding-bottom:4px;margin-bottom:12px;margin-top:20px;font-family:Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px 24px;margin-bottom:8px}.field-label{font-size:9px;color:#666;text-transform:uppercase;letter-spacing:.8px;font-family:Arial,sans-serif;margin-bottom:2px}.field-value{font-size:13px;font-weight:700;border-bottom:1px solid #bbb;padding-bottom:3px}.stats-row{display:flex;gap:0;border:1.5px solid #000;margin-bottom:4px}.stat{flex:1;text-align:center;padding:10px 4px;border-right:1px solid #000}.stat:last-child{border-right:none}.stat-n{font-size:28px;font-weight:700;font-family:Arial,sans-serif}.stat-l{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#444;margin-top:2px;font-family:Arial,sans-serif}table{width:100%;border-collapse:collapse;margin-bottom:4px}th{background:#000;color:#fff;padding:6px 10px;font-size:10px;text-align:left;text-transform:uppercase;letter-spacing:.5px;font-family:Arial,sans-serif}.empty{border:2px solid #000;padding:20px;text-align:center;font-weight:700;font-size:14px;letter-spacing:2px;font-family:Arial,sans-serif;margin:8px 0}.signs{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-top:36px;border-top:2px solid #000;padding-top:8px}.sign{font-size:9px;text-transform:uppercase;letter-spacing:.8px;text-align:center;color:#555;padding-bottom:28px;font-family:Arial,sans-serif}.foot{margin-top:20px;padding-top:8px;border-top:1px solid #ccc;display:flex;justify-content:space-between;font-size:9px;color:#888;font-family:Arial,sans-serif}.btn-bar{display:flex;gap:10px;margin-bottom:24px}.btn{flex:1;border:none;padding:13px;font-size:13px;font-weight:700;cursor:pointer;font-family:Arial,sans-serif;letter-spacing:.3px}.btn-print{background:#000;color:#fff}@media print{.btn-bar{display:none!important}body{background:#fff;padding:0}.wrap{box-shadow:none;padding:20px 24px}}@media(max-width:600px){.grid{grid-template-columns:1fr 1fr}.signs{grid-template-columns:1fr}.hdr{flex-direction:column}}</style></head><body>
<div class="wrap">
<div class="btn-bar"><button class="btn btn-print" onclick="window.print()">Imprimir / Guardar como PDF</button></div>
<div class="hdr"><div><div class="brand">AC·LLAR</div><div class="brand-sub">vacaciones en autocaravana</div></div><div><div class="ot-title">ORDEN DE TRABAJO</div><div class="ot-date">${fmtDateShort(r.date)} · ${new Date(r.date).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})}</div></div></div>
<div class="section-title">Datos del vehículo</div>
<div class="grid"><div><div class="field-label">Identificador</div><div class="field-value">${r.veh?.id||''}</div></div><div><div class="field-label">Matrícula</div><div class="field-value">${r.veh?.plate||''}</div></div><div><div class="field-label">Sede</div><div class="field-value">${r.veh?.sede||''}</div></div><div><div class="field-label">Marca / Modelo</div><div class="field-value">${r.veh?.brand||''} ${r.veh?.model||''}</div></div><div><div class="field-label">Bastidor (VIN)</div><div class="field-value">${r.veh?.vin||''}</div></div><div><div class="field-label">Combustible</div><div class="field-value">${r.fuel||'—'}</div></div><div><div class="field-label">Kilómetros</div><div class="field-value">${r.km!=null?r.km.toLocaleString('es-ES')+' km':'—'}</div></div></div>
<div style="display:flex;gap:32px;margin-top:10px;flex-wrap:wrap"><div><div class="field-label">Aguas grises</div><div class="field-value">${r.ag?.gr==='ok'?'✓ Vaciadas':'✗ NO'}</div></div><div><div class="field-label">Aguas negras</div><div class="field-value">${r.ag?.ne==='ok'?'✓ Vaciadas':'✗ NO'}</div></div>${(r.startedAt&&r.finishedAt)?`<div><div class="field-label">Duración de la revisión</div><div class="field-value">${new Date(r.startedAt).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})} → ${new Date(r.finishedAt).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})} <span style="font-weight:400;color:#666">(${(()=>{const ms=new Date(r.finishedAt)-new Date(r.startedAt);const mins=Math.round(ms/60000);if(mins<1)return '<1 min';if(mins<60)return mins+' min';const h=Math.floor(mins/60);const m=mins%60;return m===0?h+' h':h+' h '+m+' min';})()})</span></div></div>`:''}</div>
${r.notes&&r.notes.trim()?`<div style="margin-top:16px;border:2px solid #000;border-left:8px solid #000;padding:12px 16px;background:#fffde7"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;font-family:Arial,sans-serif;margin-bottom:6px">⚠ Notas / Observaciones</div><div style="font-size:14px;line-height:1.5;white-space:pre-wrap">${r.notes.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div></div>`:''}
<div class="section-title">Resumen de la inspección</div>
<div class="stats-row"><div class="stat"><div class="stat-n">${g3}</div><div class="stat-l">Graves</div></div><div class="stat"><div class="stat-n">${g2}</div><div class="stat-l">Moderados</div></div><div class="stat"><div class="stat-n">${g1}</div><div class="stat-l">Leves</div></div><div class="stat"><div class="stat-n">${r.stats?.ok||0}</div><div class="stat-l">OK</div></div><div class="stat"><div class="stat-n">${r.stats?.na||0}</div><div class="stat-l">N/A</div></div></div>
<div class="section-title">Reparaciones — ${ds.length} registradas</div>
${ds.length===0?`<div class="empty">SIN DAÑOS — VEHÍCULO EN BUEN ESTADO</div>`:`<table><thead><tr><th style="width:30px">#</th><th>Zona / Elemento</th><th>Tipo de daño</th><th>Gravedad</th><th>Reparación</th><th>Piezas</th><th>Código</th></tr></thead><tbody>${dmgRows}</tbody></table>`}
${r.miss&&r.miss.length>0?`<div class="section-title">Equipamiento faltante</div><table><thead><tr><th style="width:30px">#</th><th>Elemento</th></tr></thead><tbody>${r.miss.map((m,i)=>`<tr style="background:${i%2?'#f9f9f9':'#fff'}"><td style="padding:6px 10px;border:1px solid #ddd;text-align:center;font-size:12px">${i+1}</td><td style="padding:6px 10px;border:1px solid #ddd;font-size:12px">${m}</td></tr>`).join('')}</tbody></table>`:''}
${r.genPhotos&&r.genPhotos.length>0?`<div class="section-title">Fotos generales del vehículo (${r.genPhotos.length})</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px">${r.genPhotos.map(ph=>`<img src="${ph}" style="width:100%;height:140px;object-fit:cover;border:1px solid #ddd;border-radius:4px"/>`).join('')}</div>`:''}
<div class="section-title">Firmas</div>
<div class="signs"><div class="sign">Inspector</div><div class="sign">Jefe de taller</div><div class="sign">Fecha entrega taller</div></div>
<div class="foot"><span>AC-LLAR · ${r.veh?.id||''} · ${r.veh?.plate||''} · VIN: ${r.veh?.vin||''}</span><span>Generado: ${fmtDateShort(r.date)}</span></div>
</div></body></html>`;
}


window.AcOT={buildExportHTML};
})();
