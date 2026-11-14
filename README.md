# Eagles Legends — sitio web

Sitio estático responsive en español. No requiere framework ni servidor propio; puede publicarse en GitHub Pages, Netlify, Vercel o cualquier hosting estático.

## Personalización rápida

Edita `site-config.js`:

- `discordInvite`: invitación real del servidor.
- `applicationEmail`: correo público de reclutamiento/contacto. El formulario abre el cliente de correo del visitante (no envía directamente ni necesita backend).
- `instagram`, `tiktok`, `youtube`: enlaces completos de redes.
- `foundedYear`: año que aparece en la portada.
- `formEndpoint`: (opcional) URL de Formspree/Getform; el formulario envía directo sin abrir el correo.
- `rosterOfficial`: pon `true` cuando el roster sea el oficial.
- `events`: calendario de torneos/scrims (fecha `AAAA-MM-DD`). Vacío = muestra "Próximamente".
- `ranking`: tabla de puntos EL (nombre, puntos, kills). Vacío = muestra "Próximamente".
- `roster`: roles, nombres y descripciones que muestra la sección de roster. Sustituye los ejemplos por información oficial.

No coloques tokens de Discord, claves privadas ni credenciales en archivos públicos del sitio.

## Probar localmente

Abre `index.html` en el navegador. Para una prueba local más fiel, sirve la carpeta con cualquier servidor estático, por ejemplo `npx serve .` desde esta carpeta.

## Publicar

Sube el contenido completo de esta carpeta a un hosting estático. El archivo de entrada es `index.html`.

## Nota del formulario

El formulario funciona con `mailto:` cuando `applicationEmail` está configurado. Para recibir solicitudes sin depender del correo instalado en el navegador, conecta un backend o un servicio de formularios antes de publicarlo.

## GitHub Pages

El workflow `.github/workflows/pages.yml` publica el sitio al hacer push a `main`. Activa en el repo: Settings → Pages → Source: **GitHub Actions**.

No inventes datos: deja `events` y `ranking` vacíos hasta tener información oficial.
