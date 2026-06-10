// ─── Idea-to-Reality Simulation Engine ────────────────────────────────────────
// Pure logic layer — no JSX, no client-side APIs.
// Analyzes free-text ideas and maps them to rich industry simulation data.

export type StageId =
  | "idea"
  | "analysis"
  | "design"
  | "digital-twin"
  | "construction"
  | "result";

export interface SimulationStage {
  id: StageId;
  label: string;
  shortLabel: string;
  duration: number; // ms before auto-advancing (Infinity = stays)
}

export interface AnalysisTag {
  label: string;
  type: "requirement" | "industry" | "tech" | "challenge";
}

export interface SimulationResult {
  title: string;
  description: string;
  metrics: { label: string; value: string; unit: string }[];
  benefits: string[];
  timeline: string;
  wing: string;
}

export interface IndustryData {
  name: string;
  projectType: string;
  analysisItems: string[];
  tags: AnalysisTag[];
  designElements: string[];
  twinFeatures: string[];
  constructionPhases: string[];
  result: SimulationResult;
}

export interface SimulationData {
  idea: string;
  industry: IndustryData;
  timestamp: number;
}

// ─── Stage definitions ─────────────────────────────────────────────────────────
export const SIMULATION_STAGES: SimulationStage[] = [
  { id: "idea",         label: "Concept Intake",   shortLabel: "IDEA",      duration: 1800  },
  { id: "analysis",     label: "AI Analysis",      shortLabel: "ANALYSIS",  duration: 3200  },
  { id: "design",       label: "System Design",    shortLabel: "DESIGN",    duration: 2800  },
  { id: "digital-twin", label: "Digital Twin",     shortLabel: "TWIN",      duration: 3000  },
  { id: "construction", label: "Construction",     shortLabel: "BUILD",     duration: 2800  },
  { id: "result",       label: "Project Complete", shortLabel: "LIVE",      duration: Infinity },
];

