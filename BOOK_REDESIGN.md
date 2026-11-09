# Quiet Hours — Interactive Book Experience

A premium, responsive website for **Quiet Hours**, an AI automation studio helping Sydney small businesses handle enquiries, appointment requests and repetitive admin.

## What's new

- A meaningful animated circular AI illustration in place of the unrelated pear
- An interactive four-chapter book with accessible page controls
- Compact editorial sections with dark forest-green styling
- Three service cards, an explanatory automation process, and transparent pricing
- Responsive navigation and mobile book layout
- Reduced-motion support and keyboard focus indicators
- Semantic HTML and Next.js metadata

## Stack

Next.js 15 · React 19 · TypeScript · CSS

This redesign intentionally avoids unnecessary WebGL dependencies. The circular hero, book and page transitions use lightweight CSS so they work on more devices.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production check

```bash
npm run build
npm run start
```

Import this GitHub repository into Vercel after merging the redesign.

## Before launch

1. Replace `your-email@example.com` in `app/page.tsx` with a real address.
2. Confirm indicative prices: **AUD $300–$800** setup and **AUD $50–$150/month** optional support.
3. Connect any real booking, messaging, CRM or automation integrations separately. This website is a marketing presentation, not a live AI assistant.
4. Verify the website on desktop and mobile and run a production build.
5. The existing repository had Next.js files at the root. The redesign uses the correct `app/` directory. The old root files can be removed after the new branch is approved.

## Project structure

```text
app/
  globals.css  # Visual theme, layout, responsive rules and animation
  layout.tsx   # Metadata and document shell
  page.tsx     # Sections, content and interactive book
package.json
README.md
```

## Editorial approach

The visual centerpiece communicates the brand's promise—always-on assistance—while the book tells the service story one chapter at a time. Text explains what is illustrative and avoids implying that integrations already exist.
