'use client';

import React, { useState, useMemo } from 'react';
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
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Check,
  Users,
  FolderGit2,
  Plus,
  Edit3,
  Copy,
  Lock,
  Crown,
  MessageCircle,
  Sparkles,
  Shield,
  Star,
  GitFork,
  Send,
  UserPlus,
} from 'lucide-react';
import GithubIcon from '@/components/ui/GithubIcon';
import type { ApplicantRecord, CommunityMemberRecord, ProjectRecord, MemberRole } from '@/lib/db';
import { formatDate, normalizeStatus, type ApplicantStatus } from '@/lib/utils';

interface AdminDashboardProps {
  initialApplicants: ApplicantRecord[];
  initialMembers: CommunityMemberRecord[];
  initialProjects: ProjectRecord[];
  currentAdmin: {
    username: string;
    role: 'founder' | 'admin';
  };
  whatsappInviteUrl?: string;
}

type MainTab = 'responses' | 'members' | 'projects';
type ResponseFilterTab = 'all' | 'pending' | 'approved' | 'declined';
type MemberFilterTab = 'all' | 'founder' | 'admin' | 'member';

export default function AdminDashboardClient({
  initialApplicants,
  initialMembers,
  initialProjects,
  currentAdmin,
  whatsappInviteUrl = 'https://chat.whatsapp.com/KxJbywxaRpwFwMOloFufPm',
}: AdminDashboardProps) {
  const router = useRouter();
  const isFounder = currentAdmin.role === 'founder';
  const isSuperAdmin = isFounder;

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<MainTab>('responses');

  // Responses state
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(initialApplicants);
  const [activeResponseFilter, setActiveResponseFilter] = useState<ResponseFilterTab>('all');
  const [searchResponseQuery, setSearchResponseQuery] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantRecord | null>(null);

  // Members state
  const [members, setMembers] = useState<CommunityMemberRecord[]>(initialMembers);
  const [activeMemberFilter, setActiveMemberFilter] = useState<MemberFilterTab>('all');
  const [searchMemberQuery, setSearchMemberQuery] = useState('');
  const [editingMember, setEditingMember] = useState<CommunityMemberRecord | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<ProjectRecord[]>(initialProjects);
  const [searchProjectQuery, setSearchProjectQuery] = useState('');
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  // WhatsApp invite modal state
  const [whatsappModalApplicant, setWhatsappModalApplicant] = useState<ApplicantRecord | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [sendingInviteId, setSendingInviteId] = useState<string | null>(null);

  // Actions loading state
  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [addingProfileId, setAddingProfileId] = useState<string | null>(null);

  // Toast feedback
  const [toastNotification, setToastNotification] = useState<{
    id: number;
    type: 'success' | 'danger' | 'info';
    message: string;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'danger' | 'info' = 'info') => {
    const id = Date.now();
    setToastNotification({ id, type, message });
    setTimeout(() => {
      setToastNotification((curr) => (curr?.id === id ? null : curr));
    }, 4500);
  };

  /* =========================================================================
     1. RESPONSES COMPUTED & ACTIONS
     ========================================================================= */
  const responseCounts = useMemo(() => {
    return {
      all: applicants.length,
      pending: applicants.filter((a) => normalizeStatus(a.status) === 'pending').length,
      approved: applicants.filter((a) => normalizeStatus(a.status) === 'approved').length,
      declined: applicants.filter((a) => normalizeStatus(a.status) === 'declined').length,
    };
  }, [applicants]);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((a) => {
      const normStatus = normalizeStatus(a.status);
      if (activeResponseFilter !== 'all' && normStatus !== activeResponseFilter) {
        return false;
      }
      const query = searchResponseQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        a.name.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.github.toLowerCase().includes(query) ||
        a.expertise.toLowerCase().includes(query)
      );
    });
  }, [applicants, activeResponseFilter, searchResponseQuery]);

  const handleStatusChange = async (
    id: string,
    newStatus: 'pending' | 'approved' | 'declined',
    applicantName?: string
  ) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/responses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update response status.');
      }

      setApplicants((prev) =>
        prev.map((a) => (a.id === id || a._id === id ? { ...a, status: newStatus } : a))
      );

      if (selectedApplicant && (selectedApplicant.id === id || selectedApplicant._id === id)) {
        setSelectedApplicant((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      const nameLabel = applicantName || 'Candidate';
      if (newStatus === 'approved') {
        showToast(`${nameLabel} has been APPROVED!`, 'success');
      } else if (newStatus === 'declined') {
        showToast(`${nameLabel} has been DECLINED.`, 'danger');
      } else {
        showToast(`${nameLabel} reset to PENDING REVIEW.`, 'info');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating response status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteApplicant = async (id: string, name: string) => {
    if (!isFounder) {
      alert('Only Founder has permission to delete submissions.');
      return;
    }

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
      showToast(`Submission from "${name}" was deleted.`, 'info');
    } catch (err: any) {
      alert(err.message || 'Error deleting applicant.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddApprovedProfile = async (applicant: ApplicantRecord) => {
    if (!isFounder) {
      alert('Only Founder has permission to add member profiles to the website.');
      return;
    }

    const rawUser = (applicant.github || applicant.name || '').trim();
    const cleanUser = rawUser
      .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
      .replace(/\/.*$/, '')
      .replace(/^@/, '')
      .trim();

    if (!cleanUser) {
      alert('Candidate has no valid GitHub username.');
      return;
    }

    // Client-side quick check against existing members list
    const alreadyExists = members.some(
      (m) =>
        (m.username || '').trim().replace(/^@/, '').toLowerCase() === cleanUser.toLowerCase() ||
        (m.github || '')
          .trim()
          .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
          .replace(/\/.*$/, '')
          .replace(/^@/, '')
          .toLowerCase() === cleanUser.toLowerCase()
    );

    if (alreadyExists) {
      alert(`Profile with username @${cleanUser} already exists on the website.`);
      return;
    }

    setAddingProfileId(applicant.id);
    try {
      const res = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicantId: applicant.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 || data.alreadyExists) {
          alert(data.error || `Profile with username @${cleanUser} already exists on the website.`);
          return;
        }
        throw new Error(data.error || 'Failed to add profile to website.');
      }

      setMembers((prev) => [data.member, ...prev]);
      showToast(`Profile for @${data.member.username || data.member.name} added to website!`, 'success');
    } catch (err: any) {
      alert(err.message || 'Error adding profile to website.');
    } finally {
      setAddingProfileId(null);
    }
  };

  /* =========================================================================
     2. WHATSAPP INVITE WORKFLOW
     ========================================================================= */
  const handleOpenWhatsAppModal = (applicant: ApplicantRecord) => {
    setWhatsappModalApplicant(applicant);
    setCopiedInvite(false);
  };

  const getWhatsAppInviteMessage = (name: string) => {
    return `Hello ${name}! 🎉\n\nCongratulations! Your application to join CodeNoSekai developer collective has been APPROVED!\n\nHere is your official invite link to join our private WhatsApp developer community group:\n${whatsappInviteUrl}\n\nWelcome to the collective!`;
  };

  const handleCopyInviteMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedInvite(true);
    showToast('WhatsApp invitation text copied to clipboard!', 'success');
    setTimeout(() => setCopiedInvite(false), 3000);
  };

  const handleMarkWhatsAppInvited = async (id: string, applicantName: string) => {
    setSendingInviteId(id);
    try {
      const res = await fetch('/api/admin/whatsapp-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicantId: id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to record WhatsApp invite.');
      }

      setApplicants((prev) =>
        prev.map((a) =>
          a.id === id || a._id === id
            ? { ...a, whatsapp_invited: true, invited_at: new Date().toISOString() }
            : a
        )
      );

      if (selectedApplicant && (selectedApplicant.id === id || selectedApplicant._id === id)) {
        setSelectedApplicant((prev) =>
          prev ? { ...prev, whatsapp_invited: true, invited_at: new Date().toISOString() } : null
        );
      }

      showToast(`WhatsApp invitation for "${applicantName}" recorded as SENT!`, 'success');
    } catch (err: any) {
      alert(err.message || 'Error recording WhatsApp invite.');
    } finally {
      setSendingInviteId(null);
    }
  };

  /* =========================================================================
     3. MEMBERS COMPUTED & ACTIONS
     ========================================================================= */
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (activeMemberFilter === 'founder' && m.role !== 'founder') {
        return false;
      }
      if (activeMemberFilter === 'admin' && m.role !== 'admin') {
        return false;
      }
      if (activeMemberFilter === 'member' && m.role !== 'member') {
        return false;
      }

      const q = searchMemberQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        (m.username && m.username.toLowerCase().includes(q)) ||
        (m.title && m.title.toLowerCase().includes(q)) ||
        m.role.toLowerCase().includes(q)
      );
    });
  }, [members, activeMemberFilter, searchMemberQuery]);

  const handleSaveMember = async (memberData: Partial<CommunityMemberRecord>, isEdit: boolean) => {
    if (!isFounder) {
      alert('Only Founder can modify member profiles.');
      return;
    }

    try {
      const url = '/api/admin/members';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save member.');
      }

      if (isEdit) {
        setMembers((prev) =>
          prev.map((m) => (m.id === data.member.id || m._id === data.member.id ? data.member : m))
        );
        showToast(`Profile for "${data.member.name}" updated successfully.`, 'success');
        setEditingMember(null);
      } else {
        setMembers((prev) => [data.member, ...prev]);
        showToast(`New member "${data.member.name}" added to the community.`, 'success');
        setIsAddMemberOpen(false);
      }
    } catch (err: any) {
      alert(err.message || 'Error saving member.');
    }
  };

  const handleQuickRoleChange = async (member: CommunityMemberRecord, newRole: MemberRole) => {
    if (!isFounder) {
      alert('Only Founder can assign or remove the Admin role.');
      return;
    }

    try {
      const res = await fetch('/api/admin/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: member.id, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update member role.');
      }

      setMembers((prev) =>
        prev.map((m) => (m.id === member.id || m._id === member.id ? { ...m, role: newRole } : m))
      );
      showToast(
        `Role of "${member.name}" changed to ${newRole.toUpperCase()}.`,
        'success'
      );
    } catch (err: any) {
      alert(err.message || 'Error updating member role.');
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!isFounder) {
      alert('Only Founder can remove member profiles.');
      return;
    }

    const confirmDel = window.confirm(`Permanently remove member profile "${name}"?`);
    if (!confirmDel) return;

    try {
      const res = await fetch(`/api/admin/members?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete member.');
      }

      setMembers((prev) => prev.filter((m) => m.id !== id && m._id !== id));
      showToast(`Member "${name}" removed.`, 'info');
    } catch (err: any) {
      alert(err.message || 'Error removing member.');
    }
  };

  /* =========================================================================
     4. PROJECTS COMPUTED & ACTIONS
     ========================================================================= */
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = searchProjectQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.language && p.language.toLowerCase().includes(q))
      );
    });
  }, [projects, searchProjectQuery]);

  const handleAddProject = async (projectData: Partial<ProjectRecord>) => {
    if (!isFounder) {
      alert('Only Founder can add projects.');
      return;
    }

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add project.');
      }

      setProjects((prev) => [data.project, ...prev]);
      showToast(`Project "${data.project.name}" added to the site!`, 'success');
      setIsAddProjectOpen(false);
    } catch (err: any) {
      alert(err.message || 'Error adding project.');
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!isFounder) {
      alert('Only Founder can delete projects.');
      return;
    }

    const confirmDel = window.confirm(`Remove project "${name}" from the website?`);
    if (!confirmDel) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete project.');
      }

      setProjects((prev) => prev.filter((p) => p.id !== id && p._id !== id));
      showToast(`Project "${name}" removed.`, 'info');
    } catch (err: any) {
      alert(err.message || 'Error deleting project.');
    }
  };

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

  const renderStatusBadge = (status?: string) => {
    const norm = normalizeStatus(status);
    if (norm === 'approved') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 border border-accent-green/80 bg-accent-green/10 text-accent-green font-mono text-[11px] font-black uppercase tracking-wider shadow-brutal-sm shadow-accent-green/30">
          <CheckCircle2 className="w-3.5 h-3.5 text-accent-green" />
          <span>APPROVED</span>
        </span>
      );
    }
    if (norm === 'declined') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 border border-red-500/80 bg-red-500/10 text-red-400 font-mono text-[11px] font-black uppercase tracking-wider shadow-brutal-sm shadow-red-500/20">
          <XCircle className="w-3.5 h-3.5 text-red-400" />
          <span>DECLINED</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 border border-amber-500/80 bg-amber-500/10 text-amber-400 font-mono text-[11px] font-black uppercase tracking-wider shadow-brutal-sm shadow-amber-500/20">
        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>PENDING</span>
      </span>
    );
  };

  const renderMemberRoleBadge = (role: MemberRole) => {
    if (role === 'founder') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-purple-500/80 bg-purple-500/15 text-purple-400 font-mono text-[10px] font-black uppercase tracking-wider">
          <Crown className="w-3 h-3 text-purple-400" />
          <span>FOUNDER</span>
        </span>
      );
    }
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-cyan-500/80 bg-cyan-500/15 text-cyan-400 font-mono text-[10px] font-black uppercase tracking-wider">
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          <span>ADMIN</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-zinc-700 bg-zinc-900 text-zinc-400 font-mono text-[10px] font-bold uppercase tracking-wider">
        <span>MEMBER</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent-green selection:text-black">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed top-5 right-5 z-50 animate-bounce transition-all">
          <div
            className={`border-2 p-3 sm:p-4 font-mono text-xs font-bold shadow-brutal flex items-center gap-3 ${
              toastNotification.type === 'success'
                ? 'bg-zinc-950 border-accent-green text-accent-green'
                : toastNotification.type === 'danger'
                ? 'bg-zinc-950 border-red-500 text-red-400'
                : 'bg-zinc-950 border-white text-white'
            }`}
          >
            {toastNotification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-accent-green" />}
            {toastNotification.type === 'danger' && <XCircle className="w-4 h-4 text-red-500" />}
            {toastNotification.type === 'info' && <Sparkles className="w-4 h-4 text-white" />}
            <span>{toastNotification.message}</span>
            <button
              onClick={() => setToastNotification(null)}
              className="ml-2 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="border-b-2 border-border bg-surface px-4 sm:px-8 py-3.5 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-white bg-black p-0.5 shadow-brutal-sm shrink-0">
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
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-base font-black uppercase text-white tracking-tight">
                  CodeNoSekai / Admin
                </span>
                {isFounder ? (
                  <span className="brutal-badge text-[10px] text-accent-green border-accent-green bg-accent-green/10 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-accent-green" />
                    FOUNDER
                  </span>
                ) : (
                  <span className="brutal-badge text-[10px] text-cyan-400 border-cyan-400 bg-cyan-400/10 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    ADMIN
                  </span>
                )}
              </div>
              <p className="font-mono text-[11px] text-zinc-400">
                Logged in as <strong className="text-white">@{currentAdmin.username}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
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

      {/* Main Tab Switcher Bar */}
      <div className="border-b-2 border-border bg-zinc-950 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none font-mono text-xs uppercase">
          <button
            onClick={() => setActiveTab('responses')}
            className={`px-4 py-2 border-2 transition-all font-bold flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'responses'
                ? 'border-accent-green bg-accent-green/10 text-accent-green shadow-brutal-sm'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Form Responses</span>
            <span className="px-1.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-[10px]">
              {applicants.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 border-2 transition-all font-bold flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'members'
                ? 'border-white bg-white/10 text-white shadow-brutal-sm'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Members & Admins</span>
            <span className="px-1.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-[10px]">
              {members.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 border-2 transition-all font-bold flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'projects'
                ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-brutal-sm'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Website Projects</span>
            <span className="px-1.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-[10px]">
              {projects.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* =========================================================================
            TAB 1: FORM RESPONSES
            ========================================================================= */}
        {activeTab === 'responses' && (
          <div className="space-y-6">
            {/* Banner */}
            <div className="border border-zinc-800 bg-surface/50 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-accent-green font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CANDIDATE WORKFLOW: REVIEW, APPROVE, DECLINE & INVITE</span>
                </div>
                <p className="text-zinc-400 font-sans text-xs">
                  {isFounder
                    ? 'Founder permissions: Full access to everything. Approve, decline, permanently delete submissions, and dispatch WhatsApp group invites.'
                    : 'Admin permissions: Review responses, mark Approved/Declined, and dispatch WhatsApp group invites. (Deletion restricted to Founder).'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-1.5 border border-zinc-700 bg-zinc-900 text-zinc-300 font-mono text-xs">
                  CATEGORY: <span className="text-white font-bold uppercase">{activeResponseFilter}</span>
                </div>
              </div>
            </div>

            {/* Response Filter Tabs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400 font-bold">
                  <Filter className="w-3.5 h-3.5 text-accent-green" />
                  <span>RESPONSE FILTERS</span>
                </div>
                <div className="font-mono text-xs text-zinc-500">Select category to filter view</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <button
                  onClick={() => setActiveResponseFilter('all')}
                  className={`p-3.5 border-2 text-left font-mono transition-all relative ${
                    activeResponseFilter === 'all'
                      ? 'border-white bg-zinc-900 text-white shadow-brutal'
                      : 'border-zinc-800 bg-surface text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">All Responses</span>
                    <Users className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{responseCounts.all}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Total submissions</div>
                </button>

                <button
                  onClick={() => setActiveResponseFilter('pending')}
                  className={`p-3.5 border-2 text-left font-mono transition-all relative ${
                    activeResponseFilter === 'pending'
                      ? 'border-amber-400 bg-amber-500/10 text-white shadow-brutal'
                      : 'border-zinc-800 bg-surface text-zinc-400 hover:border-amber-500/50 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Pending Approvals
                    </span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400">{responseCounts.pending}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Awaiting decision</div>
                </button>

                <button
                  onClick={() => setActiveResponseFilter('approved')}
                  className={`p-3.5 border-2 text-left font-mono transition-all relative ${
                    activeResponseFilter === 'approved'
                      ? 'border-accent-green bg-accent-green/10 text-white shadow-brutal'
                      : 'border-zinc-800 bg-surface text-zinc-400 hover:border-accent-green/50 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent-green">
                      Approved
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-accent-green" />
                  </div>
                  <div className="text-2xl font-black text-accent-green">{responseCounts.approved}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Accepted members</div>
                </button>

                <button
                  onClick={() => setActiveResponseFilter('declined')}
                  className={`p-3.5 border-2 text-left font-mono transition-all relative ${
                    activeResponseFilter === 'declined'
                      ? 'border-red-500 bg-red-500/10 text-white shadow-brutal'
                      : 'border-zinc-800 bg-surface text-zinc-400 hover:border-red-500/50 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                      Declined
                    </span>
                    <XCircle className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-2xl font-black text-red-400">{responseCounts.declined}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Rejected submissions</div>
                </button>
              </div>
            </div>

            {/* Search bar and counter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchResponseQuery}
                  onChange={(e) => setSearchResponseQuery(e.target.value)}
                  placeholder="Search by name, email, github..."
                  className="w-full pl-9 pr-4 py-2 bg-surface border border-zinc-700 font-mono text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                />
                {searchResponseQuery && (
                  <button
                    onClick={() => setSearchResponseQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-zinc-400">
                  Showing <strong className="text-white">{filteredApplicants.length}</strong> of{' '}
                  {applicants.length} submissions
                </span>

                {(activeResponseFilter !== 'all' || searchResponseQuery) && (
                  <button
                    onClick={() => {
                      setActiveResponseFilter('all');
                      setSearchResponseQuery('');
                    }}
                    className="px-2.5 py-1 border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white font-mono text-[11px] transition-colors"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Responses Table */}
            {filteredApplicants.length === 0 ? (
              <div className="border-2 border-dashed border-zinc-800 bg-surface/30 p-12 text-center font-mono space-y-3">
                <Filter className="w-6 h-6 mx-auto text-zinc-400" />
                <p className="text-white font-bold text-sm">No applicant submissions found</p>
                <p className="text-zinc-500 text-xs">
                  {searchResponseQuery
                    ? `No results matching "${searchResponseQuery}" in ${activeResponseFilter.toUpperCase()} category.`
                    : `No responses currently in ${activeResponseFilter.toUpperCase()} category.`}
                </p>
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
                      <th className="py-3.5 px-4 font-bold text-center">Status</th>
                      <th className="py-3.5 px-4 font-bold">WhatsApp Invite</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {filteredApplicants.map((applicant) => {
                      const currentNormStatus = normalizeStatus(applicant.status);
                      const isUpdating = updatingId === applicant.id;

                      return (
                        <tr key={applicant.id} className="hover:bg-zinc-900/50 transition-colors">
                          {/* Name & ID */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-sm">{applicant.name}</div>
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
                              {applicant.experience} {applicant.experience === 1 ? 'Year' : 'Years'} Exp
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center">
                            {renderStatusBadge(applicant.status)}
                          </td>

                          {/* WhatsApp Invite Option */}
                          <td className="py-3.5 px-4">
                            {currentNormStatus === 'approved' ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleOpenWhatsAppModal(applicant)}
                                  className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/60 hover:bg-emerald-500 hover:text-black text-emerald-400 font-mono text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm"
                                  title="Send WhatsApp Group Invite"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>{applicant.whatsapp_invited ? 'RE-INVITE' : 'SEND INVITE'}</span>
                                </button>
                                {applicant.whatsapp_invited && (
                                  <span className="px-1.5 py-0.5 bg-emerald-950 border border-emerald-800 text-[9px] text-emerald-300 font-mono font-bold">
                                    SENT
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-zinc-600 text-[11px] italic">
                                Approve to invite
                              </span>
                            )}
                          </td>

                          {/* Row Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Approve Button */}
                              {currentNormStatus !== 'approved' && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(applicant.id, 'approved', applicant.name)
                                  }
                                  disabled={isUpdating}
                                  className="px-2.5 py-1.5 border border-accent-green/80 bg-accent-green/10 text-accent-green font-mono text-xs font-bold hover:bg-accent-green hover:text-black transition-all inline-flex items-center gap-1 disabled:opacity-50 shadow-sm"
                                  title="Approve applicant response"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span className="hidden xl:inline">
                                    {isUpdating ? '...' : 'APPROVE'}
                                  </span>
                                </button>
                              )}

                              {/* Add to Website Button for Approved Candidates */}
                              {currentNormStatus === 'approved' &&
                                (() => {
                                  const rawUser = (applicant.github || applicant.name || '').trim();
                                  const cleanUser = rawUser
                                    .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
                                    .replace(/\/.*$/, '')
                                    .replace(/^@/, '')
                                    .trim()
                                    .toLowerCase();
                                  const alreadyOnWebsite = members.some(
                                    (m) =>
                                      (m.username || '').trim().replace(/^@/, '').toLowerCase() === cleanUser ||
                                      (m.github || '')
                                        .trim()
                                        .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
                                        .replace(/\/.*$/, '')
                                        .replace(/^@/, '')
                                        .toLowerCase() === cleanUser
                                  );

                                  if (alreadyOnWebsite) {
                                    return (
                                      <span
                                        className="px-2 py-1.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold inline-flex items-center gap-1 shadow-sm"
                                        title={`Profile @${cleanUser} already exists on website`}
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="hidden xl:inline">ON SITE</span>
                                      </span>
                                    );
                                  }

                                  if (!isFounder) {
                                    return (
                                      <span
                                        className="p-1.5 text-zinc-700 cursor-not-allowed"
                                        title="Only Founder can add profiles to website"
                                      >
                                        <Lock className="w-3.5 h-3.5" />
                                      </span>
                                    );
                                  }

                                  return (
                                    <button
                                      onClick={() => handleAddApprovedProfile(applicant)}
                                      disabled={addingProfileId === applicant.id}
                                      className="px-2.5 py-1.5 border border-cyan-400/80 bg-cyan-400/10 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-400 hover:text-black transition-all inline-flex items-center gap-1 disabled:opacity-50 shadow-sm"
                                      title={`Add @${cleanUser} profile to the website`}
                                    >
                                      <UserPlus className="w-3.5 h-3.5" />
                                      <span className="hidden xl:inline">
                                        {addingProfileId === applicant.id ? 'ADDING...' : 'ADD PROFILE'}
                                      </span>
                                    </button>
                                  );
                                })()}

                              {/* Decline Button */}
                              {currentNormStatus !== 'declined' && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(applicant.id, 'declined', applicant.name)
                                  }
                                  disabled={isUpdating}
                                  className="px-2.5 py-1.5 border border-red-500/80 bg-red-500/10 text-red-400 font-mono text-xs font-bold hover:bg-red-500 hover:text-black transition-all inline-flex items-center gap-1 disabled:opacity-50 shadow-sm"
                                  title="Decline applicant response"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span className="hidden xl:inline">
                                    {isUpdating ? '...' : 'DECLINE'}
                                  </span>
                                </button>
                              )}

                              {/* Revert to Pending */}
                              {currentNormStatus !== 'pending' && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(applicant.id, 'pending', applicant.name)
                                  }
                                  disabled={isUpdating}
                                  className="px-2 py-1.5 border border-zinc-700 bg-zinc-900 text-zinc-400 font-mono text-xs font-bold hover:border-amber-500 hover:text-amber-400 transition-all inline-flex items-center gap-1 disabled:opacity-50"
                                  title="Reset status back to Pending"
                                >
                                  <Clock className="w-3 h-3 text-amber-400" />
                                  <span className="hidden 2xl:inline">PENDING</span>
                                </button>
                              )}

                              {/* View Details */}
                              <button
                                onClick={() => setSelectedApplicant(applicant)}
                                className="px-2.5 py-1.5 bg-white text-black font-mono text-xs font-bold hover:bg-accent-green transition-colors inline-flex items-center gap-1 shadow-brutal-sm"
                                title="View full submission details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">VIEW</span>
                              </button>

                              {/* Delete Button (Enforced: Founder only) */}
                              {isSuperAdmin ? (
                                <button
                                  onClick={() => handleDeleteApplicant(applicant.id, applicant.name)}
                                  disabled={deletingId === applicant.id}
                                  className="px-2 py-1.5 border border-zinc-800 bg-zinc-900/60 text-zinc-500 hover:text-red-400 hover:border-red-500/50 font-mono text-xs font-bold transition-colors inline-flex items-center disabled:opacity-50"
                                  title="Delete response permanently (Founder only)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span
                                  className="p-1.5 text-zinc-700 cursor-not-allowed"
                                  title="Response deletion is restricted to Founder"
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: MEMBERS & ADMINS DIRECTORY
            ========================================================================= */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Header / Actions Banner */}
            <div className="border border-zinc-800 bg-surface/50 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Users className="w-4 h-4 text-accent-green" />
                  <span>COMMUNITY MEMBERS & CORE ADMINISTRATORS</span>
                </div>
                <p className="text-zinc-400 font-sans text-xs">
                  {isFounder
                    ? 'Founder permissions: Full ability to add, edit, rename, remove profiles, and assign/remove the Admin role.'
                    : 'Admin permissions: View member profiles (Managing profiles & assigning roles is restricted to Founder).'}
                </p>
              </div>

              {isSuperAdmin && (
                <button
                  onClick={() => setIsAddMemberOpen(true)}
                  className="px-4 py-2 bg-accent-green text-black font-mono text-xs font-black uppercase hover:bg-emerald-400 transition-all shadow-brutal-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD MEMBER / ADMIN</span>
                </button>
              )}
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
                {(['all', 'founder', 'admin', 'member'] as MemberFilterTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveMemberFilter(tab)}
                    className={`px-3 py-1.5 border uppercase font-bold transition-all ${
                      activeMemberFilter === tab
                        ? 'border-white bg-white text-black'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab === 'all'
                      ? `All (${members.length})`
                      : tab === 'founder'
                      ? `Founders`
                      : tab === 'admin'
                      ? `Admins`
                      : `Members`}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchMemberQuery}
                  onChange={(e) => setSearchMemberQuery(e.target.value)}
                  placeholder="Search name, username, title..."
                  className="w-full pl-9 pr-4 py-2 bg-surface border border-zinc-700 font-mono text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            {/* Members Grid / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="border-2 border-border bg-surface p-5 flex flex-col justify-between space-y-4 hover:border-zinc-500 transition-colors shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-zinc-700 bg-black overflow-hidden shrink-0">
                          {member.avatar_url ? (
                            <Image
                              src={member.avatar_url}
                              alt={member.name}
                              width={40}
                              height={40}
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-zinc-500">
                              {member.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-mono font-bold text-white text-sm leading-tight">
                            {member.name}
                          </h4>
                          {member.username && (
                            <div className="text-[11px] text-zinc-400 font-mono">
                              @{member.username}
                            </div>
                          )}
                        </div>
                      </div>

                      {renderMemberRoleBadge(member.role)}
                    </div>

                    <div className="space-y-1.5 font-mono text-xs">
                      {member.title && (
                        <div className="text-zinc-300 font-semibold">{member.title}</div>
                      )}
                      {member.bio && (
                        <p className="text-zinc-500 font-sans text-xs line-clamp-2 leading-relaxed">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Role Switcher */}
                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2 font-mono text-xs">
                    {/* Role quick selector (Founder Only) */}
                    {isFounder && member.role !== 'founder' ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-zinc-500 uppercase">Role:</span>
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleQuickRoleChange(member, e.target.value as MemberRole)
                          }
                          className="bg-zinc-900 border border-zinc-700 text-white font-mono text-[11px] py-1 px-1.5 focus:outline-none focus:border-accent-green"
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    ) : (
                      <span className="text-[10px] text-zinc-500 uppercase">
                        Visibility: {member.visibility}
                      </span>
                    )}

                    {/* Edit & Delete Buttons */}
                    <div className="flex items-center gap-1">
                      {member.github && (
                        <a
                          href={`https://github.com/${member.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-zinc-400 hover:text-white"
                          title="Open GitHub Profile"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {isSuperAdmin ? (
                        <>
                          <button
                            onClick={() => setEditingMember(member)}
                            className="p-1.5 border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:border-white transition-colors"
                            title="Edit Member Profile"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {member.role !== 'founder' && (
                            <button
                              onClick={() => handleDeleteMember(member.id, member.name)}
                              className="p-1.5 border border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-red-400 hover:border-red-500 transition-colors"
                              title="Remove Member Profile"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      ) : (
                        <span
                          className="p-1 text-zinc-700"
                          title="Editing restricted to Founder"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: WEBSITE COMMUNITY PROJECTS
            ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Header / Actions Banner */}
            <div className="border border-zinc-800 bg-surface/50 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <FolderGit2 className="w-4 h-4" />
                  <span>COMMUNITY REPOSITORIES & ECOSYSTEM TOOLS</span>
                </div>
                <p className="text-zinc-400 font-sans text-xs">
                  {isFounder
                    ? 'Founder permissions: Add custom open-source projects or tools directly to the live website ecosystem.'
                    : 'Admin permissions: View active ecosystem projects (Project creation is restricted to Founder).'}
                </p>
              </div>

              {isSuperAdmin && (
                <button
                  onClick={() => setIsAddProjectOpen(true)}
                  className="px-4 py-2 bg-cyan-400 text-black font-mono text-xs font-black uppercase hover:bg-cyan-300 transition-all shadow-brutal-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD NEW PROJECT</span>
                </button>
              )}
            </div>

            {/* Search bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchProjectQuery}
                  onChange={(e) => setSearchProjectQuery(e.target.value)}
                  placeholder="Search project name, language, description..."
                  className="w-full pl-9 pr-4 py-2 bg-surface border border-zinc-700 font-mono text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <span className="font-mono text-xs text-zinc-400">
                Total Projects: <strong className="text-white">{projects.length}</strong>
              </span>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="border-2 border-border bg-surface p-5 flex flex-col justify-between space-y-4 hover:border-cyan-400/50 transition-colors shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2 border border-zinc-800 bg-zinc-900 text-cyan-400">
                        <FolderGit2 className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="brutal-badge text-white border-zinc-700 bg-zinc-900 text-[10px]">
                          {project.language || 'Code'}
                        </span>
                        {project.isCustom && (
                          <span className="brutal-badge text-cyan-400 border-cyan-400 bg-cyan-400/10 text-[9px]">
                            CUSTOM
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="font-mono font-bold text-white text-base leading-tight break-words">
                      {project.name}
                    </h4>

                    <p className="text-zinc-400 font-sans text-xs line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <span>{project.stars}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{project.forks}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 border border-zinc-700 text-zinc-300 hover:text-white hover:border-white font-mono text-[11px] inline-flex items-center gap-1"
                      >
                        <span>VIEW</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {isSuperAdmin && (
                        <button
                          onClick={() => handleDeleteProject(project.id, project.name)}
                          className="p-1 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-500"
                          title="Remove Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL: WHATSAPP GROUP INVITE SENDER
          ========================================================================= */}
      {whatsappModalApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="border-2 border-emerald-500 bg-surface w-full max-w-xl p-6 sm:p-7 shadow-brutal space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  WHATSAPP COMMUNITY DISPATCH
                </span>
                <h3 className="font-mono text-xl font-black uppercase text-white">
                  Invite {whatsappModalApplicant.name}
                </h3>
              </div>
              <button
                onClick={() => setWhatsappModalApplicant(null)}
                className="p-1.5 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient info */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 border border-zinc-800 bg-background/50">
                <span className="text-zinc-500 text-[10px] uppercase block">RECIPIENT NUMBER</span>
                <span className="text-white font-bold">
                  {whatsappModalApplicant.whatsapp || 'No phone provided'}
                </span>
              </div>
              <div className="p-3 border border-zinc-800 bg-background/50">
                <span className="text-zinc-500 text-[10px] uppercase block">INVITE STATUS</span>
                <span className={whatsappModalApplicant.whatsapp_invited ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {whatsappModalApplicant.whatsapp_invited ? 'INVITED PREVIOUSLY' : 'NOT INVITED YET'}
                </span>
              </div>
            </div>

            {/* Invite text preview */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-zinc-400 uppercase font-bold text-[11px] flex items-center justify-between">
                <span>INVITATION MESSAGE PREVIEW:</span>
                <span className="text-zinc-500 text-[10px]">Official Welcome Template</span>
              </label>
              <textarea
                readOnly
                rows={7}
                value={getWhatsAppInviteMessage(whatsappModalApplicant.name)}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono rounded-none leading-relaxed resize-none focus:outline-none"
              />
            </div>

            {/* Group Link reminder */}
            <div className="p-2.5 border border-emerald-500/30 bg-emerald-500/5 font-mono text-[11px] text-zinc-300 flex items-center justify-between gap-2">
              <span className="text-zinc-400 truncate">Group: {whatsappInviteUrl}</span>
              <a
                href={whatsappInviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-bold hover:underline shrink-0"
              >
                Test Link
              </a>
            </div>

            {/* Dispatch Buttons */}
            <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <button
                onClick={() =>
                  handleCopyInviteMessage(getWhatsAppInviteMessage(whatsappModalApplicant.name))
                }
                className="px-3.5 py-2 border border-zinc-700 bg-zinc-900 text-zinc-200 font-bold hover:border-white hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedInvite ? 'COPIED!' : 'COPY TEXT'}</span>
              </button>

              <div className="flex items-center gap-2">
                {whatsappModalApplicant.whatsapp && (
                  <a
                    href={`https://wa.me/${whatsappModalApplicant.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      getWhatsAppInviteMessage(whatsappModalApplicant.name)
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      handleMarkWhatsAppInvited(
                        whatsappModalApplicant.id,
                        whatsappModalApplicant.name
                      )
                    }
                    className="px-4 py-2 bg-emerald-500 text-black font-black uppercase hover:bg-emerald-400 transition-all shadow-brutal-sm flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>LAUNCH WHATSAPP</span>
                  </a>
                )}

                <button
                  onClick={() =>
                    handleMarkWhatsAppInvited(
                      whatsappModalApplicant.id,
                      whatsappModalApplicant.name
                    )
                  }
                  disabled={sendingInviteId === whatsappModalApplicant.id}
                  className="px-3.5 py-2 border border-emerald-500/60 bg-emerald-500/10 text-emerald-400 font-bold hover:bg-emerald-500 hover:text-black transition-colors"
                >
                  {sendingInviteId === whatsappModalApplicant.id
                    ? 'SAVING...'
                    : 'MARK AS INVITED'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: RESPONSE DETAIL & DECISION MODAL
          ========================================================================= */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="border-2 border-white bg-surface w-full max-w-2xl p-6 sm:p-8 shadow-brutal max-h-[90vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
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
                className="p-1.5 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Decision Banner inside Modal */}
            <div className="p-4 border-2 border-zinc-800 bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-inner">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-zinc-400 uppercase font-bold">
                  CURRENT STATUS:
                </span>
                {renderStatusBadge(selectedApplicant.status)}
              </div>

              <div className="flex items-center flex-wrap gap-2">
                {normalizeStatus(selectedApplicant.status) !== 'approved' && (
                  <button
                    onClick={() =>
                      handleStatusChange(
                        selectedApplicant.id,
                        'approved',
                        selectedApplicant.name
                      )
                    }
                    disabled={updatingId === selectedApplicant.id}
                    className="px-3.5 py-1.5 bg-accent-green text-black border-2 border-accent-green font-mono text-xs font-black uppercase hover:bg-emerald-400 transition-all shadow-brutal-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {updatingId === selectedApplicant.id ? 'UPDATING...' : 'APPROVE'}
                    </span>
                  </button>
                )}

                {normalizeStatus(selectedApplicant.status) !== 'declined' && (
                  <button
                    onClick={() =>
                      handleStatusChange(
                        selectedApplicant.id,
                        'declined',
                        selectedApplicant.name
                      )
                    }
                    disabled={updatingId === selectedApplicant.id}
                    className="px-3.5 py-1.5 bg-red-500/10 border-2 border-red-500 text-red-400 font-mono text-xs font-black uppercase hover:bg-red-500 hover:text-black transition-all shadow-brutal-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span>
                      {updatingId === selectedApplicant.id ? 'UPDATING...' : 'DECLINE'}
                    </span>
                  </button>
                )}

                {normalizeStatus(selectedApplicant.status) !== 'pending' && (
                  <button
                    onClick={() =>
                      handleStatusChange(
                        selectedApplicant.id,
                        'pending',
                        selectedApplicant.name
                      )
                    }
                    disabled={updatingId === selectedApplicant.id}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono text-xs font-bold uppercase hover:border-amber-500 hover:text-amber-400 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>RESET PENDING</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3 border border-zinc-800 bg-background/50 space-y-1">
                <span className="text-zinc-500 uppercase">EMAIL ADDRESS</span>
                <div className="text-white font-bold">{selectedApplicant.email}</div>
              </div>

              <div className="p-3 border border-zinc-800 bg-background/50 space-y-1">
                <span className="text-zinc-500 uppercase">WHATSAPP NUMBER</span>
                <div className="text-white font-bold flex items-center justify-between">
                  <span>{selectedApplicant.whatsapp || 'Not provided'}</span>
                  {normalizeStatus(selectedApplicant.status) === 'approved' && (
                    <button
                      onClick={() => handleOpenWhatsAppModal(selectedApplicant)}
                      className="text-emerald-400 hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Invite</span>
                    </button>
                  )}
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

            {/* Motivation & Background */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400 font-bold">
                <FileText className="w-4 h-4 text-accent-green" />
                <span>CANDIDATE MOTIVATION & BACKGROUND:</span>
              </div>
              <div className="p-4 border border-zinc-800 bg-background text-zinc-200 text-sm font-sans leading-relaxed whitespace-pre-wrap">
                {selectedApplicant.message || 'No response provided.'}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
              {isSuperAdmin ? (
                <button
                  onClick={() =>
                    handleDeleteApplicant(selectedApplicant.id, selectedApplicant.name)
                  }
                  disabled={deletingId === selectedApplicant.id}
                  className="px-4 py-2 border border-red-500/80 bg-red-500/10 text-red-400 font-mono text-xs font-bold hover:bg-red-500 hover:text-black transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>
                    {deletingId === selectedApplicant.id ? 'DELETING...' : 'DELETE RESPONSE'}
                  </span>
                </button>
              ) : (
                <div className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Deletion reserved for Founder</span>
                </div>
              )}

              {/* Add to Website button in modal */}
              {normalizeStatus(selectedApplicant.status) === 'approved' &&
                (() => {
                  const rawUser = (selectedApplicant.github || selectedApplicant.name || '').trim();
                  const cleanUser = rawUser
                    .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
                    .replace(/\/.*$/, '')
                    .replace(/^@/, '')
                    .trim()
                    .toLowerCase();
                  const alreadyOnWebsite = members.some(
                    (m) =>
                      (m.username || '').trim().replace(/^@/, '').toLowerCase() === cleanUser ||
                      (m.github || '')
                        .trim()
                        .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
                        .replace(/\/.*$/, '')
                        .replace(/^@/, '')
                        .toLowerCase() === cleanUser
                  );

                  if (alreadyOnWebsite) {
                    return (
                      <span className="px-3 py-1.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>PROFILE ON WEBSITE</span>
                      </span>
                    );
                  }

                  if (!isFounder) {
                    return (
                      <div className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Profile publishing reserved for Founder</span>
                      </div>
                    );
                  }

                  return (
                    <button
                      onClick={() => handleAddApprovedProfile(selectedApplicant)}
                      disabled={addingProfileId === selectedApplicant.id}
                      className="px-4 py-2 border-2 border-cyan-400 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400 hover:text-black font-mono text-xs font-bold transition-all inline-flex items-center gap-1.5 disabled:opacity-50 shadow-brutal-sm"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>
                        {addingProfileId === selectedApplicant.id
                          ? 'ADDING PROFILE...'
                          : 'ADD PROFILE TO WEBSITE'}
                      </span>
                    </button>
                  );
                })()}

              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-5 py-2 border-2 border-white bg-white text-black font-mono text-xs font-bold hover:bg-zinc-200 transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT MEMBER PROFILE (FOUNDER ONLY)
          ========================================================================= */}
      {(isAddMemberOpen || editingMember) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="border-2 border-white bg-surface w-full max-w-lg p-6 sm:p-7 shadow-brutal space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-mono text-lg font-black uppercase text-white">
                {editingMember ? `Edit Profile: ${editingMember.name}` : 'Add Community Member / Admin'}
              </h3>
              <button
                onClick={() => {
                  setIsAddMemberOpen(false);
                  setEditingMember(null);
                }}
                className="p-1 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const memberData = {
                  id: editingMember?.id,
                  name: formData.get('name') as string,
                  username: formData.get('username') as string,
                  role: formData.get('role') as MemberRole,
                  title: formData.get('title') as string,
                  visibility: formData.get('visibility') as 'public' | 'private',
                  bio: formData.get('bio') as string,
                };
                handleSaveMember(memberData, Boolean(editingMember));
              }}
              className="space-y-4 font-mono text-xs"
            >
              <div>
                <label className="text-zinc-400 uppercase font-bold block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingMember?.name || ''}
                  placeholder="e.g. Kenji Sato"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 uppercase font-bold block mb-1">
                  GitHub Username
                </label>
                <input
                  type="text"
                  name="username"
                  defaultValue={editingMember?.username || ''}
                  placeholder="e.g. kenji-sato"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 uppercase font-bold block mb-1">
                    Role *
                  </label>
                  <select
                    name="role"
                    defaultValue={editingMember?.role || 'member'}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="founder">Founder</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 uppercase font-bold block mb-1">
                    Visibility
                  </label>
                  <select
                    name="visibility"
                    defaultValue={editingMember?.visibility || 'public'}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 uppercase font-bold block mb-1">
                  Specialization / Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingMember?.title || ''}
                  placeholder="e.g. Full Stack Architect & Security Lead"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 uppercase font-bold block mb-1">
                  Bio / Summary
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  defaultValue={editingMember?.bio || ''}
                  placeholder="Short developer bio..."
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddMemberOpen(false);
                    setEditingMember(null);
                  }}
                  className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-accent-green text-black font-bold uppercase hover:bg-emerald-400 shadow-brutal-sm"
                >
                  {editingMember ? 'Update Profile' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW PROJECT (FOUNDER ONLY)
          ========================================================================= */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="border-2 border-cyan-400 bg-surface w-full max-w-lg p-6 sm:p-7 shadow-brutal space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-mono text-lg font-black uppercase text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-cyan-400" />
                Add Community Project
              </h3>
              <button
                onClick={() => setIsAddProjectOpen(false)}
                className="p-1 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddProject({
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  url: formData.get('url') as string,
                  language: formData.get('language') as string,
                  stars: Number(formData.get('stars')) || 0,
                  forks: Number(formData.get('forks')) || 0,
                });
              }}
              className="space-y-4 font-mono text-xs"
            >
              <div>
                <label className="text-zinc-400 uppercase font-bold block mb-1">
                  Project / Repository Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. quantum-bot-framework"
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-zinc-400 uppercase font-bold block mb-1">
                  Project URL *
                </label>
                <input
                  type="url"
                  name="url"
                  required
                  placeholder="https://github.com/CodeNoSekai/..."
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-400 uppercase font-bold block mb-1">
                    Primary Language
                  </label>
                  <input
                    type="text"
                    name="language"
                    defaultValue="TypeScript"
                    placeholder="TypeScript / Rust / Python"
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 uppercase font-bold block mb-1">
                    Stars
                  </label>
                  <input
                    type="number"
                    name="stars"
                    defaultValue={0}
                    min={0}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 uppercase font-bold block mb-1">
                    Forks
                  </label>
                  <input
                    type="number"
                    name="forks"
                    defaultValue={0}
                    min={0}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 uppercase font-bold block mb-1">
                  Project Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Highlight key capabilities, architectures, or goals..."
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProjectOpen(false)}
                  className="px-4 py-2 border border-zinc-700 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-400 text-black font-bold uppercase hover:bg-cyan-300 shadow-brutal-sm"
                >
                  Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
