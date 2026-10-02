'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Sparkles, Send } from 'lucide-react';

export default function JoinPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    github: '',
    expertise: 'fullstack',
    experience: '1',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/applicants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent-green selection:text-black">
      <Navbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-grid-subtle">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb / Return */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO HOME</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-accent-green/10 border border-accent-green/30 font-mono text-xs text-accent-green font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMMUNITY INTAKE // NEW CANDIDATE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
              Join CodeNoSekai
            </h1>
            <p className="text-zinc-400 font-sans text-sm max-w-xl leading-relaxed">
              Submit your profile and background. Applications are reviewed by community admins for project allocation, open source mentoring, and team collaboration.
            </p>
          </div>

          {/* Success Modal / State */}
          {submitted ? (
            <div className="border-2 border-white bg-surface p-8 sm:p-12 shadow-brutal text-center space-y-6">
              <div className="w-16 h-16 border-2 border-accent-green bg-accent-green/10 text-accent-green flex items-center justify-center mx-auto shadow-brutal-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-accent-green font-bold">
                  TRANSMISSION RECEIVED
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
                  Application Submitted Successfully
                </h2>
                <p className="text-zinc-400 font-sans text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Your profile has been queued for review by the CodeNoSekai team.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link href="/#projects" className="btn-brutal text-xs py-2.5 px-6">
                  EXPLORE REPOSITORIES
                </Link>
                <Link
                  href="/"
                  className="btn-brutal-outline text-xs py-2.5 px-6"
                >
                  RETURN TO HOME
                </Link>
              </div>
            </div>
          ) : (
            <div className="border-2 border-white bg-surface p-6 sm:p-10 shadow-brutal">
              {/* Error Banner */}
              {errorMsg && (
                <div className="mb-6 p-4 border-2 border-red-500 bg-red-500/10 flex items-start gap-3 text-red-300 font-mono text-xs">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold"
                    >
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Vance"
                      className="w-full px-4 py-2.5 bg-background border border-zinc-700 font-mono text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@domain.com"
                      className="w-full px-4 py-2.5 bg-background border border-zinc-700 font-mono text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <label
                      htmlFor="whatsapp"
                      className="block font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold"
                    >
                      WhatsApp Number *
                    </label>
                    <input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      required
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+1 555 123 4567"
                      className="w-full px-4 py-2.5 bg-background border border-zinc-700 font-mono text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                    />
                    <p className="text-[11px] font-mono text-zinc-500">
                      Include country dial code (e.g. +1, +44, +81, +92).
                    </p>
                  </div>

                  {/* GitHub Username */}
                  <div className="space-y-2">
                    <label
                      htmlFor="github"
                      className="block font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold"
                    >
                      GitHub Username *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-zinc-500">
                        @
                      </span>
                      <input
                        id="github"
                        name="github"
                        type="text"
                        required
                        value={formData.github}
                        onChange={handleChange}
                        placeholder="your-handle"
                        className="w-full pl-8 pr-4 py-2.5 bg-background border border-zinc-700 font-mono text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Expertise */}
                  <div className="space-y-2">
                    <label
                      htmlFor="expertise"
                      className="block font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold"
                    >
                      Primary Expertise *
                    </label>
                    <select
                      id="expertise"
                      name="expertise"
                      required
                      value={formData.expertise}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-background border border-zinc-700 font-mono text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                    >
                      <option value="frontend">Frontend Development (React, Next.js, Vue)</option>
                      <option value="backend">Backend & APIs (Node, Go, Python)</option>
                      <option value="fullstack">Full Stack Engineering</option>
                      <option value="mobile">Mobile Development (React Native, Kotlin, Flutter)</option>
                      <option value="ai-ml">AI Agents & Machine Learning</option>
                      <option value="cybersecurity">Cybersecurity & Pentesting</option>
                      <option value="devops">DevOps & Cloud Infrastructure</option>
                      <option value="design">UI/UX & Creative Engineering</option>
                      <option value="other">Other Technical Domain</option>
                    </select>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <label
                      htmlFor="experience"
                      className="block font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold"
                    >
                      Years of Experience *
                    </label>
                    <input
                      id="experience"
                      name="experience"
                      type="number"
                      min="0"
                      max="50"
                      required
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-background border border-zinc-700 font-mono text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold"
                  >
                    Why do you want to join CodeNoSekai? *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about the projects you want to build, what you hope to contribute, or your favorite tech stack..."
                    className="w-full p-4 bg-background border border-zinc-700 font-mono text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors leading-relaxed"
                  />
                </div>

                {/* Notice & Submit */}
                <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[11px] font-mono text-zinc-500 text-center sm:text-left">
                    Your details are securely stored for internal admin review only.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-brutal w-full sm:w-auto py-3 px-8 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>PROCESSING...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        <span>SUBMIT APPLICATION</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
