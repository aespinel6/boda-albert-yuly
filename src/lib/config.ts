/**
 * Configuración central de la boda.
 * Edita AQUÍ todos los datos del evento — el resto de la app los lee de aquí.
 */

export const wedding = {
  couple: {
    bride: "Yuly Angélica Espinel",
    groom: "Albert Brayan Tobón",
    brideShort: "Yuly",
    groomShort: "Albert",
    hashtag: "#AlbertYYuly2026",
    instagram: {
      groom: { handle: "batpzurdo", url: "https://www.instagram.com/batpzurdo" },
      bride: {
        handle: "espinel_angelica_",
        url: "https://www.instagram.com/espinel_angelica_",
      },
    },
    // Sección "Los novios" — edita bios y agrega las fotos cuando las tengas.
    groomBio:
      "Siempre he sido una persona curiosa. Me gusta entender el mundo, aprender de cada experiencia y creer que las mejores aventuras comienzan cuando uno decide dar un paso más. Disfruto los nuevos caminos, las conversaciones que dejan huella y esos pequeños momentos que terminan convirtiéndose en recuerdos para toda la vida.\n\nPero el amor tiene una forma curiosa de simplificarlo todo. Descubrí que, entre todas las posibilidades que la vida podía ofrecerme, la decisión más importante ya estaba tomada: caminar cada día a su lado. Porque, al final, la única certeza que necesitaba era ella.",
    brideBio:
      "Me gustan las aventuras, la buena comida, las sonrisas sinceras y tener tranquilidad. Entre aprendizajes, sueños y una buena dosis de terquedad, he descubierto que las cosas más bonitas suceden cuando nos atrevemos a dar un paso más. Él es mi impulso para crecer y mi calma para permanecer.\n\nDios cruzó nuestros caminos con aquel café y, desde entonces, mi lugar favorito ha sido a su lado. Hoy, a un paso de convertirse en mi esposo, quiero seguir caminando de su mano, preparándole el café como le gusta, encontrando refugio en sus besos y construyendo juntos la vida con la que siempre hemos soñado.",
    // Deja vacío para mostrar una imagen de referencia. Cuando tengas las
    // fotos, ponlas en public/photos/ y escribe aquí la ruta, ej: "/photos/novio.jpg"
    groomPhoto: "/photos/novio.png",
    bridePhoto: "/photos/novia.png",
    // Encuadre del rostro dentro del marco vertical (object-position CSS)
    groomPhotoPosition: "38% 25%",
    bridePhotoPosition: "66% 25%",
  },

  // Fecha y hora del evento (zona horaria de Colombia, UTC-5)
  date: {
    iso: "2026-09-26T16:00:00-05:00",
    display: "26 de septiembre de 2026",
    dayName: "Sábado",
    short: "26.09.2026",
  },

  // Dedicatoria de Albert para Yuly — banner después de la portada (editable)
  dedication: {
    eyebrow: "Para ti, Yuly",
    text: [
      "Quizá el universo no tenga respuestas para todo. Quizá algunas cosas simplemente ocurren, sin pedir permiso, sin aviso y sin explicación.",
      "Y entre una eternidad de posibilidades, ocurrió que te encontré.",
      "Pudimos haber nacido en otros lugares, vivir otras vidas, tomar otros caminos, coincidir con otras personas. Pero, de alguna manera, el tiempo, el espacio y todos nuestros pequeños azares tuvieron que alinearse para que un día tú y yo termináramos aquí.",
      "Y desde que llegaste, hay una parte de mí que dejó de buscarle explicación a ciertas cosas.",
      "Porque hay miradas que detienen el tiempo. Hay abrazos que hacen que el mundo parezca más pequeño. Hay personas que llegan a tu vida y, sin hacer ruido, consiguen convertirse en hogar.",
      "Tú eres eso para mí.",
      "Eres la mujer que admiro cuando te miro, pero, sobre todo, la mujer que admiro cuando nadie está mirando. La que cuida, la que sueña, la que ríe, la que lucha, la que ama. La que, sin siquiera proponérselo, ha hecho de mí alguien mejor.",
      "Y quizá eso sea el amor: encontrar a alguien que no solo quieres para compartir la vida, sino alguien con quien la vida adquiere un significado distinto.",
      "Porque el tiempo contigo nunca parece suficiente. Las horas se vuelven instantes, los instantes se vuelven recuerdos, y los recuerdos terminan siendo esas pequeñas eternidades que uno guarda para siempre.",
      "Así que, si alguna vez existieron infinitos caminos posibles, me alegra profundamente haber llegado por el que terminaba en ti.",
      "Y si pudiera volver al principio, conociendo todo lo que sé hoy, volvería a encontrarte.",
      "En cualquier tiempo. En cualquier lugar. En cualquier universo.",
      "Te volvería a elegir. Una y mil veces.",
      "Porque entre todo lo inmenso que existe allá afuera, tú terminaste siendo mi infinito.",
      "Gracias por elegirme. Gracias por caminar conmigo. Y, sobre todo, gracias por decir que sí.",
    ].join("\n\n"),
    signature: "Albert",
  },

  ceremony: {
    title: "Ceremonia religiosa",
    place: "Parroquia Sagrado Corazón",
    time: "4:00 PM",
    address: "Transversal 2E, Cra. 6 #122, La Serena, Fusagasugá",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Parroquia+Sagrado+Coraz%C3%B3n%2C+Transversal+2E+Cra+6+%23122%2C+La+Serena%2C+Fusagasug%C3%A1%2C+Cundinamarca",
    calendarUrl: "https://calendar.app.google/SbR5b7QVhkmUtroa9",
  },

  reception: {
    title: "Recepción",
    place: "La Ramona Restaurante",
    time: "6:00 PM",
    address: "Av. Las Palmas #4-22, Fusagasugá",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=La+Ramona+Restaurante%2C+Av.+Las+Palmas+%234-22%2C+Fusagasug%C3%A1%2C+Cundinamarca",
    calendarUrl: "https://calendar.app.google/z1DmP9ze17mBiVAy5",
  },

  // Música de fondo de la invitación
  music: {
    src: "/audio/cancion.mp3",
    title: "Siempre Te Voy a Querer — Jhon Onofre",
  },

  // Transmisión / reunión virtual para invitados a distancia
  meet: {
    url: "https://meet.google.com/pdi-ocwg-ock",
    time: "4:00 – 6:00 PM (hora de Colombia)",
    note: "¿No puedes acompañarnos en persona? Únete a la transmisión de la ceremonia por Google Meet y celebremos juntos, estés donde estés.",
  },

  dressCode: {
    label: "Elegante",
    avoid: ["Color blanco", "Azul claro"],
    tip: "Zapato cómodo",
  },

  gifts: {
    intro: "Tu presencia es nuestro mejor regalo.",
    // Solo lluvia de sobres
    envelope: {
      title: "Lluvia de sobres",
      detail: "El día del evento",
      note: "Tu presencia es nuestro mejor regalo. Si además quieres tener un detalle con nosotros, lo recibiremos con todo el cariño el día de la boda.",
    },
  },

  // Precio estimado por persona (para el presupuesto de comida en el panel).
  // Editable desde /admin; estos son los valores por defecto (COP).
  pricing: {
    adult: 50000,
    child: 30000,
  },

  // ── Organización del salón ────────────────────────────────────
  // Mesas disponibles. Edita, agrega o quita libremente: el panel
  // muestra exactamente esta lista al asignar mesa a cada invitación.
  // `seats` es la capacidad por defecto; se puede cambiar desde el panel.
  tables: [
    { name: "Mesa principal", seats: 6 },
    { name: "Mesa 1", seats: 8 },
    { name: "Mesa 2", seats: 6 },
    { name: "Mesa 3", seats: 6 },
    { name: "Mesa 4", seats: 6 },
    { name: "Mesa 5", seats: 6 },
    { name: "Mesa 6", seats: 6 },
    { name: "Mesa 7", seats: 6 },
    { name: "Mesa 8", seats: 6 },
    { name: "Mesa 9", seats: 6 },
    { name: "Mesa 10", seats: 6 },
    { name: "Mesa 11", seats: 6 },
    { name: "Mesa 12", seats: 6 },
    { name: "Mesa 13", seats: 6 },
    { name: "Mesa 14", seats: 6 },
    { name: "Mesa 15", seats: 6 },
  ],

  /** Capacidades que se pueden elegir para cada mesa. */
  seatOptions: [6, 8, 10],

  /**
   * Mesa sin sillas para quienes nos acompañan en línea (y para "aparcar"
   * a quien todavía no quieras sentar). No ocupa puestos ni platos.
   */
  virtualTable: "Mesa virtual",

  // Tipos de plato. `price` se usa para el presupuesto; `default` marca
  // cuál se asigna automáticamente a cada adulto o niño nuevo.
  meals: [
    { id: "adulto", label: "Plato principal", price: 65000, for: "adult", default: true },
    { id: "a", label: "Plato A", price: 50000, for: "adult", default: false },
    { id: "b", label: "Plato B", price: 60000, for: "adult", default: false },
    { id: "nino", label: "Plato niño", price: 30000, for: "child", default: true },
  ],

  // Fecha límite para confirmar asistencia
  rsvpDeadline: {
    iso: "2026-09-18",
    display: "18 de septiembre de 2026",
    note: "Si no recibimos tu confirmación en esa fecha, entenderemos que no podrás acompañarnos.",
  },

  story: [
    {
      title: "Un café que lo cambió todo",
      date: "Marzo de 2022",
      text: "Un café. Eso fue todo lo que hizo falta. Lo que parecía una charla cualquiera se volvió de esas que uno no quiere terminar: las risas que llegan solas, las horas que se escapan sin permiso, las palabras que de pronto sobran. Ninguno lo supo esa tarde, pero ahí —entre dos tazas y mil historias— dos caminos que venían andando por separado decidieron volverse uno solo.",
      photos: [
        "/photos/c1-a.jpg",
        "/photos/c1-b.jpg",
        "/photos/c1-c.jpg",
        "/photos/c1-d.jpg",
      ],
    },
    {
      title: "20.000 kilómetros de nosotros",
      date: "Perú · Chile · Bolivia · Ecuador",
      text: "Una moto, dos cascos y el mundo por delante. Cruzamos Perú, Chile, Bolivia y Ecuador: veinte mil kilómetros de carretera, de amaneceres que no caben en una foto y de noches en las que el cielo fue nuestro techo. Aprendimos a leernos sin hablar, a reírnos de la lluvia, a sostenernos cuando el mapa se acababa. Y descubrimos algo que ya no se nos olvida: el destino importa mucho menos que la persona que va contigo.",
      photos: [
        "/photos/c2-a.jpg",
        "/photos/c2-b.jpg",
        "/photos/c2-c.jpg",
        "/photos/c2-d.jpg",
        "/photos/c2-e.jpg",
      ],
    },
    {
      title: "El sí que esperábamos",
      date: "31 de diciembre de 2025",
      text: "El último día de un año que nos regaló de todo. Llegó a mi casa con mariachis, con el corazón en la mano y con la pregunta que yo llevaba soñando en silencio. Y el mundo entero se quedó callado. Entre lágrimas, música y un abrazo que no quería soltar, dije que sí. Así, justo cuando un año terminaba, empezaba para siempre el resto de nuestra vida.",
      photos: [
        "/photos/c3-a.jpg",
        "/photos/c3-b.jpg",
        "/photos/c3-c.jpg",
        "/photos/c3-d.jpg",
      ],
    },
  ],

  gallery: [
    { src: "/photos/gal-brindis.jpg", alt: "Brindis al atardecer en el Salar de Uyuni" },
    { src: "/photos/gal-montana.jpg", alt: "Montaña de Colores, Perú" },
    { src: "/photos/gal-copas.jpg", alt: "Copas frente al atardecer" },
    { src: "/photos/gal-machupicchu.jpg", alt: "Machu Picchu" },
    { src: "/photos/gal-beso-salar.jpg", alt: "Beso sobre el espejo del Salar" },
    { src: "/photos/hero-couple.jpeg", alt: "Albert y Yuly en el Salar de Uyuni" },
  ],

  contact: {
    whatsapp: "573000000000", // número para dudas (formato internacional sin +)
  },

  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    title: "Albert & Yuly — Nos casamos",
    description:
      "Con inmensa alegría te invitamos a celebrar nuestro matrimonio. 26 de septiembre de 2026.",
  },
} as const;

export type WeddingConfig = typeof wedding;
