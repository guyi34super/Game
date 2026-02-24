# ZeroDay: The Cyber War Simulator

A real-time browser-based cybersecurity strategy game where you act as a security analyst defending a simulated company against relentless cyber threats.

**Gameplay inspired by:** Plague Inc. (real-time pressure) + Football Manager (strategy depth) + Watch Dogs (cyber theme)

## Features

### Core Gameplay
- **Real-time threat simulation** - Face phishing, ransomware, zero-days, DDoS, insider threats, and more
- **Decision pressure system** - Timed events force you to choose: Block, Investigate, or Ignore?
- **Risk-based attack engine** - Attack probability scales with your security posture
- **Research tree** - 12 upgradable technologies across Prevention, Detection, Response, and AI categories
- **Employee management** - Hire, train, and monitor staff security awareness

### Company Dashboard
- **Live traffic monitor** - Real-time network traffic visualization with D3.js
- **Vulnerability heatmap** - Visual overview of system vulnerabilities
- **Threat timeline** - Chronological view of all attack events by severity
- **Financial impact tracker** - Budget over time, spending, and loss tracking
- **Security posture meters** - Track maturity, awareness, patching, AI detection, and more

### AI-Powered Analysis
- **Anomaly detection** - Isolation Forest ML model for network traffic analysis
- **Behavioral analysis** - Employee risk scoring based on multiple factors
- **Risk assessment** - Multi-factor threat probability prediction
- **Recommended actions** - AI-generated security improvement suggestions

### Network Visualization
- **Interactive topology map** - D3.js force-directed network graph
- **Animated data packets** - Visual network traffic between nodes
- **Click-to-patch** - Patch vulnerable nodes directly from the map

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, Custom CSS animations |
| State | Zustand |
| Visualizations | D3.js v7 |
| AI Microservice | Python, Flask, scikit-learn |
| ML Model | Isolation Forest (anomaly detection) |

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+ (for AI service, optional)

### Frontend Setup

```bash
cd zeroday
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start playing.

### AI Service Setup (Optional)

The game works without the AI service using local heuristics. To enable the full ML-powered analysis:

```bash
cd zeroday/ai-service
pip install -r requirements.txt
python server.py
```

The AI service runs on port 5000 and provides:
- `POST /api/analyze/traffic` - Network traffic anomaly detection
- `POST /api/analyze/behavior` - Employee behavioral analysis
- `POST /api/analyze/risk` - Comprehensive risk assessment

## How to Play

1. **Start the simulation** from the main menu
2. **Monitor your dashboard** for incoming threats
3. **Respond to events** before they expire - each choice has trade-offs:
   - **Cost** - Money spent on response
   - **Time** - How long the response takes
   - **Success Rate** - Probability of containing the threat
   - **Reputation Impact** - Public trust effects
4. **Research upgrades** to strengthen your defenses
5. **Train employees** to reduce phishing/social engineering risk
6. **Patch network nodes** to close vulnerabilities
7. **Run AI analysis** to get threat predictions and recommendations
8. **Survive** as long as possible without going bankrupt or losing all reputation

## Game Mechanics

### Attack Types
| Attack | Trigger Conditions |
|--------|-------------------|
| Phishing | Low employee awareness |
| Ransomware | Poor patching, weak encryption |
| Zero-Day | Low threat intelligence |
| Insider Threat | Low awareness, weak AI detection |
| DDoS | Weak firewall |
| Social Engineering | Low employee awareness |
| Supply Chain | Poor patching, low threat intel |
| Brute Force | Weak firewall, poor encryption |
| MITM | Low data encryption |
| SQL Injection | Poor patching, weak firewall |

### Research Categories
- **Prevention** - Firewalls, encryption, zero trust, patching
- **Detection** - SIEM, threat intelligence feeds
- **Response** - Incident response plans, red team operations
- **AI** - Anomaly detection, behavioral analysis, predictive modeling

## Project Structure

```
zeroday/
├── src/
│   ├── app/              # Next.js pages and API routes
│   │   ├── page.tsx      # Main menu with boot sequence
│   │   ├── game/         # Game dashboard page
│   │   └── api/          # API proxy to AI service
│   ├── components/       # React components
│   │   ├── dashboard/    # Dashboard widgets
│   │   ├── game/         # Game screens
│   │   └── ui/           # Reusable UI components
│   ├── engine/           # Game simulation engine
│   │   ├── types.ts      # TypeScript type definitions
│   │   ├── attacks.ts    # Attack generation & templates
│   │   ├── simulation.ts # Game tick & event resolution
│   │   ├── research.ts   # Research tree definitions
│   │   ├── init.ts       # Initial game state
│   │   └── names.ts      # Name generators
│   └── lib/
│       └── store.ts      # Zustand state management
├── ai-service/           # Python AI microservice
│   ├── anomaly_detector.py
│   ├── server.py
│   └── requirements.txt
└── package.json
```
