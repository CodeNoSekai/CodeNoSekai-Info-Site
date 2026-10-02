import React from 'react';
import { Star, GitFork, ExternalLink, FolderGit2, Calendar, ShieldAlert } from 'lucide-react';
import { RepositoryData } from '@/data/community';

interface ProjectsSectionProps {
  repositories: RepositoryData[];
}

export default function ProjectsSection({ repositories }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-16 md:py-24 border-b-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 bg-accent-green border border-white" />
              <span className="font-mono text-xs uppercase tracking-widest text-accent-green font-bold">
                04 // OPEN SOURCE ECOSYSTEM
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Community Projects & Tools
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-400 max-w-sm">
            Live repositories directly synced from the GitHub Organization with cached revalidation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo, idx) => (
            <div
              key={idx}
              className="brutal-card p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="p-2 border border-zinc-700 bg-surface text-accent-green">
                    <FolderGit2 className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-2">
                    {repo.language && (
                      <span className="brutal-badge text-white border-zinc-700 bg-zinc-900 text-[10px]">
                        {repo.language}
                      </span>
                    )}
                    {repo.isArchived && (
                      <span className="brutal-badge text-amber-400 border-amber-500 bg-amber-500/10 text-[10px]">
                        ARCHIVED
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-mono font-bold text-lg text-white group-hover:text-accent-green transition-colors break-words">
                  {repo.name}
                </h3>

                <p className="text-sm text-zinc-400 mt-2 font-sans line-clamp-3 leading-relaxed">
                  {repo.description || 'No description provided for this repository.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-4 font-mono text-xs text-zinc-400">
                  <span className="flex items-center gap-1 hover:text-white transition-colors">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{repo.stars}</span>
                  </span>
                  <span className="flex items-center gap-1 hover:text-white transition-colors">
                    <GitFork className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{repo.forks}</span>
                  </span>
                </div>

                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>Repository</span>
                  <ExternalLink className="w-3.5 h-3.5 text-accent-green" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-4 border border-zinc-800 bg-surface/40 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <span className="text-zinc-400">
            WANT TO CONTRIBUTE CODE OR PROPOSE A NEW REPO?
          </span>
          <a
            href="https://github.com/CodeNoSekai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-accent-green font-bold flex items-center gap-1.5 underline underline-offset-4"
          >
            <span>GITHUB.COM/CODENOSEKAI</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
