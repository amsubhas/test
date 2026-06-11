import type { Metadata, Viewport } from "next";
import { Rajdhani, Exo_2, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import NexBotLoader from "@/components/NexBotLoader";

/* ── Google Fonts via next/font (downloaded at build-time, no render-blocking) ── */
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-exo2",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NexGiga | Transforming Digital Intelligence Into Physical Reality",
    template: "%s | NexGiga",
  },
  description:
    "NexGiga bridges the digital and physical worlds — from BIM and digital twins to robotics, AI, simulation and smart infrastructure. Four specialized wings: NexForce, NexTech, NexDesign, NexBuild.",
  keywords: [
    "NexGiga",
    "Digital Twin",
    "BIM",
    "Building Information Modeling",
    "Robotics",
    "AI Solutions",
    "Smart Infrastructure",
    "Industry 4.0",
    "Simulation",
    "Digital Transformation",
    "Buildmate",
    "Construction Technology",
    "IoT",
    "Automation",
    "NexForce",
    "NexTech",
    "NexDesign",
    "NexBuild",
    "Workforce Solutions",
    "Smart Cities",
    "Phygital",
  ],
  authors: [{ name: "NexGiga", url: "https://nexgiga.sharvasit.in" }],
  creator: "NexGiga",
  publisher: "NexGiga",
  metadataBase: new URL("https://nexgiga.sharvasit.in"),
  alternates: {
    canonical: "https://nexgiga.sharvasit.in",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexgiga.sharvasit.in",
    title: "NexGiga | Transforming Digital Intelligence Into Physical Reality",
    description:
      "From BIM and digital twins to robotics, AI-driven simulations, and smart infrastructure — NexGiga turns imagination into measurable real-world outcomes.",
    siteName: "NexGiga",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NexGiga — Transforming Digital Intelligence Into Physical Reality",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexGiga | Transforming Digital Intelligence Into Physical Reality",
    description:
      "From BIM and digital twins to robotics, AI-driven simulations, and smart infrastructure — NexGiga turns imagination into real-world outcomes.",
    images: ["/twitter-image.png"],
    creator: "@nexgiga",
    site: "@nexgiga",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#010508",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ─── JSON-LD Structured Data ───────────────────────────────────────────────────

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://nexgiga.sharvasit.in/#organization",
  name: "NexGiga",
  url: "https://nexgiga.sharvasit.in",
  logo: {
    "@type": "ImageObject",
    url: "https://nexgiga.sharvasit.in/nexgiga-logo.png",
    width: 512,
    height: 512,
  },
  description:
    "NexGiga bridges the digital and physical worlds through BIM, digital twins, AI, robotics, and smart infrastructure solutions.",
  foundingDate: "2020",
  numberOfEmployees: { "@type": "QuantitativeValue", minValue: 50, maxValue: 500 },
  areaServed: { "@type": "Place", name: "Global" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-925-789-8909",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi"],
    contactOption: "TollFree",
  },
  sameAs: [
    "https://linkedin.com/company/nexgiga",
    "https://twitter.com/nexgiga",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "NexGiga Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "BIM & Digital Twin Solutions",
          description: "LOD 100-500 BIM models, 4D/5D BIM, clash detection, digital twin implementation.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI & Machine Learning",
          description: "Predictive analytics, computer vision, NLP, generative AI, MLOps.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Robotics & Automation",
          description: "Industrial robot integration, collaborative robotics, RPA.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "IoT & Smart Infrastructure",
          description: "IIoT sensor networks, SCADA integration, smart building systems.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Design & Visualization",
          description: "Brand identity, UI/UX, architectural visualization, AR/VR experiences.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Workforce Solutions",
          description: "Technology staffing, BIM specialists, AI engineers, global talent acquisition.",
        },
      },
    ],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://nexgiga.sharvasit.in/#website",
  url: "https://nexgiga.sharvasit.in",
  name: "NexGiga",
  description: "Transforming Digital Intelligence Into Physical Reality",
  publisher: { "@id": "https://nexgiga.sharvasit.in/#organization" },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://nexgiga.sharvasit.in/?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NexBot",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "NexBot is NexGiga's AI guide and digital assistant — providing instant answers about services, guided tours, and project consultations.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@id": "https://nexgiga.sharvasit.in/#organization" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does NexGiga do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NexGiga bridges the digital and physical worlds through four specialized wings: NexForce (workforce solutions), NexTech (AI, robotics, IoT), NexDesign (creative design & visualization), and NexBuild (smart construction & BIM).",
      },
    },
    {
      "@type": "Question",
      name: "What is BuildMate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "BuildMate is NexGiga's integrated construction management platform featuring BIM model management, real-time project dashboards, cost tracking, and mobile-first field operations. Available at buildmate.sharvas.in.",
      },
    },
    {
      "@type": "Question",
      name: "What industries does NexGiga serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NexGiga serves construction & real estate, manufacturing, healthcare, energy & utilities, smart cities, and logistics sectors across 15+ countries.",
      },
    },
    {
      "@type": "Question",
      name: "How can I contact NexGiga?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can reach NexGiga via phone/WhatsApp at +1-925-789-8909, or through the contact form on the website at nexgiga.sharvasit.in.",
      },
    },
    {
      "@type": "Question",
      name: "What is NexTech?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NexTech is NexGiga's advanced technology wing specializing in AI & machine learning, robotics & automation, IoT & edge computing, and physics-based simulation for Industry 4.0 transformation.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Idea-to-Reality Simulator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Idea-to-Reality Simulator is an interactive AI feature on the NexGiga website where users can input any project concept and watch it transform through AI analysis, system design, digital twin construction, and final deployment simulation.",
      },
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "NexGiga Services",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "NexForce — Workforce Solutions",
        url: "https://nexgiga.sharvasit.in/nexforce",
        description: "Elite technology staffing, BIM specialists, AI engineers, and global talent acquisition.",
        provider: { "@id": "https://nexgiga.sharvasit.in/#organization" },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "NexTech — AI & Technology",
        url: "https://nexgiga.sharvasit.in/nextech",
        description: "AI development, robotics integration, IoT solutions, and digital twin implementation.",
        provider: { "@id": "https://nexgiga.sharvasit.in/#organization" },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "NexDesign — Creative Design",
        url: "https://nexgiga.sharvasit.in/nexdesign",
        description: "Brand identity, UI/UX design, architectural visualization, AR/VR experiences.",
        provider: { "@id": "https://nexgiga.sharvasit.in/#organization" },
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Service",
        name: "NexBuild — Smart Construction",
        url: "https://nexgiga.sharvasit.in/nexbuild",
        description: "BIM services, smart construction management, and the BuildMate platform.",
        provider: { "@id": "https://nexgiga.sharvasit.in/#organization" },
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${rajdhani.variable} ${exo2.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      </head>
      <body className="noise-overlay animated-gradient">
        <SmoothScrollProvider>
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <NexBotLoader />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
