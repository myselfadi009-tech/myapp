import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cameraOn, cameraOff } from '../../utils/api'
import './CameraFeed.css'

export default function CameraFeed({ isOn, onToggle }) {
  const [loading, setLoading]         = useState(false)
  const [fullscreen, setFullscreen]   = useState(false)

  const toggle = async (state) => {
    setLoading(true)
    try {
      if (state) await cameraOn(); else await cameraOff()
      onToggle(state)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setFullscreen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const feedContent = (isFull) => (
    <>
      {/* Header */}
      <div className="cam-hdr">
        <div className="cam-hdr-left">
          <span className="section-title" style={{ marginBottom: 0 }}>
            <i className="bi bi-camera-video-fill" /> LIVE FEED — CAM 07 (MAIN STREET)
          </span>
          {isOn && <span className="cam-live-tag"><span className="cam-live-dot" />LIVE</span>}
        </div>
        <div className="cam-hdr-btns">
          <button className={`cam-btn-cmd on ${isOn?'active':''}`} onClick={()=>toggle(true)} disabled={loading||isOn}>
            <i className="bi bi-power" /> ON
          </button>
          <button className={`cam-btn-cmd off ${!isOn?'active':''}`} onClick={()=>toggle(false)} disabled={loading||!isOn}>
            <i className="bi bi-power" /> OFF
          </button>
          <button
            className="cam-btn-cmd cam-btn-fs"
            onClick={() => setFullscreen(!isFull)}
            title={isFull ? 'Minimize (Esc)' : 'Maximize'}
          >
            <i className={`bi ${isFull ? 'bi-fullscreen-exit' : 'bi-fullscreen'}`} />
            {isFull ? 'MINIMIZE' : 'MAXIMIZE'}
          </button>
        </div>
      </div>

      {/* Viewport */}
      <div className={`cam-viewport ${isFull ? 'cam-viewport-fs' : ''}`}>
        <div className="cam-scanline" />
        <div className="cam-corner tl" /><div className="cam-corner tr" />
        <div className="cam-corner bl" /><div className="cam-corner br" />

        {isOn ? (
          <img className="cam-img" src="/api/camera/stream" alt="Live traffic feed" />
        ) : (
          <div className="cam-offline">
            <motion.div className="cam-offline-inner"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <i className="bi bi-camera-video-off-fill" />
              <p>CAMERA OFFLINE</p>
              <span>Click ON to activate stream</span>
            </motion.div>
          </div>
        )}

        {isOn && (
          <>
            <div className="cam-ov cam-ov-tl">
              <div className="cam-info-row">Camera: <b>CAM 07</b></div>
              <div className="cam-info-row">Location: <b>Main Street</b></div>
            </div>
            <div className="cam-ov cam-ov-tr cam-id-badge">CAM-07</div>
            <div className="cam-ov cam-ov-br">
              <span className="cam-ai-badge"><i className="bi bi-cpu-fill" /> AI DETECTION ACTIVE</span>
              <span className="cam-track-badge"><i className="bi bi-bounding-box" /> YOLO v8</span>
            </div>
          </>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Normal card */}
      <div className="cam-wrapper glass-card">
        {feedContent(false)}
      </div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className="cam-fs-overlay"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            {feedContent(true)}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
