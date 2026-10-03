import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import {
  getAllApplicants,
  updateApplicantStatus,
  deleteApplicant,
  markApplicantWhatsAppInvited,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;

    const applicants = await getAllApplicants(status);

    return NextResponse.json({
      success: true,
      count: applicants.length,
      role: session.role,
      responses: applicants,
    });
  } catch (error) {
    console.error('Error fetching admin responses:', error);
    return NextResponse.json(
      { error: 'Server error retrieving form responses.' },
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

    const body = await req.json();
    const { id, status, whatsapp_invited } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Applicant ID is required.' },
        { status: 400 }
      );
    }

    // Handle marking WhatsApp invite sent
    if (whatsapp_invited === true) {
      const updated = await markApplicantWhatsAppInvited(id);
      if (!updated) {
        return NextResponse.json(
          { error: 'Applicant record not found.' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Applicant marked as WhatsApp invited.',
        applicant: updated,
      });
    }

    // Handle status update (Approve / Decline / Reset to Pending)
    if (!status || typeof status !== 'string') {
      return NextResponse.json(
        { error: 'Valid status is required.' },
        { status: 400 }
      );
    }

    const normalizedStatus = status.toLowerCase().trim();
    const allowed = ['pending', 'approved', 'declined'];

    if (!allowed.includes(normalizedStatus)) {
      return NextResponse.json(
        { error: `Invalid status "${status}". Allowed values: ${allowed.join(', ')}` },
        { status: 400 }
      );
    }

    const updated = await updateApplicantStatus(id, normalizedStatus);

    if (!updated) {
      return NextResponse.json(
        { error: 'Applicant record not found or could not be updated.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Applicant status successfully changed to ${normalizedStatus}.`,
      applicant: updated,
    });
  } catch (error) {
    console.error('Error updating applicant status:', error);
    return NextResponse.json(
      { error: 'Server error updating applicant status.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return PATCH(req);
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

    // RBAC: Only Founder can permanently delete responses
    if (session.role !== 'founder') {
      return NextResponse.json(
        {
          error:
            'Forbidden. Deleting responses is restricted to Founder only. Admin accounts cannot delete responses.',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Applicant ID is required for deletion.' },
        { status: 400 }
      );
    }

    const success = await deleteApplicant(id);

    return NextResponse.json({
      success,
      message: success
        ? 'Response deleted successfully.'
        : 'Applicant not found or already deleted.',
    });
  } catch (error) {
    console.error('Error deleting response:', error);
    return NextResponse.json(
      { error: 'Server error deleting response.' },
      { status: 500 }
    );
  }
}