// ─── Industry templates ────────────────────────────────────────────────────────
const INDUSTRIES: Record<string, IndustryData> = {
  residential: {
    name: "Residential",
    projectType: "Smart Residential Complex",
    analysisItems: [
      "Occupancy pattern recognition",
      "HVAC optimization pathways",
      "Energy demand forecasting",
      "Smart access control matrix",
      "Resident experience modules",
    ],
    tags: [
      { label: "PropTech",          type: "industry"     },
      { label: "IoT Integration",   type: "tech"         },
      { label: "Digital Twin",      type: "tech"         },
      { label: "Smart Home BMS",    type: "requirement"  },
      { label: "Utility Analytics", type: "tech"         },
      { label: "LEED Compliance",   type: "challenge"    },
    ],
    designElements: ["Floor Plan AI", "MEP Blueprint", "Smart Node Map", "Facade Analysis"],
    twinFeatures: [
      "Real-time occupancy map",
      "Energy consumption twin",
      "Predictive maintenance alerts",
      "Resident portal sync layer",
    ],
    constructionPhases: [
      "Foundation & Structure",
      "Smart Infrastructure Wiring",
      "IoT Node Deployment",
      "BMS Integration & Commissioning",
      "Resident Platform Go-Live",
    ],
    result: {
      title: "Smart Residential Complex",
      description:
        "A fully connected, AI-managed residential ecosystem where every system adapts to resident needs in real time — from climate and energy to security and services.",
      metrics: [
        { label: "Energy Saved",           value: "42",  unit: "%" },
        { label: "Maintenance Cost Saved", value: "38",  unit: "%" },
        { label: "Resident Satisfaction",  value: "96",  unit: "%" },
        { label: "ROI Timeline",           value: "2.4", unit: "yrs" },
      ],
      benefits: [
        "Predictive maintenance prevents 94% of equipment failures before they occur",
        "Smart HVAC adapts per zone, reducing energy bills by up to 42%",
        "Unified resident app for all building services, access, and support",
        "Real-time carbon footprint tracking with ESG reporting dashboards",
      ],
      timeline: "8–14 months",
      wing: "NexTech + NexBuild",
    },
  },

  manufacturing: {
    name: "Manufacturing",
    projectType: "AI-Powered Manufacturing Plant",
    analysisItems: [
      "Production line mapping & OEE analysis",
      "Predictive maintenance vectors",
      "Computer vision QC integration points",
      "Supply chain data stream design",
      "Worker safety & ISO compliance",
    ],
    tags: [
      { label: "Industry 4.0",       type: "industry"    },
      { label: "Computer Vision QC", type: "tech"        },
      { label: "SCADA Integration",  type: "requirement" },
      { label: "Digital Factory",    type: "tech"        },
      { label: "Robotics Automation",type: "requirement" },
      { label: "ISO 9001 Alignment", type: "challenge"   },
    ],
    designElements: ["Factory Floor Layout", "Automation Schematic", "Data Flow Architecture", "Safety Zone Map"],
    twinFeatures: [
      "Live production line mirror",
      "Defect prediction engine (0.3mm precision)",
      "Downtime simulation & prevention",
      "Supply chain integration layer",
    ],
    constructionPhases: [
      "Plant Assessment & Process Audit",
      "Sensor & IIoT Hardware Deployment",
      "SCADA System Integration",
      "AI Model Training & Validation",
      "Go-Live & Staff Certification",
    ],
    result: {
      title: "Intelligent Manufacturing Facility",
      description:
        "A self-optimizing production environment where AI monitors every machine, predicts failures before they happen, and continuously maximizes throughput — 24/7.",
      metrics: [
        { label: "Downtime Reduced",  value: "61",  unit: "%" },
        { label: "OEE Improvement",   value: "34",  unit: "%" },
        { label: "Defect Rate Drop",  value: "78",  unit: "%" },
        { label: "Annual Savings",    value: "2.1", unit: "M USD" },
      ],
      benefits: [
        "Computer vision quality control detects defects at 0.3mm precision",
        "Predictive maintenance eliminates unplanned production stops",
        "Digital twin simulates line changes before physical execution",
        "Energy consumption optimized per shift and per product type",
      ],
      timeline: "12–18 months",
      wing: "NexTech + NexDesign",
    },
  },

  "smart-city": {
    name: "Smart City",
    projectType: "Urban Digital Intelligence Platform",
    analysisItems: [
      "Urban mobility & traffic flow modeling",
      "Public utility infrastructure mapping",
      "Emergency services coordination matrix",
      "Environmental sensor network design",
      "Multi-agency data governance framework",
    ],
    tags: [
      { label: "Smart City",            type: "industry"   },
      { label: "GIS Integration",       type: "tech"       },
      { label: "Urban Digital Twin",    type: "tech"       },
      { label: "Multi-Agency Coord.",   type: "challenge"  },
      { label: "IoT at Scale",          type: "requirement"},
      { label: "Data Sovereignty",      type: "challenge"  },
    ],
    designElements: ["City Layer Architecture", "Sensor Grid Design", "Command Center UI", "Traffic Flow Model"],
    twinFeatures: [
      "Real-time city operational dashboard",
      "Traffic & mobility simulation engine",
      "Utility load balancing intelligence",
      "Emergency response coordination hub",
    ],
    constructionPhases: [
      "Infrastructure Audit & Digital Baseline",
      "Sensor Network Deployment",
      "Unified Data Platform Build",
      "Agency System Integrations",
      "Command Center Commissioning",
    ],
    result: {
      title: "Smart City Intelligence Platform",
      description:
        "A unified urban intelligence layer connecting every city system — traffic, utilities, emergency services, and citizen experience — into a single responsive, intelligent brain.",
      metrics: [
        { label: "Traffic Efficiency",   value: "31",  unit: "%" },
        { label: "Emergency Response",   value: "40",  unit: "% faster" },
        { label: "Energy Savings",       value: "28",  unit: "%" },
        { label: "Citizens Impacted",    value: "500", unit: "K+" },
      ],
      benefits: [
        "Real-time traffic optimization reduces average commute by 31%",
        "Predictive maintenance covers all public infrastructure assets",
        "Unified emergency command and dispatch reduces response times 40%",
        "Environmental monitoring with real-time air and noise alerting",
      ],
      timeline: "18–36 months",
      wing: "NexTech + NexForce",
    },
  },

  commercial: {
    name: "Commercial",
    projectType: "Intelligent Commercial Development",
    analysisItems: [
      "Occupancy & space utilization modeling",
      "Tenant experience touchpoint mapping",
      "Building management system design",
      "Visitor flow & wayfinding intelligence",
      "Carbon accounting & ESG framework",
    ],
    tags: [
      { label: "Commercial Real Estate", type: "industry"   },
      { label: "PropTech",              type: "tech"        },
      { label: "Smart BMS",             type: "requirement" },
      { label: "Digital Wayfinding",    type: "tech"        },
      { label: "Tenant Analytics",      type: "requirement" },
      { label: "LEED Gold Target",      type: "challenge"   },
    ],
    designElements: ["Space Planning AI", "BIM 3D Coordination", "MEP Engineering", "Facade Energy Analysis"],
    twinFeatures: [
      "Occupancy heat mapping & forecasting",
      "Energy performance real-time twin",
      "Tenant management platform integration",
      "Predictive facilities operations",
    ],
    constructionPhases: [
      "Concept Design & BIM Modeling",
      "Clash Detection & Stakeholder Review",
      "Smart Infrastructure Installation",
      "IoT Device Commissioning",
      "Tenant Onboarding & Handover",
    ],
    result: {
      title: "Smart Commercial Development",
      description:
        "A next-generation commercial property that attracts premium tenants with intelligent building services, measurable sustainability credentials, and frictionless operations.",
      metrics: [
        { label: "Energy Efficiency",   value: "45",   unit: "%" },
        { label: "Tenant Satisfaction", value: "94",   unit: "%" },
        { label: "Operational Savings", value: "33",   unit: "%" },
        { label: "LEED Rating",         value: "Gold", unit: ""  },
      ],
      benefits: [
        "Smart space allocation maximizes rentable area and lease value",
        "Automated facilities management reduces operational overheads by 33%",
        "Real-time carbon tracking powers ESG investor reporting",
        "Premium tenant experience drives market-leading occupancy rates",
      ],
      timeline: "10–20 months",
      wing: "NexDesign + NexBuild",
    },
  },

  energy: {
    name: "Energy",
    projectType: "Smart Energy & Grid System",
    analysisItems: [
      "Grid topology & load flow analysis",
      "Renewable energy integration pathways",
      "SCADA & EMS compatibility assessment",
      "Demand forecasting model requirements",
      "Regulatory compliance mapping",
    ],
    tags: [
      { label: "Energy & Utilities",   type: "industry"   },
      { label: "Grid Digital Twin",    type: "tech"       },
      { label: "SCADA Integration",    type: "requirement"},
      { label: "Renewable Mix",        type: "tech"       },
      { label: "Load Forecasting AI",  type: "tech"       },
      { label: "NERC Compliance",      type: "challenge"  },
    ],
    designElements: ["Grid Topology Map", "SCADA Architecture", "Renewable Integration Plan", "Control Room Design"],
    twinFeatures: [
      "Real-time grid simulation environment",
      "Fault prediction & isolation engine",
      "Renewable load balancing optimizer",
      "Regulatory compliance dashboard",
    ],
    constructionPhases: [
      "Grid Assessment & Digital Baseline",
      "RTU & Sensor Hardware Deployment",
      "SCADA & EMS Platform Build",
      "AI Forecasting Model Commissioning",
      "Operator Training & Regulatory Handover",
    ],
    result: {
      title: "Intelligent Energy Management System",
      description:
        "A fully digitized energy infrastructure with AI-driven load balancing, fault prediction, and renewable integration — operating at 99.9% uptime across all conditions.",
      metrics: [
        { label: "Grid Uptime",      value: "99.9", unit: "%" },
        { label: "Renewable Mix",    value: "67",   unit: "%" },
        { label: "Energy Loss Drop", value: "22",   unit: "%" },
        { label: "OPEX Savings",     value: "1.8",  unit: "M USD/yr" },
      ],
      benefits: [
        "Predictive fault detection prevents 96% of outages before they occur",
        "AI balances load across renewable sources and storage automatically",
        "Demand forecasting accuracy reaches 98.2% — eliminating waste",
        "Real-time compliance reporting streamlines regulatory interactions",
      ],
      timeline: "14–24 months",
      wing: "NexTech + NexForce",
    },
  },

  "ai-platform": {
    name: "AI Platform",
    projectType: "Enterprise AI Intelligence Platform",
    analysisItems: [
      "Data architecture & AI readiness audit",
      "Use case prioritization & ROI mapping",
      "Model training data requirements analysis",
      "Integration points with existing systems",
      "Scalability, security & governance design",
    ],
    tags: [
      { label: "AI & ML",             type: "industry"   },
      { label: "LLM Integration",     type: "tech"       },
      { label: "MLOps Pipeline",      type: "tech"       },
      { label: "Data Governance",     type: "challenge"  },
      { label: "Enterprise APIs",     type: "requirement"},
      { label: "Real-time Inference", type: "requirement"},
    ],
    designElements: ["AI Architecture Blueprint", "Data Flow Design", "API Gateway Layer", "Model Governance Framework"],
    twinFeatures: [
      "Model performance monitoring twin",
      "Real-time inference simulation layer",
      "A/B testing & experiment framework",
      "Data drift & retraining trigger system",
    ],
    constructionPhases: [
      "Data Audit & Preparation Pipeline",
      "Platform Architecture Engineering",
      "Model Development & Training",
      "Enterprise Integration & Security Testing",
      "Production Deployment & MLOps Setup",
    ],
    result: {
      title: "Enterprise AI Intelligence Platform",
      description:
        "A production-grade AI platform that deploys, monitors, and continuously improves AI models across your entire organization — from edge inference to enterprise analytics.",
      metrics: [
        { label: "Process Automation", value: "73",  unit: "%" },
        { label: "Decision Speed",     value: "10x", unit: ""  },
        { label: "Prediction Accuracy",value: "94",  unit: "%" },
        { label: "Annual Savings",     value: "3.2", unit: "M USD" },
      ],
      benefits: [
        "50+ AI models deployed and monitored from a single unified platform",
        "Real-time inference at millisecond response times — at any scale",
        "Built-in model explainability for regulatory and audit compliance",
        "Self-improving models via continuous learning and retraining pipelines",
      ],
      timeline: "6–12 months",
      wing: "NexTech + NexForce",
    },
  },

  workforce: {
    name: "Workforce",
    projectType: "Digital Workforce Intelligence Platform",
    analysisItems: [
      "Talent gap analysis & skills taxonomy mapping",
      "Workforce analytics requirements modeling",
      "Training & upskilling pathway design",
      "HRIS & LMS integration assessment",
      "Performance KPI & OKR framework",
    ],
    tags: [
      { label: "HR Technology",      type: "industry"   },
      { label: "Skills AI",          type: "tech"       },
      { label: "LMS Integration",    type: "requirement"},
      { label: "HRIS Connectivity",  type: "requirement"},
      { label: "Talent Analytics",   type: "tech"       },
      { label: "Change Management",  type: "challenge"  },
    ],
    designElements: ["Org Structure Mapping", "Skills Taxonomy Design", "Platform Architecture", "Learning Journey Design"],
    twinFeatures: [
      "Workforce digital twin simulation",
      "Skills gap & career path modeling",
      "Team capacity & deployment planner",
      "Performance analytics integration",
    ],
    constructionPhases: [
      "Workforce & Skills Audit",
      "Platform Configuration & Branding",
      "AI Model Training on HR Data",
      "HRIS & LMS System Integration",
      "Rollout, Training & Adoption Program",
    ],
    result: {
      title: "AI-Powered Workforce Platform",
      description:
        "An intelligent talent ecosystem that identifies skill gaps, accelerates upskilling, and optimizes team deployment — transforming your people into your greatest competitive advantage.",
      metrics: [
        { label: "Talent Retention",    value: "41", unit: "%" },
        { label: "Hiring Speed",        value: "3x", unit: ""  },
        { label: "Upskilling Efficiency",value: "55",unit: "%" },
        { label: "HR Cost Reduction",   value: "29", unit: "%" },
      ],
      benefits: [
        "AI identifies employee churn risk 90 days before it happens",
        "Automated skills gap analysis runs continuously across all departments",
        "Personalized learning paths adapt in real time to role and goals",
        "Workforce capacity planning powered by real-time availability data",
      ],
      timeline: "4–8 months",
      wing: "NexForce + NexTech",
    },
  },

  default: {
    name: "Technology",
    projectType: "Integrated Digital Transformation",
    analysisItems: [
      "Requirements architecture mapping",
      "Technology stack evaluation & fit analysis",
      "Integration complexity assessment",
      "Scalability & growth modeling",
      "Risk, compliance & opportunity analysis",
    ],
    tags: [
      { label: "Digital Transformation", type: "industry"   },
      { label: "AI Integration",        type: "tech"        },
      { label: "Cloud Architecture",    type: "tech"        },
      { label: "API-First Design",      type: "requirement" },
      { label: "Real-time Analytics",   type: "requirement" },
      { label: "Change Management",     type: "challenge"   },
    ],
    designElements: ["System Architecture Blueprint", "Data Flow Design", "UI/UX Wireframes", "Integration Map"],
    twinFeatures: [
      "System performance simulation twin",
      "User journey & load modeling",
      "Integration health monitoring",
      "Analytics & reporting layer",
    ],
    constructionPhases: [
      "Discovery & Architecture Design",
      "Core Platform Engineering",
      "Integration & API Development",
      "Quality Assurance & Security Testing",
      "Launch & Continuous Optimization",
    ],
    result: {
      title: "Integrated Digital Solution",
      description:
        "A purpose-built digital platform that transforms your vision into a scalable, AI-powered solution — designed for enterprise deployment and built to evolve.",
      metrics: [
        { label: "Operational Efficiency", value: "48",   unit: "%" },
        { label: "User Adoption Rate",     value: "91",   unit: "%" },
        { label: "System Uptime",          value: "99.8", unit: "%" },
        { label: "Time to ROI",            value: "18",   unit: "months" },
      ],
      benefits: [
        "AI-powered automation reduces manual work by up to 48% from day one",
        "Real-time analytics turn data into decisions — at every level",
        "Built to enterprise security, privacy, and compliance standards",
        "Cloud-native architecture scales infinitely with your growth",
      ],
      timeline: "6–15 months",
      wing: "NexTech + NexDesign",
    },
  },
};

