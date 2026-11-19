(() => {
  const C = window.EAGLES_CONFIG || {}, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ok = u => /^https:\/\//.test(u || '');
  const img = u => /^(assets\/[\w\-./]+|https:\/\/\S+)$/.test(u || '');
  $$('[data-discord]').forEach(a => { if (ok(C.discordInvite)) a.href = C.discordInvite; });
  $('#social-links').innerHTML = (C.socials || []).filter(s => ok(s.url)).map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><b>${esc(s.name)}</b><span>${esc(s.handle)}</span><i>↗</i></a>`).join('');
  $('#roster-grid').innerHTML = (C.roster || []).map((p, i) => p.nick
    ? `<article class="player${img(p.photo) ? ' has-photo' : ''}">${img(p.photo) ? `<img class="pimg" src="${esc(p.photo)}" alt="" loading="lazy">` : ''}<span class="num">0${i + 1}</span><div class="pname">${esc(p.nick)}</div><div class="roles">${p.roles.map(r => `<i>${esc(r)}</i>`).join('')}</div></article>`
    : `<a class="player open" href="${ok(C.discordInvite) ? esc(C.discordInvite) : '#unete'}" target="_blank" rel="noopener noreferrer"><span class="num">0${i + 1}</span><div class="pname">VACANTE</div><div class="roles"><i>Cupo abierto</i></div><em>POSTÚLATE ↗</em></a>`).join('');
  const hoy = new Date().toLocaleDateString('en-CA'), ev = (C.events || []).filter(e => e && e.title && !isNaN(new Date(e.date + 'T00:00:00')) && e.date >= hoy).sort((a, b) => a.date.localeCompare(b.date));
  const link = ok(C.discordInvite) ? esc(C.discordInvite) : '#unete', btn = `<a class="btn solid sm" href="${link}" target="_blank" rel="noopener noreferrer">INSCRIBIRME</a>`, more = '<a class="btn line sm" href="#agendainfo" style="margin-right:10px">VER REGLAS</a>';
  const at = e => { const m = /(\d{1,2}):(\d{2})\s*([AP])M/i.exec(e.time || ''); return m ? new Date(`${e.date}T${String((+m[1] % 12) + (/p/i.test(m[3]) ? 12 : 0)).padStart(2, '0')}:${m[2]}:00`) : null; };
  const fmt = e => { const d = new Date(e.date + 'T00:00:00'); return [String(d.getDate()).padStart(2, '0'), d.toLocaleDateString('es-MX', { month: 'short' }).replace('.', '').toUpperCase()]; };
  $('#event-list').innerHTML = ev.length ? ev.map(e => { const [d, m] = fmt(e); return `<div class="ev"><div class="evd"><b>${d}</b>${esc(m)}</div><div><small>${esc(e.type || 'EVENTO')}${e.time ? ' · ' + esc(e.time) : ''}</small><h4>${esc(e.title)}</h4><p>${esc(e.detail || '')}</p>${e.info ? more : ''}${e.signup ? btn : ''}</div></div>`; }).join('') : '<p class="empty">SIN ACTIVIDADES PROGRAMADAS.<br>Las convocatorias se publican en Discord.</p>';
  const nx = $('#next-match'); if (nx && ev[0]) { const [d, m] = fmt(ev[0]); nx.innerHTML = `<small>PRÓXIMA ACTIVIDAD</small><h3>${esc(ev[0].title)}</h3><p>${d} ${esc(m)}${ev[0].time ? ' · ' + esc(ev[0].time) : ''} · ${esc(ev[0].type || '')}</p><div class="cd" id="cd"></div>${ev[0].info ? more : ''}${ev[0].signup ? btn : ''}`; }
  const cd = $('#cd'), t0 = ev[0] && at(ev[0]);
  if (cd && t0) { const tick = () => { const s = Math.floor((t0 - Date.now()) / 1000); if (s <= 0) { cd.textContent = '¡YA COMENZÓ!'; return; } const p = n => String(n).padStart(2, '0'); cd.innerHTML = `<span><b>${Math.floor(s / 86400)}</b>D</span><span><b>${p(Math.floor(s % 86400 / 3600))}</b>H</span><span><b>${p(Math.floor(s % 3600 / 60))}</b>M</span>`; setTimeout(tick, 30000); }; tick(); }
  const rk = (C.ranking || []).filter(r => r && r.name).sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 10);
  $('#rank-body').innerHTML = rk.length ? rk.map((r, i) => `<tr><td>${String(i + 1).padStart(2, '0')}</td><td>${esc(r.name)}</td><td>${+r.points || 0}</td><td>${+r.kills || 0}</td></tr>`).join('') : '<tr><td colspan="4" class="empty">EL RANKING SE PUBLICA CON LOS RESULTADOS OFICIALES.</td></tr>';
  const rs = (C.results || []).filter(r => r && r.opponent), w = rs.filter(r => r.win).length;
  $('#res-sum').innerHTML = rs.length ? `<div><b>${rs.length}</b>JUGADAS</div><div><b>${w}</b>VICTORIAS</div><div><b>${rs.length - w}</b>DERROTAS</div>` : '';
  const rv = {}; rs.forEach(r => { const o = rv[r.opponent] = rv[r.opponent] || [0, 0]; o[r.win ? 0 : 1]++; });
  $('#res-riv').innerHTML = Object.entries(rv).map(([n, [a, b]]) => `<span><b>${esc(n)}</b>${a}V · ${b}D</span>`).join('');
  $('#res-list').innerHTML = rs.length ? rs.map(r => `<div class="res ${r.win ? 'w' : 'l'}"><em>${r.win ? 'VICTORIA' : 'DERROTA'}</em><h4><small>VS</small> ${esc(r.opponent)}</h4><b>${esc(r.score || '')}</b></div>`).join('') : '<p class="empty">AÚN NO HAY RESULTADOS REGISTRADOS.</p>';
  const T = C.tourney || {}, tbd = '<span class="tbd">POR CONFIRMAR EN EL DISCORD</span>';
  const chips = (a, c) => (a || []).length ? `<div class="chips ${c}">${a.map(x => `<span>${esc(x)}</span>`).join('')}</div>` : tbd;
  const maps = a => (a || []).length ? `<div class="maps">${a.map(m => { const o = typeof m === 'string' ? { name: m } : m || {}; return `<figure class="map${img(o.image) ? ' has-img' : ''}">${img(o.image) ? `<img src="${esc(o.image)}" alt="" loading="lazy" onerror="this.remove()">` : ''}<figcaption>${esc(o.name)}</figcaption></figure>`; }).join('')}</div>` : tbd;
  const list = a => (a || []).length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : tbd;
  $('#t-name').textContent = T.name || '';
  const note = (T.note || (T.slogan || []).length) ? `${T.note ? `<p>${esc(T.note)}</p>` : ''}${(T.slogan || []).map(x => `<p class="slogan">${esc(x)}</p>`).join('')}` : tbd;
  $('#t-grid').innerHTML = [['MAPAS', maps(T.maps), 'wide'], ['MODALIDAD', T.mode ? `<p>${esc(T.mode)}</p>` : tbd], ['PUNTOS Y RANKING', list(T.ranking)], ['ARMAS PERMITIDAS', chips(T.weaponsAllowed, 'ok')], ['ARMAS PROHIBIDAS', chips(T.weaponsBanned, 'no')], ['REGLAS', list(T.rules), 'wide'], ['ASPECTOS A EVALUAR', list(T.evaluate)], ['MOTIVOS DE DESCALIFICACIÓN', list(T.disqualify), 'dq'], ['IMPORTANTE', note, 'wide']].map(([h, b, w]) => `<div class="tbox ${w || ''}"><h3>${h}</h3>${b}</div>`).join('');
  const gate = () => { const s = $('#agendainfo'), on = location.hash === '#agendainfo'; s.hidden = !on; document.body.classList.toggle('solo', on); document.title = on ? 'Info del torneo | Eagles Legends' : 'Eagles Legends | Free Fire Esports'; scrollTo(0, 0); };
  gate(); addEventListener('hashchange', gate);
  $('#year').textContent = new Date().getFullYear();
  const t = $('.nav-toggle'), n = $('.main-nav');
  t.addEventListener('click', () => { const o = n.classList.toggle('open'); t.setAttribute('aria-expanded', o); });
  $$('.main-nav a').forEach(a => a.addEventListener('click', () => { n.classList.remove('open'); t.setAttribute('aria-expanded', false); }));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.rv').forEach(el => io.observe(el));
  $$('.bar').forEach(b => b.style.setProperty('--w', b.dataset.w + '%'));
})();
