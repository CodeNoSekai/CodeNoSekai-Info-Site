import { MessageSquare, ExternalLink, Radio, Users2, Lock } from 'lucide-react';
import GithubIcon from '@/components/ui/GithubIcon';
import { COMMUNITY_LINKS } from '@/data/community';

export default function ChannelsSection() {
  return (
    <section id="community" className="py-16 md:py-24 border-b-2 border-border bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-accent-cyan border border-white" />
            <span className="font-mono text-xs uppercase tracking-widest text-accent-cyan font-bold">
              05 // OFFICIAL COMMUNICATION
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Connect & Collaborate
          </h2>
          <p className="text-zinc-400 font-sans text-sm mt-2">
            Official community channels for project announcements, open discussion, and development updates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* GitHub Org */}
          <a
            href={COMMUNITY_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-card p-6 flex flex-col justify-between group hover:border-white transition-all"
          >
            <div>
              <div className="w-12 h-12 border-2 border-white bg-black flex items-center justify-center mb-6 shadow-brutal-sm text-white group-hover:bg-accent-green group-hover:text-black transition-colors">
                <GithubIcon className="w-6 h-6" />
              </div>
              <span className="brutal-badge text-accent-green border-accent-green text-[10px]">
                OFFICIAL REPO
              </span>
              <h3 className="font-mono font-bold text-lg text-white mt-3 mb-1">
                GitHub Org
              </h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Code repositories, issues, PR discussions, and open-source packages.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-300 group-hover:text-white font-bold">
              <span>EXPLORE GITHUB</span>
              <ExternalLink className="w-4 h-4 text-accent-green" />
            </div>
          </a>

          {/* WhatsApp Channel */}
          <a
            href={COMMUNITY_LINKS.whatsappChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-card p-6 flex flex-col justify-between group hover:border-white transition-all"
          >
            <div>
              <div className="w-12 h-12 border-2 border-white bg-black flex items-center justify-center mb-6 shadow-brutal-sm text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                <Radio className="w-6 h-6" />
              </div>
              <span className="brutal-badge text-emerald-400 border-emerald-400 text-[10px]">
                BROADCAST
              </span>
              <h3 className="font-mono font-bold text-lg text-white mt-3 mb-1">
                WhatsApp Channel
              </h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Real-time announcements, major releases, tech drops, and community updates.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-300 group-hover:text-white font-bold">
              <span>JOIN CHANNEL</span>
              <ExternalLink className="w-4 h-4 text-emerald-400" />
            </div>
          </a>

          {/* WhatsApp Community */}
          <a
            href={COMMUNITY_LINKS.whatsappCommunity}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-card p-6 flex flex-col justify-between group hover:border-white transition-all"
          >
            <div>
              <div className="w-12 h-12 border-2 border-white bg-black flex items-center justify-center mb-6 shadow-brutal-sm text-accent-cyan group-hover:bg-accent-cyan group-hover:text-black transition-colors">
                <Users2 className="w-6 h-6" />
              </div>
              <span className="brutal-badge text-accent-cyan border-accent-cyan text-[10px]">
                DISCUSSION
              </span>
              <h3 className="font-mono font-bold text-lg text-white mt-3 mb-1">
                WhatsApp Group
              </h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Developer networking, peer code reviews, troubleshooting, and collaboration.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-300 group-hover:text-white font-bold">
              <span>ENTER CHAT</span>
              <ExternalLink className="w-4 h-4 text-accent-cyan" />
            </div>
          </a>

          {/* Discord (Icon shown, but no fake link as required) */}
          <div className="brutal-card p-6 flex flex-col justify-between opacity-85 border-dashed border-zinc-700 bg-surface/50">
            <div>
              <div className="w-12 h-12 border-2 border-zinc-600 bg-black flex items-center justify-center mb-6 shadow-brutal-sm text-indigo-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="brutal-badge text-zinc-400 border-zinc-600 text-[10px]">
                IN PLANNING
              </span>
              <h3 className="font-mono font-bold text-lg text-zinc-300 mt-3 mb-1">
                Discord Server
              </h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Dedicated audio rooms, workshop stages, and bot testing channels scheduled for launch.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-500">
              <span className="italic">COMING SOON</span>
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
