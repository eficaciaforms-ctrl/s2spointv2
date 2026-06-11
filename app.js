// ════════════════════════════════════════════════════════
// S2S Point — app.js v2.0 (reconstruccion limpia)
// REGLAS DE COMPATIBILIDAD (Android 5+ / Chrome 60+):
//   - Sin optional chaining (?.)
//   - Sin template literals (backticks)
//   - Sin arrow functions
//   - document.getElementById() directo
// ════════════════════════════════════════════════════════

// ─── FRASES MOTIVADORAS (60 frases unicas) ───────────────
// Una promotora vera ~60 dias laborales antes de repetir
var FRASES_MOTIV = [
  'Cada PDV que visitas es una oportunidad. Hoy vas a sembrar relaciones que valen oro.',
  'No vendes productos, construyes confianza. Y la confianza siempre paga sus dividendos.',
  'El bodeguero recordara tu sonrisa antes que tu precio. Ve con la mejor.',
  'El "no" de hoy es la practica para el "si" de manana. Sigue tocando puertas.',
  'Eres el puente entre la marca y el cliente final. Sin ti, esta cadena no existe.',
  'Las metas no se cumplen solas, se cumplen porque alguien como tu se levanta cada manana.',
  'Cada visita es una historia, cada cliente una leccion. Hoy escribiras un nuevo capitulo.',
  'No esperes el momento perfecto. Hoy es el dia. Hoy es la hora. Hoy se vende.',
  'Tu actitud de hoy define las ventas de manana. Entra a cada PDV con energia ganadora.',
  'Eres mas fuerte de lo que crees. Mas capaz de lo que imaginas. Hoy lo demostraras.',
  'El esfuerzo de hoy es la celebracion de manana. Daselo todo a tu ruta.',
  'Una venta empieza con un saludo sincero. Sonriele a cada cliente como si fuera el primero.',
  'Los promotores promedio piden ordenes. Los excepcionales construyen socios. Se de los segundos.',
  'No cuentes las visitas, haz que cada visita cuente. Calidad sobre cantidad.',
  'Tu zona te necesita. Tus clientes te esperan. Tu meta te llama. Adelante.',
  'Cuando un PDV no compra, no es un fracaso, es informacion. Aprende y vuelve mas fuerte.',
  'La constancia vence al talento cuando el talento no es constante. Hoy te toca brillar.',
  'Cada categoria vendida es un paso hacia tu objetivo. Cada SKU activado es una victoria.',
  'No vendes con palabras, vendes con presencia. Camina con seguridad por cada calle.',
  'El mejor vendedor no es el que mas habla, es el que mejor escucha. Pregunta antes de ofrecer.',
  'Hoy alguien va a comprarte porque confio en ti. Honra esa confianza con tu trabajo.',
  'Las ventas son emocion antes que razon. Conecta primero, vende despues.',
  'No naciste para rendirte. Naciste para superar cada obstaculo que se te presente.',
  'Tus pies se cansan, pero tu espiritu no. Camina una cuadra mas. Esa puede ser la venta del dia.',
  'Hoy tu sonrisa puede ser la unica que ese bodeguero vea. Regalala sin medida.',
  'El cierre del dia se construye desde el primer "hola". Empieza con todo.',
  'Eres el rostro de Kenvue en la calle. Llevalo con orgullo y profesionalismo.',
  'No hay tormenta que dure cien anos ni cliente que no se conquiste. Persiste.',
  'Recuerda por que empezaste. Esa razon es mas grande que cualquier objecion.',
  'Hoy es tu dia. Manana tambien. Y el siguiente. Cada dia es una oportunidad nueva.',
  'Las mejores ventas no vienen del catalogo, vienen del corazon. Cree en lo que ofreces.',
  'Cuando entres al PDV, deja afuera el cansancio. Adentro solo cabe tu mejor version.',
  'Un "no" hoy puede ser un "si" la proxima semana. Construye relaciones, no transacciones.',
  'El mercado tradicional no se mueve solo. Se mueve por personas como tu que lo activan.',
  'La meta no es una linea de llegada, es una linea de partida diaria. Sale corriendo.',
  'Tu esfuerzo deja huella en cada rincon del Peru. Hoy escribes historia personal.',
  'No estas sola. Tu equipo te respalda. Tu marca te respalda. Y tu te respaldas a ti misma.',
  'Cada bodega visitada es un pequeno triunfo. Suma triunfos hasta hacer historia.',
  'Los mejores resultados nacen en los dias mas duros. Hoy puede ser uno de esos.',
  'El precio se discute, el valor se vive. Demuestra valor en cada interaccion.',
  'No vas a vender porque tienes que. Vas a vender porque puedes. Y hoy lo vas a hacer.',
  'La diferencia entre cumplir y superar la meta esta en la ultima visita del dia. No te rindas.',
  'Las objeciones son oportunidades disfrazadas. Aprende a desnudarlas con calma.',
  'Tu trabajo importa. Tu cliente importa. Tu meta importa. Y tu, sobre todo, importas.',
  'El sol sale para todos, pero solo los que se levantan lo aprovechan. Levantate.',
  'Hoy seras la razon por la que un bodeguero diga: "Que bueno que me visitaron".',
  'Eres una promotora, si. Pero antes eres una guerrera. Sale a la calle como tal.',
  'Las ventas se hacen en la calle, no en el escritorio. Cada paso es ganancia.',
  'Confia en el proceso. Confia en tu producto. Pero sobre todo, confia en ti misma.',
  'No hay zona dificil, hay zonas que requieren mas estrategia. Tu la tienes.',
  'Cada SKU que activas mejora la economia del bodeguero. Estas haciendo bien al pais.',
  'El cliente compra al vendedor antes que al producto. Vende quien eres primero.',
  'Las metas grandes se rompen en pasos pequenos. Da tu primer paso ahora.',
  'Hoy alguien escribira que vendio mas que ayer. Que esa persona seas tu.',
  'No hay venta pequena ni cliente menor. Cada interaccion suma a tu carrera.',
  'Las promotoras top no esperan motivacion, la crean. Eres una de ellas.',
  'Hoy vas a salir mas sabia de lo que entraste. Esa es la mejor venta del dia.',
  'Cuando el cuerpo diga "ya no", el corazon diga "una mas". Una visita mas siempre.',
  'Tu nombre va a ser recordado en cada PDV que visites. Que sea con respeto y carino.',
  'El esfuerzo no se negocia. La constancia tampoco. Hoy aplicas ambas al maximo.',
  'Cuando vuelvas a casa hoy, hazlo sabiendo que lo diste todo. Esa es la victoria real.'
];

