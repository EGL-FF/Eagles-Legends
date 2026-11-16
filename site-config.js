// Configuración de Eagles Legends. Edita aquí; no inventes datos.
window.EAGLES_CONFIG = {
  discordInvite: "https://discord.gg/VqrrqckTxm",
  socials: [
    { name: "Instagram", handle: "@eagles_legends.gg", url: "https://www.instagram.com/eagles_legends.gg" },
    { name: "Discord", handle: "Únete al servidor", url: "https://discord.gg/VqrrqckTxm" }
  ],
  roster: [
    { nick: "EGL.Tide", roles: ["Granadero", "IGL", "Soporte"] },
    { nick: "EGL.MihaWK", roles: ["IGL", "Rusher", "Soporte"] },
    { nick: "EGL.Felipe", roles: ["Rusher L1", "Rusher L2"] },
    { nick: "EGL.Betex", roles: ["Rusher L2", "Curandero", "Soporte"] }
  ],
  // Ejemplo: { date: "2026-12-05", time: "20:00", type: "SCRIM", title: "Scrim semanal", detail: "Discord" }
  events: [
    { date: "2026-11-18", time: "7:00 PM", type: "TRYOUTS", title: "Pruebas Eagles Legends", signup: true, detail: "Inscripciones abiertas, hasta 45 inscritos. Inscríbete en el Discord." }
  ],
  // Resultados: win true/false; score es opcional, tal como se juega (ej. "8-2")
  results: [
    { opponent: "VORNAK CLAN", win: true, score: "8-2" },
    { opponent: "VORNAK CLAN", win: true, score: "8-7" },
    { opponent: "VORNAK CLAN", win: false, score: "6-8" },
    { opponent: "BTS.67777777", win: false, score: "2-8" },
    { opponent: "BTS.67777777", win: true, score: "7-0" },
    { opponent: "BTS.67777777", win: true, score: "7-5" },
    { opponent: "BTS.67777777", win: true, score: "7-4" },
    { opponent: "BTS.67777777", win: false, score: "8-2" },
    { opponent: "BNLECHITOS", win: false },
    { opponent: "BNLECHITOS", win: true },
    { opponent: "BNLECHITOS", win: false },
    { opponent: "BTS.67777777", win: true }
  ],
  // Info del torneo: solo se ve en /#agendainfo. Lo vacío muestra "POR CONFIRMAR".
  tourney: {
    name: "PRUEBA EAGLE LEGEND 1",
    mode: "Solo (individual).",
    // Mapas: texto o con imagen, ej. { name: "Bermuda", image: "assets/maps/bermuda.jpg" }
    maps: [{"Bermuda", image = "assets/maps/bermuda.jpg"} , "Kalahari", "Purgatorio", "Solara"],
    ranking: ["Se puntúa por posición y por bajas."],
    weaponsAllowed: [],
    weaponsBanned: [],
    rules: ["Prohibido jugar desde PC.", "Prohibido usar hacks.", "Respeto hacia todos los participantes."]
  },

  // Ejemplo: { name: "EGL.Nick", points: 120, kills: 45 }
  ranking: [
    { name: "EGL.Felipe", points: 828, kills: 147 },
    { name: "EGL.Tide", points: 796, kills: 116 },
    { name: "EGL.Betex", points: 680, kills: 108 },
    { name: "EGL.MihaWK", points: 377, kills: 61 },
    { name: "EGL.Hyumen", points: 255, kills: 56 }
  ]
};
