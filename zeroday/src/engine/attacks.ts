import { AttackType, Severity, SecurityEvent, EventChoice, CompanyStats } from "./types";
import { v4 as uuid } from "uuid";

type AttackTemplate = {
  type: AttackType;
  titles: string[];
  descriptions: string[];
  sources: string[];
  baseProbability: number;
  severityWeights: Record<Severity, number>;
  getChoices: (severity: Severity) => EventChoice[];
  modifiers: (stats: CompanyStats) => number;
};

function makeChoice(
  label: string,
  description: string,
  timeCost: number,
  moneyCost: number,
  reputationImpact: number,
  successRate: number
): EventChoice {
  return { id: uuid(), label, description, timeCost, moneyCost, reputationImpact, successRate };
}

const ATTACK_TEMPLATES: AttackTemplate[] = [
  {
    type: "phishing",
    titles: [
      "Suspicious Email Campaign Detected",
      "Spear Phishing Attack Targeting Executives",
      "Credential Harvesting Attempt Via Email",
      "Fake Invoice Email Spreading Through Company",
    ],
    descriptions: [
      "Multiple employees received emails with malicious links disguised as internal communications.",
      "A sophisticated phishing campaign targeting C-suite executives has been identified.",
      "Emails impersonating IT support are requesting password resets from employees.",
    ],
    sources: ["Email Gateway", "Employee Report", "AI Detection System", "Threat Intel Feed"],
    baseProbability: 0.35,
    severityWeights: { low: 0.3, medium: 0.4, high: 0.2, critical: 0.1 },
    modifiers: (stats) => {
      let mod = 1;
      if (stats.employeeAwareness < 40) mod *= 2.0;
      else if (stats.employeeAwareness < 60) mod *= 1.3;
      else if (stats.employeeAwareness > 80) mod *= 0.5;
      if (stats.aiDetectionLevel > 70) mod *= 0.7;
      return mod;
    },
    getChoices: (severity) => [
      makeChoice("Block & Quarantine", "Immediately block sender and quarantine all related emails", 1, severity === "critical" ? 5000 : 2000, 0, 0.85),
      makeChoice("Investigate First", "Analyze the email headers and payload before taking action", 3, 3000, -2, 0.92),
      makeChoice("Alert Employees", "Send company-wide alert about the phishing attempt", 1, 500, 5, 0.6),
      makeChoice("Ignore", "Mark as low priority and continue monitoring", 0, 0, -10, 0.2),
    ],
  },
  {
    type: "ransomware",
    titles: [
      "Ransomware Encryption Detected on Server",
      "File System Anomaly - Possible Ransomware",
      "Critical: Mass File Encryption in Progress",
      "Ransomware Payload Activated on Network",
    ],
    descriptions: [
      "Unusual file encryption patterns detected across multiple drives.",
      "A ransomware variant has been identified encrypting files on the production server.",
      "Network monitoring shows rapid file modification consistent with ransomware behavior.",
    ],
    sources: ["Endpoint Detection", "File Integrity Monitor", "Network Anomaly Detector", "SIEM Alert"],
    baseProbability: 0.15,
    severityWeights: { low: 0.05, medium: 0.2, high: 0.4, critical: 0.35 },
    modifiers: (stats) => {
      let mod = 1;
      if (stats.patchLevel < 50) mod *= 1.8;
      if (stats.dataEncryption < 30) mod *= 1.5;
      if (stats.firewallStrength > 70) mod *= 0.6;
      if (stats.aiDetectionLevel > 80) mod *= 0.5;
      return mod;
    },
    getChoices: (severity) => [
      makeChoice("Isolate & Restore", "Disconnect affected systems and restore from backups", 4, severity === "critical" ? 25000 : 10000, -5, 0.8),
      makeChoice("Kill Process", "Attempt to terminate the encryption process immediately", 1, 2000, -3, 0.65),
      makeChoice("Full Shutdown", "Emergency shutdown of all affected network segments", 2, 15000, -15, 0.9),
      makeChoice("Pay Ransom", "Pay the demanded ransom (not recommended)", 1, 50000, -30, 0.45),
    ],
  },
  {
    type: "zero_day",
    titles: [
      "Zero-Day Exploit Detected in Web Framework",
      "Unknown Vulnerability Being Actively Exploited",
      "Critical Zero-Day: Remote Code Execution",
      "Novel Attack Vector Identified in System",
    ],
    descriptions: [
      "An unknown vulnerability is being exploited in a widely-used framework.",
      "Behavioral analysis detected exploitation of a previously unknown vulnerability.",
      "Threat intelligence reports a zero-day being sold on dark web forums targeting our stack.",
    ],
    sources: ["Behavioral Analysis", "Threat Intel", "WAF Alert", "Honeypot Detection"],
    baseProbability: 0.08,
    severityWeights: { low: 0.0, medium: 0.1, high: 0.4, critical: 0.5 },
    modifiers: (stats) => {
      let mod = 1;
      if (stats.threatIntelligence < 40) mod *= 1.5;
      if (stats.securityMaturity < 50) mod *= 1.3;
      if (stats.aiDetectionLevel > 80) mod *= 0.6;
      return mod;
    },
    getChoices: (severity) => [
      makeChoice("Emergency Patch", "Develop and deploy an emergency patch", 6, 20000, -5, 0.75),
      makeChoice("WAF Rules", "Deploy Web Application Firewall rules to mitigate", 2, 8000, -3, 0.7),
      makeChoice("Take Offline", "Take vulnerable systems offline until patched", 1, 12000, -20, 0.95),
      makeChoice("Monitor & Assess", "Continue monitoring while assessing the threat scope", 3, 3000, -8, 0.5),
    ],
  },
  {
    type: "insider_threat",
    titles: [
      "Unusual Data Access Pattern by Employee",
      "Insider Threat: Unauthorized Data Exfiltration",
      "Suspicious After-Hours Access Detected",
      "Employee Accessing Restricted Systems",
    ],
    descriptions: [
      "An employee is accessing files outside their normal scope and downloading large amounts of data.",
      "Behavioral analytics flagged unusual login patterns and data transfer activities.",
      "An employee's credentials are being used from an unusual location during off-hours.",
    ],
    sources: ["UEBA System", "DLP Alert", "Access Control Monitor", "AI Behavioral Engine"],
    baseProbability: 0.12,
    severityWeights: { low: 0.15, medium: 0.35, high: 0.35, critical: 0.15 },
    modifiers: (stats) => {
      let mod = 1;
      if (stats.employeeAwareness < 50) mod *= 1.4;
      if (stats.aiDetectionLevel < 40) mod *= 1.5;
      if (stats.securityMaturity > 70) mod *= 0.6;
      return mod;
    },
    getChoices: (severity) => [
      makeChoice("Revoke Access", "Immediately revoke the employee's access credentials", 1, 1000, -5, 0.85),
      makeChoice("Covert Investigation", "Quietly investigate without alerting the employee", 5, 5000, 0, 0.88),
      makeChoice("Confront Employee", "HR meeting to discuss the suspicious activity", 2, 2000, -8, 0.7),
      makeChoice("Monitor Closely", "Increase surveillance without taking immediate action", 2, 1500, -3, 0.55),
    ],
  },
  {
    type: "ddos",
    titles: [
      "DDoS Attack Flooding Web Servers",
      "Volumetric DDoS Attack Detected",
      "Application Layer DDoS in Progress",
      "Traffic Spike: Possible DDoS Attack",
    ],
    descriptions: [
      "Massive traffic spike detected, overwhelming server capacity.",
      "A distributed denial of service attack is targeting our public-facing services.",
      "Unusual traffic patterns suggest an application-layer DDoS attack.",
    ],
    sources: ["Traffic Monitor", "CDN Alert", "Load Balancer", "ISP Notification"],
    baseProbability: 0.18,
    severityWeights: { low: 0.2, medium: 0.35, high: 0.3, critical: 0.15 },
    modifiers: (stats) => {
      let mod = 1;
      if (stats.firewallStrength < 50) mod *= 1.6;
      if (stats.securityMaturity > 70) mod *= 0.7;
      return mod;
    },
    getChoices: (severity) => [
      makeChoice("Activate CDN Shield", "Route traffic through CDN DDoS protection", 1, severity === "critical" ? 15000 : 5000, -3, 0.88),
      makeChoice("Rate Limiting", "Implement aggressive rate limiting on all endpoints", 1, 2000, -5, 0.75),
      makeChoice("Blackhole Routing", "Null-route the attack traffic at ISP level", 2, 8000, -10, 0.82),
      makeChoice("Absorb & Scale", "Auto-scale infrastructure to absorb the attack", 1, 20000, -2, 0.7),
    ],
  },
  {
    type: "social_engineering",
    titles: [
      "Social Engineering Attack on Help Desk",
      "Impersonation Attack Targeting Employees",
      "Vishing Attack Campaign Detected",
      "Pretexting Attempt on Finance Department",
    ],
    descriptions: [
      "An attacker is impersonating a senior executive to trick employees into transferring funds.",
      "Multiple employees report receiving calls from someone claiming to be IT support.",
      "A sophisticated social engineering campaign is targeting the finance department.",
    ],
    sources: ["Employee Report", "Call Center Alert", "Security Awareness System", "Fraud Detection"],
    baseProbability: 0.2,
    severityWeights: { low: 0.2, medium: 0.4, high: 0.3, critical: 0.1 },
    modifiers: (stats) => {
      let mod = 1;
      if (stats.employeeAwareness < 40) mod *= 2.2;
      else if (stats.employeeAwareness > 80) mod *= 0.3;
      return mod;
    },
    getChoices: (severity) => [
      makeChoice("Company Alert", "Issue immediate company-wide security alert", 1, 500, 3, 0.7),
      makeChoice("Lock Accounts", "Temporarily lock potentially compromised accounts", 1, 3000, -5, 0.82),
      makeChoice("Emergency Training", "Deploy emergency security awareness training", 3, 4000, 5, 0.75),
      makeChoice("Trace & Report", "Trace the attacker and report to authorities", 4, 6000, 2, 0.6),
    ],
  },
  {
    type: "supply_chain",
    titles: [
      "Compromised Software Update Detected",
      "Supply Chain Attack: Malicious Package",
      "Third-Party Vendor Breach Affecting Systems",
      "Trojanized Library Found in Dependencies",
    ],
    descriptions: [
      "A software update from a trusted vendor contains a hidden backdoor.",
      "A popular npm/pip package used in our codebase has been compromised.",
      "A key vendor reports a data breach that may affect our supply chain.",
    ],
    sources: ["Dependency Scanner", "Vendor Alert", "Code Audit", "Threat Intel Feed"],
    baseProbability: 0.06,
    severityWeights: { low: 0.05, medium: 0.15, high: 0.4, critical: 0.4 },
    modifiers: (stats) => {
      let mod = 1;
      if (stats.patchLevel < 60) mod *= 1.4;
      if (stats.threatIntelligence > 70) mod *= 0.5;
      return mod;
    },
    getChoices: (severity) => [
      makeChoice("Rollback", "Immediately rollback to the previous version", 2, 8000, -5, 0.85),
      makeChoice("Audit & Patch", "Full code audit and targeted patching", 6, 15000, -3, 0.9),
      makeChoice("Isolate Systems", "Isolate systems using the compromised component", 1, 5000, -10, 0.8),
      makeChoice("Vendor Contact", "Contact vendor and wait for official fix", 8, 2000, -15, 0.55),
    ],
  },
  {
    type: "brute_force",
    titles: [
      "Brute Force Attack on Login Portal",
      "Credential Stuffing Attack Detected",
      "Mass Authentication Failure Alert",
      "Password Spray Attack in Progress",
    ],
    descriptions: [
      "Thousands of failed login attempts detected from multiple IP addresses.",
      "Automated credential stuffing attack using leaked password databases.",
      "A distributed brute force attack is targeting employee login portals.",
    ],
    sources: ["Auth Logs", "WAF Alert", "SIEM Correlation", "Rate Limit Monitor"],
    baseProbability: 0.22,
    severityWeights: { low: 0.3, medium: 0.35, high: 0.25, critical: 0.1 },
    modifiers: (stats) => {
      let mod = 1;
      if (stats.firewallStrength < 50) mod *= 1.5;
      if (stats.dataEncryption < 40) mod *= 1.3;
      if (stats.firewallStrength > 80) mod *= 0.4;
      return mod;
    },
    getChoices: (severity) => [
      makeChoice("IP Blacklist", "Block all offending IP addresses immediately", 1, 1000, 0, 0.8),
      makeChoice("Force MFA", "Force multi-factor authentication for all users", 2, 5000, 3, 0.92),
      makeChoice("CAPTCHA Deploy", "Deploy CAPTCHA on all login forms", 1, 2000, -2, 0.75),
      makeChoice("Honeypot", "Deploy honeypot credentials to track attackers", 3, 4000, 0, 0.65),
    ],
  },
  {
    type: "man_in_the_middle",
    titles: [
      "SSL/TLS Certificate Anomaly Detected",
      "Possible Man-in-the-Middle Attack",
      "Network Interception Attempt Identified",
      "Rogue Access Point Detected on Network",
    ],
    descriptions: [
      "Certificate validation failures suggest a potential MITM attack on internal communications.",
      "Network analysis reveals potential traffic interception between key systems.",
      "An unauthorized access point has been detected broadcasting a similar SSID.",
    ],
    sources: ["Certificate Monitor", "Network IDS", "Wireless Scanner", "Traffic Analyzer"],
    baseProbability: 0.1,
    severityWeights: { low: 0.1, medium: 0.3, high: 0.4, critical: 0.2 },
    modifiers: (stats) => {
      let mod = 1;
      if (stats.dataEncryption < 50) mod *= 1.8;
      if (stats.dataEncryption > 80) mod *= 0.4;
      return mod;
    },
    getChoices: (severity) => [
      makeChoice("Force Encryption", "Enforce end-to-end encryption on all channels", 2, 8000, -3, 0.88),
      makeChoice("Rotate Certs", "Immediately rotate all SSL/TLS certificates", 3, 6000, -2, 0.85),
      makeChoice("Network Sweep", "Full network sweep to identify rogue devices", 4, 5000, 0, 0.8),
      makeChoice("Shutdown Wireless", "Temporarily disable all wireless access points", 1, 3000, -12, 0.9),
    ],
  },
  {
    type: "sql_injection",
    titles: [
      "SQL Injection Attempt on Web Application",
      "Database Exfiltration Attempt Detected",
      "Malicious Queries Targeting User Database",
      "Web App Vulnerability Being Exploited",
    ],
    descriptions: [
      "WAF logs show SQL injection patterns targeting the user authentication system.",
      "Unusual database queries detected that suggest data exfiltration attempts.",
      "Automated SQL injection tools are probing multiple endpoints for vulnerabilities.",
    ],
    sources: ["WAF Logs", "Database Monitor", "Application Firewall", "Code Scanner"],
    baseProbability: 0.16,
    severityWeights: { low: 0.15, medium: 0.35, high: 0.35, critical: 0.15 },
    modifiers: (stats) => {
      let mod = 1;
      if (stats.patchLevel < 50) mod *= 1.7;
      if (stats.firewallStrength > 70) mod *= 0.6;
      if (stats.securityMaturity > 80) mod *= 0.5;
      return mod;
    },
    getChoices: (severity) => [
      makeChoice("WAF Update", "Update WAF rules to block injection patterns", 1, 3000, -2, 0.85),
      makeChoice("Code Fix", "Deploy parameterized query patches", 4, 7000, 0, 0.95),
      makeChoice("Take Offline", "Take the vulnerable application offline", 1, 10000, -15, 0.98),
      makeChoice("Monitor & Log", "Increase logging and continue monitoring", 2, 1500, -5, 0.45),
    ],
  },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickSeverity(weights: Record<Severity, number>): Severity {
  const rand = Math.random();
  let cumulative = 0;
  for (const [sev, weight] of Object.entries(weights) as [Severity, number][]) {
    cumulative += weight;
    if (rand <= cumulative) return sev;
  }
  return "medium";
}

const SEVERITY_DURATION: Record<Severity, number> = {
  low: 30,
  medium: 20,
  high: 12,
  critical: 8,
};

export function generateAttack(stats: CompanyStats, tick: number): SecurityEvent | null {
  const eligible = ATTACK_TEMPLATES.filter((t) => {
    const adjustedProb = t.baseProbability * t.modifiers(stats);
    return Math.random() < adjustedProb * 0.04;
  });

  if (eligible.length === 0) return null;

  const template = pickRandom(eligible);
  const severity = pickSeverity(template.severityWeights);

  return {
    id: uuid(),
    type: template.type,
    severity,
    title: pickRandom(template.titles),
    description: pickRandom(template.descriptions),
    source: pickRandom(template.sources),
    timestamp: tick,
    expiresAt: tick + SEVERITY_DURATION[severity],
    choices: template.getChoices(severity),
    resolved: false,
  };
}

export function getAttackIcon(type: AttackType): string {
  const icons: Record<AttackType, string> = {
    phishing: "🎣",
    ransomware: "🔒",
    zero_day: "💀",
    insider_threat: "🕵️",
    ddos: "🌊",
    social_engineering: "🎭",
    supply_chain: "📦",
    brute_force: "🔨",
    man_in_the_middle: "👤",
    sql_injection: "💉",
  };
  return icons[type];
}

export function getSeverityColor(severity: Severity): string {
  const colors: Record<Severity, string> = {
    low: "#22c55e",
    medium: "#eab308",
    high: "#f97316",
    critical: "#ef4444",
  };
  return colors[severity];
}
