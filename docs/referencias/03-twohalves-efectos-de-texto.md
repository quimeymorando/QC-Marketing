# Two Halves: efectos de texto sección por sección

Grabé cuadro por cuadro (cada 200 ms) cómo aparece el texto al entrar en cada sección de twohalves.co. Todos los efectos salen del **mismo motor de máquina de escribir**, pero cada sección lo usa distinto según el tamaño y el rol del texto.

## Las piezas del motor
- **Letra por letra:** cada carácter aparece con un fundido de 150 ms. Por eso las últimas letras recién escritas se ven grises y van tomando color, como una "cola" que se aclara.
- **Velocidad según el tamaño:**
  - los títulos grandes van lentos (hasta 72 ms por letra en el hero);
  - los textos chicos, muy rápidos (4–38 ms por letra);
  - ningún bloque tarda más de 1 s.
- **Cursor `|`:** parpadea mientras escribe. En algunos títulos **queda parpadeando al final** (`data-tw-caret="stay"`).
- **Carriles:** los textos se escriben en orden. Primero el título y después lo que depende de él (`data-tw-lane` / `data-tw-after`).
- **Dos tonos:** la primera parte del título va en blanco o negro; la segunda en gris (`.accent`).
- **Disparo:** cuando el texto entra en pantalla.

## Sección por sección

| Sección | Qué hace el texto | Captura |
|---|---|---|
| **Hero** | El título se escribe **lento** (72 ms por letra) y el cursor **queda parpadeando** al final ("Digitally.\|"). Después se escriben las dos leyendas chicas de las esquinas. | [texto-hero](img/twohalves-texto-hero.jpg) |
| **Manifiesto** ("The studio") | **No se escribe solo: avanza con el scroll.** Cada letra aparece a medida que bajás. Las 4 letras siguientes se ven en gris tenue y el cursor sigue a la última letra. Tiene una palabra en segundo tono ("moves people:"). Debajo, tres datos chicos que se escriben rápido. | [texto-manifiesto-y-work](img/twohalves-texto-manifiesto-y-work.jpg) |
| **Work** | El título gigante se escribe en dos tonos ("Work that" / "moves."). **Entre las palabras queda un hueco con un video chiquito que rebota** como el logo del DVD. Las fichas de cada caso tienen textos chicos que se escriben rápido. | idem |
| **Servicios** | Una etiqueta chica ("— Services"). El título ("What we make.") se escribe con cursor y segundo tono. El párrafo de intro se escribe rápido. **Cada fila se escribe cuando entra en pantalla, una tras otra:** número, título del servicio (con cursor) y descripción. Al pasar el mouse, el título se pone gris. | [texto-servicios](img/twohalves-texto-servicios.jpg) |
| **Paquetes** | El título se escribe en dos líneas y dos tonos. **Los tickets "se imprimen"** de arriba hacia abajo, en 30 pasos, como una impresora de tickets, uno detrás del otro. **Su contenido se escribe línea por línea mientras se imprimen.** | [texto-tickets](img/twohalves-texto-tickets.jpg) |
| **Equipo** | "We're with you the whole way." se escribe y después **se dibuja a mano una flecha** desde la palabra "way." hasta el pájaro. "Two halves, one studio." en dos tonos. **Los nombres gigantes se escriben alternando columnas** (izquierda, derecha) y después su rol y su mail. | [texto-equipo](img/twohalves-texto-equipo.jpg) |
| **Cierre** | "Let's make yours." se escribe y el cursor **queda parpadeando**, como esperando que escribas vos. | — |
| **Footer** | El nombre gigante ("Two Halves") **se escribe letra por letra** con el cursor parpadeando al final. Los links y los datos se escriben rápido. | [texto-footer](img/twohalves-texto-footer.jpg) |
| **Cursor del mouse** | Las etiquetas del cursor ("View case", "Get a quote") también se escriben letra por letra. | — |
| **Transición entre páginas** | El telón se cierra y **se escribe el nombre de la página de destino** (60 ms por letra). | — |

## Cómo lo traducimos a Ceto (lectura de sonar)
Mismo motor, mismas reglas por sección. Cambia el color y algunos detalles marinos:

| Sección Ceto | Efecto |
|---|---|
| **Hero** | Título lento con el cursor que queda parpadeando. Segundo tono en cian o gris azulado. |
| **Manifiesto** | Avanza con el scroll, letra por letra. |
| **Zonas (dolores)** | **Etiqueta de profundidad** ("Zona de luz · 10–200 m") escrita rápido, el **dolor** escrito lento con cursor y la **solución** rápida. Cada zona se escribe al entrar. |
| **Antes de seguir bajando** | Cada pregunta se escribe al entrar y la respuesta después, fila por fila, como los servicios de Two Halves. |
| **Portfolio** | Título en dos tonos, con un hueco entre palabras donde nada algo (por ejemplo, un video chico del portfolio, o la ballena pasando). |
| **Paquetes** | Los **pases de inmersión se imprimen** y su contenido se escribe línea por línea. |
| **Equipo** | Nombres de Quimi y Cori escritos alternando columnas. La flecha a mano apunta a la ballena. |
| **Cierre** | "Cuéntanos qué está pasando en tu negocio." con el cursor que queda esperando. |
| **Footer** | "Ceto Studio" gigante escrito letra por letra. |
| **Cursor y transiciones** | Etiquetas que se escriben solas ("Ver caso", "Enviar señal") y el nombre de la página de destino escrito en la transición. |
