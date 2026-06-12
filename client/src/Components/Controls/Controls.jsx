import { useState } from 'react'
import { motion } from 'framer-motion'
import { changeSignal } from '../../utils/api'
import './Controls.css'

const SIGNALS = [
  { val: 'RED',    label: 'Red',    color: 'var(--danger)',   icon: 'bi-stop-fill' },
  { val: 'YELLOW', label: 'Yellow', color: 'var(--warning)',  icon: 'bi-pause-fill' },
  { val: 'GREEN',  label: 'Green',  color: 'var(--success)',  icon: 'bi-play-fill' },
  { val: 'AUTO',   label: 'Auto',   color: 'var(--primary)',  icon: 'bi-cpu-fill' },
]

export default function Controls({ onSignalChange }) {
  const [activeSignal, setActiveSignal] = useState('AUTO')
  const [loading, setLoading] = useState(false)

  const handleSignal = async (val) => {
    setLoading(true)
    try {
      await changeSignal(val)
      setActiveSignal(val)
      onSignalChange && onSignalChange(val)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="controls-wrapper glass-card">
      <div className="section-title"><i className="bi bi-sliders" /> CONTROL CENTER</div>

      <div className="controls-inner">
        <div className="control-group">
          <h4>Signal Control</h4>
          <div className="signal-btns">
            {SIGNALS.map(s => (
              <motion.button
                key={s.val}
                className={`signal-control-btn ${activeSignal === s.val ? 'active' : ''}`}
                style={{
                  '--btn-color': s.color,
                  borderColor: activeSignal === s.val ? s.color : 'rgba(255,255,255,0.1)',
                  color: activeSignal === s.val ? s.color : 'var(--text-muted)',
                  background: activeSignal === s.val ? `${s.color}18` : 'transparent',
                }}
                onClick={() => handleSignal(s.val)}
                disabled={loading}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.04 }}
              >
                {activeSignal === s.val && (
                  <motion.div
                    className="ripple"
                    style={{ background: s.color }}
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
                <i className={`bi ${s.icon}`} />
                <span>{s.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="control-info">
          <div className="ci-row">
            <span>Mode:</span>
            <span style={{ color: SIGNALS.find(s => s.val === activeSignal)?.color }}>
              {activeSignal === 'AUTO' ? 'Automatic (AI)' : 'Manual Override'}
            </span>
          </div>
          <div className="ci-row">
            <span>Signal:</span>
            <span style={{ color: SIGNALS.find(s => s.val === activeSignal)?.color }}>
              {activeSignal}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
