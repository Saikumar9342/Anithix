export const SITE_CONFIG = {
  name: "ANITHIX",
  tagline: "Building Intelligent Products For The Future.",
  description:
    "Anithix creates AI-powered software products, automation platforms, developer tools, and digital experiences that empower individuals and businesses.",
  url: "https://anithix.com",
  email: "hello@anithix.com",
  github: "https://github.com/anithix",
  linkedin: "https://linkedin.com/company/anithix",
};

export const PRODUCTS = [
  {
    id: "graviton",
    name: "Graviton",
    category: "AI Workspace Platform",
    tagline: "Your personal AI universe.",
    description:
      "A powerful personal AI workspace supporting local and cloud AI models with advanced customization and productivity tools.",
    color: "#7C3AED",
    accentColor: "#A855F7",
    gradient: "from-purple-900 via-purple-800 to-indigo-900",
    features: [
      "Multi-provider AI",
      "Ollama integration",
      "Local AI models",
      "Cloud AI providers",
      "AI Chat",
      "Research Mode",
      "Developer Mode",
      "Vision Models",
      "Image Generation",
      "AI Workspace",
      "Dashboard System",
      "Chat History",
      "Project Organization",
      "Custom Themes",
      "News Dashboard",
      "Weather Dashboard",
    ],
    status: "launching",
  },
  {
    id: "atom",
    name: "Atom",
    category: "Portfolio Platform",
    tagline: "Your portfolio, from your pocket.",
    description:
      "A mobile-first portfolio builder that allows users to create and manage professional portfolio websites entirely from their smartphones.",
    color: "#06B6D4",
    accentColor: "#0EA5E9",
    gradient: "from-cyan-900 via-sky-800 to-blue-900",
    features: [
      "Mobile portfolio management",
      "Resume to portfolio generation",
      "AI content enhancement",
      "Portfolio analytics",
      "Messaging system",
      "Live website updates",
      "Multi-language support",
      "Domain integration",
      "Smart design generation",
      "Theme customization",
    ],
    status: "launching",
  },
  {
    id: "orbis",
    name: "Orbis",
    category: "AI Content Automation",
    tagline: "Automate your content universe.",
    description:
      "An AI-powered social media automation platform that discovers trends, creates content, generates images, and manages publishing workflows automatically.",
    color: "#10B981",
    accentColor: "#34D399",
    gradient: "from-emerald-900 via-green-800 to-teal-900",
    features: [
      "Trend discovery",
      "AI content generation",
      "Caption generation",
      "AI image creation",
      "Music integration",
      "Publishing workflows",
      "Analytics",
      "Brand voice management",
      "Content planning",
      "Automation pipelines",
    ],
    status: "development",
  },
];

export const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Timeline", href: "/timeline" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const TECH_STACK = {
  frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  backend: ["FastAPI", "Node.js", "Express", "Python"],
  databases: ["PostgreSQL", "MongoDB"],
  ai: ["Ollama", "OpenRouter", "Groq", "Together AI", "OpenAI APIs"],
  infrastructure: ["Docker", "Linux", "Apache", "Nginx"],
};

export const TIMELINE = [
  { year: "2024", title: "Foundation", description: "Anithix is founded with a vision to build intelligent software products." },
  { year: "2025", title: "Product Development", description: "Core products enter active development. Building the ecosystem." },
  { year: "2026", title: "Graviton Launch", description: "Graviton AI Workspace Platform launches publicly." },
  { year: "2026", title: "Atom Platform", description: "Atom mobile portfolio builder goes live." },
  { year: "2026", title: "Orbis Automation", description: "Orbis AI content automation platform releases." },
  { year: "2027", title: "Ecosystem Expansion", description: "Full Anithix ecosystem connected. New products enter development." },
  { year: "2028+", title: "Future Innovations", description: "AI agents, robotics, and next-generation automation systems." },
];
