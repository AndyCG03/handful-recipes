from pathlib import Path
from PIL import Image
import json
import shutil
import zipfile

root=Path(__file__).resolve().parent
kit=root/'kit-cuenco-de-barro-v1'
record=json.loads((kit/'generation-record.json').read_text(encoding='utf-8'))
manifest=[]
for item in record['selected']:
    dest=kit/(item['id']+'.png')
    if dest.exists():
        raise FileExistsError(dest)
    shutil.copy2(item['source'],dest)
    with Image.open(dest) as im:
        im.verify()
    with Image.open(dest) as im:
        alpha=im.getchannel('A').getextrema() if 'A' in im.getbands() else None
        manifest.append(dict(file=dest.name,width=im.width,height=im.height,format=im.format,mode=im.mode,alpha_extrema=alpha,bytes=dest.stat().st_size,use=item['use']))
(kit/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
lines=['# Handful Recipes — kit Cuenco de barro v1','',
       'Identidad elegida por el usuario. Recursos generados con image_gen a partir de la primera propuesta aprobada. Todos los recursos gráficos finales son PNG a resolución nativa, sin reescalado artificial.','',
       '| Archivo | Tamaño nativo | Uso |','| --- | --- | --- |']
for m in manifest:
    lines.append(f"| {m['file']} | {m['width']} × {m['height']} px | {m['use']} |")
lines += ['', '## Uso',
          '- Logo principal y monocromático: conservar el fondo manta y las proporciones. No estirar ni recortar el margen de protección.',
          '- Logo oscuro: usar su fondo cacao; no confundirlo con una versión transparente.',
          '- Icono de app: fuente cuadrada para exportaciones de plataforma posteriores. No incluye todas las densidades ni máscaras exigidas por iOS/Android.',
          '- Símbolo/avatar: versión sin texto sobre manta para perfiles y miniaturas.',
          '- Fondo horizontal y patrón: decoración de áreas amplias; no poner texto directamente sobre motivos sin comprobar contraste.',
          '- Portada: imagen estática para presentar el demo, no un video renderizado.',
          '- La referencia aprobada incluye fotografía generada y una interfaz conceptual; no representa recetas o usuarios reales.',
          '', '## Colores fuente y tipografías',
          'Primario #93452F; secundario #47604A; acento #7A5521; fondo #FCF7EF; texto #2D2621; pregunta pendiente #725276.',
          'Modo oscuro: fondo #211C19, texto #F8EEDF y primario #EBA38B. Familias de referencia para interfaz: Fraunces y DM Sans, disponibles en Google Fonts. Los wordmarks generados son arte raster y no constituyen archivos tipográficos.',
          '', '## Calidad y límites',
          'Se revisaron visualmente las salidas y se verificó lectura PNG, dimensiones y canal alfa. Los intentos de logo transparente mostraron defectos de borde y se excluyeron. Los PNG finales se entregan con fondo opaco. No son archivos vectoriales ni exportaciones 4K; manifest.json registra el tamaño real de cada recurso. Los colores de los píxeles generados pueden variar respecto a los HEX fuente: utilizar los HEX para construir la interfaz, sin muestrear la imagen como sustituto de tokens.',
          'El patrón no está certificado como mosaico continuo. La composición de letras y símbolo puede presentar variaciones ópticas entre variantes; conservar 01-logo-principal-manta.png como referencia principal. No se certifica accesibilidad de interfaces a partir de estas imágenes.',
          '', '## Procedencia',
          'generation-record.json conserva prompts, referencias y rutas de origen; manifest.json contiene inventario y tamaños. Solo los recursos seleccionados se incluyeron en este kit.']
(kit/'LEEME.md').write_text('\n'.join(lines),encoding='utf-8')
archive=root/'Handful-Recipes-Cuenco-de-Barro-PNG-v1.zip'
if archive.exists():
    raise FileExistsError(archive)
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED) as z:
    for p in sorted(kit.iterdir()):
        if p.is_file():
            z.write(p,arcname='Handful-Recipes-Cuenco-de-Barro/'+p.name)
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
print(json.dumps({'archive':str(archive),'png_count':len(manifest),'archive_bytes':archive.stat().st_size,'resources':manifest},ensure_ascii=False))
