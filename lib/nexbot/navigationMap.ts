import type { NavEntry } from './types';

// ─── Navigation Map ───────────────────────────────────────────────────────────
// Maps keywords → page routes and section IDs

export const NAVIGATION_MAP: Record<string, NavEntry> = {
  // ── Wings ──────────────────────────────────────────────────────────────────
  nexforce: { path: '/nexforce', label: 'NexForce — Human Intelligence' },
  nextech: { path: '/nextech', label: 'NexTech — Phygital Bridge' },
  nexdesign: { path: '/nexdesign', label: 'NexDesign — Design Intelligence' },
  nexbuild: { path: '/nexbuild', label: 'NexBuild — Smart Communities' },
  buildmate: { path: 'https://buildmate.sharvas.in', label: 'BuildMate Platform', external: true },

  // ── Main Page Sections ─────────────────────────────────────────────────────
  home: { path: '/', label: 'Home' },
  hero: { path: '/', section: '#hero', label: 'NexGiga Home' },
  wings: { path: '/', section: '#wings', label: 'Business Wings' },
  services: { path: '/', section: '#services', label: 'Services' },
  solutions: { path: '/', section: '#solutions', label: 'Industry Solutions' },
  buildmateshowcase: { path: '/', section: '#buildmate', label: 'BuildMate Showcase' },
  future: { path: '/', section: '#future', label: 'Future Technologies' },
  impact: { path: '/', section: '#impact', label: 'Impact Metrics' },
  stories: { path: '/', section: '#stories', label: 'Success Stories' },
  timeline: { path: '/', section: '#timeline', label: 'Our Journey' },
  contact: { path: '/', section: '#contact', label: 'Contact Us' },
  journey: { path: '/', section: '#journey', label: 'Transformation Journey' },
  'digital-twin': { path: '/', section: '#digital-twin', label: 'Digital Twin Ecosystem' },
  'idea-to-reality': { path: '/', section: '#idea-to-reality', label: 'Idea-to-Reality Simulator' },
  simulator: { path: '/', section: '#idea-to-reality', label: 'Idea-to-Reality Simulator' },

  // ── Service Keywords → Sections ────────────────────────────────────────────
  bim: { path: '/', section: '#services', label: 'BIM Services' },
  ai: { path: '/nextech', label: 'AI & Machine Learning' },
  ml: { path: '/nextech', label: 'Machine Learning' },
  robotics: { path: '/nextech', label: 'Robotics & Automation' },
  iot: { path: '/nextech', label: 'IoT & Edge Computing' },
  simulation: { path: '/nextech', label: 'Simulation & Analysis' },
  staffing: { path: '/nexforce', label: 'Workforce Solutions' },
  recruitment: { path: '/nexforce', label: 'Recruitment Services' },
  branding: { path: '/nexdesign', label: 'Brand Identity' },
  design: { path: '/nexdesign', label: 'Design Services' },
  visualization: { path: '/nexdesign', label: 'Architectural Visualization' },
  construction: { path: '/nexbuild', label: 'Smart Construction' },
  'smart-city': { path: '/', section: '#solutions', label: 'Smart City Solutions' },
  infrastructure: { path: '/', section: '#services', label: 'Smart Infrastructure' },
};

// ─── Tour Definition ──────────────────────────────────────────────────────────

export const GUIDED_TOUR_STOPS = [
  {
    path: '/',
    section: '#wings',
    message: "Welcome to NexGiga! Let me start with our four specialized wings — **NexForce**, **NexTech**, **NexDesign**, and **NexBuild**. Each represents a core dimension of digital transformation.",
    duration: 5000,
  },
  {
    path: '/',
    section: '#digital-twin',
    message: "This is NexGiga's **Digital Twin Ecosystem** — where physical and digital worlds converge. Our live Digital Twin City models real-time data, smart infrastructure, and AI intelligence in one interactive environment.",
    duration: 5000,
  },
  {
    path: '/',
    section: '#idea-to-reality',
    message: "This is the **Idea-to-Reality Simulator** — one of our most powerful demos! Type any project idea and watch our AI simulate the complete transformation journey across 6 stages, from concept to a finished, operational project. Try it!",
    duration: 6000,
  },
  {
    path: '/',
    section: '#services',
    message: "Here are our **core services** — from BIM & Digital Twin to AI & Machine Learning, Smart Infrastructure, and Robotics. Each service is engineered for enterprise-scale impact.",
    duration: 5000,
  },
  {
    path: '/',
    section: '#solutions',
    message: "NexGiga serves multiple industries — **construction, manufacturing, healthcare, energy, and smart cities**. Our solutions are tailored to each sector's unique challenges and regulatory requirements.",
    duration: 5000,
  },
  {
    path: '/',
    section: '#buildmate',
    message: "**BuildMate** is our flagship construction technology platform — where BIM, project management, and real-time collaboration come together for the built environment. Used across 15+ countries.",
    duration: 4500,
  },
  {
    path: '/',
    section: '#impact',
    message: "In numbers: **200+ projects** delivered, **15+ countries** served, and **50+ AI models** deployed. These aren't just metrics — they represent real-world transformations our clients depend on every day.",
    duration: 4500,
  },
  {
    path: '/',
    section: '#contact',
    message: "Ready to start your transformation journey? Our team is ready. Reach us at **+1-925-789-8909** or fill out the form — we typically respond within **2–4 business hours**.",
    duration: 4000,
  },
];

// ─── Quick Action Buttons ──────────────────────────────────────────────────────

export const QUICK_ACTIONS = [
  { label: '🗺️ Give me a tour',     message: 'Give me a guided tour of NexGiga' },
  { label: '🏗️ BIM & Digital Twin', message: 'Tell me about BIM and Digital Twin services' },
  { label: '🤖 AI Solutions',       message: 'What AI and Machine Learning solutions does NexTech offer?' },
  { label: '✦ Try the Simulator',   message: 'Show me the Idea-to-Reality Simulator' },
  { label: '💼 Get a Quote',        message: 'I would like to get a quotation for your services' },
  { label: '🌐 BuildMate',          message: 'Show me the BuildMate platform' },
  { label: '👥 Hire Talent',        message: 'I need specialized tech talent for my project' },
];
