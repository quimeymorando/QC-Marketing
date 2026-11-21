// Textos de la home (español neutro). Fuente: docs/copies/home-es.md

export const nav = [
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'IA', href: '/ia' },
  { label: 'Nosotros', href: '/nosotros' },
];

export const zones = [
  {
    id: 'superficie',
    depth: 6,
    label: 'Superficie · 0–10 m',
    pain: ['Invertiste en anuncios. Llegaron visitas.', 'No vendiste nada.'],
    body: [
      'Un día te escriben cuatro personas y después nada en toda la semana. Y el reporte que te mandan no lo entiende nadie.',
      'Armamos campañas para que te escriba gente que puede y quiere comprar. Y te mostramos los números sin vueltas: cuánto invertiste, cuántos escribieron, cuántos compraron.',
    ],
    service: 'Anuncios en Instagram y Facebook',
  },
  {
    id: 'luz',
    depth: 110,
    label: 'Zona de luz · 10–200 m',
    pain: ['Pagaste una web y en un año', 'no te llegó ni una consulta.'],
    body: [
      'O peor: quien la hizo desapareció y no tienes ni las contraseñas.',
      'Hacemos webs que explican rápido qué haces, se ven bien en el celular y llevan a la gente a escribirte. El dominio, los accesos y las contraseñas quedan a tu nombre desde el primer día.',
    ],
    service: 'Webs y apps',
  },
  {
    id: 'crepuscular',
    depth: 600,
    label: 'Zona crepuscular · 200–1.000 m',
    pain: ['Tus consultas se enfrían', 'entre el WhatsApp y la planilla.'],
    body: [
      'Vas detrás de los pagos, de las citas, del recordatorio que olvidaste enviar. Probaste un CRM y terminó siendo un trabajo más.',
      'Conectamos lo que ya usas para que el seguimiento salga solo. Sabes quién escribió, en qué quedó y a quién hay que volver a contactar, sin cargar nada a mano.',
    ],
    service: 'Automatizaciones y CRM · GoHighLevel, Make, n8n',
  },
  {
    id: 'abismo',
    depth: 1500,
    label: 'Abismo · más de 1.000 m',
    pain: ['Te escriben a las once de la noche. Respondes a las diez de la mañana.', 'Ya le compraron a otro.'],
    body: [
      'Entre un cliente y el siguiente no alcanzas a responder, y no puedes estar en dos lugares a la vez.',
      'Entrenamos un asistente con la información de tu negocio. Responde por WhatsApp e Instagram a cualquier hora, distingue a quien está interesado de verdad y le agenda la reunión. Cuando la conversación necesita una persona, te la pasa a ti.',
    ],
    service: 'Inteligencia artificial aplicada',
  },
];

export const objections = [
  {
    q: '¿Te cobraron y desaparecieron?',
    a: 'Hablas siempre con nosotros dos. Nada de cuentas que rotan ni de "lo derivamos al área correspondiente".',
  },
  {
    q: '¿No terminas de entender qué te cobran?',
    a: 'Antes de empezar te decimos en dos líneas qué vamos a hacer, cuánto cuesta y para cuándo está.',
  },
  {
    q: '¿Ya probaste con otra agencia y no funcionó?',
    a: 'Empezamos por una parte pequeña, medimos si sirve y recién ahí sumamos lo siguiente.',
  },
  {
    q: '¿No tienes tiempo para aprender otra herramienta?',
    a: 'No hace falta. La armamos, te la explicamos una vez y el mantenimiento corre por nuestra cuenta.',
  },
  {
    q: '¿Crees que la inteligencia artificial no es para tu rubro?',
    a: 'Puede que no lo sea. Te lo decimos en la primera conversación, antes de que inviertas nada.',
  },
];

// Casos de EJEMPLO: se reemplazan por los trabajos reales cuando se conecte el portfolio.
export const work = [
  { slug: 'ejemplo-01', n: '01', name: 'Ecoturismo', state: 'Ejemplo', kind: 'Landing con calculadora', svc: 'Diseño · Desarrollo · Formularios', hue: 190 },
  { slug: 'ejemplo-02', n: '02', name: 'Orientación vocacional', state: 'Ejemplo', kind: 'Web y seguimiento automático', svc: 'Web · CRM · Automatización', hue: 160 },
  { slug: 'ejemplo-03', n: '03', name: 'Editorial', state: 'Ejemplo', kind: 'Asistente que precalifica', svc: 'IA · Base de conocimiento', hue: 205 },
  { slug: 'ejemplo-04', n: '04', name: 'Retiros', state: 'Ejemplo', kind: 'Web con reservas', svc: 'Diseño · Desarrollo · Integraciones', hue: 175 },
  { slug: 'ejemplo-05', n: '05', name: 'Marca personal', state: 'Ejemplo', kind: 'Sitio de una página', svc: 'Diseño · Desarrollo', hue: 220 },
];

// Nombres y precios a definir: por ahora los pases se llaman por su profundidad.
export const passes = [
  {
    n: '01',
    name: '10 m',
    line: 'Necesitas estar online ya, con algo que funcione.',
    depth: '10 m',
    items: ['Una página que cuenta qué haces', 'Lleva a WhatsApp o a tu agenda', 'Se ve bien en el celular', 'Dominio a tu nombre'],
    note: 'Para una primera impresión.',
    code: 'CS-01-10M',
  },
  {
    n: '02',
    name: '200 m',
    line: 'Tu negocio creció y la web quedó chica.',
    depth: '200 m',
    items: ['Web completa', 'Pensada página por página', 'Formulario conectado', 'Accesos y contraseñas a tu nombre'],
    note: 'Sin plantillas.',
    code: 'CS-02-200M',
  },
  {
    n: '03',
    name: '1.000 m',
    line: 'Te llegan consultas y no das abasto.',
    depth: '1.000 m',
    items: ['Todo lo de 200 m', 'Seguimiento automático', 'CRM armado y explicado', 'Nada que cargar a mano'],
    note: 'El seguimiento sale solo.',
    code: 'CS-03-1000M',
  },
  {
    n: '04',
    name: 'Abismo',
    line: 'Quieres que el negocio responda solo, a cualquier hora.',
    depth: '+1.000 m',
    items: ['Todo lo de 1.000 m', 'Asistente de IA en WhatsApp', 'También en Instagram', 'Te pasa la charla cuando hace falta'],
    note: 'Con una persona detrás.',
    code: 'CS-04-ABISMO',
  },
];

export const team = [
  {
    name: ['Quimi'],
    role: 'Sistemas · Automatizaciones · IA',
    bio: 'Antes de esto tuvo un negocio gastronómico grande. Sabe lo que es estar a cargo de todo y no tener tiempo para nada. Hoy construye los sistemas: automatizaciones, CRM e inteligencia artificial. Lo que busca con cada cliente es que trabaje menos y gane más.',
  },
  {
    name: ['Cori'],
    role: 'Diseño · Desarrollo web',
    bio: 'Diseña y construye las webs. Se ocupa de que se entienda en cinco segundos qué haces y de que, al terminar de leer, la gente quiera escribirte.',
  },
];
