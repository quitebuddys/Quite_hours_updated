# Quiet Hours — cinematic 3D website

A Next.js + TypeScript website for Quiet Hours, based on the supplied business copy and cinematic pear reference. The pear is generated as real WebGL geometry at runtime, with procedural speckles, stem, lighting, rotation and pointer parallax. Orchard geometry is also procedural.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build for deployment

```bash
npm run build
npm run start
```

Deploy on Vercel by importing this folder as a Next.js project.

## Before publishing

- Replace `your-email@example.com` in `app/page.tsx` with a real contact email.
- Confirm that the listed services and indicative AUD prices are accurate.
- The chat messages are illustrative demonstrations, not a connected AI service. Real chatbot, calendar, CRM, email or payment integrations need separate setup.
- Procedural fruit is stylized 3D, not a photogrammetry-grade asset. For fully photorealistic results, replace it with a licensed high-quality textured GLB pear model and suitable orchard models.
- Run browser and device testing and performance profiling before production launch.

## Technology

Next.js, React, TypeScript, Tailwind CSS, Three.js, React Three Fiber, Drei, GSAP ScrollTrigger, Lenis and Framer Motion.
