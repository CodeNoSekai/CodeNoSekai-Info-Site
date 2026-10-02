'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ExternalLink, ShieldCheck, Terminal, Users, Layers, UserPlus } from 'lucide-react';
import GithubIcon from '@/components/ui/GithubIcon';
import { COMMUNITY_LINKS } from '@/data/community';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 border-2 border-white bg-black p-0.5 shadow-brutal-sm transition-transform group-hover:-translate-y-0.5">
            <Image
              src="https://github.com/CodeNoSekai.png"
              alt="CodeNoSekai Logo"
              width={44}
              height={44}
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-black tracking-tight text-white uppercase group-hover:text-accent-green transition-colors">
                CodeNoSekai
              </span>
              <span className="text-[10px] font-mono font-bold bg-accent-green/20 text-accent-green px-1.5 py-0.5 border border-accent-green/40">
                v2.0
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              [DEV_COMMUNITY]
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/#about"
            className="font-mono text-xs uppercase tracking-wider text-zinc-300 hover:text-white hover:underline underline-offset-4 decoration-2 decoration-accent-green"
          >
            // About
          </Link>
          <Link
            href="/#founder"
            className="font-mono text-xs uppercase tracking-wider text-zinc-300 hover:text-white hover:underline underline-offset-4 decoration-2 decoration-accent-green"
          >
            // Leadership
          </Link>
          <Link
            href="/#members"
            className="font-mono text-xs uppercase tracking-wider text-zinc-300 hover:text-white hover:underline underline-offset-4 decoration-2 decoration-accent-green"
          >
            // Members
          </Link>
          <Link
            href="/#projects"
            className="font-mono text-xs uppercase tracking-wider text-zinc-300 hover:text-white hover:underline underline-offset-4 decoration-2 decoration-accent-green"
          >
            // Repos
          </Link>
          <Link
            href="/#community"
            className="font-mono text-xs uppercase tracking-wider text-zinc-300 hover:text-white hover:underline underline-offset-4 decoration-2 decoration-accent-green"
          >
            // Channels
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={COMMUNITY_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-zinc-700 bg-surface hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
            title="GitHub Organization"
          >
            <GithubIcon className="w-5 h-5" />
          </a>

          <Link
            href="/admin"
            className="px-3 py-2 border border-zinc-700 bg-surface hover:border-zinc-500 font-mono text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
            title="Admin Review Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-accent-green" />
            ADMIN
          </Link>

          <Link
            href="/join"
            className="btn-brutal text-xs py-2 px-4 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>JOIN US</span>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 border-2 border-white bg-surface text-white shadow-brutal-sm"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-border bg-background px-4 pt-4 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 font-mono text-sm font-bold text-zinc-200 hover:bg-surface border-l-2 border-transparent hover:border-accent-green"
            >
              01 // About
            </Link>
            <Link
              href="/#founder"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 font-mono text-sm font-bold text-zinc-200 hover:bg-surface border-l-2 border-transparent hover:border-accent-green"
            >
              02 // Leadership
            </Link>
            <Link
              href="/#members"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 font-mono text-sm font-bold text-zinc-200 hover:bg-surface border-l-2 border-transparent hover:border-accent-green"
            >
              03 // Community Members
            </Link>
            <Link
              href="/#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 font-mono text-sm font-bold text-zinc-200 hover:bg-surface border-l-2 border-transparent hover:border-accent-green"
            >
              04 // Projects
            </Link>
            <Link
              href="/#community"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 font-mono text-sm font-bold text-zinc-200 hover:bg-surface border-l-2 border-transparent hover:border-accent-green"
            >
              05 // Community Channels
            </Link>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
            <Link
              href="/join"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-brutal w-full text-center text-xs py-2.5"
            >
              JOIN CODENOSEKAI
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 border border-zinc-700 bg-surface font-mono text-xs text-zinc-300"
            >
              [ADMIN PORTAL]
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
