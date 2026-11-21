# Créditos y licencias — `public/media/`

Material real de dominio público usado en la web de Ceto Studio (concepto: inmersión en el océano).
Todo lo que figura acá es dominio público (obras anteriores a 1929 con autor fallecido hace más de 70 años)
u obra del Gobierno de EE. UU. (NOAA), que no genera copyright (17 U.S.C. § 105). NOAA pide que se la acredite.
Los archivos son **derivados procesados** (recorte, dithering, transcodificación, conversión a grises); conviene decirlo
si se muestran como "dato real". Descargado y verificado el 2026-11-21.

## Línea de crédito corta (pie de página)

> Láminas: E. Haeckel y A. Günther, *Report on the Scientific Results of the Voyage of H.M.S. Challenger* (1887–1888) y E. Haeckel, *Kunstformen der Natur* (1904), dominio público, vía Internet Archive y Wikimedia Commons. Video, fotos y ecograma: NOAA Ocean Exploration. Batimetría: NOAA NCEI, ETOPO1.

## Láminas (`plate-*.png`, metadatos en `plates.json`)

PNG de 1 bit: píxeles blancos opacos = tinta de la lámina, fondo transparente. Dither Atkinson a escala 1:1 (no reescalar).

| Archivo | Qué es | Autor / obra | URL de origen | Licencia | Crédito a mostrar |
|---|---|---|---|---|---|
| `plate-1.png` (495×265) | *Melanocetus murrayi*, rape abisal. Lám. XI, fig. A | Albert Günther, *Report on the Deep-Sea Fishes collected by H.M.S. Challenger* (Zoology vol. XXII), 1887. Lit.: R. Mintern | https://archive.org/details/reportondeepseaf00gn/page/n466/mode/1up | Dominio público (1887; autor † 1914). Internet Archive: `NOT_IN_COPYRIGHT`, digitalizado por Smithsonian Libraries | A. Günther, *Deep-Sea Fishes*, HMS Challenger (1887). Dominio público, vía Internet Archive / Smithsonian Libraries |
| `plate-2.png` (473×373) | *Epibulia ritteriana*, sifonóforo. Lám. XXII, fig. 6 | Ernst Haeckel, *Report on the Siphonophorae collected by H.M.S. Challenger* (Zoology vol. XXVIII), 1888. Lit.: A. Giltsch | https://archive.org/details/reportonsiphonop00haec/page/n482/mode/1up | Dominio público (1888; autor † 1919). Internet Archive: `NOT_IN_COPYRIGHT`, digitalizado por MBLWHOI Library | E. Haeckel, *Siphonophorae*, HMS Challenger (1888). Dominio público, vía Internet Archive / MBLWHOI Library |
| `plate-3.png` (443×491) | *Disconalia gastroblasta*, sifonóforo (porpítido). Lám. L, fig. 1 | Ídem (Haeckel, 1888) | https://archive.org/details/reportonsiphonop00haec/page/n592/mode/1up | Ídem | Ídem |
| `plate-4.png` (500×502) | *Periphylla peronii* (hoy *Periphylla periphylla*), medusa casco de aguas profundas. Tafel 38, fig. 3 | Ernst Haeckel, *Kunstformen der Natur*, 1904. Lit.: A. Giltsch | https://commons.wikimedia.org/wiki/File:Haeckel_Peromedusae.jpg | Dominio público (1904; autor † 1919). Commons: PD-old / PD-US | E. Haeckel, *Kunstformen der Natur* (1904). Dominio público, vía Wikimedia Commons |
| `plate-5.png` (323×477) | *Zygocannula diploconus* (hoy *Zygocanna diploconus*), hidromedusa. Tafel 36, fig. 5 | Ídem (Haeckel, 1904) | https://commons.wikimedia.org/wiki/File:Haeckel_Leptomedusae.jpg | Ídem | Ídem |
| `plate-6.png` (352×513) | *Discolabe quadrigata* (hoy *Physophora hydrostatica*), sifonóforo. Tafel 37, fig. 1 | Ídem (Haeckel, 1904) | https://commons.wikimedia.org/wiki/File:Haeckel_Siphonophorae_37.jpg | Ídem | Ídem |

Notas:
- Los nombres van "tal como figuran en la lámina". Los nombres actuales de las láminas 4–6 salen de la descripción de Wikimedia Commons; los de las láminas 2 y 3 (Challenger) **no se verificaron** contra WoRMS y quedaron en `null` en `plates.json`.
- En las láminas 2, 3 y 6 los tentáculos se superponen con figuras vecinas: se enmascararon las vecinas, así que algunos extremos quedan cortados.

## Video y fotos — NOAA Ocean Exploration

Base de la licencia: https://oceanexplorer.noaa.gov/about/media-kit/ ("Images and Videos Usage and Credit": piden incluir el crédito del pie de cada imagen o video, o "NOAA Ocean Exploration" si falta espacio; solo requieren permiso las piezas cuyo pie dice *copyright*, y ninguna de estas lo dice). No usar el logo de NOAA ni sugerir que NOAA avala el sitio.

