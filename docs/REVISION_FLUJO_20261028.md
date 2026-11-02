# Revisión del producto y flujo — 28 de octubre de 2026

## Resultado

Se revisó el código actual de `apps/web` y se mejoró el flujo del propietario, la landing y la ejecución del pipeline. Los cambios están en el checkout local; no se han desplegado ni publicado automáticamente.

La app ya tenía llamadas a Meta, receta con clips, muestras visuales, preguntas y respuesta familiar. No era solo una maqueta. Sin embargo, la secuencia de procesamiento estaba dirigida por el navegador y el dueño no podía contestar sus propias preguntas desde la revisión.

## Flujo resultante

1. Subir video o usar el selector de cámara del teléfono, indicar receta/persona y confirmar consentimiento.
2. Mientras la página está abierta, preparar audio y hasta 24 fotogramas reales y subir los archivos.
3. Guardar la receta y la clave de edición en este dispositivo.
4. `POST /api/recipes/:id/background` autentica al propietario, guarda un job y devuelve HTTP 202.
5. `after()` de Next ejecuta transcripción → análisis → revisión visual de medidas en servidor; guarda el resultado después de cada etapa.
6. El propietario puede salir y regresar desde Your recipes en el mismo dispositivo. La página consulta el avance cada tres segundos mientras el job esté activo.
7. En la revisión, cada pregunta admite «I can answer this»: texto o nota de voz, sin salir de la plataforma. La respuesta conserva autor, texto original, nota integrada, fecha y audio cuando existe.
8. Si no sabe la respuesta, selecciona preguntas y comparte por WhatsApp o copia el enlace. Copiarlo habilita las preguntas seleccionadas. No se usa WhatsApp Business API.
9. La persona invitada responde por voz en la página de respuesta. Una contestación ambigua se conserva, pero la pregunta sigue pendiente.
10. La receta muestra las respuestas junto al paso y permite escuchar el audio original. Las respuestas generales también se muestran, aunque no pertenezcan a un paso.

## Cambios de interfaz

- Landing editorial con jerarquía, fotografía ilustrativa generada, ejemplo explícitamente marcado y explicación del recorrido de tres pasos.
- Identidad Cuenco de barro y logo PNG con canal alfa real; en modo oscuro se muestra la misma silueta en claro.
- Página de carga con elección entre archivo y cámara. `capture=environment` depende del navegador/dispositivo y puede abrir el selector de archivos en escritorio.
- Mensajes que distinguen preparación/subida, que requieren la página abierta, del procesamiento del lado servidor.
- Preguntas con entrada directa de texto/voz, revisión de respuestas ambiguas e historial resumido de detalles completados.
- Anchos de lectura conservados en formularios, revisión y receta familiar; landing más amplia.
- Se mantiene la interfaz principal en inglés y la respuesta familiar en español, siguiendo el estado anterior del producto. Falta un sistema completo de idioma seleccionable.

## Qué significa «segundo plano» aquí

Está implementado con la API oficial `after()` de Next.js. El trabajo sigue después de responder al navegador, por lo que navegar o cerrar la pestaña no dirige ni cancela la cadena de etapas. La prueba de integración lo confirmó con un servicio simulado.

**No es una cola durable ni un worker independiente.** `after()` tiene el límite de ejecución de la función de alojamiento. La ruta declara `maxDuration = 300`; debe verificarse el máximo efectivo y Fluid Compute del proyecto Vercel. Si el proceso termina abruptamente, no hay un broker que garantice reentrega automática. Los checkpoints permiten retomar desde la revisión; un job sin actividad se considera detenido después de seis minutos.

