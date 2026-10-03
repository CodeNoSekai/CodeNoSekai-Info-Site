import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return 'Recent';
  }
}

export type ApplicantStatus = 'pending' | 'approved' | 'declined';

export function normalizeStatus(status?: string): ApplicantStatus {
  if (!status) return 'pending';
  const s = status.toLowerCase().trim();
  if (s === 'approved') return 'approved';
  if (s === 'declined' || s === 'rejected') return 'declined';
  return 'pending';
}

