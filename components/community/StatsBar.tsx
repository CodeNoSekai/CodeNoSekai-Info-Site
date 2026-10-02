import React from 'react';
import { Users, Shield, FolderGit2, Globe } from 'lucide-react';

interface StatsBarProps {
  repoCount?: number;
  totalMembers?: number;
}

export default function StatsBar({
  repoCount = 7,
  totalMembers = 35,
}: StatsBarProps) {
  const stats = [
    {
      label: 'COMMUNITY MEMBERS',
      value: `${totalMembers}`,
      sub: 'Verified Engineers',
      icon: Users,
      color: 'text-accent-green',
    },
    {
      label: 'ORGANIZATION REPOS',
      value: `${repoCount}+`,
      sub: 'Open Source Tools & APIs',
      icon: FolderGit2,
      color: 'text-accent-cyan',
    },
    {
      label: 'CORE LEADERSHIP',
      value: '8',
      sub: 'Founder & Admins',
      icon: Shield,
      color: 'text-amber-400',
    },
    {
      label: 'GLOBAL REACH',
      value: '100%',
      sub: 'Open Collaboration',
      icon: Globe,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="border-b-2 border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x-2 divide-border">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="py-6 px-4 sm:px-6 flex flex-col justify-center space-y-1"
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${s.color}`} />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-bold">
                    {s.label}
                  </span>
                </div>
                <div className="font-mono text-3xl sm:text-4xl font-black text-white">
                  {s.value}
                </div>
                <p className="font-mono text-xs text-zinc-500">{s.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
