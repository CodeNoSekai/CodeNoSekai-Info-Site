import React from 'react';
import Image from 'next/image';
import { Shield, ExternalLink, User } from 'lucide-react';
import GithubIcon from '@/components/ui/GithubIcon';
import { ADMINS, Member } from '@/data/members';

interface AdminsGridProps {
  admins?: Member[];
}

export default function AdminsGrid({ admins }: AdminsGridProps = {}) {
  const displayAdmins = admins && admins.length > 0 ? admins : ADMINS;

  return (
    <section id="admins" className="py-16 border-b-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 bg-accent-cyan border border-white" />
              <span className="font-mono text-xs uppercase tracking-widest text-accent-cyan font-bold">
                02 // ADMINISTRATION
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Community Owners & Admins
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-400 max-w-sm">
            Core administrators driving infrastructure, project review, security, and developer relations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayAdmins.map((admin, idx) => (
            <AdminCard key={idx} admin={admin} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AdminCard({ admin }: { admin: Member }) {
  const hasGithub = Boolean(admin.username);
  const avatarUrl = hasGithub
    ? `https://github.com/${admin.username}.png`
    : null;

  return (
    <div className="brutal-card p-5 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative w-16 h-16 border-2 border-white bg-black shrink-0 overflow-hidden shadow-brutal-sm">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={admin.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-400">
                <User className="w-8 h-8 text-zinc-500" />
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="brutal-badge text-accent-cyan border-accent-cyan bg-accent-cyan/10">
              OWNER / ADMIN
            </span>
            <span
              className={`font-mono text-[10px] uppercase ${
                admin.visibility === 'public' ? 'text-accent-green' : 'text-zinc-500'
              }`}
            >
              [{admin.visibility.toUpperCase()}]
            </span>
          </div>
        </div>

        {/* Info */}
        <h3 className="font-mono font-bold text-lg text-white group-hover:text-accent-cyan transition-colors truncate">
          {admin.name}
        </h3>

        <div className="font-mono text-xs text-zinc-400 mt-1 mb-2">
          {admin.username ? (
            <span className="text-zinc-300">@{admin.username}</span>
          ) : (
            <span className="text-zinc-500 italic">No public handle</span>
          )}
        </div>

        <p className="text-xs text-zinc-400 font-sans line-clamp-2">
          {admin.title || 'Core Community Administrator'}
        </p>
      </div>

      {/* Footer / Profile Link */}
      <div className="mt-5 pt-3 border-t border-zinc-800 flex items-center justify-between">
        {hasGithub ? (
          <a
            href={`https://github.com/${admin.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors group-hover:translate-x-0.5"
          >
            <GithubIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span>GitHub Profile</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>
        ) : (
          <span className="font-mono text-[11px] text-zinc-500 italic flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Direct Admin Member
          </span>
        )}
      </div>
    </div>
  );
}
