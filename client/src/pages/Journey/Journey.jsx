import { motion } from 'framer-motion'
import '../About/StubPage.css'

const MILESTONES = [
  { year: '2022 Q1', icon: 'bi-lightbulb-fill',      label: 'Concept',     desc: 'Idea for AI-powered traffic management conceived — research into YOLOv8 and smart city systems begins.' },
  { year: '2022 Q3', icon: 'bi-tools',               label: 'Prototype',   desc: 'First working prototype with OpenCV and basic vehicle detection on a single camera feed.' },
  { year: '2023 Q1', icon: 'bi-database-fill',        label: 'Backend',     desc: 'FastAPI backend launched with REST endpoints, WebSocket, and real-time signal control APIs.' },
  { year: '2023 Q3', icon: 'bi-display-fill',         label: 'Dashboard',   desc: 'React cyberpunk dashboard delivered with live charts, alerts, and animated traffic signals.' },
  { year: '2024 Q1', icon: 'bi-shield-fill',          label: 'AI Safety',   desc: 'Roboflow CLIP accident severity model integrated for real-time risk prediction.' },
  { year: '2025',    icon: 'bi-rocket-takeoff-fill',  label: 'Production',  desc: 'Full production deployment across 4 city junctions — live monitoring of 10,000+ vehicles/day.' },
]

export default function Journey() {
  return (
    <motion.div
      className="stub-page"
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
    >
      <div className="stub-hero">
        <div className="stub-icon"><i className="bi bi-map-fill" /></div>
        <h1>THE JOURNEY</h1>
        <p>From concept to production — the evolution of an AI traffic management system built for tomorrow's cities.</p>
      </div>

      <div className="timeline">
        {MILESTONES.map((m, i) => (
          <motion.div
            key={i} className="tl-item"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="tl-dot"><i className={`bi ${m.icon}`} /></div>
            <div className="tl-content">
              <div className="tl-meta">
                <span className="tl-year">{m.year}</span>
                <span className="tl-tag">{m.label}</span>
              </div>
              <h3>{m.label}</h3>
              <p>{m.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
