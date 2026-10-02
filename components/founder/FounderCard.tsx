import React from 'react';
import Image from 'next/image';
import { Crown, ExternalLink, Code2, Sparkles, Terminal } from 'lucide-react';
import GithubIcon from '@/components/ui/GithubIcon';
import { FOUNDER } from '@/data/members';

export default function FounderCard() {
  return (
    <section id="founder" className="py-16 md:py-24 border-b-2 border-border bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-3 h-3 bg-amber-400 border border-white" />
          <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
            01 // LEADERSHIP & ARCHITECTURE
          </span>
        </div>

        <div className="border-2 border-white bg-surface p-6 sm:p-10 shadow-brutal relative overflow-hidden">
          {/* Decorative Corner Label */}
          <div className="absolute top-0 right-0 bg-white text-black font-mono text-[11px] font-black uppercase px-3 py-1 tracking-wider">
            FOUNDER / ARCHITECT
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
            {/* Avatar Column */}
            <div className="md:col-span-4 flex flex-col items-center sm:items-start">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 border-2 border-white bg-black shadow-brutal-green">
                <Image
                  src={`https://github.com/${FOUNDER.username}.png`}
                  alt={FOUNDER.name}
                  width={208}
                  height={208}
                  className="object-cover w-full h-full"
                  unoptimized
                />
                <div className="absolute -bottom-3 -right-3 bg-amber-400 text-black p-2 border-2 border-white shadow-brutal-sm">
                  <Crown className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="brutal-badge text-amber-400 border-amber-400 bg-amber-400/10">
                  [FOUNDER]
                </span>
                <span className="brutal-badge text-accent-green border-accent-green bg-accent-green/10">
                  [OWNER]
                </span>
                <span className="brutal-badge text-accent-cyan border-accent-cyan bg-accent-cyan/10">
                  [CORE_DEV]
                </span>
              </div>
            </div>

            {/* Content Column */}
            <div className="md:col-span-8 space-y-5">
              <div className="space-y-1">
                <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                  LEAD DEVELOPER & COMMUNITY INITIATOR
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                  {FOUNDER.name}
                </h2>
                <div className="inline-flex items-center gap-2 font-mono text-sm text-accent-green font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>@{FOUNDER.username}</span>
                </div>
              </div>

              <p className="text-zinc-300 leading-relaxed text-base">
                {FOUNDER.bio ||
                  'Salman Ahmad is the founder and owner of CodeNoSekai. He architected the community to bring together ambitious software engineers, bot creators, and systems designers to build open-source products that scale.'}
              </p>

              <div className="border border-zinc-800 bg-background/60 p-4 font-mono text-xs space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Code2 className="w-4 h-4 text-accent-green" />
                  <span className="font-bold text-white">FOCUS AREAS:</span>
                  <span>AI Chatbots, Full-Stack Architecture, RESTful API Services, Node.js & TypeScript Ecosystems</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={`https://github.com/${FOUNDER.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brutal text-xs flex items-center gap-2"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>VIEW GITHUB PROFILE (@{FOUNDER.username})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <span className="font-mono text-xs text-zinc-400">
                  GitHub ID: <span className="text-white font-bold">{FOUNDER.username}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
