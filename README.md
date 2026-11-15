# Eagles Legends — sitio web

Sitio estático responsive en español. No requiere framework ni servidor propio; puede publicarse en GitHub Pages, Netlify, Vercel o cualquier hosting estático.

## Personalización rápida

Edita `site-config.js`:

- `discordInvite`: invitación real del servidor.
- `socials`: redes (nombre, usuario visible y URL `https://`).
- `roster`: jugadores con `nick`, `roles` y `photo` opcional (ej. `"assets/tide.png"`, PNG vertical sin fondo, ~600×800 px); un objeto con `nick: ""` muestra el cupo vacante.
- `events`: calendario de torneos/scrims (fecha `AAAA-MM-DD`). Vacío = "Sin actividades programadas".
- `ranking`: tabla de puntos EL (nombre, puntos, kills). Vacío = mensaje de ranking pendiente.

No coloques tokens de Discord, claves privadas ni credenciales en archivos públicos del sitio.

## Probar localmente

Abre `index.html` en el navegador. Para una prueba local más fiel, sirve la carpeta con cualquier servidor estático, por ejemplo `npx serve .` desde esta carpeta.

## Publicar

Sube el contenido completo de esta carpeta a un hosting estático. El archivo de entrada es `index.html`.

## GitHub Pages

El workflow `.github/workflows/pages.yml` publica el sitio al hacer push a `main`. Activa en el repo: Settings → Pages → Source: **GitHub Actions**.

No inventes datos: deja `events` y `ranking` vacíos hasta tener información oficial.
