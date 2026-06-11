// ════════════════════════════════════════════════════════
// S2S Point — app.js v2.0 (reconstruccion limpia)
// REGLAS DE COMPATIBILIDAD (Android 5+ / Chrome 60+):
//   - Sin optional chaining (?.)
//   - Sin template literals (backticks)
//   - Sin arrow functions
//   - document.getElementById() directo
// ════════════════════════════════════════════════════════

// ─── ESTADO GLOBAL ───────────────────────────────────────
var APP_USER    = '';
var APP_FECHA   = '';
var APP_IS_SUP  = false;
var APP_DD      = null;     // distribuidora del dia {dist,mesa,vend}
var APP_HIST    = [];       // historial del dia
var APP_PEND    = [];       // pendientes de sync
var APP_WARN_DD = false;
var SYNC_TIMER  = null;
var ALERT_TIMER = null;
var LAST_ALERT_HOUR = -1;

var REL_PDV    = null;
var REL_PEDIDO = [];
var REL_CAUSAL = null;
var REL_MODO   = 'si';
var REL_NP     = false;

// ─── UTILIDADES ──────────────────────────────────────────
function ge(id) { return document.getElementById(id); }

function today() {
  var h = new Date();
  return h.getFullYear() + '-' + ('0' + (h.getMonth() + 1)).slice(-2) + '-' + ('0' + h.getDate()).slice(-2);
}

function fmtS(d) {
  if (!d) return '';
  var p = d.split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}

function hora() {
  var h = new Date();
  return ('0' + h.getHours()).slice(-2) + ':' + ('0' + h.getMinutes()).slice(-2);
}

