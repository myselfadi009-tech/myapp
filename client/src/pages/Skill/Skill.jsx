import { motion } from 'framer-motion'
import '../About/StubPage.css'
import './Skill.css'

const SKILLS = [
  { cat: 'AI / ML',      items: [
    { name: 'YOLOv8',        pct: 95 },
    { name: 'Roboflow CLIP', pct: 88 },
    { name: 'PyTorch',       pct: 82 },
    { name: 'OpenCV',        pct: 90 },
  ]},
  { cat: 'Backend',      items: [
    { name: 'FastAPI',       pct: 93 },
    { name: 'Python',        pct: 95 },
    { name: 'WebSockets',    pct: 88 },
    { name: 'Uvicorn',       pct: 85 },
  ]},
  { cat: 'Frontend',     items: [
    { name: 'React.js',      pct: 91 },
    { name: 'Framer Motion', pct: 87 },
    { name: 'Chart.js',      pct: 85 },
    { name: 'Bootstrap 5',   pct: 92 },
  ]},
  { cat: 'Systems',      items: [
    { name: 'Smart City',    pct: 88 },
    { name: 'Traffic Mgmt',  pct: 90 },
    { name: 'Computer Vision',pct: 89 },
    { name: 'Real-time Sys', pct: 86 },
  ]},
]

export default function Skill() {
  return (
    <motion.div
      className="stub-page"
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
    >
      <div className="stub-hero">
        <div className="stub-icon"><i className="bi bi-cpu-fill" /></div>
        <h1>SKILLS</h1>
        <p>Core technical competencies powering the Smart Traffic Management System.</p>
      </div>

      <div className="skills-grid">
        {SKILLS.map((cat, ci) => (
          <div key={ci} className="skill-cat glass-card">
            <h3 className="skill-cat-title">{cat.cat}</h3>
            {cat.items.map((s, si) => (
              <motion.div
                key={si} className="skill-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (ci * 4 + si) * 0.05 }}
              >
                <div className="skill-header">
                  <span>{s.name}</span>
                  <span className="skill-pct" style={{ color: s.pct >= 90 ? 'var(--success)' : s.pct >= 80 ? 'var(--primary)' : 'var(--warning)' }}>{s.pct}%</span>
                </div>
                <div className="skill-bar-bg">
                  <motion.div
                    className="skill-bar-fill"
                    style={{ background: s.pct >= 90 ? 'var(--success)' : s.pct >= 80 ? 'var(--primary)' : 'var(--warning)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 1.2, delay: (ci * 4 + si) * 0.05 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
