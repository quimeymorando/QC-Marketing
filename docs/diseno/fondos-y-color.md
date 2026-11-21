# Fondos y color de la home (propuesta)

Maqueta navegable: https://claude.ai/artifact/NHUFeAfswD4GVorgSw8Naj (privada; compartir desde el menú Share).

## Regla
No hay bloques que alternan entre claro y oscuro: **el color de fondo depende de la profundidad** (la posición del scroll) y oscurece de forma continua. Hay un solo corte brusco: la **línea de agua** al final del hero.

| Profundidad | Zona | Fondo | Texto | Elementos |
|---|---|---|---|---|
| 0 m | Superficie (hero, arriba del agua) | Espuma `#F2F6F7` | Casi negro `#04070B` | Ola animada en el borde inferior |
| 0–200 m | Zona de luz | Petróleo `#0E3448` → azul marino `#0A1C2B` | Espuma | Rayos de luz cian desde arriba, que se apagan hacia los 200 m |
| 200–1.000 m | Zona crepuscular | Azul marino → `#060D14` | Espuma | Nieve marina (partículas que caen) |
| 1.000–4.000 m | Abismo | Casi negro `#030508` | Espuma | Puntos bioluminiscentes `#5CFFC4` (solo acá), botón de contacto |
| 4.000 m | Fondo del mar (footer) | Casi negro | Espuma | Wordmark gigante |

- **Acento de marca:** cian `#38D6E8`.
- **El blanco** reaparece como **objeto**, no como fondo: tickets de papel (paquetes) y reflejos en las tarjetas de vidrio (portfolio).
- **Menú, cursor y medidor de profundidad** usan `mix-blend-mode: difference` (como en Two Halves), así se leen sobre el claro y sobre el oscuro sin cambiar de color a mano.
- **Tipografías de la maqueta** (Space Grotesk, Inter, JetBrains Mono): provisorias.
