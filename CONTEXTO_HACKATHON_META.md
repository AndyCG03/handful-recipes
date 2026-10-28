# Contexto de trabajo — Meta Global AI Developer Hackathon 2026

Guardado el 27 de octubre de 2026. Este documento conserva el contexto para continuar el proyecto en esta carpeta.

## Fuentes y alcance

- Fuente principal de esta actualización: Participant Guide proporcionada por el usuario. Copia íntegra: `docs/meta-participant-guide-original.txt`.
- Investigación web anterior: https://cerebralvalley.ai/e/meta-ai-developer-hackathon y https://dev.meta.ai/events/global-hackathon.
- Reglas consultadas anteriormente: https://cerebralvalley.ai/e/meta-ai-developer-hackathon/waiver.
- Esta actualización analiza el texto entregado; no constituye una nueva verificación en línea de sus enlaces o de cambios posteriores.
- La guía precisa información que antes no se podía confirmar públicamente. Ante diferencias, conservar ambas versiones y consultar los anuncios o reglas oficiales vigentes antes de tomar decisiones de elegibilidad o entrega.
- El pegado contiene `[table]` y `[linkEmbed]`: faltan las tablas y algunos elementos incrustados. No inventar sus contenidos.

## Estado del proyecto y del usuario

- Brief actual proporcionado por el usuario: **Handful Recipes**, aplicación para preservar recetas familiares desde video y voz; pasos ligados a clips, medidas informales visuales sin inventar gramos y preguntas para completar con la familia por WhatsApp. Origen Ciudad Juárez, familias bilingües. El usuario eligió la primera identidad marrón, **Cuenco de barro**, y solicitó recursos de identidad en PNG con la mejor calidad posible.
- Kit creado: `docs/handful-recipes/kit-cuenco-de-barro-v1/`; ZIP: `docs/handful-recipes/Handful-Recipes-Cuenco-de-Barro-PNG-v1.zip`. Nueve PNG seleccionados: logo principal, oscuro y monocromático, icono de app, símbolo/avatar, patrón, fondo, portada y referencia aprobada. Dimensiones nativas registradas en manifest.json. Intentos transparentes excluidos por defectos; recursos finales con fondos opacos. Prompts y límites guardados en el kit. No son vectores ni exportaciones 4K.
- Propuestas visuales: `docs/handful-recipes/IDENTIDAD_VISUAL.md`; lámina comparativa: `docs/handful-recipes/comparativa.html`; colores por modo: `docs/handful-recipes/source-colors.json`; auditoría WCAG: `docs/handful-recipes/contrast-wcag.csv`. Cuatro conceptos originales, no marca aprobada ni escala completa. 48/48 pares declarados pasan AA normal; APCA no calculado. La previsualización visual en navegador no pudo completarse por restricciones de acceso local.

- La hackathon está en curso según el calendario publicado.
- El usuario solicitó investigar el evento y guardar esta guía como contexto.
- El usuario confirma que ya tiene los créditos (actualización del 27 de octubre de 2026).
- En el formulario de entrega se observaron Devisi Coder como nombre de equipo, Andy Clemente/andycg como miembro e Indie Developer Track seleccionado. No se modificaron ni enviaron esos campos.
- No están confirmados: aceptación explícita, equipo completo, idea, modelos habilitados ni proyecto implementado.
- No se han enviado solicitudes, aceptado acuerdos, ingresado tarjetas ni publicado código.

## Requisitos confirmados por la guía

1. El proyecto debe incorporar modelos de Meta mediante Meta Model API y/o modelos de pesos abiertos de Meta.
2. Debe responder a una temática: **Build for Your World** (problema conocido de primera mano) o **Push the Frontier** (nuevas capacidades técnicas, científicas o del mundo físico).
3. Repositorios obligatoriamente públicos. La guía lo llama «Open source», pero no especifica aquí una licencia concreta.
4. Máximo cuatro participantes por equipo; se permite participar solo. La formulación general de la guía abarca equipos y startups.
5. Una entrega de proyecto por equipo o startup, realizada por un representante autorizado. Incluir a todas las personas que trabajaron en él.
6. Video de demostración de tres minutos, con enlace accesible.
7. La demo debe destacar exclusivamente funcionalidades, código y características construidas durante la hackathon. Identificar claramente las contribuciones nuevas; no hacerlo puede causar descalificación inmediata a discreción del jurado.
8. Startups pueden partir de productos o código existentes, pero deben distinguir lo desarrollado durante el evento.
9. Verificar acceso público al repositorio y acceso al video. La guía menciona código, video y producto en vivo como artefactos de evaluación, pero no detalla requisitos de hosting.
10. Las entregas tardías no se consideran.

## Restricciones y ejemplos a evitar

La guía descalifica proyectos que infrinjan políticas legales, éticas o de plataformas, o utilicen código, datos o recursos sin derechos de uso.

