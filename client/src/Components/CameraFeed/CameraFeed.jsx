import { useState } from 'react'
import { motion } from 'framer-motion'
import { cameraOn, cameraOff } from '../../utils/api'
import './CameraFeed.css'

export default function CameraFeed({ isOn, onToggle }) {
  const [loading, setLoading] = useState(false)

  const toggle = async (state) => {
    setLoading(true)
    try {
      if (state) await cameraOn(); else await cameraOff()
      onToggle(state)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="camera-feed-wrapper glass-card">
      <div className="cam-header">
        <span className="section-title"><i className="bi bi-camera-video-fill" /> LIVE FEED</span>
        <div className="cam-controls">
          <button
            className={`cam-btn on ${isOn ? 'active' : ''}`}
            onClick={() => toggle(true)}
            disabled={loading || isOn}
          >
            <i className="bi bi-power" /> ON
          </button>
          <button
            className={`cam-btn off ${!isOn ? 'active' : ''}`}
            onClick={() => toggle(false)}
            disabled={loading || !isOn}
          >
            <i className="bi bi-power" /> OFF
          </button>
        </div>
      </div>

      <div className="cam-viewport">
        {/* Scanline overlay */}
        <div className="scanline" />

        {/* Corner decorations */}
        <div className="corner tl" /><div className="corner tr" />
        <div className="corner bl" /><div className="corner br" />

        {isOn ? (
          <img
            className="cam-img"
            src="/api/camera/stream"
            alt="Live traffic feed"
          />
        ) : (
          <div className="cam-offline">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <i className="bi bi-camera-video-off-fill" />
              <p>CAMERA OFFLINE</p>
              <span>Click ON to activate stream</span>
            </motion.div>
          </div>
        )}

        {/* Overlay badges */}
        {isOn && (
          <>
            <div className="cam-badge live"><span className="live-dot" /> LIVE</div>
            <div className="cam-badge cam-id">CAM-01</div>
            <div className="cam-badge ai-badge"><i className="bi bi-cpu" /> AI DETECTION ACTIVE</div>
          </>
        )}
      </div>
    </div>
  )
}