function fraseDelDia() {
  // Genera un hash unico basado en usuario + fecha para que cada dia y cada promotora
  // vean una frase diferente, no se repita en mismo dia para mismo usuario
  var seed = (APP_USER || 'X') + '_' + (APP_FECHA || today());
  var hash = 0;
  for (var i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  hash = Math.abs(hash);
  return FRASES_MOTIV[hash % FRASES_MOTIV.length];
}

function mostrarFraseMotivacional() {
  // Solo mostrar 1 vez por dia por usuario
  try {
    var key = 's2s_motiv_shown_' + APP_USER + '_' + APP_FECHA;
    if (localStorage.getItem(key)) return; // ya se mostro hoy
    var txt = ge('motiv-text');
    if (txt) txt.textContent = fraseDelDia();
    openModal('m-motiv');
    localStorage.setItem(key, '1');
  } catch (e) { /* sin localStorage no pasa nada */ }
}

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

  // Mostrar frase motivadora del dia (solo 1 vez por dia)
  setTimeout(mostrarFraseMotivacional, 600);
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

function editarDD() {
  // Mostrar el formulario y pre-cargar los valores actuales
  if (!APP_DD) return;
  var ds = ge('dd-set');  if (ds) ds.style.display = 'none';
  var df = ge('dd-form'); if (df) df.style.display = 'block';
  var dDist = ge('dd-dist'); if (dDist) dDist.value = APP_DD.dist;
  var dMesa = ge('dd-mesa'); if (dMesa) dMesa.value = APP_DD.mesa;
  var dVend = ge('dd-vend'); if (dVend) dVend.value = APP_DD.vend;
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
  // El dropdown ya esta poblado directamente en el HTML.
  // Esta funcion existe solo para compatibilidad con setModo.
  return;
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
    h += '<p class="ci-lbl">\u00bfQUE SKUs TIENE EN STOCK? (hasta 3) <span class="req">*</span></p>';
    h += '<p style="font-size:11px;color:var(--t3);margin-bottom:10px">Por cada SKU completa unidades y precio de venta</p>';
    for (var n = 0; n < 3; n++) {
      h += '<div style="background:#fff;border:1.5px solid #93C5FD;border-radius:10px;padding:11px;margin-bottom:10px">';
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:9px">';
      h += '<div class="sku-num">' + (n + 1) + '</div>';
      h += '<select id="cs' + i + 's' + n + '" class="ci-sel" style="margin-bottom:0;flex:1">' + catOpts + '</select>';
      h += '</div>';
      h += '<label class="ci-lbl" style="font-size:11px">Unidades aprox</label>';
      h += '<div class="qty-wrap" style="margin-bottom:8px">';
      h += '<button class="qbtn" onclick="qMinus(\'cs' + i + 'q' + n + '\')">\u2212</button>';
      h += '<input id="cs' + i + 'q' + n + '" value="1" class="qty-inp" inputmode="numeric"/>';
      h += '<button class="qbtn" onclick="qPlus(\'cs' + i + 'q' + n + '\')">+</button>';
      h += '<span class="qty-lbl">UNIDADES</span></div>';
      h += '<label class="ci-lbl" style="font-size:11px">Precio venta UND (solo numero)</label>';
      h += '<input id="cs' + i + 'p' + n + '" class="ci-inp" style="margin-bottom:0" type="number" step="0.01" min="0" inputmode="decimal" placeholder="Ej. 1.80"/>';
      h += '</div>';
    }
  }

  else if (c.tipo === 'precio') {
    h += '<label class="ci-lbl">\u00bfQUE MARCA COMPETIDORA TIENE? <span class="req">*</span></label>';
    h += '<input id="cpm' + i + '" class="ci-inp" placeholder="EJ. COLGATE, PALMOLIVE, DERSA..." oninput="this.value=this.value.toUpperCase()"/>';
    h += '<label class="ci-lbl mt8">\u00bfA CUANTO VENDE LA UNIDAD O DOC (MAYORISTA)? <span class="req">*</span></label>';
    h += '<input id="cpp' + i + '" class="ci-inp" placeholder="Ej. S/ 1.50 x UND o S/ 15 x DOC"/>';
  }

  else if (c.tipo === 'margen') {
    h += '<p class="ci-lbl">\u00bfQUE SKUs TIENE EN STOCK? (hasta 3) <span class="req">*</span></p>';
    h += '<p style="font-size:11px;color:var(--t3);margin-bottom:10px">Por cada SKU completa precio de compra y de venta</p>';
    for (var n = 0; n < 3; n++) {
      h += '<div style="background:#fff;border:1.5px solid #93C5FD;border-radius:10px;padding:11px;margin-bottom:10px">';
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:9px">';
      h += '<div class="sku-num">' + (n + 1) + '</div>';
      h += '<select id="cg' + i + 's' + n + '" class="ci-sel" style="margin-bottom:0;flex:1">' + catOpts + '</select>';
      h += '</div>';
      h += '<label class="ci-lbl" style="font-size:11px">Precio compra UND (solo numero)</label>';
      h += '<input id="cg' + i + 'c' + n + '" class="ci-inp" style="margin-bottom:8px" type="number" step="0.01" min="0" inputmode="decimal" placeholder="Ej. 1.20"/>';
      h += '<label class="ci-lbl" style="font-size:11px">Precio venta UND mayorista (solo numero)</label>';
      h += '<input id="cg' + i + 'v' + n + '" class="ci-inp" style="margin-bottom:0" type="number" step="0.01" min="0" inputmode="decimal" placeholder="Ej. 1.50"/>';
      h += '</div>';
    }
    h += '<label class="ci-lbl mt8">\u00bfA QUE DISTRIBUIDORA LE COMPRA? <span class="req">*</span></label>';
    var dOpts = '<option value="">Seleccionar distribuidora</option>';
    for (var d = 0; d < distUser.length; d++) dOpts += '<option>' + distUser[d] + '</option>';
    dOpts += '<option>OTRA DISTRIBUIDORA</option>';
    h += '<select id="cgd' + i + '" class="ci-sel" style="margin-bottom:0">' + dOpts + '</select>';
  }

  else if (c.tipo === 'calidad') {
    h += '<label class="ci-lbl">\u00bfA QUE PRODUCTO HACE REFERENCIA? <span class="req">*</span></label>';
    h += '<select id="cca' + i + '" class="ci-sel">' + catOpts + '</select>';
    h += '<label class="ci-lbl mt8">DETALLA EL COMENTARIO DEL CLIENTE <span class="req">*</span></label>';
    h += '<textarea id="ccc' + i + '" class="ci-ta" rows="3" placeholder="DESCRIBE LO QUE DICE EL CLIENTE..."></textarea>';
  }

  else if (c.tipo === 'diststock') {
    h += '<p class="ci-lbl">\u00bfQUE PRODUCTOS DESEA EL PDV? (hasta 6) <span class="req">*</span></p>';
    h += '<p style="font-size:11px;color:var(--t3);margin-bottom:10px">Selecciona los SKUs e indica la cantidad de cada uno</p>';
    for (var n = 0; n < 6; n++) {
      h += '<div style="background:#fff;border:1.5px solid #93C5FD;border-radius:10px;padding:11px;margin-bottom:10px">';
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:9px">';
      h += '<div class="sku-num">' + (n + 1) + '</div>';
      h += '<select id="cds' + i + 'sku' + n + '" class="ci-sel" style="margin-bottom:0;flex:1">' + catOpts + '</select>';
      h += '</div>';
      h += '<label class="ci-lbl" style="font-size:11px">Cantidad deseada</label>';
      h += '<div class="qty-wrap" style="margin-bottom:0">';
      h += '<button class="qbtn" onclick="qMinus(\'cds' + i + 'qty' + n + '\')">\u2212</button>';
      h += '<input id="cds' + i + 'qty' + n + '" value="1" class="qty-inp" inputmode="numeric"/>';
      h += '<button class="qbtn" onclick="qPlus(\'cds' + i + 'qty' + n + '\')">+</button>';
      h += '<span class="qty-lbl">UNIDADES</span></div>';
      h += '</div>';
    }
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
    var lineas = [];
    for (var n = 0; n < 3; n++) {
      var sk = ge('cs' + i + 's' + n);
      if (!sk || !sk.value) continue;
      var nm = skuNombre(sk.value);
      var qt = ge('cs' + i + 'q' + n);
      var pr = ge('cs' + i + 'p' + n);
      var linea = nm;
      if (qt && qt.value) linea += ' (' + qt.value + ' UND';
      if (pr && pr.value) linea += (qt && qt.value ? ', ' : ' (') + 'S/ ' + fmt(pr.value);
      if (qt && qt.value || pr && pr.value) linea += ')';
      lineas.push(linea);
    }
    if (lineas.length) parts.push('SKUs: ' + lineas.join(' | '));
  }
  else if (c.tipo === 'precio') {
    el = ge('cpm' + i); if (el && el.value) parts.push('Marca: ' + el.value);
    el = ge('cpp' + i); if (el && el.value) parts.push('Precio: ' + el.value);
  }
  else if (c.tipo === 'margen') {
    var lineas2 = [];
    for (var n = 0; n < 3; n++) {
      var sk2 = ge('cg' + i + 's' + n);
      if (!sk2 || !sk2.value) continue;
      var nm2 = skuNombre(sk2.value);
      var pc = ge('cg' + i + 'c' + n);
      var pv = ge('cg' + i + 'v' + n);
      var linea2 = nm2;
      var extras = [];
      if (pc && pc.value) extras.push('compra S/ ' + fmt(pc.value));
      if (pv && pv.value) extras.push('venta S/ ' + fmt(pv.value));
      if (extras.length) linea2 += ' (' + extras.join(', ') + ')';
      lineas2.push(linea2);
    }
    if (lineas2.length) parts.push('SKUs: ' + lineas2.join(' | '));
    el = ge('cgd' + i); if (el && el.value) parts.push('Dist compra: ' + el.value);
  }
  else if (c.tipo === 'calidad') {
    el = ge('cca' + i); if (el && el.value) parts.push('Producto: ' + skuNombre(el.value));
    el = ge('ccc' + i); if (el && el.value) parts.push('Comentario: ' + el.value);
  }
  else if (c.tipo === 'diststock') {
    var lineas3 = [];
    for (var n = 0; n < 6; n++) {
      var sk3 = ge('cds' + i + 'sku' + n);
      if (!sk3 || !sk3.value) continue;
      var nm3 = skuNombre(sk3.value);
      var qt3 = ge('cds' + i + 'qty' + n);
      var linea3 = nm3;
      if (qt3 && qt3.value) linea3 += ' (' + qt3.value + ' UND)';
      lineas3.push(linea3);
    }
    if (lineas3.length) parts.push('Productos deseados: ' + lineas3.join(' | '));
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
    // Para cada SKU seleccionado, exigir precio venta numerico
    for (var n = 0; n < 3; n++) {
      var sk = ge('cs' + i + 's' + n);
      if (sk && sk.value) {
        var pr = ge('cs' + i + 'p' + n);
        var prNum = pr ? parseFloat(pr.value) : NaN;
        if (!pr || !pr.value || isNaN(prNum) || prNum <= 0) {
          alert('Ingresa un precio de venta valido (solo numero, mayor a 0) para el SKU ' + (n+1));
          if (pr) pr.focus();
          return false;
        }
      }
    }
  }
  if (c.tipo === 'precio') {
    el = ge('cpm' + i); if (!el || !el.value.trim()) { alert('Indica la marca competidora'); return false; }
    el = ge('cpp' + i); if (!el || !el.value.trim()) { alert('Indica a cuanto vende'); return false; }
  }
  if (c.tipo === 'margen') {
    el = ge('cg' + i + 's0'); if (!el || !el.value) { alert('Selecciona al menos 1 SKU en stock'); return false; }
    el = ge('cgd' + i);        if (!el || !el.value) { alert('Selecciona la distribuidora a la que le compra'); return false; }
    // Para cada SKU seleccionado, exigir compra y venta numericos
    for (var n = 0; n < 3; n++) {
      var sk2 = ge('cg' + i + 's' + n);
      if (sk2 && sk2.value) {
        var pc = ge('cg' + i + 'c' + n);
        var pcNum = pc ? parseFloat(pc.value) : NaN;
        if (!pc || !pc.value || isNaN(pcNum) || pcNum <= 0) {
          alert('Ingresa un precio de COMPRA valido (solo numero, mayor a 0) para el SKU ' + (n+1));
          if (pc) pc.focus();
          return false;
        }
        var pv = ge('cg' + i + 'v' + n);
        var pvNum = pv ? parseFloat(pv.value) : NaN;
        if (!pv || !pv.value || isNaN(pvNum) || pvNum <= 0) {
          alert('Ingresa un precio de VENTA valido (solo numero, mayor a 0) para el SKU ' + (n+1));
          if (pv) pv.focus();
          return false;
        }
      }
    }
  }
  if (c.tipo === 'calidad') {
    el = ge('cca' + i); if (!el || !el.value)        { alert('Selecciona el producto'); return false; }
    el = ge('ccc' + i); if (!el || !el.value.trim()) { alert('Detalla el comentario del cliente'); return false; }
  }
  if (c.tipo === 'diststock') {
    el = ge('cds' + i + 'sku0'); if (!el || !el.value) { alert('Selecciona al menos 1 producto que desea el PDV'); return false; }
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
    if (r.pendienteBorrar)  html += '<span class="tag tg-red">\u23f3 Solicitud de eliminacion enviada</span>';
    if (r.pendienteEdicion) html += '<span class="tag tg-blue">\u23f3 Edicion enviada al supervisor</span>';
    html += '</div>' + pedHtml + cauHtml;
    if (r.obs) html += '<p class="hist-obs">\ud83d\udcac ' + r.obs + '</p>';
    html += '</div><div class="hi-foot">';
    if (r.modo === 'si') {
      html += '<button class="btn-xs" style="background:#DBEAFE;color:#1E40AF" onclick="solicitarEditarRelevo(\'' + r.id + '\')">\u270f\ufe0f Solicitar editar</button>';
    }
    html += '<button class="btn-xs btn-del" onclick="solicitarBorrarRelevo(\'' + r.id + '\')">\ud83d\uddd1 Solicitar eliminar</button>';
    html += '</div></div>';
  }
  list.innerHTML = html;
}

