from ultralytics import YOLO


class VehicleDetector:
    """Wrapper class for YOLOv8 model."""

    def __init__(self, model_path: str):
        self.model = YOLO(model_path)

    def detect(self, frame):
        """Runs inference and tracking on a single frame."""
        return self.model.track(frame, persist=True)[0]
