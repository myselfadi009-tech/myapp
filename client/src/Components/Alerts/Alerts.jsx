import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAlerts } from '../../utils/api'
import './Alerts.css'

const TYPE_CONFIG = {
  danger:  { color: 'var(--danger)',   icon: 'bi-exclamation-circle-fill' },
  warning: { color: 'var(--warning)',  icon: 'bi-exclamation-triangle-fill' },
  info:    { color: 'var(--secondary)',icon: 'bi-info-circle-fill' },
  success: { color: 'var(--success)',  icon: 'bi-check-circle-fill' },
}

let nextId = 100

const LIVE_ALERTS = [
  { type: 'danger',  message: 'Emergency vehicle detected at Junction A' },
  { type: 'warning', message: 'Heavy traffic congestion on Main Street' },
  { type: 'info',    message: 'Signal optimisation algorithm updated' },
  { type: 'warning', message: 'Road occupancy above 80% on Route 7' },
  { type: 'danger',  message: 'Accident risk HIGH near Junction C' },
  { type: 'success', message: 'Traffic cleared — signal returned to normal' },
  { type: 'info',    message: 'Camera feed AI model recalibrated' },
]

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const bodyRef = useRef(null)

  useEffect(() => {
    getAlerts().then(r => {
      setAlerts(r.data.alerts.map((a, i) => ({ ...a, id: i })))
    }).catch(() => {})

    const t = setInterval(() => {
      const tmpl = LIVE_ALERTS[Math.floor(Math.random() * LIVE_ALERTS.length)]
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
      setAlerts(prev => [{ ...tmpl, id: nextId++, time }, ...prev].slice(0, 20))
    }, 8000)

    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [alerts.length])

  return (
    <div className="alerts-wrapper glass-card">
      <div className="alerts-header">
        <span className="section-title"><i className="bi bi-bell-fill" /> ALERT CENTER</span>
        <span className="alert-count">{alerts.length}</span>
      </div>

      <div className="alerts-body" ref={bodyRef}>
        <AnimatePresence initial={false}>
          {alerts.map((a) => {
            const cfg = TYPE_CONFIG[a.type] || TYPE_CONFIG.info
            return (
              <motion.div
                key={a.id}
                className="alert-item"
                style={{ borderLeftColor: cfg.color }}
                initial={{ opacity: 0, x: -30, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <i className={`bi ${cfg.icon}`} style={{ color: cfg.color }} />
                <div className="alert-text">
                  <span className="alert-msg">{a.message}</span>
                  {a.time && <span className="alert-time">{a.time}</span>}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