function fmt(n) {
  return Number(n || 0).toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function esSup(u) {
  return !!(u && (u.indexOf('SUP') === 0 || u === 'USUARIOPRUEBA'));
}

function showErr(msg) {
  var e = ge('lerr');
  var t = ge('lerr-txt');
  if (e && t) { t.textContent = msg; e.style.display = 'flex'; }
}

function hideErr() {
  var e = ge('lerr');
  if (e) e.style.display = 'none';
}

// ─── NAVEGACION ──────────────────────────────────────────
function G(id) {
  var screens = document.querySelectorAll('.scr');
  for (var i = 0; i < screens.length; i++) screens[i].classList.remove('on');
  var scr = ge(id);
  if (scr) scr.classList.add('on');
  if (id === 's-distdia')     initDD();
  if (id === 's-relevo')      initRelevo();
  if (id === 's-historial')   renderHist();
  if (id === 's-cierre')      buildCierre();
  if (id === 's-sync')        initSync();
  if (id === 's-manual-prom') initManualProm();
  if (id === 's-manual-sup')  initManualSup();
}

function openModal(id)  { var m = ge(id); if (m) m.classList.add('open'); }
function closeModal(id) { var m = ge(id); if (m) m.classList.remove('open'); }

// ─── STORAGE LOCAL ───────────────────────────────────────
function sKey(t) { return 's2s_' + t + '_' + APP_USER + '_' + APP_FECHA; }

function saveHist() {
  try {
    localStorage.setItem(sKey('h'), JSON.stringify(APP_HIST));
    localStorage.setItem(sKey('p'), JSON.stringify(APP_PEND));
  } catch (e) { console.warn('storage full'); }
}

function loadHist() {
  try {
    APP_HIST = JSON.parse(localStorage.getItem(sKey('h')) || '[]');
    APP_PEND = JSON.parse(localStorage.getItem(sKey('p')) || '[]');
  } catch (e) { APP_HIST = []; APP_PEND = []; }
}

function saveDD() {
  try { localStorage.setItem(sKey('dd'), JSON.stringify(APP_DD)); } catch (e) {}
}

function loadDD() {
  try { return JSON.parse(localStorage.getItem(sKey('dd')) || 'null'); } catch (e) { return null; }
}

function setCierre()  { try { localStorage.setItem(sKey('c'), '1'); } catch (e) {} }
function hasCierre()  { return !!localStorage.getItem(sKey('c')); }

// ─── CONEXION / GAS ──────────────────────────────────────
function actualizarConexion() {
  var bar = ge('offline-bar');
  var txt = ge('offline-txt');
  if (!bar) return;
  var pend = 0;
  for (var i = 0; i < APP_PEND.length; i++) if (APP_PEND[i].estado === 'pendiente') pend++;
  if (!navigator.onLine || pend > 0) {
    bar.style.display = 'flex';
    if (txt) txt.textContent = !navigator.onLine
      ? 'Sin conexion — tus datos estan guardados en el telefono'
      : pend + ' registro(s) pendiente(s) de sincronizar';
  } else {
    bar.style.display = 'none';
  }
}

function gasPost(data, cb) {
  if (!SCRIPT_URL || SCRIPT_URL === 'TU_SCRIPT_URL_AQUI') {
    if (cb) setTimeout(function() { cb(true); }, 300);
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', SCRIPT_URL, true);
  xhr.setRequestHeader('Content-Type', 'text/plain;charset=utf-8');
  xhr.timeout = 15000;
  xhr.onload = function() {
    try {
      var r = JSON.parse(xhr.responseText);
      if (cb) cb(r.status === 'ok');
    } catch (e) { if (cb) cb(false); }
  };
  xhr.onerror = function() { if (cb) cb(false); };
  xhr.ontimeout = function() { if (cb) cb(false); };
  try { xhr.send(JSON.stringify(data)); } catch (e) { if (cb) cb(false); }
}

function gasGet(params, cb) {
  if (!SCRIPT_URL || SCRIPT_URL === 'TU_SCRIPT_URL_AQUI') { if (cb) cb(null); return; }
  var qs = [];
  for (var k in params) qs.push(k + '=' + encodeURIComponent(params[k]));
  qs.push('t=' + Date.now());
  var xhr = new XMLHttpRequest();
  xhr.open('GET', SCRIPT_URL + '?' + qs.join('&'), true);
  xhr.timeout = 12000;
  xhr.onload = function() {
    try { var r = JSON.parse(xhr.responseText); if (cb) cb(r); }
    catch (e) { if (cb) cb(null); }
  };
  xhr.onerror = function() { if (cb) cb(null); };
  xhr.ontimeout = function() { if (cb) cb(null); };
  xhr.send();
}

function iniciarAutoSync() {
  if (SYNC_TIMER) clearInterval(SYNC_TIMER);
  SYNC_TIMER = setInterval(function() {
    if (navigator.onLine) procesarPendientes();
  }, 120000);
}

function procesarPendientes() {
  for (var i = 0; i < APP_PEND.length; i++) {
    if (APP_PEND[i].estado !== 'pendiente') continue;
    (function(item) {
      gasPost({accion: 'GUARDAR', filas: item.filas}, function(ok) {
        if (ok) {
          item.estado = 'enviado';
          for (var j = 0; j < APP_HIST.length; j++) if (APP_HIST[j].id === item.id) APP_HIST[j].synced = true;
          saveHist();
          actualizarConexion();
        }
      });
    })(APP_PEND[i]);
  }
}

// ─── ALERTAS DE CIERRE ───────────────────────────────────
function iniciarAlertas() {
  if (ALERT_TIMER) clearInterval(ALERT_TIMER);
  LAST_ALERT_HOUR = -1;
  ALERT_TIMER = setInterval(verificarAlerta, 5 * 60 * 1000);
  setTimeout(verificarAlerta, 4000);
}

function verificarAlerta() {
  if (!APP_USER || APP_IS_SUP) return;
  if (hasCierre()) return;
  var h = histHoy();
  if (!h.length) return;
  var now = new Date();
  var hh = now.getHours();
  if (hh < 18) return;
  if (hh === LAST_ALERT_HOUR) return;
  LAST_ALERT_HOUR = hh;
  var cv = 0, tot = 0;
  for (var i = 0; i < h.length; i++) if (h[i].modo === 'si') { cv++; tot += (h[i].total || 0); }
  mostrarAlerta('🔒 Cierre pendiente',
    'Son las ' + hora() + ' y aun no has cerrado el dia.\n\nVisitas: ' + h.length + ' | Con venta: ' + cv + ' | S/ ' + fmt(tot) + '\n\nRecuerda hacer tu Cierre del dia y Sincronizar.', '🔒');
}

function mostrarAlerta(titulo, msg, ico) {
  var i = ge('m-al-ico'); if (i) i.textContent = ico || '🔔';
  var t = ge('m-al-ttl'); if (t) t.textContent = titulo;
  var m = ge('m-al-msg'); if (m) m.textContent = msg;
  var b = ge('m-al-close');
  if (b) b.onclick = function() { closeModal('m-alerta'); };
  openModal('m-alerta');
}

function showAlertModal() {
  var h = histHoy();
  if (!h.length || hasCierre()) {
    mostrarAlerta('✅ Sin alertas', 'No tienes recordatorios pendientes.', '✅');
  } else {
    var cv = 0;
    for (var i = 0; i < h.length; i++) if (h[i].modo === 'si') cv++;
    mostrarAlerta('🔔 Recordatorio', 'Tienes ' + h.length + ' visita(s) registradas hoy (' + cv + ' con venta). Recuerda hacer tu cierre del dia antes de terminar la jornada.', '🔔');
  }
}

// ─── LOGIN ───────────────────────────────────────────────
function doLogin() {
  var ue = ge('l-user'); var pe = ge('l-pass'); var fe = ge('l-fecha');
  var u = ue ? (ue.value || '').trim().toUpperCase() : '';
  var p = pe ? (pe.value || '').trim() : '';
  var f = fe ? (fe.value || '').trim() : '';
  hideErr();

  if (!u)             { showErr('Ingresa tu usuario'); return; }
  if (!USERS[u])      { showErr('Usuario "' + u + '" no encontrado'); return; }
  if (p !== USERS[u]) { showErr('Contrasena incorrecta'); return; }
  if (!f)             { f = today(); if (fe) fe.value = f; }
  if (f > today())    { showErr('No puedes ingresar con una fecha futura'); return; }

  APP_USER   = u;
  APP_FECHA  = f;
  APP_IS_SUP = esSup(u);

  var dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  var dt = new Date(f + 'T12:00:00');
  var n = ge('conf-nombre'); if (n) n.textContent = APP_IS_SUP ? (SUP_NAMES[u] || u) : u;
  var cf = ge('conf-fecha'); if (cf) cf.textContent = fmtS(f);
  var cd = ge('conf-dia');   if (cd) cd.textContent = dias[dt.getDay()];

  if (f < today()) {
    var ps = ge('past-sel'); if (ps) ps.textContent = fmtS(f);
    var ph = ge('past-hoy'); if (ph) ph.textContent = fmtS(today());
    G('s-conf-past');
  } else {
    G('s-conf');
  }
}

function confirmLogin() {
  if (APP_IS_SUP) { initSup(); return; }
  loadHist();
  APP_DD = loadDD();

  var av = ge('h-av');       if (av) av.textContent = APP_USER.slice(0, 2);
  var hu = ge('h-user');     if (hu) hu.textContent = APP_USER;
  var hf = ge('h-fecha');    if (hf) hf.textContent = fmtS(APP_FECHA);
  var rs = ge('rel-sub');    if (rs) rs.textContent = APP_USER + ' \u00b7 ' + fmtS(APP_FECHA);
  var cs = ge('cierre-sub'); if (cs) cs.textContent = APP_USER + ' \u00b7 ' + fmtS(APP_FECHA);

  refreshHome();
  iniciarAutoSync();
  iniciarAlertas();
  G('s-home');
}

// ─── CERRAR SESION ───────────────────────────────────────
function confirmarSalida() {
  var h = histHoy();
  var pend = 0;
  for (var i = 0; i < h.length; i++) if (!h[i].synced) pend++;
  var ico  = ge('salida-ico');
  var ttl  = ge('salida-ttl');
  var msg  = ge('salida-msg');
  var btns = ge('salida-btns');
  if (!msg || !btns) { openModal('m-salida'); return; }

  if (!APP_IS_SUP && h.length > 0 && !hasCierre()) {
    if (ico) ico.textContent = '\u26a0\ufe0f';
    if (ttl) ttl.textContent = 'Tienes registros sin cerrar';
    msg.innerHTML = 'Tienes <strong>' + h.length + ' visita(s)</strong> registradas hoy' +
      (pend > 0 ? ' y <strong>' + pend + ' pendiente(s) de sincronizar</strong>' : '') +
      '.<br><br><span style="color:#DC2626;font-weight:600">\u00bfDeseas cerrar la sesion sin haber sincronizado tu cierre?</span><br><br>Tus datos quedan guardados en el telefono.';
    btns.innerHTML =
      '<button class="btn" style="background:#DC2626;color:#fff;margin-bottom:10px" onclick="ejecutarSalida()">Si, cerrar sesion sin cerrar el dia</button>' +
      '<button class="btn btn-dark" style="margin-bottom:10px" onclick="closeModal(\'m-salida\');G(\'s-cierre\')">Ir al cierre del dia primero</button>' +
      '<button class="btn btn-white" onclick="closeModal(\'m-salida\')">Cancelar</button>';
  } else if (!APP_IS_SUP && h.length > 0 && hasCierre() && pend > 0) {
    if (ico) ico.textContent = '\ud83d\udd04';
    if (ttl) ttl.textContent = 'Pendientes de sincronizar';
    msg.innerHTML = 'Tienes <strong>' + pend + ' registro(s)</strong> pendientes de sincronizar.<br><br>Se enviaran automaticamente cuando vuelvas a abrir el app con conexion.';
    btns.innerHTML =
      '<button class="btn btn-dark" style="margin-bottom:10px" onclick="ejecutarSalida()">\ud83d\udd13 Si, cerrar sesion</button>' +
      '<button class="btn btn-white" onclick="closeModal(\'m-salida\')">Cancelar</button>';
  } else {
    if (ico) ico.textContent = '\ud83d\udd13';
    if (ttl) ttl.textContent = 'Cerrar sesion';
    msg.innerHTML = 'Hasta luego, <strong>' + APP_USER + '</strong>.';
    btns.innerHTML =
      '<button class="btn btn-dark" style="margin-bottom:10px" onclick="ejecutarSalida()">\ud83d\udd13 Si, cerrar sesion</button>' +
      '<button class="btn btn-white" onclick="closeModal(\'m-salida\')">Cancelar</button>';
  }
  openModal('m-salida');
}

function ejecutarSalida() {
  closeModal('m-salida');
  if (SYNC_TIMER)  { clearInterval(SYNC_TIMER);  SYNC_TIMER  = null; }
  if (ALERT_TIMER) { clearInterval(ALERT_TIMER); ALERT_TIMER = null; }
  APP_USER = ''; APP_FECHA = ''; APP_IS_SUP = false;
  APP_DD = null; APP_HIST = []; APP_PEND = []; APP_WARN_DD = false;
  _pdvCache = null;
  var ue = ge('l-user'); if (ue) ue.value = '';
  var pe = ge('l-pass'); if (pe) pe.value = '';
  var fe = ge('l-fecha'); if (fe) { fe.value = today(); fe.max = today(); }
  hideErr();
  G('s-login');
}

// ─── HOME ────────────────────────────────────────────────
function histHoy() {
  var h = [];
  for (var i = 0; i < APP_HIST.length; i++) if (APP_HIST[i].fecha === APP_FECHA) h.push(APP_HIST[i]);
  return h;
}

function metricas(h) {
  var vis = h.length;
  var ext = 0;
  for (var i = 0; i < h.length; i++) {
    if (h[i].modo === 'no' && h[i].causal !== null && h[i].causal !== undefined) {
      var c = CAUSALES[h[i].causal];
      if (c && !c.promotor) ext++;
    }
  }
  var neto = vis - ext;
  var cv = 0, tot = 0;
  for (var i = 0; i < h.length; i++) if (h[i].modo === 'si') { cv++; tot += (h[i].total || 0); }
  var ef = neto > 0 ? Math.round(cv / neto * 100) : 0;
  return {vis: vis, ext: ext, neto: neto, cv: cv, sv: vis - cv, ef: ef, tot: tot};
}

function refreshHome() {
  var h = histHoy();
  var m = metricas(h);

  var ht = ge('h-total'); if (ht) ht.textContent = 'S/ ' + fmt(m.tot);
  var hu = ge('h-upd');   if (hu) hu.textContent = m.vis > 0 ? m.vis + ' visita(s) registradas' : 'Sin visitas aun';
  var e1 = ge('st-v');    if (e1) e1.textContent = m.vis;
  var e2 = ge('st-cv');   if (e2) e2.textContent = m.cv;
  var e3 = ge('st-n');    if (e3) e3.textContent = m.neto;
  var e4 = ge('st-ef');   if (e4) e4.textContent = m.ef + '%';
  var eb = ge('ef-bar');  if (eb) eb.style.width = m.ef + '%';

  var rl = ge('recent-list');
  if (rl) {
    var rec = h.slice(-3).reverse();
    if (!rec.length) {
      rl.innerHTML = '<div class="empty-state">Sin visitas aun</div>';
    } else {
      var html = '';
      for (var i = 0; i < rec.length; i++) {
        var r = rec[i];
        html += '<div class="ri"><div><p class="ri-nm">' + r.pdv + '</p>';
        html += '<p class="ri-dt">' + (r.hora || '--:--') + ' \u00b7 ' + (r.dist || '') + '</p></div>';
        html += '<span class="tag ' + (r.modo === 'si' ? 'tg-green' : 'tg-amber') + '">' + (r.modo === 'si' ? 'S/ ' + fmt(r.total) : 'Sin pedido') + '</span></div>';
      }
      rl.innerHTML = html;
    }
  }

  var ddl = ge('abt-dd-lbl');
  if (ddl) ddl.textContent = APP_DD ? ('\u2713 ' + APP_DD.dist.split(' ')[0] + ' \u00b7 ' + APP_DD.mesa) : 'Distribuidora del dia';

  actualizarConexion();
}

// ─── DISTRIBUIDORA DEL DIA ───────────────────────────────
function initDD() {
  var dists = DIST_MAP[APP_USER] || [];
  var sel = ge('dd-dist');
  if (sel) {
    var opts = '<option value="">Seleccionar distribuidora</option>';
    for (var i = 0; i < dists.length; i++) opts += '<option>' + dists[i] + '</option>';
    opts += '<option>OTRA DISTRIBUIDORA</option>';
    sel.innerHTML = opts;
  }
  var ds = ge('dd-set'); var df = ge('dd-form');
  if (APP_DD) {
    if (ds) ds.style.display = 'block';
    if (df) df.style.display = 'none';
    var r1 = ge('dd-res-dist'); if (r1) r1.textContent = APP_DD.dist;
    var r2 = ge('dd-res-mesa'); if (r2) r2.textContent = 'Mesa: ' + APP_DD.mesa;
    var r3 = ge('dd-res-vend'); if (r3) r3.textContent = 'Vendedor: ' + APP_DD.vend;
  } else {
    if (ds) ds.style.display = 'none';
    if (df) df.style.display = 'block';
  }
}

function guardarDD() {
  var d = ge('dd-dist'); var m = ge('dd-mesa'); var v = ge('dd-vend');
  var dist = d ? d.value : '';
  var mesa = m ? m.value : '';
  var vend = v ? (v.value || '').trim().toUpperCase() : '';
  if (!dist) { alert('Selecciona la distribuidora'); return; }
  if (!mesa) { alert('Selecciona el tipo de mesa'); return; }
  if (!vend) { alert('Ingresa el nombre del vendedor'); return; }
  APP_DD = {dist: dist, mesa: mesa, vend: vend};
  saveDD();
  gasPost({accion: 'DIST_DIA', usuario: APP_USER, fecha: APP_FECHA, dist: dist, mesa: mesa, vendedor: vend}, null);
  refreshHome();
  G('s-home');
}

function irARelevear() {
  if (!APP_DD && !APP_WARN_DD) {
    APP_WARN_DD = true;
    var i = ge('m-al-ico'); if (i) i.textContent = '\ud83d\ude9a';
    var t = ge('m-al-ttl'); if (t) t.textContent = 'Sin distribuidora del dia';
    var m = ge('m-al-msg'); if (m) m.textContent = 'Te recomendamos configurarla antes de relevar para asociar todos tus registros del dia. Puedes continuar sin hacerlo.';
    var b = ge('m-al-close');
    if (b) b.onclick = function() { closeModal('m-alerta'); G('s-relevo'); };
    openModal('m-alerta');
    return;
  }
  G('s-relevo');
}

// ─── RELEVO ──────────────────────────────────────────────
function initRelevo() {
  fillSubgiros();
  var w = ge('rel-dd-warn'); var inf = ge('rel-dd-info');
  if (APP_DD) {
    if (w) w.style.display = 'none';
    if (inf) inf.style.display = 'block';
    var nm = ge('rel-dd-nm');  if (nm) nm.textContent = APP_DD.dist;
    var sb = ge('rel-dd-sub'); if (sb) sb.textContent = 'Mesa: ' + APP_DD.mesa + ' \u00b7 ' + APP_DD.vend;
  } else {
    if (w) w.style.display = 'block';
    if (inf) inf.style.display = 'none';
  }
}

function fillSubgiros() {
  var sel = ge('f-sub');
  if (!sel || typeof SUBGIROS === 'undefined') return;
  if (sel.options.length > 1) return;
  var opts = '<option value="">Seleccionar</option>';
  for (var i = 0; i < SUBGIROS.length; i++) opts += '<option>' + SUBGIROS[i] + '</option>';
  sel.innerHTML = opts;
}

// ─── BUSQUEDA PDV ────────────────────────────────────────
var _pdvCache = null;
var _pdvHits  = [];

function getPDVBase() {
  if (_pdvCache) return _pdvCache;
  if (typeof BASE_PDV === 'undefined') return [];
  var ref = BASE_PDV[APP_USER];
  if (!ref) return [];
  _pdvCache = (ref === '__LIMA__') ? (BASE_PDV['__LIMA__'] || []) : ref;
  return _pdvCache;
}

function buscarPDV(q) {
  var drop = ge('pdv-drop');
  if (!q || q.length < 2) { if (drop) drop.style.display = 'none'; return; }
  var base = getPDVBase();
  var t = norm(q);
  _pdvHits = [];
  for (var i = 0; i < base.length && _pdvHits.length < 8; i++) {
    var p = base[i];
    if (norm(p[0]).indexOf(t) >= 0 || norm(p[4]).indexOf(t) >= 0 || norm(p[3]).indexOf(t) >= 0) _pdvHits.push(p);
  }
  if (!_pdvHits.length) { if (drop) drop.style.display = 'none'; return; }
  var html = '';
  for (var i = 0; i < _pdvHits.length; i++) {
    var p = _pdvHits[i];
    html += '<div class="pdv-row" onclick="selPDV(' + i + ')">';
    html += '<p class="pdv-nm">' + p[0] + '</p>';
    html += '<p class="pdv-loc">\ud83d\udccd ' + p[1] + ' \u00b7 ' + p[4] + '</p></div>';
  }
  if (drop) { drop.innerHTML = html; drop.style.display = 'block'; }
}

function selPDV(idx) {
  var p = _pdvHits[idx];
  if (!p) return;
  aplicarPDV(p);
}

function aplicarPDV(p) {
  REL_PDV = {n: p[0], d: p[1], dep: p[2], prov: p[3], dist: p[4]};
  var inp = ge('pdv-inp');  if (inp) inp.value = p[0];
  var dr  = ge('pdv-drop'); if (dr) dr.style.display = 'none';
  var sel = ge('pdv-sel');  if (sel) sel.style.display = 'block';
  var nm  = ge('pdv-sel-nm');  if (nm) nm.textContent = p[0];
  var lc  = ge('pdv-sel-loc'); if (lc) lc.textContent = p[1];
  var tg  = ge('pdv-sel-tags');
  if (tg) tg.innerHTML = '<span class="tag tg-teal">' + p[4] + '</span> <span class="tag tg-blue">' + p[3] + '</span> <span class="tag tg-gray">' + p[2] + '</span>';
  var np = ge('np-panel'); if (np) np.style.display = 'none';
  var bn = ge('btn-np');   if (bn) bn.textContent = '\uff0b Crear nuevo punto de venta';
  REL_NP = false;
}

function limpiarPDV() {
  REL_PDV = null;
  var inp = ge('pdv-inp');  if (inp) inp.value = '';
  var sel = ge('pdv-sel');  if (sel) sel.style.display = 'none';
  var dr  = ge('pdv-drop'); if (dr) dr.style.display = 'none';
}

function toggleNP() {
  REL_NP = !REL_NP;
  var np = ge('np-panel'); if (np) np.style.display = REL_NP ? 'block' : 'none';
  var bn = ge('btn-np');   if (bn) bn.textContent = REL_NP ? '\u2715 Cancelar' : '\uff0b Crear nuevo punto de venta';
  if (REL_NP) fillGeoDeptos();
}

function fillGeoDeptos() {
  var geo = GEO_MAP[APP_USER] || {};
  var sel = ge('np-dep');
  if (!sel) return;
  var deps = Object.keys(geo).sort();
  var opts = '<option value="">Seleccionar</option>';
  for (var i = 0; i < deps.length; i++) opts += '<option>' + deps[i] + '</option>';
  sel.innerHTML = opts;
  var ps = ge('np-prov'); if (ps) { ps.innerHTML = '<option value="">Primero departamento</option>'; ps.disabled = true; }
  var ds = ge('np-dist'); if (ds) { ds.innerHTML = '<option value="">Primero provincia</option>'; ds.disabled = true; }
  if (deps.length === 1) { sel.value = deps[0]; fillProv(deps[0]); }
}

function fillProv(dep) {
  var geo = GEO_MAP[APP_USER] || {};
  var ps = ge('np-prov'); var ds = ge('np-dist');
  var provs = dep ? Object.keys(geo[dep] || {}).sort() : [];
  if (ps) {
    var opts = '<option value="">Seleccionar</option>';
    for (var i = 0; i < provs.length; i++) opts += '<option>' + provs[i] + '</option>';
    ps.innerHTML = opts;
    ps.disabled = !provs.length;
  }
  if (ds) { ds.innerHTML = '<option value="">Primero provincia</option>'; ds.disabled = true; }
}

function fillDist(dep, prov) {
  var geo = GEO_MAP[APP_USER] || {};
  var ds = ge('np-dist');
  var dists = (dep && prov && geo[dep] && geo[dep][prov]) ? geo[dep][prov].slice().sort() : [];
  if (ds) {
    var opts = '<option value="">Seleccionar</option>';
    for (var i = 0; i < dists.length; i++) opts += '<option>' + dists[i] + '</option>';
    ds.innerHTML = opts;
    ds.disabled = !dists.length;
  }
}

function crearPDV() {
  var n   = (ge('np-nm').value || '').trim().toUpperCase();
  var d   = (ge('np-dir').value || '').trim().toUpperCase();
  var dep = ge('np-dep').value || '';
  var pv  = ge('np-prov').value || '';
  var dst = ge('np-dist').value || '';
  if (!n || !d || !dep || !pv || !dst) { alert('Completa todos los campos del nuevo PDV'); return; }
  var np = [n, d, dep, pv, dst];
  if (!_pdvCache) _pdvCache = [];
  _pdvCache.unshift(np);
  gasPost({accion: 'NUEVO_PDV', usuario: APP_USER, nombre: n, dir: d, dep: dep, prov: pv, dist: dst}, null);
  aplicarPDV(np);
  var f1 = ge('np-nm'); if (f1) f1.value = '';
  var f2 = ge('np-dir'); if (f2) f2.value = '';
}

// ─── MODO SI/NO ──────────────────────────────────────────
function setModo(m) {
  REL_MODO = m;
  REL_CAUSAL = null;
  var ts = ge('tog-si'); if (ts) ts.className = 'tog' + (m === 'si' ? ' si' : '');
  var tn = ge('tog-no'); if (tn) tn.className = 'tog' + (m === 'no' ? ' no' : '');
  var pp = ge('p-prod'); if (pp) pp.style.display = m === 'si' ? 'block' : 'none';
  var pn = ge('p-no');   if (pn) pn.style.display = m === 'no' ? 'block' : 'none';
  if (m === 'no') {
    renderCausales();
    var cs = ge('caus-sel'); if (cs) cs.value = '';
    var cd = ge('caus-detail'); if (cd) { cd.innerHTML = ''; cd.style.display = 'none'; }
  }
}

// ─── BUSQUEDA SKU (pedido) ───────────────────────────────
var _skuHits = [];

function buscarSKU(q) {
  var drop = ge('sku-drop');
  if (!q || q.length < 2) { if (drop) drop.style.display = 'none'; return; }
  var t = norm(q);
  var ya = {};
  for (var i = 0; i < REL_PEDIDO.length; i++) ya[REL_PEDIDO[i].e] = true;
  _skuHits = [];
  for (var i = 0; i < CATALOGO.length && _skuHits.length < 6; i++) {
    var p = CATALOGO[i];
    if (!ya[p.e] && (norm(p.n).indexOf(t) >= 0 || p.e.indexOf(t) >= 0 || norm(p.m).indexOf(t) >= 0)) _skuHits.push(p);
  }
  if (!_skuHits.length) { if (drop) drop.style.display = 'none'; return; }
  var html = '';
  for (var i = 0; i < _skuHits.length; i++) {
    var p = _skuHits[i];
    html += '<div class="pdv-row" onclick="addSKU(' + i + ')">';
    html += '<p class="pdv-nm">' + p.n + '</p>';
    html += '<p class="pdv-loc">' + p.m + ' \u00b7 ' + p.e + '</p></div>';
  }
  if (drop) { drop.innerHTML = html; drop.style.display = 'block'; }
}

function addSKU(idx) {
  var p = _skuHits[idx];
  if (!p) return;
  REL_PEDIDO.push({e: p.e, n: p.n, m: p.m, qty: 1, price: 0});
  var inp = ge('sku-inp'); if (inp) inp.value = '';
  var dr = ge('sku-drop'); if (dr) dr.style.display = 'none';
  renderPedido();
}

function renderPedido() {
  var ew = ge('ped-empty'); var pw = ge('ped-wrap');
  if (!REL_PEDIDO.length) {
    if (ew) ew.style.display = 'block';
    if (pw) pw.style.display = 'none';
    var pl0 = ge('prod-lbl'); if (pl0) pl0.textContent = 'Agrega productos';
    return;
  }
  if (ew) ew.style.display = 'none';
  if (pw) pw.style.display = 'block';
  var body = ge('ped-body');
  if (body) {
    var html = '';
    for (var i = 0; i < REL_PEDIDO.length; i++) {
      var p = REL_PEDIDO[i];
      html += '<tr>';
      html += '<td class="ped-nm">' + p.n + '</td>';
      html += '<td><div class="qty-row">';
      html += '<button class="qbtn" onclick="chgQ(' + i + ',-1)">\u2212</button>';
      html += '<input class="qty-inp" value="' + p.qty + '" onchange="setQ(' + i + ',this.value)" inputmode="numeric"/>';
      html += '<button class="qbtn" onclick="chgQ(' + i + ',1)">+</button>';
      html += '</div></td>';
      html += '<td><input class="price-inp" value="' + (p.price || '') + '" placeholder="0.00" onchange="setP(' + i + ',this.value)" inputmode="decimal"/></td>';
      html += '<td class="ped-tot-cell">' + fmt(p.qty * (p.price || 0)) + '</td>';
      html += '<td><button class="del-btn" onclick="remSKU(' + i + ')">\ud83d\uddd1</button></td>';
      html += '</tr>';
    }
    body.innerHTML = html;
  }
  var tot = 0;
  for (var i = 0; i < REL_PEDIDO.length; i++) tot += REL_PEDIDO[i].qty * (REL_PEDIDO[i].price || 0);
  var pt = ge('ped-tot'); if (pt) pt.textContent = fmt(tot);
  var pc = ge('ped-cnt'); if (pc) pc.textContent = REL_PEDIDO.length + ' SKU(s)';
  var pl = ge('prod-lbl'); if (pl) pl.textContent = REL_PEDIDO.length + ' SKUs \u00b7 S/ ' + fmt(tot);
}

function chgQ(i, d) { REL_PEDIDO[i].qty = Math.max(1, REL_PEDIDO[i].qty + d); renderPedido(); }
function setQ(i, v) { REL_PEDIDO[i].qty = Math.max(1, parseInt(v, 10) || 1); renderPedido(); }
function setP(i, v) { REL_PEDIDO[i].price = parseFloat(v) || 0; renderPedido(); }
function remSKU(i)  { REL_PEDIDO.splice(i, 1); renderPedido(); }

// ─── CAUSALES ────────────────────────────────────────────
function renderCausales() {
  // Fill the dropdown once with all causales
  var sel = ge('caus-sel');
  if (!sel) return;
  if (sel.options.length > 1) return; // ya esta poblado
  var html = '<option value="">— Seleccionar motivo —</option>';
  for (var i = 0; i < CAUSALES.length; i++) {
    html += '<option value="' + i + '">' + CAUSALES[i].t + '</option>';
  }
  sel.innerHTML = html;
}

function onCausalChange(val) {
  var det = ge('caus-detail');
  if (val === '' || val === null || val === undefined) {
    REL_CAUSAL = null;
    if (det) { det.innerHTML = ''; det.style.display = 'none'; }
    return;
  }
  var idx = parseInt(val, 10);
  REL_CAUSAL = idx;
  var c = CAUSALES[idx];
  if (!det) return;
  if (!c || c.tipo === 'simple') {
    det.innerHTML = '';
    det.style.display = 'none';
    return;
  }
  det.innerHTML = buildCausalDet(idx, c);
  det.style.display = 'block';
  // Scroll para que se vea el detalle
  setTimeout(function() {
    if (det.scrollIntoView) det.scrollIntoView({behavior: 'smooth', block: 'nearest'});
  }, 100);
}

// Funcion legacy mantenida por compatibilidad (no se usa con el nuevo dropdown)
function selC(i) {
  var sel = ge('caus-sel');
  if (sel) { sel.value = String(i); onCausalChange(String(i)); }
}


function buildCausalDet(i, c) {
  var distGen  = (typeof DIST_GENERALES !== 'undefined') ? DIST_GENERALES : [];
  var distUser = DIST_MAP[APP_USER] || [];
  var catOpts  = '<option value="">Seleccionar producto</option>';
  for (var k = 0; k < CATALOGO.length; k++) {
    catOpts += '<option value="' + CATALOGO[k].e + '">' + CATALOGO[k].n + '</option>';
  }

  var h = '<div class="ci-det" onclick="event.stopPropagation()">';
  h += '<div class="ci-det-ttl">\u26a0 INFORMACION OBLIGATORIA</div>';

  if (c.tipo === 'stock') {
    h += '<p class="ci-lbl">\u00bfQUE SKU TIENE EN STOCK? (hasta 3)</p>';
    for (var n = 0; n < 3; n++) {
      h += '<div class="sku-row">';
      h += '<div class="sku-num">' + (n + 1) + '</div>';
      h += '<select id="cs' + i + 's' + n + '" class="ci-sel" style="margin-bottom:0;flex:1">' + catOpts + '</select>';
      h += '</div>';
    }
    h += '<label class="ci-lbl mt8">\u00bfCUANTAS UNIDADES TIENE APROX? <span class="req">*</span></label>';
    h += '<div class="qty-wrap">';
    h += '<button class="qbtn" onclick="qMinus(\'csq' + i + '\')">\u2212</button>';
    h += '<input id="csq' + i + '" value="1" class="qty-inp" inputmode="numeric"/>';
    h += '<button class="qbtn" onclick="qPlus(\'csq' + i + '\')">+</button>';
    h += '<span class="qty-lbl">UNIDADES</span></div>';
    h += '<label class="ci-lbl mt8">\u00bfA CUANTO VENDE LA UNIDAD O DOC (MAYORISTA)? <span class="req">*</span></label>';
    h += '<input id="csp' + i + '" class="ci-inp" placeholder="Ej. S/ 1.80 x UND o S/ 18 x DOC"/>';
  }

  else if (c.tipo === 'precio') {
    h += '<label class="ci-lbl">\u00bfQUE MARCA COMPETIDORA TIENE? <span class="req">*</span></label>';
    h += '<input id="cpm' + i + '" class="ci-inp" placeholder="EJ. COLGATE, PALMOLIVE, DERSA..." oninput="this.value=this.value.toUpperCase()"/>';
    h += '<label class="ci-lbl mt8">\u00bfA CUANTO VENDE LA UNIDAD O DOC (MAYORISTA)? <span class="req">*</span></label>';
    h += '<input id="cpp' + i + '" class="ci-inp" placeholder="Ej. S/ 1.50 x UND o S/ 15 x DOC"/>';
  }

  else if (c.tipo === 'margen') {
    h += '<p class="ci-lbl">\u00bfQUE SKU TIENE EN STOCK? (hasta 3)</p>';
    for (var n = 0; n < 3; n++) {
      h += '<div class="sku-row">';
      h += '<div class="sku-num">' + (n + 1) + '</div>';
      h += '<select id="cg' + i + 's' + n + '" class="ci-sel" style="margin-bottom:0;flex:1">' + catOpts + '</select>';
      h += '</div>';
    }
    h += '<label class="ci-lbl mt8">\u00bfA QUE DISTRIBUIDORA LE COMPRA? <span class="req">*</span></label>';
    var dOpts = '<option value="">Seleccionar distribuidora</option>';
    for (var d = 0; d < distUser.length; d++) dOpts += '<option>' + distUser[d] + '</option>';
    dOpts += '<option>OTRA DISTRIBUIDORA</option>';
    h += '<select id="cgd' + i + '" class="ci-sel">' + dOpts + '</select>';
    h += '<label class="ci-lbl mt8">\u00bfA CUANTO LO COMPRA? <span class="req">*</span></label>';
    h += '<input id="cgc' + i + '" class="ci-inp" placeholder="Ej. S/ 1.20 x UND"/>';
    h += '<label class="ci-lbl mt8">\u00bfA CUANTO LO VENDE (MAYORISTA)? <span class="req">*</span></label>';
    h += '<input id="cgv' + i + '" class="ci-inp" placeholder="Ej. S/ 1.50 x UND"/>';
  }

  else if (c.tipo === 'calidad') {
    h += '<label class="ci-lbl">\u00bfA QUE PRODUCTO HACE REFERENCIA? <span class="req">*</span></label>';
    h += '<select id="cca' + i + '" class="ci-sel">' + catOpts + '</select>';
    h += '<label class="ci-lbl mt8">DETALLA EL COMENTARIO DEL CLIENTE <span class="req">*</span></label>';
    h += '<textarea id="ccc' + i + '" class="ci-ta" rows="3" placeholder="DESCRIBE LO QUE DICE EL CLIENTE..."></textarea>';
  }

  else if (c.tipo === 'diststock') {
    h += '<label class="ci-lbl">\u00bfQUE PRODUCTO DESEA EL PDV? <span class="req">*</span></label>';
    h += '<select id="cds' + i + 'sku" class="ci-sel">' + catOpts + '</select>';
    h += '<label class="ci-lbl mt8">\u00bfQUE CANTIDAD DESEA? <span class="req">*</span></label>';
    h += '<div class="qty-wrap">';
    h += '<button class="qbtn" onclick="qMinus(\'cds' + i + 'qty\')">\u2212</button>';
    h += '<input id="cds' + i + 'qty" value="1" class="qty-inp" inputmode="numeric"/>';
    h += '<button class="qbtn" onclick="qPlus(\'cds' + i + 'qty\')">+</button>';
    h += '<span class="qty-lbl">UNIDADES</span></div>';
  }

  else if (c.tipo === 'vendedor') {
    h += '<label class="ci-lbl">\u00bfQUE DISTRIBUIDORA VISITO EL PDV ANTES? <span class="req">*</span></label>';
    var gOpts = '<option value="">Seleccionar distribuidora</option>';
    for (var d = 0; d < distGen.length; d++) gOpts += '<option>' + distGen[d] + '</option>';
    gOpts += '<option>OTRA / NO IDENTIFICADA</option>';
    h += '<select id="cvd' + i + '" class="ci-sel">' + gOpts + '</select>';
  }

  h += '</div>';
  return h;
}


function qMinus(id) { var e = ge(id); if (e) e.value = Math.max(1, (parseInt(e.value, 10) || 1) - 1); }
function qPlus(id)  { var e = ge(id); if (e) e.value = (parseInt(e.value, 10) || 1) + 1; }

function skuNombre(ean) {
  for (var k = 0; k < CATALOGO.length; k++) if (CATALOGO[k].e === ean) return CATALOGO[k].n;
  return ean;
}

function getCausalDet() {
  if (REL_CAUSAL === null) return '';
  var c = CAUSALES[REL_CAUSAL];
  var i = REL_CAUSAL;
  var parts = [];
  var el;

  if (c.tipo === 'stock') {
    var skus = [];
    for (var n = 0; n < 3; n++) {
      el = ge('cs' + i + 's' + n);
      if (el && el.value) skus.push(skuNombre(el.value));
    }
    if (skus.length) parts.push('SKUs: ' + skus.join(', '));
    el = ge('csq' + i); if (el && el.value) parts.push('Cant: ' + el.value + ' UND');
    el = ge('csp' + i); if (el && el.value) parts.push('Precio venta: ' + el.value);
  }
  else if (c.tipo === 'precio') {
    el = ge('cpm' + i); if (el && el.value) parts.push('Marca: ' + el.value);
    el = ge('cpp' + i); if (el && el.value) parts.push('Precio: ' + el.value);
  }
  else if (c.tipo === 'margen') {
    var skus2 = [];
    for (var n = 0; n < 3; n++) {
      el = ge('cg' + i + 's' + n);
      if (el && el.value) skus2.push(skuNombre(el.value));
    }
    if (skus2.length) parts.push('SKUs: ' + skus2.join(', '));
    el = ge('cgd' + i); if (el && el.value) parts.push('Dist compra: ' + el.value);
    el = ge('cgc' + i); if (el && el.value) parts.push('Compra: ' + el.value);
    el = ge('cgv' + i); if (el && el.value) parts.push('Venta: ' + el.value);
  }
  else if (c.tipo === 'calidad') {
    el = ge('cca' + i); if (el && el.value) parts.push('Producto: ' + skuNombre(el.value));
    el = ge('ccc' + i); if (el && el.value) parts.push('Comentario: ' + el.value);
  }
  else if (c.tipo === 'diststock') {
    el = ge('cds' + i + 'sku'); if (el && el.value) parts.push('Producto deseado: ' + skuNombre(el.value));
    el = ge('cds' + i + 'qty'); if (el && el.value) parts.push('Cantidad: ' + el.value + ' UND');
  }
  else if (c.tipo === 'vendedor') {
    el = ge('cvd' + i); if (el && el.value) parts.push('Distribuidora que visito antes: ' + el.value);
  }
  return parts.join(' | ');
}


function validarCausal() {
  if (REL_CAUSAL === null) { alert('Selecciona una causal de no venta'); return false; }
  var c = CAUSALES[REL_CAUSAL];
  var i = REL_CAUSAL;
  var el;

  if (c.tipo === 'stock') {
    el = ge('cs' + i + 's0'); if (!el || !el.value) { alert('Selecciona al menos 1 SKU que tiene en stock'); return false; }
    el = ge('csp' + i);       if (!el || !el.value.trim()) { alert('Indica a cuanto vende la unidad o doc'); return false; }
  }
  if (c.tipo === 'precio') {
    el = ge('cpm' + i); if (!el || !el.value.trim()) { alert('Indica la marca competidora'); return false; }
    el = ge('cpp' + i); if (!el || !el.value.trim()) { alert('Indica a cuanto vende'); return false; }
  }
  if (c.tipo === 'margen') {
    el = ge('cg' + i + 's0'); if (!el || !el.value) { alert('Selecciona al menos 1 SKU en stock'); return false; }
    el = ge('cgd' + i);        if (!el || !el.value) { alert('Selecciona la distribuidora a la que le compra'); return false; }
    el = ge('cgc' + i);        if (!el || !el.value.trim()) { alert('Indica a cuanto lo compra'); return false; }
    el = ge('cgv' + i);        if (!el || !el.value.trim()) { alert('Indica a cuanto lo vende'); return false; }
  }
  if (c.tipo === 'calidad') {
    el = ge('cca' + i); if (!el || !el.value)        { alert('Selecciona el producto'); return false; }
    el = ge('ccc' + i); if (!el || !el.value.trim()) { alert('Detalla el comentario del cliente'); return false; }
  }
  if (c.tipo === 'diststock') {
    el = ge('cds' + i + 'sku'); if (!el || !el.value) { alert('Selecciona el producto que desea el PDV'); return false; }
  }
  if (c.tipo === 'vendedor') {
    el = ge('cvd' + i); if (!el || !el.value) { alert('Selecciona la distribuidora que visito el PDV antes'); return false; }
  }
  return true;
}


// ─── REVISAR / CONFIRMAR ─────────────────────────────────
function revisarRelevo() {
  if (!REL_PDV)                                { alert('Selecciona un PDV primero'); return; }
  var g = ge('f-giro'); var sg = ge('f-sub');
  if (!g || !g.value)                          { alert('Selecciona el Giro'); return; }
  if (!sg || !sg.value)                        { alert('Selecciona el Sub-Giro'); return; }
  if (REL_MODO === 'si' && !REL_PEDIDO.length) { alert('Agrega al menos un producto'); return; }
  if (REL_MODO === 'no' && !validarCausal())   return;

  var tot = 0;
  for (var i = 0; i < REL_PEDIDO.length; i++) tot += REL_PEDIDO[i].qty * (REL_PEDIDO[i].price || 0);
  var dd = APP_DD || {dist: 'No configurada', mesa: '-', vend: '-'};
  var html = '';
  html += '<div class="rev-item"><p class="rev-lbl">PDV</p><p class="rev-val">' + REL_PDV.n + '</p><p class="rev-sub">' + REL_PDV.dist + ' \u00b7 ' + REL_PDV.dep + '</p></div>';
  html += '<div class="rev-item"><p class="rev-lbl">Giro / Sub-Giro</p><p class="rev-val">' + g.value + ' \u00b7 ' + sg.value + '</p></div>';
  html += '<div class="rev-item"><p class="rev-lbl">Distribuidora del dia</p><p class="rev-val">' + dd.dist + '</p><p class="rev-sub">Mesa: ' + dd.mesa + ' \u00b7 ' + dd.vend + '</p></div>';

  if (REL_MODO === 'si') {
    html += '<div class="rev-item rev-green"><p class="rev-lbl">Pedido</p>';
    for (var i = 0; i < REL_PEDIDO.length; i++) {
      var p = REL_PEDIDO[i];
      html += '<p class="rev-sku">\u2022 ' + p.n + ' \u2014 ' + p.qty + ' UND x S/ ' + fmt(p.price || 0) + ' = <strong>S/ ' + fmt(p.qty * (p.price || 0)) + '</strong></p>';
    }
    html += '<p class="rev-total">Total: S/ ' + fmt(tot) + '</p></div>';
  } else {
    var det = getCausalDet();
    html += '<div class="rev-item rev-red"><p class="rev-lbl">Causal de no venta</p><p class="rev-val" style="color:#DC2626">' + CAUSALES[REL_CAUSAL].t + '</p>' + (det ? '<p class="rev-sub">' + det + '</p>' : '') + '</div>';
  }
  var ob = ge('f-obs');
  if (ob && ob.value) html += '<div class="rev-item"><p class="rev-lbl">Observaciones</p><p class="rev-val">' + ob.value + '</p></div>';

  var rc = ge('m-rev-content');
  if (rc) rc.innerHTML = html;
  openModal('m-revisar');
}

function confirmarRelevo() {
  var tot = 0;
  for (var i = 0; i < REL_PEDIDO.length; i++) tot += REL_PEDIDO[i].qty * (REL_PEDIDO[i].price || 0);
  var dd = APP_DD || {dist: '-', mesa: '-', vend: '-'};
  var hr = hora();
  var id = Date.now();
  var ob = ge('f-obs'); var obsVal = ob ? ob.value : '';
  var g = ge('f-giro'); var sg = ge('f-sub'); var ruc = ge('f-ruc');
  var causalTxt = REL_CAUSAL !== null ? CAUSALES[REL_CAUSAL].t : '';
  var causalDet = getCausalDet();

  var baseRow = [
    id, 'RELEVO', APP_FECHA, hr, APP_USER,
    dd.dist, dd.mesa, dd.vend,
    REL_PDV.n, ruc ? ruc.value : '', REL_PDV.d,
    REL_PDV.dist, REL_PDV.prov, REL_PDV.dep,
    g ? g.value : '', sg ? sg.value : '',
    REL_MODO === 'si' ? 'SI' : 'NO'
  ];

  var filas = [];
  if (REL_MODO === 'si' && REL_PEDIDO.length > 0) {
    for (var i = 0; i < REL_PEDIDO.length; i++) {
      var p = REL_PEDIDO[i];
      filas.push(baseRow.concat([p.e, p.n, p.m, p.qty, 'UND', p.price, p.qty * p.price, tot, '', '', obsVal]));
    }
  } else {
    filas.push(baseRow.concat(['', '', '', 0, '', 0, 0, 0, causalTxt, causalDet, obsVal]));
  }

  var reg = {
    id: id, fecha: APP_FECHA, hora: hr, user: APP_USER,
    pdv: REL_PDV.n, dist: REL_PDV.dist, dep: REL_PDV.dep,
    giro: g ? g.value : '', sub: sg ? sg.value : '',
    modo: REL_MODO, pedido: REL_PEDIDO.slice(),
    causal: REL_CAUSAL, causalTxt: causalTxt, causalDet: causalDet,
    obs: obsVal, total: REL_MODO === 'si' ? tot : 0,
    synced: false, filas: filas
  };

  APP_HIST.push(reg);
  saveHist();

  gasPost({accion: 'GUARDAR', filas: filas}, function(ok) {
    reg.synced = ok;
    if (!ok) APP_PEND.push({id: id, estado: 'pendiente', filas: filas});
    saveHist();
    actualizarConexion();
    refreshHome();
  });

  closeModal('m-revisar');
  resetRelevo();
  refreshHome();
  G('s-home');
}

function resetRelevo() {
  REL_PDV = null; REL_PEDIDO = []; REL_CAUSAL = null; REL_MODO = 'si'; REL_NP = false;
  var cs = ge('caus-sel'); if (cs) cs.value = '';
  var cd = ge('caus-detail'); if (cd) { cd.innerHTML = ''; cd.style.display = 'none'; }
  var ids = ['pdv-inp', 'f-giro', 'f-sub', 'f-ruc', 'f-obs', 'sku-inp', 'np-nm', 'np-dir'];
  for (var i = 0; i < ids.length; i++) { var el = ge(ids[i]); if (el) el.value = ''; }
  var hideIds = ['pdv-sel', 'pdv-drop', 'np-panel', 'sku-drop'];
  for (var i = 0; i < hideIds.length; i++) { var el = ge(hideIds[i]); if (el) el.style.display = 'none'; }
  var bn = ge('btn-np'); if (bn) bn.textContent = '\uff0b Crear nuevo punto de venta';
  var ew = ge('ped-empty'); if (ew) ew.style.display = 'block';
  var pw = ge('ped-wrap');  if (pw) pw.style.display = 'none';
  setModo('si');
}

// ─── HISTORIAL ───────────────────────────────────────────
function renderHist() {
  var h = histHoy();
  var hs = ge('hist-sub');
  if (hs) hs.textContent = h.length + ' visita(s)';
  fHist('all', null);
}

function fHist(f, btn) {
  if (btn) {
    var chips = document.querySelectorAll('#hist-chips .chip');
    for (var i = 0; i < chips.length; i++) chips[i].classList.remove('on');
    btn.classList.add('on');
  }
  var h = histHoy();
  var fil = [];
  for (var i = 0; i < h.length; i++) if (f === 'all' || h[i].modo === f) fil.push(h[i]);
  var list = ge('hist-list');
  if (!list) return;
  if (!fil.length) { list.innerHTML = '<div class="empty-state">Sin registros</div>'; return; }

  var html = '';
  for (var i = 0; i < fil.length; i++) {
    var r = fil[i];
    var pedHtml = '';
    if (r.modo === 'si' && r.pedido && r.pedido.length) {
      pedHtml = '<div class="ped-det">';
      for (var j = 0; j < r.pedido.length; j++) {
        var p = r.pedido[j];
        pedHtml += '<p class="ped-det-row">\u2022 ' + p.n + ' \u2014 ' + p.qty + ' UND x S/ ' + fmt(p.price || 0) + ' = <strong>S/ ' + fmt(p.qty * (p.price || 0)) + '</strong></p>';
      }
      pedHtml += '<p class="ped-det-total">Total: S/ ' + fmt(r.total) + '</p></div>';
    }
    var cauHtml = '';
    if (r.modo === 'no') {
      cauHtml = '<p class="hist-caus">' + (r.causalTxt || '') + '</p>';
      if (r.causalDet) cauHtml += '<p class="hist-det">' + r.causalDet + '</p>';
    }
    html += '<div class="hi"><div class="hi-top">';
    html += '<div class="hi-nm">' + r.pdv + '</div>';
    html += '<div class="hi-dt">' + (r.hora || '--:--') + ' \u00b7 ' + (r.dist || '') + ' \u00b7 ' + (r.dep || '') + '</div>';
    html += '<div class="hi-tags">';
    html += '<span class="tag ' + (r.modo === 'si' ? 'tg-green' : 'tg-amber') + '">' + (r.modo === 'si' ? '\u2713 S/ ' + fmt(r.total) : '\u2715 Sin pedido') + '</span>';
    html += '<span class="tag tg-gray">' + (r.giro || '') + '</span>';
    html += '<span class="tag ' + (r.synced ? 'tg-teal' : 'tg-amber') + '">' + (r.synced ? '\u2713 Sync' : 'Pendiente') + '</span>';
    html += '</div>' + pedHtml + cauHtml;
    if (r.obs) html += '<p class="hist-obs">\ud83d\udcac ' + r.obs + '</p>';
    html += '</div><div class="hi-foot">';
    html += '<button class="btn-xs btn-del" onclick="borrarRelevo(' + r.id + ')">\ud83d\uddd1 Eliminar</button>';
    html += '</div></div>';
  }
  list.innerHTML = html;
}

function borrarRelevo(id) {
  if (!confirm('\u00bfEliminar este relevo?')) return;
  var nh = [];
  for (var i = 0; i < APP_HIST.length; i++) if (APP_HIST[i].id !== id) nh.push(APP_HIST[i]);
  APP_HIST = nh;
  gasPost({accion: 'BORRAR', id: String(id)}, null);
  saveHist();
  renderHist();
  refreshHome();
}

// ─── CIERRE ──────────────────────────────────────────────
function buildCierre() {
  var h = histHoy();
  var m = metricas(h);

  var stats = ge('cierre-stats');
  if (stats) {
    var data = [
      ['\ud83c\udfea', m.vis, 'PDVs visitados'],
      ['\u2705', m.cv, 'Con venta'],
      ['\u274c', m.sv, 'Sin venta'],
      ['\ud83d\udcca', m.neto, 'Neto visitados'],
      ['\ud83d\udcc8', m.ef + '%', 'Efectividad'],
      ['\ud83d\udcb0', 'S/ ' + fmt(m.tot), 'Total']
    ];
    var html = '';
    for (var i = 0; i < data.length; i++) {
      html += '<div class="cst"><div class="cst-ico">' + data[i][0] + '</div><div class="cst-val">' + data[i][1] + '</div><div class="cst-lbl">' + data[i][2] + '</div></div>';
    }
    stats.innerHTML = html;
  }

  var lines = [];
  lines.push('\ud83d\udccb CIERRE DEL DIA \u2014 ' + fmtS(APP_FECHA));
  lines.push('\ud83d\udc64 ' + APP_USER);
  lines.push('');
  lines.push('\ud83c\udfea PDVs visitados: ' + m.vis);
  lines.push('\u2705 Con venta: ' + m.cv);
  lines.push('\u274c Sin venta: ' + m.sv);
  lines.push('\ud83d\udcca Neto visitados: ' + m.neto);
  lines.push('\ud83d\udcc8 Efectividad: ' + m.ef + '%');
  lines.push('\ud83d\udcb0 Total S/: ' + fmt(m.tot));
  if (APP_DD) { lines.push(''); lines.push('\ud83d\ude9a Distribuidora: ' + APP_DD.dist + ' \u00b7 ' + APP_DD.mesa); }
  lines.push('');
  lines.push('Enviado desde S2S Point');

  var cm = ge('cierre-msg');
  if (cm) cm.value = lines.join('\n');
  setCierre();
}

function compartir() {
  var m = ge('cierre-msg');
  if (m) window.open('https://wa.me/?text=' + encodeURIComponent(m.value));
}

function copiar() {
  var m = ge('cierre-msg');
  if (!m) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(m.value).then(function() { alert('\u00a1Mensaje copiado!'); }).catch(function() { copiarFallback(m); });
  } else { copiarFallback(m); }
}

function copiarFallback(m) {
  m.select();
  try { document.execCommand('copy'); alert('\u00a1Mensaje copiado!'); }
  catch (e) { alert('Manten presionado el texto para copiarlo'); }
}

// ─── SINCRONIZAR ─────────────────────────────────────────
function initSync() {
  var h = histHoy();
  var sy = 0;
  for (var i = 0; i < h.length; i++) if (h[i].synced) sy++;
  var sa = ge('sy-app');  if (sa) sa.textContent = h.length;
  var ss = ge('sy-sh');   if (ss) ss.textContent = sy;
  var sp = ge('sy-pend'); if (sp) sp.textContent = h.length - sy;
  var so = ge('sync-ok'); if (so) so.style.display = 'none';
  var sv = ge('sy-volver'); if (sv) sv.style.display = 'none';
  var btn = ge('sy-btn');
  if (btn) { btn.style.display = 'flex'; btn.disabled = false; btn.textContent = '\ud83d\udd04 Validar y sincronizar'; }
}

function doSync() {
  var btn = ge('sy-btn');
  if (btn) { btn.disabled = true; btn.textContent = '\u23f3 Verificando en Google Sheets...'; }
  var h = histHoy();
  if (!h.length) { syncDone(0, 0); return; }

  // 1. Consultar que hay en Sheets
  gasGet({accion: 'listar', usuario: APP_USER, fecha: APP_FECHA}, function(resp) {
    var idsSheets = {};
    if (resp && resp.status === 'ok' && resp.filas) {
      for (var i = 0; i < resp.filas.length; i++) idsSheets[String(resp.filas[i][0])] = true;
    }
    // 2. Marcar los que ya estan; reenviar faltantes
    var faltantes = [];
    for (var i = 0; i < h.length; i++) {
      if (idsSheets[String(h[i].id)]) { h[i].synced = true; }
      else if (!h[i].synced) { faltantes.push(h[i]); }
    }
    if (!faltantes.length) { saveHist(); contarYFinalizar(h); return; }

    var procesados = 0;
    for (var i = 0; i < faltantes.length; i++) {
      (function(reg) {
        gasPost({accion: 'GUARDAR', filas: reg.filas}, function(ok) {
          if (ok) reg.synced = true;
          procesados++;
          if (procesados === faltantes.length) { saveHist(); contarYFinalizar(h); }
        });
      })(faltantes[i]);
    }
  });
}

function contarYFinalizar(h) {
  var sy = 0;
  for (var i = 0; i < h.length; i++) if (h[i].synced) sy++;
  syncDone(sy, h.length);
}

function syncDone(synced, total) {
  var ss = ge('sy-sh');   if (ss) ss.textContent = synced;
  var sp = ge('sy-pend'); if (sp) sp.textContent = total - synced;
  var btn = ge('sy-btn');
  if (synced === total) {
    var so = ge('sync-ok'); if (so) so.style.display = 'block';
    var st = ge('sy-ok-txt'); if (st) st.textContent = total + ' de ' + total + ' relevos almacenados';
    if (btn) btn.style.display = 'none';
    var sv = ge('sy-volver'); if (sv) sv.style.display = 'block';
  } else {
    if (btn) { btn.disabled = false; btn.textContent = '\ud83d\udd04 Reintentar (' + (total - synced) + ' pendientes)'; }
  }
}

function finalizarDia() {
  setCierre();
  ejecutarSalida();
}

// ─── SUPERVISOR ──────────────────────────────────────────
var _supProms = [];
var _supFecha = '';
var _supData  = {};   // usuario -> {tot,v,cv,n,ef,cierre,visitas[]}

function initSup() {
  _supProms = SUP_MAP[APP_USER] || [];
  _supFecha = APP_FECHA;
  var av = ge('sup-av');   if (av) av.textContent = APP_USER.slice(3, 5);
  var su = ge('sup-user'); if (su) su.textContent = APP_USER;
  var ss = ge('sup-sub');  if (ss) ss.textContent = SUP_NAMES[APP_USER] || APP_USER;
  var tb = ge('sup-team-badge'); if (tb) tb.textContent = _supProms.length + ' promotoras';
  actualizarFechaSupTxt();
  cargarDataEquipo();
  renderApro();
  G('s-sup');
}

function actualizarFechaSupTxt() {
  var dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  var dt = new Date(_supFecha + 'T12:00:00');
  var ft = ge('sup-fecha-txt');
  if (ft) ft.textContent = dias[dt.getDay()] + ', ' + fmtS(_supFecha);
}

function cargarDataEquipo() {
  _supData = {};
  // Consultar GAS por equipo
  gasGet({accion: 'listar_equipo', promotoras: _supProms.join(','), fecha: _supFecha}, function(resp) {
    if (resp && resp.status === 'ok' && resp.filas) {
      procesarFilasEquipo(resp.filas);
    }
    renderSupTotales();
    renderProms('all');
  });
  // Render inicial (vacio o con lo que haya)
  renderSupTotales();
  renderProms('all');
}

function procesarFilasEquipo(filas) {
  // Agrupar por usuario y por ID (un relevo puede tener varias filas-producto)
  var porUser = {};
  for (var i = 0; i < filas.length; i++) {
    var f = filas[i];
    var u = String(f[4]);
    var idr = String(f[0]);
    if (!porUser[u]) porUser[u] = {};
    if (!porUser[u][idr]) {
      porUser[u][idr] = {pdv: f[8], hora: f[3], pedido: String(f[16]) === 'SI', total: 0, causal: f[25] || ''};
    }
    if (String(f[16]) === 'SI') porUser[u][idr].total = parseFloat(f[24]) || porUser[u][idr].total;
  }
  for (var u in porUser) {
    var regs = porUser[u];
    var v = 0, cv = 0, tot = 0, ext = 0;
    var visitas = [];
    for (var idr in regs) {
      var r = regs[idr];
      v++;
      if (r.pedido) { cv++; tot += r.total; }
      else {
        // identificar si causal es externa
        for (var k = 0; k < CAUSALES.length; k++) {
          if (CAUSALES[k].t === r.causal && !CAUSALES[k].promotor) { ext++; break; }
        }
      }
      visitas.push(r);
    }
    var neto = v - ext;
    var ef = neto > 0 ? Math.round(cv / neto * 100) : 0;
    _supData[u] = {tot: tot, v: v, cv: cv, n: neto, ef: ef, cierre: false, visitas: visitas};
  }
}

function renderSupTotales() {
  var tot = 0, tv = 0, tcv = 0, tn = 0;
  for (var i = 0; i < _supProms.length; i++) {
    var d = _supData[_supProms[i]];
    if (d) { tot += d.tot; tv += d.v; tcv += d.cv; tn += d.n; }
  }
  var tef = tn > 0 ? Math.round(tcv / tn * 100) : 0;
  var st = ge('sup-total'); if (st) st.textContent = 'S/ ' + fmt(tot);
  var ts = ge('sup-tot-stats');
  if (ts) {
    var data = [[tv, 'Visitados', 'var(--text)'], [tcv, 'Con venta', 'var(--green)'], [tn, 'Neto', 'var(--blue)'], [tef + '%', 'Efect.', 'var(--text)']];
    var html = '';
    for (var i = 0; i < data.length; i++) {
      html += '<div class="sup-stat"><div class="sup-stat-val" style="color:' + data[i][2] + '">' + data[i][0] + '</div><div class="sup-stat-lbl">' + data[i][1] + '</div></div>';
    }
    ts.innerHTML = html;
  }
}

function fProm(f, btn) {
  var chips = document.querySelectorAll('#sup-chips .chip');
  for (var i = 0; i < chips.length; i++) chips[i].classList.remove('on');
  if (btn) btn.classList.add('on');
  renderProms(f);
}

function renderProms(filter) {
  var list = ge('prom-list');
  if (!list) return;
  var PAL = {PROMLIM1: '#DBEAFE,#1E40AF', PROMLIM3: '#D1FAE5,#065F46', PROMLIM5: '#FEF3C7,#92400E', PROMLIM6: '#FEE2E2,#991B1B', PROMAQP: '#EDE9FE,#5B21B6', PROMCUS: '#FCE7F3,#9D174D', PROMTAC: '#E0F2FE,#075985', PROMHYO: '#ECFDF5,#064E3B', PROMTPP: '#FFF7ED,#7C2D12', PROMCIX: '#F1F5F9,#1E293B', PROMTRUX: '#FDF2F8,#831843', PROMICA: '#FFFBEB,#78350F', PROMPIU: '#EEF2FF,#3730A3'};
  var html = '';
  for (var i = 0; i < _supProms.length; i++) {
    var p = _supProms[i];
    var d = _supData[p] || {tot: 0, v: 0, cv: 0, n: 0, ef: 0, cierre: false, visitas: []};
    var tieneData = d.v > 0;
    if (filter === 'cierre' && !tieneData) continue;
    if (filter === 'no-cierre' && tieneData) continue;
    var clr = (PAL[p] || '#E2E8F0,#475569').split(',');
    var efCol = d.ef >= 70 ? 'var(--green)' : d.ef >= 55 ? 'var(--amber)' : 'var(--red)';
    html += '<div class="pcard" onclick="showDet(\'' + p + '\')">';
    html += '<div class="pc-top">';
    html += '<div class="pc-av" style="background:' + clr[0] + ';color:' + clr[1] + '">' + p.slice(-2) + '</div>';
    html += '<div style="flex:1"><p class="pc-nm">' + p + '</p><p class="pc-dist">' + ((DIST_MAP[p] || [])[0] || '-') + '</p></div>';
    html += '<div class="pc-monto"><p class="pc-tot">S/ ' + fmt(d.tot) + '</p><p class="pc-tot-lbl">vendido</p></div>';
    html += '</div><div class="pc-stats">';
    html += '<div class="ps"><div class="ps-val">' + d.v + '</div><div class="ps-lbl">Visitas</div></div>';
    html += '<div class="ps"><div class="ps-val" style="color:var(--green)">' + d.cv + '</div><div class="ps-lbl">Con venta</div></div>';
    html += '<div class="ps"><div class="ps-val" style="color:var(--blue)">' + d.n + '</div><div class="ps-lbl">Neto</div></div>';
    html += '<div class="ps"><div class="ps-val" style="color:' + efCol + '">' + d.ef + '%</div><div class="ps-lbl">Efect.</div></div>';
    html += '</div><div class="pc-status">';
    html += '<div class="dot ' + (tieneData ? 'dot-g' : 'dot-r') + '"></div>';
    html += '<p class="pc-status-txt">' + (tieneData ? '\u2705 ' + d.v + ' registros en Sheets' : '\u26a0\ufe0f Sin registros aun') + '</p>';
    html += '</div></div>';
  }
  list.innerHTML = html || '<div class="empty-state">Sin promotoras con ese filtro</div>';
}

function showDet(u) {
  var d = _supData[u] || {tot: 0, v: 0, cv: 0, n: 0, ef: 0, visitas: []};
  var t1 = ge('det-titulo'); if (t1) t1.textContent = u;
  var t2 = ge('det-sub');    if (t2) t2.textContent = (DIST_MAP[u] || [])[0] || '-';
  var t3 = ge('det-tot');    if (t3) t3.textContent = 'S/ ' + fmt(d.tot);
  var t4 = ge('det-v');      if (t4) t4.textContent = d.v;
  var t5 = ge('det-cv');     if (t5) t5.textContent = d.cv;
  var t6 = ge('det-n');      if (t6) t6.textContent = d.n;
  var t7 = ge('det-ef');     if (t7) t7.textContent = d.ef + '%';
  var al = ge('det-alert');  if (al) al.style.display = d.v > 0 ? 'none' : 'flex';
  var dv = ge('det-visitas');
  if (dv) {
    if (!d.visitas.length) {
      dv.innerHTML = '<div class="empty-state">Sin visitas registradas</div>';
    } else {
      var html = '';
      for (var i = 0; i < d.visitas.length; i++) {
        var v = d.visitas[i];
        html += '<div class="det-visit"><div><p class="dv-nm">' + v.pdv + '</p><p class="dv-dt">' + v.hora + '</p></div>';
        html += '<span class="tag ' + (v.pedido ? 'tg-green' : 'tg-amber') + '">' + (v.pedido ? 'S/ ' + fmt(v.total) : (v.causal || 'Sin pedido')) + '</span></div>';
      }
      dv.innerHTML = html;
    }
  }
  G('s-sup-det');
}

function toggleDatePicker() {
  var pk = ge('date-picker');
  if (!pk) return;
  if (pk.style.display === 'block') { pk.style.display = 'none'; return; }
  var dias = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  var html = '';
  for (var i = 0; i < 7; i++) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    var y = d.getFullYear();
    var mm = ('0' + (d.getMonth() + 1)).slice(-2);
    var dd = ('0' + d.getDate()).slice(-2);
    var val = y + '-' + mm + '-' + dd;
    var lbl = (i === 0 ? 'Hoy \u2014 ' : '') + dias[d.getDay()] + ' ' + dd + '/' + mm + '/' + y;
    var active = val === _supFecha;
    html += '<button class="date-opt' + (active ? ' active' : '') + '" onclick="setSupFecha(\'' + val + '\')">' + lbl + (active ? ' \u2713' : '') + '</button>';
  }
  var dl = ge('date-list');
  if (dl) dl.innerHTML = html;
  pk.style.display = 'block';
}

