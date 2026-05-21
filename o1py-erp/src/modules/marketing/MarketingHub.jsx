import { useState } from 'react'
import MotorBriefs from './MotorBriefs'
import DashboardResultados from './DashboardResultados'

const tabs = [
  { id: 'briefs', label: '✨ Motor de Briefs' },
  { id: 'resultados', label: '📊 Resultados' },
]

export default function MarketingHub() {
  const [activeTab, setActiveTab] = useState('briefs')

  return (
    <div>
      <div style={{
        display: 'flex',
        gap: 4,
        marginBottom: 32,
        borderBottom: '1px solid var(--border)',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 20px',
              border: 'none',
              background: 'transparent',
              fontSize: 14,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'briefs' ? <MotorBriefs /> : <DashboardResultados />}
    </div>
  )
}
