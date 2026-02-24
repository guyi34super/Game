"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Swords,
  FlaskConical,
  BarChart3,
  Shield,
  DollarSign,
  Users,
  Globe,
  Brain,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  Lock,
  Fish,
  Skull,
  UserX,
  Drama,
  Package,
  Hammer,
  ScanEye,
  Syringe,
  ChevronDown,
  ChevronRight,
  Gauge,
  TrendingUp,
  Heart,
  Flame,
  BookOpen,
} from "lucide-react";
import { ReactNode } from "react";

type SectionProps = {
  icon: ReactNode;
  title: string;
  color: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

function CollapsibleSection({ icon, title, color, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card-cyber overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 p-5 text-left transition-colors hover:bg-cyber-border/10`}
      >
        <span className={`text-${color}`}>{icon}</span>
        <h3 className={`text-lg font-bold text-${color} flex-1`}>{title}</h3>
        {open ? (
          <ChevronDown size={18} className="text-cyber-dim" />
        ) : (
          <ChevronRight size={18} className="text-cyber-dim" />
        )}
      </button>
      {open && <div className="px-5 pb-5 border-t border-cyber-border/50 pt-4">{children}</div>}
    </div>
  );
}

function InfoCard({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="card-cyber p-4 flex gap-3">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
        <h4 className="text-sm font-semibold text-cyber-text mb-1">{title}</h4>
        <p className="text-xs text-cyber-dim leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function AttackCard({
  icon,
  name,
  severity,
  desc,
  tip,
}: {
  icon: ReactNode;
  name: string;
  severity: string;
  desc: string;
  tip: string;
}) {
  const sevColor =
    severity === "Critical"
      ? "text-severity-critical"
      : severity === "High"
      ? "text-severity-high"
      : severity === "Medium"
      ? "text-severity-medium"
      : "text-severity-low";

  return (
    <div className="card-cyber p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-semibold text-cyber-text">{name}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${sevColor} border-current/30 bg-current/5 ml-auto`}>
          {severity}
        </span>
      </div>
      <p className="text-xs text-cyber-dim leading-relaxed mb-2">{desc}</p>
      <div className="text-[11px] text-neon-green/80 flex items-start gap-1.5">
        <CheckCircle2 size={12} className="shrink-0 mt-0.5" />
        <span>{tip}</span>
      </div>
    </div>
  );
}

