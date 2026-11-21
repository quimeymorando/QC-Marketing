# Brief para construir la home de Ceto Studio

Este es el punto de partida para la sesión de construcción (con Fable). Reúne todo lo decidido. El detalle de cada tema está en los documentos enlazados.

## Qué es
Web de **Ceto Studio**: estudio de dos personas, Quimi (sistemas, automatizaciones, CRM, IA) y Cori (diseño y desarrollo web). Venden a negocios de servicios y profesionales.
- **Concepto:** inmersión en el océano. Al scrollear se baja de la superficie al abismo.
- **Referencia de calidad y estructura:** [twohalves.co](https://twohalves.co/).
  - Análisis visual: [referencias/01-home-twohalves.md](referencias/01-home-twohalves.md).
  - Análisis técnico: [referencias/02-home-twohalves-tecnico.md](referencias/02-home-twohalves-tecnico.md).

## Stack
- **Framework y hosting:** Astro sobre Cloudflare Workers, publicado con el plugin oficial de Cloudflare (cuenta conectada de Quimi).
- **Animación y scroll:** GSAP 3.15 (gratis, con todos sus plugins) + Lenis.
- **3D y efectos:** three.js, más shaders propios. Ver [diseno/recursos.md](diseno/recursos.md) para las licencias.
- **Formulario:** endpoint en el Worker que envía los datos a GHL. Va en la segunda vuelta.

## Navegación
- **Menú fijo:** Logo · Portfolio · Servicios · IA · Nosotros · botón de contacto.
- **Subpáginas:** cada una tendrá su propia estética y se hacen después. Referencias:
  - IA: recurziv.com
  - Portfolio: skhiladze.com
  - Servicios: bitwip.fr
  - Nosotros: RPG retro de 8 bits.

## Home: secciones y textos
- **Textos finales:** [copies/home-es.md](copies/home-es.md) (español neutro) y [copies/home-en.md](copies/home-en.md).
- **Título del hero, provisorio:** "Lo grande pasa bajo el agua."
- **Orden de las secciones:**
  1. Loader con contador en metros.
  2. Hero (superficie).
  3. Manifiesto.
  4. Cuatro zonas: superficie / Meta Ads, zona de luz / webs, crepuscular / automatizaciones, abismo / IA.
  5. "Antes de seguir bajando" (objeciones).
  6. Portfolio con tarjetas de vidrio apiladas como en Two Halves. Contenido de ejemplo por ahora; después se conectan sus webs. Botón "Ver todo el portfolio".
  7. Paquetes como **tickets de inmersión o excursión**. Nombres y precios a definir.
  8. Equipo, con un adelanto del About RPG.
  9. Cierre con bioluminiscencia.
  10. Footer: fondo del mar con wordmark gigante.

## Diseño
- **Color:** [diseno/fondos-y-color.md](diseno/fondos-y-color.md). El fondo depende de la profundidad. La superficie es blanca, el abismo casi negro con bioluminiscencia #5CFFC4 y el acento es cian #38D6E8.
- **Tipografía:** Sprat (títulos), Ronzino (texto) y Martian Mono (sonar, medidor y tickets), en `assets/fonts/`. **Ancho fijo, sin efecto de presión.** El texto aparece letra por letra, como en Two Halves.
- **Dirección visual y efectos:** [diseno/direccion-visual.md](diseno/direccion-visual.md).
  - El agua del cursor es el efecto firma y se mantiene. Base: [maqueta 2](diseno/maquetas/maqueta-2.html).
  - Ballena 3D que sale del logo y deja una estela de burbujas.
  - Plancton que destella donde el agua se agita.
  - Láminas científicas en trama, ecograma real y batimetría real.
- **Descartado:**
  - rayos con degradado;
  - nieve marina como puntitos;
  - bioluminiscencia como círculos con glow;
  - la tipografía que se comprime.

## Criterio de terminado de la home (propuesto, a confirmar)
1. Todas las secciones armadas con los textos en español.
2. Funcionando: agua del cursor, ballena con su recorrido y estela, medidor de profundidad, texto letra por letra, cambio de color por profundidad y bioluminiscencia reactiva.
3. Portfolio y tickets con contenido de ejemplo.
4. Que se vea bien y fluido en el celular, con versión estática para "reducir movimiento".
5. Publicada en un link de prueba de Cloudflare.

**Segunda vuelta:** inglés, sonido (ping de sonar ya prototipado y grabaciones de NOAA), formulario conectado a GHL y portfolio real.

## Pendientes de los dueños
- Descargar el modelo de la ballena de Sketchfab (cuenta gratuita).
- Confirmar el título del hero.
- Nombres y precios de los paquetes.
- Lista de webs para el portfolio.