function setSupFecha(val) {
  _supFecha = val;
  var pk = ge('date-picker');
  if (pk) pk.style.display = 'none';
  actualizarFechaSupTxt();
  cargarDataEquipo();
}

// ─── APROBACIONES ────────────────────────────────────────
var APRO = [];

function renderApro() {
  // Consultar modificaciones pendientes del GAS
  gasGet({accion: 'modificaciones', usuario: APP_USER}, function(resp) {
    APRO = [];
    if (resp && resp.status === 'ok' && resp.mods) {
      for (var i = 0; i < resp.mods.length; i++) {
        var m = resp.mods[i];
        APRO.push({id: String(m[0]), user: m[2], pdv: m[3], fecha: m[4], antes: m[5], despues: m[6]});
      }
    }
    pintarApro();
  });
  pintarApro();
}

function pintarApro() {
  var sub = ge('apro-sub');
  if (sub) sub.textContent = APRO.length + ' pendiente(s)';
  var emp = ge('apro-empty');
  var list = ge('apro-list');
  if (!APRO.length) {
    if (emp) emp.style.display = 'block';
    if (list) list.innerHTML = '';
    return;
  }
  if (emp) emp.style.display = 'none';
  var html = '<button class="btn btn-dark" style="margin-bottom:12px" onclick="aproTodas()">\u2705 Aprobar todas las modificaciones</button>';
  for (var i = 0; i < APRO.length; i++) {
    var a = APRO[i];
    html += '<div class="apr-item">';
    html += '<div class="apr-top"><div class="apr-av">' + a.user.slice(-2) + '</div><div><p class="apr-user">' + a.user + '</p><p class="apr-fecha">Modificacion \u00b7 ' + a.fecha + '</p></div></div>';
    html += '<div class="apr-det"><p class="apr-pdv">' + a.pdv + '</p><p class="apr-antes">Antes: ' + a.antes + '</p><p class="apr-despues">Despues: ' + a.despues + '</p></div>';
    html += '<div class="apr-btns">';
    html += '<button class="btn-xs btn-del" onclick="resolverMod(\'' + a.id + '\',\'RECHAZAR\')">\u2715 Rechazar</button>';
    html += '<button class="btn-xs btn-apr" onclick="resolverMod(\'' + a.id + '\',\'APROBAR\')">\u2713 Aprobar</button>';
    html += '</div></div>';
  }
  if (list) list.innerHTML = html;
}

