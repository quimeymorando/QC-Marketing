# Recursos gratuitos para Ceto Studio

Verificado el 21/11/2026. **No es asesoramiento legal:** antes de publicar, revisar el archivo de licencia de cada recurso.

## Tipografías (en `assets/fonts/`)
| Rol | Fuente | Licencia |
|---|---|---|
| Títulos | **Sprat** (Collletttivo), variable: ancho 100–200, peso 10–200 | SIL OFL 1.1 |
| Texto | **Ronzino** (Collletttivo) | SIL OFL 1.1 |
| Sonar, medidor y tickets | **Martian Mono** (Evil Martians), variable | SIL OFL 1.1 |

**Alternativas:**
- **B:** Nyght Serif (Tunera) + Schibsted Grotesk + Compagnon (Velvetyne).
- **C:** Funnel Display/Sans + Sligoil (Velvetyne) + Doto.

**Descartadas:**
- Pangram Pangram: gratis solo para uso personal.
- Fontshare: su licencia no permite redistribuir.
- Las fuentes "de plantilla": Inter, Space Grotesk, Satoshi, etc.

## Librerías
| Librería | Licencia | Notas |
|---|---|---|
| Astro, Lenis, three.js, OGL, Splitting.js, howler.js, Tone.js, simplex-noise, troika-three-text, stegu/webgl-noise | Libres: MIT o Unlicense | Sin restricciones |
| postprocessing (pmndrs) | Zlib | Sin restricciones |
| GSAP 3.15 y todos sus plugins | Standard No Charge License (Webflow) | Gratis para uso comercial; no es open source |
| LYGIA | Prosperity Public License 3.0 | **No es gratis para uso comercial** |

## Efectos: repositorios base (MIT)
- **[evanw/webgl-water](https://github.com/evanw/webgl-water):** ondas de cursor, refracción y cáusticas.
- **[Ejemplos de three.js](https://threejs.org/examples/):**
  - agua GPGPU (`webgl_gpgpu_water`)
  - océano (`webgpu_ocean`)
  - cáusticas (`webgpu_caustics`)
  - rayos de luz (`webgl_postprocessing_godrays`)
  - partículas de nieve (`webgpu_compute_particles_snow`)
- **[PavelDoGreat/WebGL-Fluid-Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation):** estela bioluminiscente en el abismo. Usarla en monocromo cian, no con los colores neón por defecto.
- **[dli/waves](https://github.com/dli/waves) y [jbouny/fft-ocean](https://github.com/jbouny/fft-ocean):** superficie del mar realista.
- **Codrops:** los repos nuevos son MIT. Los viejos, como LiquidDistortion o RainEffect, permiten uso comercial integrado, pero no redistribuirlos tal cual.
- **Shadertoy:** por defecto es CC BY-NC-SA, **no comercial**. Usar un shader solo si declara otra licencia.
- **Colecciones para buscar más:**
  - [awesome-creative-coding](https://github.com/terkelg/awesome-creative-coding)
  - [awesome-webgl](https://github.com/sjfricke/awesome-webgl)
  - [graphics-resources](https://github.com/mattdesl/graphics-resources)

## Ballena
- No hay un cuerpo de ballena completo de buena calidad en CC0.
- **Opciones en Sketchfab con licencia CC-BY** (uso comercial permitido con atribución):
  - [Humpback – ostapblendercg](https://sketchfab.com/3d-models/humpback-whale-7984cdf86d6946ca8e13f94a5ad5b33c)
  - [Humpback animated – nolanfa](https://sketchfab.com/3d-models/humpback-whale-animated-marine-mammals-219ed629c9394d869bbf19d443188423)
  - [Sperm whale – ostapblendercg](https://sketchfab.com/3d-models/sperm-whale-7ac6a7cdc74744739092df2a7f44833c)
- **Recomendación: dibujarla nosotros,** con trazo a mano o en vectores, y animarla como una cadena de segmentos sobre la curva del scroll.
- Referencia para calcar: las láminas de *A Book of Whales* (Beddard, 1900), de dominio público.

## Sonido
- **Dominio público (EE. UU.):**
  - NOAA PMEL: [índice de grabaciones de ballenas](https://www.pmel.noaa.gov/acoustics/sounds_whales.html). Citar "NOAA PMEL Acoustics Program".
  - NPS Glacier Bay: [grabaciones](https://home.nps.gov/glba/learn/nature/soundclips.htm). Créditos: "NPS / C. Gabriele".
- **Freesound CC0:**
  - [ping de sonar 539957](https://freesound.org/people/SamsterBirdies/sounds/539957/)
  - [ambiente submarino 393819](https://freesound.org/people/Kinoton/sounds/393819/)
  - [burbujas grabadas con hidrófono 349885](https://freesound.org/people/thaighaudio/sounds/349885/)
  - [buceo con ballenas 82325](https://freesound.org/people/KEVOY/sounds/82325/)
- **Evitar:**
  - BBC Sound Effects: licencia no comercial.
  - Watkins (WHOI): prohíbe el uso comercial.
- **Ping de sonar:** sintetizado con Web Audio. Ya está implementado en la maqueta 2 y no requiere licencia.

## Texturas
- [Poly Haven](https://polyhaven.com/license) y [ambientCG](https://ambientcg.com/license): CC0.
- [Blue noise de Christoph Peters](https://momentsingraphics.de/BlueNoise.html): CC0. Sirve para el grano y para evitar bandas en los degradados.

## Reglas anti "hecho con IA"
1. Un solo efecto firma, el agua, que funcione como sistema de todo el sitio. No sumar efectos sueltos.
2. Ballena e ilustraciones hechas a mano.
3. La tipografía cambia con la profundidad, usando sus ejes variables.
4. Paleta basada en la física real del mar. Nada de degradados violetas. Grano y dithering.
5. Textos concretos, con metros y zonas reales.
6. El vidrio tiene que parecer agua: refracción, no un blur genérico.
7. Movimiento con física (resortes, inercia), no curvas de animación estándar.
8. Rendimiento cuidado y una versión estática para "reducir movimiento".
9. Página de colofón con las licencias y atribuciones.
