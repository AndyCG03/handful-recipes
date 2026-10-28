# Estudio de oportunidades: ecosistema Meta, problemas y proyectos con IA

Fecha de corte: 27 de octubre de 2026. Preparado para la Meta Global AI Developer Hackathon. El usuario confirma que ya tiene créditos.

## Resultado principal

Recomiendo explorar primero **PedidoCierto**, **Evidencia de Campo** y **AgentProof**. Cubren comercio conversacional, trabajo móvil y desarrollo de agentes, respectivamente. Permiten mostrar una entrada real, razonamiento útil y un resultado verificable en una demo corta. La elección depende de qué usuarios y datos podamos conseguir esta semana.

La oportunidad que encuentro es convertir información fragmentada en una acción comprobada: pedido confirmado, expediente de servicio completo o ejecución de agente contrastada con su resultado. Es una inferencia estratégica de este estudio, no una categoría anunciada por Meta.

Meta ya está desarrollando agentes personales y empresariales amplios. Construir otro chatbot de preguntas frecuentes o un generador genérico de contenido ofrece poca diferenciación y puede acercarse a los anti-proyectos de la guía. Conviene especializar el flujo y demostrar su calidad.

## Método y límites

- Investigación documental pública: anuncios y documentación de Meta, reportes originales en GitHub, conversaciones de usuarios en Reddit y documentación de alternativas.
- Prioridad a anuncios y reportes de 2026. Algunos antecedentes industriales son de 2025 y se marcan como tales.
- Se distingue **capacidad publicada**, **problema reportado** e **hipótesis de solución**. Los nombres y productos propuestos abajo son conceptos nuevos, no productos oficiales ni marcas verificadas.
- Confianza alta significa al menos tres reportes originales de autores/hilos distintos para un patrón; media, dos; baja, uno o una extrapolación. No equivale a prevalencia de mercado, gravedad estadística o disposición a pagar.
- Dos hilos con el mismo relato o autor no cuentan como dos observaciones. Se descuentan comentarios promocionales y preguntas que describen una solución hipotética.
- No se realizaron entrevistas, pruebas de modelos, reproducción de bugs ni validación de demanda. Un issue público acredita que alguien lo reportó; no prueba su causa ni que siga afectando a todas las versiones.
- El estudio no es un censo exhaustivo de quejas. Las comunidades técnicas y los usuarios frustrados están sobrerrepresentados. No se estiman TAM, porcentajes de fallos ni probabilidades de ganar.
- Se investigó el ecosistema con alcance selectivo: modelos, agentes, negocios/mensajería, creación, wearables y Horizon. No se presupone acceso a productos en lista de espera.

## 1. Qué presentó Meta y cómo se conecta

