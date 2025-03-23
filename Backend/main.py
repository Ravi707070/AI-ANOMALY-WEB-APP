from fastapi import FastAPI 
from pydantic import BaseModel
from datetime import datetime
from sklearn.ensemble import IsolationForest
import uvicorn
import pymongo
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root route to avoid 404 Not Found
@app.get("/")
def root():
    return {"message": "AI Log & Anomaly Detection API is running!"}

# Database setup
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["log_db"]
log_collection = db["logs"]
anomaly_collection = db["anomalies"]

# Anomaly Detection Model
model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)

def train_model():
    logs = list(log_collection.find({}, {"_id": 0, "message": 1}))
    if logs and len(logs) > 5:  # Ensure at least 5 logs for training
        data = [[len(log["message"])] for log in logs]
        model.fit(data)

class LogEntry(BaseModel):
    message: str

@app.post("/api/logs")
def ingest_log(log: LogEntry):
    log_data = {"timestamp": datetime.utcnow(), "message": log.message}
    log_collection.insert_one(log_data)
    
    # Detect anomaly
    anomaly_score = model.decision_function([[len(log.message)]])[0]  # Extract the first value
    if anomaly_score < -0.1:  # Threshold for anomaly detection
        anomaly_collection.insert_one({"timestamp": log_data["timestamp"], "description": log.message})
    
    return {"status": "Log added"}

@app.get("/api/logs")
def get_logs():
    logs = list(log_collection.find({}, {"_id": 0}))
    return logs

@app.get("/api/anomalies")
def get_anomalies():
    anomalies = list(anomaly_collection.find({}, {"_id": 0}))
    return anomalies

if __name__ == "__main__":
    train_model()
    uvicorn.run(app, host="0.0.0.0", port=8000)