// ─── BUSCAR SUPERVISOR A CARGO DE LA PROMOTORA ───────────
function supervisorDe(usuario) {
  if (typeof SUP_MAP === 'undefined') return '';
  for (var sup in SUP_MAP) {
    var lista = SUP_MAP[sup] || [];
    for (var i = 0; i < lista.length; i++) {
      if (lista[i] === usuario) return sup;
    }
  }
  return '';
}

// ─── SOLICITAR BORRAR (promotora pide aprobacion al supervisor) ───
function solicitarBorrarRelevo(idr) {
  var reg = null;
  for (var i = 0; i < APP_HIST.length; i++) {
    if (String(APP_HIST[i].id) === String(idr)) { reg = APP_HIST[i]; break; }
  }
  if (!reg) { alert('No se encontro el relevo'); return; }
  if (!confirm('\u00bfSolicitar eliminar este relevo?\n\nPDV: ' + reg.pdv + '\n\nTu supervisor debera aprobar esta solicitud antes de que se elimine del sistema.')) return;

  var sup = supervisorDe(APP_USER);
  if (!sup) { alert('No se encontro tu supervisor a cargo. Avisale antes de solicitar la eliminacion.'); return; }

  var antes = '';
  if (reg.modo === 'si') {
    antes = 'Pedido S/ ' + fmt(reg.total || 0);
    if (reg.pedido && reg.pedido.length) {
      antes += ' (' + reg.pedido.length + ' SKU' + (reg.pedido.length !== 1 ? 's' : '') + ')';
    }
  } else {
    antes = 'Sin pedido' + (reg.causalTxt ? ' \u2014 ' + reg.causalTxt : '');
  }

  gasPost({
    accion: 'SOLICITAR_MOD',
    usuario: APP_USER,
    supervisor: sup,
    tipo: 'BORRAR',
    id_relevo: String(idr),
    pdv: reg.pdv || '',
    fecha_relevo: reg.fecha || APP_FECHA,
    antes: antes,
    despues: 'ELIMINAR este relevo',
    payload: null
  }, function(ok) {
    if (ok) {
      // Marcar visualmente en local (sin borrar) que esta esperando aprobacion
      reg.pendienteBorrar = true;
      saveHist();
      renderHist();
      alert('\u2713 Solicitud enviada a tu supervisor (' + sup + ').\n\nEl relevo se eliminara cuando el supervisor la apruebe.');
    } else {
      alert('\u26a0\ufe0f No se pudo enviar la solicitud. Verifica tu conexion.');
    }
  });
}

