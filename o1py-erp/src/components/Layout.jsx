import { NavLink } from 'react-router-dom'

const modules = [
  { id: 'marketing', label: 'Marketing', icon: '📣', path: '/marketing', active: true },
  { id: 'comercial', label: 'Comercial', icon: '🤝', path: '/comercial', active: false },
  { id: 'operaciones', label: 'Operaciones', icon: '⚙️', path: '/operaciones', active: false },
  { id: 'cobranzas', label: 'Cobranzas', icon: '💰', path: '/cobranzas', active: false },
  { id: 'siniestros', label: 'Siniestros', icon: '🔧', path: '/siniestros', active: false },
]

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: 240,
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 10,
      }}>
        <div style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid var(--sidebar-border)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--text-muted)', marginBottom: 4 }}>
            O1PY
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>
            ERP
          </div>
        </div>

        <nav style={{ padding: '12px 0', flex: 1 }}>
          <div style={{ padding: '8px 16px 4px', fontSize: 10, fontWeight: 600, letterSpacing: 1.5, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Módulos
          </div>
          {modules.map(mod => (
            mod.active ? (
              <NavLink
                key={mod.id}
                to={mod.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  margin: '2px 8px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'white' : 'var(--text-muted)',
                  background: isActive ? 'rgba(59,130,246,0.2)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                  transition: 'all 0.15s',
                })}
              >
                <span>{mod.icon}</span>
                <span>{mod.label}</span>
              </NavLink>
            ) : (
              <div
                key={mod.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  margin: '2px 8px',
                  borderRadius: 6,
                  fontSize: 14,
                  color: 'var(--sidebar-border)',
                  cursor: 'not-allowed',
                  borderLeft: '3px solid transparent',
                }}
              >
                <span style={{ opacity: 0.4 }}>{mod.icon}</span>
                <span>{mod.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, background: 'var(--sidebar-border)', color: 'var(--text-muted)', padding: '1px 6px', borderRadius: 10 }}>
                  pronto
                </span>
              </div>
            )
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--sidebar-border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>v0.1 — Mayo 2026</div>
        </div>
      </aside>

      <main style={{ marginLeft: 240, flex: 1, padding: '32px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
