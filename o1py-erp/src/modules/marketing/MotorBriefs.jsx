import { useState } from 'react'

const GANCHOS = [
  { value: 'velocidad', label: '⚡ Velocidad — "En 5 minutos tenés tu seguro"' },
  { value: 'precio', label: '💲 Precio — "Desde Gs. X por mes"' },
  { value: 'tranquilidad', label: '🛡️ Tranquilidad — "Cubrí tu moto ante cualquier accidente"' },
  { value: 'facilidad', label: '📱 Facilidad — "Sin papelerío, sin filas"' },
]

const PRODUCTOS = [
  'Seguro de moto — Sancor',
  'Seguro de moto — Ueno',
  'Seguro de moto — Panal',
  'Seguro de auto — Sancor',
  'Seguro de auto — Ueno',
]

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} style={{
      padding: '4px 12px',
      fontSize: 12,
      border: '1px solid var(--border)',
      borderRadius: 4,
      background: copied ? 'var(--success)' : 'white',
      color: copied ? 'white' : 'var(--text-secondary)',
      transition: 'all 0.2s',
    }}>
      {copied ? '✓ Copiado' : 'Copiar'}
    </button>
  )
}

function ResultCard({ title, children, style }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        background: '#f8fafc',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
      }}>
        {title}
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  )
}

function CopyRow({ label, text }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
        <CopyButton text={text} />
      </div>
      <div style={{
        background: '#f8fafc',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 14,
        color: 'var(--text-primary)',
        lineHeight: 1.5,
      }}>
        {text}
      </div>
    </div>
  )
}

export default function MotorBriefs() {
  const [form, setForm] = useState({
    producto: PRODUCTOS[0],
    contexto: '',
    gancho: GANCHOS[0].value,
    presupuesto: 50,
  })
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResultado(null)

    try {
      const res = await fetch('/api/generarBrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setResultado(data)
    } catch (err) {
      setError('No se pudo generar el brief. Verificá la conexión e intentá de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
          Marketing
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
          Motor de Briefs
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Completá los 4 campos y generá el brief completo con el copy listo para Meta Ads y WhatsApp.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: 24,
        marginBottom: 28,
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>Producto</label>
            <select name="producto" value={form.producto} onChange={handleChange} style={inputStyle}>
              {PRODUCTOS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Gancho principal</label>
            <select name="gancho" value={form.gancho} onChange={handleChange} style={inputStyle}>
              {GANCHOS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>
              Contexto del mes
              <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>(ej: quincena, lluvia, fin de año)</span>
            </label>
            <input
              name="contexto"
              value={form.contexto}
              onChange={handleChange}
              placeholder="quincena de mayo"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Presupuesto Meta Ads (USD)</label>
            <input
              type="number"
              name="presupuesto"
              value={form.presupuesto}
              onChange={handleChange}
              min={10}
              max={500}
              style={inputStyle}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 24px',
            background: loading ? 'var(--text-muted)' : 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 15,
            fontWeight: 600,
            transition: 'background 0.2s',
          }}
        >
          {loading ? '⏳ Generando brief...' : '✨ Generar brief'}
        </button>
      </form>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius)',
          padding: '12px 16px',
          color: '#dc2626',
          fontSize: 14,
          marginBottom: 20,
        }}>
          {error}
        </div>
      )}

      {resultado && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
            border: '1px solid #bfdbfe',
            borderRadius: 'var(--radius)',
            padding: '16px 20px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', letterSpacing: 1, marginBottom: 6 }}>MENSAJE PRINCIPAL</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1e40af', marginBottom: 8 }}>
              "{resultado.mensajePrincipal}"
            </div>
            <div style={{ fontSize: 13, color: '#3730a3' }}>
              <strong>Público objetivo:</strong> {resultado.publicoObjetivo}
            </div>
          </div>

          <ResultCard title="Meta Ads — Variante A">
            <CopyRow label="Título" text={resultado.copiesMetaAds?.[0]?.titulo || ''} />
            <CopyRow label="Texto del anuncio" text={resultado.copiesMetaAds?.[0]?.texto || ''} />
          </ResultCard>

          <ResultCard title="Meta Ads — Variante B">
            <CopyRow label="Título" text={resultado.copiesMetaAds?.[1]?.titulo || ''} />
            <CopyRow label="Texto del anuncio" text={resultado.copiesMetaAds?.[1]?.texto || ''} />
          </ResultCard>

          <ResultCard title="WhatsApp — Mensaje de broadcast">
            <CopyRow label="Mensaje completo" text={resultado.mensajeWhatsApp || ''} />
          </ResultCard>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <ResultCard title="Hashtags Instagram">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(resultado.hashtagsInstagram || []).map(tag => (
                  <span key={tag} style={{
                    background: '#eff6ff',
                    color: 'var(--accent)',
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 500,
                  }}>{tag}</span>
                ))}
              </div>
              <div style={{ marginTop: 10 }}>
                <CopyButton text={(resultado.hashtagsInstagram || []).join(' ')} />
              </div>
            </ResultCard>

            <ResultCard title="Sugerencia visual">
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {resultado.sugerenciaVisual}
              </p>
            </ResultCard>
          </div>

          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius)',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: 14, color: '#166534' }}>
              ✓ Brief generado. Guardalo en tu carpeta <strong>Marketing/Briefs/</strong> antes de cerrar.
            </span>
            <button
              onClick={() => {
                const texto = formatearBriefParaExportar(form, resultado)
                navigator.clipboard.writeText(texto)
              }}
              style={{
                padding: '6px 16px',
                background: 'var(--success)',
                color: 'white',
                border: 'none',
                borderRadius: 5,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Copiar brief completo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function formatearBriefParaExportar(form, resultado) {
  return `BRIEF DE CAMPAÑA
================
Producto: ${form.producto}
Contexto: ${form.contexto || 'Sin contexto específico'}
Gancho: ${form.gancho}
Presupuesto: USD ${form.presupuesto}

MENSAJE PRINCIPAL
"${resultado.mensajePrincipal}"

PÚBLICO OBJETIVO
${resultado.publicoObjetivo}

META ADS — VARIANTE A
Título: ${resultado.copiesMetaAds?.[0]?.titulo}
Texto: ${resultado.copiesMetaAds?.[0]?.texto}

META ADS — VARIANTE B
Título: ${resultado.copiesMetaAds?.[1]?.titulo}
Texto: ${resultado.copiesMetaAds?.[1]?.texto}

WHATSAPP MASIVO
${resultado.mensajeWhatsApp}

HASHTAGS
${(resultado.hashtagsInstagram || []).join(' ')}

SUGERENCIA VISUAL
${resultado.sugerenciaVisual}
`
}

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-primary)',
  marginBottom: 6,
}

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid var(--border)',
  borderRadius: 6,
  fontSize: 14,
  color: 'var(--text-primary)',
  background: 'white',
  outline: 'none',
}