function resolverMod(id, res) {
  gasPost({accion: 'RESOLVER_MOD', id_mod: id, resolucion: res}, null);
  var n = [];
  for (var i = 0; i < APRO.length; i++) if (APRO[i].id !== id) n.push(APRO[i]);
  APRO = n;
  pintarApro();
}

function aproTodas() {
  for (var i = 0; i < APRO.length; i++) {
    gasPost({accion: 'RESOLVER_MOD', id_mod: APRO[i].id, resolucion: 'APROBAR'}, null);
  }
  APRO = [];
  pintarApro();
}

// ─── MANUALES ────────────────────────────────────────────
function initManualProm() {
  var body = ge('manual-prom-body');
  if (!body || body.getAttribute('data-loaded')) return;
  body.setAttribute('data-loaded', '1');
  var html = '';
  html += '<div class="man-hero man-hero-blue"><p class="man-hero-ico">\ud83d\udcf1</p><p class="man-hero-ttl">Manual del App</p><p class="man-hero-sub">Guia completa para promotoras</p></div>';
  html += '<a href="./manual_promotor.html" target="_blank" class="man-link">';
  html += '<div class="man-link-ico" style="background:var(--blue-l)">\ud83d\udcd6</div>';
  html += '<div class="man-link-txt"><p class="man-link-ttl">Abrir manual completo</p><p class="man-link-sub">Guia interactiva paso a paso</p></div>';
  html += '<span class="man-link-arr">\u203a</span></a>';
  html += '<div class="sec"><div class="sec-body">';
  html += '<p style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:12px">\ud83d\udccb Resumen rapido</p>';
  var pasos = [
    ['\ud83d\ude9a', '1. Distribuidora del dia', 'Configurala al inicio de la jornada'],
    ['\ud83c\udfea', '2. Relevar pedido', 'Busca PDV, giro, Si/No, productos o causal'],
    ['\ud83d\uddc2', '3. Historial', 'Revisa y elimina registros del dia'],
    ['\ud83d\udd12', '4. Cierre del dia', 'Genera el resumen y envialo por WhatsApp'],
    ['\ud83d\udd04', '5. Sincronizar', 'Verifica que todo este en el sistema']
  ];
  for (var i = 0; i < pasos.length; i++) {
    html += '<div class="man-step"><span class="man-step-ico">' + pasos[i][0] + '</span><div><p class="man-step-ttl">' + pasos[i][1] + '</p><p class="man-step-sub">' + pasos[i][2] + '</p></div></div>';
  }
  html += '</div></div>';
  body.innerHTML = html;
}

