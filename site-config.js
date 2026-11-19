// Configuración de Eagles Legends. Edita aquí; no inventes datos.
window.EAGLES_CONFIG = {
  discordInvite: "https://discord.gg/VqrrqckTxm",
  socials: [
    { name: "Instagram", handle: "@eagleslegendsff", url: "https://www.instagram.com/eagleslegendsff" },
    { name: "Discord", handle: "Únete al servidor", url: "https://discord.gg/VqrrqckTxm" }
  ],
  roster: [
    { nick: "EGL.Tide", roles: ["Granadero", "IGL", "Soporte"], photo: "assets/tide.png" },
    { nick: "EGL.MihaWK", roles: ["IGL", "Rusher", "Soporte"] },
    { nick: "EGL.Felipe", roles: ["Rusher L1", "Rusher L2"], photo: "assets/felipe.png" },
    { nick: "EGL.Betex", roles: ["Rusher L2", "Curandero", "Soporte"] }
  ],
  // Ejemplo: { date: "2026-12-05", time: "20:00", type: "SCRIM", title: "Scrim semanal", detail: "Discord" }
  // info: true muestra el botón "VER REGLAS" (abre /#agendainfo). Sin time no hay cuenta regresiva.
  events: [
    { date: "2026-11-23", type: "TRYOUTS", title: "Pruebas Eagles Legends", signup: true, info: true, detail: "Hora por confirmar en el Discord. Inscripciones abiertas, hasta 45 inscritos. Inscríbete en el Discord." }
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
    maps: [
      { name: "Bermuda", image: "assets/maps/bermuda.jpg" },
      { name: "Kalahari", image: "assets/maps/kalahari.jpg" },
      { name: "Purgatorio", image: "assets/maps/purgatorio.jpg" },
      { name: "Solara", image: "assets/maps/solara.jpg" }
    ],
    ranking: ["Se puntúa por posición y por bajas."],
    weaponsAllowed: ["Todas, sin excepción"],
    weaponsBanned: ["Ninguna"],
    rules: [
      "Las pruebas se realizarán en modalidad SOLO.",
      "Todas las armas están permitidas, sin excepción.",
      "Todos los personajes y habilidades están permitidos.",
      "Cada jugador deberá desempeñar correctamente su rol dentro de la partida.",
      "Se permite utilizar cualquier combinación de armas y habilidades.",
      "No se permite utilizar hacks, macros, bugs o programas externos.",
      "Se deberá respetar al evaluador y seguir sus indicaciones.",
      "No se permiten insultos, toxicidad ni comportamientos antideportivos.",
      "Queda prohibido recibir ayuda externa durante la prueba.",
      "El jugador deberá demostrar su verdadero nivel y jugar con seriedad.",
      "Prohibido jugar desde PC."
    ],
    evaluate: [
      "Dominio de su rol.",
      "Precisión y control de armas.",
      "Movimiento y reflejos.",
      "Estrategia y toma de decisiones.",
      "Uso adecuado de habilidades.",
      "Adaptación a diferentes situaciones.",
      "Actitud y disciplina."
    ],
    disqualify: [
      "Utilizar trampas o programas externos.",
      "Abandonar la prueba sin autorización.",
      "Incumplir las indicaciones del evaluador.",
      "Comportamiento irrespetuoso.",
      "No respetar las reglas establecidas."
    ],
    note: "En EAGLES LEGENDS no buscamos solamente jugadores con buenas estadísticas o muchas kills. Buscamos jugadores que sepan desempeñar su rol, tengan habilidad, estrategia, disciplina y sepan demostrar su potencial.",
    slogan: ["¡DEMUESTRA DE QUÉ ESTÁS HECHO!", "EAGLES LEGENDS — JUNTOS MÁS FUERTES."]
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
