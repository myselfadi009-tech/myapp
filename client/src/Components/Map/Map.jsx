import { DENSITY_COLORS, SIGNAL_COLORS } from '../../utils/constants'
import './Map.css'

const JUNCTIONS = [
  { id: 'A', x: 28, y: 30, label: 'Junction A' },
  { id: 'B', x: 72, y: 30, label: 'Junction B' },
  { id: 'C', x: 28, y: 70, label: 'Junction C' },
  { id: 'D', x: 72, y: 70, label: 'Junction D' },
]

const ROADS = [
  { x1: 28, y1: 30, x2: 72, y2: 30 },
  { x1: 28, y1: 70, x2: 72, y2: 70 },
  { x1: 28, y1: 30, x2: 28, y2: 70 },
  { x1: 72, y1: 30, x2: 72, y2: 70 },
  { x1: 28, y1: 30, x2: 72, y2: 70, dashed: true },
  { x1: 72, y1: 30, x2: 28, y2: 70, dashed: true },
]

export default function Map({ density, signal }) {
  const junctionColor = DENSITY_COLORS[density] || DENSITY_COLORS.LOW

  return (
    <div className="map-wrapper glass-card">
      <div className="section-title"><i className="bi bi-map-fill" /> SMART CITY MAP</div>

      <div className="map-container">
        <svg viewBox="0 0 100 100" className="city-map">
          {/* Road grid */}
          {ROADS.map((r, i) => (
            <line
              key={i}
              x1={r.x1} y1={r.y1}
              x2={r.x2} y2={r.y2}
              stroke={r.dashed ? 'rgba(0,229,255,0.1)' : 'rgba(0,229,255,0.3)'}
              strokeWidth={r.dashed ? 0.4 : 1.2}
              strokeDasharray={r.dashed ? '2,2' : '0'}
            />
          ))}

          {/* Traffic flow dots */}
          {ROADS.slice(0, 4).map((r, i) => (
            <circle key={`dot-${i}`} r="1.5" fill={junctionColor} opacity="0.8">
              <animateMotion
                dur={`${2 + i * 0.5}s`}
                repeatCount="indefinite"
                path={`M${r.x1},${r.y1} L${r.x2},${r.y2}`}
              />
            </circle>
          ))}

          {/* Junction nodes */}
          {JUNCTIONS.map((j) => (
            <g key={j.id}>
              <circle cx={j.x} cy={j.y} r="5" fill={junctionColor} opacity="0.2" />
              <circle cx={j.x} cy={j.y} r="3" fill={junctionColor} />
              <text x={j.x} y={j.y - 6} textAnchor="middle" fontSize="3.5" fill="#94a3b8">
                {j.label}
              </text>
              {/* Mini signal */}
              <rect
                x={j.x + 4} y={j.y - 3}
                width={3} height={6} rx="0.5"
                fill={SIGNAL_COLORS[signal] || '#EF4444'}
                opacity="0.9"
              />
            </g>
          ))}
        </svg>

        <div className="map-legend">
          {Object.entries(DENSITY_COLORS).filter(([k]) => k !== 'UNKNOWN').map(([k, v]) => (
            <div key={k} className="legend-item">
              <span className="legend-dot" style={{ background: v }} />
              <span>{k}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
