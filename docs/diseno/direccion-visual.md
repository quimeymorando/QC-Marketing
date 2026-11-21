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
| **Fondo del mar (footer)** | **Curvas de nivel de una fosa real**, con coordenadas, que la onda deforma. | ETOPO 2022 + d3-contour | CC0 + ISC |

## La ballena (decisión 21/11: **dibujada, no 3D**)
- **Ilustración propia en 2D**, como la grulla de Two Halves: dibujada a mano o en vectores, animada como una cadena de segmentos que ondula sobre la curva del scroll. Nada de modelos 3D.
- **Sale del logo** del menú (el logo está por definir) y baja nadando con el scroll.
- **Estela de agua, no burbujas ni línea punteada:** la ballena empuja la misma simulación de ondas del cursor. Deja una estela tipo **kelvin wake** (la V que deja un barco o un animal al nadar) que se abre y se disipa detrás de la cola, y distorsiona lo que hay detrás.
- Como la estela es agua, también hace destellar el plancton en el abismo.

## Texto
- **Tipografías:** Sprat + Ronzino + Martian Mono, en ancho fijo (sin efecto de presión).
- **Efectos por sección:** ver [../referencias/03-twohalves-efectos-de-texto.md](../referencias/03-twohalves-efectos-de-texto.md).

## Descartado y por qué
- **MBARI (video):** solo uso educativo; prohíbe webs y publicidad.
- **LYGIA:** licencia no comercial.
- **Hydra:** AGPL.
- **Paquete npm `marching-squares`:** AGPL.
- **Shadertoy:** no comercial por defecto.
- **Physarum "suelto":** se ve generativo y genérico.

## Créditos obligatorios (página de colofón)
- "NOAA Ocean Exploration", o el crédito exacto de cada pieza.
- "NCEI Water Column Sonar Data Archive, doi:10.7289/V5HT2M7C".
- ETOPO 2022 (NOAA NCEI).
- Láminas: Biodiversity Heritage Library / Internet Archive.
- Tipografías: Collletttivo (Sprat, Ronzino), Evil Martians (Martian Mono), bajo SIL OFL.

## Referencias de oficio
- [OceanX 2025](https://2025.oceanx.org/) (Unseen Studio, Awwwards SOTD 23/02/2026)
- [Convex Seascape Survey](https://convexseascapesurvey.com/virtual-experience/) (Unseen Studio, SOTD 17/01/2024)
- [Seasats](https://www.seasats.com/) (SOTD 08/09/2026)
- [The Deep Sea – neal.fun](https://neal.fun/deep-sea/)
