'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  defaultContent,
  SiteContent,
  NavLink,
  ServiceItem,
  ProcessStep,
  PricingPlan,
} from '../lib/defaultContent';

export default function ClientLandingPage({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initialContent || defaultContent);
  const [chapter, setChapter] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Sync latest updates from API when mounted or refocused
  useEffect(() => {
    async function refreshContent() {
      try {
        const res = await fetch('/api/content', { cache: 'no-store' });
        if (res.ok) {
          const data: SiteContent = await res.json();
          setContent(data);
        }
      } catch (err) {
        console.error('Failed to sync content:', err);
      }
    }
    refreshContent();
  }, []);

  const chapters = content.experience.chapters || defaultContent.experience.chapters;
  const currentChapterIndex = chapter % chapters.length;
  const current = chapters[currentChapterIndex] || chapters[0];

  const turnPage = (direction: number) => {
    setChapter((prev: number) => (prev + direction + chapters.length) % chapters.length);
  };

  return (
    <main id="top">
      {/* Top Navigation */}
      <header className="site-nav">
        <a className="brand" href="#top" aria-label="Quiet Hours home">
          {content.brand.name}
          <span>{content.brand.suffix}</span>
        </a>
        <button
          className="mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
          {content.navLinks.map((link: NavLink, idx: number) => (
            <a key={idx} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <Link
            href="/admin"
            onClick={() => setMenuOpen(false)}
            className="text-[#79f8bc] opacity-80 hover:opacity-100 font-bold"
          >
            Admin CMS
          </Link>
        </nav>
        <a className="nav-cta" href={content.brand.navCtaLink}>
          {content.brand.navCtaText}
        </a>
      </header>

      {/* Hero Section */}
      <section className="hero section-shell" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" /> {content.hero.eyebrow}
          </div>
          <h1 id="hero-heading">
            {content.hero.headlinePart1} <em>{content.hero.headlineEm}</em>
            <br />
            {content.hero.headlinePart2}
          </h1>
          <p>{content.hero.description}</p>
          <div className="actions">
            <a className="button button-primary" href={content.hero.primaryCtaLink}>
              {content.hero.primaryCtaText}
            </a>
            <a className="text-action" href={content.hero.secondaryCtaLink}>
              {content.hero.secondaryCtaText}
            </a>
          </div>
        </div>

        <div className="hero-art" aria-label="Decorative animated circular AI service illustration">
          <div className="orbit orbit-outer" />
          <div className="orbit orbit-middle" />
          <div className="orbit orbit-inner" />
          <div className="orbit-core">
            <span className="core-spark">✳</span>
            <strong style={{ whiteSpace: 'pre-line' }}>{content.hero.orbitCoreTitle}</strong>
            <small>{content.hero.orbitCoreSubtitle}</small>
          </div>
          <div className="orbit-chip chip-one">{content.hero.chipOne}</div>
          <div className="orbit-chip chip-two">{content.hero.chipTwo}</div>
          <div className="orbit-satellite satellite-one" />
          <div className="orbit-satellite satellite-two" />
        </div>
      </section>

      {/* The Field Guide (Interactive 3D Book) */}
      <section className="book-section section-shell" id="experience">
        <div className="section-label">{content.experience.sectionLabel}</div>
        <div className="book-heading">
          <h2>
            {content.experience.headingPart1} <em>{content.experience.headingEm}</em>
          </h2>
          <p>{content.experience.description}</p>
        </div>

        <div className="book-stage">
          <div className="book-shadow" />
          <div className="book" aria-live="polite">
            <div className="book-spine" />
            <div className="book-page page-left">
              <span className="book-top">QUIET HOURS / THE FIELD GUIDE</span>
              <div className="book-emblem">
                <span>✳</span>
                <div className="emblem-ring" />
              </div>
              <span className="book-bottom">SYDNEY · AUSTRALIA</span>
            </div>
            <div className="book-page page-right" key={currentChapterIndex}>
              <span className="book-top">{current?.eyebrow}</span>
              <div className="chapter-body">
                <span className="chapter-label">{current?.label}</span>
                <h3>{current?.title}</h3>
                <p>{current?.body}</p>
              </div>
              <span className="book-bottom">
                QUIET HOURS &nbsp; / &nbsp; {String(currentChapterIndex + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        <div className="book-controls">
          <button onClick={() => turnPage(-1)} aria-label="Previous book page">
            ←
          </button>
          <span>
            {String(currentChapterIndex + 1).padStart(2, '0')} — {String(chapters.length).padStart(2, '0')}
          </span>
          <button onClick={() => turnPage(1)} aria-label="Next book page">
            →
          </button>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="ticker" aria-hidden="true">
        <div>{content.ticker.text}</div>
      </div>

      {/* Intro / The Idea */}
      <section className="intro section-shell" id="about">
        <div className="section-label">{content.intro.sectionLabel}</div>
        <div className="intro-grid">
          <h2>
            {content.intro.headingPart1}
            <br />
            <em>{content.intro.headingEm}</em>
          </h2>
          <p>{content.intro.description}</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services section-shell" id="services">
        <div className="section-label">{content.services.sectionLabel}</div>
        <h2>
          {content.services.headingPart1}
          <br />
          <em>{content.services.headingEm}</em>
        </h2>
        <div className="service-grid">
          {content.services.items.map((service: ServiceItem, index: number) => (
            <article className="service-card" key={index}>
              <div className="service-meta">
                <span>
                  {service.number} / {String(content.services.items.length).padStart(2, '0')}
                </span>
                <span>{service.symbol}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Process / Behind the Scenes */}
      <section className="process section-shell">
        <div className="section-label">{content.process.sectionLabel}</div>
        <h2>
          {content.process.headingPart1} <em>{content.process.headingEm}</em>
        </h2>
        <div className="process-grid">
          <div className="process-orbit">
            <div className="process-center">
              QUIET
              <br />
              HOURS <span>✳</span>
            </div>
          </div>
          <ol>
            {content.process.steps.map((step: ProcessStep, idx: number) => (
              <li key={idx}>
                <span>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing section-shell" id="pricing">
        <div className="section-label">{content.pricing.sectionLabel}</div>
        <h2>
          {content.pricing.headingPart1}
          <br />
          <em>{content.pricing.headingEm}</em>
        </h2>
        <p className="pricing-intro">{content.pricing.intro}</p>
        <div className="pricing-grid">
          {content.pricing.plans.map((plan: PricingPlan, index: number) => (
            <article className={`price-card ${plan.featured ? 'featured' : ''}`} key={index}>
              <span className="price-tag">{plan.tag}</span>
              <div className="price-amount">
                {plan.amount} {plan.period && <small>{plan.period}</small>}
              </div>
              <p>{plan.description}</p>
              <ul>
                {plan.features.map((feature: string, fIdx: number) => (
                  <li key={fIdx}>{feature}</li>
                ))}
              </ul>
              <a className={`button ${plan.featured ? 'button-primary' : 'button-outline'}`} href={plan.ctaLink}>
                {plan.ctaText}
              </a>
            </article>
          ))}
        </div>
        <p className="pricing-note">{content.pricing.note}</p>
      </section>

      {/* Contact Section */}
      <section className="contact section-shell" id="contact">
        <div className="section-label">{content.contact.sectionLabel}</div>
        <h2>
          {content.contact.headingPart1}
          <br />
          <em>{content.contact.headingEm}</em>
        </h2>
        <p>{content.contact.description}</p>
        <a
          className="button button-primary"
          href={`mailto:${content.contact.email}?subject=Quiet%20Hours%20Demo%20Request`}
        >
          {content.contact.ctaText}
        </a>
      </section>

      {/* Footer */}
      <footer>
        <a className="brand" href="#top">
          {content.brand.name}
          <span>{content.brand.suffix}</span>
        </a>
        <span>{content.footer.copyright}</span>
        <div className="flex items-center gap-4">
          <span>{content.footer.tagline}</span>
          <Link
            href="/admin"
            className="text-[11px] text-[#79f8bc] hover:underline flex items-center gap-1 border border-[#79f8bc]/30 px-2.5 py-1 rounded bg-[#79f8bc]/10"
          >
            ⚙ Admin Dashboard
          </Link>
        </div>
      </footer>
    </main>
  );
}
