import { motion } from 'framer-motion'
import '../About/StubPage.css'

const ITEMS = [
  { year: '2024', tag: 'AI / ML',       title: 'YOLOv8 & Computer Vision',        desc: 'Advanced object detection, tracking, and real-time inference for traffic monitoring.' },
  { year: '2023', tag: 'Backend',       title: 'FastAPI & Python Async',           desc: 'High-performance async web APIs with WebSocket support for real-time data streaming.' },
  { year: '2023', tag: 'Frontend',      title: 'React.js & Vite',                  desc: 'Modern component-based UI development with Vite build tooling and Framer Motion.' },
  { year: '2022', tag: 'Smart City',    title: 'Urban Traffic Systems',            desc: 'Intelligent transportation systems, signal control theory, and traffic flow models.' },
  { year: '2022', tag: 'Deep Learning', title: 'Neural Networks & CLIP',           desc: 'Transformer-based vision-language models for accident severity classification.' },
]

export default function Education() {
  return (
    <motion.div
      className="stub-page"
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
    >
      <div className="stub-hero">
        <div className="stub-icon"><i className="bi bi-mortarboard-fill" /></div>
        <h1>EDUCATION</h1>
        <p>The technology stack and knowledge domains powering the Smart Traffic Management System.</p>
      </div>

      <div className="timeline">
        {ITEMS.map((item, i) => (
          <motion.div
            key={i} className="tl-item"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="tl-dot"><i className="bi bi-mortarboard-fill" /></div>
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
