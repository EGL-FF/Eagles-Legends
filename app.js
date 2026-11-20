
(() => {
  const C = window.EAGLES_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

  const ok = u => /^https:\/\//.test(u || '');
  const img = u => /^(assets\/[\w\-./]+|https:\/\/\S+)$/.test(u || '');

  // ======================================================
  // API DEL PORTAL
  // ======================================================

  const API_BASE = String(C.apiBaseUrl || '').replace(/\/+$/, '');

  const API_CONFIGURED =
    /^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(API_BASE) &&
    !/TU-URL|example\.com/i.test(API_BASE);

  const API_UNAVAILABLE_MESSAGE =
    'La tienda de Eagles Legends no está disponible en este momento. Inténtalo más tarde.';

  let sessionToken = null;
  let portalLoading = false;

  function apiUrl(path) {
    return API_BASE + (path.startsWith('/') ? path : `/${path}`);
  }

  function unavailableError() {
    const error = new Error(API_UNAVAILABLE_MESSAGE);
    error.code = 'API_UNAVAILABLE';
    return error;
  }

  function isApiUnavailable(error) {
    return error?.code === 'API_UNAVAILABLE';
  }

  // ======================================================
  // COMPROBAR DISPONIBILIDAD DE LA API
  // ======================================================

  async function checkApiHealth() {
    if (!API_CONFIGURED) {
      throw new Error('La API no está configurada.');
    }

    let response;

    try {
      response = await fetch(apiUrl('/health'), {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        },
        cache: 'no-store',
        credentials: 'omit'
      });
    } catch {
      throw unavailableError();
    }

    if (!response.ok) {
      throw unavailableError();
    }

    const data = await response.json().catch(() => null);

    if (
      !data ||
      data.success !== true ||
      data.status !== 'online'
    ) {
      throw unavailableError();
    }

    return true;
  }

  // ======================================================
  // SOLICITUDES A LA API
  // ======================================================

  async function apiRequest(path, options = {}) {
    if (!API_CONFIGURED) {
      throw new Error('La API todavía no está configurada en site-config.js.');
    }

    const headers = {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.token
        ? { Authorization: `Bearer ${options.token}` }
        : {})
    };

    let response;

    try {
      response = await fetch(apiUrl(path), {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        cache: 'no-store',
        credentials: 'omit'
      });
    } catch {
      throw unavailableError();
    }

    const data = await response.json().catch(() => ({}));

    // Errores de servidor: API caída, Cloudflare 502, 503, 504, etc.
    if (response.status >= 500) {
      throw unavailableError();
    }

    if (!response.ok) {
      const message =
        data.message ||
        data.error ||
        `Error de conexión (${response.status}).`;

      if (response.status === 401) {
        sessionToken = null;
      }

      throw new Error(message);
    }

    return data;
  }

  function createRequestId() {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }

    return `EL-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  // ======================================================
  // ESTILOS DEL PORTAL
  // ======================================================

  function portalStyles() {
    if ($('#el-portal-styles')) return;

    const style = document.createElement('style');
    style.id = 'el-portal-styles';

    style.textContent = `
      #el-portal {
        width: 100%;
        color: inherit;
      }

      #el-portal .el-panel {
        background: rgba(255,255,255,.025);
        border: 1px solid rgba(255,255,255,.10);
        border-radius: 12px;
        padding: 18px;
        margin-top: 15px;
      }

      #el-portal .el-muted {
        opacity: .65;
        font-size: 12px;
        line-height: 1.6;
      }

      #el-portal .el-btn {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(255,255,255,.15);
        border-radius: 7px;
        padding: 10px 15px;
        background: rgba(255,255,255,.07);
        color: inherit;
        font: inherit;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .7px;
        text-decoration: none;
        cursor: pointer;
        transition: .2s;
      }

      #el-portal .el-btn:hover {
        border-color: #e58c36;
        background: rgba(229,140,54,.13);
      }

      #el-portal .el-btn.primary {
        background: #d98231;
        border-color: #d98231;
        color: #171717;
      }

      #el-portal .el-btn:disabled {
        opacity: .45;
        cursor: not-allowed;
      }

      #el-portal .el-status {
        padding: 11px 13px;
        margin: 12px 0;
        border-radius: 7px;
        background: rgba(255,255,255,.06);
        font-size: 12px;
        line-height: 1.5;
      }

      #el-portal .el-status.error {
        border: 1px solid rgba(255,90,90,.35);
      }

      #el-portal .el-status.success {
        border: 1px solid rgba(80,200,130,.35);
      }

      #el-portal .el-account {
        display: flex;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
      }

      #el-portal .el-avatar {
        width: 54px;
        height: 54px;
        object-fit: cover;
        border-radius: 50%;
        border: 2px solid rgba(229,140,54,.7);
        background: #222;
      }

      #el-portal .el-account-info {
        flex: 1;
        min-width: 150px;
      }

      #el-portal .el-account-info strong {
        display: block;
        font-size: 16px;
      }

      #el-portal .el-balances {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 10px;
        margin-top: 18px;
      }

      #el-portal .el-balance {
        background: rgba(255,255,255,.045);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 9px;
        padding: 14px;
      }

      #el-portal .el-balance small {
        display: block;
        font-size: 10px;
        opacity: .6;
        letter-spacing: 1px;
      }

      #el-portal .el-balance strong {
        display: block;
        margin-top: 7px;
        font-size: 23px;
      }

      #el-portal .el-section-title {
        margin: 24px 0 12px;
        font-size: 13px;
        letter-spacing: 1.5px;
      }

      #el-portal .el-shop-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(190px,1fr));
        gap: 12px;
      }

      #el-portal .el-item {
        overflow: hidden;
        background: rgba(255,255,255,.035);
        border: 1px solid rgba(255,255,255,.09);
        border-radius: 10px;
      }

      #el-portal .el-item-img {
        width: 100%;
        height: 145px;
        object-fit: cover;
        display: block;
        background: rgba(255,255,255,.04);
      }

      #el-portal .el-item-placeholder {
        height: 145px;
        display: grid;
        place-items: center;
        background: rgba(255,255,255,.035);
        font-size: 28px;
        opacity: .35;
      }

      #el-portal .el-item-content {
        padding: 13px;
      }

      #el-portal .el-item-content h4 {
        margin: 0 0 7px;
        font-size: 14px;
      }

      #el-portal .el-item-content p {
        min-height: 32px;
        margin: 0 0 12px;
        font-size: 11px;
        opacity: .65;
        line-height: 1.5;
      }

      #el-portal .el-price {
        display: block;
        margin-bottom: 12px;
        color: #eca34f;
        font-size: 17px;
        font-weight: 900;
      }

      #el-portal .el-pass-input {
        display: block;
        box-sizing: border-box;
        width: 100%;
        margin: 9px 0;
        padding: 10px;
        border: 1px solid rgba(255,255,255,.15);
        border-radius: 6px;
        background: rgba(0,0,0,.2);
        color: inherit;
        font: inherit;
        font-size: 11px;
      }

      #el-portal .el-orders {
        display: grid;
        gap: 9px;
      }

      #el-portal .el-order {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        padding: 13px;
        border: 1px solid rgba(255,255,255,.09);
        border-radius: 8px;
        background: rgba(255,255,255,.025);
      }

      #el-portal .el-order strong {
        display: block;
        font-size: 12px;
      }

      #el-portal .el-order small {
        display: block;
        margin-top: 5px;
        font-size: 10px;
        opacity: .55;
      }

      #el-portal .el-order-status {
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .7px;
        color: #eca34f;
      }

      #el-portal .el-empty {
        padding: 18px;
        text-align: center;
        opacity: .55;
        font-size: 12px;
        border: 1px dashed rgba(255,255,255,.13);
        border-radius: 8px;
      }

      #el-portal .el-maintenance {
        text-align: center;
        padding: 32px 18px;
      }

      #el-portal .el-maintenance-icon {
        font-size: 43px;
        margin-bottom: 15px;
      }

      #el-portal .el-maintenance-title {
        display: block;
        font-size: 16px;
        letter-spacing: .6px;
      }

      #el-portal .el-maintenance .el-status {
        margin: 18px 0;
      }

      #el-portal .el-maintenance .el-btn {
        min-width: 175px;
      }

      @media(max-width:520px) {
        #el-portal .el-balances {
          grid-template-columns: 1fr 1fr;
        }

        #el-portal .el-panel {
          padding: 13px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // ======================================================
  // MENSAJES DEL PORTAL
  // ======================================================

  function portalStatus(message, type = '') {
    const el = $('#el-portal-status');

    if (!el) return;

    el.className = `el-status ${type}`;
    el.textContent = message;
    el.hidden = !message;
  }

  function portalRoot() {
    return $('#el-portal-root');
  }

  // ======================================================
  // PANTALLA DE MANTENIMIENTO
  // ======================================================

  function showStoreUnavailable() {
    const root = portalRoot();

    if (!root) return;

    root.innerHTML = `
      <div class="el-panel el-maintenance">
        <div class="el-maintenance-icon">🦅</div>

        <strong class="el-maintenance-title">
          TIENDA TEMPORALMENTE NO DISPONIBLE
        </strong>

        <p class="el-muted" style="margin:14px 0">
          Estamos teniendo problemas de conexión con nuestros servidores.
          La tienda volverá a estar disponible cuando se restablezca el servicio.
        </p>

        <div class="el-status error">
          SERVICIO TEMPORALMENTE DESCONECTADO
        </div>

        <button id="el-retry" class="el-btn" type="button">
          VOLVER A INTENTAR
        </button>

        <p class="el-muted" style="margin-top:14px">
          Eagles Legends · Juntos más fuertes
        </p>
      </div>
    `;

    $('#el-retry')?.addEventListener('click', async () => {
      const button = $('#el-retry');

      if (!button || button.disabled) return;

      button.disabled = true;
      button.textContent = 'COMPROBANDO...';

      try {
        await checkApiHealth();

        if (sessionToken) {
          await loadPortalData();
        } else {
          showSignedOut('El servidor está disponible. Ya puedes iniciar sesión.');
        }

      } catch {
        showStoreUnavailable();
      }
    });
  }

  // ======================================================
  // INICIAR SESIÓN
  // ======================================================

  function showSignedOut(message = '') {
    const root = portalRoot();

    if (!root) return;

    root.innerHTML = `
      <div class="el-panel">
        <div class="el-account">
          <div class="el-account-info">
            <strong>PORTAL DE JUGADOR</strong>

            <div class="el-muted">
              Vincula tu cuenta de Discord para consultar tus monedas,
              acceder a la tienda y revisar tus pedidos.
            </div>
          </div>
        </div>

        ${message ? `<div class="el-status">${esc(message)}</div>` : ''}

        <div style="margin-top:17px">
          ${API_CONFIGURED
            ? `<a id="el-login" class="el-btn primary" href="${esc(apiUrl('/auth/discord'))}">
                 <span>VINCULAR CON DISCORD ↗</span>
               </a>`
            : `<button class="el-btn" disabled>API NO CONFIGURADA</button>
               <p class="el-muted">Configura apiBaseUrl en site-config.js con la URL HTTPS de Cloudflare.</p>`
          }
        </div>
      </div>

      <div id="el-portal-status" class="el-status" hidden></div>
    `;

    // Antes de enviar al jugador a Discord,
    // comprobar que la API se encuentre disponible.
    const loginButton = $('#el-login', root);

    loginButton?.addEventListener('click', async event => {
      event.preventDefault();

      if (loginButton.dataset.checking === '1') return;

      loginButton.dataset.checking = '1';
      loginButton.textContent = 'COMPROBANDO SERVIDOR...';

      try {
        await checkApiHealth();

        window.location.assign(apiUrl('/auth/discord'));

      } catch {
        showStoreUnavailable();
      }
    });
  }

  // ======================================================
  // RECURSOS E IMÁGENES
  // ======================================================

  function imageUrl(value) {
    if (ok(value)) return value;

    if (typeof value === 'string' && value.startsWith('/')) {
      return apiUrl(value);
    }

    return '';
  }

  function statusLabel(status) {
    const labels = {
      pending: 'PENDIENTE',
      approved: 'APROBADO',
      rejected: 'RECHAZADO',
      delivered: 'ENTREGADO'
    };

    return labels[status] || String(status || 'SIN ESTADO').toUpperCase();
  }

  function formatDate(value) {
    const d = new Date(value);

    if (isNaN(d.getTime())) return 'Fecha no disponible';

    return d.toLocaleString('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }

  function normalizeItems(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data?.items)) return data.data.items;

    return [];
  }

  function normalizeOrders(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.orders)) return data.orders;
    if (Array.isArray(data.data?.orders)) return data.data.orders;

    return [];
  }

  // ======================================================
  // MOSTRAR CUENTA Y TIENDA
  // ======================================================

  function renderDashboard(profile, economy, items, orders) {
    const root = portalRoot();

    if (!root) return;

    const displayName =
      profile.displayName ||
      profile.globalName ||
      profile.username ||
      'Jugador';

    const avatar = ok(profile.avatarUrl) ? profile.avatarUrl : '';

    const coins = Math.max(0, Number(economy.coins ?? 0) || 0);
    const points = Math.max(0, Number(economy.points ?? 0) || 0);

    const shopHTML = items.length
      ? items.map(item => {
          const itemId = String(item.id || '');
          const name = String(item.name || 'Artículo');
          const description = String(item.description || 'Artículo de Eagles Legends.');
          const cost = Math.max(0, Number(item.cost ?? item.price ?? 0) || 0);
          const stock = item.stock;

          const outOfStock =
            stock !== undefined &&
            stock !== null &&
            Number(stock) <= 0;

          const itemImage = imageUrl(item.imageUrl);

          return `
            <article class="el-item">
              ${itemImage
                ? `<img class="el-item-img" src="${esc(itemImage)}" alt="${esc(name)}" loading="lazy" onerror="this.style.display='none'">`
                : `<div class="el-item-placeholder">🛒</div>`
              }

              <div class="el-item-content">
                <h4>${esc(name)}</h4>

                <p>${esc(description)}</p>

                <strong class="el-price">
                  ${cost.toLocaleString('es-MX')} EL
                </strong>

                <div class="el-muted">
                  ${stock === undefined || stock === null
                    ? 'Disponibilidad sujeta a confirmación'
                    : outOfStock
                      ? 'AGOTADO'
                      : `${Number(stock)} disponibles`
                  }
                </div>

                <form class="el-buy-form"
                      data-item-id="${esc(itemId)}"
                      data-request-id="${esc(createRequestId())}">

                  <input
                    class="el-pass-input"
                    type="url"
                    placeholder="Enlace de Game Pass de Roblox"
                    aria-label="Enlace de Game Pass"
                    required
                    ${outOfStock ? 'disabled' : ''}
                  >

                  <button class="el-btn primary"
                          type="submit"
                          ${outOfStock ? 'disabled' : ''}>
                    SOLICITAR COMPRA
                  </button>
                </form>
              </div>
            </article>
          `;
        }).join('')
      : '<div class="el-empty">NO HAY ARTÍCULOS DISPONIBLES.</div>';

    const orderHTML = orders.length
      ? orders.map(order => `
          <div class="el-order">
            <div>
              <strong>${esc(order.itemName || 'Artículo')}</strong>

              <small>
                Pedido: ${esc(order.id || '—')}
                · ${esc(formatDate(order.createdAt))}
              </small>

              <small>
                ${Number(order.price || 0).toLocaleString('es-MX')} EL
              </small>

              ${order.note ? `<small>${esc(order.note)}</small>` : ''}
            </div>

            <span class="el-order-status">
              ${esc(statusLabel(order.status))}
            </span>
          </div>
        `).join('')
      : '<div class="el-empty">TODAVÍA NO TIENES PEDIDOS.</div>';

    root.innerHTML = `
      <div class="el-panel">
        <div class="el-account">
          ${avatar
            ? `<img class="el-avatar" src="${esc(avatar)}" alt="" referrerpolicy="no-referrer">`
            : `<div class="el-avatar" style="display:grid;place-items:center">🦅</div>`
          }

          <div class="el-account-info">
            <strong>${esc(displayName)}</strong>

            <div class="el-muted">
              ${profile.username
                ? `@${esc(profile.username)}`
                : 'Cuenta Discord vinculada'
              }
            </div>
          </div>

          <button id="el-logout" class="el-btn" type="button">
            CERRAR SESIÓN
          </button>
        </div>

        <div class="el-balances">
          <div class="el-balance">
            <small>MONEDAS EL</small>
            <strong>${coins.toLocaleString('es-MX')}</strong>
          </div>

          <div class="el-balance">
            <small>PUNTOS COMPETITIVOS</small>
            <strong>${points.toLocaleString('es-MX')}</strong>
          </div>
        </div>

        <p class="el-muted" style="margin-top:12px">
          Las monedas EL se utilizan en la tienda. Los puntos competitivos
          se utilizan para el ranking. Son saldos independientes.
        </p>
      </div>

      <h4 class="el-section-title">TIENDA EAGLES LEGENDS</h4>

      <div class="el-shop-grid">
        ${shopHTML}
      </div>

      <h4 class="el-section-title">MIS PEDIDOS</h4>

      <div class="el-orders">
        ${orderHTML}
      </div>

      <div id="el-portal-status" class="el-status" hidden></div>
    `;

    $('#el-logout')?.addEventListener('click', logoutPortal);

    $$('.el-buy-form').forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault();
        purchaseItem(form);
      });
    });
  }

  // ======================================================
  // CARGAR DATOS DEL PORTAL
  // ======================================================

  async function loadPortalData(message = '') {
    if (!sessionToken || portalLoading) return;

    portalLoading = true;

    const root = portalRoot();

    if (root) {
      root.innerHTML = `
        <div class="el-panel">
          <p class="el-muted">
            CARGANDO TU CUENTA DE EAGLES LEGENDS...
          </p>
        </div>
      `;
    }

    try {
      const token = sessionToken;

      const [meResult, shopResult, ordersResult] = await Promise.all([
        apiRequest('/api/me', { token }),
        apiRequest('/api/shop'),
        apiRequest('/api/orders', { token })
      ]);

      if (sessionToken !== token) return;

      const profile =
        meResult.user ||
        meResult.profile ||
        meResult;

      const economy =
        meResult.economy ||
        profile.economy ||
        {};

      renderDashboard(
        profile,
        economy,
        normalizeItems(shopResult),
        normalizeOrders(ordersResult)
      );

      if (message) {
        portalStatus(message, 'success');
      }

    } catch (error) {
      if (!sessionToken) {
        showSignedOut(
          'Tu sesión expiró. Vuelve a iniciar sesión.'
        );

      } else if (isApiUnavailable(error)) {
        showStoreUnavailable();

      } else {
        const currentRoot = portalRoot();

        if (currentRoot) {
          currentRoot.innerHTML = `
            <div class="el-panel">
              <strong>NO SE PUDO CARGAR EL PORTAL</strong>

              <p class="el-muted">
                ${esc(error.message)}
              </p>

              <button id="el-retry" class="el-btn" type="button">
                REINTENTAR
              </button>
            </div>
          `;

          $('#el-retry')?.addEventListener('click', () => {
            loadPortalData();
          });
        }
      }

    } finally {
      portalLoading = false;
    }
  }

  // ======================================================
  // COMPRAR ARTÍCULO
  // ======================================================

  async function purchaseItem(form) {
    if (!sessionToken) {
      showSignedOut('Inicia sesión para realizar compras.');
      return;
    }

    const itemId = form.dataset.itemId;
    const input = $('.el-pass-input', form);
    const button = $('button[type="submit"]', form);

    const gamePassUrl = input?.value.trim() || '';

    if (!/^https:\/\/(www\.)?roblox\.com\/game-pass\/\d+(\/|$)/i.test(gamePassUrl)) {
      portalStatus(
        'Introduce un enlace válido de Game Pass de Roblox.',
        'error'
      );

      input?.focus();
      return;
    }

    if (!itemId) {
      portalStatus('No se pudo identificar el artículo.', 'error');
      return;
    }

    // Se conserva el mismo identificador si se reintenta el envío.
    // Esto ayuda a evitar pedidos duplicados si se pierde una respuesta.

    const requestId = form.dataset.requestId || createRequestId();

    form.dataset.requestId = requestId;

    if (button) {
      button.disabled = true;
      button.textContent = 'PROCESANDO...';
    }

    try {
      const result = await apiRequest('/api/shop/buy', {
        method: 'POST',
        token: sessionToken,
        body: {
          itemId,
          gamePassUrl,
          requestId
        }
      });

      const message = result.notified === false
        ? 'Pedido registrado. El aviso al staff necesita revisión.'
        : '¡Pedido registrado! El staff revisará tu solicitud.';

      await loadPortalData(message);

    } catch (error) {
      if (isApiUnavailable(error)) {
        showStoreUnavailable();
        return;
      }

      portalStatus(
        error.message || 'No se pudo registrar el pedido.',
        'error'
      );

      if (button) {
        button.disabled = false;
        button.textContent = 'SOLICITAR COMPRA';
      }
    }
  }

  // ======================================================
  // CERRAR SESIÓN
  // ======================================================

  async function logoutPortal() {
    const token = sessionToken;

    // Se elimina el token del navegador aunque falle la petición.
    sessionToken = null;

    if (token && API_CONFIGURED) {
      try {
        await apiRequest('/auth/logout', {
          method: 'POST',
          token
        });

      } catch (error) {
        console.warn(
          'No se pudo confirmar el cierre de sesión:',
          error.message
        );
      }
    }

    showSignedOut('Has cerrado sesión.');
  }

  // ======================================================
  // INTERCAMBIAR TICKET DE DISCORD
  // ======================================================

  async function exchangePortalTicket(ticket) {
    if (!ticket || !API_CONFIGURED) return;

    try {
      const result = await apiRequest('/auth/exchange', {
        method: 'POST',
        body: { ticket }
      });

      if (!result.token) {
        throw new Error('El servidor no devolvió una sesión válida.');
      }

      sessionToken = result.token;

      await loadPortalData(
        '¡Discord vinculado correctamente!'
      );

    } catch (error) {
      sessionToken = null;

      if (isApiUnavailable(error)) {
        showStoreUnavailable();
      } else {
        showSignedOut(
          error.message || 'No se pudo vincular tu cuenta.'
        );
      }
    }
  }

  // ======================================================
  // INICIALIZAR PORTAL
  // ======================================================

  function initPortal() {
    portalStyles();

    if (!portalRoot()) return;

    if (!API_CONFIGURED) {
      showSignedOut();
      return;
    }

    if (sessionToken) {
      loadPortalData();
      return;
    }

    showSignedOut();

    // Comprueba automáticamente si la tienda está disponible.
    // Si la API devuelve un error 502 o no responde,
    // se muestra la pantalla de mantenimiento.

    checkApiHealth().catch(() => {
      showStoreUnavailable();
    });
  }

  // ======================================================
  // DISCORD Y REDES SOCIALES
  // ======================================================

  $$('[data-discord]').forEach(a => {
    if (ok(C.discordInvite)) a.href = C.discordInvite;
  });

  $('#social-links').innerHTML = (C.socials || [])
    .filter(s => ok(s.url))
    .map(s => `
      <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">
        <b>${esc(s.name)}</b>
        <span>${esc(s.handle)}</span>
        <i>↗</i>
      </a>
    `).join('');

  // ======================================================
  // ROSTER
  // ======================================================

  $('#roster-grid').innerHTML = (C.roster || []).map((p, i) => p.nick
    ? `
      <article class="player${img(p.photo) ? ' has-photo' : ''}">
        ${img(p.photo)
          ? `<img class="pimg" src="${esc(p.photo)}" alt="" loading="lazy">`
          : ''
        }

        <span class="num">0${i + 1}</span>

        <div class="pname">${esc(p.nick)}</div>

        <div class="roles">
          ${(p.roles || []).map(r => `<i>${esc(r)}</i>`).join('')}
        </div>
      </article>
    `
    : `
      <a class="player open"
         href="${ok(C.discordInvite) ? esc(C.discordInvite) : '#unete'}"
         target="_blank" rel="noopener noreferrer">

        <span class="num">0${i + 1}</span>

        <div class="pname">VACANTE</div>

        <div class="roles">
          <i>Cupo abierto</i>
        </div>

        <em>POSTÚLATE ↗</em>
      </a>
    `
  ).join('');

  // ======================================================
  // EVENTOS
  // ======================================================

  const hoy = new Date().toLocaleDateString('en-CA');

  const ev = (C.events || [])
    .filter(e =>
      e &&
      e.title &&
      !isNaN(new Date(e.date + 'T00:00:00')) &&
      e.date >= hoy
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  const link = ok(C.discordInvite) ? esc(C.discordInvite) : '#unete';

  const btn = `
    <a class="btn solid sm"
       href="${link}"
       target="_blank"
       rel="noopener noreferrer">
      INSCRIBIRME
    </a>
  `;

  const more = `
    <a class="btn line sm"
       href="#agendainfo"
       style="margin-right:10px">
      VER REGLAS
    </a>
  `;

  const at = e => {
    const m = /(\d{1,2}):(\d{2})\s*([AP])M/i.exec(e.time || '');

    return m
      ? new Date(
          `${e.date}T${String(
            (+m[1] % 12) + (/p/i.test(m[3]) ? 12 : 0)
          ).padStart(2, '0')}:${m[2]}:00`
        )
      : null;
  };

  const fmt = e => {
    const d = new Date(e.date + 'T00:00:00');

    return [
      String(d.getDate()).padStart(2, '0'),
      d.toLocaleDateString('es-MX', { month: 'short' })
        .replace('.', '')
        .toUpperCase()
    ];
  };

  $('#event-list').innerHTML = ev.length
    ? ev.map(e => {
        const [d, m] = fmt(e);

        return `
          <div class="ev">
            <div class="evd">
              <b>${d}</b>${esc(m)}
            </div>

            <div>
              <small>
                ${esc(e.type || 'EVENTO')}${e.time ? ' · ' + esc(e.time) : ''}
              </small>

              <h4>${esc(e.title)}</h4>

              <p>${esc(e.detail || '')}</p>

              ${e.info ? more : ''}
              ${e.signup ? btn : ''}
            </div>
          </div>
        `;
      }).join('')
    : '<p class="empty">SIN ACTIVIDADES PROGRAMADAS.<br>Las convocatorias se publican en Discord.</p>';

  const nx = $('#next-match');

  if (nx && ev[0]) {
    const [d, m] = fmt(ev[0]);

    nx.innerHTML = `
      <small>PRÓXIMA ACTIVIDAD</small>

      <h3>${esc(ev[0].title)}</h3>

      <p>
        ${d} ${esc(m)}${ev[0].time ? ' · ' + esc(ev[0].time) : ''}
        · ${esc(ev[0].type || '')}
      </p>

      <div class="cd" id="cd"></div>

      ${ev[0].info ? more : ''}
      ${ev[0].signup ? btn : ''}
    `;
  }

  const cd = $('#cd');
  const t0 = ev[0] && at(ev[0]);

  if (cd && t0) {
    const tick = () => {
      const s = Math.floor((t0 - Date.now()) / 1000);

      if (s <= 0) {
        cd.textContent = '¡YA COMENZÓ!';
        return;
      }

      const p = n => String(n).padStart(2, '0');

      cd.innerHTML = `
        <span><b>${Math.floor(s / 86400)}</b>D</span>
        <span><b>${p(Math.floor(s % 86400 / 3600))}</b>H</span>
        <span><b>${p(Math.floor(s % 3600 / 60))}</b>M</span>
      `;

      setTimeout(tick, 30000);
    };

    tick();
  }

  // ======================================================
  // RANKING
  // ======================================================

  const rk = (C.ranking || [])
    .filter(r => r && r.name)
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 10);

  $('#rank-body').innerHTML = rk.length
    ? rk.map((r, i) => `
        <tr>
          <td>${String(i + 1).padStart(2, '0')}</td>
          <td>${esc(r.name)}</td>
          <td>${+r.points || 0}</td>
          <td>${+r.kills || 0}</td>
        </tr>
      `).join('')
    : `
      <tr>
        <td colspan="4" class="empty">
          EL RANKING SE PUBLICA CON LOS RESULTADOS OFICIALES.
        </td>
      </tr>
    `;

  // ======================================================
  // RESULTADOS
  // ======================================================

  const rs = (C.results || []).filter(r => r && r.opponent);
  const w = rs.filter(r => r.win).length;

  $('#res-sum').innerHTML = rs.length
    ? `
      <div><b>${rs.length}</b>JUGADAS</div>
      <div><b>${w}</b>VICTORIAS</div>
      <div><b>${rs.length - w}</b>DERROTAS</div>
    `
    : '';

  const rv = {};

  rs.forEach(r => {
    const o = rv[r.opponent] = rv[r.opponent] || [0, 0];
    o[r.win ? 0 : 1]++;
  });

  $('#res-riv').innerHTML = Object.entries(rv)
    .map(([n, [a, b]]) => `
      <span>
        <b>${esc(n)}</b>${a}V · ${b}D
      </span>
    `).join('');

  $('#res-list').innerHTML = rs.length
    ? rs.map(r => `
        <div class="res ${r.win ? 'w' : 'l'}">
          <em>${r.win ? 'VICTORIA' : 'DERROTA'}</em>
          <h4><small>VS</small> ${esc(r.opponent)}</h4>
          <b>${esc(r.score || '')}</b>
        </div>
      `).join('')
    : '<p class="empty">AÚN NO HAY RESULTADOS REGISTRADOS.</p>';

  // ======================================================
  // TORNEO
  // ======================================================

  const T = C.tourney || {};
  const tbd = '<span class="tbd">POR CONFIRMAR EN EL DISCORD</span>';

  const chips = (a, c) => (a || []).length
    ? `<div class="chips ${c}">${a.map(x => `<span>${esc(x)}</span>`).join('')}</div>`
    : tbd;

  const maps = a => (a || []).length
    ? `
      <div class="maps">
        ${a.map(m => {
          const o = typeof m === 'string' ? { name: m } : m || {};

          return `
            <figure class="map${img(o.image) ? ' has-img' : ''}">
              ${img(o.image)
                ? `<img src="${esc(o.image)}" alt="" loading="lazy" onerror="this.remove()">`
                : ''
              }

              <figcaption>${esc(o.name)}</figcaption>
            </figure>
          `;
        }).join('')}
      </div>
    `
    : tbd;

  const list = a => (a || []).length
    ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`
    : tbd;

  const note = (T.note || (T.slogan || []).length)
    ? `
      ${T.note ? `<p>${esc(T.note)}</p>` : ''}
      ${(T.slogan || []).map(x => `<p class="slogan">${esc(x)}</p>`).join('')}
    `
    : tbd;

  const box = ([h, b, w]) => `
    <div class="tbox ${w || ''}">
      <h3>${h}</h3>
      ${b}
    </div>
  `;

  const tHTML = [
    ['MAPAS', maps(T.maps), 'wide'],
    ['MODALIDAD', T.mode ? `<p>${esc(T.mode)}</p>` : tbd],
    ['PUNTOS Y RANKING', list(T.ranking)],
    ['ARMAS PERMITIDAS', chips(T.weaponsAllowed, 'ok')],
    ['ARMAS PROHIBIDAS', chips(T.weaponsBanned, 'no')],
    ['REGLAS', list(T.rules), 'wide'],
    ['ASPECTOS A EVALUAR', list(T.evaluate)],
    ['MOTIVOS DE DESCALIFICACIÓN', list(T.disqualify), 'dq'],
    ['IMPORTANTE', note, 'wide']
  ].map(box).join('');

  // ======================================================
  // BOTS + PORTAL
  // ======================================================

  const bHTML = [
    [
      'EAGLES LEGENDS BOT',
      '<p>Bot de administración competitiva del servidor. Registra resultados con <b>/resultado</b>, suma puntos por posición y por bajas, y lleva las monedas EL.</p>'
    ],
    [
      'MONEDAS EL',
      '<p>Economía virtual del Discord: se ganan por resultados, se gastan en la tienda interna y alimentan el ranking. No son dinero real.</p>'
    ],
    [
      'EAGLE FUN BOT',
      '<p>Bot de entretenimiento y minijuegos. Sus puntos de actividad son una economía aparte de las monedas EL.</p>'
    ],
    [
      '/TRIVIA',
      '<p>Preguntas de Free Fire y esports. Ganas monedas EL según la dificultad:</p>' +
      chips(['Fácil · 3 EL', 'Medio · 5 EL', 'Difícil · 10 EL', 'Experto · 20 EL'], 'ok')
    ],
    [
      'CÓMO USARLOS',
      '<p>Todo se usa desde el Discord con comandos que empiezan con /. Entra al servidor y escribe / para ver cuáles hay.</p>',
      'wide'
    ],
    [
      'PORTAL DE JUGADOR',
      `
        <div id="el-portal">
          <div id="el-portal-root">
            <div class="el-panel">
              <p class="el-muted">
                Preparando el portal de Eagles Legends...
              </p>
            </div>
          </div>
        </div>
      `,
      'wide'
    ]
  ].map(box).join('');

  // ======================================================
  // NAVEGACIÓN DE PÁGINAS
  // ======================================================

  const pages = {
    '#agendainfo': [
      'INFO DEL TORNEO',
      T.name || '',
      tHTML
    ],

    '#bots': [
      'BOTS DE DISCORD',
      'EAGLES LEGENDS BOT · EAGLE FUN BOT',
      bHTML
    ]
  };

  const gate = () => {
    const rawHash = location.hash || '';
    const hashParts = rawHash.split('?');
    const pageKey = hashParts[0] || '';
    const params = new URLSearchParams(hashParts[1] || '');
    const p = pages[pageKey];

    $('#agendainfo').hidden = !p;

    document.body.classList.toggle('solo', !!p);

    if (p) {
      $('#pg-title').textContent = p[0];
      $('#t-name').textContent = p[1];
      $('#t-grid').innerHTML = p[2];
    }

    document.title = p
      ? p[0].charAt(0) + p[0].slice(1).toLowerCase() + ' | Eagles Legends'
      : 'Eagles Legends | Free Fire Esports';

    scrollTo(0, 0);

    if (pageKey === '#bots') {
      initPortal();

      // Ticket temporal entregado por el callback OAuth de Discord.
      const ticket = params.get('portal_ticket');

      if (ticket && !gate.ticketConsumed) {
        gate.ticketConsumed = true;

        // Retira el ticket de la dirección antes de intercambiarlo.
        history.replaceState(
          null,
          '',
          `${location.pathname}${location.search}#bots`
        );

        exchangePortalTicket(ticket);
      }
    }
  };

  gate();
  addEventListener('hashchange', gate);

  // ======================================================
  // FOOTER
  // ======================================================

  $('#year').textContent = new Date().getFullYear();

  // ======================================================
  // MENÚ MÓVIL
  // ======================================================

  const t = $('.nav-toggle');
  const n = $('.main-nav');

  t.addEventListener('click', () => {
    const o = n.classList.toggle('open');
    t.setAttribute('aria-expanded', o);
  });

  $$('.main-nav a').forEach(a => {
    a.addEventListener('click', () => {
      n.classList.remove('open');
      t.setAttribute('aria-expanded', false);
    });
  });

  // ======================================================
  // ANIMACIONES
  // ======================================================

  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .12 });

  $$('.rv').forEach(el => io.observe(el));

  $$('.bar').forEach(b => {
    b.style.setProperty('--w', b.dataset.w + '%');
  });

})();
