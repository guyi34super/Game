const FIRST_NAMES = [
  "James", "Maria", "David", "Sarah", "Michael", "Emma", "Robert", "Lisa",
  "William", "Jennifer", "Daniel", "Ashley", "Alexander", "Amanda", "Thomas",
  "Megan", "Christopher", "Rachel", "Andrew", "Nicole", "Kevin", "Samantha",
  "Brian", "Lauren", "Raj", "Priya", "Yuki", "Chen", "Ahmed", "Fatima",
  "Carlos", "Sofia", "Ivan", "Olga", "Stefan", "Aiko", "Omar", "Lena",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Rodriguez", "Martinez", "Anderson", "Taylor", "Thomas", "Moore",
  "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris",
  "Patel", "Tanaka", "Chen", "Ahmed", "Volkov", "Kim", "Santos", "Erikson",
];

const DEPARTMENTS = [
  "Engineering", "Marketing", "Finance", "HR", "IT", "Sales",
  "Legal", "Operations", "Executive", "R&D", "Support", "Security",
];

const ROLES: Record<string, string[]> = {
  Engineering: ["Frontend Developer", "Backend Developer", "DevOps Engineer", "QA Engineer", "Tech Lead"],
  Marketing: ["Marketing Manager", "Content Strategist", "SEO Specialist", "Brand Manager"],
  Finance: ["Financial Analyst", "Accountant", "CFO", "Controller", "Auditor"],
  HR: ["HR Manager", "Recruiter", "Benefits Coordinator", "Training Specialist"],
  IT: ["System Administrator", "Network Engineer", "Help Desk Tech", "IT Manager"],
  Sales: ["Account Executive", "Sales Manager", "Business Developer", "Sales Engineer"],
  Legal: ["Legal Counsel", "Compliance Officer", "Contract Manager", "Paralegal"],
  Operations: ["Operations Manager", "Project Manager", "Supply Chain Manager"],
  Executive: ["CEO", "CTO", "CISO", "COO", "VP Engineering"],
  "R&D": ["Research Scientist", "Data Scientist", "ML Engineer", "Innovation Lead"],
  Support: ["Customer Support Lead", "Technical Writer", "Support Engineer"],
  Security: ["Security Analyst", "Penetration Tester", "SOC Analyst", "Security Architect"],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateEmployeeName(): { first: string; last: string } {
  return { first: pick(FIRST_NAMES), last: pick(LAST_NAMES) };
}

export function generateDepartmentAndRole(): { department: string; role: string } {
  const department = pick(DEPARTMENTS);
  const role = pick(ROLES[department] || ["Employee"]);
  return { department, role };
}

const NODE_NAMES: Record<string, string[]> = {
  server: ["Web Server Alpha", "API Gateway", "Auth Server", "Prod Server", "Staging Server", "Mail Server"],
  workstation: ["Dev Workstation", "Admin Terminal", "HR Desktop", "Finance PC", "Exec Laptop"],
  firewall: ["Edge Firewall", "Internal Firewall", "DMZ Firewall", "Cloud WAF"],
  router: ["Core Router", "Edge Router", "Branch Router", "VPN Gateway"],
  database: ["Primary DB", "User DB", "Analytics DB", "Backup DB", "Log Store"],
  cloud: ["AWS Instance", "Azure VM", "GCP Compute", "CDN Node", "S3 Bucket"],
};

export function generateNodeName(type: keyof typeof NODE_NAMES): string {
  return pick(NODE_NAMES[type] || ["Unknown Node"]);
}
