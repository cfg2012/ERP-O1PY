const { onRequest } = require('firebase-functions/v2/https')
const Anthropic = require('@anthropic-ai/sdk')

const SYSTEM_PROMPT = `Sos un experto en marketing digital para corredoras de seguros en Paraguay.
Tu objetivo es generar briefs de campaña y copy publicitario para O1PY, una corredora de seguros.
El producto estrella son los seguros de motocicletas.
Usás español rioplatense (vos, no tú). Sos directo y comercial.
Respondés ÚNICAMENTE con JSON válido, sin texto adicional, sin markdown, sin bloques de código.`

const GANCHOS = {
  velocidad: 'velocidad y simplicidad del proceso ("En 5 minutos tenés tu seguro")',
  precio: 'precio accesible ("Desde X por mes")',
  tranquilidad: 'protección y tranquilidad ante accidentes',
  facilidad: 'facilidad del trámite sin papelerío ni filas',
}

exports.api = onRequest({
  cors: true,
  invoker: 'public',
  region: 'us-central1',
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  // El path puede llegar como /generarBrief o /api/generarBrief según el origen
  const endpoint = req.path.replace(/^\/(api\/)?/, '')

  if (endpoint === 'generarBrief') {
    return handleGenerarBrief(req, res)
  }

  return res.status(404).json({ error: 'Endpoint no encontrado', path: req.path })
})

async function handleGenerarBrief(req, res) {
  const { producto, contexto, gancho, presupuesto } = req.body

  if (!producto || !gancho) {
    return res.status(400).json({ error: 'Faltan campos requeridos: producto, gancho' })
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const userPrompt = `Generá un brief completo de campaña publicitaria con estos datos:

- Producto: ${producto}
- Contexto del mes: ${contexto || 'Sin contexto especial'}
- Gancho principal: ${GANCHOS[gancho] || gancho}
- Presupuesto Meta Ads: USD ${presupuesto || 50}
- Empresa: O1PY Corredora de Seguros (Paraguay)
- Canal principal de contacto: WhatsApp

Respondé ÚNICAMENTE con este JSON (sin texto adicional):
{
  "mensajePrincipal": "oración central del mensaje, impactante, máximo 15 palabras",
  "publicoObjetivo": "descripción del público ideal en 2 oraciones",
  "copiesMetaAds": [
    {
      "titulo": "título del anuncio, máximo 40 caracteres",
      "texto": "cuerpo del anuncio, máximo 125 caracteres, con CTA al WhatsApp",
      "variante": "A"
    },
    {
      "titulo": "segunda variante del título, enfoque diferente, máximo 40 caracteres",
      "texto": "segunda variante del cuerpo, máximo 125 caracteres",
      "variante": "B"
    }
  ],
  "mensajeWhatsApp": "mensaje completo para broadcast de WhatsApp, con emojis, máximo 200 caracteres, incluye CTA",
  "hashtagsInstagram": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "sugerenciaVisual": "descripción concreta de la imagen o video ideal para este anuncio, 2-3 oraciones"
}`

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = message.content[0].text.trim()
    const jsonStart = text.indexOf('{')
    const jsonEnd = text.lastIndexOf('}') + 1
    const jsonText = text.slice(jsonStart, jsonEnd)
    const resultado = JSON.parse(jsonText)

    return res.status(200).json(resultado)
  } catch (err) {
    console.error('Error generando brief:', err)
    return res.status(500).json({ error: 'Error al generar el brief. Intentá de nuevo.' })
  }
}