export default function HowToPlayPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-cyber-black grid-pattern">
      <div className="bg-cyber-dark border-b border-cyber-border px-4 py-3 flex items-center gap-4 sticky top-0 z-20">
        <button
          onClick={() => router.push("/")}
          className="btn-cyber px-3 py-1.5 text-xs flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-neon-green" />
          <h1 className="text-lg font-bold">
            <span className="text-neon-green">ZERO</span>
            <span className="text-neon-blue">DAY</span>
            <span className="text-cyber-dim ml-2 text-sm font-normal">// Operations Manual</span>
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {/* INTRO */}
        <div className="card-cyber p-6 border-neon-green/20">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={28} className="text-neon-green" />
            <div>
              <h2 className="text-xl font-bold text-neon-green">Welcome, Operator</h2>
              <p className="text-xs text-cyber-dim">Classification: TOP SECRET // EYES ONLY</p>
            </div>
          </div>
          <p className="text-sm text-cyber-text leading-relaxed mb-3">
            You are the Chief Information Security Officer (CISO) of a major corporation under constant cyber attack.
            Your mission: defend the company&apos;s network infrastructure, protect sensitive data, maintain public reputation,
            and keep the business running &mdash; all while operating on a limited security budget.
          </p>
          <p className="text-sm text-cyber-dim leading-relaxed">
            The simulation runs in real-time. Attacks come without warning. Every decision has consequences.
            How long can you survive?
          </p>
        </div>

        {/* OBJECTIVE */}
        <CollapsibleSection
          icon={<Target size={22} />}
          title="Your Objective"
          color="neon-green"
          defaultOpen={true}
        >
          <div className="space-y-3">
            <p className="text-sm text-cyber-text leading-relaxed">
              Your primary goal is to keep the company operational for as long as possible while maximizing your security score.
              The game ends when either of these conditions is met:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="card-cyber p-4 border-neon-red/20">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={16} className="text-neon-red" />
                  <span className="text-sm font-semibold text-neon-red">Reputation Reaches 0%</span>
                </div>
                <p className="text-xs text-cyber-dim leading-relaxed">
                  Failing to respond to attacks, letting breaches go uncontained, and losing customer trust will
                  destroy your reputation. When it hits zero, the board removes you.
                </p>
              </div>
              <div className="card-cyber p-4 border-neon-red/20">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={16} className="text-neon-red" />
                  <span className="text-sm font-semibold text-neon-red">Bankruptcy</span>
                </div>
                <p className="text-xs text-cyber-dim leading-relaxed">
                  If your security budget hits zero and your daily income has stopped, the company can no
                  longer operate. You&apos;ve been bankrupted by cyber attacks.
                </p>
              </div>
            </div>
            <div className="card-cyber p-4 border-neon-green/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-neon-green" />
                <span className="text-sm font-semibold text-neon-green">Scoring</span>
              </div>
              <p className="text-xs text-cyber-dim leading-relaxed">
                Your score is calculated from: attacks blocked (+100 each), reputation maintained (+50 per point),
                security maturity level (+30 per point), incidents resolved (+75 each), minus attacks that
                succeeded (-200 each). Higher difficulty modes offer naturally higher score potential.
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* DASHBOARD */}
        <CollapsibleSection
          icon={<Building2 size={22} />}
          title="The Dashboard"
          color="neon-blue"
          defaultOpen={true}
        >
          <div className="space-y-3">
            <p className="text-sm text-cyber-text leading-relaxed">
              The dashboard is your command center. It&apos;s organized into five tabs, each giving you critical
              information and controls:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoCard
                icon={<BarChart3 size={18} className="text-neon-green" />}
                title="Dashboard Tab"
                desc="Your main overview. Shows stats at a glance: budget, reputation, security maturity, active threats, AI analysis, financial tracking, traffic monitoring, vulnerability heatmap, and the threat timeline."
              />
              <InfoCard
                icon={<Globe size={18} className="text-neon-blue" />}
                title="Network Tab"
                desc="Visual map of your entire network infrastructure including servers, firewalls, routers, databases, cloud instances, and workstations. Monitor traffic, patch vulnerable nodes, and see compromised systems."
              />
              <InfoCard
                icon={<Users size={18} className="text-neon-purple" />}
                title="Employees Tab"
                desc="Manage your workforce. Each employee has an awareness score, risk score, and productivity rating. Train employees to reduce their risk and increase awareness. Hire new staff as needed."
              />
              <InfoCard
                icon={<FlaskConical size={18} className="text-neon-yellow" />}
                title="Research Tab"
                desc="Invest in security research across four categories: Detection, Prevention, Response, and AI. Each research project costs money and takes time, but provides permanent defensive upgrades."
              />
              <InfoCard
                icon={<BookOpen size={18} className="text-cyber-text" />}
                title="Logs Tab"
                desc="Complete chronological log of every event: attacks, responses, research completions, financial changes, and system alerts. Essential for understanding attack patterns."
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* TOP BAR */}
        <CollapsibleSection
          icon={<Gauge size={22} />}
          title="Top Bar Controls"
          color="neon-yellow"
        >
          <div className="space-y-3">
            <p className="text-sm text-cyber-text leading-relaxed">
              The top bar displays critical real-time information and simulation controls:
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              <InfoCard
                icon={<Clock size={18} className="text-neon-blue" />}
                title="Day & Time"
                desc="Shows the current simulation day and hour. The simulation runs on a 24-hour cycle; each full cycle is one day."
              />
              <InfoCard
                icon={<DollarSign size={18} className="text-neon-green" />}
                title="Budget"
                desc="Your current security budget. Used for responding to incidents, hiring, training, patching, and research. Replenished by daily income."
              />
              <InfoCard
                icon={<Heart size={18} className="text-neon-red" />}
                title="Reputation"
                desc="Public trust in your company (0-100%). Drops when attacks succeed. Some responses can restore reputation. Hits 0% = game over."
              />
            </div>
            <div className="card-cyber p-4">
              <h4 className="text-sm font-semibold text-cyber-text mb-2">Speed Controls</h4>
              <p className="text-xs text-cyber-dim leading-relaxed">
                Use 1x / 2x / 3x to control simulation speed. Hit Pause when you need time to think through
                a complex incident. The game is designed to be played at 1x initially while you learn, then
                increase speed as you become more comfortable.
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* ATTACKS */}
        <CollapsibleSection
          icon={<Swords size={22} />}
          title="Attack Types & How to Respond"
          color="neon-red"
        >
          <div className="space-y-3">
            <p className="text-sm text-cyber-text leading-relaxed">
              Attacks appear as security events on your dashboard. Each has a severity level
              (Low / Medium / High / Critical), a time limit before it expires (causing automatic damage),
              and multiple response options. Choose wisely &mdash; each response has a different success rate, cost, and impact.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <AttackCard
                icon={<Fish size={16} className="text-neon-blue" />}
                name="Phishing"
                severity="Medium"
                desc="Deceptive emails targeting employees to steal credentials or deliver malware. The most common attack vector."
                tip="High employee awareness is your best defense. Train employees regularly and use 'Block & Quarantine' for quick response."
              />
              <AttackCard
                icon={<Lock size={16} className="text-neon-red" />}
                name="Ransomware"
                severity="Critical"
                desc="Encrypts your files and demands payment. Can cripple entire network segments and cause massive financial loss."
                tip="Keep patch levels high and backups ready. 'Isolate & Restore' is expensive but reliable. Never pay the ransom."
              />
              <AttackCard
                icon={<Skull size={16} className="text-neon-purple" />}
                name="Zero-Day Exploits"
                severity="Critical"
                desc="Unknown vulnerabilities being actively exploited. Extremely dangerous because no patch exists yet."
                tip="Invest in threat intelligence and AI detection. 'Emergency Patch' takes time but is the most thorough fix."
              />
              <AttackCard
                icon={<UserX size={16} className="text-neon-orange" />}
                name="Insider Threats"
                severity="High"
                desc="An employee accessing data outside their normal scope. Could be malicious or compromised credentials."
                tip="'Covert Investigation' has the highest success rate. Monitor employee risk scores proactively."
              />
              <AttackCard
                icon={<Zap size={16} className="text-neon-yellow" />}
                name="DDoS Attacks"
                severity="High"
                desc="Floods your servers with traffic to overwhelm them. Causes service outages and lost revenue."
                tip="Strong firewalls reduce DDoS frequency. 'Activate CDN Shield' is the fastest reliable response."
              />
              <AttackCard
                icon={<Drama size={16} className="text-neon-green" />}
                name="Social Engineering"
                severity="Medium"
                desc="Attackers manipulate employees through impersonation, pretexting, or vishing to gain access."
                tip="Employee awareness above 80% makes these rare. 'Emergency Training' provides long-term benefit."
              />
              <AttackCard
                icon={<Package size={16} className="text-neon-blue" />}
                name="Supply Chain"
                severity="Critical"
                desc="Compromised software updates or third-party vendor breaches affecting your systems."
                tip="High threat intelligence reduces frequency. 'Audit & Patch' is slow but has the best success rate."
              />
              <AttackCard
                icon={<Hammer size={16} className="text-cyber-text" />}
                name="Brute Force"
                severity="Medium"
                desc="Automated attempts to guess passwords or stuff stolen credentials into your login systems."
                tip="Strong firewalls are key. 'Force MFA' has a 92% success rate and boosts reputation."
              />
              <AttackCard
                icon={<ScanEye size={16} className="text-neon-purple" />}
                name="Man-in-the-Middle"
                severity="High"
                desc="Intercepting communications between your systems. Can steal data or inject malicious content."
                tip="Data encryption above 80% makes these very rare. 'Force Encryption' is the best long-term fix."
              />
              <AttackCard
                icon={<Syringe size={16} className="text-neon-red" />}
                name="SQL Injection"
                severity="High"
                desc="Malicious database queries targeting your web applications to exfiltrate or destroy data."
                tip="Keep patch levels high. 'Code Fix' has 95% success rate but takes time; 'WAF Update' is faster."
              />
            </div>
            <div className="card-cyber p-4 border-neon-yellow/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-neon-yellow" />
                <span className="text-sm font-semibold text-neon-yellow">Expiry Warning</span>
              </div>
              <p className="text-xs text-cyber-dim leading-relaxed">
                Every attack has a countdown timer. If you don&apos;t respond before it expires, the attack automatically succeeds,
                causing maximum reputation and financial damage. Critical events expire the fastest (8 ticks),
                while low-severity events give you more time (30 ticks). On Hard mode, these windows are 40% shorter.
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* RESOURCES */}
        <CollapsibleSection
          icon={<DollarSign size={22} />}
          title="Resource Management"
          color="neon-green"
        >
          <div className="space-y-3">
            <p className="text-sm text-cyber-text leading-relaxed">
              Budget is your most critical resource. Here&apos;s how money flows in the game:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="card-cyber p-4">
                <h4 className="text-sm font-semibold text-neon-green mb-2">Income</h4>
                <ul className="text-xs text-cyber-dim space-y-1.5 leading-relaxed">
                  <li>- Daily income is added every 24 simulation ticks</li>
                  <li>- Easy: $8,000/day | Medium: $5,000/day | Hard: $3,000/day</li>
                  <li>- Budget caps at 2x your starting amount</li>
                </ul>
              </div>
              <div className="card-cyber p-4">
                <h4 className="text-sm font-semibold text-neon-red mb-2">Expenses</h4>
                <ul className="text-xs text-cyber-dim space-y-1.5 leading-relaxed">
                  <li>- Incident responses: $500 &ndash; $50,000 per action</li>
                  <li>- Employee training: $1,000 per employee</li>
                  <li>- Node patching: $2,000 per node</li>
                  <li>- Hiring: $3,000 per new employee</li>
                  <li>- Research: varies by project (see Research tab)</li>
                  <li>- Failed attacks drain additional money</li>
                </ul>
              </div>
            </div>
            <div className="card-cyber p-4">
              <h4 className="text-sm font-semibold text-neon-blue mb-2">Strategy Tips</h4>
              <ul className="text-xs text-cyber-dim space-y-1.5 leading-relaxed">
                <li>- Don&apos;t spend everything immediately. Keep a reserve for emergencies.</li>
                <li>- Training employees is cheap and extremely effective against phishing and social engineering.</li>
                <li>- Prioritize research that improves AI detection &mdash; it passively reduces attack frequency.</li>
                <li>- Patching nodes is expensive but eliminates all vulnerabilities on that node.</li>
              </ul>
            </div>
          </div>
        </CollapsibleSection>

        {/* RESEARCH */}
        <CollapsibleSection
          icon={<FlaskConical size={22} />}
          title="Research System"
          color="neon-purple"
        >
          <div className="space-y-3">
            <p className="text-sm text-cyber-text leading-relaxed">
              The research tree provides permanent upgrades to your defenses. There are four categories:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoCard
                icon={<ScanEye size={18} className="text-neon-blue" />}
                title="Detection"
                desc="Improves your ability to detect attacks earlier. Increases AI detection level and threat intelligence, making attacks less likely to appear."
              />
              <InfoCard
                icon={<Shield size={18} className="text-neon-green" />}
                title="Prevention"
                desc="Strengthens your defenses before attacks happen. Boosts firewall strength, data encryption, and patch levels."
              />
              <InfoCard
                icon={<Zap size={18} className="text-neon-yellow" />}
                title="Response"
                desc="Improves your incident response capabilities. Reduces response time and increases the effectiveness of your security team."
              />
              <InfoCard
                icon={<Brain size={18} className="text-neon-purple" />}
                title="AI"
                desc="Advanced machine learning research. Dramatically improves automated threat detection and behavioral analysis."
              />
            </div>
            <div className="card-cyber p-4 border-neon-purple/20">
              <h4 className="text-sm font-semibold text-neon-purple mb-2">Research Tips</h4>
              <ul className="text-xs text-cyber-dim space-y-1.5 leading-relaxed">
                <li>- Some research projects have prerequisites &mdash; check before planning your path.</li>
                <li>- Only one project researches at a time per category. Plan your order carefully.</li>
                <li>- AI research is expensive but provides the highest long-term value.</li>
                <li>- Detection and Prevention research should be prioritized early to reduce incoming attacks.</li>
              </ul>
            </div>
          </div>
        </CollapsibleSection>

        {/* EMPLOYEES */}
        <CollapsibleSection
          icon={<Users size={22} />}
          title="Employee Management"
          color="neon-blue"
        >
          <div className="space-y-3">
            <p className="text-sm text-cyber-text leading-relaxed">
              Your employees are both your greatest asset and your biggest vulnerability. Each employee has:
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              <InfoCard
                icon={<Brain size={18} className="text-neon-green" />}
                title="Awareness Score"
                desc="How security-conscious the employee is (0-100). Higher awareness reduces phishing and social engineering success."
              />
              <InfoCard
                icon={<AlertTriangle size={18} className="text-neon-red" />}
                title="Risk Score"
                desc="How likely the employee is to cause a security incident (0-100). High-risk employees should be trained immediately."
              />
              <InfoCard
                icon={<TrendingUp size={18} className="text-neon-blue" />}
                title="Productivity"
                desc="Work output level (40-100). Fluctuates naturally. Compromised employees have reduced productivity."
              />
            </div>
            <div className="card-cyber p-4">
              <h4 className="text-sm font-semibold text-cyber-text mb-2">Actions</h4>
              <ul className="text-xs text-cyber-dim space-y-1.5 leading-relaxed">
                <li>- <span className="text-neon-green">Train ($1,000):</span> Increases awareness by +15, reduces risk by -10. One of the best investments in the game.</li>
                <li>- <span className="text-neon-blue">Hire ($3,000):</span> Adds a new employee with randomized stats. Useful when you need more hands on deck.</li>
                <li>- Employees can become <span className="text-neon-red">compromised</span> during insider threat attacks.</li>
                <li>- Risk scores fluctuate naturally over time, so periodic training is important.</li>
              </ul>
            </div>
          </div>
        </CollapsibleSection>

        {/* NETWORK */}
        <CollapsibleSection
          icon={<Globe size={22} />}
          title="Network Infrastructure"
          color="neon-green"
        >
          <div className="space-y-3">
            <p className="text-sm text-cyber-text leading-relaxed">
              Your network consists of different types of nodes, each with specific roles:
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              <InfoCard
                icon={<Shield size={18} className="text-neon-green" />}
                title="Firewalls"
                desc="Your first line of defense. Protect the network perimeter from external attacks."
              />
              <InfoCard
                icon={<Globe size={18} className="text-neon-blue" />}
                title="Routers"
                desc="Direct network traffic. Compromised routers can expose your entire network."
              />
              <InfoCard
                icon={<Building2 size={18} className="text-neon-purple" />}
                title="Servers & Databases"
                desc="Core infrastructure holding critical data and running services. High-value targets."
              />
            </div>
            <div className="card-cyber p-4">
              <h4 className="text-sm font-semibold text-cyber-text mb-2">Node Status</h4>
              <ul className="text-xs text-cyber-dim space-y-1.5 leading-relaxed">
                <li>- <span className="text-neon-green">Online:</span> Operating normally. May still have vulnerabilities.</li>
                <li>- <span className="text-neon-yellow">Patching:</span> Currently being patched. Will return to online with 0 vulnerabilities and 100% patch level.</li>
                <li>- <span className="text-neon-red">Compromised:</span> Has been breached by an attacker. Needs immediate attention.</li>
                <li>- <span className="text-cyber-dim">Offline:</span> Not currently operational. May need to be brought back online.</li>
              </ul>
            </div>
            <div className="card-cyber p-4">
              <h4 className="text-sm font-semibold text-cyber-text mb-2">Patching ($2,000/node)</h4>
              <p className="text-xs text-cyber-dim leading-relaxed">
                Patching a node removes all vulnerabilities and sets its patch level to 100%.
                This directly improves your company&apos;s overall patch level, reducing the frequency of
                ransomware, zero-day, and SQL injection attacks. Prioritize nodes with the most vulnerabilities.
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* DIFFICULTY */}
        <CollapsibleSection
          icon={<Flame size={22} />}
          title="Difficulty Modes"
          color="neon-orange"
        >
          <div className="space-y-3">
            <p className="text-sm text-cyber-text leading-relaxed">
              Choose your difficulty before starting a simulation. Each mode significantly changes the game experience:
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="card-cyber p-4 border-neon-green/20">
                <h4 className="text-sm font-semibold text-neon-green mb-2">Easy</h4>
                <ul className="text-[11px] text-cyber-dim space-y-1 leading-relaxed">
                  <li>- Budget: $180,000</li>
                  <li>- Income: $8,000/day</li>
                  <li>- Attack rate: 40% of normal</li>
                  <li>- Damage: 60% of normal</li>
                  <li>- Response windows: 80% longer</li>
                  <li>- Higher starting defenses</li>
                </ul>
              </div>
              <div className="card-cyber p-4 border-neon-yellow/20">
                <h4 className="text-sm font-semibold text-neon-yellow mb-2">Medium</h4>
                <ul className="text-[11px] text-cyber-dim space-y-1 leading-relaxed">
                  <li>- Budget: $100,000</li>
                  <li>- Income: $5,000/day</li>
                  <li>- Attack rate: Standard</li>
                  <li>- Damage: Standard</li>
                  <li>- Response windows: Standard</li>
                  <li>- Moderate starting defenses</li>
                </ul>
              </div>
              <div className="card-cyber p-4 border-neon-red/20">
                <h4 className="text-sm font-semibold text-neon-red mb-2">Hard</h4>
                <ul className="text-[11px] text-cyber-dim space-y-1 leading-relaxed">
                  <li>- Budget: $60,000</li>
                  <li>- Income: $3,000/day</li>
                  <li>- Attack rate: 2x normal</li>
                  <li>- Damage: 60% more</li>
                  <li>- Response windows: 40% shorter</li>
                  <li>- Minimal starting defenses</li>
                </ul>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* PRO TIPS */}
        <CollapsibleSection
          icon={<Brain size={22} />}
          title="Pro Tips & Strategy Guide"
          color="neon-yellow"
          defaultOpen={true}
        >
          <div className="space-y-3">
            <div className="card-cyber p-4 border-neon-green/20">
              <h4 className="text-sm font-semibold text-neon-green mb-2">Early Game (Days 1-5)</h4>
              <ul className="text-xs text-cyber-dim space-y-1.5 leading-relaxed">
                <li>- Train your highest-risk employees immediately.</li>
                <li>- Start researching basic Detection upgrades.</li>
                <li>- Patch your most vulnerable network nodes.</li>
                <li>- Keep at least $20,000 in reserve for emergency responses.</li>
              </ul>
            </div>
            <div className="card-cyber p-4 border-neon-blue/20">
              <h4 className="text-sm font-semibold text-neon-blue mb-2">Mid Game (Days 5-15)</h4>
              <ul className="text-xs text-cyber-dim space-y-1.5 leading-relaxed">
                <li>- Focus on AI research for long-term defense improvements.</li>
                <li>- Continue training employees &mdash; aim for company-wide awareness above 60%.</li>
                <li>- Start Prevention research to reduce attack frequency.</li>
                <li>- Monitor the financial tracker &mdash; if spending exceeds income, cut costs.</li>
              </ul>
            </div>
            <div className="card-cyber p-4 border-neon-purple/20">
              <h4 className="text-sm font-semibold text-neon-purple mb-2">Late Game (Days 15+)</h4>
              <ul className="text-xs text-cyber-dim space-y-1.5 leading-relaxed">
                <li>- By now, your research upgrades should be reducing attack frequency.</li>
                <li>- Focus on maintaining high scores by quickly resolving incidents.</li>
                <li>- Keep all employees trained and all nodes patched.</li>
                <li>- On Hard mode, attacks escalate &mdash; always keep a large emergency fund.</li>
              </ul>
            </div>
            <div className="card-cyber p-4 border-neon-yellow/20">
              <h4 className="text-sm font-semibold text-neon-yellow mb-2">Universal Tips</h4>
              <ul className="text-xs text-cyber-dim space-y-1.5 leading-relaxed">
                <li>- <span className="text-neon-green">Always respond to Critical events first</span> &mdash; they expire fastest and deal the most damage.</li>
                <li>- <span className="text-neon-blue">Read the success rates</span> before choosing a response. Sometimes the expensive option isn&apos;t the best.</li>
                <li>- <span className="text-neon-purple">Pause liberally</span> when multiple threats appear simultaneously.</li>
                <li>- <span className="text-neon-yellow">Check the logs</span> regularly to understand attack patterns and adjust your strategy.</li>
                <li>- <span className="text-neon-red">Never ignore events</span> &mdash; an unresolved event always causes more damage than even a failed response.</li>
              </ul>
            </div>
          </div>
        </CollapsibleSection>

        <div className="text-center pt-4 pb-8">
          <button
            onClick={() => router.push("/")}
            className="btn-cyber text-lg px-8 py-3 font-semibold tracking-wider"
          >
            &gt; BEGIN SIMULATION
          </button>
        </div>
      </div>
    </div>
  );
}
