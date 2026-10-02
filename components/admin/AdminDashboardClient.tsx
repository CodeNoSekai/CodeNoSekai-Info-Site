'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  LogOut,
  Search,
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  X,
  Eye,
  FileText,
  UserCheck,
  Layers,
  ArrowLeft,
  Trash2,
} from 'lucide-react';
import GithubIcon from '@/components/ui/GithubIcon';
import { ApplicantRecord } from '@/lib/db';
import { formatDate } from '@/lib/utils';

interface AdminDashboardProps {
  initialApplicants: ApplicantRecord[];
}

export default function AdminDashboardClient({
  initialApplicants,
}: AdminDashboardProps) {
  const router = useRouter();
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(initialApplicants);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantRecord | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteApplicant = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`Permanently delete the submission from "${name}"?`);
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/responses?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete response.');
      }
      setApplicants((prev) => prev.filter((a) => a.id !== id && a._id !== id));
      if (selectedApplicant?.id === id || selectedApplicant?._id === id) {
        setSelectedApplicant(null);
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting applicant.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredApplicants = applicants.filter((a) => {
    const query = searchQuery.toLowerCase();
    return (
      a.name.toLowerCase().includes(query) ||
      a.email.toLowerCase().includes(query) ||
      a.github.toLowerCase().includes(query) ||
      a.expertise.toLowerCase().includes(query)
    );
  });

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent-green selection:text-black">
      {/* Admin Top Navigation */}
      <header className="border-b-2 border-border bg-surface px-4 sm:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-white bg-black p-0.5 shadow-brutal-sm">
              <Image
                src="https://github.com/CodeNoSekai.png"
                alt="CodeNoSekai"
                width={40}
                height={40}
                className="object-contain"
                unoptimized
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black uppercase text-white tracking-tight">
                  CodeNoSekai / Admin
                </span>
                <span className="brutal-badge text-[10px] text-accent-green border-accent-green">
                  AUTHORIZED
                </span>
              </div>
              <p className="font-mono text-[11px] text-zinc-400">
                Form Response Inspector & Review Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700 font-mono text-xs text-zinc-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-3 py-1.5 border-2 border-red-500 bg-red-500/10 hover:bg-red-500 hover:text-black text-red-400 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-brutal-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{loggingOut ? 'EXITING...' : 'LOGOUT'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner with notice of new review-only policy */}
        <div className="border border-zinc-800 bg-surface/40 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-accent-green font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>ADMINISTRATIVE WORKFLOW: FORM RESPONSE INSPECTION</span>
            </div>
            <p className="text-zinc-400 font-sans">
              Applicant responses are reviewed directly here for talent discovery and project outreach. Old approve/reject status alteration has been phased out.
            </p>
          </div>

          <div className="shrink-0 px-3 py-1.5 border border-zinc-700 bg-zinc-900 text-white font-bold">
            TOTAL RESPONSES: {applicants.length}
          </div>
        </div>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, github..."
              className="w-full pl-9 pr-4 py-2 bg-surface border border-zinc-700 font-mono text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
            />
          </div>

          <span className="font-mono text-xs text-zinc-400">
            Showing {filteredApplicants.length} of {applicants.length} submissions
          </span>
        </div>

        {/* Responses Table / List */}
        {filteredApplicants.length === 0 ? (
          <div className="border-2 border-dashed border-zinc-800 p-12 text-center font-mono text-sm text-zinc-400">
            No applicant submissions found matching your search.
          </div>
        ) : (
          <div className="border-2 border-border bg-surface overflow-x-auto shadow-brutal">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-zinc-900 border-b-2 border-border text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Applicant</th>
                  <th className="py-3.5 px-4 font-bold">Contact</th>
                  <th className="py-3.5 px-4 font-bold">GitHub</th>
                  <th className="py-3.5 px-4 font-bold">Expertise & Exp</th>
                  <th className="py-3.5 px-4 font-bold">Submitted</th>
                  <th className="py-3.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredApplicants.map((applicant) => (
                  <tr
                    key={applicant.id}
                    className="hover:bg-zinc-900/50 transition-colors"
                  >
                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">
                        {applicant.name}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        ID: {applicant.id.substring(0, 10)}...
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-zinc-500" />
                        <span>{applicant.email}</span>
                      </div>
                      {applicant.whatsapp && (
                        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mt-0.5">
                          <Phone className="w-3 h-3 text-zinc-500" />
                          <span>{applicant.whatsapp}</span>
                        </div>
                      )}
                    </td>

                    {/* GitHub */}
                    <td className="py-3.5 px-4">
                      {applicant.github ? (
                        <a
                          href={`https://github.com/${applicant.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-accent-green hover:underline font-bold"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>@{applicant.github}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-zinc-600 italic">None</span>
                      )}
                    </td>

                    {/* Expertise & Exp */}
                    <td className="py-3.5 px-4">
                      <span className="brutal-badge text-white border-zinc-700 bg-zinc-900 text-[10px] uppercase">
                        {applicant.expertise}
                      </span>
                      <div className="text-[11px] text-zinc-400 mt-1">
                        {applicant.experience}{' '}
                        {applicant.experience === 1 ? 'Year' : 'Years'} Exp
                      </div>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-3.5 px-4 text-zinc-400">
                      {formatDate(applicant.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedApplicant(applicant)}
                          className="px-3 py-1.5 bg-white text-black font-mono text-xs font-bold hover:bg-accent-green transition-colors inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>VIEW</span>
                        </button>
                        <button
                          onClick={() => handleDeleteApplicant(applicant.id, applicant.name)}
                          disabled={deletingId === applicant.id}
                          className="px-2.5 py-1.5 border border-red-500/50 bg-red-500/10 text-red-400 font-mono text-xs font-bold hover:bg-red-500 hover:text-black transition-colors inline-flex items-center gap-1 disabled:opacity-50"
                          title="Delete response"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">
                            {deletingId === applicant.id ? '...' : 'DELETE'}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Response Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="border-2 border-white bg-surface w-full max-w-2xl p-6 sm:p-8 shadow-brutal max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent-green font-bold">
                  SUBMISSION INSPECTION // {selectedApplicant.id}
                </span>
                <h3 className="font-mono text-2xl font-black uppercase text-white">
                  {selectedApplicant.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-1.5 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3 border border-zinc-800 bg-background/50 space-y-1">
                <span className="text-zinc-500 uppercase">EMAIL ADDRESS</span>
                <div className="text-white font-bold">{selectedApplicant.email}</div>
              </div>

              <div className="p-3 border border-zinc-800 bg-background/50 space-y-1">
                <span className="text-zinc-500 uppercase">WHATSAPP NUMBER</span>
                <div className="text-white font-bold">
                  {selectedApplicant.whatsapp || 'Not provided'}
                </div>
              </div>

              <div className="p-3 border border-zinc-800 bg-background/50 space-y-1">
                <span className="text-zinc-500 uppercase">GITHUB PROFILE</span>
                <div>
                  {selectedApplicant.github ? (
                    <a
                      href={`https://github.com/${selectedApplicant.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-green font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>@{selectedApplicant.github}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-zinc-500">Not provided</span>
                  )}
                </div>
              </div>

              <div className="p-3 border border-zinc-800 bg-background/50 space-y-1">
                <span className="text-zinc-500 uppercase">EXPERTISE & EXP</span>
                <div className="text-white font-bold uppercase">
                  {selectedApplicant.expertise} ({selectedApplicant.experience} yrs)
                </div>
              </div>
            </div>

            {/* Why do you want to join? (The full message) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400 font-bold">
                <FileText className="w-4 h-4 text-accent-green" />
                <span>CANDIDATE MOTIVATION & BACKGROUND:</span>
              </div>
              <div className="p-4 border border-zinc-800 bg-background text-zinc-200 text-sm font-sans leading-relaxed whitespace-pre-wrap">
                {selectedApplicant.message || 'No response provided.'}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
              <button
                onClick={() => handleDeleteApplicant(selectedApplicant.id, selectedApplicant.name)}
                disabled={deletingId === selectedApplicant.id}
                className="px-4 py-2 border border-red-500/80 bg-red-500/10 text-red-400 font-mono text-xs font-bold hover:bg-red-500 hover:text-black transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deletingId === selectedApplicant.id ? 'DELETING...' : 'DELETE RESPONSE'}</span>
              </button>

              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-5 py-2 border-2 border-white bg-white text-black font-mono text-xs font-bold hover:bg-zinc-200"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
