import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import MarketingHub from './modules/marketing/MarketingHub'

function ComingSoon({ nombre }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>
          Módulo {nombre}
        </div>
        <div style={{ fontSize: 14 }}>En desarrollo — próximamente</div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/marketing" replace />} />
          <Route path="/marketing" element={<MarketingHub />} />
          <Route path="/comercial" element={<ComingSoon nombre="Comercial" />} />
          <Route path="/operaciones" element={<ComingSoon nombre="Operaciones" />} />
          <Route path="/cobranzas" element={<ComingSoon nombre="Cobranzas" />} />
          <Route path="/siniestros" element={<ComingSoon nombre="Siniestros" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
