# Minimal Landing Page Template

A premium, production-ready Next.js 16+ landing page template with a clean, minimal design. Features WebGL shader effects, smooth animations, dark mode, and full accessibility.

## ✨ Highlights

- 🎨 **Minimal Design** - Clean, focused UI with bold typography
- ✨ **WebGL Dither Cursor** - Unique shader-based cursor effect
- 🌙 **Dark Mode** - Seamless light/dark theme switching
- ⚡ **Blazing Fast** - Optimized for Core Web Vitals
- 📱 **Fully Responsive** - Looks great on all devices
- ♿ **Accessible** - WCAG 2.1 AA compliant
- 🔧 **Easy to Customize** - Centralized configuration file

## Features

- ✅ **Next.js 16+** with App Router
- ✅ **TypeScript** (strict mode)
- ✅ **Tailwind CSS v4** with design tokens
- ✅ **Smooth Scrolling** via Lenis
- ✅ **WebGL Effects** via React Three Fiber
- ✅ **Motion** via motion/react with reduced-motion support
- ✅ **SEO Ready** - metadata, Open Graph, Twitter cards
- ✅ **Accessibility** - skip links, focus rings, ARIA labels
- ✅ **Edge Compatible** - deploy anywhere

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Customize your site

Edit `lib/config.ts` to update all text, links, and settings in one place.

## 📁 Project Structure

```
├── app/
│   ├── globals.css        # Design tokens & theme colors
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   └── ...
├── components/
│   ├── hero.tsx           # Hero with dither cursor & rotating cards
│   ├── features.tsx       # Feature grid with icons
│   ├── stats.tsx          # Animated statistics counters
│   ├── testimonials.tsx   # Horizontal scrolling testimonials
│   ├── how-it-works.tsx   # Steps with animated cards
│   ├── pricing.tsx        # 2-tier pricing comparison
│   ├── faq.tsx            # Accordion FAQ section
│   ├── final-cta.tsx      # Full-width CTA with dither effect
│   ├── footer.tsx         # Footer with links & contact
│   ├── dither-cursor.tsx  # WebGL shader cursor effect
│   └── ...
├── lib/
│   ├── config.ts          # ⭐ EDIT THIS - All site config
│   ├── metadata.ts        # SEO utilities
│   ├── motion.tsx         # Motion components
│   └── utils.ts           # Utility functions
└── public/
    └── site.webmanifest   # PWA manifest
```

## 🎨 Customization Guide

### Step 1: Update Site Configuration

Edit `lib/config.ts` - this is your **single source of truth** for all text content:

```ts
export const siteConfig = {
  name: "Your Brand",
  tagline: "Your Tagline",
  description: "Your description",
  // ...
}

export const heroConfig = {
  headline: {
    prefix: "Your",
    accent: "Headline",
    suffix: "Here",
  },
  // ...
}
```

### Step 2: Update Theme Colors

Edit `app/globals.css` to change your brand colors:

```css
:root {
  --accent: #ffd900; /* Your primary brand color */
  --background: #fafafa; /* Light mode background */
  --foreground: #0a0a0a; /* Light mode text */
}

.dark {
  --background: #0a0a0a; /* Dark mode background */
  --foreground: #fafafa; /* Dark mode text */
}
```

### Step 3: Replace Assets

| File                 | Purpose          | Dimensions |
| -------------------- | ---------------- | ---------- |
| `app/icon.svg`       | Favicon          | 32×32      |
| `app/apple-icon.svg` | Apple touch icon | 180×180    |

### Step 4: Toggle Features

In `lib/config.ts`, enable/disable features:

```ts
export const features = {
  smoothScroll: true, // Lenis smooth scrolling
  darkMode: true, // Dark mode toggle
  ditherCursor: true, // WebGL cursor effect
  statsSection: true, // Stats/metrics section
}
```

## 🎯 Section Components

Each section is a standalone component you can customize or remove:

| Component      | Description                                              |
| -------------- | -------------------------------------------------------- |
| `Hero`         | Full-height hero with animated headline & rotating cards |
| `HowItWorks`   | Three-step process with animated cards                   |
| `Features`     | Feature grid with Lucide icons                           |
| `Stats`        | Animated counter statistics                              |
| `Testimonials` | Horizontal carousel with fade edge                       |
| `Pricing`      | Two-tier comparison layout                               |
| `FAQ`          | Accordion with smooth expand/collapse                    |
| `FinalCTA`     | Full-width CTA with dither cursor effect                 |
| `Footer`       | Links, contact info, social icons                        |

## ✨ Special Features

### WebGL Dither Cursor

The template includes a unique WebGL shader-based cursor effect that creates a dithered trail following mouse movement. It's:

- GPU-accelerated for smooth 60fps performance
- Automatically disabled on mobile devices
- Configurable colors, size, and intensity

### Animated Statistics

The Stats section features numbers that animate from 0 to their target value when scrolled into view, using spring physics for natural motion.

### Smooth Scrolling

Powered by Lenis for buttery-smooth scroll behavior with momentum and easing.

## ♿ Accessibility Features

- Skip-to-content link
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus visible rings
- Reduced motion support
- Screen reader announcements

## 🚀 Deployment

The template is Edge-compatible and works with:

- **Vercel** (recommended)
- **Netlify**
- **Cloudflare Pages**
- Any static hosting

```bash
npm run build
```

## 📜 Scripts

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Start development server |
| `npm run build`     | Build for production     |
| `npm run start`     | Start production server  |
| `npm run lint`      | Run ESLint               |
| `npm run lint:fix`  | Fix ESLint errors        |
| `npm run format`    | Format with Prettier     |
| `npm run typecheck` | Run TypeScript checks    |

## 📄 License

This template is licensed for use in commercial projects. You may not resell or redistribute the template itself.

---

Built with ❤️ using Next.js, Tailwind CSS, React Three Fiber, and Motion
