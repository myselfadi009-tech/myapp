import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { connectWS, disconnectWS } from '../../utils/socket'

import CameraFeed from '../../Components/CameraFeed/CameraFeed'
import TrafficSignal from '../../Components/TrafficSignal/TrafficSignal'
import StatCards from '../../Components/StatCards/StatCards'
import Charts from '../../Components/Charts/Charts'
import Analytics from '../../Components/Analytics/Analytics'
import Alerts from '../../Components/Alerts/Alerts'
import Map from '../../Components/Map/Map'
import AccidentPrediction from '../../Components/AccidentPrediction/AccidentPrediction'
import Controls from '../../Components/Controls/Controls'
import './Dashboard.css'

const PAGE = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 },
}

export default function Dashboard() {
  const [liveData, setLiveData] = useState({
    vehicle_count: 0,
    density: 'LOW',
    signal: 'RED',
    severity_score: 0,
    severity_status: 'LOW',
    speed: 0,
    congestion: 0,
    occupancy: 0,
    active_cameras: 0,
    ai_accuracy: 94.7,
    vehicle_history: [],
    density_history: [],
    speed_history: [],
    accident_history: [],
    camera_on: false,
  })

  const [cameraOn, setCameraOn] = useState(false)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const handler = (data) => {
      setLiveData(data)
      setConnected(true)
    }
    connectWS(handler)
    return () => disconnectWS(handler)
  }, [])

  const handleCameraToggle = (state) => {
    setCameraOn(state)
    setLiveData(prev => ({ ...prev, camera_on: state, active_cameras: state ? 1 : 0 }))
  }

  return (
    <motion.div className="dashboard-page" {...PAGE}>
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">
            <i className="bi bi-display-fill" /> TRAFFIC COMMAND CENTER
          </h1>
          <p className="dash-subtitle">Real-time AI-powered traffic monitoring and control</p>
        </div>
        <div className="dash-status">
          <div className={`ws-badge ${connected ? 'live' : 'connecting'}`}>
            <span className="ws-dot" />
            {connected ? 'LIVE DATA' : 'CONNECTING…'}
          </div>
        </div>
      </div>

      {/* Row 1: Camera + Signal + Controls */}
      <div className="dash-row row-top">
        <div className="col-camera">
          <CameraFeed isOn={cameraOn} onToggle={handleCameraToggle} />
        </div>
        <div className="col-side">
          <TrafficSignal signal={liveData.signal} />
          <Controls />
          <Map density={liveData.density} signal={liveData.signal} />
        </div>
      </div>

      {/* Row 2: Stat Cards */}
      <StatCards data={liveData} />

      {/* Row 3: Charts */}
      <Charts
        vehicleHistory={liveData.vehicle_history}
        densityHistory={liveData.density_history}
        speedHistory={liveData.speed_history}
        accidentHistory={liveData.accident_history}
        signal={liveData.signal}
      />

      {/* Row 4: Analytics + Alerts + Accident */}
      <div className="dash-row row-bottom">
        <Analytics />
        <Alerts />
        <AccidentPrediction
          score={liveData.severity_score}
          status={liveData.severity_status}
          history={liveData.accident_history}
        />
      </div>
    </motion.div>
  )
}
