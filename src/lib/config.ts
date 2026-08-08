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
    groomPhoto: "",
    bridePhoto: "",
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
    text: "No creo en los milagros, pero creo en ti. En este universo inmenso y perfecto en su razón, encontrarte fue lo más cercano a lo eterno; a tu lado el tiempo se vuelve relativo, y las horas que vuelan las quiero infinitas. Te elegí con la razón y te amo con todo lo demás: serás mi constante en cada universo posible.",
    signature: "Albert",
  },

  ceremony: {
    title: "Ceremonia religiosa",
    place: "Parroquia Sagrado Corazón",
    time: "4:00 PM",
    address: "Dirección de la parroquia",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Parroquia+Sagrado+Corazon",
    calendarUrl: "https://calendar.app.google/SbR5b7QVhkmUtroa9",
  },

  reception: {
    title: "Recepción",
    place: "Alma Jardín",
    time: "6:00 PM",
    address: "Dirección del salón",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Alma+Jardin",
    calendarUrl: "https://calendar.app.google/z1DmP9ze17mBiVAy5",
  },

  // Transmisión / reunión virtual para invitados a distancia
  meet: {
    // Reemplaza con el enlace real de tu Google Meet cuando lo tengas
    url: "https://meet.google.com/xxx-xxxx-xxx",
    time: "4:00 PM (hora de Colombia)",
    note: "¿No puedes acompañarnos en persona? Únete a la transmisión de la ceremonia por Google Meet y celebremos juntos, estés donde estés.",
  },

  dressCode: {
    label: "Elegante",
    notes: ["Evitar el color blanco", "Sin tacones muy delgados (es en jardín)"],
  },

  gifts: {
    intro: "Tu presencia es nuestro mejor regalo.",
    // Solo lluvia de sobres
    envelope: {
      title: "Lluvia de sobres",
      detail: "El día del evento",
      note: "Si deseas tener un detalle con nosotros, lo recibiremos con mucho cariño el día de la boda.",
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
      title: "Cómo nos conocimos",
      date: "Marzo 2022",
      text: "Todo comenzó con un café en marzo de 2022. Lo que parecía una conversación sencilla se convirtió en el inicio de una hermosa historia. Desde aquel primer encuentro, entre risas, largas conversaciones y momentos compartidos, nuestros caminos se fueron uniendo hasta llevarnos al lugar donde hoy estamos.",
      photo: "/photos/wine-sunset.jpeg",
    },
    {
      title: "Nuestro primer viaje",
      date: "20.000 km en moto",
      text: "Con una moto, maletas llenas y muchas ganas de descubrir el mundo, recorrimos cerca de 20.000 kilómetros por Perú, Chile, Bolivia y Ecuador. Entre paisajes inolvidables, retos y aventuras, aprendimos a conocernos desde una perspectiva diferente. Aquel recorrido nos regaló recuerdos imborrables y nos enseñó que, sin importar el destino, siempre vale la pena seguir adelante cuando se comparte el camino con alguien especial.",
      photo: "/photos/hero-couple.jpeg",
    },
    {
      title: "El compromiso",
      date: "31 de diciembre de 2025",
      text: "El 31 de diciembre de 2025, mientras terminaba un año lleno de bendiciones, llegó a mi casa acompañado de mariachis y con una sorpresa que jamás olvidaré. Con el corazón lleno de amor me pidió que compartiéramos el resto de nuestras vidas juntos, y entre lágrimas de felicidad, mi respuesta fue un emocionado e inolvidable «sí».",
      photo: "/photos/silhouette.jpeg",
    },
  ],

  gallery: [
    { src: "/photos/hero-couple.jpeg", alt: "Albert y Yuly en el Salar de Uyuni" },
    { src: "/photos/kiss-golden.jpeg", alt: "Beso al atardecer" },
    { src: "/photos/silhouette.jpeg", alt: "Silueta al atardecer" },
    { src: "/photos/wine-sunset.jpeg", alt: "Copa con el atardecer" },
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
