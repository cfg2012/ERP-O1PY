import { useState } from 'react'

const STORAGE_KEY = 'o1py_campanas'

function loadCampanas() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveCampanas(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
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
  boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-primary)',
  marginBottom: 6,
}

const sectionLabel = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: 1,
  marginBottom: 14,
}

const emptyForm = {
  nombre: '',
  fechaInicio: '',
  fechaCierre: '',
  alcance: '',
  inversion: '',
  leadsMetaAds: '',
  leadsMetaCotizan: '',
  waMensajes: '',
  waRespuestas: '',
  waLeadsCotizan: '',
  polizasCerradas: '',
}

function CampanaCard({ c, onDelete }) {
  const leadsTotal = c.leadsMetaAds + c.waRespuestas
  const cotizaronTotal = c.leadsMetaCotizan + c.waLeadsCotizan
  const cpl = c.leadsMetaAds > 0 ? (c.inversion / c.leadsMetaAds).toFixed(2) : '—'
  const tasaConv = leadsTotal > 0 ? Math.round((cotizaronTotal / leadsTotal) * 100) : 0

  const metricas = [
    { label: 'Alcance', value: c.alcance.toLocaleString(), highlight: false },
    { label: 'Costo por lead', value: `USD ${cpl}`, highlight: false },
    { label: 'Leads totales', value: leadsTotal, highlight: false },
    { label: 'Leads → cotización', value: `${tasaConv}%`, highlight: tasaConv >= 30 },
  ]

  let decision
  if (c.polizasCerradas > 0) {
    decision = `✅ ${c.polizasCerradas} póliza${c.polizasCerradas > 1 ? 's' : ''} cerrada${c.polizasCerradas > 1 ? 's' : ''} — repetir mensaje en el próximo ciclo`
  } else if (cotizaronTotal > 0) {
    decision = '⚠️ Hubo cotizaciones pero sin cierre — revisar proceso de venta con Carlos'
  } else {
    decision = '⚠️ Sin conversiones — cambiar gancho en la próxima campaña'
  }

  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 20,
      boxShadow: 'var(--shadow)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{c.nombre}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {c.fechaInicio} → {c.fechaCierre} · USD {c.inversion} invertidos
          </div>
        </div>
        <button
          onClick={() => onDelete(c.id)}
          style={{
            padding: '4px 10px',
            background: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Eliminar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
        {metricas.map(m => (
          <div key={m.label} style={{
            textAlign: 'center',
            padding: '12px 8px',
            background: m.highlight ? '#f0fdf4' : '#eff6ff',
            borderRadius: 8,
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: m.highlight ? '#16a34a' : 'var(--accent)' }}>
              {m.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        padding: '10px 14px',
        background: '#f8fafc',
        borderRadius: 6,
        fontSize: 13,
        color: 'var(--text-secondary)',
      }}>
        {decision}
      </div>
    </div>
  )
}

export default function DashboardResultados() {
  const [campanas, setCampanas] = useState(loadCampanas)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nueva = {
      id: Date.now(),
      nombre: form.nombre,
      fechaInicio: form.fechaInicio,
      fechaCierre: form.fechaCierre,
      alcance: Number(form.alcance) || 0,
      inversion: Number(form.inversion) || 0,
      leadsMetaAds: Number(form.leadsMetaAds) || 0,
      leadsMetaCotizan: Number(form.leadsMetaCotizan) || 0,
      waMensajes: Number(form.waMensajes) || 0,
      waRespuestas: Number(form.waRespuestas) || 0,
      waLeadsCotizan: Number(form.waLeadsCotizan) || 0,
      polizasCerradas: Number(form.polizasCerradas) || 0,
    }
    const updated = [nueva, ...campanas]
    setCampanas(updated)
    saveCampanas(updated)
    setForm(emptyForm)
    setShowForm(false)
  }

  const handleDelete = (id) => {
    const updated = campanas.filter(c => c.id !== id)
    setCampanas(updated)
    saveCampanas(updated)
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
            Marketing
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            Resultados de Campañas
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Registrá los números al cerrar cada campaña y analizá tu evolución.
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            padding: '10px 20px',
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          + Registrar campaña
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 24,
          marginBottom: 28,
          boxShadow: 'var(--shadow)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
            Nueva campaña
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Nombre de campaña</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="MOTOS_MAYO_VELOCIDAD" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Fecha inicio</label>
              <input type="date" name="fechaInicio" value={form.fechaInicio} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Fecha cierre</label>
              <input type="date" name="fechaCierre" value={form.fechaCierre} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 20 }}>
            <div style={sectionLabel}>📢 Meta Ads</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <div>
                <label style={labelStyle}>Alcance</label>
                <input type="number" name="alcance" value={form.alcance} onChange={handleChange} min={0} placeholder="0" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Inversión (USD)</label>
                <input type="number" name="inversion" value={form.inversion} onChange={handleChange} min={0} step="0.01" placeholder="50" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Leads recibidos</label>
                <input type="number" name="leadsMetaAds" value={form.leadsMetaAds} onChange={handleChange} min={0} placeholder="0" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Leads que cotizaron</label>
                <input type="number" name="leadsMetaCotizan" value={form.leadsMetaCotizan} onChange={handleChange} min={0} placeholder="0" style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 20 }}>
            <div style={sectionLabel}>💬 WhatsApp Masivo</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div>
                <label style={labelStyle}>Mensajes enviados</label>
                <input type="number" name="waMensajes" value={form.waMensajes} onChange={handleChange} min={0} placeholder="0" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Respuestas</label>
                <input type="number" name="waRespuestas" value={form.waRespuestas} onChange={handleChange} min={0} placeholder="0" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Leads que cotizaron</label>
                <input type="number" name="waLeadsCotizan" value={form.waLeadsCotizan} onChange={handleChange} min={0} placeholder="0" style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 24 }}>
            <div style={sectionLabel}>🏆 Resultado final</div>
            <div style={{ maxWidth: 200 }}>
              <label style={labelStyle}>Pólizas cerradas</label>
              <input type="number" name="polizasCerradas" value={form.polizasCerradas} onChange={handleChange} min={0} placeholder="0" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" style={{
              padding: '10px 24px',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              Guardar campaña
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{
              padding: '10px 24px',
              background: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              fontSize: 14,
              cursor: 'pointer',
            }}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {campanas.length === 0 && !showForm && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-muted)',
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
            Sin campañas registradas
          </div>
          <div style={{ fontSize: 14 }}>
            Registrá tu primera campaña al cerrar el primer ciclo de 15 días.
          </div>
        </div>
      )}

      {campanas.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {campanas.map(c => (
            <CampanaCard key={c.id} c={c} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
