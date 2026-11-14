(() => {
  const config = window.EAGLES_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const navToggle = $('.nav-toggle');
  const nav = $('.main-nav');
  const toast = $('#toast');
  let toastTimer;

  $('#year').textContent = new Date().getFullYear();

  navToggle?.addEventListener('click', () => {
    const opened = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(opened));
    document.body.classList.toggle('menu-open', opened);
  });
  $$('.main-nav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }));

  const showToast = message => {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 4800);
  };

  const rosterGrid = $('#roster-grid');
  if (Array.isArray(config.roster) && rosterGrid) {
    rosterGrid.innerHTML = config.roster.slice(0, 8).map((person, index) => `
      <article class="role-card reveal visible">
        <div class="role-avatar role-${(index % 4) + 1}"><span>${escapeHtml(person.tag || 'EL')}</span><b>${String(index + 1).padStart(2, '0')}</b></div>
        <div class="role-info"><span>${escapeHtml(person.title || 'EAGLES LEGENDS')}</span><h3>${escapeHtml(person.role || 'JUGADOR')}</h3><p>${escapeHtml(person.description || '')}</p></div>
      </article>`).join('');
  }

  $('#roster-note')?.toggleAttribute('hidden', !!config.rosterOfficial);
  $$('[data-discord]').forEach(el => {
    if (typeof config.discordInvite === 'string' && config.discordInvite.trim()) {
      el.href = safeUrl(config.discordInvite).replace(/&amp;/g, '&');
      el.hidden = false;
    }
  });

  const eventList = $('#event-list');
  if (eventList) {
    const events = (Array.isArray(config.events) ? config.events : [])
      .filter(e => e && e.title && !isNaN(new Date(`${e.date}T00:00:00`)))
      .sort((x, y) => String(x.date).localeCompare(String(y.date)));
    eventList.innerHTML = events.length ? events.map(e => {
      const d = new Date(`${e.date}T00:00:00`);
      const day = String(d.getDate()).padStart(2, '0');
      const month = d.toLocaleDateString('es-MX', { month: 'short' }).replace('.', '').toUpperCase();
      return `<article class="event reveal visible"><div class="event-date"><b>${day}</b><span>${escapeHtml(month)}</span></div><div class="event-info"><span>${escapeHtml(e.type || 'EVENTO')}${e.time ? ' · ' + escapeHtml(e.time) : ''}</span><h3>${escapeHtml(e.title)}</h3><p>${escapeHtml(e.detail || '')}</p></div></article>`;
    }).join('') : '<p class="empty-state">PRÓXIMAMENTE · Aquí aparecerán los torneos y scrims confirmados.</p>';
  }

  const rankBody = $('#rank-body');
  if (rankBody) {
    const rows = (Array.isArray(config.ranking) ? config.ranking : [])
      .filter(r => r && r.name).sort((x, y) => (Number(y.points) || 0) - (Number(x.points) || 0)).slice(0, 10);
    rankBody.innerHTML = rows.length ? rows.map((r, i) => `<tr class="${i < 3 ? 'top' : ''}"><td>${String(i + 1).padStart(2, '0')}</td><td>${escapeHtml(r.name)}</td><td>${Number(r.points) || 0}</td><td>${Number(r.kills) || 0}</td></tr>`).join('')
      : '<tr><td colspan="4" class="empty-state">PRÓXIMAMENTE · El ranking se publicará con los resultados oficiales.</td></tr>';
  }

  const socialLinks = $('#social-links');
  const socialItems = [
    ['discordInvite', 'DISCORD', '↗'], ['instagram', 'INSTAGRAM', '↗'],
    ['tiktok', 'TIKTOK', '↗'], ['youtube', 'YOUTUBE', '↗']
  ].filter(([key]) => typeof config[key] === 'string' && config[key].trim());
  if (socialLinks) {
    if (socialItems.length) {
      socialLinks.innerHTML = socialItems.map(([key, label, arrow]) => `<a href="${safeUrl(config[key])}" target="_blank" rel="noopener noreferrer">${label} <span>${arrow}</span></a>`).join('');
    } else {
      socialLinks.innerHTML = '<span class="social-placeholder">AGREGA TUS REDES EN <code>site-config.js</code></span>';
    }
  }

  $('#application-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const subject = String(data.get('subject') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (data.get('website')) return; // honeypot anti-spam
    const sendBtn = $('.form-submit', form);
    if (config.formEndpoint) {
      sendBtn.disabled = true;
      fetch(config.formEndpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: data })
        .then(r => { if (!r.ok) throw new Error(); showToast('¡Mensaje enviado! Te responderemos pronto.'); form.reset(); })
        .catch(() => showToast('No se pudo enviar. Intenta de nuevo o escríbenos por Discord.'))
        .finally(() => { sendBtn.disabled = false; });
      return;
    }
    if (!config.applicationEmail) {
      showToast('El formulario aún no está disponible. Escríbenos por Discord.');
      return;
    }
    const body = `Nombre / Nick: ${name}\nMotivo: ${subject}\n\nMensaje:\n${message}`;
    const mailto = `mailto:${encodeURIComponent(config.applicationEmail)}?subject=${encodeURIComponent(`[Eagles Legends] ${subject}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    showToast('Se abrió tu aplicación de correo para enviar el mensaje.');
    form.reset();
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal:not(.visible)').forEach(el => observer.observe(el));

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }
  function safeUrl(value) {
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? escapeHtml(url.href) : '#';
    } catch { return '#'; }
  }
})();
