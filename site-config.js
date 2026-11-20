
// ======================================================
// CONFIGURACIÓN DE EAGLES LEGENDS
// ======================================================

window.EAGLES_CONFIG = {

  // ====================================================
  // PORTAL WEB Y API
  // ====================================================

  // Sustituye esta dirección por la URL HTTPS que te
  // entregue Cloudflare Tunnel al ejecutar cloudflared.
  //
  // Ejemplo:
  // https://nombre-aleatorio.trycloudflare.com

  apiBaseUrl: "https://movers-ontario-grows-them.trycloudflare.com",

  // ====================================================
  // DISCORD
  // ====================================================

  discordInvite: "https://discord.gg/VqrrqckTxm",

  // ====================================================
  // REDES SOCIALES
  // ====================================================

  socials: [
    {
      name: "Instagram",
      handle: "@eagleslegendsff",
      url: "https://www.instagram.com/eagleslegendsff"
    },
    {
      name: "Discord",
      handle: "Únete al servidor",
      url: "https://discord.gg/VqrrqckTxm"
    }
  ],

  // ====================================================
  // ROSTER
  // ====================================================

  roster: [
    {
      nick: "EGL.Tide",
      roles: ["Granadero", "IGL", "Soporte"],
      photo: "assets/tide.png"
    },
    {
      nick: "EGL.MihaWK",
      roles: ["IGL", "Rusher", "Soporte"]
    },
    {
      nick: "EGL.Felipe",
      roles: ["Rusher L1", "Rusher L2"],
      photo: "assets/felipe.png"
    },
    {
      nick: "EGL.Betex",
      roles: ["Rusher L2", "Curandero", "Soporte"]
    }
  ],

  // ====================================================
  // EVENTOS
  // ====================================================

  // Ejemplo:
  // {
  //   date: "2026-12-05",
  //   time: "20:00",
  //   type: "SCRIM",
  //   title: "Scrim semanal",
  //   detail: "Discord"
  // }

  events: [
    {
      date: "2026-11-23",
      type: "TRYOUTS",
      title: "Pruebas Eagles Legends",
      signup: true,
      info: true,
      detail: "Hora por confirmar en el Discord. Inscripciones abiertas, hasta 45 inscritos. Inscríbete en el Discord."
    }
  ],

  // ====================================================
  // RESULTADOS COMPETITIVOS
  // ====================================================

  // win: true = victoria
  // win: false = derrota
  // score: marcador opcional

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

  // ====================================================
  // INFORMACIÓN DEL TORNEO
  // ====================================================

  // Esta información se muestra en /#agendainfo.
  // Los campos vacíos muestran "POR CONFIRMAR".

  tourney: {

    name: "PRUEBA EAGLE LEGEND 1",

    mode: "Solo (individual).",

    // Mapas del torneo.

    maps: [
      {
        name: "Bermuda",
        image: "assets/maps/bermuda.jpg"
      },
      {
        name: "Kalahari",
        image: "assets/maps/kalahari.jpg"
      },
      {
        name: "Purgatorio",
        image: "assets/maps/purgatorio.jpg"
      },
      {
        name: "Solara",
        image: "assets/maps/solara.jpg"
      }
    ],

    // Sistema de puntuación.

    ranking: [
      "Se puntúa por posición y por bajas."
    ],

    // Armas permitidas.

    weaponsAllowed: [
      "Todas, sin excepción"
    ],

    // Armas prohibidas.

    weaponsBanned: [
      "Ninguna"
    ],

    // Reglas.

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

    // Aspectos que serán evaluados.

    evaluate: [
      "Dominio de su rol.",
      "Precisión y control de armas.",
      "Movimiento y reflejos.",
      "Estrategia y toma de decisiones.",
      "Uso adecuado de habilidades.",
      "Adaptación a diferentes situaciones.",
      "Actitud y disciplina."
    ],

    // Motivos de descalificación.

    disqualify: [
      "Utilizar trampas o programas externos.",
      "Abandonar la prueba sin autorización.",
      "Incumplir las indicaciones del evaluador.",
      "Comportamiento irrespetuoso.",
      "No respetar las reglas establecidas."
    ],

    // Información adicional.

    note: "En EAGLES LEGENDS no buscamos solamente jugadores con buenas estadísticas o muchas kills. Buscamos jugadores que sepan desempeñar su rol, tengan habilidad, estrategia, disciplina y sepan demostrar su potencial.",

    // Lema.

    slogan: [
      "¡DEMUESTRA DE QUÉ ESTÁS HECHO!",
      "EAGLES LEGENDS — JUNTOS MÁS FUERTES."
    ]
  },

  // ====================================================
  // RANKING COMPETITIVO
  // ====================================================

  // Este ranking es informativo y manual.
  // No es todavía el ranking dinámico de la API.

  ranking: [
    {
      name: "EGL.Felipe",
      points: 828,
      kills: 147
    },
    {
      name: "EGL.Tide",
      points: 796,
      kills: 116
    },
    {
      name: "EGL.Betex",
      points: 680,
      kills: 108
    },
    {
      name: "EGL.MihaWK",
      points: 377,
      kills: 61
    },
    {
      name: "EGL.Hyumen",
      points: 255,
      kills: 56
    }
  ]

};
