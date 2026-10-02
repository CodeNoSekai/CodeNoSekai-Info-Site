import React from 'react';
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getAllApplicants } from '@/lib/db';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const authed = await isAuthenticated();

  if (!authed) {
    redirect('/admin/login');
  }

  const applicants = await getAllApplicants();

  return <AdminDashboardClient initialApplicants={applicants} />;
}
