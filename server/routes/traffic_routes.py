"""
server/routes/traffic_routes.py — All FastAPI traffic endpoints.
"""
import time
import random
import asyncio
import json
from typing import Optional

import cv2
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from extensions import monitor


router = APIRouter(prefix="/api")


class _State:
    camera_on:       bool          = False
    signal_override: Optional[str] = None

    def __init__(self):
        self.vehicle_history  = [random.randint(0, 20)    for _ in range(20)]
        self.density_history  = [random.choice([1, 1, 2]) for _ in range(20)]
        self.speed_history    = [random.randint(20, 60)   for _ in range(20)]
        self.accident_history = [random.randint(0, 30)    for _ in range(20)]
        self.ws_clients: list = []
        self.alert_log = [
            {"id": 1, "type": "warning", "message": "Heavy traffic on Main St",               "time": "09:12"},
            {"id": 2, "type": "danger",  "message": "Accident risk HIGH at Junction A",        "time": "09:08"},
            {"id": 3, "type": "info",    "message": "Signal optimisation active",               "time": "09:05"},
            {"id": 4, "type": "success", "message": "Emergency vehicle cleared — path opened",  "time": "08:58"},
            {"id": 5, "type": "warning", "message": "Road occupancy above 80%",                "time": "08:45"},
        ]


state = _State()


def _resolve_signal(auto_signal: str) -> str:
    if state.signal_override and state.signal_override != "AUTO":
        return state.signal_override
    return auto_signal if auto_signal not in ("UNKNOWN", "", None) else "RED"


def _get_live_data() -> dict:
    try:
        result = monitor.get_frame()
        if result[0] is None:
            return {
                "vehicle_count":   monitor.counter.vehicle_count,
                "density":         "UNKNOWN",
                "signal":          _resolve_signal("UNKNOWN"),
                "severity_score":  monitor.severity_score,
                "severity_status": monitor.severity_status,
                "camera_on":       state.camera_on,
            }
        _, density, signal, sev_score, sev_status = result
        return {
            "vehicle_count":   monitor.counter.vehicle_count,
            "density":         density,
            "signal":          _resolve_signal(signal),
            "severity_score":  sev_score,
            "severity_status": sev_status,
            "camera_on":       state.camera_on,
        }
    except Exception:
        return {
            "vehicle_count":   0,
            "density":         "LOW",
            "signal":          _resolve_signal("RED"),
            "severity_score":  0,
            "severity_status": "LOW",
            "camera_on":       state.camera_on,
        }


def _speed()            -> float: return round(random.uniform(15, 75), 1)
def _congestion(d: str) -> int:
    return {"HIGH": random.randint(70, 95), "MEDIUM": random.randint(40, 65),
            "LOW":  random.randint(5, 30)}.get(d, 20)
def _occupancy(d: str)  -> int:
    return {"HIGH": random.randint(70, 95), "MEDIUM": random.randint(45, 65),
            "LOW":  random.randint(10, 35)}.get(d, 25)


# ── MJPEG stream ───────────────────────────────────────────────────────────────

def _frame_generator():
    while True:
        if not state.camera_on:
            time.sleep(0.1)
            continue
        try:
            result = monitor.get_frame()
            if result[0] is None:
                time.sleep(0.05)
                continue
            ret, buf = cv2.imencode('.jpg', result[0],
                                    [int(cv2.IMWRITE_JPEG_QUALITY), 75])
            if not ret:
                continue
            yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n'
                   + buf.tobytes() + b'\r\n')
        except Exception:
            time.sleep(0.05)


