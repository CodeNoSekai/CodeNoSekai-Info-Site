import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Hero from '@/components/hero/Hero';
import StatsBar from '@/components/community/StatsBar';
import FounderCard from '@/components/founder/FounderCard';
import AdminsGrid from '@/components/members/AdminsGrid';
import MembersDirectory from '@/components/members/MembersDirectory';
import ProjectsSection from '@/components/projects/ProjectsSection';
import ChannelsSection from '@/components/community/ChannelsSection';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowRight, Code, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { getCodeNoSekaiRepos, getCodeNoSekaiOrgInfo } from '@/lib/github';
import { getAllMembers } from '@/lib/db';
import type { Member } from '@/data/members';

export const revalidate = 3600; // Revalidate page every hour

export default async function HomePage() {
  const [repos, orgInfo, dbMembers] = await Promise.all([
    getCodeNoSekaiRepos(),
    getCodeNoSekaiOrgInfo(),
    getAllMembers().catch(() => []),
  ]);

  const dynamicAdmins: Member[] = dbMembers
    .filter((m) => m.role === 'admin')
    .map((m) => ({
      name: m.name,
      username: m.username,
      role: 'admin',
      title: m.title,
      visibility: m.visibility as 'public' | 'private',
      bio: m.bio,
    }));

  const dynamicMembers: Member[] = dbMembers
    .filter((m) => m.role === 'member')
    .map((m) => ({
      name: m.name,
      username: m.username,
      role: 'member',
      title: m.title,
      visibility: m.visibility as 'public' | 'private',
      bio: m.bio,
    }));

  return (
    <main className="min-h-screen flex flex-col bg-background selection:bg-accent-green selection:text-black">
      <Navbar />

      <Hero />

      <StatsBar repoCount={repos.length} totalMembers={dbMembers.length > 0 ? dbMembers.length : 35} />

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 border-b-2 border-border bg-surface/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-accent-green border border-white" />
                <span className="font-mono text-xs uppercase tracking-widest text-accent-green font-bold">
                  MANIFESTO // THE COLLECTIVE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight leading-tight">
                Built By Developers, For The Global Tech Community.
              </h2>
              <p className="text-zinc-400 font-sans text-sm leading-relaxed">
                CodeNoSekai was created to solve a universal developer problem: isolation. We gather talented programmers, hackers, and creators from around the world into one unified syndicate where ideas turn into deployed software.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="brutal-card p-5">
                <Terminal className="w-6 h-6 text-accent-green mb-3" />
                <h3 className="font-mono font-bold text-white text-base mb-1">
                  Open-Source Synergy
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We launch repositories, bots, and tools under public licenses, promoting transparent peer learning and real contribution badges.
                </p>
              </div>

              <div className="brutal-card p-5">
                <Code className="w-6 h-6 text-accent-cyan mb-3" />
                <h3 className="font-mono font-bold text-white text-base mb-1">
                  Modern Tech Stacks
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Specialized in Next.js, Node.js, TypeScript, Python AI agents, automation bots, and high-performance serverless endpoints.
                </p>
              </div>

              <div className="brutal-card p-5">
                <CheckCircle2 className="w-6 h-6 text-amber-400 mb-3" />
                <h3 className="font-mono font-bold text-white text-base mb-1">
                  Peer Code Reviews
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every applicant and active contributor gets direct feedback on pull requests and system design from experienced admins.
                </p>
              </div>

              <div className="brutal-card p-5">
                <Sparkles className="w-6 h-6 text-purple-400 mb-3" />
                <h3 className="font-mono font-bold text-white text-base mb-1">
                  Verified Engineering
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  No empty hype. Every member is verified through real GitHub contributions and technical passion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership: Founder Spotlight */}
      <FounderCard />

      {/* Leadership: Admins (7 Owners) */}
      <AdminsGrid admins={dynamicAdmins.length > 0 ? dynamicAdmins : undefined} />

      {/* Full Community Roster */}
      <MembersDirectory members={dynamicMembers.length > 0 ? dynamicMembers : undefined} />

      {/* GitHub Repositories */}
      <ProjectsSection repositories={repos} />

      {/* Official Channels */}
      <ChannelsSection />

      {/* Join Community CTA Banner */}
      <section className="py-20 border-b-2 border-border bg-gradient-to-b from-surface to-background text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <span className="font-mono text-xs uppercase tracking-widest text-accent-green font-bold border border-accent-green/30 bg-accent-green/10 px-3 py-1">
            OPEN INVITATION
          </span>

          <h2 className="text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
            Ready to Build The Future with CodeNoSekai?
          </h2>

          <p className="text-zinc-300 font-sans text-base max-w-2xl mx-auto leading-relaxed">
            Whether you specialize in frontend, backend APIs, cybersecurity, AI models, or automated tooling, CodeNoSekai gives you a platform to ship with like-minded developers.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/join"
              className="btn-brutal text-sm py-3 px-8 flex items-center gap-2"
            >
              <span>SUBMIT JOIN APPLICATION</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/admin"
              className="btn-brutal-outline text-sm py-3 px-6"
            >
              ADMIN PORTAL
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
