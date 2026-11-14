/* Personaliza estos datos antes de publicar la web. No pongas tokens ni claves secretas aquí. */
window.EAGLES_CONFIG = {
  discordInvite: "", // Ejemplo: https://discord.gg/tu-invitacion
  applicationEmail: "", // Correo público para recibir postulaciones
  instagram: "", // URL completa del perfil
  tiktok: "", // URL completa del perfil
  youtube: "", // URL completa del canal
  formEndpoint: "", // Opcional: URL de un servicio de formularios (Formspree, Getform, etc.). Si se llena, el formulario envía sin abrir el correo
  rosterOfficial: false, // Cambia a true cuando el roster de abajo sea el oficial (oculta la nota "roles ilustrativos")
  // Eventos reales. Ejemplo: { date: "2026-12-05", time: "20:00", type: "SCRIM", title: "Scrim semanal", detail: "Discord · Sala 1" }
  events: [],
  // Ranking real (se ordena por puntos). Ejemplo: { name: "Nick", points: 120, kills: 45 }
  ranking: [],
  roster: [
    { tag: "IGL", role: "IN-GAME LEADER", title: "LECTURA Y DIRECCIÓN", description: "Coordina rotaciones y decisiones." },
    { tag: "RSH", role: "RUSHER", title: "ENTRADA Y PRESIÓN", description: "Abre espacios y marca el ritmo." },
    { tag: "SUP", role: "SUPPORT", title: "COBERTURA Y APOYO", description: "Mantiene unida a la escuadra." },
    { tag: "FLEX", role: "FLEX", title: "ADAPTACIÓN", description: "Se adapta a lo que la partida exige." }
  ]
};
