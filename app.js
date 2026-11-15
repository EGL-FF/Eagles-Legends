(() => {
  const C = window.EAGLES_CONFIG || {}, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ok = u => /^https:\/\//.test(u || '');
  $$('[data-discord]').forEach(a => { if (ok(C.discordInvite)) a.href = C.discordInvite; });
  $('#social-links').innerHTML = (C.socials || []).filter(s => ok(s.url)).map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><b>${esc(s.name)}</b><span>${esc(s.handle)}</span><i>↗</i></a>`).join('');
  $('#roster-grid').innerHTML = (C.roster || []).map((p, i) => p.nick
    ? `<article class="player"><span class="num">0${i + 1}</span><div class="pname">${esc(p.nick)}</div><div class="roles">${p.roles.map(r => `<i>${esc(r)}</i>`).join('')}</div></article>`
    : `<a class="player open" href="${ok(C.discordInvite) ? esc(C.discordInvite) : '#unete'}" target="_blank" rel="noopener noreferrer"><span class="num">0${i + 1}</span><div class="pname">VACANTE</div><div class="roles"><i>Cupo abierto</i></div><em>POSTÚLATE ↗</em></a>`).join('');
  const ev = (C.events || []).filter(e => e && e.title && !isNaN(new Date(e.date + 'T00:00:00'))).sort((a, b) => a.date.localeCompare(b.date));
  const fmt = e => { const d = new Date(e.date + 'T00:00:00'); return [String(d.getDate()).padStart(2, '0'), d.toLocaleDateString('es-MX', { month: 'short' }).replace('.', '').toUpperCase()]; };
  $('#event-list').innerHTML = ev.length ? ev.map(e => { const [d, m] = fmt(e); return `<div class="ev"><div class="evd"><b>${d}</b>${esc(m)}</div><div><small>${esc(e.type || 'EVENTO')}${e.time ? ' · ' + esc(e.time) : ''}</small><h4>${esc(e.title)}</h4><p>${esc(e.detail || '')}</p></div></div>`; }).join('') : '<p class="empty">SIN ACTIVIDADES PROGRAMADAS.<br>Las convocatorias se publican en Discord.</p>';
  const nx = $('#next-match'); if (nx && ev[0]) { const [d, m] = fmt(ev[0]); nx.innerHTML = `<small>PRÓXIMA ACTIVIDAD</small><h3>${esc(ev[0].title)}</h3><p>${d} ${esc(m)}${ev[0].time ? ' · ' + esc(ev[0].time) : ''} · ${esc(ev[0].type || '')}</p>`; }
  const rk = (C.ranking || []).filter(r => r && r.name).sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 10);
  $('#rank-body').innerHTML = rk.length ? rk.map((r, i) => `<tr><td>${String(i + 1).padStart(2, '0')}</td><td>${esc(r.name)}</td><td>${+r.points || 0}</td><td>${+r.kills || 0}</td></tr>`).join('') : '<tr><td colspan="4" class="empty">EL RANKING SE PUBLICA CON LOS RESULTADOS OFICIALES.</td></tr>';
  $('#year').textContent = new Date().getFullYear();
  const t = $('.nav-toggle'), n = $('.main-nav');
  t.addEventListener('click', () => { const o = n.classList.toggle('open'); t.setAttribute('aria-expanded', o); });
  $$('.main-nav a').forEach(a => a.addEventListener('click', () => { n.classList.remove('open'); t.setAttribute('aria-expanded', false); }));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.rv').forEach(el => io.observe(el));
  $$('.bar').forEach(b => b.style.setProperty('--w', b.dataset.w + '%'));
})();
