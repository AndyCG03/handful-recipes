# Handful Recipes — cuatro direcciones de identidad

Fecha: 27 de octubre de 2026. Propuestas originales para selección, no marca definitiva ni aprobación del usuario.

## Fundamento común

Preservar recetas familiares grabadas: pasos ligados a clips, medidas informales mostradas visualmente y preguntas para completar con la persona que cocina. Origen en Ciudad Juárez y familias bilingües. La promesa es conservar una manera de cocinar y su voz, sin inventar precisión.

Las cuatro direcciones evitan azul Meta, infinito, chef, cubiertos cruzados y folclor decorativo genérico. Los símbolos son bocetos vectoriales de exploración: requieren refinamiento óptico y comprobación de similitud/marca antes de adopción.

## Reglas de accesibilidad

48/48 pares sólidos de color pasan AA de texto normal en esta auditoría: texto, primario, secundario, acento y pendiente contra fondo, más etiqueta de botón contra primario, en ambos modos. Cada ratio se calculó mediante luminancia relativa sRGB; la comparación usa el valor sin redondear. No equivale a certificar WCAG de toda una app. No se calculó APCA.

Usar el color de fondo como etiqueta en botones primarios; no sustituirlo por blanco por costumbre. En oscuro, los botones son claros con etiqueta oscura. Los colores de estado se acompañan de icono y texto. El acento ocupa áreas pequeñas, no informa estados por sí solo. No combinar arbitrariamente primario, secundario y acento entre sí.

Texto de lectura sugerido: 18 px y altura de línea 1.5; ofrecer aumento. Controles de captura sugeridos: 48 px de alto o más, etiqueta explícita y foco visible. No escribir sobre imágenes sin un panel sólido auditado. Las imágenes de ejemplo de la lámina son ilustraciones, no videos familiares reales.

Contraste de texto: [W3C 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html). Componentes y gráficos: [W3C 1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html).

## 1. Cuenco de barro

**Lo que cabe en una mano puede guardar una historia.**

**Idea:** Nace del hueco de una mano al recoger un puñito y de los recipientes de uso diario. El gesto de contener une la medida informal con la conservación de una historia. La textura se reserva para portadas; la interfaz permanece limpia.

**Logotipo e ícono:** En una retícula de 24 unidades, una curva abierta va de (5,11) a (19,11) pasando por una base en y=20. Dentro, tres óvalos sólidos de 2×3 unidades, escalonados, evocan ingredientes en una palma. Trazo de 2 unidades y extremos redondos. Sin dedos detallados ni utensilios. Handful en Fraunces semibold y Recipes debajo en DM Sans medium. El símbolo solo, sobre cuadrado de esquinas amplias, forma el ícono; comprobarlo a 48 y 24 px.

| Rol | Nombre | Claro | Oscuro |

| --- | --- | --- | --- |

| Primario: acciones principales | Barro cocido | `#93452F` | `#EBA38B` |

| Secundario: metadatos y navegación | Hoja de laurel | `#47604A` | `#A9C7AC` |

| Acento: énfasis puntual | Comal dorado | `#7A5521` | `#E2BE7D` |

| Neutro: fondo | Manta | `#FCF7EF` | `#211C19` |

| Neutro: texto | Tinta de cacao | `#2D2621` | `#F8EEDF` |

| Estado: pregunta pendiente | Ciruela por preguntar | `#725276` | `#D8B3DC` |

### Contrastes

| Modo | Texto/fondo | Primario/fondo | Secundario/fondo | Acento/fondo | Pendiente/fondo | Etiqueta/botón |

| --- | ---: | ---: | ---: | ---: | ---: | ---: |

| Claro | 13.96:1 AA | 6.28:1 AA | 6.48:1 AA | 6.25:1 AA | 6.18:1 AA | 6.28:1 AA |

| Oscuro | 14.69:1 AA | 8.15:1 AA | 9.20:1 AA | 9.56:1 AA | 9.16:1 AA | 8.15:1 AA |

**Tipografía:** Fraunces 600 da una voz orgánica y contemporánea a títulos cortos; DM Sans 400/500 mantiene pasos, preguntas y controles claros. No usar serif en instrucciones pequeñas ni pesos finos.

