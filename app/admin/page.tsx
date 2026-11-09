'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Save,
  RotateCcw,
  Eye,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Layout,
  BookOpen,
  Layers,
  Sparkles,
  CreditCard,
  Mail,
  FileCode,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sliders,
  Check,
  RefreshCw,
  Copy,
  Download,
  Info,
} from 'lucide-react';
import {
  defaultContent,
  SiteContent,
  Chapter,
  ServiceItem,
  ProcessStep,
  PricingPlan,
  NavLink,
} from '../../lib/defaultContent';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    'brand' | 'hero' | 'book' | 'ticker' | 'intro' | 'services' | 'process' | 'pricing' | 'contact' | 'advanced'
  >('hero');
  const [jsonInput, setJsonInput] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // Check auth session
  useEffect(() => {
    const authSession = sessionStorage.getItem('quiet_admin_auth');
    if (authSession === 'true') {
      setIsAuthenticated(true);
    }
    fetchContent();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode.trim() === 'quiet') {
      setIsAuthenticated(true);
      sessionStorage.setItem('quiet_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('quiet_admin_auth');
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content', { cache: 'no-store' });
      if (res.ok) {
        const data: SiteContent = await res.json();
        setContent(data);
        setJsonInput(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error('Failed to load content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveStatus({ type: null, message: '' });
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (res.ok) {
        const json = await res.json();
        setContent(json.data);
        setJsonInput(JSON.stringify(json.data, null, 2));
        setHasUnsavedChanges(false);
        setSaveStatus({ type: 'success', message: 'All changes saved & live on public website!' });
        setTimeout(() => setSaveStatus({ type: null, message: '' }), 4000);
      } else {
        throw new Error('Failed to save content');
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: 'Failed to save changes. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    if (confirm('Are you sure you want to reset all content back to factory defaults?')) {
      try {
        setSaving(true);
        const res = await fetch('/api/content', { method: 'DELETE' });
        if (res.ok) {
          const json = await res.json();
          setContent(json.data);
          setJsonInput(JSON.stringify(json.data, null, 2));
          setHasUnsavedChanges(false);
          setSaveStatus({ type: 'success', message: 'Reset to original defaults.' });
          setTimeout(() => setSaveStatus({ type: null, message: '' }), 4000);
        }
      } catch (err) {
        setSaveStatus({ type: 'error', message: 'Failed to reset content.' });
      } finally {
        setSaving(false);
      }
    }
  };

  const updateSection = <K extends keyof SiteContent>(section: K, updates: Partial<SiteContent[K]>) => {
    setContent((prev: SiteContent) => ({
      ...prev,
      [section]: {
        ...(typeof prev[section] === 'object' && prev[section] !== null ? prev[section] : {}),
        ...updates,
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Chapter helpers
  const updateChapter = (index: number, field: keyof Chapter, value: string) => {
    const updated = [...content.experience.chapters];
    updated[index] = { ...updated[index], [field]: value };
    updateSection('experience', { chapters: updated });
  };

  // Services helpers
  const updateService = (index: number, field: keyof ServiceItem, value: string) => {
    const updated = [...content.services.items];
    updated[index] = { ...updated[index], [field]: value };
    updateSection('services', { items: updated });
  };

  const addService = () => {
    const nextNum = String(content.services.items.length + 1).padStart(2, '0');
    const newService: ServiceItem = {
      number: nextNum,
      symbol: '✦',
      title: 'New Automation Service',
      description: 'Describe the new automated service deliverable for your clients.',
    };
    updateSection('services', { items: [...content.services.items, newService] });
  };

  const removeService = (index: number) => {
    if (content.services.items.length <= 1) {
      alert('You must keep at least 1 service item.');
      return;
    }
    const updated = content.services.items.filter((_: ServiceItem, i: number) => i !== index);
    updateSection('services', { items: updated });
  };

  // Process helpers
  const updateProcessStep = (index: number, field: keyof ProcessStep, value: string) => {
    const updated = [...content.process.steps];
    updated[index] = { ...updated[index], [field]: value };
    updateSection('process', { steps: updated });
  };

  // Pricing helpers
  const updatePlan = (index: number, field: keyof PricingPlan, value: any) => {
    const updated = [...content.pricing.plans];
    updated[index] = { ...updated[index], [field]: value };
    updateSection('pricing', { plans: updated });
  };

  const updatePlanFeature = (planIndex: number, featureIndex: number, value: string) => {
    const updated = [...content.pricing.plans];
    const features = [...updated[planIndex].features];
    features[featureIndex] = value;
    updated[planIndex] = { ...updated[planIndex], features };
    updateSection('pricing', { plans: updated });
  };

  const addPlanFeature = (planIndex: number) => {
    const updated = [...content.pricing.plans];
    const features = [...updated[planIndex].features, 'New deliverable or feature item'];
    updated[planIndex] = { ...updated[planIndex], features };
    updateSection('pricing', { plans: updated });
  };

  const removePlanFeature = (planIndex: number, featureIndex: number) => {
    const updated = [...content.pricing.plans];
    const features = updated[planIndex].features.filter((_: string, i: number) => i !== featureIndex);
    updated[planIndex] = { ...updated[planIndex], features };
    updateSection('pricing', { plans: updated });
  };

  // JSON import handler
  const handleApplyJson = () => {
    try {
      setJsonError('');
      const parsed: SiteContent = JSON.parse(jsonInput);
      setContent(parsed);
      setHasUnsavedChanges(true);
      setSaveStatus({ type: 'success', message: 'Valid JSON loaded. Click "Save Changes" to publish.' });
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#02110d] text-[#eafff3] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#79f8bc]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-[#041a14] border border-[rgba(166,242,199,0.22)] rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#79f8bc]/10 border border-[#79f8bc]/30 flex items-center justify-center text-[#79f8bc]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-2xl tracking-tight text-[#eafff3]">
                quiet<span className="text-[#79f8bc]">hours.</span>
              </div>
              <p className="text-xs text-[#a9c8b8] tracking-wider uppercase font-semibold">
                Content Management System
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <div className="mb-2">
                <label className="text-xs font-bold tracking-wider text-[#a9c8b8] uppercase">
                  Admin Passcode
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full bg-[#02110d] border border-[rgba(166,242,199,0.25)] rounded-xl px-4 py-3 text-sm text-[#eafff3] placeholder-[#a9c8b8]/40 focus:outline-none focus:border-[#79f8bc] focus:ring-1 focus:ring-[#79f8bc] transition-all pr-12"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#a9c8b8] hover:text-[#79f8bc] px-1"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#79f8bc] hover:bg-[#66e8ab] active:scale-[0.99] text-[#052016] font-bold text-xs tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#79f8bc]/15"
            >
              <Unlock className="w-4 h-4" /> Sign In to CMS
            </button>

            <div className="text-center pt-2 border-t border-[rgba(166,242,199,0.1)]">
              <Link
                href="/"
                className="text-xs text-[#a9c8b8] hover:text-[#79f8bc] transition-colors inline-flex items-center gap-1.5"
              >
                ← Return to Public Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED DASHBOARD
  // -------------------------------------------------------------
  const tabs = [
    { id: 'hero', label: 'Hero & Visuals', icon: Layout, desc: 'Headlines, CTAs, orbit core' },
    { id: 'brand', label: 'Brand & Navigation', icon: Sliders, desc: 'Logo, links, nav button' },
    { id: 'book', label: 'The Field Guide (3D)', icon: BookOpen, desc: 'Interactive book chapters' },
    { id: 'ticker', label: 'Marquee Ticker', icon: Sparkles, desc: 'Infinite scrolling banner' },
    { id: 'intro', label: 'About / The Idea', icon: Info, desc: 'Problem & opportunity intro' },
    { id: 'services', label: 'Services (What We Do)', icon: Layers, desc: 'Deliverables & symbols' },
    { id: 'process', label: 'Circle of Service', icon: RefreshCw, desc: '4-step automation flow' },
    { id: 'pricing', label: 'Pricing & Plans', icon: CreditCard, desc: 'Setup & monthly care tiers' },
    { id: 'contact', label: 'Contact & Footer', icon: Mail, desc: 'Demo email, legal text' },
    { id: 'advanced', label: 'Raw JSON & Backup', icon: FileCode, desc: 'Direct code & export' },
  ];

  return (
    <div className="min-h-screen bg-[#02110d] text-[#eafff3] flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-[#041a14]/95 backdrop-blur-md border-b border-[rgba(166,242,199,0.2)] px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90">
            <span className="font-bold text-xl tracking-tight text-[#eafff3]">
              quiet<span className="text-[#79f8bc]">hours.</span>
            </span>
            <span className="text-[10px] tracking-widest font-bold px-2 py-0.5 bg-[#79f8bc]/10 border border-[#79f8bc]/40 rounded-full text-[#79f8bc]">
              ADMIN
            </span>
          </Link>

          {hasUnsavedChanges ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 border border-amber-500/40 text-amber-300 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Unsaved changes
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#79f8bc]/10 border border-[#79f8bc]/25 text-[#79f8bc]">
              <Check className="w-3 h-3" />
              Live & Synced
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="px-3 py-2 rounded-xl border border-[rgba(166,242,199,0.22)] hover:border-[#79f8bc] bg-[#02110d]/50 hover:bg-[#02110d] text-xs font-semibold tracking-wider text-[#a9c8b8] hover:text-[#79f8bc] transition-all flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Site</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          <button
            onClick={handleResetToDefault}
            disabled={saving}
            className="px-3 py-2 rounded-xl border border-[rgba(166,242,199,0.2)] hover:border-red-400/50 hover:text-red-300 bg-[#02110d]/50 text-xs text-[#a9c8b8] transition-all flex items-center gap-1.5 disabled:opacity-40"
            title="Reset all content to original defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#79f8bc] hover:bg-[#68e2ab] active:scale-[0.98] text-[#052016] font-bold text-xs tracking-wider uppercase rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#79f8bc]/20 disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-[#052016] border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Live Content
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 text-[#a9c8b8] hover:text-[#eafff3] hover:bg-white/5 rounded-xl transition-colors ml-1"
            title="Log out from Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Save Notification Toast */}
      {saveStatus.type && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl border flex items-center gap-3 shadow-2xl transition-all ${
            saveStatus.type === 'success'
              ? 'bg-[#042017] border-[#79f8bc] text-[#eafff3]'
              : 'bg-red-950/95 border-red-500 text-red-200'
          }`}
        >
          {saveStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#79f8bc] shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="text-xs font-medium">{saveStatus.message}</span>
        </div>
      )}

      {/* Main CMS Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-72 shrink-0">
          <div className="sticky top-24 bg-[#041a14] border border-[rgba(166,242,199,0.2)] rounded-2xl p-3 shadow-xl space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold tracking-widest text-[#79f8bc] uppercase flex items-center justify-between">
              <span>Landing Sections</span>
              <span className="text-[#a9c8b8]/60 font-mono">10</span>
            </div>

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-[#79f8bc] text-[#052016] font-bold shadow-md shadow-[#79f8bc]/10'
                      : 'text-[#a9c8b8] hover:text-[#eafff3] hover:bg-[#02110d]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#052016]' : 'text-[#79f8bc]'}`} />
                    <div className="truncate">
                      <div className="text-xs font-semibold">{tab.label}</div>
                      <div className={`text-[10px] truncate ${isActive ? 'text-[#052016]/80' : 'text-[#a9c8b8]/60'}`}>
                        {tab.desc}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      isActive ? 'text-[#052016] translate-x-0.5' : 'text-[#a9c8b8]/40 group-hover:translate-x-0.5'
                    }`}
                  />
                </button>
              );
            })}

            <div className="pt-3 mt-3 border-t border-[rgba(166,242,199,0.12)] px-3 pb-1">
              <div className="text-[11px] text-[#a9c8b8]/70 leading-relaxed">
                Edits persist immediately to the server and update the public landing page in real-time.
              </div>
            </div>
          </div>
        </aside>

        {/* Content Edit Form Area */}
        <main className="flex-1 bg-[#041a14] border border-[rgba(166,242,199,0.2)] rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* TAB: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="border-b border-[rgba(166,242,199,0.15)] pb-4">
                <h2 className="text-lg font-bold text-[#eafff3]">Hero Section & Opening Visuals</h2>
                <p className="text-xs text-[#a9c8b8] mt-1">
                  Customize the headline, highlighted italic word, value proposition, and interactive orbit elements.
                </p>
              </div>

              {/* Eyebrow */}
              <div className="bg-[#02110d] p-5 rounded-xl border border-[rgba(166,242,199,0.18)] space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#79f8bc] mb-1.5">
                    Eyebrow Status Badge
                  </label>
                  <input
                    type="text"
                    value={content.hero.eyebrow}
                    onChange={(e) => updateSection('hero', { eyebrow: e.target.value })}
                    className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-4 py-2.5 text-sm text-[#eafff3] focus:border-[#79f8bc] focus:ring-1 focus:ring-[#79f8bc] outline-none"
                  />
                  <p className="text-[11px] text-[#a9c8b8]/60 mt-1">
                    Displayed alongside the glowing pulse dot at the very top of the hero.
                  </p>
                </div>

                {/* Headline Split */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">
                      Headline (Line 1 Prefix)
                    </label>
                    <input
                      type="text"
                      value={content.hero.headlinePart1}
                      onChange={(e) => updateSection('hero', { headlinePart1: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] focus:border-[#79f8bc] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#79f8bc] mb-1.5 flex items-center gap-1">
                      <span>Highlighted Word (Italic Serif)</span>
                    </label>
                    <input
                      type="text"
                      value={content.hero.headlineEm}
                      onChange={(e) => updateSection('hero', { headlineEm: e.target.value })}
                      className="w-full bg-[#041a14] border border-[#79f8bc]/50 rounded-xl px-3.5 py-2.5 text-sm text-[#79f8bc] font-serif italic focus:border-[#79f8bc] outline-none text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">
                      Headline (Line 2 Suffix)
                    </label>
                    <input
                      type="text"
                      value={content.hero.headlinePart2}
                      onChange={(e) => updateSection('hero', { headlinePart2: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] focus:border-[#79f8bc] outline-none"
                    />
                  </div>
                </div>

                {/* Live Headline Preview */}
                <div className="bg-[#041a14] p-4 rounded-xl border border-[rgba(166,242,199,0.12)]">
                  <div className="text-[10px] uppercase font-bold text-[#a9c8b8]/60 tracking-wider mb-1">
                    Live Headline Preview
                  </div>
                  <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#eafff3] leading-snug">
                    {content.hero.headlinePart1}{' '}
                    <span className="font-serif italic font-normal text-[#79f8bc]">{content.hero.headlineEm}</span>
                    <br />
                    {content.hero.headlinePart2}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">
                    Hero Description Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={content.hero.description}
                    onChange={(e) => updateSection('hero', { description: e.target.value })}
                    className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-4 py-3 text-sm text-[#eafff3] focus:border-[#79f8bc] outline-none leading-relaxed"
                  />
                </div>

                {/* CTAs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Primary Button Text</label>
                    <input
                      type="text"
                      value={content.hero.primaryCtaText}
                      onChange={(e) => updateSection('hero', { primaryCtaText: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] focus:border-[#79f8bc] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Primary Button Anchor</label>
                    <input
                      type="text"
                      value={content.hero.primaryCtaLink}
                      onChange={(e) => updateSection('hero', { primaryCtaLink: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] focus:border-[#79f8bc] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Secondary Button Text</label>
                    <input
                      type="text"
                      value={content.hero.secondaryCtaText}
                      onChange={(e) => updateSection('hero', { secondaryCtaText: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] focus:border-[#79f8bc] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Secondary Anchor Link</label>
                    <input
                      type="text"
                      value={content.hero.secondaryCtaLink}
                      onChange={(e) => updateSection('hero', { secondaryCtaLink: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] focus:border-[#79f8bc] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Orbit Graphics */}
              <div className="bg-[#02110d] p-5 rounded-xl border border-[rgba(166,242,199,0.18)] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#79f8bc]">
                  Hero Orbit Graphic Customization
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">
                      Top-Left Floating Status Pill
                    </label>
                    <input
                      type="text"
                      value={content.hero.chipOne}
                      onChange={(e) => updateSection('hero', { chipOne: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] focus:border-[#79f8bc] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">
                      Bottom-Right Floating Status Pill
                    </label>
                    <input
                      type="text"
                      value={content.hero.chipTwo}
                      onChange={(e) => updateSection('hero', { chipTwo: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] focus:border-[#79f8bc] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">
                      Central Core Badge Text (Line 1 \n Line 2)
                    </label>
                    <input
                      type="text"
                      value={content.hero.orbitCoreTitle}
                      onChange={(e) => updateSection('hero', { orbitCoreTitle: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] focus:border-[#79f8bc] outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">
                      Central Core Subtitle
                    </label>
                    <input
                      type="text"
                      value={content.hero.orbitCoreSubtitle}
                      onChange={(e) => updateSection('hero', { orbitCoreSubtitle: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] focus:border-[#79f8bc] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BRAND & NAVIGATION */}
          {activeTab === 'brand' && (
            <div className="space-y-6">
              <div className="border-b border-[rgba(166,242,199,0.15)] pb-4">
                <h2 className="text-lg font-bold text-[#eafff3]">Brand Identity & Navigation Bar</h2>
                <p className="text-xs text-[#a9c8b8] mt-1">
                  Configure brand logo text, header navigation links, and the top right action button.
                </p>
              </div>

              <div className="bg-[#02110d] p-5 rounded-xl border border-[rgba(166,242,199,0.18)] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#79f8bc]">Brand Logo</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Logo Prefix</label>
                    <input
                      type="text"
                      value={content.brand.name}
                      onChange={(e) => updateSection('brand', { name: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] focus:border-[#79f8bc] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#79f8bc] mb-1.5">Logo Suffix (Green)</label>
                    <input
                      type="text"
                      value={content.brand.suffix}
                      onChange={(e) => updateSection('brand', { suffix: e.target.value })}
                      className="w-full bg-[#041a14] border border-[#79f8bc]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#79f8bc] focus:border-[#79f8bc] outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#79f8bc] mb-3">Header Action Button</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Button Text</label>
                      <input
                        type="text"
                        value={content.brand.navCtaText}
                        onChange={(e) => updateSection('brand', { navCtaText: e.target.value })}
                        className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] focus:border-[#79f8bc] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Target Link</label>
                      <input
                        type="text"
                        value={content.brand.navCtaLink}
                        onChange={(e) => updateSection('brand', { navCtaLink: e.target.value })}
                        className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] focus:border-[#79f8bc] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#79f8bc] mb-3">Navigation Menu Links</h3>
                  <div className="space-y-3">
                    {content.navLinks.map((link: NavLink, idx: number) => (
                      <div key={idx} className="grid grid-cols-2 gap-3 bg-[#041a14] p-3 rounded-xl border border-[rgba(166,242,199,0.12)]">
                        <div>
                          <label className="block text-[10px] text-[#a9c8b8]/70 mb-1">Link #{idx + 1} Label</label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => {
                              const updated = [...content.navLinks];
                              updated[idx] = { ...updated[idx], label: e.target.value };
                              setContent((prev) => ({ ...prev, navLinks: updated }));
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full bg-[#02110d] border border-[rgba(166,242,199,0.2)] rounded-lg px-3 py-1.5 text-xs text-[#eafff3] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#a9c8b8]/70 mb-1">Target Anchor / URL</label>
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) => {
                              const updated = [...content.navLinks];
                              updated[idx] = { ...updated[idx], href: e.target.value };
                              setContent((prev) => ({ ...prev, navLinks: updated }));
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full bg-[#02110d] border border-[rgba(166,242,199,0.2)] rounded-lg px-3 py-1.5 text-xs text-[#eafff3] outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: THE FIELD GUIDE (3D BOOK) */}
          {activeTab === 'book' && (
            <div className="space-y-6">
              <div className="border-b border-[rgba(166,242,199,0.15)] pb-4">
                <h2 className="text-lg font-bold text-[#eafff3]">The Field Guide (Interactive 3D Book)</h2>
                <p className="text-xs text-[#a9c8b8] mt-1">
                  Manage the introductory heading and each of the 4 turnable pages inside the 3D book experience.
                </p>
              </div>

              {/* Book Heading */}
              <div className="bg-[#02110d] p-5 rounded-xl border border-[rgba(166,242,199,0.18)] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#79f8bc]">Section Heading</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Section Number / Label</label>
                    <input
                      type="text"
                      value={content.experience.sectionLabel}
                      onChange={(e) => updateSection('experience', { sectionLabel: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Headline (Part 1)</label>
                    <input
                      type="text"
                      value={content.experience.headingPart1}
                      onChange={(e) => updateSection('experience', { headingPart1: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#79f8bc] mb-1.5">Headline Italic Accent</label>
                    <input
                      type="text"
                      value={content.experience.headingEm}
                      onChange={(e) => updateSection('experience', { headingEm: e.target.value })}
                      className="w-full bg-[#041a14] border border-[#79f8bc]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#79f8bc] font-serif italic outline-none text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Subtitle Description</label>
                  <input
                    type="text"
                    value={content.experience.description}
                    onChange={(e) => updateSection('experience', { description: e.target.value })}
                    className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                  />
                </div>
              </div>

              {/* Chapters */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#79f8bc]">
                  Interactive Book Chapters (4 Pages)
                </h3>
                {content.experience.chapters.map((chapter: Chapter, index: number) => (
                  <div
                    key={index}
                    className="bg-[#02110d] p-5 rounded-xl border border-[rgba(166,242,199,0.18)] space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-[rgba(166,242,199,0.1)] pb-2.5">
                      <span className="text-xs font-bold text-[#79f8bc] tracking-wider">
                        CHAPTER 0{index + 1} OF 0{content.experience.chapters.length}
                      </span>
                      <span className="text-xs font-mono text-[#a9c8b8] bg-[#041a14] px-2.5 py-0.5 rounded border border-[rgba(166,242,199,0.15)]">
                        {chapter.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#a9c8b8] mb-1">Eyebrow Header</label>
                        <input
                          type="text"
                          value={chapter.eyebrow}
                          onChange={(e) => updateChapter(index, 'eyebrow', e.target.value)}
                          className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2 text-xs text-[#eafff3] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#a9c8b8] mb-1">Topic Category Label</label>
                        <input
                          type="text"
                          value={chapter.label}
                          onChange={(e) => updateChapter(index, 'label', e.target.value)}
                          className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2 text-xs text-[#eafff3] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#a9c8b8] mb-1">Page Title</label>
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) => updateChapter(index, 'title', e.target.value)}
                        className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] font-serif text-lg outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#a9c8b8] mb-1">Page Body Story</label>
                      <textarea
                        rows={3}
                        value={chapter.body}
                        onChange={(e) => updateChapter(index, 'body', e.target.value)}
                        className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-xs text-[#eafff3] leading-relaxed outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TICKER */}
          {activeTab === 'ticker' && (
            <div className="space-y-6">
              <div className="border-b border-[rgba(166,242,199,0.15)] pb-4">
                <h2 className="text-lg font-bold text-[#eafff3]">Running Marquee Ticker</h2>
                <p className="text-xs text-[#a9c8b8] mt-1">
                  The green high-contrast animated marquee tape separating the book and about sections.
                </p>
              </div>

              <div className="bg-[#02110d] p-5 rounded-xl border border-[rgba(166,242,199,0.18)] space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#79f8bc] mb-2">
                    Marquee Text Content
                  </label>
                  <input
                    type="text"
                    value={content.ticker.text}
                    onChange={(e) => updateSection('ticker', { text: e.target.value })}
                    className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-4 py-3 text-sm text-[#eafff3] font-mono outline-none"
                  />
                  <p className="text-[11px] text-[#a9c8b8]/70 mt-1.5">
                    Tip: Use symbols like ✦ or ✳ to separate your phrases.
                  </p>
                </div>

                <div className="bg-[#79f8bc] text-[#042017] p-4 rounded-xl font-bold tracking-widest text-xs uppercase overflow-hidden whitespace-nowrap shadow-md">
                  Preview: {content.ticker.text}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ABOUT / INTRO */}
          {activeTab === 'intro' && (
            <div className="space-y-6">
              <div className="border-b border-[rgba(166,242,199,0.15)] pb-4">
                <h2 className="text-lg font-bold text-[#eafff3]">The Idea (About Section)</h2>
                <p className="text-xs text-[#a9c8b8] mt-1">
                  The editorial two-column section addressing why Sydney small businesses need after-hours replies.
                </p>
              </div>

              <div className="bg-[#02110d] p-5 rounded-xl border border-[rgba(166,242,199,0.18)] space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Section Label</label>
                  <input
                    type="text"
                    value={content.intro.sectionLabel}
                    onChange={(e) => updateSection('intro', { sectionLabel: e.target.value })}
                    className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Headline Line 1</label>
                    <input
                      type="text"
                      value={content.intro.headingPart1}
                      onChange={(e) => updateSection('intro', { headingPart1: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#79f8bc] mb-1.5">Headline Italic Word</label>
                    <input
                      type="text"
                      value={content.intro.headingEm}
                      onChange={(e) => updateSection('intro', { headingEm: e.target.value })}
                      className="w-full bg-[#041a14] border border-[#79f8bc]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#79f8bc] font-serif italic outline-none text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Description Paragraph</label>
                  <textarea
                    rows={3}
                    value={content.intro.description}
                    onChange={(e) => updateSection('intro', { description: e.target.value })}
                    className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-4 py-3 text-sm text-[#eafff3] leading-relaxed outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[rgba(166,242,199,0.15)] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#eafff3]">Services Grid (What We Do)</h2>
                  <p className="text-xs text-[#a9c8b8] mt-1">
                    Manage service cards, custom unicode symbols, titles, and explanations.
                  </p>
                </div>
                <button
                  onClick={addService}
                  className="px-3.5 py-2 bg-[#79f8bc] hover:bg-[#68e2ab] text-[#052016] rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-md shadow-[#79f8bc]/10"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Service
                </button>
              </div>

              {/* Heading */}
              <div className="bg-[#02110d] p-5 rounded-xl border border-[rgba(166,242,199,0.18)] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Section Label</label>
                    <input
                      type="text"
                      value={content.services.sectionLabel}
                      onChange={(e) => updateSection('services', { sectionLabel: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Headline Line 1</label>
                    <input
                      type="text"
                      value={content.services.headingPart1}
                      onChange={(e) => updateSection('services', { headingPart1: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#79f8bc] mb-1.5">Headline Italic Word</label>
                    <input
                      type="text"
                      value={content.services.headingEm}
                      onChange={(e) => updateSection('services', { headingEm: e.target.value })}
                      className="w-full bg-[#041a14] border border-[#79f8bc]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#79f8bc] font-serif italic outline-none text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Service Cards */}
              <div className="space-y-4">
                {content.services.items.map((service: ServiceItem, index: number) => (
                  <div
                    key={index}
                    className="bg-[#02110d] p-5 rounded-xl border border-[rgba(166,242,199,0.18)] space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-[rgba(166,242,199,0.1)] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#79f8bc]">SERVICE CARD #{service.number}</span>
                        <span className="text-base text-[#79f8bc] font-mono">{service.symbol}</span>
                      </div>
                      <button
                        onClick={() => removeService(index)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors flex items-center gap-1 text-xs"
                        title="Delete service card"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-[#a9c8b8] mb-1">Index Number</label>
                        <input
                          type="text"
                          value={service.number}
                          onChange={(e) => updateService(index, 'number', e.target.value)}
                          className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2 text-xs text-[#eafff3] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#a9c8b8] mb-1">Symbol (e.g. ✳, ◷, ◎, ✦)</label>
                        <input
                          type="text"
                          value={service.symbol}
                          onChange={(e) => updateService(index, 'symbol', e.target.value)}
                          className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2 text-xs text-[#79f8bc] text-center font-mono outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#a9c8b8] mb-1">Service Title</label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => updateService(index, 'title', e.target.value)}
                          className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2 text-xs text-[#eafff3] font-semibold outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#a9c8b8] mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={service.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2 text-xs text-[#eafff3] leading-relaxed outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROCESS */}
          {activeTab === 'process' && (
            <div className="space-y-6">
              <div className="border-b border-[rgba(166,242,199,0.15)] pb-4">
                <h2 className="text-lg font-bold text-[#eafff3]">The Process (Circle of Service)</h2>
                <p className="text-xs text-[#a9c8b8] mt-1">
                  The step-by-step cycle explaining customer inquiry intake, AI answer generation, and human handoff.
                </p>
              </div>

              {/* Heading */}
              <div className="bg-[#02110d] p-5 rounded-xl border border-[rgba(166,242,199,0.18)] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Section Label</label>
                    <input
                      type="text"
                      value={content.process.sectionLabel}
                      onChange={(e) => updateSection('process', { sectionLabel: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Headline Line 1</label>
                    <input
                      type="text"
                      value={content.process.headingPart1}
                      onChange={(e) => updateSection('process', { headingPart1: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#79f8bc] mb-1.5">Headline Italic Word</label>
                    <input
                      type="text"
                      value={content.process.headingEm}
                      onChange={(e) => updateSection('process', { headingEm: e.target.value })}
                      className="w-full bg-[#041a14] border border-[#79f8bc]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#79f8bc] font-serif italic outline-none text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {content.process.steps.map((step: ProcessStep, index: number) => (
                  <div
                    key={index}
                    className="bg-[#02110d] p-5 rounded-xl border border-[rgba(166,242,199,0.18)] space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#79f8bc]/10 text-[#79f8bc] text-xs font-bold flex items-center justify-center border border-[#79f8bc]/30 shrink-0">
                        {step.number}
                      </span>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => updateProcessStep(index, 'title', e.target.value)}
                        className="flex-1 bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2 text-sm font-semibold text-[#eafff3] outline-none"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={2}
                        value={step.description}
                        onChange={(e) => updateProcessStep(index, 'description', e.target.value)}
                        className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2 text-xs text-[#a9c8b8] outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PRICING */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="border-b border-[rgba(166,242,199,0.15)] pb-4">
                <h2 className="text-lg font-bold text-[#eafff3]">Pricing & Packages</h2>
                <p className="text-xs text-[#a9c8b8] mt-1">
                  Adjust one-time setup pricing, optional care tiers, included bullet points, and pricing notes.
                </p>
              </div>

              {/* Heading */}
              <div className="bg-[#02110d] p-5 rounded-xl border border-[rgba(166,242,199,0.18)] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Section Label</label>
                    <input
                      type="text"
                      value={content.pricing.sectionLabel}
                      onChange={(e) => updateSection('pricing', { sectionLabel: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Headline Line 1</label>
                    <input
                      type="text"
                      value={content.pricing.headingPart1}
                      onChange={(e) => updateSection('pricing', { headingPart1: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#79f8bc] mb-1.5">Headline Italic Word</label>
                    <input
                      type="text"
                      value={content.pricing.headingEm}
                      onChange={(e) => updateSection('pricing', { headingEm: e.target.value })}
                      className="w-full bg-[#041a14] border border-[#79f8bc]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#79f8bc] font-serif italic outline-none text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Intro Description</label>
                  <input
                    type="text"
                    value={content.pricing.intro}
                    onChange={(e) => updateSection('pricing', { intro: e.target.value })}
                    className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                  />
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.pricing.plans.map((plan: PricingPlan, planIdx: number) => (
                  <div
                    key={planIdx}
                    className={`bg-[#02110d] p-6 rounded-2xl border space-y-4 shadow-lg ${
                      plan.featured ? 'border-[#79f8bc] ring-1 ring-[#79f8bc]/30' : 'border-[rgba(166,242,199,0.2)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={plan.tag}
                        onChange={(e) => updatePlan(planIdx, 'tag', e.target.value)}
                        className="bg-[#041a14] border border-[rgba(166,242,199,0.2)] rounded-lg px-2.5 py-1 text-xs font-bold text-[#79f8bc] tracking-wider uppercase outline-none"
                      />
                      <label className="flex items-center gap-2 text-xs text-[#a9c8b8] cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={!!plan.featured}
                          onChange={(e) => updatePlan(planIdx, 'featured', e.target.checked)}
                          className="accent-[#79f8bc] w-4 h-4 rounded"
                        />
                        Featured Highlight
                      </label>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <input
                        type="text"
                        value={plan.amount}
                        onChange={(e) => updatePlan(planIdx, 'amount', e.target.value)}
                        className="bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2 text-2xl font-serif text-[#eafff3] w-48 outline-none"
                      />
                      <input
                        type="text"
                        value={plan.period || ''}
                        onChange={(e) => updatePlan(planIdx, 'period', e.target.value)}
                        placeholder="e.g. / month"
                        className="bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3 py-2 text-xs text-[#a9c8b8] w-32 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#a9c8b8] mb-1">Plan Description</label>
                      <input
                        type="text"
                        value={plan.description}
                        onChange={(e) => updatePlan(planIdx, 'description', e.target.value)}
                        className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2 text-xs text-[#eafff3] outline-none"
                      />
                    </div>

                    {/* Features List */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-[#a9c8b8]">Included Deliverables</label>
                        <button
                          onClick={() => addPlanFeature(planIdx)}
                          className="text-[11px] text-[#79f8bc] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Plus className="w-3 h-3" /> Add item
                        </button>
                      </div>
                      <div className="space-y-2">
                        {plan.features.map((feature: string, fIdx: number) => (
                          <div key={fIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updatePlanFeature(planIdx, fIdx, e.target.value)}
                              className="flex-1 bg-[#041a14] border border-[rgba(166,242,199,0.2)] rounded-lg px-3 py-1.5 text-xs text-[#eafff3] outline-none"
                            />
                            <button
                              onClick={() => removePlanFeature(planIdx, fIdx)}
                              className="text-red-400 hover:text-red-300 p-1.5 rounded"
                              title="Delete feature item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#a9c8b8] mb-1">Button Call to Action</label>
                      <input
                        type="text"
                        value={plan.ctaText}
                        onChange={(e) => updatePlan(planIdx, 'ctaText', e.target.value)}
                        className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#eafff3] outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Pricing Disclaimer / Footnote</label>
                <input
                  type="text"
                  value={content.pricing.note}
                  onChange={(e) => updateSection('pricing', { note: e.target.value })}
                  className="w-full bg-[#02110d] border border-[rgba(166,242,199,0.25)] rounded-xl px-4 py-2.5 text-xs text-[#a9c8b8] outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB: CONTACT & FOOTER */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="border-b border-[rgba(166,242,199,0.15)] pb-4">
                <h2 className="text-lg font-bold text-[#eafff3]">Contact Section & Footer</h2>
                <p className="text-xs text-[#a9c8b8] mt-1">
                  Manage the recipient email address for client demo requests, CTA copy, and footer copyright lines.
                </p>
              </div>

              {/* Contact Block */}
              <div className="bg-[#02110d] p-5 rounded-xl border border-[rgba(166,242,199,0.18)] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#79f8bc]">Demo Inquiries</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Section Label</label>
                    <input
                      type="text"
                      value={content.contact.sectionLabel}
                      onChange={(e) => updateSection('contact', { sectionLabel: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Headline Line 1</label>
                    <input
                      type="text"
                      value={content.contact.headingPart1}
                      onChange={(e) => updateSection('contact', { headingPart1: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#79f8bc] mb-1.5">Headline Italic Accent</label>
                    <input
                      type="text"
                      value={content.contact.headingEm}
                      onChange={(e) => updateSection('contact', { headingEm: e.target.value })}
                      className="w-full bg-[#041a14] border border-[#79f8bc]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#79f8bc] font-serif italic outline-none text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Button CTA Text</label>
                    <input
                      type="text"
                      value={content.contact.ctaText}
                      onChange={(e) => updateSection('contact', { ctaText: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#79f8bc] mb-1.5">
                    Destination Demo Inquiry Email
                  </label>
                  <input
                    type="email"
                    value={content.contact.email}
                    onChange={(e) => updateSection('contact', { email: e.target.value })}
                    className="w-full bg-[#041a14] border border-[#79f8bc]/50 rounded-xl px-4 py-2.5 text-sm text-[#79f8bc] font-medium outline-none"
                  />
                  <p className="text-[11px] text-[#a9c8b8]/70 mt-1">
                    When visitors click the primary demo CTA, their email client opens pre-addressed to this address.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Description</label>
                  <textarea
                    rows={2}
                    value={content.contact.description}
                    onChange={(e) => updateSection('contact', { description: e.target.value })}
                    className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="bg-[#02110d] p-5 rounded-xl border border-[rgba(166,242,199,0.18)] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#79f8bc]">Footer Line</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Copyright Statement</label>
                    <input
                      type="text"
                      value={content.footer.copyright}
                      onChange={(e) => updateSection('footer', { copyright: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a9c8b8] mb-1.5">Footer Brand Tagline</label>
                    <input
                      type="text"
                      value={content.footer.tagline}
                      onChange={(e) => updateSection('footer', { tagline: e.target.value })}
                      className="w-full bg-[#041a14] border border-[rgba(166,242,199,0.25)] rounded-xl px-3.5 py-2.5 text-sm text-[#eafff3] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RAW JSON & BACKUP */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="border-b border-[rgba(166,242,199,0.15)] pb-4">
                <h2 className="text-lg font-bold text-[#eafff3]">JSON Editor & Backup Download</h2>
                <p className="text-xs text-[#a9c8b8] mt-1">
                  Inspect raw database content, download a timestamped backup, or import a JSON file.
                </p>
              </div>

              {jsonError && (
                <div className="p-3.5 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{jsonError}</span>
                </div>
              )}

              <div>
                <textarea
                  rows={16}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full bg-[#02110d] border border-[rgba(166,242,199,0.25)] rounded-xl p-4 font-mono text-xs text-[#79f8bc] leading-relaxed outline-none focus:border-[#79f8bc]"
                  spellCheck={false}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleApplyJson}
                  className="px-4 py-2.5 bg-[#79f8bc] hover:bg-[#68e2ab] text-[#052016] font-bold text-xs tracking-wider uppercase rounded-xl transition-all"
                >
                  Apply JSON to Form Fields
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `quiet-hours-backup-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                  }}
                  className="px-4 py-2.5 bg-[#02110d] hover:bg-white/5 border border-[rgba(166,242,199,0.25)] text-[#eafff3] text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download JSON Backup
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
