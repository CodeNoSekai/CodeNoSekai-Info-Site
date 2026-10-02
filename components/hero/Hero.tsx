'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Terminal, Code2, Users, Cpu, Sparkles } from 'lucide-react';
import GithubIcon from '@/components/ui/GithubIcon';
import { COMMUNITY_LINKS } from '@/data/community';

export default function Hero() {
  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 border-b-2 border-border overflow-hidden bg-grid-subtle">
      {/* Glow highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Terminal Header Bar */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-zinc-700 font-mono text-xs text-zinc-300 mb-8 shadow-brutal-sm">
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-zinc-500">cns@node01:~$</span>
          <span className="text-accent-green">cat /etc/mission.txt</span>
          <span className="text-zinc-400 font-bold ml-2 hidden sm:inline">
            [SYS: OPERATIONAL]
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.05]">
              Code. Innovate.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green via-emerald-400 to-accent-cyan">
                Dominate.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl font-normal leading-relaxed border-l-2 border-accent-green pl-4">
              CodeNoSekai is a collaborative open-source community of developers, system architects, and bot creators building cutting-edge AI chatbots, APIs, and developer tooling.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/join"
                className="btn-brutal text-sm flex items-center gap-2 group"
              >
                <span>APPLY TO JOIN</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#projects"
                className="btn-brutal-outline text-sm flex items-center gap-2"
              >
                <Code2 className="w-4 h-4 text-accent-green" />
                <span>EXPLORE REPOS</span>
              </a>

              <a
                href={COMMUNITY_LINKS.whatsappChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-surface hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 font-mono text-xs flex items-center gap-2 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>WHATSAPP CHANNEL</span>
              </a>
            </div>
          </div>

          {/* Neo-brutalist System Telemetry Card */}
          <div className="lg:col-span-4">
            <div className="brutal-card p-6 relative">
              {/* Window control dots */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800 font-mono text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-red-500/80 border border-red-400 inline-block" />
                  <span className="w-3 h-3 bg-amber-500/80 border border-amber-400 inline-block" />
                  <span className="w-3 h-3 bg-green-500/80 border border-green-400 inline-block" />
                </div>
                <span className="text-zinc-500 uppercase tracking-widest text-[10px]">
                  TELEMETRY // SECURE
                </span>
              </div>

              {/* Org Avatar & Identity */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 border-2 border-white bg-black shrink-0 relative p-1 shadow-brutal-sm">
                  <Image
                    src="https://github.com/CodeNoSekai.png"
                    alt="CodeNoSekai avatar"
                    width={64}
                    height={64}
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-white text-base">
                    Code No Sekai
                  </h3>
                  <p className="font-mono text-xs text-zinc-400">
                    orgs/CodeNoSekai
                  </p>
                  <div className="inline-block mt-1 font-mono text-[10px] font-bold text-accent-green bg-accent-green/10 px-2 py-0.5 border border-accent-green/30">
                    VERIFIED COMMUNITY
                  </div>
                </div>
              </div>

              {/* Telemetry rows */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/80">
                  <span className="text-zinc-400">STATUS</span>
                  <span className="text-accent-green font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-ping" />
                    ONLINE & ACTIVE
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/80">
                  <span className="text-zinc-400">TOTAL MEMBERS</span>
                  <span className="text-white font-bold">35 ACCOUNTS</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/80">
                  <span className="text-zinc-400">FOUNDER</span>
                  <span className="text-white font-bold">Salman Ahmad</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-zinc-800/80">
                  <span className="text-zinc-400">STACK</span>
                  <span className="text-zinc-200">TS · Node · AI · Python</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-zinc-400">MEMBERSHIP</span>
                  <span className="text-accent-green font-bold">OPEN BY REVIEW</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800">
                <a
                  href={COMMUNITY_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs font-bold border border-zinc-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>VIEW GITHUB ORGANIZATION</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
