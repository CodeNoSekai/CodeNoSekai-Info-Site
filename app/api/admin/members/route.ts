import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import {
  getAllMembers,
  addMember,
  updateMember,
  deleteMember,
  assignMemberRole,
  getMemberByUsername,
  getApplicantById,
  MemberRole,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const members = await getAllMembers();

    return NextResponse.json({
      success: true,
      count: members.length,
      role: session.role,
      members,
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Server error retrieving members.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    if (session.role !== 'founder') {
      return NextResponse.json(
        { error: 'Forbidden. Only Founder can add member profiles to the website.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { applicantId, name, username, role, title, visibility, bio, github } = body;

    // Workflow: Add profile from approved applicant
    if (applicantId) {
      const applicant = await getApplicantById(applicantId);
      if (!applicant) {
        return NextResponse.json(
          { error: 'Applicant record not found.' },
          { status: 404 }
        );
      }

      // Extract username from GitHub or name
      const rawUser = (applicant.github || applicant.name || '').trim();
      const cleanUsername = rawUser
        .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
        .replace(/\/.*$/, '')
        .replace(/^@/, '')
        .trim();

      if (!cleanUsername) {
        return NextResponse.json(
          { error: 'Applicant has no valid GitHub username to create a profile.' },
          { status: 400 }
        );
      }

      // Check if profile with this username already exists on website
      const existing = await getMemberByUsername(cleanUsername);
      if (existing) {
        return NextResponse.json(
          {
            error: `Profile with username @${cleanUsername} already exists on the website.`,
            alreadyExists: true,
            member: existing,
          },
          { status: 409 }
        );
      }

      const newMember = await addMember({
        name: applicant.name,
        username: cleanUsername,
        role: 'member',
        title: applicant.expertise || 'Developer Member',
        visibility: 'public',
        bio:
          applicant.message ||
          `CodeNoSekai collective developer. Experience: ${applicant.experience || 1} year(s).`,
        github: cleanUsername,
      });

      return NextResponse.json({
        success: true,
        message: `Profile for @${cleanUsername} (${applicant.name}) added to website successfully!`,
        member: newMember,
      });
    }

    // Standard manual profile creation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Valid member name is required (minimum 2 characters).' },
        { status: 400 }
      );
    }

    if (username) {
      const cleanUsername = username.trim().replace(/^@/, '');
      const existing = await getMemberByUsername(cleanUsername);
      if (existing) {
        return NextResponse.json(
          {
            error: `Member profile with username @${cleanUsername} already exists on the website.`,
            alreadyExists: true,
            member: existing,
          },
          { status: 409 }
        );
      }
    }

    const newMember = await addMember({
      name,
      username,
      role,
      title,
      visibility,
      bio,
      github,
    });

    return NextResponse.json({
      success: true,
      message: 'Member profile created successfully.',
      member: newMember,
    });
  } catch (error: any) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { error: error.message || 'Server error creating member profile.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    if (session.role !== 'founder') {
      return NextResponse.json(
        { error: 'Forbidden. Only Founder can update profiles or assign roles.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, name, username, role, title, visibility, bio, github } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Member ID is required.' },
        { status: 400 }
      );
    }

    const updated = await updateMember(id, {
      name,
      username,
      role,
      title,
      visibility,
      bio,
      github,
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Member profile not found or could not be updated.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Member profile updated successfully.',
      member: updated,
    });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: 'Server error updating member profile.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    if (session.role !== 'founder') {
      return NextResponse.json(
        { error: 'Forbidden. Only Founder can delete member profiles.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Member ID is required for deletion.' },
        { status: 400 }
      );
    }

    const success = await deleteMember(id);

    return NextResponse.json({
      success,
      message: success
        ? 'Member profile removed successfully.'
        : 'Member not found or already deleted.',
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Server error deleting member profile.' },
      { status: 500 }
    );
  }
}