@router.get("/camera/stream")
def camera_stream():
    return StreamingResponse(
        _frame_generator(),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


# ── REST ───────────────────────────────────────────────────────────────────────

@router.get("/traffic/stats")
def traffic_stats():
    data    = _get_live_data()
    density = data["density"]
    return {
        **data,
        "speed":          _speed(),
        "congestion":     _congestion(density),
        "occupancy":      _occupancy(density),
        "active_cameras": 1 if state.camera_on else 0,
        "ai_accuracy":    94.7,
    }

@router.get("/traffic/live")
def traffic_live():
    return traffic_stats()

@router.get("/signal/status")
def signal_status():
    data = _get_live_data()
    return {
        "signal":   data["signal"],
        "override": state.signal_override,
        "density":  data["density"],
        "auto":     state.signal_override in (None, "AUTO"),
    }


class SignalBody(BaseModel):
    signal: str


@router.post("/signal/change")
def signal_change(body: SignalBody):
    val = body.signal.upper().strip()
    if val == "AUTO":
        state.signal_override = None
    elif val in ("RED", "YELLOW", "GREEN"):
        state.signal_override = val
    else:
        raise HTTPException(400, detail=f"Invalid signal '{val}'.")
    return {"status": "ok", "signal": val, "override": state.signal_override}


@router.post("/camera/on")
def camera_on():
    state.camera_on = True
    monitor.toggle_camera(True)
    return {"status": "success", "camera_on": True, "message": "Camera turned ON"}


@router.post("/camera/off")
def camera_off():
    state.camera_on = False
    monitor.toggle_camera(False)
    return {"status": "success", "camera_on": False, "message": "Camera turned OFF"}


@router.get("/analytics")
def analytics():
    return {
        "vehicle_detection":    random.randint(88, 99),
        "lane_analysis":        random.randint(75, 92),
        "traffic_flow":         random.randint(70, 95),
        "signal_efficiency":    random.randint(80, 98),
        "pedestrian_detection": random.randint(65, 88),
        "emergency_detection":  random.randint(90, 99),
        "violation_detection":  random.randint(60, 85),
    }


@router.get("/alerts")
def alerts():
    return {"alerts": state.alert_log}


@router.get("/accident/predict")
def accident_predict():
    data = _get_live_data()
    recs = {
        "LOW":      ["Continue normal operations", "Monitor traffic flow periodically"],
        "MEDIUM":   ["Deploy additional surveillance units", "Alert nearby traffic officers"],
        "CRITICAL": ["Dispatch emergency response NOW", "Close affected lanes", "Activate incident protocol"],
    }
    return {
        "risk_score":      data["severity_score"],
        "severity":        data["severity_status"],
        "recommendations": recs.get(data["severity_status"], []),
        "history":         state.accident_history[-20:],
    }


@router.get("/health")
def health():
    return {
        "status":      "ok",
        "camera_on":   state.camera_on,
        "ws_clients":  len(state.ws_clients),
        "signal_mode": "auto" if not state.signal_override else "manual",
    }


# ── WebSocket ──────────────────────────────────────────────────────────────────

@router.websocket("/ws/traffic")
async def ws_traffic_api(websocket: WebSocket):
    await _ws_handler(websocket)


async def _ws_handler(websocket: WebSocket):
    await websocket.accept()
    state.ws_clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        if websocket in state.ws_clients:
            state.ws_clients.remove(websocket)


# ── Broadcast loop ─────────────────────────────────────────────────────────────

async def broadcast_loop():
    while True:
        await asyncio.sleep(1)
        if not state.ws_clients:
            continue
        try:
            data    = _get_live_data()
            speed   = _speed()
            density = data["density"]

            state.vehicle_history.append(data["vehicle_count"])
            state.vehicle_history  = state.vehicle_history[-30:]
            state.density_history.append(
                {"LOW": 1, "MEDIUM": 2, "HIGH": 3, "UNKNOWN": 0}.get(density, 0))
            state.density_history  = state.density_history[-30:]
            state.speed_history.append(speed)
            state.speed_history    = state.speed_history[-30:]
            state.accident_history.append(data["severity_score"])
            state.accident_history = state.accident_history[-30:]

            payload = json.dumps({
                **data,
                "speed":            speed,
                "congestion":       _congestion(density),
                "occupancy":        _occupancy(density),
                "active_cameras":   1 if state.camera_on else 0,
                "ai_accuracy":      94.7,
                "vehicle_history":  state.vehicle_history,
                "density_history":  state.density_history,
                "speed_history":    state.speed_history,
                "accident_history": state.accident_history,
                "timestamp":        time.time(),
            })

            dead = []
            for ws in list(state.ws_clients):
                try:
                    await ws.send_text(payload)
                except Exception:
                    dead.append(ws)
            for ws in dead:
                if ws in state.ws_clients:
                    state.ws_clients.remove(ws)
        except Exception:
            pass
