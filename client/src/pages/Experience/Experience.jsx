import { motion } from 'framer-motion'
import '../About/StubPage.css'

const ITEMS = [
  { year: '2025–Now', tag: 'CURRENT',    title: 'Smart City AI Engineer',      desc: 'Designing and deploying real-time traffic monitoring systems across 4 junctions with YOLOv8 and FastAPI.' },
  { year: '2024',     tag: 'ML/AI',      title: 'Computer Vision Developer',   desc: 'Built vehicle detection pipelines achieving 94%+ accuracy using YOLOv8 custom training and tracking.' },
  { year: '2023',     tag: 'Backend',    title: 'FastAPI Backend Engineer',     desc: 'Developed high-throughput async REST APIs and WebSocket systems for real-time data streaming.' },
  { year: '2022',     tag: 'Frontend',   title: 'React Dashboard Developer',   desc: 'Created futuristic cyberpunk-themed traffic dashboards with Chart.js, Framer Motion, and WebSocket integration.' },
]

export default function Experience() {
  return (
    <motion.div
      className="stub-page"
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
    >
      <div className="stub-hero">
        <div className="stub-icon"><i className="bi bi-briefcase-fill" /></div>
        <h1>EXPERIENCE</h1>
        <p>Professional milestones in AI-powered smart city traffic management and real-time systems development.</p>
      </div>

      <div className="timeline">
        {ITEMS.map((item, i) => (
          <motion.div
            key={i} className="tl-item"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="tl-dot"><i className="bi bi-briefcase-fill" /></div>
            <div className="tl-content">
              <div className="tl-meta">
                <span className="tl-year">{item.year}</span>
                <span className="tl-tag">{item.tag}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
