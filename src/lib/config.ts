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
    text: "Soy un hombre de razón. Me gusta entender cómo funciona el mundo, buscarle explicación a todo, no creer en aquello que no se puede demostrar.\n\nY entonces llegaste tú.\n\nNo creo en los milagros, pero creo en ti. Entre billones de estrellas, en un universo inmenso que no tenía ninguna obligación de cruzarnos, encontrarte fue lo más cercano a lo infinito que he conocido. Contigo el tiempo se vuelve relativo: las horas vuelan y, aun así, las quiero eternas.\n\nEres la mujer más hermosa que la vida pudo regalarme, y lo digo sabiendo que tu belleza más grande no está en las fotos, sino en cómo cuidas, en cómo sueñas, en cómo me haces mejor sin siquiera proponértelo.\n\nTe elegí con la razón y te amo con todo lo demás. Del cielo al infinito —y de regreso— volvería a elegirte en cada universo posible.\n\nGracias por decir que sí.",
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

  // Fecha límite para confirmar asistencia
  rsvpDeadline: {
    iso: "2026-09-01",
    display: "1 de septiembre de 2026",
  },

  story: [
    {
      title: "Un café que lo cambió todo",
      date: "Marzo de 2022",
      text: "Un café. Eso fue todo lo que hizo falta. Lo que parecía una charla cualquiera se volvió de esas que uno no quiere terminar: las risas que llegan solas, las horas que se escapan sin permiso, las palabras que de pronto sobran. Ninguno lo supo esa tarde, pero ahí —entre dos tazas y mil historias— dos caminos que venían andando por separado decidieron volverse uno solo.",
      photo: "/photos/historia-1-conocimos.jpg",
    },
    {
      title: "20.000 kilómetros de nosotros",
      date: "Perú · Chile · Bolivia · Ecuador",
      text: "Una moto, dos cascos y el mundo por delante. Cruzamos Perú, Chile, Bolivia y Ecuador: veinte mil kilómetros de carretera, de amaneceres que no caben en una foto y de noches en las que el cielo fue nuestro techo. Aprendimos a leernos sin hablar, a reírnos de la lluvia, a sostenernos cuando el mapa se acababa. Y descubrimos algo que ya no se nos olvida: el destino importa mucho menos que la persona que va contigo.",
      photo: "/photos/historia-2-viaje.jpg",
    },
    {
      title: "El sí que esperábamos",
      date: "31 de diciembre de 2025",
      text: "El último día de un año que nos regaló de todo. Llegó a mi casa con mariachis, con el corazón en la mano y con la pregunta que yo llevaba soñando en silencio. Y el mundo entero se quedó callado. Entre lágrimas, música y un abrazo que no quería soltar, dije que sí. Así, justo cuando un año terminaba, empezaba para siempre el resto de nuestra vida.",
      photo: "/photos/historia-3-compromiso.jpg",
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