Su lista no exhaustiva de «Sample Anti-Projects» combina ideas genéricas y posibles infracciones. La instrucción operativa es evitarlas; el texto no permite asegurar que todas compartan exactamente el mismo motivo de exclusión:

- IA que genere consejo médico, como asesor de salud mental o detector de lesiones de piel.
- RAG básico; analizadores simples de imágenes; chatbots educativos simples.
- Filtro de postulaciones laborales con IA.
- Asesor de nutrición o analizador de personalidad.
- Analizadores o entrenadores deportivos.
- Cualquier proyecto político o relacionado con la guerra.

Implicación para elegir proyecto: buscar una solución específica con un flujo completo y valor demostrable; no presentar una integración genérica como propuesta central. Consultar dudas de encaje en Discord antes de invertir trabajo importante.

## Calendario

La guía indica que todos los horarios están en Eastern Time (ET). La entrega también aparece como EST; el 4 de noviembre ambas lecturas coinciden con la hora estándar del Este.

| Fecha de 2026 | Hora ET | Actividad |
| --- | --- | --- |
| 26 oct | 12:00 | Kickoff: reglas, premios, evaluación y apertura |
| 27 oct | 12:00–12:30 | Agents 101: Build a Multimodal AI Agent — Suraj Subramanian |
| 28 oct | 12:00–12:30 | Agents 102: Best Practices for Verifiable Agents — Yash Khare |
| 30 oct | 12:00–12:30 | Building Specialized Intelligence on Fireworks: From Inference to Training with Muse Open Models — Sinan Ozdemir |
| Días hábiles del período de construcción | 10:00–11:00 | Office hours por texto en Discord, sin transmisión ni videollamada |
| 3 nov | Sin hora indicada | Último día completo para preguntas de entrega y resolución técnica |
| 4 nov | 21:00 | Límite de entrega; la guía también menciona office hours finales en esa entrada |
| 5–8 nov | — | Evaluación según la guía |
| 9 nov | 12:00 | Cierre, anuncio de diez finalistas (cinco por categoría), evaluación final, ganadores y apertura del voto comunitario |
| 16 nov | — | Anuncio del ganador comunitario en Discord |

- Período de construcción escrito en la guía: 27 oct–4 nov. Kickoff: 26 oct. Si importa la hora exacta de inicio del trabajo elegible, confirmarla oficialmente.
- Entrega: **4 nov, 21:00 ET = 4 nov, 19:00 en America/Ciudad_Juarez**. No confundir esta zona con la hora de otras localidades de Chihuahua.
- Las páginas públicas previamente consultadas indicaban evaluación del 4–8 nov; la guía dice 5–8 nov.
- El waiver previo contemplaba premios adicionales alrededor del 10 nov; la guía fija el ganador comunitario para el 16 nov. No tratar ambos anuncios como equivalentes.
- La entrada de office hours finales no aclara duración ni si sustituye el horario diario habitual.

## Accesos oficiales y comunidad

- Discord: https://cerebralvalley.ai/e/meta-ai-developer-hackathon/discord
- Transmisiones: https://cerebralvalley.ai/e/meta-ai-developer-hackathon/live
- Entrega: https://cerebralvalley.ai/e/meta-ai-developer-hackathon/hackathon/submit
- Canales: `#announcements` (actualizaciones), `#questions` (Cerebral Valley), `#office-hours` (Meta), `#team-search` (equipo), `#intros` y `#general`.
- La transmisión estará disponible poco antes de las sesiones. No hay enlace de grabación confirmado en el pegado.

## Créditos Meta

- US$150 por participante aceptado, solicitados individualmente; nadie puede reclamarlos por otra persona.
- Formulario: https://docs.google.com/forms/d/e/1FAIpQLScam78z7tHsNYibiFyJQVFzEgr0coyBTiY568SxxNbsPa3jiw/viewform
- Fecha límite para reclamarlos: 4 nov, 21:00 ET.
- Distribución por lotes; verificar que aparezcan en Billing antes de consumir API.
- Se requiere tarjeta válida para usar créditos y hacer llamadas. Puede aparecer una preautorización temporal que se libera en unos días hábiles.
- La guía permite configurar una notificación «Spend Limit». No asumir que una notificación constituye un bloqueo duro de gasto.
- La vigencia de diez días se describió en el waiver previo; el pegado no precisa el vencimiento exacto de cada saldo. Verificar condiciones de la cuenta.

## Créditos de socios

No están garantizados: dependen de cada proveedor.

| Proveedor | Oferta y condiciones |
| --- | --- |
| Baseten | US$100 y 2M TPM; hasta 2,000 participantes, selección por caso de uso, por individuo y no por equipo; aviso por email |
| Modal | US$100 para los primeros 1,000 participantes; Endpoints, GPU serverless, sandboxes y entrenamiento |
| Fireworks | US$100 por equipo seleccionado; lista corta revisada con Fireworks y canje por email |

