# Intro: la gota y el nombre que se revela (borrador para discutir)

Idea de Cori: antes de la home, una gota cae al agua. El agua sube y, a medida que sube, revela el nombre de abajo hacia arriba, como esas tazas que muestran un dibujo cuando les echás agua caliente. Cuando el nombre está completo, desaparece y aparece el hero.

## Por qué funciona
- **Funciona como loader:** igual que en Two Halves, mientras corre la intro se cargan las fuentes, el agua y la ballena. **El nivel del agua puede ser el progreso real de carga.**
- **Presenta el concepto en 3 segundos:** gota → agua → profundidad → Ceto.
- **Conecta con el hero:** el agua que sube es la misma que después queda abajo del hero como línea de superficie.

## Guion cuadro por cuadro (~3,5 s)

| Tiempo | Qué pasa |
|---|---|
| 0,0 – 0,3 s | Pantalla blanca espuma, sin nada. Silencio visual. |
| 0,3 – 0,8 s | **Cae una gota** desde arriba al centro (donde va a estar el logo). Se estira con la velocidad, como una gota real, y tiene un borde que refracta lo que hay detrás. |
| 0,8 s | **Impacto:** la gota toca el agua, que está apenas en el borde inferior. Salen anillos de ondas (la misma simulación del cursor) y una pequeña corona de salpicadura. |
| 0,9 – 2,3 s | **Sube el agua** desde abajo. La superficie ondula con las ondas del impacto. **Donde llega el agua aparece el nombre "Ceto Studio"**, gigante en Sprat. Arriba de la línea de agua no se ve nada; abajo sí. Las letras aparecen con un pequeño retardo, como la tinta térmica que "reacciona". El nivel sigue la carga real, con un mínimo de tiempo para que no sea un parpadeo. |
| 2,3 – 2,8 s | El agua llena la pantalla. **El nombre completo se sostiene** medio segundo, con las últimas ondas moviéndolo. |
| 2,8 – 3,6 s | **Salida:** el nombre se disuelve en el agua (pierde color y se deshace como tinta) y **el agua baja** hasta el borde inferior. Queda como la línea de agua del hero. El título del hero empieza a escribirse letra por letra. |

## Reglas
- **Se puede saltar:** clic, scroll o tecla aceleran todo ×4, igual que Two Halves.
- **Cuándo aparece:** en cada carga completa de la página. Al navegar entre secciones de la web no se repite.
- **"Reducir movimiento":** el nombre aparece con un fundido simple, sin gota ni ondas.
- **Sonido:** los navegadores no dejan reproducir sonido antes de que la persona toque algo. **La gota no puede sonar en la intro.** El sonido va con el botón de sonido.
- **Celular:** la misma intro, con el nombre en dos líneas ("Ceto" / "Studio").

## Decisiones (21/11)
- **Fondo:** blanco espuma `#F2F6F7`, el mismo del hero.
- **Nombre:** "Ceto Studio" en **azul petróleo `#0E3448`**. El cian `#38D6E8` no se lee bien sobre blanco, así que queda para los reflejos del agua.
- **Agua:** transparente con un tinte cian suave. El nombre aparece en azul donde llega el agua.
- **La gota:** cae **por el centro de la pantalla** y tiene que verse claramente:
  - grande;
  - con borde y brillo especular, para que se lea sobre el blanco;
  - un poco de color cian;
  - una sombra suave en el punto de impacto;
  - caída levemente en cámara lenta.
- **Salida:** opción (a). El nombre se disuelve como tinta y el agua baja hasta quedar como la línea de agua del hero.
- **Duración:** ~3,5 s, para probar.
- **Cuándo aparece:** en cada **carga completa de la página**, no en la navegación interna entre secciones.
- **Video o código:** se hace con **código en tiempo real**:
  - es más liviano;
  - se ve nítido en cualquier pantalla;
  - usa la misma agua del cursor;
  - puede seguir la carga real;
  - se puede saltar.

  Si en la prueba la gota no se entiende, el plan B es un video corto renderizado de la gota (Blender) solo para la caída, y el resto en código.

## Técnica
- **Agua y ondas:** la misma simulación WebGL del cursor.
- **Gota:** un shader con forma de lágrima que se estira con la velocidad.
- **Revelado:** el nombre se dibuja en una textura y se muestra solo debajo de la línea de agua, con refracción en el borde (menisco).
- **Disolución:** ruido que deshace las letras de abajo hacia arriba.
- **Orquestación:** una timeline de GSAP controla la secuencia y se pausa hasta que cargan fuentes y recursos.
