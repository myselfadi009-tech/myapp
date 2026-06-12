import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import './Charts.css'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler,
)

const labels30 = Array.from({ length: 30 }, (_, i) => `${i}s`)

const lineOpts = (label, color) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 400 },
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { color: '#475569', font: { size: 9 } }, grid: { color: '#1e293b' } },
    y: { ticks: { color: '#475569', font: { size: 9 } }, grid: { color: '#1e293b' } },
  },
})

const makeLineData = (data, color, label) => ({
  labels: labels30.slice(-data.length),
  datasets: [{
    label,
    data,
    borderColor: color,
    backgroundColor: `${color}22`,
    fill: true,
    tension: 0.4,
    pointRadius: 0,
    borderWidth: 2,
  }],
})

const DENSITY_VALS = ['', 'LOW', 'MEDIUM', 'HIGH']

export default function Charts({ vehicleHistory, densityHistory, speedHistory, accidentHistory, signal }) {
  const vh = vehicleHistory?.length ? vehicleHistory : Array(20).fill(0)
  const dh = densityHistory?.length ? densityHistory : Array(20).fill(0)
  const sh = speedHistory?.length ? speedHistory : Array(20).fill(30)
  const ah = accidentHistory?.length ? accidentHistory : Array(20).fill(0)

  const sigCount = { RED: 0, YELLOW: 0, GREEN: 0 }
  if (signal?.includes('GREEN')) sigCount.GREEN++
  else if (signal === 'YELLOW') sigCount.YELLOW++
  else sigCount.RED++

  return (
    <div className="charts-section">
      <div className="section-title"><i className="bi bi-graph-up" /> LIVE ANALYTICS CHARTS</div>

      <div className="charts-grid">
        <div className="chart-card glass-card">
          <h4>Vehicle Count Trend</h4>
          <div className="chart-body">
            <Line data={makeLineData(vh, '#00E5FF', 'Vehicles')} options={lineOpts()} />
          </div>
        </div>

        <div className="chart-card glass-card">
          <h4>Traffic Density</h4>
          <div className="chart-body">
            <Bar
              data={{
                labels: labels30.slice(-dh.length),
                datasets: [{
                  label: 'Density',
                  data: dh,
                  backgroundColor: dh.map(v =>
                    v >= 3 ? '#EF444466' : v >= 2 ? '#F59E0B66' : '#22C55E66'
                  ),
                  borderColor: dh.map(v =>
                    v >= 3 ? '#EF4444' : v >= 2 ? '#F59E0B' : '#22C55E'
                  ),
                  borderWidth: 1,
                }],
              }}
              options={{
                ...lineOpts(),
                scales: {
                  x: { ticks: { color: '#475569', font: { size: 9 } }, grid: { color: '#1e293b' } },
                  y: {
                    ticks: {
                      color: '#475569', font: { size: 9 },
                      callback: v => DENSITY_VALS[v] || v,
                    },
                    grid: { color: '#1e293b' },
                    min: 0, max: 3,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="chart-card glass-card">
          <h4>Signal Distribution</h4>
          <div className="chart-body chart-body-sm">
            <Doughnut
              data={{
                labels: ['RED', 'YELLOW', 'GREEN'],
                datasets: [{
                  data: [sigCount.RED || 1, sigCount.YELLOW || 0, sigCount.GREEN || 0],
                  backgroundColor: ['#EF444466', '#F59E0B66', '#22C55E66'],
                  borderColor: ['#EF4444', '#F59E0B', '#22C55E'],
                  borderWidth: 1,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right', labels: { color: '#94a3b8', font: { size: 10 } } },
                },
              }}
            />
          </div>
        </div>

        <div className="chart-card glass-card">
          <h4>Average Speed Trend</h4>
          <div className="chart-body">
            <Line data={makeLineData(sh, '#F59E0B', 'Speed (km/h)')} options={lineOpts()} />
          </div>
        </div>

        <div className="chart-card glass-card">
          <h4>Congestion Monitoring</h4>
          <div className="chart-body">
            <Line
              data={makeLineData(
                vh.map(v => Math.min(100, Math.round(v * 4))),
                '#EF4444', 'Congestion %'
              )}
              options={lineOpts()}
            />
          </div>
        </div>

        <div className="chart-card glass-card">
          <h4>Accident Risk Trend</h4>
          <div className="chart-body">
            <Line data={makeLineData(ah, '#0EA5E9', 'Risk Score')} options={lineOpts()} />
          </div>
        </div>
      </div>
    </div>
  )
}
