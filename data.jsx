// data.jsx — Static demo data (mirrors the Supabase schema in supabase-schema.md)
// Once Supabase is wired in, replace these with fetched data.

const STUDIO = {
  name: "El Ghetto",
  full: "El Ghetto Tattoo & Barber",
  tag: "TINTA · CUERO · BARRIO",
  address: "Tupac Yupanqui 9110, X5022 Córdoba",
  city: "Córdoba, Argentina",
  // Coordenadas exactas del estudio (Tupac Yupanqui 9110)
  lat: -31.322483,
  lng: -64.277989,
  // Embed oficial de Google Maps con el pin del negocio
  // (queda con el nombre "El Ghettoo Tattoo & Barber" y reseñas)
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1200!2d-64.27798913385833!3d-31.322482974644196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94329d002d4b7f3b%3A0x91fa3101ab610e21!2sEL%20GHETTOO%20TATTOO%20%26%20BARBER!5e1!3m2!1ses-419!2sar!4v1780312489880!5m2!1ses-419!2sar",
  phone: "3543 31-6916",
  phoneIntl: "+5493543316916",
  email: "hola@elghetto.tattoo",
  ig: ["elghetto.ttt", "celesteagostina.ttt"],
  hours: [
    { day: "Domingo",   blocks: [], closed: true },
    { day: "Lunes",     blocks: [{ from: "16:00", to: "22:00", capacity: 1 }] },
    { day: "Martes",    blocks: [{ from: "10:30", to: "13:30", capacity: 1 }, { from: "16:00", to: "22:00", capacity: 1 }] },
    { day: "Miércoles", blocks: [{ from: "10:30", to: "13:30", capacity: 1 }, { from: "16:00", to: "22:00", capacity: 1 }] },
    { day: "Jueves",    blocks: [{ from: "10:30", to: "13:30", capacity: 1 }, { from: "16:00", to: "22:00", capacity: 1 }] },
    { day: "Viernes",   blocks: [{ from: "10:30", to: "22:30", capacity: 1 }] },
    { day: "Sábado",    blocks: [{ from: "10:30", to: "22:30", capacity: 1 }] },
  ],
};

const STYLES = [
  { slug: "todos",            label: "Todos" },
  { slug: "black-and-grey",   label: "Black & Grey" },
  { slug: "realismo",         label: "Realismo" },
  { slug: "puntillismo",      label: "Puntillismo" },
  { slug: "fullcolor",        label: "Full Color" },
  { slug: "watercolor",       label: "Watercolor" },
  { slug: "tradicional",      label: "Tradicional" },
  { slug: "neo-tradicional",  label: "Neo Tradicional" },
  { slug: "fineline",         label: "Fine Line" },
];

// Gallery items — placeholder palettes so cards have visual variety until real photos are uploaded
const GALLERY = [
  { id: 1, style: "black-and-grey", title: "Lobo en el bosque",     hue: 0,   light: 12, size: "tall"  },
  { id: 2, style: "realismo",       title: "Retrato Frida",         hue: 30,  light: 18 },
  { id: 3, style: "fineline",       title: "Serpiente fina",        hue: 50,  light: 20 },
  { id: 4, style: "fullcolor",      title: "Tigre neón",            hue: 320, light: 18, size: "wide" },
  { id: 5, style: "puntillismo",    title: "Mandala punto",         hue: 0,   light: 14 },
  { id: 6, style: "watercolor",     title: "Colibrí splash",        hue: 200, light: 22 },
  { id: 7, style: "tradicional",    title: "Daga tradicional",      hue: 10,  light: 16 },
  { id: 8, style: "black-and-grey", title: "Rosa b&g",              hue: 0,   light: 10 },
  { id: 9, style: "neo-tradicional",title: "Pantera neo",           hue: 280, light: 18 },
  { id: 10, style: "fineline",      title: "Constelación",          hue: 40,  light: 14 },
  { id: 11, style: "realismo",      title: "Ojo realista",          hue: 0,   light: 8  },
  { id: 12, style: "fullcolor",     title: "Flor japonesa",         hue: 340, light: 22, size: "tall" },
  { id: 13, style: "puntillismo",   title: "Geométrico punto",      hue: 50,  light: 18 },
  { id: 14, style: "watercolor",    title: "Mariposa acuarela",     hue: 180, light: 24 },
  { id: 15, style: "tradicional",   title: "Calavera tradicional",  hue: 15,  light: 18, size: "wide" },
  { id: 16, style: "fineline",      title: "Flor minimal",          hue: 60,  light: 16 },
  { id: 17, style: "black-and-grey",title: "León b&g",              hue: 0,   light: 10 },
  { id: 18, style: "neo-tradicional",title: "Águila neo",           hue: 30,  light: 20 },
];