function initManualSup() {
  var body = ge('manual-sup-body');
  if (!body || body.getAttribute('data-loaded')) return;
  body.setAttribute('data-loaded', '1');
  var html = '';
  html += '<div class="man-hero man-hero-purple"><p class="man-hero-ico">\ud83d\udc54</p><p class="man-hero-ttl">Manuales</p><p class="man-hero-sub">Guias para supervisores y promotoras</p></div>';
  html += '<a href="./manual_supervisor.html" target="_blank" class="man-link">';
  html += '<div class="man-link-ico" style="background:#EDE9FE">\ud83d\udc54</div>';
  html += '<div class="man-link-txt"><p class="man-link-ttl">Manual del Supervisor</p><p class="man-link-sub">Panel, equipo, aprobaciones y metricas</p></div>';
  html += '<span class="man-link-arr">\u203a</span></a>';
  html += '<a href="./manual_promotor.html" target="_blank" class="man-link">';
  html += '<div class="man-link-ico" style="background:var(--blue-l)">\ud83d\udc64</div>';
  html += '<div class="man-link-txt"><p class="man-link-ttl">Manual de la Promotora</p><p class="man-link-sub">Login, PDV, pedidos, causales y cierre</p></div>';
  html += '<span class="man-link-arr">\u203a</span></a>';
  body.innerHTML = html;
}