**Baseten: usar `meta-models/muse-spark-open-1026` durante la hackathon**, aunque sus documentos generales indiquen `meta-models/muse-spark-open`.

- Baseten: https://docs.google.com/forms/d/e/1FAIpQLSfM7gcK8yMZEmAGq6DbTyiuv2c71IH7CKCy0fXGIfUED1qxVQ/viewform
- Modal: https://docs.google.com/forms/d/e/1FAIpQLSe_GDPtLZsdA57xPhFcOCi_yLjPf8HRxMIQJ5V7ystoKSqWCQ/viewform
- Fireworks: https://docs.google.com/forms/d/e/1FAIpQLSdPQTTES8_nhavzZkOrebVNYbM1FumWLdpeZx8ZSNe4QLXKPA/viewform

## Recursos técnicos

Modelos mencionados: Muse Spark, Muse Wonder, Muse Image, Muse Voice Transcribe, SAM 3.1, Muse Glimmer y Muse Spark Open. Muse Code es el agente de programación. La guía no exige usar todos.

- Documentación: https://dev.meta.ai/docs/overview
- Inicio rápido: https://dev.meta.ai/docs/quickstart
- Modelos: https://dev.meta.ai/docs/models
- API cookbook: https://github.com/meta-models/meta-model-cookbook
- Fundamentos: https://github.com/meta-models/meta-model-cookbook/tree/main/01_api_fundamentals
- Recetas Muse Code: https://github.com/meta-models/meta-model-cookbook/tree/main/04_muse_code
- Open weights cookbook: https://github.com/meta-models/meta-oss-cookbook
- Sesión multimodal: https://developers.meta.com/resources/videos/multimodal-intelligence-of-muse-spark/
- Capacidades a producción: https://developers.meta.com/resources/videos/building-with-muse-spark-and-muse-code/
- Superintelligence blueprint: https://developers.meta.com/resources/videos/the-road-ahead-superintelligence-blueprint/

## Evaluación y premios: procedencia de los datos

La guía confirma tres etapas:

1. Filtro pasa/no pasa: viabilidad básica, encaje en temática y uso de Meta Model API y/o modelos abiertos de Meta para construir durante el evento.
2. Evaluación de quienes pasan, con escala 0–10. **La tabla de la rúbrica falta en el pegado.**
3. Cinco mejores proyectos por categoría pasan a la final; los jueces ven los videos en vivo y usan la misma rúbrica.

Datos conservados de la consulta previa del waiver, no extraídos de las tablas faltantes de esta guía: impacto 30%, uso de Meta 25%, profundidad y ejecución 20%, demo 25%. Confirmar si la tabla completa de participantes mantiene estos pesos.

La guía confirma totales: Indie US$400,000; Startups US$550,000; bonus US$50,000. Las tablas de posiciones y de bonus faltan en el pegado. La investigación previa conservó este reparto del waiver:

| Puesto | Indie USD | Startup USD |
| --- | ---: | ---: |
| 1 | 150,000 | 250,000 |
| 2 | 100,000 | 150,000 |
| 3 | 75,000 | 75,000 |
| 4 | 50,000 | 50,000 |
| 5 | 25,000 | 25,000 |

No inferir importes ni categorías específicas de bonus a partir del marcador `[table]`.

## Próximos pasos propuestos, todavía no ejecutados

Investigación de oportunidades realizada: `docs/ESTUDIO_OPORTUNIDADES_META_2026.md`, con productos recientes, quejas documentadas, diez temas móviles y de plataformas, encaje con requisitos, fuentes, métricas y límites. Recomendaciones condicionales: PedidoCierto (comercio), Evidencia de Campo (móvil), AgentProof (plataforma técnica). No se ha elegido una idea.

1. Confirmar aceptación, categoría y miembros; elegir representante.
2. Revisar anuncios y conseguir las tablas completas de la guía.
3. Elegir problema fuera de los anti-proyectos y formular una mejora medible.
4. Verificar acceso a modelos, saldo y controles reales de gasto.
5. Mantener historial de commits y una sección del README «Construido durante la hackathon» que distinga código previo, nuevo y dependencias.
6. Preparar demo de tres minutos con problema, funcionamiento real, uso de Meta y evidencia del resultado. Esto es una propuesta narrativa, no una estructura impuesta por la guía.
7. Revisar derechos de datos y recursos, retirar secretos antes de publicar y comprobar enlaces.
8. Entregar con margen el 4 nov y verificar confirmación de recepción.

## Pendientes sin resolver

- Idioma exigido para demo y entrega; campos completos del formulario.
- Licencia concreta del repositorio; condiciones de uso de otros proveedores de IA.
- Inicio exacto del período de trabajo elegible y requisitos de despliegue/acceso al producto.
- Tablas completas, desempates, criterios adicionales y premios comunitarios específicos.
- Elegibilidad y estado real del usuario, todavía no acreditados por haber compartido la guía.
