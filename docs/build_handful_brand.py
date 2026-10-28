from pathlib import Path
import csv
import html
import json

OUT = Path(__file__).resolve().parent / 'handful-recipes'
OUT.mkdir(exist_ok=True)

concepts = [
    dict(id='barro', name='Cuenco de barro', line='Lo que cabe en una mano puede guardar una historia.',
         titlefont='Fraunces', bodyfont='DM Sans',
         idea='Nace del hueco de una mano al recoger un puñito y de los recipientes de uso diario. El gesto de contener une la medida informal con la conservación de una historia. La textura se reserva para portadas; la interfaz permanece limpia.',
         logo='En una retícula de 24 unidades, una curva abierta va de (5,11) a (19,11) pasando por una base en y=20. Dentro, tres óvalos sólidos de 2×3 unidades, escalonados, evocan ingredientes en una palma. Trazo de 2 unidades y extremos redondos. Sin dedos detallados ni utensilios. Handful en Fraunces semibold y Recipes debajo en DM Sans medium. El símbolo solo, sobre cuadrado de esquinas amplias, forma el ícono; comprobarlo a 48 y 24 px.',
         typography='Fraunces 600 da una voz orgánica y contemporánea a títulos cortos; DM Sans 400/500 mantiene pasos, preguntas y controles claros. No usar serif en instrucciones pequeñas ni pesos finos.',
         screen='Video de la mano al centro, título amplio y pasos en bloques generosos. Cada paso incluye una referencia temporal visible. Las medidas informales se abren como una imagen del gesto, sin conversión numérica. Botón de grabación en barro; preguntas en ciruela con icono y texto.',
         demo='Fondo de manta, símbolo en barro y título grande: “Some recipes were never written.” Debajo, Handful Recipes. Un recorte amplio del gesto de un puñito aporta el vínculo con el producto; el texto va en un área sólida separada del video.',
         risk='Puede parecer marca de cerámica o restaurante si domina el cuenco. Mantener cerca el lenguaje de clips, familia y memoria; evitar superficies envejecidas y ornamentos rústicos.',
         copy=['Record a family recipe','One detail to ask: how do you know it’s ready?','Your family’s first recipe starts with a conversation.'],
         colors=['Barro cocido','Hoja de laurel','Comal dorado','Manta','Tinta de cacao','Ciruela por preguntar'],
         light=dict(primary='#93452F',secondary='#47604A',accent='#7A5521',bg='#FCF7EF',text='#2D2621',pending='#725276'),
         dark=dict(primary='#EBA38B',secondary='#A9C7AC',accent='#E2BE7D',bg='#211C19',text='#F8EEDF',pending='#D8B3DC')),
    dict(id='archivo', name='Archivo de sobremesa', line='La voz también se hereda.',
         titlefont='Source Serif 4', bodyfont='Source Sans 3',
         idea='Parte de los recetarios con anotaciones y las fotografías familiares. Un puñito se conserva como evidencia visual junto a la voz de quien lo usa. El archivo se siente vivo: tiene personas, preguntas y continuidad, no solo documentos.',
         logo='Símbolo en retícula de 24: dos hojas superpuestas, la posterior desplazada 3 unidades arriba y a la derecha. La hoja frontal es un rectángulo de 13×16 con esquinas de 2; tres cápsulas cortas dentro evocan anotaciones e ingredientes. Una esquina superior queda abierta como detalle propio. Trazo de 2 unidades. Wordmark en Source Serif 4 semibold con Recipes en Source Sans 3. A 48 px se mantiene una hoja y tres marcas; la segunda hoja se simplifica a un ángulo.',
         typography='Source Serif 4 600 aporta el ritmo editorial de un recetario, mientras Source Sans 3 400/600 hace legibles listas y controles. La relación entre ambas evita mezclar demasiadas voces.',
         screen='Cabecera con nombre de la receta, persona que la comparte y fecha de la grabación. Video tratado como pieza principal del archivo. Los pasos aparecen como fichas numeradas con acceso al clip; preguntas y respuestas forman un historial familiar.',
         demo='Composición editorial con margen ancho, una fotografía familiar autorizada a un lado y el título “Keep the recipe. Keep the voice.” sobre papel claro. Número de receta y nombre de la persona dan carácter documental.',
         risk='Puede sentirse demasiado solemne o parecido a una biblioteca. Usar imágenes actuales, acciones visibles y espacio para nuevas respuestas; evitar cursivas manuscritas difíciles de leer.',
         copy=['Save their way of cooking','A little more to remember: what goes in next?','A place for the recipes only your family knows.'],
         colors=['Tinta de mora','Salvia de patio','Lacre','Papel de casa','Grafito','Mostaza de nota'],
         light=dict(primary='#554275',secondary='#52645A',accent='#8D493B',bg='#FAF8F3',text='#282431',pending='#7B5B19'),
         dark=dict(primary='#C8B5E9',secondary='#B6CDBD',accent='#EEB3A2',bg='#201D26',text='#F2EDF7',pending='#EAC77F')),
    dict(id='frontera', name='Luz de frontera', line='De esta cocina, para donde esté tu familia.',
         titlefont='Bricolage Grotesque', bodyfont='DM Sans',
         idea='Nace de la luz baja sobre el adobe y de familias cuya cocina viaja entre ciudades e idiomas. La mano se convierte en paisaje: un arco bajo contiene tres semillas. El origen norteño se expresa mediante luz y proporciones, sin iconografía turística ni banderas.',
         logo='En 24×24, un arco de (5,14) a (19,14) con cima en y=6 queda apoyado sobre una línea horizontal en y=18; tres semillas ovales se sitúan entre arco y línea. Trazo de 2 unidades y extremos redondos. El arco sugiere palma y horizonte. Handful en Bricolage Grotesque 600, Recipes en DM Sans 500. Ícono con símbolo único a 48 px, sin paisaje detallado ni degradado.',
         typography='Bricolage Grotesque 600 da personalidad en una portada breve; DM Sans estabiliza lectura y uso cotidiano. La expresividad se concentra en títulos, conservando altura cómoda y tamaño generoso en instrucciones.',
         screen='Encuadres horizontales de manos e ingredientes, título compacto y navegación bilingüe opcional según preferencia explícita. Los tiempos de clip se distinguen con verde mezquite; preguntas en violeta con etiqueta. Sin traducción automática que sustituya la voz original.',
         demo='Plano dividido entre fondo adobe claro y una captura auténtica del video familiar. Título en vino: “A handful of home.” Una línea de horizonte organiza la composición; la marca queda legible incluso en miniatura.',
         risk='Puede limitarse visualmente al norte de México o convertirse en marca de viajes. Dar protagonismo a historias familiares diversas y usar el paisaje como estructura discreta, no como tema de cada pantalla.',
         copy=['Bring a recipe home','Ask them: what does “a handful” look like?','Home has a flavor. Start saving yours.'],
         colors=['Vino del ocaso','Mezquite','Cobre de tarde','Adobe de luz','Sombra del patio','Violeta de pregunta'],
         light=dict(primary='#773C52',secondary='#52613A',accent='#9B4726',bg='#FFF8EE',text='#30262B',pending='#665198'),
         dark=dict(primary='#E8A2B7',secondary='#B6C991',accent='#F6B28B',bg='#241D25',text='#FFF1E3',pending='#C7B5F1')),
    dict(id='minima', name='El gesto esencial', line='Cada paso conserva su origen.',
         titlefont='Manrope', bodyfont='DM Sans',
         idea='Parte de un puñito como unidad humana: algo concreto que no necesita fingir exactitud. Cinco módulos se reúnen en una sola figura, como ingredientes, clips y recuerdos que se vuelven una receta. Tecnología discreta con evidencia a la vista.',
         logo='Símbolo de cinco módulos sólidos en retícula 24: tres cápsulas verticales de ancho 3 en x=5,10,15, escalonadas en altura; una curva ancha inferior las recoge y una cápsula corta oblicua marca el pulgar. Construir como silueta de una mano recogida, con separaciones mínimas de 2 unidades. Sin líneas interiores. Wordmark Manrope 650; Recipes en DM Sans 500. A 48 px se conservan cinco módulos; a 24 se funden las dos piezas inferiores en una base.',
         typography='Manrope 600/650 ofrece títulos nítidos y una marca compacta; DM Sans 400/500 aporta familiaridad a lectura larga y mensajes. La diferencia entre fuentes es sutil: el peso, espacio y tamaño sostienen la jerarquía.',
         screen='Tarjetas simples, video grande y un paso activo con vínculo al segundo exacto de la grabación. Una etiqueta expresa “Shown in the video” o “Ask your family”. La información inferida nunca se presenta como medida confirmada.',
         demo='Fondo marfil, símbolo verde y gran título “Family recipes, with every step remembered.” Tres bloques estáticos muestran video, paso y pregunta. La marca deja claro el producto antes de introducir modelos o arquitectura.',
         risk='Puede parecer una app de notas o productividad. El gesto de la mano, la voz original y fotografías familiares deben aportar identidad; evitar interfaces excesivamente clínicas.',
         copy=['Start a recipe recording','One question for your family','Your first family recipe belongs here.'],
         colors=['Verde de casa','Hilo malva','Canela','Marfil fresco','Tinta de hoja','Ámbar de conversación'],
         light=dict(primary='#245D56',secondary='#62516D',accent='#8B4931',bg='#F5F8F4',text='#20312D',pending='#785B1F'),
         dark=dict(primary='#91CABB',secondary='#C9B5D4',accent='#EDB49B',bg='#172622',text='#EAF3EB',pending='#E3C17A')),
]

