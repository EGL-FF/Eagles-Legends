/* EAGLE · asistente de Eagles Legends
   Un solo archivo: inyecta su propio CSS y HTML. No toca styles.css ni app.js. */
(() => {
  const WORKER_URL = "https://eagle-bot.justin-antonio-mtz.workers.dev/";
  const MAX_HISTORIAL = 6;
  const DISCORD = "https://discord.gg/xZHnckGDdY";
  const BIENVENIDA =
    "Soy EAGLE, el asistente de Eagles Legends. Pregúntame por el reclutamiento, el roster o la comunidad.";
  const SUGERENCIAS = [
    "¿Cómo me uno al equipo?",
    "¿Qué requisitos piden?",
    "¿Quiénes están en el roster?",
    "¿Dónde está el Discord?",
  ];

  const css = `
.eg-launch,.eg-panel{--eg-bg:#050506;--eg-surface:#101114;--eg-line:#2b2d33;--eg-silver:#e6e8ec;--eg-muted:#9a9ea8;--eg-red:#e11d2e;font-family:"Manrope",system-ui,sans-serif}
.eg-launch{position:fixed;right:18px;bottom:18px;z-index:9998;width:60px;height:60px;padding:0;border:1px solid var(--eg-silver);background:var(--eg-bg);color:var(--eg-silver);cursor:pointer;display:grid;place-items:center;border-bottom:3px solid var(--eg-red);font:800 26px "Barlow Condensed",sans-serif}
.eg-launch img{width:38px;height:38px;object-fit:contain}
.eg-launch:hover{background:#15161a}
.eg-panel{position:fixed;right:18px;bottom:90px;z-index:9999;width:min(380px,calc(100vw - 24px));height:min(560px,calc(100dvh - 110px));display:none;flex-direction:column;background:var(--eg-bg);border:1px solid var(--eg-line);border-top:3px solid var(--eg-red);color:var(--eg-silver);box-shadow:0 18px 50px rgba(0,0,0,.6)}
.eg-panel.eg-open{display:flex}
.eg-head{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--eg-line)}
.eg-head img{width:30px;height:30px;object-fit:contain}
.eg-title{flex:1;line-height:1.1}
.eg-title b{display:block;font:800 22px "Barlow Condensed",sans-serif;letter-spacing:.08em}
.eg-title span{font-size:12px;color:var(--eg-muted)}
.eg-close{background:none;border:1px solid var(--eg-line);color:var(--eg-silver);width:32px;height:32px;cursor:pointer;font-size:18px;line-height:1}
.eg-close:hover{border-color:var(--eg-silver)}
.eg-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}
.eg-m{max-width:86%;padding:9px 12px;font-size:14px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}
.eg-bot{align-self:flex-start;background:var(--eg-surface);border-left:3px solid var(--eg-red)}
.eg-user{align-self:flex-end;background:var(--eg-silver);color:var(--eg-bg);font-weight:600}
.eg-m a{color:inherit;text-decoration:underline;text-underline-offset:2px}
.eg-chips{display:flex;flex-wrap:wrap;gap:8px;padding-top:2px}
.eg-chip{background:none;border:1px solid var(--eg-line);color:var(--eg-silver);padding:7px 10px;font:600 13px "Manrope",sans-serif;cursor:pointer;text-align:left}
.eg-chip:hover{border-color:var(--eg-silver);background:var(--eg-surface)}
.eg-typing{display:flex;gap:5px;padding:12px}
.eg-typing i{width:6px;height:6px;background:var(--eg-muted);border-radius:50%;animation:eg-b 1s infinite ease-in-out}
.eg-typing i:nth-child(2){animation-delay:.15s}.eg-typing i:nth-child(3){animation-delay:.3s}
@keyframes eg-b{0%,80%,100%{opacity:.25}40%{opacity:1}}
.eg-form{display:flex;border-top:1px solid var(--eg-line)}
.eg-input{flex:1;min-width:0;background:var(--eg-bg);border:0;color:var(--eg-silver);padding:14px;font:14px "Manrope",sans-serif}
.eg-input::placeholder{color:var(--eg-muted)}
.eg-send{background:var(--eg-red);border:0;color:#fff;padding:0 18px;font:700 14px "Manrope",sans-serif;cursor:pointer}
.eg-send:hover{background:#f0283a}
.eg-send:disabled{opacity:.5;cursor:default}
.eg-launch:focus-visible,.eg-close:focus-visible,.eg-chip:focus-visible,.eg-send:focus-visible,.eg-input:focus-visible{outline:2px solid var(--eg-silver);outline-offset:-2px}
@media (max-width:480px){.eg-panel{right:8px;left:8px;width:auto;bottom:84px}.eg-launch{right:12px;bottom:12px}}
@media (prefers-reduced-motion:reduce){.eg-msgs{scroll-behavior:auto}.eg-typing i{animation:none;opacity:.7}}
`;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.innerHTML = `
<button class="eg-launch" type="button" aria-label="Abrir chat con EAGLE" aria-expanded="false" aria-controls="eg-panel"><img src="assets/favicon.png" alt=""></button>
<section class="eg-panel" id="eg-panel" role="dialog" aria-label="Chat con EAGLE">
  <div class="eg-head">
    <img src="assets/favicon.png" alt="">
    <div class="eg-title"><b>EAGLE</b><span>Asistente de Eagles Legends</span></div>
    <button class="eg-close" type="button" aria-label="Cerrar chat">×</button>
  </div>
  <div class="eg-msgs" aria-live="polite"></div>
  <form class="eg-form" autocomplete="off">
    <input class="eg-input" type="text" maxlength="500" placeholder="Escribe tu duda…" aria-label="Tu pregunta">
    <button class="eg-send" type="submit">Enviar</button>
  </form>
</section>`;
  document.body.appendChild(root);

  const launch = root.querySelector(".eg-launch");
  const panel = root.querySelector(".eg-panel");
  const msgs = root.querySelector(".eg-msgs");
  const form = root.querySelector(".eg-form");
  const input = root.querySelector(".eg-input");
  const send = root.querySelector(".eg-send");

  // Si el logo no carga, mostramos una "E" en el botón.
  root.querySelectorAll("img").forEach((img) =>
    img.addEventListener("error", () => {
      if (img.parentElement === launch) launch.textContent = "E";
      else img.remove();
    })
  );

  const historial = [];
  let ocupado = false;
  let chips = null;

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

  function agregar(rol, texto) {
    const d = document.createElement("div");
    d.className = "eg-m " + (rol === "user" ? "eg-user" : "eg-bot");
    linkify(d, texto.replace(/\*\*/g, "").replace(/^\s*\*\s+/gm, "• "));
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function escribiendo() {
    const d = document.createElement("div");
    d.className = "eg-m eg-bot eg-typing";
    d.setAttribute("aria-label", "EAGLE está escribiendo");
    d.innerHTML = "<i></i><i></i><i></i>";
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  async function enviar(texto) {
    texto = texto.trim().slice(0, 500);
    if (!texto || ocupado) return;
    ocupado = true;
    send.disabled = true;
    if (chips) { chips.remove(); chips = null; }

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
      historial.push({ role: "assistant", text: respuesta });
    } catch (e) {
      historial.pop(); // no guardamos la pregunta que falló
      respuesta = "No pude responder ahora mismo. Escríbele a la administración por Discord: " + DISCORD;
    }

    typing.remove();
    agregar("bot", respuesta);
    ocupado = false;
    send.disabled = false;
    input.focus();
  }

  function abrir(v) {
    panel.classList.toggle("eg-open", v);
    launch.setAttribute("aria-expanded", String(v));
    if (v) input.focus();
    else launch.focus();
  }

  launch.addEventListener("click", () => abrir(!panel.classList.contains("eg-open")));
  root.querySelector(".eg-close").addEventListener("click", () => abrir(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("eg-open")) abrir(false);
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const t = input.value;
    input.value = "";
    enviar(t);
  });

  agregar("bot", BIENVENIDA);
  chips = document.createElement("div");
  chips.className = "eg-chips";
  SUGERENCIAS.forEach((s) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "eg-chip";
    b.textContent = s;
    b.addEventListener("click", () => enviar(s));
    chips.appendChild(b);
  });
  msgs.appendChild(chips);
})();
