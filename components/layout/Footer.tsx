import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUp, ShieldCheck, Heart } from 'lucide-react';
import GithubIcon from '@/components/ui/GithubIcon';
import { COMMUNITY_LINKS } from '@/data/community';

export default function Footer() {
  return (
    <footer className="border-t-2 border-border bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-zinc-800">
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-white bg-black p-0.5 shadow-brutal-sm">
                <Image
                  src="https://github.com/CodeNoSekai.png"
                  alt="CodeNoSekai Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="font-mono text-xl font-black uppercase tracking-tight text-white">
                CodeNoSekai
              </span>
            </div>
            <p className="text-zinc-400 font-sans text-xs max-w-md leading-relaxed">
              An international open-source community dedicated to developer education, AI bots, backend infrastructures, and collaborative software engineering.
            </p>
            <div className="font-mono text-[11px] text-zinc-500">
              LOC: JAPAN // GLOBAL COLLABORATIVE REPOSITORY
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <div className="font-bold text-white uppercase tracking-wider text-xs border-b border-zinc-800 pb-1">
              NAVIGATION
            </div>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  // About
                </Link>
              </li>
              <li>
                <Link href="/#founder" className="hover:text-white transition-colors">
                  // Founder & Leadership
                </Link>
              </li>
              <li>
                <Link href="/#members" className="hover:text-white transition-colors">
                  // Member Roster
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="hover:text-white transition-colors">
                  // Open-Source Repos
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-accent-green hover:underline font-bold">
                  // Join Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Administrative & Direct Links */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <div className="font-bold text-white uppercase tracking-wider text-xs border-b border-zinc-800 pb-1">
              PORTAL & REPOS
            </div>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <a
                  href={COMMUNITY_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub Organization</span>
                </a>
              </li>
              <li>
                <a
                  href={COMMUNITY_LINKS.whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp Channel
                </a>
              </li>
              <li>
                <a
                  href={COMMUNITY_LINKS.whatsappCommunity}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp Community
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-zinc-700 bg-surface hover:border-zinc-500 text-zinc-300 hover:text-white font-bold"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-green" />
                  <span>Admin Panel</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} CodeNoSekai Community. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-3 text-zinc-400">
            <span>
              Founded by{' '}
              <a
                href={COMMUNITY_LINKS.founderGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline font-bold"
              >
                Salman Ahmad (@ahmmikun)
              </a>
            </span>
            <span>•</span>
            <span>
              Designed & Modernized with Next.js & Tailwind
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