// ─── SOLICITAR EDITAR (abre modal con SKUs editables) ───
var _editProm = null;

function solicitarEditarRelevo(idr) {
  var reg = null;
  for (var i = 0; i < APP_HIST.length; i++) {
    if (String(APP_HIST[i].id) === String(idr)) { reg = APP_HIST[i]; break; }
  }
  if (!reg) { alert('No se encontro el relevo'); return; }
  if (reg.modo !== 'si' || !reg.pedido || !reg.pedido.length) {
    alert('Solo se pueden editar relevos CON pedido.');
    return;
  }
  // Clonar items para edicion
  _editProm = {
    id: String(idr),
    pdv: reg.pdv,
    items: JSON.parse(JSON.stringify(reg.pedido))
  };
  renderEditPromModal();
  openModal('m-edit-prom');
}

function renderEditPromModal() {
  if (!_editProm) return;
  var tit = ge('editp-titulo');
  if (tit) tit.textContent = _editProm.pdv;
  var body = ge('editp-body');
  if (!body) return;
  var html = '';
  for (var i = 0; i < _editProm.items.length; i++) {
    var it = _editProm.items[i];
    html += '<div style="background:#F8FAFC;border-radius:10px;padding:11px;margin-bottom:9px">';
    html += '<p style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:8px">' + it.n + '</p>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
    html += '<div><label class="lbl" style="font-size:10px">Cantidad</label>';
    html += '<input id="editp-qty-' + i + '" class="inp" type="number" min="1" step="1" inputmode="numeric" value="' + it.qty + '" style="height:40px"/></div>';
    html += '<div><label class="lbl" style="font-size:10px">Precio UND S/</label>';
    html += '<input id="editp-price-' + i + '" class="inp" type="number" min="0" step="0.01" inputmode="decimal" value="' + it.price + '" style="height:40px"/></div>';
    html += '</div></div>';
  }
  body.innerHTML = html;
}

