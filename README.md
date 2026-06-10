# NexGiga — World-Class Website

> **Transforming Digital Intelligence Into Physical Reality**

A production-ready, immersive Next.js 15 website for NexGiga — built with Three.js, Framer Motion, and a futuristic glassmorphism design system.

---

## ✦ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| 3D Engine | Three.js + React Three Fiber + Drei |
| Animation | Framer Motion |
| Icons | Lucide React |

---

## ✦ Features

- **Interactive 3D AI Core** — Real-time Three.js scene with particle systems, orbital rings, and data streams
- **Neural Network Visualization** — Live animated node-connection graph
- **Digital Twin City** — Procedural 3D city with scanning effects
- **Cinematic Scroll Animations** — Framer Motion scroll-linked transitions
- **Typewriter Hero** — Cycling taglines with typewriter effect
- **Glassmorphism Design System** — Consistent glass, glow, and border utilities
- **Custom Cursor** — Magnetic spotlight cursor for desktop
- **Animated Counters** — Intersection-observer triggered count-up
- **Interactive Services Panel** — Tabbed service explorer
- **Slider Case Studies** — Animated success story carousel
- **Futuristic Contact Form** — Polished form with state management
- **Full SEO** — Metadata, OG, Twitter cards, JSON-LD, sitemap, robots.txt
- **Mobile Responsive** — Every section optimized for all screen sizes
- **Accessibility** — ARIA labels, keyboard navigation, focus styles

---

## ✦ Project Structure

```
nexgiga/
├── app/
│   ├── globals.css          # Design system CSS variables & utilities
│   ├── layout.tsx           # Root layout with SEO metadata
│   ├── page.tsx             # Homepage composition
│   ├── sitemap.ts           # Dynamic sitemap
│   └── not-found.tsx        # 404 page
├── components/
│   ├── 3d/
│   │   ├── AICore.tsx            # Hero 3D AI visualization
│   │   ├── NeuralNetwork.tsx     # Neural network graph
│   │   └── DigitalTwinCity.tsx   # Procedural city twin
│   ├── layout/
│   │   ├── Navbar.tsx            # Sticky navbar with scroll effects
│   │   ├── Footer.tsx            # Premium footer
│   │   └── SmoothScrollProvider.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx           # Full-screen hero
│   │   ├── TransformationJourney.tsx # Idea→Reality timeline
│   │   ├── DigitalTwinEcosystem.tsx  # Digital twin showcase
│   │   ├── ServicesSection.tsx       # Interactive services
│   │   ├── IndustrySolutions.tsx     # Industry grid
│   │   ├── BuildmateShowcase.tsx     # Buildmate product
│   │   ├── FutureTechnologies.tsx    # Tech stack section
│   │   ├── ImpactMetrics.tsx         # Animated metrics
│   │   ├── SuccessStories.tsx        # Case study carousel
│   │   ├── TimelineSection.tsx       # Company timeline
│   │   └── ContactSection.tsx        # Contact form
│   └── ui/
│       ├── CustomCursor.tsx       # Magnetic cursor
│       ├── SectionLabel.tsx       # Consistent section headers
│       ├── GlowCard.tsx           # Interactive glow cards
│       └── AnimatedCounter.tsx    # Count-up on scroll
├── hooks/
│   └── useScrollProgress.ts   # Scroll utilities
├── lib/
│   └── utils.ts               # cn() and helpers
└── public/
    ├── robots.txt
    └── site.webmanifest
```

---

## ✦ Getting Started

### Prerequisites
- Node.js 18.17+
- npm / yarn / pnpm

### Installation

```bash
# Clone / extract the project
cd nexgiga

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## ✦ Customization

### Colors & Design Tokens
Edit `app/globals.css` — all CSS variables are at the top:
```css
:root {
  --cyan: #00f5ff;
  --blue: #0066ff;
  --purple: #7b2fff;
  /* ... */
}
```

### Fonts
Currently uses **Rajdhani** (display) + **Exo 2** (body) + **JetBrains Mono** (mono) from Google Fonts. Change in `globals.css` and `tailwind.config.ts`.

### Content
All content is co-located with its section component in `components/sections/`. Edit the data arrays at the top of each file.

### Contact Form
The form in `ContactSection.tsx` currently simulates submission. Connect to your backend/email service by replacing the `handleSubmit` function.

### Buildmate Links
All Buildmate CTAs point to `https://buildmate.in/` and open in a new tab as specified.

### Footer Credit
Footer credits Sharva's IT with link to `https://sharvasit.in` as specified.

---

## ✦ SEO

- Title template: `Page | NexGiga`
- Open Graph image: add `/public/og-image.png` (1200×630px)
- JSON-LD Organization schema in `layout.tsx`
- Sitemap auto-generated at `/sitemap.xml`
- Robots.txt at `/robots.txt`

---

## ✦ Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## ✦ Performance Notes

- 3D components are lazy-loaded (`dynamic import` via `React.lazy`)
- Three.js canvases have `alpha: true` for transparent backgrounds
- Images use Next.js `<Image>` with AVIF/WebP formats
- All animations use `viewport={{ once: true }}` for efficiency
- CSS animations preferred over JS where possible

---

*Crafted with care by [Sharva's IT](https://sharvasit.in)*