// ─── Keyword detection ─────────────────────────────────────────────────────────
const KEYWORD_MAP: Record<string, string[]> = {
  residential:    ["apartment", "home", "house", "residential", "living", "condo", "flat", "dwelling", "lodge", "villa", "hotel"],
  manufacturing:  ["factory", "manufacturing", "plant", "production", "industrial", "assembly", "mill", "forge", "fabrication", "warehouse"],
  "smart-city":  ["city", "urban", "municipality", "smart city", "infrastructure", "metropolitan", "township", "civic"],
  commercial:     ["office", "commercial", "retail", "mall", "hospitality", "campus", "tower", "co-working", "enterprise building"],
  energy:         ["energy", "solar", "wind", "grid", "power", "utility", "renewable", "electricity", "microgrid", "battery"],
  "ai-platform":  ["ai platform", "software", "saas", "app ", "application", "machine learning", "intelligence platform", "algorithm", "digital product"],
  workforce:      ["workforce", "hr ", "human resources", "employees", "talent", "staffing", "people platform", "organization"],
};

export function analyzeIdea(input: string): SimulationData {
  const lower = input.toLowerCase();
  let matchedKey = "default";
  let maxMatches = 0;

  for (const [key, keywords] of Object.entries(KEYWORD_MAP)) {
    const matches = keywords.filter((kw) => lower.includes(kw)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      matchedKey = key;
    }
  }

  return {
    idea: input,
    industry: INDUSTRIES[matchedKey],
    timestamp: Date.now(),
  };
}

export const IDEA_EXAMPLES = [
  "I want to build a smart apartment complex.",
  "I want an AI-powered manufacturing facility.",
  "I want a digital workforce platform for 5,000 employees.",
  "I want a smart city solution for my municipality.",
];
