// motor.js  ---  Toda la logica JavaScript del Cockpit AC-LLAR
// El almacenamiento (window.storage, window.acllarPhotos) y la conexion con
// la nube (Supabase) viven en nube.js, que se carga ANTES que este archivo.
// (Se quito el puente a n8n: ya no se usa.)

/* ===== Bloque 2: aplicacion principal ===== */
function acllarFail(msg) {
  var l = document.getElementById('loading'); if (l) l.style.display = 'none';
  var e = document.getElementById('err'); e.style.display = 'block';
  e.innerHTML = '<b>No se pudo iniciar el cockpit.</b><br>' + msg +
    '<br><br>El cockpit necesita internet: los datos viven en la nube. Revisa la conexión y recarga (F5).';
}
// Si algo revienta al renderizar (no solo al arrancar), avisar en vez de dejar la pantalla en blanco.
window.addEventListener('error', function (ev) {
  var root = document.getElementById('root');
  if (root && root.innerHTML.length < 200) acllarFail('Error al renderizar: ' + (ev.message || 'desconocido'));
});
window.addEventListener('load', function () {
  if (!window.React || !window.ReactDOM) { acllarFail('No cargó React. Revisá tu conexión a internet.'); return; }
  if (!window.XLSX) { acllarFail('No cargó XLSX. Revisá tu conexión a internet.'); return; }
  try {
(function () {
  const h = React.createElement;
  function makeIcon(paths) {
    return function Icon(props) {
      const { size = 24, color = 'currentColor', strokeWidth = 2, style, ...rest } = props || {};
      return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', style, ...rest }, paths.map((p, i) => h(p[0], { key: i, ...p[1] })));
    };
  }
  const P = (d) => ['path', { d }];
  const L = (x1,y1,x2,y2) => ['line', { x1,y1,x2,y2 }];
  const C = (cx,cy,r) => ['circle', { cx,cy,r }];
  const R = (x,y,w,ht,rx) => ['rect', { x,y,width:w,height:ht,rx }];
  const PL = (pts) => ['polyline', { points: pts }];
  const PG = (pts) => ['polygon', { points: pts }];
  window.lucideReact = {
    Truck: makeIcon([P('M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2'), P('M15 18H9'), P('M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14'), C(17,18,2), C(7,18,2)]),
    AlertTriangle: makeIcon([P('m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z'), L(12,9,12,13), L(12,17,12.01,17)]),
    CheckCircle: makeIcon([P('M22 11.08V12a10 10 0 1 1-5.93-9.14'), PL('22 4 12 14.01 9 11.01')]),
    Calendar: makeIcon([R(3,4,18,18,2), L(16,2,16,6), L(8,2,8,6), L(3,10,21,10)]),
    Plus: makeIcon([L(5,12,19,12), L(12,5,12,19)]),
    Download: makeIcon([P('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'), PL('7 10 12 15 17 10'), L(12,15,12,3)]),
    Upload: makeIcon([P('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'), PL('17 8 12 3 7 8'), L(12,3,12,15)]),
    X: makeIcon([L(18,6,6,18), L(6,6,18,18)]),
    Edit2: makeIcon([P('M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z')]),
    Trash2: makeIcon([PL('3 6 5 6 21 6'), P('M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'), L(10,11,10,17), L(14,11,14,17)]),
    ArrowLeft: makeIcon([L(19,12,5,12), PL('12 19 5 12 12 5')]),
    Search: makeIcon([C(11,11,8), L(21,21,16.65,16.65)]),
    Database: makeIcon([['ellipse',{cx:12,cy:5,rx:9,ry:3}], P('M21 12c0 1.66-4 3-9 3s-9-1.34-9-3'), P('M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5')]),
    Clock: makeIcon([C(12,12,10), PL('12 6 12 12 16 14')]),
    FileWarning: makeIcon([P('M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'), L(12,9,12,13), L(12,17,12.01,17)]),
    ChevronRight: makeIcon([PL('9 18 15 12 9 6')]),
    Save: makeIcon([P('M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z'), PL('17 21 17 13 7 13 7 21'), PL('7 3 7 8 15 8')]),
    MapPin: makeIcon([P('M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'), C(12,10,3)]),
    FileText: makeIcon([P('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'), PL('14 2 14 8 20 8'), L(16,13,8,13), L(16,17,8,17), PL('10 9 9 9 8 9')]),
    ClipboardList: makeIcon([R(8,2,8,4,1), P('M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'), P('M12 11h4'), P('M12 16h4'), P('M8 11h.01'), P('M8 16h.01')]),
    Coins: makeIcon([C(8,8,6), P('M18.09 10.37A6 6 0 1 1 10.34 18'), P('M7 6h1v4'), P('m16.71 13.88.7.71-2.82 2.82')]),
    BarChart3: makeIcon([P('M3 3v18h18'), P('M18 17V9'), P('M13 17V5'), P('M8 17v-3')]),
    Construction: makeIcon([R(2,6,20,8,1), L(17,14,17,22), L(7,14,7,22), L(17,18,7,18), L(2,10,22,10)]),
    Settings: makeIcon([P('M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'), C(12,12,3)]),
    Wrench: makeIcon([P('M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z')]),
    FileUp: makeIcon([P('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'), PL('14 2 14 8 20 8'), P('M12 12v6'), P('m15 15-3-3-3 3')]),
    ShieldAlert: makeIcon([P('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'), L(12,8,12,12), L(12,16,12.01,16)]),
    Filter: makeIcon([PG('22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3')]),
    Loader2: makeIcon([P('M21 12a9 9 0 1 1-6.219-8.56')]),
    CircleAlert: makeIcon([C(12,12,10), L(12,8,12,12), L(12,16,12.01,16)]),
    Sparkles: makeIcon([P('m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z'), P('M5 3v4'), P('M19 17v4'), P('M3 5h4'), P('M17 19h4')]),
    ChevronDown: makeIcon([PL('6 9 12 15 18 9')]),
  };
})();
  } catch (err) { acllarFail('Error al cargar iconos: ' + err.message); return; }
  try {
(() => {
  const React = window.React;
  const { useState, useEffect, useMemo, useRef, useCallback, Component } = React;
  const XLSX = window.XLSX;
  const {
    Truck,
    AlertTriangle,
    CheckCircle,
    Calendar,
    Plus,
    Download,
    Upload,
    X,
    Edit2,
    Trash2,
    ArrowLeft,
    Search,
    Database,
    Clock,
    FileWarning,
    ChevronRight,
    Save,
    MapPin,
    FileText,
    ClipboardList,
    Coins,
    BarChart3,
    Construction,
    Settings,
    Wrench,
    FileUp,
    ShieldAlert,
    Filter,
    Loader2,
    CircleAlert,
    Sparkles,
    ChevronDown
  } = window.lucideReact;
  const STORAGE_KEY = "ac-cockpit-data-v1";
  const APP_VERSION = 2;
  const SEED_VEHICLES = [{ "id": "AC-08A", "plate": "2409MMK", "vin": "ZFA25000002X29207", "brand": "Roller Team", "model": "Livingstone 5", "vehicleClass": "Camper Van. Literas dobles. PAX 2/4 C", "location": "Onil" }, { "id": "AC-09A", "plate": "7635NBV", "vin": "ZFA250001SMB21359", "brand": "Roller Team", "model": "Livingstone 5", "vehicleClass": "Camper Van. Literas dobles. PAX 2/4 C", "location": "Onil" }, { "id": "AC-267", "plate": "8838MNY", "vin": "VF3YGBPAU12Y02471", "brand": "Benimar", "model": "Tessoro 440", "vehicleClass": "Compact. Cama Garaje. PAX 2/4 G", "location": "Valencia" }, { "id": "AC-268A", "plate": "8833MNY", "vin": "VF3YGBPAU12Y01895", "brand": "Benimar", "model": "Tessoro 440", "vehicleClass": "Compact. Cama Garaje. PAX 2/4 G", "location": "Onil" }, { "id": "AC-269", "plate": "1554MPH", "vin": "VF3YGBPAU12Y19771", "brand": "Roller Team", "model": "Kronos 298 Tl", "vehicleClass": "Family Plus. Perfilada Cama Garaje - PAX4/5 G", "location": "Valencia" }, { "id": "AC-270", "plate": "2551MPL", "vin": "VF3YGBPAU12Y10008", "brand": "Benimar", "model": "Tessoro 442", "vehicleClass": "Family Standard. Perfilada Cama Garaje - PAX 4/5 G", "location": "Valencia" }, { "id": "AC-271", "plate": "2550MPL", "vin": "VF3YGBPAU12Y01578", "brand": "Benimar", "model": "Tessoro 463", "vehicleClass": "Family Plus +. Camas Gemelas. PAX 4/5 G", "location": "Valencia" }, { "id": "AC-272", "plate": "2552MPL", "vin": "VF3YGBPAU12Y02024", "brand": "Benimar", "model": "Tessoro 497", "vehicleClass": "Family Plus. Perrfilada Cama Central. PAX 4/5 G", "location": "Valencia" }, { "id": "AC-275C", "plate": "3412MPV", "vin": "VF3YGBPAU12Y01937", "brand": "Benimar", "model": "Tessoro 440", "vehicleClass": "Compact. Cama Garaje. PAX 2/4 G", "location": "Castell\xF3n" }, { "id": "AC-276", "plate": "0165MRK", "vin": "VF3YGBPAU12Y02563", "brand": "Benimar", "model": "Tessoro 463", "vehicleClass": "Family Plus +. Camas Gemelas. PAX 4/5 G", "location": "Onil" }, { "id": "AC-278", "plate": "7958MRD", "vin": "ZFA25000002X17002", "brand": "Roller Team", "model": "Zefiro 284 I", "vehicleClass": "Elite Class. Integral. Pax 4/5 I", "location": "Valencia" }, { "id": "AC-279A", "plate": "2795MRK", "vin": "WF0DXXTTRDPP47723", "brand": "Roller Team", "model": "Kronos 279", "vehicleClass": "Family Plus. Capuchina Garaje. Pax 4/6 G", "location": "Onil" }, { "id": "AC-280", "plate": "5767MSB", "vin": "VF3TGBPAU12Y01567", "brand": "Benimar", "model": "Tessoro 463", "vehicleClass": "Family Plus +. Camas Gemelas. PAX 4/5 G", "location": "Valencia" }, { "id": "AC-281", "plate": "2792MRK", "vin": "ZFA25000002X93909", "brand": "Roller Team", "model": "Zefiro 267 I", "vehicleClass": "Elite Class. Integral. Pax 4/5 I", "location": "Valencia" }, { "id": "AC-283", "plate": "2638MSB", "vin": "VF3YGBPAU12Y14931", "brand": "Benimar", "model": "Tessoro 440", "vehicleClass": "Compact. Cama Garaje. PAX 2/4 G", "location": "Valencia" }, { "id": "AC-284A", "plate": "3769MST", "vin": "VF3YGBPAU12Y31454", "brand": "Benimar", "model": "Tessoro 442", "vehicleClass": "Family Standard. Perfilada Cama Garaje - PAX 4/5 G", "location": "Valencia" }, { "id": "AC-286", "plate": "6002MSV", "vin": "VF3YGBPAU12Y10009", "brand": "Benimar", "model": "Tessoro 463", "vehicleClass": "Family Plus +. Camas Gemelas. PAX 4/5 G", "location": "Valencia" }, { "id": "AC-288", "plate": "5842MSZ", "vin": "WF0DXXTTRDRB59049", "brand": "Roller Team", "model": "Kronos 277M", "vehicleClass": "Family Standard. Capuchina Literas. PAX 4/7 L", "location": "Valencia" }, { "id": "AC-289A", "plate": "6068MTB", "vin": "VF3YGBPAU12Y31585", "brand": "Benimar", "model": "Tessoro 463", "vehicleClass": "Family Plus +. Camas Gemelas. PAX 4/5 G", "location": "Onil" }, { "id": "AC-290", "plate": "5921MTB", "vin": "ZFA25000002Y16757", "brand": "Benimar", "model": "Amphitryon 967", "vehicleClass": "Elite Class. Integral. Pax 4/5 I", "location": "Valencia" }, { "id": "AC-291", "plate": "0470MWB", "vin": "ZFA25000002Z75508", "brand": "Benimar", "model": "Benivan 120", "vehicleClass": "Camper Van. Literas dobles. PAX 2/4 C", "location": "Castell\xF3n" }, { "id": "AC-292", "plate": "9777MZB", "vin": "VF3YGCPAU12Y41705", "brand": "Benimar", "model": "Tessoro 496", "vehicleClass": "Family Plus. Perrfilada Cama Central. PAX 4/5 G", "location": "Valencia" }, { "id": "AC-293", "plate": "4491MZW", "vin": "WF0DXXTTRDRK45024", "brand": "Roller Team", "model": "Kronos 298 Tl", "vehicleClass": "Family Plus. Perfilada Cama Garaje - PAX4/5 G", "location": "Valencia" }, { "id": "AC-294C", "plate": "4555MZX", "vin": "WF0DXXTTRDRK39565", "brand": "Roller Team", "model": "Kronos 279", "vehicleClass": "Family Plus. Capuchina Garaje. Pax 4/6 G", "location": "Castell\xF3n" }, { "id": "AC-295", "plate": "7555MZV", "vin": "WF0DXXTTRDRY85888", "brand": "Benimar", "model": "Sport 340", "vehicleClass": "Family Standard. Capuchina  Literas - Pax 4/5 G", "location": "Valencia" }, { "id": "AC-296", "plate": "4754MZV", "vin": "ZFA25000XR2Z60428", "brand": "Benimar", "model": "Sport 346", "vehicleClass": "Family Standard. Capuchina Garaje. Pax 4/6 G", "location": "Valencia" }, { "id": "AC-297", "plate": "7455MZV", "vin": "ZFA250006R2Z87125", "brand": "Benimar", "model": "Benivan 120", "vehicleClass": "Camper Van. Literas dobles. PAX 2/4 C", "location": "Valencia" }, { "id": "AC-298", "plate": "5659NBB", "vin": "WF0DXXTTRDRD49945", "brand": "Roller Team", "model": "Kronos 279", "vehicleClass": "Family Plus. Capuchina Garaje. Pax 4/6 G", "location": "Valencia" }, { "id": "AC-299C", "plate": "5328NBB", "vin": "VF3YGBPAU12Y33058", "brand": "Benimar", "model": "Tessoro 463", "vehicleClass": "Family Plus +. Camas Gemelas. PAX 4/5 G", "location": "Castell\xF3n" }, { "id": "AC-300", "plate": "5006NBB", "vin": "ZFA250003SMA69362", "brand": "Roller Team", "model": "Zefiro 267 I", "vehicleClass": "Elite Class. Integral. Pax 4/5 I", "location": "Valencia" }, { "id": "AC-301", "plate": "5514NBB", "vin": "WF0DXXTTRDRC30796", "brand": "Benimar", "model": "Tessoro 488", "vehicleClass": "Compact Perfilada F2F. PAX 2/4 P", "location": "Valencia" }, { "id": "AC-302", "plate": "3444NBD", "vin": "ZFA25000002Z39657", "brand": "Benimar", "model": "Tessoro 440", "vehicleClass": "Compact. Cama Garaje. PAX 2/4 G", "location": "Valencia" }, { "id": "AC-303", "plate": "5126NBW", "vin": "ZFA25000002Z26197", "brand": "Benimar", "model": "Tessoro 463", "vehicleClass": "Family Plus +. Camas Gemelas. PAX 4/5 G", "location": "Valencia" }, { "id": "AC-304", "plate": "5028NBW", "vin": "WF0DXXTTRDRS12422", "brand": "Benimar", "model": "Tessoro 440", "vehicleClass": "Compact. Cama Garaje. PAX 2/4 G", "location": "Valencia" }, { "id": "AC-305C", "plate": "9701NCL", "vin": "ZFA250005SMA83229", "brand": "Benimar", "model": "Benivan 120", "vehicleClass": "Camper Van. Literas dobles. PAX 2/4 C", "location": "Valencia" }, { "id": "AC-306", "plate": "1489NCT", "vin": "ZFA250009R2Z87183", "brand": "Roller Team", "model": "Livingstone 5", "vehicleClass": "Camper Van. Literas dobles. PAX 2/4 C", "location": "Valencia" }, { "id": "AC-307", "plate": "3273NCV", "vin": "WF0DXXTTRDPE46631", "brand": "Benimar", "model": "Yrteo 861", "vehicleClass": "Compact Fit. Perfilada Camas Gemelas. PAX 2/3 G", "location": "Valencia" }, { "id": "AC-308", "plate": "5153NDF", "vin": "WF0DXXTTRDSU52603", "brand": "Roller Team", "model": "Kronos 298 Tl", "vehicleClass": "Family Plus. Perfilada Cama Garaje - PAX4/5 G", "location": "Valencia" }, { "id": "AC-309", "plate": "1543NCT", "vin": "VF3YGBPA8R2Z14545", "brand": "Benimar", "model": "Tessoro 430", "vehicleClass": "Compact. Cama Francesa o Garaje. PAX 2/3 P", "location": "Valencia" }, { "id": "AC-310", "plate": "1488NCT", "vin": "WF0DXXTTRDRY86141", "brand": "Benimar", "model": "Tessoro 440", "vehicleClass": "Compact. Cama Garaje. PAX 2/4 G", "location": "Valencia" }, { "id": "AC-311", "plate": "1486NCT", "vin": "WF0DXXTTRDRT20332", "brand": "Benimar", "model": "Tessoro 463 UP", "vehicleClass": "Family Plus +. Camas Gemelas. PAX 4/5 G", "location": "Valencia" }, { "id": "AC-312", "plate": "8121NDR", "vin": "WF0DXXTTRDRY86126", "brand": "Benimar", "model": "Tessoro 440", "vehicleClass": "Compact. Cama Garaje. PAX 2/4 G", "location": "Valencia" }, { "id": "AC-314", "plate": "4233NHN", "vin": "WF0DXXTTRDSM55692", "brand": "Roller Team", "model": "Kronos 277M", "vehicleClass": "Family Standard. Capuchina Literas. PAX 4/7 L", "location": "Valencia" }, { "id": "AC-315", "plate": "4763NLH", "vin": "WF0DXXTTRDSK55599", "brand": "Roller Team", "model": "Kronos 279", "vehicleClass": "Family Plus. Capuchina Garaje. Pax 4/6 G", "location": "Valencia" }, { "id": "AC-316", "plate": "1679NLC", "vin": "WF0DXXTTRDRC30774", "brand": "Benimar", "model": "Tessoro 496", "vehicleClass": "Family Plus. Perrfilada Cama Central. PAX 4/5 G", "location": "Valencia" }, { "id": "AC-317", "plate": "1130NLP", "vin": "ZFA250001SMC06895", "brand": "Roller Team", "model": "Zefiro 287 I", "vehicleClass": "Elite Class. Integral. Pax 4/5 I", "location": "Valencia" }, { "id": "AC-318", "plate": "5665NNB", "vin": "WF0DXXTTRDSD73784", "brand": "Roller Team", "model": "Kronos 279", "vehicleClass": "Family Plus. Capuchina Garaje. Pax 4/6 G", "location": "Valencia" }, { "id": "AC-319", "plate": "5615NNB", "vin": "WF0DXXTTRDRS07019", "brand": "Benimar", "model": "Tessoro 430", "vehicleClass": "Compact. Cama Francesa o Garaje. PAX 2/3 P", "location": "Valencia" }, { "id": "AC-320", "plate": "5619NNB", "vin": "WF0DXXTTRDSM64626", "brand": "Benimar", "model": "Tessoro 430", "vehicleClass": "Compact. Cama Francesa o Garaje. PAX 2/3 P", "location": "Valencia" }, { "id": "AC-321", "plate": "5618NNB", "vin": "WF0DXXTTRDSG36941", "brand": "Benimar", "model": "Sport 340", "vehicleClass": "Family Standard. Capuchina  Literas - Pax 4/5 G", "location": "Valencia" }, { "id": "AC-322", "plate": "6162NNB", "vin": "VF7YLF6V9SMB43953", "brand": "Benimar", "model": "Benivan 120", "vehicleClass": "Camper Van. Literas dobles. PAX 2/4 C", "location": "Valencia" }, { "id": "AC-323", "plate": "6160NNB", "vin": "WF0DXXTTRDSR08362", "brand": "Benimar", "model": "Tessoro 488", "vehicleClass": "Compact Perfilada F2F. PAX 2/4 P", "location": "Valencia" }, { "id": "AC-324", "plate": "", "vin": "", "brand": "Benimar", "model": "Benivan 120", "vehicleClass": "Camper Van. Literas dobles. PAX 2/4 C", "location": "Valencia", "notes": 'Matr\xEDcula provisional en sistema: "xx". Actualizar cuando est\xE9 matriculado oficialmente.' }, { "id": "AC-325", "plate": "", "vin": "", "brand": "Roller Team", "model": "Kronos 284M", "vehicleClass": "Family Plus. Capuchina Camas Gemelas. Pax 4/5 G", "location": "Valencia", "notes": 'Matr\xEDcula provisional en sistema: "ZZ". Actualizar cuando est\xE9 matriculado oficialmente.' }, { "id": "AC-326", "plate": "", "vin": "", "brand": "Roller Team", "model": "Zefiro 287 I", "vehicleClass": "Elite Class. Integral. Pax 4/5 I", "location": "Valencia", "notes": 'Matr\xEDcula provisional en sistema: "xxxxxx3". Actualizar cuando est\xE9 matriculado oficialmente.' }, { "id": "CB-001", "plate": "7398 NLH", "vin": "VF7YLF6V5SMC17837", "brand": "Mc Louis", "model": "Menfys 3 Maxi SLine", "vehicleClass": "Camper Van. Literas dobles. PAX 2/4 C", "location": "Alicante" }, { "id": "CB-002", "plate": "7494 NLH", "vin": "WF0DXXTTRDSD73769", "brand": "Mc Louis", "model": "MC4 Slim 331", "vehicleClass": "Compact. Cama Francesa o Garaje. PAX 2/3 P", "location": "Alicante" }, { "id": "CB-003", "plate": "4014 NLF", "vin": "WF0DXXTTRDSE00111", "brand": "Mc Louis", "model": "MC4 381", "vehicleClass": "Family Plus. Perrfilada Cama Central. PAX 4/5 G", "location": "Alicante" }, { "id": "CB-005", "plate": "5763NLR", "vin": "", "brand": "Mc Louis", "model": "MC4 373", "vehicleClass": "Family Plus +. Camas Gemelas. PAX 4/5 G", "location": "Alicante" }, { "id": "CB-006", "plate": "4012 NLF", "vin": "WF0DXXTTRDSE00134", "brand": "Mc Louis", "model": "Glamys 320", "vehicleClass": "Family Plus. Capuchina Garaje. Pax 4/6 G", "location": "Alicante" }, { "id": "CB-007", "plate": "", "vin": "", "brand": "Mc Louis", "model": "Nevis 873", "vehicleClass": "Elite Class. Integral. Pax 4/5 I", "location": "Alicante", "notes": 'Matr\xEDcula provisional en sistema: "bbbb". Actualizar cuando est\xE9 matriculado oficialmente.' }];
  const DAMAGE_STATES = {
    DETECTADO: { label: "Detectado", color: "#B45309", bg: "#FEF1E1", accent: "#F59E0B" },
    VALORADO: { label: "Valorado", color: "#2B44C7", bg: "#E9EEFC", accent: "#4F6BF6" },
    EN_REPARACION: { label: "En reparaci\xF3n", color: "#6D28D9", bg: "#F2E9FB", accent: "#9061F9" },
    REPARADO: { label: "Reparado", color: "#1F4D2E", bg: "#D7EFDA", accent: "#3B8B4E" },
    ASUMIDO: { label: "Asumido", color: "#556274", bg: "#EDEFF3", accent: "#5B6B82" }
  };
  const CARGO_STATES = {
    NUEVO: { label: "Nuevo \xB7 decidir", color: "#B45309", bg: "#FEF1E1", accent: "#F59E0B" },
    ASUMIDO: { label: "Asumido", color: "#556274", bg: "#EDEFF3", accent: "#5B6B82" },
    CUANTIFICADO: { label: "Cuantificado", color: "#2B44C7", bg: "#E9EEFC", accent: "#4F6BF6" },
    HISTORICO: { label: "Hist\xF3rico", color: "#556274", bg: "#EDEFF3", accent: "#94A3B8" }
  };
  const REPAIR_STATES = {
    DETECTADO: { label: "Detectado", color: "#B45309", bg: "#FEF1E1", accent: "#F59E0B" },
    EN_REPARACION: { label: "En reparaci\xF3n", color: "#6D28D9", bg: "#F2E9FB", accent: "#9061F9" },
    REPARADO: { label: "Reparado", color: "#1F4D2E", bg: "#D7EFDA", accent: "#3B8B4E" }
  };
  const damageCargo = (d) => {
    if (d.cargo) return d.cargo;
    if (d.state === "ASUMIDO") return "ASUMIDO";
    if (d.state === "VALORADO") return "CUANTIFICADO";
    if (d.needsQuantification === true) return "NUEVO";
    return "HISTORICO";
  };
  const damageRepair = (d) => {
    if (d.repair) return d.repair;
    if (d.state === "REPARADO") return "REPARADO";
    if (d.state === "EN_REPARACION") return "EN_REPARACION";
    return "DETECTADO";
  };
  const WORKFLOW_STATES = {
    EN_USO: { label: "En uso", short: "En uso", bg: "#EEF2F8", color: "#556274", accent: "#5B6B82", order: 5 },
    DEVUELTO: { label: "Devuelto \xB7 pendiente revisar", short: "Devuelto", bg: "#E9EEFC", color: "#2A44D6", accent: "#3B5BFF", order: 1 },
    REVISADO: { label: "Revisado", short: "Revisado", bg: "#FEF1E1", color: "#B45309", accent: "#B45309", order: 2 },
    EN_REPARACION: { label: "En reparaci\xF3n", short: "Reparando", bg: "#F2E9FB", color: "#6D28D9", accent: "#9061F9", order: 3 },
    LISTO: { label: "Listo", short: "Listo", bg: "#D7EFDA", color: "#1F5E2A", accent: "#2A7A38", order: 4 }
  };
  const VEHICLE_STATUS_LABELS = {
    EN_USO: "En uso",
    DEVUELTO: "Devuelto",
    REVISADO: "Revisado",
    EN_REPARACION: "En reparaci\xF3n",
    LISTO: "Listo",
    // Legacy values that may still exist in old data
    SIN_REVISAR: "Sin revisar",
    PENDIENTE_VALORAR: "Pendiente valorar",
    PENDIENTE_ROSANA: "Esperando Rosana"
  };
  const GRAVEDAD_THEME = {
    GRAVE: { label: "GRAVE", bg: "#E9EEFC", color: "#DC2626", accent: "#3B5BFF", short: "G" },
    MODERADO: { label: "MODERADO", bg: "#EEF2F8", color: "#B45309", accent: "#B45309", short: "M" },
    LEVE: { label: "LEVE", bg: "#EAEFF6", color: "#556274", accent: "#5B6B82", short: "L" }
  };
  const PDF_GRAVEDAD_CODES = { G1: "LEVE", G2: "MODERADO", G3: "GRAVE" };
  const PDF_TIPO_DANO_CODES = {
    GOL: "Golpe / Abolladura",
    ROT: "Rotura",
    RAY: "Rayadura",
    FAL: "Faltante",
    RAS: "Rasgu\xF1o",
    DEF: "Defecto",
    MAN: "Mancha"
  };
  const PDF_REPARACION_CODES = { T1: "in-situ", T2: "propio", T3: "externo" };
  const PDF_PIEZAS_CODES = { P0: false, P1: true };
  const GRAVEDAD_ORDER = { GRAVE: 1, MODERADO: 2, LEVE: 3 };
  const LOCATION_THEME = {
    Valencia: { bg: "#F2E9FB", color: "#6D28D9", accent: "#9061F9" },
    Onil: { bg: "#E0EDDF", color: "#2A5F2E", accent: "#3B8B4E" },
    "Castell\xF3n": { bg: "#EEF2F8", color: "#B45309", accent: "#B45309" },
    Alicante: { bg: "#E9EEFC", color: "#2B44C7", accent: "#4F6BF6" }
  };
  const DEFAULT_STATE = {
    version: APP_VERSION,
    vehicles: [],
    damages: [],
    presupuestos: [],
    // quantification budgets, one per vehicle return with damages
    partsCatalog: [],
    // reusable parts: { id, name, provider, pvr, defaultHours }
    partsToOrder: [],
    // parts to order: { id, vehicleId, ac, modelo, zona, tipoDano, elementCode, pdfCode, piezas: [{ codigo, descripcion, notas, cantidad, estado, proveedor, pvr, horas }], createdAt, sourceOT, sourceDamageId }
    partsMemory: {},
    // learned part codes: { "ac:AC-303|zona:claraboya": {codigo, descripcion}, "modelo:tessoro 463|zona:claraboya|season:legacy": {codigo, descripcion} }
    // La clave de modelo incluye "season" (2026 para AC-315 y superiores, legacy para AC-314 y anteriores) para no cruzar piezas entre temporadas.
    meta: {
      lastBackupAt: null,
      lastModifiedAt: null,
      backupDismissedFor: null,
      seededAt: null
    }
  };
  const IVA_RATE = 0.21;
  const MO_RATE_BASE = 50;
  const MO_RATE_RENTAL = 25;
  const ADMIN_HOURS = 0.5;
  const ADMIN_FEE = +(ADMIN_HOURS * MO_RATE_RENTAL * (1 + IVA_RATE)).toFixed(2);
  const PART_PROVIDERS = ["Benimar", "Roller Team", "Romisa", "Otro"];
  const computeLineTotal = ({ pvr, tipo, hours }) => {
    const pvrNum = parseFloat(pvr) || 0;
    const hoursNum = parseFloat(hours) || 0;
    const pvrCharged = tipo === "PARCIAL" ? pvrNum * 0.5 : pvrNum;
    const moBase = hoursNum * MO_RATE_BASE;
    const moBonified = hoursNum * MO_RATE_RENTAL;
    const base = pvrCharged + moBonified;
    const iva = base * IVA_RATE;
    const total = base + iva;
    return {
      pvrCharged: +pvrCharged.toFixed(2),
      moBase: +moBase.toFixed(2),
      moBonified: +moBonified.toFixed(2),
      base: +base.toFixed(2),
      iva: +iva.toFixed(2),
      total: +total.toFixed(2)
    };
  };
  const computePresupuestoTotal = (lines) => {
    const piezasTotal = lines.reduce((acc, l) => acc + (l.total || 0), 0);
    return {
      piezasTotal: +piezasTotal.toFixed(2),
      adminFee: ADMIN_FEE,
      total: +(piezasTotal + ADMIN_FEE).toFixed(2)
    };
  };
  const buildPresupuestoId = (vehicleId, dateIso, seqNum) => {
    const d = new Date(dateIso);
    const ymd = `${d.getFullYear()}${padNum(d.getMonth() + 1, 2)}${padNum(d.getDate(), 2)}`;
    const acNum = (vehicleId || "").replace(/[^0-9]/g, "") || "XX";
    return `PR-${ymd}-${acNum}-${padNum(seqNum, 2)}`;
  };
  // Paleta CLARA — papel cálido, tinta profunda, acento rust (la de siempre).
  const T_LIGHT = {
    bg: "#F5F7FB",
    bgAlt: "#EAEFF6",
    surface: "#FFFFFF",
    ink: "#0F1B2E",
    inkSoft: "#5B6B82",
    inkFaint: "#8B98AB",
    rust: "#3B5BFF",
    rustDark: "#2A44D6",
    rustGlow: "#6E86F8",
    border: "#E4E9F1",
    borderHi: "#CBD5E6",
    warn: "#B45309",
    danger: "#DC2626",
    ok: "#2A5F2E"
  };
  // Paleta OSCURA — carbón cálido, mismos roles, acento rust más brillante para
  // que resalte sobre fondo oscuro. Solo afecta la pantalla, no lo que se imprime.
  const T_DARK = {
    bg: "#0E1420",
    bgAlt: "#141C2B",
    surface: "#18202F",
    ink: "#E7ECF4",
    inkSoft: "#93A2B8",
    inkFaint: "#64748B",
    rust: "#5C86FF",
    rustDark: "#3B5BFF",
    rustGlow: "#8DA9FF",
    border: "#28344A",
    borderHi: "#3A4A63",
    warn: "#F5B455",
    danger: "#F87171",
    ok: "#4ADE80"
  };
  // T es mutable: el componente raíz lo apunta a la paleta elegida antes de
  // renderizar. Como TODO lee T.x en cada render y no hay componentes memoizados,
  // el cambio se propaga a toda la app sin perder estado (pestaña, scroll, modales).
  let T = T_LIGHT;
  const applyTheme = (mode) => { T = mode === "dark" ? T_DARK : T_LIGHT; };
  const F = {
    display: "'Manrope', system-ui, sans-serif",
    // serif display, distinctive
    body: "'Manrope', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace"
  };
  const nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
  const todayKey = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const formatDate = (iso) => {
    if (!iso) return "\u2014";
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "\u2014";
      return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return "\u2014";
    }
  };
  const formatDateTime = (iso) => {
    if (!iso) return "nunca";
    try {
      return new Date(iso).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "\u2014";
    }
  };
  const daysBetween = (from, to) => {
    if (!from || !to) return null;
    return Math.round((new Date(to) - new Date(from)) / 864e5);
  };
  const hoursSince = (iso) => {
    if (!iso) return null;
    return Math.round((Date.now() - new Date(iso).getTime()) / 36e5);
  };
  // ===== Criterio de revisión (aditivo, solo lectura) =====
  // Próxima salida REAL: la reserva futura más temprana en v.reservas (reservas no
  // completadas del 704). El campo manual nextRentalDate casi nunca está cargado → fallback.
  const reviewNextDeparture = (v) => {
    const today2 = todayKey();
    let best = null;
    for (const r of ((v && v.reservas) || [])) {
      const s = r && r.salida ? String(r.salida) : "";
      if (s && s.slice(0, 10) >= today2) { if (!best || s < best) best = s; }
    }
    return best || (v && v.nextRentalDate) || null;
  };
  // Reserva que acaba de terminar: reservaHistory[0] (ordenado por devolución desc).
  // Fallback: reserva de v.reservas con devolución ya pasada más reciente.
  const reviewEndedReserva = (v) => {
    const hist = ((v && v.reservaHistory) || []).filter((r) => r && r.salida && r.devolucion);
    if (hist.length) return hist[0];
    const today2 = todayKey();
    let best = null;
    for (const r of ((v && v.reservas) || [])) {
      const dev = r && r.devolucion ? String(r.devolucion).slice(0, 10) : "";
      if (r && r.salida && dev && dev <= today2) { if (!best || r.devolucion > best.devolucion) best = r; }
    }
    return best;
  };
  // Días de viaje del alquiler que terminó (salida -> devolución de esa reserva).
  const reviewTripDays = (v) => {
    const r = reviewEndedReserva(v);
    if (r && r.salida && r.devolucion) {
      const s = new Date(r.salida).getTime(), e = new Date(r.devolucion).getTime();
      if (isFinite(s) && isFinite(e) && e >= s) return Math.max(1, Math.round((e - s) / 864e5));
    }
    if (v && v.rentalStartDate && v.rentalEndDate) {
      const s = new Date(v.rentalStartDate).getTime(), e = new Date(v.rentalEndDate).getTime();
      if (isFinite(s) && isFinite(e) && e >= s) return Math.max(1, Math.round((e - s) / 864e5));
    }
    return null;
  };
  // Semáforo: alto = viaje 11+ días (pico de daño según el histórico) o AC reincidente; bajo = 1-2 días.
  const reviewRisk = (v, reincSet) => {
    const dias = reviewTripDays(v);
    const reinc = !!(reincSet && reincSet.has(v.id));
    let level = "medio";
    if ((dias != null && dias >= 11) || reinc) level = "alto";
    else if (dias != null && dias <= 2) level = "bajo";
    return { level, dias, reinc };
  };
  // Fecha en que volvió (para medir el tiempo esperando).
  const reviewReturnTs = (v) => {
    const raw = v && (v.returnedAt || v.lastReturnAt || v.rentalEndDate);
    const t = raw ? new Date(raw).getTime() : NaN;
    return isFinite(t) ? t : null;
  };
  // Días que lleva esperando revisión (desde que volvió). -1 si no se sabe → va al final.
  const reviewWaitDays = (v) => {
    const t = reviewReturnTs(v);
    return t == null ? -1 : Math.max(0, Math.floor((Date.now() - t) / 864e5));
  };
  // ¿Su próxima salida es HOY?
  const reviewIsToday = (v) => {
    const d = reviewNextDeparture(v);
    return !!(d && String(d).slice(0, 10) === todayKey());
  };
  // Puntaje de riesgo para desempatar: días de viaje + cantidad de daños del histórico.
  const reviewRiskScore = (v, countMap) => {
    const dias = reviewTripDays(v) || 0;
    const cnt = (countMap && countMap[v.id]) || 0;
    return dias + cnt * 3;
  };
  // ===== SLA DE REVISIÓN: 48 HORAS LABORALES =====
  // Regla AC-LLAR: desde que el vehículo se marca DEVUELTO tengo 48 h laborales
  // para revisarlo. "Laborales" = tiempo de reloj corrido (las noches de lunes a
  // viernes SÍ cuentan) pero EXCLUYENDO sábados y domingos por completo.
  // El inicio se ancla al horario de trabajo (L-V 08:00–17:00): si marqué el
  // vehículo fuera de ese horario, el reloj arranca a las 08:00 del próximo día
  // laboral (concepto: "desde que lo tuve disponible para revisarlo").
  const SLA_HORARIO_INICIO = 8;   // 08:00
  const SLA_HORARIO_FIN = 17;     // 17:00
  const SLA_HORAS = 48;           // presupuesto de horas laborales
  const SLA_UMBRAL_VERDE = 24;    // ≤24 h → verde
  const SLA_UMBRAL_AMARILLO = 36; // 24–36 h → amarillo; 36–48 h → rojo; >48 → vencido
  const slaEsFinde = (d) => { const g = d.getDay(); return g === 0 || g === 6; };
  // Ancla el inicio al próximo momento laboral (avanza si cae en finde o fuera de hora).
  const slaClampInicio = (ms) => {
    const d = new Date(ms);
    for (let i = 0; i < 400; i++) {
      if (slaEsFinde(d)) { d.setHours(SLA_HORARIO_INICIO, 0, 0, 0); d.setDate(d.getDate() + 1); continue; }
      const h = d.getHours() + d.getMinutes() / 60;
      if (h < SLA_HORARIO_INICIO) { d.setHours(SLA_HORARIO_INICIO, 0, 0, 0); return d.getTime(); }
      if (h >= SLA_HORARIO_FIN) { d.setDate(d.getDate() + 1); d.setHours(SLA_HORARIO_INICIO, 0, 0, 0); continue; }
      return d.getTime();
    }
    return d.getTime();
  };
  // Milisegundos laborales transcurridos entre a y b (b>a), descontando findes.
  const slaMsLaborales = (aMs, bMs) => {
    if (!(bMs > aMs)) return 0;
    let total = 0, t = aMs;
    for (let i = 0; i < 2000 && t < bMs; i++) {
      const d = new Date(t);
      const finDia = new Date(t); finDia.setHours(24, 0, 0, 0);
      const seg = Math.min(bMs, finDia.getTime());
      if (!slaEsFinde(d)) total += seg - t;
      t = seg;
    }
    return total;
  };
  // Fecha límite: inicio + 48 h laborales, saltando findes.
  const slaFechaLimite = (inicioMs) => {
    let restante = SLA_HORAS * 36e5, t = inicioMs;
    for (let i = 0; i < 4000 && restante > 0; i++) {
      const d = new Date(t);
      const finDia = new Date(t); finDia.setHours(24, 0, 0, 0);
      if (slaEsFinde(d)) { t = finDia.getTime(); continue; }
      const cap = finDia.getTime() - t;
      const chunk = Math.min(restante, cap);
      t += chunk; restante -= chunk;
    }
    return t;
  };
  // Devuelve el estado del SLA de revisión para un vehículo devuelto.
  const reviewSla = (v, ahoraMs) => {
    const t0raw = reviewReturnTs(v);
    if (t0raw == null) return null;
    const now = ahoraMs || Date.now();
    const inicio = slaClampInicio(t0raw);
    const transcurridasH = slaMsLaborales(inicio, now) / 36e5;
    const restantesH = SLA_HORAS - transcurridasH;
    const limite = slaFechaLimite(inicio);
    let nivel;
    if (transcurridasH <= SLA_UMBRAL_VERDE) nivel = "verde";
    else if (transcurridasH <= SLA_UMBRAL_AMARILLO) nivel = "amarillo";
    else if (transcurridasH <= SLA_HORAS) nivel = "rojo";
    else nivel = "vencido";
    return { inicio, transcurridasH, restantesH, limite, nivel };
  };
  // Colores del semáforo de SLA.
  const SLA_COLORES = {
    verde:    { fg: "#15803D", bg: "#E7F4EC", borde: "#22A45D" },
    amarillo: { fg: "#B45309", bg: "#FBF1DA", borde: "#E0A526" },
    rojo:     { fg: "#B42318", bg: "#FBE3DF", borde: "#E4574C" },
    vencido:  { fg: "#7A1209", bg: "#F7D2CC", borde: "#B42318" }
  };
  // "12h 30m" / "3h" / "45m" a partir de horas decimales.
  const slaFmtDuracion = (horas) => {
    const totalMin = Math.max(0, Math.round(horas * 60));
    const h = Math.floor(totalMin / 60), m = totalMin % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };
  // "mié 10:00" para la fecha límite.
  const slaFmtLimite = (ms) => new Date(ms).toLocaleString("es-ES", { weekday: "short", hour: "2-digit", minute: "2-digit" }).replace(",", "");
  // ===== FIN SLA =====
 const lastCompletedTitular = (vehicle) => {
  const hist = (vehicle?.reservaHistory || []).filter((r) => r.cliente);

  if (hist.length === 0) return null;

  const now = Date.now();

  // SOLO reservas cuya fecha de devolución YA HA PASADO.
  // Una reserva en curso o futura jamás puede ser utilizada como titular.
  const completadas = hist.filter((r) => {
    if (!r.devolucion) return false;

    const devTime = new Date(r.devolucion).getTime();

    return Number.isFinite(devTime) && devTime <= now;
  });

  if (completadas.length === 0) return null;

  // La reserva completada más reciente.
  return completadas.sort((a, b) => {
    const da = new Date(a.devolucion).getTime();
    const db = new Date(b.devolucion).getTime();
    return db - da;
  })[0];
};
  const padNum = (n, w = 3) => String(n).padStart(w, "0");
  const escapeHtml = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
 const isReservationFile = (name) => {
  if (!/\.(xlsx|xls|csv|txt)$/i.test(name)) return false;

  const lower = String(name || "").toLowerCase();

  return (
    lower === "carrental.reservations202608200704.xlsx" ||
    lower === "carrental.reservations202608200720.xlsx"
  );
};

const reservationFileVersion = async (fileHandle) => {
  const file = await fileHandle.getFile();

  return `${file.name}|${file.size}|${file.lastModified}`;
};

const parseHqDateStr = (s) => {
    if (!s) return null;
    const m = String(s).trim().match(/(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
    if (!m) {
      const d2 = new Date(s);
      return isNaN(d2.getTime()) ? null : d2.toISOString();
    }
    const [, dd, mm, yyyy, hh = "0", mi = "0"] = m;
    const d = new Date(+yyyy, +mm - 1, +dd, +hh, +mi);
    return isNaN(d.getTime()) ? null : d.toISOString();
  };
  const parseReservationText = (text) => {
    const records = [];
    for (const raw of String(text || "").split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || /^#\s/.test(line)) continue;
      const parts = line.split("|").map((p) => p.trim());
      if (parts.length < 4) continue;
      let reservaId = "";
      let cols = parts;
      const firstIsId = parts.length >= 7 || /^#?\d+$/.test(parts[0]);
      if (firstIsId) {
        reservaId = parts[0].replace(/^#/, "").trim();
        cols = parts.slice(1);
      }
      const [estatus, vehiculo, salida, devolucion, cliente = "", sede = ""] = cols;
      records.push({
        reservaId,
        estatus,
        vehiculo,
        salida: parseHqDateStr(salida),
        devolucion: parseHqDateStr(devolucion),
        cliente,
        sede
      });
    }
    return records;
  };
  const groupReservationsByVehicle = (records, vehicles) => {
    const VALID = ["Reserva confirmada", "En Alquiler", "Reserva Completada"];
    const parseAc = (s) => {
      const m = String(s || "").trim().match(/^(AC-\d+[A-Z]?|CB-\d+)/);
      return m ? m[1] : null;
    };
    const acK = (s) => {
      const m = String(s || "").trim().match(/^(AC|CB)-(\d+)/i);
      return m ? `${m[1].toUpperCase()}-${m[2]}` : null;
    };
    const plateOf = (s) => {
      const m = String(s || "").toUpperCase().match(/\b(\d{4}[A-Z]{3})\b/);
      return m ? m[1] : null;
    };
    const byVehicle = {};
    let valid = 0, ignored = 0;
    for (const rec of records) {
      if (!VALID.includes(rec.estatus)) {
        ignored++;
        continue;
      }
      const ac = parseAc(rec.vehiculo);
      if (!ac) {
        ignored++;
        continue;
      }
      const key = acK(rec.vehiculo);
      const plate = plateOf(rec.vehiculo);
      const matched = (vehicles || []).find((v) => acK(v.id) === key || plate && (v.plate || "").toUpperCase() === plate);
      const groupKey = matched ? matched.id : ac;
      (byVehicle[groupKey] = byVehicle[groupKey] || []).push({
        salida: rec.salida,
        devolucion: rec.devolucion,
        estatus: rec.estatus,
        cliente: rec.cliente,
        sede: rec.sede,
        reservaId: rec.reservaId || ""
      });
      valid++;
    }
    return { byVehicle, valid, ignored };
  };
  const sortReservas = (reservas) => (reservas || []).slice().sort((a, b) => String(a.salida || "").localeCompare(String(b.salida || "")));
  const activeReserva = (vehicle) => {
    const today2 = todayKey();
    const sorted = sortReservas(vehicle.reservas);
    for (const r of sorted) {
      const dev = (r.devolucion || "").slice(0, 10);
      if (!dev || dev >= today2) return r;
    }
    return null;
  };
 const reservaPhase = (vehicle) => {

  // ============================================================
  // REGLA FUNDAMENTAL:
  // HQ puede informar que una reserva terminó, pero eso NO
  // confirma que el vehículo haya vuelto físicamente.
  //
  // El único evento que confirma la devolución es:
  // "Confirmar llegada física" / VOLVIÓ.
  // ============================================================

  // Mientras siga EN_USO, permanece EN_USO.
  if (vehicle.workflowStatus === "EN_USO" && !vehicle.arrivalConfirmed) {
    return "EN_USO";
  }

  // Si la llegada fue confirmada manualmente, queda pendiente de revisión.
  if (vehicle.arrivalConfirmed) {
    return "POR_REVISAR";
  }

  // Un vehículo que ya está guardado como DEVUELTO permanece en DEVUELTO.
  if (vehicle.workflowStatus === "DEVUELTO") {
    return "POR_REVISAR";
  }

  return null;
};
  const computeVehicleStatus = (vehicle, damages) => {
    const vd = damages.filter((d) => d.vehicleId === vehicle.id);
    const active = vd.filter((d) => d.state !== "REPARADO" && d.state !== "ASUMIDO");
    if (vehicle.workflowStatus) {
      if (vehicle.workflowStatus === "EN_USO" && vehicle.arrivalConfirmed) return "DEVUELTO";
           if (vehicle.workflowStatus === "EN_REPARACION" && active.length === 0 && vd.length > 0) {
        return "LISTO";
      }
      if (vehicle.workflowStatus === "REVISADO" && vd.some((d) => d.state === "EN_REPARACION")) {
        return "EN_REPARACION";
      }
      return vehicle.workflowStatus;
    }
    if (!vehicle.lastInspectedAt) return "DEVUELTO";
    if (active.length === 0 && vd.length > 0) return "LISTO";
    if (vd.some((d) => d.state === "EN_REPARACION")) return "EN_REPARACION";
    if (active.length > 0) return "REVISADO";
    return "LISTO";
  };
  const isPendingArrivalConfirmation = (vehicle) => {
    return vehicle.workflowStatus === "EN_USO" && vehicle.rentalEndDate && vehicle.rentalEndDate.slice(0, 10) <= todayKey();
  };
  const isForcedReady = (vehicle, damages) => {
    if (computeVehicleStatus(vehicle, damages) !== "LISTO") return false;
    const activeCount = damages.filter(
      (d) => d.vehicleId === vehicle.id && d.state !== "REPARADO" && d.state !== "ASUMIDO"
    ).length;
    return activeCount > 0;
  };
  const countByGravedad = (damages, vehicleId) => {
    const counts = { GRAVE: 0, MODERADO: 0, LEVE: 0 };
    damages.filter((d) => d.vehicleId === vehicleId && d.state !== "REPARADO" && d.state !== "ASUMIDO").forEach((d) => {
      const g = d.gravedad || "LEVE";
      if (counts[g] !== void 0) counts[g]++;
    });
    return counts;
  };
  const buildDamageDescription = (zona, tipoDano) => {
    if (!zona && !tipoDano) return "";
    if (zona && tipoDano) return `${zona} \u2014 ${tipoDano}`;
    return zona || tipoDano || "";
  };
  const damageElementKey = (d) => {
    if (d.elementCode) return d.elementCode.toUpperCase();
    if (d.pdfCode) {
      const m = d.pdfCode.match(/^([EI](?:-[A-ZÑÁÉÍÓÚÜ0-9]+)+)/);
      if (m) return m[1].toUpperCase();
    }
    if (d.zona) return "Z:" + d.zona.toUpperCase().replace(/\s+/g, "");
    return null;
  };
  const damageTipoKey = (d) => {
    if (d.tipoCode) return d.tipoCode.toUpperCase();
    if (d.tipoDano) return d.tipoDano.toUpperCase().slice(0, 3);
    return null;
  };
  const damageIdentityKey = (d) => {
    const el = damageElementKey(d);
    const tipo = damageTipoKey(d);
    if (!el) return null;
    return el + "|" + (tipo || "?");
  };
  const damageSimilarity = (incoming, existing) => {
    let score = 0;
    const ieEl = damageElementKey(incoming);
    const exEl = damageElementKey(existing);
    if (ieEl && exEl && ieEl === exEl) score += 60;
    else return 0;
    const ieTipo = damageTipoKey(incoming);
    const exTipo = damageTipoKey(existing);
    if (ieTipo && exTipo && ieTipo === exTipo) score += 25;
    if (incoming.gravedad && existing.gravedad && incoming.gravedad === existing.gravedad) {
      score += 10;
    }
    if (existing.persistente) score += 5;
    return Math.min(100, score);
  };
  const reconcileOT = (parsedDamages, existingDamages, vehicleId) => {
    const vehicleDamages = existingDamages.filter((d) => d.vehicleId === vehicleId);
    const isRepaired = (d) => d.repair ? d.repair === "REPARADO" : d.state === "REPARADO";
    const active = vehicleDamages.filter((d) => !isRepaired(d));
    const repaired = vehicleDamages.filter((d) => isRepaired(d));
    const matchedExistingIds = /* @__PURE__ */ new Set();
    const classified = parsedDamages.map((d, idx) => {
      const inKey = damageIdentityKey(d);
      const exactActive = inKey ? active.find((ex) => !matchedExistingIds.has(ex.id) && damageIdentityKey(ex) === inKey) : null;
      if (exactActive) {
        matchedExistingIds.add(exactActive.id);
        return { ...d, _idx: idx, _category: "exact", _matchId: exactActive.id, _matchDamage: exactActive, _selected: false };
      }
      const exactRepaired = inKey ? repaired.find((ex) => damageIdentityKey(ex) === inKey) : null;
      let bestSimilar = null, bestScore = 0;
      for (const ex of active) {
        if (matchedExistingIds.has(ex.id)) continue;
        const s = damageSimilarity(d, ex);
        if (s >= 60 && s > bestScore) {
          bestScore = s;
          bestSimilar = ex;
        }
      }
      if (bestSimilar) {
        matchedExistingIds.add(bestSimilar.id);
        return {
          ...d,
          _idx: idx,
          _category: "similar",
          _matchId: bestSimilar.id,
          _matchDamage: bestSimilar,
          _score: bestScore,
          _decision: "same",
          _selected: false
        };
      }
      if (exactRepaired) {
        return {
          ...d,
          _idx: idx,
          _category: "reappeared",
          _matchId: exactRepaired.id,
          _matchDamage: exactRepaired,
          _decision: "new",
          _selected: true
        };
      }
      return { ...d, _idx: idx, _category: "new", _selected: true };
    });
    const missing = active.filter((ex) => !matchedExistingIds.has(ex.id));
    return { classified, missing };
  };
  const statusTheme = (status) => {
    const s = WORKFLOW_STATES[status];
    if (s) return { bg: s.bg, color: s.color, accent: s.accent };
    switch (status) {
      case "SIN_REVISAR":
        return { bg: "#E9EEFC", color: "#2A44D6", accent: "#3B5BFF" };
      case "PENDIENTE_VALORAR":
        return { bg: "#FEF1E1", color: "#B45309", accent: "#B45309" };
      case "PENDIENTE_ROSANA":
        return { bg: "#E9EEFC", color: "#2B44C7", accent: "#4F6BF6" };
      default:
        return { bg: T.bgAlt, color: T.inkSoft, accent: T.inkSoft };
    }
  };
  const PDFJS_VERSION = "3.11.174";
  const PDFJS_SCRIPT = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
  const PDFJS_WORKER = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;
  let _pdfjsPromise = null;
  const loadPdfJs = () => {
    if (typeof window === "undefined") return Promise.reject(new Error("No window"));
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (_pdfjsPromise) return _pdfjsPromise;
    _pdfjsPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${PDFJS_SCRIPT}"]`);
      const onReady = () => {
        if (!window.pdfjsLib) return reject(new Error("PDF.js no carg\xF3"));
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        resolve(window.pdfjsLib);
      };
      if (existing) {
        if (window.pdfjsLib) onReady();
        else existing.addEventListener("load", onReady);
        return;
      }
      const script = document.createElement("script");
      script.src = PDFJS_SCRIPT;
      script.onload = onReady;
      script.onerror = () => reject(new Error("No se pudo descargar PDF.js"));
      document.head.appendChild(script);
    });
    return _pdfjsPromise;
  };
  const extractPdfItems = async (file) => {
    const lib = await loadPdfJs();
    const buf = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: buf }).promise;
    const items = [];
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1 });
      for (const it of content.items) {
        const txt = it.str || "";
        if (!txt) continue;
        items.push({
          text: txt,
          x: it.transform[4],
          y: viewport.height - it.transform[5],
          // flip so top = 0
          width: it.width || 0,
          page: p
        });
      }
    }
    return items;
  };
  const collapseLetterSpacing = (s) => {
    if (!s || s.length < 6) return s;
    const tokens = s.split(/\s+/).filter(Boolean);
    if (tokens.length < 4) return s;
    const singles = tokens.filter((t) => t.length === 1).length;
    if (singles / tokens.length >= 0.5) {
      return s.replace(/\s+/g, "").trim();
    }
    return s;
  };
  const mergeAdjacentItems = (items) => {
    const sorted = [...items].sort((a, b) => a.page - b.page || a.y - b.y || a.x - b.x);
    const merged = [];
    for (const it of sorted) {
      const last = merged[merged.length - 1];
      if (last && last.page === it.page && Math.abs(last.y - it.y) < 2.5) {
        const lastEnd = last.x + (last.width || 0);
        const gap = it.x - lastEnd;
        if (gap >= -0.5 && gap < 2.5) {
          last.text += it.text;
          last.width = it.x + (it.width || 0) - last.x;
          continue;
        }
      }
      merged.push({ ...it });
    }
    for (const m of merged) m.normalized = collapseLetterSpacing(m.text.trim());
    return merged;
  };
  const findLabel = (merged, target) => {
    const tNorm = target.toUpperCase().replace(/\s+/g, "");
    return merged.find((m) => {
      const n = (m.normalized || m.text).toUpperCase().replace(/\s+/g, "");
      return n === tNorm;
    });
  };
  const findLabelContains = (merged, regex) => {
    return merged.find((m) => regex.test(m.normalized || m.text));
  };
  const findFieldValue = (merged, target, opts = {}) => {
    const { yMax = 28, xTolerance = 60 } = opts;
    const label = typeof target === "string" ? findLabel(merged, target) : findLabelContains(merged, target);
    if (!label) return null;
    const candidates = merged.filter(
      (m) => m !== label && m.page === label.page && m.y > label.y && m.y < label.y + yMax && m.x >= label.x - xTolerance / 6 && m.x < label.x + xTolerance
    ).sort((a, b) => a.y - b.y || a.x - b.x);
    if (!candidates.length) return null;
    const closeY = candidates[0].y;
    return candidates.filter((c) => c.y < closeY + 4).map((c) => (c.text || "").trim()).filter(Boolean).join(" ").replace(/\s+/g, " ").trim() || null;
  };
  const parsePdfCode = (raw) => {
    if (!raw) return null;
    const clean = raw.replace(/\s+/g, " ").trim();
    const m = clean.match(/([EI](?:-[A-ZÑÁÉÍÓÚÜ0-9]+)+)\s*·\s*([A-ZÑ]{3})\s*·\s*(G[123])\s*·\s*(T[123])\s*·\s*(P[01])/);
    if (!m) return null;
    const [, elementCode, tipoCode, gCode, tCode, pCode] = m;
    return {
      full: `${elementCode} \xB7 ${tipoCode} \xB7 ${gCode} \xB7 ${tCode} \xB7 ${pCode}`,
      elementCode,
      tipoCode,
      gravedad: PDF_GRAVEDAD_CODES[gCode] || "LEVE",
      tipoDano: PDF_TIPO_DANO_CODES[tipoCode] || tipoCode,
      tipoReparacion: PDF_REPARACION_CODES[tCode] || "propio",
      requierePiezas: !!PDF_PIEZAS_CODES[pCode]
    };
  };
  const piezasFromCode = (raw) => { const m = (raw || "").match(/P([01])\s*$/); return m ? m[1] === "1" : null; };
  const mapGravedadText = (txt) => {
    if (!txt) return null;
    const u = txt.toUpperCase();
    if (u.includes("GRAVE")) return "GRAVE";
    if (u.includes("MODERADO")) return "MODERADO";
    if (u.includes("LEVE")) return "LEVE";
    return null;
  };
  const mapReparacionText = (txt) => {
    if (!txt) return null;
    const l = txt.toLowerCase();
    if (l.includes("externo")) return "externo";
    if (l.includes("in-situ") || l.includes("in situ")) return "in-situ";
    if (l.includes("propio")) return "propio";
    return null;
  };
  const extractDamageRows = (items, merged) => {
    const repHeader = merged.find((m) => /REPARACIONES.*REGISTRADAS/i.test(m.normalized || m.text));
    let expectedCount = null;
    if (repHeader) {
      const norm = repHeader.normalized || repHeader.text;
      const m = norm.match(/(\d+)\s*REGISTRADAS/i);
      if (m) expectedCount = parseInt(m[1], 10);
    }
    if (expectedCount === 0) return [];
    const cols = {
      hash: findLabel(merged, "#"),
      zona: findLabel(merged, "ZONA / ELEMENTO"),
      tipo: findLabel(merged, "TIPO DE DA\xD1O") || findLabel(merged, "TIPO DE"),
      grav: findLabel(merged, "GRAVEDAD"),
      rep: findLabel(merged, "REPARACI\xD3N"),
      piezas: findLabel(merged, "PIEZAS"),
      codigo: findLabel(merged, "C\xD3DIGO")
    };
    if (!cols.codigo) return [];
    const xZona = cols.zona?.x ?? 80;
    const xTipo = cols.tipo?.x ?? 187;
    const xGrav = cols.grav?.x ?? 265;
    const xRep = cols.rep?.x ?? 336;
    const xPie = cols.piezas?.x ?? 404;
    const xCod = cols.codigo.x;
    const startY = repHeader ? repHeader.y + 4 : 0;
    const startPage = repHeader ? repHeader.page : 1;
    const STOP_RE = /^(FIRMAS|EQUIPAMIENTO|EQUIPAMIENTOFALTANTE|INSPECTOR|JEFEDETALLER|JEFE\s*DE\s*TALLER)$/i;
    const stopMarkers = merged.filter((m) => STOP_RE.test((m.normalized || m.text || "").trim()));
    const sortedRaw = [...items].sort((a, b) => a.page - b.page || a.y - b.y || a.x - b.x);
    const anchors = [];
    let expectedNum = 1;
    let anchorX = null;
    const xTol = 14;
    for (const it of sortedRaw) {
      if (it.page < startPage) continue;
      if (it.page === startPage && it.y <= startY) continue;
      if (it.text.trim() !== String(expectedNum)) continue;
      if (it.x >= xZona - 4) continue;
      if (anchorX === null) anchorX = it.x;
      else if (Math.abs(it.x - anchorX) > xTol) continue;
      anchors.push(it);
      expectedNum++;
      if (expectedCount !== null && anchors.length >= expectedCount) break;
    }
    if (anchors.length === 0) return [];
    const rows = [];
    for (let idx = 0; idx < anchors.length; idx++) {
      const a = anchors[idx];
      const prev = anchors[idx - 1];
      const next = anchors[idx + 1];
      let yTop;
      if (prev && prev.page === a.page) yTop = (prev.y + a.y) / 2;
      else yTop = a.y - 24;
      let yBot;
      if (next && next.page === a.page) {
        yBot = (a.y + next.y) / 2;
      } else {
        const stopOnPage = stopMarkers.filter((s) => s.page === a.page && s.y > a.y + 5).sort((x, y) => x.y - y.y)[0];
        yBot = stopOnPage ? stopOnPage.y - 4 : a.y + 80;
      }
      const rowItems = items.filter(
        (it) => it.page === a.page && it.y >= yTop && it.y < yBot
      );
      const collect = (x0, x1) => {
        const inCol = rowItems.filter((it) => it.x >= x0 - 4 && it.x < x1 - 4);
        const cellMerged = mergeAdjacentItems(inCol);
        return cellMerged.map((m) => (m.text || "").trim()).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
      };
      const zonaText = collect(xZona, xTipo);
      const tipoText = collect(xTipo, xGrav);
      const gravText = collect(xGrav, xRep);
      const repText = collect(xRep, xPie);
      const piezasText = collect(xPie, xCod);
      const codigoText = collect(xCod, 1e6);
      const parsed = parsePdfCode(codigoText);
      rows.push({
        number: idx + 1,
        zona: zonaText || null,
        tipoDano: parsed?.tipoDano || tipoText || null,
        gravedadText: gravText,
        gravedad: parsed?.gravedad || mapGravedadText(gravText),
        reparacionText: repText,
        tipoReparacion: parsed?.tipoReparacion || mapReparacionText(repText),
        piezasText,
        requierePiezas: parsed?.requierePiezas ?? piezasFromCode(codigoText) ?? /requiere/i.test(piezasText),
        pdfCode: parsed?.full || (codigoText || null),
        elementCode: parsed?.elementCode || null,
        tipoCode: parsed?.tipoCode || null,
        _y: a.y,
        _page: a.page
      });
    }
    return rows;
  };
  const parseOrdenTrabajo = async (file) => {
    const items = await extractPdfItems(file);
    const merged = mergeAdjacentItems(items);
    const allText = items.map((it) => it.str || "").join("");
const inicioMatch = allText.match(
  /(\d{1,2}\/\d{1,2}\/\d{2,4})\s*[·•]\s*(\d{1,2}:\d{2})/
);
const inicioOT = inicioMatch
  ? `${inicioMatch[1]} ${inicioMatch[2]}`
  : null;
    const readableChars = (allText.match(/[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]/g) || []).length;
    const ratio = allText.length > 0 ? readableChars / allText.length : 0;
    const looksUnreadable = allText.length > 50 && ratio < 0.5;
    const identificador = findFieldValue(merged, "IDENTIFICADOR");
    const matricula = findFieldValue(merged, /^MATR[IÍ]CULA$/i);
    const sede = findFieldValue(merged, "SEDE");
    const marcaModelo = findFieldValue(merged, /MARCA\s*\/\s*MODELO/i);
    const vin = findFieldValue(merged, /BASTIDOR/i);
    const otNota = findFieldValue(merged, /OBSERVACIONES|COMENTARIOS?|NOTAS?/i);
    let brand = null, model = null;
    if (marcaModelo) {
      const parts = marcaModelo.split(/\s+/);
      if (parts.length >= 2) {
        brand = parts[0];
        model = parts.slice(1).join(" ");
      } else {
        brand = marcaModelo;
      }
    }
    const damages = extractDamageRows(items, merged);
    return {
      fileName: file.name,
      fileSize: file.size,
      unreadable: looksUnreadable && !identificador,
     header: {
  identificador,
  matricula,
  sede,
  brand,
  model,
  marcaModelo,
  vin,
  inicioOT,
  otNota
},
      damages,
      raw: { itemCount: items.length, mergedCount: merged.length }
    };
  };
  const parseOrdenTrabajoHTML = async (file) => {
    const text = await file.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const fieldMap = {};
    const norm = (s) => (s || "").trim().toLowerCase().replace(/\s+/g, " ");
    doc.querySelectorAll(".field-label").forEach((labelEl) => {
      const label = norm(labelEl.textContent);
      let valueEl = labelEl.nextElementSibling;
      if (!valueEl || !/field-value/.test(valueEl.className || "")) {
        valueEl = labelEl.parentElement ? labelEl.parentElement.querySelector(".field-value") : null;
      }
      if (label && valueEl) fieldMap[label] = (valueEl.textContent || "").trim();
    });
    const fromMap = (...keys) => {
      for (const k of keys) {
        const hit = Object.keys(fieldMap).find((fk) => fk === norm(k) || fk.startsWith(norm(k)));
        if (hit && fieldMap[hit]) return fieldMap[hit];
      }
      return null;
    };
    const bodyText = doc.body ? doc.body.innerText || doc.body.textContent || "" : "";
    const grab = (labelRe) => {
      const lines = bodyText.split(/\n+/);
      for (const line of lines) {
        const m = line.match(new RegExp(labelRe.source + "\\s*[:\\-]\\s*([^\\n]+)", "i"));
        if (m && m[1] && m[1].trim()) return m[1].trim();
      }
      return null;
    };
    const findByLabel = (labels) => {
      const all = Array.from(doc.querySelectorAll("*"));
      for (const el of all) {
        if (el.children.length !== 0) continue;
        const t = (el.textContent || "").trim();
        for (const lab of labels) {
          const m = t.match(new RegExp("^" + lab + "\\s*[:\\-]\\s*(.+)$", "i"));
          if (m && m[1] && m[1].trim()) return m[1].trim();
        }
      }
      return null;
    };
    const identificador = fromMap("identificador") || findByLabel(["IDENTIFICADOR"]) || grab(/IDENTIFICADOR/);
    const matricula = fromMap("matr\xEDcula", "matricula") || findByLabel(["MATR[I\xCD]CULA"]) || grab(/MATR[IÍ]CULA/);
    const sede = fromMap("sede") || findByLabel(["SEDE"]) || grab(/SEDE/);
    const marcaModelo = fromMap("marca / modelo", "marca/modelo", "marca") || findByLabel(["MARCA\\s*/\\s*MODELO", "MARCA"]) || grab(/MARCA\s*\/\s*MODELO/);
    const vin = fromMap("bastidor (vin)", "bastidor", "vin") || findByLabel(["BASTIDOR", "VIN"]) || grab(/BASTIDOR|VIN/);
const inicioOT =
  fromMap(
    "inicio",
    "inicio ot",
    "fecha inicio",
    "fecha/hora inicio",
    "hora inicio",
    "fecha de inicio"
  ) ||
  findByLabel([
    "INICIO",
    "INICIO OT",
    "FECHA INICIO",
    "FECHA/HORA INICIO",
    "HORA INICIO",
    "FECHA DE INICIO"
  ]) ||
  grab(/(?:FECHA\/HORA\s+)?INICIO(?:\s+OT)?|FECHA\s+DE\s+INICIO|HORA\s+DE\s+INICIO/);
    const otNota =
      fromMap("observaciones", "observación", "observacion", "notas", "nota", "comentarios", "comentario") ||
      findByLabel(["OBSERVACIONES", "OBSERVACION", "NOTAS", "NOTA", "COMENTARIOS", "COMENTARIO"]) ||
      grab(/OBSERVACIONES|OBSERVACION|NOTAS|COMENTARIOS/);
    let brand = null, model = null;
    if (marcaModelo) {
      const parts = marcaModelo.split(/\s+/);
      if (parts.length >= 2) {
        brand = parts[0];
        model = parts.slice(1).join(" ");
      } else brand = marcaModelo;
    }
    const damages = [];
    const tables = Array.from(doc.querySelectorAll("table"));
    for (const table of tables) {
      const rows = Array.from(table.querySelectorAll("tr"));
      if (rows.length < 2) continue;
      const headerCells = Array.from(rows[0].querySelectorAll("th,td")).map((c) => (c.textContent || "").trim().toLowerCase());
      const colIdx = (names) => headerCells.findIndex((h) => names.some((n) => h.includes(n)));
      const iZona = colIdx(["zona", "elemento"]);
      const iTipo = colIdx(["tipo"]);
      const iGrav = colIdx(["gravedad"]);
      const iRep = colIdx(["reparaci\xF3n", "reparacion"]);
      const iPie = colIdx(["piezas"]);
      const iCod = colIdx(["c\xF3digo", "codigo"]);
      if (iZona < 0 || iCod < 0) continue;
      for (let r = 1; r < rows.length; r++) {
        const cells = Array.from(rows[r].querySelectorAll("td")).map((c) => (c.textContent || "").replace(/\s+/g, " ").trim());
        if (cells.length === 0 || cells.every((c) => !c)) continue;
        const zona = iZona >= 0 ? cells[iZona] : null;
        const tipoText = iTipo >= 0 ? cells[iTipo] : null;
        const gravText = iGrav >= 0 ? cells[iGrav] : null;
        const repText = iRep >= 0 ? cells[iRep] : null;
        const piezasText = iPie >= 0 ? cells[iPie] : "";
        const codigoText = iCod >= 0 ? cells[iCod] : null;
        if (!zona && !codigoText) continue;
        const _otFotos = (() => {
          const out = [];
          const scan = (rr, isNext) => {
            if (!rr) return;
            if (isNext) {
              const txt = Array.from(rr.querySelectorAll("td")).map((c) => (c.textContent || "").trim()).join("");
              if (txt) return;
            }
            rr.querySelectorAll("img").forEach((im) => {
              const src = im.getAttribute("src") || im.src || "";
              if (/^data:image\//i.test(src)) out.push(src);
            });
          };
          scan(rows[r], false);
          scan(rows[r + 1], true);
          return out;
        })();
        const parsed = parsePdfCode(codigoText);
        damages.push({
          zona: zona || null,
          tipoDano: parsed?.tipoDano || tipoText || null,
          gravedadText: gravText,
          gravedad: parsed?.gravedad || mapGravedadText(gravText),
          reparacionText: repText,
          tipoReparacion: parsed?.tipoReparacion || mapReparacionText(repText),
          piezasText,
          requierePiezas: parsed?.requierePiezas ?? piezasFromCode(codigoText) ?? /requiere|nueva/i.test(piezasText || ""),
          pdfCode: parsed?.full || (codigoText || null),
          elementCode: parsed?.elementCode || null,
          tipoCode: parsed?.tipoCode || null,
          fotos: _otFotos
        });
      }
      if (damages.length > 0) break;
    }
    return {
      fileName: file.name,
      fileSize: file.size,
      header: {
  identificador,
  matricula,
  sede,
  brand,
  model,
  marcaModelo,
  vin,
  inicioOT,
  otNota
},
      damages,
      raw: { source: "html", rowCount: damages.length }
    };
  };
  const loadFromStorage = async () => {
    try {
      if (typeof window !== "undefined" && window.storage?.get) {
        const res = await window.storage.get(STORAGE_KEY);
        if (res?.value) {
          const parsed = JSON.parse(res.value);
          const loaded = {
            ...DEFAULT_STATE,
            ...parsed,
            meta: { ...DEFAULT_STATE.meta, ...parsed.meta || {} }
          };
          return loaded;
        }
      }
    } catch (err) {
      console.warn("Storage load failed:", err);
    }
    return {
      ...DEFAULT_STATE,
      vehicles: SEED_VEHICLES.map((v) => ({
        ...v,
        notes: v.notes || "",
        nextRentalDate: "",
        lastInspectedAt: null,
        createdAt: nowIso()
      })),
      meta: { ...DEFAULT_STATE.meta, seededAt: nowIso() }
    };
  };
  const saveToStorage = async (state) => {
    try {
      if (typeof window !== "undefined" && window.storage?.set) {
        await window.storage.set(STORAGE_KEY, JSON.stringify(state));
        return true;
      }
    } catch (err) {
      console.error("Storage save failed:", err);
    }
    return false;
  };
  const Pill = ({ bg, color, children, mono, sm, square }) => /* @__PURE__ */ React.createElement("span", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    background: bg,
    color,
    padding: sm ? "2px 8px" : "3px 10px",
    borderRadius: square ? "3px" : "999px",
    fontSize: sm ? "10.5px" : "11.5px",
    fontWeight: 600,
    letterSpacing: "0.02em",
    fontFamily: mono ? F.mono : F.body,
    whiteSpace: "nowrap",
    lineHeight: 1.3
  } }, children);
  const Btn = ({ variant = "primary", onClick, children, disabled, sm, icon: Icon, type = "button", fullWidth }) => {
    const [hover, setHover] = useState(false);
    const styles = {
      primary: {
        bg: hover && !disabled ? T.rustDark : T.rust,
        color: "#FFFFFF",
        border: hover && !disabled ? T.rustDark : T.rust
      },
      secondary: {
        bg: hover && !disabled ? T.bgAlt : T.surface,
        color: T.ink,
        border: T.borderHi
      },
      ghost: {
        bg: hover && !disabled ? T.bgAlt : "transparent",
        color: T.inkSoft,
        border: "transparent"
      },
      danger: {
        bg: hover && !disabled ? "#E9EEFC" : T.surface,
        color: T.danger,
        border: "#CBD5E6"
      }
    }[variant];
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        type,
        onClick,
        disabled,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          background: styles.bg,
          color: styles.color,
          border: `1px solid ${styles.border}`,
          padding: sm ? "5px 11px" : "8px 14px",
          borderRadius: "10px",
          fontSize: sm ? "12px" : "13px",
          fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          fontFamily: F.body,
          letterSpacing: "0.01em",
          transition: "all 120ms ease",
          lineHeight: 1.2,
          width: fullWidth ? "100%" : "auto"
        }
      },
      Icon && /* @__PURE__ */ React.createElement(Icon, { size: sm ? 13 : 15, strokeWidth: 2 }),
      children
    );
  };
  const Field = ({ label, children, hint, required, span = 1 }) => /* @__PURE__ */ React.createElement("div", { style: { gridColumn: `span ${span}`, marginBottom: 0 } }, label && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: T.inkSoft,
    marginBottom: "5px",
    fontFamily: F.body
  } }, label, required && /* @__PURE__ */ React.createElement("span", { style: { color: T.rust } }, " *")), children, hint && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkFaint, marginTop: "4px", fontStyle: "italic" } }, hint));
  const Input = ({ value, onChange, type = "text", placeholder, mono, autoFocus, onKeyDown }) => /* @__PURE__ */ React.createElement(
    "input",
    {
      type,
      value: value || "",
      onChange: (e) => onChange(e.target.value),
      onKeyDown,
      placeholder,
      autoFocus,
      style: {
        width: "100%",
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: "10px",
        padding: "9px 11px",
        fontSize: "14.5px",
        color: T.ink,
        fontFamily: mono ? F.mono : F.body,
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 120ms"
      },
      onFocus: (e) => e.target.style.borderColor = T.rust,
      onBlur: (e) => e.target.style.borderColor = T.border
    }
  );
  const Textarea = ({ value, onChange, placeholder, rows = 3 }) => /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: value || "",
      onChange: (e) => onChange(e.target.value),
      placeholder,
      rows,
      style: {
        width: "100%",
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: "10px",
        padding: "9px 11px",
        fontSize: "14.5px",
        color: T.ink,
        fontFamily: F.body,
        outline: "none",
        boxSizing: "border-box",
        resize: "vertical",
        transition: "border-color 120ms"
      },
      onFocus: (e) => e.target.style.borderColor = T.rust,
      onBlur: (e) => e.target.style.borderColor = T.border
    }
  );
  const Select = ({ value, onChange, options }) => /* @__PURE__ */ React.createElement(
    "select",
    {
      value: value || "",
      onChange: (e) => onChange(e.target.value),
      style: {
        width: "100%",
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: "10px",
        padding: "9px 11px",
        fontSize: "14.5px",
        color: T.ink,
        fontFamily: F.body,
        outline: "none",
        boxSizing: "border-box",
        cursor: "pointer"
      }
    },
    options.map((opt) => /* @__PURE__ */ React.createElement("option", { key: opt.value, value: opt.value }, opt.label))
  );
  const ConfirmDialog = ({ open, title, message, confirmLabel = "Confirmar", cancelLabel = "Cancelar", variant = "primary", onConfirm, onCancel }) => {
    if (!open) return null;
    const isWarn = variant === "warning" || variant === "danger";
    const accent = variant === "danger" ? T.danger : variant === "warning" ? T.warn : T.rust;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: onCancel,
        style: {
          position: "fixed",
          inset: 0,
          background: "rgba(26, 20, 16, 0.55)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2e3,
          padding: "20px",
          backdropFilter: "blur(2px)"
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            background: T.bg,
            borderRadius: "12px",
            maxWidth: 480,
            width: "100%",
            border: `1px solid ${T.borderHi}`,
            borderTop: `4px solid ${accent}`,
            boxShadow: "0 24px 60px rgba(26, 20, 16, 0.35)",
            padding: "22px 26px 20px"
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" } }, isWarn && /* @__PURE__ */ React.createElement(ShieldAlert, { size: 22, style: { color: accent, flexShrink: 0, marginTop: "2px" }, strokeWidth: 2 }), /* @__PURE__ */ React.createElement("div", null, title && /* @__PURE__ */ React.createElement("h3", { style: {
          margin: "0 0 6px",
          fontSize: "17px",
          fontWeight: 600,
          fontFamily: F.display,
          letterSpacing: "-0.01em",
          color: T.ink
        } }, title), /* @__PURE__ */ React.createElement("div", { style: {
          fontSize: "14.5px",
          color: T.inkSoft,
          lineHeight: 1.55,
          whiteSpace: "pre-line"
        } }, message))),
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "18px" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onCancel, sm: true }, cancelLabel), /* @__PURE__ */ React.createElement(Btn, { variant: variant === "danger" ? "danger" : "primary", onClick: onConfirm, sm: true }, confirmLabel))
      )
    );
  };
  const SetRentalDatesModal = ({ open, vehicle, onClose, onConfirm }) => {
    const [startDate, setStartDate] = useState(todayKey());
    const [endDate, setEndDate] = useState("");
    const [days, setDays] = useState("");
    const [lastEdited, setLastEdited] = useState(null);
    useEffect(() => {
      if (open) {
        setStartDate(todayKey());
        setEndDate("");
        setDays("");
        setLastEdited(null);
      }
    }, [open, vehicle?.id]);
    useEffect(() => {
      if (!startDate) return;
      if (lastEdited === "days" && days !== "") {
        const n = parseInt(days, 10);
        if (!isNaN(n) && n > 0) {
          const d = new Date(startDate);
          d.setDate(d.getDate() + n);
          const iso = d.toISOString().slice(0, 10);
          if (iso !== endDate) setEndDate(iso);
        }
      } else if (lastEdited === "end" && endDate) {
        const ms = new Date(endDate) - new Date(startDate);
        const n = Math.round(ms / 864e5);
        if (n > 0 && String(n) !== days) setDays(String(n));
      }
    }, [startDate, days, endDate, lastEdited]);
    if (!open || !vehicle) return null;
    const valid = startDate && endDate && new Date(endDate) > new Date(startDate);
    const handleConfirm = () => {
      if (!valid) return;
      onConfirm({
        vehicleId: vehicle.id,
        rentalStartDate: (/* @__PURE__ */ new Date(startDate + "T08:00:00")).toISOString(),
        rentalEndDate: (/* @__PURE__ */ new Date(endDate + "T20:00:00")).toISOString(),
        rentalDays: parseInt(days, 10) || daysBetween(startDate, endDate)
      });
    };
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: onClose,
        style: {
          position: "fixed",
          inset: 0,
          background: "rgba(26, 20, 16, 0.55)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2e3,
          padding: "20px",
          backdropFilter: "blur(2px)"
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            background: T.bg,
            borderRadius: "12px",
            maxWidth: 480,
            width: "100%",
            border: `1px solid ${T.borderHi}`,
            borderTop: `4px solid ${WORKFLOW_STATES.EN_USO.accent}`,
            boxShadow: "0 24px 60px rgba(26, 20, 16, 0.35)",
            padding: "22px 26px 20px"
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "14px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "9.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: T.inkFaint, marginBottom: "2px" } }, "Marcar como entregado"), /* @__PURE__ */ React.createElement("h3", { style: {
          margin: 0,
          fontSize: "19px",
          fontWeight: 600,
          fontFamily: F.display,
          letterSpacing: "-0.01em",
          color: T.ink
        } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, color: T.rust, marginRight: "8px" } }, vehicle.id), vehicle.brand, " ", vehicle.model || ""), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13.5px", color: T.inkSoft, marginTop: "4px" } }, "Carg\xE1 las fechas del alquiler. El veh\xEDculo pasar\xE1 a EN USO.")),
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "12px" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: fieldLabelStyle }, "Fecha de salida"), /* @__PURE__ */ React.createElement(
          "input",
          {
            type: "date",
            value: startDate,
            onChange: (e) => setStartDate(e.target.value),
            style: inputStyle
          }
        )), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "end" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: fieldLabelStyle }, "D\xEDas de viaje"), /* @__PURE__ */ React.createElement(
          "input",
          {
            type: "number",
            min: "1",
            value: days,
            onChange: (e) => {
              setDays(e.target.value);
              setLastEdited("days");
            },
            placeholder: "7",
            style: inputStyle
          }
        )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: fieldLabelStyle }, "Fecha de devoluci\xF3n"), /* @__PURE__ */ React.createElement(
          "input",
          {
            type: "date",
            value: endDate,
            onChange: (e) => {
              setEndDate(e.target.value);
              setLastEdited("end");
            },
            style: inputStyle
          }
        ))), valid && /* @__PURE__ */ React.createElement("div", { style: {
          background: WORKFLOW_STATES.EN_USO.bg,
          border: `1px solid ${WORKFLOW_STATES.EN_USO.accent}`,
          borderRadius: "10px",
          padding: "10px 12px",
          fontSize: "13px",
          color: WORKFLOW_STATES.EN_USO.color,
          fontWeight: 600
        } }, "Estar\xE1 en uso del", " ", /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono } }, formatDate(startDate)), " ", "al", " ", /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono } }, formatDate(endDate)), days && /* @__PURE__ */ React.createElement("span", null, " \xB7 ", days, " d\xEDa", days === "1" ? "" : "s")), endDate && !valid && /* @__PURE__ */ React.createElement("div", { style: {
          background: "#E9EEFC",
          borderLeft: `3px solid ${T.danger}`,
          padding: "8px 12px",
          borderRadius: "10px",
          fontSize: "13px",
          color: T.danger,
          fontWeight: 600
        } }, "La fecha de devoluci\xF3n debe ser posterior a la de salida.")),
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "20px" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClose, sm: true }, "Cancelar"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: handleConfirm, disabled: !valid, sm: true }, "Marcar en uso"))
      )
    );
  };
  const fieldLabelStyle = {
    display: "block",
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: T.inkSoft,
    marginBottom: "4px",
    fontFamily: F.body
  };
  const inputStyle = {
    width: "100%",
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: "10px",
    padding: "8px 10px",
    fontSize: "14px",
    fontFamily: F.body,
    color: T.ink,
    outline: "none",
    boxSizing: "border-box"
  };
  const Modal = ({ open, onClose, title, children, width = 520 }) => {
    if (!open) return null;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: onClose,
        style: {
          position: "fixed",
          inset: 0,
          background: "rgba(26, 20, 16, 0.55)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1e3,
          padding: "20px",
          backdropFilter: "blur(2px)"
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            background: T.bg,
            borderRadius: "12px",
            maxWidth: width,
            width: "100%",
            maxHeight: "88vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: `1px solid ${T.borderHi}`,
            boxShadow: "0 24px 60px rgba(26, 20, 16, 0.35)"
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: {
          padding: "16px 22px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: T.surface
        } }, /* @__PURE__ */ React.createElement("h3", { style: {
          margin: 0,
          fontSize: "17px",
          fontWeight: 600,
          fontFamily: F.display,
          letterSpacing: "-0.01em",
          color: T.ink
        } }, title), /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: onClose,
            style: {
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: T.inkSoft,
              padding: "4px",
              display: "flex",
              borderRadius: "10px"
            },
            onMouseEnter: (e) => e.currentTarget.style.background = T.bgAlt,
            onMouseLeave: (e) => e.currentTarget.style.background = "transparent"
          },
          /* @__PURE__ */ React.createElement(X, { size: 18 })
        )),
        /* @__PURE__ */ React.createElement("div", { style: { padding: "22px", overflowY: "auto", flex: 1 } }, children)
      )
    );
  };
  const SectionTitle = ({ children, kicker, count, action }) => /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "14px",
    gap: "16px"
  } }, /* @__PURE__ */ React.createElement("div", null, kicker && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: T.inkFaint,
    marginBottom: "4px"
  } }, kicker), /* @__PURE__ */ React.createElement("h2", { style: {
    margin: 0,
    fontFamily: F.display,
    fontSize: "28px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    color: T.ink,
    lineHeight: 1.1
  } }, children, count !== void 0 && /* @__PURE__ */ React.createElement("span", { style: {
    marginLeft: "12px",
    fontSize: "15px",
    color: T.inkSoft,
    fontWeight: 400,
    fontFamily: F.body,
    letterSpacing: "0"
  } }, "\xB7 ", count))), action);
  const TABS = [
    { id: "today", label: "Hoy", icon: Sparkles, ready: true },
    { id: "fleet", label: "Flota", icon: Truck, ready: true },
    { id: "agenda", label: "Agenda", icon: Calendar, ready: true },
    { id: "quantifier", label: "Cuantificaci\xF3n", icon: FileText, ready: true },
    { id: "deposits", label: "Fianzas", icon: Coins, ready: true },
    { id: "recambios", label: "Recambios", icon: Wrench, ready: true },
    { id: "buscador", label: "Buscador", icon: Search, ready: true },
    { id: "stats", label: "Estad\xEDsticas", icon: BarChart3, ready: true }
  ];
  const TabBar = ({ active, onChange }) => /* @__PURE__ */ React.createElement("nav", { style: {
    background: T.surface,
    borderTop: `1px solid ${T.border}`,
    borderBottom: `1px solid ${T.border}`,
    padding: "0 28px",
    position: "sticky",
    top: 0,
    zIndex: 40
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    gap: "2px",
    overflowX: "auto"
  } }, TABS.map((tab) => {
    const Icon = tab.icon;
    const isActive = active === tab.id;
    const disabled = !tab.ready;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: tab.id,
        onClick: () => !disabled && onChange(tab.id),
        disabled,
        style: {
          display: "flex",
          alignItems: "center",
          gap: "7px",
          padding: "12px 14px",
          border: "none",
          background: "transparent",
          color: disabled ? T.inkFaint : isActive ? T.rust : T.inkSoft,
          cursor: disabled ? "not-allowed" : "pointer",
          fontSize: "14px",
          fontWeight: isActive ? 700 : 500,
          fontFamily: F.body,
          borderBottom: `2.5px solid ${isActive ? T.rust : "transparent"}`,
          marginBottom: "-1px",
          opacity: disabled ? 0.5 : 1,
          whiteSpace: "nowrap",
          transition: "color 120ms"
        },
        onMouseEnter: (e) => !disabled && !isActive && (e.currentTarget.style.color = T.ink),
        onMouseLeave: (e) => !disabled && !isActive && (e.currentTarget.style.color = T.inkSoft)
      },
      /* @__PURE__ */ React.createElement(Icon, { size: 14, strokeWidth: 2 }),
      tab.label,
      !tab.ready && /* @__PURE__ */ React.createElement("span", { style: {
        fontSize: "9px",
        background: T.bgAlt,
        color: T.inkFaint,
        padding: "1px 6px",
        borderRadius: "8px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginLeft: "2px"
      } }, "pronto")
    );
  })));
  const Header = ({ onBackup, onImport, lastBackupAt, backupReminder, onDismissReminder, onToggleWatch, watchStatus, theme, onToggleTheme }) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("header", { style: { background: T.bg, padding: "20px 28px 18px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "14px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 38,
    height: 38,
    background: T.ink,
    color: T.rust,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: F.display,
    fontWeight: 700,
    fontSize: "17px",
    letterSpacing: "-0.04em",
    borderRadius: "8px",
    flexShrink: 0
  } }, "AC"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { style: {
    margin: 0,
    fontFamily: F.display,
    fontSize: "22px",
    fontWeight: 700,
    letterSpacing: "-0.025em",
    color: T.ink,
    lineHeight: 1
  } }, "Cockpit"), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: T.inkFaint,
    fontWeight: 600,
    marginTop: "4px",
    fontFamily: F.body
  } }, "AC-LLAR \xB7 Gesti\xF3n de flota \xB7 Piloto v2"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, onToggleTheme && /* @__PURE__ */ React.createElement("button", { onClick: onToggleTheme, title: theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro", "aria-label": "Cambiar tema", style: { cursor: "pointer", fontSize: "15px", lineHeight: 1, color: T.inkSoft, background: T.surface, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "7px 10px" } }, theme === "dark" ? "☀️" : "\u{1F319}"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkSoft, textAlign: "right", lineHeight: 1.3, marginRight: "4px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: "9px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 700,
    color: T.inkFaint
  } }, "\xDAltimo backup"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: F.mono, fontSize: "11px", color: T.ink, fontWeight: 500 } }, lastBackupAt ? formatDateTime(lastBackupAt) : "nunca")), onToggleWatch && /* @__PURE__ */ React.createElement(
    Btn,
    {
      variant: watchStatus === "active" ? "primary" : "secondary",
      onClick: onToggleWatch,
      icon: watchStatus === "active" ? CheckCircle : Clock,
      sm: true,
      title: watchStatus === "active" ? "Auto-importaci\xF3n activa. Clic para detener." : "Vincular carpeta de OneDrive para importar OT autom\xE1ticamente"
    },
    watchStatus === "active" ? "Auto \u25CF" : "Auto-OT"
  ), /* @__PURE__ */ (window.acllarEsAdmin && window.acllarEsAdmin()) && React.createElement(Btn, { variant: "secondary", onClick: onBackup, icon: Database, sm: true }, "Backup")))), backupReminder && /* @__PURE__ */ React.createElement("div", { style: {
    background: backupReminder.level === "warn" ? "#E9EEFC" : "#EEF2F8",
    borderTop: `1px solid ${backupReminder.level === "warn" ? "#CBD5E6" : "#CBD5E6"}`,
    borderBottom: `1px solid ${backupReminder.level === "warn" ? "#CBD5E6" : "#CBD5E6"}`,
    padding: "10px 28px"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: backupReminder.level === "warn" ? T.danger : T.warn,
    fontSize: "14px",
    fontWeight: 600
  } }, /* @__PURE__ */ React.createElement(FileWarning, { size: 16 }), backupReminder.text), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", sm: true, onClick: onDismissReminder }, "Hoy no"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", sm: true, onClick: onBackup, icon: Download }, "Exportar")))));
const FleetView = ({ state, setView, onSelectVehicle, onAdd, onImport, bajaVehicles = [] }) => {
    const [q, setQ] = useState("");
    const [showBaja, setShowBaja] = useState(false);
    const [locFilter, setLocFilter] = useState("Todas");
    const locations = useMemo(() => {
      const set = /* @__PURE__ */ new Set();
      state.vehicles.forEach((v) => v.location && set.add(v.location));
      return ["Todas", ...Array.from(set).sort()];
    }, [state.vehicles]);
    const locCounts = useMemo(() => {
      const c = { Todas: state.vehicles.length };
      state.vehicles.forEach((v) => {
        c[v.location || "\u2014"] = (c[v.location || "\u2014"] || 0) + 1;
      });
      return c;
    }, [state.vehicles]);
    const filtered = useMemo(() => {
      let r = state.vehicles.slice();
      if (locFilter !== "Todas") r = r.filter((v) => v.location === locFilter);
      if (q.trim()) {
        const n = q.toLowerCase();
        r = r.filter(
          (v) => (v.id || "").toLowerCase().includes(n) || (v.plate || "").toLowerCase().includes(n) || (v.brand || "").toLowerCase().includes(n) || (v.model || "").toLowerCase().includes(n) || (v.vin || "").toLowerCase().includes(n)
        );
      }
      return r.sort((a, b) => {
        const aHas = !!a.nextRentalDate, bHas = !!b.nextRentalDate;
        if (aHas && !bHas) return -1;
        if (!aHas && bHas) return 1;
        if (aHas && bHas) {
          const da = new Date(a.nextRentalDate).getTime();
          const db = new Date(b.nextRentalDate).getTime();
          if (da !== db) return da - db;
        }
        const la = a.location || "zzz", lb = b.location || "zzz";
        if (la !== lb) return la.localeCompare(lb);
        return (a.id || "").localeCompare(b.id || "", void 0, { numeric: true });
      });
    }, [state.vehicles, locFilter, q]);
    const activeDamageList = state.damages.filter((d) => d.state !== "REPARADO" && d.state !== "ASUMIDO");
    const activeDamages = activeDamageList.length;
    const gravesActivos = activeDamageList.filter((d) => d.gravedad === "GRAVE").length;
    const moderadosActivos = activeDamageList.filter((d) => d.gravedad === "MODERADO").length;
    const inspectedToday = state.vehicles.filter((v) => v.lastInspectedAt?.slice(0, 10) === todayKey()).length;
    const pendingCount = state.vehicles.filter((v) => {
      const s = computeVehicleStatus(v, state.damages);
      return ["PENDIENTE_VALORAR", "PENDIENTE_ROSANA", "EN_REPARACION"].includes(s);
    }).length;
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      SectionTitle,
      {
        kicker: "Flota AC-LLAR",
        count: state.vehicles.length === filtered.length ? state.vehicles.length : `${filtered.length} / ${state.vehicles.length}`,
        action: /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: onAdd, icon: Plus }, "Nuevo veh\xEDculo"))
      },
      state.vehicles.length === 1 ? "veh\xEDculo" : "veh\xEDculos"
    ), /* @__PURE__ */ React.createElement("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "10px",
      marginBottom: "22px"
    } }, /* @__PURE__ */ React.createElement(
      StatCard,
      {
        label: "Da\xF1os activos",
        value: activeDamages,
        accent: T.warn,
        sub: gravesActivos + moderadosActivos > 0 ? `${gravesActivos} graves \xB7 ${moderadosActivos} moderados` : null
      }
    ), /* @__PURE__ */ React.createElement(StatCard, { label: "En proceso", value: pendingCount, accent: T.rust }), /* @__PURE__ */ React.createElement(StatCard, { label: "Revisados hoy", value: inspectedToday, accent: T.ok }), /* @__PURE__ */ React.createElement(StatCard, { label: "Total flota", value: state.vehicles.length })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", marginBottom: "14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "5px", flexWrap: "wrap" } }, locations.map((loc) => {
      const active = locFilter === loc;
      const theme = LOCATION_THEME[loc] || { bg: T.bgAlt, color: T.inkSoft, accent: T.ink };
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: loc,
          onClick: () => setLocFilter(loc),
          style: {
            background: active ? theme.accent : T.surface,
            color: active ? "#FFF" : theme.color,
            border: `1px solid ${active ? theme.accent : T.border}`,
            borderRadius: "999px",
            padding: "5px 12px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: F.body,
            transition: "all 120ms",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            letterSpacing: "0.01em"
          }
        },
        loc,
        /* @__PURE__ */ React.createElement("span", { style: {
          background: active ? "rgba(255,255,255,0.22)" : theme.bg,
          color: active ? "#FFF" : theme.color,
          fontFamily: F.mono,
          padding: "0 6px",
          borderRadius: "999px",
          fontSize: "10px",
          fontWeight: 700,
          minWidth: "18px",
          textAlign: "center"
        } }, locCounts[loc] || 0)
      );
    })), /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "auto", position: "relative", minWidth: "240px", flex: "1 1 240px", maxWidth: "320px" } }, /* @__PURE__ */ React.createElement(Search, { size: 14, style: {
      position: "absolute",
      left: "11px",
      top: "50%",
      transform: "translateY(-50%)",
      color: T.inkFaint,
      pointerEvents: "none"
    } }), /* @__PURE__ */ React.createElement(
      "input",
      {
        value: q,
        onChange: (e) => setQ(e.target.value),
        placeholder: "Buscar AC, matr\xEDcula, modelo, VIN\u2026",
        style: {
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: "10px",
          padding: "8px 12px 8px 32px",
          fontSize: "14px",
          color: T.ink,
          fontFamily: F.body,
          outline: "none",
          width: "100%",
          boxSizing: "border-box"
        },
        onFocus: (e) => e.target.style.borderColor = T.rust,
        onBlur: (e) => e.target.style.borderColor = T.border
      }
    ))), /* @__PURE__ */ React.createElement("div", { style: {
      display: "grid",
      gridTemplateColumns: "1.3fr 1.8fr 0.9fr 1.4fr 0.9fr 24px",
      gap: "16px",
      padding: "0 18px",
      marginBottom: "6px",
      fontSize: "9.5px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      color: T.inkFaint
    } }, /* @__PURE__ */ React.createElement("div", null, "Veh\xEDculo"), /* @__PURE__ */ React.createElement("div", null, "Marca / Modelo"), /* @__PURE__ */ React.createElement("div", null, "Ubicaci\xF3n"), /* @__PURE__ */ React.createElement("div", null, "Estado \xB7 Pr\xF3xima salida"), /* @__PURE__ */ React.createElement("div", null, "Da\xF1os"), /* @__PURE__ */ React.createElement("div", null)), filtered.length === 0 ? /* @__PURE__ */ React.createElement(
      EmptyState,
      {
        icon: Search,
        title: "Sin resultados",
        message: `No hay veh\xEDculos${q ? ` que coincidan con "${q}"` : ""}${locFilter !== "Todas" ? ` en ${locFilter}` : ""}.`
      }
    ) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "6px" } }, filtered.map((v) => /* @__PURE__ */ React.createElement(
      VehicleRow,
      {
        key: v.id,
        vehicle: v,
        damages: state.damages,
        onClick: () => {
  onSelectVehicle(v.id);
}
      }
    ))),
    bajaVehicles.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "26px", borderTop: `1px dashed ${T.border}`, paddingTop: "14px" } },
      /* @__PURE__ */ React.createElement("button", { onClick: () => setShowBaja((x) => !x), style: { background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontFamily: F.body, fontSize: "13px", fontWeight: 700, color: T.inkSoft, padding: "4px 0" } },
        /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11px" } }, showBaja ? "▾" : "▸"),
        `Fuera de flota — baja (${bajaVehicles.length})`,
        /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 400, color: T.inkFaint, fontSize: "11px" } }, "\xB7 no aparecen en Flota, Agenda, Recambios ni Hoy \xB7 sus da\xF1os siguen en Estad\xEDsticas")
      ),
      showBaja && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px", opacity: 0.72 } },
        bajaVehicles.slice().sort((a, b) => (a.id || "").localeCompare(b.id || "", void 0, { numeric: true })).map((v) => /* @__PURE__ */ React.createElement(VehicleRow, { key: v.id, vehicle: v, damages: state.damages, onClick: () => onSelectVehicle(v.id) }))
      )
    ));
  };
  const StatCard = ({ label, value, accent, sub }) => /* @__PURE__ */ React.createElement("div", { style: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderLeft: accent ? `3px solid ${accent}` : `1px solid ${T.border}`,
    borderRadius: "10px",
    padding: "12px 14px"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: T.inkSoft,
    marginBottom: "4px"
  } }, label), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: F.display,
    fontSize: "24px",
    fontWeight: 600,
    color: T.ink,
    lineHeight: 1,
    letterSpacing: "-0.02em"
  } }, value), sub && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: "10.5px",
    color: T.inkFaint,
    marginTop: "6px",
    fontFamily: F.body,
    fontWeight: 500
  } }, sub));
  const VehicleRow = ({ vehicle, damages, onClick }) => {
    const [hover, setHover] = useState(false);
    const status = computeVehicleStatus(vehicle, damages);
    const statusInfo = statusTheme(status);
    const vd = damages.filter((d) => d.vehicleId === vehicle.id);
    const active = vd.filter((d) => d.state !== "REPARADO" && d.state !== "ASUMIDO");
    const days = vehicle.nextRentalDate ? daysBetween(nowIso(), vehicle.nextRentalDate) : null;
    const isUrgent = days !== null && days >= 0 && days <= 3 && active.length > 0;
    const locTheme = LOCATION_THEME[vehicle.location];
    const isProvisional = !vehicle.plate;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          background: hover ? T.bgAlt : T.surface,
          border: `1px solid ${isUrgent ? T.rust : T.border}`,
          borderLeft: isUrgent ? `4px solid ${T.rust}` : locTheme ? `3px solid ${locTheme.accent}` : `1px solid ${T.border}`,
          borderRadius: "10px",
          padding: "13px 18px",
          cursor: "pointer",
          display: "grid",
          gridTemplateColumns: "1.3fr 1.8fr 0.9fr 1.4fr 0.9fr 24px",
          gap: "16px",
          alignItems: "center",
          transition: "all 120ms"
        }
      },
      /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: F.mono,
        fontSize: "14px",
        fontWeight: 700,
        color: T.ink,
        letterSpacing: "-0.01em"
      } }, vehicle.id), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkSoft, marginTop: "2px", fontFamily: F.mono } }, isProvisional ? /* @__PURE__ */ React.createElement("span", { style: { color: T.warn, fontStyle: "italic" } }, "sin matr\xEDcula") : vehicle.plate || "\u2014")),
      /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", color: T.ink, fontWeight: 600 } }, vehicle.brand), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11.5px", color: T.inkSoft, marginTop: "1px" } }, vehicle.model || "\u2014")),
      /* @__PURE__ */ React.createElement("div", null, vehicle.location && locTheme ? /* @__PURE__ */ React.createElement("span", { style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        color: locTheme.color,
        fontSize: "11.5px",
        fontWeight: 600
      } }, /* @__PURE__ */ React.createElement(MapPin, { size: 11 }), vehicle.location) : /* @__PURE__ */ React.createElement("span", { style: { color: T.inkFaint, fontSize: "13px" } }, "\u2014")),
      /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", alignItems: "center", gap: "4px" } }, /* @__PURE__ */ React.createElement(Pill, { bg: statusInfo.bg, color: statusInfo.color }, VEHICLE_STATUS_LABELS[status] || status), isForcedReady(vehicle, damages) && /* @__PURE__ */ React.createElement(ShieldAlert, { size: 12, style: { color: T.warn }, title: "Sale con da\xF1os activos sin reparar" })), vehicle.nextRentalDate && /* @__PURE__ */ React.createElement("div", { style: {
        marginTop: "4px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        fontSize: "11px",
        color: days !== null && days >= 0 && days <= 3 ? T.rust : T.inkSoft,
        fontWeight: days !== null && days >= 0 && days <= 3 ? 600 : 400
      } }, /* @__PURE__ */ React.createElement(Calendar, { size: 11 }), formatDate(vehicle.nextRentalDate), days !== null && days >= 0 && days <= 7 && /* @__PURE__ */ React.createElement("span", null, "\xB7 ", days === 0 ? "hoy" : days === 1 ? "ma\xF1ana" : `${days}d`))),
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px" } }, active.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "2px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "4px", flexWrap: "wrap" } }, ["GRAVE", "MODERADO", "LEVE"].map((g) => {
        const n = active.filter((d) => d.gravedad === g).length;
        if (n === 0) return null;
        const th = GRAVEDAD_THEME[g];
        return /* @__PURE__ */ React.createElement("span", { key: g, style: {
          background: th.bg,
          color: th.color,
          padding: "1px 6px",
          borderRadius: "8px",
          fontSize: "10px",
          fontWeight: 700,
          fontFamily: F.mono,
          letterSpacing: "0.02em"
        }, title: th.label }, n, th.short);
      }), active.filter((d) => !d.gravedad).length > 0 && /* @__PURE__ */ React.createElement("span", { style: {
        color: T.warn,
        fontWeight: 600,
        fontSize: "11px"
      } }, active.filter((d) => !d.gravedad).length, " s/c"))) : vd.length > 0 ? /* @__PURE__ */ React.createElement("span", { style: { color: T.ok } }, vd.length, " reparado", vd.length === 1 ? "" : "s") : /* @__PURE__ */ React.createElement("span", { style: { color: T.inkFaint } }, "\u2014")),
      /* @__PURE__ */ React.createElement(ChevronRight, { size: 16, style: { color: T.inkFaint } })
    );
  };
  const WorkflowStatusControl = ({ currentStatus, onSetStatus, activeDamageCount = 0, requestConfirm }) => {
    const [open, setOpen] = useState(false);
    const theme = WORKFLOW_STATES[currentStatus] || { label: currentStatus, bg: T.bgAlt, color: T.inkSoft, accent: T.inkSoft };
    const ref = useRef(null);
    useEffect(() => {
      if (!open) return;
      const onClick = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }, [open]);
    const handlePick = async (newStatus) => {
      setOpen(false);
      if (newStatus === "LISTO" && activeDamageCount > 0 && requestConfirm) {
        const ok = await requestConfirm({
          title: `Marcar LISTO con ${activeDamageCount} da\xF1o${activeDamageCount === 1 ? "" : "s"} activo${activeDamageCount === 1 ? "" : "s"}`,
          message: `Este veh\xEDculo tiene ${activeDamageCount} da\xF1o${activeDamageCount === 1 ? "" : "s"} sin reparar.

Los da\xF1os no se eliminan ni se marcan como reparados \u2014 quedan registrados como activos, pero el veh\xEDculo se mostrar\xE1 como listo para salir.`,
          confirmLabel: "S\xED, marcar LISTO",
          cancelLabel: "Cancelar",
          variant: "warning"
        });
        if (!ok) return;
      }
      onSetStatus(newStatus);
    };
    return /* @__PURE__ */ React.createElement("div", { ref, style: { position: "relative" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setOpen((o) => !o),
        style: {
          background: theme.bg,
          color: theme.color,
          border: `1.5px solid ${theme.accent}`,
          padding: "7px 12px 7px 14px",
          borderRadius: "999px",
          fontSize: "11.5px",
          fontWeight: 700,
          fontFamily: F.body,
          cursor: "pointer",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          transition: "all 120ms"
        }
      },
      theme.label,
      /* @__PURE__ */ React.createElement(ChevronDown, { size: 13, style: {
        transform: open ? "rotate(180deg)" : "rotate(0)",
        transition: "transform 200ms"
      } })
    ), open && /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: "calc(100% + 4px)",
      right: 0,
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: "10px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      minWidth: "260px",
      padding: "4px",
      zIndex: 30
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: "9.5px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: T.inkFaint,
      padding: "6px 10px 4px"
    } }, "Cambiar estado del veh\xEDculo"), Object.entries(WORKFLOW_STATES).map(([key, ws]) => {
      const isCurrent = key === currentStatus;
      const wouldForceReady = key === "LISTO" && activeDamageCount > 0 && !isCurrent;
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key,
          onClick: () => {
            if (!isCurrent) handlePick(key);
          },
          disabled: isCurrent,
          style: {
            width: "100%",
            background: isCurrent ? T.bgAlt : "transparent",
            color: isCurrent ? T.inkFaint : T.ink,
            border: "none",
            borderLeft: `3px solid ${isCurrent ? ws.accent : "transparent"}`,
            padding: "8px 12px",
            textAlign: "left",
            cursor: isCurrent ? "default" : "pointer",
            fontFamily: F.body,
            fontSize: "13px",
            fontWeight: isCurrent ? 700 : 500,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "8px",
            transition: "background 100ms"
          },
          onMouseEnter: (e) => {
            if (!isCurrent) e.currentTarget.style.background = T.bgAlt;
          },
          onMouseLeave: (e) => {
            if (!isCurrent) e.currentTarget.style.background = "transparent";
          }
        },
        /* @__PURE__ */ React.createElement("span", { style: {
          background: ws.bg,
          color: ws.color,
          fontSize: "9.5px",
          fontWeight: 700,
          padding: "2px 7px",
          borderRadius: "8px",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          fontFamily: F.body,
          flexShrink: 0
        } }, ws.short),
        /* @__PURE__ */ React.createElement("span", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" } }, /* @__PURE__ */ React.createElement("span", null, ws.label), wouldForceReady && /* @__PURE__ */ React.createElement("span", { style: {
          fontSize: "9.5px",
          color: T.warn,
          fontWeight: 600,
          fontStyle: "italic",
          lineHeight: 1.2
        } }, "\u26A0 sale con ", activeDamageCount, " da\xF1o", activeDamageCount === 1 ? "" : "s", " activo", activeDamageCount === 1 ? "" : "s")),
        isCurrent && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "10px", color: T.inkFaint, fontStyle: "italic" } }, "actual")
      );
    })));
  };
  function buildRepairOrderHTML(vehicle, selectedDamages) {
    const esc = (s) => String(s == null ? "" : s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
    const fecha = (/* @__PURE__ */ new Date()).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
    const gravLabel = { GRAVE: "GRAVE", MODERADO: "MODERADO", LEVE: "LEVE" };
    const gravColor = { GRAVE: "#991B1B", MODERADO: "#B45309", LEVE: "#1F4D2E" };
    const gravBg = { GRAVE: "#FEE2E2", MODERADO: "#FEF3C7", LEVE: "#D7EFDA" };
    const rows = selectedDamages.map((d, i) => {
      const g = (d.gravedad || "").toUpperCase();
      const requierePiezas = d.requierePiezas === true || /requiere/i.test(d.piezasText || "");
      return `<tr>
      <td style="text-align:center;font-weight:700;color:#6b7280">${i + 1}</td>
      <td style="font-weight:600">${esc(d.zona || d.description || "Da\xF1o")}</td>
      <td>${esc(d.tipoDano || "")}</td>
      <td style="text-align:center"><span style="background:${gravBg[g] || "#f3f4f6"};color:${gravColor[g] || "#374151"};padding:2px 8px;border-radius:5px;font-size:11px;font-weight:700">${gravLabel[g] || "\u2014"}</span></td>
      <td style="text-align:center">${requierePiezas ? "\u{1F527} S\xED" : "\u2014"}</td>
      <td style="font-family:monospace;font-size:11px;color:#6b7280">${esc(d.pdfCode || "")}</td>
      <td style="text-align:center;width:48px">\u2610</td>
    </tr>`;
    }).join("");
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Orden de reparaci\xF3n ${esc(vehicle.id)}</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;max-width:820px;margin:0 auto;padding:28px;color:#1f2937;font-size:13px}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #A8350F;padding-bottom:14px;margin-bottom:6px}
  h1{font-size:22px;margin:0;color:#A8350F}
  .sub{color:#6b7280;font-size:12px;margin-top:4px}
  .veh{text-align:right;font-size:13px;line-height:1.6}
  .veh b{color:#1f2937}
  table{width:100%;border-collapse:collapse;margin-top:20px}
  th{background:#1f2937;color:white;padding:9px 8px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.03em}
  td{padding:10px 8px;border-bottom:1px solid #e5e7eb}
  .note{margin-top:24px;padding:12px 16px;background:#FBF7EC;border-left:3px solid #A8350F;font-size:12px;color:#6b7280}
  .foot{margin-top:30px;display:flex;justify-content:space-between;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:12px}
  @media print{.noprint{display:none}body{padding:0}}
</style></head><body>
  <div class="hdr">
    <div>
      <h1>Orden de reparaci\xF3n</h1>
      <div class="sub">AC-LLAR \xB7 Taller \xB7 ${fecha}</div>
    </div>
    <div class="veh">
      <div><b>${esc(vehicle.id)}</b></div>
      <div>${esc(vehicle.brand || "")} ${esc(vehicle.model || "")}</div>
      <div style="font-family:monospace">${esc(vehicle.plate || "")}</div>
      <div style="color:#9ca3af;font-size:11px">${esc(vehicle.location || "")}</div>
    </div>
  </div>
  <div style="font-size:13px;color:#374151;margin-top:10px">
    <b>${selectedDamages.length}</b> reparaci\xF3n${selectedDamages.length === 1 ? "" : "es"} a realizar:
  </div>
  <table>
    <thead><tr>
      <th style="text-align:center;width:28px">#</th>
      <th>Zona / Elemento</th>
      <th>Tipo de da\xF1o</th>
      <th style="text-align:center">Gravedad</th>
      <th style="text-align:center">Piezas</th>
      <th>C\xF3digo</th>
      <th style="text-align:center">Hecho</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="note">
    Esta orden incluye \xFAnicamente las reparaciones seleccionadas. Marc\xE1 la casilla "Hecho" a medida que completes cada una.
  </div>
  <div class="foot">
    <span>MEC\xC1NICO: _________________________</span>
    <span>FECHA FIN: ____________</span>
  </div>
  <div class="noprint" style="margin-top:24px;text-align:center">
    <button onclick="window.print()" style="background:#A8350F;color:white;border:none;padding:11px 26px;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600">\u{1F5A8}\uFE0F Imprimir / Guardar PDF</button>
  </div>
</body></html>`;
  }
  function RepairOrderModal({ open, onClose, vehicle, damages }) {
    const candidates = useMemo(
      () => damages.filter((d) => d.vehicleId === vehicle.id && damageRepair(d) !== "REPARADO"),
      [damages, vehicle.id]
    );
    const [selected, setSelected] = useState(() => /* @__PURE__ */ new Set());
    React.useEffect(() => {
      if (open) setSelected(/* @__PURE__ */ new Set());
    }, [open]);
    if (!open) return null;
    const toggle = (id) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    };
    const selectedDamages = candidates.filter((d) => selected.has(d.id));
    const handleExport = () => {
      const html = buildRepairOrderHTML(vehicle, selectedDamages);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Orden_reparacion_${vehicle.id}_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onClose();
    };
    const gravTheme = { GRAVE: { bg: "#FEE2E2", c: "#991B1B" }, MODERADO: { bg: "#FEF3C7", c: "#B45309" }, LEVE: { bg: "#D7EFDA", c: "#1F4D2E" } };
    return /* @__PURE__ */ React.createElement(Modal, { open, onClose, title: `Orden de reparaci\xF3n \xB7 ${vehicle.id}`, width: 620 }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: "14px", color: T.inkSoft, marginTop: 0, lineHeight: 1.6 } }, "Eleg\xED qu\xE9 reparaciones incluir. Se genera una hoja limpia para imprimir y darle al mec\xE1nico, solo con lo seleccionado."), candidates.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "24px", textAlign: "center", color: T.inkFaint, fontStyle: "italic" } }, "Este veh\xEDculo no tiene da\xF1os activos para reparar.") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "13px", color: T.inkSoft } }, selected.size, " de ", candidates.length, " seleccionados"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "6px" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", sm: true, onClick: () => setSelected(new Set(candidates.map((d) => d.id))) }, "Todos"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", sm: true, onClick: () => setSelected(/* @__PURE__ */ new Set()) }, "Ninguno"))), /* @__PURE__ */ React.createElement("div", { style: { maxHeight: "380px", overflowY: "auto", border: `1px solid ${T.border}`, borderRadius: "12px" } }, candidates.map((d) => {
      const g = (d.gravedad || "").toUpperCase();
      const gt = gravTheme[g] || { bg: "#f3f4f6", c: "#374151" };
      const isSel = selected.has(d.id);
      return /* @__PURE__ */ React.createElement("div", { key: d.id, onClick: () => toggle(d.id), style: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 14px",
        borderBottom: `1px solid ${T.border}`,
        cursor: "pointer",
        background: isSel ? "#FFFFFF" : "transparent"
      } }, /* @__PURE__ */ React.createElement("div", { style: {
        width: "20px",
        height: "20px",
        borderRadius: "10px",
        flexShrink: 0,
        border: `2px solid ${isSel ? T.rust : T.border}`,
        background: isSel ? T.rust : "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "14px",
        fontWeight: 700
      } }, isSel ? "\u2713" : ""), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", fontWeight: 600, color: T.ink } }, d.zona || d.description || "Da\xF1o"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkSoft } }, d.tipoDano || "", " ", d.pdfCode ? "\xB7 " + d.pdfCode : "")), g && /* @__PURE__ */ React.createElement("span", { style: { background: gt.bg, color: gt.c, fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", flexShrink: 0 } }, g), (d.requierePiezas || /requiere/i.test(d.piezasText || "")) && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "10px", color: T.inkSoft, flexShrink: 0 } }, "\u{1F527}"));
    })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "18px" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClose }, "Cancelar"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", icon: FileUp, disabled: selected.size === 0, onClick: handleExport }, "Generar orden (", selected.size, ")"))));
  }
  const VehicleDetailView = ({
    vehicle,
    damages,
    onBack,
    onEdit,
    onDelete,
    onToggleBaja,
    onMarkInspected,
    onAddDamage,
    onEditDamage,
    onChangeDamageState,
    onChangeDamageCargo,
    onChangeDamageRepair,
    onDeleteDamage,
    onMarkRepaired,
    onSetWorkflowStatus,
    onOpenRentalModal,
    onConfirmArrival,
    onEditArrivalDate,
    onEditReviewDate,
    onMarkNoNewDamages,
    onClearNextRental,
    requestConfirm
  }) => {
    const status = computeVehicleStatus(vehicle, damages);
    const statusInfo = statusTheme(status);
    const days = vehicle.nextRentalDate ? daysBetween(nowIso(), vehicle.nextRentalDate) : null;
    const locTheme = LOCATION_THEME[vehicle.location];
    const [filterCargo, setFilterCargo] = useState("todos");
    const [filterRepair, setFilterRepair] = useState("activos");
    const [filterGravedad, setFilterGravedad] = useState("todas");
    const [repairOrderOpen, setRepairOrderOpen] = useState(false);
    const [editArrival, setEditArrival] = useState(false);
    const [arrivalDraft, setArrivalDraft] = useState("");
    const [editReview, setEditReview] = useState(false);
    const [reviewDraft, setReviewDraft] = useState("");
    const nuevoDamages = damages.filter((d) => damageCargo(d) === "NUEVO");
    const assumedDamages = damages.filter((d) => damageCargo(d) === "ASUMIDO");
    const quantifiedDamages = damages.filter((d) => damageCargo(d) === "CUANTIFICADO");
    const historicoDamages = damages.filter((d) => damageCargo(d) === "HISTORICO");
    const detectadoDamages = damages.filter((d) => damageRepair(d) === "DETECTADO");
    const enReparacionDamages = damages.filter((d) => damageRepair(d) === "EN_REPARACION");
    const repairedDamages = damages.filter((d) => damageRepair(d) === "REPARADO");
    const activeDamages = damages.filter((d) => damageRepair(d) !== "REPARADO");
    const gravedadCounts = countByGravedad(damages, vehicle.id);
    const visibleDamages = useMemo(() => {
      let arr = damages.slice();
      if (filterCargo !== "todos") arr = arr.filter((d) => damageCargo(d) === filterCargo);
      if (filterRepair === "activos") arr = arr.filter((d) => damageRepair(d) !== "REPARADO");
      else if (filterRepair !== "todos") arr = arr.filter((d) => damageRepair(d) === filterRepair);
      if (filterGravedad !== "todas") arr = arr.filter((d) => d.gravedad === filterGravedad);
      return arr.sort((a, b) => {
        const gA = GRAVEDAD_ORDER[a.gravedad] || 9;
        const gB = GRAVEDAD_ORDER[b.gravedad] || 9;
        if (gA !== gB) return gA - gB;
        const sOrd = { DETECTADO: 1, EN_REPARACION: 2, REPARADO: 3 };
        const sA = sOrd[damageRepair(a)] || 9, sB = sOrd[damageRepair(b)] || 9;
        if (sA !== sB) return sA - sB;
        return (a.id || "").localeCompare(b.id || "", void 0, { numeric: true });
      });
    }, [damages, filterCargo, filterRepair, filterGravedad]);
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onBack,
        style: {
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: T.inkSoft,
          fontFamily: F.body,
          fontSize: "14px",
          fontWeight: 500,
          marginBottom: "14px"
        },
        onMouseEnter: (e) => e.currentTarget.style.color = T.ink,
        onMouseLeave: (e) => e.currentTarget.style.color = T.inkSoft
      },
      /* @__PURE__ */ React.createElement(ArrowLeft, { size: 14 }),
      " Volver a la flota"
    ), /* @__PURE__ */ React.createElement("div", { style: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderLeft: locTheme ? `4px solid ${locTheme.accent}` : `1px solid ${T.border}`,
      borderRadius: "10px",
      padding: "20px 24px",
      marginBottom: "20px"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "20px",
      flexWrap: "wrap"
    } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: "280px" } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: F.mono,
      fontSize: "14px",
      fontWeight: 700,
      color: T.rust,
      letterSpacing: "0.02em",
      marginBottom: "4px"
    } }, vehicle.id), /* @__PURE__ */ React.createElement("h2", { style: {
      margin: 0,
      fontFamily: F.display,
      fontSize: "26px",
      fontWeight: 600,
      letterSpacing: "-0.025em",
      color: T.ink,
      lineHeight: 1.1
    } }, vehicle.brand, " ", vehicle.model || ""), vehicle.vehicleClass && /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: "6px",
      fontSize: "13.5px",
      color: T.inkSoft,
      fontStyle: "italic",
      fontFamily: F.display
    } }, vehicle.vehicleClass), /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: "16px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
      gap: "14px 22px"
    } }, /* @__PURE__ */ React.createElement(DetailField, { label: "Matr\xEDcula", value: vehicle.plate || /* @__PURE__ */ React.createElement("em", { style: { color: T.warn } }, "provisional"), mono: !!vehicle.plate }), /* @__PURE__ */ React.createElement(DetailField, { label: "Bastidor", value: vehicle.vin ? /* @__PURE__ */ React.createElement(VinCopy, { vin: vehicle.vin }) : "\u2014", small: true }), /* @__PURE__ */ React.createElement(DetailField, { label: "Ubicaci\xF3n", value: vehicle.location ? /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: "4px", color: locTheme?.color } }, /* @__PURE__ */ React.createElement(MapPin, { size: 11 }), " ", vehicle.location) : "\u2014" }), /* @__PURE__ */ React.createElement(DetailField, { label: "Pr\xF3xima salida", value: vehicle.nextRentalDate ? /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ React.createElement("span", null, formatDate(vehicle.nextRentalDate), days !== null && days >= 0 && days <= 7 && /* @__PURE__ */ React.createElement("span", { style: { color: days <= 3 ? T.rust : T.warn, marginLeft: "5px", fontSize: "11px", fontWeight: 600 } }, "(", days === 0 ? "hoy" : days === 1 ? "ma\xF1ana" : `${days}d`, ")")), onClearNextRental && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => onClearNextRental(vehicle.id),
        title: "Borrar pr\xF3xima salida",
        style: {
          background: "transparent",
          border: `1px solid ${T.border}`,
          borderRadius: "8px",
          cursor: "pointer",
          color: T.inkSoft,
          fontSize: "10px",
          padding: "1px 6px",
          fontFamily: F.body
        }
      },
      "borrar"
    )) : "\u2014" }), vehicle.nextRentalEndDate && /* @__PURE__ */ React.createElement(DetailField, { label: "Devoluci\xF3n prevista", value: /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: "6px" } }, formatDate(vehicle.nextRentalEndDate), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "10px", color: T.inkFaint } }, "(seg\xFAn reserva HQ)")) }), /* @__PURE__ */ React.createElement(DetailField, { label: "\xDAltima inspecci\xF3n", value: formatDate(vehicle.lastInspectedAt) })), (vehicle.otNotes || vehicle.notes) && /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: "14px",
      padding: "12px 16px",
      background: "#FFF8E6",
      border: `1px solid #E8C36B`,
      borderLeft: `4px solid ${T.rust}`,
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(168,53,15,0.10)"
    } },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "7px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: T.rust } }, /* @__PURE__ */ React.createElement(FileText, { size: 13 }), "Notas"),
      vehicle.otNotes && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", color: T.ink, lineHeight: 1.5, whiteSpace: "pre-wrap", fontWeight: 500 } }, vehicle.otNotes && vehicle.notes ? /* @__PURE__ */ React.createElement("span", { style: { display: "block", fontSize: "10px", fontWeight: 700, color: T.inkFaint, letterSpacing: "0.05em", marginBottom: "2px" } }, "DE LA OT") : null, vehicle.otNotes),
      vehicle.otNotes && vehicle.notes && /* @__PURE__ */ React.createElement("div", { style: { height: "1px", background: "#E8C36B", opacity: 0.55, margin: "9px 0" } }),
      vehicle.notes && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13.5px", color: T.inkSoft, lineHeight: 1.5, whiteSpace: "pre-wrap", fontStyle: "italic" } }, vehicle.otNotes ? /* @__PURE__ */ React.createElement("span", { style: { display: "block", fontStyle: "normal", fontSize: "10px", fontWeight: 700, color: T.inkFaint, letterSpacing: "0.05em", marginBottom: "2px" } }, "MANUAL") : null, vehicle.notes)
    ), isForcedReady(vehicle, damages) && /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: "14px",
      padding: "10px 14px",
      background: "#FEF1E1",
      borderLeft: `3px solid ${T.warn}`,
      borderRadius: "8px",
      fontSize: "13.5px",
      color: "#B45309",
      display: "flex",
      alignItems: "flex-start",
      gap: "8px"
    } }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 14, style: { flexShrink: 0, marginTop: "1px" } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "Salida con da\xF1os activos."), " Este veh\xEDculo est\xE1 marcado como LISTO pero tiene", " ", activeDamages.length, " da\xF1o", activeDamages.length === 1 ? "" : "s", " sin reparar. Los da\xF1os siguen registrados y activos."))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", minWidth: "210px" } }, /* @__PURE__ */ React.createElement(
      WorkflowStatusControl,
      {
        currentStatus: status,
        onSetStatus: (newStatus) => onSetWorkflowStatus(vehicle.id, newStatus),
        activeDamageCount: activeDamages.length,
        requestConfirm
      }
    ), status === "LISTO" && onOpenRentalModal && /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: () => onOpenRentalModal(vehicle), sm: true }, "\u2192 Entregar a cliente"), status === "DEVUELTO" && isPendingArrivalConfirmation(vehicle) && onConfirmArrival && /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: () => onConfirmArrival(vehicle.id), icon: CheckCircle, sm: true }, "Confirmar llegada f\xEDsica"), vehicle.arrivalConfirmed && vehicle.lastReturnAt && onEditArrivalDate && (!editArrival ? /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", sm: true, onClick: () => {
      const d = new Date(vehicle.lastReturnAt);
      const pad = (n) => String(n).padStart(2, "0");
      const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      setArrivalDraft(local);
      setEditArrival(true);
    } }, "\u{1F553} Editar fecha de llegada") : /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "datetime-local",
        value: arrivalDraft,
        onChange: (e) => setArrivalDraft(e.target.value),
        style: { fontSize: 12, padding: "4px 7px", border: `1px solid ${T.border}`, borderRadius: 6 }
      }
    ), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", sm: true, onClick: () => {
      if (arrivalDraft) {
        onEditArrivalDate(vehicle.id, new Date(arrivalDraft).toISOString());
      }
      setEditArrival(false);
    } }, "Guardar"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", sm: true, onClick: () => setEditArrival(false) }, "Cancelar"))), vehicle.lastInspectedAt && onEditReviewDate && (!editReview ? /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", sm: true, onClick: () => {
      const d = new Date(vehicle.lastInspectedAt);
      const pad = (n) => String(n).padStart(2, "0");
      const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      setReviewDraft(local);
      setEditReview(true);
    } }, "\u{1F50D} Editar fecha de revisi\xF3n") : /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "datetime-local",
        value: reviewDraft,
        onChange: (e) => setReviewDraft(e.target.value),
        style: { fontSize: 12, padding: "4px 7px", border: `1px solid ${T.border}`, borderRadius: 6 }
      }
    ), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", sm: true, onClick: () => {
      if (reviewDraft) {
        onEditReviewDate(vehicle.id, new Date(reviewDraft).toISOString());
      }
      setEditReview(false);
    } }, "Guardar"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", sm: true, onClick: () => setEditReview(false) }, "Cancelar"))), onMarkNoNewDamages && vehicle.lastInspectedAt && (vehicle.lastReturnHasNewDamages === false ? /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: () => onMarkNoNewDamages(vehicle.id, false), sm: true }, "\u21BB S\xED hay da\xF1os nuevos") : /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: () => onMarkNoNewDamages(vehicle.id, true), sm: true }, "\u2713 Sin da\xF1os nuevos")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "6px", marginTop: "4px" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onMarkInspected, icon: CheckCircle, sm: true }, "Marcar inspeccionado")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" } }, vehicle.baja && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "10px", fontWeight: 800, color: "#B45309", background: "#FEF3C7", padding: "3px 8px", borderRadius: "999px", letterSpacing: "0.04em" } }, "FUERA DE FLOTA (BAJA)"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onEdit, icon: Edit2, sm: true }, "Editar"), onToggleBaja && /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: () => onToggleBaja(vehicle.id), sm: true }, vehicle.baja ? "↻ Reactivar en flota" : "Dar de baja"), /* @__PURE__ */ React.createElement(Btn, { variant: "danger", onClick: onDelete, icon: Trash2, sm: true }, "Eliminar"))))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "24px" } }, /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px"
    } }, /* @__PURE__ */ React.createElement("h3", { style: {
      margin: 0,
      fontFamily: F.display,
      fontSize: "20px",
      fontWeight: 600,
      letterSpacing: "-0.015em",
      color: T.ink
    } }, "Da\xF1os", /* @__PURE__ */ React.createElement("span", { style: {
      marginLeft: "10px",
      fontSize: "14px",
      color: T.inkSoft,
      fontWeight: 400,
      fontFamily: F.body
    } }, "\xB7 ", activeDamages.length, " activo", activeDamages.length === 1 ? "" : "s", " \xB7 ", repairedDamages.length, " reparado", repairedDamages.length === 1 ? "" : "s")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px" } }, activeDamages.length > 0 && /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: () => setRepairOrderOpen(true), icon: ClipboardList, sm: true }, "Orden de reparaci\xF3n"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: onAddDamage, icon: Plus, sm: true }, "Nuevo da\xF1o"))), damages.length > 0 && /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      gap: "14px",
      alignItems: "center",
      flexWrap: "wrap",
      marginBottom: "12px",
      padding: "10px 12px",
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: "10px"
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.inkFaint, marginRight: "2px" } }, "Cargo:"), [
      { id: "todos", label: `Todos \xB7 ${damages.length}` },
      ...nuevoDamages.length > 0 ? [{ id: "NUEVO", label: `Nuevos \xB7 ${nuevoDamages.length}` }] : [],
      { id: "CUANTIFICADO", label: `Cuantificados \xB7 ${quantifiedDamages.length}` },
      { id: "ASUMIDO", label: `Asumidos \xB7 ${assumedDamages.length}` },
      ...historicoDamages.length > 0 ? [{ id: "HISTORICO", label: `Hist\xF3ricos \xB7 ${historicoDamages.length}` }] : []
    ].map((opt) => /* @__PURE__ */ React.createElement(
      FilterChip,
      {
        key: opt.id,
        active: filterCargo === opt.id,
        onClick: () => setFilterCargo(opt.id)
      },
      opt.label
    ))), /* @__PURE__ */ React.createElement("div", { style: { height: "20px", width: "1px", background: T.border } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.inkFaint, marginRight: "2px" } }, "Reparaci\xF3n:"), [
      { id: "activos", label: `Activos \xB7 ${activeDamages.length}` },
      { id: "DETECTADO", label: `Detectado \xB7 ${detectadoDamages.length}` },
      { id: "EN_REPARACION", label: `En reparaci\xF3n \xB7 ${enReparacionDamages.length}` },
      { id: "REPARADO", label: `Reparado \xB7 ${repairedDamages.length}` },
      { id: "todos", label: `Todas` }
    ].map((opt) => /* @__PURE__ */ React.createElement(
      FilterChip,
      {
        key: opt.id,
        active: filterRepair === opt.id,
        onClick: () => setFilterRepair(opt.id)
      },
      opt.label
    ))), /* @__PURE__ */ React.createElement("div", { style: { height: "20px", width: "1px", background: T.border } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "4px", alignItems: "center" } }, /* @__PURE__ */ React.createElement(Filter, { size: 12, style: { color: T.inkFaint } }), /* @__PURE__ */ React.createElement(
      FilterChip,
      {
        active: filterGravedad === "todas",
        onClick: () => setFilterGravedad("todas")
      },
      "Todas"
    ), ["GRAVE", "MODERADO", "LEVE"].map((g) => {
      const th = GRAVEDAD_THEME[g];
      const count = gravedadCounts[g];
      return /* @__PURE__ */ React.createElement(
        FilterChip,
        {
          key: g,
          active: filterGravedad === g,
          onClick: () => setFilterGravedad(g),
          accent: th.accent,
          activeBg: th.accent
        },
        th.label.toLowerCase(),
        " ",
        count > 0 && /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.75, marginLeft: 2 } }, "\xB7 ", count)
      );
    }))), damages.length === 0 ? /* @__PURE__ */ React.createElement(
      EmptyState,
      {
        icon: AlertTriangle,
        title: "Sin da\xF1os registrados",
        message: "Carg\xE1 una OT en PDF desde el header o registra los da\xF1os manualmente.",
        action: /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onAddDamage, icon: Plus, sm: true }, "Registrar primer da\xF1o"),
        small: true
      }
    ) : visibleDamages.length === 0 ? /* @__PURE__ */ React.createElement(
      EmptyState,
      {
        icon: Filter,
        title: "Sin da\xF1os que coincidan",
        message: "Ajust\xE1 los filtros para ver m\xE1s resultados.",
        small: true
      }
    ) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "6px" } }, visibleDamages.map((d) => /* @__PURE__ */ React.createElement(
      DamageRow,
      {
        key: d.id,
        damage: d,
        onEdit: () => onEditDamage(d),
        onChangeState: (st) => onChangeDamageState(d.id, st),
        onChangeCargo: (c) => onChangeDamageCargo(d.id, c),
        onChangeRepair: (r) => onChangeDamageRepair(d.id, r),
        onDelete: () => onDeleteDamage(d.id),
        onMarkRepaired: () => onMarkRepaired(d.id)
      }
    )))), /* @__PURE__ */ React.createElement(
      RepairOrderModal,
      {
        open: repairOrderOpen,
        onClose: () => setRepairOrderOpen(false),
        vehicle,
        damages
      }
    ));
  };
  const FilterChip = ({ active, onClick, accent, activeBg, children }) => {
    const [hover, setHover] = useState(false);
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          background: active ? activeBg || T.ink : hover ? T.bgAlt : "transparent",
          color: active ? "#FFFFFF" : T.inkSoft,
          border: `1px solid ${active ? activeBg || T.ink : T.border}`,
          padding: "4px 11px",
          borderRadius: "999px",
          fontSize: "11.5px",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: F.body,
          transition: "all 120ms",
          letterSpacing: "0.01em",
          whiteSpace: "nowrap"
        }
      },
      children
    );
  };
  const DetailField = ({ label, value, mono, small }) => /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: "9.5px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 700,
    color: T.inkFaint,
    marginBottom: "3px"
  } }, label), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: small ? "11.5px" : "13px",
    color: T.ink,
    fontWeight: 600,
    fontFamily: mono ? F.mono : F.body
  } }, value));
  const DamageRow = ({ damage, onEdit, onChangeState, onChangeCargo, onChangeRepair, onDelete, onMarkRepaired }) => {
    const sm = DAMAGE_STATES[damage.state] || DAMAGE_STATES.DETECTADO;
    const grav = damage.gravedad ? GRAVEDAD_THEME[damage.gravedad] : null;
    const isResolved = damageRepair(damage) === "REPARADO";
    const zona = damage.zona || "";
    const tipoDano = damage.tipoDano || "";
    const description = damage.description || buildDamageDescription(zona, tipoDano);
    return /* @__PURE__ */ React.createElement("div", { style: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderLeft: `3px solid ${grav ? grav.accent : sm.accent}`,
      borderRadius: "10px",
      padding: "12px 16px",
      display: "grid",
      gridTemplateColumns: "1.2fr 2.5fr 1.4fr auto",
      gap: "14px",
      alignItems: "center",
      opacity: isResolved ? 0.7 : 1
    } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: {
      fontFamily: F.mono,
      fontSize: "13px",
      fontWeight: 700,
      color: T.ink,
      letterSpacing: "-0.01em"
    } }, damage.id), grav && /* @__PURE__ */ React.createElement("span", { style: {
      background: grav.bg,
      color: grav.color,
      padding: "1px 7px",
      borderRadius: "8px",
      fontSize: "9.5px",
      fontWeight: 700,
      fontFamily: F.body,
      letterSpacing: "0.06em",
      textTransform: "uppercase"
    } }, grav.label)), damage.pdfCode ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkFaint, marginTop: "3px", fontFamily: F.mono, lineHeight: 1.4 } }, damage.pdfCode) : damage.code ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10.5px", color: T.inkFaint, marginTop: "2px" } }, "cod. form: ", /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, fontWeight: 600, color: T.inkSoft } }, damage.code)) : null, damage.sourceFile && /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: "9.5px",
      color: T.inkFaint,
      marginTop: "3px",
      display: "inline-flex",
      alignItems: "center",
      gap: "3px",
      fontStyle: "italic"
    } }, /* @__PURE__ */ React.createElement(FileText, { size: 9 }), " OT importada"), (() => {
      const added = damage.importedAt || damage.detectedAt || damage.createdAt;
      if (!added) return null;
      const days = daysBetween(added, nowIso());
      const repaired = damageRepair(damage) === "REPARADO";
      const ageColor = repaired ? T.inkFaint : days >= 10 ? T.danger : days >= 5 ? T.warn : T.inkSoft;
      const ageText = days === 0 ? "hoy" : days === 1 ? "hace 1 d\xEDa" : `hace ${days} d\xEDas`;
      return /* @__PURE__ */ React.createElement("div", { style: {
        fontSize: "9.5px",
        color: ageColor,
        marginTop: "3px",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontWeight: !repaired && days >= 5 ? 700 : 400
      } }, /* @__PURE__ */ React.createElement(Calendar, { size: 9 }), formatDate(added), /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.85 } }, "\xB7 ", repaired ? `reparado` : `${ageText} sin reparar`));
    })()), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", color: T.ink, fontWeight: 500, lineHeight: 1.4 } }, description || /* @__PURE__ */ React.createElement("span", { style: { color: T.inkFaint, fontStyle: "italic" } }, "Sin descripci\xF3n")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "10px", alignItems: "center", marginTop: "4px", flexWrap: "wrap" } }, damage.tipoReparacion && /* @__PURE__ */ React.createElement("span", { style: {
      fontSize: "10.5px",
      color: T.inkSoft,
      display: "inline-flex",
      alignItems: "center",
      gap: "3px"
    } }, /* @__PURE__ */ React.createElement(Wrench, { size: 10 }), "Taller ", damage.tipoReparacion), damage.requierePiezas && /* @__PURE__ */ React.createElement("span", { style: {
      fontSize: "10.5px",
      color: T.warn,
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
      gap: "3px"
    } }, /* @__PURE__ */ React.createElement(Settings, { size: 10 }), " Requiere piezas"), damage.location && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "10.5px", color: T.inkSoft, display: "inline-flex", alignItems: "center", gap: "3px" } }, /* @__PURE__ */ React.createElement(MapPin, { size: 10 }), " ", damage.location)), (damage.cost || damage.hoursLabor) && /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: "11px",
      color: T.inkSoft,
      marginTop: "4px",
      display: "flex",
      gap: "14px",
      fontFamily: F.mono
    } }, damage.cost && /* @__PURE__ */ React.createElement("span", null, "\u20AC ", damage.cost), damage.hoursLabor && /* @__PURE__ */ React.createElement("span", null, damage.hoursLabor, "h"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "5px" } }, (() => {
      const cargo = damageCargo(damage);
      const cm = CARGO_STATES[cargo] || CARGO_STATES.NUEVO;
      return /* @__PURE__ */ React.createElement(
        "select",
        {
          value: cargo,
          onChange: (e) => onChangeCargo && onChangeCargo(e.target.value),
          title: "Cargo: qui\xE9n paga",
          style: {
            background: cm.bg,
            color: cm.color,
            border: `1px solid ${cm.accent}`,
            padding: "3px 8px",
            borderRadius: "999px",
            fontSize: "10.5px",
            fontWeight: 700,
            fontFamily: F.body,
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            outline: "none",
            appearance: "none",
            WebkitAppearance: "none",
            paddingRight: "22px",
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(cm.color)}' stroke-width='2.5'><polyline points='6 9 12 15 18 9'/></svg>")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 7px center"
          }
        },
        Object.keys(CARGO_STATES).map((k) => /* @__PURE__ */ React.createElement("option", { key: k, value: k }, CARGO_STATES[k].label))
      );
    })(), (() => {
      const repair = damageRepair(damage);
      const rm = REPAIR_STATES[repair] || REPAIR_STATES.DETECTADO;
      return /* @__PURE__ */ React.createElement(
        "select",
        {
          value: repair,
          onChange: (e) => onChangeRepair && onChangeRepair(e.target.value),
          title: "Estado de reparaci\xF3n",
          style: {
            background: rm.bg,
            color: rm.color,
            border: `1px solid ${rm.accent}`,
            padding: "3px 8px",
            borderRadius: "999px",
            fontSize: "10.5px",
            fontWeight: 700,
            fontFamily: F.body,
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            outline: "none",
            appearance: "none",
            WebkitAppearance: "none",
            paddingRight: "22px",
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(rm.color)}' stroke-width='2.5'><polyline points='6 9 12 15 18 9'/></svg>")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 7px center"
          }
        },
        Object.keys(REPAIR_STATES).map((k) => /* @__PURE__ */ React.createElement("option", { key: k, value: k }, REPAIR_STATES[k].label))
      );
    })()), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "2px", alignItems: "center" } }, !isResolved && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onMarkRepaired,
        title: "Marcar reparado",
        style: {
          background: T.surface,
          color: T.ok,
          border: `1px solid #B8DBC0`,
          padding: "5px 9px",
          borderRadius: "10px",
          fontSize: "11px",
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: F.body,
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          letterSpacing: "0.01em",
          transition: "all 120ms",
          marginRight: "4px"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "#D7EFDA";
          e.currentTarget.style.borderColor = T.ok;
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = T.surface;
          e.currentTarget.style.borderColor = "#B8DBC0";
        }
      },
      /* @__PURE__ */ React.createElement(CheckCircle, { size: 12 }),
      "Reparado"
    ), /* @__PURE__ */ React.createElement(IconButton, { icon: Edit2, onClick: onEdit, label: "Editar" }), /* @__PURE__ */ React.createElement(IconButton, { icon: Trash2, onClick: onDelete, label: "Eliminar" })));
  };
  const IconButton = ({ icon: Icon, onClick, label }) => {
    const [hover, setHover] = useState(false);
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick,
        "aria-label": label,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          background: hover ? T.bgAlt : "transparent",
          border: "none",
          cursor: "pointer",
          padding: "6px",
          color: hover ? T.ink : T.inkSoft,
          display: "flex",
          borderRadius: "8px",
          transition: "all 120ms"
        }
      },
      /* @__PURE__ */ React.createElement(Icon, { size: 13 })
    );
  };
  const EmptyState = ({ icon: Icon, title, message, action, small }) => /* @__PURE__ */ React.createElement("div", { style: {
    background: T.surface,
    border: `1px dashed ${T.borderHi}`,
    borderRadius: "10px",
    padding: small ? "32px 24px" : "56px 24px",
    textAlign: "center"
  } }, /* @__PURE__ */ React.createElement(Icon, { size: small ? 28 : 36, style: { color: T.inkFaint, marginBottom: "10px" }, strokeWidth: 1.5 }), /* @__PURE__ */ React.createElement("h3", { style: {
    margin: "0 0 6px",
    fontFamily: F.display,
    fontSize: small ? "15px" : "18px",
    fontWeight: 600,
    color: T.ink,
    letterSpacing: "-0.01em"
  } }, title), /* @__PURE__ */ React.createElement("p", { style: {
    margin: "0 0 16px",
    color: T.inkSoft,
    fontSize: "14px",
    maxWidth: "420px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: 1.5
  } }, message), action);
  const VehicleModal = ({ open, mode, initial, existingIds, onClose, onSave }) => {
    const [form, setForm] = useState(initial);
    const [error, setError] = useState("");
    useEffect(() => {
      setForm(initial);
      setError("");
    }, [initial]);
    if (!open) return null;
    const isEdit = mode === "edit";
    const submit = () => {
      setError("");
      const f = { ...form, id: (form.id || "").trim().toUpperCase() };
      if (!isEdit && !f.id) return setError("El ID es obligatorio (ej: AC-327, CB-008).");
      if (!isEdit && existingIds.includes(f.id)) return setError("Ya existe un veh\xEDculo con ese ID.");
      if (!f.brand?.trim()) return setError("La marca es obligatoria.");
      onSave(f);
    };
    return /* @__PURE__ */ React.createElement(Modal, { open: true, onClose, title: isEdit ? `Editar ${initial.id}` : "Nuevo veh\xEDculo", width: 560 }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: "14px" } }, !isEdit && /* @__PURE__ */ React.createElement(Field, { label: "ID del veh\xEDculo", required: true, hint: "Ser\xE1 el prefijo de los IDs de da\xF1os (ej: AC-327-D001)" }, /* @__PURE__ */ React.createElement(Input, { value: form.id, onChange: (v) => setForm((f) => ({ ...f, id: v.toUpperCase() })), placeholder: "AC-327", mono: true, autoFocus: true })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } }, /* @__PURE__ */ React.createElement(Field, { label: "Marca", required: true }, /* @__PURE__ */ React.createElement(Input, { value: form.brand, onChange: (v) => setForm((f) => ({ ...f, brand: v })), placeholder: "Benimar / Roller Team / Mc Louis" })), /* @__PURE__ */ React.createElement(Field, { label: "Matr\xEDcula", hint: "Vac\xEDo si es provisional" }, /* @__PURE__ */ React.createElement(Input, { value: form.plate, onChange: (v) => setForm((f) => ({ ...f, plate: v })), placeholder: "1234ABC", mono: true }))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } }, /* @__PURE__ */ React.createElement(Field, { label: "Modelo" }, /* @__PURE__ */ React.createElement(Input, { value: form.model, onChange: (v) => setForm((f) => ({ ...f, model: v })), placeholder: "Tessoro 463" })), /* @__PURE__ */ React.createElement(Field, { label: "Bastidor (VIN)" }, /* @__PURE__ */ React.createElement(Input, { value: form.vin, onChange: (v) => setForm((f) => ({ ...f, vin: v })), mono: true }))), /* @__PURE__ */ React.createElement(Field, { label: "Clase / Tipo" }, /* @__PURE__ */ React.createElement(Input, { value: form.vehicleClass, onChange: (v) => setForm((f) => ({ ...f, vehicleClass: v })), placeholder: "Family Plus +. Camas Gemelas. PAX 4/5 G" })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } }, /* @__PURE__ */ React.createElement(Field, { label: "Ubicaci\xF3n" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: form.location,
        onChange: (v) => setForm((f) => ({ ...f, location: v })),
        options: [
          { value: "Valencia", label: "Valencia" },
          { value: "Onil", label: "Onil" },
          { value: "Castell\xF3n", label: "Castell\xF3n" },
          { value: "Alicante", label: "Alicante" },
          { value: "", label: "Otra / sin asignar" }
        ]
      }
    )), /* @__PURE__ */ React.createElement(Field, { label: "Pr\xF3xima salida planificada", hint: "Cu\xE1ndo sale a su pr\xF3ximo alquiler. Se usa para ordenar y priorizar las tareas." }, /* @__PURE__ */ React.createElement(Input, { type: "date", value: form.nextRentalDate ? form.nextRentalDate.slice(0, 10) : "", onChange: (v) => setForm((f) => ({ ...f, nextRentalDate: v })) }))), /* @__PURE__ */ React.createElement(Field, { label: "Notas" }, /* @__PURE__ */ React.createElement(Textarea, { value: form.notes, onChange: (v) => setForm((f) => ({ ...f, notes: v })), placeholder: "Observaciones generales", rows: 2 }))), error && /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: "14px",
      padding: "8px 12px",
      background: "#E9EEFC",
      color: T.danger,
      fontSize: "13.5px",
      fontWeight: 600,
      borderRadius: "10px",
      borderLeft: `3px solid ${T.danger}`
    } }, error), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "20px" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClose }, "Cancelar"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: submit, icon: Save }, isEdit ? "Guardar cambios" : "Guardar veh\xEDculo")));
  };
  const DamageModal = ({ open, mode, initial, vehicleId, previewId, onClose, onSave }) => {
    const [form, setForm] = useState(initial);
    useEffect(() => {
      setForm(initial);
    }, [initial]);
    if (!open) return null;
    const isEdit = mode === "edit";
    return /* @__PURE__ */ React.createElement(Modal, { open: true, onClose, title: isEdit ? `Editar ${initial.id}` : "Nuevo da\xF1o", width: 560 }, /* @__PURE__ */ React.createElement("div", { style: {
      background: T.bgAlt,
      padding: "10px 14px",
      borderRadius: "10px",
      marginBottom: "18px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      border: `1px solid ${T.border}`
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: "9.5px",
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      fontWeight: 700,
      color: T.inkFaint
    } }, "ID persistente"), /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: F.mono,
      fontSize: "15px",
      fontWeight: 700,
      color: T.rust,
      letterSpacing: "-0.01em"
    } }, previewId), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkSoft, marginLeft: "auto", fontStyle: "italic" } }, isEdit ? "No cambia al editar" : "Se mantiene en todas las inspecciones")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: "14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } }, /* @__PURE__ */ React.createElement(Field, { label: "Zona / Elemento", hint: "Ej: Paragolpes trasero, Techo, Mesa" }, /* @__PURE__ */ React.createElement(Input, { value: form.zona, onChange: (v) => setForm((f) => ({ ...f, zona: v })), placeholder: "Paragolpes trasero" })), /* @__PURE__ */ React.createElement(Field, { label: "Tipo de da\xF1o" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: form.tipoDano || "",
        onChange: (v) => setForm((f) => ({ ...f, tipoDano: v })),
        options: [
          { value: "", label: "\u2014 Sin especificar \u2014" },
          { value: "Golpe / Abolladura", label: "Golpe / Abolladura" },
          { value: "Rotura", label: "Rotura" },
          { value: "Rayadura", label: "Rayadura" },
          { value: "Faltante", label: "Faltante" },
          { value: "Rasgu\xF1o", label: "Rasgu\xF1o" },
          { value: "Defecto", label: "Defecto" },
          { value: "Mancha", label: "Mancha" }
        ]
      }
    ))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" } }, /* @__PURE__ */ React.createElement(Field, { label: "Gravedad" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: form.gravedad || "",
        onChange: (v) => setForm((f) => ({ ...f, gravedad: v })),
        options: [
          { value: "", label: "\u2014 Sin clasificar \u2014" },
          { value: "GRAVE", label: "GRAVE" },
          { value: "MODERADO", label: "MODERADO" },
          { value: "LEVE", label: "LEVE" }
        ]
      }
    )), /* @__PURE__ */ React.createElement(Field, { label: "Taller" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: form.tipoReparacion || "",
        onChange: (v) => setForm((f) => ({ ...f, tipoReparacion: v })),
        options: [
          { value: "", label: "\u2014 No definido \u2014" },
          { value: "propio", label: "Propio" },
          { value: "externo", label: "Externo" }
        ]
      }
    )), /* @__PURE__ */ React.createElement(Field, { label: "\xBFRequiere piezas?" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: form.requierePiezas ? "si" : form.requierePiezas === false ? "no" : "",
        onChange: (v) => setForm((f) => ({ ...f, requierePiezas: v === "si" ? true : v === "no" ? false : void 0 })),
        options: [
          { value: "", label: "\u2014 No definido \u2014" },
          { value: "no", label: "No" },
          { value: "si", label: "S\xED" }
        ]
      }
    ))), /* @__PURE__ */ React.createElement(Field, { label: "Descripci\xF3n / detalle" }, /* @__PURE__ */ React.createElement(Textarea, { value: form.description, onChange: (v) => setForm((f) => ({ ...f, description: v })), placeholder: "Ray\xF3n profundo de 15cm con pintura levantada", rows: 2 })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } }, /* @__PURE__ */ React.createElement(Field, { label: "C\xF3digo en formulario", hint: "Si lo registraste con c\xF3digo manual (A1, B3...)" }, /* @__PURE__ */ React.createElement(Input, { value: form.code, onChange: (v) => setForm((f) => ({ ...f, code: v })), placeholder: "A3", mono: true })), /* @__PURE__ */ React.createElement(Field, { label: "Ubicaci\xF3n del da\xF1o" }, /* @__PURE__ */ React.createElement(Input, { value: form.location, onChange: (v) => setForm((f) => ({ ...f, location: v })), placeholder: "Lateral derecho..." }))), /* @__PURE__ */ React.createElement(Field, { label: "Estado" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: form.state,
        onChange: (v) => setForm((f) => ({ ...f, state: v })),
        options: Object.keys(DAMAGE_STATES).map((k) => ({ value: k, label: DAMAGE_STATES[k].label }))
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } }, /* @__PURE__ */ React.createElement(Field, { label: "Coste estimado (\u20AC)" }, /* @__PURE__ */ React.createElement(Input, { type: "number", value: form.cost, onChange: (v) => setForm((f) => ({ ...f, cost: v })), placeholder: "145" })), /* @__PURE__ */ React.createElement(Field, { label: "Horas de M.O." }, /* @__PURE__ */ React.createElement(Input, { type: "number", value: form.hoursLabor, onChange: (v) => setForm((f) => ({ ...f, hoursLabor: v })), placeholder: "2.5" }))), /* @__PURE__ */ React.createElement(Field, { label: "Notas internas" }, /* @__PURE__ */ React.createElement(Textarea, { value: form.notes, onChange: (v) => setForm((f) => ({ ...f, notes: v })), placeholder: "Observaciones, proveedor, n\xB0 de presupuesto...", rows: 2 })), form.pdfCode && /* @__PURE__ */ React.createElement("div", { style: {
      background: T.bgAlt,
      padding: "8px 12px",
      borderRadius: "10px",
      fontSize: "11px",
      color: T.inkSoft,
      fontFamily: F.mono,
      borderLeft: `2px solid ${T.borderHi}`
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "2px", fontFamily: F.body } }, "C\xF3digo OT (no editable)"), form.pdfCode)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "20px" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClose }, "Cancelar"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: () => onSave(form), icon: Save }, isEdit ? "Guardar cambios" : "Guardar da\xF1o")));
  };
  const ImportPdfModal = ({ open, onClose, vehicles, existingDamages, onConfirm, initialFiles, onInitialConsumed, allowEmpty }) => {
    const [stage, setStage] = useState("upload");
    const [error, setError] = useState("");
    const [parsedResults, setParsedResults] = useState([]);
    const [orderSelection, setOrderSelection] = useState({});
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef(null);
    const handleFilesRef = useRef(null);
    useEffect(() => {
      if (!open) {
        setStage("upload");
        setError("");
        setParsedResults([]);
        setDragOver(false);
      }
    }, [open]);
    useEffect(() => {
      if (open && initialFiles && initialFiles.length > 0) {
        handleFilesRef.current?.(initialFiles);
        onInitialConsumed?.();
      }
    }, [open, initialFiles]);
    if (!open) return null;
    const handleFiles = async (filesList) => {
      const files = Array.from(filesList).filter(
        (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name) || f.type === "text/html" || /\.html?$/i.test(f.name)
      );
      if (!files.length) {
        setError("Selecciona uno o m\xE1s archivos PDF o HTML.");
        return;
      }
      setError("");
      setStage("parsing");
      const results = [];
      for (const file of files) {
        try {
          const isHtml = file.type === "text/html" || /\.html?$/i.test(file.name);
          const parsed = isHtml ? await parseOrdenTrabajoHTML(file) : await parseOrdenTrabajo(file);
          const norm = (s) => (s || "").toString().toUpperCase().replace(/\s+/g, "").trim();
          const pdfId = norm(parsed.header.identificador);
          const pdfPlate = norm(parsed.header.matricula);
          let vehicle = pdfId ? vehicles.find((v) => norm(v.id) === pdfId) : null;
          let matchedBy = vehicle ? "id" : null;
          if (!vehicle && pdfPlate) {
            vehicle = vehicles.find((v) => norm(v.plate) === pdfPlate);
            if (vehicle) matchedBy = "plate";
          }
          let classified = [], missing = [];
          if (vehicle) {
            const result = reconcileOT(parsed.damages, existingDamages, vehicle.id);
            classified = result.classified;
            missing = result.missing.map((m) => ({ ...m, _action: "keep" }));
          } else {
            classified = parsed.damages.map((d, idx) => ({ ...d, _idx: idx, _category: "new", _selected: false }));
          }
          results.push({
            file,
            parsed,
            vehicle,
            matchedBy,
            damages: classified,
            missing,
            error: null
          });
        } catch (err) {
          results.push({
            file,
            parsed: null,
            vehicle: null,
            damages: [],
            missing: [],
            error: err.message || String(err)
          });
        }
      }
      setParsedResults(results);
      setStage("preview");
    };
    handleFilesRef.current = handleFiles;
    const handleDrop = (e) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
    };
    const toggleDamage = (fileIdx, dmgIdx) => {
      setParsedResults((prev) => prev.map((r, i) => {
        if (i !== fileIdx) return r;
        return {
          ...r,
          damages: r.damages.map((d) => d._idx === dmgIdx ? { ...d, _selected: !d._selected } : d)
        };
      }));
    };
    const setDamageDecision = (fileIdx, dmgIdx, decision) => {
      setParsedResults((prev) => prev.map((r, i) => {
        if (i !== fileIdx) return r;
        return {
          ...r,
          damages: r.damages.map((d) => {
            if (d._idx !== dmgIdx) return d;
            const sel = decision === "different" || decision === "new";
            return { ...d, _decision: decision, _selected: sel };
          })
        };
      }));
    };
    const setMissingAction = (fileIdx, damageId, action) => {
      setParsedResults((prev) => prev.map((r, i) => {
        if (i !== fileIdx) return r;
        return {
          ...r,
          missing: (r.missing || []).map((m) => m.id === damageId ? { ...m, _action: action } : m)
        };
      }));
    };
    const setAllMissingAction = (fileIdx, action) => {
      setParsedResults((prev) => prev.map((r, i) => {
        if (i !== fileIdx) return r;
        return { ...r, missing: (r.missing || []).map((m) => ({ ...m, _action: action })) };
      }));
    };
    const setAllForFile = (fileIdx, selected) => {
      setParsedResults((prev) => prev.map((r, i) => {
        if (i !== fileIdx) return r;
        return {
          ...r,
          damages: r.damages.map((d) => {
            if (d._category === "exact") return { ...d, _selected: false };
            if (d._category === "similar") {
              return { ...d, _selected: selected ? d._decision === "different" : false };
            }
            return { ...d, _selected: selected };
          })
        };
      }));
    };
    const handleConfirm = () => {
     const payload = parsedResults.filter((r) => r.parsed && r.vehicle).map((r) => ({
  vehicleId: r.vehicle.id,
  sourceFile: r.file.name,
  inicioOT: r.parsed?.header?.inicioOT || "",
  otNota: (r.parsed?.header?.otNota || "").trim(),
  damages: r.damages.filter((d) => d._selected),
        // Damages to mark as repaired (missing from this OT + user chose 'repair')
        markRepaired: (r.missing || []).filter((m) => m._action === "repair").map((m) => m.id)
      })).filter((p) => allowEmpty || p.damages.length > 0 || p.markRepaired.length > 0 || (p.otNota && p.otNota.length > 0));
      // allowEmpty (OT de la nube): una revisión sin daños nuevos también se confirma y deja el vehículo REVISADO.
      const partsToOrder = [];
      parsedResults.forEach((r, fi) => {
        if (!r.vehicle) return;
        (r.damages || []).forEach((d, di) => {
          if (d._selected && d.requierePiezas) {
            const key = `${fi}:${di}`;
            const checked = orderSelection[key] ?? true;
            if (checked) {
              partsToOrder.push({
  vehicleId: r.vehicle.id,
  ac: r.vehicle.id,
  modelo: [r.vehicle.brand, r.vehicle.model].filter(Boolean).join(" ") || r.vehicle.marca || "",
  zona: d.zona || "",
  tipoDano: d.tipoDano || "",
  elementCode: d.elementCode || null,
  pdfCode: d.pdfCode || null,
  sourceDamageId: d.id || null,
  sourceOT: r.file.name
});
            }
          }
        });
      });
      if (payload.length === 0 && partsToOrder.length === 0 && !allowEmpty) {
        setError("No hay cambios para aplicar.");
        return;
      }
      const photoOps = { upserts: [], deletes: [] };
      try {
        parsedResults.forEach((r) => {
          if (!r.parsed || !r.vehicle) return;
          const vid = r.vehicle.id;
          (r.damages || []).forEach((d) => {
            if (!d.fotos || !d.fotos.length) return;
            let idk = null;
            if (d._category === "exact" || (d._category === "similar" && d._decision === "same")) {
              idk = damageIdentityKey(d._matchDamage || d);
            } else if (d._selected) {
              idk = damageIdentityKey(d);
            } else return;
            if (!idk) return;
            photoOps.upserts.push({ vehicleId: vid, idk, zona: d.zona || "", tipoDano: d.tipoDano || "", pdfCode: d.pdfCode || "", elementCode: d.elementCode || "", gravedad: d.gravedad || "", fotos: d.fotos });
          });
          (r.missing || []).filter((m) => m._action === "repair").forEach((m) => {
            const idk = damageIdentityKey(m);
            if (idk) photoOps.deletes.push({ vehicleId: vid, idk });
          });
        });
      } catch (e) {}
      onConfirm(payload, partsToOrder, photoOps);
      setStage("done");
    };
    const totalSelected = parsedResults.reduce(
      (acc, r) => acc + r.damages.filter((d) => d._selected).length,
      0
    );
    const totalExact = parsedResults.reduce(
      (acc, r) => acc + r.damages.filter((d) => d._category === "exact").length,
      0
    );
    const totalSimilar = parsedResults.reduce(
      (acc, r) => acc + r.damages.filter((d) => d._category === "similar").length,
      0
    );
    const totalMissing = parsedResults.reduce(
      (acc, r) => acc + (r.missing || []).length,
      0
    );
    const totalToRepair = parsedResults.reduce(
      (acc, r) => acc + (r.missing || []).filter((m) => m._action === "repair").length,
      0
    );
    const unmatchedVehicles = parsedResults.filter((r) => r.parsed && !r.vehicle);
    return /* @__PURE__ */ React.createElement(Modal, { open: true, onClose, title: "Importar OT desde PDF", width: 820 }, stage === "upload" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontSize: "14px", color: T.inkSoft, marginTop: 0, marginBottom: "18px", lineHeight: 1.55 } }, "Sub\xED uno o varios PDFs de ", /* @__PURE__ */ React.createElement("strong", { style: { color: T.ink } }, "Orden de Trabajo"), " (formato AC-LLAR). Los da\xF1os se extraer\xE1n autom\xE1ticamente y podr\xE1s revisarlos antes de cargarlos. Todos los da\xF1os se importan como", " ", /* @__PURE__ */ React.createElement("strong", { style: { color: T.warn } }, "Detectados (activos)"), "."), /* @__PURE__ */ React.createElement(
      "div",
      {
        onDragOver: (e) => {
          e.preventDefault();
          setDragOver(true);
        },
        onDragLeave: () => setDragOver(false),
        onDrop: handleDrop,
        onClick: () => fileRef.current?.click(),
        style: {
          border: `2px dashed ${dragOver ? T.rust : T.borderHi}`,
          borderRadius: "12px",
          padding: "44px 24px",
          textAlign: "center",
          background: dragOver ? "#E9EEFC" : T.surface,
          cursor: "pointer",
          transition: "all 120ms"
        }
      },
      /* @__PURE__ */ React.createElement(FileUp, { size: 36, style: { color: dragOver ? T.rust : T.inkFaint, marginBottom: "10px" }, strokeWidth: 1.5 }),
      /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: F.display,
        fontSize: "17px",
        fontWeight: 600,
        color: T.ink,
        marginBottom: "4px",
        letterSpacing: "-0.01em"
      } }, "Arrastr\xE1 los PDFs o HTML aqu\xED"),
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13.5px", color: T.inkSoft } }, "o hac\xE9 clic para seleccionarlos \xB7 PDF o HTML \xB7 pod\xE9s subir varios a la vez"),
      /* @__PURE__ */ React.createElement(
        "input",
        {
          ref: fileRef,
          type: "file",
          accept: ".pdf,application/pdf,.html,.htm,text/html",
          multiple: true,
          style: { display: "none" },
          onChange: (e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }
        }
      )
    ), error && /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: "14px",
      padding: "10px 14px",
      background: "#E9EEFC",
      color: T.danger,
      fontSize: "13.5px",
      fontWeight: 600,
      borderRadius: "10px",
      borderLeft: `3px solid ${T.danger}`
    } }, error), /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: "20px",
      padding: "14px 16px",
      background: T.bgAlt,
      borderRadius: "10px",
      fontSize: "13px",
      color: T.inkSoft,
      lineHeight: 1.6,
      border: `1px solid ${T.border}`
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: "9.5px",
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      fontWeight: 700,
      color: T.inkFaint,
      marginBottom: "6px"
    } }, "Qu\xE9 datos se extraen"), /* @__PURE__ */ React.createElement("div", null, "\xB7 ", /* @__PURE__ */ React.createElement("strong", { style: { color: T.ink } }, "Veh\xEDculo:"), " ID, matr\xEDcula, marca, modelo, VIN, sede", /* @__PURE__ */ React.createElement("br", null), "\xB7 ", /* @__PURE__ */ React.createElement("strong", { style: { color: T.ink } }, "Cada da\xF1o:"), " zona, tipo de da\xF1o, gravedad, taller (propio/externo), si requiere piezas, c\xF3digo completo de la OT"))), stage === "parsing" && /* @__PURE__ */ React.createElement("div", { style: { padding: "50px 20px", textAlign: "center" } }, /* @__PURE__ */ React.createElement(Loader2, { size: 32, style: { color: T.rust, marginBottom: "14px", animation: "spin 1s linear infinite" } }), /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: F.display,
      fontSize: "18px",
      fontWeight: 600,
      color: T.ink,
      marginBottom: "6px"
    } }, "Leyendo los PDFs..."), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13.5px", color: T.inkSoft } }, "Extrayendo datos del veh\xEDculo y la tabla de reparaciones"), /* @__PURE__ */ React.createElement("style", null, `@keyframes spin { to { transform: rotate(360deg); } }`)), stage === "preview" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
      background: T.bgAlt,
      border: `1px solid ${T.border}`,
      borderRadius: "10px",
      padding: "14px 18px",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "20px",
      flexWrap: "wrap"
    } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: "9.5px",
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      fontWeight: 700,
      color: T.inkFaint
    } }, "Resumen de la importaci\xF3n"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: F.display, fontSize: "20px", fontWeight: 600, color: T.ink, lineHeight: 1.1, marginTop: "2px" } }, parsedResults.length, " ", parsedResults.length === 1 ? "PDF" : "PDFs", " \xB7 ", totalSelected, " ", totalSelected === 1 ? "da\xF1o nuevo" : "da\xF1os nuevos", totalToRepair > 0 && /* @__PURE__ */ React.createElement("span", { style: { color: WORKFLOW_STATES.LISTO.accent } }, " \xB7 ", totalToRepair, " a marcar reparado", totalToRepair === 1 ? "" : "s"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" } }, totalExact > 0 && /* @__PURE__ */ React.createElement("span", { style: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      padding: "5px 11px",
      borderRadius: "10px",
      fontSize: "11px",
      color: T.inkSoft,
      fontWeight: 600
    } }, totalExact, " ya cargado", totalExact === 1 ? "" : "s"), totalSimilar > 0 && /* @__PURE__ */ React.createElement("span", { style: {
      background: "#FEF1E1",
      border: `1px solid ${T.warn}`,
      borderLeft: `3px solid ${T.warn}`,
      padding: "5px 11px",
      borderRadius: "10px",
      fontSize: "11px",
      color: "#B45309",
      fontWeight: 600
    } }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 11, style: { verticalAlign: "middle", marginRight: "4px" } }), totalSimilar, " por confirmar"), totalMissing > 0 && /* @__PURE__ */ React.createElement("span", { style: {
      background: "#D7EFDA",
      border: `1px solid ${WORKFLOW_STATES.LISTO.accent}`,
      borderLeft: `3px solid ${WORKFLOW_STATES.LISTO.accent}`,
      padding: "5px 11px",
      borderRadius: "10px",
      fontSize: "11px",
      color: WORKFLOW_STATES.LISTO.color,
      fontWeight: 600
    } }, totalMissing, " no aparece", totalMissing === 1 ? "" : "n", " en la OT"), unmatchedVehicles.length > 0 && /* @__PURE__ */ React.createElement("span", { style: {
      background: "#E9EEFC",
      border: `1px solid ${T.danger}`,
      borderLeft: `3px solid ${T.danger}`,
      padding: "5px 11px",
      borderRadius: "10px",
      fontSize: "11px",
      color: T.danger,
      fontWeight: 600
    } }, /* @__PURE__ */ React.createElement(CircleAlert, { size: 11, style: { verticalAlign: "middle", marginRight: "4px" } }), unmatchedVehicles.length, " sin veh\xEDculo"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "14px" } }, parsedResults.map((r, fi) => /* @__PURE__ */ React.createElement(
      PdfFileResult,
      {
        key: fi,
        result: r,
        fileIdx: fi,
        onToggleDamage: toggleDamage,
        onSetAll: setAllForFile,
        onSetDecision: setDamageDecision,
        onSetMissingAction: setMissingAction,
        onSetAllMissingAction: setAllMissingAction
      }
    ))), error && /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: "14px",
      padding: "10px 14px",
      background: "#E9EEFC",
      color: T.danger,
      fontSize: "13.5px",
      fontWeight: 600,
      borderRadius: "10px",
      borderLeft: `3px solid ${T.danger}`
    } }, error), (() => {
      const p1Items = [];
      parsedResults.forEach((r, fi) => {
        if (!r.vehicle) return;
        (r.damages || []).forEach((d, di) => {
          if (d._selected && d.requierePiezas) {
            p1Items.push({ fi, di, d, vehicle: r.vehicle });
          }
        });
      });
      if (p1Items.length === 0) return null;
      return /* @__PURE__ */ React.createElement("div", { style: {
        marginTop: "16px",
        padding: "14px 16px",
        background: "#FEF1E1",
        border: `1px solid ${T.rust}`,
        borderRadius: "12px"
      } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", fontWeight: 700, color: T.rust, marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" } }, /* @__PURE__ */ React.createElement(Settings, { size: 14 }), " Estos da\xF1os requieren repuesto"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11.5px", color: T.inkSoft, marginBottom: "10px", lineHeight: 1.5 } }, "Marc\xE1 los que quieras a\xF1adir a la ", /* @__PURE__ */ React.createElement("strong", null, "Lista de recambios a pedir"), ". Despu\xE9s complet\xE1s c\xF3digo y descripci\xF3n en la pesta\xF1a Recambios."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "6px" } }, p1Items.map(({ fi, di, d, vehicle }) => {
        const key = `${fi}:${di}`;
        const checked = orderSelection[key] ?? true;
        return /* @__PURE__ */ React.createElement("label", { key, style: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", cursor: "pointer", padding: "4px 0" } }, /* @__PURE__ */ React.createElement(
          "input",
          {
            type: "checkbox",
            checked,
            onChange: (e) => setOrderSelection((s) => ({ ...s, [key]: e.target.checked })),
            style: { width: "15px", height: "15px", accentColor: T.rust, cursor: "pointer" }
          }
        ), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, color: T.ink } }, vehicle.id), /* @__PURE__ */ React.createElement("span", { style: { color: T.inkSoft } }, "\xB7"), /* @__PURE__ */ React.createElement("span", { style: { color: T.ink } }, d.zona || "Zona sin especificar"), d.tipoDano && /* @__PURE__ */ React.createElement("span", { style: { color: T.inkFaint, fontSize: "11px" } }, "(", d.tipoDano, ")"), d.pdfCode && /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, fontSize: "10px", color: T.inkFaint, marginLeft: "auto" } }, d.pdfCode));
      })));
    })(), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
      marginTop: "20px",
      paddingTop: "16px",
      borderTop: `1px solid ${T.border}`
    } }, /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => {
      setStage("upload");
      setParsedResults([]);
    } }, "\u2190 Cargar otros PDFs"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClose }, "Cancelar"), /* @__PURE__ */ React.createElement(
      Btn,
      {
        variant: "primary",
        onClick: handleConfirm,
        icon: Sparkles,
        disabled: parsedResults.filter((r) => r.parsed && r.vehicle).length === 0
      },
      totalSelected > 0 && `Importar ${totalSelected} nuevo${totalSelected === 1 ? "" : "s"}`,
      totalSelected > 0 && totalToRepair > 0 && " \xB7 ",
      totalToRepair > 0 && `cerrar ${totalToRepair}`,
      totalSelected === 0 && totalToRepair === 0 && "Confirmar revisi\xF3n"
    )))), stage === "done" && /* @__PURE__ */ React.createElement("div", { style: { padding: "40px 20px", textAlign: "center" } }, /* @__PURE__ */ React.createElement(CheckCircle, { size: 42, style: { color: T.ok, marginBottom: "14px" }, strokeWidth: 1.5 }), /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: F.display,
      fontSize: "22px",
      fontWeight: 600,
      color: T.ink,
      marginBottom: "6px",
      letterSpacing: "-0.015em"
    } }, "Importaci\xF3n completada"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", color: T.inkSoft, marginBottom: "22px" } }, totalSelected > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, totalSelected, " ", totalSelected === 1 ? "da\xF1o nuevo cargado" : "da\xF1os nuevos cargados", " como activos. "), totalToRepair > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, totalToRepair, " ", totalToRepair === 1 ? "da\xF1o marcado" : "da\xF1os marcados", " como reparado", totalToRepair === 1 ? "" : "s", ". "), "Ya pod\xE9s revisar la flota."), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: onClose }, "Cerrar")));
  };
  const PdfFileResult = ({ result, fileIdx, onToggleDamage, onSetAll, onSetDecision, onSetMissingAction, onSetAllMissingAction }) => {
    const [expanded, setExpanded] = useState(true);
    if (result.error) {
      return /* @__PURE__ */ React.createElement("div", { style: {
        background: T.surface,
        border: `1px solid ${T.danger}`,
        borderLeft: `4px solid ${T.danger}`,
        borderRadius: "10px",
        padding: "14px 18px"
      } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", fontWeight: 700, color: T.danger, marginBottom: "4px" } }, result.file.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft } }, "Error al leer el PDF: ", result.error));
    }
    const { parsed, vehicle, damages, matchedBy, missing = [] } = result;
    const selectedCount = damages.filter((d) => d._selected).length;
    const newOnes = damages.filter((d) => d._category === "new");
    const similar = damages.filter((d) => d._category === "similar");
    const reappeared = damages.filter((d) => d._category === "reappeared");
    const exact = damages.filter((d) => d._category === "exact");
    return /* @__PURE__ */ React.createElement("div", { style: {
      background: T.surface,
      border: `1px solid ${vehicle ? T.border : T.danger}`,
      borderLeft: `4px solid ${vehicle ? T.rust : T.danger}`,
      borderRadius: "10px",
      overflow: "hidden"
    } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: () => setExpanded((e) => !e),
        style: {
          padding: "12px 18px",
          background: T.bgAlt,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          gap: "14px"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" } }, /* @__PURE__ */ React.createElement(FileText, { size: 13, style: { color: T.inkSoft, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "13px", color: T.inkSoft, fontFamily: F.mono, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, result.file.name)), /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: F.display,
        fontSize: "16px",
        fontWeight: 600,
        color: T.ink,
        letterSpacing: "-0.01em"
      } }, vehicle ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: {
        color: matchedBy === "plate" ? T.warn : T.rust,
        fontFamily: F.mono,
        marginRight: "8px"
      } }, vehicle.id), vehicle.brand, " ", vehicle.model || "", parsed.header.matricula && /* @__PURE__ */ React.createElement("span", { style: { color: T.inkSoft, fontFamily: F.mono, fontWeight: 400, marginLeft: "10px", fontSize: "14px" } }, parsed.header.matricula)) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { color: T.danger, fontFamily: F.mono, marginRight: "8px" } }, parsed.header.identificador || "?"), /* @__PURE__ */ React.createElement("span", { style: { color: T.danger, fontSize: "15px" } }, "Veh\xEDculo no encontrado en flota"))), vehicle && matchedBy === "plate" && parsed.header.identificador && parsed.header.identificador !== vehicle.id && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.warn, marginTop: "3px", fontStyle: "italic", display: "inline-flex", alignItems: "center", gap: "4px" } }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 11 }), 'El PDF dice "', parsed.header.identificador, '" pero matche\xF3 por matr\xEDcula con "', vehicle.id, '". Verific\xE1 que sea el correcto.'), !vehicle && parsed.header.identificador && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.danger, marginTop: "3px", fontStyle: "italic" } }, 'No existe un veh\xEDculo con ID "', parsed.header.identificador, '" ni matr\xEDcula "', parsed.header.matricula || "?", '". Carg\xE1lo en la flota antes de importar.'), parsed.unreadable && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11.5px", color: T.danger, marginTop: "6px", padding: "8px 10px", background: "#FEE2E2", borderRadius: "10px", lineHeight: 1.5 } }, /* @__PURE__ */ React.createElement("b", null, "\u26A0 No se pudo leer el texto de este PDF."), ' El archivo tiene las fuentes codificadas de una forma que impide extraer los datos (suele pasar al "Imprimir a PDF" desde el m\xF3vil). ', /* @__PURE__ */ React.createElement("b", null, "Soluci\xF3n:"), " en vez de convertir a PDF, import\xE1 el archivo ", /* @__PURE__ */ React.createElement("b", null, "HTML"), " directamente \u2014 el cockpit lo acepta y siempre es legible.")),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "5px" } }, newOnes.length > 0 && /* @__PURE__ */ React.createElement(CatChip, { n: newOnes.length, label: "nuevos", bg: T.rust }), similar.length > 0 && /* @__PURE__ */ React.createElement(CatChip, { n: similar.length, label: "confirmar", bg: T.warn }), missing.length > 0 && /* @__PURE__ */ React.createElement(CatChip, { n: missing.length, label: "faltan", bg: WORKFLOW_STATES.LISTO.accent }), exact.length > 0 && /* @__PURE__ */ React.createElement(CatChip, { n: exact.length, label: "ya est\xE1n", bg: T.inkFaint })), /* @__PURE__ */ React.createElement(
        ChevronDown,
        {
          size: 16,
          style: {
            color: T.inkSoft,
            transform: expanded ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 200ms"
          }
        }
      ))
    ), expanded && /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 0" } }, damages.length === 0 && missing.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "20px", textAlign: "center", fontSize: "14px", color: T.inkSoft, fontStyle: "italic" } }, "Esta OT no tiene da\xF1os registrados (veh\xEDculo en buen estado).") : /* @__PURE__ */ React.createElement(React.Fragment, null, newOnes.length > 0 && /* @__PURE__ */ React.createElement(
      ImportSection,
      {
        title: "Da\xF1os nuevos",
        subtitle: "No estaban registrados. Se cargar\xE1n como activos.",
        accent: T.rust
      },
      /* @__PURE__ */ React.createElement(
        DamageImportTable,
        {
          damages: newOnes,
          fileIdx,
          onToggleDamage,
          showCheckbox: true
        }
      )
    ), similar.length > 0 && /* @__PURE__ */ React.createElement(
      ImportSection,
      {
        title: "\xBFSon el mismo da\xF1o?",
        subtitle: "Parecen coincidir con un da\xF1o que ya ten\xEDas. Confirm\xE1 si es el mismo (no se duplica) o uno nuevo.",
        accent: T.warn
      },
      similar.map((d) => /* @__PURE__ */ React.createElement(
        SimilarDamageRow,
        {
          key: d._idx,
          d,
          fileIdx,
          onSetDecision
        }
      ))
    ), reappeared.length > 0 && /* @__PURE__ */ React.createElement(
      ImportSection,
      {
        title: "Da\xF1os que hab\xEDan sido reparados",
        subtitle: "Tienen el mismo c\xF3digo que un da\xF1o ya reparado. \xBFVolvi\xF3 a aparecer (nuevo) o lo ignoramos?",
        accent: T.warn
      },
      reappeared.map((d) => /* @__PURE__ */ React.createElement(
        ReappearedDamageRow,
        {
          key: d._idx,
          d,
          fileIdx,
          onSetDecision
        }
      ))
    ), missing.length > 0 && /* @__PURE__ */ React.createElement(
      ImportSection,
      {
        title: "Da\xF1os que ya no aparecen en la OT",
        subtitle: "Estaban activos pero no vinieron en este PDF. Probablemente se repararon.",
        accent: WORKFLOW_STATES.LISTO.accent,
        headerAction: /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "6px", fontSize: "11px" } }, /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: () => onSetAllMissingAction(fileIdx, "repair"),
            style: { background: "transparent", border: "none", color: WORKFLOW_STATES.LISTO.accent, cursor: "pointer", fontWeight: 600, padding: "2px 6px", fontFamily: F.body }
          },
          "Marcar todos reparados"
        ), /* @__PURE__ */ React.createElement("span", { style: { color: T.inkFaint } }, "\xB7"), /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: () => onSetAllMissingAction(fileIdx, "keep"),
            style: { background: "transparent", border: "none", color: T.inkSoft, cursor: "pointer", fontWeight: 600, padding: "2px 6px", fontFamily: F.body }
          },
          "Mantener todos activos"
        ))
      },
      missing.map((m) => /* @__PURE__ */ React.createElement(
        MissingDamageRow,
        {
          key: m.id,
          m,
          fileIdx,
          onSetMissingAction
        }
      ))
    ), exact.length > 0 && /* @__PURE__ */ React.createElement(
      ImportSection,
      {
        title: "Ya estaban cargados",
        subtitle: "Coinciden exactamente con da\xF1os activos. No se hace nada.",
        accent: T.inkFaint,
        collapsedByDefault: true
      },
      /* @__PURE__ */ React.createElement(
        DamageImportTable,
        {
          damages: exact,
          fileIdx,
          onToggleDamage,
          dimmed: true
        }
      )
    ))));
  };
  const CatChip = ({ n, label, bg }) => /* @__PURE__ */ React.createElement("span", { style: {
    background: bg,
    color: "#FFFFFF",
    fontSize: "10px",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: "999px",
    fontFamily: F.body,
    whiteSpace: "nowrap"
  } }, n, " ", label);
  const ImportSection = ({ title, subtitle, accent, headerAction, children, collapsedByDefault = false }) => {
    const [open, setOpen] = useState(!collapsedByDefault);
    return /* @__PURE__ */ React.createElement("div", { style: { borderTop: `1px solid ${T.border}` } }, /* @__PURE__ */ React.createElement("div", { style: {
      padding: "10px 18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
      background: T.bg
    } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: () => setOpen((o) => !o),
        style: { cursor: "pointer", flex: 1, display: "flex", alignItems: "center", gap: "8px" }
      },
      /* @__PURE__ */ React.createElement("span", { style: { width: 8, height: 8, borderRadius: 2, background: accent, flexShrink: 0 } }),
      /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13.5px", fontWeight: 700, color: T.ink } }, title), subtitle && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkSoft, marginTop: "1px" } }, subtitle))
    ), headerAction), open && /* @__PURE__ */ React.createElement("div", { style: { paddingBottom: "4px" } }, children));
  };
  const DamageImportTable = ({ damages, fileIdx, onToggleDamage, showCheckbox, dimmed }) => /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "13px" } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: T.surface } }, showCheckbox && /* @__PURE__ */ React.createElement("th", { style: { ...importCellHead, width: "32px" } }), /* @__PURE__ */ React.createElement("th", { style: { ...importCellHead, width: "34px" } }, "#"), /* @__PURE__ */ React.createElement("th", { style: importCellHead }, "Zona / elemento"), /* @__PURE__ */ React.createElement("th", { style: importCellHead }, "Tipo"), /* @__PURE__ */ React.createElement("th", { style: { ...importCellHead, width: "84px" } }, "Gravedad"), /* @__PURE__ */ React.createElement("th", { style: { ...importCellHead, width: "72px" } }, "Taller"), /* @__PURE__ */ React.createElement("th", { style: { ...importCellHead, width: "54px" } }, "Piezas"))), /* @__PURE__ */ React.createElement("tbody", null, damages.map((d) => {
    const grav = GRAVEDAD_THEME[d.gravedad];
    return /* @__PURE__ */ React.createElement("tr", { key: d._idx, style: {
      borderTop: `1px solid ${T.border}`,
      opacity: dimmed ? 0.55 : 1
    } }, showCheckbox && /* @__PURE__ */ React.createElement("td", { style: { ...importCell, textAlign: "center" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: d._selected,
        onChange: () => onToggleDamage(fileIdx, d._idx),
        style: { accentColor: T.rust, cursor: "pointer" }
      }
    )), /* @__PURE__ */ React.createElement("td", { style: { ...importCell, fontFamily: F.mono, fontWeight: 600, color: T.inkSoft } }, d.number), /* @__PURE__ */ React.createElement("td", { style: importCell }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, color: T.ink } }, d.zona || "\u2014"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkFaint, fontFamily: F.mono, marginTop: "2px" } }, d.pdfCode)), /* @__PURE__ */ React.createElement("td", { style: importCell }, d.tipoDano || "\u2014"), /* @__PURE__ */ React.createElement("td", { style: importCell }, grav ? /* @__PURE__ */ React.createElement("span", { style: {
      background: grav.bg,
      color: grav.color,
      padding: "1px 7px",
      borderRadius: "8px",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.05em"
    } }, grav.label) : "\u2014"), /* @__PURE__ */ React.createElement("td", { style: { ...importCell, color: T.inkSoft, textTransform: "capitalize" } }, d.tipoReparacion || "\u2014"), /* @__PURE__ */ React.createElement("td", { style: { ...importCell, color: d.requierePiezas ? T.warn : T.inkSoft, fontWeight: d.requierePiezas ? 600 : 400 } }, d.requierePiezas ? "S\xED" : "No"));
  })));
  const SimilarDamageRow = ({ d, fileIdx, onSetDecision }) => {
    const ex = d._matchDamage;
    const gravIn = GRAVEDAD_THEME[d.gravedad];
    const gravEx = ex?.gravedad ? GRAVEDAD_THEME[ex.gravedad] : null;
    const isSame = d._decision !== "different";
    return /* @__PURE__ */ React.createElement("div", { style: {
      padding: "12px 18px",
      borderTop: `1px solid ${T.border}`,
      background: isSame ? T.bgAlt : "transparent"
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "14px", alignItems: "stretch", marginBottom: "10px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, padding: "8px 12px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: "10px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.inkFaint, marginBottom: "4px" } }, "Ya ten\xEDas \xB7 ", ex?.id), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13.5px", fontWeight: 600, color: T.ink } }, ex?.zona || ex?.description || "\u2014"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "6px", alignItems: "center", marginTop: "4px", flexWrap: "wrap" } }, gravEx && /* @__PURE__ */ React.createElement("span", { style: { background: gravEx.bg, color: gravEx.color, fontSize: "9.5px", fontWeight: 700, padding: "1px 6px", borderRadius: "8px" } }, gravEx.label), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "10px", fontFamily: F.mono, color: T.inkFaint } }, ex?.pdfCode || ex?.tipoDano || ""))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", color: T.inkFaint, fontSize: "18px" } }, "\u2192"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, padding: "8px 12px", background: T.surface, border: `1px solid ${T.borderHi}`, borderRadius: "10px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.rust, marginBottom: "4px" } }, "En esta OT \xB7 #", d.number), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13.5px", fontWeight: 600, color: T.ink } }, d.zona || "\u2014"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "6px", alignItems: "center", marginTop: "4px", flexWrap: "wrap" } }, gravIn && /* @__PURE__ */ React.createElement("span", { style: { background: gravIn.bg, color: gravIn.color, fontSize: "9.5px", fontWeight: 700, padding: "1px 6px", borderRadius: "8px" } }, gravIn.label), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "10px", fontFamily: F.mono, color: T.inkFaint } }, d.pdfCode)))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px" } }, /* @__PURE__ */ React.createElement(
      DecisionBtn,
      {
        active: isSame,
        onClick: () => onSetDecision(fileIdx, d._idx, "same"),
        accent: WORKFLOW_STATES.LISTO.accent
      },
      "Es el mismo da\xF1o (no duplicar)"
    ), /* @__PURE__ */ React.createElement(
      DecisionBtn,
      {
        active: !isSame,
        onClick: () => onSetDecision(fileIdx, d._idx, "different"),
        accent: T.rust
      },
      "Es un da\xF1o nuevo (agregar)"
    )));
  };
  const ReappearedDamageRow = ({ d, fileIdx, onSetDecision }) => {
    const ex = d._matchDamage;
    const grav = GRAVEDAD_THEME[d.gravedad];
    const isNew = d._decision !== "skip";
    return /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 18px", borderTop: `1px solid ${T.border}` } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13.5px", fontWeight: 600, color: T.ink, marginBottom: "2px" } }, d.zona || "\u2014", grav && /* @__PURE__ */ React.createElement("span", { style: { background: grav.bg, color: grav.color, fontSize: "9.5px", fontWeight: 700, padding: "1px 6px", borderRadius: "8px", marginLeft: "8px" } }, grav.label)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10.5px", color: T.inkSoft, marginBottom: "8px" } }, "Coincide con ", /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono } }, ex?.id), " que estaba marcado como reparado", /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, color: T.inkFaint, marginLeft: "6px" } }, d.pdfCode)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px" } }, /* @__PURE__ */ React.createElement(DecisionBtn, { active: isNew, onClick: () => onSetDecision(fileIdx, d._idx, "new"), accent: T.rust }, "Volvi\xF3 a da\xF1arse (agregar como nuevo)"), /* @__PURE__ */ React.createElement(DecisionBtn, { active: !isNew, onClick: () => onSetDecision(fileIdx, d._idx, "skip"), accent: T.inkFaint }, "Ignorar (no agregar)")));
  };
  const MissingDamageRow = ({ m, fileIdx, onSetMissingAction }) => {
    const grav = GRAVEDAD_THEME[m.gravedad];
    const repair = m._action === "repair";
    return /* @__PURE__ */ React.createElement("div", { style: {
      padding: "10px 18px",
      borderTop: `1px solid ${T.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      background: repair ? "#D7EFDA" : "transparent"
    } }, /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13.5px", fontWeight: 600, color: T.ink } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, color: T.inkSoft, marginRight: "8px" } }, m.id), m.zona || m.description || "\u2014", grav && /* @__PURE__ */ React.createElement("span", { style: { background: grav.bg, color: grav.color, fontSize: "9.5px", fontWeight: 700, padding: "1px 6px", borderRadius: "8px", marginLeft: "8px" } }, grav.label)), m.pdfCode && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkFaint, fontFamily: F.mono, marginTop: "2px" } }, m.pdfCode)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "6px", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(DecisionBtn, { active: repair, onClick: () => onSetMissingAction(fileIdx, m.id, "repair"), accent: WORKFLOW_STATES.LISTO.accent, sm: true }, "\u2713 Reparado"), /* @__PURE__ */ React.createElement(DecisionBtn, { active: !repair, onClick: () => onSetMissingAction(fileIdx, m.id, "keep"), accent: T.inkSoft, sm: true }, "Sigue activo")));
  };
  const DecisionBtn = ({ active, onClick, accent, children, sm }) => /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick,
      style: {
        background: active ? accent : "transparent",
        color: active ? "#FFFFFF" : T.inkSoft,
        border: `1px solid ${active ? accent : T.border}`,
        padding: sm ? "4px 10px" : "6px 12px",
        borderRadius: "10px",
        fontSize: sm ? "10.5px" : "11.5px",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: F.body,
        transition: "all 120ms",
        whiteSpace: "nowrap"
      }
    },
    children
  );
  const importCellHead = {
    padding: "8px 10px",
    textAlign: "left",
    fontSize: "9.5px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: T.inkFaint,
    fontFamily: F.body,
    borderBottom: `1px solid ${T.border}`
  };
  const importCell = {
    padding: "8px 10px",
    fontSize: "11.5px",
    color: T.ink,
    verticalAlign: "top"
  };
  const BackupModal = ({ open, onClose, lastBackupAt, onExport, onImport, onExportAll, onImportAll, summary, onClearAllDates, onDedupeDamages }) => {
    const fileRef = useRef(null);
    const fileAllRef = useRef(null);
    if (!open) return null;
    return /* @__PURE__ */ React.createElement(Modal, { open: true, onClose, title: "Respaldo de datos", width: 540 }, /* @__PURE__ */ React.createElement("div", { style: {
      background: T.bgAlt,
      padding: "14px 16px",
      borderRadius: "10px",
      marginBottom: "20px",
      border: `1px solid ${T.border}`
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: "9.5px",
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      fontWeight: 700,
      color: T.inkFaint,
      marginBottom: "4px"
    } }, "Estado actual"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "15px", color: T.ink, fontWeight: 600 } }, summary.vehicles, " veh\xEDculos \xB7 ", summary.damages, " da\xF1os registrados"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft, marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" } }, /* @__PURE__ */ React.createElement(Clock, { size: 12 }), " \xDAltimo backup:", " ", /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, fontWeight: 600, color: T.ink } }, lastBackupAt ? formatDateTime(lastBackupAt) : "nunca"))), /* @__PURE__ */ React.createElement("div", { style: {
      background: "#FEF1E1",
      padding: "16px",
      borderRadius: "12px",
      marginBottom: "20px",
      border: `1.5px solid ${T.rust}`
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: T.rust, marginBottom: "6px" } }, "\u2B50 Recomendado \xB7 un solo archivo"), /* @__PURE__ */ React.createElement("h4", { style: { margin: "0 0 6px", fontFamily: F.display, fontSize: "16px", fontWeight: 600, color: T.ink } }, "Backup completo"), /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 12px", fontSize: "13.5px", color: T.inkSoft, lineHeight: 1.5 } }, "Guarda ", /* @__PURE__ */ React.createElement("strong", null, "todo junto"), " en un solo JSON: cockpit (flota, da\xF1os, reservas, recambios, fotos de da\xF1os) + cuantificaci\xF3n (presupuestos y repositorio de piezas). Un archivo en vez de dos."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: onExportAll, icon: Download }, "Exportar TODO"), /* @__PURE__ */ React.createElement("input", { ref: fileAllRef, type: "file", accept: ".json,application/json", style: { display: "none" }, onChange: onImportAll }), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: () => fileAllRef.current?.click(), icon: Upload }, "Restaurar TODO"))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkFaint, marginBottom: "14px", fontStyle: "italic" } }, "O us\xE1 los backups individuales de abajo si prefer\xEDs separarlos:"), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "22px" } }, /* @__PURE__ */ React.createElement("h4", { style: { margin: "0 0 6px", fontFamily: F.display, fontSize: "15px", fontWeight: 600, color: T.ink } }, "Exportar solo cockpit"), /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 12px", fontSize: "13.5px", color: T.inkSoft, lineHeight: 1.5 } }, "Descarga todos los datos. Gu\xE1rdalo en Google Drive como respaldo permanente. Recomendado: al menos una vez al d\xEDa."), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: onExport, icon: Download }, "Descargar backup ahora")), /* @__PURE__ */ React.createElement("div", { style: { height: "1px", background: T.border, margin: "4px 0 22px" } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { style: {
      margin: "0 0 6px",
      fontFamily: F.display,
      fontSize: "15px",
      fontWeight: 600,
      color: T.ink
    } }, "Restaurar desde JSON"), /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 12px", fontSize: "13.5px", color: T.inkSoft, lineHeight: 1.5 } }, "Carga un backup anterior. ", /* @__PURE__ */ React.createElement("strong", { style: { color: T.danger } }, "Atenci\xF3n:"), " ", "reemplaza todos los datos actuales (pedir\xE1 confirmaci\xF3n)."), /* @__PURE__ */ React.createElement(
      "input",
      {
        ref: fileRef,
        type: "file",
        accept: ".json,application/json",
        style: { display: "none" },
        onChange: (e) => {
          const f = e.target.files[0];
          if (f) onImport(f);
          e.target.value = "";
        }
      }
    ), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: () => fileRef.current?.click(), icon: Upload }, "Seleccionar archivo JSON")), onClearAllDates && /* @__PURE__ */ React.createElement("div", { style: {
      background: "#E9EEFC",
      padding: "14px 16px",
      borderRadius: "10px",
      marginTop: "16px",
      border: `1px solid ${T.danger}`,
      borderLeft: `3px solid ${T.danger}`
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: "9.5px",
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      fontWeight: 700,
      color: T.danger,
      marginBottom: "4px"
    } }, "Zona de mantenimiento"), /* @__PURE__ */ React.createElement("h4", { style: { margin: "0 0 6px", fontSize: "15px", fontWeight: 600, color: T.ink } }, "Borrar todas las fechas"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "13px", color: T.inkSoft, margin: "0 0 12px", lineHeight: 1.5 } }, "Limpia la pr\xF3xima salida y las fechas de alquiler de toda la flota, para recargarlas desde cero. No toca da\xF1os, inspecciones ni estados."), /* @__PURE__ */ React.createElement(Btn, { variant: "danger", onClick: onClearAllDates, icon: Trash2, sm: true }, "Borrar todas las fechas de la flota"), onDedupeDamages && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h4", { style: { margin: "18px 0 6px", fontSize: "15px", fontWeight: 600, color: T.ink } }, "Limpiar da\xF1os duplicados"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "13px", color: T.inkSoft, margin: "0 0 12px", lineHeight: 1.5 } }, "Busca da\xF1os repetidos en cada veh\xEDculo (misma zona y tipo) y deja una sola copia, conservando la que tenga decisi\xF3n de cargo o reparaci\xF3n. \xDAtil si una OT se import\xF3 dos veces."), /* @__PURE__ */ React.createElement(Btn, { variant: "danger", onClick: onDedupeDamages, icon: Trash2, sm: true }, "Detectar y limpiar duplicados"))));
  };
  const TodayView = ({
    state,
    onSelectVehicle,
    onImport,
    onSetStatus,
    onOpenRentalModal,
    onConfirmArrival,
    onMarkNoNewDamages,
    onMarkFianzaAvisada,
    onToggleNeedsQuantification,
    onGoToTab,
    onLeftUnreviewed,
    requestConfirm
  }) => {
    const [collapsedSections, setCollapsedSections] = useState({});
    // Tick de 1 minuto para que la cuenta regresiva del SLA se actualice sola.
    const [slaNow, setSlaNow] = useState(Date.now());
    useEffect(() => {
      const id = setInterval(() => setSlaNow(Date.now()), 60000);
      return () => clearInterval(id);
    }, []);
    useEffect(() => {
      try {
        if (typeof window !== "undefined" && window.storage?.get) {
          window.storage.get("today_collapsed_sections").then((res) => {
            if (res?.value) {
              try {
                setCollapsedSections(JSON.parse(res.value));
              } catch {
              }
            }
          }).catch(() => {
          });
        }
      } catch {
      }
    }, []);
    const toggleCollapse = (key) => {
      setCollapsedSections((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        try {
          if (typeof window !== "undefined" && window.storage?.set) {
            window.storage.set("today_collapsed_sections", JSON.stringify(next)).catch(() => {
            });
          }
        } catch {
        }
        return next;
      });
    };
    const collapseAll = (value) => {
      const keys = ["urgent", "porLlegar", "paraInspeccionar", "fabricio", "sinDanosNuevos", "conDanosNuevos", "paraEntregar"];
      const next = {};
      for (const k of keys) next[k] = value;
      setCollapsedSections(next);
      try {
        if (typeof window !== "undefined" && window.storage?.set) {
          window.storage.set("today_collapsed_sections", JSON.stringify(next)).catch(() => {
          });
        }
      } catch {
      }
    };
    const today2 = todayKey();
    const tomorrowISO = useMemo(() => {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString().slice(0, 10);
    }, []);
    const sections = useMemo(() => {
      const vehiclesWithStatus = state.vehicles.map((v) => ({
        v,
        status: computeVehicleStatus(v, state.damages),
        damages: state.damages.filter((d) => d.vehicleId === v.id),
        activeDamages: state.damages.filter(
          (d) => d.vehicleId === v.id && d.state !== "REPARADO" && d.state !== "ASUMIDO"
        )
      }));
      const urgent = vehiclesWithStatus.filter(({ v, status, activeDamages }) => {
        if (status === "LISTO" || status === "EN_USO") return false;
        const date = v.nextRentalDate;
        if (!date) return false;
        const hoursUntil = -hoursSince(date);
        if (hoursUntil === null || hoursUntil > 24 || hoursUntil < -48) return false;
        return activeDamages.some((d) => d.gravedad === "GRAVE");
      }).sort((a, b) => {
        const da = new Date(a.v.nextRentalDate).getTime();
        const db = new Date(b.v.nextRentalDate).getTime();
        return da - db;
      });
      const porLlegar = state.vehicles.filter((v) => isPendingArrivalConfirmation(v)).sort((a, b) => {
        const da = new Date(a.rentalEndDate).getTime();
        const db = new Date(b.rentalEndDate).getTime();
        return da - db;
      });
      // AC reincidentes: top ~20% por cantidad de daños en el histórico (piso 4), autocalculado.
      const reincDamageCount = {};
      for (const dmg of state.damages || []) { const k = dmg.vehicleId; if (k) reincDamageCount[k] = (reincDamageCount[k] || 0) + 1; }
      const reincVals = Object.values(reincDamageCount).sort((a, b) => b - a);
      const reincCut = reincVals.length ? reincVals[Math.floor(reincVals.length * 0.2)] : Infinity;
      const reincidenteSet = new Set(Object.keys(reincDamageCount).filter((id) => reincDamageCount[id] >= Math.max(4, reincCut)));
      const paraInspeccionar = vehiclesWithStatus.filter(({ status, v }) => status === "DEVUELTO" && !isPendingArrivalConfirmation(v)).sort((a, b) => {
        // 1) SALE HOY manda: los que salen hoy, primero.
        const ah = reviewIsToday(a.v), bh = reviewIsToday(b.v);
        if (ah !== bh) return ah ? -1 : 1;
        if (ah && bh) {
          // ambos salen hoy → el de salida más temprana; a igual hora, mayor riesgo.
          const da = new Date(reviewNextDeparture(a.v)).getTime();
          const db = new Date(reviewNextDeparture(b.v)).getTime();
          if (da !== db) return da - db;
          return reviewRiskScore(b.v, reincDamageCount) - reviewRiskScore(a.v, reincDamageCount);
        }
        // 2) Ninguno sale hoy → el que lleva MÁS TIEMPO esperando, primero.
        const wa = reviewWaitDays(a.v), wb = reviewWaitDays(b.v);
        if (wa !== wb) return wb - wa;
        // 3) A igual tiempo esperando → mayor probabilidad de daño (riesgo).
        return reviewRiskScore(b.v, reincDamageCount) - reviewRiskScore(a.v, reincDamageCount);
      });
      const fabricioDamages = [];
      for (const { v, status, activeDamages } of vehiclesWithStatus) {
        if (status !== "REVISADO" && status !== "EN_REPARACION") continue;
        for (const d of activeDamages) {
          fabricioDamages.push({ damage: d, vehicle: v, status });
        }
      }
      fabricioDamages.sort((a, b) => {
        const ga = GRAVEDAD_ORDER[a.damage.gravedad] || 9;
        const gb = GRAVEDAD_ORDER[b.damage.gravedad] || 9;
        if (ga !== gb) return ga - gb;
        const da = a.vehicle.nextRentalDate ? new Date(a.vehicle.nextRentalDate).getTime() : Infinity;
        const db = b.vehicle.nextRentalDate ? new Date(b.vehicle.nextRentalDate).getTime() : Infinity;
        return da - db;
      });
      const sinDanosNuevos = vehiclesWithStatus.filter(({ v }) => {
        if (!v.lastInspectedAt) return false;
        if (v.lastReturnHasNewDamages !== false) return false;
        if (v.fianzaAvisoEnviado) return false;
        return true;
      }).sort((a, b) => {
        const ta = a.v.lastInspectedAt ? new Date(a.v.lastInspectedAt).getTime() : 0;
        const tb = b.v.lastInspectedAt ? new Date(b.v.lastInspectedAt).getTime() : 0;
        return tb - ta;
      });
      const conDanosNuevos = vehiclesWithStatus.filter(({ damages }) => damages.some(
        (d) => d.needsQuantification === true && d.state !== "REPARADO" && d.state !== "ASUMIDO"
      )).map(({ v, damages }) => ({
        v,
        newDamages: damages.filter(
          (d) => d.needsQuantification === true && d.state !== "REPARADO" && d.state !== "ASUMIDO"
        ),
        oldestImport: damages.reduce((min, d) => d.needsQuantification && d.importedAt && (!min || d.importedAt < min) ? d.importedAt : min, null)
      })).sort((a, b) => {
        const oa = a.oldestImport ? new Date(a.oldestImport).getTime() : Infinity;
        const ob = b.oldestImport ? new Date(b.oldestImport).getTime() : Infinity;
        return oa - ob;
      });
      const paraEntregar = vehiclesWithStatus.filter(({ v, status }) => {
        if (status !== "LISTO") return false;
        if (!v.nextRentalDate) return false;
        return v.nextRentalDate.slice(0, 10) <= tomorrowISO;
      }).sort((a, b) => {
        const da = new Date(a.v.nextRentalDate).getTime();
        const db = new Date(b.v.nextRentalDate).getTime();
        return da - db;
      });
      return {
        urgent,
        porLlegar,
        paraInspeccionar,
        reincidenteSet,
        fabricioDamages,
        sinDanosNuevos,
        conDanosNuevos,
        paraEntregar
      };
    }, [state.vehicles, state.damages, tomorrowISO]);
    const totalTasks = sections.porLlegar.length + sections.paraInspeccionar.length;
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "24px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: "11px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.15em",
      color: T.inkFaint,
      marginBottom: "4px"
    } }, "Hoy \xB7 ", (/* @__PURE__ */ new Date()).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })), /* @__PURE__ */ React.createElement("h1", { style: {
      margin: 0,
      fontFamily: F.display,
      fontSize: "32px",
      fontWeight: 600,
      letterSpacing: "-0.025em",
      color: T.ink,
      lineHeight: 1.1
    } }, totalTasks === 0 ? "Todo al d\xEDa" : `${totalTasks} ${totalTasks === 1 ? "tarea" : "tareas"} pendientes`), totalTasks === 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "15px", color: T.inkSoft, marginTop: "8px" } }, "No hay veh\xEDculos esperando acci\xF3n tuya. Aprovech\xE1 para hacer backup o cargar pr\xF3ximas salidas.")), totalTasks > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "6px" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", sm: true, onClick: () => collapseAll(true) }, "Colapsar todo"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", sm: true, onClick: () => collapseAll(false) }, "Expandir todo"))), sections.porLlegar.length > 0 && /* @__PURE__ */ React.createElement(
      TodaySection,
      {
        icon: Truck,
        title: "Por llegar",
        subtitle: "Fecha de devoluci\xF3n vencida. Confirm\xE1 en la campa cu\xE1les est\xE1n f\xEDsicamente.",
        count: sections.porLlegar.length,
        accent: WORKFLOW_STATES.DEVUELTO.accent,
        sectionKey: "porLlegar",
        collapsed: collapsedSections.porLlegar,
        onToggleCollapse: toggleCollapse
      },
      sections.porLlegar.map((v) => {
        const h = hoursSince(v.rentalEndDate);
        return /* @__PURE__ */ React.createElement(
          TodayRow,
          {
            key: v.id,
            onClick: () => onSelectVehicle(v.id),
            vehicle: v,
            meta: /* @__PURE__ */ React.createElement("span", { style: { color: h > 12 ? T.danger : T.warn } }, h < 1 ? "vence ahora" : h < 24 ? `venci\xF3 hace ${h}h` : `venci\xF3 hace ${Math.round(h / 24)}d`),
            actions: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", sm: true, onClick: (e) => {
              e.stopPropagation();
              onConfirmArrival(v.id);
            } }, "\u2713 Est\xE1 en campa"))
          }
        );
      })
    ), sections.paraInspeccionar.length > 0 && /* @__PURE__ */ React.createElement(
      TodaySection,
      {
        icon: ClipboardList,
        title: "Para inspeccionar",
        subtitle: "Devueltos pendientes de revisar. Orden: sale hoy primero, luego el que lleva m\xE1s tiempo esperando; a igual tiempo, mayor riesgo. El COLOR de la tarjeta y el ⏱ son el plazo de revisi\xF3n (48 h laborales desde que la marcaste devuelta): verde ≤24 h, amarillo 24-36 h, rojo 36-48 h, vencido +48 h. El puntito ALTO/MEDIO/BAJO es el riesgo de da\xF1o, aparte.",
        count: sections.paraInspeccionar.length,
        accent: WORKFLOW_STATES.DEVUELTO.accent,
        sectionKey: "paraInspeccionar",
        collapsed: collapsedSections.paraInspeccionar,
        onToggleCollapse: toggleCollapse
      },
      /* @__PURE__ */ React.createElement("div", { key: "rk-strip", style: { display: "flex", gap: "8px", flexWrap: "wrap", padding: "10px 18px", background: T.bg, borderBottom: `1px solid ${T.border}` } }, ["alto", "medio", "bajo"].map((lvl) => {
        const cnt = sections.paraInspeccionar.filter(({ v }) => reviewRisk(v, sections.reincidenteSet).level === lvl).length;
        const col = lvl === "alto" ? T.danger : lvl === "bajo" ? "#15803D" : "#B45309";
        const lab = lvl === "alto" ? "ALTO" : lvl === "bajo" ? "BAJO" : "MEDIO";
        return /* @__PURE__ */ React.createElement("span", { key: lvl, style: { display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: F.mono, fontSize: "11px", fontWeight: 700, color: col, background: T.surface, border: `1px solid ${T.border}`, borderRadius: "999px", padding: "3px 10px" } }, /* @__PURE__ */ React.createElement("span", { style: { width: "9px", height: "9px", borderRadius: "50%", background: col, display: "inline-block" } }), `${lab} ${cnt}`);
      })),
      (() => {
        const slas = sections.paraInspeccionar.map(({ v }) => reviewSla(v, slaNow)).filter(Boolean);
        const cnt = (n) => slas.filter((s) => s.nivel === n).length;
        const items = [
          { n: "verde", lab: "≤24 h" },
          { n: "amarillo", lab: "24–36 h" },
          { n: "rojo", lab: "36–48 h" },
          { n: "vencido", lab: "Vencidos" }
        ];
        return /* @__PURE__ */ React.createElement("div", { key: "sla-strip", style: { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", padding: "8px 18px", background: T.surface, borderBottom: `1px solid ${T.border}` } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: T.inkFaint, marginRight: "2px" } }, "⏱ Plazo revisi\xF3n \xB7 48 h laborales"), items.map(({ n, lab }) => { const c = SLA_COLORES[n]; return /* @__PURE__ */ React.createElement("span", { key: n, style: { display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: F.mono, fontSize: "11px", fontWeight: 700, color: c.fg, background: c.bg, border: `1px solid ${c.borde}`, borderRadius: "999px", padding: "3px 10px" } }, /* @__PURE__ */ React.createElement("span", { style: { width: "9px", height: "9px", borderRadius: "50%", background: c.borde, display: "inline-block" } }), `${lab} ${cnt(n)}`); }));
      })(),
      sections.paraInspeccionar.map(({ v }) => {
        const date = reviewNextDeparture(v);
        const d = date ? daysBetween(nowIso(), date) : null;
        const isToday = reviewIsToday(v);
        const wait = reviewWaitDays(v);
        const rk = reviewRisk(v, sections.reincidenteSet);
        const rkColor = rk.level === "alto" ? T.danger : rk.level === "bajo" ? "#15803D" : "#B45309";
        const rkLabel = rk.level === "alto" ? "ALTO" : rk.level === "bajo" ? "BAJO" : "MEDIO";
        const rkWhy = [];
        if (rk.dias != null && rk.dias >= 11) rkWhy.push(`${rk.dias} d\xEDas de viaje`);
        if (rk.reinc) rkWhy.push("AC reincidente");
        if (!rkWhy.length && rk.dias != null) rkWhy.push(`${rk.dias} d\xEDas`);
        const esperaTxt = wait < 0 ? "sin fecha de vuelta" : wait === 0 ? "lleg\xF3 hoy" : `espera ${wait}d`;
        const salidaTxt = d === null ? null : d < 0 ? `sali\xF3 hace ${Math.abs(d)}d` : d === 1 ? "sale ma\xF1ana" : `sale en ${d}d`;
        const sla = reviewSla(v, slaNow);
        const slaC = sla ? SLA_COLORES[sla.nivel] : null;
        const slaPill = sla && /* @__PURE__ */ React.createElement("span", { title: sla.nivel === "vencido" ? `Plazo de revisi\xF3n VENCIDO. El l\xEDmite era ${slaFmtLimite(sla.limite)} (48 h laborales desde que se marc\xF3 devuelto).` : `Quedan ${slaFmtDuracion(sla.restantesH)} laborales para revisar \xB7 l\xEDmite ${slaFmtLimite(sla.limite)} (48 h laborales, L-V 8-17, sin findes).`, style: { display: "inline-flex", alignItems: "center", gap: "5px", fontFamily: F.mono, fontSize: "11px", fontWeight: 700, color: slaC.fg, background: slaC.bg, border: `1px solid ${slaC.borde}`, borderRadius: "999px", padding: "3px 9px" } }, /* @__PURE__ */ React.createElement("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: slaC.borde, display: "inline-block", flexShrink: 0 } }), sla.nivel === "vencido" ? `⚠ VENCIDO +${slaFmtDuracion(-sla.restantesH)}` : `⏱ ${slaFmtDuracion(sla.restantesH)}`, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 500, opacity: 0.85, marginLeft: "1px" } }, `\xB7 vence ${slaFmtLimite(sla.limite)}`));
        return /* @__PURE__ */ React.createElement(
          TodayRow,
          {
            key: v.id,
            onClick: () => onSelectVehicle(v.id),
            vehicle: v,
            actions: onLeftUnreviewed && /* @__PURE__ */ React.createElement("button", { title: "El veh\u00EDculo sali\u00F3 sin que pudieras revisarlo", onClick: async (e) => { e.stopPropagation(); const ok = await requestConfirm({ title: "Se fue sin revisar", message: `\u00BFMarcar ${v.id} como que sali\u00F3 sin revisar? Se quita de esta lista y queda registrado aparte (no cuenta para el tiempo de revisi\u00F3n).`, confirmLabel: "S\u00ED, se fue sin revisar", cancelLabel: "Cancelar" }); if (ok) onLeftUnreviewed(v.id); }, style: { background: "transparent", border: `1px dashed ${T.inkFaint}`, borderRadius: "10px", cursor: "pointer", padding: "6px 10px", fontSize: "11.5px", color: T.inkSoft, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 } }, "\uD83D\uDEAA Sin revisar"),
            slaTint: slaC,
            meta: /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: "9px", flexWrap: "wrap" } }, slaPill, isToday && /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em", color: "#FFFFFF", background: T.rust, borderRadius: "999px", padding: "2px 8px" } }, "SALE HOY"), /* @__PURE__ */ React.createElement("span", { title: rkWhy.join(" \xB7 "), style: { width: "11px", height: "11px", borderRadius: "50%", background: rkColor, display: "inline-block", flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { title: rkWhy.join(" \xB7 "), style: { fontFamily: F.mono, fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em", color: rkColor } }, rkLabel), /* @__PURE__ */ React.createElement("span", { style: { color: T.ink, fontSize: "13px", fontWeight: 600 } }, esperaTxt), rk.dias != null && /* @__PURE__ */ React.createElement("span", { style: { color: T.inkSoft, fontSize: "13px" } }, `viaje ${rk.dias}d`), !isToday && salidaTxt && /* @__PURE__ */ React.createElement("span", { style: { color: T.inkFaint, fontSize: "13px" } }, salidaTxt))
          }
        );
      })
    ));
  };
  const TodaySection = ({ icon: Icon, title, subtitle, count, accent, critical, children, cta, sectionKey, collapsed, onToggleCollapse }) => {
    const canCollapse = !!children && !!sectionKey;
    const isCollapsed = canCollapse && collapsed;
    return /* @__PURE__ */ React.createElement("div", { style: {
      background: critical ? "#E9EEFC" : T.surface,
      border: `1px solid ${critical ? T.danger : T.border}`,
      borderLeft: `4px solid ${accent || T.rust}`,
      borderRadius: "10px",
      marginBottom: "16px",
      overflow: "hidden"
    } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: canCollapse ? () => onToggleCollapse(sectionKey) : void 0,
        style: {
          padding: "14px 18px 10px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          cursor: canCollapse ? "pointer" : "default"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: {
        background: critical ? T.danger : accent || T.rust,
        color: "#FFFFFF",
        borderRadius: "10px",
        padding: "6px",
        flexShrink: 0,
        marginTop: "2px"
      } }, /* @__PURE__ */ React.createElement(Icon, { size: 16, strokeWidth: 2.2 })),
      /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("h3", { style: {
        margin: 0,
        fontFamily: F.display,
        fontSize: "17px",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        color: critical ? T.danger : T.ink
      } }, title), count !== void 0 && count !== null && /* @__PURE__ */ React.createElement("span", { style: {
        background: critical ? T.danger : accent || T.rust,
        color: "#FFFFFF",
        fontFamily: F.mono,
        fontSize: "11px",
        fontWeight: 700,
        padding: "1px 9px",
        borderRadius: "999px"
      } }, count)), subtitle && !isCollapsed && /* @__PURE__ */ React.createElement("div", { style: {
        fontSize: "13.5px",
        color: critical ? "#2A44D6" : T.inkSoft,
        marginTop: "3px",
        lineHeight: 1.4
      } }, subtitle), cta && !isCollapsed && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "12px" } }, cta)),
      canCollapse && /* @__PURE__ */ React.createElement(
        ChevronDown,
        {
          size: 18,
          style: {
            color: critical ? T.danger : T.inkSoft,
            flexShrink: 0,
            marginTop: "4px",
            transform: isCollapsed ? "rotate(-90deg)" : "rotate(0)",
            transition: "transform 200ms"
          }
        }
      )
    ), children && !isCollapsed && /* @__PURE__ */ React.createElement("div", { style: { borderTop: `1px solid ${critical ? "#E9EEFC" : T.border}`, background: T.bg } }, children));
  };
  const TodayRow = ({ vehicle, meta, actions, onClick, slaTint }) => {
    const [hover, setHover] = useState(false);
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          padding: slaTint ? "10px 18px 10px 14px" : "10px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          cursor: onClick ? "pointer" : "default",
          background: slaTint ? slaTint.bg : (hover && onClick ? T.bgAlt : "transparent"),
          borderLeft: slaTint ? `4px solid ${slaTint.borde}` : "none",
          borderBottom: `1px solid ${T.border}`,
          transition: "background 100ms"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 } }, /* @__PURE__ */ React.createElement("span", { style: {
        fontFamily: F.mono,
        fontWeight: 700,
        color: T.ink,
        fontSize: "14px",
        letterSpacing: "-0.01em"
      } }, vehicle.id), /* @__PURE__ */ React.createElement("span", { style: {
        fontSize: "13.5px",
        color: T.inkSoft,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      } }, vehicle.brand, " ", vehicle.model || ""), vehicle.plate && /* @__PURE__ */ React.createElement("span", { style: {
        fontFamily: F.mono,
        fontSize: "11px",
        color: T.inkFaint
      } }, vehicle.plate)),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px", flexShrink: 0, fontSize: "13px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "10px", alignItems: "center" } }, meta), actions)
    );
  };
  const FabricioSection = ({ damages, onSelectVehicle, collapsed, onToggleCollapse }) => {
    const [filterGravedad, setFilterGravedad] = useState("todas");
    const [filterUrgent, setFilterUrgent] = useState(false);
    const filtered = useMemo(() => {
      let arr = damages;
      if (filterGravedad !== "todas") arr = arr.filter((d) => d.damage.gravedad === filterGravedad);
      if (filterUrgent) {
        arr = arr.filter((d) => {
          if (!d.vehicle.nextRentalDate) return false;
          const days = daysBetween(nowIso(), d.vehicle.nextRentalDate);
          return days !== null && days <= 7;
        });
      }
      return arr;
    }, [damages, filterGravedad, filterUrgent]);
    const counts = useMemo(() => {
      const c = { GRAVE: 0, MODERADO: 0, LEVE: 0 };
      for (const { damage } of damages) {
        if (c[damage.gravedad] !== void 0) c[damage.gravedad]++;
      }
      return c;
    }, [damages]);
    return /* @__PURE__ */ React.createElement(
      TodaySection,
      {
        icon: Wrench,
        title: "Para Fabricio \u2014 da\xF1os por reparar",
        subtitle: "Ordenados por gravedad y urgencia de pr\xF3xima salida. Avis\xE1 a Fabricio para que asigne mec\xE1nico.",
        count: filtered.length === damages.length ? damages.length : `${filtered.length}/${damages.length}`,
        accent: WORKFLOW_STATES.EN_REPARACION.accent,
        sectionKey: "fabricio",
        collapsed,
        onToggleCollapse
      },
      /* @__PURE__ */ React.createElement("div", { style: {
        padding: "10px 18px",
        background: T.bgAlt,
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
        alignItems: "center",
        borderBottom: `1px solid ${T.border}`,
        fontSize: "11px"
      } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.inkFaint, marginRight: "6px" } }, "Filtrar:"), /* @__PURE__ */ React.createElement(FilterChip, { active: filterGravedad === "todas", onClick: () => setFilterGravedad("todas") }, "Todas (", damages.length, ")"), ["GRAVE", "MODERADO", "LEVE"].map((g) => {
        const th = GRAVEDAD_THEME[g];
        return /* @__PURE__ */ React.createElement(
          FilterChip,
          {
            key: g,
            active: filterGravedad === g,
            onClick: () => setFilterGravedad(g),
            accent: th.accent,
            activeBg: th.accent
          },
          th.label.toLowerCase(),
          " (",
          counts[g],
          ")"
        );
      }), /* @__PURE__ */ React.createElement("div", { style: { width: 1, height: 20, background: T.border, margin: "0 4px" } }), /* @__PURE__ */ React.createElement(
        FilterChip,
        {
          active: filterUrgent,
          onClick: () => setFilterUrgent((u) => !u),
          accent: T.danger,
          activeBg: T.danger
        },
        "Sale \u2264 7 d\xEDas"
      )),
      filtered.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "20px", textAlign: "center", fontSize: "13.5px", color: T.inkSoft, fontStyle: "italic" } }, "Ning\xFAn da\xF1o coincide con los filtros.") : filtered.map(({ damage, vehicle }, i) => {
        const grav = GRAVEDAD_THEME[damage.gravedad];
        const days = vehicle.nextRentalDate ? daysBetween(nowIso(), vehicle.nextRentalDate) : null;
        const urgent = days !== null && days <= 2;
        return /* @__PURE__ */ React.createElement(
          "div",
          {
            key: damage.id || i,
            onClick: () => onSelectVehicle(vehicle.id),
            style: {
              padding: "10px 18px",
              display: "grid",
              gridTemplateColumns: "90px 90px 1fr auto",
              gap: "14px",
              alignItems: "center",
              borderBottom: `1px solid ${T.border}`,
              cursor: "pointer",
              transition: "background 100ms"
            },
            onMouseEnter: (e) => e.currentTarget.style.background = T.bgAlt,
            onMouseLeave: (e) => e.currentTarget.style.background = "transparent"
          },
          grav ? /* @__PURE__ */ React.createElement("span", { style: {
            background: grav.bg,
            color: grav.color,
            padding: "2px 8px",
            borderRadius: "8px",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textAlign: "center",
            textTransform: "uppercase"
          } }, grav.label) : /* @__PURE__ */ React.createElement("span", { style: { color: T.inkFaint, fontSize: "10px" } }, "\u2014"),
          /* @__PURE__ */ React.createElement("span", { style: {
            fontFamily: F.mono,
            fontWeight: 700,
            color: T.ink,
            fontSize: "13.5px"
          } }, vehicle.id),
          /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", fontWeight: 500, color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, damage.zona || damage.description || "\u2014", damage.tipoDano && /* @__PURE__ */ React.createElement("span", { style: { color: T.inkSoft, fontWeight: 400 } }, " \xB7 ", damage.tipoDano)), damage.requierePiezas && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10.5px", color: T.warn, fontWeight: 600, marginTop: "2px" } }, "\u2699 requiere piezas")),
          /* @__PURE__ */ React.createElement("span", { style: {
            fontSize: "11px",
            color: urgent ? T.danger : T.inkSoft,
            fontWeight: urgent ? 700 : 500,
            fontFamily: F.mono,
            textAlign: "right",
            minWidth: "70px"
          } }, days === null ? "\u2014" : days < 0 ? `tarde ${Math.abs(days)}d` : days === 0 ? "hoy" : days === 1 ? "ma\xF1ana" : `en ${days}d`)
        );
      })
    );
  };
  // ── Aviso a Oficina por WhatsApp (escritorio) ──────────────────────────
  // Contactos de Oficina en formato internacional (sin "+" ni espacios).
  const OFICINA_CONTACTOS = [
    { nombre: "Pedro", tel: "34722535697" },
    { nombre: "Rosana", tel: "34616718237" }
  ];
  // Construye el mensaje EXACTO según el tipo de gestión registrada.
  function mensajeAvisoOficina(entry) {
    if (!entry) return "";
    const ac = String(entry.vehicleId || "").replace(/-/g, " ").replace(/\s+/g, " ").trim();
    return entry.tipo === "fianza"
      ? `${ac} DEVOLVER FIANZA`
      : `${ac} PRESUPUESTO CARGADO EN HQ`;
  }
  function telOficina(nombre) {
    const c = OFICINA_CONTACTOS.find((x) => x.nombre === nombre);
    return c ? c.tel : (OFICINA_CONTACTOS[0] && OFICINA_CONTACTOS[0].tel);
  }
  // Abre WhatsApp DE ESCRITORIO (protocolo whatsapp://) en el chat del contacto
  // con el texto ya escrito. No navega fuera del cockpit: el SO intercepta el enlace.
  function lanzarWhatsappOficina(tel, texto) {
    if (!texto || !tel) return;
    const url = `whatsapp://send?phone=${tel}&text=${encodeURIComponent(texto)}`;
    const a = document.createElement("a");
    a.href = url;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { try { document.body.removeChild(a); } catch (e) {} }, 200);
  }
  // Solo se consideran "pendientes de avisar" las gestiones registradas desde
  // que esta función está activa (30-ago-2026). El histórico anterior se avisó a mano.
  const AVISO_OFICINA_DESDE = "2026-08-29T22:00:00.000Z"; // 30-ago-2026 00:00 Europe/Madrid
  const DepositsView = ({ state, onSelectVehicle, onMarkFianzaAvisada, onMarkAvisoOficina, onDepositEvent, onLeftUnreviewed, onImportDepositEvents, onAsumir, onGoToTab, requestConfirm, onEditDepositDate, onDeleteDepositEvent, onEditDepositTipo, onSetDepositNota, onSetDepositDisputa }) => {
    const today2 = todayKey();
    const [depSearch, setDepSearch] = React.useState("");
    const [depSede, setDepSede] = React.useState("Todas");
    const [fechaModal, setFechaModal] = React.useState(null);
    const [manualModal, setManualModal] = React.useState(null);
    const [showRecent, setShowRecent] = React.useState(false);
    const [editDep, setEditDep] = React.useState(null);
    const [notaEdit, setNotaEdit] = React.useState(null);
    const [eventSearch, setEventSearch] = React.useState("");
    // Escala de disputa para presupuestos por daños: el cliente puede discutir el cobro.
    const DISPUTA_NIVELES = {
      leve: { label: "Leve", color: "#16A34A", desc: "Se queja por tel\xE9fono pero acepta el cobro" },
      moderado: { label: "Moderado", color: "#EAB308", desc: "Viene a discutir en persona, sin reclamaci\xF3n legal" },
      grave: { label: "Grave", color: "#DC2626", desc: "Viene en persona y no cambia de opini\xF3n" }
    };
    // Destinatario del aviso (por defecto Pedro; Rosana disponible).
    const [avisoTarget, setAvisoTarget] = React.useState("Pedro");
    // COLA de gestiones pendientes de avisar a Oficina: todas las que registraste
    // (desde el corte) y aún no avisaste ni descartaste. Se acumulan aunque
    // resuelvas 10 fianzas juntas y avises después; se ordenan por orden de gestión.
    const avisosPendientes = useMemo(() => {
      const log = Array.isArray(state.depositLog) ? state.depositLog : [];
      return log
        .filter((e) => e && !e.avisadoOficina && e.at && e.at >= AVISO_OFICINA_DESDE)
        .sort((a, b) => new Date(a.at) - new Date(b.at));
    }, [state.depositLog]);
    // Reservas de HQ (los mismos Excels que se cargan para el informe YoY en Estadísticas).
    // Los usamos como FUENTE DE VERDAD para la pestaña Fianzas: cliente, fechas y salida/vuelta
    // salen directamente de HQ en vez del reservaHistory del cockpit (que puede estar desactualizado).
    const [hqReservas2026, setHqReservas2026] = useState(null);
    const [hqReservas2025, setHqReservas2025] = useState(null);
    useEffect(() => {
      let alive = true;
      const loadSlot = async (key, setter) => {
        try {
          const r = await window.storage.get(key);
          if (r && alive) setter(JSON.parse(r.value));
        } catch {}
      };
      loadSlot("ac_yoy_reservas_2026", setHqReservas2026);
      loadSlot("ac_yoy_reservas_2025", setHqReservas2025);
      return () => { alive = false; };
    }, []);
    // Agrupa reservas HQ por AC del vehículo, ordenadas por fecha de devolución DESC.
    // Reutiliza el mismo matchKey del informe: "284" (historial) matchea con "AC-284A" (flota).
    const hqReservasPorAc = useMemo(() => {
      const rows = [...(hqReservas2026?.rows || []), ...(hqReservas2025?.rows || [])];
      const byAc = {};
      for (const r of rows) {
        // vehiculo viene como "AC-315 Kronos 279 4763NLH" — extraigo el AC (primer token)
        const acRaw = String(r.vehiculo || "").trim().split(/\s+/)[0] || "";
        if (!acRaw) continue;
        const norm = acRaw.toUpperCase().trim();
        const m = norm.match(/^(AC|CB)-?(\d+)/);
        const key = m ? `${m[1]}-${m[2]}` : norm;
        if (!byAc[key]) byAc[key] = [];
        byAc[key].push(r);
      }
      // Ordenar cada lista por fechaDevolucion DESC
      for (const k of Object.keys(byAc)) {
        byAc[k].sort((a, b) => new Date(b.fechaDevolucion) - new Date(a.fechaDevolucion));
      }
      return byAc;
    }, [hqReservas2026, hqReservas2025]);
    // Devuelve la clave normalizada para buscar en hqReservasPorAc dado un id de vehículo
    const acMatchKeyFn = (id) => {
      const s = String(id || "").toUpperCase().trim();
      const m = s.match(/^(AC|CB)-?(\d+)/);
      return m ? `${m[1]}-${m[2]}` : s;
    };
   // Devuelve la reserva HQ más reciente cuya fecha de devolución
// YA HA PASADO. Nunca devuelve una reserva futura/en curso.
const getHqReservaActual = (vehicleId) => {
  const key = acMatchKeyFn(vehicleId);
  const list = hqReservasPorAc[key];

  if (!list || list.length === 0) return null;

  const now = Date.now();

  const completadas = list.filter((r) => {
    if (!r.fechaDevolucion) return false;

    const devTime = new Date(r.fechaDevolucion).getTime();

    return Number.isFinite(devTime) && devTime <= now;
  });

  if (completadas.length === 0) return null;

  return completadas[0];
};
    // ¿Existe evento del cockpit para este vehículo entre fechaDevolucion de la reserva
    // y la salida de la próxima reserva del mismo AC (o "ahora" si no hay próxima)?
    // Si existe → esta reserva ya fue gestionada (fianza o presupuesto).
    const normReservaKey = (value) => String(value || "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "");

const normClienteKey = (value) => String(value || "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "");

const completedHqReservasForVehicle = (vehicleId) => {
  const key = acMatchKeyFn(vehicleId);
  const list = hqReservasPorAc[key] || [];
  const cutoff = new Date("2026-07-27T00:00:00").getTime();
  const now = Date.now();
  const seen = new Set();
  const out = [];

  for (const r of list) {
    const d = new Date(r.fechaDevolucion || "").getTime();
    if (!Number.isFinite(d) || d > now || d < cutoff) continue;

    const rid = normReservaKey(r.reservaId);
    const composite = [
      normClienteKey(r.cliente),
      String(r.fechaDevolucion || "").slice(0, 10)
    ].join("|");
    const key2 = rid ? `id|${rid}` : `cmp|${composite}`;
    if (seen.has(key2)) continue;
    seen.add(key2);
    out.push(r);
  }

  out.sort((a, b) =>
    new Date(b.fechaDevolucion || 0) -
    new Date(a.fechaDevolucion || 0)
  );
  return out;
};

const eventMatchesHqReservation = (vehicleId, hqReserva, event) => {
  if (!event || event.vehicleId !== vehicleId || !hqReserva) return false;

  const hqId = normReservaKey(hqReserva.reservaId);
  const evId = normReservaKey(event.reservaId);

  if (hqId && evId) return hqId === evId;
  if (evId && hqId && evId !== hqId) return false;

  const clienteOk =
    normClienteKey(event.titular) &&
    normClienteKey(event.titular) === normClienteKey(hqReserva.cliente);

  if (!clienteOk) return false;

  const hqDev = new Date(hqReserva.fechaDevolucion || "").getTime();
  const eventDevValue =
    event.alquilerDevolucion ||
    event.fechaDevolucion ||
    event.returnedAt ||
    "";
  const eventDev = new Date(eventDevValue).getTime();

  if (!Number.isFinite(hqDev) || !Number.isFinite(eventDev)) return false;

  return Math.abs(eventDev - hqDev) <= 72 * 36e5;
};

const isHqReservaGestionada = (vehicleId, hqReserva, allDepositEvents) => {
  if (!hqReserva) return false;
  return (allDepositEvents || []).some((e) =>
    eventMatchesHqReservation(vehicleId, hqReserva, e)
  );
};

    const sedes = useMemo(() => {
      const set = /* @__PURE__ */ new Set();
      state.vehicles.forEach((v) => v.location && set.add(v.location));
      return ["Todas", ...[...set].sort()];
    }, [state.vehicles]);
    const lists = useMemo(() => {
      const withStatus = state.vehicles.map((v) => ({
        v,
        status: computeVehicleStatus(v, state.damages),
        damages: state.damages.filter((d) => d.vehicleId === v.id)
      }));
      const devolverCompleta = withStatus.filter(({ v }) => {
        if (!v.lastInspectedAt) return false;
        if (v.lastReturnHasNewDamages !== false) return false;
        if (v.fianzaAvisoEnviado) return false;
        return true;
      }).sort((a, b) => {
        const ta = a.v.lastInspectedAt ? new Date(a.v.lastInspectedAt).getTime() : 0;
        const tb = b.v.lastInspectedAt ? new Date(b.v.lastInspectedAt).getTime() : 0;
        return tb - ta;
      });
      const conRetencion = withStatus.filter(({ damages }) => damages.some((d) => damageCargo(d) === "NUEVO")).map(({ v, damages }) => ({
        v,
        newDamages: damages.filter((d) => damageCargo(d) === "NUEVO"),
        oldestImport: damages.reduce((min, d) => damageCargo(d) === "NUEVO" && d.importedAt && (!min || d.importedAt < min) ? d.importedAt : min, null)
      })).sort((a, b) => {
        const oa = a.oldestImport ? new Date(a.oldestImport).getTime() : Infinity;
        const ob = b.oldestImport ? new Date(b.oldestImport).getTime() : Infinity;
        return oa - ob;
      });
      const avisadasHoy = withStatus.filter(({ v }) => v.fianzaAvisoEnviado && v.fianzaAvisoEnviadoAt && v.fianzaAvisoEnviadoAt.slice(0, 10) === today2).sort((a, b) => {
        const ta = new Date(a.v.fianzaAvisoEnviadoAt).getTime();
        const tb = new Date(b.v.fianzaAvisoEnviadoAt).getTime();
        return tb - ta;
      });
      const depositLog = state.depositLog || [];
      const leftLog = state.leftUnreviewedLog || [];
      // ======================================================================
      // DISEÑO SIMPLE (agosto 2026, tras varios parches acumulados)
      // Un vehículo aparece en "Registrar gestión" si y solo si:
      //   1. Fue revisado (lastInspectedAt existe)
      //   2. Tiene una reserva HQ terminada (última reserva HQ con devolución ≤ hoy)
      //   3. Para esa reserva, no hay evento tuyo (depositLog o leftUnreviewedLog)
      //      cuya fecha 'at' sea ≥ fecha de salida (fechaEntrega) de la reserva.
      // Cliente y fechas se muestran directamente de HQ (siempre correctos).
      // Requisito operativo: el Excel HQ de reservas completadas debe estar al día
      // (Sebastián lo actualiza diariamente).
      // ======================================================================
      // PENDIENTES REALES: UNA sola fila por vehículo: la reserva HQ completada
      // más reciente que todavía no tenga una gestión asociada.
      //
      // IMPORTANTE: no recorremos todo el histórico buscando pendientes.
      // Si un vehículo tiene 10 alquileres históricos ya terminados, solo puede
      // haber UNA gestión pendiente ahora mismo: la correspondiente al último
      // alquiler terminado. Los alquileres anteriores ya no vuelven a entrar.
      //
      // La identidad primaria sigue siendo ReservaID. Para históricos antiguos
      // que no tienen ReservaID en el evento, isHqReservaGestionada() usa el
      // fallback titular + devolución (72h).
      // PENDIENTES: una única fuente de disparo (REVISADO) y un único filtro de histórico.
      // El Excel/HQ solo aporta los datos del candidato cuando faltan en el estado del vehículo.
      // Una gestión histórica dentro de ±3 días de la devolución cierra ese ciclo y evita que
      // vuelva a aparecer, aunque el titular que HQ muestre ahora sea incorrecto.
      const normAc = (value) => {
        const s = String(value || "").toUpperCase().trim();
        const m = s.match(/^(AC|CB)-?(\d+)/);
        return m ? `${m[1]}-${m[2]}` : s;
      };
      const normPerson = (value) => String(value || "")
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
      const dayKey = (value) => {
        const d = new Date(value || "");
        return Number.isFinite(d.getTime()) ? new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() : NaN;
      };
      const withinThreeDays = (a, b) => {
        const da = dayKey(a), db = dayKey(b);
        return Number.isFinite(da) && Number.isFinite(db) && Math.abs(da - db) <= 3 * 86400000;
      };
      const candidateAlreadyManaged = (vehicleId, candidate, logs, cycleStart, cycleAt) => {
        const ac = normAc(vehicleId);
        const candidateName = normPerson(candidate?.cliente || "");
        const candidateDate = candidate?.devolucion || candidate?.returnedAt || "";
        const candidateResId = normReservaKey(candidate?.reservaId || "");
        // Inicio del ciclo actual (VOLVIÓ). Si se pasa, una gestión registrada ANTES
        // de este regreso pertenece a un ciclo ANTERIOR y NO cuenta como "gestionada".
        // Rescata fianzas cuando el 720 dejó currentReservaId apuntando a una reserva
        // ya gestionada de un ciclo previo (caso AC-309 / AC-320, 01-sep-2026).
        const cycleStartMs = cycleStart ? new Date(cycleStart).getTime() : null;
        const cycleAtMs = cycleAt ? new Date(cycleAt).getTime() : null;
        return (logs || []).some((e) => {
          if (normAc(e.vehicleId) !== ac) return false;
          if (cycleStartMs && Number.isFinite(cycleStartMs)) {
            const eAt = new Date(e.at || 0).getTime();
            if (Number.isFinite(eAt) && eAt < cycleStartMs - 24 * 36e5) return false;
          }
          // 0) MATCH POR CICLO: un evento cuyo returnedAt coincide con el inicio del ciclo
          //    (VOLVIÓ/llegada) gestiona ESA fianza aunque falte el reservaId. Resuelve el
          //    falso pendiente cuando el 720 dejó currentReservaId vacío y el arrivalLog
          //    trajo fecha de devolución desfasada (caso AC-315, 08-sep-2026).
          if (cycleAtMs && Number.isFinite(cycleAtMs)) {
            const eRet = new Date(e.returnedAt || 0).getTime();
            if (Number.isFinite(eRet) && Math.abs(eRet - cycleAtMs) <= 36e5) return true;
          }
          // 1) MATCH EXACTO por reservaId (identidad primaria que aporta el 720).
          //    Si ambos tienen ID, el ID manda: mismo ID = gestionada; distinto = otro ciclo.
          const eventResId = normReservaKey(e.reservaId || "");
          if (candidateResId && eventResId) return candidateResId === eventResId;
          // 2) Fallback para eventos históricos SIN reservaId: AC + fecha (±3 días) + nombre.
          if (!candidateDate) return false;
          const eventDate = e.alquilerDevolucion || e.returnedAt || e.fechaDevolucion || "";
          if (!withinThreeDays(eventDate, candidateDate)) return false;
          const eventName = normPerson(e.titular || "");
          return !candidateName || !eventName || eventName === candidateName || withinThreeDays(eventDate, candidateDate);
        });
      };

      const pendingRows = [];
      for (const v of state.vehicles) {
        // DISPARO ÚNICO: el vehículo fue marcado VOLVIÓ y luego REVISADO.
        if (v.workflowStatus !== "REVISADO" || !v.lastInspectedAt) continue;

        // ELEGIBILIDAD 48h: solo se excluye si en el momento del VOLVIÓ quedó marcado
        // NO elegible (regresó >48h antes de la devolución prevista y NO se pulsó
        // "SE ADELANTÓ REGRESO"). Los ciclos antiguos no llevan esta marca (undefined)
        // → siguen entrando con normalidad (no ocultamos pendientes reales).
        if (v.fianzaElegible === false) continue;

        // FUENTE ÚNICA DE DATOS: el estado del vehículo, poblado por el 720
        // (currentClient / currentReservaId / rentalStartDate) y congelado al VOLVIÓ
        // (fianzaDevolucionPrevista). Ya NO se usa el Excel de reservas completadas.
        const candidate = {
          cliente: v.currentClient || "",
          salida: v.rentalStartDate || v.lastExitAt || "",
          devolucion: v.fianzaDevolucionPrevista || v.returnedAt || v.lastReturnAt || "",
          reservaId: v.currentReservaId || ""
        };
        // Sin identidad del 720 (reserva o cliente) no hay fianza que gestionar.
        if (!candidate.reservaId && !candidate.cliente) continue;

        const logs = [...depositLog, ...leftLog];
        // Fuente A: pasamos el inicio del ciclo actual (VOLVIÓ) para ignorar gestiones
        // de ciclos anteriores cuando currentReservaId quedó desactualizado.
        if (candidateAlreadyManaged(v.id, candidate, logs, v.returnedAt || v.lastReturnAt, v.returnedAt || v.lastReturnAt)) continue;

        const damages = state.damages.filter((d) => d.vehicleId === v.id);
        pendingRows.push({
          v,
          hqReserva: candidate,
          tit: {
            cliente: candidate.cliente,
            salida: candidate.salida,
            devolucion: candidate.devolucion,
            _hqReservaId: candidate.reservaId
          },
          tieneDanosNuevos: damages.some((d) => damageCargo(d) === "NUEVO")
        });
      }

      // ======================================================================
      // FUENTE B — FIANZAS "PERDIDAS" POR RE-ALQUILER
      // ----------------------------------------------------------------------
      // Un vehículo puede haberse marcado VOLVIÓ y revisado, y volver a salir
      // EN_USO ANTES de gestionar su fianza. En ese momento su estado vivo deja
      // de ser REVISADO (y currentClient/currentReservaId pasan a ser del NUEVO
      // alquiler), así que la Fuente A ya no lo ve y la fianza se perdería.
      // El arrivalLog SÍ conserva el ciclo devuelto (reservaId + cliente + fecha),
      // así que la fianza se recupera desde ahí.
      // Filtros para NO reintroducir ruido antiguo:
      //   - Solo la ÚLTIMA llegada por vehículo, CON reservaId real, desde el corte.
      //   - Ese ciclo tiene que estar revisado (reviewLog ligado por returnedAt≈at,
      //     o lastInspectedAt >= at) y NO gestionado.
      //   - No duplicar lo que ya trajo la Fuente A (dedup por AC).
      // ======================================================================
      const arrivalLog = Array.isArray(state.arrivalLog) ? state.arrivalLog : [];
      const reviewLog = Array.isArray(state.reviewLog) ? state.reviewLog : [];
      const cutoffFianza = new Date("2026-07-27T00:00:00").getTime();
      const yaEnPendientes = new Set(pendingRows.map((r) => normAc(r.v.id)));
      const ultimaLlegadaPorAc = {};
      for (const a of arrivalLog) {
        const at = new Date(a.at || "").getTime();
        if (!Number.isFinite(at) || at < cutoffFianza) continue;
        if (!a.reservaId) continue; // exige identidad real del ciclo
        const ac = normAc(a.vehicleId);
        if (!ultimaLlegadaPorAc[ac] || at > new Date(ultimaLlegadaPorAc[ac].at).getTime()) {
          ultimaLlegadaPorAc[ac] = a;
        }
      }
      for (const ac of Object.keys(ultimaLlegadaPorAc)) {
        if (yaEnPendientes.has(ac)) continue;
        const a = ultimaLlegadaPorAc[ac];
        const at = new Date(a.at).getTime();
        const v = state.vehicles.find((x) => normAc(x.id) === ac);
        if (!v) continue;
        if (v.fianzaElegible === false) continue;
        const revLinked = reviewLog.some((r) => normAc(r.vehicleId) === ac && Math.abs(new Date(r.returnedAt || 0).getTime() - at) <= 36e5);
        const inspAfter = v.lastInspectedAt && new Date(v.lastInspectedAt).getTime() >= at - 36e5;
        if (!revLinked && !inspAfter) continue;
        const candidate = {
          cliente: a.cliente || "",
          salida: a.fechaEntrega || a.salida || "",
          devolucion: a.fechaDevolucion || a.returnedAt || a.at || "",
          reservaId: a.reservaId || ""
        };
        const logsB = [...depositLog, ...leftLog];
        if (candidateAlreadyManaged(v.id, candidate, logsB, null, a.at)) continue;
        const damages = state.damages.filter((d) => d.vehicleId === v.id);
        pendingRows.push({
          v,
          hqReserva: candidate,
          reAlquilada: computeVehicleStatus(v, state.damages) === "EN_USO",
          arrivalAt: a.at || null,
          tit: {
            cliente: candidate.cliente,
            salida: candidate.salida,
            devolucion: candidate.devolucion,
            _hqReservaId: candidate.reservaId
          },
          tieneDanosNuevos: damages.some((d) => damageCargo(d) === "NUEVO")
        });
      }

      pendingRows.sort((a, b) =>
        new Date(b.hqReserva.devolucion || b.hqReserva.fechaDevolucion || 0) -
        new Date(a.hqReserva.devolucion || a.hqReserva.fechaDevolucion || 0)
      );

      const pendientesGestion = pendingRows;
      return { devolverCompleta, conRetencion, avisadasHoy, pendientesGestion };
    }, [state.vehicles, state.damages, state.depositLog, state.leftUnreviewedLog, state.arrivalLog, state.reviewLog, today2, hqReservasPorAc]);
    const pendientesFiltrados = useMemo(() => {
      const q = depSearch.toLowerCase().trim();
      return lists.pendientesGestion.filter(({ v, tit }) => {
        if (depSede !== "Todas" && v.location !== depSede) return false;
        if (!q) return true;
        const hay = [
          v.id,
          v.plate,
          v.brand,
          v.model,
          v.location,
          tit ? tit.cliente : "",
          tit ? tit._hqReservaId : ""
        ].join(" ").toLowerCase();
        return hay.includes(q);
      });
    }, [lists.pendientesGestion, depSearch, depSede]);
    const buildRosanaText = () => {
      const lines = lists.devolverCompleta.map(({ v }) => {
        const parts = [`\u2022 ${v.id}`];
        const desc = [v.brand, v.model].filter(Boolean).join(" ");
        if (desc) parts.push(`\u2014 ${desc}`);
        const ids = [];
        if (v.plate) ids.push(v.plate);
        if (v.vin) ids.push(v.vin);
        if (ids.length) parts.push(`(${ids.join(" \xB7 ")})`);
        return parts.join(" ");
      });
      return `Hola Rosana, estos veh\xEDculos volvieron sin da\xF1os nuevos, pod\xE9s devolver la fianza completa:

${lines.join("\n")}`;
    };
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
      const text = buildRosanaText();
      let ok = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          ok = true;
        }
      } catch {
        ok = false;
      }
      if (!ok) {
        try {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          ok = document.execCommand("copy");
          document.body.removeChild(ta);
        } catch {
          ok = false;
        }
      }
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        await requestConfirm({
          title: "Copi\xE1 este texto para Rosana",
          message: text,
          confirmLabel: "Listo",
          cancelLabel: "",
          variant: "primary"
        });
      }
    };
    const totalDevolver = lists.devolverCompleta.length;
    const totalRetencion = lists.conRetencion.length;
    // Modal para registrar una gestión pasada de un vehículo que ya no está en la lista.
    // Búsqueda por AC/matrícula/modelo, elige tipo (presupuesto/fianza) y fecha.
    const renderManualModal = () => {
      const q = String(manualModal.search || "").toLowerCase().trim();
      const opciones = (state.vehicles || []).filter((v) => {
        if (!q) return true;
        return [v.id, v.plate, v.brand, v.model].join(" ").toLowerCase().includes(q);
      }).slice(0, 30);
      const selVeh = manualModal.vehicleId ? state.vehicles.find((v) => v.id === manualModal.vehicleId) : null;
      const overlayStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" };
      const innerStyle = { background: T.surface, borderRadius: "18px", padding: "22px", width: "100%", maxWidth: "460px", maxHeight: "85vh", overflow: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.3)" };
      const labelStyle = { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: T.inkFaint, display: "block", marginBottom: "5px" };
      const inputStyle = { width: "100%", padding: "9px 12px", border: "1px solid " + T.border, borderRadius: "12px", fontSize: "14px", marginBottom: "8px", boxSizing: "border-box" };
      const dateStyle = { width: "100%", padding: "9px 12px", border: "1px solid " + T.border, borderRadius: "12px", fontSize: "14px", marginBottom: "18px", boxSizing: "border-box" };
      const vehChipStyle = { padding: "10px 12px", background: T.bgAlt, border: "1px solid " + T.border, borderRadius: "12px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" };
      const listStyle = { maxHeight: "180px", overflow: "auto", border: "1px solid " + T.border, borderRadius: "12px", marginBottom: "12px" };
      const rowStyle = { padding: "8px 12px", cursor: "pointer", borderBottom: "1px solid " + T.border, fontSize: "13.5px" };
      const tipoBtnStyle = (t) => ({ flex: 1, padding: "10px", border: "1px solid " + (manualModal.tipo === t ? T.rust : T.border), background: manualModal.tipo === t ? T.rust : T.surface, color: manualModal.tipo === t ? "white" : T.ink, borderRadius: "12px", cursor: "pointer", fontSize: "13.5px", fontWeight: 600 });
      const vehChipContent = selVeh ? React.createElement("div", { style: vehChipStyle },
        React.createElement("span", null, React.createElement("strong", null, selVeh.id), " \xB7 ", [selVeh.brand, selVeh.model].filter(Boolean).join(" ")),
        React.createElement("button", { onClick: () => setManualModal((m) => ({ ...m, vehicleId: "", search: "" })), style: { fontSize: "11px", color: T.rust, background: "transparent", border: "none", cursor: "pointer" } }, "Cambiar")
      ) : React.createElement(React.Fragment, null,
        React.createElement("input", { type: "text", value: manualModal.search || "", onChange: (e) => setManualModal((m) => ({ ...m, search: e.target.value })), placeholder: "Buscar AC, matr\xEDcula, modelo\u2026", style: inputStyle }),
        React.createElement("div", { style: listStyle }, opciones.length === 0 ? React.createElement("div", { style: { padding: "10px", textAlign: "center", color: T.inkFaint, fontSize: "13px" } }, "Sin resultados") : opciones.map((v) => React.createElement("div", { key: v.id, onClick: () => setManualModal((m) => ({ ...m, vehicleId: v.id })), style: rowStyle }, React.createElement("strong", null, v.id), " \xB7 ", [v.brand, v.model].filter(Boolean).join(" "), v.plate ? " \xB7 " + v.plate : "")))
      );
      const tipoButtons = React.createElement("div", { style: { display: "flex", gap: "8px", marginBottom: "12px" } },
        React.createElement("button", { onClick: () => setManualModal((m) => ({ ...m, tipo: "presupuesto" })), style: tipoBtnStyle("presupuesto") }, "\u{1F4C4} Pas\xE9 presupuesto"),
        React.createElement("button", { onClick: () => setManualModal((m) => ({ ...m, tipo: "fianza" })), style: tipoBtnStyle("fianza") }, "\u{1F4B0} Devolv\xED fianza")
      );
      const actions = React.createElement("div", { style: { display: "flex", gap: "8px", justifyContent: "flex-end" } },
        React.createElement(Btn, { variant: "secondary", sm: true, onClick: () => setManualModal(null) }, "Cancelar"),
        React.createElement(Btn, { variant: "primary", sm: true, onClick: () => {
          if (!manualModal.vehicleId) return;
          onDepositEvent(manualModal.vehicleId, manualModal.tipo, manualModal.fecha);
          setManualModal(null);
        } }, "Registrar")
      );
      return React.createElement("div", { onClick: () => setManualModal(null), style: overlayStyle },
        React.createElement("div", { onClick: (e) => e.stopPropagation(), style: innerStyle },
          React.createElement("div", { style: { fontFamily: F.display, fontSize: "17px", fontWeight: 700, color: T.ink, marginBottom: "4px" } }, "+ Registrar gesti\xF3n pasada"),
          React.createElement("div", { style: { fontSize: "13.5px", color: T.inkSoft, marginBottom: "14px" } }, "Para veh\xEDculos que ya no aparecen en la lista pero necesit\xE1s registrar la gesti\xF3n."),
          React.createElement("label", { style: labelStyle }, "Veh\xEDculo"),
          vehChipContent,
          React.createElement("label", { style: labelStyle }, "Tipo de gesti\xF3n"),
          tipoButtons,
          selVeh && React.createElement("label", { style: labelStyle }, "Cliente (opcional)"),
          selVeh && React.createElement("input", { type: "text", value: manualModal.cliente || "", onChange: (e) => setManualModal((m) => ({ ...m, cliente: e.target.value })), placeholder: "Titular de la fianza (ej. Ditesa Reformas…)", style: inputStyle }),
          selVeh && React.createElement("label", { style: labelStyle }, "N\xBA de reserva (opcional)"),
          selVeh && React.createElement("input", { type: "text", value: manualModal.reservaId || "", onChange: (e) => setManualModal((m) => ({ ...m, reservaId: e.target.value })), placeholder: "ej. 26 09156 Valencia", style: inputStyle }),
          selVeh && React.createElement("div", { style: { fontSize: "11px", color: T.inkFaint, marginBottom: "12px", marginTop: "-2px" } }, "Si el veh\xEDculo ya se re-alquil\xF3 y el cockpit perdi\xF3 los datos del ciclo, escrib\xED aqu\xED el cliente y el n\xBA de reserva para que la gesti\xF3n quede bien registrada."),
         React.createElement("label", { style: labelStyle }, "Fecha y hora"),
React.createElement("input", {
  type: "datetime-local",
  value: manualModal.fecha,
  onChange: (e) => setManualModal((m) => ({ ...m, fecha: e.target.value })),
  style: dateStyle
}),
          actions
        )
      );
    };
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "22px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: "11px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.15em",
      color: T.inkFaint,
      marginBottom: "4px"
    } }, "Fianzas"), /* @__PURE__ */ React.createElement("h1", { style: {
      margin: 0,
      fontFamily: F.display,
      fontSize: "30px",
      fontWeight: 600,
      letterSpacing: "-0.025em",
      color: T.ink,
      lineHeight: 1.1
    } }, totalDevolver === 0 && totalRetencion === 0 ? "Sin fianzas pendientes" : `${totalDevolver} para devolver \xB7 ${totalRetencion} con retenci\xF3n`)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setManualModal({ vehicleId: "", tipo: "presupuesto", fecha: `${today2}T${new Date().toTimeString().slice(0, 5)}`, search: "" }), style: { cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "white", background: T.rust, border: "none", borderRadius: "12px", padding: "8px 12px", whiteSpace: "nowrap" } }, "+ Registrar gesti\xF3n pasada"), /* @__PURE__ */ React.createElement("label", { style: { cursor: "pointer", fontSize: "13px", fontWeight: 600, color: T.inkSoft, background: T.surface, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "8px 12px", whiteSpace: "nowrap" } }, "\u{1F4E5} Importar eventos (JSON)", /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".json", onChange: onImportDepositEvents, style: { display: "none" } })))), avisosPendientes.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "20px", padding: "14px 16px", background: T.surface, border: `1px solid ${T.border}`, borderLeft: "4px solid #1E7A34", borderRadius: "18px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "10px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", color: T.ink, fontWeight: 700 } }, "\u{1F4E2} Avisar a Oficina", /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 400, color: T.inkSoft } }, " — ", avisosPendientes.length, " sin avisar")), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "13px", color: T.inkSoft } }, "Destinatario:"), OFICINA_CONTACTOS.map((c) => /* @__PURE__ */ React.createElement("button", { key: c.nombre, onClick: () => setAvisoTarget(c.nombre), style: { cursor: "pointer", fontSize: "13px", fontWeight: 700, color: avisoTarget === c.nombre ? "white" : T.inkSoft, background: avisoTarget === c.nombre ? "#1E7A34" : T.bgAlt, border: `1px solid ${avisoTarget === c.nombre ? "#1E7A34" : T.border}`, borderRadius: "999px", padding: "5px 12px" } }, c.nombre)), /* @__PURE__ */ React.createElement("button", { onClick: () => { lanzarWhatsappOficina(telOficina(avisoTarget), avisosPendientes.map(mensajeAvisoOficina).join("\n")); onMarkAvisoOficina && onMarkAvisoOficina(avisosPendientes.map((e) => e.id)); }, style: { cursor: "pointer", fontSize: "14px", fontWeight: 700, color: "white", background: T.rust, border: "none", borderRadius: "12px", padding: "8px 14px", whiteSpace: "nowrap" } }, "\u{1F4AC} Avisar todas (", avisosPendientes.length, ")")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "6px" } }, avisosPendientes.map((e) => /* @__PURE__ */ React.createElement("div", { key: e.id, style: { display: "flex", alignItems: "center", gap: "8px", background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "7px 10px" } }, /* @__PURE__ */ React.createElement("code", { style: { fontFamily: F.mono, fontSize: "14px", fontWeight: 700, color: e.tipo === "fianza" ? "#15803D" : "#9061F9", flex: 1 } }, mensajeAvisoOficina(e)), /* @__PURE__ */ React.createElement("button", { onClick: () => { lanzarWhatsappOficina(telOficina(avisoTarget), mensajeAvisoOficina(e)); onMarkAvisoOficina && onMarkAvisoOficina(e.id); }, style: { cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "white", background: "#1E7A34", border: "none", borderRadius: "10px", padding: "6px 12px", whiteSpace: "nowrap" } }, "\u{1F4AC} Avisar"), /* @__PURE__ */ React.createElement("button", { onClick: () => onMarkAvisoOficina && onMarkAvisoOficina(e.id), title: "Descartar sin avisar", style: { cursor: "pointer", fontSize: "13px", fontWeight: 600, color: T.inkSoft, background: "transparent", border: `1px solid ${T.border}`, borderRadius: "10px", padding: "6px 9px" } }, "✕")))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkFaint, marginTop: "8px", fontStyle: "italic" } }, "“Avisar todas” manda un solo WhatsApp a ", avisoTarget, " con todas las l\xEDneas. Cada gesti\xF3n desaparece al avisar o descartar.")),  (Array.isArray(state.depositLog) && state.depositLog.some((e) => e.tipo === "presupuesto")) && (() => { const presu2 = state.depositLog.filter((e) => e.tipo === "presupuesto"); const sinCol = presu2.filter((e) => !e.nivelDisputa).length; return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "14px" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: 700, background: sinCol > 0 ? "#FEF3C7" : "#DCFCE7", color: sinCol > 0 ? "#B45309" : "#15803D", border: `1px solid ${sinCol > 0 ? "#FDE047" : "#86EFAC"}` } }, sinCol > 0 ? `⚠️ ${sinCol} de ${presu2.length} presupuestos sin clasificar (sin color)` : `✓ Los ${presu2.length} presupuestos est\xE1n clasificados`)); })(), (onEditDepositDate || onDeleteDepositEvent) && (Array.isArray(state.depositLog) && state.depositLog.length > 0) && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "20px" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowRecent((v) => !v), style: {
      fontSize: "13px",
      fontWeight: 600,
      color: T.inkSoft,
      background: "transparent",
      border: `1px solid ${T.border}`,
      borderRadius: "12px",
      padding: "7px 12px",
      cursor: "pointer"
    } }, showRecent ? "\u25BE" : "\u25B8", " Eventos registrados (", state.depositLog.length, ") \u2014 fecha, tipo, notas y disputa"), showRecent && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "10px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: "18px", overflow: "hidden" } }, [/* @__PURE__ */ React.createElement("input", { key: "__evsearch", value: eventSearch, onChange: (ev) => setEventSearch(ev.target.value), placeholder: "Buscar AC, matr\xEDcula o titular…", style: { width: "100%", boxSizing: "border-box", padding: "9px 13px", fontSize: "13.5px", border: "none", borderBottom: `1px solid ${T.border}`, background: T.bgAlt, color: T.ink, fontFamily: F.mono } }), (() => { const presu = state.depositLog.filter((e) => e.tipo === "presupuesto"); const g = presu.filter((e) => e.nivelDisputa === "grave").length; const m = presu.filter((e) => e.nivelDisputa === "moderado").length; const l = presu.filter((e) => e.nivelDisputa === "leve").length; const disc = g + m + l; const punto = (col) => /* @__PURE__ */ React.createElement("span", { style: { width: 10, height: 10, borderRadius: "50%", background: col, display: "inline-block" } }); return /* @__PURE__ */ React.createElement("div", { key: "__dispsummary", style: { padding: "8px 13px", fontSize: "11.5px", color: T.inkSoft, borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: T.ink } }, "Presupuestos discutidos: ", disc, " / ", presu.length), /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: "5px" } }, punto("#DC2626"), "Grave ", g), /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: "5px" } }, punto("#EAB308"), "Moderado ", m), /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: "5px" } }, punto("#16A34A"), "Leve ", l), /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: "5px", fontWeight: (presu.length - disc) > 0 ? 700 : 400, color: (presu.length - disc) > 0 ? "#B45309" : T.inkSoft } }, punto("#94A3B8"), "Sin color ", presu.length - disc)); })()].concat([...state.depositLog].filter((e) => { const q = eventSearch.trim().toLowerCase(); if (!q) return true; return [e.vehicleId, e.titular, e.reservaId].filter(Boolean).some((x) => String(x).toLowerCase().includes(q)); }).sort((a, b) => new Date(b.at) - new Date(a.at)).map((e) => {
      const veh = state.vehicles.find((x) => x.id === e.vehicleId);
      const fecha = e.at ? new Date(e.at) : null;
      const fechaStr = fecha ? fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "\u2014";
      const editando = editDep && editDep.id === e.id;
      return /* @__PURE__ */ React.createElement("div", { key: e.id, style: { display: "flex", alignItems: "center", gap: "10px", padding: "9px 14px", borderBottom: `1px solid ${T.bgAlt}`, fontSize: "13.5px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: T.ink, minWidth: "58px" } }, e.vehicleId), /* @__PURE__ */ React.createElement("span", { style: { padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 700, background: e.tipo === "fianza" ? "#dbeafe" : "#fef3c7", color: e.tipo === "fianza" ? "#1d4ed8" : "#b45309" } }, e.tipo === "fianza" ? "\u{1F4B0} Fianza" : "\u{1F4C4} Presupuesto"), /* @__PURE__ */ React.createElement("span", { style: { color: T.inkSoft, flex: 1, minWidth: "120px" } }, e.titular || "\u2014"), !editando ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { color: T.inkSoft, fontFamily: F.mono } }, fechaStr, e.fechaManual ? " \u270E" : ""), onEditDepositDate && /* @__PURE__ */ React.createElement("button", { onClick: () => {
        const d = fecha || /* @__PURE__ */ new Date();
const pad = (n) => String(n).padStart(2, "0");
const fechaHoraLocal =
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
  `T${pad(d.getHours())}:${pad(d.getMinutes())}`;

setEditDep({ id: e.id, fecha: fechaHoraLocal });
      }, style: { fontSize: "11px", fontWeight: 600, color: T.rust, background: "transparent", border: `1px solid ${T.border}`, borderRadius: "10px", padding: "3px 9px", cursor: "pointer" } }, "\u{1F553} Editar fecha"), onEditDepositTipo && /* @__PURE__ */ React.createElement("button", { onClick: async () => { const otro = e.tipo === "fianza" ? "presupuesto" : "fianza"; const ok = requestConfirm ? await requestConfirm({ title: "Cambiar tipo de gesti\xF3n", message: `\xBFCambiar esta gesti\xF3n de ${e.tipo === "fianza" ? "Fianza" : "Presupuesto"} a ${otro === "fianza" ? "Fianza" : "Presupuesto"}? Solo cambia la clasificaci\xF3n, no las fechas ni los tiempos.`, confirmLabel: "S\xED, cambiar", cancelLabel: "Cancelar" }) : true; if (ok) onEditDepositTipo(e.id, otro); }, title: "Corregir: cambiar entre Fianza y Presupuesto", style: { fontSize: "11px", fontWeight: 600, color: T.inkSoft, background: "transparent", border: `1px solid ${T.border}`, borderRadius: "10px", padding: "3px 9px", cursor: "pointer" } }, e.tipo === "fianza" ? "→ Presupuesto" : "→ Fianza"), e.tipo === "presupuesto" && onSetDepositDisputa && /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: "3px" }, title: "Nivel de disputa del presupuesto" }, ["leve", "moderado", "grave"].map((niv) => { const activo = e.nivelDisputa === niv; const c = DISPUTA_NIVELES[niv]; return /* @__PURE__ */ React.createElement("button", { key: niv, onClick: () => onSetDepositDisputa(e.id, activo ? null : niv), title: `${c.label} \u2014 ${c.desc}`, style: { width: "16px", height: "16px", borderRadius: "50%", cursor: "pointer", padding: 0, border: activo ? `2px solid ${c.color}` : `1px solid ${T.border}`, background: activo ? c.color : "transparent", opacity: activo ? 1 : 0.4 } }); })), onSetDepositNota && /* @__PURE__ */ React.createElement("button", { onClick: () => setNotaEdit({ id: e.id, nota: e.nota || "" }), title: e.nota || "Agregar nota", style: { fontSize: "11px", fontWeight: 600, color: e.nota ? "#9061F9" : T.inkSoft, background: e.nota ? "#F3E8FF" : "transparent", border: `1px solid ${e.nota ? "#C084FC" : T.border}`, borderRadius: "10px", padding: "3px 9px", cursor: "pointer" } }, e.nota ? "\u{1F4DD} Nota \u2713" : "\u{1F4DD} Nota"), onDeleteDepositEvent && /* @__PURE__ */ React.createElement("button", { onClick: () => onDeleteDepositEvent(e.id), title: "Borrar evento", style: { fontSize: "11px", color: T.danger, background: "transparent", border: `1px solid ${T.border}`, borderRadius: "10px", padding: "3px 8px", cursor: "pointer" } }, "\u2715")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
  "input",
  {
    type: "datetime-local",
    value: editDep.fecha,
    max: (() => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    })(),
    onChange: (ev) => setEditDep({ ...editDep, fecha: ev.target.value }),
    style: { fontSize: "13px", padding: "3px 6px", border: `1px solid ${T.border}`, borderRadius: "10px" }
  }
), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            onEditDepositDate(e.id, editDep.fecha);
            setEditDep(null);
          },
          style: { fontSize: "11px", fontWeight: 700, color: "white", background: T.rust, border: "none", borderRadius: "10px", padding: "4px 10px", cursor: "pointer" }
        },
        "Guardar"
      ), /* @__PURE__ */ React.createElement("button", { onClick: () => setEditDep(null), style: { fontSize: "11px", color: T.inkSoft, background: "transparent", border: `1px solid ${T.border}`, borderRadius: "10px", padding: "4px 8px", cursor: "pointer" } }, "Cancelar")), e.nota && !(notaEdit && notaEdit.id === e.id) && /* @__PURE__ */ React.createElement("div", { style: { flexBasis: "100%", fontSize: "11.5px", color: "#9061F9", fontStyle: "italic", marginTop: "2px" } }, "\u{1F4DD} ", e.nota), notaEdit && notaEdit.id === e.id && /* @__PURE__ */ React.createElement("div", { style: { flexBasis: "100%", display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("input", { type: "text", autoFocus: true, value: notaEdit.nota, onChange: (ev) => setNotaEdit({ ...notaEdit, nota: ev.target.value }), onKeyDown: (ev) => { if (ev.key === "Enter") { onSetDepositNota(e.id, notaEdit.nota.trim()); setNotaEdit(null); } else if (ev.key === "Escape") setNotaEdit(null); }, placeholder: "Nota de esta gesti\xF3n…", style: { flex: 1, minWidth: "180px", fontSize: "13px", padding: "5px 8px", border: `1px solid ${T.border}`, borderRadius: "10px", background: T.bgAlt, color: T.ink, boxSizing: "border-box" } }), /* @__PURE__ */ React.createElement("button", { onClick: () => { onSetDepositNota(e.id, notaEdit.nota.trim()); setNotaEdit(null); }, style: { fontSize: "11px", fontWeight: 700, color: "white", background: T.rust, border: "none", borderRadius: "10px", padding: "4px 10px", cursor: "pointer" } }, "Guardar"), e.nota && /* @__PURE__ */ React.createElement("button", { onClick: () => { onSetDepositNota(e.id, ""); setNotaEdit(null); }, style: { fontSize: "11px", color: T.danger, background: "transparent", border: `1px solid ${T.border}`, borderRadius: "10px", padding: "4px 8px", cursor: "pointer" } }, "Borrar"), /* @__PURE__ */ React.createElement("button", { onClick: () => setNotaEdit(null), style: { fontSize: "11px", color: T.inkSoft, background: "transparent", border: `1px solid ${T.border}`, borderRadius: "10px", padding: "4px 8px", cursor: "pointer" } }, "Cancelar")));
    })))), lists.pendientesGestion.length > 0 && /* @__PURE__ */ React.createElement("div", { style: {
      background: T.surface,
      border: `2px solid ${T.rust}`,
      borderRadius: "12px",
      marginBottom: "20px",
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(168,53,15,0.10)"
    } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 18px", borderBottom: `1px solid ${T.border}`, background: "rgba(168,53,15,0.05)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, fontFamily: F.display, fontSize: "18px", fontWeight: 700, color: T.rust } }, "\u23F1 Registrar gesti\xF3n"), /* @__PURE__ */ React.createElement("span", { style: { background: T.rust, color: "#FFFFFF", fontFamily: F.mono, fontSize: "13px", fontWeight: 700, padding: "2px 10px", borderRadius: "999px" } }, lists.pendientesGestion.length)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13.5px", color: T.inkSoft, marginTop: "4px" } }, "Veh\xEDculos revisados. Marc\xE1 en cada uno si ", /* @__PURE__ */ React.createElement("b", null, "devolviste la fianza"), " o ", /* @__PURE__ */ React.createElement("b", null, "enviaste el presupuesto"), ". Quedan ac\xE1 hasta que lo registres (as\xED se toman los tiempos)."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", flex: 1, minWidth: "180px" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        value: depSearch,
        onChange: (e) => setDepSearch(e.target.value),
        placeholder: "Buscar AC, matr\xEDcula, titular, modelo\u2026",
        style: { width: "100%", padding: "7px 28px 7px 10px", fontSize: "13.5px", border: `1px solid ${T.border}`, borderRadius: "12px", background: T.surface, color: T.ink, boxSizing: "border-box" }
      }
    ), depSearch && /* @__PURE__ */ React.createElement("button", { onClick: () => setDepSearch(""), style: { position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: T.inkFaint } }, "\u2715")), /* @__PURE__ */ React.createElement(
      "select",
      {
        value: depSede,
        onChange: (e) => setDepSede(e.target.value),
        style: { padding: "7px 10px", fontSize: "13.5px", border: `1px solid ${T.border}`, borderRadius: "12px", background: T.surface, color: T.ink, cursor: "pointer" }
      },
      sedes.map((s) => /* @__PURE__ */ React.createElement("option", { key: s, value: s }, s === "Todas" ? "Todas las sedes" : s))
    ))), /* @__PURE__ */ React.createElement("div", { style: { background: T.bg } }, pendientesFiltrados.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "20px", textAlign: "center", color: T.inkFaint, fontSize: "13.5px" } }, depSearch || depSede !== "Todas" ? "Ning\xFAn veh\xEDculo coincide con el filtro." : "No hay veh\xEDculos pendientes de gestionar.") : pendientesFiltrados.map(({ v, tit, hqReserva, tieneDanosNuevos, reAlquilada, arrivalAt }) => {
const llegadaReal = v.returnedAt || v.lastReturnAt || arrivalAt || null;
const since = llegadaReal ? hoursSince(llegadaReal) : null;
const fechas = llegadaReal
  ? `Llegó: ${fmtFechaHora(llegadaReal)}`
  : "";
      return /* @__PURE__ */ React.createElement("div", { key: v.id, style: {
        padding: "12px 18px",
        borderBottom: `1px solid ${T.border}`,
        display: "flex",
        alignItems: "center",
        gap: "14px",
        flexWrap: "wrap"
      } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: "220px", cursor: "pointer" }, onClick: () => onSelectVehicle(v.id) }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, fontWeight: 700, color: T.rust, fontSize: "15px" } }, v.id), tit ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: "15px", color: T.ink, fontWeight: 600 } }, tit.cliente) : /* @__PURE__ */ React.createElement("span", { style: { fontSize: "13.5px", color: T.inkFaint, fontStyle: "italic" } }, "sin titular registrado"), tit?._hqReservaId && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "10.5px", color: T.inkFaint, fontFamily: F.mono } }, tit._hqReservaId), reAlquilada && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "9.5px", fontWeight: 700, color: "#92400E", background: "#FEF3C7", padding: "1px 6px", borderRadius: "999px", whiteSpace: "nowrap" }, title: "Este veh\xEDculo ya volvi\xF3 a salir con otro cliente. La fianza del ciclo anterior sigue pendiente de gestionar." }, "re-alquilada \xB7 fianza del ciclo anterior"), fechas && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "13px", color: T.inkSoft } }, "\xB7 viaje ", fechas)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkFaint, marginTop: "2px" } }, v.brand, " ", v.model || "", tieneDanosNuevos && /* @__PURE__ */ React.createElement("span", { style: { color: "#9061F9", fontWeight: 700 } }, " \xB7 tiene da\xF1os nuevos"), since !== null && /* @__PURE__ */ React.createElement("span", null, " \xB7 revisado ", since < 1 ? "reci\xE9n" : since < 24 ? `hace ${since}h` : `hace ${Math.round(since / 24)}d`))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", flexShrink: 0, alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "2px", alignItems: "center" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", sm: true, onClick: (e) => {
        e.stopPropagation();
        onDepositEvent(v.id, "presupuesto", undefined, {
          cliente: tit?.cliente || "",
          fechaEntrega: tit?.salida || "",
          fechaDevolucion: tit?.devolucion || "",
          reservaId: tit?._hqReservaId || ""
        });
      } }, "\u{1F4C4} Pas\xE9 presupuesto"), /* @__PURE__ */ React.createElement(
        "button",
        {
          title: "Registrar con otra fecha",
          onClick: (e) => {
            e.stopPropagation();
            setFechaModal({ vehicleId: v.id, tipo: "presupuesto", hqReserva: {
              cliente: tit?.cliente || "",
              fechaEntrega: tit?.salida || "",
              fechaDevolucion: tit?.devolucion || "",
              reservaId: tit?._hqReservaId || ""
            }, fecha: (() => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
})() });
          },
          style: { background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: "10px", cursor: "pointer", padding: "4px 7px", fontSize: "14px", color: T.inkSoft }
        },
        "\u{1F4C5}"
      )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "2px", alignItems: "center" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", sm: true, onClick: (e) => {
        e.stopPropagation();
        // IMPORTANTE: registrar exactamente la reserva que se muestra en ESTA tarjeta.
        // No reutilizar hqReserva, porque puede ser una reserva anterior/candidata distinta.
        const reservaVisible = {
          cliente: tit?.cliente || "",
          fechaEntrega: tit?.salida || "",
          fechaDevolucion: tit?.devolucion || "",
          reservaId: tit?._hqReservaId || ""
        };
        onDepositEvent(v.id, "fianza", undefined, reservaVisible);
      } }, "\u{1F4B0} Devolv\xED fianza"), /* @__PURE__ */ React.createElement(
        "button",
        {
          title: "Registrar con otra fecha",
          onClick: (e) => {
            e.stopPropagation();
            setFechaModal({ vehicleId: v.id, tipo: "fianza", hqReserva: {
              cliente: tit?.cliente || "",
              fechaEntrega: tit?.salida || "",
              fechaDevolucion: tit?.devolucion || "",
              reservaId: tit?._hqReservaId || ""
            }, fecha: (() => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
})() });
          },
          style: { background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: "10px", cursor: "pointer", padding: "4px 7px", fontSize: "14px", color: T.inkSoft }
        },
        "\u{1F4C5}"
      )), /* @__PURE__ */ React.createElement(
        "button",
        {
          title: "El veh\xEDculo sali\xF3 sin que pudieras revisarlo",
          onClick: async (e) => {
            e.stopPropagation();
            const ok = await requestConfirm({
              title: "Se fue sin revisar",
              message: `\xBFMarcar ${v.id} como que sali\xF3 sin revisar? Se quita de esta lista y queda registrado aparte (no cuenta para el tiempo de revisi\xF3n).`,
              confirmLabel: "S\xED, se fue sin revisar",
              cancelLabel: "Cancelar"
            });
            if (ok) onLeftUnreviewed(v.id);
          },
          style: { background: "transparent", border: `1px dashed ${T.inkFaint}`, borderRadius: "10px", cursor: "pointer", padding: "6px 10px", fontSize: "11.5px", color: T.inkSoft, fontWeight: 600 }
        },
        "\u{1F6AA} Se fue sin revisar"
      )));
    }))), lists.conRetencion.length > 0 && /* @__PURE__ */ React.createElement("div", { style: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderLeft: `4px solid #9061F9`,
      borderRadius: "10px",
      marginBottom: "16px",
      overflow: "hidden"
    } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: "12px", borderBottom: `1px solid ${T.border}` } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#9061F9", color: "#FFFFFF", borderRadius: "10px", padding: "6px", flexShrink: 0, marginTop: "2px" } }, /* @__PURE__ */ React.createElement(FileText, { size: 16, strokeWidth: 2.2 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, fontFamily: F.display, fontSize: "17px", fontWeight: 600, letterSpacing: "-0.01em", color: T.ink } }, "Con da\xF1os nuevos \u2014 decidir"), /* @__PURE__ */ React.createElement("span", { style: { background: "#9061F9", color: "#FFFFFF", fontFamily: F.mono, fontSize: "11px", fontWeight: 700, padding: "1px 9px", borderRadius: "999px" } }, lists.conRetencion.length)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13.5px", color: T.inkSoft, marginTop: "3px" } }, "Por cada da\xF1o: ", /* @__PURE__ */ React.createElement("strong", null, "Cuantificar"), " (cobrar al cliente) o ", /* @__PURE__ */ React.createElement("strong", null, "Asumir"), " (lo absorbe la empresa). Hasta resolverlos, la fianza queda retenida (plazo 10 d\xEDas)."))), /* @__PURE__ */ React.createElement("div", { style: { background: T.bg, padding: "4px 0" } }, lists.conRetencion.map(({ v, newDamages, oldestImport }) => {
      const daysSince = oldestImport ? daysBetween(oldestImport, nowIso()) : null;
      const urgent = daysSince !== null && daysSince >= 7;
      return /* @__PURE__ */ React.createElement("div", { key: v.id, style: { padding: "10px 18px", borderBottom: `1px solid ${T.border}` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", cursor: "pointer" }, onClick: () => onSelectVehicle(v.id) }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, fontWeight: 700, color: T.rust, fontSize: "14px" } }, v.id), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "14px", color: T.ink, fontWeight: 500 } }, v.brand, " ", v.model || ""), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11px", color: T.inkFaint, fontFamily: F.mono } }, v.plate), daysSince !== null && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", fontSize: "11px", color: urgent ? T.danger : T.inkSoft, fontWeight: urgent ? 700 : 400 } }, urgent ? `\u26A0 plazo en ${10 - daysSince}d` : daysSince === 0 ? "hoy" : `hace ${daysSince}d`)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "6px" } }, newDamages.map((d) => {
        const gt = GRAVEDAD_THEME[d.gravedad] || {};
        return /* @__PURE__ */ React.createElement("div", { key: d.id, style: {
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: "10px",
          padding: "8px 12px"
        } }, gt.label && /* @__PURE__ */ React.createElement("span", { style: { background: gt.bg, color: gt.color, fontSize: "9.5px", fontWeight: 700, padding: "2px 7px", borderRadius: "8px", textTransform: "uppercase", flexShrink: 0 } }, gt.label), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, minWidth: 0, fontSize: "13.5px", color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, d.zona || d.description || "Da\xF1o", d.tipoDano && /* @__PURE__ */ React.createElement("span", { style: { color: T.inkSoft } }, " \xB7 ", d.tipoDano)));
      })));
    }))), lists.avisadasHoy.length > 0 && /* @__PURE__ */ React.createElement("div", { style: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderLeft: `4px solid ${T.inkFaint}`,
      borderRadius: "10px",
      marginBottom: "16px",
      overflow: "hidden"
    } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: "12px", borderBottom: `1px solid ${T.border}` } }, /* @__PURE__ */ React.createElement("div", { style: { background: T.inkFaint, color: "#FFFFFF", borderRadius: "10px", padding: "6px", flexShrink: 0, marginTop: "2px" } }, /* @__PURE__ */ React.createElement(CheckCircle, { size: 16, strokeWidth: 2.2 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, fontFamily: F.display, fontSize: "17px", fontWeight: 600, letterSpacing: "-0.01em", color: T.ink } }, "Ya avisadas hoy"), /* @__PURE__ */ React.createElement("span", { style: { background: T.inkFaint, color: "#FFFFFF", fontFamily: F.mono, fontSize: "11px", fontWeight: 700, padding: "1px 9px", borderRadius: "999px" } }, lists.avisadasHoy.length)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13.5px", color: T.inkSoft, marginTop: "3px" } }, "Fianzas que avisaste a Rosana hoy. Registro del d\xEDa."))), /* @__PURE__ */ React.createElement("div", { style: { background: T.bg } }, lists.avisadasHoy.map(({ v }) => {
      const h = v.fianzaAvisoEnviadoAt ? hoursSince(v.fianzaAvisoEnviadoAt) : null;
      return /* @__PURE__ */ React.createElement(
        DepositRow,
        {
          key: v.id,
          vehicle: v,
          onClick: () => onSelectVehicle(v.id),
          dimmed: true,
          meta: /* @__PURE__ */ React.createElement("span", { style: { color: T.inkSoft } }, "avisado ", h !== null ? h < 1 ? "reci\xE9n" : `hace ${h}h` : "hoy")
        }
      );
    }))), fechaModal && /* @__PURE__ */ React.createElement("div", { onClick: () => setFechaModal(null), style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 2e3, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" } }, /* @__PURE__ */ React.createElement("div", { onClick: (e) => e.stopPropagation(), style: { background: T.surface, borderRadius: "18px", padding: "22px", width: "100%", maxWidth: "380px", boxShadow: "0 8px 40px rgba(0,0,0,0.3)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: F.display, fontSize: "17px", fontWeight: 700, color: T.ink, marginBottom: "6px" } }, fechaModal.tipo === "fianza" ? "\u{1F4B0} Devolv\xED fianza" : "\u{1F4C4} Pas\xE9 presupuesto"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13.5px", color: T.inkSoft, marginBottom: "14px" } }, fechaModal.vehicleId, " \xB7 Pon\xE9 la fecha real en que lo gestionaste (para que la estad\xEDstica sea correcta)."), /* @__PURE__ */ React.createElement(
  "label",
  {
    style: {
      fontSize: "11px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      color: T.inkFaint,
      display: "block",
      marginBottom: "5px"
    }
  },
 "Fecha y hora"
), /* @__PURE__ */ React.createElement(
  "input",
  {
    type: "datetime-local",
    value: fechaModal.fecha,
    max: (() => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    })(),
    onChange: (e) => setFechaModal((m) => ({ ...m, fecha: e.target.value })),
    style: { width: "100%", padding: "9px 11px", fontSize: "15px", border: `1px solid ${T.border}`, borderRadius: "12px", background: T.bg, color: T.ink, boxSizing: "border-box", marginBottom: "18px" }
  }
), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", sm: true, onClick: () => setFechaModal(null) }, "Cancelar"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", sm: true, onClick: () => {
      onDepositEvent(fechaModal.vehicleId, fechaModal.tipo, fechaModal.fecha, fechaModal.hqReserva);
      setFechaModal(null);
    } }, "Registrar")))), manualModal && renderManualModal());
  };
  const DepositRow = ({ vehicle, meta, actions, onClick, dimmed }) => {
    const [hover, setHover] = useState(false);
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick,
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          padding: "10px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          cursor: "pointer",
          background: hover ? T.bgAlt : "transparent",
          borderBottom: `1px solid ${T.border}`,
          opacity: dimmed ? 0.6 : 1,
          transition: "background 100ms"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, fontWeight: 700, color: T.ink, fontSize: "14px" } }, vehicle.id), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "13.5px", color: T.inkSoft, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, vehicle.brand, " ", vehicle.model || ""), vehicle.plate && /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, fontSize: "11px", color: T.inkFaint } }, vehicle.plate)),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px", flexShrink: 0, fontSize: "13px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "10px", alignItems: "center" } }, meta), actions)
    );
  };
  const QuantifyModal = ({ open, vehicle, damages, partsCatalog, onClose, onSave, onGeneratePdf }) => {
    const [lines, setLines] = useState([]);
    useEffect(() => {
      if (open && vehicle) {
        setLines(damages.map((d) => ({
          damageId: d.id,
          zona: d.zona || d.description || "",
          tipoDano: d.tipoDano || "",
          pdfCode: d.pdfCode || "",
          requierePiezas: !!d.requierePiezas,
          included: true,
          partName: d.zona || "",
          provider: vehicle.brand && PART_PROVIDERS.includes(vehicle.brand) ? vehicle.brand : "Benimar",
          tipo: "PARCIAL",
          pvrFull: "",
          hours: "0.5"
        })));
      }
    }, [open, vehicle?.id]);
    if (!open || !vehicle) return null;
    const updateLine = (damageId, patch) => {
      setLines((prev) => prev.map((l) => l.damageId === damageId ? { ...l, ...patch } : l));
    };
    const applyCatalogPart = (damageId, partName) => {
      const match = (partsCatalog || []).find((p) => p.name.toLowerCase() === partName.toLowerCase());
      if (match) {
        updateLine(damageId, { partName, provider: match.provider, pvrFull: String(match.pvr) });
      } else {
        updateLine(damageId, { partName });
      }
    };
    const includedLines = lines.filter((l) => l.included);
    const computedLines = includedLines.map((l) => ({
      ...l,
      calc: computeLineTotal({ pvr: l.pvrFull, tipo: l.tipo, hours: l.hours })
    }));
    const totals = computePresupuestoTotal(computedLines.map((l) => l.calc));
    const canEmit = includedLines.length > 0 && includedLines.every((l) => l.pvrFull !== "" && parseFloat(l.pvrFull) >= 0);
    const handleEmit = () => {
      if (!canEmit) return;
      const newCatalogParts = [];
      for (const l of computedLines) {
        if (l.partName && l.pvrFull) {
          const exists = (partsCatalog || []).some((p) => p.name.toLowerCase() === l.partName.toLowerCase() && p.provider === l.provider);
          if (!exists) newCatalogParts.push({ name: l.partName, provider: l.provider, pvr: parseFloat(l.pvrFull) });
        }
      }
      onSave({
        vehicleId: vehicle.id,
        lines: computedLines.map((l) => ({
          damageId: l.damageId,
          zona: l.zona,
          tipoDano: l.tipoDano,
          pdfCode: l.pdfCode,
          partName: l.partName,
          provider: l.provider,
          tipo: l.tipo,
          pvrFull: parseFloat(l.pvrFull) || 0,
          hours: parseFloat(l.hours) || 0,
          calc: l.calc
        })),
        newCatalogParts
      });
      onClose();
    };
    const handleEmitAndPdf = () => {
      if (!canEmit) return;
      handleEmit();
      onGeneratePdf({
        vehicle,
        lines: computedLines,
        totals
      });
    };
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: onClose,
        style: {
          position: "fixed",
          inset: 0,
          background: "rgba(26, 20, 16, 0.55)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2e3,
          padding: "20px",
          backdropFilter: "blur(2px)"
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            background: T.bg,
            borderRadius: "12px",
            maxWidth: 920,
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            border: `1px solid ${T.borderHi}`,
            borderTop: `4px solid ${T.rust}`,
            boxShadow: "0 24px 60px rgba(26, 20, 16, 0.35)"
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: { padding: "20px 24px 14px", borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, background: T.bg, zIndex: 2 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "9.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: T.inkFaint, marginBottom: "2px" } }, "Cuantificar da\xF1os"), /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, fontSize: "20px", fontWeight: 600, fontFamily: F.display, letterSpacing: "-0.015em", color: T.ink } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, color: T.rust, marginRight: "8px" } }, vehicle.id), vehicle.brand, " ", vehicle.model || ""), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11.5px", color: T.inkSoft, marginTop: "3px", fontFamily: F.mono } }, vehicle.plate, " \xB7 ", vehicle.vin)), /* @__PURE__ */ React.createElement("button", { onClick: onClose, style: { background: "transparent", border: "none", cursor: "pointer", color: T.inkSoft, fontSize: "22px", lineHeight: 1 } }, "\xD7"))),
        /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkSoft, marginBottom: "12px" } }, "Eleg\xED qu\xE9 da\xF1os entran en este presupuesto y complet\xE1 pieza, tipo y horas de cada uno."), lines.map((l) => {
          const calc = l.included ? computeLineTotal({ pvr: l.pvrFull, tipo: l.tipo, hours: l.hours }) : null;
          return /* @__PURE__ */ React.createElement("div", { key: l.damageId, style: {
            border: `1px solid ${l.included ? T.borderHi : T.border}`,
            borderRadius: "10px",
            marginBottom: "10px",
            background: l.included ? T.surface : T.bgAlt,
            opacity: l.included ? 1 : 0.6,
            overflow: "hidden"
          } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", borderBottom: l.included ? `1px solid ${T.border}` : "none" } }, /* @__PURE__ */ React.createElement(
            "input",
            {
              type: "checkbox",
              checked: l.included,
              onChange: () => updateLine(l.damageId, { included: !l.included }),
              style: { accentColor: T.rust, cursor: "pointer", width: 16, height: 16 }
            }
          ), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14.5px", fontWeight: 600, color: T.ink } }, l.zona || "\u2014", l.tipoDano && /* @__PURE__ */ React.createElement("span", { style: { color: T.inkSoft, fontWeight: 400 } }, " \xB7 ", l.tipoDano)), l.pdfCode && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkFaint, fontFamily: F.mono, marginTop: "1px" } }, l.pdfCode)), calc && /* @__PURE__ */ React.createElement("div", { style: { fontFamily: F.mono, fontWeight: 700, fontSize: "15px", color: T.rust } }, calc.total.toFixed(2), " \u20AC")), l.included && /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px", display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr", gap: "10px", alignItems: "end" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: qLabel }, "Pieza"), /* @__PURE__ */ React.createElement(
            "input",
            {
              list: `parts-${l.damageId}`,
              value: l.partName,
              onChange: (e) => applyCatalogPart(l.damageId, e.target.value),
              placeholder: "Nombre de la pieza",
              style: qInput
            }
          ), /* @__PURE__ */ React.createElement("datalist", { id: `parts-${l.damageId}` }, (partsCatalog || []).map((p) => /* @__PURE__ */ React.createElement("option", { key: p.id, value: p.name })))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: qLabel }, "Proveedor"), /* @__PURE__ */ React.createElement("select", { value: l.provider, onChange: (e) => updateLine(l.damageId, { provider: e.target.value }), style: qInput }, PART_PROVIDERS.map((p) => /* @__PURE__ */ React.createElement("option", { key: p, value: p }, p)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: qLabel }, "PVR completo \u20AC"), /* @__PURE__ */ React.createElement(
            "input",
            {
              type: "number",
              step: "0.01",
              value: l.pvrFull,
              onChange: (e) => updateLine(l.damageId, { pvrFull: e.target.value }),
              placeholder: "0,00",
              style: qInput
            }
          )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: qLabel }, "Tipo"), /* @__PURE__ */ React.createElement("select", { value: l.tipo, onChange: (e) => updateLine(l.damageId, { tipo: e.target.value }), style: qInput }, /* @__PURE__ */ React.createElement("option", { value: "PARCIAL" }, "PARCIAL (50%)"), /* @__PURE__ */ React.createElement("option", { value: "TOTAL" }, "TOTAL (100%)"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: qLabel }, "Horas M.O."), /* @__PURE__ */ React.createElement(
            "input",
            {
              type: "number",
              step: "0.25",
              value: l.hours,
              onChange: (e) => updateLine(l.damageId, { hours: e.target.value }),
              placeholder: "0.5",
              style: qInput
            }
          )), calc && /* @__PURE__ */ React.createElement("div", { style: { gridColumn: "1 / -1", display: "flex", gap: "16px", fontSize: "10.5px", color: T.inkSoft, fontFamily: F.mono, paddingTop: "2px" } }, /* @__PURE__ */ React.createElement("span", null, "PVR cobrado: ", calc.pvrCharged.toFixed(2), "\u20AC (", l.tipo === "PARCIAL" ? "50%" : "100%", ")"), /* @__PURE__ */ React.createElement("span", null, "M.O.: ", calc.moBonified.toFixed(2), "\u20AC (de ", calc.moBase.toFixed(2), "\u20AC)"), /* @__PURE__ */ React.createElement("span", null, "IVA: ", calc.iva.toFixed(2), "\u20AC"))));
        })),
        /* @__PURE__ */ React.createElement("div", { style: {
          padding: "16px 24px 20px",
          borderTop: `1px solid ${T.border}`,
          position: "sticky",
          bottom: 0,
          background: T.bg
        } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "20px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft, fontFamily: F.mono } }, /* @__PURE__ */ React.createElement("div", null, "Subtotal piezas: ", /* @__PURE__ */ React.createElement("strong", null, totals.piezasTotal.toFixed(2), " \u20AC")), /* @__PURE__ */ React.createElement("div", null, "Gesti\xF3n administrativa: ", /* @__PURE__ */ React.createElement("strong", null, ADMIN_FEE.toFixed(2), " \u20AC")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "18px", color: T.rust, fontWeight: 700, marginTop: "4px", fontFamily: F.display } }, "TOTAL: ", totals.total.toFixed(2), " \u20AC")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClose }, "Cancelar"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: handleEmit, disabled: !canEmit }, "Guardar sin PDF"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", icon: FileText, onClick: handleEmitAndPdf, disabled: !canEmit }, "Emitir y generar PDF"))))
      )
    );
  };
  const qLabel = {
    display: "block",
    fontSize: "9px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: T.inkSoft,
    marginBottom: "3px"
  };
  const qInput = {
    width: "100%",
    background: T.bg,
    border: `1px solid ${T.border}`,
    borderRadius: "10px",
    padding: "6px 8px",
    fontSize: "13.5px",
    fontFamily: F.body,
    color: T.ink,
    outline: "none",
    boxSizing: "border-box"
  };
  const AgendaView = ({ state, depositHistoryByVehicle = {}, onSelectVehicle, onImport, onImportReservations, onImportEnAlquiler, onSetStatus, onOpenRentalModal, onConfirmArrival, onMarkReturned, onAdelantoRegreso, onSetReturnDate, requestConfirm }) => {
    const [sortMode, setSortMode] = useState("fecha");
    const agendaHistoryForVehicle = (vehicleId) => depositHistoryByVehicle[vehicleId] || [];
    const nextSalida = (v) => {
      const today2 = todayKey();
      const future = sortReservas(v.reservas).filter((r) => (r.salida || "").slice(0, 10) >= today2);
      return future.length ? future[0].salida : null;
    };
    const buckets = useMemo(() => {
      const out = { DEVUELTO: [], REVISADO: [], EN_REPARACION: [], LISTO: [], EN_USO: [] };
      for (const v of state.vehicles) {
        const phase = reservaPhase(v);
        if (phase === "EN_USO") {
          out.EN_USO.push(v);
          continue;
        }
        if (phase === "POR_REVISAR") {
          out.DEVUELTO.push(v);
          continue;
        }
        const status = computeVehicleStatus(v, state.damages);
        if (status === "EN_USO") {
          out.EN_USO.push(v);
          continue;
        }
        if (out[status]) out[status].push(v);
        else out.DEVUELTO.push(v);
      }
      const byAc = (a, b) => (a.id || "").localeCompare(b.id || "", void 0, { numeric: true });
      const reservaDevol = (v) => {
        // Fecha de VUELTA real del alquiler en curso = rentalEndDate (directo del 720),
        // la misma que muestra la tarjeta. Los coches sin fecha del 720 van al final.
        const rd = v.rentalEndDate ? new Date(v.rentalEndDate).getTime() : NaN;
        return Number.isFinite(rd) ? rd : Infinity;
      };
      const sortByReturn = (a, b) => {
        if (sortMode === "ac") return byAc(a, b);
        const ta = reservaDevol(a), tb = reservaDevol(b);
        if (ta !== tb) return ta - tb;
        return byAc(a, b);
      };
      const sortByNextSale = (a, b) => {
        if (sortMode === "ac") return byAc(a, b);
        const sa = nextSalida(a), sb = nextSalida(b);
        const ta = sa ? new Date(sa).getTime() : Infinity;
        const tb = sb ? new Date(sb).getTime() : Infinity;
        if (ta !== tb) return ta - tb;
        return byAc(a, b);
      };
      out.EN_USO.sort(sortByReturn);
      for (const k of ["DEVUELTO", "REVISADO", "EN_REPARACION", "LISTO"]) out[k].sort(sortByNextSale);
      return out;
    }, [state.vehicles, state.damages, sortMode]);
    const tomorrowISO = (() => {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString().slice(0, 10);
    })();
    const pending = buckets.DEVUELTO.length;
    const inProgress = buckets.REVISADO.length + buckets.EN_REPARACION.length;
    const ready = buckets.LISTO.length;
    const inUse = buckets.EN_USO.length;
    const urgent = state.vehicles.filter((v) => {
      const status = computeVehicleStatus(v, state.damages);
      if (status === "LISTO" || status === "EN_USO") return false;
      if (!v.nextRentalDate) return false;
      return v.nextRentalDate.slice(0, 10) <= tomorrowISO;
    }).length;
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      SectionTitle,
      {
        kicker: "Agenda operativa",
        count: state.vehicles.length,
        action: /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px" } }, onImportEnAlquiler && /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: onImportEnAlquiler, icon: Truck }, "Importar en alquiler"), onImportReservations && /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: onImportReservations, icon: Calendar }, "Importar reservas HQ"), /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onImport, icon: FileUp }, "Importar OT"))
      },
      "veh\xEDculos en flota"
    ), /* @__PURE__ */ React.createElement("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "10px",
      marginBottom: "22px"
    } }, /* @__PURE__ */ React.createElement(
      StatCard,
      {
        label: "Pendientes de revisar",
        value: pending,
        accent: WORKFLOW_STATES.DEVUELTO.accent
      }
    ), /* @__PURE__ */ React.createElement(
      StatCard,
      {
        label: "En proceso",
        value: inProgress,
        accent: WORKFLOW_STATES.EN_REPARACION.accent
      }
    ), /* @__PURE__ */ React.createElement(
      StatCard,
      {
        label: "Listos",
        value: ready,
        accent: WORKFLOW_STATES.LISTO.accent
      }
    ), /* @__PURE__ */ React.createElement(
      StatCard,
      {
        label: "En uso",
        value: inUse,
        accent: WORKFLOW_STATES.EN_USO.accent
      }
    ), /* @__PURE__ */ React.createElement(
      StatCard,
      {
        label: "Salen hoy o ma\xF1ana",
        value: urgent,
        accent: urgent > 0 ? T.danger : T.inkSoft,
        sub: urgent > 0 ? "con tareas pendientes" : null
      }
    )), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "14px",
      flexWrap: "wrap"
    } }, /* @__PURE__ */ React.createElement("span", { style: {
      fontSize: "10px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: T.inkFaint,
      marginRight: "2px"
    } }, "Ordenar:"), /* @__PURE__ */ React.createElement(FilterChip, { active: sortMode === "fecha", onClick: () => setSortMode("fecha") }, "Por fecha"), /* @__PURE__ */ React.createElement(FilterChip, { active: sortMode === "ac", onClick: () => setSortMode("ac") }, "Por N\xBA AC")), /* @__PURE__ */ React.createElement("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "12px"
    } }, /* @__PURE__ */ React.createElement(
      KanbanColumn,
      {
        status: "DEVUELTO",
        vehicles: buckets.DEVUELTO,
        damages: state.damages,
        onSelectVehicle,
        onSetStatus,
        onOpenRentalModal,
        onConfirmArrival,
        onMarkReturned,
        onSetReturnDate,
        emptyMessage: "No hay veh\xEDculos pendientes de revisar.",
        requestConfirm,
        depositHistoryByVehicle
      }
    ), /* @__PURE__ */ React.createElement(
      KanbanColumn,
      {
        status: "EN_REPARACION",
        vehicles: [...buckets.REVISADO, ...buckets.EN_REPARACION],
        damages: state.damages,
        onSelectVehicle,
        onSetStatus,
        onOpenRentalModal,
        onConfirmArrival,
        onMarkReturned,
        onSetReturnDate,
        emptyMessage: "No hay veh\xEDculos en proceso.",
        extraStatuses: ["REVISADO"],
        requestConfirm,
        depositHistoryByVehicle
      }
    ), /* @__PURE__ */ React.createElement(
      KanbanColumn,
      {
        status: "LISTO",
        vehicles: buckets.LISTO,
        damages: state.damages,
        onSelectVehicle,
        onSetStatus,
        onOpenRentalModal,
        onConfirmArrival,
        onMarkReturned,
        onSetReturnDate,
        emptyMessage: "Ning\xFAn veh\xEDculo listo a\xFAn.",
        requestConfirm,
        depositHistoryByVehicle
      }
    ), /* @__PURE__ */ React.createElement(
      KanbanColumn,
      {
        status: "EN_USO",
        vehicles: buckets.EN_USO,
        damages: state.damages,
        onSelectVehicle,
        onSetStatus,
        onOpenRentalModal,
        onConfirmArrival,
        onMarkReturned,
        onAdelantoRegreso,
        onSetReturnDate,
        emptyMessage: "Ning\xFAn veh\xEDculo en uso.",
        requestConfirm,
        depositHistoryByVehicle
      }
    )));
  };
  const KanbanColumn = ({ status, vehicles, damages, onSelectVehicle, onSetStatus, onOpenRentalModal, onConfirmArrival, onMarkReturned, onAdelantoRegreso, onSetReturnDate, emptyMessage, extraStatuses = [], requestConfirm, depositHistoryByVehicle = {} }) => {
    const theme = WORKFLOW_STATES[status] || WORKFLOW_STATES.DEVUELTO;
    return /* @__PURE__ */ React.createElement("div", { style: {
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderTop: `3px solid ${theme.accent}`,
      borderRadius: "10px",
      padding: "12px 12px 14px",
      minHeight: "300px"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "12px",
      paddingBottom: "8px",
      borderBottom: `1px solid ${T.border}`
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: F.body,
      fontSize: "11px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: theme.color
    } }, theme.label, extraStatuses.length > 0 && /* @__PURE__ */ React.createElement("span", { style: { color: T.inkFaint, fontWeight: 600, marginLeft: 4 } }, " + ", extraStatuses.map((s) => (WORKFLOW_STATES[s] || {}).short || s).join(", ").toLowerCase())), /* @__PURE__ */ React.createElement("span", { style: {
      background: theme.bg,
      color: theme.color,
      fontFamily: F.mono,
      fontSize: "11px",
      fontWeight: 700,
      padding: "1px 8px",
      borderRadius: "999px"
    } }, vehicles.length)), vehicles.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: "13px",
      color: T.inkFaint,
      fontStyle: "italic",
      textAlign: "center",
      padding: "24px 8px"
    } }, emptyMessage) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } }, vehicles.map((v) => /* @__PURE__ */ React.createElement(
      KanbanCard,
      {
        key: v.id,
        vehicle: v,
        damages,
        onClick: () => onSelectVehicle(v.id),
        onSetStatus: (newStatus) => onSetStatus(v.id, newStatus),
        onOpenRentalModal,
        onConfirmArrival,
        onMarkReturned,
        onAdelantoRegreso,
        onSetReturnDate,
        requestConfirm,
        depositHistory: depositHistoryByVehicle[v.id] || []
      }
    ))));
  };
  const KanbanCard = ({ vehicle, damages, depositHistory = [], onClick, onSetStatus, onOpenRentalModal, onConfirmArrival, onMarkReturned, onAdelantoRegreso, onSetReturnDate, requestConfirm }) => {
    const status = computeVehicleStatus(vehicle, damages);
    const theme = WORKFLOW_STATES[status] || WORKFLOW_STATES.DEVUELTO;
    const counts = countByGravedad(damages, vehicle.id);
    const activeCount = counts.GRAVE + counts.MODERADO + counts.LEVE;
    const today2 = todayKey();
    const futureRes = sortReservas(vehicle.reservas).filter((r) => (r.salida || "").slice(0, 10) >= today2);
    const nextSalidaDate = futureRes.length ? futureRes[0].salida : null;
    const days = nextSalidaDate ? daysBetween(nowIso(), nextSalidaDate) : null;
    const phase = reservaPhase(vehicle);
    const isUrgent = days !== null && days <= 2 && status !== "LISTO" && phase !== "EN_USO";
    const forcedReady = isForcedReady(vehicle, damages);
    const activeReservaObj = activeReserva(vehicle);
    const locTheme = LOCATION_THEME[vehicle.location];
    const [hover, setHover] = useState(false);
    let quickAction = null;
    if (status === "DEVUELTO") {
      quickAction = { type: "set-status", status: "REVISADO", label: "\u2713 Revisado" };
    } else if (status === "REVISADO" && activeCount > 0) {
      quickAction = { type: "set-status", status: "EN_REPARACION", label: "\u2192 A reparar" };
    } else if (status === "EN_REPARACION" && activeCount === 0) {
      quickAction = { type: "set-status", status: "LISTO", label: "\u2713 Listo" };
    } else if (status === "LISTO") {
      quickAction = activeReservaObj ? { type: "set-status", status: "EN_USO", label: "\u2192 Entregado" } : { type: "open-rental", label: "\u2192 Entregado" };
    }
    const handleQuickAction = async (e) => {
      e.stopPropagation();
      if (!quickAction) return;
      if (quickAction.type === "open-rental") {
        onOpenRentalModal(vehicle);
        return;
      }
           if (quickAction.status === "LISTO" && activeCount > 0 && requestConfirm) {
        const ok = await requestConfirm({
          title: `Marcar LISTO con ${activeCount} da\xF1o${activeCount === 1 ? "" : "s"} activo${activeCount === 1 ? "" : "s"}`,
          message: `Este veh\xEDculo tiene ${activeCount} da\xF1o${activeCount === 1 ? "" : "s"} sin reparar.

Los da\xF1os quedan registrados como activos.`,
          confirmLabel: "S\xED, marcar LISTO",
          cancelLabel: "Cancelar",
          variant: "warning"
        });
        if (!ok) return;
      }
      onSetStatus(quickAction.status);
    };
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          background: T.bg,
          border: `1px solid ${hover ? theme.accent : T.border}`,
          borderLeft: `3px solid ${isUrgent ? T.danger : forcedReady ? T.warn : theme.accent}`,
          borderRadius: "10px",
          padding: "10px 12px",
          transition: "border-color 120ms"
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          onClick,
          style: { cursor: "pointer" }
        },
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "4px", gap: "8px" } }, /* @__PURE__ */ React.createElement("span", { style: {
          fontFamily: F.mono,
          fontSize: "14px",
          fontWeight: 700,
          color: T.ink,
          letterSpacing: "-0.01em",
          display: "inline-flex",
          alignItems: "center",
          gap: "5px"
        } }, vehicle.id, forcedReady && /* @__PURE__ */ React.createElement(ShieldAlert, { size: 11, style: { color: T.warn }, title: "Sale con da\xF1os activos" })), vehicle.plate && /* @__PURE__ */ React.createElement("span", { style: {
          fontFamily: F.mono,
          fontSize: "11px",
          color: T.inkSoft
        } }, vehicle.plate)),
        /* @__PURE__ */ React.createElement("div", { style: {
          fontSize: "13px",
          color: T.inkSoft,
          marginBottom: "6px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        } }, vehicle.brand, " ", vehicle.model || ""),
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" } }, locTheme && /* @__PURE__ */ React.createElement("span", { style: {
          background: locTheme.bg,
          color: locTheme.color,
          fontSize: "9.5px",
          padding: "1px 6px",
          borderRadius: "8px",
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase"
        } }, vehicle.location), activeCount > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "3px" } }, ["GRAVE", "MODERADO", "LEVE"].map((g) => {
          if (counts[g] === 0) return null;
          const gt = GRAVEDAD_THEME[g];
          return /* @__PURE__ */ React.createElement("span", { key: g, style: {
            background: gt.bg,
            color: gt.color,
            fontSize: "10px",
            fontWeight: 700,
            fontFamily: F.mono,
            padding: "1px 5px",
            borderRadius: "8px"
          }, title: gt.label }, counts[g], gt.short);
        })), nextSalidaDate && phase !== "EN_USO" && /* @__PURE__ */ React.createElement("span", { style: {
          marginLeft: "auto",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          background: isUrgent ? "#FEE2E2" : "#E8F0E3",
          color: isUrgent ? "#991B1B" : "#1F4D2E",
          fontSize: "10px",
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: "999px",
          whiteSpace: "nowrap"
        }, title: "Pr\xF3xima salida seg\xFAn calendario HQ" }, /* @__PURE__ */ React.createElement(Calendar, { size: 10 }), days < 0 ? `sali\xF3 hace ${Math.abs(days)}d` : days === 0 ? "sale hoy" : days === 1 ? "sale ma\xF1ana" : `sale ${formatDate(nextSalidaDate)}`)),
        phase === "EN_USO" && (() => {
          const manualReturn = vehicle.rentalEndDate || null;
          const turnaround = nextSalidaDate;
          // La fecha de VUELTA sale SIEMPRE del 720 (rentalEndDate del alquiler actual).
          // NO se usan reservas futuras (activeReserva/nextSalida) como devolución:
          // esas son próximas SALIDAS, no el regreso del alquiler en curso, y usarlas
          // daba fechas equivocadas (p.ej. "vuelve el 14/17 sept").
          const returnRef = manualReturn;
          const dr = returnRef ? daysBetween(nowIso(), returnRef) : null;
          return /* @__PURE__ */ React.createElement("div", { style: { marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" } }, dr !== null ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: {
            fontSize: "11px",
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            color: dr <= 1 ? T.warn : T.inkSoft
          } }, /* @__PURE__ */ React.createElement(Calendar, { size: 11 }), dr < 0 ? `volvi\xF3 hace ${Math.abs(dr)}d` : dr === 0 ? "vuelve hoy" : dr === 1 ? "vuelve ma\xF1ana" : `vuelve en ${dr}d \xB7 ${formatDate(returnRef)}`), turnaround && /* @__PURE__ */ React.createElement("span", { style: {
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            background: dr <= 2 ? "#FEE2E2" : "#E8F0E3",
            color: dr <= 2 ? "#991B1B" : "#1F4D2E",
            fontSize: "10px",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "999px"
          }, title: "Vuelve a salir seg\xFAn calendario HQ" }, /* @__PURE__ */ React.createElement(Calendar, { size: 10 }), "sale ", formatDate(turnaround))) : /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11px", color: T.inkSoft, fontStyle: "italic" } }, "en uso \xB7 sin fecha de devoluci\xF3n"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "5px", marginLeft: "auto" } }, /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
            e.stopPropagation();
            onMarkReturned && onMarkReturned(vehicle.id);
          }, style: {
            fontSize: "10px",
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: "10px",
            border: `1px solid ${T.border}`,
            background: T.surface,
            color: WORKFLOW_STATES.DEVUELTO.accent,
            cursor: "pointer"
          }, title: "Marcar que volvi\xF3 a la campa ahora" }, "\u2713 Volvi\xF3"), /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
            e.stopPropagation();
            onAdelantoRegreso && onAdelantoRegreso(vehicle.id);
          }, style: {
            fontSize: "10px",
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: "10px",
            border: `1px solid ${T.border}`,
            background: vehicle.seAdelantoRegreso ? "#FEF3C7" : T.surface,
            color: vehicle.seAdelantoRegreso ? "#92400E" : T.inkSoft,
            cursor: "pointer"
          }, title: "El veh\xEDculo regres\xF3 antes de las 48h previstas: habilita su gesti\xF3n de fianza al marcar Volvi\xF3" }, vehicle.seAdelantoRegreso ? "\u23ea Adelantado \u2713" : "\u23ea Se adelant\xF3"), /* @__PURE__ */ React.createElement("label", { onClick: (e) => e.stopPropagation(), style: {
            fontSize: "10px",
            fontWeight: 600,
            padding: "3px 7px",
            borderRadius: "10px",
            border: `1px solid ${T.border}`,
            background: T.surface,
            color: T.inkSoft,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "3px"
          }, title: "Poner fecha de devoluci\xF3n a mano" }, /* @__PURE__ */ React.createElement(Calendar, { size: 10 }), /* @__PURE__ */ React.createElement(
            "input",
            {
              type: "date",
              value: manualReturn ? manualReturn.slice(0, 10) : "",
              onChange: (e) => {
                e.stopPropagation();
                onSetReturnDate && onSetReturnDate(vehicle.id, e.target.value);
              },
              style: { border: "none", background: "transparent", fontSize: "10px", color: T.inkSoft, width: "92px", cursor: "pointer" }
            }
          ))));
        })(),

        Array.isArray(vehicle.reservaHistory) && vehicle.reservaHistory.length > 0 && /* @__PURE__ */ React.createElement("div", {
          style: {
            marginTop: "7px",
            paddingTop: "6px",
            borderTop: `1px solid ${T.border}`,
            fontSize: "10px"
          }
        },
          /* @__PURE__ */ React.createElement("div", {
            style: {
              fontWeight: 700,
              color: T.ink,
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.04em"
            }
          }, "Historial de reservas"),

          depositHistory.map((r, i) =>
            /* @__PURE__ */ React.createElement("div", {
              key: `${r.reservaId || ""}-${r.salida || ""}-${i}`,
              style: {
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "2px 0",
                color: T.inkSoft
              }
            },
              /* @__PURE__ */ React.createElement("span", {
                style: {
                  fontFamily: F.mono,
                  fontSize: "9px",
                  color: T.ink
                }
              },
                r.salida ? formatDate(r.salida) : "—",
                " → ",
                r.devolucion ? formatDate(r.devolucion) : "—"
              ),
              /* @__PURE__ */ React.createElement("span", {
                style: {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1
                },
                title: r.cliente || ""
              }, r.cliente || "Sin cliente"),
              r.reservaId && /* @__PURE__ */ React.createElement("span", {
                style: {
                  fontFamily: F.mono,
                  fontSize: "9px",
                  color: T.inkSoft
                }
              }, `#${r.reservaId}`)
            )
          )
        )
      ),
      quickAction && (() => {
        let btnBg, btnColor, btnAccent;
        if (quickAction.type === "open-rental") {
          ({ bg: btnBg, color: btnColor, accent: btnAccent } = WORKFLOW_STATES.EN_USO);
        } else {
          ({ bg: btnBg, color: btnColor, accent: btnAccent } = WORKFLOW_STATES[quickAction.status] || WORKFLOW_STATES.DEVUELTO);
        }
        return /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: handleQuickAction,
            style: {
              marginTop: "8px",
              width: "100%",
              background: btnBg,
              color: btnColor,
              border: `1px solid ${btnAccent}`,
              padding: "4px 8px",
              borderRadius: "8px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: F.body,
              letterSpacing: "0.02em",
              transition: "all 120ms"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.background = btnAccent;
              e.currentTarget.style.color = "#FFFFFF";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.background = btnBg;
              e.currentTarget.style.color = btnColor;
            }
          },
          quickAction.label
        );
      })()
    );
  };
  const IVA = 0.21;
  const MO_TARIFA = 50;
  const MO_BONIF = 0.5;
  const MO_RATE = MO_TARIFA * (1 - MO_BONIF);
  const ADMIN_RATE = MO_RATE * 0.5;
  const fmt = (n) => typeof n === "number" && !isNaN(n) ? n.toFixed(2).replace(".", ",") + " \u20AC" : "\u2014";
  const fmtHoras = (n) => {
    const v = parseFloat(n) || 0;
    return (Number.isInteger(v) ? String(v) : String(v).replace(".", ",")) + " h";
  };
  const today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const makeBudgetId = (ac) => {
    const n = /* @__PURE__ */ new Date();
    const p = (x, l = 2) => String(x).padStart(l, "0");
    const fecha = `${n.getFullYear()}${p(n.getMonth() + 1)}${p(n.getDate())}`;
    const hora = `${p(n.getHours())}${p(n.getMinutes())}${p(n.getSeconds())}`;
    const acClean = String(ac || "").replace(/[^A-Za-z0-9]/g, "") || "XXX";
    return `PR-${fecha}-AC${acClean}-${hora}`;
  };
  const S = { border: "1px solid #d1d5db", borderRadius: 6, padding: "7px 10px", fontSize: 13, width: "100%", boxSizing: "border-box", background: "white" };
  const L = { fontSize: 10, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 3 };
  const CATS = [
    { id: "piezas", label: "\u{1F527} Piezas AC", accent: "#0F1B2E" },
    { id: "repositorio", label: "\u{1F5C2}\uFE0F Repositorio", accent: "#0f766e" },
    { id: "resumen", label: "\u{1F4CB} Presupuesto", accent: "#374151" },
    { id: "historial", label: "\u{1F5C4}\uFE0F Historial", accent: "#475569" }
  ];
  const EXTRA_CATS = [];
  const ACCENT = { chapa: "#7c3aed", toldos: "#0891b2", antenas: "#059669", fabricante: "#b45309", combustible: "#dc2626", otros: "#6b7280" };
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
  function VinCopy({ vin }) {
    const [copied, setCopied] = React.useState(null);
    const clean = (vin || "").trim();
    if (!clean || clean === "\u2014") return /* @__PURE__ */ React.createElement("span", null, "\u2014");
    const last9 = clean.slice(-9);
    const doCopy = async (which, value) => {
      const ok = await copyToClipboard(value);
      if (ok) {
        setCopied(which);
        setTimeout(() => setCopied(null), 1800);
      }
    };
    const btn = (active) => ({
      border: "none",
      borderRadius: 5,
      cursor: "pointer",
      fontSize: 10,
      fontWeight: 700,
      padding: "3px 7px",
      color: "#fff",
      background: active ? "#16a34a" : "#0F1B2E",
      fontFamily: "inherit",
      whiteSpace: "nowrap"
    });
    return /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "monospace" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#9ca3af" } }, clean.slice(0, -9)), /* @__PURE__ */ React.createElement("span", { style: { color: "#0F1B2E", fontWeight: 700 } }, last9)), /* @__PURE__ */ React.createElement("button", { onClick: () => doCopy("last9", last9), style: btn(copied === "last9"), title: "Copiar los \xFAltimos 9 d\xEDgitos (Benimar)" }, copied === "last9" ? "\u2713" : "Copiar 9"), /* @__PURE__ */ React.createElement("button", { onClick: () => doCopy("full", clean), style: btn(copied === "full"), title: "Copiar el n\xFAmero completo" }, copied === "full" ? "\u2713" : "Completo"));
  }
  // Devuelve el factor multiplicador del PVR según tipo/parcialPct de una pieza.
  // TOTAL = 1. PARCIAL = parcialPct/100 (default 50% para compat con piezas viejas sin campo).
  function parcialFactor(p) {
    if (!p || p.tipo !== "PARCIAL") return 1;
    const pct = p.parcialPct != null ? parseFloat(p.parcialPct) : 50;
    return pct / 100;
  }
  function calcPieza(f) {
    const h = parseFloat(f.horas) || 0, pvr = parseFloat(f.pvrProveedor) || 0;
    const moTarifa = h * MO_TARIFA;
    const moAlquiler = h * MO_RATE;
    const moConIva = moAlquiler * (1 + IVA);
    const descuentoPct = parseFloat(f.descuentoPct) || 0;
    const descuentoFactor = 1 - descuentoPct / 100;
    const pvrEfectivo = pvr * parcialFactor(f) * descuentoFactor;
    const pvrConIva = pvrEfectivo * (1 + IVA);
    return { moTarifa, moAlquiler, moConIva, pvrEfectivo, pvrConIva, descuentoPct, total: moConIva + pvrConIva };
  }
  // Bonificación del 50% de M.O.: por defecto los presupuestos la aplican (M.O. a MO_RATE=25€/h).
  // Si el presupuesto tiene d.sinBonifMO=true, esa M.O. pasa a tarifa normal (MO_TARIFA=50€/h).
  // Se implementa como DELTA sobre los totales ya guardados (bonificados): así los presupuestos
  // normales no cambian en absoluto. La gestión administrativa (½h) NO se toca: sigue bonificada.
  const moDeltaHora = (d) => (d && d.sinBonifMO) ? (MO_TARIFA - MO_RATE) * (1 + IVA) : 0;
  const piezaTotalEff = (d, r) => (r.total || 0) + (parseFloat(r.horas) || 0) * moDeltaHora(d);
  const extraTotalEff = (d, x) => (x.precioConIva || 0) + (parseFloat(x.horas) || 0) * moDeltaHora(d);
  function docGrandTotal(d) {
    if (!d) return 0;
    const p = (d.piezas || []).filter((r) => !r.draft).reduce((s, r) => s + piezaTotalEff(d, r), 0);
    const e = EXTRA_CATS.reduce((s, k) => s + (d[k] || []).reduce((ss, x) => ss + extraTotalEff(d, x), 0), 0);
    const hasItems = p > 0 || e > 0;
    return p + e + (hasItems ? ADMIN_RATE * (1 + IVA) : 0);
  }
  function docSubtotals(d) {
    const piezas = (d.piezas || []).filter((r) => !r.draft).reduce((s, r) => s + piezaTotalEff(d, r), 0);
    const extra = Object.fromEntries(EXTRA_CATS.map((k) => [k, (d[k] || []).reduce((s, x) => s + extraTotalEff(d, x), 0)]));
    const hasItems = piezas > 0 || Object.values(extra).some((v) => v > 0);
    return { piezas, ...extra, admin: hasItems ? ADMIN_RATE * (1 + IVA) : 0 };
  }
  const EMPTY_DOC = () => ({
    id: Date.now(),
    fecha: today(),
    vehicle: { ac: "", matricula: "", bastidor: "", marca: "BENIMAR" },
    titular: { nombre: "", salida: "", devolucion: "" },
    piezas: [],
    chapa: [],
    toldos: [],
    antenas: [],
    fabricante: [],
    combustible: [],
    otros: [],
    anexoKeys: [],
    sinBonifMO: false,
    emitted: false,
    emittedAt: null
  });
  function sanitizeDoc(raw) {
    if (!raw || typeof raw !== "object") return EMPTY_DOC();
    const d = { ...EMPTY_DOC(), ...raw };
    d.vehicle = { ac: "", matricula: "", bastidor: "", marca: "BENIMAR", ...raw.vehicle || {} };
    d.titular = { nombre: "", salida: "", devolucion: "", ...raw.titular || {} };
    if (!Array.isArray(d.anexoKeys)) d.anexoKeys = [];
    if (!d.fabricante?.length && raw.fabrica?.length) d.fabricante = raw.fabrica;
    ["piezas", "chapa", "toldos", "antenas", "fabricante", "combustible", "otros"].forEach((k) => {
      if (!Array.isArray(d[k])) d[k] = [];
    });
    d.piezas = d.piezas.map((r, i) => {
      const base = { tipo: "TOTAL", pieza: "", proveedor: "", horas: 0, pvrProveedor: 0, notas: "", descuentoPct: 0, draft: false, id: Date.now() + i, ...r };
      if (!base.draft && (base.horas || base.pvrProveedor)) {
        const calc = calcPieza({ horas: base.horas, pvrProveedor: base.pvrProveedor, tipo: base.tipo, parcialPct: base.parcialPct, descuentoPct: base.descuentoPct });
        return { ...base, ...calc };
      }
      return { moTarifa: 0, moAlquiler: 0, moConIva: 0, pvrEfectivo: 0, pvrConIva: 0, total: 0, ...base };
    });
    ["chapa", "toldos", "antenas", "fabricante", "combustible", "otros"].forEach((k) => {
      d[k] = d[k].map((x, i) => ({
        descripcion: "",
        proveedor: "",
        horas: 0,
        pvrSinIva: 0,
        notas: "",
        moAlquiler: 0,
        moConIva: 0,
        pvrConIva: 0,
        precioConIva: 0,
        id: Date.now() + i + 1e3,
        ...x
      }));
    });
    return d;
  }
  const qrUrl = (id) => "https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=" + encodeURIComponent(String(id));
  function generateHTML(d, st, gt, anexoFotos) {
    const anexoSection = (anexoFotos && anexoFotos.length) ? ("<div style='page-break-before:always;height:0'></div><h2 style='color:#1e3a5f;font-size:16px;border-bottom:2px solid #1e3a5f;padding-bottom:8px;margin:24px 0 14px'>Anexo fotográfico — daños presupuestados</h2><div style='display:flex;flex-wrap:wrap;gap:14px'>" + anexoFotos.map(function (f) { return "<div style='width:calc(50% - 7px);box-sizing:border-box;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;page-break-inside:avoid'><div style='background:#f8fafc;padding:6px 10px;font-size:11px;color:#1e3a5f;font-weight:700'>" + (f.zona || "Daño") + (f.tipoDano ? (" · " + f.tipoDano) : "") + "</div>" + (f.code ? ("<div style='padding:2px 10px 4px;font-family:monospace;font-size:10px;color:#6b7280'>" + f.code + "</div>") : "") + "<img src='" + f.dataUrl + "' style='width:100%;display:block'/></div>"; }).join("") + "</div>") : "";
    const adminConIva = ADMIN_RATE * (1 + IVA);
    const sinBonif = !!d.sinBonifMO;
    const moRate = sinBonif ? MO_TARIFA : MO_RATE;
    const piezasRows = (d.piezas || []).filter((r) => !r.draft).map((r) => {
      const moCharged = (parseFloat(r.horas) || 0) * moRate;
      const iva = (r.pvrEfectivo + moCharged) * IVA;
      const totalEff = (r.pvrConIva || 0) + moCharged * (1 + IVA);
      const moCells = sinBonif
        ? "<td style='text-align:right'>" + fmt(moCharged) + "</td>"
        : "<td style='text-align:right;color:#9ca3af;text-decoration:line-through'>" + fmt(r.moTarifa) + "</td><td style='text-align:right;color:#16a34a;font-weight:600'>" + fmt(r.moAlquiler) + "</td>";
      return "<tr><td>" + r.pieza + (r.notas ? " (" + r.notas + ")" : "") + "</td><td>" + (r.proveedor || "\u2014") + "</td><td style='text-align:center'>" + r.tipo + "</td><td style='text-align:right'>" + fmt(r.pvrEfectivo) + "</td><td style='text-align:center;color:" + (r.descuentoPct > 0 ? "#7c3aed;font-weight:700" : "#9ca3af") + "'>" + (r.descuentoPct > 0 ? r.descuentoPct + "%" : "\u2014") + "</td><td style='text-align:right;color:#6b7280'>" + fmtHoras(r.horas) + "</td>" + moCells + "<td style='text-align:right;color:#6b7280'>" + fmt(iva) + "</td><td style='text-align:right;font-weight:700'>" + fmt(totalEff) + "</td></tr>";
    }).join("");
    const extraSections = EXTRA_CATS.map((k) => {
      const items = d[k] || [];
      if (!items.length) return "";
      const cat = CATS.find((c) => c.id === k);
      const label = cat ? cat.label.replace(/^[^\w]+/, "") : k;
      const rows = items.map((x) => {
        const h = parseFloat(x.horas) || 0;
        const moTarifa = h * MO_TARIFA;
        const moCharged = h * moRate;
        const iva = ((x.pvrSinIva || 0) + moCharged) * IVA;
        const totalEff = extraTotalEff(d, x);
        const moCells = sinBonif
          ? "<td style='text-align:right'>" + (moCharged > 0 ? fmt(moCharged) : "\u2014") + "</td>"
          : "<td style='text-align:right;color:#9ca3af;" + (moTarifa > 0 ? "text-decoration:line-through" : "") + "'>" + (moTarifa > 0 ? fmt(moTarifa) : "\u2014") + "</td><td style='text-align:right;color:#16a34a;font-weight:600'>" + (x.moAlquiler > 0 ? fmt(x.moAlquiler) : "\u2014") + "</td>";
        return "<tr><td>" + x.descripcion + (x.notas ? " (" + x.notas + ")" : "") + "</td><td>" + (x.proveedor || "\u2014") + "</td><td style='text-align:right'>" + (x.pvrSinIva > 0 ? fmt(x.pvrSinIva) : "\u2014") + "</td>" + moCells + "<td style='text-align:right;color:#6b7280'>" + fmt(iva) + "</td><td style='text-align:right;font-weight:700'>" + fmt(totalEff) + "</td></tr>";
      }).join("");
      const moHead = sinBonif
        ? "<th style='text-align:right'>M.O. 50\u20AC/h</th>"
        : "<th style='text-align:right'>M.O. tarifa 50\u20AC/h</th><th style='text-align:right'>Bonif. -50% alquiler 25\u20AC/h</th>";
      const colspan = sinBonif ? 5 : 6;
      return "<h3>" + label + "</h3><table><thead><tr><th>Descripci\xF3n</th><th>Proveedor</th><th style='text-align:right'>PVR s/IVA</th>" + moHead + "<th style='text-align:right'>IVA 21%</th><th style='text-align:right'>Total</th></tr></thead><tbody>" + rows + "<tr style='background:#f3f4f6;font-weight:700'><td colspan='" + colspan + "' style='text-align:right'>Subtotal " + label + "</td><td style='text-align:right'>" + fmt(st[k]) + "</td></tr></tbody></table>";
    }).join("");
    const fmtD2 = (x) => x ? new Date(x).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }) : "";
    const tit = d.titular || {};
    const titRango = tit.salida || tit.devolucion ? " <span style='color:#6b7280;font-weight:400'>(alquiler " + fmtD2(tit.salida) + " \u2013 " + fmtD2(tit.devolucion) + ")</span>" : "";
    const titularLine = tit.nombre ? "<div style='margin:-4px 0 16px;padding:9px 12px;background:#f8fafc;border-left:3px solid #1e3a5f;border-radius:4px;font-size:12.5px'><b>Titular de la reserva:</b> " + tit.nombre + titRango + "</div>" : "";
    const hasPiezas = (d.piezas || []).filter((r) => !r.draft).length > 0;
    const piezasMoHead = sinBonif
      ? "<th style='text-align:right'>M.O. 50\u20AC/h</th>"
      : "<th style='text-align:right'>M.O. tarifa 50\u20AC/h</th><th style='text-align:right'>Bonif. -50% alquiler 25\u20AC/h</th>";
    const piezasColspan = sinBonif ? 8 : 9;
    const piezasSection = hasPiezas ? "<h3>Piezas AC</h3><table><thead><tr><th>Pieza</th><th>Proveedor</th><th>Tipo</th><th style='text-align:right'>PVR s/IVA</th><th style='text-align:center'>% Desc.</th><th style='text-align:right'>M.O. (h)</th>" + piezasMoHead + "<th style='text-align:right'>IVA 21%</th><th style='text-align:right'>Total</th></tr></thead><tbody>" + piezasRows + "<tr style='background:#f3f4f6;font-weight:700'><td colspan='" + piezasColspan + "' style='text-align:right'>Subtotal Piezas AC</td><td style='text-align:right'>" + fmt(st.piezas) + "</td></tr></tbody></table>" : "";
    return "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Presupuesto AC " + d.vehicle.ac + "</title><style>body{font-family:Arial,sans-serif;max-width:820px;margin:0 auto;padding:24px;font-size:13px}h1{color:#1e3a5f;font-size:20px;margin:0}h3{color:#1e3a5f;margin:20px 0 6px}table{width:100%;border-collapse:collapse;margin-bottom:4px}th{background:#f3f4f6;padding:7px 9px;text-align:left;font-size:10px;text-transform:uppercase;border-bottom:2px solid #e5e7eb}td{padding:6px 9px;border-bottom:1px solid #f1f5f9}.hdr{display:flex;justify-content:space-between;padding-bottom:14px;border-bottom:2px solid #1e3a5f;margin-bottom:16px}.total{background:#1e3a5f;color:white;padding:14px 18px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin-top:20px}@page{size:auto;margin:0}@media print{.noprint{display:none}body{max-width:none;padding:14mm 16mm}}</style></head><body><div class='hdr'><div><h1>Cuantificaci\xF3n de Da\xF1os \u2014 AC-LLAR</h1><div style='color:#6b7280;font-size:11px;margin-top:4px'>" + d.fecha + "</div></div><div style='display:flex;gap:16px;align-items:flex-start'><div style='text-align:right;font-size:12px'><div><b>AC:</b> " + (d.vehicle.ac || "\u2014") + "</div><div><b>Matr\xEDcula:</b> " + (d.vehicle.matricula || "\u2014") + "</div><div><b>VIN:</b> " + (d.vehicle.bastidor || "\u2014") + "</div><div><b>Marca:</b> " + (d.vehicle.marca || "\u2014") + "</div><div style='margin-top:4px;color:#9ca3af;font-size:10px'>ID: " + d.id + "</div></div><img src='" + qrUrl(d.id) + "' width='80' height='80' style='border:1px solid #e5e7eb;border-radius:6px' alt='QR'/></div></div>" + titularLine + piezasSection + extraSections + "<table style='margin-top:16px'><tbody><tr style='background:#f3f4f6'><td style='padding:9px 12px;font-weight:600'>\u{1F4CB} Gesti\xF3n administrativa (\xBDh M.O. + IVA)</td><td style='padding:9px 12px;text-align:right;font-weight:700;width:120px'>" + fmt(adminConIva) + "</td></tr></tbody></table><div class='total'><span style='font-size:15px;font-weight:700'>TOTAL DE REPARACIONES</span><span style='font-size:26px;font-weight:900'>" + fmt(gt) + "</span></div>" + anexoSection + "<div style='margin-top:16px;font-size:10px;color:#9ca3af;text-align:center'>Generado el " + (/* @__PURE__ */ new Date()).toLocaleDateString("es-ES") + " \xB7 AC-LLAR</div><div class='noprint' style='margin-top:16px;text-align:center'><button onclick='window.print()' style='background:#1e3a5f;color:white;border:none;padding:10px 24px;border-radius:8px;font-size:14px;cursor:pointer'>\u{1F5A8}\uFE0F Imprimir / Guardar PDF</button></div></body></html>";
  }
  async function downloadHTML(d, st, gt) {
    let anexoFotos = [];
    try {
      if (d && Array.isArray(d.anexoKeys) && d.anexoKeys.length && typeof window !== "undefined" && window.acllarPhotos && window.acllarPhotos.getKey) {
        const cache = {};
        for (const k of d.anexoKeys) {
          const ck = k.vehicleId + "||" + k.idk;
          const rec = (ck in cache) ? cache[ck] : (cache[ck] = await window.acllarPhotos.getKey(k.vehicleId, k.idk));
          if (rec && rec.fotos && rec.fotos[k.idx]) anexoFotos.push({ dataUrl: rec.fotos[k.idx], zona: k.zona || rec.zona, tipoDano: k.tipoDano || rec.tipoDano, code: k.code || rec.pdfCode });
        }
      }
    } catch (e) {}
    const blob = new Blob([generateHTML(d, st, gt, anexoFotos)], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Presupuesto_AC" + (d.vehicle.ac || "_") + "_" + d.fecha + ".html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { error: null };
    }
    static getDerivedStateFromError(e) {
      return { error: e };
    }
    render() {
      if (this.state.error) return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Inter,system-ui,sans-serif", padding: 32, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 40, marginBottom: 16 } }, "\u26A0\uFE0F"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: "#991b1b", marginBottom: 8 } }, "Error al cargar los datos"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "#6b7280", marginBottom: 20 } }, String(this.state.error.message || this.state.error)), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            try {
              window.storage.set("ac_doc2", JSON.stringify(EMPTY_DOC()));
            } catch {
            }
            this.setState({ error: null });
          },
          style: { background: "#0F1B2E", color: "white", border: "none", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700 }
        },
        "\u{1F504} Restablecer documento actual"
      ), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, fontSize: 11, color: "#9ca3af" } }, "El historial y los respaldos no se borran."));
      return this.props.children;
    }
  }
  function DocPreview({ d }) {
    const st = docSubtotals(d), gt = docGrandTotal(d);
    const sinBonif = !!d.sinBonifMO;
    const moRate = sinBonif ? MO_TARIFA : MO_RATE;
    const piezasItems = (d.piezas || []).filter((r) => !r.draft);
    const extraSections = EXTRA_CATS.map((k) => {
      const cat = CATS.find((c) => c.id === k);
      return { id: k, label: cat ? cat.label : k, accent: ACCENT[k], total: st[k], items: d[k] || [] };
    }).filter((c) => c.items.length > 0);
    return /* @__PURE__ */ React.createElement("div", { style: { background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 14, borderBottom: "2px solid #0F1B2E", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: "#0F1B2E" } }, "Cuantificaci\xF3n de Da\xF1os"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#6b7280", marginTop: 3 } }, "AC-LLAR \xB7 ", d.fecha)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right", fontSize: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "AC:"), " ", d.vehicle?.ac || "\u2014"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Matr\xEDcula:"), " ", d.vehicle?.matricula || "\u2014"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("b", null, "VIN:"), " ", /* @__PURE__ */ React.createElement(VinCopy, { vin: d.vehicle?.bastidor })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Marca:"), " ", d.vehicle?.marca || "\u2014"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, color: "#9ca3af", fontSize: 10 } }, "ID: ", d.id)), /* @__PURE__ */ React.createElement(
      "img",
      {
        src: qrUrl(d.id),
        width: "72",
        height: "72",
        style: { border: "1px solid #e5e7eb", borderRadius: 6, flexShrink: 0 },
        alt: "QR",
        onError: (e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "none", width: 72, height: 72, border: "1px solid #e5e7eb", borderRadius: 6, background: "#f8fafc", alignItems: "center", justifyContent: "center", flexDirection: "column", fontSize: 9, color: "#9ca3af", textAlign: "center", padding: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16 } }, "\u2B1B"), /* @__PURE__ */ React.createElement("div", null, "ID: ", String(d.id).slice(-6))))), d.titular?.nombre && /* @__PURE__ */ React.createElement("div", { style: {
      margin: "0 0 14px",
      padding: "9px 12px",
      background: "#f8fafc",
      borderLeft: "3px solid #0F1B2E",
      borderRadius: 4,
      fontSize: 12.5
    } }, /* @__PURE__ */ React.createElement("b", null, "Titular de la reserva:"), " ", d.titular.nombre, (d.titular.salida || d.titular.devolucion) && /* @__PURE__ */ React.createElement("span", { style: { color: "#6b7280" } }, " ", "(alquiler ", d.titular.salida ? new Date(d.titular.salida).toLocaleDateString("es-ES") : "\u2014", " \u2013 ", d.titular.devolucion ? new Date(d.titular.devolucion).toLocaleDateString("es-ES") : "\u2014", ")")), piezasItems.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#0F1B2E", color: "white", padding: "7px 12px", borderRadius: "10px 10px 0 0", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", null, "\u{1F527} Piezas AC"), /* @__PURE__ */ React.createElement("span", null, fmt(st.piezas))), /* @__PURE__ */ React.createElement("div", { style: { background: "#eff6ff", fontSize: 10, padding: "4px 10px", color: "#1d4ed8", borderLeft: "1px solid #bfdbfe", borderRight: "1px solid #bfdbfe" } }, sinBonif ? /* @__PURE__ */ React.createElement("span", null, "Tarifa M.O.: ", /* @__PURE__ */ React.createElement("b", null, MO_TARIFA, "\u20AC/h"), " \u2014 sin bonificaci\xF3n (tarifa normal)") : /* @__PURE__ */ React.createElement("span", null, "Tarifa M.O.: ", MO_TARIFA, "\u20AC/h \u2014 Bonificaci\xF3n alquiler: -", MO_BONIF * 100, "% \u2192 ", /* @__PURE__ */ React.createElement("b", null, MO_RATE, "\u20AC/h efectivo"))), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "#f3f4f6" } }, (sinBonif ? ["Pieza", "Proveedor", "Tipo", "PVR s/IVA", "% Desc.", "M.O. (h)", "M.O. 50\u20AC/h", "IVA 21%", "Total"] : ["Pieza", "Proveedor", "Tipo", "PVR s/IVA", "% Desc.", "M.O. (h)", "M.O. tarifa", "M.O. bonif.", "IVA 21%", "Total"]).map((c) => /* @__PURE__ */ React.createElement("th", { key: c, style: { padding: "5px 8px", textAlign: c === "Pieza" || c === "Tipo" || c === "Proveedor" ? "left" : c === "% Desc." ? "center" : "right", fontSize: 10, textTransform: "uppercase", borderBottom: "1px solid #e5e7eb" } }, c)))), /* @__PURE__ */ React.createElement("tbody", null, piezasItems.map((r, i) => {
      const moCharged = (parseFloat(r.horas) || 0) * moRate;
      const iva = (r.pvrEfectivo + moCharged) * IVA;
      const moCells = sinBonif ? [React.createElement("td", { key: "mo", style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right" } }, fmt(moCharged))] : [React.createElement("td", { key: "mot", style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#9ca3af", textDecoration: "line-through" } }, fmt(r.moTarifa)), React.createElement("td", { key: "mob", style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#16a34a", fontWeight: 600 } }, fmt(r.moAlquiler))];
return /* @__PURE__ */ React.createElement("tr", { key: r.id || i, style: { background: i % 2 === 0 ? "#f8fafc" : "white" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9" } }, r.pieza, r.notas ? " (" + r.notas + ")" : ""), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", color: "#6b7280" } }, r.proveedor || "\u2014"), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9" } }, /* @__PURE__ */ React.createElement("span", { style: { background: r.tipo === "TOTAL" ? "#fee2e2" : "#fef9c3", color: r.tipo === "TOTAL" ? "#991b1b" : "#854d0e", padding: "1px 6px", borderRadius: 5, fontWeight: 700, fontSize: 10 } }, r.tipo)), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right" } }, fmt(r.pvrEfectivo)), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "center", color: r.descuentoPct > 0 ? "#7c3aed" : "#9ca3af", fontWeight: r.descuentoPct > 0 ? 700 : 400 } }, r.descuentoPct > 0 ? r.descuentoPct + "%" : "—"), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#6b7280" } }, fmtHoras(r.horas)), moCells, /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#6b7280" } }, fmt(iva)), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right", fontWeight: 700 } }, fmt(piezaTotalEff(d, r))));
    })))), extraSections.map((cat) => /* @__PURE__ */ React.createElement("div", { key: cat.id, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { background: cat.accent, color: "white", padding: "7px 12px", borderRadius: "10px 10px 0 0", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", null, cat.label), /* @__PURE__ */ React.createElement("span", null, fmt(cat.total))), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "#f3f4f6" } }, (sinBonif ? ["Descripci\xF3n", "Proveedor", "PVR s/IVA", "M.O. 50\u20AC/h", "IVA 21%", "Total"] : ["Descripci\xF3n", "Proveedor", "PVR s/IVA", "M.O. tarifa 50\u20AC/h", "Bonif. -50% alquiler 25\u20AC/h", "IVA 21%", "Total"]).map((c) => /* @__PURE__ */ React.createElement("th", { key: c, style: { padding: "5px 8px", textAlign: c === "Descripci\xF3n" || c === "Proveedor" ? "left" : "right", fontSize: 10, textTransform: "uppercase", borderBottom: "1px solid #e5e7eb" } }, c)))), /* @__PURE__ */ React.createElement("tbody", null, cat.items.map((item, i) => {
      const h = parseFloat(item.horas) || 0;
      const moTarifa = h * MO_TARIFA;
      const moCharged = h * moRate;
      const iva = ((item.pvrSinIva || 0) + moCharged) * IVA;
      const moCells = sinBonif ? [React.createElement("td", { key: "mo", style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right" } }, moCharged > 0 ? fmt(moCharged) : "\u2014")] : [React.createElement("td", { key: "mot", style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#9ca3af", textDecoration: moTarifa > 0 ? "line-through" : "none" } }, moTarifa > 0 ? fmt(moTarifa) : "\u2014"), React.createElement("td", { key: "mob", style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#16a34a", fontWeight: 600 } }, item.moAlquiler > 0 ? fmt(item.moAlquiler) : "\u2014")];
      return /* @__PURE__ */ React.createElement("tr", { key: item.id || i, style: { background: i % 2 === 0 ? "#f8fafc" : "white" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9" } }, item.descripcion, item.notas ? " (" + item.notas + ")" : ""), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9" } }, item.proveedor || "\u2014"), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right" } }, item.pvrSinIva > 0 ? fmt(item.pvrSinIva) : "\u2014"), moCells, /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right", color: "#6b7280" } }, fmt(iva)), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", textAlign: "right", fontWeight: 700 } }, fmt(extraTotalEff(d, item))));
    }))))), /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#f8fafc", padding: "7px 14px", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" } }, "Gesti\xF3n administrativa"), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "#f3f4f6" } }, ["Concepto", "Base s/IVA", "IVA 21%", "Total"].map((c) => /* @__PURE__ */ React.createElement("th", { key: c, style: { padding: "5px 8px", textAlign: c === "Concepto" ? "left" : "right", fontSize: 10, textTransform: "uppercase", borderBottom: "1px solid #e5e7eb" } }, c)))), /* @__PURE__ */ React.createElement("tbody", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", borderBottom: "1px solid #f1f5f9" } }, "\xBDh M.O. (", MO_RATE, "\u20AC/h)"), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", textAlign: "right", borderBottom: "1px solid #f1f5f9" } }, fmt(ADMIN_RATE)), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", textAlign: "right", color: "#6b7280", borderBottom: "1px solid #f1f5f9" } }, fmt(ADMIN_RATE * IVA)), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px 8px", textAlign: "right", fontWeight: 700, borderBottom: "1px solid #f1f5f9" } }, fmt(ADMIN_RATE * (1 + IVA))))))), /* @__PURE__ */ React.createElement("div", { style: { background: "linear-gradient(135deg,#0F1B2E,#4F6BF6)", color: "white", borderRadius: 8, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700 } }, "TOTAL DE REPARACIONES"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 24, fontWeight: 900 } }, fmt(gt))));
  }
  function RepositoryTab({ repo, onSave, showToast: showToast2, onPopulateFromHistory, historyCount }) {
    const [form, setForm] = useState({ codigo: "", descripcion: "", pvr: "", marca: "BENIMAR", modelos: "", a\u00F1o: "", notas: "" });
    const [search, setSearch] = useState("");
    const [editIdx, setEditIdx] = useState(null);
    const [loading, setLoading] = useState(false);
    const [extracted, setExtracted] = useState([]);
    const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));
    const canAdd = form.descripcion && form.pvr;
    const handleSave = () => {
      if (!canAdd) {
        showToast2("Complet\xE1 descripci\xF3n y PVR.", "err");
        return;
      }
      const entry = { ...form, pvr: parseFloat(form.pvr), id: editIdx !== null ? repo[editIdx].id : Date.now() };
      onSave(editIdx !== null ? repo.map((r, i) => i === editIdx ? entry : r) : [...repo, entry]);
      setForm({ codigo: "", descripcion: "", pvr: "", marca: "BENIMAR", modelos: "", a\u00F1o: "", notas: "" });
      setEditIdx(null);
      showToast2("Pieza guardada en el repositorio.");
    };
    const handleImage = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setLoading(true);
      try {
        const base64 = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result.split(",")[1]);
          r.onerror = rej;
          r.readAsDataURL(file);
        });
        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1e3,
            messages: [{ role: "user", content: [
              { type: "image", source: { type: "base64", media_type: file.type, data: base64 } },
              { type: "text", text: 'Extrae todas las piezas/art\xEDculos de esta imagen. Para cada una devuelve: codigo (string), descripcion (string), pvr (n\xFAmero sin IVA en euros). Responde SOLO con un array JSON sin texto adicional ni markdown. Ej: [{"codigo":"1EA008493R","descripcion":"Carenado 954x580x77","pvr":132.28}]' }
            ] }]
          })
        });
        const data = await resp.json();
        const text = (data.content?.find((c) => c.type === "text")?.text || "[]").replace(/```json|```/g, "").trim();
        const items = JSON.parse(text);
        if (!items.length) {
          showToast2("No encontr\xE9 piezas en la imagen.", "err");
        } else {
          setExtracted(items);
          showToast2(items.length + " piezas detectadas. Confirm\xE1 cada una.");
        }
      } catch (err) {
        showToast2("Error al procesar la imagen: " + err.message, "err");
      }
      setLoading(false);
    };
    const confirmExtracted = (item, marca) => {
      const entry = { codigo: item.codigo || "", descripcion: item.descripcion, pvr: parseFloat(item.pvr) || 0, marca, modelos: "", a\u00F1o: "", notas: "", id: Date.now() + Math.random() * 1e3 };
      onSave([...repo, entry]);
      setExtracted((prev) => prev.filter((x) => x !== item));
      showToast2("Pieza a\xF1adida al repositorio.");
    };
    const filtered = repo.filter((r) => {
      const q = search.toLowerCase();
      return !q || (r.codigo || "").toLowerCase().includes(q) || r.descripcion.toLowerCase().includes(q) || (r.modelos || "").toLowerCase().includes(q);
    });
    return /* @__PURE__ */ React.createElement("div", null, onPopulateFromHistory && /* @__PURE__ */ React.createElement("div", { style: { background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "#0F1B2E", marginBottom: 6 } }, "\u{1F4DA} Poblar desde el historial"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#6b7280", marginBottom: 10 } }, "Recorre tus ", historyCount || 0, " presupuestos guardados y agrega al repositorio cada pieza \xFAnica que hayas usado (nombre, PVR, horas, proveedor). No duplica las que ya est\xE1n."), /* @__PURE__ */ React.createElement("button", { onClick: onPopulateFromHistory, style: { background: "#0F1B2E", color: "white", padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, border: "none" } }, "\u2B07\uFE0F Importar piezas del historial")), /* @__PURE__ */ React.createElement("div", { style: { background: "white", borderRadius: 12, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "#0f766e", marginBottom: 10 } }, "\u{1F5C2}\uFE0F ", repo.length, " pieza", repo.length !== 1 ? "s" : "", " en el repositorio"), repo.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { position: "relative", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#9ca3af" } }, "\u{1F50D}"), /* @__PURE__ */ React.createElement("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Buscar por c\xF3digo, descripci\xF3n o modelo...", style: { ...S, paddingLeft: 32, background: "#f8fafc" } }), search && /* @__PURE__ */ React.createElement("button", { onClick: () => setSearch(""), style: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#9ca3af" } }, "\u2715")), repo.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { color: "#9ca3af", fontSize: 12, padding: "20px 0", textAlign: "center" } }, "El repositorio est\xE1 vac\xEDo. A\xF1ad\xED piezas manualmente o subiendo capturas.") : filtered.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { color: "#9ca3af", fontSize: 12, padding: "10px 0" } }, "Sin resultados para \xAB", search, "\xBB.") : filtered.map((piece) => /* @__PURE__ */ React.createElement("div", { key: piece.id, style: { border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", marginBottom: 7, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, piece.codigo && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#6b7280", fontFamily: "monospace", marginBottom: 2 } }, piece.codigo), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 13 } }, piece.descripcion), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#6b7280", marginTop: 3, display: "flex", gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { background: piece.marca === "BENIMAR" ? "#dbeafe" : "#dcfce7", color: piece.marca === "BENIMAR" ? "#1d4ed8" : "#15803d", padding: "1px 6px", borderRadius: 6, fontWeight: 700, fontSize: 10 } }, piece.marca), piece.modelos && /* @__PURE__ */ React.createElement("span", null, "\u{1F690} ", piece.modelos), piece.a\u00F1o && /* @__PURE__ */ React.createElement("span", null, "\u{1F4C5} ", piece.a\u00F1o), piece.notas && /* @__PURE__ */ React.createElement("span", null, piece.notas))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 800, color: "#0f766e", fontSize: 14 } }, fmt(piece.pvr), piece.horas ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "#6b7280", fontWeight: 600 } }, " \xB7 ", piece.horas, "h") : null), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "#9ca3af" } }, "s/IVA")), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setForm({ codigo: piece.codigo || "", descripcion: piece.descripcion, pvr: String(piece.pvr), marca: piece.marca, modelos: piece.modelos || "", a\u00F1o: piece.a\u00F1o || "", notas: piece.notas || "" });
      setEditIdx(repo.indexOf(piece));
    }, style: { background: "none", border: "none", cursor: "pointer", fontSize: 13 } }, "\u270F\uFE0F"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      onSave(repo.filter((r) => r.id !== piece.id));
      showToast2("Eliminado del repositorio.");
    }, style: { background: "none", border: "1px solid #fca5a5", borderRadius: 6, cursor: "pointer", fontSize: 12, padding: "2px 6px", color: "#dc2626" } }, "\u{1F5D1}\uFE0F"))))));
  }
  function ExtraTab({ cat, items, memory, onUpdate, showToast: showToast2 }) {
    const [form, setForm] = useState({ descripcion: "", proveedor: cat.proveedor || "", horas: "", pvrSinIva: "", notas: "" });
    const [editIdx, setEditIdx] = useState(null);
    const [sugs, setSugs] = useState([]);
    const [showSug, setShowSug] = useState(false);
    const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));
    const h = parseFloat(form.horas) || 0;
    const pvr = parseFloat(form.pvrSinIva) || 0;
    const moAlquiler = h * MO_RATE;
    const moConIva = moAlquiler * (1 + IVA);
    const pvrConIva = pvr * (1 + IVA);
    const totalPreview = moConIva + pvrConIva;
    const canAdd = form.descripcion && (form.pvrSinIva || form.horas);
    const subtotal = items.reduce((s, x) => s + (x.precioConIva || 0), 0);
    const handleDescChange = (val) => {
      f("descripcion", val);
      const q = val.toLowerCase().trim();
      const hits = q.length >= 2 ? Object.keys(memory).filter((k) => k.includes(q)) : [];
      setSugs(hits);
      setShowSug(hits.length > 0);
    };
    const handleSave = () => {
      if (!canAdd) {
        showToast2("Complet\xE1 descripci\xF3n y al menos PVR u horas.", "err");
        return;
      }
      const entry = { ...form, horas: h, pvrSinIva: pvr, moAlquiler, moConIva, pvrConIva, precioConIva: totalPreview, id: editIdx !== null ? items[editIdx].id : Date.now() };
      const newItems = editIdx !== null ? items.map((x, i) => i === editIdx ? entry : x) : [...items, entry];
      onUpdate(newItems, { key: form.descripcion.toLowerCase().trim(), pvrSinIva: pvr, horas: h, proveedor: form.proveedor });
      setForm({ descripcion: "", proveedor: cat.proveedor || "", horas: "", pvrSinIva: "", notas: "" });
      setEditIdx(null);
      showToast2("\xCDtem a\xF1adido.");
    };
    const handleDelete = (i) => {
      onUpdate(items.filter((_, idx) => idx !== i), null);
      showToast2("\xCDtem eliminado.");
    };
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { background: "white", borderRadius: 12, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: cat.accent, marginBottom: 12 } }, "A\xF1adir \xEDtem \u2014 ", cat.label), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 3, minWidth: 180, position: "relative" } }, /* @__PURE__ */ React.createElement("label", { style: L }, "Descripci\xF3n del da\xF1o"), /* @__PURE__ */ React.createElement("input", { value: form.descripcion, onChange: (e) => handleDescChange(e.target.value), onBlur: () => setTimeout(() => setShowSug(false), 150), placeholder: "Descripci\xF3n del trabajo o pieza", style: S }), showSug && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1px solid #e5e7eb", borderRadius: 8, zIndex: 50, boxShadow: "0 4px 12px rgba(0,0,0,0.12)", overflow: "hidden" } }, sugs.map((s) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: s,
        onClick: () => {
          setForm((p) => ({ ...p, descripcion: s, pvrSinIva: String(memory[s]?.pvrSinIva || ""), horas: String(memory[s]?.horas || ""), proveedor: memory[s]?.proveedor || p.proveedor }));
          setShowSug(false);
          showToast2("\u2726 Datos desde memoria.");
        },
        style: { padding: "8px 12px", cursor: "pointer", fontSize: 12, borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" },
        onMouseEnter: (e) => e.currentTarget.style.background = "#f0f9ff",
        onMouseLeave: (e) => e.currentTarget.style.background = "white"
      },
      /* @__PURE__ */ React.createElement("span", null, s),
      /* @__PURE__ */ React.createElement("span", { style: { color: cat.accent, fontWeight: 700 } }, memory[s]?.horas ? memory[s].horas + "h" : "", memory[s]?.pvrSinIva ? " \xB7 " + fmt(memory[s].pvrSinIva) : "")
    )))), /* @__PURE__ */ React.createElement("div", { style: { flex: 2, minWidth: 120 } }, /* @__PURE__ */ React.createElement("label", { style: L }, "Proveedor"), /* @__PURE__ */ React.createElement("input", { value: form.proveedor, onChange: (e) => f("proveedor", e.target.value), placeholder: "Proveedor", style: S }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 90 } }, /* @__PURE__ */ React.createElement("label", { style: L }, "Horas M.O."), /* @__PURE__ */ React.createElement("input", { type: "number", min: "0", step: "0.25", value: form.horas, onChange: (e) => f("horas", e.target.value), placeholder: "0", style: S })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 140 } }, /* @__PURE__ */ React.createElement("label", { style: L }, "PVR confirmado (s/IVA) \u20AC"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        min: "0",
        step: "0.01",
        value: form.pvrSinIva,
        onChange: (e) => f("pvrSinIva", e.target.value),
        placeholder: "0,00",
        style: { ...S, background: form.pvrSinIva ? "#f0fdf4" : "white", borderColor: form.pvrSinIva ? "#86efac" : "#d1d5db" }
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { flex: 2, minWidth: 140 } }, /* @__PURE__ */ React.createElement("label", { style: L }, "Notas"), /* @__PURE__ */ React.createElement("input", { value: form.notas, onChange: (e) => f("notas", e.target.value), placeholder: "Observaciones", style: S }))), (form.horas || form.pvrSinIva) && /* @__PURE__ */ React.createElement("div", { style: { background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "10px 13px", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "#0369a1", marginBottom: 8, textTransform: "uppercase" } }, "Vista previa"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))", gap: 8 } }, [["PVR c/IVA", fmt(pvrConIva)], ["M.O. " + MO_RATE + "\u20AC/h", fmt(moAlquiler)], ["M.O. c/IVA", fmt(moConIva)]].map(([lbl, val]) => /* @__PURE__ */ React.createElement("div", { key: lbl, style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", marginBottom: 1 } }, lbl), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600 } }, val))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", background: cat.accent, borderRadius: 7, padding: "5px 3px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, color: "rgba(255,255,255,0.7)", fontWeight: 700, textTransform: "uppercase", marginBottom: 1 } }, "TOTAL"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: "white" } }, fmt(totalPreview))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } }, /* @__PURE__ */ React.createElement("button", { onClick: handleSave, style: { background: canAdd ? cat.accent : "#9ca3af", color: "white", border: "none", padding: "10px 20px", borderRadius: 8, cursor: canAdd ? "pointer" : "default", fontSize: 13, fontWeight: 700 } }, editIdx !== null ? "\u{1F4BE} Guardar cambios" : "+ A\xF1adir \xEDtem"), editIdx !== null && /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setEditIdx(null);
      setForm({ descripcion: "", proveedor: cat.proveedor || "", horas: "", pvrSinIva: "", notas: "" });
    }, style: { background: "#f3f4f6", border: "none", padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 } }, "Cancelar"), items.length > 0 && editIdx === null && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "#6b7280" } }, "\u2726 ", items.length, " \xEDtem", items.length > 1 ? "s" : "", " cargado", items.length > 1 ? "s" : ""))), /* @__PURE__ */ React.createElement("div", { style: { background: "white", borderRadius: 12, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: cat.accent, marginBottom: 8, textTransform: "uppercase" } }, "\xCDtems (", items.length, ")"), items.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { color: "#9ca3af", fontSize: 12, padding: "10px 0" } }, "Sin \xEDtems todav\xEDa.") : /* @__PURE__ */ React.createElement(React.Fragment, null, items.map((item, i) => /* @__PURE__ */ React.createElement("div", { key: item.id || i, style: { border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", marginBottom: 7, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 13 } }, item.descripcion), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#6b7280", marginTop: 2, display: "flex", gap: 10, flexWrap: "wrap" } }, item.proveedor && /* @__PURE__ */ React.createElement("span", null, "\u{1F4E6} ", item.proveedor), item.horas > 0 && /* @__PURE__ */ React.createElement("span", null, "\u23F1 ", item.horas, "h \u2192 ", fmt(item.moConIva)), item.pvrSinIva > 0 && /* @__PURE__ */ React.createElement("span", null, "\u{1F529} PVR: ", fmt(item.pvrConIva)), item.notas && /* @__PURE__ */ React.createElement("span", null, item.notas))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 800, color: cat.accent, fontSize: 14 } }, fmt(item.precioConIva)), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setForm({ descripcion: item.descripcion, proveedor: item.proveedor || "", horas: String(item.horas || ""), pvrSinIva: String(item.pvrSinIva || ""), notas: item.notas || "" });
      setEditIdx(i);
    }, style: { background: "none", border: "none", cursor: "pointer", fontSize: 13 } }, "\u270F\uFE0F"), /* @__PURE__ */ React.createElement("button", { onClick: () => handleDelete(i), style: { background: "none", border: "1px solid #fca5a5", borderRadius: 6, cursor: "pointer", fontSize: 12, padding: "2px 7px", color: "#dc2626" } }, "\u{1F5D1}\uFE0F")))), /* @__PURE__ */ React.createElement("div", { style: { background: cat.accent, color: "white", borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", marginTop: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700 } }, "Subtotal ", cat.label), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 800, fontSize: 16 } }, fmt(subtotal))))));
  }
  const EMPTY_PIEZA = { tipo: "TOTAL", parcialPct: 50, descuentoPct: 0, pieza: "", codigo: "", proveedor: "", horas: "", pvrProveedor: "", notas: "" };
  function CuantificadorApp({ titularesByAc }) {
    return /* @__PURE__ */ React.createElement(ErrorBoundary, null, /* @__PURE__ */ React.createElement(AppInner, { titularesByAc }));
  }
  function AppInner({ titularesByAc = {} }) {
    const [doc, setDoc] = useState(EMPTY_DOC());
    const [anexoFotos, setAnexoFotos] = useState([]);
    const [flota, setFlota] = useState({});
    const [flotaStatus, setFlotaStatus] = useState(null);
    const [piezaMemory, setPiezaMemory] = useState({});
    const [extraMemory, setExtraMemory] = useState({ chapa: {}, toldos: {}, antenas: {}, fabricante: {}, combustible: {}, otros: {} });
    const [history, setHistory] = useState([]);
    const historyLoaded = React.useRef(false);
    useEffect(() => {
      try {
        if (typeof window !== "undefined" && history.length > 0) {
          window.__acHistory = history;
          window.dispatchEvent(new CustomEvent("ac-history-updated"));
        }
      } catch {
      }
    }, [history]);
    const [consultas, setConsultas] = useState([]);
    const [recambiosParts, setRecambiosParts] = useState([]);
    const loadRecambiosParts = React.useCallback(async () => {
      try {
        const r = await window.storage.get("ac-cockpit-data-v1");
        if (r) {
          const st2 = JSON.parse(r.value);
          setRecambiosParts(Array.isArray(st2.partsToOrder) ? st2.partsToOrder : []);
        }
      } catch {
      }
    }, []);
    useEffect(() => {
      loadRecambiosParts();
      const onFocus = () => loadRecambiosParts();
      window.addEventListener("focus", onFocus);
      return () => window.removeEventListener("focus", onFocus);
    }, [loadRecambiosParts]);
    const [tab, setTab] = useState("piezas");
    const [piezaSubTab, setPiezaSubTab] = useState("form");
    const [piezaForm, setPiezaForm] = useState(EMPTY_PIEZA);
    const [piezaEditIdx, setPiezaEditIdx] = useState(null);
    const [piSugs, setPiSugs] = useState([]);
    const [showPiSug, setShowPiSug] = useState(false);
    const [showProvSug, setShowProvSug] = useState(false);
    const [consultaForm, setConsultaForm] = useState({ pieza: "", tipo: "TOTAL", notas: "" });
    const [copied, setCopied] = useState(false);
    const [preview, setPreview] = useState(false);
    const [historialView, setHistorialView] = useState(null);
    const [confirmEmit, setConfirmEmit] = useState(false);
    const [confirmNew, setConfirmNew] = useState(false);
    const [confirmDeleteIdx, setConfirmDeleteIdx] = useState(null);
    const [repo, setRepo] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [toast, setToast] = useState(null);
    const proveedoresUsados = useMemo(() => {
      const set = /* @__PURE__ */ new Set();
      const collect = (piezas) => {
        for (const p of piezas || []) if (p.proveedor && p.proveedor.trim()) set.add(p.proveedor.trim());
      };
      collect(doc?.piezas);
      for (const h of history || []) collect(h?.piezas);
      return [...set].sort();
    }, [doc, history]);
    useEffect(() => {
      (async () => {
        // Cuantificador siempre arranca en blanco al cargar la app.
        // Se descarta cualquier borrador previo para no arrastrar reservas viejas.
        try {
          const empty = EMPTY_DOC();
          setDoc(empty);
          window.storage.set("ac_doc2", JSON.stringify(empty));
        } catch {
        }
        try {
          const r = await window.storage.get("ac_pieza_mem");
          if (r) setPiezaMemory(JSON.parse(r.value));
        } catch {
        }
        try {
          const r = await window.storage.get("ac_extra_mem");
          if (r) setExtraMemory(JSON.parse(r.value));
        } catch {
        }
        try {
          const r = await window.storage.get("ac_repo");
          if (r) setRepo(JSON.parse(r.value));
        } catch {
        }
        try {
          const r = await window.storage.get("ac_history");
          if (r) setHistory(JSON.parse(r.value).map(sanitizeDoc));
        } catch {
        }
        historyLoaded.current = true;
        try {
          const r = await window.storage.get("ac_consultas");
          if (r) setConsultas(JSON.parse(r.value));
        } catch {
        }
        let flotaLoaded = false;
        try {
          const r = await window.storage.get("ac_flota");
          if (r?.value) {
            const map = JSON.parse(r.value);
            if (map && Object.keys(map).length > 0) {
              setFlota(map);
              setFlotaStatus("ok");
              flotaLoaded = true;
            }
          }
        } catch {
        }
        if (!flotaLoaded) {
          try {
            const fd = await window.fs.readFile("Flota Veh\xEDculos Alquiler 1605.xlsx");
            processWorkbook(XLSX.read(fd, { type: "array" }));
          } catch {
            setFlotaStatus("upload");
          }
        }
      })();
    }, []);
    const saveDoc = (d) => {
  setDoc(d);
  try {
    window.storage.set("ac_doc2", JSON.stringify(d));
  } catch {
  }
};

const saveRepo = (r) => {
  setRepo(r);
  try {
    window.storage.set("ac_repo", JSON.stringify(r));
  } catch {
  }
};

const saveHistory = (h) => {
  if (!historyLoaded.current) return;
  try {
    window.storage.set("ac_history", JSON.stringify(h));
  } catch {
  }
};
    const showToast2 = (msg, type = "ok") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 2800);
    };
    const processWorkbook = (wb) => {
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
      if (!json.length) {
        setFlotaStatus("empty");
        return;
      }
      const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const keys = Object.keys(json[0]);
      const map = {};
      json.forEach((row) => {
        const acK = keys.find((k) => /identificador|ac\b|nº|num|unidad/i.test(norm(k)));
        const matK = keys.find((k) => /matr/i.test(norm(k)));
        const basK = keys.find((k) => /bastidor|vin|chasis/i.test(norm(k)));
        const marcaK = keys.find((k) => /marca/i.test(norm(k)));
        if (acK) {
          const v = String(row[acK]).replace(/\D/g, "").trim();
          if (v) map[v] = { matricula: matK ? String(row[matK]).trim() : "", bastidor: basK ? String(row[basK]).trim() : "", marca: marcaK ? String(row[marcaK]).trim() : "" };
        }
      });
      setFlota(map);
      setFlotaStatus(Object.keys(map).length > 0 ? "ok" : "nomatch");
      try {
        window.storage.set("ac_flota", JSON.stringify(map));
      } catch {
      }
    };
    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => processWorkbook(XLSX.read(new Uint8Array(evt.target.result), { type: "array" }));
      reader.readAsArrayBuffer(file);
    };
    const setVeh = (k, v) => {
      const d = { ...doc, vehicle: { ...doc.vehicle, [k]: v } };
      setDoc(d);
      saveDoc(d);
    };
    const setTitular = (patch) => {
      const d = { ...doc, titular: { ...doc.titular || {}, ...patch } };
      setDoc(d);
      saveDoc(d);
    };
    const descartarTitular = (r) => {
      const dkey = `${(r.salida || "").slice(0, 10)}|${(r.cliente || "").trim().toLowerCase()}`;
      const prev = doc.titularesDescartados || [];
      if (prev.includes(dkey)) return;
      const d = { ...doc, titularesDescartados: [...prev, dkey] };
      setDoc(d);
      saveDoc(d);
      showToast2("Sugerencia de titular descartada.");
    };
   const titularSugerencias = useMemo(() => {
  const key = String(doc.vehicle?.ac || "").replace(/\D/g, "");
  const lista = key ? titularesByAc[key] || [] : [];
  const descartadas = new Set(doc.titularesDescartados || []);

  // La lista ya viene ordenada por recencia y combinando 720 + arrivalLog +
  // historial (incluye al cliente actual/recién terminado). No filtramos por
  // "devolución pasada": queremos que el último cliente esté siempre.
  // Identifica una reserva de forma única.
  // Preferimos reservaId; si no existe, usamos salida + devolución + cliente.
  const normCli = (x) => (x || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
  // Una sugerencia por CLIENTE: el mismo cliente que llega por varias fuentes
  // (720 / arrivalLog / historial) no se repite; nos quedamos con su aparición
  // más reciente.
  const reservaKey = (r) => normCli(r.cliente);

  const unicas = new Map();

  for (const r of lista) {
    if (!r.cliente) continue;

    const descKey =
      `${(r.salida || "").slice(0, 10)}|${(r.cliente || "").trim().toLowerCase()}`;

    if (descartadas.has(descKey)) continue;

    const keyReserva = reservaKey(r);

    // Conservamos la aparición MÁS RECIENTE de cada cliente (por _rec: momento
    // real de vuelta / fin de alquiler), no la primera que aparece.
    const prev = unicas.get(keyReserva);
    if (!prev || (r._rec || 0) > (prev._rec || 0)) unicas.set(keyReserva, r);
  }

  // Más reciente primero: el alquiler en curso / recién terminado arriba, y las
  // devoluciones ordenadas por cuándo volvieron DE VERDAD (at). Máximo 3.
  return [...unicas.values()]
    .sort((a, b) => (b._rec || 0) - (a._rec || 0))
    .slice(0, 3);
}, [doc.vehicle?.ac, titularesByAc, doc.titularesDescartados]);
    const fmtRango = (r) => {
      const f = (s) => s ? new Date(s).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" }) : "";
      const a = f(r.salida), b = f(r.devolucion);
      return a && b ? `${a} \u2013 ${b}` : a || b || "";
    };
    const handleAcChange = (val) => {
      const nv = { ...doc.vehicle, ac: val };
      const m = flota[val.trim().replace(/\D/g, "")];
      if (m) {
        if (m.matricula) nv.matricula = m.matricula;
        if (m.bastidor) nv.bastidor = m.bastidor;
        if (m.marca) nv.marca = /roller/i.test(m.marca) ? "ROLLER TEAM" : /benimar/i.test(m.marca) ? "BENIMAR" : doc.vehicle.marca;
        showToast2("\u2726 AC " + val + ": " + (m.matricula || "\u2014") + " \xB7 " + (m.bastidor || "\u2014"));
      }
      const d = { ...doc, vehicle: nv };
      setDoc(d);
      saveDoc(d);
    };
    useEffect(() => {
      let cancelled = false;
      const digits = String(doc.vehicle?.ac || "").replace(/\D/g, "");
      if (!digits || typeof window === "undefined" || !window.acllarPhotos || !window.acllarPhotos.getByAc) { setAnexoFotos([]); return; }
      (async () => {
        const recs = await window.acllarPhotos.getByAc(digits);
        if (cancelled) return;
        const sel = new Set((doc.anexoKeys || []).map((k) => k.vehicleId + "||" + k.idk + "#" + k.idx));
        const items = [];
        for (const rec of recs) (rec.fotos || []).forEach((dataUrl, idx) => {
          items.push({ vehicleId: rec.vehicleId, idk: rec.idk, idx, dataUrl, zona: rec.zona, tipoDano: rec.tipoDano, code: rec.pdfCode, checked: sel.has(rec.vehicleId + "||" + rec.idk + "#" + idx) });
        });
        setAnexoFotos(items);
      })();
      return () => { cancelled = true; };
    }, [doc.vehicle?.ac]);
    const toggleAnexoFoto = (item) => {
      const sig = item.vehicleId + "||" + item.idk + "#" + item.idx;
      setAnexoFotos((prev) => prev.map((f) => (f.vehicleId === item.vehicleId && f.idk === item.idk && f.idx === item.idx) ? { ...f, checked: !f.checked } : f));
      const prevKeys = doc.anexoKeys || [];
      const exists = prevKeys.some((k) => (k.vehicleId + "||" + k.idk + "#" + k.idx) === sig);
      const nextKeys = exists ? prevKeys.filter((k) => (k.vehicleId + "||" + k.idk + "#" + k.idx) !== sig) : [...prevKeys, { vehicleId: item.vehicleId, idk: item.idk, idx: item.idx, zona: item.zona, tipoDano: item.tipoDano, code: item.code }];
      const nd = { ...doc, anexoKeys: nextKeys };
      setDoc(nd); saveDoc(nd);
    };
    const renderAnexoPanel = () => {
      if (!anexoFotos.length) {
        const _acDig = String(doc.vehicle?.ac || "").replace(/\D/g, "");
        if (!_acDig) return null;
        return React.createElement("div", { style: { background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#6b7280" } }, "📷 Anexo fotográfico: este AC todavía no tiene fotos de daños guardadas. Se guardan solas al importar su OT en el cockpit (pestaña Flota).");
      }
      const nSel = anexoFotos.filter((f) => f.checked).length;
      return React.createElement("div", { style: { background: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", marginBottom: 12 } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 } },
          React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: "#0F1B2E" } }, "📷 Anexo fotográfico"),
          React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: nSel ? "#16a34a" : "#9ca3af" } }, nSel + " de " + anexoFotos.length + " seleccionadas")),
        React.createElement("div", { style: { fontSize: 12, color: "#6b7280", marginBottom: 12 } }, "Fotos de los daños de este AC (de la última OT importada). Tildá las que quieras adjuntar al presupuesto; salen en una página aparte al descargar."),
        React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 10 } }, anexoFotos.map((f) =>
          React.createElement("div", { key: f.vehicleId + f.idk + "#" + f.idx, onClick: () => toggleAnexoFoto(f), style: { width: "calc(33.333% - 7px)", minWidth: 118, boxSizing: "border-box", border: "2px solid " + (f.checked ? "#16a34a" : "#e5e7eb"), borderRadius: 10, overflow: "hidden", cursor: "pointer", background: f.checked ? "rgba(22,163,74,0.05)" : "white" } },
            React.createElement("div", { style: { position: "relative" } },
              React.createElement("img", { src: f.dataUrl, style: { width: "100%", height: 110, objectFit: "cover", display: "block" }, alt: f.zona || "foto" }),
              React.createElement("div", { style: { position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", background: f.checked ? "#16a34a" : "rgba(255,255,255,0.9)", border: "1px solid " + (f.checked ? "#16a34a" : "#cbd5e1"), color: "white", fontSize: 13, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" } }, f.checked ? "✓" : "")),
            React.createElement("div", { style: { padding: "5px 8px" } },
              React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, f.zona || "Daño"),
              React.createElement("div", { style: { fontSize: 10, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, (f.tipoDano || "") + (f.code ? (" · " + f.code) : "")))))));
    };
    const pf = (k, v) => setPiezaForm((p) => ({ ...p, [k]: v }));
    const handlePiezaChange = (val) => {
      pf("pieza", val);
      const q = val.toLowerCase().trim();
      if (q.length < 2) {
        setPiSugs([]);
        setShowPiSug(false);
        return;
      }
      const repoHits = repo.map((r) => {
        const memKey = Object.keys(piezaMemory).find((k) => k === r.descripcion.toLowerCase().trim() || k.includes(r.descripcion.toLowerCase().trim().slice(0, 10)));
        const notas = memKey ? piezaMemory[memKey]?.notas || "" : r.notas || "";
        return { r, memKey, notas };
      }).filter(({ r, notas }) => r.descripcion.toLowerCase().includes(q) || (r.codigo || "").toLowerCase().includes(q) || notas.toLowerCase().includes(q)).map(({ r, memKey, notas }) => {
        const horas = r.horas != null && r.horas !== "" ? r.horas : memKey ? piezaMemory[memKey]?.horas : null;
        return { label: r.descripcion, codigo: r.codigo, pvr: r.pvr, horas, proveedor: r.proveedor || "", marca: r.marca, notas, fromRepo: true };
      });
      const recHits = (recambiosParts || []).filter((p) => (p.pvrOficial != null || p.horasMO != null) && ((p.descripcion || "").toLowerCase().includes(q) || (p.codigo || "").toLowerCase().includes(q) || (p.notas || "").toLowerCase().includes(q))).map((p) => ({
        label: p.descripcion || p.codigo || "",
        codigo: p.codigo || "",
        pvr: p.pvrOficial != null ? p.pvrOficial : null,
        horas: p.horasMO != null ? p.horasMO : null,
        notas: p.notas || "",
        proveedor: "",
        fromRecambios: true
      })).filter((p, i, arr) => arr.findIndex((x) => (x.label || "").toLowerCase().trim() === (p.label || "").toLowerCase().trim()) === i);
      const recLabels = new Set(recHits.map((r) => (r.label || "").toLowerCase().trim()));
      const memHits = Object.keys(piezaMemory).filter((k) => {
        if (repoHits.some((r) => r.label.toLowerCase().trim() === k)) return false;
        if (recLabels.has(k)) return false;
        const notas = (piezaMemory[k]?.notas || "").toLowerCase();
        return k.includes(q) || notas.includes(q);
      }).map((k) => ({ label: k, horas: piezaMemory[k]?.horas, pvr: null, notas: piezaMemory[k]?.notas || "", fromRepo: false }));
      const all = [...recHits, ...repoHits.filter((r) => !recLabels.has((r.label || "").toLowerCase().trim())), ...memHits];
      setPiSugs(all);
      setShowPiSug(all.length > 0);
    };
    const calcPrev = calcPieza(piezaForm);
    const canAddPieza = !!(piezaForm.pieza && piezaForm.horas && piezaForm.pvrProveedor);
    const canDraftPieza = !!piezaForm.pieza;
    const commitPieza = (asDraft) => {
      if (asDraft && !canDraftPieza) {
        showToast2("Complet\xE1 al menos la pieza.", "err");
        return;
      }
      if (!asDraft && !canAddPieza) {
        showToast2("Complet\xE1 pieza, horas y PVR.", "err");
        return;
      }
      const entry = asDraft ? { ...piezaForm, moTarifa: 0, moAlquiler: 0, moConIva: 0, pvrEfectivo: 0, pvrConIva: 0, total: 0, draft: true, id: piezaEditIdx !== null ? doc.piezas[piezaEditIdx].id : Date.now() } : { ...piezaForm, ...calcPieza(piezaForm), draft: false, id: piezaEditIdx !== null ? doc.piezas[piezaEditIdx].id : Date.now() };
      const newPiezas = piezaEditIdx !== null ? doc.piezas.map((r, i) => i === piezaEditIdx ? entry : r) : [...doc.piezas, entry];
      if (!asDraft) {
        const key = piezaForm.pieza.toLowerCase().trim();
        const nm = { ...piezaMemory, [key]: { horas: parseFloat(piezaForm.horas), marca: doc.vehicle.marca, proveedor: piezaForm.proveedor || "", notas: piezaForm.notas || "" } };
        setPiezaMemory(nm);
        try {
          window.storage.set("ac_pieza_mem", JSON.stringify(nm));
        } catch {
        }
      }
            const d = { ...doc, piezas: newPiezas };
      setDoc(d);
      saveDoc(d);
      setPiezaEditIdx(null);
    setPiezaForm({
  tipo: "TOTAL",
  parcialPct: 50,
  descuentoPct: 0,
  pieza: "",
  codigo: "",
  proveedor: "",
  horas: "",
  pvrProveedor: "",
  notas: ""
});
console.log("RESET PIEZA FORM");
      setPiSugs([]);
      setShowPiSug(false);
      setShowProvSug(false);
      if (asDraft || piezaEditIdx !== null) {
        setPiezaSubTab("lista");
      } else {
        setPiezaSubTab("form");
      }
      showToast2(asDraft ? "Borrador guardado." : "Pieza a\xF1adida.");
    };
    const handleEditPieza = (i) => {
      const r = doc.piezas[i];
      setPiezaForm({ tipo: r.tipo, parcialPct: r.parcialPct != null ? r.parcialPct : 50, descuentoPct: r.descuentoPct != null ? r.descuentoPct : 0, pieza: r.pieza, proveedor: r.proveedor || "", horas: String(r.horas || ""), pvrProveedor: String(r.pvrProveedor || ""), notas: r.notas || "" });
      setPiezaEditIdx(i);
      setPiezaSubTab("form");
    };
    const handleDeletePieza = (i) => {
      const d = { ...doc, piezas: doc.piezas.filter((_, idx) => idx !== i) };
      setDoc(d);
      saveDoc(d);
      showToast2("Pieza eliminada.");
    };
    const cf = (k, v) => setConsultaForm((p) => ({ ...p, [k]: v }));
    const persistConsultas = (nc) => {
      setConsultas(nc);
      try {
        window.storage.set("ac_consultas", JSON.stringify(nc));
      } catch {
      }
    };
    const handleAddConsulta = () => {
      if (!consultaForm.pieza) {
        showToast2("Complet\xE1 la pieza.", "err");
        return;
      }
      persistConsultas([...consultas, { ...consultaForm, ...doc.vehicle, id: Date.now() }]);
      setConsultaForm({ pieza: "", tipo: "TOTAL", notas: "" });
      showToast2("A\xF1adido a consulta.");
    };
    const handleRemoveConsulta = (id) => persistConsultas(consultas.filter((c) => c.id !== id));
    const handlePvrReceived = (c) => {
      setPiezaForm({ tipo: c.tipo, pieza: c.pieza, horas: "", pvrProveedor: "", notas: c.notas || "" });
      handleRemoveConsulta(c.id);
      setPiezaSubTab("form");
      showToast2("Carg\xE1 el PVR para: " + c.pieza);
    };
    const emailBody = "Para: martina.haluskova@benimar.es\nAsunto: Consulta PVR \u2014 AC " + (doc.vehicle.ac || "") + "\n\nHola Martina,\n\n" + consultas.map((c, i) => i + 1 + ". Pieza: " + c.pieza + (c.notas ? " (" + c.notas + ")" : "") + "\n   AC " + (c.ac || "") + (c.matricula ? " \xB7 " + c.matricula : "") + "\n   Tipo: " + (c.tipo === "TOTAL" ? "Cambio total" : "Reparaci\xF3n parcial")).join("\n\n") + "\n\nMuchas gracias.";
    const handleExtraUpdate = (catId, newItems, memEntry) => {
      const d = { ...doc, [catId]: newItems };
      setDoc(d);
      saveDoc(d);
      if (memEntry) {
        const nm = { ...extraMemory, [catId]: { ...extraMemory[catId], [memEntry.key]: { pvrSinIva: memEntry.pvrSinIva, horas: memEntry.horas, proveedor: memEntry.proveedor } } };
        setExtraMemory(nm);
        try {
          window.storage.set("ac_extra_mem", JSON.stringify(nm));
        } catch {
        }
      }
    };
    const handleEmitConfirm = () => {
      let d;
      try {
        const emitDate = today();
        const newId = makeBudgetId(doc.vehicle?.ac);
        d = { ...doc, id: newId, fecha: emitDate, emitted: true, emittedAt: (/* @__PURE__ */ new Date()).toISOString() };
      } catch (e) {
        showToast2("Error preparando el presupuesto: " + (e && e.message ? e.message : String(e)), "err");
        return;
      }
      try {
        setDoc(d);
      } catch (e) {
      }
      try {
        saveDoc(d);
      } catch (e) {
      }
      try {
        const nh = [{ ...d, savedAt: (/* @__PURE__ */ new Date()).toISOString() }, ...history];
        setHistory(nh);
        saveHistory(nh);
      } catch (e) {
        showToast2("Error guardando en historial: " + (e && e.message ? e.message : String(e)), "err");
      }
      try {
        setConfirmEmit(false);
        setPreview(true);
      } catch (e) {
      }
      showToast2("Presupuesto emitido y guardado en historial.");
      try {
        const existing = new Set(repo.map((r) => (r.descripcion || "").toLowerCase().trim()));
        const additions = [];
        for (const p of d.piezas || []) {
          if (p.draft) continue;
          const name = (p.pieza || "").trim();
          if (!name) continue;
          const key = name.toLowerCase();
          if (existing.has(key)) continue;
          existing.add(key);
          additions.push({
            id: Date.now() + additions.length,
            codigo: p.codigo || "",
            descripcion: name,
            pvr: parseFloat(p.pvrProveedor) || 0,
            horas: parseFloat(p.horas) || 0,
            proveedor: p.proveedor || "",
            marca: d.vehicle?.marca || "",
            modelos: d.vehicle?.modelo || "",
            a\u00F1o: "",
            notas: p.notas || "",
            fromPresupuesto: true,
            addedAt: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
        if (additions.length > 0) saveRepo([...repo, ...additions]);
      } catch (e) {
      }
      try {
        downloadHTML(d, docSubtotals(d), docGrandTotal(d));
      } catch (e) {
      }
    };
    const handlePopulateRepoFromHistory = () => {
      try {
        const existing = new Set(repo.map((r) => (r.descripcion || "").toLowerCase().trim()));
        const byName = {};
        for (const h of history || []) {
          for (const p of h.piezas || []) {
            if (p.draft) continue;
            const name = (p.pieza || "").trim();
            if (!name) continue;
            const key = name.toLowerCase();
            if (existing.has(key)) continue;
            if (byName[key]) continue;
            byName[key] = {
              descripcion: name,
              pvr: parseFloat(p.pvrProveedor) || 0,
              horas: parseFloat(p.horas) || 0,
              proveedor: p.proveedor || "",
              marca: h.vehicle?.marca || "",
              modelos: h.vehicle?.modelo || ""
            };
          }
        }
        const additions = Object.values(byName).map((d, i) => ({
          id: Date.now() + i,
          codigo: "",
          descripcion: d.descripcion,
          pvr: d.pvr,
          horas: d.horas,
          proveedor: d.proveedor,
          marca: d.marca,
          modelos: d.modelos,
          a\u00F1o: "",
          notas: "",
          fromPresupuesto: true,
          addedAt: (/* @__PURE__ */ new Date()).toISOString()
        }));
        if (additions.length === 0) {
          showToast2("No hay piezas nuevas para agregar (ya est\xE1n todas en el repositorio).");
          return;
        }
        saveRepo([...repo, ...additions]);
        showToast2(`\u2713 ${additions.length} piezas agregadas al repositorio desde el historial.`);
      } catch (err) {
        showToast2("Error al poblar el repositorio: " + err.message, "err");
      }
    };
    const handleNewDocConfirm = () => {
      try {
        const alreadyInHistory = history.some((h) => h.id === doc.id);
        if (docGrandTotal(doc) > 0 && !alreadyInHistory) {
          const nh = [{ ...doc, savedAt: (/* @__PURE__ */ new Date()).toISOString() }, ...history];
          setHistory(nh);
          saveHistory(nh);
        }
      } catch (e) {
      }
      try {
        const d = EMPTY_DOC();
        setDoc(d);
        saveDoc(d);
      } catch (e) {
      }
      setPreview(false);
      setConfirmNew(false);
      setTab("piezas");
      setPiezaSubTab("form");
      setPiezaForm(EMPTY_PIEZA);
      setPiezaEditIdx(null);
      showToast2("Nueva cuantificaci\xF3n iniciada.");
    };
    const handleDeleteHistoryConfirm = () => {
      const nh = history.filter((_, idx) => idx !== confirmDeleteIdx);
      setHistory(nh);
      saveHistory(nh);
      setConfirmDeleteIdx(null);
      showToast2("Eliminado del historial.");
    };
    const handleExportBackup = () => {
      if (!(window.acllarEsAdmin && window.acllarEsAdmin())) return;
      const backup = { version: 2, exportedAt: (/* @__PURE__ */ new Date()).toISOString(), currentDoc: doc, history, piezaMemory, extraMemory, repo };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "respaldo_acller_" + today() + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast2("Respaldo descargado.");
    };
    const handleImportBackup = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const b = JSON.parse(evt.target.result);
          if (!b.version) throw new Error("Formato inv\xE1lido");
          if (b.currentDoc) {
            const d = sanitizeDoc(b.currentDoc);
            setDoc(d);
            saveDoc(d);
          }
          if (b.history) {
            const h = b.history.map((raw) => {
              try {
                return sanitizeDoc(raw);
              } catch {
                return null;
              }
            }).filter(Boolean);
            setHistory(h);
            saveHistory(h);
          }
          if (b.piezaMemory) {
            setPiezaMemory(b.piezaMemory);
            try {
              window.storage.set("ac_pieza_mem", JSON.stringify(b.piezaMemory));
            } catch {
            }
          }
          if (b.repo) {
            saveRepo(b.repo);
          }
          showToast2("Respaldo importado: " + (b.history || []).length + " presupuestos restaurados.");
          setTab("historial");
        } catch (err) {
          showToast2("Error al leer el archivo: " + err.message, "err");
        }
      };
      reader.readAsText(file);
    };
    const handleMergeBackup = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const b = JSON.parse(evt.target.result);
          if (!b.version) throw new Error("Formato inv\xE1lido");
          const incoming = (b.history || []).map((raw) => {
            try {
              return sanitizeDoc(raw);
            } catch {
              return null;
            }
          }).filter(Boolean);
          const keyOf = (d) => {
            if (d.id != null) return "id:" + d.id;
            const ac = d.vehicle?.ac || "";
            return "fa:" + (d.fecha || "") + "|" + ac;
          };
          const merged = [...history];
          const seen = new Set(merged.map(keyOf));
          let added = 0;
          for (const doc2 of incoming) {
            const k = keyOf(doc2);
            if (!seen.has(k)) {
              merged.push(doc2);
              seen.add(k);
              added++;
            }
          }
          merged.sort((a, b2) => {
            const fa = a.fecha || "", fb = b2.fecha || "";
            if (fa !== fb) return fb.localeCompare(fa);
            return (b2.id || 0) - (a.id || 0);
          });
          setHistory(merged);
          saveHistory(merged);
          if (b.piezaMemory) {
            setPiezaMemory((prev) => {
              const next = { ...b.piezaMemory, ...prev };
              try {
                window.storage.set("ac_pieza_mem", JSON.stringify(next));
              } catch {
              }
              return next;
            });
          }
          if (b.repo && Array.isArray(b.repo)) {
            const existingKeys = new Set(repo.map((r) => (r.codigo || r.descripcion || "").toLowerCase()));
            const mergedRepo = [...repo];
            for (const r of b.repo) {
              const k = (r.codigo || r.descripcion || "").toLowerCase();
              if (k && !existingKeys.has(k)) {
                mergedRepo.push(r);
                existingKeys.add(k);
              }
            }
            saveRepo(mergedRepo);
          }
          showToast2(`Combinado: +${added} presupuestos nuevos (total ${merged.length}).`);
          setTab("historial");
        } catch (err) {
          showToast2("Error al combinar: " + err.message, "err");
        }
      };
      reader.readAsText(file);
    };
    const searchInDoc = (h, q) => {
      if (!q.trim()) return true;
      const terms = q.toLowerCase().trim().split(/\s+/);
      const haystack = [
        h.vehicle?.ac,
        h.vehicle?.matricula,
        h.vehicle?.bastidor,
        h.vehicle?.marca,
        h.fecha,
        ...(h.piezas || []).map((r) => r.pieza + " " + (r.notas || "") + " " + r.tipo),
        ...EXTRA_CATS.flatMap((k) => (h[k] || []).map((x) => x.descripcion + " " + (x.proveedor || "") + " " + (x.notas || ""))),
        String(Math.round(docGrandTotal(h)))
      ].filter(Boolean).join(" ").toLowerCase();
      return terms.every((t) => haystack.includes(t));
    };
    const filteredHistory = history.filter((h) => searchInDoc(h, searchQuery));
    const highlightMatch = (text, q) => {
      if (!q.trim() || !text) return text;
      const terms = q.toLowerCase().trim().split(/\s+/);
      const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
      const re = new RegExp("(" + escaped + ")", "gi");
      const parts = String(text).split(re);
      return parts.map((p, i) => re.test(p) ? /* @__PURE__ */ React.createElement("mark", { key: i, style: { background: "#fef08a", borderRadius: 2, padding: "0 1px" } }, p) : p);
    };
    const st = docSubtotals(doc);
    const grandTotal = docGrandTotal(doc);
    return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Inter,system-ui,sans-serif", background: "#f1f5f9", minHeight: "100vh", padding: "14px 10px" } }, toast && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 14, right: 14, zIndex: 999, background: toast.type === "err" ? "#fee2e2" : "#dcfce7", color: toast.type === "err" ? "#991b1b" : "#166534", padding: "9px 15px", borderRadius: 8, fontSize: 13, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" } }, toast.msg), /* @__PURE__ */ React.createElement("div", { style: { background: "linear-gradient(135deg,#0F1B2E,#4F6BF6)", color: "white", padding: "14px 16px", borderRadius: 12, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 800 } }, "\u{1F527} Cuantificador de Da\xF1os AC"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, opacity: 0.7, marginTop: 2 } }, "M.O.: ", MO_TARIFA, "\u20AC/h \u2192 alquiler ", MO_RATE, "\u20AC/h \xB7 Admin: \xBDh \xB7 IVA: 21%")), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmNew(true), style: { background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)", padding: "7px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "+ Nueva cuantificaci\xF3n")), confirmNew && /* @__PURE__ */ React.createElement("div", { style: { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 9, padding: "12px 14px", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "white", fontWeight: 600, marginBottom: 8 } }, "\u26A0\uFE0F \xBFComenzar nueva cuantificaci\xF3n? La actual se guardar\xE1 en el historial."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: handleNewDocConfirm, style: { background: "#16a34a", color: "white", border: "none", padding: "8px 18px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 800 } }, "\u2705 S\xED, nueva"), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmNew(false), style: { background: "rgba(255,255,255,0.2)", color: "white", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 12 } }, "Cancelar"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, [["N\xBA AC", "ac", "70px", "286", true], ["Matr\xEDcula", "matricula", "110px", "1234 ABC", false], ["VIN / Bastidor", "bastidor", "1fr", "VF1RFD00X56789012", false]].map(([label, key, minW, ph, isAc]) => /* @__PURE__ */ React.createElement("div", { key, style: { flex: 1, minWidth: minW } }, /* @__PURE__ */ React.createElement("label", { style: { ...L, color: "rgba(255,255,255,0.7)" } }, label), /* @__PURE__ */ React.createElement("input", { value: doc.vehicle[key], onChange: (e) => isAc ? handleAcChange(e.target.value) : setVeh(key, e.target.value), placeholder: ph, style: { ...S, background: "rgba(255,255,255,0.15)", color: "white", borderColor: "rgba(255,255,255,0.3)" } }))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: "110px" } }, /* @__PURE__ */ React.createElement("label", { style: { ...L, color: "rgba(255,255,255,0.7)" } }, "Marca"), /* @__PURE__ */ React.createElement("select", { value: doc.vehicle.marca, onChange: (e) => setVeh("marca", e.target.value), style: { ...S, background: "rgba(255,255,255,0.15)", color: "white", borderColor: "rgba(255,255,255,0.3)" } }, /* @__PURE__ */ React.createElement("option", { style: { color: "#111" } }, "BENIMAR"), /* @__PURE__ */ React.createElement("option", { style: { color: "#111" } }, "ROLLER TEAM")))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement("label", { style: { ...L, color: "rgba(255,255,255,0.7)" } }, "Titular de la reserva"), /* @__PURE__ */ React.createElement(
      "input",
      {
        value: doc.titular?.nombre || "",
        onChange: (e) => setTitular({ nombre: e.target.value }),
        placeholder: "eleg\xED abajo o escrib\xED el nombre",
        style: { ...S, background: "rgba(255,255,255,0.15)", color: "white", borderColor: "rgba(255,255,255,0.3)" }
      }
    ), titularSugerencias.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 7, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 700 } }, "\xDALTIMAS RESERVAS:"), titularSugerencias.map((r, i) => {
      const sel = (doc.titular?.nombre || "") === r.cliente;
      return /* @__PURE__ */ React.createElement("div", { key: i, style: { position: "relative", display: "inline-flex" } }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setTitular({ nombre: r.cliente, salida: r.salida || "", devolucion: r.devolucion || "" }),
          title: r.estatus || "",
          style: {
            border: sel ? "1px solid #86efac" : "1px solid rgba(255,255,255,0.3)",
            background: sel ? "rgba(134,239,172,0.25)" : "rgba(255,255,255,0.12)",
            color: "white",
            borderRadius: 7,
            padding: "5px 24px 5px 10px",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
            textAlign: "left",
            lineHeight: 1.35
          }
        },
        sel ? "\u2713 " : "",
        r.cliente,
        /* @__PURE__ */ React.createElement("span", { style: { display: "block", fontSize: 9.5, fontWeight: 500, color: "rgba(255,255,255,0.7)" } }, fmtRango(r))
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            descartarTitular(r);
          },
          title: "Borrar esta sugerencia (reserva incorrecta)",
          style: {
            position: "absolute",
            top: 2,
            right: 2,
            width: 18,
            height: 18,
            border: "none",
            background: "rgba(0,0,0,0.25)",
            color: "white",
            borderRadius: 5,
            cursor: "pointer",
            fontSize: 11,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }
        },
        "\u2715"
      ));
    }), doc.titular?.nombre && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setTitular({ nombre: "", salida: "", devolucion: "" }),
        style: { border: "none", background: "transparent", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 11 }
      },
      "limpiar"
    )) : /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 5 } }, doc.vehicle?.ac ? "Sin reservas guardadas de este AC todav\xEDa \u2014 import\xE1 el Excel semanal para que aparezcan." : "Carg\xE1 el N\xBA AC para ver las \xFAltimas reservas."))), flotaStatus === "upload" && /* @__PURE__ */ React.createElement("div", { style: { background: "#fef9c3", border: "1px solid #fde047", borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 12, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", null, "\u{1F4C2} ", /* @__PURE__ */ React.createElement("b", null, "Carg\xE1 el Excel de flota"), " para autocompletar matr\xEDcula y VIN:"), /* @__PURE__ */ React.createElement("label", { style: { background: "#0F1B2E", color: "white", padding: "7px 14px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 700 } }, "Seleccionar archivo", /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".xlsx,.xls", onChange: handleFileUpload, style: { display: "none" } }))), flotaStatus === "ok" && /* @__PURE__ */ React.createElement("div", { style: { background: "#dcfce7", border: "1px solid #86efac", borderRadius: 8, padding: "6px 14px", marginBottom: 10, fontSize: 11, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("span", null, "\u2705 Flota cargada: ", Object.keys(flota).length, " veh\xEDculos ", /* @__PURE__ */ React.createElement("span", { style: { color: "#16803c" } }, "\xB7 se mantiene al cambiar de pesta\xF1a")), /* @__PURE__ */ React.createElement("label", { style: { background: "white", border: "1px solid #86efac", color: "#166534", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 10.5, fontWeight: 700 } }, "Actualizar Excel", /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".xlsx,.xls", onChange: handleFileUpload, style: { display: "none" } }))), renderAnexoPanel(), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, paddingBottom: 4, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { flexShrink: 0, background: "white", borderRadius: 8, padding: "7px 10px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)", borderTop: "3px solid " + (st.piezas > 0 ? "#0F1B2E" : "#e5e7eb"), minWidth: 90 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 } }, "\u{1F527} Piezas AC"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 800, color: st.piezas > 0 ? "#0F1B2E" : "#9ca3af" } }, st.piezas > 0 ? fmt(st.piezas) : "\u2014")), /* @__PURE__ */ React.createElement("div", { style: { flexShrink: 0, background: "linear-gradient(135deg,#0F1B2E,#4F6BF6)", borderRadius: 8, padding: "7px 12px", minWidth: 90 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "rgba(255,255,255,0.7)", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 } }, "TOTAL"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 900, color: "white" } }, fmt(grandTotal)))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10, padding: "8px 12px", borderRadius: 8, background: doc.sinBonifMO ? "#fef3c7" : "#f8fafc", border: "1px solid " + (doc.sinBonifMO ? "#fbbf24" : "#e5e7eb") } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11.5, fontWeight: 600, color: doc.sinBonifMO ? "#92400e" : "#6b7280" } }, doc.sinBonifMO ? "\u26A0\uFE0F Este presupuesto cobra M.O. a 50\u20AC/h (sin bonificaci\xF3n)" : "M.O. bonificada -50% \u2192 25\u20AC/h (por defecto)"), /* @__PURE__ */ React.createElement("button", { onClick: () => saveDoc({ ...doc, sinBonifMO: !doc.sinBonifMO }), title: "Aplica solo a este presupuesto. No cambia el documento salvo quitar la columna bonificada.", style: { marginLeft: "auto", cursor: "pointer", fontSize: 11.5, fontWeight: 700, color: "white", background: doc.sinBonifMO ? "#0F1B2E" : "#b45309", border: "none", borderRadius: 7, padding: "6px 12px" } }, doc.sinBonifMO ? "\u21A9 Restaurar bonificaci\xF3n" : "Eliminar bonificaci\xF3n del 50% de M.O.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 12, overflowX: "auto", paddingBottom: 2 } }, CATS.map((c) => {
      const count = c.id === "piezas" ? (doc.piezas || []).length : c.id === "resumen" || c.id === "historial" ? null : (doc[c.id] || []).length;
      return /* @__PURE__ */ React.createElement("button", { key: c.id, onClick: () => setTab(c.id), style: { flexShrink: 0, padding: "7px 9px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 10, fontWeight: 700, background: tab === c.id ? c.accent : "white", color: tab === c.id ? "white" : "#374151", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" } }, c.label, count > 0 && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 3, background: tab === c.id ? "rgba(255,255,255,0.25)" : c.accent, color: "white", fontSize: 9, padding: "1px 4px", borderRadius: 7 } }, count));
    })), tab === "piezas" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 12 } }, [["form", "\u{1F4DD} A\xF1adir"], ["consulta", "\u{1F4E7} Consulta" + (consultas.length ? " (" + consultas.length + ")" : "")], ["lista", "\u{1F4CB} Lista (" + (doc.piezas || []).length + ")"]].map(([k, label]) => /* @__PURE__ */ React.createElement("button", { key: k, onClick: () => setPiezaSubTab(k), style: { flex: 1, padding: "8px", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 700, background: piezaSubTab === k ? "#0F1B2E" : "#e2e8f0", color: piezaSubTab === k ? "white" : "#374151" } }, label))), piezaSubTab === "form" && /* @__PURE__ */ React.createElement("div", { style: { background: "white", borderRadius: 12, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "#0F1B2E", marginBottom: 12 } }, piezaEditIdx !== null ? "\u270F\uFE0F Editando pieza" : "A\xF1adir pieza"), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("label", { style: L }, "Tipo de da\xF1o"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, maxWidth: 420, flexWrap: "wrap" } }, [["TOTAL", "TOTAL", null, "#dc2626"], ["PARCIAL 50%", "PARCIAL", 50, "#d97706"], ["PARCIAL 30%", "PARCIAL", 30, "#ea580c"]].map(([label, t, pct, activeBg]) => /* @__PURE__ */ React.createElement("button", { key: label, onClick: () => setPiezaForm((p) => ({ ...p, tipo: t, parcialPct: pct != null ? pct : p.parcialPct })), style: { flex: 1, border: "none", padding: "8px 0", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700, background: (t === "TOTAL" && piezaForm.tipo === "TOTAL") || (t === "PARCIAL" && piezaForm.tipo === "PARCIAL" && (piezaForm.parcialPct || 50) === pct) ? activeBg : "#f3f4f6", color: (t === "TOTAL" && piezaForm.tipo === "TOTAL") || (t === "PARCIAL" && piezaForm.tipo === "PARCIAL" && (piezaForm.parcialPct || 50) === pct) ? "white" : "#374151" } }, label)))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("label", { style: L }, "Descuento sobre PVR"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, maxWidth: 420, flexWrap: "wrap" } }, [[40, "#7c3aed"], [20, "#0891b2"], [15, "#0d9488"]].map(([dpct, activeBg]) => /* @__PURE__ */ React.createElement("button", { key: dpct, onClick: () => setPiezaForm((p) => ({ ...p, descuentoPct: (parseFloat(p.descuentoPct) || 0) === dpct ? 0 : dpct })), style: { flex: 1, border: "none", padding: "8px 0", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700, background: (parseFloat(piezaForm.descuentoPct) || 0) === dpct ? activeBg : "#f3f4f6", color: (parseFloat(piezaForm.descuentoPct) || 0) === dpct ? "white" : "#374151" } }, "APLICAR DESCUENTO " + dpct + "%")))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10, position: "relative" } }, /* @__PURE__ */ React.createElement("label", { style: L }, "Pieza / Descripci\xF3n"), /* @__PURE__ */ React.createElement("input", { value: piezaForm.pieza, onChange: (e) => handlePiezaChange(e.target.value), onBlur: () => setTimeout(() => setShowPiSug(false), 150), placeholder: "Ej: Embellecedor der. cab. Fiat B549", style: S }), showPiSug && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1px solid #e5e7eb", borderRadius: 8, zIndex: 50, boxShadow: "0 4px 12px rgba(0,0,0,0.12)", overflow: "hidden" } }, piSugs.map((s, si) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: s.label || si,
        onClick: () => {
          setPiezaForm((p) => ({
            ...p,
            pieza: s.label || "",
            codigo: s.codigo || p.codigo,
            proveedor: s.proveedor || p.proveedor,
            horas: s.horas != null ? String(s.horas) : String(piezaMemory[s.label]?.horas || ""),
            pvrProveedor: s.pvr != null ? String(s.pvr) : p.pvrProveedor,
            notas: s.notas || piezaMemory[s.label]?.notas || p.notas
          }));
          setShowPiSug(false);
          if (s.horas != null || s.pvr != null) showToast2("\u2726 " + (s.fromRecambios ? "desde Recambios (PVR oficial)" : s.fromRepo ? "desde repositorio" : "desde memoria") + ".");
        },
        style: { padding: "9px 12px", cursor: "pointer", fontSize: 12, borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", gap: 8 },
        onMouseEnter: (e) => e.currentTarget.style.background = "#f0f9ff",
        onMouseLeave: (e) => e.currentTarget.style.background = "white"
      },
      /* @__PURE__ */ React.createElement("span", { style: { minWidth: 0 } }, s.label, s.codigo ? /* @__PURE__ */ React.createElement("span", { style: { color: "#9ca3af", marginLeft: 6, fontSize: 10 } }, s.codigo) : null, s.notas ? /* @__PURE__ */ React.createElement("span", { style: { display: "block", color: "#6b7280", fontSize: 10.5, fontStyle: "italic", marginTop: 1 } }, "\u{1F4DD} ", s.notas) : null),
      /* @__PURE__ */ React.createElement("span", { style: { color: s.fromRecambios ? "#3B5BFF" : "#4F6BF6", fontWeight: 700, whiteSpace: "nowrap" } }, s.horas != null ? s.horas + "h" : "", s.pvr != null ? " \xB7 " + s.pvr + "\u20AC" : "", s.fromRecambios ? " \u25B8recambios" : s.fromRepo ? " \u25B8repo" : "")
    )))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 2, minWidth: 160 } }, /* @__PURE__ */ React.createElement("label", { style: L }, "Proveedor"), /* @__PURE__ */ React.createElement(
      "input",
      {
        list: "proveedores-list",
        value: piezaForm.proveedor,
        onChange: (e) => pf("proveedor", e.target.value),
        placeholder: "Ej: Benimar, Roller Team, Romisa...",
        style: S
      }
    ), /* @__PURE__ */ React.createElement("datalist", { id: "proveedores-list" }, proveedoresUsados.map((p) => /* @__PURE__ */ React.createElement("option", { key: p, value: p })))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 90 } }, /* @__PURE__ */ React.createElement("label", { style: L }, "Horas M.O."), /* @__PURE__ */ React.createElement("input", { type: "number", min: "0", step: "0.25", value: piezaForm.horas, onChange: (e) => pf("horas", e.target.value), placeholder: "0", style: S })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 140 } }, /* @__PURE__ */ React.createElement("label", { style: L }, "PVR confirmado (s/IVA) \u20AC"), /* @__PURE__ */ React.createElement("input", { type: "number", min: "0", step: "0.01", value: piezaForm.pvrProveedor, onChange: (e) => pf("pvrProveedor", e.target.value), placeholder: "0,00", style: { ...S, background: piezaForm.pvrProveedor ? "#f0fdf4" : "white", borderColor: piezaForm.pvrProveedor ? "#86efac" : "#d1d5db" } })), /* @__PURE__ */ React.createElement("div", { style: { flex: 2, minWidth: 140 } }, /* @__PURE__ */ React.createElement("label", { style: L }, "Notas"), /* @__PURE__ */ React.createElement("input", { value: piezaForm.notas, onChange: (e) => pf("notas", e.target.value), placeholder: "Observaciones", style: S }))), piezaForm.horas && piezaForm.pvrProveedor && /* @__PURE__ */ React.createElement("div", { style: { background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "11px 13px", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "#0369a1", marginBottom: 8, textTransform: "uppercase" } }, "Vista previa \u2014 ", piezaForm.tipo === "PARCIAL" ? "PVR \xD7 " + (piezaForm.parcialPct || 50) + "%" : "PVR completo", (parseFloat(piezaForm.descuentoPct) || 0) > 0 ? " \u2212 desc. " + (parseFloat(piezaForm.descuentoPct) || 0) + "%" : ""), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(80px,1fr))", gap: 8 } }, [["PVR s/IVA", fmt(calcPrev.pvrEfectivo)], ["M.O. s/IVA", fmt(calcPrev.moAlquiler)], ["IVA 21%", fmt((calcPrev.pvrEfectivo + calcPrev.moAlquiler) * IVA)]].map(([lbl, val]) => /* @__PURE__ */ React.createElement("div", { key: lbl, style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", marginBottom: 1 } }, lbl), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600 } }, val))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", background: "#0F1B2E", borderRadius: 7, padding: "5px 3px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, color: "rgba(255,255,255,0.7)", fontWeight: 700, textTransform: "uppercase", marginBottom: 1 } }, "TOTAL"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: "white" } }, fmt(calcPrev.total))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => commitPieza(false), style: { background: canAddPieza ? "#0F1B2E" : "#9ca3af", color: "white", border: "none", padding: "10px 20px", borderRadius: 8, cursor: canAddPieza ? "pointer" : "default", fontSize: 13, fontWeight: 700 } }, piezaEditIdx !== null ? "\u{1F4BE} Guardar cambios" : "+ A\xF1adir pieza"), /* @__PURE__ */ React.createElement("button", { onClick: () => commitPieza(true), style: { background: canDraftPieza ? "#f59e0b" : "#d1d5db", color: canDraftPieza ? "white" : "#9ca3af", border: "none", padding: "10px 16px", borderRadius: 8, cursor: canDraftPieza ? "pointer" : "default", fontSize: 13, fontWeight: 700 } }, "\u{1F4CB} Borrador"), piezaEditIdx !== null && /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setPiezaEditIdx(null);
      setPiezaForm(EMPTY_PIEZA);
    }, style: { background: "#f3f4f6", border: "none", padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 } }, "Cancelar"))), piezaSubTab === "consulta" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#1e40af" } }, /* @__PURE__ */ React.createElement("b", null, "Flujo Benimar:"), " a\xF1ad\xED piezas \u2192 copi\xE1 el email \u2192 cuando Martina confirme, puls\xE1 ", /* @__PURE__ */ React.createElement("b", null, '"\u2713 Recib\xED PVR"'), "."), /* @__PURE__ */ React.createElement("div", { style: { background: "white", borderRadius: 12, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 3, minWidth: 180 } }, /* @__PURE__ */ React.createElement("label", { style: L }, "Pieza"), /* @__PURE__ */ React.createElement("input", { value: consultaForm.pieza, onChange: (e) => cf("pieza", e.target.value), placeholder: "Descripci\xF3n", style: S })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 140 } }, /* @__PURE__ */ React.createElement("label", { style: L }, "Tipo"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5 } }, ["TOTAL", "PARCIAL"].map((t) => /* @__PURE__ */ React.createElement("button", { key: t, onClick: () => cf("tipo", t), style: { flex: 1, border: "none", padding: "8px 0", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700, background: consultaForm.tipo === t ? t === "TOTAL" ? "#dc2626" : "#d97706" : "#f3f4f6", color: consultaForm.tipo === t ? "white" : "#374151" } }, t)))), /* @__PURE__ */ React.createElement("div", { style: { flex: 2, minWidth: 140 } }, /* @__PURE__ */ React.createElement("label", { style: L }, "Notas"), /* @__PURE__ */ React.createElement("input", { value: consultaForm.notas, onChange: (e) => cf("notas", e.target.value), placeholder: "Observaciones", style: S }))), /* @__PURE__ */ React.createElement("button", { onClick: handleAddConsulta, style: { background: "#4F6BF6", color: "white", border: "none", padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "+ A\xF1adir a consulta")), consultas.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { background: "white", borderRadius: 12, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "#0F1B2E", marginBottom: 10 } }, "Pendientes (", consultas.length, ")"), consultas.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.id, style: { border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", marginBottom: 7, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 13 } }, c.pieza), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#6b7280" } }, "AC ", c.ac || "", c.matricula ? " \xB7 " + c.matricula : "", " \xB7 ", /* @__PURE__ */ React.createElement("span", { style: { background: c.tipo === "TOTAL" ? "#fee2e2" : "#fef9c3", color: c.tipo === "TOTAL" ? "#991b1b" : "#854d0e", padding: "1px 5px", borderRadius: 5, fontWeight: 700 } }, c.tipo))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => handlePvrReceived(c), style: { background: "#16a34a", color: "white", border: "none", padding: "7px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 700 } }, "\u2713 Recib\xED PVR"), /* @__PURE__ */ React.createElement("button", { onClick: () => handleRemoveConsulta(c.id), style: { background: "none", border: "1px solid #fca5a5", color: "#dc2626", padding: "7px 10px", borderRadius: 7, cursor: "pointer", fontSize: 12 } }, "\u2715")))), /* @__PURE__ */ React.createElement("textarea", { value: emailBody, readOnly: true, rows: Math.max(8, consultas.length * 4 + 5), style: { width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: 10, fontSize: 11, fontFamily: "monospace", resize: "vertical", boxSizing: "border-box", background: "#fafafa", marginTop: 10 } }), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      navigator.clipboard.writeText(emailBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
      showToast2("Email copiado.");
    }, style: { marginTop: 7, background: copied ? "#16a34a" : "#0F1B2E", color: "white", border: "none", padding: "8px 16px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 700 } }, copied ? "\u2713 Copiado" : "Copiar email"))), piezaSubTab === "lista" && /* @__PURE__ */ React.createElement("div", { style: { background: "white", borderRadius: 12, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "#0F1B2E", marginBottom: 10, textTransform: "uppercase" } }, "Piezas (", (doc.piezas || []).length, ")"), !(doc.piezas || []).length ? /* @__PURE__ */ React.createElement("div", { style: { color: "#9ca3af", fontSize: 12, padding: "20px 0", textAlign: "center" } }, "Sin piezas a\xFAn.") : (doc.piezas || []).map((r, i) => /* @__PURE__ */ React.createElement("div", { key: r.id || i, style: { border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", marginBottom: 8, background: r.draft ? "#fffbeb" : "white" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6 } }, /* @__PURE__ */ React.createElement("div", null, r.draft && /* @__PURE__ */ React.createElement("span", { style: { background: "#fde68a", color: "#92400e", fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 5, marginRight: 6 } }, "PENDIENTE PVR"), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 13 } }, r.pieza), /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 8, background: r.tipo === "TOTAL" ? "#fee2e2" : "#fef9c3", color: r.tipo === "TOTAL" ? "#991b1b" : "#854d0e", padding: "1px 6px", borderRadius: 6, fontSize: 10, fontWeight: 700 } }, r.tipo), r.proveedor && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 8, background: "#e0f2fe", color: "#075985", padding: "1px 6px", borderRadius: 6, fontSize: 10, fontWeight: 600 } }, r.proveedor), r.notas && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 8, fontSize: 11, color: "#6b7280" } }, r.notas)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 800, color: "#0F1B2E", fontSize: 14 } }, r.draft ? "Pendiente" : fmt(piezaTotalEff(doc, r))), /* @__PURE__ */ React.createElement("button", { onClick: () => handleEditPieza(i), style: { background: "none", border: "none", cursor: "pointer", fontSize: 13 } }, "\u270F\uFE0F"), /* @__PURE__ */ React.createElement("button", { onClick: () => handleDeletePieza(i), style: { background: "none", border: "1px solid #fca5a5", borderRadius: 6, cursor: "pointer", fontSize: 12, padding: "2px 6px", color: "#dc2626" } }, "\u{1F5D1}\uFE0F"))), !r.draft && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, fontSize: 11, color: "#6b7280", marginTop: 5, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", null, "PVR: ", fmt(r.pvrEfectivo)), /* @__PURE__ */ React.createElement("span", null, "M.O.: ", fmt((parseFloat(r.horas) || 0) * (doc.sinBonifMO ? MO_TARIFA : MO_RATE)))))), st.piezas > 0 && /* @__PURE__ */ React.createElement("div", { style: { background: "#0F1B2E", color: "white", borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", marginTop: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700 } }, "Subtotal Piezas AC"), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 800, fontSize: 16 } }, fmt(st.piezas))))), CATS.filter((c) => c.id !== "piezas" && c.id !== "resumen" && c.id !== "historial" && c.id !== "repositorio").map((cat) => tab === cat.id && /* @__PURE__ */ React.createElement(ExtraTab, { key: cat.id, cat, items: doc[cat.id] || [], memory: extraMemory[cat.id] || {}, onUpdate: (items, mem) => handleExtraUpdate(cat.id, items, mem), showToast: showToast2 })), tab === "repositorio" && /* @__PURE__ */ React.createElement(RepositoryTab, { repo, onSave: saveRepo, showToast: showToast2, onPopulateFromHistory: handlePopulateRepoFromHistory, historyCount: history.length }), tab === "resumen" && /* @__PURE__ */ React.createElement("div", null, preview ? /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { background: "#dcfce7", border: "1px solid #86efac", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#166534", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("span", null, "\u2705 ", /* @__PURE__ */ React.createElement("b", null, "Presupuesto emitido"), " \u2014 ", doc.emittedAt ? new Date(doc.emittedAt).toLocaleDateString("es-ES") : ""), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => downloadHTML(doc, st, grandTotal), style: { background: "#16a34a", color: "white", border: "none", padding: "8px 16px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 700 } }, "\u2B07\uFE0F Descargar HTML / PDF"), /* @__PURE__ */ React.createElement("button", { onClick: handleNewDocConfirm, style: { background: "#0F1B2E", color: "white", border: "none", padding: "8px 16px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 700 } }, "\u2795 Nueva cuantificaci\xF3n"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      const d = { ...doc, emitted: false, emittedAt: null };
      setDoc(d);
      saveDoc(d);
      setPreview(false);
    }, style: { background: "#f3f4f6", border: "1px solid #d1d5db", color: "#374151", padding: "8px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12 } }, "\u270F\uFE0F Reabrir"))), /* @__PURE__ */ React.createElement(DocPreview, { d: doc })) : /* @__PURE__ */ React.createElement("div", { style: { background: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: "#0F1B2E", marginBottom: 14 } }, "\u{1F4CB} Resumen del documento"), /* @__PURE__ */ React.createElement("div", { style: { background: "#f8fafc", borderLeft: "4px solid #0F1B2E", padding: "10px 14px", borderRadius: 4, marginBottom: 16, fontSize: 12 } }, /* @__PURE__ */ React.createElement("b", null, "Veh\xEDculo:"), " AC ", doc.vehicle.ac || "\u2014", doc.vehicle.matricula ? " \xB7 " + doc.vehicle.matricula : "", doc.vehicle.bastidor ? " \xB7 VIN: " + doc.vehicle.bastidor : ""), [
      { id: "piezas", label: "\u{1F527} Piezas AC", accent: "#0F1B2E", total: st.piezas, items: (doc.piezas || []).filter((r) => !r.draft), getLabel: (r) => r.pieza, getPrice: (r) => r.total },
      ...CATS.filter((c) => c.id !== "piezas" && c.id !== "resumen" && c.id !== "historial" && c.id !== "repositorio").map((c) => ({ ...c, total: st[c.id], items: doc[c.id] || [], getLabel: (r) => r.descripcion, getPrice: (r) => r.precioConIva }))
    ].filter((cat) => cat.items.length > 0).map((cat) => /* @__PURE__ */ React.createElement("div", { key: cat.id, style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: cat.accent, color: "white", borderRadius: "12px 12px 0 0" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 12 } }, cat.label), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 800, fontSize: 14 } }, fmt(cat.total))), cat.items.map((item, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", padding: "7px 12px", background: i % 2 === 0 ? "#f8fafc" : "white", fontSize: 12, borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #f1f5f9" } }, /* @__PURE__ */ React.createElement("span", null, cat.getLabel(item)), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600 } }, fmt(cat.getPrice(item))))))), grandTotal > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", padding: "9px 12px", background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", null, "\u{1F4CB} Gesti\xF3n administrativa (\xBDh M.O. + IVA)"), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700 } }, fmt(st.admin))), /* @__PURE__ */ React.createElement("div", { style: { background: "linear-gradient(135deg,#0F1B2E,#4F6BF6)", color: "white", borderRadius: 10, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700 } }, "TOTAL DE REPARACIONES"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 28, fontWeight: 900 } }, fmt(grandTotal))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, padding: "10px 14px", background: "#fffbeb", border: "1px solid #fde047", borderRadius: 8, fontSize: 12, color: "#92400e" } }, "\u26A0\uFE0F Presupuesto ", /* @__PURE__ */ React.createElement("b", null, "abierto"), ". Emitilo cuando todos los \xEDtems sean definitivos."), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmEmit(true), style: { marginTop: 12, background: "#0F1B2E", color: "white", border: "none", padding: "13px 28px", borderRadius: 9, cursor: "pointer", fontSize: 15, fontWeight: 800, width: "100%" } }, "\u2705 Emitir presupuesto definitivo"), confirmEmit && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 9, padding: "14px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 13, color: "#92400e", marginBottom: 8 } }, "\u26A0\uFE0F \xBFConfirmar emisi\xF3n? El presupuesto quedar\xE1 cerrado."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: handleEmitConfirm, style: { background: "#16a34a", color: "white", border: "none", padding: "10px 22px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 800 } }, "\u2705 S\xED, emitir"), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmEmit(false), style: { background: "#f3f4f6", border: "none", padding: "10px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 } }, "Cancelar")))) : /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", color: "#9ca3af", fontSize: 13 } }, "Complet\xE1 las pesta\xF1as de da\xF1os para ver el presupuesto."))), tab === "historial" && /* @__PURE__ */ React.createElement("div", null, historialView ? /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", { onClick: () => setHistorialView(null), style: { background: "#f3f4f6", border: "none", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, marginBottom: 12 } }, "\u2190 Volver al historial"), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => downloadHTML(historialView, docSubtotals(historialView), docGrandTotal(historialView)), style: { background: "#16a34a", color: "white", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "\u2B07\uFE0F Descargar HTML / PDF")), /* @__PURE__ */ React.createElement(DocPreview, { d: historialView })) : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { background: "white", borderRadius: 12, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 800, color: "#0F1B2E", marginBottom: 4 } }, "\u{1F5C4}\uFE0F Respaldos de datos"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#6b7280", marginBottom: 12 } }, "Los datos se guardan en el navegador pero pueden perderse si se borra la cach\xE9. ", /* @__PURE__ */ React.createElement("b", null, "Export\xE1 un respaldo JSON peri\xF3dicamente.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ (window.acllarEsAdmin && window.acllarEsAdmin()) && React.createElement("button", { onClick: handleExportBackup, style: { background: "#0F1B2E", color: "white", border: "none", padding: "10px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "\u{1F4E5} Exportar respaldo (.json)"), /* @__PURE__ */ React.createElement("label", { style: { background: "#f3f4f6", border: "1px solid #d1d5db", color: "#374151", padding: "10px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "\u{1F4E4} Importar respaldo", /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".json", onChange: handleImportBackup, style: { display: "none" } })), /* @__PURE__ */ React.createElement("label", { style: { background: "#ecfdf5", border: "1px solid #6ee7b7", color: "#065f46", padding: "10px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "\u{1F517} Combinar respaldo", /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".json", onChange: handleMergeBackup, style: { display: "none" } }))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, fontSize: 11, color: "#059669", lineHeight: 1.5 } }, /* @__PURE__ */ React.createElement("b", null, "Importar"), " reemplaza todo el historial por el del archivo. ", /* @__PURE__ */ React.createElement("b", null, "Combinar"), " suma los presupuestos del archivo a los que ya ten\xE9s, sin duplicar."), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, fontSize: 11, color: "#9ca3af" } }, "Incluye: documento actual \xB7 historial completo \xB7 memoria de piezas y precios.")), /* @__PURE__ */ React.createElement("div", { style: { background: "white", borderRadius: 12, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 12, textTransform: "uppercase" } }, "Presupuestos guardados (", history.length, ")"), history.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { position: "relative", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#9ca3af" } }, "\u{1F50D}"), /* @__PURE__ */ React.createElement("input", { value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Buscar por AC, matr\xEDcula, pieza, proveedor, fecha...", style: { ...S, paddingLeft: 32, background: "#f8fafc" } }), searchQuery && /* @__PURE__ */ React.createElement("button", { onClick: () => setSearchQuery(""), style: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#9ca3af" } }, "\u2715")), searchQuery && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#6b7280", marginBottom: 10 } }, filteredHistory.length === 0 ? "Sin resultados para \xAB" + searchQuery + "\xBB" : filteredHistory.length + " resultado" + (filteredHistory.length > 1 ? "s" : "")), history.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { color: "#9ca3af", fontSize: 12, padding: "20px 0", textAlign: "center" } }, "A\xFAn no hay presupuestos. Se guardan al emitir o al iniciar nueva cuantificaci\xF3n.") : filteredHistory.length === 0 && searchQuery ? /* @__PURE__ */ React.createElement("div", { style: { color: "#9ca3af", fontSize: 12, padding: "20px 0", textAlign: "center" } }, "No se encontraron coincidencias.") : filteredHistory.map((h, i) => {
      const realIdx = history.indexOf(h);
      const matchedPiezas = searchQuery ? (h.piezas || []).filter((r) => (r.pieza + " " + (r.notas || "")).toLowerCase().includes(searchQuery.toLowerCase())) : [];
      const matchedExtras = searchQuery ? EXTRA_CATS.flatMap((k) => (h[k] || []).filter((x) => (x.descripcion + " " + (x.proveedor || "")).toLowerCase().includes(searchQuery.toLowerCase())).map((x) => ({ ...x, _cat: k }))) : [];
      return /* @__PURE__ */ React.createElement("div", { key: h.id || i, style: { border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 13 } }, "AC ", highlightMatch(h.vehicle?.ac || "\u2014", searchQuery), " \xB7 ", highlightMatch(h.vehicle?.matricula || "sin matr\xEDcula", searchQuery)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "#6b7280", marginTop: 2 } }, highlightMatch(h.fecha, searchQuery), " \xB7 ", highlightMatch(h.vehicle?.marca || "", searchQuery), h.emittedAt ? " \xB7 Emitido: " + new Date(h.emittedAt).toLocaleDateString("es-ES") : "", h.id ? /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 8, color: "#9ca3af" } }, "ID: ", h.id) : null), (matchedPiezas.length > 0 || matchedExtras.length > 0) && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 5, display: "flex", flexWrap: "wrap", gap: 4 } }, matchedPiezas.map((r, j) => /* @__PURE__ */ React.createElement("span", { key: j, style: { background: "#dbeafe", color: "#1d4ed8", fontSize: 10, padding: "2px 7px", borderRadius: 6 } }, "\u{1F527} ", highlightMatch(r.pieza, searchQuery))), matchedExtras.map((x, j) => /* @__PURE__ */ React.createElement("span", { key: j, style: { background: "#f3e8ff", color: "#7c3aed", fontSize: 10, padding: "2px 7px", borderRadius: 6 } }, "\u{1F4E6} ", highlightMatch(x.descripcion, searchQuery))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 800, color: "#0F1B2E", fontSize: 15 } }, fmt(docGrandTotal(h))), /* @__PURE__ */ React.createElement("button", { onClick: () => setHistorialView(sanitizeDoc(h)), style: { background: "#0F1B2E", color: "white", border: "none", padding: "6px 12px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "Ver"), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmDeleteIdx(realIdx), style: { background: "none", border: "1px solid #fca5a5", color: "#dc2626", padding: "6px 10px", borderRadius: 7, cursor: "pointer", fontSize: 11 } }, "\u{1F5D1}\uFE0F"))), confirmDeleteIdx === realIdx && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, background: "#fff1f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#991b1b", fontWeight: 600, marginBottom: 8 } }, "\u26A0\uFE0F \xBFEliminar este presupuesto del historial?"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: handleDeleteHistoryConfirm, style: { background: "#dc2626", color: "white", border: "none", padding: "7px 16px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 700 } }, "S\xED, eliminar"), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmDeleteIdx(null), style: { background: "#f3f4f6", border: "none", padding: "7px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12 } }, "Cancelar"))));
    })))));
  }
  const STAT_PALETTE = ["#3B5BFF", "#1E4D2E", "#B45309", "#7c3aed", "#0891b2", "#475569", "#dc2626", "#0f766e", "#6b7280", "#854d0e"];
  const StatPanel = ({ title, subtitle, children, span }) => /* @__PURE__ */ React.createElement("div", { style: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: "12px",
    padding: "16px 18px",
    gridColumn: span ? `span ${span}` : "auto"
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", fontWeight: 700, color: T.ink, fontFamily: F.display, marginBottom: subtitle ? "2px" : "12px" } }, title), subtitle && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkSoft, marginBottom: "12px" } }, subtitle), children);
  const BarRank = ({ data, max, unit, money }) => {
    const top = max || Math.max(1, ...data.map((d) => d.value));
    if (data.length === 0) return /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkFaint, fontStyle: "italic" } }, "Sin datos todav\xEDa.");
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "7px" } }, data.map((d, i) => /* @__PURE__ */ React.createElement("div", { key: d.label, style: { display: "flex", alignItems: "center", gap: "10px" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "38%", fontSize: "11.5px", color: T.ink, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, title: d.label }, d.label), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, background: T.bgAlt, borderRadius: "8px", height: "18px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${d.value / top * 100}%`, background: d.color || STAT_PALETTE[i % STAT_PALETTE.length], height: "100%", borderRadius: "8px", transition: "width 300ms", minWidth: d.value > 0 ? "2px" : 0 } })), /* @__PURE__ */ React.createElement("div", { style: { width: "52px", fontSize: "11.5px", fontWeight: 700, color: T.ink, textAlign: "right", fontFamily: F.mono } }, money ? fmtMoney(d.value) : d.value, unit && !money ? unit : ""))));
  };
  const Donut = ({ data, size = 130 }) => {
    const total = data.reduce((s, d) => s + d.value, 0);
    if (total === 0) return /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkFaint, fontStyle: "italic" } }, "Sin datos todav\xEDa.");
    const r = size / 2, cx = r, cy = r, stroke = size * 0.22, radius = r - stroke / 2;
    const circ = 2 * Math.PI * radius;
    let offset = 0;
    const segs = data.map((d, i) => {
      const frac = d.value / total;
      const seg = { ...d, frac, dash: frac * circ, offset: offset * circ, color: d.color || STAT_PALETTE[i % STAT_PALETTE.length] };
      offset += frac;
      return seg;
    });
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("svg", { width: size, height: size, style: { transform: "rotate(-90deg)", flexShrink: 0 } }, segs.map((s) => /* @__PURE__ */ React.createElement(
      "circle",
      {
        key: s.label,
        cx,
        cy,
        r: radius,
        fill: "none",
        stroke: s.color,
        strokeWidth: stroke,
        strokeDasharray: `${s.dash} ${circ - s.dash}`,
        strokeDashoffset: -s.offset
      }
    )), /* @__PURE__ */ React.createElement("circle", { cx, cy, r: radius - stroke / 2 - 2, fill: T.surface })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "5px" } }, segs.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.label, style: { display: "flex", alignItems: "center", gap: "7px", fontSize: "11.5px" } }, /* @__PURE__ */ React.createElement("span", { style: { width: "10px", height: "10px", borderRadius: "8px", background: s.color, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { color: T.ink } }, s.label), /* @__PURE__ */ React.createElement("span", { style: { color: T.inkSoft, fontFamily: F.mono } }, s.value, " (", Math.round(s.frac * 100), "%)")))));
  };
  const TrendBars = ({ data, money, unit }) => {
    const top = Math.max(1, ...data.map((d) => d.value));
    if (data.length === 0) return /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkFaint, fontStyle: "italic" } }, "Sin datos todav\xEDa.");
    const showVal = (v) => money ? fmtMoney(v) : unit ? `${String(v).replace(".", ",")} ${unit}` : v;
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: "6px", height: "140px", paddingTop: "10px" } }, data.map((d) => /* @__PURE__ */ React.createElement("div", { key: d.label, style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", fontWeight: 700, color: T.ink, fontFamily: F.mono } }, d.value > 0 ? showVal(d.value) : ""), /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: "44px", background: T.rust, height: `${d.value / top * 100}%`, minHeight: d.value > 0 ? "3px" : 0, borderRadius: "8px 8px 0 0", transition: "height 300ms" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "9.5px", color: T.inkSoft, whiteSpace: "nowrap" } }, d.label))));
  };
  const fmtMoney = (n) => (n || 0).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "\u20AC";
  const fmtDur = (horas) => {
    if (horas === null || horas === void 0 || isNaN(horas)) return "\u2014";
    const val = horas < 10 ? horas.toFixed(1).replace(".", ",") : String(Math.round(horas));
    return `${val} h`;
  };
const fmtFechaHora = (valor) => {
  if (!valor) return "—";

  const d = new Date(valor);

  if (isNaN(d.getTime())) return "—";

  return d.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
  const RECAMBIO_ESTADOS = {
    por_pedir: { label: "Por pedir", color: "#B45309", bg: "#FEF3C7" },
    pedido: { label: "Pedido", color: "#1D4ED8", bg: "#DBEAFE" },
    recibido: { label: "Recibido", color: "#15803D", bg: "#DCFCE7" }
  };
  const normZona = (s) => (s || "").toLowerCase().trim().replace(/\s+/g, " ");
  const MARCAS_PREFIJO = ["benimar", "roller team", "roller", "mc louis", "mclouis", "mc-louis"];
  const normModelo = (s) => {
    let m = (s || "").toLowerCase().trim().replace(/\s+/g, " ");
    for (const marca of MARCAS_PREFIJO) {
      if (m.startsWith(marca + " ")) {
        m = m.slice(marca.length).trim();
        break;
      }
    }
    return m;
  };
  // Corte de temporada: AC-315 y superiores = 2026. AC-314 y anteriores = legacy (temporadas previas).
  // Esto evita que se crucen piezas entre Roller Team Kronos 277/279/298 de años distintos.
  // Vehículos CB-xxx (Alicante) van en su propia banda para no mezclarlos con la flota AC.
  const seasonOf = (ac) => {
    const s = String(ac || "").toUpperCase().trim();
    const mAc = s.match(/^AC-?(\d+)/);
    if (mAc) return parseInt(mAc[1], 10) >= 315 ? "2026" : "legacy";
    const mCb = s.match(/^([A-Z]+)/);
    return mCb ? mCb[1].toLowerCase() : "otro";
  };
  const acMemKey = (ac, zona) => `ac:${(ac || "").toUpperCase()}|zona:${normZona(zona)}`;
  const modeloMemKey = (modelo, zona, season) => `modelo:${normModelo(modelo)}|zona:${normZona(zona)}|season:${season || "unk"}`;
  const entryParts = (entry) => {
    if (!entry) return [];
    if (Array.isArray(entry.piezas)) return entry.piezas.filter((p) => p && (p.codigo || p.descripcion || p.notas));
    if (entry.codigo || entry.descripcion || entry.notas) {
      return [{ codigo: entry.codigo || "", descripcion: entry.descripcion || "", notas: entry.notas || "" }];
    }
    return [];
  };
  const lookupPartMemory = (memory, ac, modelo, zona) => {
    if (!memory || !zona) return null;
    const byAc = entryParts(memory[acMemKey(ac, zona)]);
    if (byAc.length && byAc[0].codigo) return { ...byAc[0], via: "ac" };
    const byModelo = entryParts(memory[modeloMemKey(modelo, zona, seasonOf(ac))]);
    if (byModelo.length && byModelo[0].codigo) return { ...byModelo[0], via: "modelo" };
    // Nota: ya NO se consultan claves de modelo sin temporada (legacy). Evita cruzar años.
    return null;
  };
  // Autollenado SOLO por modelo (otras AC del mismo modelo+temporada). NUNCA mira
  // la memoria de la propia AC, para no "autodetectarse a sí misma" ni marcar
  // "este AC". Se usa en la auto-materialización de Recambios.
  const lookupPartMemoryModelo = (memory, ac, modelo, zona) => {
    if (!memory || !zona) return null;
    const byModelo = entryParts(memory[modeloMemKey(modelo, zona, seasonOf(ac))]);
    if (byModelo.length && byModelo[0].codigo) return { ...byModelo[0], via: "modelo" };
    return null;
  };
  const lookupAllPartMemory = (memory, ac, modelo, zona) => {
    if (!memory || !zona) return [];
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    const push = (parts, via) => {
      for (const p of parts) {
        const key = (p.codigo || "").trim().toUpperCase() || `__${p.descripcion}__${p.notas}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ codigo: p.codigo || "", descripcion: p.descripcion || "", notas: p.notas || "", via });
      }
    };
    push(entryParts(memory[acMemKey(ac, zona)]), "ac");
    push(entryParts(memory[modeloMemKey(modelo, zona, seasonOf(ac))]), "modelo");
    // Legacy sin temporada intencionalmente omitido.
    return out.filter((p) => p.codigo || p.descripcion || p.notas);
  };

  // ========================================================================
  // COMPARATIVA AÑO CONTRA AÑO (YoY) — Solo Valencia
  // Parsea Excels de HQ (ingresos por cargo a fianza + reservas devueltas),
  // guarda datos por año, y calcula comparativas semana/mes vs mismo período 2025.
  // ========================================================================

  // Parsea fechas "DD-MM-YYYY" o "DD-MM-YYYY HH:MM" o "DD/MM/YYYY"
  // También acepta Date directo (SheetJS a veces devuelve Date, a veces string).
  const parseFechaEs = (raw) => {
    if (!raw) return null;
    if (raw instanceof Date) return isNaN(raw.getTime()) ? null : raw;
    const s = String(raw).trim();
    if (!s) return null;
    // ISO: 2025-08-14 o 2025-08-14T10:00:00
    let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2}))?/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
    // DD-MM-YYYY o DD/MM/YYYY [HH:MM]
    m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:\s+(\d{1,2}):(\d{1,2}))?/);
    if (m) return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0));
    return null;
  };
  const ymdLocal = (d) => {
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  };

  // Detecta si un array de filas (matriz de celdas) es un Excel de ingresos o de reservas.
  // Ingresos: tiene "Total Entrante" y "Sub Total" en headers.
  // Reservas: tiene "Estatus" y "Sucursal" en headers.
  const detectExcelType = (matrix) => {
    const flat = matrix.slice(0, 5).flat().map((v) => String(v || "").toLowerCase().trim());
    const hasIngresosMarker = flat.some((c) => c === "total entrante") && flat.some((c) => c === "sub total");
    if (hasIngresosMarker) return "ingresos";
    const hasReservasMarker = flat.some((c) => c === "estatus") && flat.some((c) => c === "sucursal");
    if (hasReservasMarker) return "reservas";
    return null;
  };

  // Encuentra la fila de headers reales en un Excel (busca fila con las columnas esperadas).
  const findHeaderRow = (matrix, requiredHeaders) => {
    const req = requiredHeaders.map((h) => h.toLowerCase().trim());
    for (let i = 0; i < Math.min(matrix.length, 10); i++) {
      const row = matrix[i].map((v) => String(v || "").toLowerCase().trim());
      const found = req.every((h) => row.includes(h));
      if (found) return i;
    }
    return -1;
  };

  // Parsea Excel de ingresos por cargo a fianza. Guarda todas las sedes (filtrado se hace en la vista).
  const parseIngresosExcel = (matrix) => {
    const headerRow = findHeaderRow(matrix, ["fecha", "vehículo", "total entrante", "lugar de entrega"]);
    if (headerRow < 0) return { error: 'No encuentro los headers "Fecha", "Vehículo", "Total Entrante", "Lugar de entrega".' };
    const headers = matrix[headerRow].map((v) => String(v || "").toLowerCase().trim());
    const idx = {
      fecha: headers.indexOf("fecha"),
      vehiculo: headers.indexOf("vehículo"),
      sede: headers.indexOf("lugar de entrega"),
      totalEntrante: headers.indexOf("total entrante"),
      subTotal: headers.indexOf("sub total")
    };
    const rows = [];
    const sedesEncontradas = {};
    let descartadasSinFecha = 0;
    for (let i = headerRow + 1; i < matrix.length; i++) {
      const r = matrix[i];
      const fecha = parseFechaEs(r[idx.fecha]);
      // Ignora filas sin fecha (fila de total al final, filas vacías)
      if (!fecha) { descartadasSinFecha++; continue; }
      const sede = String(r[idx.sede] || "").trim();
      sedesEncontradas[sede] = (sedesEncontradas[sede] || 0) + 1;
      const totalEntrante = parseFloat(r[idx.totalEntrante]) || 0;
      rows.push({
        fecha: ymdLocal(fecha),
        vehiculo: String(r[idx.vehiculo] || "").trim(),
        sede,
        totalEntrante,
        subTotal: parseFloat(r[idx.subTotal]) || 0
      });
    }
    return { tipo: "ingresos", rows, descartadas: { sin_fecha: descartadasSinFecha }, sedesEncontradas };
  };

  // Parsea Excel de reservas devueltas. Guarda todas las sedes. Solo filtra por Estatus "Reserva Completada".
  const parseReservasExcel = (matrix) => {
    const headerRow = findHeaderRow(matrix, ["fecha de devolución", "estatus", "lugar de entrega", "vehículo"]);
    if (headerRow < 0) return { error: 'No encuentro los headers "Fecha de devolución", "Estatus", "Lugar de entrega", "Vehículo".' };
    const headers = matrix[headerRow].map((v) => String(v || "").toLowerCase().trim());
    const idx = {
      reservaId: headers.indexOf("#"),
      fechaEntrega: headers.indexOf("fecha de entrega"),
      fechaDev: headers.indexOf("fecha de devolución"),
      estatus: headers.indexOf("estatus"),
      sede: headers.indexOf("lugar de entrega"),
      vehiculo: headers.indexOf("vehículo"),
      cliente: headers.indexOf("cliente")
    };
    const rows = [];
    const sedesEncontradas = {};
    let descartadasPorEstatus = 0;
    let descartadasSinFecha = 0;
    for (let i = headerRow + 1; i < matrix.length; i++) {
      const r = matrix[i];
      const fecha = parseFechaEs(r[idx.fechaDev]);
      if (!fecha) { descartadasSinFecha++; continue; }
      const estatus = String(r[idx.estatus] || "").trim();
      if (estatus.toLowerCase() !== "reserva completada") { descartadasPorEstatus++; continue; }
      const sede = String(r[idx.sede] || "").trim();
      sedesEncontradas[sede] = (sedesEncontradas[sede] || 0) + 1;
      const fEntrega = parseFechaEs(r[idx.fechaEntrega]);
      rows.push({
        reservaId: idx.reservaId >= 0 ? String(r[idx.reservaId] || "").trim() : "",
        fechaEntrega: fEntrega ? fEntrega.toISOString() : null,
        fechaDevolucion: fecha.toISOString(),
        vehiculo: String(r[idx.vehiculo] || "").trim(),
        sede,
        cliente: idx.cliente >= 0 ? String(r[idx.cliente] || "").trim() : ""
      });
    }
    return { tipo: "reservas", rows, descartadas: { por_estatus: descartadasPorEstatus, sin_fecha: descartadasSinFecha }, sedesEncontradas };
  };

  // Detecta el año predominante de los datos parseados.
  const detectYear = (rows, fechaKey) => {
    const counts = {};
    for (const r of rows) {
      const d = new Date(r[fechaKey]);
      if (isNaN(d.getTime())) continue;
      const y = d.getFullYear();
      counts[y] = (counts[y] || 0) + 1;
    }
    let bestYear = null, bestCount = 0;
    for (const [y, c] of Object.entries(counts)) {
      if (c > bestCount) { bestYear = parseInt(y, 10); bestCount = c; }
    }
    return bestYear;
  };

  const dateRange = (rows, fechaKey) => {
    let min = null, max = null;
    for (const r of rows) {
      const d = new Date(r[fechaKey]);
      if (isNaN(d.getTime())) continue;
      if (!min || d < min) min = d;
      if (!max || d > max) max = d;
    }
    return { min, max };
  };

  // Fecha de inicio de Sebastián en el puesto: 18 de mayo de 2026.
  // Usada para calcular acumulados "desde que empezó".
  const SEBASTIAN_START_DATE = new Date(2026, 4, 18);

  // === arrivalLog: helpers ===
  // Cada entrada de arrivalLog es un evento inmutable de "el vehículo X llegó por la reserva Y en el momento Z".
  // Se identifica la reserva por reservaId (código único de HQ, ej. "26 08398 Valencia").
  // Estos eventos NO son modificados por los imports posteriores — protegen los tiempos operativos.
  //
  // Extrae el AC del vehículo desde el campo "vehiculo" del Excel HQ (formato "AC-315 Kronos 279 4763NLH")
  // y devuelve la clave normalizada compatible con matchKey (usada en el informe).
  const acFromHqVehiculo = (vehiculoStr) => {
    const first = String(vehiculoStr || "").trim().split(/\s+/)[0] || "";
    return first.toUpperCase();
  };
  const acMatchKeyGlobal = (id) => {
    const s = String(id || "").toUpperCase().trim();
    const m = s.match(/^(AC|CB)-?(\d+)/);
    return m ? `${m[1]}-${m[2]}` : s;
  };
  // Devuelve la reserva HQ más reciente COMPLETADA para un vehículo,
  // buscando en ambos años (2025 + 2026). Async: lee de storage.
const findHqReservaActual = async (vehicleId) => {
  try {
    const [r2026, r2025] = await Promise.all([
      window.storage.get("ac_yoy_reservas_2026").catch(() => null),
      window.storage.get("ac_yoy_reservas_2025").catch(() => null)
    ]);

    const data2026 = r2026 ? JSON.parse(r2026.value) : null;
    const data2025 = r2025 ? JSON.parse(r2025.value) : null;
    const allRows = [
      ...(data2026?.rows || []),
      ...(data2025?.rows || [])
    ];

    const key = acMatchKeyGlobal(vehicleId);
    const now = Date.now();

    const matching = allRows.filter((r) => {
      if (acMatchKeyGlobal(acFromHqVehiculo(r.vehiculo)) !== key) return false;
      if (!r.fechaDevolucion) return false;
      const d = new Date(r.fechaDevolucion).getTime();
      return Number.isFinite(d) && d <= now;
    });

    matching.sort(
      (a, b) =>
        new Date(b.fechaDevolucion || 0) -
        new Date(a.fechaDevolucion || 0)
    );

    return matching[0] || null;
  } catch (e) {
    console.error("findHqReservaActual:", e);
    return null;
  }
};
  // Busca el evento de llegada registrado en arrivalLog para una reserva concreta.
  // Devuelve null si no existe. Se usa como fuente sagrada de "cuándo llegó realmente".
  const findArrivalEvent = (arrivalLog, vehicleId, reservaId) => {
    if (!Array.isArray(arrivalLog) || !reservaId) return null;
    return arrivalLog.find((e) => e.vehicleId === vehicleId && e.reservaId === reservaId) || null;
  };

  // Calcula las 4 ventanas de comparación a partir de "hoy".
  // Semana en curso: LUNES hasta HOY (para el informe del viernes = lunes a viernes).
  // Semana LY: mismas fechas del calendario en el año anterior.
  // Mes hasta hoy: día 1 hasta hoy.
  // Mes LY: día 1 hasta mismo día del mes en el año anterior.
  const computeYoyWindows = (hoy) => {
    const today = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);
    const dow = (hoy.getDay() + 6) % 7; // 0 = lunes
    const monday = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - dow);
    const mondayLY = new Date(monday.getFullYear() - 1, monday.getMonth(), monday.getDate());
    const todayLY = new Date(hoy.getFullYear() - 1, hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);
    const monthStart = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const monthStartLY = new Date(hoy.getFullYear() - 1, hoy.getMonth(), 1);
    // Semana anterior: lunes-domingo previos
    const prevMonday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() - 7);
    const prevSunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() - 1, 23, 59, 59, 999);
    return {
      semanaAct: { start: monday, end: today, label: "Semana en curso" },
      semanaLY: { start: mondayLY, end: todayLY, label: "Misma semana 2025" },
      semanaPrev: { start: prevMonday, end: prevSunday, label: "Semana anterior" },
      mesAct: { start: monthStart, end: today, label: "Mes hasta hoy" },
      mesLY: { start: monthStartLY, end: todayLY, label: "Mismo período 2025" }
    };
  };

  // Calcula las 3 métricas para una ventana (start-end) dados los datasets parseados.
  // sedeFilter puede ser null (todas) o un string exacto ("Valencia", "Onil", "Castellón").
  const computeYoyMetrics = (ingresosData, reservasData, start, end, sedeFilter) => {
    const norm = (s) => String(s || "").trim().toLowerCase();
    const target = Array.isArray(sedeFilter)
      ? sedeFilter.map(norm)
      : sedeFilter ? norm(sedeFilter) : null;
    const ingresos = ingresosData?.rows || [];
    const inRange = ingresos.filter((r) => {
      const d = new Date(r.fecha);
      if (d < start || d > end) return false;
      if (Array.isArray(target) ? !target.includes(norm(r.sede)) : target && norm(r.sede) !== target) return false;
      return true;
    });
    const reservas = reservasData?.rows || [];
    const devInRange = reservas.filter((r) => {
      const d = new Date(r.fechaDevolucion);
      if (d < start || d > end) return false;
      if (Array.isArray(target) ? !target.includes(norm(r.sede)) : target && norm(r.sede) !== target) return false;
      return true;
    });
    const euros = inRange.reduce((a, r) => a + (r.totalEntrante || 0), 0);
    return {
      euros,
      presupuestos: inRange.length,
      devoluciones: devInRange.length,
      ticketMedio: inRange.length > 0 ? euros / inRange.length : 0,
      topAcs: (() => {
        const map = {};
        for (const r of inRange) {
          const ac = (String(r.vehiculo || "").match(/^(AC-[A-Z0-9]+|CB-[A-Z0-9]+)/) || [null, "?"])[1];
          if (!map[ac]) map[ac] = { ac, euros: 0, count: 0, vehiculo: r.vehiculo };
          map[ac].euros += r.totalEntrante || 0;
          map[ac].count += 1;
        }
        return Object.values(map).sort((a, b) => b.euros - a.euros);
      })(),
      cargosDetalle: inRange.map((r) => ({
        fecha: r.fecha,
        ac: (String(r.vehiculo || "").match(/^(AC-[A-Z0-9]+|CB-[A-Z0-9]+)/) || [null, "?"])[1],
        vehiculo: r.vehiculo,
        totalEntrante: r.totalEntrante
      }))
    };
  };

  // Agrupa por mes (YYYY-MM) y sede: devuelve { "2025-01": { valencia: {euros, count, dev}, onil: {...}, ... }, ... }
  const groupByMonthAndSede = (ingresosData, reservasData) => {
    const norm = (s) => String(s || "").trim().toLowerCase();
    const out = {};
    for (const r of (ingresosData?.rows || [])) {
      const d = new Date(r.fecha);
      if (isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const s = norm(r.sede);
      if (!out[key]) out[key] = {};
      if (!out[key][s]) out[key][s] = { euros: 0, presupuestos: 0, devoluciones: 0 };
      out[key][s].euros += r.totalEntrante || 0;
      out[key][s].presupuestos += 1;
    }
    for (const r of (reservasData?.rows || [])) {
      const d = new Date(r.fechaDevolucion);
      if (isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const s = norm(r.sede);
      if (!out[key]) out[key] = {};
      if (!out[key][s]) out[key][s] = { euros: 0, presupuestos: 0, devoluciones: 0 };
      out[key][s].devoluciones += 1;
    }
    return out;
  };

  const SEDES_HQ = ["Valencia", "Onil", "Castellón"];
  const SEDE_COLORS = { valencia: "#2d5fa6", onil: "#15803D", "castellón": "#A8350F", castellon: "#A8350F" };
  const sedeColor = (s) => SEDE_COLORS[String(s || "").toLowerCase()] || "#5B6B82";

  // Delta: dirección positiva = ingreso/actividad sube (verde), etc.
  const yoyDelta = (cur, prev) => {
    if (prev == null || prev === 0) return { abs: cur, pct: null, dir: cur > 0 ? "up" : "flat" };
    const abs = cur - prev;
    const pct = (abs / prev) * 100;
    const dir = abs > 0 ? "up" : abs < 0 ? "down" : "flat";
    return { abs, pct, dir };
  };

  const fmtEurYoy = (n) => (n || 0).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  const fmtDateShort = (d) => !d ? "—" : `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

  const YOY_STORAGE_KEYS = {
    ingresos2025: "ac_yoy_ingresos_2025",
    ingresos2026: "ac_yoy_ingresos_2026",
    reservas2025: "ac_yoy_reservas_2025",
    reservas2026: "ac_yoy_reservas_2026"
  };

  const RecambioField = ({ value, onChange, placeholder, w, mono }) => /* @__PURE__ */ React.createElement(
    "input",
    {
      value: value || "",
      onChange: (e) => onChange(e.target.value),
      placeholder,
      style: {
        width: w || "100%",
        padding: "5px 8px",
        fontSize: "13px",
        border: `1px solid ${T.border}`,
        borderRadius: "10px",
        background: T.surface,
        color: T.ink,
        fontFamily: mono ? F.mono : "inherit",
        boxSizing: "border-box"
      }
    }
  );
  const RecambioEstadoPicker = ({ part, onUpdatePart }) => /* @__PURE__ */ React.createElement(
    "select",
    {
      value: part.estado,
      onChange: (e) => onUpdatePart(part.id, { estado: e.target.value }),
      style: {
        fontSize: "11px",
        fontWeight: 700,
        padding: "3px 6px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        color: RECAMBIO_ESTADOS[part.estado]?.color,
        background: RECAMBIO_ESTADOS[part.estado]?.bg
      }
    },
    Object.entries(RECAMBIO_ESTADOS).map(([k, v]) => /* @__PURE__ */ React.createElement("option", { key: k, value: k }, v.label))
  );
  const RecambioPartRow = ({ part, showVehicle, onUpdatePart, onDeletePart }) => {
  const piezas = part.piezas && part.piezas.length > 0
    ? part.piezas
    : [{
        id: `${part.id}-legacy`,
        codigo: part.codigo || "",
        descripcion: part.descripcion || "",
        notas: part.notas || "",
        cantidad: part.cantidad ?? 1,
        estado: part.estado || "por_pedir",
        pvrOficial: part.pvrOficial ?? null,
        horasMO: part.horasMO ?? null
      }];

  const actualizarPieza = (piezaId, cambios) => {
    const nuevasPiezas = piezas.map((pieza) =>
      pieza.id === piezaId ? { ...pieza, ...cambios } : pieza
    );

    onUpdatePart(part.id, {
      piezas: nuevasPiezas,
      codigo: nuevasPiezas[0]?.codigo || "",
      descripcion: nuevasPiezas[0]?.descripcion || "",
      notas: nuevasPiezas[0]?.notas || "",
      cantidad: nuevasPiezas[0]?.cantidad ?? 1,
      estado: nuevasPiezas[0]?.estado || "por_pedir"
    });
  };

  const agregarPieza = () => {
    const nuevaPieza = {
      id: `PI-${Date.now()}-${piezas.length}`,
      codigo: "",
      descripcion: "",
      notas: "",
      cantidad: 1,
      estado: "por_pedir",
      pvrOficial: null,
      horasMO: null
    };

    onUpdatePart(part.id, {
      piezas: [...piezas, nuevaPieza]
    });
  };

  const eliminarPieza = (piezaId) => {
    if (piezas.length <= 1) return;

    const nuevasPiezas = piezas.filter((pieza) => pieza.id !== piezaId);

    onUpdatePart(part.id, {
      piezas: nuevasPiezas,
      codigo: nuevasPiezas[0]?.codigo || "",
      descripcion: nuevasPiezas[0]?.descripcion || "",
      notas: nuevasPiezas[0]?.notas || "",
      cantidad: nuevasPiezas[0]?.cantidad ?? 1,
      estado: nuevasPiezas[0]?.estado || "por_pedir"
    });
  };

  return /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        padding: "10px 12px",
        borderBottom: `1px solid ${T.border}`,
        fontSize: "13px"
      }
    },

    /* CABECERA DEL GRUPO DE DAÑO */
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "9px",
          flexWrap: "wrap"
        }
      },

      showVehicle && /* @__PURE__ */ React.createElement(
        "span",
        {
          style: {
            fontWeight: 800,
            color: "#fff",
            background: T.rust,
            fontSize: "11px",
            padding: "2px 7px",
            borderRadius: "10px",
            flexShrink: 0
          }
        },
        part.ac
      ),

      /* NOMBRE DEL GRUPO */
      /* @__PURE__ */ React.createElement(
        "span",
        {
          style: {
            fontWeight: 700,
            color: T.ink,
            fontSize: "15px"
          }
        },
        part.zona ||
          /* @__PURE__ */ React.createElement(
            "em",
            {
              style: {
                color: T.inkFaint,
                fontWeight: 400
              }
            },
            "sin zona"
          )
      ),

      part.tipoDano &&
        /* @__PURE__ */ React.createElement(
          "span",
          {
            style: {
              fontSize: "11px",
              color: T.inkSoft,
              background: T.bgAlt,
              padding: "1px 6px",
              borderRadius: "10px"
            }
          },
          part.tipoDano
        ),

      showVehicle &&
        part.modelo &&
        /* @__PURE__ */ React.createElement(
          "span",
          {
            style: {
              fontSize: "10.5px",
              color: T.inkFaint
            }
          },
          part.modelo
        ),

      part.autoFilled &&
        /* @__PURE__ */ React.createElement(
          "span",
          {
            style: {
              fontSize: "10px",
              color: "#15803D",
              fontWeight: 700
            }
          },
          "\u2713 código auto (",
          part.autoFilled === "ac" ? "este AC" : "modelo",
          ")"
        ),

      /* ELIMINAR GRUPO (solo piezas manuales; las derivadas de un daño salen al marcar el daño reparado/asumido en el cockpit) */
      !part.sourceDamageId && /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => onDeletePart(part.id),
          style: {
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            color: T.danger,
            flexShrink: 0
          },
          title: "Quitar grupo de daño"
        },
        "\u{1F5D1}\uFE0F"
      )
    ),

    /* PIEZAS DEL GRUPO */
    piezas.map((pieza, index) =>
      /* @__PURE__ */ React.createElement(
        "div",
        {
          key: pieza.id,
          style: {
            background: index % 2 === 0 ? T.bgAlt : T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: "12px",
            padding: "9px",
            marginBottom: "7px"
          }
        },

        /* CABECERA DE LA PIEZA */
        /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "7px",
              marginBottom: "7px"
            }
          },

          /* @__PURE__ */ React.createElement(
            "span",
            {
              style: {
                fontSize: "10px",
                fontWeight: 800,
                color: T.inkSoft,
                textTransform: "uppercase",
                letterSpacing: "0.04em"
              }
            },
            `Pieza ${index + 1}`
          ),

          index > 0 &&
            /* @__PURE__ */ React.createElement(
              "button",
              {
                onClick: () => eliminarPieza(pieza.id),
                style: {
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  color: T.danger,
                  cursor: "pointer",
                  fontSize: "11px"
                },
                title: "Eliminar esta pieza"
              },
              "\u2715"
            )
        ),

        /* CAMPOS DE LA PIEZA */
        /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "150px 1.3fr 1.3fr 54px 100px",
              gap: "8px",
              alignItems: "center"
            }
          },

          /* CÓDIGO */
          /* @__PURE__ */ React.createElement(
            RecambioField,
            {
              value: pieza.codigo,
              onChange: (v) => actualizarPieza(pieza.id, { codigo: v }),
              placeholder: "código pieza",
              mono: true
            }
          ),

          /* DESCRIPCIÓN */
          /* @__PURE__ */ React.createElement(
            RecambioField,
            {
              value: pieza.descripcion,
              onChange: (v) => actualizarPieza(pieza.id, { descripcion: v }),
              placeholder: "descripción de la pieza"
            }
          ),

          /* NOTAS */
          /* @__PURE__ */ React.createElement(
            RecambioField,
            {
              value: pieza.notas,
              onChange: (v) => actualizarPieza(pieza.id, { notas: v }),
              placeholder: "notas (medidas, color, ref...)"
            }
          ),

          /* CANTIDAD */
          /* @__PURE__ */ React.createElement(
            RecambioField,
            {
              value: String(pieza.cantidad ?? 1),
              onChange: (v) =>
                actualizarPieza(pieza.id, {
                  cantidad: parseInt(v) || 1
                }),
              w: "54px"
            }
          ),

          /* ESTADO */
          /* @__PURE__ */ React.createElement(
            RecambioEstadoPicker,
            {
              part: pieza,
              onUpdatePart: (id, cambios) =>
                actualizarPieza(pieza.id, cambios)
            }
          )
        ),

        /* PVR + HORAS */
        /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              display: "flex",
              gap: "14px",
              alignItems: "center",
              marginTop: "7px"
            }
          },

          /* PVR */
          /* @__PURE__ */ React.createElement(
            "label",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                color: T.inkSoft,
                fontWeight: 600
              }
            },
            "PVR oficial",
            /* @__PURE__ */ React.createElement(
              "input",
              {
                type: "number",
                step: "0.01",
                min: "0",
                value: pieza.pvrOficial ?? "",
                onChange: (e) =>
                  actualizarPieza(pieza.id, {
                    pvrOficial:
                      e.target.value === ""
                        ? null
                        : parseFloat(e.target.value)
                  }),
                placeholder: "\u20AC",
                style: {
                  width: "80px",
                  padding: "4px 7px",
                  fontSize: "13px",
                  border: `1px solid ${T.border}`,
                  borderRadius: "10px",
                  background: T.surface,
                  color: T.ink
                }
              }
            ),
            /* @__PURE__ */ React.createElement(
              "span",
              { style: { color: T.inkFaint } },
              "\u20AC"
            )
          ),

          /* HORAS */
          /* @__PURE__ */ React.createElement(
            "label",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                color: T.inkSoft,
                fontWeight: 600
              }
            },
            "Horas M.O.",
            /* @__PURE__ */ React.createElement(
              "input",
              {
                type: "number",
                step: "0.1",
                min: "0",
                value: pieza.horasMO ?? "",
                onChange: (e) =>
                  actualizarPieza(pieza.id, {
                    horasMO:
                      e.target.value === ""
                        ? null
                        : parseFloat(e.target.value)
                  }),
                placeholder: "h",
                style: {
                  width: "64px",
                  padding: "4px 7px",
                  fontSize: "13px",
                  border: `1px solid ${T.border}`,
                  borderRadius: "10px",
                  background: T.surface,
                  color: T.ink
                }
              }
            ),
            /* @__PURE__ */ React.createElement(
              "span",
              { style: { color: T.inkFaint } },
              "h"
            )
          )
        )
      )
    ),

    /* AÑADIR PIEZA */
    /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: agregarPieza,
        style: {
          marginTop: "2px",
          padding: "6px 10px",
          borderRadius: "10px",
          border: `1px dashed ${T.border}`,
          background: "transparent",
          color: T.rust,
          cursor: "pointer",
          fontSize: "11px",
          fontWeight: 700
        }
      },
      "+ Añadir otra pieza"
    )
  );
};
  function buildRecambiosHTML(byPart, filterLabel) {
    const fecha = (/* @__PURE__ */ new Date()).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
    const totalUnidades = byPart.reduce((s, g) => s + g.totalQty, 0);
    const totalReferencias = byPart.length;
    const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const rows = byPart.map((g, i) => {
  const vehiculos = g.items.map((it) => it.ac).filter(Boolean).join(", ");
  const zonas = [...new Set(g.items.map((it) => it.zona).filter(Boolean))].join(" / ");
  const tipos = [...new Set(g.items.map((it) => it.tipoDano).filter(Boolean))].join(", ");

  const piezas = g.items.flatMap((it) => {
    if (Array.isArray(it.piezas) && it.piezas.length > 0) {
      return it.piezas.map((p) => ({
        codigo: p.codigo || "",
        descripcion: p.descripcion || "",
        notas: p.notas || "",
        cantidad: p.cantidad ?? 1,
        estado: p.estado || "por_pedir",
        pvrOficial: p.pvrOficial ?? null,
        horasMO: p.horasMO ?? null
      }));
    }

    // Compatibilidad con registros antiguos
    return [{
      codigo: it.codigo || "",
      descripcion: it.descripcion || "",
      notas: it.notas || "",
      cantidad: it.cantidad ?? 1,
      estado: it.estado || "por_pedir",
      pvrOficial: it.pvrOficial ?? null,
      horasMO: it.horasMO ?? null
    }];
  });

  const totalCantidad = piezas.reduce(
    (s, p) => s + (parseInt(p.cantidad) || 1),
    0
  );

  const piezasHTML = piezas.map((p) => {
    const detalle = [
      p.descripcion,
      p.notas
    ].filter(Boolean).join(" · ");

    return `
      <div style="margin-bottom:6px">
        <strong style="font-family:monospace">${esc(p.codigo) || "—"}</strong>
        ${detalle ? `<span style="margin-left:8px">${esc(detalle)}</span>` : ""}
        <span style="margin-left:8px;font-weight:700">x${p.cantidad}</span>
      </div>
    `;
  }).join("");

  return `<tr style="background:${i % 2 ? "#f9f9f9" : "#fff"}">
    <td style="padding:8px 10px;border:1px solid #ddd;text-align:center;font-weight:700;font-size:15px">${totalCantidad}</td>

    <td style="padding:8px 10px;border:1px solid #ddd">
      <div style="font-weight:700;font-size:13.5px">${esc(zonas) || "—"}</div>
      ${tipos ? `<div style="font-size:10.5px;color:#777;margin-top:2px">${esc(tipos)}</div>` : ""}
    </td>

    <td style="padding:8px 10px;border:1px solid #ddd">
      ${piezasHTML}
    </td>

    <td style="padding:8px 10px;border:1px solid #ddd;font-size:11px;color:#555">
      ${esc(vehiculos) || "—"}
    </td>

    <td style="padding:8px 10px;border:1px solid #ddd;width:60px"></td>
  </tr>`;
    }).join("");
    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Recambios a pedir \xB7 ${fecha}</title>
<style>
  body{font-family:'Times New Roman',Georgia,serif;font-size:13px;color:#000;padding:24px;max-width:920px;margin:0 auto}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:6px}
  .brand{font-size:20px;font-weight:700;letter-spacing:1px}
  .sub{font-size:11px;color:#666}
  .title{font-size:16px;font-weight:700;text-align:right}
  .meta{font-size:11px;color:#666;text-align:right}
  table{width:100%;border-collapse:collapse;margin-top:16px}
  th{background:#000;color:#fff;padding:7px 10px;font-size:10px;text-align:left;text-transform:uppercase;letter-spacing:0.04em}
  .summary{margin-top:14px;font-size:12px;background:#f4f4f4;padding:10px 14px;border-radius:4px}
  .foot{margin-top:30px;font-size:10px;color:#999;border-top:1px solid #ddd;padding-top:8px;display:flex;justify-content:space-between}
  @media print{body{padding:0}}
</style></head><body>
<div class="hdr">
  <div><div class="brand">AC\xB7LLAR</div><div class="sub">vacaciones en autocaravana</div></div>
  <div><div class="title">RECAMBIOS A PEDIR</div><div class="meta">${fecha}${filterLabel ? ` \xB7 ${filterLabel}` : ""}</div></div>
</div>
<div class="summary">
  <strong>${totalReferencias}</strong> referencia${totalReferencias !== 1 ? "s" : ""} distinta${totalReferencias !== 1 ? "s" : ""} \xB7 <strong>${totalUnidades}</strong> unidad${totalUnidades !== 1 ? "es" : ""} en total
</div>
<table>
  <thead><tr>
    <th style="width:45px;text-align:center">Uds.</th>
    <th style="width:170px">Parte de la AC</th>
    <th style="width:120px">C\xF3digo</th>
    <th>Descripci\xF3n / Notas</th>
    <th style="width:110px">Veh\xEDculos</th>
    <th style="width:60px">Pedido \u2713</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="foot"><span>AC-LLAR \xB7 Lista de recambios</span><span>Generado: ${fecha}</span></div>
</body></html>`;
  }
  const BuscadorView = ({ state, onSelectVehicle }) => {
    const [query, setQuery] = useState("");
    const [incluirCerrados, setIncluirCerrados] = useState(false);
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");
    const vehById = useMemo(() => {
      const m = {};
      (state.vehicles || []).forEach((v) => { m[v.id] = v; });
      return m;
    }, [state.vehicles]);
    const norm = (s) => (s || "").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
    const zonas = useMemo(() => {
      const set = /* @__PURE__ */ new Set();
      (state.damages || []).forEach((d) => { if (d.zona) set.add(d.zona); });
      return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [state.damages]);
    const q = norm(query);
    // Coincidencia por ZONA EXACTA. Si el texto coincide exactamente con una zona -> esa zona.
    // Si es parcial y coincide con varias zonas distintas -> se ofrecen para elegir (no se mezclan).
    // Si coincide con una sola zona por substring -> se toma esa.
    const zonaMatch = useMemo(() => {
      if (!q) return { zona: null, opciones: [] };
      const exacta = zonas.find((z) => norm(z) === q);
      if (exacta) return { zona: exacta, opciones: [] };
      const subs = zonas.filter((z) => norm(z).includes(q));
      if (subs.length === 1) return { zona: subs[0], opciones: [] };
      return { zona: null, opciones: subs };
    }, [q, zonas]);
    const zonaSel = zonaMatch.zona;
    const zonaSelNorm = norm(zonaSel);
    const resultados = useMemo(() => {
      if (!zonaSel) return [];
      const desdeT = desde ? new Date(desde + "T00:00:00").getTime() : null;
      const hastaT = hasta ? new Date(hasta + "T23:59:59.999").getTime() : null;
      return (state.damages || []).filter((d) => {
        if (norm(d.zona) !== zonaSelNorm) return false;
        if (!incluirCerrados && (d.state === "REPARADO" || d.state === "ASUMIDO")) return false;
        // Filtro por FECHA DE DETECCIÓN (independiente del estado de reparación).
        if (desdeT || hastaT) {
          const t = d.detectedAt ? new Date(d.detectedAt).getTime() : null;
          if (t === null || isNaN(t)) return false;
          if (desdeT && t < desdeT) return false;
          if (hastaT && t > hastaT) return false;
        }
        return true;
      });
    }, [state.damages, zonaSelNorm, zonaSel, incluirCerrados, desde, hasta]);
    const grupos = useMemo(() => {
      const orden = ["Valencia", "Onil", "Castell\xF3n", "Alicante"];
      const m = {};
      for (const d of resultados) {
        const v = vehById[d.vehicleId] || {};
        const s = v.location || "(sin sede)";
        (m[s] = m[s] || []).push({ d, v });
      }
      return Object.keys(m).sort((a, b) => {
        const ia = orden.indexOf(a), ib = orden.indexOf(b);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
      }).map((s) => ({
        sede: s,
        items: m[s].sort((x, y) => (x.d.vehicleId || "").localeCompare(y.d.vehicleId || ""))
      }));
    }, [resultados, vehById]);
    const nVeh = /* @__PURE__ */ new Set(resultados.map((d) => d.vehicleId)).size;

    const imprimir = () => {
      const hoy = (/* @__PURE__ */ new Date()).toLocaleDateString("es-ES");
      let filas = "";
      for (const g of grupos) {
        filas += `<tr class="sede"><td colspan="8">${g.sede} \xB7 ${g.items.length}</td></tr>`;
        for (const it of g.items) {
          const mm = [it.v.brand, it.v.model].filter(Boolean).join(" ");
          const det = it.d.detectedAt ? it.d.detectedAt.slice(0, 10) : "—";
          const estRep = it.d.repairedAt ? "Reparado" : "Sin reparar";
          const cargo = (it.d.cargo === "ASUMIDO" || it.d.state === "ASUMIDO") ? "Asumido" : "—";
          filas += `<tr><td class="chk">☐</td><td class="ac">${it.d.vehicleId || ""}</td><td>${it.v.plate || "—"}</td><td>${mm || "—"}</td><td>${det}</td><td>${estRep}</td><td>${cargo}</td><td class="notas"></td></tr>`;
        }
      }
      const rango = (desde || hasta) ? ` \xB7 detectado ${desde || "…"} → ${hasta || "…"}` : "";
      const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Da\xF1os: ${zonaSel}</title><style>*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:0;padding:22px 26px;font-size:13px}h1{font-size:20px;margin:0 0 2px}.sub{color:#555;font-size:12px;margin:0 0 16px}table{width:100%;border-collapse:collapse}th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:#444;border-bottom:2px solid #222;padding:6px 8px}td{padding:8px;border-bottom:1px solid #ddd}tr.sede td{background:#f0f0f0;font-weight:700;text-transform:uppercase;font-size:12px;border-bottom:1px solid #bbb;padding:6px 8px}.chk{width:26px;text-align:center;font-size:16px}.ac{font-family:monospace;font-weight:700}.notas{width:30%}.foot{margin-top:16px;color:#777;font-size:11px;border-top:1px solid #ddd;padding-top:8px}@media print{body{padding:0}@page{size:A4;margin:14mm}}</style></head><body><h1>Da\xF1os en: ${zonaSel}</h1><p class="sub">AC-LLAR \xB7 ${hoy} \xB7 ${nVeh} veh\xEDculos${incluirCerrados ? " \xB7 incluye reparados/asumidos" : " \xB7 solo activos"}${rango}</p><table><thead><tr><th></th><th>AC</th><th>Matr\xEDcula</th><th>Marca / Modelo</th><th>Detectado</th><th>Reparaci\xF3n</th><th>Cargo</th><th>Notas / Resultado</th></tr></thead><tbody>${filas}</tbody></table><p class="foot">Generado por el cockpit AC-LLAR \xB7 Buscador de da\xF1os.</p><script>window.onload=function(){setTimeout(function(){window.print();},250);}<\/script></body></html>`;
      const w = window.open("", "_blank");
      if (w) { w.document.write(html); w.document.close(); }
    };

    const gravColor = (g) => g === "GRAVE" ? T.danger : g === "MODERADO" ? T.warn : g === "LEVE" ? "#15803D" : T.inkFaint;
    const inputStyle = { flex: 1, minWidth: "220px", fontSize: "14px", fontFamily: F.body, color: T.ink, background: T.surface, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "10px 14px", outline: "none" };

    return /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "1000px", margin: "0 auto" } },
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: T.inkFaint, textTransform: "uppercase" } }, "Buscador"),
      /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: F.display, fontSize: "30px", fontWeight: 600, color: T.ink, margin: "2px 0 4px", letterSpacing: "-0.02em" } }, "Buscador de da\xF1os por zona"),
      /* @__PURE__ */ React.createElement("p", { style: { fontSize: "14px", color: T.inkSoft, marginTop: 0, marginBottom: "18px" } }, "Escrib\xED la zona del veh\xEDculo (parabrisas, espejo, toldo…) y te lista los veh\xEDculos con da\xF1o en esa zona exacta, por sede. Us\xE1 el bot\xF3n de imprimir para la hoja de trabajo."),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginBottom: "8px" } },
        /* @__PURE__ */ React.createElement("input", { list: "zonas-list", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "\u{1F50D} Zona del da\xF1o…", style: inputStyle }),
        /* @__PURE__ */ React.createElement("datalist", { id: "zonas-list" }, zonas.map((z) => /* @__PURE__ */ React.createElement("option", { key: z, value: z }))),
        /* @__PURE__ */ React.createElement("button", {
          onClick: imprimir, disabled: grupos.length === 0,
          style: { cursor: grupos.length ? "pointer" : "not-allowed", fontSize: "14px", fontWeight: 700, color: grupos.length ? "#fff" : T.inkFaint, background: grupos.length ? T.rust : T.bgAlt, border: "none", borderRadius: "12px", padding: "10px 16px", whiteSpace: "nowrap" }
        }, "\u{1F5A8}️ Imprimir")
      ),
      /* @__PURE__ */ React.createElement("label", { style: { display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "13px", color: T.inkSoft, cursor: "pointer", marginBottom: "18px" } },
        /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: incluirCerrados, onChange: (e) => setIncluirCerrados(e.target.checked) }),
        "Incluir reparados / asumidos"
      ),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", marginBottom: "18px" } },
        /* @__PURE__ */ React.createElement("span", { style: { fontSize: "12.5px", color: T.inkSoft, fontWeight: 600 } }, "Detectado entre:"),
        /* @__PURE__ */ React.createElement("input", { type: "date", value: desde, onChange: (e) => setDesde(e.target.value), style: { fontSize: "13px", fontFamily: F.body, color: T.ink, background: T.surface, border: `1px solid ${T.border}`, borderRadius: "10px", padding: "7px 10px", outline: "none" } }),
        /* @__PURE__ */ React.createElement("span", { style: { color: T.inkFaint } }, "→"),
        /* @__PURE__ */ React.createElement("input", { type: "date", value: hasta, onChange: (e) => setHasta(e.target.value), style: { fontSize: "13px", fontFamily: F.body, color: T.ink, background: T.surface, border: `1px solid ${T.border}`, borderRadius: "10px", padding: "7px 10px", outline: "none" } }),
        (desde || hasta) && /* @__PURE__ */ React.createElement("button", { onClick: () => { setDesde(""); setHasta(""); }, style: { cursor: "pointer", fontSize: "12px", fontWeight: 700, color: T.inkSoft, background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: "999px", padding: "6px 12px" } }, "limpiar fechas"),
        /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11.5px", color: T.inkFaint, fontStyle: "italic" } }, "por fecha de detecci\xF3n \xB7 incluye todos los estados")
      ),
      // Desambiguaci\xF3n: varias zonas coinciden con el texto parcial -> elegir una (no se mezclan)
      (!zonaSel && zonaMatch.opciones.length > 0) ? /* @__PURE__ */ React.createElement("div", { style: { padding: "20px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: "16px", marginBottom: "16px" } },
        /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft, marginBottom: "12px", fontWeight: 600 } }, "Hay varias zonas que coinciden. Eleg\xED una:"),
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
          zonaMatch.opciones.map((z) => /* @__PURE__ */ React.createElement("button", {
            key: z, onClick: () => setQuery(z),
            style: { cursor: "pointer", fontSize: "13.5px", fontWeight: 600, color: T.ink, background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: "999px", padding: "8px 16px" }
          }, z))
        )
      )
      : !q ? /* @__PURE__ */ React.createElement("div", { style: { padding: "28px", textAlign: "center", color: T.inkFaint, fontSize: "14px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: "16px" } }, "Escrib\xED una zona para empezar la b\xFAsqueda.")
      : grupos.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "28px", textAlign: "center", color: T.inkFaint, fontSize: "14px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: "16px" } }, `Sin resultados para \xAB${query}\xBB.`)
      : /* @__PURE__ */ React.createElement(React.Fragment, null,
          /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft, marginBottom: "12px", fontWeight: 600 } }, `Zona: ${zonaSel} \xB7 ${nVeh} veh\xEDculo${nVeh === 1 ? "" : "s"} \xB7 ${resultados.length} da\xF1o${resultados.length === 1 ? "" : "s"}`),
          grupos.map((g) => /* @__PURE__ */ React.createElement("div", { key: g.sede, style: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: "16px", overflow: "hidden", marginBottom: "16px" } },
            /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 16px", background: T.bgAlt, fontFamily: F.body, fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.inkSoft, borderBottom: `1px solid ${T.border}` } }, `${g.sede} \xB7 ${g.items.length}`),
            g.items.map((it, i) => /* @__PURE__ */ React.createElement("div", {
              key: it.d.id || i,
              onClick: () => onSelectVehicle && onSelectVehicle(it.d.vehicleId),
              style: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", borderTop: i === 0 ? "none" : `1px solid ${T.border}`, cursor: "pointer" }
            },
              /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, fontWeight: 700, color: T.rust, fontSize: "14px", minWidth: "64px" } }, it.d.vehicleId || ""),
              /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, fontSize: "11px", color: T.inkFaint, minWidth: "70px" } }, it.v.plate || "—"),
              /* @__PURE__ */ React.createElement("span", { style: { flex: 1, minWidth: 0, fontSize: "13.5px", color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, [it.v.brand, it.v.model].filter(Boolean).join(" ") || "—"),
              /* @__PURE__ */ React.createElement("span", { style: { fontSize: "12.5px", color: T.inkSoft, whiteSpace: "nowrap" } }, it.d.tipoDano || "—"),
              /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, fontSize: "11px", color: T.inkFaint, whiteSpace: "nowrap", minWidth: "78px" } }, it.d.detectedAt ? it.d.detectedAt.slice(0, 10) : "—"),
              /* @__PURE__ */ React.createElement("span", { style: { fontSize: "9.5px", fontWeight: 800, whiteSpace: "nowrap", padding: "2px 7px", borderRadius: "999px", color: it.d.repairedAt ? "#15803D" : "#B45309", background: it.d.repairedAt ? "#DCFCE7" : "#FEF3C7" } }, it.d.repairedAt ? "reparado" : "sin reparar"),
              (it.d.cargo === "ASUMIDO" || it.d.state === "ASUMIDO") ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: "9.5px", fontWeight: 800, whiteSpace: "nowrap", padding: "2px 7px", borderRadius: "999px", color: "#5B6B82", background: "#EDEFF3" } }, "asumido") : null,
              /* @__PURE__ */ React.createElement("span", { style: { fontSize: "10.5px", fontWeight: 700, color: gravColor(it.d.gravedad), whiteSpace: "nowrap", minWidth: "62px", textAlign: "right" } }, it.d.gravedad || "")
            ))
          ))
        )
    );
  };

  const RecambiosView = ({ state, onUpdatePart, onDeletePart, onAddPart, onImportFromCockpit, onApplyMemory, onAcceptSuggestions, onDismissSuggestions, onMarkOrdered }) => {
    const parts = state.partsToOrder || [];
    const [view, setView] = useState("vehiculo");
    const [filterEstado, setFilterEstado] = useState("por_pedir");
    const [query, setQuery] = useState("");
    const [pickerOpen, setPickerOpen] = useState(false);
    const [picked, setPicked] = useState({});
    const [suggestOpen, setSuggestOpen] = useState(false);
    const [suggestPicked, setSuggestPicked] = useState({});
    const [suggestChoice, setSuggestChoice] = useState({});
    const [orderOpen, setOrderOpen] = useState(false);
    const [orderPicked, setOrderPicked] = useState({});
    const [addOpen, setAddOpen] = useState(false);
    const [addForm, setAddForm] = useState({ vehicleId: "", zona: "", tipoDano: "", codigo: "", descripcion: "", notas: "", pvrOficial: "", horasMO: "", cantidad: "1" });
    const vehOptions = useMemo(
      () => (state.vehicles || []).filter((v) => !v.baja).slice().sort((a, b) => (a.id || "").localeCompare(b.id || "", void 0, { numeric: true })).map((v) => ({ value: v.id, label: v.id + (v.model ? " \xB7 " + v.model : v.brand ? " \xB7 " + v.brand : "") })),
      [state.vehicles]
    );
    const activeDamagesByVehicle = useMemo(() => {
      const vehById = {};
      (state.vehicles || []).forEach((v) => {
        vehById[v.id] = v;
      });
      const already = new Set((state.partsToOrder || []).map((p) => p.sourceDamageId).filter(Boolean));
      const m = {};
      for (const d of state.damages || []) {
        // Solo daños activos que requieran piezas. Excluye reparados, asumidos y sin requerimiento (rayaduras, etc).
        if (d.state === "REPARADO" || d.state === "ASUMIDO") continue;
        if (!d.requierePiezas) continue;
        const v = vehById[d.vehicleId];
        const k = d.vehicleId || "sin-ac";
        if (!m[k]) m[k] = {
          ac: d.vehicleId,
          modelo: v ? [v.brand, v.model].filter(Boolean).join(" ") || v.marca || "" : "",
          items: []
        };
        m[k].items.push({ ...d, _alreadyAdded: already.has(d.id) });
      }
      return Object.values(m).sort((a, b) => (a.ac || "").localeCompare(b.ac || ""));
    }, [state.damages, state.vehicles, state.partsToOrder]);
    const confirmPicker = () => {
      const chosen = [];
      for (const g of activeDamagesByVehicle) {
        for (const d of g.items) {
          if (picked[d.id]) chosen.push({ damage: d, ac: g.ac, modelo: g.modelo });
        }
      }
      if (chosen.length > 0) onImportFromCockpit(chosen);
      setPickerOpen(false);
      setPicked({});
    };
    const suggestions = useMemo(() => {
      const memory = state.partsMemory || {};
      const vehById = {};
      (state.vehicles || []).forEach((v) => {
        vehById[v.id] = v;
      });
      const already = new Set((state.partsToOrder || []).map((p) => p.sourceDamageId).filter(Boolean));
      const dismissed = state.recambioSuggestDismissed || {};
      const loadedKeys = /* @__PURE__ */ new Set();
      for (const p of state.partsToOrder || []) {
        const cod = (p.codigo || "").trim().toUpperCase();
        if (cod) loadedKeys.add(`${p.ac}|${normZona(p.zona)}|${cod}`);
      }
      const out = [];
      for (const d of state.damages || []) {
        // Solo daños activos que requieran piezas. Excluye reparados, asumidos y sin requerimiento.
        if (d.state === "REPARADO" || d.state === "ASUMIDO") continue;
        if (!d.requierePiezas) continue;
        if (already.has(d.id)) continue;
        if (dismissed[d.id]) continue;
        if (!d.zona) continue;
        const v = vehById[d.vehicleId];
        const modelo = v ? [v.brand, v.model].filter(Boolean).join(" ") || v.marca || "" : "";
        const opciones = lookupAllPartMemory(memory, d.vehicleId, modelo, d.zona).filter((o) => o.codigo).filter((o) => !loadedKeys.has(`${d.vehicleId}|${normZona(d.zona)}|${(o.codigo || "").trim().toUpperCase()}`));
        out.push({
  damageId: d.id,
  ac: d.vehicleId,
  modelo,
  zona: d.zona,
  tipoDano: d.tipoDano || "",
  opciones,
  multiple: opciones.length > 1
});
      }
      return out;
    }, [state.damages, state.vehicles, state.partsToOrder, state.partsMemory, state.recambioSuggestDismissed]);
    // Solo mostramos líneas cuyo daño sigue ACTIVO y requiere pieza. Una línea
    // derivada de un daño ya reparado/asumido (o borrado) desaparece de la vista
    // sin perder sus datos. Las piezas manuales (sin sourceDamageId) siempre se ven.
    const activeDamageIds = useMemo(() => {
      const s = new Set();
      for (const d of state.damages || []) {
        if (d.state === "REPARADO" || d.state === "ASUMIDO") continue;
        if (!d.requierePiezas) continue;
        s.add(d.id);
      }
      return s;
    }, [state.damages]);
    const bajaAcIds = useMemo(() => {
      const s = new Set();
      for (const v of state.vehicles || []) if (v && v.baja) s.add(v.id);
      return s;
    }, [state.vehicles]);
    const visibleParts = useMemo(
      () => parts.filter((p) => (!p.sourceDamageId || activeDamageIds.has(p.sourceDamageId)) && !bajaAcIds.has(p.ac)),
      [parts, activeDamageIds, bajaAcIds]
    );
    const q = query.trim().toLowerCase();
    const shown = visibleParts.filter((p) => {
      if (filterEstado !== "todos" && p.estado !== filterEstado) return false;
      if (!q) return true;
      const haystack = [p.ac, p.zona, p.tipoDano, p.codigo, p.descripcion, p.notas, p.modelo].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(q);
    });
    const byVehicle = useMemo(() => {
      const m = {};
      for (const p of shown) {
        const k = p.ac || "Sin AC";
        (m[k] = m[k] || { ac: p.ac, modelo: p.modelo, items: [] }).items.push(p);
      }
      return Object.values(m).sort((a, b) => (a.ac || "").localeCompare(b.ac || ""));
    }, [shown]);
    const byPart = useMemo(() => {
      const m = {};
      for (const p of shown) {
        const k = (p.codigo || p.descripcion || p.zona || "sin identificar").toLowerCase().trim();
        if (!m[k]) m[k] = { codigo: p.codigo, descripcion: p.descripcion, zona: p.zona, items: [], totalQty: 0 };
        m[k].items.push(p);
        m[k].totalQty += p.cantidad || 1;
      }
      return Object.values(m).sort((a, b) => b.totalQty - a.totalQty);
    }, [shown]);
    const counts = {
      total: visibleParts.length,
      por_pedir: visibleParts.filter((p) => p.estado === "por_pedir").length,
      pedido: visibleParts.filter((p) => p.estado === "pedido").length,
      recibido: visibleParts.filter((p) => p.estado === "recibido").length
    };
    const sinCodigo = useMemo(() => {
      const memory = state.partsMemory || {};
      return visibleParts.filter((p) => !p.codigo && lookupPartMemory(memory, p.ac, p.modelo, p.zona)).length;
    }, [visibleParts, state.partsMemory]);
    // Líneas por pedir visibles, para el marcado en bloque semanal.
    const porPedirVisibles = useMemo(
      () => visibleParts.filter((p) => p.estado === "por_pedir"),
      [visibleParts]
    );
    const exportForFabricio = () => {
      if (byPart.length === 0) return;
      const labelMap = { todos: "Todos", por_pedir: "Por pedir", pedido: "Pedidos", recibido: "Recibidos" };
      const html = buildRecambiosHTML(byPart, labelMap[filterEstado] || "");
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Recambios_a_pedir_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    return /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "1000px", margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: T.inkFaint, textTransform: "uppercase" } }, "Recambios"), /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: F.display, fontSize: "30px", fontWeight: 600, color: T.ink, margin: "2px 0 4px", letterSpacing: "-0.02em" } }, "Lista de recambios a pedir"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "14px", color: T.inkSoft, marginTop: 0, marginBottom: "18px" } }, "Foto en vivo de las piezas que hacen falta: cada da\xF1o activo que requiere pieza aparece ac\xE1 solo. Le\xE9 la lista, export\xE1 para Fabricio y marc\xE1 el bloque como pedido; lo pedido sale de “Por pedir”. Una l\xEDnea desaparece cuando marc\xE1s el da\xF1o como reparado."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" } }, [["todos", `Todos (${counts.total})`], ["por_pedir", `Por pedir (${counts.por_pedir})`], ["pedido", `Pedidos (${counts.pedido})`], ["recibido", `Recibidos (${counts.recibido})`]].map(([k, lbl]) => /* @__PURE__ */ React.createElement("button", { key: k, onClick: () => setFilterEstado(k), style: {
      padding: "6px 12px",
      fontSize: "13px",
      fontWeight: 600,
      borderRadius: "999px",
      cursor: "pointer",
      border: `1px solid ${filterEstado === k ? T.rust : T.border}`,
      background: filterEstado === k ? T.rust : "transparent",
      color: filterEstado === k ? "#fff" : T.inkSoft
    } }, lbl))), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", marginBottom: "12px" } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: T.inkFaint, fontSize: "15px" } }, "\u{1F50D}"), /* @__PURE__ */ React.createElement(
      "input",
      {
        value: query,
        onChange: (e) => setQuery(e.target.value),
        placeholder: "Buscar por AC, zona, c\xF3digo, descripci\xF3n...",
        style: {
          width: "100%",
          padding: "10px 12px 10px 36px",
          fontSize: "14px",
          border: `1px solid ${T.border}`,
          borderRadius: "12px",
          background: T.surface,
          color: T.ink,
          boxSizing: "border-box"
        }
      }
    ), query && /* @__PURE__ */ React.createElement("button", { onClick: () => setQuery(""), style: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: T.inkFaint,
      fontSize: "16px"
    }, title: "Limpiar" }, "\xD7")), q && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft, marginBottom: "12px" } }, shown.length === 0 ? "Sin resultados" : `${shown.length} resultado${shown.length !== 1 ? "s" : ""}`, ' para "', query, '"'), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "6px", marginBottom: "14px" } }, [["vehiculo", "\u{1F690} Por veh\xEDculo"], ["pieza", "\u{1F527} Por pieza"]].map(([k, lbl]) => /* @__PURE__ */ React.createElement("button", { key: k, onClick: () => setView(k), style: {
      padding: "7px 14px",
      fontSize: "13.5px",
      fontWeight: 700,
      borderRadius: "12px",
      cursor: "pointer",
      border: "none",
      background: view === k ? T.ink : T.surface,
      color: view === k ? "#fff" : T.inkSoft
    } }, lbl)), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          setOrderPicked(Object.fromEntries(porPedirVisibles.map((p) => [p.id, true])));
          setOrderOpen(true);
        },
        disabled: porPedirVisibles.length === 0,
        style: {
          marginLeft: "auto",
          padding: "7px 14px",
          fontSize: "13.5px",
          fontWeight: 700,
          borderRadius: "12px",
          cursor: porPedirVisibles.length === 0 ? "default" : "pointer",
          border: "none",
          background: porPedirVisibles.length === 0 ? T.border : "#15803D",
          color: "#fff"
        },
        title: "Marcar como pedidas las piezas por pedir (pod\xE9s excluir alguna)"
      },
      "\u2713 Marcar como pedido",
      porPedirVisibles.length > 0 ? ` (${porPedirVisibles.length})` : ""
    ), /* @__PURE__ */ React.createElement("button", { onClick: () => { setAddForm({ vehicleId: "", zona: "", tipoDano: "", codigo: "", descripcion: "", notas: "", pvrOficial: "", horasMO: "", cantidad: "1" }); setAddOpen(true); }, style: {
      padding: "7px 14px",
      fontSize: "13.5px",
      fontWeight: 700,
      borderRadius: "12px",
      cursor: "pointer",
      border: `1px solid ${T.rust}`,
      background: "transparent",
      color: T.rust
    } }, "+ A\xF1adir a mano"), /* @__PURE__ */ React.createElement("button", { onClick: exportForFabricio, disabled: byPart.length === 0, style: {
      padding: "7px 14px",
      fontSize: "13.5px",
      fontWeight: 700,
      borderRadius: "12px",
      cursor: byPart.length === 0 ? "default" : "pointer",
      border: "none",
      background: byPart.length === 0 ? T.border : "#15803D",
      color: "#fff"
    }, title: "Descargar lista para imprimir o enviar a Fabricio" }, "\u{1F5A8}\uFE0F Exportar para Fabricio")), visibleParts.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "40px 20px", textAlign: "center", color: T.inkFaint, fontSize: "14px", background: T.surface, borderRadius: "18px" } }, "No hay piezas pendientes. Las piezas aparecen ac\xE1 solas cuando un veh\xEDculo tiene un da\xF1o activo que requiere pieza; desaparecen cuando marc\xE1s el da\xF1o como reparado.") : view === "vehiculo" ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "14px" } }, byVehicle.map((g) => /* @__PURE__ */ React.createElement("div", { key: g.ac, style: { background: T.surface, borderRadius: "18px", overflow: "hidden", border: `1px solid ${T.border}` } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: T.bgAlt, borderBottom: `1px solid ${T.border}` } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: T.ink, fontSize: "15px" } }, g.ac), /* @__PURE__ */ React.createElement("span", { style: { color: T.inkFaint, fontSize: "11px", marginLeft: "8px" } }, g.modelo), /* @__PURE__ */ React.createElement("span", { style: { color: T.inkSoft, fontSize: "11px", marginLeft: "8px" } }, "\xB7 ", g.items.length, " pieza", g.items.length !== 1 ? "s" : "")), g.items.map((part) => /* @__PURE__ */ React.createElement(RecambioPartRow, { key: part.id, part, showVehicle: false, onUpdatePart, onDeletePart }))))) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "14px" } }, byPart.map((g, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { background: T.surface, borderRadius: "18px", overflow: "hidden", border: `1px solid ${T.border}` } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: T.bgAlt, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "2px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: T.ink, fontSize: "15px" } }, g.zona || g.descripcion || "Sin identificar"), g.codigo && /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, fontSize: "11px", color: T.inkSoft } }, g.codigo)), /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", fontWeight: 800, color: T.rust, fontSize: "15px" } }, g.totalQty, " u.")), g.items.map((part) => /* @__PURE__ */ React.createElement(RecambioPartRow, { key: part.id, part, showVehicle: true, onUpdatePart, onDeletePart }))))), addOpen && /* @__PURE__ */ React.createElement(Modal, { open: true, onClose: () => setAddOpen(false), title: "A\xF1adir pieza a mano", width: 580 }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: "12px" } },
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", color: T.inkSoft, marginBottom: "2px" } }, "Complet\xE1 el veh\xEDculo y la zona para que la pieza quede registrada igual que las que vienen de un da\xF1o."),
      /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
        /* @__PURE__ */ React.createElement(Field, { label: "Veh\xEDculo (AC)", required: true }, /* @__PURE__ */ React.createElement(Select, { value: addForm.vehicleId, onChange: (v) => setAddForm((f) => ({ ...f, vehicleId: v })), options: [{ value: "", label: "— Eleg\xED un veh\xEDculo —" }, ...vehOptions] })),
        /* @__PURE__ */ React.createElement(Field, { label: "Zona del da\xF1o", required: true }, /* @__PURE__ */ React.createElement(Input, { value: addForm.zona, onChange: (v) => setAddForm((f) => ({ ...f, zona: v })), placeholder: "Lateral derecho, techo, puerta…" }))
      ),
      /* @__PURE__ */ React.createElement(Field, { label: "Tipo de da\xF1o", hint: "opcional" }, /* @__PURE__ */ React.createElement(Input, { value: addForm.tipoDano, onChange: (v) => setAddForm((f) => ({ ...f, tipoDano: v })), placeholder: "Golpe, rotura, rozadura…" })),
      /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" } },
        /* @__PURE__ */ React.createElement(Field, { label: "C\xF3digo" }, /* @__PURE__ */ React.createElement(Input, { value: addForm.codigo, onChange: (v) => setAddForm((f) => ({ ...f, codigo: v })), placeholder: "P-123", mono: true })),
        /* @__PURE__ */ React.createElement(Field, { label: "Descripci\xF3n" }, /* @__PURE__ */ React.createElement(Input, { value: addForm.descripcion, onChange: (v) => setAddForm((f) => ({ ...f, descripcion: v })), placeholder: "Nombre de la pieza" }))
      ),
      /* @__PURE__ */ React.createElement(Field, { label: "Notas", hint: "opcional" }, /* @__PURE__ */ React.createElement(Textarea, { value: addForm.notas, onChange: (v) => setAddForm((f) => ({ ...f, notas: v })), rows: 2, placeholder: "Nombre coloquial, proveedor, referencia…" })),
      /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" } },
        /* @__PURE__ */ React.createElement(Field, { label: "PVR oficial (€)" }, /* @__PURE__ */ React.createElement(Input, { value: addForm.pvrOficial, onChange: (v) => setAddForm((f) => ({ ...f, pvrOficial: v })), type: "number", placeholder: "0" })),
        /* @__PURE__ */ React.createElement(Field, { label: "Horas M.O." }, /* @__PURE__ */ React.createElement(Input, { value: addForm.horasMO, onChange: (v) => setAddForm((f) => ({ ...f, horasMO: v })), type: "number", placeholder: "0" })),
        /* @__PURE__ */ React.createElement(Field, { label: "Cantidad" }, /* @__PURE__ */ React.createElement(Input, { value: addForm.cantidad, onChange: (v) => setAddForm((f) => ({ ...f, cantidad: v })), type: "number", placeholder: "1" }))
      ),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "6px" } },
        /* @__PURE__ */ React.createElement("button", { onClick: () => setAddOpen(false), style: { padding: "8px 16px", fontSize: "13.5px", fontWeight: 700, borderRadius: "12px", cursor: "pointer", border: `1px solid ${T.border}`, background: "transparent", color: T.inkSoft } }, "Cancelar"),
        /* @__PURE__ */ React.createElement("button", { onClick: () => { if (!addForm.vehicleId || !addForm.zona.trim()) return; onAddPart(addForm); setAddOpen(false); }, disabled: !addForm.vehicleId || !addForm.zona.trim(), style: { padding: "8px 18px", fontSize: "13.5px", fontWeight: 700, borderRadius: "12px", cursor: !addForm.vehicleId || !addForm.zona.trim() ? "default" : "pointer", border: "none", background: !addForm.vehicleId || !addForm.zona.trim() ? T.border : T.rust, color: "#fff" } }, "A\xF1adir pieza")
      )
    )), orderOpen && /* @__PURE__ */ React.createElement("div", { onClick: () => setOrderOpen(false), style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1e3, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" } }, React.createElement("div", { onClick: (e) => e.stopPropagation(), style: { background: T.bg, borderRadius: "18px", width: "100%", maxWidth: "620px", maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden" } }, React.createElement("div", { style: { padding: "16px 20px", borderBottom: `1px solid ${T.border}` } }, React.createElement("div", { style: { fontSize: "17px", fontWeight: 700, color: T.ink, fontFamily: F.display } }, "✓ Marcar como pedido"), React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft, marginTop: "3px" } }, "Estas son las piezas por pedir. Destild\xE1 las que NO quieras pedir esta semana; el resto pasa a “Pedido” y sale de esta pantalla.")), React.createElement("div", { style: { overflowY: "auto", padding: "12px 16px", flex: 1 } }, porPedirVisibles.length === 0 ? React.createElement("div", { style: { padding: "30px", textAlign: "center", color: T.inkFaint, fontSize: "14px" } }, "No hay piezas por pedir.") : porPedirVisibles.map((p) => { const on = orderPicked[p.id]; return React.createElement("label", { key: p.id, style: { display: "flex", gap: "10px", alignItems: "center", padding: "8px 10px", marginBottom: "6px", borderRadius: "12px", cursor: "pointer", border: `1px solid ${on ? "#15803D" : T.border}`, background: on ? "rgba(21,128,61,0.06)" : T.surface } }, React.createElement("input", { type: "checkbox", checked: !!on, onChange: () => setOrderPicked((prev) => ({ ...prev, [p.id]: !prev[p.id] })), style: { accentColor: "#15803D", cursor: "pointer" } }), React.createElement("span", { style: { fontWeight: 800, color: "#fff", background: T.rust, fontSize: "11px", padding: "2px 7px", borderRadius: "10px", flexShrink: 0 } }, p.ac), React.createElement("span", { style: { fontWeight: 700, color: T.ink, fontSize: "14px" } }, p.zona || p.descripcion || "sin zona"), p.codigo ? React.createElement("span", { style: { fontFamily: F.mono, fontSize: "11px", color: T.inkSoft } }, p.codigo) : React.createElement("span", { style: { fontSize: "10.5px", fontWeight: 700, color: "#B45309", background: "#FEF3C7", padding: "1px 6px", borderRadius: "10px" } }, "sin c\xF3digo"), React.createElement("span", { style: { marginLeft: "auto", fontSize: "11px", color: T.inkFaint, flexShrink: 0 } }, (p.cantidad || 1) + " u.")); })), React.createElement("div", { style: { padding: "12px 16px", borderTop: `1px solid ${T.border}`, display: "flex", gap: "8px", justifyContent: "space-between", alignItems: "center" } }, React.createElement("button", { onClick: () => setOrderOpen(false), style: { padding: "8px 14px", fontSize: "13px", fontWeight: 700, borderRadius: "12px", cursor: "pointer", border: `1px solid ${T.border}`, background: "transparent", color: T.inkSoft } }, "Cancelar"), React.createElement("button", { onClick: () => { const ids = porPedirVisibles.filter((p) => orderPicked[p.id]).map((p) => p.id); if (ids.length && onMarkOrdered) onMarkOrdered(ids); setOrderOpen(false); setOrderPicked({}); }, disabled: Object.values(orderPicked).filter(Boolean).length === 0, style: { padding: "8px 18px", fontSize: "13.5px", fontWeight: 700, borderRadius: "12px", cursor: Object.values(orderPicked).filter(Boolean).length === 0 ? "default" : "pointer", border: "none", background: Object.values(orderPicked).filter(Boolean).length === 0 ? T.border : "#15803D", color: "#fff" } }, "Marcar como pedido (" + Object.values(orderPicked).filter(Boolean).length + ")")))), suggestOpen && /* @__PURE__ */ React.createElement("div", { onClick: () => setSuggestOpen(false), style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      zIndex: 1e3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    } }, /* @__PURE__ */ React.createElement("div", { onClick: (e) => e.stopPropagation(), style: {
      background: T.bg,
      borderRadius: "18px",
      width: "100%",
      maxWidth: "680px",
      maxHeight: "85vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 20px", borderBottom: `1px solid ${T.border}` } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "17px", fontWeight: 700, color: T.ink, fontFamily: F.display } }, "\u{1F4A1} Sugerencias de recambios"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft, marginTop: "3px" } }, "Da\xF1os nuevos cuya pieza ya conoc\xE9s. Eleg\xED el c\xF3digo correcto (una zona puede tener varias piezas: carcasa, cristal, piloto\u2026). Tild\xE1 los que quieras agregar.")), /* @__PURE__ */ React.createElement("div", { style: { overflowY: "auto", padding: "12px 16px", flex: 1 } }, suggestions.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "30px", textAlign: "center", color: T.inkFaint, fontSize: "14px" } }, "No hay sugerencias ahora mismo.") : suggestions.map((s) => {
      const on = suggestPicked[s.damageId];
      const choice = suggestChoice[s.damageId] === void 0 ? 0 : suggestChoice[s.damageId];
      return /* @__PURE__ */ React.createElement("div", { key: s.damageId, style: {
        padding: "10px 12px",
        marginBottom: "8px",
        borderRadius: "12px",
        border: `1px solid ${on ? "#0891b2" : T.border}`,
        background: on ? "rgba(8,145,178,0.06)" : T.surface
      } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "10px", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "checkbox",
          checked: !!on,
          onChange: () => setSuggestPicked((p) => ({ ...p, [s.damageId]: !p[s.damageId] })),
          style: { marginTop: "3px", accentColor: "#0891b2", cursor: "pointer" }
        }
      ), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 800, color: "#fff", background: T.rust, fontSize: "11px", padding: "2px 7px", borderRadius: "10px" } }, s.ac), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: T.ink, fontSize: "14.5px" } }, s.zona), s.tipoDano && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11px", color: T.inkSoft, background: T.bgAlt, padding: "1px 6px", borderRadius: "10px" } }, s.tipoDano), s.multiple && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "10px", fontWeight: 700, color: "#B45309", background: "#FEF3C7", padding: "1px 6px", borderRadius: "10px" } }, s.opciones.length, " piezas posibles \u2014 eleg\xED")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "8px", display: "flex", flexDirection: "column", gap: "5px" } }, s.opciones.map((op, i) => {
        const sel = choice === i;
        return /* @__PURE__ */ React.createElement(
          "div",
          {
            key: i,
            onClick: () => {
              setSuggestChoice((c) => ({ ...c, [s.damageId]: i }));
              setSuggestPicked((p) => ({ ...p, [s.damageId]: true }));
            },
            style: {
              padding: "7px 10px",
              borderRadius: "12px",
              cursor: "pointer",
              border: `1.5px solid ${sel ? "#0891b2" : T.border}`,
              background: sel ? "rgba(8,145,178,0.08)" : T.bg
            }
          },
          /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "7px" } }, /* @__PURE__ */ React.createElement("span", { style: { width: "13px", height: "13px", borderRadius: "50%", flexShrink: 0, border: `2px solid ${sel ? "#0891b2" : T.inkFaint}`, background: sel ? "#0891b2" : "transparent" } }), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: F.mono, fontWeight: 700, fontSize: "13px", color: T.ink } }, op.codigo || "(sin c\xF3digo)"), op.descripcion && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11.5px", color: T.inkSoft } }, "\xB7 ", op.descripcion), /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", fontSize: "9.5px", fontWeight: 700, color: op.via === "ac" ? "#15803D" : "#0891b2" } }, op.via === "ac" ? "este AC" : "mismo modelo")),
          op.notas && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10.5px", color: T.inkFaint, fontStyle: "italic", marginTop: "2px", marginLeft: "20px" } }, op.notas)
        );
      }), /* @__PURE__ */ React.createElement(
        "div",
        {
          onClick: () => {
            setSuggestChoice((c) => ({ ...c, [s.damageId]: "nueva" }));
            setSuggestPicked((p) => ({ ...p, [s.damageId]: true }));
          },
          style: {
            padding: "7px 10px",
            borderRadius: "12px",
            cursor: "pointer",
            border: `1.5px dashed ${choice === "nueva" ? "#0891b2" : T.border}`,
            background: choice === "nueva" ? "rgba(8,145,178,0.08)" : "transparent",
            display: "flex",
            alignItems: "center",
            gap: "7px"
          }
        },
        /* @__PURE__ */ React.createElement("span", { style: { width: "13px", height: "13px", borderRadius: "50%", flexShrink: 0, border: `2px solid ${choice === "nueva" ? "#0891b2" : T.inkFaint}`, background: choice === "nueva" ? "#0891b2" : "transparent" } }),
        /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11.5px", color: T.inkSoft, fontWeight: 600 } }, "+ Es otra pieza (cargar c\xF3digo nuevo a mano)")
      )))));
    })), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", borderTop: `1px solid ${T.border}`, display: "flex", gap: "8px", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
      const rechazados = suggestions.filter((s) => !suggestPicked[s.damageId]).map((s) => s.damageId);
      if (rechazados.length) onDismissSuggestions(rechazados);
      setSuggestOpen(false);
      setSuggestChoice({});
    }, style: {
      padding: "8px 14px",
      fontSize: "13px",
      fontWeight: 700,
      borderRadius: "12px",
      cursor: "pointer",
      border: `1px solid ${T.border}`,
      background: "transparent",
      color: T.inkSoft
    } }, "Descartar no tildados"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      const aceptados = suggestions.filter((s) => suggestPicked[s.damageId]).map((s) => {
        const choice = suggestChoice[s.damageId] === void 0 ? 0 : suggestChoice[s.damageId];
        if (choice === "nueva") {
          return { damageId: s.damageId, ac: s.ac, modelo: s.modelo, zona: s.zona, tipoDano: s.tipoDano, codigo: "", descripcion: "", notas: "", via: null };
        }
        const op = s.opciones[choice] || s.opciones[0];
        return { damageId: s.damageId, ac: s.ac, modelo: s.modelo, zona: s.zona, tipoDano: s.tipoDano, codigo: op.codigo, descripcion: op.descripcion, notas: op.notas, via: op.via };
      });
      if (aceptados.length) onAcceptSuggestions(aceptados);
      setSuggestOpen(false);
      setSuggestChoice({});
    }, disabled: Object.values(suggestPicked).filter(Boolean).length === 0, style: {
      padding: "8px 18px",
      fontSize: "13.5px",
      fontWeight: 700,
      borderRadius: "12px",
      cursor: "pointer",
      border: "none",
      background: "#0891b2",
      color: "#fff"
    } }, "Agregar ", Object.values(suggestPicked).filter(Boolean).length, " a recambios")))), pickerOpen && /* @__PURE__ */ React.createElement("div", { onClick: () => setPickerOpen(false), style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      zIndex: 1e3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    } }, /* @__PURE__ */ React.createElement("div", { onClick: (e) => e.stopPropagation(), style: {
      background: T.bg,
      borderRadius: "18px",
      width: "100%",
      maxWidth: "640px",
      maxHeight: "85vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 20px", borderBottom: `1px solid ${T.border}` } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "17px", fontWeight: 700, color: T.ink, fontFamily: F.display } }, "Traer piezas del cockpit"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft, marginTop: "3px" } }, "Tild\xE1 los da\xF1os activos que necesitan repuesto. Los que ya agregaste aparecen atenuados.")), /* @__PURE__ */ React.createElement("div", { style: { overflowY: "auto", padding: "12px 16px", flex: 1 } }, activeDamagesByVehicle.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "30px", textAlign: "center", color: T.inkFaint, fontSize: "14px" } }, "No hay da\xF1os activos en la flota.") : activeDamagesByVehicle.map((g) => /* @__PURE__ */ React.createElement("div", { key: g.ac, style: { marginBottom: "14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: T.ink, fontSize: "14px" } }, g.ac), /* @__PURE__ */ React.createElement("span", { style: { color: T.inkFaint, fontSize: "11px" } }, g.modelo), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      const allOn = g.items.filter((d) => !d._alreadyAdded).every((d) => picked[d.id]);
      setPicked((prev) => {
        const n = { ...prev };
        g.items.forEach((d) => {
          if (!d._alreadyAdded) n[d.id] = !allOn;
        });
        return n;
      });
    }, style: { marginLeft: "auto", fontSize: "10.5px", color: T.rust, background: "none", border: "none", cursor: "pointer", fontWeight: 700 } }, "todos / ninguno")), g.items.map((d) => /* @__PURE__ */ React.createElement("label", { key: d.id, style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "5px 8px",
      fontSize: "13px",
      cursor: d._alreadyAdded ? "default" : "pointer",
      opacity: d._alreadyAdded ? 0.45 : 1,
      borderRadius: "10px",
      background: picked[d.id] ? "#FEF1E1" : "transparent"
    } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        disabled: d._alreadyAdded,
        checked: !!picked[d.id],
        onChange: (e) => setPicked((prev) => ({ ...prev, [d.id]: e.target.checked })),
        style: { width: "15px", height: "15px", accentColor: T.rust }
      }
    ), /* @__PURE__ */ React.createElement("span", { style: { color: T.ink } }, d.zona || d.description || "Da\xF1o"), d.tipoDano && /* @__PURE__ */ React.createElement("span", { style: { color: T.inkFaint, fontSize: "11px" } }, "(", d.tipoDano, ")"), d._asumido && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "9.5px", color: "#5B6B82", fontWeight: 700, background: "#EDEFF3", padding: "1px 5px", borderRadius: "10px" } }, "asumido"), d.requierePiezas && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "10px", color: T.rust, fontWeight: 700 } }, "\u{1F527} requiere pieza"), d._alreadyAdded && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", fontSize: "10px", color: T.inkFaint } }, "ya agregado"), d.pdfCode && !d._alreadyAdded && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", fontFamily: F.mono, fontSize: "9.5px", color: T.inkFaint } }, d.pdfCode)))))), /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 20px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "flex-end", gap: "10px" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setPickerOpen(false);
      setPicked({});
    }, style: {
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: 600,
      borderRadius: "12px",
      border: `1px solid ${T.border}`,
      background: "transparent",
      color: T.inkSoft,
      cursor: "pointer"
    } }, "Cancelar"), /* @__PURE__ */ React.createElement("button", { onClick: confirmPicker, disabled: Object.values(picked).filter(Boolean).length === 0, style: {
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: 700,
      borderRadius: "12px",
      border: "none",
      background: Object.values(picked).filter(Boolean).length === 0 ? T.border : T.rust,
      color: "#fff",
      cursor: Object.values(picked).filter(Boolean).length === 0 ? "default" : "pointer"
    } }, "Agregar ", Object.values(picked).filter(Boolean).length || "", " a recambios")))));
  };
  const weekRangeLabel = (offset) => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - offset * 7);
    const dow = (d.getDay() + 6) % 7;
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dow);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const f = (x, withYear) => x.toLocaleDateString(
      "es-ES",
      withYear ? { day: "2-digit", month: "short", year: "numeric" } : { day: "2-digit", month: "short" }
    );
    return `${f(start)} \u2013 ${f(end, true)}`;
  };
  function buildWeeklyReportHTML({ damages, vehicles, quantHistory, weeks, offset = 0, sedes }) {
    const vehById = {};
    for (const v of vehicles) vehById[v.id] = v;
    const detectionDate = (d) => d.detectedAt || d.importedAt || d.createdAt || null;
    const inSede = (d) => {
      if (!sedes || sedes.length === 0) return true;
      const v = vehById[d.vehicleId];
      return v && sedes.includes(v.location);
    };
    const budgetDate = (b) => b.fecha || b.savedAt || "";
    const pieceTotal = (p) => {
      if (p.draft) return 0;
      if (typeof p.total === "number" && p.total > 0) return p.total;
      const h = parseFloat(p.horas) || 0;
      const pvr = parseFloat(p.pvrProveedor) || 0;
      const pvrEf = pvr * parcialFactor(p);
      return (pvrEf + h * 25) * 1.21;
    };
    const budgetTotal = (b) => {
      const pSum = (b.piezas || []).reduce((s, p) => s + pieceTotal(p), 0);
      const eSum = ["chapa", "toldos", "antenas", "fabricante", "combustible", "otros"].reduce((s, k) => s + (b[k] || []).reduce((ss, x) => ss + (x.precioConIva || 0), 0), 0);
      return pSum + eSum + (pSum > 0 || eSum > 0 ? 12.5 * 1.21 : 0);
    };
    const budgetSede = (b) => {
      const ac = (b.vehicle?.ac || "").toString();
      const v = vehicles.find((x) => (x.id || "").replace(/[^0-9]/g, "") === ac.replace(/[^0-9]/g, ""));
      return v?.location || null;
    };
    const inSedeBudget = (b) => {
      if (!sedes || sedes.length === 0) return true;
      return sedes.includes(budgetSede(b));
    };
    const fmtMoney2 = (n) => (n || 0).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "\u20AC";
    const now = /* @__PURE__ */ new Date();
    const pages = [];
    for (let w = 0; w < weeks + 1; w++) {
      const d = new Date(now);
      d.setDate(d.getDate() - (w + offset) * 7);
      const dow = (d.getDay() + 6) % 7;
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dow);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      const endShow = new Date(end);
      endShow.setDate(endShow.getDate() - 1);
      const startIso = start.toISOString(), endIso = end.toISOString();
      const label = `${start.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })} \u2013 ${endShow.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}`;
      const wkDamages = damages.filter((dm) => {
        const dt = detectionDate(dm);
        return dt && dt >= startIso && dt < endIso && inSede(dm);
      });
      const wkBudgets = (quantHistory || []).filter((b) => {
        const bd = budgetDate(b);
        return bd && bd >= startIso.slice(0, 10) && bd < endIso.slice(0, 10) && inSedeBudget(b);
      });
      const grav = { GRAVE: 0, MODERADO: 0, LEVE: 0 };
      wkDamages.forEach((dm) => {
        if (grav[dm.gravedad] !== void 0) grav[dm.gravedad]++;
      });
      const reparados = wkDamages.filter((dm) => damageRepair(dm) === "REPARADO").length;
      const detectados = wkDamages.length;
      const reqPiezas = wkDamages.filter((dm) => dm.requierePiezas === true).length;
      const cuant = wkBudgets.reduce((s, b) => s + budgetTotal(b), 0);
      const countByKey = (arr, keyFn, limit = 8) => {
        const m = {};
        arr.forEach((x) => {
          const k = keyFn(x);
          if (k == null || k === "") return;
          m[k] = (m[k] || 0) + 1;
        });
        return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, limit);
      };
      const byModel = countByKey(wkDamages, (dm) => {
        const v = vehById[dm.vehicleId];
        return v ? `${v.brand || ""} ${v.model || ""}`.trim() || "Sin modelo" : "Sin veh\xEDculo";
      });
      const byVeh = countByKey(wkDamages, (dm) => dm.vehicleId);
      const byZona = countByKey(wkDamages, (dm) => dm.zona);
      const byTipo = countByKey(wkDamages, (dm) => dm.tipoDano);
      const cargo = { CUANTIFICADO: 0, ASUMIDO: 0, NUEVO: 0 };
      wkDamages.forEach((dm) => {
        const c = damageCargo(dm);
        if (cargo[c] !== void 0) cargo[c]++;
      });
      const budgetList = wkBudgets.map((b) => ({
        ac: b.vehicle?.ac || "\u2014",
        total: budgetTotal(b),
        fecha: (b.fecha || b.savedAt || "").slice(0, 10)
      })).sort((a, b) => b.total - a.total);
      const uniqueVehicles = new Set(wkDamages.map((dm) => dm.vehicleId)).size;
      const avgPerVeh = uniqueVehicles > 0 ? detectados / uniqueVehicles : 0;
      const pctReqPiezas = detectados > 0 ? Math.round(reqPiezas / detectados * 100) : 0;
      const pctReparados = detectados > 0 ? Math.round(reparados / detectados * 100) : 0;
      const avgBudget = wkBudgets.length > 0 ? cuant / wkBudgets.length : 0;
      pages.push({
        label,
        detectados,
        reparados,
        reqPiezas,
        cuant,
        grav,
        byModel,
        byVeh,
        byZona,
        byTipo,
        cargo,
        budgetList,
        nBudgets: wkBudgets.length,
        avgPerVeh,
        pctReqPiezas,
        pctReparados,
        avgBudget,
        uniqueVehicles
      });
    }
    pages.forEach((p, i) => {
      const prev = pages[i + 1];
      p.delta = prev ? {
        detectados: p.detectados - prev.detectados,
        cuant: p.cuant - prev.cuant,
        reparados: p.reparados - prev.reparados
      } : null;
    });
    const sedeLabel = !sedes || sedes.length === 0 ? "Todas las sedes" : sedes.join(" + ");
    const genDate = now.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
    const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const donutSVG = (segments, size = 128) => {
      const total = segments.reduce((s, d) => s + d.value, 0);
      if (total === 0) return '<div style="font-size:12px;color:#999;font-style:italic;padding:20px 0">Sin datos esta semana</div>';
      const r = size / 2, cx = r, cy = r, stroke = size * 0.22, radius = r - stroke / 2;
      const circ = 2 * Math.PI * radius;
      let offset2 = 0;
      const circles = segments.filter((s) => s.value > 0).map((s) => {
        const frac = s.value / total;
        const dash = frac * circ;
        const dashoffset = -offset2 * circ;
        offset2 += frac;
        return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${s.color}" stroke-width="${stroke}" stroke-dasharray="${dash} ${circ - dash}" stroke-dashoffset="${dashoffset}"/>`;
      }).join("");
      const legend = segments.filter((s) => s.value > 0).map((s) => {
        const pct = Math.round(s.value / total * 100);
        return `<div style="display:flex;align-items:center;gap:7px;font-size:11.5px;margin-bottom:5px">
        <span style="width:10px;height:10px;border-radius:2px;background:${s.color};flex-shrink:0"></span>
        <span>${esc(s.label)}</span>
        <span style="color:#666;font-family:monospace">${s.value} (${pct}%)</span>
      </div>`;
      }).join("");
      return `<div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">
      <svg width="${size}" height="${size}" style="transform:rotate(-90deg);flex-shrink:0">
        ${circles}
        <circle cx="${cx}" cy="${cy}" r="${radius - stroke / 2 - 2}" fill="#fff"/>
      </svg>
      <div>${legend}</div>
    </div>`;
    };
    const barsSVG = (rows, color = "#3B5BFF") => {
      if (!rows.length) return '<div style="font-size:12px;color:#999;font-style:italic;padding:10px 0">Sin datos esta semana</div>';
      const max = Math.max(...rows.map((r) => r[1]));
      return '<div style="display:flex;flex-direction:column;gap:6px">' + rows.map(([label, val]) => {
        const w = max > 0 ? val / max * 100 : 0;
        return `<div style="display:flex;align-items:center;gap:8px;font-size:11.5px">
        <span style="width:130px;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(label)}</span>
        <span style="flex:1;background:#eee;border-radius:3px;height:14px;position:relative">
          <span style="position:absolute;left:0;top:0;height:100%;width:${w}%;background:${color};border-radius:3px"></span>
        </span>
        <span style="width:28px;text-align:right;font-weight:700;font-family:monospace">${val}</span>
      </div>`;
      }).join("") + "</div>";
    };
    const pageHtml = pages.slice(0, weeks).map((p, i) => {
      const gravSegs = [
        { label: "Graves", value: p.grav.GRAVE, color: "#dc2626" },
        { label: "Moderados", value: p.grav.MODERADO, color: "#B45309" },
        { label: "Leves", value: p.grav.LEVE, color: "#1E4D2E" }
      ];
      const repairSegs = [
        { label: "Reparados", value: p.reparados, color: "#1E4D2E" },
        { label: "Pendientes", value: Math.max(0, p.detectados - p.reparados), color: "#F59E0B" }
      ];
      const cargoSegs = [
        { label: "Cobrado al cliente", value: p.cargo.CUANTIFICADO, color: "#1E4D2E" },
        { label: "Asumido por AC-LLAR", value: p.cargo.ASUMIDO, color: "#5B6B82" },
        { label: "Sin decidir", value: p.cargo.NUEVO, color: "#F59E0B" }
      ];
      const deltaChip = (val, label, invert) => {
        if (p.delta === null) return "";
        const up = val > 0, flat = val === 0;
        const good = invert ? !up : up;
        const color = flat ? "#5B6B82" : good ? "#1E4D2E" : "#dc2626";
        const arrow = flat ? "=" : up ? "\u25B2" : "\u25BC";
        const shown = typeof val === "number" && !Number.isInteger(val) ? fmtMoney2(Math.abs(val)) : Math.abs(val);
        return `<span style="font-size:10px;color:${color};font-weight:700">${arrow} ${shown} ${label}</span>`;
      };
      const budgetRows = p.budgetList.length ? p.budgetList.map((b) => `<tr>
          <td style="font-weight:700">AC-${esc(b.ac)}</td>
          <td style="color:#8A7B68;font-size:10.5px">${esc(b.fecha)}</td>
          <td style="text-align:right;font-weight:700;font-family:monospace">${fmtMoney2(b.total)}</td>
        </tr>`).join("") : '<tr><td colspan="3" style="color:#999;font-style:italic">Sin presupuestos esta semana</td></tr>';
      return `
    <div class="page" style="${i > 0 ? "page-break-before:always;" : ""}">
      <div class="hdr">
        <div><div class="brand">AC\xB7LLAR</div><div class="sub">vacaciones en autocaravana</div></div>
        <div><div class="title">INFORME SEMANAL</div><div class="meta">${p.label}<br>${sedeLabel}</div></div>
      </div>

      <div class="kpis">
        <div class="kpi">
          <div class="kn">${p.detectados}</div><div class="kl">Da\xF1os detectados</div>
          ${deltaChip(p.delta?.detectados ?? 0, "vs sem. ant.", true)}
        </div>
        <div class="kpi">
          <div class="kn">${p.reparados}</div><div class="kl">Reparados (${p.pctReparados}%)</div>
          ${deltaChip(p.delta?.reparados ?? 0, "vs sem. ant.", false)}
        </div>
        <div class="kpi"><div class="kn">${p.reqPiezas}</div><div class="kl">Requieren pieza (${p.pctReqPiezas}%)</div></div>
        <div class="kpi kpi-money">
          <div class="kn">${fmtMoney2(p.cuant)}</div><div class="kl">Cuantificado \xB7 ${p.nBudgets} ppto${p.nBudgets !== 1 ? "s" : ""}</div>
          ${deltaChip(p.delta?.cuant ?? 0, "vs sem. ant.", false)}
        </div>
      </div>

      <div class="metrics">
        <span><b>${p.uniqueVehicles}</b> veh\xEDculos afectados</span>
        <span><b>${p.avgPerVeh.toFixed(1)}</b> da\xF1os por veh\xEDculo</span>
        <span><b>${fmtMoney2(p.avgBudget)}</b> presupuesto medio</span>
      </div>

      <div class="charts">
        <div class="chart"><h3>Da\xF1os por gravedad</h3>${donutSVG(gravSegs, 112)}</div>
        <div class="chart"><h3>Estado de reparaci\xF3n</h3>${donutSVG(repairSegs, 112)}</div>
      </div>

      <div class="charts">
        <div class="chart"><h3>\xBFQui\xE9n asume el coste?</h3>${donutSVG(cargoSegs, 112)}</div>
        <div class="chart"><h3>Presupuestos de la semana</h3>
          <table class="tbl"><tbody>${budgetRows}</tbody></table>
          ${p.budgetList.length ? `<div style="margin-top:8px;padding-top:7px;border-top:1px solid #E5D9C8;display:flex;justify-content:space-between;font-size:11.5px;font-weight:700"><span>Total</span><span style="font-family:monospace;color:#1E4D2E">${fmtMoney2(p.cuant)}</span></div>` : ""}
        </div>
      </div>

      <div class="charts">
        <div class="chart"><h3>Da\xF1os por zona del veh\xEDculo</h3>${barsSVG(p.byZona, "#7c3aed")}</div>
        <div class="chart"><h3>Da\xF1os por tipo</h3>${barsSVG(p.byTipo, "#0891b2")}</div>
      </div>

      <div class="charts">
        <div class="chart"><h3>Da\xF1os por modelo</h3>${barsSVG(p.byModel, "#B45309")}</div>
        <div class="chart"><h3>Veh\xEDculos con m\xE1s da\xF1os</h3>${barsSVG(p.byVeh, "#A8350F")}</div>
      </div>

      <div class="foot"><span>AC-LLAR \xB7 Informe semanal \xB7 ${sedeLabel}</span><span>Generado: ${genDate}</span></div>
    </div>`;
    }).join("");
    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Informe semanal AC-LLAR</title>
<style>
  body{font-family:'Inter Tight',-apple-system,'Segoe UI',sans-serif;color:#2A2420;margin:0;padding:0;font-size:13px;background:#F5F0E8}
  .page{padding:32px 36px;max-width:820px;margin:0 auto;min-height:96vh;box-sizing:border-box;background:#FFFDF9}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2.5px solid #A8350F;padding-bottom:12px}
  .brand{font-size:24px;font-weight:800;letter-spacing:1px;color:#A8350F}
  .sub{font-size:11px;color:#8A7B68}
  .title{font-size:18px;font-weight:800;text-align:right;color:#2A2420}
  .meta{font-size:11px;color:#8A7B68;text-align:right;line-height:1.5;margin-top:2px}
  .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:20px 0 12px}
  .kpi{border:1px solid #E5D9C8;border-radius:8px;padding:13px 10px;text-align:center;background:#fff}
  .kpi-money{border-color:#1E4D2E}
  .kn{font-size:22px;font-weight:800;color:#A8350F;line-height:1.15}
  .kpi-money .kn{color:#1E4D2E;font-size:18px}
  .kl{font-size:9.5px;color:#8A7B68;text-transform:uppercase;letter-spacing:0.04em;margin:5px 0 3px;line-height:1.3}
  .metrics{display:flex;gap:22px;justify-content:center;padding:9px 14px;background:#fff;border:1px solid #E5D9C8;border-radius:8px;font-size:11.5px;color:#5A4F44;margin-bottom:16px;flex-wrap:wrap}
  .metrics b{color:#A8350F;font-size:13px}
  .charts{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
  .chart{border:1px solid #E5D9C8;border-radius:8px;padding:14px;background:#fff}
  h3{font-size:11.5px;font-weight:700;color:#2A2420;margin:0 0 11px}
  .tbl{width:100%;border-collapse:collapse;font-size:11.5px}
  .tbl td{padding:4px 3px;border-bottom:1px solid #F0EAE0}
  .foot{margin-top:20px;font-size:10px;color:#B0A48F;border-top:1px solid #E5D9C8;padding-top:8px;display:flex;justify-content:space-between}
  @media print{body{background:#fff}.page{min-height:auto;background:#fff}}
</style></head><body>${pageHtml}</body></html>`;
  }
  function buildTotalReportHTML({ damages, vehicles, quantHistory, sedes, yoy, depositLog, reviewLog, leftUnreviewedLog }) {
    const vehById = {};
    for (const v of vehicles) vehById[v.id] = v;
    const pieceTotal = (p) => {
      if (p.draft) return 0;
      if (typeof p.total === "number" && p.total > 0) return p.total;
      const h = parseFloat(p.horas) || 0;
      const pvr = parseFloat(p.pvrProveedor) || 0;
      const pvrEf = pvr * parcialFactor(p);
      return (pvrEf + h * 25) * 1.21;
    };
    const budgetTotal = (b) => {
      const pSum = (b.piezas || []).reduce((s, p) => s + pieceTotal(p), 0);
      const eSum = ["chapa", "toldos", "antenas", "fabricante", "combustible", "otros"].reduce((s, k) => s + (b[k] || []).reduce((ss, x) => ss + (x.precioConIva || 0), 0), 0);
      return pSum + eSum + (pSum > 0 || eSum > 0 ? 12.5 * 1.21 : 0);
    };
    const fmtMoney2 = (n) => (n || 0).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "\u20AC";
    const fmtDShort = (d) => !d ? "\u2014" : `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    const fmtDur2 = (h) => { if (h == null || isNaN(h)) return "\u2014"; if (h < 1) return `${Math.round(h * 60)}min`; if (h < 24) return `${h.toFixed(1)}h`; return `${(h / 24).toFixed(1)}d`; };
    // === Ventanas ===
    const now = new Date();
    const winSem = yoy?.windows?.semanaAct || null;
    const winMes = yoy?.windows?.mesAct || null;
    const winSemLY = yoy?.windows?.semanaLY || null;
    const winSemPrev = yoy?.windows?.semanaPrev || null;
    // Fallback si no hay yoy
    const semStart = winSem?.start || new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
    const semEnd = winSem?.end || now;
    // === Presupuestos Valencia de la semana ===
    // Los IDs de vehículo pueden venir con o sin prefijo "AC-"/"CB-":
    //  - En `vehicles` están como "AC-267", "AC-10A", "CB-001"
    //  - En quantHistory del cuantificador vienen como "267", "10A", "289A" (sin prefijo)
    // Normalizo ambos a la forma canónica con prefijo antes de comparar.
    const normalizeAcId = (s) => {
      if (!s) return "";
      let t = String(s).toUpperCase().trim();
      if (!t) return "";
      // Si empieza con dígito, asumir AC- (la flota de Sebastián son mayormente AC-XXX)
      if (/^\d/.test(t)) t = "AC-" + t;
      // Normalizar separador: "AC317" o "AC 317" -> "AC-317"
      t = t.replace(/^(AC|CB)[-\s]?/, (_m, p) => p + "-");
      return t;
    };
    // Para MATCH contra la flota: extraigo solo prefijo + parte numérica (sin letra final).
    // Esto permite que "284" del historial matchee con "AC-284A" de la flota, o "299" con "AC-299C".
    // Basado en la regla de Sebastián: la letra A/C al final indica sede (Alicante/Castellón) o
    // es histórica, pero el "número" identifica al vehículo. No hay ambigüedad porque no
    // conviven en la flota AC-284 y AC-284A al mismo tiempo.
    const matchKey = (s) => {
      const norm = normalizeAcId(s);
      const m = norm.match(/^(AC|CB)-(\d+)/);
      return m ? `${m[1]}-${m[2]}` : norm;
    };
    // Devuelve el vehículo de la flota que corresponde al AC dado (matching tolerante).
    const findVehicle = (rawAc) => {
      const key = matchKey(rawAc);
      if (!key) return null;
      return vehicles.find((x) => matchKey(x.id) === key) || null;
    };
    // "budget de Valencia" = AC que exista en vehículos con location = Valencia.
    // Si no encuentra el vehículo, NO lo cuenta (evita inflar el acumulado con vehículos dados de baja).
    const isValenciaAc = (ac) => {
      const v = findVehicle(ac);
      if (!v) return false;
      return String(v.location || "").trim().toLowerCase() === "valencia";
    };
    const budgetDate = (b) => new Date(b.fecha || b.savedAt || 0);
    const semBudgets = (quantHistory || []).filter((b) => {
      const d = budgetDate(b);
      const ac = b.vehicle?.ac || "";
      return d >= semStart && d <= semEnd && isValenciaAc(ac);
    }).sort((a, b) => budgetDate(a) - budgetDate(b));
    const semCuant = semBudgets.reduce((s, b) => s + budgetTotal(b), 0);
    // Total semana en TODAS las sedes (cockpit): refleja todo el trabajo de Sebastián, no solo Valencia
    const semBudgetsTotal = (quantHistory || []).filter((b) => {
      const d = budgetDate(b);
      return d >= semStart && d <= semEnd;
    }).sort((a, b) => budgetDate(a) - budgetDate(b));
    const semCuantTotal = semBudgetsTotal.reduce((s, b) => s + budgetTotal(b), 0);
    // === Acumulado desde 18 mayo 2026 (Valencia) ===
    const startPuesto = new Date(2026, 4, 18);
    const acumBudgets = (quantHistory || []).filter((b) => budgetDate(b) >= startPuesto && isValenciaAc(b.vehicle?.ac || ""));
    const acumCuant = acumBudgets.reduce((s, b) => s + budgetTotal(b), 0);
    const acumPres = acumBudgets.length;
    // Total en TODAS las sedes (para dar contexto del volumen total del trabajo de Sebastián)
    const acumBudgetsTotal = (quantHistory || []).filter((b) => budgetDate(b) >= startPuesto);
    const acumCuantTotal = acumBudgetsTotal.reduce((s, b) => s + budgetTotal(b), 0);
    const acumPresTotal = acumBudgetsTotal.length;
    // Recaudado desde 18/5 - de yoy ingresos 2026 Valencia
    const ingRows = yoy?.ingresos2026Rows || [];
    const acumRecaudado = ingRows.filter((r) => new Date(r.fecha) >= startPuesto && (r.sede || "").toLowerCase() === "valencia").reduce((s, r) => s + (r.totalEntrante || 0), 0);
    const acumRecaudCount = ingRows.filter((r) => new Date(r.fecha) >= startPuesto && (r.sede || "").toLowerCase() === "valencia").length;
    const ratioRec = acumCuant > 0 ? (acumRecaudado / acumCuant) * 100 : null;
    // === Tiempos - Valencia (todo el flujo, promedio semana vs general) ===
    const stat = (arr, key) => {
      const hs = arr.map((e) => e[key]).filter((h) => typeof h === "number" && h >= 0).sort((a, b) => a - b);
      const n = hs.length;
      if (n === 0) return { n: 0, prom: null };
      return { n, prom: hs.reduce((a, b) => a + b, 0) / n };
    };
    const inWeekDep = (e) => { const d = new Date(e.at); return d >= semStart && d <= semEnd; };
    const inWeekRev = (e) => { const d = new Date(e.reviewStartedAt); return d >= semStart && d <= semEnd; };
    const rLog = Array.isArray(reviewLog) ? reviewLog : [];
    const dLog = Array.isArray(depositLog) ? depositLog : [];
    const revSem = stat(rLog.filter(inWeekRev), "horas");
    const revGen = stat(rLog, "horas");
    const presSem = stat(dLog.filter((e) => e.tipo === "presupuesto" && inWeekDep(e)), "horasDesdeLlegada");
    const presGen = stat(dLog.filter((e) => e.tipo === "presupuesto"), "horasDesdeLlegada");
    const fzSem = stat(dLog.filter((e) => e.tipo === "fianza" && inWeekDep(e)), "horasDesdeLlegada");
    const fzGen = stat(dLog.filter((e) => e.tipo === "fianza"), "horasDesdeLlegada");
    // === Datos HQ para las 3 sedes ===
    const rr = yoy?.resultsPorSede || {};
    const semVal = rr.Valencia?.semanaAct || { euros: 0, presupuestos: 0, devoluciones: 0, ticketMedio: 0, topAcs: [], cargosDetalle: [] };
    const semOni = rr.Onil?.semanaAct || { euros: 0, presupuestos: 0, devoluciones: 0, ticketMedio: 0 };
    const semCas = rr["Castell\xF3n"]?.semanaAct || { euros: 0, presupuestos: 0, devoluciones: 0, ticketMedio: 0 };
    const semValLY = rr.Valencia?.semanaLY || { euros: 0, presupuestos: 0, devoluciones: 0, ticketMedio: 0 };
    const semValPrev = rr.Valencia?.semanaPrev || { euros: 0, presupuestos: 0, devoluciones: 0, ticketMedio: 0 };
    const mesVal = rr.Valencia?.mesAct || { euros: 0, presupuestos: 0, devoluciones: 0, ticketMedio: 0 };
    const mesValLY = rr.Valencia?.mesLY || { euros: 0, presupuestos: 0, devoluciones: 0, ticketMedio: 0 };
    const sem3 = rr.TresSedes?.semanaAct || { euros: 0, presupuestos: 0, devoluciones: 0, ticketMedio: 0 };
    const sem3LY = rr.TresSedes?.semanaLY || { euros: 0, presupuestos: 0, devoluciones: 0, ticketMedio: 0 };
    const mes3 = rr.TresSedes?.mesAct || { euros: 0, presupuestos: 0, devoluciones: 0, ticketMedio: 0 };
    const mes3LY = rr.TresSedes?.mesLY || { euros: 0, presupuestos: 0, devoluciones: 0, ticketMedio: 0 };
    // === Deltas y color ===
    const deltaChip = (cur, prev, isMoney, higherIsBetter = true, label = "vs sem. ant.") => {
      if (prev == null || prev === 0) {
        if (cur === 0) return `<span style="color:#B0A48F;font-size:9.5px">${label}: 0</span>`;
        return `<span style="color:#15803D;font-size:9.5px;font-weight:700">${label}: nuevo</span>`;
      }
      const abs = cur - prev;
      const pct = (abs / prev) * 100;
      const goodDir = higherIsBetter ? (abs > 0) : (abs < 0);
      const isFlat = abs === 0;
      const color = isFlat ? "#5B6B82" : goodDir ? "#15803D" : "#B91C1C";
      const arrow = abs > 0 ? "\u25B2" : abs < 0 ? "\u25BC" : "=";
      const bg = isFlat ? "transparent" : goodDir ? "rgba(21,128,61,0.09)" : "rgba(185,28,28,0.09)";
      const fmtV = isMoney ? fmtMoney2(Math.abs(abs)) : String(Math.abs(abs));
      return `<span style="color:${color};font-size:10px;font-weight:700;background:${bg};padding:2px 6px;border-radius:4px;white-space:nowrap">${arrow} ${fmtV} (${abs >= 0 ? "+" : "\u2212"}${Math.abs(pct).toFixed(0)}%) ${label}</span>`;
    };
    // === Bloque 1: KPIs ejecutivos ===
    const kpiCards = `
      <div class="kpi-big" style="border-left:4px solid #A8350F">
        <div class="kpi-label">€ Recaudado semana</div>
        <div class="kpi-value">${fmtMoney2(semVal.euros)}</div>
        <div style="font-size:10px;color:#8A7E6B;margin-top:2px">Valencia · HQ</div>
        <div class="kpi-deltas">${deltaChip(semVal.euros, semValPrev.euros, true, true, "vs sem. ant.")} ${deltaChip(semVal.euros, semValLY.euros, true, true, "vs 2025 · Valencia")}</div>
      </div>
      <div class="kpi-big" style="border-left:4px solid #B45309">
        <div class="kpi-label">€ Cuantificado semana</div>
        <div class="kpi-value">${fmtMoney2(semCuant)}</div>
        <div style="font-size:10px;color:#8A7E6B;margin-top:2px">Valencia · Cockpit</div>
        <div style="margin-top:6px;padding-top:6px;border-top:1px solid #EFE7D5"><div style="font-size:13px;font-weight:700;color:#4A4038">${fmtMoney2(semCuantTotal)}</div><div style="font-size:10px;color:#8A7E6B">todas las sedes · actual 2026</div></div>
        <div style="font-size:9px;color:#B0A48F;margin-top:4px">Sin YoY: no existe histórico equivalente del Cockpit en 2025.</div>
      </div>
      <div class="kpi-big" style="border-left:4px solid #7C3FAF">
        <div class="kpi-label">Cargos cobrados semana</div>
        <div class="kpi-value">${semVal.presupuestos}</div>
        <div style="font-size:10px;color:#8A7E6B;margin-top:2px">Valencia · HQ</div>
        <div class="kpi-deltas">${deltaChip(semVal.presupuestos, semValPrev.presupuestos, false, true, "vs sem. ant.")} ${deltaChip(semVal.presupuestos, semValLY.presupuestos, false, true, "vs 2025 · Valencia")}</div>
      </div>
      <div class="kpi-big" style="border-left:4px solid #0891b2">
        <div class="kpi-label">Devoluciones completadas</div>
        <div class="kpi-value">${semVal.devoluciones}</div>
        <div style="font-size:10px;color:#8A7E6B;margin-top:2px">Valencia · HQ</div>
        <div class="kpi-deltas">${deltaChip(semVal.devoluciones, semValPrev.devoluciones, false, true, "vs sem. ant.")} ${deltaChip(semVal.devoluciones, semValLY.devoluciones, false, true, "vs 2025 · Valencia")}</div>
      </div>
      <div style="grid-column:1/-1;margin-top:-2px;padding:8px 10px;background:#F7F2E9;border:1px solid #E5D9C8;border-radius:6px">
        <div style="font-size:10px;font-weight:800;color:#1E4D2E;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">3 sedes comparables · Valencia + Onil + Castellón · Alicante excluida del YoY</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;font-size:10px">
          <div><span style="color:#8A7E6B">€ Recaudado</span><br><b>${fmtMoney2(sem3.euros)}</b> ${deltaChip(sem3.euros, sem3LY.euros, true, true, "vs 2025")}</div>
          <div><span style="color:#8A7E6B">Cargos cobrados</span><br><b>${sem3.presupuestos}</b> ${deltaChip(sem3.presupuestos, sem3LY.presupuestos, false, true, "vs 2025")}</div>
          <div><span style="color:#8A7E6B">Devoluciones</span><br><b>${sem3.devoluciones}</b> ${deltaChip(sem3.devoluciones, sem3LY.devoluciones, false, true, "vs 2025")}</div>
          <div><span style="color:#8A7E6B">Ticket medio</span><br><b>${sem3.presupuestos > 0 ? fmtMoney2(sem3.ticketMedio) : "—"}</b> ${sem3.presupuestos > 0 && sem3LY.presupuestos > 0 ? deltaChip(sem3.ticketMedio, sem3LY.ticketMedio, true, true, "vs 2025") : ""}</div>
        </div>
      </div>
    `;
    // === Bloque 2: Cuantificación semana ===
    // Helper: identificar sede de un vehículo por AC
    const sedeDeAc = (rawAc) => {
      const v = findVehicle(rawAc);
      return v?.location || "\u2014";
    };
    const cuantRows = semBudgetsTotal.map((b) => {
      const rawAc = b.vehicle?.ac || "";
      const veh = findVehicle(rawAc);
      // Muestro el ID canónico de la flota si lo encuentro (ej. "AC-284A" en vez de "AC-284"),
      // así el usuario ve el AC real y no la versión abreviada que quedó en el historial.
      const ac = veh?.id || normalizeAcId(rawAc) || "\u2014";
      const sede = veh?.location || "\u2014";
      const titularRaw = b.vehicle?.titular || b.titular;
      let cliente = "\u2014";
      if (typeof titularRaw === "string" && titularRaw.trim()) cliente = titularRaw;
      else if (titularRaw && typeof titularRaw === "object") {
        cliente = titularRaw.cliente || titularRaw.nombre || titularRaw.name || "\u2014";
      }
      cliente = String(cliente).slice(0, 40);
      const fecha = fmtDShort(budgetDate(b));
      const total = budgetTotal(b);
      const sedeBg = sede.toLowerCase() === "valencia" ? "#DBEAFE" : sede.toLowerCase() === "onil" ? "#DCFCE7" : sede.toLowerCase() === "castell\xF3n" ? "#FEE2E2" : sede.toLowerCase() === "alicante" ? "#FEF3C7" : "#F3F4F6";
      const sedeCol = sede.toLowerCase() === "valencia" ? "#1E40AF" : sede.toLowerCase() === "onil" ? "#166534" : sede.toLowerCase() === "castell\xF3n" ? "#991B1B" : sede.toLowerCase() === "alicante" ? "#78350F" : "#4B5563";
      return `<tr><td>${ac}</td><td><span style="font-size:9.5px;font-weight:700;padding:1px 6px;border-radius:4px;background:${sedeBg};color:${sedeCol}">${sede}</span></td><td>${cliente}</td><td>${fecha}</td><td style="text-align:right;font-weight:700">${fmtMoney2(total)}</td></tr>`;
    }).join("") || `<tr><td colspan="5" style="text-align:center;color:#8A7E6B;padding:10px;font-style:italic">Sin presupuestos emitidos en la semana</td></tr>`;
    const cuantBlock = `
      <table class="tbl">
        <thead><tr><th>AC</th><th>Sede</th><th>Cliente</th><th>Fecha</th><th style="text-align:right">Cuantificado</th></tr></thead>
        <tbody>${cuantRows}</tbody>
        ${semBudgetsTotal.length > 0 ? `<tfoot>
          <tr><td colspan="4" style="font-weight:700;text-align:right;padding-top:8px;border-top:2px solid #E5D9C8">Total semana (todas las sedes actuales):</td><td style="font-weight:800;text-align:right;padding-top:8px;border-top:2px solid #E5D9C8;color:#B45309">${fmtMoney2(semCuantTotal)}</td></tr>
          <tr><td colspan="4" style="font-weight:600;text-align:right;color:#8A7E6B;font-size:10px">de los cuales Valencia:</td><td style="font-weight:700;text-align:right;color:#8A7E6B;font-size:11px">${fmtMoney2(semCuant)}</td></tr>
        </tfoot>` : ""}
      </table>
    `;
    // === Bloque 3: Comparativa 3 sedes semana ===
    const sedeRow = (name, m) => `<tr>
      <td style="font-weight:700">${name}</td>
      <td style="text-align:right;font-family:monospace">${fmtMoney2(m.euros)}</td>
      <td style="text-align:right;font-family:monospace">${m.presupuestos}</td>
      <td style="text-align:right;font-family:monospace">${m.devoluciones}</td>
      <td style="text-align:right;font-family:monospace;color:#8A7E6B">${m.presupuestos > 0 ? fmtMoney2(m.ticketMedio) : "\u2014"}</td>
    </tr>`;
    const sedesTable = `
      <table class="tbl">
        <thead><tr>
          <th>Sede</th>
          <th style="text-align:right">\u20AC Ingresos</th>
          <th style="text-align:right">Cargos</th>
          <th style="text-align:right">Devoluciones</th>
          <th style="text-align:right">Ticket medio</th>
        </tr></thead>
        <tbody>
          ${sedeRow("Valencia", semVal)}
          ${sedeRow("Onil", semOni)}
          ${sedeRow("Castell\xF3n", semCas)}
        </tbody>
      </table>
    `;
    const sedesComparablesNota = `<div style="margin-top:6px;padding:7px 9px;background:#F7F2E9;border:1px solid #E5D9C8;border-radius:6px;font-size:9.5px;color:#8A7E6B"><b style="color:#1E4D2E">Comparación YoY válida:</b> Valencia + Onil + Castellón en 2026 frente a las mismas 3 sedes en 2025. Alicante no participa en ninguna comparación 2025/2026 hasta disponer de histórico 2025.</div>`;
    // === Bloque 4: Evolución mensual 2026 vs 2025 por sede ===
    // Genera 3 mini-gráficos de líneas (uno por métrica), cada uno con 6 líneas (3 sedes x 2 años)
    const monthly = yoy?.monthly || {};
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const buildLineChart = (metric, unit) => {
      const w = 560, h = 180, mL = 40, mR = 10, mT = 20, mB = 30;
      const cw = w - mL - mR, ch = h - mT - mB;
      // Recolectar datos: para cada sede y año, un array de 12 meses
      const series = [];
      for (const sede of ["valencia", "onil", "castell\xF3n"]) {
        for (const year of [2025, 2026]) {
          const values = [];
          for (let m = 0; m < 12; m++) {
            const key = `${year}-${String(m + 1).padStart(2, "0")}`;
            const val = monthly[key]?.[sede]?.[metric] || 0;
            values.push(val);
          }
          series.push({ sede, year, values, color: sedeColor(sede) });
        }
      }
      const allVals = series.flatMap((s) => s.values);
      const maxV = Math.max(1, ...allVals);
      const xScale = (i) => mL + (i / 11) * cw;
      const yScale = (v) => mT + ch - (v / maxV) * ch;
      // Grid horizontal
      let svg = `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,sans-serif" font-size="9">`;
      // Eje Y (4 marcas)
      for (let i = 0; i <= 4; i++) {
        const y = mT + ch - (i / 4) * ch;
        const v = (maxV * i / 4);
        const label = unit === "eur" ? `${(v / 1000).toFixed(v > 1000 ? 0 : 1)}k` : Math.round(v).toString();
        svg += `<line x1="${mL}" y1="${y}" x2="${w - mR}" y2="${y}" stroke="#E5D9C8" stroke-width="0.5"/>`;
        svg += `<text x="${mL - 4}" y="${y + 3}" text-anchor="end" fill="#8A7E6B">${label}</text>`;
      }
      // Etiquetas eje X (meses)
      for (let m = 0; m < 12; m++) {
        svg += `<text x="${xScale(m)}" y="${h - 12}" text-anchor="middle" fill="#8A7E6B">${monthNames[m]}</text>`;
      }
      // Líneas
      for (const s of series) {
        const points = s.values.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
        const dash = s.year === 2025 ? "3,3" : "0";
        const strokeW = s.year === 2026 ? 2 : 1.5;
        svg += `<polyline points="${points}" fill="none" stroke="${s.color}" stroke-width="${strokeW}" stroke-dasharray="${dash}" stroke-linejoin="round"/>`;
        // Puntitos solo en 2026
        if (s.year === 2026) {
          s.values.forEach((v, i) => {
            if (v > 0) svg += `<circle cx="${xScale(i)}" cy="${yScale(v)}" r="2" fill="${s.color}"/>`;
          });
        }
      }
      svg += "</svg>";
      return svg;
    };
    const evolBlock = Object.keys(monthly).length === 0 ? `<div style="padding:14px;background:#F7F2E9;border:1px dashed #E5D9C8;border-radius:6px;color:#8A7E6B;text-align:center;font-size:11px">Falta cargar Excels HQ para mostrar evoluci\xF3n mensual.</div>` : `
      <div style="display:grid;grid-template-columns:1fr;gap:14px">
        <div>
          <div style="font-size:11px;font-weight:700;color:#4A4038;margin-bottom:4px">\u20AC Ingresos por cargo a fianza</div>
          ${buildLineChart("euros", "eur")}
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:#4A4038;margin-bottom:4px">Cargos a fianza (cantidad)</div>
          ${buildLineChart("presupuestos", "n")}
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:#4A4038;margin-bottom:4px">Devoluciones completadas</div>
          ${buildLineChart("devoluciones", "n")}
        </div>
      </div>
      <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:8px;font-size:10px;color:#4A4038">
        <span><b style="color:#2d5fa6">\u25CF</b> Valencia</span>
        <span><b style="color:#15803D">\u25CF</b> Onil</span>
        <span><b style="color:#A8350F">\u25CF</b> Castell\xF3n</span>
        <span style="margin-left:12px"><span style="display:inline-block;width:16px;border-top:2px solid #4A4038;vertical-align:middle"></span> 2026</span>
        <span><span style="display:inline-block;width:16px;border-top:1.5px dashed #4A4038;vertical-align:middle"></span> 2025</span>
      </div>
    `;
    // === Bloque 5: Tiempos operativos ===
    const tiempoCard = (title, sem, gen, color) => {
      const semV = sem.prom;
      const genV = gen.prom;
      let deltaHtml = "";
      if (semV != null && genV != null) {
        const abs = semV - genV;
        const pct = genV === 0 ? null : (abs / genV) * 100;
        const isBetter = abs < 0; // menos tiempo es mejor
        const isFlat = Math.abs(abs) < 0.1;
        const c = isFlat ? "#5B6B82" : isBetter ? "#15803D" : "#B91C1C";
        const arrow = abs > 0 ? "\u25B2" : abs < 0 ? "\u25BC" : "=";
        deltaHtml = `<span style="color:${c};font-size:10px;font-weight:700">${arrow} ${fmtDur2(Math.abs(abs))}${pct != null ? ` (${abs >= 0 ? "+" : "\u2212"}${Math.abs(pct).toFixed(0)}%)` : ""}</span>`;
      }
      return `
        <div style="background:#F7F2E9;border:1px solid #E5D9C8;border-left:4px solid ${color};border-radius:6px;padding:10px 12px">
          <div style="font-size:10px;font-weight:700;color:#8A7E6B;text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">${title}</div>
          <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
            <div>
              <div style="font-size:16px;font-weight:700;color:#2B2420">${fmtDur2(semV)}</div>
              <div style="font-size:9px;color:#8A7E6B">semana (n=${sem.n})</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:12px;color:#4A4038">${fmtDur2(genV)}</div>
              <div style="font-size:9px;color:#8A7E6B">gral. (n=${gen.n})</div>
            </div>
          </div>
          <div style="margin-top:4px">${deltaHtml}</div>
        </div>
      `;
    };
    const tiemposBlock = (rLog.length === 0 && dLog.length === 0) ? `<div style="padding:10px;background:#F7F2E9;border:1px dashed #E5D9C8;border-radius:6px;color:#8A7E6B;text-align:center;font-size:11px">Sin datos de tiempos registrados a\xFAn.</div>` : `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
        ${tiempoCard("Hasta iniciar revisi\xF3n", revSem, revGen, "#0891b2")}
        ${tiempoCard("Hasta enviar presupuesto", presSem, presGen, "#7C3FAF")}
        ${tiempoCard("Hasta avisar fianza", fzSem, fzGen, "#15803D")}
      </div>
      <div style="font-size:9.5px;color:#B0A48F;margin-top:4px;font-style:italic">Comparaci\xF3n: promedio de esta semana vs promedio hist\xF3rico. Menos tiempo = mejor (verde).</div>
    `;
    // === Bloque 6: Acumulado desde 18/5/2026 ===
    const acumBlock = `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
        <div style="background:#F7F2E9;border:1px solid #E5D9C8;border-left:4px solid #B45309;border-radius:6px;padding:12px 14px">
          <div style="font-size:10px;font-weight:700;color:#8A7E6B;text-transform:uppercase;letter-spacing:.4px">\u20AC Cuantificado \xB7 Valencia</div>
          <div style="font-size:19px;font-weight:800;color:#2B2420;margin-top:3px">${fmtMoney2(acumCuant)}</div>
          <div style="font-size:10px;color:#8A7E6B">${acumPres} presupuestos</div>
        </div>
        <div style="background:#F7F2E9;border:1px solid #E5D9C8;border-left:4px solid #7C3FAF;border-radius:6px;padding:12px 14px">
          <div style="font-size:10px;font-weight:700;color:#8A7E6B;text-transform:uppercase;letter-spacing:.4px">\u20AC Cuantificado \xB7 Todas las sedes</div>
          <div style="font-size:19px;font-weight:800;color:#2B2420;margin-top:3px">${fmtMoney2(acumCuantTotal)}</div>
          <div style="font-size:10px;color:#8A7E6B">${acumPresTotal} presupuestos</div>
        </div>
        <div style="background:#F7F2E9;border:1px solid #E5D9C8;border-left:4px solid #A8350F;border-radius:6px;padding:12px 14px">
          <div style="font-size:10px;font-weight:700;color:#8A7E6B;text-transform:uppercase;letter-spacing:.4px">\u20AC Recaudado \xB7 Valencia</div>
          <div style="font-size:19px;font-weight:800;color:#2B2420;margin-top:3px">${fmtMoney2(acumRecaudado)}</div>
          <div style="font-size:10px;color:#8A7E6B">${acumRecaudCount} cargos (de HQ)</div>
        </div>
        <div style="background:#F7F2E9;border:1px solid #E5D9C8;border-left:4px solid #15803D;border-radius:6px;padding:12px 14px">
          <div style="font-size:10px;font-weight:700;color:#8A7E6B;text-transform:uppercase;letter-spacing:.4px">Ratio recaudo / cuantificado</div>
          <div style="font-size:19px;font-weight:800;color:#2B2420;margin-top:3px">${ratioRec != null ? ratioRec.toFixed(0) + "%" : "\u2014"}</div>
          <div style="font-size:10px;color:#8A7E6B">solo Valencia \xB7 indicativo</div>
        </div>
      </div>
      <div style="font-size:9.5px;color:#B0A48F;margin-top:6px;font-style:italic">Desde 18/05/2026 (inicio en el puesto) hasta hoy. Nota: el ratio se calcula solo sobre Valencia (donde se cruzan tu proceso interno y los cobros de HQ). El total "todas las sedes" es solo cuantificaci\xF3n \u2014 no incluye recaudado porque no hay datos de HQ para otras sedes en tu proceso.</div>
    `;
    // === Bloque 7: Top 3 AC recaudadores + cargos destacados ===
    const topAcs = semVal.topAcs || [];
    const tm = semVal.ticketMedio || 0;
    const grandes = (semVal.cargosDetalle || []).filter((c) => c.totalEntrante > 2 * tm && tm > 0);
    const topBlock = topAcs.length === 0 ? "" : `
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px">
        ${topAcs.slice(0, 3).map((a, i) => `<div style="flex:1;min-width:130px;background:#F7F2E9;border:1px solid #E5D9C8;border-radius:6px;padding:8px 10px"><div style="font-size:10px;color:#8A7E6B">#${i + 1} AC</div><div style="font-size:14px;font-weight:800;color:#2B2420">${a.ac}</div><div style="font-size:12px;font-weight:700;color:#A8350F">${fmtMoney2(a.euros)}</div><div style="font-size:9px;color:#8A7E6B">${a.count} cargo${a.count === 1 ? "" : "s"}</div></div>`).join("")}
      </div>
      ${grandes.length > 0 ? `<div style="padding:8px 10px;background:#FEF3C7;border:1px solid #F59E0B;border-radius:6px;font-size:10.5px;color:#7C2D12"><b>\u26A0\uFE0F ${grandes.length} cargo${grandes.length === 1 ? "" : "s"} destacado${grandes.length === 1 ? "" : "s"}</b> (> 2\xD7 ticket medio ${fmtMoney2(tm)}): ${grandes.map((g) => `<b>${g.ac}</b> ${fmtMoney2(g.totalEntrante)}`).join(" \xB7 ")}</div>` : ""}
    `;
    // === Mes vs 2025 ===
    const mesBlock = `
      <div style="font-size:10px;font-weight:800;color:#A8350F;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">Valencia · Valencia</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
        <div style="background:#F7F2E9;border:1px solid #E5D9C8;border-radius:6px;padding:8px 10px"><div style="font-size:9.5px;color:#8A7E6B;text-transform:uppercase;letter-spacing:.3px">€ Recaudado</div><div style="font-size:15px;font-weight:800;color:#2B2420">${fmtMoney2(mesVal.euros)}</div>${deltaChip(mesVal.euros, mesValLY.euros, true, true, "vs 2025 · Valencia")}</div>
        <div style="background:#F7F2E9;border:1px solid #E5D9C8;border-radius:6px;padding:8px 10px"><div style="font-size:9.5px;color:#8A7E6B;text-transform:uppercase;letter-spacing:.3px">Cargos cobrados</div><div style="font-size:15px;font-weight:800;color:#2B2420">${mesVal.presupuestos}</div>${deltaChip(mesVal.presupuestos, mesValLY.presupuestos, false, true, "vs 2025 · Valencia")}</div>
        <div style="background:#F7F2E9;border:1px solid #E5D9C8;border-radius:6px;padding:8px 10px"><div style="font-size:9.5px;color:#8A7E6B;text-transform:uppercase;letter-spacing:.3px">Devoluciones</div><div style="font-size:15px;font-weight:800;color:#2B2420">${mesVal.devoluciones}</div>${deltaChip(mesVal.devoluciones, mesValLY.devoluciones, false, true, "vs 2025 · Valencia")}</div>
        <div style="background:#F7F2E9;border:1px solid #E5D9C8;border-radius:6px;padding:8px 10px"><div style="font-size:9.5px;color:#8A7E6B;text-transform:uppercase;letter-spacing:.3px">Ticket medio</div><div style="font-size:15px;font-weight:800;color:#2B2420">${mesVal.presupuestos > 0 ? fmtMoney2(mesVal.ticketMedio) : "—"}</div>${mesVal.presupuestos > 0 && mesValLY.presupuestos > 0 ? deltaChip(mesVal.ticketMedio, mesValLY.ticketMedio, true, true, "vs 2025 · Valencia") : ""}</div>
      </div>
      <div style="font-size:10px;font-weight:800;color:#1E4D2E;text-transform:uppercase;letter-spacing:.05em;margin:10px 0 5px">3 sedes comparables · Valencia + Onil + Castellón · Alicante excluida del YoY</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
        <div style="background:#F7F2E9;border:1px solid #E5D9C8;border-radius:6px;padding:8px 10px"><div style="font-size:9.5px;color:#8A7E6B;text-transform:uppercase;letter-spacing:.3px">€ Recaudado</div><div style="font-size:15px;font-weight:800;color:#2B2420">${fmtMoney2(mes3.euros)}</div>${deltaChip(mes3.euros, mes3LY.euros, true, true, "vs 2025 · 3 sedes")}</div>
        <div style="background:#F7F2E9;border:1px solid #E5D9C8;border-radius:6px;padding:8px 10px"><div style="font-size:9.5px;color:#8A7E6B;text-transform:uppercase;letter-spacing:.3px">Cargos cobrados</div><div style="font-size:15px;font-weight:800;color:#2B2420">${mes3.presupuestos}</div>${deltaChip(mes3.presupuestos, mes3LY.presupuestos, false, true, "vs 2025 · 3 sedes")}</div>
        <div style="background:#F7F2E9;border:1px solid #E5D9C8;border-radius:6px;padding:8px 10px"><div style="font-size:9.5px;color:#8A7E6B;text-transform:uppercase;letter-spacing:.3px">Devoluciones</div><div style="font-size:15px;font-weight:800;color:#2B2420">${mes3.devoluciones}</div>${deltaChip(mes3.devoluciones, mes3LY.devoluciones, false, true, "vs 2025 · 3 sedes")}</div>
        <div style="background:#F7F2E9;border:1px solid #E5D9C8;border-radius:6px;padding:8px 10px"><div style="font-size:9.5px;color:#8A7E6B;text-transform:uppercase;letter-spacing:.3px">Ticket medio</div><div style="font-size:15px;font-weight:800;color:#2B2420">${mes3.presupuestos > 0 ? fmtMoney2(mes3.ticketMedio) : "—"}</div>${mes3.presupuestos > 0 && mes3LY.presupuestos > 0 ? deltaChip(mes3.ticketMedio, mes3LY.ticketMedio, true, true, "vs 2025 · 3 sedes") : ""}</div>
      </div>
    `;
    // === HTML final ===
    const genDate = now.toLocaleString("es-ES");
    const body = `
    <div class="page">
      <div class="head">
        <div>
          <div class="ttl">Informe Semanal</div>
          <div class="sub">AC-LLAR \xB7 Valencia \xB7 Sebasti\xE1n Jover</div>
          <div class="sub" style="margin-top:3px"><b>Semana:</b> ${fmtDShort(semStart)} \u2013 ${fmtDShort(semEnd)}</div>
        </div>
        <div class="logo">AC-LLAR</div>
      </div>
      <div class="tag-row">
        <span class="tag tag-cockpit">Cockpit \xB7 Valencia (proceso interno)</span>
        <span class="tag tag-hq">HQ \xB7 3 sedes</span>
      </div>

      <div class="section-title">Resumen ejecutivo semanal <span class="src">Valencia · YoY Valencia / 3 sedes comparables</span></div>
      <div class="kpi-grid">${kpiCards}</div>

      <div class="section-title">Cuantificación de la semana <span class="src">Cockpit · detalle actual · sin YoY 2025</span></div>
      ${cuantBlock}

      <div class="section-title">Comparativa 3 sedes en la semana <span class="src">HQ</span></div>
      ${sedesTable}
      ${sedesComparablesNota}

      <div class="section-title">Top AC con m\xE1s cargos ejecutados esta semana <span class="src">HQ \xB7 Valencia</span></div>
      <div style="font-size:9.5px;color:#8A7E6B;margin-bottom:6px;font-style:italic">Fecha del cargo (cuando HQ ejecut\xF3 el cobro), no necesariamente coincide con la semana en que se revis\xF3 el veh\xEDculo.</div>
      ${topBlock || `<div style="font-size:11px;color:#8A7E6B;font-style:italic">Sin cargos en Valencia esta semana.</div>`}

      <div class="section-title">Mes hasta hoy vs 2025 <span class="src">Valencia vs Valencia · 3 sedes vs 3 sedes</span></div>
      ${mesBlock}

      <div class="section-title">Tiempos operativos <span class="src">cockpit \xB7 Valencia</span></div>
      ${tiemposBlock}

      <div class="section-title">Acumulado desde 18/05/2026 <span class="src">Valencia</span></div>
      ${acumBlock}

      <div class="section-title">Evoluci\xF3n mensual 2026 vs 2025 por sede <span class="src">HQ</span></div>
      ${evolBlock}

      <div class="foot">
        <span>AC-LLAR \xB7 Informe semanal \xB7 Valencia</span>
        <span>Generado: ${genDate}</span>
      </div>
    </div>`;
    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Informe semanal AC-LLAR</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#EDE6D8;color:#2B2420;padding:20px}
  .page{max-width:820px;margin:0 auto;background:#fff;padding:28px;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.08)}
  .head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #A8350F;padding-bottom:12px;margin-bottom:12px}
  .ttl{font-size:26px;font-weight:800;color:#2B2420}
  .sub{font-size:12px;color:#8A7E6B;margin-top:3px}
  .logo{font-size:16px;font-weight:800;color:#A8350F;letter-spacing:1px}
  .tag-row{display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap}
  .tag{font-size:9.5px;font-weight:700;padding:3px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:.4px}
  .tag-cockpit{background:#DBEAFE;color:#1E40AF}
  .tag-hq{background:#DCFCE7;color:#166534}
  .section-title{font-size:13px;font-weight:700;color:#A8350F;margin:16px 0 8px;padding-bottom:4px;border-bottom:1px solid #E5D9C8;display:flex;justify-content:space-between;align-items:baseline}
  .section-title .src{font-size:9px;font-weight:600;color:#8A7E6B;text-transform:uppercase;letter-spacing:.4px}
  .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:4px}
  .kpi-big{background:#F7F2E9;border:1px solid #E5D9C8;border-radius:6px;padding:10px 12px}
  .kpi-label{font-size:10px;font-weight:700;color:#8A7E6B;text-transform:uppercase;letter-spacing:.4px}
  .kpi-value{font-size:22px;font-weight:800;color:#2B2420;margin-top:2px;line-height:1.1}
  .kpi-deltas{margin-top:6px;display:flex;flex-direction:column;gap:3px}
  .tbl{width:100%;border-collapse:collapse;font-size:11px}
  .tbl th{text-align:left;padding:5px 6px;border-bottom:2px solid #E5D9C8;color:#8A7E6B;font-size:9.5px;text-transform:uppercase;letter-spacing:.3px}
  .tbl td{padding:5px 6px;border-bottom:1px solid #F0EAE0}
  .foot{margin-top:18px;font-size:10px;color:#B0A48F;border-top:1px solid #E5D9C8;padding-top:8px;display:flex;justify-content:space-between}
  @media print{body{background:#fff;padding:0}.page{box-shadow:none;border-radius:0}}
</style></head><body>${body}</body></html>`;
  }
  const StatsView = ({ state, activeTab, quantHistorySnapshot }) => {
    const [quantHistory, setQuantHistory] = useState([]);
    const [granularity, setGranularity] = useState("all");
    const [periodOffset, setPeriodOffset] = useState(0);
    const [reportOpen, setReportOpen] = useState(false);
    const [reportWeeks, setReportWeeks] = useState(4);
    const [reportSedes, setReportSedes] = useState([]);
    const [reportMode, setReportMode] = useState("ultimas");
    const [reportOffset, setReportOffset] = useState(1);
    // Semana elegida para el informe COMPLETO (financiero + cuantificación).
    // 1 = la semana pasada, 2 = hace dos semanas, etc.
    const [fullReportOffset, setFullReportOffset] = useState(1);
    // Fecha de referencia ("hoy") para una semana N atrás: el DOMINGO de esa semana
    // (semana completa lunes–domingo), acotado a hoy para la semana en curso.
    const refDateForOffset = (off) => {
      const base = new Date();
      const dow = (base.getDay() + 6) % 7;
      const sun = new Date(base.getFullYear(), base.getMonth(), base.getDate() - dow - off * 7 + 6, 23, 59, 59, 999);
      return sun > base ? base : sun;
    };
    // === YoY (Comparativa año contra año — solo Valencia) ===
    const [yoyIngresos2025, setYoyIngresos2025] = useState(null);
    const [yoyIngresos2026, setYoyIngresos2026] = useState(null);
    const [yoyReservas2025, setYoyReservas2025] = useState(null);
    const [yoyReservas2026, setYoyReservas2026] = useState(null);
    const [yoyModalOpen, setYoyModalOpen] = useState(false);
    const [yoyUploadMsg, setYoyUploadMsg] = useState(null);
    useEffect(() => {
      let alive = true;
      const loadSlot = async (key, setter) => {
        try {
          const r = await window.storage.get(key);
          if (r && alive) setter(JSON.parse(r.value));
        } catch {}
      };
      loadSlot(YOY_STORAGE_KEYS.ingresos2025, setYoyIngresos2025);
      loadSlot(YOY_STORAGE_KEYS.ingresos2026, setYoyIngresos2026);
      loadSlot(YOY_STORAGE_KEYS.reservas2025, setYoyReservas2025);
      loadSlot(YOY_STORAGE_KEYS.reservas2026, setYoyReservas2026);
      return () => { alive = false; };
    }, []);
    const detectionDate = (d) => d.detectedAt || d.importedAt || d.createdAt || null;
    const [diag, setDiag] = useState("");
    useEffect(() => {
      let alive = true;
      const apply = (arr, src) => {
        if (!alive || !Array.isArray(arr) || arr.length === 0) return;
        setQuantHistory((prev) => {
          if (Array.isArray(prev) && prev.length > arr.length) return prev;
          return arr.map((d) => {
            try {
              return sanitizeDoc(d);
            } catch {
              return d;
            }
          });
        });
        setDiag("OK " + src + ": " + arr.length);
      };
      const fromBridge = () => {
        try {
          const mem = typeof window !== "undefined" ? window.__acHistory : null;
          if (Array.isArray(mem) && mem.length > 0) {
            apply(mem, "memoria");
            return true;
          }
        } catch {
        }
        return false;
      };
      const fromStorage = async () => {
        if (!alive) return;
        try {
          if (typeof window === "undefined" || !window.storage?.get) return;
          const r = await window.storage.get("ac_history");
          if (!alive || !r || r.value === void 0) return;
          const raw = JSON.parse(r.value);
          apply(raw, "storage");
        } catch (e) {
          setDiag("storage no disponible (uso memoria): " + String(e).slice(0, 40));
        }
      };
      if (!fromBridge()) fromStorage();
      const onUpdate = () => fromBridge();
      if (typeof window !== "undefined") window.addEventListener("ac-history-updated", onUpdate);
      const timers = [setTimeout(fromBridge, 300), setTimeout(fromBridge, 800)];
      return () => {
        alive = false;
        timers.forEach(clearTimeout);
        if (typeof window !== "undefined") window.removeEventListener("ac-history-updated", onUpdate);
      };
    }, [activeTab]);
    const period = useMemo(() => {
      if (granularity === "all") return null;
      const now = /* @__PURE__ */ new Date();
      let start, end, label;
      if (granularity === "day") {
        const d = new Date(now);
        d.setDate(d.getDate() + periodOffset);
        start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        end = new Date(start);
        end.setDate(end.getDate() + 1);
        label = start.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
      } else if (granularity === "week") {
        const d = new Date(now);
        d.setDate(d.getDate() + periodOffset * 7);
        const dow = (d.getDay() + 6) % 7;
        start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dow);
        end = new Date(start);
        end.setDate(end.getDate() + 7);
        const endShow = new Date(end);
        endShow.setDate(endShow.getDate() - 1);
        label = `${start.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })} \u2013 ${endShow.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}`;
      } else if (granularity === "month") {
        const d = new Date(now.getFullYear(), now.getMonth() + periodOffset, 1);
        start = d;
        end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        label = start.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
      } else {
        const y = now.getFullYear() + periodOffset;
        start = new Date(y, 0, 1);
        end = new Date(y + 1, 0, 1);
        label = String(y);
      }
      return { start: start.toISOString(), end: end.toISOString(), label };
    }, [granularity, periodOffset]);
    const periodDamages = useMemo(() => {
      const all = state.damages || [];
      if (!period) return all;
      return all.filter((d) => {
        const dt = detectionDate(d);
        if (!dt) return false;
        return dt >= period.start && dt < period.end;
      });
    }, [state.damages, period]);
    const stats = useMemo(() => {
      const damages = periodDamages;
      const vehicles = state.vehicles || [];
      const vehById = {};
      for (const v of vehicles) vehById[v.id] = v;
      const countBy = (arr, keyFn) => {
        const m = {};
        for (const x of arr) {
          const k = keyFn(x);
          if (k == null || k === "") continue;
          m[k] = (m[k] || 0) + 1;
        }
        return Object.entries(m).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
      };
      const GRAV_COLORS = { GRAVE: "#dc2626", MODERADO: "#B45309", LEVE: "#1E4D2E" };
      const GRAV_LABELS = { GRAVE: "Grave", MODERADO: "Moderado", LEVE: "Leve" };
      const byGravity = ["GRAVE", "MODERADO", "LEVE"].map((g) => ({
        label: GRAV_LABELS[g],
        value: damages.filter((d) => d.gravedad === g).length,
        color: GRAV_COLORS[g]
      })).filter((d) => d.value > 0);
      const byZone = countBy(damages, (d) => d.zona).slice(0, 10);
      const byType = countBy(damages, (d) => d.tipoDano).slice(0, 10);
      const byModel = countBy(damages, (d) => {
        const v = vehById[d.vehicleId];
        return v ? `${v.brand || ""} ${v.model || ""}`.trim() : null;
      }).slice(0, 10);
      const bySede = countBy(damages, (d) => {
        const v = vehById[d.vehicleId];
        return v?.location;
      });
      const repairColors = { Detectado: "#F59E0B", "En reparaci\xF3n": "#9061F9", Reparado: "#1E4D2E" };
      const repairLabels = { DETECTADO: "Detectado", EN_REPARACION: "En reparaci\xF3n", REPARADO: "Reparado" };
      const byStateRaw = {};
      for (const d of damages) {
        const lbl = repairLabels[damageRepair(d)] || "Detectado";
        byStateRaw[lbl] = (byStateRaw[lbl] || 0) + 1;
      }
      const byState = Object.entries(byStateRaw).map(([label, value]) => ({ label, value, color: repairColors[label] }));
      const byVehicle = countBy(damages, (d) => d.vehicleId).slice(0, 10).map((d) => ({ ...d, label: d.label }));
      const reqParts = damages.filter((d) => d.requierePiezas === true).length;
      const noParts = damages.length - reqParts;
      const partsData = [
        { label: "Requiere piezas", value: reqParts, color: "#B45309" },
        { label: "Sin piezas", value: noParts, color: "#1E4D2E" }
      ].filter((d) => d.value > 0);
      const monthMap = {};
      for (const d of damages) {
        const dt = d.importedAt || d.createdAt;
        if (!dt) continue;
        const key = dt.slice(0, 7);
        monthMap[key] = (monthMap[key] || 0) + 1;
      }
      const monthKeys = Object.keys(monthMap).sort().slice(-8);
      const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
      const trend = monthKeys.map((k) => {
        const [y, m] = k.split("-");
        return { label: `${MES[parseInt(m, 10) - 1]} ${y.slice(2)}`, value: monthMap[k] };
      });
      const avgPerVehicle = vehicles.length > 0 ? damages.length / vehicles.length : 0;
      const asumidos = damages.filter((d) => damageCargo(d) === "ASUMIDO").length;
      const cobrados = damages.filter((d) => damageCargo(d) === "CUANTIFICADO").length;
      const nuevos = damages.filter((d) => damageCargo(d) === "NUEVO").length;
      const absorbData = [
        { label: "Cobrados", value: cobrados, color: "#1E4D2E" },
        { label: "Asumidos", value: asumidos, color: "#6b7280" },
        { label: "Sin decidir", value: nuevos, color: "#F59E0B" }
      ].filter((d) => d.value > 0);
      return {
        total: damages.length,
        byGravity,
        byZone,
        byType,
        byModel,
        bySede,
        byState,
        byVehicle,
        partsData,
        reqParts,
        trend,
        avgPerVehicle,
        absorbData,
        asumidos,
        cobrados,
        activos: damages.filter((d) => damageRepair(d) !== "REPARADO").length
      };
    }, [periodDamages, state.vehicles]);
    const qstats = useMemo(() => {
      const allHist = quantHistory || [];
      const hist = period ? allHist.filter((doc) => {
        const dt = doc.fecha || doc.savedAt || doc.emittedAt;
        if (!dt) return false;
        const dtIso = dt.length <= 10 ? dt + "T12:00:00.000Z" : dt;
        return dtIso >= period.start && dtIso < period.end;
      }) : allHist;
      let totalMoney = 0, count = 0;
      const monthMoney = {};
      const sedeMoney = {};
      const typeMoney = {};
      for (const doc of hist) {
        const pieceTotal = (p) => {
          if (p.draft) return 0;
          if (typeof p.total === "number" && p.total > 0) return p.total;
          const h = parseFloat(p.horas) || 0;
          const pvr = parseFloat(p.pvrProveedor) || 0;
          const pvrEf = pvr * parcialFactor(p);
          return (pvrEf + h * 25) * 1.21;
        };
        const extraTotal = (x) => x.precioConIva || 0;
        const pSum = (doc.piezas || []).reduce((s, p) => s + pieceTotal(p), 0);
        const eSum = ["chapa", "toldos", "antenas", "fabricante", "combustible", "otros"].reduce((s, k) => s + (doc[k] || []).reduce((ss, x) => ss + extraTotal(x), 0), 0);
        const hasItems = pSum > 0 || eSum > 0;
        const docTotal = pSum + eSum + (hasItems ? 12.5 * 1.21 : 0);
        if (docTotal > 0) {
          totalMoney += docTotal;
          count++;
        }
        const dt = doc.fecha || doc.savedAt || "";
        if (dt) {
          const k = dt.slice(0, 7);
          monthMoney[k] = (monthMoney[k] || 0) + docTotal;
        }
        const marca = doc.vehicle?.marca || "Otros";
        sedeMoney[marca] = (sedeMoney[marca] || 0) + docTotal;
        for (const p of doc.piezas || []) {
          if (p.draft) continue;
          const t = p.tipo || "TOTAL";
          typeMoney[t] = (typeMoney[t] || 0) + pieceTotal(p);
        }
      }
      const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
      const monthKeys = Object.keys(monthMoney).sort().slice(-8);
      const moneyTrend = monthKeys.map((k) => {
        const [y, m] = k.split("-");
        return { label: `${MES[parseInt(m, 10) - 1]} ${y.slice(2)}`, value: Math.round(monthMoney[k]) };
      });
      const byBrand = Object.entries(sedeMoney).map(([label, value]) => ({ label, value: Math.round(value) })).sort((a, b) => b.value - a.value);
      const avgBudget = count > 0 ? totalMoney / count : 0;
      return { totalMoney: Math.round(totalMoney * 100) / 100, count, avgBudget: Math.round(avgBudget * 100) / 100, moneyTrend, byBrand };
    }, [quantHistory, period]);
    const totalWeeksAvailable = useMemo(() => {
      const dates = [];
      for (const d of state.damages || []) {
        const dt = d.detectedAt || d.importedAt || d.createdAt;
        if (dt) dates.push(new Date(dt).getTime());
      }
      for (const b of quantHistory || []) {
        const bd = b.fecha || b.savedAt;
        if (bd) dates.push(new Date(bd).getTime());
      }
      if (dates.length === 0) return 1;
      const oldest = Math.min(...dates);
      const ms = Date.now() - oldest;
      const wk = Math.ceil(ms / (7 * 24 * 3600 * 1e3)) + 1;
      return Math.max(1, Math.min(wk, 520));
    }, [state.damages, quantHistory]);
    const statVehicleIds = useMemo(() => {
      const set = /* @__PURE__ */ new Set();
      for (const v of state.vehicles) {
        if (v.location === "Valencia" || v.contarEnStats === true) set.add(v.id);
      }
      return set;
    }, [state.vehicles]);
    const reviewStats = useMemo(() => {
      const log = (Array.isArray(state.reviewLog) ? state.reviewLog : []).filter((r) => statVehicleIds.has(r.vehicleId));
      const inPeriod = !period ? log : log.filter((r) => {
        const t = r.reviewStartedAt;
        return t >= period.start && t < period.end;
      });
      const stat = (arr) => {
        const hs = arr.map((r) => r.horas).filter((h) => typeof h === "number" && h >= 0).sort((a, b) => a - b);
        const n = hs.length;
        if (n === 0) return { n: 0, prom: null, mediana: null, min: null, max: null };
        const prom = hs.reduce((a, b) => a + b, 0) / n;
        const mediana = n % 2 ? hs[(n - 1) / 2] : (hs[n / 2 - 1] + hs[n / 2]) / 2;
        return { n, prom, mediana, min: hs[0], max: hs[n - 1] };
      };
      const byWeek = {};
      const pad2 = (n) => String(n).padStart(2, "0");
      for (const r of log) {
        const d = new Date(r.reviewStartedAt);
        const dow = (d.getDay() + 6) % 7;
        const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dow);
        // Clave en hora LOCAL (no UTC): así la etiqueta muestra el lunes real de la
        // semana y no el domingo anterior (Madrid = UTC+2 corría la fecha un día).
        const key = `${monday.getFullYear()}-${pad2(monday.getMonth() + 1)}-${pad2(monday.getDate())}`;
        (byWeek[key] = byWeek[key] || []).push(r.horas);
      }
      const weeks = Object.keys(byWeek).sort().slice(-10).map((k) => {
        const arr = byWeek[k].filter((h) => typeof h === "number").sort((a, b) => a - b);
        const prom = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
        const p = k.split("-");
        return { week: k, label: `${p[2]}/${p[1]}`, count: arr.length, prom };
      });
      return { period: stat(inPeriod), total: stat(log), weeks, totalCount: log.length };
    }, [state.reviewLog, period, statVehicleIds]);
    const leftUnreviewedStats = useMemo(() => {
      const log = (Array.isArray(state.leftUnreviewedLog) ? state.leftUnreviewedLog : []).filter((e) => statVehicleIds.has(e.vehicleId));
      const inPeriod = !period ? log : log.filter((e) => e.at >= period.start && e.at < period.end);
      return { countPeriodo: inPeriod.length, total: log.length };
    }, [state.leftUnreviewedLog, period, statVehicleIds]);
    const depositStats = useMemo(() => {
      const log = (Array.isArray(state.depositLog) ? state.depositLog : []).filter((e) => statVehicleIds.has(e.vehicleId));
      const inPeriod = !period ? log : log.filter((e) => e.at >= period.start && e.at < period.end);
      const stat = (arr, campo) => {
        const hs = arr.map((e) => e[campo]).filter((h) => typeof h === "number" && h >= 0).sort((a, b) => a - b);
        const n = hs.length;
        if (n === 0) return { n: 0, prom: null, mediana: null, min: null, max: null };
        const prom = hs.reduce((a, b) => a + b, 0) / n;
        const mediana = n % 2 ? hs[(n - 1) / 2] : (hs[n / 2 - 1] + hs[n / 2]) / 2;
        return { n, prom, mediana, min: hs[0], max: hs[n - 1] };
      };
      const pres = inPeriod.filter((e) => e.tipo === "presupuesto");
      const fianza = inPeriod.filter((e) => e.tipo === "fianza");
      // Nivel de disputa (color) — solo aplica a presupuestos. "sinColor" = sin clasificar.
      const disp = { grave: 0, moderado: 0, leve: 0, sinColor: 0 };
      const dispVeh = {};
      for (const e of pres) {
        const niv = e.nivelDisputa;
        if (niv === "grave" || niv === "moderado" || niv === "leve") {
          disp[niv]++;
          const k = e.vehicleId || "?";
          dispVeh[k] = (dispVeh[k] || 0) + 1;
        } else {
          disp.sinColor++;
        }
      }
      const disputadosPorVehiculo = Object.entries(dispVeh).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 10);
      return {
        totalCount: log.length,
        countPeriodo: inPeriod.length,
        presDesdeeLlegada: stat(pres, "horasDesdeLlegada"),
        presDesdeRevision: stat(pres, "horasDesdeRevision"),
        fianzaDesdeeLlegada: stat(fianza, "horasDesdeLlegada"),
        fianzaDesdeRevision: stat(fianza, "horasDesdeRevision"),
        nPres: pres.length,
        nFianza: fianza.length,
        disputa: disp,
        disputadosPorVehiculo
      };
    }, [state.depositLog, period, statVehicleIds]);
    const doExportReport = () => {
      const concreta = reportMode === "concreta";
      const nWeeks = concreta ? 1 : reportWeeks === "todas" ? totalWeeksAvailable : reportWeeks;
      const html = buildWeeklyReportHTML({
        damages: state.damages || [],
        vehicles: state.vehicles || [],
        quantHistory,
        weeks: nWeeks,
        offset: concreta ? reportOffset : 0,
        sedes: reportSedes
      });
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const slug = concreta ? weekRangeLabel(reportOffset).replace(/\s+/g, "").replace(/–/g, "_").replace(/\./g, "") : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      a.href = url;
      a.download = `Informe_semanal_${slug}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setReportOpen(false);
    };
    const doExportTotalReport = (refDate) => {
      try {
        // refDate: fecha de referencia ("hoy") con la que se calculan las ventanas.
        // Si no llega una Date válida (p.ej. el botón verde pasa el evento del click),
        // se usa la fecha real → comportamiento idéntico al de siempre.
        const hoy = (refDate instanceof Date && !isNaN(refDate)) ? refDate : new Date();
        const windows = computeYoyWindows(hoy);
        const sFilter = yoySedeFilter === "Todas" ? null : yoySedeFilter;
        const results = {
          semanaAct: computeYoyMetrics(yoyIngresos2026, yoyReservas2026, windows.semanaAct.start, windows.semanaAct.end, sFilter),
          semanaLY: computeYoyMetrics(yoyIngresos2025, yoyReservas2025, windows.semanaLY.start, windows.semanaLY.end, sFilter),
          semanaPrev: computeYoyMetrics(yoyIngresos2026, yoyReservas2026, windows.semanaPrev.start, windows.semanaPrev.end, sFilter),
          mesAct: computeYoyMetrics(yoyIngresos2026, yoyReservas2026, windows.mesAct.start, windows.mesAct.end, sFilter),
          mesLY: computeYoyMetrics(yoyIngresos2025, yoyReservas2025, windows.mesLY.start, windows.mesLY.end, sFilter)
        };
        // Calcular resultados YoY para cada sede (Valencia/Onil/Castellón) por separado
        const resultsPorSede = {};
        const sedesComparables2025_2026 = ["Valencia", "Onil", "Castell\xF3n"];
        for (const sede of sedesComparables2025_2026) {
          resultsPorSede[sede] = {
            semanaAct: computeYoyMetrics(yoyIngresos2026, yoyReservas2026, windows.semanaAct.start, windows.semanaAct.end, sede),
            semanaLY: computeYoyMetrics(yoyIngresos2025, yoyReservas2025, windows.semanaLY.start, windows.semanaLY.end, sede),
            semanaPrev: computeYoyMetrics(yoyIngresos2026, yoyReservas2026, windows.semanaPrev.start, windows.semanaPrev.end, sede),
            mesAct: computeYoyMetrics(yoyIngresos2026, yoyReservas2026, windows.mesAct.start, windows.mesAct.end, sede),
            mesLY: computeYoyMetrics(yoyIngresos2025, yoyReservas2025, windows.mesLY.start, windows.mesLY.end, sede)
          };
        }
        resultsPorSede.TresSedes = {
          semanaAct: computeYoyMetrics(yoyIngresos2026, yoyReservas2026, windows.semanaAct.start, windows.semanaAct.end, sedesComparables2025_2026),
          semanaLY: computeYoyMetrics(yoyIngresos2025, yoyReservas2025, windows.semanaLY.start, windows.semanaLY.end, sedesComparables2025_2026),
          semanaPrev: computeYoyMetrics(yoyIngresos2026, yoyReservas2026, windows.semanaPrev.start, windows.semanaPrev.end, sedesComparables2025_2026),
          mesAct: computeYoyMetrics(yoyIngresos2026, yoyReservas2026, windows.mesAct.start, windows.mesAct.end, sedesComparables2025_2026),
          mesLY: computeYoyMetrics(yoyIngresos2025, yoyReservas2025, windows.mesLY.start, windows.mesLY.end, sedesComparables2025_2026)
        };
        // Data mensual combinada 2025+2026
        const combinedIngresos = { rows: [...(yoyIngresos2025?.rows || []), ...(yoyIngresos2026?.rows || [])] };
        const combinedReservas = { rows: [...(yoyReservas2025?.rows || []), ...(yoyReservas2026?.rows || [])] };
        const monthly = groupByMonthAndSede(combinedIngresos, combinedReservas);
        const html = buildTotalReportHTML({
          damages: state.damages || [],
          vehicles: state.vehicles || [],
          quantHistory,
          sedes: reportSedes,
          depositLog: state.depositLog || [],
          reviewLog: state.reviewLog || [],
          leftUnreviewedLog: state.leftUnreviewedLog || [],
          yoy: {
            windows,
            results,
            resultsPorSede,
            monthly,
            ingresos2026Rows: yoyIngresos2026?.rows || [],
            ingresos2025Rows: yoyIngresos2025?.rows || [],
            hasIngresos2025: !!yoyIngresos2025,
            hasIngresos2026: !!yoyIngresos2026,
            hasReservas2025: !!yoyReservas2025,
            hasReservas2026: !!yoyReservas2026
          }
        });
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const pad2 = (n) => String(n).padStart(2, "0");
        const dSlug = (x) => `${x.getFullYear()}-${pad2(x.getMonth() + 1)}-${pad2(x.getDate())}`;
        a.download = `Informe_Semanal_${dSlug(windows.semanaAct.start)}_a_${dSlug(windows.semanaAct.end)}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setReportOpen(false);
      } catch (err) {
        console.error("[Informe semanal] Error al generar:", err);
        alert("Error al generar el informe semanal:\n\n" + (err && err.message ? err.message : String(err)) + "\n\nAbrí la consola del navegador (F12) para ver el detalle completo.");
      }
    };
    // === YoY: ventanas y métricas calculadas ===
    const [yoySedeFilter, setYoySedeFilter] = useState("Valencia");
    const yoyWindows = useMemo(() => computeYoyWindows(new Date()), []);
    const yoyResults = useMemo(() => {
      const s = yoySedeFilter === "Todas" ? null : yoySedeFilter;
      return {
        semanaAct: computeYoyMetrics(yoyIngresos2026, yoyReservas2026, yoyWindows.semanaAct.start, yoyWindows.semanaAct.end, s),
        semanaLY: computeYoyMetrics(yoyIngresos2025, yoyReservas2025, yoyWindows.semanaLY.start, yoyWindows.semanaLY.end, s),
        semanaPrev: computeYoyMetrics(yoyIngresos2026, yoyReservas2026, yoyWindows.semanaPrev.start, yoyWindows.semanaPrev.end, s),
        mesAct: computeYoyMetrics(yoyIngresos2026, yoyReservas2026, yoyWindows.mesAct.start, yoyWindows.mesAct.end, s),
        mesLY: computeYoyMetrics(yoyIngresos2025, yoyReservas2025, yoyWindows.mesLY.start, yoyWindows.mesLY.end, s)
      };
    }, [yoyIngresos2025, yoyIngresos2026, yoyReservas2025, yoyReservas2026, yoyWindows, yoySedeFilter]);
    const handleYoyFileUpload = async (slotKey, file) => {
      if (!file) return;
      setYoyUploadMsg({ type: "loading", text: `Leyendo ${file.name}...` });
      try {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(new Uint8Array(buf), { type: "array", cellDates: true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const matrix = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: false });
        const tipo = detectExcelType(matrix);
        const slotIsIngresos = slotKey.includes("ingresos");
        const slotIsReservas = slotKey.includes("reservas");
        if (!tipo) {
          setYoyUploadMsg({ type: "err", text: "No pude detectar si el Excel es de ingresos o de reservas. Revisá que los headers incluyan 'Total Entrante' (ingresos) o 'Estatus' + 'Sucursal' (reservas)." });
          return;
        }
        if (slotIsIngresos && tipo !== "ingresos") {
          setYoyUploadMsg({ type: "err", text: `Este slot es de ingresos, pero el archivo parece ser de ${tipo}. Verificá que hayas subido el archivo correcto.` });
          return;
        }
        if (slotIsReservas && tipo !== "reservas") {
          setYoyUploadMsg({ type: "err", text: `Este slot es de reservas, pero el archivo parece ser de ${tipo}. Verificá que hayas subido el archivo correcto.` });
          return;
        }
        const parsed = tipo === "ingresos" ? parseIngresosExcel(matrix) : parseReservasExcel(matrix);
        if (parsed.error) {
          setYoyUploadMsg({ type: "err", text: parsed.error });
          return;
        }
        if (parsed.rows.length === 0) {
          setYoyUploadMsg({ type: "err", text: `Se procesó el archivo pero no quedó ninguna fila útil en Valencia. Descartadas: ${JSON.stringify(parsed.descartadas)}` });
          return;
        }
        const fechaKey = tipo === "ingresos" ? "fecha" : "fechaDevolucion";
        const yearDetected = detectYear(parsed.rows, fechaKey);
        const yearFromSlot = slotKey.includes("2025") ? 2025 : 2026;
        if (yearDetected && yearDetected !== yearFromSlot) {
          setYoyUploadMsg({ type: "warn", text: `Ojo: el slot es de ${yearFromSlot} pero los datos parecen ser de ${yearDetected}. Se guardó igual — si es un error, subí el archivo correcto.` });
        }
        const range = dateRange(parsed.rows, fechaKey);
        const dataset = {
          meta: {
            fileName: file.name,
            uploadedAt: (new Date()).toISOString(),
            rowCount: parsed.rows.length,
            dateMin: range.min ? range.min.toISOString().slice(0, 10) : null,
            dateMax: range.max ? range.max.toISOString().slice(0, 10) : null,
            yearDetected,
            tipo,
            descartadas: parsed.descartadas
          },
          rows: parsed.rows
        };
        const storageKey = YOY_STORAGE_KEYS[slotKey];
        await window.storage.set(storageKey, JSON.stringify(dataset));
        const setter = {
          ingresos2025: setYoyIngresos2025,
          ingresos2026: setYoyIngresos2026,
          reservas2025: setYoyReservas2025,
          reservas2026: setYoyReservas2026
        }[slotKey];
        setter(dataset);
        if (!yearDetected || yearDetected === yearFromSlot) {
          setYoyUploadMsg({ type: "ok", text: `✓ Cargadas ${parsed.rows.length} filas de ${file.name}. Rango: ${range.min ? fmtDateShort(range.min) : "?"} – ${range.max ? fmtDateShort(range.max) : "?"}.` });
        }
      } catch (err) {
        setYoyUploadMsg({ type: "err", text: `Error al procesar el archivo: ${err.message}` });
      }
    };
    const handleYoyClearSlot = async (slotKey) => {
      if (!confirm(`¿Borrar los datos guardados en "${slotKey}"?`)) return;
      const storageKey = YOY_STORAGE_KEYS[slotKey];
      try { await window.storage.delete(storageKey); } catch {}
      const setter = {
        ingresos2025: setYoyIngresos2025,
        ingresos2026: setYoyIngresos2026,
        reservas2025: setYoyReservas2025,
        reservas2026: setYoyReservas2026
      }[slotKey];
      setter(null);
      setYoyUploadMsg({ type: "ok", text: "Slot borrado." });
    };
    // Componente auxiliar: tarjeta de comparación YoY con hasta 2 deltas
    const YoyCard = ({ title, cur, prev, prevPrev, format, higherIsBetter = true, hasCur, hasPrev, hasPrevPrev, prevLabel = "2025", prevPrevLabel = "sem. ant." }) => {
      const goodDir = higherIsBetter ? "up" : "down";
      const deltaLine = (label, curV, prevV, ok) => {
        if (!ok) return React.createElement("div", { style: { fontSize: "10.5px", color: T.inkFaint, fontStyle: "italic" } }, "sin ", label);
        const d = yoyDelta(curV, prevV);
        const color = d.dir === "flat" ? T.inkSoft : d.dir === goodDir ? "#15803D" : "#B91C1C";
        const arrow = d.dir === "up" ? "\u25B2" : d.dir === "down" ? "\u25BC" : "=";
        const fmtN = format(Math.abs(d.abs));
        const pctStr = d.pct == null ? "" : ` (${d.abs >= 0 ? "+" : "\u2212"}${Math.abs(d.pct).toFixed(1)}%)`;
        return React.createElement("div", { style: { fontSize: "11px", color: T.inkSoft, marginTop: "3px" } },
          "vs ", label, " ", React.createElement("b", { style: { color: T.ink } }, format(prevV)), " \xB7 ",
          React.createElement("span", { style: { color, fontWeight: 700 } }, arrow, " ", fmtN, pctStr)
        );
      };
      return React.createElement("div", { style: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "14px 16px" } },
        React.createElement("div", { style: { fontSize: "11px", fontWeight: 700, color: T.inkFaint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" } }, title),
        React.createElement("div", { style: { fontSize: "24px", fontWeight: 700, fontFamily: F.display, color: T.ink, lineHeight: 1.1 } }, hasCur ? format(cur) : "\u2014"),
        !hasCur ? React.createElement("div", { style: { fontSize: "10.5px", color: T.inkFaint, fontStyle: "italic", marginTop: "4px" } }, "Falta archivo 2026") : React.createElement(React.Fragment, null,
          deltaLine(prevLabel, cur, prev, hasPrev),
          prevPrev != null && deltaLine(prevPrevLabel, cur, prevPrev, hasPrevPrev)
        )
      );
    };
    const yoyBloque = (label, subLabel, curM, prevM, prevPrevM, curSlots, prevSlots) => {
      const hasCurIng = !!curSlots.ing, hasPrevIng = !!prevSlots.ing;
      const hasCurRes = !!curSlots.res, hasPrevRes = !!prevSlots.res;
      const hasPrevPrevIng = prevPrevM != null && !!curSlots.ing;
      const hasPrevPrevRes = prevPrevM != null && !!curSlots.res;
      return React.createElement("div", { style: { background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: "18px", padding: "14px", marginBottom: "12px" } },
        React.createElement("div", { style: { fontSize: "14px", fontWeight: 700, color: T.ink, marginBottom: "2px" } }, label),
        React.createElement("div", { style: { fontSize: "11px", color: T.inkSoft, marginBottom: "12px" } }, subLabel),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" } },
          React.createElement(YoyCard, { title: "\u20AC ingresos cargo fianza", cur: curM.euros, prev: prevM.euros, prevPrev: prevPrevM?.euros, format: fmtEurYoy, higherIsBetter: true, hasCur: hasCurIng, hasPrev: hasPrevIng, hasPrevPrev: hasPrevPrevIng }),
          React.createElement(YoyCard, { title: "Presupuestos enviados", cur: curM.presupuestos, prev: prevM.presupuestos, prevPrev: prevPrevM?.presupuestos, format: (n) => String(n), higherIsBetter: true, hasCur: hasCurIng, hasPrev: hasPrevIng, hasPrevPrev: hasPrevPrevIng }),
          React.createElement(YoyCard, { title: "Devoluciones completadas", cur: curM.devoluciones, prev: prevM.devoluciones, prevPrev: prevPrevM?.devoluciones, format: (n) => String(n), higherIsBetter: true, hasCur: hasCurRes, hasPrev: hasPrevRes, hasPrevPrev: hasPrevPrevRes }),
          React.createElement(YoyCard, { title: "Ticket medio", cur: curM.ticketMedio, prev: prevM.ticketMedio, prevPrev: prevPrevM?.ticketMedio, format: fmtEurYoy, higherIsBetter: true, hasCur: hasCurIng && curM.presupuestos > 0, hasPrev: hasPrevIng && prevM.presupuestos > 0, hasPrevPrev: hasPrevPrevIng && prevPrevM?.presupuestos > 0 })
        ),
        /* Top 3 AC + alerta cargo alto */ curM.topAcs && curM.topAcs.length > 0 && React.createElement("div", { style: { marginTop: "12px", padding: "10px 12px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: "12px", fontSize: "11.5px" } },
          React.createElement("div", { style: { fontSize: "10px", fontWeight: 700, color: T.inkFaint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" } }, "Top AC con m\xE1s cargos ejecutados en este per\xEDodo"),
          React.createElement("div", { style: { fontSize: "10px", color: T.inkFaint, fontStyle: "italic", marginBottom: "8px" } }, "Fecha del cargo, no de tu revisi\xF3n \u2014 algunos pueden corresponder a presupuestos que enviaste antes."),
          React.createElement("div", { style: { display: "flex", gap: "14px", flexWrap: "wrap" } }, curM.topAcs.slice(0, 3).map((a, i) => React.createElement("div", { key: a.ac + i }, React.createElement("b", { style: { color: T.ink } }, a.ac), " \xB7 ", React.createElement("span", { style: { color: T.rust, fontWeight: 700 } }, fmtEurYoy(a.euros)), " ", React.createElement("span", { style: { color: T.inkFaint, fontSize: "10.5px" } }, "(", a.count, "\xD7)")))),
          (() => {
            const tm = curM.ticketMedio;
            if (!tm || tm <= 0) return null;
            const grandes = curM.cargosDetalle.filter((c) => c.totalEntrante > 2 * tm);
            if (grandes.length === 0) return null;
            return React.createElement("div", { style: { marginTop: "8px", padding: "6px 10px", background: "#FEF3C7", border: "1px solid #F59E0B", borderRadius: "10px", fontSize: "11px", color: "#991B1B" } },
              "\u26A0\uFE0F ", grandes.length, " cargo", grandes.length === 1 ? "" : "s", " destacado", grandes.length === 1 ? "" : "s", " (> 2\xD7 ticket medio de ", fmtEurYoy(tm), "): ", grandes.map((g) => `${g.ac} ${fmtEurYoy(g.totalEntrante)}`).join(", ")
            );
          })()
        )
      );
    };
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: T.inkFaint, marginBottom: "4px" } }, "Estad\xEDsticas"), /* @__PURE__ */ React.createElement("h1", { style: { margin: 0, fontFamily: F.display, fontSize: "30px", fontWeight: 600, letterSpacing: "-0.025em", color: T.ink } }, "An\xE1lisis de flota"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", color: T.inkSoft, marginTop: "6px" } }, "Se actualiza con cada OT que import\xE1s. ", state.damages?.length || 0, " da\xF1os registrados en total.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", flexShrink: 0, justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { onClick: doExportTotalReport, title: "Genera el informe semanal financiero (Valencia + 3 sedes desde HQ) de la SEMANA EN CURSO (lunes–hoy). Descarga directa, sin configurar nada.", style: {
      padding: "9px 16px",
      fontSize: "14px",
      fontWeight: 700,
      borderRadius: "12px",
      cursor: "pointer",
      border: "none",
      background: "#15803D",
      color: "#fff",
      whiteSpace: "nowrap",
      flexShrink: 0
    } }, "\u{1F4C4} Descargar informe semanal"), /* @__PURE__ */ React.createElement("select", { value: fullReportOffset, onChange: (e) => setFullReportOffset(parseInt(e.target.value)), title: "Eleg\xED de qu\xE9 semana quer\xE9s el informe completo", style: { padding: "8px 10px", fontSize: "13.5px", fontWeight: 600, borderRadius: "12px", border: `1px solid ${T.border}`, background: T.surface, color: T.ink, cursor: "pointer", maxWidth: "220px" } }, Array.from({ length: 13 }, (_, i) => i + 1).map((off) => /* @__PURE__ */ React.createElement("option", { key: off, value: off }, weekRangeLabel(off) + (off === 1 ? "  (la pasada)" : "")))), /* @__PURE__ */ React.createElement("button", { onClick: () => doExportTotalReport(refDateForOffset(fullReportOffset)), title: "Informe completo (financiero + cuantificaci\xF3n + tiempos) de la semana elegida en el desplegable", style: {
      padding: "9px 16px",
      fontSize: "14px",
      fontWeight: 700,
      borderRadius: "12px",
      cursor: "pointer",
      border: "none",
      background: T.rust,
      color: "#fff",
      whiteSpace: "nowrap"
    } }, "\u{1F4C5} Semana a elecci\xF3n"))), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
      marginBottom: "20px",
      padding: "12px 16px",
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: "12px"
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.inkFaint } }, "Per\xEDodo \xB7 por fecha de detecci\xF3n"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "4px" } }, [["all", "Todo"], ["day", "D\xEDa"], ["week", "Semana"], ["month", "Mes"], ["year", "A\xF1o"]].map(([g, lbl]) => /* @__PURE__ */ React.createElement("button", { key: g, onClick: () => {
      setGranularity(g);
      setPeriodOffset(0);
    }, style: {
      padding: "5px 13px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: 600,
      background: granularity === g ? T.rust : T.bgAlt,
      color: granularity === g ? "#FFFFFF" : T.inkSoft
    } }, lbl))), period && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPeriodOffset((o) => o - 1), style: {
      width: "28px",
      height: "28px",
      borderRadius: "10px",
      border: `1px solid ${T.border}`,
      background: T.surface,
      cursor: "pointer",
      fontSize: "15px",
      color: T.ink,
      lineHeight: 1
    } }, "\u2039"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "14px", fontWeight: 600, color: T.ink, minWidth: "150px", textAlign: "center" } }, period.label), /* @__PURE__ */ React.createElement("button", { onClick: () => setPeriodOffset((o) => Math.min(0, o + 1)), disabled: periodOffset >= 0, style: {
      width: "28px",
      height: "28px",
      borderRadius: "10px",
      border: `1px solid ${T.border}`,
      background: periodOffset >= 0 ? T.bgAlt : T.surface,
      cursor: periodOffset >= 0 ? "default" : "pointer",
      fontSize: "15px",
      color: periodOffset >= 0 ? T.inkFaint : T.ink,
      lineHeight: 1
    } }, "\u203A"), periodOffset !== 0 && /* @__PURE__ */ React.createElement("button", { onClick: () => setPeriodOffset(0), style: {
      padding: "5px 10px",
      borderRadius: "10px",
      border: `1px solid ${T.border}`,
      background: T.surface,
      cursor: "pointer",
      fontSize: "11px",
      color: T.inkSoft
    } }, "Hoy"))), period && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft, marginBottom: "16px", marginTop: "-8px" } }, "Mostrando ", /* @__PURE__ */ React.createElement("b", { style: { color: T.rust } }, stats.total), " da\xF1o", stats.total === 1 ? "" : "s", " detectado", stats.total === 1 ? "" : "s", " en este per\xEDodo."), /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", marginBottom: "14px", background: "#FEF3C7", border: "1px solid #F59E0B", borderRadius: "12px", fontSize: "13px", fontFamily: F.mono, color: "#991B1B" } }, /* @__PURE__ */ React.createElement("b", null, "DIAGN\xD3STICO:"), ' lectura storage = "', diag, '" \xB7 quantHistory.length = ', quantHistory.length, " \xB7 snapshot.length = ", Array.isArray(quantHistorySnapshot) ? quantHistorySnapshot.length : "no-array", " \xB7 qstats.count = ", qstats.count), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginBottom: "20px" } }, /* @__PURE__ */ React.createElement(KpiCard, { label: "Da\xF1os totales", value: stats.total }), /* @__PURE__ */ React.createElement(KpiCard, { label: "Activos", value: stats.activos, accent: "#B45309" }), /* @__PURE__ */ React.createElement(KpiCard, { label: "Promedio por veh\xEDculo", value: stats.avgPerVehicle.toFixed(1) }), /* @__PURE__ */ React.createElement(KpiCard, { label: "Requieren piezas", value: stats.reqParts, accent: "#7c3aed" }), /* @__PURE__ */ React.createElement(KpiCard, { label: "Presupuestos", value: qstats.count, accent: "#1E4D2E" }), /* @__PURE__ */ React.createElement(KpiCard, { label: "\u20AC cuantificado", value: fmtMoney(qstats.totalMoney), accent: "#3B5BFF" })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" } }, /* @__PURE__ */ React.createElement(StatPanel, { title: "Da\xF1os por gravedad" }, /* @__PURE__ */ React.createElement(Donut, { data: stats.byGravity })), /* @__PURE__ */ React.createElement(StatPanel, { title: "Estado de reparaci\xF3n" }, /* @__PURE__ */ React.createElement(Donut, { data: stats.byState })), /* @__PURE__ */ React.createElement(StatPanel, { title: "Da\xF1os por zona del veh\xEDculo", subtitle: "Top 10 zonas m\xE1s afectadas" }, /* @__PURE__ */ React.createElement(BarRank, { data: stats.byZone })), /* @__PURE__ */ React.createElement(StatPanel, { title: "Da\xF1os por tipo", subtitle: "Top 10 tipos de da\xF1o" }, /* @__PURE__ */ React.createElement(BarRank, { data: stats.byType })), /* @__PURE__ */ React.createElement(StatPanel, { title: "Da\xF1os por marca / modelo" }, /* @__PURE__ */ React.createElement(BarRank, { data: stats.byModel })), /* @__PURE__ */ React.createElement(StatPanel, { title: "Da\xF1os por sede" }, /* @__PURE__ */ React.createElement(BarRank, { data: stats.bySede })), /* @__PURE__ */ React.createElement(StatPanel, { title: "Veh\xEDculos m\xE1s problem\xE1ticos", subtitle: "Los que m\xE1s da\xF1os acumulan" }, /* @__PURE__ */ React.createElement(BarRank, { data: stats.byVehicle })), /* @__PURE__ */ React.createElement(StatPanel, { title: "\xBFRequieren piezas?" }, /* @__PURE__ */ React.createElement(Donut, { data: stats.partsData })), /* @__PURE__ */ React.createElement(StatPanel, { title: "Evoluci\xF3n mensual de da\xF1os", subtitle: "Da\xF1os registrados por mes", span: 2 }, /* @__PURE__ */ React.createElement(TrendBars, { data: stats.trend })), /* @__PURE__ */ React.createElement(StatPanel, { title: "Cobrados vs asumidos", subtitle: "Cu\xE1ntos da\xF1os se cobran vs absorbe la empresa" }, /* @__PURE__ */ React.createElement(Donut, { data: stats.absorbData })), /* @__PURE__ */ React.createElement(StatPanel, { title: "Promedio de da\xF1os por regreso" }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "38px", fontWeight: 700, fontFamily: F.display, color: T.rust } }, stats.avgPerVehicle.toFixed(1)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft } }, "da\xF1os por veh\xEDculo en la flota"))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "28px", marginBottom: "16px" } }, /* @__PURE__ */ React.createElement("h2", { style: { margin: 0, fontFamily: F.display, fontSize: "20px", fontWeight: 600, color: T.ink } }, "Cuantificaciones"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft, marginTop: "4px" } }, "Datos de los presupuestos guardados en el cuantificador.")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" } }, /* @__PURE__ */ React.createElement(KpiCard, { label: "Presupuesto promedio", value: fmtMoney(qstats.avgBudget), accent: "#3B5BFF", big: true }), /* @__PURE__ */ React.createElement(KpiCard, { label: "Total cuantificado", value: fmtMoney(qstats.totalMoney), accent: "#1E4D2E", big: true }), /* @__PURE__ */ React.createElement(StatPanel, { title: "\u20AC cuantificado por mes", span: 2 }, /* @__PURE__ */ React.createElement(TrendBars, { data: qstats.moneyTrend, money: true })), /* @__PURE__ */ React.createElement(StatPanel, { title: "\u20AC cuantificado por marca", span: 2 }, /* @__PURE__ */ React.createElement(BarRank, { data: qstats.byBrand, money: true }))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "32px", marginBottom: "10px" } }, /* @__PURE__ */ React.createElement("h2", { style: { margin: 0, fontFamily: F.display, fontSize: "20px", fontWeight: 600, color: T.ink } }, "Tiempos de revisi\xF3n"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft, marginTop: "4px" } }, "Cu\xE1nto tard\xE1s desde que un veh\xEDculo vuelve (marcado devuelto) hasta que empez\xE1s su revisi\xF3n (primera OT). Se registra autom\xE1ticamente de ahora en m\xE1s. ", /* @__PURE__ */ React.createElement("b", { style: { color: T.inkFaint } }, "Todos los tiempos se expresan en horas (h)."))), reviewStats.totalCount === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "24px", background: T.bgAlt, borderRadius: "18px", textAlign: "center", color: T.inkSoft, fontSize: "14px" } }, "Todav\xEDa no hay revisiones registradas. En cuanto marques un veh\xEDculo como devuelto e importes su OT, empezar\xE1n a aparecer ac\xE1 los tiempos.") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "14px" } }, /* @__PURE__ */ React.createElement(KpiCard, { label: `Revisiones (${period ? period.label : "todo"})`, value: reviewStats.period.n, accent: "#0891b2" }), /* @__PURE__ */ React.createElement(KpiCard, { label: "Promedio", value: fmtDur(reviewStats.period.prom), accent: "#0891b2" }), /* @__PURE__ */ React.createElement(KpiCard, { label: "Mediana", value: fmtDur(reviewStats.period.mediana) }), /* @__PURE__ */ React.createElement(KpiCard, { label: "M\xE1s r\xE1pido", value: fmtDur(reviewStats.period.min), accent: "#1E4D2E" }), /* @__PURE__ */ React.createElement(KpiCard, { label: "M\xE1s lento", value: fmtDur(reviewStats.period.max), accent: "#B45309" })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" } }, /* @__PURE__ */ React.createElement(StatPanel, { title: "Revisiones por semana", subtitle: "Cu\xE1ntos veh\xEDculos revisaste cada semana", span: 2 }, /* @__PURE__ */ React.createElement(TrendBars, { data: reviewStats.weeks.map((w) => ({ label: w.label, value: w.count })) })), /* @__PURE__ */ React.createElement(StatPanel, { title: "Tiempo promedio por semana", subtitle: "Evoluci\xF3n del tiempo de revisi\xF3n en horas (menos es mejor)", span: 2 }, /* @__PURE__ */ React.createElement(TrendBars, { data: reviewStats.weeks.map((w) => ({ label: w.label, value: Math.round(w.prom * 10) / 10 })), unit: "h" }))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkFaint, marginTop: "8px", fontStyle: "italic" } }, "Total hist\xF3rico registrado: ", reviewStats.totalCount, " revisiones \xB7 promedio general ", fmtDur(reviewStats.total.prom), "."), leftUnreviewedStats.total > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "10px", padding: "10px 14px", background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "18px" } }, "\u{1F6AA}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "15px", fontWeight: 700, color: T.ink } }, leftUnreviewedStats.countPeriodo), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "13px", color: T.inkSoft } }, " se fueron sin revisar ", period ? `en ${period.label}` : "en total"), period && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11px", color: T.inkFaint } }, " \xB7 ", leftUnreviewedStats.total, " hist\xF3rico")))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "32px", marginBottom: "10px" } }, /* @__PURE__ */ React.createElement("h2", { style: { margin: 0, fontFamily: F.display, fontSize: "20px", fontWeight: 600, color: T.ink } }, "Fianzas y presupuestos"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft, marginTop: "4px" } }, 'Cu\xE1nto tard\xE1s en gestionar la fianza o el presupuesto, medido desde que el veh\xEDculo lleg\xF3 y desde que lo revisaste. Registr\xE1s cada evento con los botones "Fianza devuelta" / "Presupuesto enviado" en la pesta\xF1a Fianzas. ', /* @__PURE__ */ React.createElement("b", { style: { color: T.inkFaint } }, "Todos los tiempos se expresan en horas (h)."))), depositStats.totalCount === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "24px", background: T.bgAlt, borderRadius: "18px", textAlign: "center", color: T.inkSoft, fontSize: "14px" } }, "Todav\xEDa no registraste ninguna fianza ni presupuesto. Us\xE1 los botones en la pesta\xF1a Fianzas cuando gestiones uno y empezar\xE1n a aparecer los tiempos ac\xE1.") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px", marginBottom: "14px" } }, /* @__PURE__ */ React.createElement("div", { style: { background: T.surface, border: `1px solid ${T.border}`, borderLeft: "4px solid #9061F9", borderRadius: "12px", padding: "14px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "15px", fontWeight: 700, color: T.ink, marginBottom: "10px" } }, "\u{1F4C4} Presupuestos enviados ", /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 400, color: T.inkSoft } }, "(", depositStats.nPres, ")")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkFaint, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" } }, "Desde que lleg\xF3"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "14px", marginBottom: "10px" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "19px", fontWeight: 700, fontFamily: F.display, color: "#9061F9" } }, fmtDur(depositStats.presDesdeeLlegada.prom)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkSoft } }, "promedio")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "19px", fontWeight: 700, fontFamily: F.display, color: T.ink } }, fmtDur(depositStats.presDesdeeLlegada.mediana)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkSoft } }, "mediana")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", fontWeight: 600, color: T.inkSoft, marginTop: "4px" } }, fmtDur(depositStats.presDesdeeLlegada.min), " \u2013 ", fmtDur(depositStats.presDesdeeLlegada.max)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkSoft } }, "m\xEDn \u2013 m\xE1x"))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkFaint, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" } }, "Desde que lo revis\xE9"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "14px" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "19px", fontWeight: 700, fontFamily: F.display, color: "#9061F9" } }, fmtDur(depositStats.presDesdeRevision.prom)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkSoft } }, "promedio")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "19px", fontWeight: 700, fontFamily: F.display, color: T.ink } }, fmtDur(depositStats.presDesdeRevision.mediana)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkSoft } }, "mediana")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", fontWeight: 600, color: T.inkSoft, marginTop: "4px" } }, fmtDur(depositStats.presDesdeRevision.min), " \u2013 ", fmtDur(depositStats.presDesdeRevision.max)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkSoft } }, "m\xEDn \u2013 m\xE1x")))), /* @__PURE__ */ React.createElement("div", { style: { background: T.surface, border: `1px solid ${T.border}`, borderLeft: "4px solid #15803D", borderRadius: "12px", padding: "14px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "15px", fontWeight: 700, color: T.ink, marginBottom: "10px" } }, "\u{1F4B0} Fianzas devueltas ", /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 400, color: T.inkSoft } }, "(", depositStats.nFianza, ")")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkFaint, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" } }, "Desde que lleg\xF3"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "14px", marginBottom: "10px" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "19px", fontWeight: 700, fontFamily: F.display, color: "#15803D" } }, fmtDur(depositStats.fianzaDesdeeLlegada.prom)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkSoft } }, "promedio")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "19px", fontWeight: 700, fontFamily: F.display, color: T.ink } }, fmtDur(depositStats.fianzaDesdeeLlegada.mediana)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkSoft } }, "mediana")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", fontWeight: 600, color: T.inkSoft, marginTop: "4px" } }, fmtDur(depositStats.fianzaDesdeeLlegada.min), " \u2013 ", fmtDur(depositStats.fianzaDesdeeLlegada.max)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkSoft } }, "m\xEDn \u2013 m\xE1x"))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkFaint, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" } }, "Desde que lo revis\xE9"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "14px" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "19px", fontWeight: 700, fontFamily: F.display, color: "#15803D" } }, fmtDur(depositStats.fianzaDesdeRevision.prom)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkSoft } }, "promedio")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "19px", fontWeight: 700, fontFamily: F.display, color: T.ink } }, fmtDur(depositStats.fianzaDesdeRevision.mediana)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkSoft } }, "mediana")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", fontWeight: 600, color: T.inkSoft, marginTop: "4px" } }, fmtDur(depositStats.fianzaDesdeRevision.min), " \u2013 ", fmtDur(depositStats.fianzaDesdeRevision.max)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: T.inkSoft } }, "m\xEDn \u2013 m\xE1x"))))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "18px", marginBottom: "6px", fontSize: "15px", fontWeight: 700, color: T.ink } }, "Clasificaci\xF3n de gestiones (nivel de disputa del presupuesto)"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "14px" } }, /* @__PURE__ */ React.createElement(KpiCard, { label: `Gestiones (${period ? period.label : "todo"})`, value: depositStats.countPeriodo }), /* @__PURE__ */ React.createElement(KpiCard, { label: "Fianzas", value: depositStats.nFianza, accent: "#15803D" }), /* @__PURE__ */ React.createElement(KpiCard, { label: "Presupuestos", value: depositStats.nPres, accent: "#9061F9" }), /* @__PURE__ */ React.createElement(KpiCard, { label: "Sin clasificar", value: depositStats.disputa.sinColor, accent: "#B45309" })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px", marginBottom: "8px" } }, /* @__PURE__ */ React.createElement(StatPanel, { title: "Presupuestos por color de disputa", subtitle: "Verde leve \xB7 amarillo moderado \xB7 rojo grave \xB7 gris sin color" }, /* @__PURE__ */ React.createElement(Donut, { data: [{ label: "Leve", value: depositStats.disputa.leve, color: "#16A34A" }, { label: "Moderado", value: depositStats.disputa.moderado, color: "#EAB308" }, { label: "Grave", value: depositStats.disputa.grave, color: "#DC2626" }, { label: "Sin color", value: depositStats.disputa.sinColor, color: "#94A3B8" }] })), /* @__PURE__ */ React.createElement(StatPanel, { title: "Presupuestos discutidos por veh\xEDculo", subtitle: "Top 10 \xB7 solo los que tienen color asignado" }, /* @__PURE__ */ React.createElement(BarRank, { data: depositStats.disputadosPorVehiculo }))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkFaint, fontStyle: "italic" } }, depositStats.countPeriodo, " eventos en ", period ? period.label : "todo el per\xEDodo", " \xB7 ", depositStats.totalCount, " en total hist\xF3rico.")), /* ===== Sección Comparativa YoY (Valencia) ===== */ React.createElement("div", { style: { marginTop: "32px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" } },
      React.createElement("div", null,
        React.createElement("h2", { style: { margin: 0, fontFamily: F.display, fontSize: "20px", fontWeight: 600, color: T.ink } }, "Comparativa vs 2025 \xB7 ", yoySedeFilter),
        React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft, marginTop: "4px", maxWidth: "620px" } },
          "Ingresos por cargo a fianza, presupuestos enviados y devoluciones completadas, sobre datos de HQ (3 sedes). Compar\xE1 semana en curso y mes hasta hoy contra el mismo per\xEDodo 2025."
        )
      ),
      React.createElement("button", { onClick: () => { setYoyUploadMsg(null); setYoyModalOpen(true); }, style: { padding: "9px 16px", fontSize: "14px", fontWeight: 700, background: T.ink, color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", whiteSpace: "nowrap" } }, "\uD83D\uDCE5 Cargar / actualizar Excels")
    ),
    (!yoyIngresos2025 && !yoyIngresos2026 && !yoyReservas2025 && !yoyReservas2026) ? React.createElement("div", { style: { padding: "18px", background: T.bgAlt, border: `1px dashed ${T.border}`, borderRadius: "18px", textAlign: "center", color: T.inkSoft, fontSize: "14px" } }, "Todav\xEDa no cargaste ning\xFAn Excel. Pulsa \u201CCargar / actualizar Excels\u201D para empezar.") : React.createElement(React.Fragment, null,
      React.createElement("div", { style: { display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap", alignItems: "center" } },
        React.createElement("span", { style: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.inkFaint, marginRight: "4px" } }, "Sede:"),
        ["Todas", "Valencia", "Onil", "Castell\xF3n"].map((sede) => React.createElement("button", { key: sede, onClick: () => setYoySedeFilter(sede), style: { padding: "5px 12px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, background: yoySedeFilter === sede ? T.rust : T.bgAlt, color: yoySedeFilter === sede ? "#FFFFFF" : T.inkSoft } }, sede))
      ),
      React.createElement("div", { style: { fontSize: "11px", color: T.inkFaint, marginBottom: "6px", fontStyle: "italic" } },
        "Semana en curso: ", fmtDateShort(yoyWindows.semanaAct.start), " \u2013 ", fmtDateShort(yoyWindows.semanaAct.end),
        " (lunes\u2013hoy) \xB7 vs 2025: ", fmtDateShort(yoyWindows.semanaLY.start), " \u2013 ", fmtDateShort(yoyWindows.semanaLY.end),
        " \xB7 vs semana anterior: ", fmtDateShort(yoyWindows.semanaPrev.start), " \u2013 ", fmtDateShort(yoyWindows.semanaPrev.end),
        " \xB7 Mes hasta hoy: ", fmtDateShort(yoyWindows.mesAct.start), " \u2013 ", fmtDateShort(yoyWindows.mesAct.end),
        " \xB7 vs 2025: ", fmtDateShort(yoyWindows.mesLY.start), " \u2013 ", fmtDateShort(yoyWindows.mesLY.end)
      ),
      yoyBloque(
        "\uD83D\uDCC5 Semana en curso",
        `${fmtDateShort(yoyWindows.semanaAct.start)} \u2013 ${fmtDateShort(yoyWindows.semanaAct.end)}`,
        yoyResults.semanaAct, yoyResults.semanaLY, yoyResults.semanaPrev,
        { ing: yoyIngresos2026, res: yoyReservas2026 }, { ing: yoyIngresos2025, res: yoyReservas2025 }
      ),
      yoyBloque(
        "\uD83D\uDCC6 Mes hasta hoy",
        `${fmtDateShort(yoyWindows.mesAct.start)} \u2013 ${fmtDateShort(yoyWindows.mesAct.end)}`,
        yoyResults.mesAct, yoyResults.mesLY, null,
        { ing: yoyIngresos2026, res: yoyReservas2026 }, { ing: yoyIngresos2025, res: yoyReservas2025 }
      )
    ),
    /* ===== Modal de carga YoY ===== */
    yoyModalOpen && React.createElement("div", { onClick: () => setYoyModalOpen(false), style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" } },
      React.createElement("div", { onClick: (e) => e.stopPropagation(), style: { background: T.bg, borderRadius: "18px", maxWidth: "640px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" } },
        React.createElement("div", { style: { padding: "18px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
          React.createElement("div", null,
            React.createElement("div", { style: { fontSize: "17px", fontWeight: 700, color: T.ink, fontFamily: F.display } }, "Cargar / actualizar Excels a\xF1o contra a\xF1o"),
            React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft, marginTop: "3px", maxWidth: "500px" } }, "Sub\xED el archivo del a\xF1o completo para 2025 (una vez) y el acumulado del 2026 (cada semana antes de imprimir el informe). Se filtra autom\xE1ticamente por Valencia y por estatus \u201CReserva Completada\u201D.")
          ),
          React.createElement("button", { onClick: () => setYoyModalOpen(false), style: { background: "transparent", border: "none", cursor: "pointer", color: T.inkSoft, fontSize: "22px", lineHeight: 1 } }, "\xD7")
        ),
        yoyUploadMsg && React.createElement("div", { style: { margin: "12px 22px 0", padding: "10px 12px", borderRadius: "12px", fontSize: "13.5px", background: yoyUploadMsg.type === "err" ? "#fee2e2" : yoyUploadMsg.type === "warn" ? "#fef3c7" : yoyUploadMsg.type === "loading" ? "#dbeafe" : "#dcfce7", color: yoyUploadMsg.type === "err" ? "#991b1b" : yoyUploadMsg.type === "warn" ? "#78350f" : yoyUploadMsg.type === "loading" ? "#1e40af" : "#166534", border: `1px solid ${yoyUploadMsg.type === "err" ? "#fca5a5" : yoyUploadMsg.type === "warn" ? "#fcd34d" : yoyUploadMsg.type === "loading" ? "#93c5fd" : "#86efac"}` } }, yoyUploadMsg.text),
        React.createElement("div", { style: { padding: "18px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
          [
            { key: "ingresos2025", label: "Ingresos 2025", desc: "Todo el a\xF1o", data: yoyIngresos2025 },
            { key: "ingresos2026", label: "Ingresos 2026", desc: "Acumulado hasta hoy", data: yoyIngresos2026 },
            { key: "reservas2025", label: "Reservas 2025", desc: "Todo el a\xF1o", data: yoyReservas2025 },
            { key: "reservas2026", label: "Reservas 2026", desc: "Acumulado hasta hoy", data: yoyReservas2026 }
          ].map((slot) => React.createElement("div", { key: slot.key, style: { border: `1px solid ${T.border}`, borderRadius: "12px", padding: "12px 14px", background: T.surface } },
            React.createElement("div", { style: { fontSize: "14px", fontWeight: 700, color: T.ink } }, slot.label),
            React.createElement("div", { style: { fontSize: "11px", color: T.inkSoft, marginBottom: "8px" } }, slot.desc),
            slot.data ? React.createElement("div", { style: { fontSize: "11.5px", color: T.inkSoft, marginBottom: "8px", lineHeight: 1.5 } },
              React.createElement("div", null, "\u2713 ", React.createElement("b", null, slot.data.meta.rowCount, " filas")),
              React.createElement("div", { style: { color: T.inkFaint } }, "Rango: ", slot.data.meta.dateMin || "?", " \u2013 ", slot.data.meta.dateMax || "?"),
              React.createElement("div", { style: { color: T.inkFaint, fontSize: "10.5px", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, slot.data.meta.fileName)
            ) : React.createElement("div", { style: { fontSize: "11.5px", color: T.inkFaint, marginBottom: "8px", fontStyle: "italic" } }, "Sin datos cargados."),
            React.createElement("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap" } },
              React.createElement("label", { style: { flex: 1, minWidth: "80px", background: T.ink, color: "#fff", padding: "6px 10px", borderRadius: "10px", cursor: "pointer", fontSize: "11.5px", fontWeight: 700, textAlign: "center" } },
                slot.data ? "Reemplazar" : "Subir",
                React.createElement("input", { type: "file", accept: ".xlsx,.xls", style: { display: "none" }, onChange: (e) => { const f = e.target.files?.[0]; e.target.value = ""; handleYoyFileUpload(slot.key, f); } })
              ),
              slot.data && React.createElement("button", { onClick: () => handleYoyClearSlot(slot.key), style: { background: "transparent", border: `1px solid ${T.border}`, color: T.inkSoft, padding: "6px 10px", borderRadius: "10px", cursor: "pointer", fontSize: "11.5px" } }, "Borrar")
            )
          ))
        ),
        React.createElement("div", { style: { padding: "12px 22px 18px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "flex-end" } },
          React.createElement("button", { onClick: () => setYoyModalOpen(false), style: { padding: "8px 18px", fontSize: "14px", fontWeight: 700, background: T.ink, color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer" } }, "Cerrar")
        )
      )
    ),
    reportOpen && /* @__PURE__ */ React.createElement("div", { onClick: () => setReportOpen(false), style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      zIndex: 1e3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    } }, /* @__PURE__ */ React.createElement("div", { onClick: (e) => e.stopPropagation(), style: {
      background: T.bg,
      borderRadius: "18px",
      width: "100%",
      maxWidth: "440px",
      overflow: "hidden"
    } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 22px", borderBottom: `1px solid ${T.border}` } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "17px", fontWeight: 700, color: T.ink, fontFamily: F.display } }, "Exportar informe semanal"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkSoft, marginTop: "3px" } }, "Una p\xE1gina por semana, con da\xF1os, reparaciones y cuantificaci\xF3n. Para imprimir o guardar como PDF.")), /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 22px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "6px", marginBottom: "14px" } }, [["ultimas", "\xDAltimas N semanas"], ["concreta", "Una semana concreta"]].map(([k, lbl]) => /* @__PURE__ */ React.createElement("button", { key: k, onClick: () => setReportMode(k), style: {
      flex: 1,
      padding: "8px",
      fontSize: "13.5px",
      fontWeight: 700,
      borderRadius: "12px",
      cursor: "pointer",
      border: "none",
      background: reportMode === k ? T.ink : T.surface,
      color: reportMode === k ? "#fff" : T.inkSoft
    } }, lbl))), reportMode === "ultimas" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", fontWeight: 700, color: T.ink, marginBottom: "8px" } }, "\xBFCu\xE1ntas semanas?"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", marginBottom: "6px" } }, [1, 2, 4, 6, 8].map((n) => /* @__PURE__ */ React.createElement("button", { key: n, onClick: () => setReportWeeks(n), style: {
      flex: 1,
      padding: "8px",
      fontSize: "14px",
      fontWeight: 700,
      borderRadius: "12px",
      cursor: "pointer",
      border: `1px solid ${reportWeeks === n ? T.rust : T.border}`,
      background: reportWeeks === n ? T.rust : "transparent",
      color: reportWeeks === n ? "#fff" : T.inkSoft
    } }, n)), /* @__PURE__ */ React.createElement("button", { onClick: () => setReportWeeks("todas"), style: {
      flex: 1.4,
      padding: "8px",
      fontSize: "13.5px",
      fontWeight: 700,
      borderRadius: "12px",
      cursor: "pointer",
      border: `1px solid ${reportWeeks === "todas" ? T.rust : T.border}`,
      background: reportWeeks === "todas" ? T.rust : "transparent",
      color: reportWeeks === "todas" ? "#fff" : T.inkSoft
    } }, "Todas")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkSoft, marginBottom: "18px" } }, reportWeeks === "todas" ? `Todo el hist\xF3rico: ${totalWeeksAvailable} semana${totalWeeksAvailable !== 1 ? "s" : ""} desde el primer registro (${totalWeeksAvailable} p\xE1gina${totalWeeksAvailable !== 1 ? "s" : ""})` : reportWeeks === 1 ? "Solo la semana en curso (una p\xE1gina)" : `Las \xFAltimas ${reportWeeks} semanas (${reportWeeks} p\xE1ginas)`)) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", fontWeight: 700, color: T.ink, marginBottom: "8px" } }, "\xBFQu\xE9 semana?"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "6px", marginBottom: "8px" } }, [[1, "La semana pasada"], [0, "Esta semana"]].map(([off, lbl]) => /* @__PURE__ */ React.createElement("button", { key: off, onClick: () => setReportOffset(off), style: {
      flex: 1,
      padding: "8px",
      fontSize: "13.5px",
      fontWeight: 700,
      borderRadius: "12px",
      cursor: "pointer",
      border: `1px solid ${reportOffset === off ? T.rust : T.border}`,
      background: reportOffset === off ? T.rust : "transparent",
      color: reportOffset === off ? "#fff" : T.inkSoft
    } }, lbl))), /* @__PURE__ */ React.createElement(
      "select",
      {
        value: reportOffset,
        onChange: (e) => setReportOffset(parseInt(e.target.value)),
        style: {
          width: "100%",
          padding: "9px 10px",
          fontSize: "14px",
          borderRadius: "12px",
          border: `1px solid ${T.border}`,
          background: T.surface,
          color: T.ink,
          cursor: "pointer"
        }
      },
      Array.from({ length: 16 }, (_, i) => i).map((off) => /* @__PURE__ */ React.createElement("option", { key: off, value: off }, weekRangeLabel(off), off === 0 ? "  (esta semana)" : off === 1 ? "  (la pasada)" : ""))
    ), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: T.inkSoft, margin: "8px 0 18px" } }, "Una sola p\xE1gina: ", /* @__PURE__ */ React.createElement("strong", null, weekRangeLabel(reportOffset)), ". Ninguna otra semana.")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", fontWeight: 700, color: T.ink, marginBottom: "8px" } }, "\xBFQu\xE9 sedes?"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "8px" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setReportSedes([]), style: {
      padding: "6px 12px",
      fontSize: "13px",
      fontWeight: 600,
      borderRadius: "999px",
      cursor: "pointer",
      border: `1px solid ${reportSedes.length === 0 ? T.rust : T.border}`,
      background: reportSedes.length === 0 ? T.rust : "transparent",
      color: reportSedes.length === 0 ? "#fff" : T.inkSoft
    } }, "Todas"), ["Valencia", "Onil", "Castell\xF3n", "Alicante"].map((s) => {
      const on = reportSedes.includes(s);
      return /* @__PURE__ */ React.createElement("button", { key: s, onClick: () => setReportSedes((prev) => on ? prev.filter((x) => x !== s) : [...prev, s]), style: {
        padding: "6px 12px",
        fontSize: "13px",
        fontWeight: 600,
        borderRadius: "999px",
        cursor: "pointer",
        border: `1px solid ${on ? T.rust : T.border}`,
        background: on ? T.rust : "transparent",
        color: on ? "#fff" : T.inkSoft
      } }, s);
    }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 22px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement("button", { onClick: doExportTotalReport, style: {
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: 700,
      borderRadius: "12px",
      border: "none",
      background: "#3B5BFF",
      color: "#fff",
      cursor: "pointer"
    }, title: "Informe semanal financiero: KPIs Valencia, comparativa 3 sedes, evoluci\xF3n mensual vs 2025, tiempos operativos, acumulado desde 18/05/2026" }, "\uD83D\uDCC4 Informe SEMANAL"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "10px" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setReportOpen(false), style: {
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: 600,
      borderRadius: "12px",
      border: `1px solid ${T.border}`,
      background: "transparent",
      color: T.inkSoft,
      cursor: "pointer"
    } }, "Cancelar"), /* @__PURE__ */ React.createElement("button", { onClick: doExportReport, style: {
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: 700,
      borderRadius: "12px",
      border: "none",
      background: "#15803D",
      color: "#fff",
      cursor: "pointer"
    } }, "Descargar informe semanal"))))));
  };
  const KpiCard = ({ label, value, accent, big }) => /* @__PURE__ */ React.createElement("div", { style: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: "12px",
    padding: big ? "18px 20px" : "14px 16px",
    borderTop: `3px solid ${accent || T.ink}`
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.inkSoft, marginBottom: "6px" } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: big ? "30px" : "24px", fontWeight: 700, fontFamily: F.display, color: accent || T.ink, lineHeight: 1 } }, value));
  function ImportReservationsModal({ open, onClose, vehicles, onApply, mode = "reservas", resWatchStatus, resWatchLog, onToggleResWatch }) {
    const isEnAlquiler = mode === "enalquiler";
    const [stage, setStage] = useState("upload");
    const [parsed, setParsed] = useState(null);
    const [error, setError] = useState(null);
    const [pasteText, setPasteText] = useState("");
    React.useEffect(() => {
      if (!open) {
        setStage("upload");
        setParsed(null);
        setError(null);
        setPasteText("");
      }
    }, [open]);
    const handlePaste = () => {
      setError(null);
      const records = parsePastedText(pasteText);
      if (records.length === 0) {
        setError("No encontr\xE9 reservas en el texto pegado. Revis\xE1 el formato (una reserva por l\xEDnea, campos separados por |).");
        return;
      }
      setParsed(buildParsed(records));
      setStage("preview");
    };
    const parseAcId = (s) => {
      const m = String(s || "").trim().match(/^(AC-\d+[A-Z]?|CB-\d+)/);
      return m ? m[1] : null;
    };
    const acKey = (s) => {
      const m = String(s || "").trim().match(/^(AC|CB)-(\d+)/i);
      return m ? `${m[1].toUpperCase()}-${m[2]}` : null;
    };
    const parsePlate = (s) => {
      const m = String(s || "").toUpperCase().match(/\b(\d{4}[A-Z]{3})\b/);
      return m ? m[1] : null;
    };
    const toIso = (v) => {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString();
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

const parseOTDateTime = (value) => {
  if (!value) return null;
  const s = String(value).trim();

  const m = s.match(
    /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})(?:\s+|T)(\d{1,2}):(\d{2})$/
  );

  if (m) {
    let [, dd, mm, yyyy, hh, min] = m;

    if (yyyy.length === 2) {
      yyyy = `20${yyyy}`;
    }

    const d = new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      Number(hh),
      Number(min)
    );

    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  return toIso(value);
};
    const parseHqDate = (s) => {
      if (!s) return null;
      const m = String(s).trim().match(/(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
      if (!m) return toIso(s);
      const [, dd, mm, yyyy, hh = "0", mi = "0"] = m;
      const d = new Date(+yyyy, +mm - 1, +dd, +hh, +mi);
      return isNaN(d.getTime()) ? null : d.toISOString();
    };
    const buildParsed = (records) => {
      const VALID = ["Reserva confirmada", "En Alquiler", "Reserva Completada"];
      const byVehicle = {};
      let totalValid = 0, totalIgnored = 0;
      const ignoredStatuses = {};
      const unknownVehicles = /* @__PURE__ */ new Set();
      for (const rec of records) {
        const estatus = rec.estatus;
        if (!VALID.includes(estatus)) {
          totalIgnored++;
          if (estatus) ignoredStatuses[estatus] = (ignoredStatuses[estatus] || 0) + 1;
          continue;
        }
        const vehCell = rec.vehiculo;
        const ac = parseAcId(vehCell);
        if (!ac) {
          totalIgnored++;
          continue;
        }
        const key = acKey(vehCell);
        const plate = parsePlate(vehCell);
        const matched = vehicles.find(
          (v) => acKey(v.id) === key || plate && (v.plate || "").toUpperCase() === plate
        );
        const groupKey = matched ? matched.id : ac;
        if (!matched) unknownVehicles.add(ac);
        (byVehicle[groupKey] = byVehicle[groupKey] || []).push({
          salida: rec.salida,
          devolucion: rec.devolucion,
          estatus,
          cliente: rec.cliente,
          sede: rec.sede
        });
        totalValid++;
      }
      return { byVehicle, totalValid, totalIgnored, ignoredStatuses, unknownVehicles: [...unknownVehicles], totalRows: records.length };
    };
    const parsePastedText = (text) => {
      const records = [];
      for (const raw of String(text || "").split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const parts = line.split("|").map((p) => p.trim());
        if (parts.length < 4) continue;
        const [estatus, vehiculo, salida, devolucion, cliente = "", sede = ""] = parts;
        records.push({
          estatus,
          vehiculo,
          salida: parseHqDate(salida),
          devolucion: parseHqDate(devolucion),
          cliente,
          sede
        });
      }
      return records;
    };
    const handleFile = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setError(null);
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const wb = XLSX.read(new Uint8Array(evt.target.result), { type: "array", cellDates: true });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(ws, { defval: null });
          if (rows.length === 0) {
            setError("El Excel no tiene filas.");
            return;
          }
          const col = (row, ...names) => {
            for (const n of names) {
              const key = Object.keys(row).find((k) => k.toLowerCase().trim() === n.toLowerCase());
              if (key) return row[key];
            }
            return null;
          };
          const records = rows.map((r) => ({
            estatus: col(r, "Estatus", "Estado"),
            vehiculo: col(r, "Veh\xEDculo", "Vehiculo"),
            salida: toIso(col(r, "Fecha de entrega")),
            devolucion: toIso(col(r, "Fecha de devoluci\xF3n", "Fecha de devolucion")),
            cliente: col(r, "Cliente"),
            sede: col(r, "Lugar de entrega"),
            reservaId: col(r, "#", "ID", "Id", "N\xBA", "Numero", "N\xFAmero", "Reserva", "ID Reserva")
          }));
          setParsed(buildParsed(records));
          setStage("preview");
        } catch (err) {
          setError("No se pudo leer el Excel: " + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    };
    if (!open) return null;
    const fmtDate = (iso) => {
      if (!iso) return "\u2014";
      const d = new Date(iso);
      return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }) + " " + d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    };
    const today2 = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    return /* @__PURE__ */ React.createElement(Modal, { open, onClose, title: isEnAlquiler ? "Importar veh\xEDculos en alquiler" : "Importar reservas de HQ", width: 760 }, stage === "upload" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontSize: "14px", color: T.inkSoft, lineHeight: 1.6, marginTop: 0 } }, isEnAlquiler ? /* @__PURE__ */ React.createElement(React.Fragment, null, "Sub\xED el Excel de veh\xEDculos ", /* @__PURE__ */ React.createElement("b", null, "en alquiler actualmente"), ". El cockpit los va a marcar ", /* @__PURE__ */ React.createElement("b", null, "EN USO"), ' y les va a cargar su fecha de salida y de devoluci\xF3n. La fecha de devoluci\xF3n har\xE1 que pasen solos a "Por revisar" cuando lleguen.') : /* @__PURE__ */ React.createElement(React.Fragment, null, "Sub\xED el Excel semanal de reservas de HQ. El cockpit va a leer las reservas ", /* @__PURE__ */ React.createElement("b", null, "confirmadas"), " y ", /* @__PURE__ */ React.createElement("b", null, "en alquiler"), " para completar autom\xE1ticamente las fechas de salida y devoluci\xF3n de cada veh\xEDculo. Las reservas en estado presupuesto, pendiente o cancelado se ignoran.")), /* @__PURE__ */ React.createElement("label", { style: {
      display: "block",
      border: `2px dashed ${T.border}`,
      borderRadius: "18px",
      padding: "28px",
      textAlign: "center",
      cursor: "pointer",
      background: T.bg,
      marginTop: "16px"
    } }, /* @__PURE__ */ React.createElement(Upload, { size: 28, style: { color: T.rust, marginBottom: "8px" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "15px", fontWeight: 600, color: T.ink } }, isEnAlquiler ? "Seleccionar Excel de en alquiler" : "Seleccionar Excel de reservas"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", color: T.inkFaint, marginTop: "4px" } }, ".xlsx exportado desde HQ"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".xlsx,.xls", onChange: handleFile, style: { display: "none" } })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px", margin: "18px 0 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: "1px", background: T.border } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11px", fontWeight: 700, color: T.inkFaint, textTransform: "uppercase", letterSpacing: "0.05em" } }, "o pegar del HQ"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: "1px", background: T.border } })), /* @__PURE__ */ React.createElement("div", { style: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: "18px", padding: "14px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13.5px", color: T.inkSoft, marginBottom: "8px", lineHeight: 1.5 } }, "Peg\xE1 ac\xE1 el texto de reservas que te pasa Claude tras leer el HQ. Una reserva por l\xEDnea."), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        value: pasteText,
        onChange: (e) => setPasteText(e.target.value),
        placeholder: "Estatus | Veh\xEDculo | Entrega | Devoluci\xF3n | Cliente | Sede\nEn Alquiler | AC-304 Tessoro 440 5028NBW | 27-07-2026 14:00 | 03-08-2026 10:00 | Cristina Benavent | Valencia",
        style: {
          width: "100%",
          minHeight: "120px",
          boxSizing: "border-box",
          padding: "10px 12px",
          fontSize: "11.5px",
          fontFamily: F.mono,
          border: `1px solid ${T.border}`,
          borderRadius: "12px",
          background: T.bg,
          color: T.ink,
          resize: "vertical",
          lineHeight: 1.5
        }
      }
    ), /* @__PURE__ */ React.createElement("button", { onClick: handlePaste, disabled: !pasteText.trim(), style: {
      marginTop: "10px",
      padding: "9px 18px",
      fontSize: "14px",
      fontWeight: 700,
      borderRadius: "12px",
      cursor: pasteText.trim() ? "pointer" : "default",
      border: "none",
      background: pasteText.trim() ? T.rust : T.border,
      color: "#fff"
    } }, "Procesar reservas pegadas")), error && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "12px", padding: "10px 14px", background: "#FEE2E2", color: "#991B1B", borderRadius: "12px", fontSize: "13px" } }, error), !isEnAlquiler && onToggleResWatch && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px", margin: "18px 0 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: "1px", background: T.border } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11px", fontWeight: 700, color: T.inkFaint, textTransform: "uppercase", letterSpacing: "0.05em" } }, "o carpeta autom\xE1tica"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: "1px", background: T.border } })), /* @__PURE__ */ React.createElement("div", { style: {
      background: resWatchStatus === "active" ? "#EAF7EE" : T.surface,
      border: `1px solid ${resWatchStatus === "active" ? "#15803D" : T.border}`,
      borderRadius: "18px",
      padding: "14px"
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13.5px", color: T.inkSoft, lineHeight: 1.5, marginBottom: "10px" } }, "Vincul\xE1 una carpeta y el cockpit la revisar\xE1 cada 30s. Cuando aparezca un archivo de reservas nuevo, ", /* @__PURE__ */ React.createElement("b", null, "lo importa solo"), ", sin preguntar.", /* @__PURE__ */ React.createElement("div", { style: { marginTop: "6px", fontSize: "11px", color: T.inkFaint } }, /* @__PURE__ */ React.createElement("b", null, "El nombre del archivo decide el tipo"), ", as\xED que nunca se confunden:", /* @__PURE__ */ React.createElement("div", { style: { marginTop: "5px" } }, "\u2022 ", /* @__PURE__ */ React.createElement("span", { style: { color: "#0891b2", fontWeight: 700 } }, "EN ALQUILER"), " (alquiladas ahora) \u2192 nombr\xE1 el archivo ", /* @__PURE__ */ React.createElement("b", null, "EN ALQUILER"), " (ej: ", /* @__PURE__ */ React.createElement("code", null, "EN ALQUILER.xlsx"), ")"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "2px" } }, "\u2022 ", /* @__PURE__ */ React.createElement("span", { style: { color: "#3B5BFF", fontWeight: 700 } }, "SALIDAS DE LA SEMANA"), " (las que van a salir) \u2192 nombr\xE1 el archivo ", /* @__PURE__ */ React.createElement("b", null, "ESTA SEMANA"), " (ej: ", /* @__PURE__ */ React.createElement("code", null, "ESTA SEMANA.xlsx"), ")"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "6px", fontSize: "10.5px", color: T.inkFaint, fontStyle: "italic" } }, "Solo se importan archivos llamados ", /* @__PURE__ */ React.createElement("b", null, "EN ALQUILER"), " o ", /* @__PURE__ */ React.createElement("b", null, "ESTA SEMANA"), ". Cualquier otro archivo de la carpeta (ej. SEMANA PR\xD3XIMA para otra app) se ignora."))), /* @__PURE__ */ React.createElement("button", { onClick: onToggleResWatch, style: {
      padding: "9px 16px",
      fontSize: "13.5px",
      fontWeight: 700,
      borderRadius: "12px",
      cursor: "pointer",
      border: "none",
      background: resWatchStatus === "active" ? "#15803D" : T.rust,
      color: "#fff"
    } }, resWatchStatus === "active" ? "\u25CF Carpeta vinculada \u2014 clic para detener" : "Vincular carpeta de reservas"), resWatchStatus === "error" && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "8px", fontSize: "11px", color: "#DC2626" } }, "No pude leer la carpeta. Volv\xE9 a vincularla (el permiso se pierde al cerrar el navegador)."), resWatchLog && resWatchLog.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "12px", borderTop: `1px solid ${T.border}`, paddingTop: "10px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", fontWeight: 700, color: T.ink, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" } }, "\xDAltimas importaciones"), resWatchLog.slice(0, 6).map((r, i) => {
      const enAlq = r.tipo === "enalquiler";
      const hora = r.at ? new Date(r.at).toLocaleString("es-ES", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "";
      return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: "8px", padding: "5px 0", fontSize: "11.5px", borderBottom: i < Math.min(resWatchLog.length, 6) - 1 ? `1px solid ${T.border}22` : "none" } }, /* @__PURE__ */ React.createElement("span", { style: {
        flexShrink: 0,
        fontSize: "9.5px",
        fontWeight: 800,
        letterSpacing: "0.03em",
        padding: "2px 7px",
        borderRadius: "10px",
        color: "#fff",
        background: enAlq ? "#0891b2" : "#3B5BFF"
      } }, r.label || (enAlq ? "EN ALQUILER" : "SALIDAS DE LA SEMANA")), /* @__PURE__ */ React.createElement("span", { style: { color: T.ink, fontWeight: 600 } }, r.applied, " reservas", r.vehiculos ? ` \xB7 ${r.vehiculos} veh\xEDculos` : ""), /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", color: T.inkFaint, fontSize: "10.5px" } }, hora));
    }))))), stage === "preview" && parsed && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#D7EFDA", color: "#1F4D2E", borderRadius: "12px", padding: "8px 14px", fontSize: "14px", fontWeight: 700 } }, parsed.totalValid, " reservas v\xE1lidas"), /* @__PURE__ */ React.createElement("div", { style: { background: T.bgAlt, color: T.inkSoft, borderRadius: "12px", padding: "8px 14px", fontSize: "14px" } }, parsed.totalIgnored, " ignoradas"), /* @__PURE__ */ React.createElement("div", { style: { background: T.bgAlt, color: T.inkSoft, borderRadius: "12px", padding: "8px 14px", fontSize: "14px" } }, Object.keys(parsed.byVehicle).length, " veh\xEDculos")), parsed.unknownVehicles.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "14px", padding: "10px 14px", background: "#FEF3C7", color: "#92400E", borderRadius: "12px", fontSize: "13px" } }, "\u26A0 ", parsed.unknownVehicles.length, " veh\xEDculo(s) del Excel no est\xE1n en tu flota: ", parsed.unknownVehicles.join(", "), ". Se importar\xE1n igual pero revis\xE1 que el AC ID coincida."), /* @__PURE__ */ React.createElement("div", { style: { maxHeight: "380px", overflowY: "auto", border: `1px solid ${T.border}`, borderRadius: "12px" } }, /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "13px" } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: T.bgAlt, position: "sticky", top: 0 } }, /* @__PURE__ */ React.createElement("th", { style: { padding: "8px 10px", textAlign: "left", fontSize: "10px", textTransform: "uppercase", color: T.inkSoft } }, "Veh\xEDculo"), /* @__PURE__ */ React.createElement("th", { style: { padding: "8px 10px", textAlign: "left", fontSize: "10px", textTransform: "uppercase", color: T.inkSoft } }, "Estado"), /* @__PURE__ */ React.createElement("th", { style: { padding: "8px 10px", textAlign: "left", fontSize: "10px", textTransform: "uppercase", color: T.inkSoft } }, "Salida"), /* @__PURE__ */ React.createElement("th", { style: { padding: "8px 10px", textAlign: "left", fontSize: "10px", textTransform: "uppercase", color: T.inkSoft } }, "Devoluci\xF3n"))), /* @__PURE__ */ React.createElement("tbody", null, Object.entries(parsed.byVehicle).sort((a, b) => a[0].localeCompare(b[0], void 0, { numeric: true })).flatMap(
      ([ac, res]) => res.map((r, i) => /* @__PURE__ */ React.createElement("tr", { key: ac + i, style: { borderTop: `1px solid ${T.border}` } }, /* @__PURE__ */ React.createElement("td", { style: { padding: "7px 10px", fontFamily: F.mono, fontWeight: 700, color: T.rust } }, i === 0 ? ac : ""), /* @__PURE__ */ React.createElement("td", { style: { padding: "7px 10px" } }, /* @__PURE__ */ React.createElement("span", { style: {
        fontSize: "10px",
        fontWeight: 700,
        padding: "2px 7px",
        borderRadius: "10px",
        background: r.estatus === "En Alquiler" ? "#F2E9FB" : "#E9EEFC",
        color: r.estatus === "En Alquiler" ? "#6D28D9" : "#2B44C7"
      } }, r.estatus)), /* @__PURE__ */ React.createElement("td", { style: { padding: "7px 10px", color: T.ink } }, fmtDate(r.salida)), /* @__PURE__ */ React.createElement("td", { style: { padding: "7px 10px", color: T.ink } }, fmtDate(r.devolucion))))
    )))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setStage("upload") }, "\u2190 Otro archivo"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px" } }, /* @__PURE__ */ React.createElement(Btn, { variant: "secondary", onClick: onClose }, "Cancelar"), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", icon: Calendar, onClick: () => {
      onApply(parsed.byVehicle);
      onClose();
    } }, isEnAlquiler ? `Marcar EN USO ${Object.keys(parsed.byVehicle).length} veh\xEDculos` : `Aplicar fechas a ${Object.keys(parsed.byVehicle).length} veh\xEDculos`)))));
  }
  // ===== Copia de seguridad de las OT en OneDrive =====
  function ArchivePanel({ info, onArchive }) {
    if (!info) return null;
    const h = React.createElement;
    const dias = info.lastAt ? Math.floor((Date.now() - new Date(info.lastAt).getTime()) / 864e5) : null;
    const warn = info.pend > 0 && (dias === null || dias >= 7);
    const cuando = info.lastAt ? (dias === 0 ? "hoy" : dias === 1 ? "ayer" : `hace ${dias} días`) : "nunca";
    return h("div", { style: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", background: warn ? "#FEF3C7" : T.surface, border: `1px solid ${warn ? "#F59E0B" : T.border}`, borderRadius: "10px", padding: "10px 14px", marginBottom: "14px", fontSize: "13px", color: T.ink } },
      h("span", { style: { fontWeight: 800 } }, "📁 Copia en OneDrive"),
      h("span", { style: { color: T.inkSoft } }, `última: ${cuando}${info.carpeta ? " · " + info.carpeta : ""}`),
      h("span", { style: { fontWeight: 700, color: info.pend ? (warn ? "#92400E" : T.warn) : T.ok } }, info.pend ? `${info.pend} OT sin archivar` : "todo archivado ✓"),
      info.msg && h("span", { style: { color: T.inkSoft } }, info.msg),
      h("div", { style: { flex: 1 } }),
      info.soportado
        ? h(Btn, { variant: warn ? "primary" : "secondary", sm: true, disabled: info.busy, onClick: (e) => onArchive(e && e.shiftKey) }, info.busy ? "Archivando…" : "Archivar ahora")
        : h("span", { style: { fontSize: "12px", color: T.inkSoft, fontStyle: "italic" } }, "se archiva desde el PC"));
  }
  // ===== OT pendientes de confirmar (llegan de la app de revisiones en la nube) =====
  // Cada OT es una ficha independiente: se acumulan hasta que alguien las confirma.
  // Del mismo vehículo solo se puede abrir la más antigua (si no, la segunda vería
  // como "nuevos" los daños de la primera aún sin confirmar y se duplicarían).
  function RevPendPanel({ items, openingId, onOpen }) {
    if (!items || items.length === 0) return null;
    const seen = new Set();
    const rows = items.map((r) => { const blocked = seen.has(r.veh_id); seen.add(r.veh_id); return { r, blocked }; });
    const fmt = (iso) => { try { return new Date(iso).toLocaleString("es-ES", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); } catch { return ""; } };
    const h = React.createElement;
    return h("div", { style: { background: T.surface, border: `1.5px solid ${T.rust}`, borderRadius: "12px", padding: "14px 16px", marginBottom: "18px" } },
      h("div", { style: { display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "10px", flexWrap: "wrap" } },
        h("div", { style: { fontWeight: 800, fontSize: "16px", color: T.ink } }, "📥 OT pendientes de confirmar"),
        h("span", { style: { background: T.rust, color: "#fff", borderRadius: "10px", padding: "1px 8px", fontSize: "12px", fontWeight: 700 } }, items.length),
        h("span", { style: { fontSize: "12px", color: T.inkSoft } }, "Sus daños no entran al cockpit hasta que las confirmes.")),
      rows.map(({ r, blocked }) => {
        const d = r.data || {};
        const nd = (d.dmgs || []).length;
        return h("div", { key: r.id, style: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", padding: "8px 0", borderTop: `1px solid ${T.border}`, opacity: blocked ? 0.6 : 1 } },
          h("div", { style: { fontWeight: 800, color: T.ink, minWidth: "70px" } }, r.veh_id),
          h("div", { style: { fontSize: "13px", color: T.inkSoft, fontFamily: F.mono } }, (d.veh && d.veh.plate) || ""),
          h("div", { style: { fontSize: "13px", color: T.ink } }, `OT (${r.revnum})`),
          h("div", { style: { fontSize: "12px", color: T.inkSoft } }, fmt(r.fecha)),
          r.inspector && h("div", { style: { fontSize: "12px", color: T.inkSoft } }, "👤 " + String(r.inspector).split("@")[0]),
          h("div", { style: { fontSize: "12px", color: nd ? T.warn : T.ok, fontWeight: 700 } }, nd ? `${nd} daño${nd > 1 ? "s" : ""}` : "sin daños"),
          r.estado === "editada" && h("span", { style: { fontSize: "11px", fontWeight: 700, background: "#FEF3C7", color: "#92400E", padding: "2px 7px", borderRadius: "6px" } }, "✏️ Editada"),
          h("div", { style: { flex: 1 } }),
          blocked
            ? h("span", { style: { fontSize: "12px", color: T.inkSoft, fontStyle: "italic" } }, "⏳ espera a confirmar la anterior de este vehículo")
            : h(Btn, { variant: "primary", sm: true, disabled: !!openingId, onClick: () => onOpen(r) }, openingId === r.id ? "Cargando…" : "Revisar y confirmar"));
      }));
  }
  function App() {
    const [state, setState] = useState(DEFAULT_STATE);
    const [loaded, setLoaded] = useState(false);
    // Tema claro/oscuro (persistido en el navegador). applyTheme apunta el T global
    // a la paleta elegida ANTES de renderizar los hijos, así toda la app cambia.
    const [theme, setTheme] = useState(() => { try { return localStorage.getItem("acllar_theme") === "dark" ? "dark" : "light"; } catch { return "light"; } });
    applyTheme(theme);
    const toggleTheme = () => setTheme((p) => { const n = p === "dark" ? "light" : "dark"; try { localStorage.setItem("acllar_theme", n); } catch { } return n; });
    useEffect(() => {
      try {
        document.documentElement.style.background = T.bg;
        document.body.style.background = T.bg;
        document.body.style.color = T.ink;
        document.documentElement.style.colorScheme = theme === "dark" ? "dark" : "light";
      } catch { }
    }, [theme]);
const [activeTab, setActiveTab] = useState("today");
const [detailOrigin, setDetailOrigin] = useState("fleet");    
const [globalSede, setGlobalSede] = useState([]);
    const [quantHistorySnapshot, setQuantHistorySnapshot] = useState([]);
    useEffect(() => {
      if (activeTab !== "stats") return;
      let active = true;
      const load = () => {
        try {
          if (typeof window !== "undefined" && window.storage?.get) {
            window.storage.get("ac_history").then((r) => {
              if (!active || !r?.value) return;
              try {
                const raw = JSON.parse(r.value);
                if (Array.isArray(raw)) setQuantHistorySnapshot(raw);
              } catch {
              }
            }).catch(() => {
            });
          }
        } catch {
        }
      };
      load();
      const timers = [setTimeout(load, 250), setTimeout(load, 800)];
      return () => {
        active = false;
        timers.forEach(clearTimeout);
      };
    }, [activeTab]);
    useEffect(() => {
      try {
        if (typeof window !== "undefined" && window.storage?.get) {
          window.storage.get("global_sede_filter").then((res) => {
            if (res?.value) {
              try {
                const parsed = JSON.parse(res.value);
                if (Array.isArray(parsed)) {
                  setGlobalSede(parsed);
                  return;
                }
              } catch {
              }
              if (res.value === "todas") setGlobalSede([]);
              else setGlobalSede([res.value]);
            }
          }).catch(() => {
          });
        }
      } catch {
      }
    }, []);
    const changeGlobalSede = (sede) => {
      setGlobalSede((prev) => {
        let next;
        if (sede === "todas") {
          next = [];
        } else if (prev.includes(sede)) {
          next = prev.filter((s) => s !== sede);
        } else {
          next = [...prev, sede];
        }
        try {
          if (typeof window !== "undefined" && window.storage?.set) {
            window.storage.set("global_sede_filter", JSON.stringify(next)).catch(() => {
            });
          }
        } catch {
        }
        return next;
      });
    };
    const [view, setView] = useState("list");
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [vehicleModal, setVehicleModal] = useState(null);
    const [damageModal, setDamageModal] = useState(null);
    const [backupModalOpen, setBackupModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [reservationsModalOpen, setReservationsModalOpen] = useState(false);
    const [enAlquilerModalOpen, setEnAlquilerModalOpen] = useState(false);
    const [rentalModalVehicle, setRentalModalVehicle] = useState(null);
    const [quantifyModalVehicleId, setQuantifyModalVehicleId] = useState(null);
    const [watchHandle, setWatchHandle] = useState(null);
    const [watchStatus, setWatchStatus] = useState("off");
    const [watchLog, setWatchLog] = useState([]);
    const importedFilesRef = useRef(/* @__PURE__ */ new Set());
    const [resWatchHandle, setResWatchHandle] = useState(null);
    const [resWatchStatus, setResWatchStatus] = useState("off");
    const [resWatchLog, setResWatchLog] = useState([]);
    const resImportedFilesRef = useRef(/* @__PURE__ */ new Map());
    const [confirmDialog, setConfirmDialog] = useState(null);
    const requestConfirm = useCallback((opts) => new Promise((resolve) => {
      setConfirmDialog({ ...opts, resolve });
    }), []);
    const closeConfirm = (result) => {
      if (confirmDialog?.resolve) confirmDialog.resolve(result);
      setConfirmDialog(null);
    };
    useEffect(() => {
      (async () => {
        const data = await loadFromStorage();
        setState(data);
        setLoaded(true);
      })();
    }, []);
    useEffect(() => {
      if (!loaded) return;
      saveToStorage({ ...state, meta: { ...state.meta, lastModifiedAt: nowIso() } });
    }, [state, loaded]);
    // NUBE: si otro dispositivo guardó cambios, nube.js ya actualizó la copia
    // local; aquí recargamos el estado en pantalla sin recargar la página.
    // El cuantificador guarda sus datos aparte: si llegan cambios remotos de
    // sus claves, se vuelve a montar para que lea la versión nueva.
    const [quantKey, setQuantKey] = useState(0);
    useEffect(() => {
      const C = window.acllarCloud;
      const onRemote = async (ev) => {
        const key = ev.detail && ev.detail.key;
        if (key === STORAGE_KEY) {
          const data = await loadFromStorage();
          setState(data);
          if (C && C.ack) C.ack(STORAGE_KEY);
        } else if (C && C.QUANT_DOCS && C.QUANT_DOCS.includes(key)) {
          setQuantKey((k) => k + 1);
        }
      };
      window.addEventListener("acllar-remote-update", onRemote);
      return () => window.removeEventListener("acllar-remote-update", onRemote);
    }, []);
    useEffect(() => {
      const C = window.acllarCloud;
      if (quantKey && C && C.ack) C.QUANT_DOCS.forEach((d) => C.ack(d));
    }, [quantKey]);
    // AUTO-SYNC RECAMBIOS: cada daño activo que requiere pieza tiene su línea
    // automáticamente (sin "Traer del cockpit"). El código se autollena desde la
    // memoria de piezas si ya se conoce; si no, queda "sin código". Las líneas
    // cuyo daño ya no está activo (reparado/asumido) se ocultan en la vista, no se
    // borran, así se preservan estado (pedido/recibido) y datos si el daño reabre.
    useEffect(() => {
      if (!loaded) return;
      setState((s) => {
        const existing = s.partsToOrder || [];
        const already = new Set(existing.map((p) => p.sourceDamageId).filter(Boolean));
        const memory = s.partsMemory || {};
        const vehById = {};
        (s.vehicles || []).forEach((v) => { vehById[v.id] = v; });
        const nuevos = [];
        for (const d of s.damages || []) {
          if (d.state === "REPARADO" || d.state === "ASUMIDO") continue;
          if (!d.requierePiezas) continue;
          if (already.has(d.id)) continue;
          const v = vehById[d.vehicleId];
          if (v && v.baja) continue; // vehículo fuera de flota: no materializar sus piezas
          const modelo = v ? [v.brand, v.model].filter(Boolean).join(" ") || v.marca || "" : "";
          const remembered = lookupPartMemoryModelo(memory, d.vehicleId, modelo, d.zona);
          nuevos.push({
            id: `PO-auto-${d.id}`,
            vehicleId: d.vehicleId,
            ac: d.vehicleId,
            modelo,
            zona: d.zona || "",
            tipoDano: d.tipoDano || "",
            elementCode: d.elementCode || null,
            pdfCode: d.pdfCode || null,
            piezas: [{
              id: `PI-auto-${d.id}`,
              codigo: remembered?.codigo || "",
              descripcion: remembered?.descripcion || "",
              notas: remembered?.notas || "",
              cantidad: 1,
              estado: "por_pedir",
              proveedor: remembered?.proveedor || "",
              pvr: remembered?.pvr || "",
              horas: remembered?.horas || ""
            }],
            codigo: remembered?.codigo || "",
            descripcion: remembered?.descripcion || "",
            notas: remembered?.notas || "",
            cantidad: 1,
            estado: "por_pedir",
            createdAt: nowIso(),
            sourceOT: d.sourceFile || "cockpit",
            sourceDamageId: d.id,
            autoFilled: remembered ? remembered.via : null
          });
        }
        if (nuevos.length === 0) return s;
        return { ...s, partsToOrder: [...existing, ...nuevos] };
      });
    }, [loaded, state.damages, state.vehicles]);
    const selectedVehicle = useMemo(
      () => state.vehicles.find((v) => v.id === selectedVehicleId) || null,
      [state.vehicles, selectedVehicleId]
    );
    const selectedDamages = useMemo(
      () => state.damages.filter((d) => d.vehicleId === selectedVehicleId),
      [state.damages, selectedVehicleId]
    );
    const backupReminder = useMemo(() => {
      if (!loaded || state.vehicles.length === 0) return null;
      if (!(window.acllarEsAdmin && window.acllarEsAdmin())) return null;
      if (state.meta.backupDismissedFor === todayKey()) return null;
      const last = state.meta.lastBackupAt;
      if (!last) return { level: "warn", text: "A\xFAn no has exportado un backup. Hazlo ahora." };
      const days = daysBetween(last, nowIso());
      if (days >= 3) return { level: "warn", text: `Hace ${days} d\xEDas que no exportas backup.` };
      if (days >= 1) return { level: "info", text: `\xDAltimo backup hace ${days} d\xEDa${days > 1 ? "s" : ""}.` };
      return null;
    }, [loaded, state]);
    const handleAddVehicle = () => {
      setVehicleModal({
        mode: "add",
        data: {
          id: "",
          brand: "",
          plate: "",
          model: "",
          vin: "",
          vehicleClass: "",
          location: "Valencia",
          nextRentalDate: "",
          notes: "",
          rentalStartDate: "",
          rentalEndDate: "",
          rentalDays: ""
        }
      });
    };
    const handleEditVehicle = () => {
      if (!selectedVehicle) return;
      setVehicleModal({ mode: "edit", data: { ...selectedVehicle } });
    };
    const handleSaveVehicle = async (data) => {
      const synced = { ...data };
      if (data.rentalDays !== void 0 && data.rentalDays !== "") {
        const n = parseInt(data.rentalDays, 10);
        if (!isNaN(n)) synced.rentalDays = n;
      }
      if (vehicleModal.mode === "edit" && data.rentalEndDate) {
        const existing = state.vehicles.find((v) => v.id === data.id);
        const currentStatus = existing ? computeVehicleStatus(existing, state.damages) : null;
        const notRevised = currentStatus === "DEVUELTO" || currentStatus === "EN_USO";
        const wasNotAlreadyInUse = existing?.workflowStatus !== "EN_USO";
        if (notRevised && wasNotAlreadyInUse) {
          const enUso = await requestConfirm({
            title: "\xBFEste veh\xEDculo est\xE1 en uso?",
            message: `Le asignaste una fecha de devoluci\xF3n a ${data.id}.

\xBFEst\xE1 actualmente en uso (fuera de la base, alquilado)?

\u2022 S\xED \u2192 pasa a EN USO. La fecha es cu\xE1ndo vuelve. Reaparece en "Por llegar" ese d\xEDa.
\u2022 No \u2192 la fecha NO se usa como devoluci\xF3n. Si quer\xE9s registrar cu\xE1ndo sale, us\xE1 el campo "Pr\xF3xima salida" de arriba.`,
            confirmLabel: "S\xED, est\xE1 en uso",
            cancelLabel: "No, est\xE1 ac\xE1",
            variant: "primary"
          });
          if (enUso) {
            synced.workflowStatus = "EN_USO";
            synced.arrivalConfirmed = false;
            synced.lastExitAt = nowIso();
          } else {
            synced.rentalEndDate = "";
            synced.rentalStartDate = "";
            synced.rentalDays = "";
          }
        }
      }
      if (vehicleModal.mode === "add") {
        setState((s) => ({ ...s, vehicles: [...s.vehicles, { ...synced, lastInspectedAt: null, createdAt: nowIso() }] }));
      } else {
        setState((s) => ({
          ...s,
          vehicles: s.vehicles.map((v) => v.id === synced.id ? { ...v, ...synced } : v)
        }));
      }
      setVehicleModal(null);
    };
    const handleDeleteVehicle = async () => {
      if (!selectedVehicle) return;
      const ok = await requestConfirm({
        title: `Eliminar ${selectedVehicle.id}`,
        message: `\xBFEliminar ${selectedVehicle.id} y todos sus da\xF1os?

No se puede deshacer.`,
        confirmLabel: "S\xED, eliminar",
        cancelLabel: "Cancelar",
        variant: "danger"
      });
      if (!ok) return;
      setState((s) => ({
        ...s,
        vehicles: s.vehicles.filter((v) => v.id !== selectedVehicle.id),
        damages: s.damages.filter((d) => d.vehicleId !== selectedVehicle.id)
      }));
      setSelectedVehicleId(null);
      setView("list");
    };
    const handleToggleBaja = (vehicleId) => {
      setState((s) => ({
        ...s,
        vehicles: s.vehicles.map((v) => {
          if (v.id !== vehicleId) return v;
          const baja = !v.baja;
          // Dar de baja NO borra nada: solo marca el vehículo como fuera de la
          // flota activa. Sus daños permanecen en el estado y se siguen contando
          // en Estadísticas. Reactivar lo devuelve a las vistas operativas.
          return { ...v, baja, bajaAt: baja ? nowIso() : null };
        })
      }));
    };
    const handleMarkInspected = () => {
      if (!selectedVehicle) return;
      if (typeof nubeAccionEstado === "function") nubeAccionEstado(selectedVehicle.id, "revisado");
      setState((s) => ({
        ...s,
        vehicles: s.vehicles.map((v) => v.id === selectedVehicle.id ? { ...v, lastInspectedAt: nowIso(), workflowStatus: "REVISADO" } : v)
      }));
    };
     const handleSetWorkflowStatus = (vehicleId, newStatus) => {
      const _acc = {DEVUELTO:"confirmar_llegada",REVISADO:"revisado",LISTO:"listo",EN_USO:"entregado"}[newStatus];
      if (_acc && typeof nubeAccionEstado === "function") nubeAccionEstado(vehicleId, _acc);
      setState((s) => ({
        ...s,
        vehicles: s.vehicles.map((v) => {
          if (v.id !== vehicleId) return v;
          let enUsoExtra = {};
          if (newStatus === "EN_USO") {
            const today2 = todayKey();
            const r = activeReserva(v);
            const futureDevol = r && r.devolucion && r.devolucion.slice(0, 10) > today2 ? r.devolucion : null;
            enUsoExtra = {
              lastExitAt: nowIso(),
              arrivalConfirmed: false,
              // just delivered → not back yet
              returnedAt: null,
              // Set return date only if future; otherwise clear it so it doesn't bounce
              rentalEndDate: futureDevol || ""
            };
          }
          return {
            ...v,
            workflowStatus: newStatus,
            // Fecha de revisión: se pone la de ahora si no tenía, o si la que tenía es
            // de un ciclo anterior (anterior a la última llegada). Así no queda
            // "revisado" con una fecha previa a que el vehículo volviera.
            ...newStatus === "REVISADO" && (() => {
              if (!v.lastInspectedAt) return true;
              const llegada = v.returnedAt || v.lastReturnAt;
              return !!llegada && new Date(v.lastInspectedAt).getTime() < new Date(llegada).getTime();
            })() ? { lastInspectedAt: nowIso() } : {},
            ...enUsoExtra,
            ...newStatus === "DEVUELTO" ? { lastReturnAt: nowIso() } : {}
          };
        })
      }));
    };
    const handleSetRentalAndDeliver = ({ vehicleId, rentalStartDate, rentalEndDate, rentalDays }) => {
      setState((s) => ({
        ...s,
        vehicles: s.vehicles.map((v) => v.id === vehicleId ? {
          ...v,
          workflowStatus: "EN_USO",
          rentalStartDate,
          rentalEndDate,
          rentalDays,
          // rentalEndDate is the return date. We do NOT mirror it into
          // nextRentalDate, which means "next departure" — a different concept.
          // Once the vehicle returns and is ready, its next departure can be set.
          lastExitAt: nowIso(),
          // Reset arrival flag for the next return cycle
          arrivalConfirmed: false
        } : v)
      }));
      setRentalModalVehicle(null);
    };
   
    const handleEditArrivalDate = (vehicleId, fechaIso) => {
      if (!fechaIso) return;
      setState((s) => ({
        ...s,
        vehicles: s.vehicles.map((v) => v.id === vehicleId ? { ...v, lastReturnAt: fechaIso, ...v.returnedAt ? { returnedAt: fechaIso } : {} } : v),
        // Actualizar también el reviewLog de este vehículo (su returnedAt) para que
        // las estadísticas cuadren con la nueva fecha de devolución.
        reviewLog: (Array.isArray(s.reviewLog) ? s.reviewLog : []).map((r) => {
          if (r.vehicleId !== vehicleId) return r;
          const v = s.vehicles.find((x) => x.id === vehicleId);
          const oldRet = v && (v.returnedAt || v.lastReturnAt);
          if (oldRet && r.returnedAt === oldRet) {
            const horas = r.reviewStartedAt ? (new Date(r.reviewStartedAt) - new Date(fechaIso)) / 36e5 : r.horas;
            return { ...r, returnedAt: fechaIso, horas: Math.round(horas * 100) / 100 };
          }
          return r;
        })
      }));
    };
    const handleEditReviewDate = (vehicleId, fechaIso) => {
      if (!fechaIso) return;
      setState((s) => ({
        ...s,
        vehicles: s.vehicles.map((v) => v.id === vehicleId ? { ...v, lastInspectedAt: fechaIso } : v),
        reviewLog: (Array.isArray(s.reviewLog) ? s.reviewLog : []).map((r) => {
          if (r.vehicleId !== vehicleId) return r;
          const v = s.vehicles.find((x) => x.id === vehicleId);
          const ret = v && (v.returnedAt || v.lastReturnAt);
          if (ret && r.returnedAt === ret) {
            const horas = (new Date(fechaIso) - new Date(r.returnedAt)) / 36e5;
            return { ...r, reviewStartedAt: fechaIso, horas: Math.round(horas * 100) / 100 };
          }
          return r;
        })
      }));
    };
    const handleMarkNoNewDamages = (vehicleId, value) => {
      setState((s) => ({
        ...s,
        vehicles: s.vehicles.map((v) => v.id === vehicleId ? {
          ...v,
          lastReturnHasNewDamages: !value,
          // value=true means "no new damages"
          noNewDamagesConfirmedAt: value ? nowIso() : null
        } : v),
        // Also clear needsQuantification on this vehicle's pending damages
        // when user confirms "no new damages", since they're saying the OT-flagged
        // new damages were actually pre-existing.
        damages: s.damages.map((d) => {
          if (d.vehicleId !== vehicleId) return d;
          if (!d.needsQuantification) return d;
          if (!value) return d;
          return { ...d, needsQuantification: false, requantifiedAt: nowIso() };
        })
      }));
    };
    const handleMarkFianzaAvisada = (vehicleId) => {
      setState((s) => ({
        ...s,
        vehicles: s.vehicles.map((v) => v.id === vehicleId ? { ...v, fianzaAvisoEnviado: true, fianzaAvisoEnviadoAt: nowIso() } : v)
      }));
    };
    // Marca uno o varios eventos del depositLog como "ya avisado a Oficina" (persistente).
    const handleMarkAvisoOficina = (entryIds) => {
      const idSet = new Set(Array.isArray(entryIds) ? entryIds : [entryIds]);
      setState((s) => ({
        ...s,
        depositLog: (Array.isArray(s.depositLog) ? s.depositLog : []).map((e) => idSet.has(e.id) ? { ...e, avisadoOficina: true, avisadoOficinaAt: nowIso() } : e)
      }));
    };
    const handleDepositEvent = async (vehicleId, tipo, fechaManual, hqReservaOverride) => {
      // Si la gestión viene de una tarjeta pendiente, usamos ESA reserva exacta.
      // Solo en registros manuales fuera de la lista buscamos la última reserva
      // completada de HQ.
      const hqRes = hqReservaOverride || await findHqReservaActual(vehicleId);
      setState((s) => {
        const v = s.vehicles.find((x) => x.id === vehicleId);
        if (!v) return s;
        const now = fechaManual ? new Date(fechaManual).toISOString() : nowIso();
        // Fuente de la reserva actual: HQ primero, fallback al cockpit.
       const tit = hqRes ? {
  cliente: hqRes.cliente || "",
  salida: hqRes.fechaEntrega || hqRes.fechaDevolucion,
  devolucion: hqRes.fechaDevolucion,
  reservaId: hqRes.reservaId || ""
} : {
  cliente: lastCompletedTitular(v)?.cliente || "",
  salida: v.returnedAt || v.lastReturnAt || "",
  devolucion: v.returnedAt || v.lastReturnAt || "",
  reservaId: ""
};
        // FUENTE INMUTABLE: el arrivalLog registra cuándo llegó el vehículo para una reserva
        // concreta (por reservaId). Si existe, ese timestamp es la verdad — no se toca cuando
        // se importan Excels. Fallback a returnedAt/lastReturnAt del vehículo si no hay evento.
        const arrLog = Array.isArray(s.arrivalLog) ? s.arrivalLog : [];
        const arrEvent = tit?.reservaId ? findArrivalEvent(arrLog, vehicleId, tit.reservaId) : null;
        const ret = arrEvent?.at || v.returnedAt || v.lastReturnAt || null;
        const rl = Array.isArray(s.reviewLog) ? s.reviewLog : [];
        const cycleReview = rl.find((r) => r.vehicleId === vehicleId && r.returnedAt === ret);
        const reviewAt = cycleReview && cycleReview.reviewStartedAt || v.lastInspectedAt || null;
        const hrs = (from) => from ? Math.round((new Date(now) - new Date(from)) / 36e5 * 100) / 100 : null;
        const entry = {
          id: Date.now() + Math.random(),
          vehicleId,
          tipo,
          at: now,
          fechaManual: !!fechaManual,
          returnedAt: ret,
          reviewStartedAt: reviewAt,
          horasDesdeLlegada: hrs(ret),
          horasDesdeRevision: hrs(reviewAt),
          titular: tit ? tit.cliente : "",
          reservaId: tit ? tit.reservaId || "" : "",
          alquilerSalida: tit ? tit.salida || "" : "",
          alquilerDevolucion: tit ? tit.devolucion || "" : "",
          arrivalSource: arrEvent ? "arrivalLog" : "vehicle",
          reservaSource: hqRes ? "hq" : "cockpit"
        };
        const ok = (h) => h === null || h >= 0 && h <= 24 * 90;
        if (!ok(entry.horasDesdeLlegada) || !ok(entry.horasDesdeRevision)) {
          entry.horasDesdeLlegada = ok(entry.horasDesdeLlegada) ? entry.horasDesdeLlegada : null;
          entry.horasDesdeRevision = ok(entry.horasDesdeRevision) ? entry.horasDesdeRevision : null;
        }
        const depositLog = [...Array.isArray(s.depositLog) ? s.depositLog : [], entry];
        const vehicles = tipo === "fianza" ? s.vehicles.map((x) => x.id === vehicleId ? { ...x, fianzaAvisoEnviado: true, fianzaAvisoEnviadoAt: now } : x) : s.vehicles;
        return { ...s, depositLog, vehicles };
      });
    };
    const handleEditDepositDate = (eventId, fechaIso) => {
      if (!fechaIso) return;
      setState((s) => {
        const log = Array.isArray(s.depositLog) ? s.depositLog : [];
        const depositLog = log.map((e) => {
          if (e.id !== eventId) return e;
          const nuevo = new Date(fechaIso).toISOString();
          const hrs = (from) => from ? Math.round((new Date(nuevo) - new Date(from)) / 36e5 * 100) / 100 : null;
          const ok = (h) => h === null || h >= 0 && h <= 24 * 90;
          let hLleg = hrs(e.returnedAt), hRev = hrs(e.reviewStartedAt);
          if (!ok(hLleg)) hLleg = null;
          if (!ok(hRev)) hRev = null;
          return { ...e, at: nuevo, fechaManual: true, horasDesdeLlegada: hLleg, horasDesdeRevision: hRev };
        });
        const editada = log.find((e) => e.id === eventId);
        const vehicles = editada && editada.tipo === "fianza" ? s.vehicles.map((x) => x.id === editada.vehicleId ? { ...x, fianzaAvisoEnviadoAt: new Date(fechaIso).toISOString() } : x) : s.vehicles;
        return { ...s, depositLog, vehicles };
      });
    };
    const handleDeleteDepositEvent = (eventId) => {
      setState((s) => {
        const log = Array.isArray(s.depositLog) ? s.depositLog : [];
        const ev = log.find((e) => e.id === eventId);
        const depositLog = log.filter((e) => e.id !== eventId);
        let vehicles = s.vehicles;
        if (ev && ev.tipo === "fianza") {
          const quedanFianzas = depositLog.some((e) => e.vehicleId === ev.vehicleId && e.tipo === "fianza");
          if (!quedanFianzas) {
            vehicles = s.vehicles.map((x) => x.id === ev.vehicleId ? { ...x, fianzaAvisoEnviado: false, fianzaAvisoEnviadoAt: null } : x);
          }
        }
        return { ...s, depositLog, vehicles };
      });
    };
    const handleSetDepositNota = (eventId, nota) => {
      setState((s) => {
        const log = Array.isArray(s.depositLog) ? s.depositLog : [];
        const depositLog = log.map((e) => e.id === eventId ? { ...e, nota: nota || "" } : e);
        return { ...s, depositLog };
      });
    };
    // Corrige el TIPO de una gestión ya registrada (fianza <-> presupuesto), por si se
    // marcó mal. Solo cambia la clasificación; NO toca fechas ni tiempos. Ajusta el
    // efecto colateral del aviso de fianza igual que registrar/borrar una fianza.
    const handleEditDepositTipo = (eventId, nuevoTipo) => {
      if (nuevoTipo !== "fianza" && nuevoTipo !== "presupuesto") return;
      setState((s) => {
        const log = Array.isArray(s.depositLog) ? s.depositLog : [];
        const ev = log.find((e) => e.id === eventId);
        if (!ev || ev.tipo === nuevoTipo) return s;
        const depositLog = log.map((e) => {
          if (e.id !== eventId) return e;
          const next = { ...e, tipo: nuevoTipo };
          if (nuevoTipo === "fianza") delete next.nivelDisputa; // la disputa es solo de presupuestos
          return next;
        });
        let vehicles = s.vehicles;
        if (nuevoTipo === "fianza") {
          vehicles = s.vehicles.map((x) => x.id === ev.vehicleId ? { ...x, fianzaAvisoEnviado: true, fianzaAvisoEnviadoAt: ev.at || nowIso() } : x);
        } else {
          const quedanFianzas = depositLog.some((e) => e.vehicleId === ev.vehicleId && e.tipo === "fianza");
          if (!quedanFianzas) vehicles = s.vehicles.map((x) => x.id === ev.vehicleId ? { ...x, fianzaAvisoEnviado: false, fianzaAvisoEnviadoAt: null } : x);
        }
        return { ...s, depositLog, vehicles };
      });
    };
    const handleSetDepositDisputa = (eventId, nivel) => {
      setState((s) => {
        const log = Array.isArray(s.depositLog) ? s.depositLog : [];
        const depositLog = log.map((e) => e.id === eventId ? { ...e, nivelDisputa: nivel || null } : e);
        return { ...s, depositLog };
      });
    };
    const handleImportDepositEvents = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        let arr;
        try {
          arr = JSON.parse(ev.target.result);
        } catch {
          showToast("\u274C JSON inv\xE1lido");
          return;
        }
        if (!Array.isArray(arr)) {
          showToast("\u274C El JSON debe ser una lista de eventos");
          return;
        }
        setState((s) => {
          const existing = Array.isArray(s.depositLog) ? [...s.depositLog] : [];
          let added = 0, skipped = 0;
          for (const raw of arr) {
            const vehicleId = raw.vehicleId || raw.ac;
            const tipo = raw.tipo;
            if (!vehicleId || tipo !== "fianza" && tipo !== "presupuesto") {
              skipped++;
              continue;
            }
            const v = s.vehicles.find((x) => x.id === vehicleId);
            const at = raw.fechaGestion ? (/* @__PURE__ */ new Date(raw.fechaGestion + "T12:00:00")).toISOString() : raw.at || nowIso();
            const cockpitReturn = v && (v.returnedAt || v.lastReturnAt);
            const excelReturn = raw.fechaLlegada || null;
            let ret = excelReturn;
            if (cockpitReturn && excelReturn) {
              const diffH = Math.abs(new Date(cockpitReturn) - new Date(excelReturn)) / 36e5;
              if (diffH <= 48) ret = cockpitReturn;
            } else if (cockpitReturn && !excelReturn) {
              ret = cockpitReturn;
            }
            const titular = raw.titular || (v ? lastCompletedTitular(v)?.cliente || "" : "");
            const dupe = existing.some((x) => x.vehicleId === vehicleId && x.tipo === tipo && String(x.at).slice(0, 10) === String(at).slice(0, 10) && x.titular === titular);
            if (dupe) {
              skipped++;
              continue;
            }
            const hrs = (from) => from ? Math.round((new Date(at) - new Date(from)) / 36e5 * 100) / 100 : null;
            const ok = (h) => h === null || h >= 0 && h <= 24 * 90;
            let hLleg = hrs(ret);
            if (!ok(hLleg)) hLleg = null;
            existing.push({
              id: Date.now() + Math.random(),
              vehicleId,
              tipo,
              at,
              fechaManual: true,
              importado: true,
              returnedAt: ret,
              reviewStartedAt: null,
              horasDesdeLlegada: hLleg,
              horasDesdeRevision: null,
              titular,
              alquilerSalida: raw.alquilerSalida || "",
              alquilerDevolucion: raw.alquilerDevolucion || ""
            });
            added++;
          }
          showToast(`\u2713 ${added} eventos importados${skipped ? ` \xB7 ${skipped} omitidos` : ""}`);
          return { ...s, depositLog: existing };
        });
      };
      reader.readAsText(file);
      e.target.value = "";
    };
    const handleLeftUnreviewed = (vehicleId) => {
      setState((s) => {
        const v = s.vehicles.find((x) => x.id === vehicleId);
        if (!v) return s;
        const now = nowIso();
        const tit = lastCompletedTitular(v);
        // Consultar arrivalLog para preservar el timestamp real de llegada,
        // aunque el vehículo se haya re-alquilado o el state esté "sucio".
        const arrLog = Array.isArray(s.arrivalLog) ? s.arrivalLog : [];
        const arrEvent = tit?.reservaId ? findArrivalEvent(arrLog, vehicleId, tit.reservaId) : null;
        const returnedAt = arrEvent?.at || v.returnedAt || v.lastReturnAt || null;
        const entry = {
          id: Date.now() + Math.random(),
          vehicleId,
          at: now,
          returnedAt,
          titular: tit ? tit.cliente : "",
          reservaId: tit ? tit.reservaId || "" : "",
          location: v.location || "",
          arrivalSource: arrEvent ? "arrivalLog" : "vehicle"
        };
        const leftUnreviewedLog = [...Array.isArray(s.leftUnreviewedLog) ? s.leftUnreviewedLog : [], entry];
        const vehicles = s.vehicles.map((x) => x.id === vehicleId ? { ...x, leftUnreviewedAt: now, workflowStatus: "EN_USO" } : x);
        return { ...s, leftUnreviewedLog, vehicles };
      });
    };
    const handleClearNextRental = (vehicleId) => {
      setState((s) => ({
        ...s,
        vehicles: s.vehicles.map((v) => v.id === vehicleId ? { ...v, nextRentalDate: "" } : v)
      }));
    };
    const handleDedupeDamages = async () => {
      const groups = {};
      for (const d of state.damages) {
        const idk = damageIdentityKey(d);
        const zona = (d.zona || d.description || "").toLowerCase().trim();
        const tipo = (d.tipoDano || "").toLowerCase().trim();
        const key = `${d.vehicleId}||${idk || zona + "|" + tipo}`;
        (groups[key] = groups[key] || []).push(d);
      }
      const dupGroups = Object.values(groups).filter((g) => g.length > 1);
      const totalDup = dupGroups.reduce((s, g) => s + (g.length - 1), 0);
      if (totalDup === 0) {
        await requestConfirm({
          title: "Sin duplicados",
          message: "No se encontraron da\xF1os duplicados en la flota.",
          confirmLabel: "Entendido",
          cancelLabel: ""
        });
        return;
      }
      const ok = await requestConfirm({
        title: "Limpiar da\xF1os duplicados",
        message: `Se encontraron ${totalDup} da\xF1o(s) duplicado(s) en ${dupGroups.length} grupo(s).

Se conservar\xE1 una copia de cada uno (la que tenga decisi\xF3n de cargo/reparaci\xF3n, o la m\xE1s antigua) y se eliminar\xE1n las repetidas.

No se tocan los da\xF1os \xFAnicos. \xBFContinuar?`,
        confirmLabel: `S\xED, eliminar ${totalDup} duplicados`,
        cancelLabel: "Cancelar",
        variant: "warning"
      });
      if (!ok) return;
      setState((s) => {
        const groups2 = {};
        for (const d of s.damages) {
          const idk = damageIdentityKey(d);
          const zona = (d.zona || d.description || "").toLowerCase().trim();
          const tipo = (d.tipoDano || "").toLowerCase().trim();
          const key = `${d.vehicleId}||${idk || zona + "|" + tipo}`;
          (groups2[key] = groups2[key] || []).push(d);
        }
        const keep = /* @__PURE__ */ new Set();
        for (const g of Object.values(groups2)) {
          if (g.length === 1) {
            keep.add(g[0].id);
            continue;
          }
          const score = (d) => {
            let sc = 0;
            const cargo = damageCargo(d);
            if (cargo === "CUANTIFICADO" || cargo === "ASUMIDO") sc += 100;
            if (damageRepair(d) === "REPARADO") sc += 50;
            if (d.cost) sc += 20;
            return sc;
          };
          const sorted = g.slice().sort((a, b) => {
            const sd = score(b) - score(a);
            if (sd !== 0) return sd;
            const ta = new Date(a.detectedAt || a.importedAt || 0).getTime();
            const tb = new Date(b.detectedAt || b.importedAt || 0).getTime();
            return ta - tb;
          });
          keep.add(sorted[0].id);
        }
        return { ...s, damages: s.damages.filter((d) => keep.has(d.id)) };
      });
    };
    const handleClearAllDates = async () => {
      const ok = await requestConfirm({
        title: "Borrar todas las fechas de la flota",
        message: "Esto borra la pr\xF3xima salida y las fechas de alquiler (salida/d\xEDas/devoluci\xF3n) de TODOS los veh\xEDculos.\n\nNo toca da\xF1os, inspecciones ni estados. Vas a poder recargar las fechas manualmente.\n\n\xBFContinuar?",
        confirmLabel: "S\xED, borrar todas las fechas",
        cancelLabel: "Cancelar",
        variant: "warning"
      });
      if (!ok) return;
      setState((s) => ({
        ...s,
        vehicles: s.vehicles.map((v) => ({
          ...v,
          nextRentalDate: "",
          rentalStartDate: "",
          rentalEndDate: "",
          rentalDays: ""
        }))
      }));
    };
    const handleToggleNeedsQuantification = (damageId) => {
      setState((s) => ({
        ...s,
        damages: s.damages.map((d) => d.id === damageId ? { ...d, needsQuantification: !d.needsQuantification } : d)
      }));
    };
    const handleAsumirDamage = (damageId) => {
      setState((s) => {
        const damages = s.damages.map((d) => d.id === damageId ? { ...d, cargo: "ASUMIDO", state: "ASUMIDO", repair: damageRepair(d), needsQuantification: false, asumidoAt: nowIso() } : d);
        const dmg = s.damages.find((d) => d.id === damageId);
        let vehicles = s.vehicles;
        if (dmg) {
          const stillPending = damages.some((d) => d.vehicleId === dmg.vehicleId && damageCargo(d) === "NUEVO");
          if (!stillPending) {
            vehicles = s.vehicles.map((v) => v.id === dmg.vehicleId ? { ...v, lastReturnHasNewDamages: false } : v);
          }
        }
        return { ...s, damages, vehicles };
      });
    };
    const handleMarkCuantificado = (damageId) => {
      setState((s) => ({
        ...s,
        damages: s.damages.map((d) => d.id === damageId ? { ...d, cargo: "CUANTIFICADO", state: "VALORADO", repair: damageRepair(d), needsQuantification: false, cuantificadoAt: nowIso() } : d)
      }));
    };
    const handleSavePresupuesto = ({ vehicleId, lines, newCatalogParts }) => {
      setState((s) => {
        const todayPrefix = buildPresupuestoId(vehicleId, nowIso(), 0).slice(0, -2);
        const seqToday = (s.presupuestos || []).filter((p) => p.id.startsWith(todayPrefix)).length + 1;
        const presupuestoId = buildPresupuestoId(vehicleId, nowIso(), seqToday);
        const totals = computePresupuestoTotal(lines.map((l) => l.calc));
        const vehicle = s.vehicles.find((v) => v.id === vehicleId);
        const presupuesto = {
          id: presupuestoId,
          vehicleId,
          vehicleSnapshot: vehicle ? {
            brand: vehicle.brand,
            model: vehicle.model,
            plate: vehicle.plate,
            vin: vehicle.vin
          } : {},
          createdAt: nowIso(),
          lines: lines.map((l) => ({
            damageId: l.damageId,
            zona: l.zona,
            tipoDano: l.tipoDano,
            pdfCode: l.pdfCode,
            partName: l.partName,
            provider: l.provider,
            tipo: l.tipo,
            // PARCIAL | TOTAL
            pvrFull: l.pvrFull,
            // full PVR of the part
            hours: l.hours,
            calc: l.calc
            // computed line totals snapshot
          })),
          piezasTotal: totals.piezasTotal,
          adminFee: totals.adminFee,
          total: totals.total,
          status: "emitido"
        };
        const lineByDamage = {};
        for (const l of lines) lineByDamage[l.damageId] = l;
        const damages = s.damages.map((d) => {
          const l = lineByDamage[d.id];
          if (!l) return d;
          return {
            ...d,
            state: "VALORADO",
            needsQuantification: false,
            cuantificadoAt: nowIso(),
            cost: l.calc.total,
            presupuestoId
          };
        });
        let partsCatalog = [...s.partsCatalog || []];
        for (const np of newCatalogParts || []) {
          const exists = partsCatalog.some((p) => p.name.toLowerCase() === np.name.toLowerCase() && p.provider === np.provider);
          if (!exists) {
            partsCatalog.push({
              id: `PART-${Date.now()}-${partsCatalog.length}`,
              name: np.name,
              provider: np.provider,
              pvr: np.pvr,
              createdAt: nowIso()
            });
          }
        }
        return {
          ...s,
          damages,
          presupuestos: [...s.presupuestos || [], presupuesto],
          partsCatalog
        };
      });
    };
    const handleGeneratePresupuestoPdf = ({ vehicle, lines, totals }) => {
      const fecha = /* @__PURE__ */ new Date();
      const fechaStr = padNum(fecha.getDate(), 2) + "/" + padNum(fecha.getMonth() + 1, 2) + "/" + fecha.getFullYear();
      const isoDate = fecha.toISOString().slice(0, 10);
      const preBase = buildPresupuestoId(vehicle.id, nowIso(), 0).slice(0, -2);
      const seqToday = (state.presupuestos || []).filter((p) => p.id.startsWith(preBase)).length;
      const presId = buildPresupuestoId(vehicle.id, nowIso(), Math.max(1, seqToday));
      const rows = lines.map(function(l) {
        return '<tr><td style="padding:8px 6px;border-bottom:1px solid #e5e5e5;">' + escapeHtml(l.partName || l.zona || "-") + '</td><td style="padding:8px 6px;border-bottom:1px solid #e5e5e5;text-align:center;">' + l.tipo + '</td><td style="padding:8px 6px;border-bottom:1px solid #e5e5e5;text-align:right;">' + l.calc.pvrCharged.toFixed(2) + ' EUR</td><td style="padding:8px 6px;border-bottom:1px solid #e5e5e5;text-align:right;text-decoration:line-through;color:#999;">' + l.calc.moBase.toFixed(2) + ' EUR</td><td style="padding:8px 6px;border-bottom:1px solid #e5e5e5;text-align:right;color:#1F4D2E;font-weight:600;">' + l.calc.moBonified.toFixed(2) + ' EUR</td><td style="padding:8px 6px;border-bottom:1px solid #e5e5e5;text-align:right;">' + l.calc.iva.toFixed(2) + ' EUR</td><td style="padding:8px 6px;border-bottom:1px solid #e5e5e5;text-align:right;font-weight:700;">' + l.calc.total.toFixed(2) + " EUR</td></tr>";
      }).join("");
      const acNum = escapeHtml((vehicle.id || "").replace(/[^0-9]/g, ""));
      const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + presId + '</title><style>body{font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;max-width:780px;margin:0 auto;padding:32px;}h1{color:#1E3A5F;font-size:24px;margin:0;}.sub{color:#666;font-size:12px;}.head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #1E3A5F;padding-bottom:16px;margin-bottom:20px;}.meta{text-align:right;font-size:12px;color:#444;line-height:1.5;}.meta b{color:#000;}table{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px;}th{text-align:left;padding:8px 6px;border-bottom:2px solid #333;font-size:10px;text-transform:uppercase;color:#444;}th.r{text-align:right;} th.c{text-align:center;}.subtotal{text-align:right;font-weight:700;padding:10px 6px;}.admin{display:flex;justify-content:space-between;padding:12px 6px;border-top:1px solid #ddd;font-weight:600;}.total{display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:12px;border-top:2px solid #ccc;}.total .lbl{color:#888;font-size:15px;text-transform:uppercase;letter-spacing:0.05em;}.total .val{color:#999;font-size:30px;font-weight:300;}.foot{text-align:center;color:#aaa;font-size:11px;margin-top:32px;}</style></head><body><div class="head"><div><h1>Cuantificacion de Danos - AC-LLAR</h1><div class="sub">' + isoDate + '</div></div><div class="meta"><b>AC:</b> ' + acNum + "<br><b>Matricula:</b> " + escapeHtml(vehicle.plate || "-") + "<br><b>VIN:</b> " + escapeHtml(vehicle.vin || "-") + "<br><b>Marca:</b> " + escapeHtml((vehicle.brand || "").toUpperCase()) + '<br><span style="color:#999;">ID: ' + presId + '</span></div></div><h3 style="color:#1E3A5F;font-size:15px;">Piezas AC</h3><table><thead><tr><th>Pieza</th><th class="c">Tipo</th><th class="r">PVR s/IVA</th><th class="r">M.O. 50/h</th><th class="r">Bonif -50% 25/h</th><th class="r">IVA 21%</th><th class="r">Total</th></tr></thead><tbody>' + rows + '</tbody></table><div class="subtotal">Subtotal Piezas AC: ' + totals.piezasTotal.toFixed(2) + ' EUR</div><div class="admin"><span>Gestion administrativa (1/2h M.O. + IVA)</span><span>' + ADMIN_FEE.toFixed(2) + ' EUR</span></div><div class="total"><span class="lbl">Total de reparaciones</span><span class="val">' + totals.total.toFixed(2) + ' EUR</span></div><div class="foot">Generado el ' + fechaStr + " - AC-LLAR</div><script>window.onload=function(){setTimeout(function(){window.print();},300);}<\/script></body></html>";
      try {
        const w = window.open("", "_blank");
        if (w) {
          w.document.write(html);
          w.document.close();
        } else {
          alert("Permiti las ventanas emergentes para generar el PDF.");
        }
      } catch (e) {
        console.warn("PDF open failed", e);
      }
    };
    const handleAddCatalogPart = (part) => {
      setState((s) => ({
        ...s,
        partsCatalog: [...s.partsCatalog || [], {
          id: `PART-${Date.now()}`,
          ...part,
          createdAt: nowIso()
        }]
      }));
    };
    const handleDeletePresupuesto = (presupuestoId) => {
      setState((s) => ({
        ...s,
        presupuestos: (s.presupuestos || []).filter((p) => p.id !== presupuestoId),
        damages: s.damages.map((d) => d.presupuestoId === presupuestoId ? { ...d, state: "DETECTADO", needsQuantification: true, cost: "", presupuestoId: null, cuantificadoAt: null } : d)
      }));
    };
    const nextDamageNum = (vehicleId) => {
      const nums = state.damages.filter((d) => d.vehicleId === vehicleId).map((d) => {
        const m = d.id.match(/-D(\d+)$/);
        return m ? parseInt(m[1], 10) : 0;
      });
      return nums.length === 0 ? 1 : Math.max(...nums) + 1;
    };
    const handleAddDamage = () => {
      if (!selectedVehicle) return;
      setDamageModal({
        mode: "add",
        data: { code: "", description: "", location: "", state: "DETECTADO", notes: "", cost: "", hoursLabor: "" }
      });
    };
    const handleEditDamage = (damage) => {
      setDamageModal({ mode: "edit", data: { ...damage } });
    };
    const handleSaveDamage = (data) => {
      if (damageModal.mode === "add" && selectedVehicleId) {
        const num = nextDamageNum(selectedVehicleId);
        const newId = `${selectedVehicleId}-D${padNum(num)}`;
        setState((s) => ({
          ...s,
          damages: [...s.damages, { ...data, id: newId, vehicleId: selectedVehicleId, detectedAt: nowIso() }]
        }));
      } else {
        setState((s) => ({
          ...s,
          damages: s.damages.map((d) => d.id === data.id ? { ...d, ...data } : d)
        }));
      }
      setDamageModal(null);
    };
    const handleChangeDamageState = (id, newState) => {
      setState((s) => ({
        ...s,
        damages: s.damages.map((d) => d.id === id ? { ...d, state: newState } : d)
      }));
    };
    const handleChangeDamageCargo = (id, newCargo) => {
      setState((s) => {
        const damages = s.damages.map((d) => {
          if (d.id !== id) return d;
          const patch = { ...d, cargo: newCargo };
          if (newCargo === "ASUMIDO") {
            patch.state = "ASUMIDO";
            patch.needsQuantification = false;
            patch.asumidoAt = nowIso();
          } else if (newCargo === "CUANTIFICADO") {
            patch.state = "VALORADO";
            patch.needsQuantification = false;
            patch.cuantificadoAt = nowIso();
          } else {
            patch.needsQuantification = true;
          }
          return patch;
        });
        const dmg = s.damages.find((d) => d.id === id);
        let vehicles = s.vehicles;
        if (dmg) {
          const stillNew = damages.some((d) => d.vehicleId === dmg.vehicleId && damageCargo(d) === "NUEVO");
          vehicles = s.vehicles.map((v) => v.id === dmg.vehicleId ? { ...v, lastReturnHasNewDamages: stillNew } : v);
        }
        return { ...s, damages, vehicles };
      });
    };
    const handleChangeDamageRepair = (id, newRepair) => {
      setState((s) => {
        const damages = s.damages.map((d) => {
          if (d.id !== id) return d;
          const patch = { ...d, repair: newRepair };
          if (newRepair === "REPARADO") patch.repairedAt = nowIso();
          if (newRepair === "REPARADO") patch.state = "REPARADO";
          else if (newRepair === "EN_REPARACION" && d.state !== "ASUMIDO" && d.state !== "VALORADO") patch.state = "EN_REPARACION";
          return patch;
        });
        return { ...s, damages };
      });
    };
    const handleDeleteDamage = async (id) => {
      const ok = await requestConfirm({
        title: "Eliminar da\xF1o",
        message: "\xBFEliminar este da\xF1o? No se puede deshacer.",
        confirmLabel: "S\xED, eliminar",
        cancelLabel: "Cancelar",
        variant: "danger"
      });
      if (!ok) return;
      try { const _dmg = (state.damages || []).find((d) => d.id === id); if (_dmg && typeof window !== "undefined" && window.acllarPhotos) window.acllarPhotos.deleteKey(_dmg.vehicleId, damageIdentityKey(_dmg)); } catch (e) {}
      setState((s) => ({ ...s, damages: s.damages.filter((d) => d.id !== id) }));
    };
    const handleMarkRepaired = (id) => {
      try { const _dmg = (state.damages || []).find((d) => d.id === id); if (_dmg && typeof window !== "undefined" && window.acllarPhotos) window.acllarPhotos.deleteKey(_dmg.vehicleId, damageIdentityKey(_dmg)); } catch (e) {}
      setState((s) => {
        const damages = s.damages.map(
          (d) => d.id === id ? { ...d, state: "REPARADO", repairedAt: nowIso() } : d
        );
        const damage = s.damages.find((d) => d.id === id);
        if (!damage) return { ...s, damages };
        const vehicleId = damage.vehicleId;
        const stillActive = damages.filter(
          (d) => d.vehicleId === vehicleId && d.state !== "REPARADO" && d.state !== "ASUMIDO"
        ).length;
        const vehicles = stillActive === 0 ? s.vehicles.map((v) => v.id === vehicleId ? { ...v, workflowStatus: "LISTO", readyAt: nowIso() } : v) : s.vehicles;
        return { ...s, damages, vehicles };
      });
    };
    const handleUpdatePart = (id, patch) => {
      setState((s) => {
        let parts = (s.partsToOrder || []).map((p) => p.id === id ? { ...p, ...patch } : p);
        let partsMemory = s.partsMemory || {};
        const part = parts.find((p) => p.id === id);
        if (part && part.codigo && part.zona) {
          const nueva = { codigo: part.codigo, descripcion: part.descripcion || "", notas: part.notas || "" };
          const mergeInto = (entry) => {
            const existing = entryParts(entry);
            const dupIdx = existing.findIndex((p) => (p.codigo || "").trim().toUpperCase() === nueva.codigo.trim().toUpperCase());
            let piezas;
            if (dupIdx >= 0) {
              piezas = existing.map((p, i) => i === dupIdx ? { ...p, ...nueva } : p);
            } else {
              piezas = [...existing, nueva];
            }
            return { piezas };
          };
          const partSeason = seasonOf(part.ac);
          partsMemory = {
            ...partsMemory,
            [acMemKey(part.ac, part.zona)]: mergeInto(partsMemory[acMemKey(part.ac, part.zona)]),
            [modeloMemKey(part.modelo, part.zona, partSeason)]: mergeInto(partsMemory[modeloMemKey(part.modelo, part.zona, partSeason)])
          };
          const zKey = normZona(part.zona);
          const mKey = normModelo(part.modelo);
          parts = parts.map((p) => {
            if (p.id === id) return p;
            if (p.codigo) return p;
            if (normZona(p.zona) !== zKey) return p;
            const sameSeason = seasonOf(p.ac) === partSeason;
            const sameModelo = !!mKey && normModelo(p.modelo) === mKey && sameSeason;
            const sameAc = (p.ac || "").toUpperCase() === (part.ac || "").toUpperCase();
            // Propagar solo a OTRAS AC del mismo modelo+temporada. NO auto-rellenar
            // dentro del mismo AC — si hay dos daños del mismo AC en la misma zona,
            // son piezas distintas y Sebastián los carga a mano.
            if (sameAc) return p;
            if (!sameModelo) return p;
            return {
              ...p,
              codigo: nueva.codigo,
              descripcion: p.descripcion || nueva.descripcion,
              notas: p.notas || nueva.notas,
              autoFilled: "modelo"
            };
          });
        }
        return { ...s, partsToOrder: parts, partsMemory };
      });
    };
    const handleApplyMemory = () => {
      setState((s) => {
        const memory = s.partsMemory || {};
        let filled = 0;
        const parts = (s.partsToOrder || []).map((p) => {
          if (p.codigo) return p;
          const remembered = lookupPartMemory(memory, p.ac, p.modelo, p.zona);
          if (!remembered) return p;
          filled++;
          return {
            ...p,
            codigo: remembered.codigo,
            descripcion: p.descripcion || remembered.descripcion || "",
            notas: p.notas || remembered.notas || "",
            autoFilled: remembered.via
          };
        });
        return { ...s, partsToOrder: parts };
      });
    };
    const handleAcceptSuggestions = (accepted) => {
      setState((s) => {
        const existing = s.partsToOrder || [];
        const already = new Set(existing.map((p) => p.sourceDamageId).filter(Boolean));
        const vehById = {};
        (s.vehicles || []).forEach((v) => {
          vehById[v.id] = v;
        });
        const newOnes = accepted.filter((a) => !already.has(a.damageId)).map((a, i) => ({
          id: `rec-${Date.now()}-${i}`,
          vehicleId: a.ac,
          ac: a.ac,
          modelo: a.modelo,
          zona: a.zona,
          tipoDano: a.tipoDano || "",
          elementCode: null,
          pdfCode: null,
          codigo: a.codigo || "",
          descripcion: a.descripcion || "",
          notas: a.notas || "",
          cantidad: 1,
          estado: "por_pedir",
          createdAt: nowIso(),
          sourceDamageId: a.damageId,
          autoFilled: a.via,
          fromSuggestion: true
        }));
        return { ...s, partsToOrder: [...existing, ...newOnes] };
      });
    };
    const handleDismissSuggestions = (damageIds) => {
      setState((s) => {
        const dismissed = { ...s.recambioSuggestDismissed || {} };
        for (const id of damageIds) dismissed[id] = true;
        return { ...s, recambioSuggestDismissed: dismissed };
      });
    };
    const handleDeletePart = (id) => {
      setState((s) => ({ ...s, partsToOrder: (s.partsToOrder || []).filter((p) => p.id !== id) }));
    };
    const handleAddPart = (data) => {
  setState((s) => {
    const now = Date.now();
    const numOrNull = (x) => {
      if (x === "" || x === null || x === void 0) return null;
      const n = parseFloat(String(x).replace(",", "."));
      return isFinite(n) ? n : null;
    };
    // Datos del formulario (veh\xEDculo + zona + c\xF3digo + descripci\xF3n + PVR + horas + notas).
    // Si se llama sin datos (compat), sale una fila en blanco como antes.
    const d = data && typeof data === "object" ? data : {};
    const veh = (s.vehicles || []).find((v) => v.id === d.vehicleId) || null;
    const modelo = veh ? [veh.brand, veh.model].filter(Boolean).join(" ") || veh.marca || "" : "";
    const cantNum = parseInt(d.cantidad, 10);
    const cantidad = isFinite(cantNum) && cantNum > 0 ? cantNum : 1;
    const codigo = (d.codigo || "").trim();
    const descripcion = (d.descripcion || "").trim();
    const notas = (d.notas || "").trim();
    const pvrOficial = numOrNull(d.pvrOficial);
    const horasMO = numOrNull(d.horasMO);
    const part = {
      id: `PO-${now}`,
      vehicleId: d.vehicleId || "",
      ac: d.vehicleId || "",
      modelo,
      zona: (d.zona || "").trim(),
      tipoDano: (d.tipoDano || "").trim(),
      elementCode: null,
      pdfCode: null,
      piezas: [
        {
          id: `PI-${now}`,
          codigo,
          descripcion,
          notas,
          cantidad,
          estado: "por_pedir",
          proveedor: "",
          pvr: pvrOficial ?? "",
          horas: horasMO ?? ""
        }
      ],
      codigo,
      descripcion,
      notas,
      cantidad,
      estado: "por_pedir",
      pvrOficial,
      horasMO,
      createdAt: nowIso(),
      sourceOT: "manual"
    };
    return { ...s, partsToOrder: [...(s.partsToOrder || []), part] };
  });
};
    const handleImportFromCockpit = (chosen) => {
  setState((s) => {
    const existing = s.partsToOrder || [];
    const memory = s.partsMemory || {};
    const already = new Set(existing.map((p) => p.sourceDamageId).filter(Boolean));

    const newOnes = chosen
      .filter((c) => !already.has(c.damage.id))
      .map((c, i) => {
        const remembered = lookupPartMemory(
          memory,
          c.ac,
          c.modelo,
          c.damage.zona
        );

        return {
          id: `PO-${Date.now()}-${i}`,
          vehicleId: c.damage.vehicleId,
          ac: c.ac,
          modelo: c.modelo || "",
          zona: c.damage.zona || "",
          tipoDano: c.damage.tipoDano || "",
          elementCode: c.damage.elementCode || null,
          pdfCode: c.damage.pdfCode || null,

          // Grupo de piezas
          piezas: [
            {
              id: `PI-${Date.now()}-${i}`,
              codigo: remembered?.codigo || "",
              descripcion: remembered?.descripcion || "",
              notas: remembered?.notas || "",
              cantidad: 1,
              estado: "por_pedir",
              proveedor: remembered?.proveedor || "",
              pvr: remembered?.pvr || "",
              horas: remembered?.horas || ""
            }
          ],

          // Compatibilidad con registros antiguos
          codigo: remembered?.codigo || "",
          descripcion: remembered?.descripcion || "",
          notas: remembered?.notas || "",
          cantidad: 1,
          estado: "por_pedir",

          createdAt: nowIso(),
          sourceOT: c.damage.sourceFile || "cockpit",
          sourceDamageId: c.damage.id,
          autoFilled: remembered ? remembered.via : null
        };
      });

    return {
      ...s,
      partsToOrder: [...existing, ...newOnes]
    };
  });
};
    // Marcado en bloque: pasa las piezas elegidas de "por_pedir" a "pedido".
    const handleMarkOrdered = (ids) => {
      const set = new Set(ids || []);
      if (set.size === 0) return;
      setState((s) => ({
        ...s,
        partsToOrder: (s.partsToOrder || []).map((p) => {
          if (!set.has(p.id)) return p;
          const piezas = (p.piezas && p.piezas.length > 0)
            ? p.piezas.map((pi) => pi.estado === "por_pedir" ? { ...pi, estado: "pedido", pedidoAt: nowIso() } : pi)
            : p.piezas;
          return { ...p, estado: "pedido", pedidoAt: nowIso(), ...(piezas ? { piezas } : {}) };
        })
      }));
    };
    const [pendingWatchFiles, setPendingWatchFiles] = useState(null);
    const scanWatchFolder = async (handle) => {
      if (!handle) return;
      try {
        const perm = await handle.queryPermission?.({ mode: "read" });
        if (perm !== "granted") {
          const req = await handle.requestPermission?.({ mode: "read" });
          if (req !== "granted") {
            setWatchStatus("error");
            return;
          }
        }
        const newFiles = [];
        for await (const entry of handle.values()) {
          if (entry.kind === "file" && /\.(html?|pdf)$/i.test(entry.name)) {
            if (!importedFilesRef.current.has(entry.name)) {
              newFiles.push(entry);
            }
          }
        }
        if (newFiles.length > 0) {
          const files = [];
          for (const entry of newFiles) {
            try {
              const f = await entry.getFile();
              files.push(f);
              importedFilesRef.current.add(entry.name);
            } catch {
            }
          }
          if (files.length > 0) {
            setPendingWatchFiles(files);
            setImportModalOpen(true);
            setWatchLog((log) => [
              ...files.map((f) => ({ file: f.name, at: nowIso() })),
              ...log
            ].slice(0, 20));
          }
        }
        setWatchStatus("active");
      } catch (e) {
        setWatchStatus("error");
      }
    };
    const pickWatchFolder = async () => {
      if (!window.showDirectoryPicker) {
        await requestConfirm({
          title: "No disponible en este navegador",
          message: "La vinculaci\xF3n de carpeta funciona en Edge o Chrome de escritorio. En este navegador no est\xE1 disponible.",
          confirmLabel: "Entendido"
        });
        return;
      }
      try {
        const handle = await window.showDirectoryPicker({ mode: "read" });
        const existing = /* @__PURE__ */ new Set();
        for await (const entry of handle.values()) {
          if (entry.kind === "file" && /\.(html?|pdf)$/i.test(entry.name)) existing.add(entry.name);
        }
        importedFilesRef.current = existing;
        setWatchHandle(handle);
        setWatchStatus("active");
      } catch (e) {
      }
    };
    const stopWatchFolder = () => {
      setWatchHandle(null);
      setWatchStatus("off");
      importedFilesRef.current = /* @__PURE__ */ new Set();
    };
    useEffect(() => {
      if (!watchHandle) return;
      let cancelled = false;
      const tick = () => {
        if (!cancelled) scanWatchFolder(watchHandle);
      };
      tick();
      const iv = setInterval(tick, 3e4);
      return () => {
        cancelled = true;
        clearInterval(iv);
      };
    }, [watchHandle]);
    const applyReservationFile = async (fileHandle) => {
  const file = await fileHandle.getFile();
  const name = file.name.toLowerCase();

  const is704 = name === "carrental.reservations202608200704.xlsx";
  const is720 = name === "carrental.reservations202608200720.xlsx";

  if (!is704 && !is720) {
    return {
      file: file.name,
      applied: 0
    };
  }

  const versionBefore = `${file.size}|${file.lastModified}`;

  let records = [];

  if (/\.(xlsx|xls)$/i.test(name)) {
    const buf = await file.arrayBuffer();

    const fileAfterRead = await fileHandle.getFile();
    const versionAfter = `${fileAfterRead.size}|${fileAfterRead.lastModified}`;

    if (versionBefore !== versionAfter) {
      return {
        file: file.name,
        applied: 0,
        skipped: true
      };
    }

    const wb = XLSX.read(new Uint8Array(buf), {
      type: "array",
      cellDates: true
    });

    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: null });

    const col = (row, ...names) => {
      for (const n of names) {
        const k = Object.keys(row).find(
          (x) => x.toLowerCase().trim() === n.toLowerCase()
        );
        if (k) return row[k];
      }
      return null;
    };

    const toIso = (v) => {
      if (!v) return null;
      if (v instanceof Date) return v.toISOString();

      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d.toISOString();
    };

    records = rows.map((r) => ({
      estatus: col(r, "Estatus", "Estado"),
      vehiculo: col(r, "Veh\xEDculo", "Vehiculo"),
      salida: toIso(col(r, "Fecha de entrega")),
      devolucion: toIso(
        col(r, "Fecha de devoluci\xF3n", "Fecha de devolucion")
      ),
      cliente: col(r, "Cliente"),
      sede: col(r, "Lugar de entrega"),
      reservaId: col(
        r,
        "#",
        "ID",
        "Id",
        "N\xBA",
        "Numero",
        "N\xFAmero",
        "Reserva",
        "ID Reserva"
      )
    }));
  } else {
    const text = await file.text();
    records = parseReservationText(text);
  }

  const { byVehicle, valid } = groupReservationsByVehicle(
    records,
    state.vehicles
  );

  if (valid === 0) {
    return {
      file: file.name,
      applied: 0
    };
  }

  if (is720) {
    handleApplyEnAlquiler(byVehicle);
  } else if (is704) {
    handleApplyReservations(byVehicle);
  }

  return {
    file: file.name,
    applied: valid,
    vehiculos: Object.keys(byVehicle).length,
    tipo: is720 ? "enalquiler" : "reservas",
    label: is720 ? "EN ALQUILER" : "SALIDAS DE LA SEMANA"
  };
};
const scanResWatchFolder = async (handle) => {
  if (!handle) return;

  try {
    const perm = await handle.queryPermission?.({ mode: "read" });

    if (perm !== "granted") {
      const req = await handle.requestPermission?.({ mode: "read" });

      if (req !== "granted") {
        setResWatchStatus("error");
        return;
      }
    }

    const newFiles = [];

    for await (const entry of handle.values()) {
      if (entry.kind !== "file" || !isReservationFile(entry.name)) {
        continue;
      }

      const version = await reservationFileVersion(entry);
      const previousVersion = resImportedFilesRef.current.get(entry.name);

      if (previousVersion !== version) {
        newFiles.push({ entry, version });
      }
    }

    for (const { entry, version } of newFiles) {
      try {
        const res = await applyReservationFile(entry);

        resImportedFilesRef.current.set(entry.name, version);

        if (res && res.applied > 0) {
          setResWatchLog((log) => [
            {
              file: res.file,
              applied: res.applied,
              vehiculos: res.vehiculos,
              tipo: res.tipo,
              label: res.label,
              at: nowIso()
            },
            ...log
          ].slice(0, 20));
        }
      } catch (e) {
        // No marcar la versión como procesada si la importación falla.
        // Así podrá volver a intentarse en el siguiente ciclo.
      }
    }

    setResWatchStatus("active");
  } catch (e) {
    setResWatchStatus("error");
  }
};
    const pickResWatchFolder = async () => {
  if (!window.showDirectoryPicker) {
    await requestConfirm({
      title: "No disponible en este navegador",
      message: "La vinculación de carpeta funciona en Edge o Chrome de escritorio.",
      confirmLabel: "Entendido"
    });
    return;
  }

  try {
    const handle = await window.showDirectoryPicker({ mode: "read" });

    const existing = new Map();

    for await (const entry of handle.values()) {
      if (entry.kind === "file" && isReservationFile(entry.name)) {
        const version = await reservationFileVersion(entry);
        existing.set(entry.name, version);
      }
    }

    resImportedFilesRef.current = existing;

    setResWatchHandle(handle);
    setResWatchStatus("active");
  } catch (e) {
  }
};
    const stopResWatchFolder = () => {
  setResWatchHandle(null);
  setResWatchStatus("off");
  resImportedFilesRef.current = new Map();
};
    useEffect(() => {
      if (!resWatchHandle) return;
      let cancelled = false;
      const tick = () => {
        if (!cancelled) scanResWatchFolder(resWatchHandle);
      };
      tick();
      const iv = setInterval(tick, 3e4);
      return () => {
        cancelled = true;
        clearInterval(iv);
      };
    }, [resWatchHandle]);
    // NUBE · BUZÓN HQ: los Excel que HQ manda por correo llegan a la nube
    // (función hq-inbound). El primer cockpit abierto los importa con la MISMA
    // lógica del vigilante de carpeta (applyReservationFile) y los marca como
    // importados, así ningún otro cockpit los vuelve a importar.
    const applyResRef = useRef(null);
    applyResRef.current = applyReservationFile;
    const [buzonStatus, setBuzonStatus] = useState(null);
    useEffect(() => {
      if (!loaded || !window.acllarCloud || !window.acllarCloud.buzon) return;
      const B = window.acllarCloud.buzon;
      let busy = false, cancelled = false;
      const run = async () => {
        if (busy || cancelled) return;
        busy = true;
        try {
          const lista = await B.pendientes();
          // Solo cuenta el más reciente de cada tipo; los anteriores quedan superados.
          const ultimo = {};
          for (const f of lista) ultimo[f.tipo] = f;
          for (const f of lista) if (ultimo[f.tipo] !== f && f.estado === "pendiente") await B.marcar(f.id, "descartado");
          const orden = Object.values(ultimo).sort((a, b) => (a.recibido_at < b.recibido_at ? -1 : 1));
          for (const f of orden) {
            if (cancelled) break;
            if (!(await B.reservar(f.id))) continue;
            try {
              const blob = await B.descargar(f.storage_path);
              const nombre = f.tipo === "enalquiler" ? "carrental.reservations202608200720.xlsx" : "carrental.reservations202608200704.xlsx";
              const fh = { getFile: async () => new File([blob], nombre, { lastModified: Date.parse(f.recibido_at) || Date.now() }) };
              const res = await applyResRef.current(fh);
              await B.marcar(f.id, "importado");
              setBuzonStatus({ at: nowIso(), tipo: f.tipo, recibido: f.recibido_at });
              if (res && res.applied > 0) {
                setResWatchLog((log) => [{ file: res.file, applied: res.applied, vehiculos: res.vehiculos, tipo: res.tipo, label: res.label + " · nube", at: nowIso() }, ...log].slice(0, 20));
              }
            } catch (e) {
              console.warn("[buzón HQ] fallo al importar", f, e);
              await B.marcar(f.id, "pendiente");
            }
          }
        } catch (e) {
          console.warn("[buzón HQ]", e);
        } finally {
          busy = false;
        }
      };
      const first = setTimeout(run, 3000); // dejar que el estado termine de asentarse
      const iv = setInterval(run, 60000);
      const onNew = () => setTimeout(run, 2000);
      window.addEventListener("acllar-buzon", onNew);
      return () => {
        cancelled = true;
        clearTimeout(first);
        clearInterval(iv);
        window.removeEventListener("acllar-buzon", onNew);
      };
    }, [loaded]);
    // NUBE · copia de las OT en OneDrive
    const [archInfo, setArchInfo] = useState(null);
    const loadArch = useCallback(async () => {
      const C = window.acllarCloud;
      if (!C || !C.archivo || !(window.acllarEsAdmin && window.acllarEsAdmin())) return;
      try {
        const pend = (await C.archivo.pendientes()).length;
        const r = await window.storage.get("archivo_onedrive");
        const last = r && r.value ? JSON.parse(r.value) : null;
        setArchInfo((prev) => ({ ...(prev || {}), pend, lastAt: last && last.at, carpeta: last && last.carpeta, soportado: C.archivo.soportado() }));
      } catch (e) { console.warn("[archivo]", e); }
    }, []);
    useEffect(() => {
      if (!loaded) return;
      loadArch();
      const iv = setInterval(loadArch, 300000);
      const on = () => loadArch();
      const onKv = (ev) => { if (ev.detail && ev.detail.key === "archivo_onedrive") loadArch(); };
      window.addEventListener("acllar-revisiones", on);
      window.addEventListener("acllar-remote-update", onKv);
      return () => { clearInterval(iv); window.removeEventListener("acllar-revisiones", on); window.removeEventListener("acllar-remote-update", onKv); };
    }, [loaded]);
    const doArchive = async (elegirOtra) => {
      setArchInfo((p) => ({ ...p, busy: true, msg: "" }));
      try {
        const res = await window.acllarCloud.archivo.archivar({ pedir: !!elegirOtra, onProgress: (x) => setArchInfo((p) => ({ ...p, msg: `${x.hechas + x.errores}/${x.total}` })) });
        await requestConfirm({
          title: res.errores ? "Archivado con avisos" : "Copia hecha en OneDrive",
          message: `${res.hechas} OT guardadas en "${res.carpeta}".${res.datos ? " Además se descargó el backup completo del cockpit (carpeta Descargas)." : ""}` +
            (res.fotosBorradas ? ` Se liberaron de la nube ${res.fotosBorradas} fotos de OT de más de 45 días (siguen dentro de sus OT en OneDrive).` : "") +
            (res.errores ? ` ${res.errores} OT no se pudieron guardar: vuelve a pulsar "Archivar ahora".` : ""),
          confirmLabel: "Entendido"
        });
      } catch (e) {
        if (!(e && e.name === "AbortError")) await requestConfirm({ title: "No se pudo archivar", message: String(e && e.message || e), confirmLabel: "Entendido" });
      } finally {
        setArchInfo((p) => ({ ...p, busy: false, msg: "" }));
        loadArch();
      }
    };
    // NUBE · OT de la app de revisiones pendientes de confirmar
    const [revPend, setRevPend] = useState([]);
    const [revOpen, setRevOpen] = useState(null);
    const [revOpening, setRevOpening] = useState(null);
    const loadRevPend = useCallback(async () => {
      const C = window.acllarCloud;
      if (!C || !C.revisiones) return;
      try { setRevPend(await C.revisiones.pendientes()); } catch (e) { console.warn("[revisiones]", e); }
    }, []);
    useEffect(() => {
      if (!loaded) return;
      loadRevPend();
      const iv = setInterval(loadRevPend, 60000);
      const on = () => loadRevPend();
      window.addEventListener("acllar-revisiones", on);
      return () => { clearInterval(iv); window.removeEventListener("acllar-revisiones", on); };
    }, [loaded]);
    const openRevision = async (row) => {
      if (importModalOpen || revOpening) return; // una OT a la vez: nunca se pisan
      setRevOpening(row.id);
      try {
        const file = await window.acllarCloud.revisiones.otFile(row);
        setRevOpen(row);
        setPendingWatchFiles([file]);
        setImportModalOpen(true);
      } catch (e) {
        await requestConfirm({ title: "No se pudo abrir la OT", message: "Revisa la conexión e inténtalo de nuevo. (" + (e.message || e) + ")", confirmLabel: "Entendido" });
      } finally { setRevOpening(null); }
    };
    const handleImportPdfs =(payload, partsToOrder = [], photoOps = null) => {
      if (photoOps && typeof window !== "undefined" && window.acllarPhotos && window.acllarPhotos.applyOps) { try { window.acllarPhotos.applyOps(photoOps); } catch (e) {} }
      setState((s) => {
        const counters = {};
        const newDamages = [];
        const getNextNum = (vid) => {
          if (counters[vid] === void 0) {
            let max = 0;
            for (const d of s.damages) {
              if (d.vehicleId === vid && d.id) {
                const m = d.id.match(/-D(\d+)$/);
                if (m) max = Math.max(max, parseInt(m[1], 10));
              }
            }
            counters[vid] = max;
          }
          counters[vid] += 1;
          return counters[vid];
        };
        const wasFirstImport = {};
        for (const item of payload) {
          wasFirstImport[item.vehicleId] = !s.damages.some((d) => d.vehicleId === item.vehicleId);
        }
        for (const item of payload) {
          const isFirstOT = wasFirstImport[item.vehicleId];
          for (const pd of item.damages) {
            const num = getNextNum(item.vehicleId);
            const needsQuant = !isFirstOT;
            newDamages.push({
              id: `${item.vehicleId}-D${padNum(num)}`,
              vehicleId: item.vehicleId,
              code: "",
              description: buildDamageDescription(pd.zona, pd.tipoDano),
              zona: pd.zona || "",
              tipoDano: pd.tipoDano || "",
              location: "",
              state: "DETECTADO",
              gravedad: pd.gravedad || null,
              tipoReparacion: pd.tipoReparacion || null,
              requierePiezas: !!pd.requierePiezas,
              pdfCode: pd.pdfCode || null,
              elementCode: pd.elementCode || null,
              cost: "",
              hoursLabor: "",
              notes: "",
              source: "pdf-import",
              sourceFile: item.sourceFile,
              detectedAt: nowIso(),
              importedAt: nowIso(),
              needsQuantification: needsQuant,
              historicalBaseline: isFirstOT
              // marks the first-load batch for transparency
            });
          }
        }
        const toRepair = /* @__PURE__ */ new Set();
        for (const item of payload) {
          for (const id of item.markRepaired || []) toRepair.add(id);
        }
        const reconciledDamages = s.damages.map(
          (d) => toRepair.has(d.id) ? { ...d, repair: "REPARADO", state: "REPARADO", repairedAt: nowIso(), repairedVia: "ot-reconcile" } : d
        );
        const importedVehicleIds = new Set(payload.map((p) => p.vehicleId));
        const newQuantByVehicle = {};
        for (const nd of newDamages) {
          if (nd.needsQuantification) {
            newQuantByVehicle[nd.vehicleId] = (newQuantByVehicle[nd.vehicleId] || 0) + 1;
          }
        }
        let vehicles = s.vehicles.map((v) => {
          if (!importedVehicleIds.has(v.id)) return v;
          const _otNota = (payload.find((p) => p.vehicleId === v.id)?.otNota || "").trim();
          return {
            ...v,
            lastInspectedAt: nowIso(),
            workflowStatus: "REVISADO",
            lastReturnHasNewDamages: (newQuantByVehicle[v.id] || 0) > 0,
            // Notas leídas de la OT: se guardan aparte de las notas manuales, y solo
            // se actualizan cuando esta OT trae nota (no se borran en re-importaciones sin nota).
            ...(_otNota ? { otNotes: _otNota } : {}),
            // If no new damages this round, clear any pending Rosana-aviso flag
            ...(newQuantByVehicle[v.id] || 0) === 0 ? { fianzaAvisoEnviado: false } : {}
          };
        });
        const reviewLog = Array.isArray(s.reviewLog) ? [...s.reviewLog] : [];
        const arrLog = Array.isArray(s.arrivalLog) ? s.arrivalLog : [];
        // Carga histórica = primera OT de un vehículo (todos sus daños son "línea base").
        // Una revisión SIN daños nuevos NO es histórica: también cuenta para el tiempo de revisión.
        const isHistoricalLoad = payload.every((p) => {
          const nds = newDamages.filter((nd) => nd.vehicleId === p.vehicleId);
          return nds.length > 0 && nds.every((nd) => nd.historicalBaseline);
        });
        if (!isHistoricalLoad) {
          for (const vid of importedVehicleIds) {
            const v = s.vehicles.find((x) => x.id === vid);
            if (!v) continue;
            // Preferir arrivalLog para la reserva actual (fuente inmutable). Fallback al vehículo.
            const tit = lastCompletedTitular(v);
            const arrEvent = tit?.reservaId ? findArrivalEvent(arrLog, vid, tit.reservaId) : null;
            const ret = arrEvent?.at || v.returnedAt || v.lastReturnAt;
            if (!ret) continue;
            const reservaIdForLog = tit?.reservaId || arrEvent?.reservaId || null;
            const already = reviewLog.some((r) => r.vehicleId === vid && (reservaIdForLog && r.reservaId === reservaIdForLog || r.returnedAt === ret));
            if (already) continue;
const parseOTDateTime = (value) => {
  if (!value) return null;
  const s = String(value).trim();

  const m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})(?:\s+|T)(\d{1,2}):(\d{2})$/);
  if (m) {
    const [, dd, mm, yyyy, hh, min] = m;
    const d = new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      Number(hh),
      Number(min)
    );
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  return toIso(value);
};            
const reviewStart = parseOTDateTime(
  payload.find((p) => p.vehicleId === vid)?.inicioOT
) || nowIso();
            const horas = (new Date(reviewStart) - new Date(ret)) / 36e5;
            if (horas < 0 || horas > 24 * 60) continue;
            reviewLog.push({
              vehicleId: vid,
              returnedAt: ret,
              reservaId: reservaIdForLog,
              reviewStartedAt: reviewStart,
              horas: Math.round(horas * 100) / 100,
              hadNewDamages: (newQuantByVehicle[vid] || 0) > 0,
              arrivalSource: arrEvent ? "arrivalLog" : "vehicle"
            });
          }
        }
        const allDamages = [...reconciledDamages, ...newDamages];
        vehicles = vehicles.map((v) => {
          if (!importedVehicleIds.has(v.id)) return v;
          const active = allDamages.filter(
            (d) => d.vehicleId === v.id && d.state !== "REPARADO" && d.state !== "ASUMIDO"
          ).length;
          if (active === 0 && allDamages.some((d) => d.vehicleId === v.id)) {
            return { ...v, workflowStatus: "LISTO", readyAt: nowIso() };
          }
          return v;
        });
        // Las piezas de Recambios NO se crean acá. El import de OT solo registra
        // los daños; el efecto de auto-materialización (PO-auto-<daño>) crea UNA
        // sola línea por daño activo que requiere pieza, deduplicando por
        // sourceDamageId. Antes se creaban filas acá SIN sourceDamageId, que el
        // efecto no reconocía → duplicado de cada pieza recién ingresada. El
        // parámetro `partsToOrder` se conserva por compatibilidad pero se ignora.
        return { ...s, damages: allDamages, vehicles, partsToOrder: s.partsToOrder || [], reviewLog };
      });
    };
    const handleApplyReservations = (reservationsByVehicle) => {
      try {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const ts = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/[:T]/g, "-");
        a.href = url;
        a.download = `cockpit-backup-ANTES-reservas-${ts}.json`;
        document.body.appendChild(a);
        if (window.acllarEsAdmin && window.acllarEsAdmin()) a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {
      }
      setState((s) => {
        const today2 = todayKey();
        const vehicles = s.vehicles.map((v) => {
          const res = reservationsByVehicle[v.id];
          if (!res || res.length === 0) {
            // El Excel HQ es la lista COMPLETA de reservas confirmadas / en alquiler.
            // Si un vehículo NO aparece, cualquier reserva FUTURA suya fue cancelada
            // o reasignada => hay que purgarla, o queda una etiqueta "sale mañana"
            // fantasma (p.ej. AC-322). Se borran SOLO las salidas futuras; se preserva
            // todo lo demás: reservaHistory, estado EN_USO, rentalEndDate (dueño: 720),
            // currentReservaId, llegadas confirmadas, tiempos operativos.
            const staleFuture = (v.reservas || []).filter((r) => (r.salida || "").slice(0, 10) >= today2);
            if (staleFuture.length === 0) return v;
            return { ...v, reservas: (v.reservas || []).filter((r) => (r.salida || "").slice(0, 10) < today2) };
          }
          const reservas = res.map((r) => ({
  salida: r.salida,
  devolucion: r.devolucion,
  cliente: r.cliente || "",
  sede: r.sede || "",
  estatus: r.estatus || "",
  reservaId: r.reservaId || ""
})).sort((a, b) => String(a.salida || "").localeCompare(String(b.salida || "")));

const enAlquilerRow = reservas.find((r) => r.estatus === "En Alquiler");
const liveReservas = reservas.filter((r) => r.estatus !== "Reserva Completada");
const wasEnUso = v.workflowStatus === "EN_USO";
const allCompleted = reservas.length > 0 && reservas.every((r) => r.estatus === "Reserva Completada");

const histKey = (r) => {
  if (r.reservaId) {
    return `id:${String(r.reservaId).trim()}`;
  }

  const cliente = (r.cliente || "").trim().toLowerCase();
  const devolucion = (r.devolucion || "").slice(0, 10);

  return `${cliente}|${devolucion}`;
};

const merged = /* @__PURE__ */ new Map();

for (const r of v.reservaHistory || []) {
  merged.set(histKey(r), r);
}

for (const r of reservas) {
  if (!r.cliente) continue;
  merged.set(histKey(r), {
    cliente: r.cliente,
    salida: r.salida || "",
    devolucion: r.devolucion || "",
    sede: r.sede || "",
    estatus: r.estatus || "En Alquiler",
    reservaId: r.reservaId || ""
  });
}

const nowTs = Date.now();

const reservaHistory = [...merged.values()]
  .filter((r) => {
    const devolucionTs = r.devolucion
      ? new Date(r.devolucion).getTime()
      : NaN;

    // SOLO reservas cuya fecha de devolución ya pasó.
    return Number.isFinite(devolucionTs) && devolucionTs <= nowTs;
  })
  .sort((a, b) => {
    const da = new Date(a.devolucion).getTime();
    const db = new Date(b.devolucion).getTime();
    return db - da;
  })
  .slice(0, 3);
const base = {
  ...v,
  reservas: liveReservas,
  reservaHistory,
  nextRentalDate: "",
  nextRentalEndDate: "",
  // NO borrar la fecha de devolución del alquiler actual: la pone el 720
  // (dueño del alquiler en curso). El 704 solo maneja reservas futuras y
  // no debe pisar rentalEndDate, o la tarjeta de AGENDA pierde la vuelta real.
  rentalEndDate: v.rentalEndDate || ""
};
          // ============================================================
          // PROTECCIÓN DE EVENTOS DE LLEGADA CONFIRMADA
          // El vehículo puede tener una llegada ya confirmada por Sebastián.
          // No queremos que un import posterior resetee arrivalConfirmed
          // ni pise returnedAt/lastReturnAt (eso arruina los tiempos operativos).
          // Solo se resetea si detectamos que el vehículo se re-alquiló
          // realmente: hay una reserva "En Alquiler" cuya salida es POSTERIOR
          // al momento en que el usuario confirmó la vuelta.
          // ============================================================
          const prevArrivalConfirmed = !!v.arrivalConfirmed;
          const prevReturnedAt = v.returnedAt || v.lastReturnAt || null;
          const prevReturnedTime = prevReturnedAt ? new Date(prevReturnedAt).getTime() : null;
          const enAlquilerSalidaTime = enAlquilerRow?.salida ? new Date(enAlquilerRow.salida).getTime() : null;
          // ¿El vehículo se re-alquiló DESPUÉS de la última llegada confirmada?
          const seReAlquiloDespuesDeLaVuelta = prevReturnedTime !== null && enAlquilerSalidaTime !== null && enAlquilerSalidaTime > prevReturnedTime;
          if (enAlquilerRow) {
            if (prevArrivalConfirmed && !seReAlquiloDespuesDeLaVuelta) {
              // Import lo pone "EN_USO" pero el vehículo TODAVÍA no salió realmente.
              // Preservar todos los eventos previos de llegada.
              return {
                ...base,
                workflowStatus: "EN_USO",
                rentalStartDate: enAlquilerRow.salida || "",
                rentalEndDate: enAlquilerRow.devolucion || "",
                currentClient: enAlquilerRow.cliente || "",
                currentReservaId: enAlquilerRow.reservaId || "",
                arrivalConfirmed: v.arrivalConfirmed,
                returnedAt: v.returnedAt,
                lastReturnAt: v.lastReturnAt,
                lastExitAt: v.lastExitAt || null
              };
            }
            return {
              ...base,
              workflowStatus: "EN_USO",
              rentalStartDate: enAlquilerRow.salida || "",
              rentalEndDate: enAlquilerRow.devolucion || "",
              currentClient: enAlquilerRow.cliente || "",
              currentReservaId: enAlquilerRow.reservaId || "",
              arrivalConfirmed: false,
              lastExitAt: enAlquilerRow.salida || v.lastExitAt || nowIso()
            };
          }
         if (allCompleted && wasEnUso) {
  // IMPORTANTE:
  // Que HQ marque todas las reservas como completadas NO significa
  // que el vehículo haya vuelto físicamente.
  //
  // La devolución solo puede ser confirmada manualmente desde el Cockpit
  // mediante "VOLVIÓ / ESTÁ EN CAMPA".
  //
  // Si ya fue confirmada manualmente, preservar el evento real.
  if (prevArrivalConfirmed) {
    return {
      ...base,
      workflowStatus: "DEVUELTO",
      arrivalConfirmed: v.arrivalConfirmed,
      returnedAt: v.returnedAt,
      lastReturnAt: v.lastReturnAt
    };
  }

  // HQ no puede cambiar EN_USO → DEVUELTO.
  return {
    ...base,
    workflowStatus: "EN_USO",
    arrivalConfirmed: false,
    returnedAt: v.returnedAt || null,
    lastReturnAt: v.lastReturnAt || null,
    lastExitAt: v.lastExitAt || null
  };
}
          if (wasEnUso) {
  // IMPORTANTE:
  // Una importación de HQ NUNCA confirma que el vehículo haya vuelto.
  // El único evento que puede pasar EN_USO → DEVUELTO es el clic
  // manual "VOLVIÓ / ESTÁ EN CAMPA".
  //
  // Si ya estaba confirmado manualmente, preservar el evento real.
  if (prevArrivalConfirmed) {
    return {
      ...base,
      workflowStatus: "DEVUELTO",
      arrivalConfirmed: v.arrivalConfirmed,
      returnedAt: v.returnedAt,
      lastReturnAt: v.lastReturnAt
    };
  }

  // Si sigue EN_USO y Sebastián todavía NO confirmó la llegada,
  // mantenerlo EN_USO aunque HQ indique que la devolución estaba prevista.
  return {
    ...base,
    workflowStatus: "EN_USO",
    arrivalConfirmed: false,
    returnedAt: v.returnedAt || null,
    lastReturnAt: v.lastReturnAt || null,
    lastExitAt: v.lastExitAt || null
  };
}
          // Vehículo que no estaba EN_USO: preservar arrivalConfirmed si venía en true.
          return {
            ...base,
            arrivalConfirmed: prevArrivalConfirmed ? v.arrivalConfirmed : false
          };
        });
        return { ...s, vehicles, meta: { ...s.meta, lastReservationImportAt: nowIso() } };
      });
    };
    const handleApplyEnAlquiler = (reservationsByVehicle) => {
  try {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const ts = (/* @__PURE__ */ new Date())
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-");

    a.href = url;
    a.download = `cockpit-backup-ANTES-enalquiler-${ts}.json`;
    document.body.appendChild(a);
    if (window.acllarEsAdmin && window.acllarEsAdmin()) a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
  }

  setState((s) => {
    const vehicles = s.vehicles.map((v) => {
      const res = reservationsByVehicle[v.id];

      // Este vehículo NO aparece en el 720:
      // el 720 no aporta información para modificarlo.
      if (!res || res.length === 0) return v;

      // El 720 puede contener varias filas del mismo vehículo.
      // Nos quedamos con la reserva que realmente figura como EN ALQUILER.
      const current = res.find(
        (r) => r.estatus === "En Alquiler"
      );

      // Si no hay una reserva EN ALQUILER para este vehículo,
      // no usamos este Excel para cambiar su estado.
      if (!current) return v;

            // ============================================================
      // PROTECCIÓN CONTRA RESUCITAR UNA RESERVA YA DEVUELTA
      // ============================================================
      // REGLA:
      // El Cockpit tiene prioridad sobre HQ.
      //
      // Si el vehículo ya volvió físicamente y fue confirmado,
      // el Excel NO puede resucitar el alquiler anterior.
      //
      // Pero si aparece una NUEVA reserva posterior, el vehículo
      // sí puede volver a EN_USO.
      //
      // La nueva reserva se identifica por:
      //   1. reservaId diferente, O
      //   2. cliente diferente + salida posterior a la devolución.
      // ============================================================

      const prevReturnedAt =
        v.returnedAt || v.lastReturnAt || null;

      const prevReturnedTime = prevReturnedAt
        ? new Date(prevReturnedAt).getTime()
        : null;

      const previousArrivalEvents = Array.isArray(s.arrivalLog)
        ? s.arrivalLog.filter(
            (e) => e.vehicleId === v.id
          )
        : [];

      const previousReservaIds = previousArrivalEvents
        .filter((e) => e.reservaId)
        .map((e) =>
          String(e.reservaId)
            .trim()
            .toLowerCase()
        );

      const currentReservaId = current.reservaId
        ? String(current.reservaId)
            .trim()
            .toLowerCase()
        : "";

      const currentCliente =
        String(current.cliente || "")
          .trim()
          .toLowerCase();

      const previousClients = previousArrivalEvents
        .map((e) =>
          String(e.cliente || "")
            .trim()
            .toLowerCase()
        )
        .filter(Boolean);

      const mismaReserva =
        !!currentReservaId &&
        previousReservaIds.includes(currentReservaId);

      const mismoCliente =
        !!currentCliente &&
        previousClients.includes(currentCliente);

      const currentSalidaTime = current.salida
        ? new Date(current.salida).getTime()
        : null;

      const salidaPosterior =
        prevReturnedTime !== null &&
        currentSalidaTime !== null &&
        currentSalidaTime > prevReturnedTime;

      // ============================================================
      // ¿ES REALMENTE UNA NUEVA RESERVA?
      // ============================================================
      //
      // Caso ideal:
      // reservaId diferente + salida posterior.
      //
      // Caso de respaldo:
      // cliente diferente + salida posterior.
      //
      // Esto permite que un vehículo vuelva a alquilarse aunque
      // HQ no entregue correctamente el reservaId.
      // ============================================================

      const nuevaReservaPosterior =
        salidaPosterior &&
        (
          (
            !!currentReservaId &&
            !mismaReserva
          ) ||
          (
            !!currentCliente &&
            !mismoCliente
          )
        );

      // ============================================================
      // MISMA RESERVA YA DEVUELTA
      // ============================================================
      //
      // HQ sigue mostrando el alquiler anterior.
      // NO puede resucitarlo.
      // ============================================================

      if (mismaReserva) {
        return {
          ...v,
          workflowStatus: "DEVUELTO",
          rentalEndDate: "",
          arrivalConfirmed: !!v.arrivalConfirmed,
          returnedAt: v.returnedAt || null,
          lastReturnAt: v.lastReturnAt || null,
          lastExitAt: v.lastExitAt || null
        };
      }

      // ============================================================
      // MISMO CLIENTE PERO SIN NUEVA RESERVA DEMOSTRABLE
      // ============================================================
      //
      // Esto protege específicamente contra el caso que nos
      // preocupa: HQ vuelve a importar el mismo alquiler anterior
      // con otro registro o sin reservaId.
      //
      // Si la salida NO es posterior a la devolución real,
      // no permitimos que HQ revierta el estado.
      // ============================================================

      if (
        prevReturnedTime !== null &&
        mismoCliente &&
        !salidaPosterior
      ) {
        return {
          ...v,
          workflowStatus: v.workflowStatus || "DEVUELTO",
          arrivalConfirmed: !!v.arrivalConfirmed,
          returnedAt: v.returnedAt || null,
          lastReturnAt: v.lastReturnAt || null,
          lastExitAt: v.lastExitAt || null
        };
      }

      // ============================================================
      // NUEVA RESERVA REAL
      // ============================================================
      //
      // Cliente nuevo o reserva nueva + salida posterior.
      // Ahora sí permitimos que HQ abra un nuevo alquiler.
      // ============================================================

      if (nuevaReservaPosterior) {
        return {
          ...v,
          workflowStatus: "EN_USO",
          rentalStartDate: current.salida || "",
          rentalEndDate: current.devolucion || "",
          currentClient: current.cliente || "",
          currentReservaId: current.reservaId || "",
          arrivalConfirmed: false,
          returnedAt: null,
          lastReturnAt: null,
          lastExitAt: current.salida || nowIso()
        };
      }

      // ============================================================
      // VEHÍCULO CON DEVOLUCIÓN PREVIA PERO SIN NUEVA SALIDA
      // ============================================================
      //
      // HQ no tiene suficiente información para demostrar que
      // comenzó un alquiler nuevo.
      //
      // Por seguridad, NO modifica el estado operativo.
      // ============================================================

      if (prevReturnedTime !== null) {
        return {
          ...v,
          workflowStatus: v.workflowStatus || "DEVUELTO",
          arrivalConfirmed: !!v.arrivalConfirmed,
          returnedAt: v.returnedAt || null,
          lastReturnAt: v.lastReturnAt || null,
          lastExitAt: v.lastExitAt || null
        };
      }

      // ============================================================
      // VEHÍCULO SIN DEVOLUCIÓN PREVIA REGISTRADA
      // ============================================================

      return {
        ...v,
        workflowStatus: "EN_USO",
        rentalStartDate: current.salida || "",
        rentalEndDate: current.devolucion || "",
        currentClient: current.cliente || "",
        currentReservaId: current.reservaId || "",
        arrivalConfirmed: false,
        lastExitAt: current.salida || nowIso()
      };
    });

    // ============================================================
    // GARANTÍA "DIRECTO DEL 720"
    // ------------------------------------------------------------
    // Las ramas anti-resurrección de arriba protegen el ESTADO (no
    // reabrir un DEVUELTO que marcaste a mano), pero como efecto
    // secundario dejaban SIN fecha de devolución a coches que sí
    // están alquilados (los que traían una devolución previa).
    // Aquí garantizamos que TODO coche que queda EN_USO y aparece en
    // el 720 toma su fecha de salida/vuelta DIRECTO de su fila del 720.
    // Es idempotente y se auto-corrige en cada importación del 720.
    // ============================================================
    const vehiclesConFecha = vehicles.map((v) => {
      const res = reservationsByVehicle[v.id];
      if (!res || res.length === 0) return v;
      const current = res.find((r) => r.estatus === "En Alquiler");
      if (!current) return v;
      if (v.workflowStatus !== "EN_USO") return v;
      return {
        ...v,
        rentalStartDate: current.salida || v.rentalStartDate || "",
        rentalEndDate: current.devolucion || v.rentalEndDate || ""
      };
    });

    return {
      ...s,
      vehicles: vehiclesConFecha,
      meta: {
        ...s.meta,
        lastEnAlquilerImportAt: nowIso()
      }
    };
  });
};
    const handleMarkReturned = async (vehicleId) => {
      const at = nowIso();
      const hqRes = await findHqReservaActual(vehicleId);
      setState((s) => {
        const prevLog = Array.isArray(s.arrivalLog) ? s.arrivalLog : [];
        const vAct = s.vehicles.find((x) => x.id === vehicleId);
        // El Excel HQ de completadas puede estar desactualizado y devolver la
        // reserva ANTERIOR. Preferimos la reserva actual que el vehículo ya
        // conoce (currentReservaId / currentClient, del import "en alquiler").
        const reservaIdFinal = (vAct && vAct.currentReservaId) || hqRes?.reservaId || null;
        const clienteFinal = (vAct && vAct.currentClient) || hqRes?.cliente || "";
        const newEvent = {
          vehicleId,
          reservaId: reservaIdFinal,
          cliente: clienteFinal,
          fechaDevolucion: hqRes?.fechaDevolucion || null,
          at,
          origen: "volvio"
        };
        const yaExiste = newEvent.reservaId && prevLog.some((e) => e.vehicleId === vehicleId && e.reservaId === newEvent.reservaId);
        const nextLog = yaExiste ? prevLog : [...prevLog, newEvent];
        return {
          ...s,
          arrivalLog: nextLog,
          vehicles: s.vehicles.map((v) => {
            if (v.id !== vehicleId) return v;
            // ELEGIBILIDAD DE FIANZA (48h): la fianza es gestionable si el vehículo
            // regresó dentro de las 48h previas a su devolución prevista (rentalEndDate,
            // que trajo el 720), O si se pulsó "SE ADELANTÓ REGRESO". Si no hay fecha
            // prevista, no bloqueamos. Solo un regreso >48h antes SIN adelanto marca NO elegible.
            const expected = v.rentalEndDate ? new Date(v.rentalEndDate).getTime() : null;
            const dentro48 = expected != null ? Date.now() >= expected - 48 * 36e5 : true;
            const elegible = dentro48 || !!v.seAdelantoRegreso;
            return {
              ...v,
              workflowStatus: "DEVUELTO",
              // Congelamos los datos del 720 antes de limpiar rentalEndDate, para que
              // la pestaña FIANZAS muestre salida/regreso aunque el vehículo desaparezca
              // del próximo 720.
              fianzaDevolucionPrevista: v.rentalEndDate || v.fianzaDevolucionPrevista || null,
              fianzaElegible: elegible,
              seAdelantoRegreso: false,
              rentalEndDate: "",
              arrivalConfirmed: false,
              returnedAt: at,
              lastReturnAt: at
            };
          })
        };
      });
    };
    const handleAdelantoRegreso = (vehicleId) => {
      // El alquiler regresó antes de lo previsto: equivale a que el vehículo ya
      // entró dentro de las 48h de margen. Al pulsar luego "VOLVIÓ", su fianza
      // será elegible y aparecerá como pendiente de gestión.
      setState((s) => ({
        ...s,
        vehicles: s.vehicles.map(
          (v) => v.id === vehicleId ? { ...v, seAdelantoRegreso: true } : v
        )
      }));
    };
    const handleSetReturnDate = (vehicleId, dateStr) => {
      if (!dateStr) return;
      setState((s) => ({
        ...s,
        vehicles: s.vehicles.map(
          (v) => v.id === vehicleId ? { ...v, rentalEndDate: (/* @__PURE__ */ new Date(dateStr + "T10:00:00")).toISOString() } : v
        )
      }));
    };
    const handleExport = async () => {
      if (!(window.acllarEsAdmin && window.acllarEsAdmin())) return;
      let __dp = [];
      try { if (typeof window !== "undefined" && window.acllarPhotos && window.acllarPhotos.exportAll) __dp = await window.acllarPhotos.exportAll(); } catch (e) {}
      const blob = new Blob([JSON.stringify({ ...state, __damagePhotos: __dp }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ts = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/[:T]/g, "-");
      a.href = url;
      a.download = `cockpit-backup-${ts}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setState((s) => ({ ...s, meta: { ...s.meta, lastBackupAt: nowIso() } }));
    };
    const QUANT_KEYS = ["ac_history", "ac_repo", "ac_doc2", "ac_flota", "ac_pieza_mem", "ac_extra_mem", "ac_consultas"];
    const PREF_KEYS = ["global_sede_filter", "today_collapsed_sections", "cuantificador_url"];
    const handleExportAll = async () => {
      if (!(window.acllarEsAdmin && window.acllarEsAdmin())) return;
      const quant = {};
      for (const k of QUANT_KEYS) {
        try {
          const r = await window.storage.get(k);
          if (r && r.value !== void 0) quant[k] = r.value;
        } catch {
        }
      }
      const prefs = {};
      for (const k of PREF_KEYS) {
        try {
          const r = await window.storage.get(k);
          if (r && r.value !== void 0) prefs[k] = r.value;
        } catch {
        }
      }
      let damagePhotos = [];
      try { if (typeof window !== "undefined" && window.acllarPhotos && window.acllarPhotos.exportAll) damagePhotos = await window.acllarPhotos.exportAll(); } catch (e) {}
      const bundle = {
        __bundle: "ac-llar-full-backup",
        version: 2,
        exportedAt: nowIso(),
        cockpit: state,
        cuantificador: quant,
        preferencias: prefs,
        damagePhotos
      };
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ts = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/[:T]/g, "-");
      a.href = url;
      a.download = `AC-LLAR-backup-COMPLETO-${ts}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setState((s) => ({ ...s, meta: { ...s.meta, lastBackupAt: nowIso() } }));
    };
    const handleImportAll = (e) => {
      if (!(window.acllarEsAdmin && window.acllarEsAdmin())) return;
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        let parsed;
        try {
          parsed = JSON.parse(ev.target.result);
        } catch {
          return;
        }
        if (parsed.__bundle !== "ac-llar-full-backup") {
          await requestConfirm({
            title: "Archivo no reconocido",
            message: 'Este archivo no es un backup completo de AC-LLAR. Us\xE1 "Importar respaldo" normal para backups individuales.',
            confirmLabel: "Entendido"
          });
          return;
        }
        const ok = await requestConfirm({
          title: "Restaurar backup completo",
          message: "Esto reemplazar\xE1 TODO: cockpit y cuantificaci\xF3n. \xBFContinuar?",
          confirmLabel: "Restaurar todo",
          variant: "danger"
        });
        if (!ok) return;
        if (parsed.cockpit) setState({ ...DEFAULT_STATE, ...parsed.cockpit });
        if (parsed.cuantificador) {
          for (const [k, v] of Object.entries(parsed.cuantificador)) {
            try {
              await window.storage.set(k, v);
            } catch {
            }
          }
        }
        if (parsed.preferencias) {
          for (const [k, v] of Object.entries(parsed.preferencias)) {
            try {
              await window.storage.set(k, v);
            } catch {
            }
          }
        }
        if (Array.isArray(parsed.damagePhotos) && typeof window !== "undefined" && window.acllarPhotos && window.acllarPhotos.importAll) {
          try { await window.acllarPhotos.importAll(parsed.damagePhotos, true); } catch (e) {}
        }
        await requestConfirm({
          title: "Backup restaurado",
          message: "Se restaur\xF3 todo (incluidas las fotos de da\xF1os). Recarg\xE1 la p\xE1gina (F5) para que la cuantificaci\xF3n tome los datos nuevos.",
          confirmLabel: "Entendido"
        });
      };
      reader.readAsText(file);
      e.target.value = "";
    };
    const handleImport = (file) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (!parsed.version) {
            await requestConfirm({
              title: "Archivo no v\xE1lido",
              message: "El archivo seleccionado no parece ser un backup v\xE1lido del cockpit.",
              confirmLabel: "Entendido",
              cancelLabel: "Cerrar",
              variant: "warning"
            });
            return;
          }
          const ok = await requestConfirm({
            title: "Restaurar backup",
            message: `Esto reemplazar\xE1 TODOS los datos actuales:

Actual: ${state.vehicles.length} veh\xEDculos, ${state.damages.length} da\xF1os
Backup: ${(parsed.vehicles || []).length} veh\xEDculos, ${(parsed.damages || []).length} da\xF1os

\xBFContinuar?`,
            confirmLabel: "S\xED, restaurar",
            cancelLabel: "Cancelar",
            variant: "warning"
          });
          if (!ok) return;
          const { __damagePhotos: __dp, ...cockpitOnly } = parsed;
          setState({
            ...DEFAULT_STATE,
            ...cockpitOnly,
            meta: { ...DEFAULT_STATE.meta, ...parsed.meta || {} }
          });
          if (Array.isArray(__dp) && typeof window !== "undefined" && window.acllarPhotos && window.acllarPhotos.importAll) { try { await window.acllarPhotos.importAll(__dp, true); } catch (e) {} }
          setBackupModalOpen(false);
          setView("list");
          setSelectedVehicleId(null);
        } catch (err) {
          await requestConfirm({
            title: "Error leyendo archivo",
            message: err.message || String(err),
            confirmLabel: "Cerrar",
            cancelLabel: "",
            variant: "danger"
          });
        }
      };
      reader.readAsText(file);
    };
    const handleDismissReminder = () => {
      setState((s) => ({ ...s, meta: { ...s.meta, backupDismissedFor: todayKey() } }));
    };
    // IMPORTANTE: esto es un dato derivado puro, NO un hook.
    // Evita alterar el orden de hooks de App durante la carga inicial.
    // El Cuantificador recibe sus titulares desde el estado ya cargado.
    // Sugerencias de titular para el Cuantificador: combinamos las MISMAS fuentes
    // que alimentan AGENDA (720 = alquiler en curso, arrivalLog = devoluciones
    // reales) + el historial del 704, ordenado por recencia. Así siempre aparece
    // el ÚLTIMO cliente (el recién terminado, o el que está en alquiler si vuelve
    // en ≤2 días) y al menos el anterior. titularSugerencias recorta a 3.
    const titularesByAc = {};
    const _arrivalPorAc = {};
    for (const e of (state.arrivalLog || [])) {
      const k = String(e.vehicleId || "").replace(/\D/g, "");
      if (!k || !e.cliente) continue;
      (_arrivalPorAc[k] = _arrivalPorAc[k] || []).push(e);
    }
    const _nowTs = Date.now();
    for (const v of (state.vehicles || [])) {
      const key = String(v.id || "").replace(/\D/g, "");
      if (!key) continue;
      const cands = [];
      const isEnUso = v.workflowStatus === "EN_USO";
      const recTs = (x) => new Date(x || 0).getTime() || 0;
      // 1) Alquiler en curso / recién terminado (720). SIEMPRE se incluye: es la
      // reserva MÁS RECIENTE del vehículo (el último cliente).
      if (v.currentClient) {
        cands.push({
          cliente: v.currentClient,
          reservaId: v.currentReservaId || "",
          salida: v.rentalStartDate || "",
          devolucion: v.rentalEndDate || v.returnedAt || v.lastReturnAt || "",
          _rec: recTs(v.rentalEndDate || v.returnedAt || v.lastReturnAt || v.rentalStartDate),
          estatus: isEnUso ? "Alquiler en curso" : "Alquiler recién terminado"
        });
      }
      // 2) Devoluciones reales (arrivalLog). La RECENCIA es el momento del VOLVIÓ
      // (at), no la devolución programada: dos ciclos pueden compartir fecha pero
      // el 'at' distingue cuál volvió después.
      for (const e of (_arrivalPorAc[key] || [])) {
        cands.push({
          cliente: e.cliente,
          reservaId: e.reservaId || "",
          salida: "",
          devolucion: e.fechaDevolucion || e.at || "",
          _rec: recTs(e.at || e.fechaDevolucion),
          estatus: "Devuelto"
        });
      }
      // 3) Historial del 704 (últimas reservas completadas).
      for (const r of (v.reservaHistory || [])) {
        if (!r || !r.cliente) continue;
        cands.push({
          cliente: r.cliente,
          reservaId: r.reservaId || "",
          salida: r.salida || "",
          devolucion: r.devolucion || "",
          _rec: recTs(r.devolucion),
          estatus: r.estatus || ""
        });
      }
      if (cands.length > 0) titularesByAc[key] = cands;
    }
    if (!loaded) {
      return /* @__PURE__ */ React.createElement("div", { style: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: T.bg,
        color: T.inkSoft,
        fontFamily: F.body,
        fontSize: "15px"
      } }, "Cargando cockpit...");
    }
    const filteredState = globalSede.length === 0 ? state : {
      ...state,
      vehicles: state.vehicles.filter((v) => globalSede.includes(v.location))
    };
    // Estado operativo: como filteredState pero SIN los vehículos dados de baja.
    // Se pasa a Flota, Agenda y Hoy para ocultarlos. Estadísticas y Buscador
    // siguen usando filteredState (con los de baja) para no perder su historial.
    const activeState = { ...filteredState, vehicles: filteredState.vehicles.filter((v) => !v.baja) };
    const bajaVehiclesList = filteredState.vehicles.filter((v) => v.baja);
    // Dato derivado puro. NO usar hook aquí: este bloque está después del
    // guard de carga de AppInner y un hook aquí provoca React #310.
    const depositHistoryByVehicle = {};
    for (const e of (state.depositLog || [])) {
      if (!e || !e.vehicleId || !e.titular) continue;
      const row = {
        cliente: e.titular || "",
        salida: e.alquilerSalida || "",
        devolucion: e.alquilerDevolucion || e.returnedAt || "",
        reservaId: e.reservaId || ""
      };
      (depositHistoryByVehicle[e.vehicleId] ||= []).push({ ...row, _at: e.at || "" });
    }
    for (const id of Object.keys(depositHistoryByVehicle)) {
      const seen = new Set();
      depositHistoryByVehicle[id] = depositHistoryByVehicle[id]
        .sort((a,b) => new Date(b._at || b.devolucion || 0) - new Date(a._at || a.devolucion || 0))
        .filter(r => {
          const k = `${String(r.cliente || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "")}|${String(r.salida || "").slice(0,10)}|${String(r.devolucion || "").slice(0,10)}`;
          if (seen.has(k)) return false;
          seen.add(k); return true;
        })
        .slice(0,3);
    }

    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("style", null, `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: ${T.bg}; }
        ::selection { background: ${T.rust}; color: ${T.surface}; }
        input::placeholder, textarea::placeholder { color: ${T.inkFaint}; opacity: 1; }
      `), /* @__PURE__ */ React.createElement("div", { style: {
      minHeight: "100vh",
      background: T.bg,
      color: T.ink,
      fontFamily: F.body,
      fontSize: "15px",
      lineHeight: 1.5
    } }, /* @__PURE__ */ React.createElement(
      Header,
      {
        onBackup: () => setBackupModalOpen(true),
        onImport: () => setImportModalOpen(true),
        lastBackupAt: state.meta.lastBackupAt,
        backupReminder,
        onDismissReminder: handleDismissReminder,
        watchStatus,
        onToggleWatch: watchHandle ? stopWatchFolder : pickWatchFolder,
        theme,
        onToggleTheme: toggleTheme
      }
    ), /* @__PURE__ */ React.createElement(TabBar, { active: activeTab, onChange: setActiveTab }), watchStatus === "active" && /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px 14px",
      background: "#EAF7EE",
      border: `1px solid #15803D`,
      borderRadius: "12px",
      margin: "0 0 12px",
      fontSize: "13.5px",
      color: "#14532d"
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700 } }, "\u25CF Auto-detecci\xF3n activa"), /* @__PURE__ */ React.createElement("span", { style: { color: "#3f6b4e" } }, "Reviso OneDrive cada 30s. Cuando llega una OT nueva, abro la ventana de revisi\xF3n para que confirmes los da\xF1os.", watchLog.length > 0 && ` \xDAltima: ${watchLog[0].file}`), /* @__PURE__ */ React.createElement("button", { onClick: stopWatchFolder, style: {
      marginLeft: "auto",
      background: "none",
      border: "1px solid #15803D",
      color: "#15803D",
      borderRadius: "10px",
      padding: "3px 10px",
      fontSize: "11px",
      fontWeight: 700,
      cursor: "pointer"
    } }, "Detener")), watchStatus === "error" && /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px 14px",
      background: "#FEE2E2",
      border: `1px solid #DC2626`,
      borderRadius: "12px",
      margin: "0 0 12px",
      fontSize: "13.5px",
      color: "#991B1B"
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700 } }, "No pude leer la carpeta."), /* @__PURE__ */ React.createElement("span", null, "Volv\xE9 a vincularla (el permiso se pierde al cerrar el navegador)."), /* @__PURE__ */ React.createElement("button", { onClick: pickWatchFolder, style: {
      marginLeft: "auto",
      background: "#DC2626",
      border: "none",
      color: "#fff",
      borderRadius: "10px",
      padding: "3px 10px",
      fontSize: "11px",
      fontWeight: 700,
      cursor: "pointer"
    } }, "Re-vincular")), /* @__PURE__ */ React.createElement("div", { style: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "12px 28px 0",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexWrap: "wrap"
    } }, /* @__PURE__ */ React.createElement("span", { style: {
      fontSize: "10px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: T.inkFaint,
      marginRight: "2px",
      display: "inline-flex",
      alignItems: "center",
      gap: "5px"
    } }, /* @__PURE__ */ React.createElement(MapPin, { size: 12 }), " Sede:"), ["todas", "Valencia", "Onil", "Castell\xF3n", "Alicante"].map((s) => {
      const th = s === "todas" ? null : LOCATION_THEME[s] || { accent: T.rust };
      const isActive = s === "todas" ? globalSede.length === 0 : globalSede.includes(s);
      return /* @__PURE__ */ React.createElement(
        FilterChip,
        {
          key: s,
          active: isActive,
          onClick: () => changeGlobalSede(s),
          accent: th?.accent,
          activeBg: th?.accent
        },
        s === "todas" ? "Todas" : s
      );
    }), globalSede.length > 0 && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11px", color: T.inkSoft, fontStyle: "italic", marginLeft: "4px" } }, "mostrando ", globalSede.length === 1 ? `solo ${globalSede[0]}` : globalSede.join(" + "))), /* @__PURE__ */ React.createElement("main", { style: { maxWidth: "1280px", margin: "0 auto", padding: "28px 28px 60px" } }, activeTab === "today" && /* @__PURE__ */ (window.acllarEsAdmin && window.acllarEsAdmin()) && React.createElement(ArchivePanel, { info: archInfo, onArchive: doArchive }), activeTab === "today" && /* @__PURE__ */ React.createElement(RevPendPanel, { items: revPend, openingId: revOpening, onOpen: openRevision }), activeTab === "today" && /* @__PURE__ */ React.createElement(
      TodayView,
      {
        state: activeState,
        onSelectVehicle: (id) => {
          setSelectedVehicleId(id);
          setView("detail");
          setActiveTab("fleet");
        },
        onImport: () => setImportModalOpen(true),
        onSetStatus: handleSetWorkflowStatus,
        onOpenRentalModal: (v) => setRentalModalVehicle(v),
        onEditArrivalDate: handleEditArrivalDate,
        onEditReviewDate: handleEditReviewDate,
        onMarkNoNewDamages: handleMarkNoNewDamages,
        onMarkFianzaAvisada: handleMarkFianzaAvisada,
        onToggleNeedsQuantification: handleToggleNeedsQuantification,
        onLeftUnreviewed: handleLeftUnreviewed,
        onGoToTab: setActiveTab,
        requestConfirm
      }
    ), activeTab === "fleet" && /* @__PURE__ */ React.createElement(React.Fragment, null, view === "list" ? /* @__PURE__ */ React.createElement(
     FleetView,
{
  state: activeState,
  bajaVehicles: bajaVehiclesList,
  setView,
  onSelectVehicle: (id) => {
    setDetailOrigin("fleet");
    setSelectedVehicleId(id);
    setView("detail");
  },
  onAdd: handleAddVehicle,
  onImport: () => setImportModalOpen(true)
}
    ) : selectedVehicle ? /* @__PURE__ */ React.createElement(
      VehicleDetailView,
      {
        vehicle: selectedVehicle,
        damages: selectedDamages,
        onBack: () => {
  setView("list");
  setSelectedVehicleId(null);

  if (detailOrigin === "agenda") {
    setActiveTab("agenda");
  }
},
        onEdit: handleEditVehicle,
        onDelete: handleDeleteVehicle,
        onMarkInspected: handleMarkInspected,
        onAddDamage: handleAddDamage,
        onEditDamage: handleEditDamage,
        onChangeDamageState: handleChangeDamageState,
        onChangeDamageCargo: handleChangeDamageCargo,
        onChangeDamageRepair: handleChangeDamageRepair,
        onDeleteDamage: handleDeleteDamage,
        onMarkRepaired: handleMarkRepaired,
        onSetWorkflowStatus: handleSetWorkflowStatus,
        onOpenRentalModal: (v) => setRentalModalVehicle(v),
        onEditArrivalDate: handleEditArrivalDate,
        onEditReviewDate: handleEditReviewDate,
        onMarkNoNewDamages: handleMarkNoNewDamages,
        onClearNextRental: handleClearNextRental,
        onToggleBaja: handleToggleBaja,
        requestConfirm
      }
    ) : null), activeTab === "agenda" && /* @__PURE__ */ React.createElement(
      AgendaView,
      {
        state: activeState,
        depositHistoryByVehicle,
        onSelectVehicle: (id) => {
  setDetailOrigin("agenda");
  setSelectedVehicleId(id);
  setView("detail");
  setActiveTab("fleet");
},
        onImport: () => setImportModalOpen(true),
        onImportReservations: () => setReservationsModalOpen(true),
        onImportEnAlquiler: () => setEnAlquilerModalOpen(true),
        onMarkReturned: handleMarkReturned,
        onAdelantoRegreso: handleAdelantoRegreso,
        onSetReturnDate: handleSetReturnDate,
        onSetStatus: handleSetWorkflowStatus,
        onOpenRentalModal: (v) => setRentalModalVehicle(v),
        onEditArrivalDate: handleEditArrivalDate,
        onEditReviewDate: handleEditReviewDate,
        requestConfirm
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: activeTab === "quantifier" ? "block" : "none" } }, /* @__PURE__ */ React.createElement(CuantificadorApp, { key: "quant-" + quantKey, titularesByAc })), activeTab === "deposits" && /* @__PURE__ */ React.createElement(
      DepositsView,
      {
        state,
        onSelectVehicle: (id) => {
  setSelectedVehicleId(id);
  setView("detail");
},
        onMarkFianzaAvisada: handleMarkFianzaAvisada,
        onMarkAvisoOficina: handleMarkAvisoOficina,
        onDepositEvent: handleDepositEvent,
        onLeftUnreviewed: handleLeftUnreviewed,
        onImportDepositEvents: handleImportDepositEvents,
        onEditDepositDate: handleEditDepositDate,
        onDeleteDepositEvent: handleDeleteDepositEvent,
        onEditDepositTipo: handleEditDepositTipo,
        onSetDepositNota: handleSetDepositNota,
        onSetDepositDisputa: handleSetDepositDisputa,
        onAsumir: handleAsumirDamage,
        onGoToTab: setActiveTab,
        requestConfirm
      }
    ), /* Recambios se mantiene montada y solo se oculta al cambiar de pestaña, así conserva filtro, búsqueda, vista y scroll al volver. */ /* @__PURE__ */ React.createElement(
      "div",
      { style: { display: activeTab === "recambios" ? "block" : "none" } },
      /* @__PURE__ */ React.createElement(
        RecambiosView,
        {
          state,
          onUpdatePart: handleUpdatePart,
          onDeletePart: handleDeletePart,
          onAddPart: handleAddPart,
          onImportFromCockpit: handleImportFromCockpit,
          onApplyMemory: handleApplyMemory,
          onAcceptSuggestions: handleAcceptSuggestions,
          onDismissSuggestions: handleDismissSuggestions,
          onMarkOrdered: handleMarkOrdered
        }
      )
    ), activeTab === "buscador" && /* @__PURE__ */ React.createElement(BuscadorView, { state: filteredState, onSelectVehicle: (id) => { setSelectedVehicleId(id); setView("detail"); setActiveTab("fleet"); } }), activeTab === "stats" && /* @__PURE__ */ React.createElement(StatsView, { state: filteredState, activeTab, quantHistorySnapshot })), /* @__PURE__ */ React.createElement(
      VehicleModal,
      {
        open: !!vehicleModal,
        mode: vehicleModal?.mode,
        initial: vehicleModal?.data || {},
        existingIds: state.vehicles.map((v) => v.id),
        onClose: () => setVehicleModal(null),
        onSave: handleSaveVehicle
      }
    ), /* @__PURE__ */ React.createElement(
      DamageModal,
      {
        open: !!damageModal && !!selectedVehicleId,
        mode: damageModal?.mode,
        initial: damageModal?.data || {},
        vehicleId: selectedVehicleId,
        previewId: damageModal?.mode === "edit" ? damageModal.data.id : selectedVehicleId ? `${selectedVehicleId}-D${padNum(nextDamageNum(selectedVehicleId))}` : "",
        onClose: () => setDamageModal(null),
        onSave: handleSaveDamage
      }
    ), /* @__PURE__ */ React.createElement(
      BackupModal,
      {
        open: backupModalOpen && (window.acllarEsAdmin && window.acllarEsAdmin()),
        onClose: () => setBackupModalOpen(false),
        lastBackupAt: state.meta.lastBackupAt,
        onExport: handleExport,
        onImport: handleImport,
        onExportAll: handleExportAll,
        onImportAll: handleImportAll,
        summary: { vehicles: state.vehicles.length, damages: state.damages.length },
        onClearAllDates: handleClearAllDates,
        onDedupeDamages: handleDedupeDamages
      }
    ), /* @__PURE__ */ React.createElement(
      ImportPdfModal,
      {
        open: importModalOpen,
        onClose: () => {
          setImportModalOpen(false);
          setPendingWatchFiles(null);
          setRevOpen(null);
        },
        vehicles: state.vehicles,
        existingDamages: state.damages,
        onConfirm: (payload, parts, photoOps) => {
          const row = revOpen;
          handleImportPdfs(payload, parts, photoOps);
          if (row && (payload || []).some((p) => p.vehicleId === row.veh_id)) {
            window.acllarCloud.revisiones.confirmar(row).then((ok) => {
              if (!ok) requestConfirm({ title: "La OT cambió", message: `La OT de ${row.veh_id} se editó en el móvil mientras la revisabas. Lo que confirmaste ya se aplicó; volverá a aparecer como "editada" para que revises los cambios.`, confirmLabel: "Entendido" });
              loadRevPend();
            }).catch(() => loadRevPend());
          }
          setRevOpen(null);
        },
        allowEmpty: !!revOpen,
        initialFiles: pendingWatchFiles,
        onInitialConsumed: () => setPendingWatchFiles(null)
      }
    ), /* @__PURE__ */ React.createElement(
      ImportReservationsModal,
      {
        open: reservationsModalOpen,
        onClose: () => setReservationsModalOpen(false),
        vehicles: state.vehicles,
        onApply: handleApplyReservations,
        resWatchStatus,
        resWatchLog,
        onToggleResWatch: resWatchHandle ? stopResWatchFolder : pickResWatchFolder
      }
    ), /* @__PURE__ */ React.createElement(
      ImportReservationsModal,
      {
        open: enAlquilerModalOpen,
        onClose: () => setEnAlquilerModalOpen(false),
        vehicles: state.vehicles,
        onApply: handleApplyEnAlquiler,
        mode: "enalquiler"
      }
    ), /* @__PURE__ */ React.createElement(
      SetRentalDatesModal,
      {
        open: !!rentalModalVehicle,
        vehicle: rentalModalVehicle,
        onClose: () => setRentalModalVehicle(null),
        onConfirm: handleSetRentalAndDeliver
      }
    ), /* @__PURE__ */ React.createElement(
      QuantifyModal,
      {
        open: !!quantifyModalVehicleId,
        vehicle: state.vehicles.find((v) => v.id === quantifyModalVehicleId) || null,
        damages: state.damages.filter(
          (d) => d.vehicleId === quantifyModalVehicleId && d.needsQuantification === true && d.state !== "REPARADO" && d.state !== "ASUMIDO"
        ),
        partsCatalog: state.partsCatalog || [],
        onClose: () => setQuantifyModalVehicleId(null),
        onSave: handleSavePresupuesto,
        onGeneratePdf: handleGeneratePresupuestoPdf
      }
    ), /* @__PURE__ */ React.createElement(
      ConfirmDialog,
      {
        open: !!confirmDialog,
        title: confirmDialog?.title,
        message: confirmDialog?.message,
        confirmLabel: confirmDialog?.confirmLabel,
        cancelLabel: confirmDialog?.cancelLabel,
        variant: confirmDialog?.variant,
        onConfirm: () => closeConfirm(true),
        onCancel: () => closeConfirm(false)
      }
    )));
  }
    (function mountApp() {
    var rootEl = document.getElementById("root");
    var loadingEl = document.getElementById("loading");
    // Esperar a que nube.js termine el login y baje los datos de la nube.
    (window.acllarCloud ? window.acllarCloud.ready : Promise.resolve()).then(function () {
      if (loadingEl) loadingEl.style.display = "none";
      if (window.ReactDOM && window.ReactDOM.createRoot) {
        window.ReactDOM.createRoot(rootEl).render(React.createElement(App));
      } else if (window.ReactDOM && window.ReactDOM.render) {
        window.ReactDOM.render(React.createElement(App), rootEl);
      }
    }).catch(function (err) {
      acllarFail(err && err.message ? err.message : String(err));
    });
  })();

  })();
  } catch (err) {
    acllarFail('Error al iniciar: ' + (err && err.message ? err.message : err));
    console.error(err);
  }
});