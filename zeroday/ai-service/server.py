"""
ZeroDay AI Microservice

Flask API for the anomaly detection engine.
Provides endpoints for traffic analysis, behavioral analysis, and risk assessment.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from anomaly_detector import detector

app = Flask(__name__)
CORS(app)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "online", "service": "ZeroDay AI Engine", "version": "1.0.0"})


@app.route("/api/analyze/traffic", methods=["POST"])
def analyze_traffic():
    data = request.get_json()
    nodes = data.get("nodes", [])
    if not nodes:
        return jsonify({"error": "No node data provided"}), 400
    results = detector.detect_traffic_anomalies(nodes)
    return jsonify({"anomalies": results, "total_nodes": len(nodes), "anomalies_detected": sum(1 for r in results if r["is_anomaly"])})


@app.route("/api/analyze/behavior", methods=["POST"])
def analyze_behavior():
    data = request.get_json()
    employees = data.get("employees", [])
    if not employees:
        return jsonify({"error": "No employee data provided"}), 400
    results = detector.analyze_behavior(employees)
    return jsonify({"behaviors": results, "total_employees": len(employees), "high_risk_count": sum(1 for r in results if r["risk_level"] in ("high", "critical"))})


@app.route("/api/analyze/risk", methods=["POST"])
def assess_risk():
    data = request.get_json()
    company_stats = data.get("company_stats", {})
    traffic_data = data.get("traffic_anomalies", [])
    behavior_data = data.get("behavior_results", [])
    result = detector.assess_risk(company_stats, traffic_data, behavior_data)
    return jsonify(result)


if __name__ == "__main__":
    print("[AI ENGINE] ZeroDay Anomaly Detection Service starting...")
    print("[AI ENGINE] Model initialized with Isolation Forest + Behavioral Analysis")
    app.run(host="0.0.0.0", port=5000, debug=False)