roles = ['primary','secondary','accent','bg','text','pending']
role_names = ['Primario: acciones principales','Secundario: metadatos y navegación','Acento: énfasis puntual','Neutro: fondo','Neutro: texto','Estado: pregunta pendiente']

def luminance(h):
    rgb = [int(h[i:i+2],16)/255 for i in (1,3,5)]
    linear = [v/12.92 if v <= .04045 else ((v+.055)/1.055)**2.4 for v in rgb]
    return sum(v*w for v,w in zip(linear,(.2126,.7152,.0722)))

def contrast(a,b):
    x,y=sorted((luminance(a),luminance(b)))
    return (y+.05)/(x+.05)

rows=[]
for c in concepts:
    for mode in ['light','dark']:
        p=c[mode]
        for role in ['text','primary','secondary','accent','pending']:
            ratio=contrast(p[role],p['bg'])
            rows.append(dict(concept=c['name'],mode=mode,pair=f'{role}/bg',foreground=p[role],background=p['bg'],ratio=round(ratio,6),AA_normal=ratio>=4.5))
        ratio=contrast(p['bg'],p['primary'])
        rows.append(dict(concept=c['name'],mode=mode,pair='button-label/primary',foreground=p['bg'],background=p['primary'],ratio=round(ratio,6),AA_normal=ratio>=4.5))
