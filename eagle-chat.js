/* EAGLE · asistente de Eagles Legends (v2)
   Un solo archivo: inyecta su propio CSS y HTML. No toca styles.css ni app.js. */
(() => {
  const WORKER_URL = "https://eagle-bot.justin-antonio-mtz.workers.dev/";
  const MAX_HISTORIAL = 6;
  const DISCORD = "https://discord.gg/xZHnckGDdY";
  const BIENVENIDA =
    "Soy EAGLE, el asistente de Eagles Legends 🦅 Pregúntame por el reclutamiento, el roster, el Sistema EL o la comunidad. También puedes tocar una de las preguntas rápidas de abajo.";
  const SUGERENCIAS = [
    "¿Cómo me uno al equipo?",
    "¿Qué requisitos piden?",
    "¿Quiénes están en el roster?",
    "¿Qué es el Sistema EL?",
    "¿Cómo funciona el Ranking EL?",
    "¿Cuál es su Instagram?",
    "¿Cuántos torneos han ganado?",
    "¿Dónde está el Discord?",
  ];
  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const css = `
.eg-launch,.eg-panel,.eg-teaser{--eg-bg:#050506;--eg-surface:#101114;--eg-line:#2b2d33;--eg-silver:#e6e8ec;--eg-muted:#9a9ea8;--eg-red:#e11d2e;--eg-ok:#3ddc84;font-family:"Manrope",system-ui,sans-serif}
.eg-launch{position:fixed;right:18px;bottom:18px;z-index:9998;width:62px;height:62px;padding:0;border:1px solid var(--eg-silver);background:linear-gradient(180deg,#17181d,#050506);color:var(--eg-silver);cursor:pointer;display:grid;place-items:center;border-bottom:3px solid var(--eg-red);font:800 26px "Barlow Condensed",sans-serif;transition:transform .15s}
.eg-launch img{width:40px;height:40px;object-fit:contain}
.eg-launch:hover{transform:translateY(-2px)}
.eg-teaser{position:fixed;right:18px;bottom:92px;z-index:9998;display:none;align-items:stretch;background:var(--eg-silver);color:var(--eg-bg);max-width:240px;box-shadow:0 10px 30px rgba(0,0,0,.5);clip-path:polygon(0 0,100% 0,100% 100%,12px 100%,0 calc(100% - 12px));animation:eg-in .25s ease-out}
.eg-teaser.eg-show{display:flex}
.eg-teaser-go{flex:1;background:none;border:0;padding:11px 8px 11px 16px;font:700 13px/1.35 "Manrope",sans-serif;color:inherit;text-align:left;cursor:pointer}
.eg-teaser-x{background:none;border:0;padding:0 11px;font-size:18px;color:inherit;cursor:pointer;opacity:.6}
.eg-teaser-x:hover{opacity:1}
.eg-panel{position:fixed;right:18px;bottom:92px;z-index:9999;width:min(400px,calc(100vw - 24px));height:min(600px,calc(100dvh - 112px));display:flex;flex-direction:column;background:var(--eg-bg);border:1px solid var(--eg-line);color:var(--eg-silver);box-shadow:0 22px 60px rgba(0,0,0,.65);visibility:hidden;opacity:0;transform:translateY(12px) scale(.98);transform-origin:bottom right;transition:opacity .18s,transform .18s,visibility 0s .18s}
.eg-panel.eg-open{visibility:visible;opacity:1;transform:none;transition:opacity .18s,transform .18s}
.eg-head{position:relative;display:flex;align-items:center;gap:12px;padding:14px;background:linear-gradient(180deg,#17181d,#09090b);border-bottom:1px solid var(--eg-line)}
.eg-head::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:var(--eg-red)}
.eg-head .eg-av{width:42px;height:42px;border-color:var(--eg-silver)}
.eg-head .eg-av img{width:30px;height:30px}
.eg-title{flex:1;line-height:1.15}
.eg-title b{display:block;font:800 24px "Barlow Condensed",sans-serif;letter-spacing:.08em}
.eg-title span{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--eg-muted)}
.eg-dot{width:7px;height:7px;border-radius:50%;background:var(--eg-ok)}
.eg-ibtn{background:none;border:1px solid var(--eg-line);color:var(--eg-silver);width:34px;height:34px;cursor:pointer;font-size:17px;line-height:1;display:grid;place-items:center}
.eg-ibtn:hover{border-color:var(--eg-silver);background:var(--eg-surface)}
.eg-msgs{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth;background:repeating-linear-gradient(135deg,rgba(255,255,255,.018) 0 2px,transparent 2px 14px)}
.eg-row{display:flex;align-items:flex-end;gap:8px;animation:eg-in .22s ease-out}
.eg-row-user{justify-content:flex-end}
@keyframes eg-in{from{opacity:0;transform:translateY(6px)}}
.eg-av{flex:0 0 auto;width:28px;height:28px;display:grid;place-items:center;background:#000;border:1px solid var(--eg-line);font:800 14px "Barlow Condensed",sans-serif}
.eg-av img{width:20px;height:20px;object-fit:contain}
.eg-m{max-width:80%;padding:10px 13px;font-size:14px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}
.eg-bot{background:var(--eg-surface);border-left:3px solid var(--eg-red);clip-path:polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)}
.eg-user{background:var(--eg-silver);color:var(--eg-bg);font-weight:600;clip-path:polygon(0 0,100% 0,100% 100%,10px 100%,0 calc(100% - 10px))}
.eg-m a{color:inherit;font-weight:700;text-decoration:underline;text-underline-offset:2px}
.eg-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.eg-typing{display:flex;gap:5px;padding:14px 13px}
.eg-typing i{width:6px;height:6px;background:var(--eg-muted);border-radius:50%;animation:eg-b 1s infinite ease-in-out}
.eg-typing i:nth-child(2){animation-delay:.15s}.eg-typing i:nth-child(3){animation-delay:.3s}
@keyframes eg-b{0%,80%,100%{opacity:.25}40%{opacity:1}}
.eg-strip{display:flex;gap:8px;padding:10px 14px;overflow-x:auto;scrollbar-width:none;border-top:1px solid var(--eg-line);background:#08080a;scroll-snap-type:x proximity;-webkit-mask-image:linear-gradient(90deg,#000 90%,transparent);mask-image:linear-gradient(90deg,#000 90%,transparent)}
.eg-strip::-webkit-scrollbar{display:none}
.eg-strip.eg-busy{opacity:.45;pointer-events:none}
.eg-chip{flex:0 0 auto;scroll-snap-align:start;white-space:nowrap;background:var(--eg-surface);border:1px solid var(--eg-line);border-left:3px solid var(--eg-red);color:var(--eg-silver);padding:8px 12px;font:600 13px "Manrope",sans-serif;cursor:pointer}
.eg-chip:hover{border-color:var(--eg-silver);border-left-color:var(--eg-red);background:#1a1b20}
.eg-form{display:flex;border-top:1px solid var(--eg-line)}
.eg-input{flex:1;min-width:0;background:var(--eg-bg);border:0;color:var(--eg-silver);padding:15px 14px;font:14px "Manrope",sans-serif}
.eg-input::placeholder{color:var(--eg-muted)}
.eg-send{background:var(--eg-red);border:0;color:#fff;padding:0 20px;font:700 14px "Manrope",sans-serif;cursor:pointer;clip-path:polygon(12px 0,100% 0,100% 100%,0 100%)}
.eg-send:hover{background:#f0283a}
.eg-send:disabled{opacity:.5;cursor:default}
.eg-launch:focus-visible,.eg-ibtn:focus-visible,.eg-chip:focus-visible,.eg-send:focus-visible,.eg-input:focus-visible,.eg-teaser button:focus-visible{outline:2px solid var(--eg-silver);outline-offset:-2px}
@media (max-width:480px){.eg-panel{right:8px;left:8px;width:auto;bottom:84px;height:calc(100dvh - 100px)}.eg-launch{right:12px;bottom:12px}.eg-teaser{right:12px;bottom:84px}}
@media (prefers-reduced-motion:reduce){.eg-msgs{scroll-behavior:auto}.eg-row,.eg-teaser{animation:none}.eg-panel,.eg-panel.eg-open{transition:none;transform:none}.eg-launch{transition:none}.eg-typing i{animation:none;opacity:.7}}
`;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.innerHTML = `
<div class="eg-teaser" role="status">
  <button class="eg-teaser-go" type="button">¿Dudas del equipo? Pregúntale a EAGLE 🦅</button>
  <button class="eg-teaser-x" type="button" aria-label="Cerrar aviso">×</button>
</div>
<button class="eg-launch" type="button" aria-label="Abrir chat con EAGLE" aria-expanded="false" aria-controls="eg-panel"><img src="assets/favicon.png" alt=""></button>
<section class="eg-panel" id="eg-panel" role="dialog" aria-label="Chat con EAGLE">
  <div class="eg-head">
    <div class="eg-av"><img src="assets/favicon.png" alt=""></div>
    <div class="eg-title"><b>EAGLE</b><span><i class="eg-dot"></i>En línea · Asistente de Eagles Legends</span></div>
    <button class="eg-ibtn eg-reset" type="button" aria-label="Reiniciar conversación" title="Reiniciar conversación">↺</button>
    <button class="eg-ibtn eg-close" type="button" aria-label="Cerrar chat" title="Cerrar">×</button>
  </div>
  <div class="eg-msgs" aria-live="polite"></div>
  <div class="eg-strip" role="group" aria-label="Preguntas rápidas"></div>
  <form class="eg-form" autocomplete="off">
    <input class="eg-input" type="text" maxlength="500" placeholder="Escribe tu duda…" aria-label="Tu pregunta">
    <button class="eg-send" type="submit">Enviar</button>
  </form>
</section>`;
  document.body.appendChild(root);

  const $ = (s) => root.querySelector(s);
  const launch = $(".eg-launch");
  const panel = $(".eg-panel");
  const msgs = $(".eg-msgs");
  const strip = $(".eg-strip");
  const form = $(".eg-form");
  const input = $(".eg-input");
  const send = $(".eg-send");
  const teaser = $(".eg-teaser");

  // Si el logo no carga, se muestra una "E".
  root.querySelectorAll("img").forEach((img) =>
    img.addEventListener("error", () => {
      if (img.parentElement === launch) launch.textContent = "E";
      else img.remove();
    })
  );

  const historial = [];
  let ocupado = false;
  let sesion = 0; // cambia al reiniciar, para descartar respuestas viejas

  function avatar() {
    const a = document.createElement("div");
    a.className = "eg-av";
    const i = document.createElement("img");
    i.src = "assets/favicon.png";
    i.alt = "";
    i.addEventListener("error", () => { a.textContent = "E"; i.remove(); });
    a.appendChild(i);
    return a;
  }

  function linkify(nodo, texto) {
    const re = /https?:\/\/[^\s)]+/g;
    let ultimo = 0;
    let m;
    while ((m = re.exec(texto))) {
      const url = m[0].replace(/[.,;:!?]+$/, "");
      if (m.index > ultimo) nodo.appendChild(document.createTextNode(texto.slice(ultimo, m.index)));
      const a = document.createElement("a");
      a.href = url;
      a.textContent = url.replace(/^https?:\/\//, "");
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      nodo.appendChild(a);
      ultimo = m.index + url.length;
    }
    if (ultimo < texto.length) nodo.appendChild(document.createTextNode(texto.slice(ultimo)));
  }

  // Efecto de escritura; al terminar se vuelve a pintar el texto con enlaces.
  function escribir(vis, texto, fin) {
    if (reducido) { linkify(vis, texto); fin && fin(); return; }
    const nodo = document.createTextNode("");
    vis.appendChild(nodo);
    const paso = Math.max(1, Math.ceil(texto.length / 90));
    let i = 0;
    const t = setInterval(() => {
      i = Math.min(texto.length, i + paso);
      nodo.data = texto.slice(0, i);
      msgs.scrollTop = msgs.scrollHeight;
      if (i >= texto.length) {
        clearInterval(t);
        vis.textContent = "";
        linkify(vis, texto);
        fin && fin();
      }
    }, 16);
  }

  function agregar(rol, texto, animar, fin) {
    const limpio = texto.replace(/\*\*/g, "").replace(/^\s*\*\s+/gm, "• ");
    const fila = document.createElement("div");
    fila.className = "eg-row " + (rol === "user" ? "eg-row-user" : "eg-row-bot");
    if (rol !== "user") fila.appendChild(avatar());
    const d = document.createElement("div");
    d.className = "eg-m " + (rol === "user" ? "eg-user" : "eg-bot");
    const sr = document.createElement("span");
    sr.className = "eg-sr";
    sr.textContent = limpio;
    const vis = document.createElement("span");
    vis.setAttribute("aria-hidden", "true");
    d.append(sr, vis);
    fila.appendChild(d);
    msgs.appendChild(fila);
    msgs.scrollTop = msgs.scrollHeight;
    if (rol !== "user" && animar) escribir(vis, limpio, fin);
    else { linkify(vis, limpio); fin && fin(); }
    return fila;
  }

  function escribiendo() {
    const fila = document.createElement("div");
    fila.className = "eg-row eg-row-bot";
    fila.appendChild(avatar());
    const d = document.createElement("div");
    d.className = "eg-m eg-bot eg-typing";
    d.setAttribute("aria-label", "EAGLE está escribiendo");
    d.innerHTML = "<i></i><i></i><i></i>";
    fila.appendChild(d);
    msgs.appendChild(fila);
    msgs.scrollTop = msgs.scrollHeight;
    return fila;
  }

  function libre() {
    ocupado = false;
    send.disabled = false;
    strip.classList.remove("eg-busy");
    if (panel.classList.contains("eg-open")) input.focus();
  }

  async function enviar(texto) {
    texto = texto.trim().slice(0, 500);
    if (!texto || ocupado) return;
    ocupado = true;
    send.disabled = true;
    strip.classList.add("eg-busy");
    const s = sesion;

    agregar("user", texto);
    const previo = historial.slice(-MAX_HISTORIAL);
    historial.push({ role: "user", text: texto });
    const typing = escribiendo();

    let respuesta = "";
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 25000);
      const r = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta: texto, historial: previo }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!r.ok) throw new Error("HTTP " + r.status);
      const data = await r.json();
      respuesta = (data.respuesta || "").trim();
      if (!respuesta) throw new Error("vacía");
      if (s !== sesion) return;
      historial.push({ role: "assistant", text: respuesta });
    } catch (e) {
      if (s !== sesion) return;
      historial.pop(); // no guardamos la pregunta que falló
      respuesta = "No pude responder ahora mismo. Escríbele a la administración por Discord: " + DISCORD;
    }

    typing.remove();
    agregar("bot", respuesta, true, () => { if (s === sesion) libre(); });
  }

  function reiniciar() {
    sesion++;
    historial.length = 0;
    msgs.textContent = "";
    agregar("bot", BIENVENIDA, false);
    libre();
  }

  function ocultarAviso() {
    teaser.classList.remove("eg-show");
    try { sessionStorage.setItem("eg-aviso", "1"); } catch (e) {}
  }

  function abrir(v) {
    panel.classList.toggle("eg-open", v);
    launch.setAttribute("aria-expanded", String(v));
    if (v) { ocultarAviso(); input.focus(); }
    else launch.focus();
  }

  launch.addEventListener("click", () => abrir(!panel.classList.contains("eg-open")));
  $(".eg-close").addEventListener("click", () => abrir(false));
  $(".eg-reset").addEventListener("click", reiniciar);
  $(".eg-teaser-go").addEventListener("click", () => abrir(true));
  $(".eg-teaser-x").addEventListener("click", ocultarAviso);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("eg-open")) abrir(false);
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const t = input.value;
    input.value = "";
    enviar(t);
  });

  // Preguntas rápidas: barra fija sobre el cuadro de texto, siempre visible.
  SUGERENCIAS.forEach((s) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "eg-chip";
    b.textContent = s;
    b.addEventListener("click", () => enviar(s));
    strip.appendChild(b);
  });
  // Con el mouse, la rueda desplaza la barra de lado a lado.
  strip.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        strip.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    },
    { passive: false }
  );

  agregar("bot", BIENVENIDA, false);

  // Aviso único (una vez por visita) para invitar a usar el chat.
  let visto = false;
  try { visto = sessionStorage.getItem("eg-aviso") === "1"; } catch (e) {}
  if (!visto) {
    setTimeout(() => {
      if (!panel.classList.contains("eg-open")) teaser.classList.add("eg-show");
    }, 3500);
  }
})();
