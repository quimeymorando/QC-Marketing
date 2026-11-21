# Dirección visual de la home: análisis final

Fecha: 21/11/2026. Reemplaza los efectos de la maqueta 2 que se descartaron por "básicos" o con "look de IA": rayos con degradado, nieve como puntitos y bioluminiscencia como círculos con glow.

## Principio
Lo que hace que una web parezca IA es la **luz sin causa** y las **formas sin origen**: brillos difusos, partículas genéricas, degradados. Las webs premiadas con temática de mar (OceanX 2025, Convex Seascape Survey, Seasats, *The Deep Sea* de Neal Agarwal) tienen un patrón común: **datos reales, tipografía de etiqueta científica y efectos sobrios**. Ninguna usa partículas brillantes.

En Ceto, **cada efecto tiene que tener una causa física o una fuente real.**

## El sistema
**Un solo efecto firma: el agua del cursor.** La simulación de ondas que gustó pasa a ser el motor de todo el sitio:
1. **El cursor** la mueve (ya funciona).
2. **La ballena** la mueve: cerca de la superficie deja ondas y, bajo el agua, una estela.
3. **La bioluminiscencia la lee.** El plancton destella solo donde el agua se agita, como pasa en la realidad: los dinoflagelados se encienden por esfuerzo mecánico, con un destello de unos 100 ms, después se agotan y se recargan (Jalaal et al., *PRL* 2020).

## Zona por zona

| Zona | Qué se ve | Recurso | Licencia |
|---|---|---|---|
| **Superficie (hero, blanco)** | Título refractado por el agua del cursor (ya está). Ballena que sale del logo. | Simulación propia | Propia |
| **Transición al agua** | La ballena se sumerge y rompe la superficie: la ola se abre en vez de bajar plana. | Simulación de ondas + three.js | MIT |
| **Zona de luz** | Fotos o video reales del océano en duotono (cian y negro), refractados por el agua. | NOAA Ocean Exploration | Dominio público, crédito "NOAA Ocean Exploration" |
| **Zona crepuscular** | **Láminas científicas antiguas** (Challenger 1873–76, Haeckel) en trama de 1 bit. La onda del cursor las "revela" como luz que pasa. Cada criatura lleva su ficha (nombre, profundidad, expedición). | Haeckel *Report on the Siphonophorae* 1888, Günther *Deep-Sea Fishes* 1887, *Kunstformen der Natur* | Dominio público (Internet Archive / BHL) |
| **Transición crepuscular** | Banda de **ecograma de sonar real**: así aparece el plancton en un sonar ("capa de dispersión profunda"). Recoloreada a cian y negro. | NOAA NCEI Water Column Sonar | Libre, cita DOI 10.7289/V5HT2M7C |
| **Abismo** | Negro. Solo destellos de **píxeles duros** (sin blur) color #5CFFC4 donde el agua se agita, por el cursor o la ballena. | Pase de dithering propio o Paper Shaders ≥0.0.77 | Apache-2.0 |
| **Fondo del mar (footer)** | **Curvas de nivel de una fosa real**, con coordenadas, que la onda deforma. Escaneo real de una ballena en el fondo (whale fall). | ETOPO 2022 + d3-contour. Modelo MBARI en Sketchfab | CC0 + ISC. CC-BY |

## La ballena
- **Modelo:** [Blue Whale – Textured](https://sketchfab.com/3d-models/d24d19021c724c3a9134eebcb76b0e0f) (ostapblendercg). Tiene 2.424 caras, animación de nado y licencia CC-BY. Ver [ballenas-3d-candidatas.jpg](ballenas-3d-candidatas.jpg).
- **Material propio, no la textura de foto:**
  - En la superficie, silueta oscura con borde de luz cian.
  - En el abismo, contorno en trama y destellos donde roza el agua.
- **Recorrido:** sale del logo del menú, igual que la grulla en Two Halves. Sigue una ruta ligada al scroll y baja hasta el fondo. En el footer "descansa" junto al whale fall.
- **Estela:** burbujas chiquitas que suben oscilando, con borde refractivo (no puntos planos), más una distorsión leve del agua detrás de la cola. La estela también excita el plancton.
- **Performance:**
  - Una sola escena WebGL con un solo loop: el ticker de GSAP alimentando a Lenis.
  - Se pausa fuera de pantalla.
  - Si no hay WebGL o está activado "reducir movimiento", se muestra una versión estática.

## Texto
- **Tipografías:** Sprat + Ronzino + Martian Mono, en ancho fijo (sin efecto de presión).
- **Aparición:** letra por letra, al estilo de Two Halves, como "lectura de sonar".

## Descartado y por qué
- **MBARI (video):** solo uso educativo; prohíbe webs y publicidad.
- **LYGIA:** licencia no comercial.
- **Hydra:** AGPL.
- **Paquete npm `marching-squares`:** AGPL.
- **Shadertoy:** no comercial por defecto.
- **Physarum "suelto":** se ve generativo y genérico.

## Créditos obligatorios (página de colofón)
- "NOAA Ocean Exploration", o el crédito exacto de cada pieza.
- Autores de los modelos de Sketchfab (CC-BY): ostapblendercg; MBARI (whale fall).
- "NCEI Water Column Sonar Data Archive, doi:10.7289/V5HT2M7C".
- ETOPO 2022 (NOAA NCEI).
- Láminas: Biodiversity Heritage Library / Internet Archive.
- Tipografías: Collletttivo (Sprat, Ronzino), Evil Martians (Martian Mono), bajo SIL OFL.

## Referencias de oficio
- [OceanX 2025](https://2025.oceanx.org/) (Unseen Studio, Awwwards SOTD 23/02/2026)
- [Convex Seascape Survey](https://convexseascapesurvey.com/virtual-experience/) (Unseen Studio, SOTD 17/01/2024)
- [Seasats](https://www.seasats.com/) (SOTD 08/09/2026)
- [The Deep Sea – neal.fun](https://neal.fun/deep-sea/)
