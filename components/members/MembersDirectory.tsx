'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, ExternalLink, User, Filter, Users } from 'lucide-react';
import GithubIcon from '@/components/ui/GithubIcon';
import { MEMBERS, Member } from '@/data/members';

export default function MembersDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'private'>('all');

  const filteredMembers = useMemo(() => {
    return MEMBERS.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.username && m.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.title && m.title.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilter =
        filterVisibility === 'all' || m.visibility === filterVisibility;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterVisibility]);

  return (
    <section id="members" className="py-16 md:py-24 border-b-2 border-border bg-surface/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 bg-accent-green border border-white" />
              <span className="font-mono text-xs uppercase tracking-widest text-accent-green font-bold">
                03 // COMMUNITY ROSTER
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Community Members
            </h2>
            <p className="font-mono text-xs text-zinc-400 mt-1">
              Active developers, engineers, and creators registered with CodeNoSekai.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or @handle..."
                className="w-full pl-9 pr-3 py-2 bg-surface border border-zinc-700 font-mono text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
              />
            </div>

            <div className="flex border border-zinc-700 bg-surface p-1">
              <button
                onClick={() => setFilterVisibility('all')}
                className={`px-3 py-1 font-mono text-xs uppercase font-bold transition-colors ${
                  filterVisibility === 'all'
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({MEMBERS.length})
              </button>
              <button
                onClick={() => setFilterVisibility('public')}
                className={`px-3 py-1 font-mono text-xs uppercase font-bold transition-colors ${
                  filterVisibility === 'public'
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setFilterVisibility('private')}
                className={`px-3 py-1 font-mono text-xs uppercase font-bold transition-colors ${
                  filterVisibility === 'private'
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Private
              </button>
            </div>
          </div>
        </div>

        {/* Member Grid */}
        {filteredMembers.length === 0 ? (
          <div className="border border-zinc-800 bg-surface p-12 text-center">
            <p className="font-mono text-sm text-zinc-400">
              No community members found matching &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterVisibility('all');
              }}
              className="mt-4 font-mono text-xs text-accent-green hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredMembers.map((member, idx) => (
              <MemberCard key={idx} member={member} />
            ))}
          </div>
        )}

        <div className="mt-8 font-mono text-xs text-zinc-500 flex items-center justify-between">
          <span>
            SHOWING {filteredMembers.length} OF {MEMBERS.length} COMMUNITY MEMBERS
          </span>
          <span className="text-zinc-400">AVATARS SOURCE: GITHUB API</span>
        </div>
      </div>
    </section>
  );
}

function MemberCard({ member }: { member: Member }) {
  const hasUsername = Boolean(member.username);
  const avatarUrl = hasUsername ? `https://github.com/${member.username}.png` : null;

  return (
    <div className="brutal-card p-4 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="relative w-12 h-12 border-2 border-zinc-700 bg-zinc-900 shrink-0 overflow-hidden group-hover:border-white transition-colors">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={member.name}
                width={48}
                height={48}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>

          <span
            className={`font-mono text-[10px] px-1.5 py-0.5 border ${
              member.visibility === 'public'
                ? 'border-accent-green/40 text-accent-green bg-accent-green/10'
                : 'border-zinc-700 text-zinc-400 bg-zinc-900'
            }`}
          >
            {member.visibility.toUpperCase()}
          </span>
        </div>

        <h4 className="font-mono font-bold text-white text-sm group-hover:text-accent-green transition-colors truncate">
          {member.name}
        </h4>

        <div className="font-mono text-xs text-zinc-400 truncate mb-1">
          {hasUsername ? `@${member.username}` : <span className="italic text-zinc-600">Hidden</span>}
        </div>

        <p className="text-[11px] text-zinc-400 font-sans line-clamp-1">
          {member.title || 'Community Engineer'}
        </p>
      </div>

      <div className="mt-4 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between">
        {hasUsername ? (
          <a
            href={`https://github.com/${member.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] font-bold text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors group-hover:translate-x-0.5"
          >
            <GithubIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span>Profile</span>
            <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
          </a>
        ) : (
          <span className="font-mono text-[10px] text-zinc-600 italic">No link</span>
        )}
      </div>
    </div>
  );
}
