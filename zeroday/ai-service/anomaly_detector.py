"""
ZeroDay AI Anomaly Detection Engine

Lightweight ML-based anomaly detection for the cyber war simulator.
Uses Isolation Forest for network traffic anomaly detection and
a custom risk scoring model for behavioral analysis.
"""

import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from typing import TypedDict


class TrafficData(TypedDict):
    node_id: str
    traffic: float
    vulnerabilities: int
    patch_level: float
    status: str


class EmployeeData(TypedDict):
    employee_id: str
    awareness_score: float
    risk_score: float
    trained: bool
    compromised: bool
    productivity: float


class AnomalyResult(TypedDict):
    node_id: str
    anomaly_score: float
    is_anomaly: bool
    risk_level: str
    details: str


class BehaviorResult(TypedDict):
    employee_id: str
    behavior_score: float
    risk_level: str
    flags: list[str]


class RiskAssessment(TypedDict):
    overall_risk: float
    risk_level: str
    threat_probability: float
    recommended_actions: list[str]
    risk_factors: list[dict]


class AnomalyDetector:
    def __init__(self):
        self.traffic_model = IsolationForest(
            n_estimators=100,
            contamination=0.15,
            random_state=42,
        )
        self.scaler = StandardScaler()
        self._trained = False
        self._initialize_baseline()

    def _initialize_baseline(self):
        np.random.seed(42)
        n_samples = 500
        normal_traffic = np.column_stack([
            np.random.normal(50, 15, n_samples),  # traffic
            np.random.poisson(2, n_samples),       # vulnerabilities
            np.random.normal(65, 15, n_samples),   # patch_level
        ])

        anomalous = np.column_stack([
            np.random.normal(90, 10, 50),
            np.random.poisson(8, 50),
            np.random.normal(25, 10, 50),
        ])

        training_data = np.vstack([normal_traffic, anomalous])
        training_data = np.clip(training_data, 0, 100)

        self.scaler.fit(training_data)
        scaled = self.scaler.transform(training_data)
        self.traffic_model.fit(scaled)
        self._trained = True

    def detect_traffic_anomalies(self, nodes: list[TrafficData]) -> list[AnomalyResult]:
        if not nodes:
            return []

        features = np.array([
            [n["traffic"], n["vulnerabilities"], n["patch_level"]]
            for n in nodes
        ])

        scaled = self.scaler.transform(features)
        raw_scores = self.traffic_model.decision_function(scaled)
        predictions = self.traffic_model.predict(scaled)

        results: list[AnomalyResult] = []
        for i, node in enumerate(nodes):
            score = float(-raw_scores[i])
            normalized = min(1.0, max(0.0, (score + 0.5) / 1.0))
            is_anomaly = predictions[i] == -1

            if node["status"] == "compromised":
                normalized = min(1.0, normalized + 0.3)
                is_anomaly = True

            if normalized > 0.8:
                risk = "critical"
            elif normalized > 0.6:
                risk = "high"
            elif normalized > 0.4:
                risk = "medium"
            else:
                risk = "low"

            details = []
            if node["traffic"] > 80:
                details.append("abnormally high traffic")
            if node["vulnerabilities"] > 3:
                details.append(f"{node['vulnerabilities']} unpatched vulnerabilities")
            if node["patch_level"] < 40:
                details.append("critically low patch level")
            if node["status"] == "compromised":
                details.append("system is compromised")

            results.append({
                "node_id": node["node_id"],
                "anomaly_score": round(normalized, 3),
                "is_anomaly": is_anomaly,
                "risk_level": risk,
                "details": "; ".join(details) if details else "nominal",
            })

        return results

    def analyze_behavior(self, employees: list[EmployeeData]) -> list[BehaviorResult]:
        results: list[BehaviorResult] = []

        for emp in employees:
            score = 0.0
            flags: list[str] = []

            if emp["risk_score"] > 60:
                score += 0.3
                flags.append("elevated risk score")
            elif emp["risk_score"] > 40:
                score += 0.15

            if emp["awareness_score"] < 30:
                score += 0.2
                flags.append("very low security awareness")
            elif emp["awareness_score"] < 50:
                score += 0.1
                flags.append("below-average awareness")

            if not emp["trained"]:
                score += 0.15
                flags.append("untrained")

            if emp["compromised"]:
                score += 0.4
                flags.append("account compromised")

            if emp["productivity"] < 50:
                score += 0.1
                flags.append("low productivity (possible distraction)")

            noise = np.random.normal(0, 0.05)
            score = min(1.0, max(0.0, score + noise))

            if score > 0.7:
                risk = "critical"
            elif score > 0.5:
                risk = "high"
            elif score > 0.3:
                risk = "medium"
            else:
                risk = "low"

            results.append({
                "employee_id": emp["employee_id"],
                "behavior_score": round(score, 3),
                "risk_level": risk,
                "flags": flags,
            })

        return results

    def assess_risk(
        self,
        company_stats: dict,
        traffic_anomalies: list[AnomalyResult],
        behavior_results: list[BehaviorResult],
    ) -> RiskAssessment:
        risk_factors: list[dict] = []
        risk_score = 0.0

        sec_maturity = company_stats.get("securityMaturity", 50)
        if sec_maturity < 30:
            risk_score += 0.2
            risk_factors.append({"factor": "Low security maturity", "impact": 0.2, "recommendation": "Invest in security research"})
        elif sec_maturity < 50:
            risk_score += 0.1
            risk_factors.append({"factor": "Moderate security maturity", "impact": 0.1, "recommendation": "Continue improving security posture"})

        patch_level = company_stats.get("patchLevel", 50)
        if patch_level < 40:
            risk_score += 0.2
            risk_factors.append({"factor": "Critical patch gap", "impact": 0.2, "recommendation": "Prioritize patching vulnerable systems"})

        awareness = company_stats.get("employeeAwareness", 50)
        if awareness < 40:
            risk_score += 0.15
            risk_factors.append({"factor": "Low employee awareness", "impact": 0.15, "recommendation": "Deploy security awareness training"})

        ai_level = company_stats.get("aiDetectionLevel", 10)
        if ai_level < 30:
            risk_score += 0.1
            risk_factors.append({"factor": "Weak AI detection", "impact": 0.1, "recommendation": "Research AI anomaly detection"})

        if traffic_anomalies:
            anomaly_ratio = sum(1 for a in traffic_anomalies if a["is_anomaly"]) / len(traffic_anomalies)
            if anomaly_ratio > 0.3:
                risk_score += 0.2
                risk_factors.append({"factor": f"{anomaly_ratio:.0%} of nodes show anomalies", "impact": 0.2, "recommendation": "Investigate network anomalies immediately"})

        if behavior_results:
            high_risk = sum(1 for b in behavior_results if b["risk_level"] in ("high", "critical"))
            if high_risk > 3:
                risk_score += 0.15
                risk_factors.append({"factor": f"{high_risk} high-risk employees", "impact": 0.15, "recommendation": "Train high-risk employees"})

        risk_score = min(1.0, max(0.0, risk_score))
        threat_prob = min(1.0, risk_score * 1.2 + np.random.normal(0, 0.05))
        threat_prob = max(0.0, min(1.0, threat_prob))

        if risk_score > 0.7:
            level = "critical"
        elif risk_score > 0.5:
            level = "high"
        elif risk_score > 0.3:
            level = "medium"
        else:
            level = "low"

        actions: list[str] = []
        for rf in sorted(risk_factors, key=lambda x: x["impact"], reverse=True)[:3]:
            actions.append(rf["recommendation"])

        if not actions:
            actions.append("Continue monitoring - security posture is healthy")

        return {
            "overall_risk": round(risk_score, 3),
            "risk_level": level,
            "threat_probability": round(threat_prob, 3),
            "recommended_actions": actions,
            "risk_factors": risk_factors,
        }


detector = AnomalyDetector()