function enviarSolicitudEdicion() {
  if (!_editProm) return;
  var items = _editProm.items;
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    var qe = ge('editp-qty-' + i);
    var pe = ge('editp-price-' + i);
    var q  = qe ? parseInt(qe.value, 10) : items[i].qty;
    var p  = pe ? parseFloat(pe.value)  : items[i].price;
    if (isNaN(q) || q < 1) { alert('Cantidad invalida en SKU ' + (i+1)); return; }
    if (isNaN(p) || p < 0) { alert('Precio invalido en SKU ' + (i+1)); return; }
    items[i].qty = q;
    items[i].price = p;
    total += q * p;
  }
  var sup = supervisorDe(APP_USER);
  if (!sup) { alert('No se encontro tu supervisor a cargo. Avisale antes de solicitar la edicion.'); return; }

  // Buscar el relevo original para el "antes"
  var reg = null;
  for (var j = 0; j < APP_HIST.length; j++) {
    if (String(APP_HIST[j].id) === _editProm.id) { reg = APP_HIST[j]; break; }
  }
  var antes = reg ? 'S/ ' + fmt(reg.total || 0) + ' (' + (reg.pedido || []).length + ' SKUs)' : '';
  var despues = 'S/ ' + fmt(total) + ' (' + items.length + ' SKUs)';

  closeModal('m-edit-prom');
  if (!confirm('\u00bfEnviar solicitud de edicion a tu supervisor?\n\nNuevo total: S/ ' + fmt(total) + '\n\nTu supervisor (' + sup + ') debera aprobarla para que se actualice en el sistema.')) {
    return;
  }

  gasPost({
    accion: 'SOLICITAR_MOD',
    usuario: APP_USER,
    supervisor: sup,
    tipo: 'EDITAR',
    id_relevo: _editProm.id,
    pdv: _editProm.pdv,
    fecha_relevo: reg ? reg.fecha : APP_FECHA,
    antes: antes,
    despues: despues,
    payload: {items: items, total: total}
  }, function(ok) {
    if (ok) {
      // Marcar visualmente en local
      if (reg) {
        reg.pendienteEdicion = true;
        saveHist();
        renderHist();
      }
      alert('\u2713 Solicitud enviada a tu supervisor (' + sup + ').\n\nLos cambios se aplicaran cuando el supervisor apruebe la solicitud.');
    } else {
      alert('\u26a0\ufe0f No se pudo enviar la solicitud. Verifica tu conexion.');
    }
  });
  _editProm = null;
}