| Archivo | Qué es | Autor / fuente | URL de origen | Licencia | Crédito a mostrar |
|---|---|---|---|---|---|
| `clip-1.mp4` + `clip-1.jpg` | Sifonóforo a ~800 m frente a Hawái (22-09-2017). Loop mudo de 7,0 s, 640×360, H.264 | NOAA Ocean Exploration, expedición *Deep-Sea Symphony: Exploring the Musicians Seamounts* (EX1708) | Página: https://oceanexplorer.noaa.gov/multimedia/video-shorts-ex1708-siphonophore/ — Archivo: https://oceanexplorer.noaa.gov/wp-content/uploads/2021/02/ex1708-siphonophore.mp4 | Dominio público (obra del Gobierno de EE. UU.) | NOAA Ocean Exploration, Deep-Sea Symphony: Exploring the Musicians Seamounts |
| `clip-2.mp4` + `clip-2.jpg` | Ctenóforo a 770 m en el Golfo de México (17-04-2018). Loop mudo de 6,3 s, 640×360, H.264 | NOAA Ocean Exploration, expedición *Gulf of Mexico 2018* (EX1803) | Página: https://oceanexplorer.noaa.gov/multimedia/video-shorts-ex1803-ctneophore1/ — Archivo: https://oceanexplorer.noaa.gov/wp-content/uploads/2021/05/ex1803-ctenophore1.mp4 | Dominio público (obra del Gobierno de EE. UU.) | NOAA Ocean Exploration, Gulf of Mexico 2018 |
| `photo-1.webp` (1200×675) | "Medusa cósmica" (hidromedusa, familia Rhopalonematidae) a ~3.000 m, Samoa Americana, 2017 | NOAA Ocean Exploration, expedición *2017 American Samoa* (EX1702) | Página: https://oceanexplorer.noaa.gov/multimedia/daily-image-media-20201013/ — Archivo: https://oceanexplorer.noaa.gov/wp-content/uploads/2020/10/20201013-hires.jpg | Dominio público (obra del Gobierno de EE. UU.) | NOAA Ocean Exploration, 2017 American Samoa |
| `photo-2.webp` (1200×675) | Medusa roja del género *Poralia* a 700 m, cañón Hydrographer, Atlántico Norte, 2021 | NOAA Ocean Exploration, expedición *2021 North Atlantic Stepping Stones* (EX2104) | Página: https://oceanexplorer.noaa.gov/multimedia/okeanos-explorations-ex2104-dives-dive20-media-red-jellyfish/ — Archivo: https://oceanexplorer.noaa.gov/wp-content/uploads/2025/05/red-jellyfish-hires.jpg | Dominio público (obra del Gobierno de EE. UU.) | NOAA Ocean Exploration, 2021 North Atlantic Stepping Stones |

Procesado de los clips:
- `clip-1`: segundos 12,0–19,8 del original, velocidad real. Los últimos 0,8 s se funden con el comienzo para que el loop no salte.
- `clip-2`: segundos 14,1–20,0 del original, **ralentizado al 83 %** (25 fps) para llegar a 6 s; fundido de 0,7 s en el empalme.
- Sin audio, sin metadatos, `yuv420p`, `+faststart`, CRF 23. Los pósters son el primer frame en JPEG calidad 70.

## Ecograma (`echogram.webp`, 2000×360, escala de grises)

| Archivo | Qué es | Autor / fuente | URL de origen | Licencia | Crédito a mostrar |
|---|---|---|---|---|---|
| `echogram.webp` | Ecograma de la capa de dispersión profunda (deep scattering layer) entre ~300 y ~800 m, registrado con la ecosonda del NOAA Ship *Okeanos Explorer* durante una inmersión del ROV. Eje vertical: 0 a ~960 m; eje horizontal: tiempo. Más claro = más retrodispersión | NOAA Office of Ocean Exploration and Research, expedición *Windows to the Deep 2019* (EX1903) | Página: https://oceanexplorer.noaa.gov/multimedia/okeanos-explorations-ex1903-logs-july6-media-echogram/ — Archivo: https://oceanexplorer.noaa.gov/wp-content/uploads/2022/08/echogram-hires.jpg | Dominio público (obra del Gobierno de EE. UU.) | Image courtesy of the NOAA Office of Ocean Exploration and Research (corto: NOAA Ocean Exploration, Windows to the Deep 2019) |

Procesado: se recortaron las etiquetas de profundidad; se quitaron las líneas de grilla cada 100 m y la traza roja del ROV (con su eco), rellenando esos píxeles con los vecinos de arriba y abajo; la paleta arcoíris se pasó a intensidad por tono (gris < azul < verde < amarillo < naranja < rojo), que es una **aproximación** y no un valor de Sv calibrado; se amplió de 1186×183 a 2000×360. La banda brillante de arriba es el ruido de superficie del transductor, que es parte del registro original. Muestra la capa en un momento del día, no el ciclo completo de migración vertical.

