import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getAllApplicants, getAllMembers, getAllProjects } from '@/lib/db';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  const [applicants, members, projects] = await Promise.all([
    getAllApplicants(),
    getAllMembers(),
    getAllProjects(),
  ]);

  // Ensure plain JSON objects across the server-to-client boundary
  const plainApplicants = JSON.parse(JSON.stringify(applicants));
  const plainMembers = JSON.parse(JSON.stringify(members));
  const plainProjects = JSON.parse(JSON.stringify(projects));

  return (
    <AdminDashboardClient
      initialApplicants={plainApplicants}
      initialMembers={plainMembers}
      initialProjects={plainProjects}
      currentAdmin={{
        username: session.username,
        role: session.role,
      }}
      whatsappInviteUrl={
        process.env.WHATSAPP_GROUP_INVITE_URL ||
        'https://chat.whatsapp.com/KxJbywxaRpwFwMOloFufPm'
      }
    />
  );
}