// ─── BORRAR LOCAL (solo se llama tras aprobacion del supervisor — uso interno) ───

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

  // Consolidar SKUs vendidos del dia: agrupar por EAN y sumar cantidades + total
  var skuMap = {};
  for (var i = 0; i < h.length; i++) {
    if (h[i].modo !== 'si' || !h[i].pedido) continue;
    for (var j = 0; j < h[i].pedido.length; j++) {
      var p = h[i].pedido[j];
      if (!skuMap[p.e]) skuMap[p.e] = {n: p.n, qty: 0, tot: 0};
      skuMap[p.e].qty += (p.qty || 0);
      skuMap[p.e].tot += (p.qty || 0) * (p.price || 0);
    }
  }
  var skuLines = [];
  for (var k in skuMap) {
    skuLines.push('\u2022 ' + skuMap[k].n + ' (' + skuMap[k].qty + ' UND) = S/ ' + fmt(skuMap[k].tot));
  }

  var lines = [];
  lines.push('\ud83d\udccb CIERRE DEL DIA \u2014 ' + fmtS(APP_FECHA));
  lines.push('\ud83d\udc64 ' + APP_USER);
  if (APP_DD) {
    lines.push('\ud83d\ude9a Distribuidora: ' + APP_DD.dist + ' \u00b7 ' + APP_DD.mesa);
    lines.push('\ud83d\udc68\u200d\ud83d\udcbc Vendedor: ' + APP_DD.vend);
  }
  lines.push('');
  lines.push('\ud83c\udfea PDVs visitados: ' + m.vis);
  lines.push('\u2705 Con venta: ' + m.cv);
  lines.push('\u274c Sin venta: ' + m.sv);
  lines.push('\ud83d\udcca Neto visitados: ' + m.neto);
  lines.push('\ud83d\udcc8 Efectividad: ' + m.ef + '%');
  lines.push('\ud83d\udcb0 Total S/: ' + fmt(m.tot));
  if (skuLines.length) {
    lines.push('');
    lines.push('\ud83d\udce6 SKUs vendidos:');
    for (var i = 0; i < skuLines.length; i++) lines.push(skuLines[i]);
  }
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
      porUser[u][idr] = {
        id: idr,
        pdv: f[8],
        hora: f[3],
        fecha: f[2],
        pedido: String(f[16]) === 'SI',
        total: 0,
        causal: f[25] || '',
        causalDet: f[26] || '',
        obs: f[27] || '',
        items: []   // SKUs vendidos
      };
    }
    if (String(f[16]) === 'SI') {
      porUser[u][idr].total = parseFloat(f[24]) || porUser[u][idr].total;
      porUser[u][idr].items.push({
        e: f[17], n: f[18], m: f[19],
        qty: parseInt(f[20], 10) || 0,
        price: parseFloat(f[22]) || 0
      });
    }
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
  _detUserActual = u; // para los handlers de borrar/editar
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
        html += '<div class="det-visit" style="flex-direction:column;align-items:stretch;gap:8px;padding:12px 14px">';
        html += '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px">';
        html += '<div style="flex:1;min-width:0"><p class="dv-nm">' + v.pdv + '</p><p class="dv-dt">' + (v.hora || '--:--') + '</p></div>';
        html += '<span class="tag ' + (v.pedido ? 'tg-green' : 'tg-amber') + '">' + (v.pedido ? 'S/ ' + fmt(v.total) : 'Sin pedido') + '</span>';
        html += '</div>';
        if (!v.pedido && v.causal) {
          html += '<p style="font-size:12px;color:var(--red);font-weight:500">\u26a0\ufe0f ' + v.causal + '</p>';
          if (v.causalDet) html += '<p style="font-size:11px;color:var(--t2);background:var(--amber-l);border-radius:6px;padding:6px 8px">' + v.causalDet + '</p>';
        }
        if (v.pedido && v.items && v.items.length) {
          html += '<div style="background:#F8FAFC;border-radius:8px;padding:8px 10px;font-size:11px;color:var(--t2)">';
          for (var j = 0; j < v.items.length; j++) {
            var it = v.items[j];
            html += '<p style="margin-bottom:2px">\u2022 ' + it.n + ' \u2014 ' + it.qty + ' UND \u00d7 S/ ' + fmt(it.price) + ' = S/ ' + fmt(it.qty * it.price) + '</p>';
          }
          html += '</div>';
        }
        if (v.obs) html += '<p style="font-size:11px;color:var(--t2);font-style:italic">\ud83d\udcac ' + v.obs + '</p>';
        html += '<div style="display:flex;gap:8px;margin-top:4px">';
        html += '<button class="btn-xs btn-del" onclick="supBorrarRelevo(\'' + v.id + '\',\'' + u + '\')">\ud83d\uddd1 Eliminar</button>';
        html += '<button class="btn-xs" style="background:#DBEAFE;color:#1E40AF" onclick="supEditarRelevo(\'' + v.id + '\',\'' + u + '\')">\u270f\ufe0f Editar precio/cantidad</button>';
        html += '</div>';
        html += '</div>';
      }
      dv.innerHTML = html;
    }
  }
  G('s-sup-det');
}