function goBackManualSup() {
  if (APP_IS_SUP) G('s-sup'); else G('s-home');
}

// ─── SERVICE WORKER / UPDATE ─────────────────────────────
function mostrarBannerUpdate() {
  var b = ge('banner-update');
  if (b) b.style.display = 'flex';
}

function aplicarActualizacion() {
  window.location.reload();
}

// ─── INICIALIZACION ──────────────────────────────────────
window.addEventListener('load', function() {
  // 1. Fecha de hoy autocargada, max = hoy
  var fe = ge('l-fecha');
  if (fe) {
    var td = today();
    fe.value = td;
    fe.max = td;
    fe.addEventListener('change', function() {
      if (this.value > today()) {
        this.value = today();
        showErr('Solo puedes seleccionar hoy o fechas anteriores');
      } else {
        hideErr();
      }
    });
  }

  // 2. Enter para avanzar en login
  var ue = ge('l-user');
  if (ue) ue.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { var p = ge('l-pass'); if (p) p.focus(); }
  });
  var pe = ge('l-pass');
  if (pe) pe.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') doLogin();
  });

  // 3. Conexion
  window.addEventListener('online', function() { actualizarConexion(); procesarPendientes(); });
  window.addEventListener('offline', actualizarConexion);
  actualizarConexion();

  // 4. Cerrar dropdowns al tocar fuera
  document.addEventListener('click', function(e) {
    var t = e.target;
    var dentroP = false, dentroS = false;
    var n = t;
    while (n) {
      if (n.id === 'pdv-inp' || n.id === 'pdv-drop') dentroP = true;
      if (n.id === 'sku-inp' || n.id === 'sku-drop') dentroS = true;
      n = n.parentElement;
    }
    if (!dentroP) { var d1 = ge('pdv-drop'); if (d1) d1.style.display = 'none'; }
    if (!dentroS) { var d2 = ge('sku-drop'); if (d2) d2.style.display = 'none'; }
  });

  // 5. Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function(reg) {
      reg.addEventListener('updatefound', function() {
        var nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', function() {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) mostrarBannerUpdate();
        });
      });
    }).catch(function(e) { console.warn('SW:', e); });
    navigator.serviceWorker.addEventListener('message', function(e) {
      if (e.data && e.data.tipo === 'NUEVA_VERSION') mostrarBannerUpdate();
    });
  }

  console.log('S2S Point v2.0 listo');
});