Referencia: [Next after](https://nextjs.org/docs/app/api-reference/functions/after), [límites Vercel](https://vercel.com/docs/functions/limitations).

El bloqueo y la deduplicación actuales coordinan una instancia Node. No sustituyen transacciones o locks de base de datos entre varias instancias. Para producción multiusuario se necesita un almacén transaccional y una cola/worker gestionados.

## Estado real frente al plan original

| Función del plan | Estado después de esta revisión | Qué falta |
| --- | --- | --- |
| Subir/grabar video ≤10 min | Flujo de carga y selector de cámara | Probar Safari/iPhone y Android reales; revisar formatos y memoria con videos largos |
| Audio por turnos | Cliente Voice Transcribe y persistencia | Métricas con más grabaciones y ruido real |
| Pasos ligados al video | Enlaces temporales al video original | Editor de límites, recortes físicos opcionales y confirmación del dueño |
| Medidas informales | Frase literal y muestra visual | No convertir a números; evaluar fidelidad |
| SAM | Cajas en fotogramas representativos de hasta seis pasos | Máscaras y seguimiento temporal real; no afirmar que ya existe video tracking en la UI |
| Huecos/preguntas | Detección y selección | Priorizar por utilidad; evaluación etiquetada |
| Respuesta del dueño | **Añadida: texto y voz en la misma pantalla** | Historial de revisiones y autoría con cuentas reales |
| Respuesta familiar | Enlace por voz sin instalación | Recuperación de acceso y revocación/expiración de enlaces |
| Integración | Conserva incertidumbre y procedencia básica | Comparación original/corrección y revisión humana más granular |
| Segundo plano | **Añadido: servidor tras HTTP 202, con checkpoints** | Cola durable y worker para cargas largas/concurrencia |
| Receta compartible | Página de lectura | Publicación explícita, permisos privados y revocación |
| PDF | No implementado | Prioridad baja frente a evidencia y colaboración |
| Muse Image | No integrado | Portadas opcionales; no usar imágenes generadas como evidencia |
| PWA | Manifest e iconos | Service worker, caché offline y pruebas de instalación |
| Supabase | SQL preliminar, sin uso en el backend actual | Integración, ownership, RLS, buckets privados y migración de datos |

El worker Python local sigue siendo un esqueleto; la implementación activa vive en Next.js. El esquema Supabase existente no contiene las políticas RLS necesarias y **no debe considerarse listo para exposición pública**. No se aplicó ni modificó durante esta tarea.

## Funciones que darían profundidad real

La simplicidad de la interfaz es útil para una familia. La profundidad debe estar en la evidencia, la colaboración y la fiabilidad, no en multiplicar pantallas.

| Prioridad | Función propuesta | Qué demuestra / relación con la guía | Alcance recomendado |
| --- | --- | --- | --- |
| 1 | **Editor de pasos con evidencia**: corregir texto e inicio/fin, conservar versión original y autor | Impacto, ejecución y demo; cada cambio mantiene su fuente, sin ser un chatbot genérico | Editor de un paso y comparación antes/después |
| 1 | **SAM temporal real**: escoger un tramo del puñito, seguir mano/recipiente y superponer máscara | Uso sustancial de Meta y resultado visual; supera cajas estáticas | Un clip de 3–5 segundos, con fallback honesto |
| 1 | **Historial familiar de aclaraciones**: quién respondió, audio original, revisiones y contradicciones | Producto vivo y auditable; el detalle no aparece como hecho sin fuente | Dos versiones de respuesta y confirmación del propietario |
| 1 | **Cola durable con control de gasto e idempotencia** | Ingeniería de producción; no repetir transcripción al reintentar | Un worker, límites por usuario/job y registro de consumo |
| 2 | **Cuaderno familiar privado** con invitaciones y recuperación de cuenta | Utilidad posterior al evento y colaboración | Un grupo, roles dueño/colaborador/lector |
| 2 | **Preguntas contextuales** con clip y botón «ya se ve/se dijo» | Mejora precisión de huecos y permite medir errores | Mostrar evidencia y permitir descartar con motivo |
| 2 | **Modo cocinar**: paso grande, escuchar voz, volver al gesto | Impacto y accesibilidad; conserva conexión humana | Vista de lectura sin recomendaciones nutricionales |
| 2 | **Idiomas bajo control**: español/inglés de interfaz, original siempre disponible | Encaje frontera/familias bilingües; fidelidad de términos | UI bilingüe y glosario, sin reemplazar el audio |
| 3 | **Aviso al terminar** por email o push | Permite regresar tras un proceso largo | Un canal; no implementar ambos antes de tener cola |
| 3 | PDF/portada generada | Presentación y exportación, poca profundidad de IA por sí solas | Solo después de los puntos anteriores |

Para la hackathon priorizaría **editor con fuentes + un caso real de tracking SAM + una aclaración con historial**. Una demo puede mostrar tres actos: reconocer un gesto, detectar un hueco y completar la receta con evidencia. Todas las funciones deben respetar repo público, contribuciones nuevas y video de tres minutos; no incluir salud, nutrición ni medidas inventadas.

## Configuración e integraciones pendientes

### Para desplegar esta implementación en Vercel

| Elemento | Comprobación local | Acción |
| --- | --- | --- |
| `MODEL_API_KEY` | Presente; el valor no se imprimió | Configurar por separado en el entorno Vercel correspondiente; nunca `NEXT_PUBLIC_` |
| `META_API_BASE_URL` | Presente localmente | En producción debe apuntar a la base Meta autorizada, no al stub de pruebas |
| `BLOB_READ_WRITE_TOKEN` | **Vacío en `.env.local`** | Vincular Vercel Blob y revisar que el token exista en el entorno desplegado |
| `NEXT_PUBLIC_STORAGE_DRIVER` | Existe localmente | Debe coincidir con el servidor: `blob` en Vercel con token; `local` solo para desarrollo |
| Root Directory | Documentado como `apps/web` | Confirmarlo en el proyecto Vercel |
| Duración de función | Ruta de fondo declara 300 s | Confirmar límite efectivo/plan y Fluid Compute |
| HTTPS y URL pública | No se auditó la configuración remota | Probar cámara/micrófono, enlaces WhatsApp y previews con la URL de producción |
| Despliegue | Cambios locales sin publicar | Ejecutar despliegue una vez revisados los cambios |

Se inspeccionaron nombres y presencia de variables locales, **no** los valores secretos ni las variables de producción. Un Blob store mencionado en el build log no prueba que el token esté configurado en todos los entornos remotos.

### Para producción fiable

1. **Almacenamiento y acceso:** la implementación actual usa Blob público con URLs no adivinables, no permisos de usuario. Los JSON internos también se guardan en ese driver. Mover metadatos sensibles a Postgres y medios a buckets privados con URLs firmadas antes de ofrecer cuadernos privados.
2. **Supabase:** crear/vincular proyecto, integrar Auth y cliente servidor, definir ownership, membresías y políticas RLS y Storage. Solo después habilitar la Data API y migrar las recetas. Nunca exponer service-role/secret keys al navegador. Los nombres de variables se definirán al implementar, no están soportados por el código actual.
3. **Jobs largos:** elegir **una** plataforma (por ejemplo Trigger.dev) o worker propio con cola Postgres/Redis. Mover extracción FFmpeg, reintentos y checkpoints allí; añadir autenticación/firma e idempotencia. No basta configurar un token: la integración aún requiere código. [Tasks](https://trigger.dev/docs/tasks/overview), [Supabase Queues](https://supabase.com/docs/guides/queues).
4. **Gasto y abuso:** reservar presupuesto antes de ejecutar cada job, contar tokens/audio/cuadros reales, limitar reintentos y volumen, cuotas por usuario y un interruptor global. No se añadió este control durante la revisión. El crédito real de Meta no se consulta automáticamente; el presupuesto de la app no cubre Playground u otras herramientas de la cuenta.
5. **Avisos:** servicio de email con dominio/remitente verificado o Web Push con permisos y suscripciones, una vez lista la cola.
6. **Observabilidad:** errores con identificador de job, métricas por etapa y consumo. Los `runs` actuales guardan modelo, etapa, resultado y tiempo, no una auditoría completa de entradas/salidas/versiones.
7. **PWA:** service worker y caché de lectura con políticas claras. No cachear indiscriminadamente videos o respuestas privadas.

No hace falta WhatsApp Business API para el MVP: se comparte un enlace mediante WhatsApp y se contesta dentro de la web.

Referencia de acceso a medios: [Supabase Storage](https://supabase.com/docs/guides/storage/security/access-control). La migración debe ser una decisión explícita; no se sustituyó Blob silenciosamente.

## Validación realizada

- `npm run typecheck`: correcto.
- `npm run lint`: correcto.
- `npm run build`: correcto.
- `node scripts/smoke-workflow.mjs`: diez comprobaciones de integración correctas con Next real y API Meta **simulada localmente**, sin gastar créditos. Incluyen 403 sin clave, respuesta 202 antes de terminar la IA, reutilización de job activo, ejecución sin orquestación del navegador, texto/voz del propietario, respuesta ambigua, enlace familiar, campos públicos filtrados y reanudación de análisis sin retranscribir.
- Resultado: `eval/results/workflow-smoke-20261028.json`. El tiempo observado de encolado es de una prueba local, no un benchmark de producción.
- Inspección visual en navegador local de landing y formulario, modo oscuro de escritorio. Capturas en `docs/previews/`. No se completó una prueba en dispositivos móviles físicos.
- Transparencia del logo comprobada: PNG RGBA con alfa 0–255; la imagen anterior era totalmente opaca.
- Las pruebas no validan precisión de modelos reales, tiempos de Vercel, permisos remotos, robustez distribuida ni una receta familiar completa en producción.

## Orden de trabajo recomendado

1. Revisar/desplegar estos cambios y confirmar Blob/Meta en el entorno elegido.
2. Implementar almacenamiento privado y cola durable con control de gasto.
3. Editor con fuentes y un seguimiento temporal SAM demostrable.
4. Historial de respuestas y prueba con familias autorizadas.
5. Medir huecos, asignación de respuestas, alineación de clips, cantidades sin fuente, costo y tiempo; documentar fallos reales.
6. Grabar demo y entregar antes del 4 de noviembre de 2026, 21:00 ET, manteniendo margen de envío.