var _detUserActual = '';

function supBorrarRelevo(idr, user) {
  if (!confirm('\u00bfBorrar este relevo de ' + user + '?\n\nEsto eliminara TODAS las filas de este relevo en el Google Sheets.\nEsta accion no se puede deshacer.')) return;
  // Borrar en Google Sheets via GAS
  gasPost({accion: 'BORRAR', id: String(idr)}, function(ok) {
    if (ok) {
      alert('\u2713 Relevo eliminado correctamente del Google Sheets');
      // Recargar datos del equipo
      cargarDataEquipo();
      // Refrescar la pantalla actual
      setTimeout(function() { showDet(user); }, 800);
    } else {
      alert('\u26a0\ufe0f No se pudo eliminar. Verifica tu conexion e intenta de nuevo.');
    }
  });
}

function supEditarRelevo(idr, user) {
  // Buscar la visita en _supData
  var d = _supData[user];
  if (!d) return;
  var visita = null;
  for (var i = 0; i < d.visitas.length; i++) {
    if (String(d.visitas[i].id) === String(idr)) { visita = d.visitas[i]; break; }
  }
  if (!visita) { alert('No se encontro el relevo'); return; }
  if (!visita.pedido) {
    alert('Solo se pueden editar relevos CON pedido. Para "Sin pedido" usa Eliminar y la promotora lo registra de nuevo.');
    return;
  }
  // Abrir modal de edicion con sus SKUs
  _editandoRelevo = {id: idr, user: user, items: JSON.parse(JSON.stringify(visita.items || [])), pdv: visita.pdv};
  renderEditModal();
  openModal('m-edit-relevo');
}

var _editandoRelevo = null;