assert all(r['AA_normal'] for r in rows)
with (OUT/'contrast-wcag.csv').open('w',encoding='utf-8',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
(OUT/'source-colors.json').write_text(json.dumps(concepts,ensure_ascii=False,indent=2),encoding='utf-8')

md=['# Handful Recipes — cuatro direcciones de identidad',
    'Fecha: 27 de octubre de 2026. Propuestas originales para selección, no marca definitiva ni aprobación del usuario.',
    '## Fundamento común',
    'Preservar recetas familiares grabadas: pasos ligados a clips, medidas informales mostradas visualmente y preguntas para completar con la persona que cocina. Origen en Ciudad Juárez y familias bilingües. La promesa es conservar una manera de cocinar y su voz, sin inventar precisión.',
    'Las cuatro direcciones evitan azul Meta, infinito, chef, cubiertos cruzados y folclor decorativo genérico. Los símbolos son bocetos vectoriales de exploración: requieren refinamiento óptico y comprobación de similitud/marca antes de adopción.',
    '## Reglas de accesibilidad',
    '48/48 pares sólidos de color pasan AA de texto normal en esta auditoría: texto, primario, secundario, acento y pendiente contra fondo, más etiqueta de botón contra primario, en ambos modos. Cada ratio se calculó mediante luminancia relativa sRGB; la comparación usa el valor sin redondear. No equivale a certificar WCAG de toda una app. No se calculó APCA.',
    'Usar el color de fondo como etiqueta en botones primarios; no sustituirlo por blanco por costumbre. En oscuro, los botones son claros con etiqueta oscura. Los colores de estado se acompañan de icono y texto. El acento ocupa áreas pequeñas, no informa estados por sí solo. No combinar arbitrariamente primario, secundario y acento entre sí.',
    'Texto de lectura sugerido: 18 px y altura de línea 1.5; ofrecer aumento. Controles de captura sugeridos: 48 px de alto o más, etiqueta explícita y foco visible. No escribir sobre imágenes sin un panel sólido auditado. Las imágenes de ejemplo de la lámina son ilustraciones, no videos familiares reales.',
    'Contraste de texto: [W3C 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html). Componentes y gráficos: [W3C 1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html).',
    ]
for i,c in enumerate(concepts,1):
    md += [f"## {i}. {c['name']}",f"**{c['line']}**",f"**Idea:** {c['idea']}",f"**Logotipo e ícono:** {c['logo']}",
           '| Rol | Nombre | Claro | Oscuro |','| --- | --- | --- | --- |']
    for role,label,name in zip(roles,role_names,c['colors']):
        md.append(f"| {label} | {name} | `{c['light'][role]}` | `{c['dark'][role]}` |")
    md += ['### Contrastes', '| Modo | Texto/fondo | Primario/fondo | Secundario/fondo | Acento/fondo | Pendiente/fondo | Etiqueta/botón |','| --- | ---: | ---: | ---: | ---: | ---: | ---: |']
    for mode,label in [('light','Claro'),('dark','Oscuro')]:
        selected=[r for r in rows if r['concept']==c['name'] and r['mode']==mode]
        md.append('| '+label+' | '+' | '.join(f"{r['ratio']:.2f}:1 AA" for r in selected)+' |')
    md += [f"**Tipografía:** {c['typography']}",
           f"[Títulos: {c['titlefont']}](https://fonts.google.com/specimen/{c['titlefont'].replace(' ','+')}) · [Texto: {c['bodyfont']}](https://fonts.google.com/specimen/{c['bodyfont'].replace(' ','+')}) — fuentes disponibles gratuitamente en Google Fonts. Verificar archivos y licencias al integrarlas; alojar localmente en producción.",
           '**Microcopy en inglés:**',f"- Grabar: “{c['copy'][0]}”",f"- Pendiente: “{c['copy'][1]}”",f"- Vacío: “{c['copy'][2]}”",
           f"**Pantalla de receta:** {c['screen']}",f"**Tarjeta del video:** {c['demo']}",f"**Riesgo:** {c['risk']}"]
md += ['## Comparación y recomendación',
       'Evaluación cualitativa de dirección de arte, no resultados de pruebas con usuarios ni predicción del jurado. Escala 1–5; la legibilidad presupone los tamaños y usos indicados.',
       '| Concepto | Calidez | Modernidad | Legibilidad | Memorabilidad | Impacto en demo |',
       '| --- | ---: | ---: | ---: | ---: | ---: |',
       '| Cuenco de barro | 5 | 4 | 5 | 4 | 5 |',
       '| Archivo de sobremesa | 5 | 3 | 5 | 4 | 4 |',
       '| Luz de frontera | 4 | 4 | 5 | 5 | 5 |',
       '| El gesto esencial | 4 | 5 | 5 | 3 | 4 |',
       '**Recomendación: Cuenco de barro.** Vincula de forma directa el nombre, el gesto de medir y el propósito familiar. Tiene suficiente carácter para una portada y deja respirar la evidencia en la app. Para un jurado técnico, puede facilitar comprender la propuesta antes de explicar cómo funcionan los modelos; no hay evidencia de que una estética específica favorezca la puntuación.',
       'Para el usuario real, conservar lenguaje directo, rostros y voz originales es más importante que aumentar texturas. Usar el concepto completo sin mezclar paletas. Si se desea una identidad que destaque por origen y expansión bilingüe, Luz de frontera es la segunda opción.',
       '## Próximo paso',
       'Elegir una dirección antes de construir la escala 50–950 y tokens de producción. source-colors.json contiene las cuatro propuestas con roles y modos; no es todavía una escala completa. contrast-wcag.csv guarda la auditoría reproducible. La lámina HTML incluye modo claro/oscuro, símbolos de exploración a 48 px y maquetas estáticas de receta y portada; no es una app ni un video renderizado.'
       ]
(OUT/'IDENTIDAD_VISUAL.md').write_text('\n\n'.join(md),encoding='utf-8')

def logo_svg(kind):
    paths={
        'barro':'<path d="M5 11C5 22 19 22 19 11"/><ellipse cx="8" cy="8" rx="1" ry="1.5"/><ellipse cx="12" cy="6" rx="1" ry="1.5"/><ellipse cx="16" cy="8" rx="1" ry="1.5"/>',
        'archivo':'<path d="M8 5V3h13v16h-2M16 5H4v16h13V9"/><path d="M8 10h5M8 14h3M8 18h5"/>',
        'frontera':'<path d="M5 14C5 3 19 3 19 14M4 18h16"/><ellipse cx="8" cy="14" rx=".8" ry="1"/><ellipse cx="12" cy="12" rx=".8" ry="1"/><ellipse cx="16" cy="14" rx=".8" ry="1"/>',
        'minima':'<path fill="currentColor" stroke="none" d="M5 8a1.5 1.5 0 0 1 3 0v6H5zm5-3a1.5 1.5 0 0 1 3 0v9h-3zm5 2a1.5 1.5 0 0 1 3 0v7h-3zM5 16h13c0 7-13 7-13 0zm14-3 2-3a1.5 1.5 0 0 1 2 2l-3 4z"/>',
    }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[kind]+'</svg>'

blocks=[]
for i,c in enumerate(concepts,1):
    styles=';'.join(f'--{k}:{v}' for k,v in c['light'].items())
    logo=logo_svg(c['id'])
    swatches=''.join(f'<div class="swatch"><span style="background:var(--{r});color:var(--bg)" class="dot"></span><b>{html.escape(n)}</b><code data-role="{r}">{c["light"][r]}</code></div>' for r,n in zip(roles,c['colors']))
    checks=' · '.join(f'{r}: {contrast(c["light"][r],c["light"]["bg"]):.2f}:1' for r in ['text','primary','accent'])
    blocks.append(f'''<section class="concept" id="{c['id']}" style="{styles};--title:'{c['titlefont']}';--body:'{c['bodyfont']}' aria-labelledby="title-{c['id']}">
    <div class="intro"><span class="eyebrow">DIRECCIÓN 0{i}</span><h2 id="title-{c['id']}">{c['name']}</h2><p class="line">{c['line']}</p><p>{c['idea']}</p><div class="brand"><div class="appicon">{logo}</div><div class="wordmark">Handful<span>RECIPES</span></div><div class="tinyicon">{logo}</div><small>48 px / 24 px</small></div><p class="fontnote">{c['titlefont']} + {c['bodyfont']}</p></div>
    <div class="work"><div class="phone"><div class="phonehead"><span>Handful Recipes</span><span>＋</span></div><div class="video" aria-label="Ilustración de marcador para video familiar"><svg viewBox="0 0 320 160" aria-hidden="true"><path d="M20 135h280M90 88c0 73 140 73 140 0M90 88h140M128 55c-10-15 14-19 4-35M160 55c-10-15 14-19 4-35M192 55c-10-15 14-19 4-35" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="160" cy="90" r="18" fill="var(--bg)"/><path d="m156 81 13 9-13 9z" fill="currentColor"/></svg><span>VIDEO FAMILIAR · VISTA DE DISEÑO</span></div><div class="recipe"><span class="eyebrow">DE LA COCINA DE ELENA</span><h3>Frijoles de la casa</h3><p>Her way. In her own words.</p><div class="step"><b>01 · Un puñito de sal</b><a href="#title-{c['id']}">Ver el gesto · 00:42 ↗</a><p>Keep the measure as she showed it.</p></div><div class="question"><b>? · Question to ask</b><p>{c['copy'][1]}</p></div><button type="button" class="record">{c['copy'][0]}</button></div></div><div class="demo"><div class="brand small">{logo}<span>Handful Recipes</span></div><h3>{['Some recipes<br>were never written.','Keep the recipe.<br>Keep the voice.','A handful<br>of home.','Family recipes,<br>with every step remembered.'][i-1]}</h3><span class="eyebrow">FROM A HANDFUL TO A FAMILY STORY</span></div><div class="demo-note">Maqueta de portada 16:9 · sin render de video</div></div>
    <div class="palette">{swatches}</div><p class="audit" data-audit="{c['id']}">{checks} · AA</p><details><summary>Concepto, voz y aplicación</summary><p><b>Símbolo.</b> {c['logo']}</p><p><b>Pantalla.</b> {c['screen']}</p><p><b>Portada.</b> {c['demo']}</p><p><b>Estado vacío.</b> {c['copy'][2]}</p><p><b>Riesgo.</b> {c['risk']}</p></details></section>''')

css='''
*{box-sizing:border-box}body{margin:0;background:#f3f0eb;color:#282431;font:17px/1.55 "DM Sans",sans-serif}header{max-width:1400px;margin:auto;padding:60px 36px 30px}header h1{font:600 clamp(38px,5vw,72px)/1.05 Manrope,sans-serif;letter-spacing:-3px;max-width:900px;margin:18px 0}header p{max-width:780px}nav{display:flex;gap:10px;flex-wrap:wrap;margin-top:26px}nav a,.toggle{color:#282431;border:1px solid #62516D;padding:10px 16px;background:#FAF8F3;border-radius:30px;text-decoration:none;font:600 15px "DM Sans",sans-serif}.toggle{cursor:pointer}nav a:focus-visible,button:focus-visible,summary:focus-visible,a:focus-visible{outline:3px solid currentColor;outline-offset:4px}main{max-width:1400px;margin:auto;padding:0 24px 50px}.concept{background:var(--bg);color:var(--text);border-radius:28px;margin:28px 0;padding:38px;display:grid;grid-template-columns:.85fr 1.15fr;gap:30px;font-family:var(--body),sans-serif;border:1px solid var(--secondary)}.intro p{max-width:490px}.eyebrow{font:600 11px/1.5 var(--body),sans-serif;letter-spacing:1.8px;color:var(--secondary)}h2,h3{font-family:var(--title),serif;letter-spacing:-1px}h2{font-size:44px;line-height:1.08;color:var(--primary);margin:12px 0 18px}.line{font-size:22px;color:var(--primary)}.brand{display:flex;align-items:center;gap:14px;margin-top:32px;color:var(--primary)}.appicon{width:48px;height:48px;flex-shrink:0;border-radius:13px;background:var(--primary);color:var(--bg);padding:7px}.appicon svg{width:34px;height:34px}.tinyicon{width:24px;height:24px;margin-left:8px}.tinyicon svg{width:24px;height:24px}.brand small{font-size:12px}.wordmark{font:600 36px/.95 var(--title),sans-serif;letter-spacing:-1px}.wordmark span{display:block;font:600 10px var(--body),sans-serif;letter-spacing:4px;margin-top:8px}.fontnote{color:var(--secondary);font-size:14px}.work{display:grid;grid-template-columns:280px 1fr;gap:20px;align-items:start}.phone{border:2px solid var(--text);border-radius:30px;overflow:hidden;background:var(--bg);max-width:280px}.phonehead{display:flex;justify-content:space-between;font-size:13px;font-weight:600;padding:16px 17px}.video{border-block:1px solid var(--secondary);color:var(--primary);padding:8px 0;text-align:center}.video svg{width:100%;height:125px;display:block}.video span{font-size:8px;letter-spacing:1px;color:var(--secondary)}.recipe{padding:17px}.recipe h3{font-size:28px;line-height:1.1;color:var(--primary);margin:8px 0}.recipe p{font-size:14px;margin:8px 0 16px}.step{border-block:1px solid var(--secondary);padding:14px 0;font-size:15px}.step a{display:block;color:var(--secondary);font-size:14px;margin-top:6px;text-underline-offset:3px}.step p{margin-bottom:0}.question{color:var(--pending);padding-top:14px}.question b{font-size:14px}.question p{margin-bottom:14px}.record{background:var(--primary);color:var(--bg);border:0;border-radius:12px;min-height:48px;width:100%;padding:10px;font:600 14px var(--body),sans-serif}.demo{aspect-ratio:16/9;border:1px solid var(--secondary);border-radius:15px;grid-column:2;grid-row:1;align-self:center;padding:18px;min-width:0;background:var(--bg)}.demo h3{font-size:clamp(18px,2.1vw,30px);line-height:1.1;color:var(--primary);margin:20px 0}.brand.small{margin:0;gap:7px;font:600 11px var(--body),sans-serif}.brand.small svg{width:24px;height:24px}.demo .eyebrow{font-size:8px;letter-spacing:1px}.demo-note{font-size:11px;color:var(--secondary);grid-column:2;margin-top:-20px}.palette{display:grid;grid-template-columns:repeat(6,1fr);grid-column:1/-1;gap:14px}.swatch{display:flex;flex-direction:column;font-size:12px;gap:4px}.swatch .dot{height:42px;border:1px solid var(--secondary);border-radius:8px;display:block}.swatch b{line-height:1.3;min-height:30px}.swatch code{color:var(--secondary)}.audit{grid-column:1/-1;margin:0;font-size:13px;color:var(--secondary)}details{grid-column:1/-1;font-size:15px;border-top:1px solid var(--secondary);padding-top:16px}summary{cursor:pointer;color:var(--primary);font-weight:600;min-height:30px}details p{max-width:1000px}.footer{padding:30px 36px 70px;max-width:1400px;margin:auto}a{color:inherit}.footer p{max-width:950px}table{border-collapse:collapse;width:100%;font-size:15px}th,td{text-align:left;padding:12px;border-bottom:1px solid #62516D}@media(max-width:1150px){.work{grid-template-columns:1fr}.demo{grid-column:1;grid-row:auto;width:100%}.demo-note{grid-column:1;margin:0}.phone{margin:auto}.concept{grid-template-columns:1fr 1fr}}@media(max-width:720px){header{padding:32px 22px}header h1{letter-spacing:-1.5px}.concept{grid-template-columns:1fr;padding:24px;gap:20px}main{padding:0 12px}.work{grid-template-columns:1fr 1fr;gap:12px}.phone{max-width:280px;width:100%;grid-column:1/-1}.demo{grid-column:1/-1}.demo h3{font-size:32px}.demo-note{grid-column:1/-1}.palette{grid-template-columns:repeat(3,1fr)}h2{font-size:36px}.footer{padding:20px}.footer table{font-size:12px}th,td{padding:6px}}
'''
doc='''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Handful Recipes — cuatro identidades</title><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600&family=DM+Sans:wght@400;500;600&family=Fraunces:wght@600&family=Manrope:wght@400;600;650&family=Source+Sans+3:wght@400;600&family=Source+Serif+4:wght@600&display=swap" rel="stylesheet"><style>'''+css+'''</style></head><body><header><span>HANDFUL RECIPES / ESTUDIO DE IDENTIDAD / 01</span><h1>Un puñito.<br>Toda una historia.</h1><p>Cuatro maneras de preservar la voz, el gesto y las recetas que una familia comparte. Propuestas de identidad; las ilustraciones sustituyen material familiar todavía no proporcionado.</p><nav aria-label="Direcciones de identidad"><button class="toggle" id="mode" type="button" aria-pressed="false">Ver modo oscuro</button>'''+''.join(f'<a href="#{c["id"]}">{c["name"]}</a>' for c in concepts)+'''</nav></header><main>'''+''.join(blocks)+'''</main><div class="footer"><h2>La dirección recomendada: Cuenco de barro.</h2><p>El nombre, la medida hecha con la mano y el propósito familiar se conectan con pocos elementos. Luz de frontera ofrece la alternativa más ligada al origen. La recomendación es de diseño; no predice preferencias del jurado.</p><table><thead><tr><th>Concepto</th><th>Calidez</th><th>Modernidad</th><th>Legibilidad</th><th>Memorabilidad</th><th>Demo</th></tr></thead><tbody><tr><td>Cuenco de barro</td><td>5</td><td>4</td><td>5</td><td>4</td><td>5</td></tr><tr><td>Archivo de sobremesa</td><td>5</td><td>3</td><td>5</td><td>4</td><td>4</td></tr><tr><td>Luz de frontera</td><td>4</td><td>4</td><td>5</td><td>5</td><td>5</td></tr><tr><td>El gesto esencial</td><td>4</td><td>5</td><td>5</td><td>3</td><td>4</td></tr></tbody></table><p>Escala cualitativa 1–5. Auditoría: 48/48 pares sólidos pasan AA de texto normal. No certifica la interfaz completa. Sin APCA. Tipografías de Google Fonts; requieren conexión para mostrarse en esta lámina. Consulta el documento y CSV adjuntos para especificaciones.</p></div><script>
const concepts='''+json.dumps(concepts,ensure_ascii=False)+''';
let dark=false;
const lum=h=>{const a=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));return a[0]*.2126+a[1]*.7152+a[2]*.0722;};
const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
document.getElementById('mode').addEventListener('click',()=>{dark=!dark;const btn=document.getElementById('mode');btn.textContent=dark?'Ver modo claro':'Ver modo oscuro';btn.setAttribute('aria-pressed',String(dark));concepts.forEach(c=>{const s=document.getElementById(c.id),p=c[dark?'dark':'light'];Object.entries(p).forEach(([k,v])=>s.style.setProperty('--'+k,v));s.querySelectorAll('[data-role]').forEach(n=>n.textContent=p[n.dataset.role]);s.querySelector('[data-audit]').textContent=['text','primary','accent'].map(k=>k+': '+ratio(p[k],p.bg).toFixed(2)+':1').join(' · ')+' · AA';});});
</script></body></html>'''
(OUT/'comparativa.html').write_text(doc,encoding='utf-8')
print(json.dumps({'output':str(OUT),'pairs':len(rows),'AA_pass':sum(r['AA_normal'] for r in rows),'min_ratio':round(min(r['ratio'] for r in rows),2)},ensure_ascii=False))
for c in concepts:
    print(c['name'],[(m, [round(contrast(c[m][r],c[m]['bg']),2) for r in ['text','primary','accent']]) for m in ['light','dark']])