const TESTIMONIALS = [
  {
    name: "Nicolás M.", handle: "@nico_arg", rating: 5,
    body: "Le pedí un retrato de mi vieja a Celeste y me mató. Re fina la mano, no me dolió casi nada y quedó IDÉNTICO. Vuelvo seguro.",
  },
  {
    name: "Sofía R.", handle: "@sofiaa.rr", rating: 5,
    body: "Hace meses que la sigo en IG y por fin me tatué con ella. Buena onda, lugar impecable, el laburo en fineline es de otro nivel.",
  },
  {
    name: "Maxi G.", handle: "@maxi.gx", rating: 5,
    body: "Atención 10/10. Me asesoró un montón con el diseño antes de la sesión, súper profesional. El estudio está limpísimo.",
  },
  {
    name: "Tati L.", handle: "@tatilop", rating: 5,
    body: "Me hice un fullcolor enorme en el brazo, no podía creer cómo cicatrizó. Los colores quedaron vivos vivos. Recomendadísima.",
  },
  {
    name: "Bruno F.", handle: "@brunof", rating: 5,
    body: "Primer tatu y no podía elegir mejor lugar. Celeste me explicó todo el proceso, me cuidó un montón. Ya estoy pensando el segundo.",
  },
  {
    name: "Cami D.", handle: "@cami.dz", rating: 5,
    body: "Le llevé una idea media rara y me la mejoró un 200%. Black & grey espectacular, los detalles son una locura.",
  },
];

const FAQS = [];

window.STUDIO = STUDIO;
window.STYLES = STYLES;
window.TATTOO_STYLES = STYLES;
window.GALLERY = GALLERY;
window.TATTOO_GALLERY = GALLERY;
window.TESTIMONIALS = TESTIMONIALS;
window.FAQS = FAQS;

// ===== BARBER =====
const BARBER_STYLES = [
  { slug: "todos",   label: "Todos" },
  { slug: "fade",    label: "Fades" },
  { slug: "clasico", label: "Clásicos" },
  { slug: "barba",   label: "Barbas" },
  { slug: "moderno", label: "Modernos" },
  { slug: "ninos",   label: "Niños" },
];

const BARBER_GALLERY = [
  { id: 101, style: "fade",    title: "Mid fade limpio",      hue: 30,  light: 14 },
  { id: 102, style: "barba",   title: "Barba poblada",        hue: 20,  light: 12 },
  { id: 103, style: "clasico", title: "Side part clásico",    hue: 35,  light: 18 },
  { id: 104, style: "moderno", title: "Mullet moderno",       hue: 45,  light: 16 },
  { id: 105, style: "fade",    title: "Skin fade alto",       hue: 25,  light: 10 },
  { id: 106, style: "barba",   title: "Perfilado fino",       hue: 15,  light: 14 },
  { id: 107, style: "ninos",   title: "Corte niño con diseño",hue: 40,  light: 20 },
  { id: 108, style: "moderno", title: "Texturizado curly",    hue: 25,  light: 12 },
  { id: 109, style: "clasico", title: "Pompadour",            hue: 30,  light: 16 },
  { id: 110, style: "fade",    title: "Low fade + barba",     hue: 20,  light: 10 },
  { id: 111, style: "barba",   title: "Barba candado",        hue: 18,  light: 12 },
  { id: 112, style: "moderno", title: "Buzz cut con líneas",  hue: 50,  light: 14 },
];

window.BARBER_STYLES = BARBER_STYLES;
window.BARBER_GALLERY = BARBER_GALLERY;
