import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimatedNumber from '../../hooks/useAnimatedNumber'
import './Home.css'

const FEATURES = [
  { icon: 'bi-camera-video-fill',    title: 'Live Camera Feed',      desc: 'Real-time CCTV monitoring with AI detection overlay and scanline effects.' },
  { icon: 'bi-cpu-fill',             title: 'YOLOv8 Detection',      desc: 'State-of-the-art vehicle detection, counting, and classification with 94%+ accuracy.' },
  { icon: 'bi-lightning-charge-fill',title: 'Smart Signal Control',  desc: 'Dynamic signal management with ambulance priority override and density-based automation.' },
  { icon: 'bi-graph-up-arrow',       title: 'Traffic Analytics',     desc: 'Real-time charts for vehicle trends, density, speed, and congestion monitoring.' },
  { icon: 'bi-shield-exclamation',   title: 'Accident Prediction',   desc: 'Roboflow CLIP model predicts accident severity and provides emergency recommendations.' },
  { icon: 'bi-broadcast-pin',        title: 'WebSocket Live Data',   desc: 'Sub-second data push via WebSocket — no polling, always accurate.' },
]

const STATS = [
  { end: 94, suffix: '%',  label: 'AI Accuracy' },
  { end: 4,  suffix: '',   label: 'Junctions Monitored' },
  { end: 30, suffix: 'ms', label: 'Response Time' },
  { end: 24, suffix: '/7', label: 'Uptime' },
]

export default function Home() {
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      dur: `${Math.random() * 4 + 3}s`,
    }))
  )

  return (
    <div className="home-page">
      {/* Floating particles */}
      <div className="particles" aria-hidden="true">
        {particles.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top:  `${p.y}%`,
              width:  p.size,
              height: p.size,
              animationDuration: p.dur,
            }}
          />
        ))}
      </div>

      {/* ── Hero ── */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-badge">
            <span className="badge-dot" /> AI-POWERED TRAFFIC CONTROL
          </div>
          <h1 className="hero-title">
            SMART TRAFFIC<br />
            <span className="hero-accent">MANAGEMENT SYSTEM</span>
          </h1>
          <p className="hero-desc">
            Next-generation urban traffic intelligence using YOLOv8 AI detection,
            real-time signal management, and predictive accident severity analysis.
            Built for smart cities of tomorrow.
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary-neon">
              <i className="bi bi-speedometer2" /> OPEN DASHBOARD
            </Link>
            <a href="#features" className="btn-secondary-neon">
              <i className="bi bi-info-circle" /> LEARN MORE
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="hero-rings">
            <div className="ring ring-1" />
            <div className="ring ring-2" />
            <div className="ring ring-3" />
          </div>
          <div className="traffic-light-hero animate-float">
            <div className="tl-housing">
              <div className="tl-light red active" />
              <div className="tl-light yellow" />
              <div className="tl-light green" />
            </div>
            <div className="tl-pole" />
          </div>
        </motion.div>
      </section>

      {/* ── Stats bar ── */}
      <motion.section
        className="stats-bar"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {STATS.map((s, i) => (
          <div key={i} className="stat-item">
            <div className="stat-value">
              <AnimatedNumber end={s.end} duration={1600} suffix={s.suffix} />
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </motion.section>

      {/* ── Features ── */}
      <section className="features-section" id="features">
        <motion.h2
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          SYSTEM CAPABILITIES
        </motion.h2>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className="feature-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="feature-icon">
                <i className={`bi ${f.icon}`} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <motion.section
        className="cta-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="cta-card glass-card neon-border">
          <h2>READY TO MONITOR YOUR CITY?</h2>
          <p>Access the real-time AI dashboard and take control of urban traffic intelligence.</p>
          <Link to="/dashboard" className="btn-primary-neon large">
            <i className="bi bi-display-fill" /> LAUNCH COMMAND CENTER
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