## Batimetría (`bathy.json`)

| Archivo | Qué es | Autor / fuente | URL de origen | Licencia | Crédito a mostrar |
|---|---|---|---|---|---|
| `bathy.json` | Isóbatas cada 500 m (0 a 8.000 m) de la Fosa de las Sandwich del Sur, 62°S–54°S y 32°O–22°O. Punto más profundo de la grilla: 8.239 m en 55,65°S 25,93°O | NOAA National Centers for Environmental Information (ex NGDC), **ETOPO1 1 Arc-Minute Global Relief Model** (Ice Surface) | Datos: https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo180.csv?altitude%5B(-62):1:(-54)%5D%5B(-32):1:(-22)%5D — Ficha: https://coastwatch.pfeg.noaa.gov/erddap/info/etopo180/index.html | Dominio público (obra del Gobierno de EE. UU.). Texto del dataset: "The data may be used and redistributed for free but is not intended for legal use, since it may contain inaccuracies" | Batimetría: NOAA NCEI, ETOPO1 |

Cita: Amante, C. y B. W. Eakins (2009). *ETOPO1 1 Arc-Minute Global Relief Model: Procedures, Data Sources and Analysis*. NOAA Technical Memorandum NESDIS NGDC-24. doi:10.7289/V5C8276M.

Procesado: grilla de 1 minuto de arco suavizada una vez y submuestreada a 2 minutos (241×301); marching squares propio en numpy; Douglas–Peucker con tolerancia 0,0008; se descartaron las líneas de longitud menor a 0,012. Coordenadas normalizadas 0..1: `x` de oeste (`lon0`) a este (`lon1`), `y` de norte (`lat1`) a sur (`lat0`). Cada línea es `[x,y,x,y,…]`. El campo `aspect` (0,6624) es la relación ancho/alto real a la latitud media, para dibujar el mapa sin deformarlo. No sirve para navegación. La profundidad máxima es la de ETOPO1; la Fosa Meteor suele citarse con unos 8.200–8.270 m según la fuente.

## Sonido (`public/audio/`)

| Archivo | Qué es | Autor / fuente | URL de origen | Licencia | Crédito a mostrar |
|---|---|---|---|---|---|
| `ballena-1.mp3`, `ballena-2.mp3` | Canto real de ballena jorobada (Alaska). Dos fragmentos de ~12 s recortados, normalizados y convertidos a MP3 | NOAA PMEL Acoustics Program | https://www.pmel.noaa.gov/acoustics/whales/sounds/whalewav/akhumphi1x.wav (índice: https://www.pmel.noaa.gov/acoustics/sounds_whales.html) | Obra del Gobierno de EE. UU. (dominio público); PMEL indica que su material multimedia puede distribuirse libremente y pide que se lo cite | NOAA PMEL Acoustics Program |

El ambiente submarino y el ping de sonar se generan por código (Web Audio), sin archivos.

## Grabados de Gessner (`plate-7.png`, `plate-8.png`, `plate-9.png`)

Xilografías de Conrad Gessner, *Historiae animalium*, liber IV: *De piscium & aquatilium animantium natura* (1.ª ed. Zúrich, 1558). Ejemplar digitalizado: edición de Fráncfort, A. Cambier, 1604, Smithsonian Libraries, vía Biodiversity Heritage Library / Internet Archive (marcado como dominio público). Las figuras siguen las de la *Carta Marina* de Olaus Magnus (1539), como dice el propio texto de la página.

| Archivo | Qué es | Página | URL |
|---|---|---|---|
| `plate-7.png` (1240×497) | *Balaena erecta grandem navem submergens*: una ballena se alza y hunde una nave. Zona crepuscular | p. 118 | https://archive.org/details/ConradiGesnerimIVGess/page/n163/mode/1up |
| `plate-8.png` (1240×600) | *Nautae in dorsa cetorum, quae insulas putant*: marineros anclan sobre una ballena creyéndola una isla. Sección «Lo que ya te pasó» | p. 119 | https://archive.org/details/ConradiGesnerimIVGess/page/n164/mode/1up |
| `plate-9.png` (1240×561) | *Balaena cum adiuncta orca eam persequente*: ballena perseguida por una orca. En reserva | p. 118 | https://archive.org/details/ConradiGesnerimIVGess/page/n163/mode/1up |

Procesado: recorte de la figura, corrección del fondo del papel (manchas), reducción a 1240 px de ancho y umbral a 1 bit (blanco opaco = tinta, fondo transparente).

Por qué estos grabados: *cetus* (del griego *kētos*) es «monstruo marino, ballena»; de ahí vienen «cetáceo» y el nombre del estudio. El video del sifonóforo (`clip-1`) ya no se usa en la home.