[Títulos: Fraunces](https://fonts.google.com/specimen/Fraunces) · [Texto: DM Sans](https://fonts.google.com/specimen/DM+Sans) — fuentes disponibles gratuitamente en Google Fonts. Verificar archivos y licencias al integrarlas; alojar localmente en producción.

**Microcopy en inglés:**

- Grabar: “Record a family recipe”

- Pendiente: “One detail to ask: how do you know it’s ready?”

- Vacío: “Your family’s first recipe starts with a conversation.”

**Pantalla de receta:** Video de la mano al centro, título amplio y pasos en bloques generosos. Cada paso incluye una referencia temporal visible. Las medidas informales se abren como una imagen del gesto, sin conversión numérica. Botón de grabación en barro; preguntas en ciruela con icono y texto.

**Tarjeta del video:** Fondo de manta, símbolo en barro y título grande: “Some recipes were never written.” Debajo, Handful Recipes. Un recorte amplio del gesto de un puñito aporta el vínculo con el producto; el texto va en un área sólida separada del video.

**Riesgo:** Puede parecer marca de cerámica o restaurante si domina el cuenco. Mantener cerca el lenguaje de clips, familia y memoria; evitar superficies envejecidas y ornamentos rústicos.

## 2. Archivo de sobremesa

**La voz también se hereda.**

**Idea:** Parte de los recetarios con anotaciones y las fotografías familiares. Un puñito se conserva como evidencia visual junto a la voz de quien lo usa. El archivo se siente vivo: tiene personas, preguntas y continuidad, no solo documentos.

**Logotipo e ícono:** Símbolo en retícula de 24: dos hojas superpuestas, la posterior desplazada 3 unidades arriba y a la derecha. La hoja frontal es un rectángulo de 13×16 con esquinas de 2; tres cápsulas cortas dentro evocan anotaciones e ingredientes. Una esquina superior queda abierta como detalle propio. Trazo de 2 unidades. Wordmark en Source Serif 4 semibold con Recipes en Source Sans 3. A 48 px se mantiene una hoja y tres marcas; la segunda hoja se simplifica a un ángulo.

| Rol | Nombre | Claro | Oscuro |

| --- | --- | --- | --- |

| Primario: acciones principales | Tinta de mora | `#554275` | `#C8B5E9` |

| Secundario: metadatos y navegación | Salvia de patio | `#52645A` | `#B6CDBD` |

| Acento: énfasis puntual | Lacre | `#8D493B` | `#EEB3A2` |

| Neutro: fondo | Papel de casa | `#FAF8F3` | `#201D26` |

| Neutro: texto | Grafito | `#282431` | `#F2EDF7` |

| Estado: pregunta pendiente | Mostaza de nota | `#7B5B19` | `#EAC77F` |

### Contrastes

| Modo | Texto/fondo | Primario/fondo | Secundario/fondo | Acento/fondo | Pendiente/fondo | Etiqueta/botón |

| --- | ---: | ---: | ---: | ---: | ---: | ---: |

| Claro | 14.27:1 AA | 8.17:1 AA | 5.94:1 AA | 6.28:1 AA | 5.90:1 AA | 8.17:1 AA |

| Oscuro | 14.41:1 AA | 8.89:1 AA | 9.85:1 AA | 9.17:1 AA | 10.26:1 AA | 8.89:1 AA |

**Tipografía:** Source Serif 4 600 aporta el ritmo editorial de un recetario, mientras Source Sans 3 400/600 hace legibles listas y controles. La relación entre ambas evita mezclar demasiadas voces.

[Títulos: Source Serif 4](https://fonts.google.com/specimen/Source+Serif+4) · [Texto: Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3) — fuentes disponibles gratuitamente en Google Fonts. Verificar archivos y licencias al integrarlas; alojar localmente en producción.

**Microcopy en inglés:**

- Grabar: “Save their way of cooking”

- Pendiente: “A little more to remember: what goes in next?”

- Vacío: “A place for the recipes only your family knows.”

**Pantalla de receta:** Cabecera con nombre de la receta, persona que la comparte y fecha de la grabación. Video tratado como pieza principal del archivo. Los pasos aparecen como fichas numeradas con acceso al clip; preguntas y respuestas forman un historial familiar.

**Tarjeta del video:** Composición editorial con margen ancho, una fotografía familiar autorizada a un lado y el título “Keep the recipe. Keep the voice.” sobre papel claro. Número de receta y nombre de la persona dan carácter documental.

**Riesgo:** Puede sentirse demasiado solemne o parecido a una biblioteca. Usar imágenes actuales, acciones visibles y espacio para nuevas respuestas; evitar cursivas manuscritas difíciles de leer.

## 3. Luz de frontera

**De esta cocina, para donde esté tu familia.**

**Idea:** Nace de la luz baja sobre el adobe y de familias cuya cocina viaja entre ciudades e idiomas. La mano se convierte en paisaje: un arco bajo contiene tres semillas. El origen norteño se expresa mediante luz y proporciones, sin iconografía turística ni banderas.

**Logotipo e ícono:** En 24×24, un arco de (5,14) a (19,14) con cima en y=6 queda apoyado sobre una línea horizontal en y=18; tres semillas ovales se sitúan entre arco y línea. Trazo de 2 unidades y extremos redondos. El arco sugiere palma y horizonte. Handful en Bricolage Grotesque 600, Recipes en DM Sans 500. Ícono con símbolo único a 48 px, sin paisaje detallado ni degradado.

| Rol | Nombre | Claro | Oscuro |

| --- | --- | --- | --- |

| Primario: acciones principales | Vino del ocaso | `#773C52` | `#E8A2B7` |

| Secundario: metadatos y navegación | Mezquite | `#52613A` | `#B6C991` |

| Acento: énfasis puntual | Cobre de tarde | `#9B4726` | `#F6B28B` |

| Neutro: fondo | Adobe de luz | `#FFF8EE` | `#241D25` |

| Neutro: texto | Sombra del patio | `#30262B` | `#FFF1E3` |

| Estado: pregunta pendiente | Violeta de pregunta | `#665198` | `#C7B5F1` |

### Contrastes

| Modo | Texto/fondo | Primario/fondo | Secundario/fondo | Acento/fondo | Pendiente/fondo | Etiqueta/botón |

| --- | ---: | ---: | ---: | ---: | ---: | ---: |

| Claro | 13.85:1 AA | 7.80:1 AA | 6.36:1 AA | 5.99:1 AA | 6.23:1 AA | 7.80:1 AA |

| Oscuro | 14.83:1 AA | 8.05:1 AA | 9.20:1 AA | 9.13:1 AA | 8.85:1 AA | 8.05:1 AA |

**Tipografía:** Bricolage Grotesque 600 da personalidad en una portada breve; DM Sans estabiliza lectura y uso cotidiano. La expresividad se concentra en títulos, conservando altura cómoda y tamaño generoso en instrucciones.

[Títulos: Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) · [Texto: DM Sans](https://fonts.google.com/specimen/DM+Sans) — fuentes disponibles gratuitamente en Google Fonts. Verificar archivos y licencias al integrarlas; alojar localmente en producción.

**Microcopy en inglés:**

- Grabar: “Bring a recipe home”

- Pendiente: “Ask them: what does “a handful” look like?”

- Vacío: “Home has a flavor. Start saving yours.”

**Pantalla de receta:** Encuadres horizontales de manos e ingredientes, título compacto y navegación bilingüe opcional según preferencia explícita. Los tiempos de clip se distinguen con verde mezquite; preguntas en violeta con etiqueta. Sin traducción automática que sustituya la voz original.

**Tarjeta del video:** Plano dividido entre fondo adobe claro y una captura auténtica del video familiar. Título en vino: “A handful of home.” Una línea de horizonte organiza la composición; la marca queda legible incluso en miniatura.

**Riesgo:** Puede limitarse visualmente al norte de México o convertirse en marca de viajes. Dar protagonismo a historias familiares diversas y usar el paisaje como estructura discreta, no como tema de cada pantalla.

## 4. El gesto esencial

**Cada paso conserva su origen.**

**Idea:** Parte de un puñito como unidad humana: algo concreto que no necesita fingir exactitud. Cinco módulos se reúnen en una sola figura, como ingredientes, clips y recuerdos que se vuelven una receta. Tecnología discreta con evidencia a la vista.

**Logotipo e ícono:** Símbolo de cinco módulos sólidos en retícula 24: tres cápsulas verticales de ancho 3 en x=5,10,15, escalonadas en altura; una curva ancha inferior las recoge y una cápsula corta oblicua marca el pulgar. Construir como silueta de una mano recogida, con separaciones mínimas de 2 unidades. Sin líneas interiores. Wordmark Manrope 650; Recipes en DM Sans 500. A 48 px se conservan cinco módulos; a 24 se funden las dos piezas inferiores en una base.

| Rol | Nombre | Claro | Oscuro |

| --- | --- | --- | --- |

| Primario: acciones principales | Verde de casa | `#245D56` | `#91CABB` |

| Secundario: metadatos y navegación | Hilo malva | `#62516D` | `#C9B5D4` |

| Acento: énfasis puntual | Canela | `#8B4931` | `#EDB49B` |

| Neutro: fondo | Marfil fresco | `#F5F8F4` | `#172622` |

| Neutro: texto | Tinta de hoja | `#20312D` | `#EAF3EB` |

| Estado: pregunta pendiente | Ámbar de conversación | `#785B1F` | `#E3C17A` |

### Contrastes

| Modo | Texto/fondo | Primario/fondo | Secundario/fondo | Acento/fondo | Pendiente/fondo | Etiqueta/botón |

| --- | ---: | ---: | ---: | ---: | ---: | ---: |

| Claro | 12.75:1 AA | 7.07:1 AA | 6.72:1 AA | 6.34:1 AA | 5.92:1 AA | 7.07:1 AA |

| Oscuro | 13.85:1 AA | 8.51:1 AA | 8.26:1 AA | 8.68:1 AA | 9.11:1 AA | 8.51:1 AA |

**Tipografía:** Manrope 600/650 ofrece títulos nítidos y una marca compacta; DM Sans 400/500 aporta familiaridad a lectura larga y mensajes. La diferencia entre fuentes es sutil: el peso, espacio y tamaño sostienen la jerarquía.

[Títulos: Manrope](https://fonts.google.com/specimen/Manrope) · [Texto: DM Sans](https://fonts.google.com/specimen/DM+Sans) — fuentes disponibles gratuitamente en Google Fonts. Verificar archivos y licencias al integrarlas; alojar localmente en producción.

**Microcopy en inglés:**

- Grabar: “Start a recipe recording”

- Pendiente: “One question for your family”

- Vacío: “Your first family recipe belongs here.”

**Pantalla de receta:** Tarjetas simples, video grande y un paso activo con vínculo al segundo exacto de la grabación. Una etiqueta expresa “Shown in the video” o “Ask your family”. La información inferida nunca se presenta como medida confirmada.

**Tarjeta del video:** Fondo marfil, símbolo verde y gran título “Family recipes, with every step remembered.” Tres bloques estáticos muestran video, paso y pregunta. La marca deja claro el producto antes de introducir modelos o arquitectura.

**Riesgo:** Puede parecer una app de notas o productividad. El gesto de la mano, la voz original y fotografías familiares deben aportar identidad; evitar interfaces excesivamente clínicas.

## Comparación y recomendación

Evaluación cualitativa de dirección de arte, no resultados de pruebas con usuarios ni predicción del jurado. Escala 1–5; la legibilidad presupone los tamaños y usos indicados.

| Concepto | Calidez | Modernidad | Legibilidad | Memorabilidad | Impacto en demo |

| --- | ---: | ---: | ---: | ---: | ---: |

| Cuenco de barro | 5 | 4 | 5 | 4 | 5 |

| Archivo de sobremesa | 5 | 3 | 5 | 4 | 4 |

| Luz de frontera | 4 | 4 | 5 | 5 | 5 |

| El gesto esencial | 4 | 5 | 5 | 3 | 4 |

**Recomendación: Cuenco de barro.** Vincula de forma directa el nombre, el gesto de medir y el propósito familiar. Tiene suficiente carácter para una portada y deja respirar la evidencia en la app. Para un jurado técnico, puede facilitar comprender la propuesta antes de explicar cómo funcionan los modelos; no hay evidencia de que una estética específica favorezca la puntuación.

Para el usuario real, conservar lenguaje directo, rostros y voz originales es más importante que aumentar texturas. Usar el concepto completo sin mezclar paletas. Si se desea una identidad que destaque por origen y expansión bilingüe, Luz de frontera es la segunda opción.

## Próximo paso

Elegir una dirección antes de construir la escala 50–950 y tokens de producción. source-colors.json contiene las cuatro propuestas con roles y modos; no es todavía una escala completa. contrast-wcag.csv guarda la auditoría reproducible. La lámina HTML incluye modo claro/oscuro, símbolos de exploración a 48 px y maquetas estáticas de receta y portada; no es una app ni un video renderizado.