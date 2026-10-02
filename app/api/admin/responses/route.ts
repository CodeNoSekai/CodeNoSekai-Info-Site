import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getAllApplicants, deleteApplicant } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authed = await isAuthenticated();

    if (!authed) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const applicants = await getAllApplicants();

    return NextResponse.json({
      success: true,
      count: applicants.length,
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

export async function DELETE(req: NextRequest) {
  try {
    const authed = await isAuthenticated();

    if (!authed) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required.' },
        { status: 401 }
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
      message: success ? 'Response deleted successfully.' : 'Applicant not found or already deleted.',
    });
  } catch (error) {
    console.error('Error deleting response:', error);
    return NextResponse.json(
      { error: 'Server error deleting response.' },
      { status: 500 }
    );
  }
}
