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
    "NexGiga bridges the digital and physical worlds — from BIM and digital twins to robotics, AI, simulation and smart infrastructure. Transforming ideas into measurable real-world outcomes.",
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
  ],
  authors: [{ name: "NexGiga", url: "https://nexgiga.com" }],
  creator: "NexGiga",
  publisher: "NexGiga",
  metadataBase: new URL("https://nexgiga.com"),
  alternates: {
    canonical: "https://nexgiga.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexgiga.com",
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
};

export const viewport: Viewport = {
  themeColor: "#010508",
  width: "device-width",
  initialScale: 1,
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "NexGiga",
              url: "https://nexgiga.com",
              logo: "https://nexgiga.com/nexgiga-logo.png",
              description:
                "NexGiga bridges the digital and physical worlds through BIM, digital twins, AI, robotics, and smart infrastructure solutions.",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-925-789-8909",
                contactType: "customer service",
                availableLanguage: ["English", "Hindi"],
              },
              sameAs: [
                "https://linkedin.com/company/nexgiga",
                "https://twitter.com/nexgiga",
              ],
              serviceArea: {
                "@type": "Place",
                name: "Global",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "NexGiga Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "BIM & Digital Twin Solutions",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "AI & Robotics Integration",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Smart Infrastructure",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Industrial Automation",
                    },
                  },
                ],
              },
            }),
          }}
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
