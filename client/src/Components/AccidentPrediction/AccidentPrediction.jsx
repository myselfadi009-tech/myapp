import { Line } from 'react-chartjs-2'
import { motion } from 'framer-motion'
import { SEVERITY_COLORS } from '../../utils/constants'
import './AccidentPrediction.css'

const RECOMMENDATIONS = {
  LOW:      ['Continue normal operations', 'Monitor traffic flow periodically'],
  MEDIUM:   ['Deploy additional surveillance units', 'Alert nearby traffic officers', 'Reduce speed limits preventively'],
  HIGH:     ['Dispatch rapid response team', 'Activate incident management protocol', 'Issue public traffic advisory'],
  CRITICAL: ['DISPATCH EMERGENCY RESPONSE NOW', 'Close affected lanes immediately', 'Activate full incident protocol', 'Alert hospitals and emergency services'],
}

export default function AccidentPrediction({ score, status, history }) {
  const sev = status || 'LOW'
  const pct = Math.min(100, score || 0)
  const color = SEVERITY_COLORS[sev] || SEVERITY_COLORS.LOW
  const recs = RECOMMENDATIONS[sev] || RECOMMENDATIONS.LOW

  const histData = {
    labels: Array.from({ length: history?.length || 20 }, (_, i) => `${i}s`),
    datasets: [{
      label: 'Risk Score',
      data: history || Array(20).fill(0),
      borderColor: color,
      backgroundColor: `${color}22`,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    }],
  }

  const gaugePercent = pct / 100
  const circumference = 2 * Math.PI * 45
  const offset = circumference * (1 - gaugePercent)

  return (
    <div className="accident-wrapper glass-card">
      <div className="section-title"><i className="bi bi-shield-exclamation" /> ACCIDENT PREDICTION</div>

      <div className="accident-grid">
        {/* Gauge */}
        <div className="gauge-section">
          <div className="gauge-container">
            <svg viewBox="0 0 100 100" className="gauge-svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ filter: `drop-shadow(0 0 6px ${color})`, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
              <text x="50" y="45" textAnchor="middle" fontSize="14" fontWeight="bold" fill={color} fontFamily="Orbitron,monospace">
                {Math.round(pct)}%
              </text>
              <text x="50" y="58" textAnchor="middle" fontSize="6" fill="#94a3b8" fontFamily="Rajdhani,sans-serif" letterSpacing="1">
                RISK SCORE
              </text>
            </svg>
          </div>
          <div className="severity-badge" style={{ background: `${color}22`, borderColor: color, color }}>
            {sev} SEVERITY
          </div>
        </div>

        {/* Recommendations */}
        <div className="recs-section">
          <h4>Recommendations</h4>
          <ul>
            {recs.map((r, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ color: sev === 'CRITICAL' ? color : 'var(--text-primary)' }}
              >
                <i className="bi bi-chevron-right" style={{ color }} /> {r}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* History chart */}
        <div className="accident-chart">
          <h4>Prediction History</h4>
          <div style={{ height: 100 }}>
            <Line
              data={histData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 400 },
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: '#475569', font: { size: 8 } }, grid: { color: '#1e293b' } },
                  y: { ticks: { color: '#475569', font: { size: 8 } }, grid: { color: '#1e293b' }, min: 0, max: 100 },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