function renderEditModal() {
  if (!_editandoRelevo) return;
  var tit = ge('edit-titulo');
  if (tit) tit.textContent = _editandoRelevo.pdv + ' \u00b7 ' + _editandoRelevo.user;
  var body = ge('edit-body');
  if (!body) return;
  var html = '';
  if (!_editandoRelevo.items.length) {
    html = '<p style="text-align:center;color:var(--t3);padding:20px">Sin productos para editar</p>';
  } else {
    for (var i = 0; i < _editandoRelevo.items.length; i++) {
      var it = _editandoRelevo.items[i];
      html += '<div style="background:#F8FAFC;border-radius:10px;padding:11px;margin-bottom:9px">';
      html += '<p style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:8px">' + it.n + '</p>';
      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
      html += '<div><label class="lbl" style="font-size:10px">Cantidad</label>';
      html += '<input id="edit-qty-' + i + '" class="inp" type="number" min="1" step="1" inputmode="numeric" value="' + it.qty + '" style="height:40px"/></div>';
      html += '<div><label class="lbl" style="font-size:10px">Precio UND S/</label>';
      html += '<input id="edit-price-' + i + '" class="inp" type="number" min="0" step="0.01" inputmode="decimal" value="' + it.price + '" style="height:40px"/></div>';
      html += '</div></div>';
    }
  }
  body.innerHTML = html;
}

function guardarEdicionRelevo() {
  if (!_editandoRelevo) return;
  // Leer valores editados
  var items = _editandoRelevo.items;
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    var qe = ge('edit-qty-' + i);
    var pe = ge('edit-price-' + i);
    var q = qe ? parseInt(qe.value, 10) : items[i].qty;
    var p = pe ? parseFloat(pe.value) : items[i].price;
    if (isNaN(q) || q < 1) { alert('Cantidad invalida en SKU ' + (i+1)); return; }
    if (isNaN(p) || p < 0) { alert('Precio invalido en SKU ' + (i+1)); return; }
    items[i].qty = q;
    items[i].price = p;
    total += q * p;
  }
  // Enviar al GAS: accion ACTUALIZAR con los nuevos items
  var payload = {
    accion: 'ACTUALIZAR',
    id: String(_editandoRelevo.id),
    items: items,
    total: total
  };
  closeModal('m-edit-relevo');
  // Confirmar antes
  if (!confirm('Guardar cambios en Google Sheets?\n\nNuevo total: S/ ' + fmt(total))) return;
  gasPost(payload, function(ok) {
    if (ok) {
      alert('\u2713 Cambios guardados correctamente');
      var u = _editandoRelevo.user;
      _editandoRelevo = null;
      cargarDataEquipo();
      setTimeout(function() { showDet(u); }, 800);
    } else {
      alert('\u26a0\ufe0f No se pudieron guardar los cambios. Verifica tu conexion.');
    }
  });
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
        APRO.push({
          id:     String(m[0]),
          fecha:  m[1],
          user:   m[2],
          pdv:    m[3],
          fechaRel: m[4],
          antes:  m[5],
          despues: m[6],
          tipo:   String(m[8] || 'EDITAR').toUpperCase(),
          idRel:  String(m[10] || '')
        });
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
    var tipoLbl = a.tipo === 'BORRAR' ? '\ud83d\uddd1 Eliminar relevo' : '\u270f\ufe0f Editar relevo';
    var tipoTag = a.tipo === 'BORRAR' ? 'tg-red' : 'tg-blue';
    html += '<div class="apr-item">';
    html += '<div class="apr-top">';
    html += '<div class="apr-av">' + (a.user || '').slice(-2) + '</div>';
    html += '<div style="flex:1"><p class="apr-user">' + a.user + '</p><p class="apr-fecha">' + a.fecha + '</p></div>';
    html += '<span class="tag ' + tipoTag + '">' + tipoLbl + '</span>';
    html += '</div>';
    html += '<div class="apr-det">';
    html += '<p class="apr-pdv">' + a.pdv + '</p>';
    html += '<p style="font-size:11px;color:var(--t3);margin-bottom:6px">Fecha relevo: ' + a.fechaRel + '</p>';
    html += '<p class="apr-antes">Antes: ' + a.antes + '</p>';
    html += '<p class="apr-despues">Despues: ' + a.despues + '</p>';
    html += '</div>';
    html += '<div class="apr-btns">';
    html += '<button class="btn-xs btn-del" onclick="resolverMod(\'' + a.id + '\',\'RECHAZAR\')">\u2715 Rechazar</button>';
    html += '<button class="btn-xs btn-apr" onclick="resolverMod(\'' + a.id + '\',\'APROBAR\')">\u2713 Aprobar</button>';
    html += '</div></div>';
  }
  if (list) list.innerHTML = html;
}

function resolverMod(id, res) {
  var accionLbl = res === 'APROBAR' ? 'aprobar' : 'rechazar';
  if (!confirm('\u00bfDeseas ' + accionLbl + ' esta solicitud?')) return;
  gasPost({accion: 'RESOLVER_MOD', id_mod: id, resolucion: res}, function(ok) {
    if (ok) {
      alert(res === 'APROBAR' ? '\u2713 Solicitud aprobada. Los cambios ya se reflejaron en Google Sheets.' : '\u2715 Solicitud rechazada.');
      // Quitar de la lista local
      var n = [];
      for (var i = 0; i < APRO.length; i++) if (APRO[i].id !== id) n.push(APRO[i]);
      APRO = n;
      pintarApro();
      // Recargar datos del equipo para reflejar cambios
      if (typeof cargarDataEquipo === 'function') cargarDataEquipo();
    } else {
      alert('\u26a0\ufe0f No se pudo procesar. Verifica tu conexion.');
    }
  });
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