| Capa | Producto o avance verificado | Conexión con oportunidades |
| --- | --- | --- |
| Modelos para agentes | **Muse Wonder y Wonder Full**, anunciados el 12 oct 2026. Wonder está en API y Muse Code; Full se anunció para suscriptores de Muse Code. | Agentes que planifican y usan herramientas. El MVP debe verificar capacidades vía API en nuestra cuenta, sin asumir Full. [Anuncio](https://about.fb.com/news/2026/10/introducing-muse-wonder-models/) |
| Inferencia multimodal | **Muse Spark**, familia disponible en Meta Model API. La versión y modalidad de entrada importan. | Interpretar fotos, documentos y eventos dentro de un flujo de negocio. [Modelos](https://dev.meta.ai/docs/models) |
| Audio | **Muse Voice Transcribe**: transcripción, turnos, diarización y vocabulario específico. | Pedidos por voz, notas técnicas y revisión de subtítulos. No es síntesis de voz. [Documentación](https://dev.meta.ai/docs/speech-to-text) |
| Visión geométrica | **SAM 3.1** devuelve máscaras y cajas y sigue objetos en video. | Vincular una evidencia visual con un objeto concreto. No certifica calidad, seguridad, profundidad ni dimensiones físicas por sí solo. [Segmentación](https://dev.meta.ai/docs/media-segmentation) |
| Creación visual | **Muse Image** genera y edita imágenes. | Composición comercial y versiones revisables. Para evidencia de trabajo conservar originales; no generar pruebas de hechos. [Cookbook](https://github.com/meta-models/meta-model-cookbook/blob/main/05_muse_image/01_image_api_fundamentals/README.md) |
| Pesos abiertos | **Muse Glimmer** y **Muse Spark Open** permiten despliegue fuera del API de Meta. | Alternativa local o con proveedor; descargar pesos no garantiza que quepan o rindan en un teléfono. [Overview](https://dev.meta.ai/docs/overview) |
| Agente personal | **Muse**, presentado el 8 sep 2026. | Confirma que la ejecución de tareas es una dirección de producto. No copiar un asistente personal general. [Anuncio](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/) |
| Negocios | **Meta Business Agent**, junio de 2026: atención, catálogo, citas y acciones; plataforma conectada con sistemas empresariales. | La diferenciación debe ser más específica que responder preguntas o vender por chat. [Anuncio](https://about.fb.com/news/2026/06/meta-business-agent/) |
| Pymes y empresa | **Muse for Small Business**, 29 sep, incorpora herramientas empresariales y cuentas comerciales; **Meta Enterprise Platform**, 28 sep, reúne su stack de IA. | Oportunidad en controles operativos especializados y datos de dominio. [Pymes](https://about.fb.com/news/2026/09/introducing-muse-small-business/), [Enterprise](https://about.fb.com/news/2026/09/launching-meta-enterprise-platform/) |
| Suscripción | **Meta One**, 15 sep, agrupa funciones de creación e IA en apps. | Los envoltorios de funciones generales pueden solaparse rápidamente con ofertas nativas. [Anuncio](https://about.fb.com/news/2026/09/introducing-meta-one-subscription-service-more-features-ai/) |
| Creadores | **Edits**, su evolución de 2026 y traducción de Reels. | Verificación de términos, sincronización y legibilidad complementa la creación. [Edits](https://about.fb.com/news/2026/04/one-year-of-edits-built-for-and-with-creators/), [Traducción](https://about.fb.com/news/2025/11/instagram-empowers-creators-to-go-global-with-local-voice-translations-and-fonts/amp/) |
| Móvil y gafas | **Wearables Device Access Toolkit 1.0**, despliegue desde 30 sep: ruta para extender iOS/Android; Web Apps para Display y Connectors en preview. | Arquitectura móvil primero, gafas opcionales. Capacidades, mercado y dispositivo condicionan acceso. [FAQ](https://developers.meta.com/wearables/faq/) |
| Juegos y mundos | **Horizon Create y Horizon Studio**, anunciados en Connect; acceso gradual. | Generación y revisión de experiencias; no hacer depender el prototipo de acceso aún no concedido. [Anuncio](https://developers.meta.com/blog/meta-connect-recap-horizon-create-and-horizon-studio/) |
| Distribución social | Facebook anunció **Your algorithm** el 13 oct. | No presupone una API externa para reordenar el feed. Descartar promesas de control del algoritmo desde nuestra app. [Anuncio](https://about.fb.com/news/2026/10/introducing-your-algorithm-facebook/) |

**Lectura estratégica:** Meta conecta modelos → agentes → herramientas de negocio → interfaces móviles y gafas. Un proyecto puede usar sus modelos y servir a este ecosistema sin integrarse con todas sus aplicaciones. Consumir Meta Model API no concede acceso a conversaciones de WhatsApp, cuentas Instagram o hardware.

## 2. Problemas y quejas encontrados

| Patrón | Evidencia original y fechas | Confianza y límites | Oportunidad inferida |
| --- | --- | --- | --- |
| Catálogos vacíos, desaparecidos o difíciles de mantener | [Catálogo vacío, 26 sep 2026](https://www.reddit.com/r/whatsapp/comments/1wqjinr/meta_catalog_connected_to_whatsapp_but_showing/); [desaparición, feb–sep 2026](https://www.reddit.com/r/whatsapp/comments/1qvjgdu/whatsapp_business_catalog_dissappeared/); [productos aprobados pero no disponibles, 14 jul 2026](https://www.reddit.com/r/WhatsappBusinessAPI/comments/1uwduiz/whats_wrong_with_my_catalog/) | Alta para existencia del patrón en la muestra. No determina una causa común ni que siga sin solución. | Fuente independiente de verdad, controles de integridad y conciliación. No prometer reparar servidores de Meta. |
| Pedidos y compromisos fragmentados entre chats | [Negocio doméstico y órdenes manuales, 8 sep 2026](https://www.reddit.com/r/smallbusinessowner/comments/1wafxhy/order_processing_manually_for_small_business_owner/); [pedidos incompletos en varios canales, 2026](https://www.reddit.com/r/smallbusiness/comments/1v4ddtd/how_are_you_handling_customer_messages_across/) | Media. No hay muestra representativa; no se ha validado un vertical concreto. | Construir un pedido estructurado, detectar faltantes y cambios, mantener evidencia. |
| Conversaciones recibidas pero ausentes de la bandeja | [Saltos cronológicos, 6 sep 2026](https://www.reddit.com/r/socialmedia/comments/1w8uvrs/meta_business_suite_inbox_is_skipping/); [WhatsApp recibido pero invisible, 11 mar 2026](https://www.reddit.com/r/facebook/comments/1rr45tk/whatsapp_messages_not_appearing_in_meta_business/) | Media. Síntomas diferentes; no llamarlos el mismo bug ni asumir pérdida de datos. | Auditoría de continuidad y seguimiento, condicionada al acceso autorizado a eventos. |
| Subtítulos incorrectos, edición inestable y desfase | [Android, 22 ago 2026](https://www.reddit.com/r/instagrameditsapp/comments/1vvpvta/the_caption_autogeneration_feature_is_broken_on/); [correcciones y cambios de tamaño, dic 2025–feb 2026](https://www.reddit.com/r/Instagram/comments/1plugxi/editing_captions_for_a_reel_they_get_smaller/); [búsqueda de alternativa fiable, 17 jun 2026](https://www.reddit.com/r/VideoEditors/comments/1u8498f/looking_for_a_phone_editing_app_with_reliable/); [edición, 27 oct 2026](https://www.reddit.com/r/instagrameditsapp/comments/1xgnyja/captions/) | Alta para fricción de edición; no son benchmarks de precisión. | Revisar el resultado exportado, proteger términos y mantener correcciones. |
| Traducción o doblaje no deseado | [Usuario bilingüe, 19 ene 2026](https://www.reddit.com/r/Instagram/comments/1qgx51k/instagrams_ai_autodubbing_is_really_unsettling_as/); [idioma destino equivocado, 25 ago 2026](https://www.reddit.com/r/Instagram/comments/1vxuw6c/captions_translating_in_wrong_language/) | Media para pérdida de control, aunque los síntomas difieren. | Versiones explícitas y revisión semántica bajo control del creador. |
| Fricción de acceso, sesiones e integraciones de agentes | [Catálogo vacío Linux, 22 oct](https://github.com/meta-models/muse-code-sdk/issues/115); [autorización macOS, 19 oct](https://github.com/meta-models/muse-code-sdk/issues/110); [sandbox Windows, 15 oct](https://github.com/meta-models/muse-code-sdk/issues/107); [imagen mal identificada y sesión, 22 oct](https://github.com/meta-models/muse-code-sdk/issues/117) | Alta para diversidad de reportes de octubre de 2026. No son necesariamente fallos del modelo; pueden involucrar cuenta, runtime o cliente. | Diagnóstico reproducible y contrato de ejecución observable. |
| Fotos y notas de servicio desconectadas del informe | [Trabajo de campo, dic 2025](https://www.reddit.com/r/FieldService/comments/1pl0b5z/how_do_you_handle_photo_documentation_after_a/); [creador de herramienta, 27 oct 2026](https://www.reddit.com/r/SideProject/comments/1xgwfs6/built_a_tool_to_save_myself_hours_on_photo_reports/) | Media, con fuerte descuento al segundo por autopromoción. Necesita entrevistas. | Captura contextual, expediente con fuentes y revisión de evidencia faltante. |
| Instrucciones de trabajo desactualizadas | [Cambios de ingeniería, oct 2025 y respuestas 2026](https://www.reddit.com/r/manufacturing/comments/1nzskpd/how_do_you_actually_keep_work_instructions/); [instrucciones digitales, 2026](https://www.reddit.com/r/manufacturing/comments/1pw4q24/suggestions_for_digital_work_instructions/) | Media; parte del contexto supera doce meses y hay promoción comercial. | Diferencias de versiones y pruebas de comprensión, con aprobación humana. |
| Batería, conexión y recuperación de gafas | [Batería tras actualización, may 2026](https://www.reddit.com/r/RaybanMeta/comments/1tibh2a/battery_life_after_update/); [fallo de conexión, 3 oct](https://www.reddit.com/r/RayBanStories/comments/1wwkqjh/my_meta_ray_bans_stopped_working/); [lectura de batería, 9 oct](https://www.reddit.com/r/RayBanStories/comments/1x1f7ov/meta_ai_app_cant_show_the_battery_situation/) | Alta para existencia de quejas, baja para causa o solución externa. | Diseñar degradación a móvil y capturas cortas. Una app no puede prometer corregir firmware o baterías. |
| Fraude en comercio social | [Caso Marketplace→WhatsApp, 9 jun 2026](https://www.reddit.com/r/Scams/comments/1u0ynku/us_facebook_marketplace_buyer_requested_my/); [Meta reconoce evolución de estafas, mar 2026](https://about.fb.com/news/2026/03/fighting-scammers-protecting-people-with-new-technology-and-partnerships/) | Media para este segmento; no valida un detector ni sus tasas de error. | Revisar contradicciones en evidencia y explicar señales; nunca certificar una transacción como segura. |

No conté como evidencia independiente los dos hilos con el mismo caso del catálogo web, ni las publicaciones repetidas que plantean un asistente comercial hipotético. No se ha demostrado aquí que perder mensajes o fallar un catálogo sea un problema que una API externa pueda reparar.

## 3. Cómo se traduce a requisitos de la hackathon

La fuente operativa es la Participant Guide entregada por el usuario, conservada en `meta-participant-guide-original.txt`.

| Código | Requisito o condición | Cómo lo cubren las propuestas |
| --- | --- | --- |
| R1 | Incorporar modelos de Meta | Se define una función concreta por modelo en cada ficha; el resultado depende de inferencia real. |
| R2 | Build for Your World o Push the Frontier | Se asigna una temática primaria por tema. |
| R3 | Trabajo nuevo y contribuciones identificables | README, commits y demo diferencian dependencias y código previo del sistema nuevo. |
| R4 | Repositorio público | Publicar código y fixtures autorizados o sintéticos; mantener secretos y datos privados fuera. |
| R5 | Video de tres minutos | Cada ficha propone una secuencia corta con fallo, intervención y resultado observable. |
| R6 | Una entrega y máximo cuatro participantes | Arquitectura reducida para una persona o equipo pequeño; se elige un proyecto. |
| R7 | Evitar anti-proyectos y usos sin derechos | No medicina, nutrición, política, guerra, selección laboral, personalidad, deporte, RAG básico ni analizador simple de imágenes. |
| R8 | Entrega 4 nov, 21:00 ET | Estimaciones de MVP acotado y revisión antes del cierre; no desarrollar diez productos. |

Las fichas representan **encaje propuesto**, no aprobación del jurado. La rúbrica cuantitativa 30/25/20/25 procede del waiver consultado anteriormente; la tabla de la guía pegada está ausente, por lo que debe confirmarse.

## 4. Diez temas de proyecto

Todos deben cumplir R1–R8. Los tiempos siguientes son estimaciones de ingeniería para una persona experimentada con acceso al API, sin publicación en tiendas ni esperas de permisos. No son compromisos ni resultados de pruebas.

### T1. PedidoCierto — de mensajes a pedido confirmado

**Formato:** móvil/PWA con tablero web. **Temática:** Build for Your World. **Usuario inicial:** negocio de productos personalizados, refacciones o servicios cotizados; elegir uno.

**Problema asociado:** pedidos repartidos, correcciones de cantidades y compromisos difíciles de rastrear. Evidencia media en el apartado 2.

**Flujo e IA:** el usuario aporta texto, audio y foto de referencia. Voice Transcribe convierte audio; Spark extrae entidades y vincula cada campo a su fuente; Wonder propone la siguiente pregunta cuando hay ambigüedad. Un motor determinista valida cantidades, disponibilidad y totales contra una tabla del negocio. Se necesita aprobación para confirmar.

**MVP, 4–6 jornadas:** un catálogo pequeño, pedidos con estados, historial de cambios y pantalla de datos faltantes. Importación manual o bandeja propia; WhatsApp/Instagram son adaptadores posteriores si no hay permisos. La demo debe decir con precisión qué canal está realmente conectado.

**Demo:** nota que pide tres piezas, foto del producto y corrección posterior a dos; el sistema identifica el cambio, pregunta una variante faltante y produce un pedido sin duplicarlo.

**Prueba propuesta:** 20 conversaciones etiquetadas; medir exactitud por campo, cambios detectados, duplicados y afirmaciones sin fuente. Objetivo de diseño: cero confirmaciones con precio inventado; no afirmar que ya se alcanzó.

**Diferencia:** expediente transaccional y conciliación, frente a preguntas frecuentes. [Meta Business Agent](https://about.fb.com/news/2026/06/meta-business-agent/) y [respond.io](https://respond.io/help/ai-agents/getting-started-with-ai-agents) ya cubren agentes comerciales amplios. La especialización y las pruebas deben justificar la propuesta.

**Encaje y límite:** R1 voz+razonamiento; R2 mundo propio; R5 demostración de modificación verificable; R7 evita RAG básico. No interpretar un comprobante como prueba bancaria de pago.

### T2. Catálogo Espejo — consistencia comercial entre fotos, listas y fichas

**Formato:** plataforma web con captura móvil. **Temática:** Build for Your World.

**Problema:** catálogos vacíos o difíciles de mantener; evidencia alta de reportes, sin diagnóstico causal.

**Flujo e IA:** importar CSV de referencia y fotos; Spark relaciona variantes, nombres y códigos, muestra ambigüedades; reglas comparan stock, precio y duplicados. SAM puede aislar artículos si aporta valor medible. Un humano aprueba la versión exportable.

**MVP, 3–5 jornadas:** 30 productos, diff de dos versiones, alertas con evidencia y exportación CSV. Sin prometer sincronización directa o recuperación de datos eliminados.

**Demo:** foto con variante distinta, código duplicado y precio contradictorio; el sistema propone relaciones, permite corregirlas y genera una lista consistente.

**Prueba:** precisión de emparejamiento por SKU y variante; falsos positivos y cambios no autorizados. Comparar con una unión exacta de CSV para demostrar dónde la IA agrega valor.

**Encaje:** R1 interpretación multimodal; R2 negocio conocido; R5 inconsistencias visibles; R7 supera un analizador simple al mantener versiones y producir una acción validada. El dolor documentado no garantiza demanda por este producto adyacente: validar con tres comerciantes.

### T3. ReelControl — revisión de subtítulos y traducción antes de publicar

**Formato:** app móvil/PWA y revisión web. **Temática:** Build for Your World.

**Problema:** subtítulos que se omiten, no conservan correcciones o pierden sincronización; traducción que cambia intención. Evidencia alta de fricción de captions y media de control de idioma.

**Flujo e IA:** Voice Transcribe genera una transcripción independiente; Spark contrasta el SRT o texto del creador con el audio, glosario y traducción. Reglas revisan duración, longitud y zonas de texto definidas para el formato. El usuario aprueba cambios y exporta SRT más reporte.

**MVP, 4–6 jornadas:** clips de 30–60 segundos en español/inglés, glosario de nombres y productos, editor por segmentos e historial. No construir un editor de video completo.

**Demo:** un nombre de marca, una negación y un precio mal transcritos; revisar con el audio y mostrar correcciones conservadas tras exportar.

**Prueba:** errores en términos críticos, cambios semánticos y tiempo de corrección frente al proceso manual. Conservar casos donde la propuesta del modelo es rechazada.

**Límite técnico:** la documentación de [Voice Transcribe](https://dev.meta.ai/docs/speech-to-text) da marcas por turno, no por palabra ni puntuaciones de confianza. Karaoke por palabra requeriría alineación adicional; no inventarla. Tampoco puede cambiar cómo Instagram reproduce o dobla contenido ajeno.

**Diferencia y encaje:** [CapCut ya ofrece subtítulos bilingües](https://www.capcut.com/help/bilingual-subtitles). El valor propuesto es control de calidad verificable con glosario y correcciones persistentes. R1 audio+semántica; R5 comparación antes/después; R7 herramienta de producción, no chatbot educativo.

### T4. Evidencia de Campo — expediente verificable de un servicio

**Formato:** móvil primero y portal web para revisar. **Temática:** Build for Your World; posible Push the Frontier si se demuestra una nueva capacidad física verificable.

**Problema:** fotos, voz e informe separados; evidencia media y necesidad de validación en un oficio concreto.

**Flujo e IA:** captura de fotos y nota de voz por trabajo; Spark propone asociaciones y resumen; SAM señala el objeto sobre el que se habla; el sistema exige evidencias definidas, conserva originales y genera un expediente revisable con enlaces a cada fuente.

**MVP, 4–6 jornadas:** un servicio no crítico, por ejemplo limpieza o detailing. Captura persistente local, cola para sincronizar al recuperar conexión y checklist de entrega. La inferencia sigue siendo en nube: captura sin conexión no significa IA sin conexión.

**Demo:** registrar antes/después, introducir una foto del trabajo equivocado y omitir una vista; el sistema detecta la inconsistencia candidata, pide evidencia y prepara el informe corregido.

**Prueba:** porcentaje de campos con fuente, asignación correcta de fotos, evidencia faltante detectada y minutos de preparación. La identificación de un mismo objeto entre vistas requiere referencias y prueba; no es una garantía de SAM.

**Encaje:** R1 combina voz, interpretación y máscaras; R5 resultado visual y auditable; R7 supera el analizador simple mediante expediente, estados y aprobación. No certificar cumplimiento HSE, seguridad de maquinaria ni calidad técnica a partir de una foto.

**Extensión:** gafas mediante DAT si ya hay dispositivo y acceso. La base debe funcionar con teléfono. El hardware no es requisito de la hackathon.

### T5. CambioVivo — cambios de proceso convertidos en instrucciones revisables

**Formato:** plataforma con captura móvil. **Temática:** Push the Frontier, manufactura.

**Problema:** cambios técnicos que no llegan a instrucciones vigentes; evidencia media, con antecedentes de 2025.

**Flujo e IA:** comparar dos instrucciones y un video autorizado de proceso. Spark extrae cambios; Wonder propone los pasos afectados y preguntas de revisión; SAM vincula regiones de objetos cuando sea útil. Una persona responsable aprueba cada versión.

**MVP, 5–7 jornadas:** proceso inocuo de ensamblaje de mesa, dos versiones, diff de pasos, evidencia visual y registro de aceptación. Sin operación de maquinaria ni instrucciones de seguridad generadas automáticamente.

**Demo:** cambia una pieza y una secuencia; el sistema encuentra los pasos y capturas afectados y bloquea la publicación hasta revisión.

**Prueba:** cambios detectados contra lista humana, pasos afectados correctamente y modificaciones inventadas.

**Competencia:** [Dozuki ya documenta generación de instrucciones desde video](https://www.dozuki.com/blog/dozuki-featured-in-bbc-article-about-ai-work-instructions?hs_amp=true). El diferenciador propuesto es propagación trazable de cambios, no solo video→manual.

**Encaje:** R1 razonamiento entre versiones y evidencia; R2 frontera industrial; R5 cambio visible; R7 no es RAG ni formación por chatbot. Acceso a un proceso real y a un revisor determina viabilidad.

### T6. AgentProof — verificar que el agente hizo lo que dijo

**Formato:** plataforma web y paquete pequeño de instrumentación. **Temática:** Push the Frontier, software.

**Problema:** estados de ejecución ambiguos y fallos difíciles de distinguir. Evidencia alta de fricción del runtime; que todos los agentes mientan sobre completar tareas sería una conclusión no sustentada.

**Flujo e IA:** un agente de Meta usa herramientas en un entorno de prueba; se registran intención, llamada, resultado y estado externo. Spark/Wonder propone casos adversos y detecta contradicciones; un verificador determinista comprueba archivo, pedido o registro final.

**MVP, 4–6 jornadas:** tres herramientas de prueba (crear pedido, actualizar stock, escribir archivo), diez casos y comparación de dos ejecuciones. Errores inyectados: timeout, respuesta duplicada y éxito declarado sin cambio de estado.

**Demo:** la herramienta falla; el agente declara éxito; el tablero señala que falta la evidencia y muestra una ejecución corregida que sí satisface el contrato. Identificar los fallos como inyección controlada, no como reproducción de un bug real.

**Prueba:** detección de las violaciones sembradas, falsos positivos, llamadas duplicadas y costo. Un LLM que juzga a otro no es evidencia suficiente del estado final.

**Competencia:** [Langfuse ya ofrece tracing y evaluación](https://langfuse.com/resources/engineering/ai-safety). La oportunidad es un contrato concreto de finalización y un paquete reproducible para Meta, con reducción de trabajo de diagnóstico demostrada.

**Encaje:** R1 Meta actúa y ayuda a formular/verificar casos; R2 ingeniería de agentes; R5 fallo y recuperación visibles; R7 no es una interfaz genérica de chat ni un panel decorativo de logs.

### T7. Integración Clara — diagnóstico explicable del acceso a Meta

**Formato:** herramienta local/CLI y reporte web. **Temática:** Build for Your World, desarrolladores.

**Problema:** login exitoso con catálogo inaccesible, sandbox aparentemente listo que no ejecuta, medios mal identificados. Fuentes: issues #110, #115, #107 y #117 del apartado 2.

**Flujo e IA:** verificaciones locales explícitas recogen versiones, disponibilidad, tipos reales de archivos y resultados de una llamada mínima. Spark clasifica evidencia y redacta un informe de soporte con incertidumbres; las comprobaciones de credenciales y HTTP son código determinista.

**MVP, 3–5 jornadas:** diagnóstico de acceso al API y validación de adjuntos, más fixtures de otros fallos; no pretender reproducir todos los errores del CLI ni solucionar permisos globales.

**Demo:** archivo JPEG con extensión PNG y un acceso rechazado; el informe distingue entrada inválida de falta de autorización y propone siguientes comprobaciones documentadas.

**Prueba:** clasificar fixtures con causas conocidas, ocultar secretos y producir pasos verificables. No pedir API keys en una web pública ni subir logs sin filtrarlos.

**Encaje:** R1 razonamiento sobre diagnósticos; R2 problema de desarrolladores; R5 informe accionable; R7 no basta envolver mensajes de error en un chatbot. Potencial limitado si las reglas deterministas resuelven casi todo: demostrar valor incremental de la IA.

### T8. ClipPrivado — preparar material visual compartible con revisión

**Formato:** app móvil y portal de aprobación. **Temática:** Build for Your World.

**Problema:** necesidad inferida de compartir evidencias o contenido sin exponer información incidental. No se reunió una muestra específica suficiente; confianza baja para demanda de este producto.

**Flujo e IA:** Spark propone regiones potencialmente sensibles; SAM ayuda a enmascarar y seguir objetos señalados; una persona revisa segmentos y exporta una versión. Conservar original y revisión separadas.

**MVP, 5–7 jornadas:** clips cortos, matrículas o pantallas de prueba, edición de máscara y revisión cuadro a cuadro. No reconocimiento de identidad ni promesa de anonimización total.

**Demo:** un objeto a ocultar sale parcialmente de cuadro y vuelve; mostrar el tramo dudoso y corregir la máscara.

**Prueba:** objetos omitidos y continuidad de máscara contra anotaciones humanas. No usar solo confianza verbal del modelo.

**Encaje:** R1 composición de interpretación+segmentación+tracking; R5 revisión/exportación; R7 workflow más amplio que análisis simple de imágenes. Riesgo de alcance por calidad de tracking y de solapamiento con editores existentes. Tema secundario.

### T9. Venta con Evidencia — detectar contradicciones en una conversación comercial

**Formato:** móvil, mediante compartir texto o imágenes autorizadas. **Temática:** Build for Your World.

**Problema:** comercio social con señales de fraude. Evidencia media en el apartado 2; la eficacia de la solución propuesta aún no se ha probado.

**Flujo e IA:** Spark organiza cronología, extrae afirmaciones y señala contradicciones entre mensajes y documentos; Wonder redacta preguntas de verificación. Reglas identifican solicitudes de códigos o cambios de canal, mostrando el fragmento exacto.

**MVP, 4–6 jornadas:** escenarios sintéticos de compraventa de objetos con etiquetas humanas. No acceder a chats privados automáticamente ni abrir enlaces sospechosos.

**Demo:** cambia la identidad de quien cobra y se exige urgencia; señalar inconsistencias y qué información falta, sin declarar a una persona culpable.

**Prueba:** falsos positivos, señales omitidas y recomendaciones injustificadas. No afirmar «pago verificado», «vendedor seguro» o certeza de fraude.

**Encaje:** R1 razonamiento multimodal con fuentes; R5 contradicciones visibles; R7 fuera de política/guerra y sin decisiones financieras automatizadas. Menor prioridad por daño de falsa confianza y diferenciación todavía débil frente a herramientas nativas de protección.

### T10. Horizon Playtest Notes — reproducir problemas en experiencias generadas

**Formato:** plataforma web con grabación desde móvil. **Temática:** Push the Frontier, software creativo.

**Problema:** verificar experiencias generadas puede requerir identificar dónde un jugador se atasca. Es una hipótesis adyacente al lanzamiento de Horizon Create/Studio; no se encontraron suficientes quejas directas para validarla. Confianza baja.

**Flujo e IA:** Spark interpreta una grabación y eventos instrumentados; Wonder propone una secuencia reproducible, agrupa síntomas y contrasta con otro intento. La telemetría determina estados; el video aporta contexto.

**MVP, 5–7 jornadas:** juego web propio de una pantalla, tres fallos sembrados y reporte reproducible. No afirmar integración oficial con Horizon ni depender de early access.

**Demo:** el agente identifica que una condición bloquea la progresión, propone pasos, se aplica una corrección humana y se compara la nueva ejecución.

**Prueba:** reproducciones exitosas, falsos bugs y cobertura de estados. No construir otro generador de juegos.

**Encaje:** R1 análisis+razonamiento de pruebas; R2 frontera de software; R5 reproducción antes/después; R7 no chatbot educativo ni analizador simple. Tema exploratorio por falta de evidencia y acceso.

## 5. Comparación para decidir

Las puntuaciones siguientes son **juicio de diseño del autor**, no resultados de usuarios, modelos o jueces. Se usa la ponderación provisional del waiver previo: impacto 30%, uso de Meta 25%, ejecución 20% y demo 25%. Cada dimensión se estima de 0 a 10 para el MVP descrito. La viabilidad y calidad de evidencia se muestran aparte; no se convierten en probabilidad de ganar.

| Tema | Impacto | Meta | Ejecución | Demo | Total /10 | Evidencia del problema | Dependencia principal |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| T4 Evidencia de Campo | 8.5 | 9 | 8 | 9 | 8.65 | Media | Conseguir un flujo y fotos autorizadas |
| T6 AgentProof | 8 | 9 | 9 | 8.5 | 8.58 | Alta para fricción; contrato propuesto por validar | Instrumentación y comparación objetiva |
| T1 PedidoCierto | 8.5 | 8.5 | 8 | 9 | 8.53 | Media | Un negocio y ejemplos reales |
| T3 ReelControl | 8 | 8.5 | 8 | 9 | 8.38 | Alta | Calidad semántica y tiempos por segmento |
| T5 CambioVivo | 8.5 | 8.5 | 7.5 | 8.5 | 8.30 | Media | Revisor de proceso y dos versiones |
| T2 Catálogo Espejo | 8 | 8 | 8.5 | 8.5 | 8.23 | Alta para incidentes; solución adyacente por validar | Datos de catálogo y diferenciación |
| T7 Integración Clara | 7.5 | 7 | 8.5 | 8 | 7.70 | Alta | Aportación real de IA sobre reglas |
| T8 ClipPrivado | 8 | 8.5 | 6.5 | 8 | 7.83 | Baja para demanda específica | Tracking y revisión exhaustiva |
| T9 Venta con Evidencia | 8 | 8 | 6.5 | 8 | 7.70 | Media | Falsos positivos y confianza indebida |
| T10 Horizon Playtest Notes | 7 | 8.5 | 6.5 | 8 | 7.53 | Baja | Acceso y demanda sin validar |

Orden de recomendación práctica: **T1 si hay un comerciante disponible; T4 si hay un servicio documentable; T6 si no tenemos usuarios externos y queremos una plataforma técnica**. Las diferencias pequeñas de puntuación no justifican una elección sin considerar acceso a datos y motivación del equipo.

Para un producto móvil, elegiría T4 o T1. Para una plataforma, T6 o T2. T3 es atractivo si podemos reclutar creadores y demostrar ventaja concreta sobre sus herramientas actuales. T5 tiene valor potencial, pero más dependencia de expertos y procesos.

## 6. Arquitectura y dependencias realistas

- **Móvil:** PWA para demostrar cámara, carga y dictado con menor fricción; React Native/Expo si el flujo requiere funciones nativas y ya conocemos el stack. No dar por hecho publicación en App Store/Play antes del cierre.
- **Backend propio:** claves de API solo en servidor; contratos tipados, validación de salidas y almacenamiento de fuentes. No introducir SDKs o proveedores hasta elegir tema.
- **IA:** Spark para interpretación rutinaria; Wonder para casos difíciles medidos. Voice Transcribe cuando el audio sea entrada central; SAM solo si una máscara o tracking produce valor visible. No agregar modelos para decorar la arquitectura.
- **Estado:** base de datos como registro autoritativo; la respuesta del modelo es propuesta, no confirmación de un cambio. Idempotencia y trazabilidad para acciones.
- **Offline:** persistir captura y cola local; indicar cuándo falta sincronizar o inferir. Glimmer local exige una prueba separada de hardware, memoria y latencia; no asumirlo por ser open-weight.
- **WhatsApp/Instagram:** el API de modelos y los créditos son distintos de Graph/mensajería. La documentación de [Conversations de Meta en Postman](https://www.postman.com/meta/messenger-platform-api/folder/22794852-255610cd-47f5-4f4d-b3fa-71aec360be9a) indica acceso avanzado para conversaciones fuera de roles autorizados en el flujo descrito. Los permisos dependen del producto y modalidad de login. Algunas páginas directas requieren iniciar sesión.
- **Plan demostrable:** usar importación autorizada o datos sintéticos si no hay acceso a canales; mostrar inferencia real de Meta. Rotular conectores simulados, errores sembrados y componentes no implementados.
- **Wearables:** [DAT y Connectors](https://developers.meta.com/wearables/faq/) tienen condiciones de dispositivo, región o preview. Una extensión opcional a gafas sirve como evolución, no como dependencia oculta.

## 7. Créditos y costo de una prueba

Precios publicados consultados: Spark Standard US$1.25/M tokens de entrada y US$4.25/M de salida; Wonder US$4/M y US$20/M; Voice Transcribe US$0.18/hora; Muse Image US$0.01/imagen; SAM US$2.50/1,000 imágenes y US$0.20/1,000 cuadros de video, con mínimo facturable de 50 cuadros por solicitud de video. Son precios de lista, sujetos a cambios; no se probó facturación de la cuenta. [Tarifas oficiales](https://dev.meta.ai/docs/pricing-rate-limits).

Ejemplo **calculado**, no medido: 1,000 operaciones Spark de 4,000 tokens de entrada y 800 de salida cuestan aproximadamente **US$8.40** en tokens; 100 operaciones Wonder del mismo tamaño, **US$3.20**; dos horas de transcripción, **US$0.36**; 1,000 imágenes SAM, **US$2.50**. Subtotal hipotético: **US$14.46**. No contempla imágenes/video convertidos a tokens, razonamiento adicional, reintentos, búsquedas, hosting, almacenamiento, mensajería ni otros servicios. Medir `usage` real antes de extrapolar.

Los US$150 disponibles permiten plantear pruebas acotadas; no acreditan capacidad ilimitada ni todos los modelos. Para datos reales, revisar modo de tratamiento: Meta distingue Standard y Contributor; no asumir condiciones de privacidad por usar un modelo de nombre parecido. [Disponibilidad y modos](https://dev.meta.ai/docs/models).

## 8. Validación antes de desarrollar en serio

1. Elegir dos finalistas de este estudio y conseguir tres conversaciones cortas con usuarios potenciales por candidato. Preguntar por el último caso real y su solución actual; no venderles primero nuestra idea.
2. Pedir ejemplos autorizados y medir cómo realizan hoy la tarea. Tres entrevistas orientan un MVP, no validan mercado.
3. Hacer una prueba de un día: entrada real → inferencia Meta → salida con comprobación. Si no supera una regla simple o extracción manual, revisar el alcance.
4. Crear un set pequeño con verdad de referencia humana: casos normales, ambiguos y adversos. Registrar también fallos.
5. Elegir una métrica principal por proyecto y una de daño/error. Objetivos son metas; reportar solo los resultados realmente obtenidos.
6. Registrar contribuciones nuevas y preparar demo de tres minutos con código público y datos compartibles.

Plan sugerido desde el 27 oct: investigación y selección hasta el 28; flujo funcional 29–31; evaluación 1–2 nov; video y revisión 3 nov; entrega y verificación el 4 nov con margen. El cierre conservado de la guía es 4 nov, 21:00 ET, equivalente a 19:00 en Ciudad Juárez.

## Decisión propuesta

**Primera opción comercial: PedidoCierto.** Debe demostrar que un pedido con correcciones, audio y variantes llega a un estado completo y verificable. La integración social puede añadirse después de probar el núcleo.

**Primera opción móvil: Evidencia de Campo.** Debe demostrar que cada afirmación del informe se vincula con evidencia y que el sistema pide lo que falta. Elegir un servicio no crítico y conservar originales.

**Primera opción de plataforma técnica: AgentProof.** Debe demostrar, con fallos sembrados y verificadores independientes, qué diferencia hay entre responder «terminado» y terminar la tarea. Aprovecha el interés en agentes verificables sin depender de cuentas de negocio o gafas.

No se ha seleccionado ni implementado un proyecto. El siguiente paso es elegir según acceso real a usuarios, datos y experiencia; los créditos ya están disponibles según el usuario.
