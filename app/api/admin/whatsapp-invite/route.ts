import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { markApplicantWhatsAppInvited, getApplicantById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { applicantId } = body;

    if (!applicantId) {
      return NextResponse.json(
        { error: 'Applicant ID is required.' },
        { status: 400 }
      );
    }

    const applicant = await getApplicantById(applicantId);
    if (!applicant) {
      return NextResponse.json(
        { error: 'Applicant record not found.' },
        { status: 404 }
      );
    }

    const updated = await markApplicantWhatsAppInvited(applicantId);

    const inviteUrl =
      process.env.WHATSAPP_GROUP_INVITE_URL ||
      'https://chat.whatsapp.com/KxJbywxaRpwFwMOloFufPm';

    // Build the default invite text
    const inviteMessage = `Hello ${applicant.name}! 🎉\n\nCongratulations! Your application to join CodeNoSekai developer collective has been APPROVED!\n\nHere is your official invite link to join our private WhatsApp group:\n${inviteUrl}\n\nWelcome to the collective!`;

    // Clean phone number for WhatsApp wa.me
    const cleanPhone = (applicant.whatsapp || '').replace(/[^0-9]/g, '');
    const waLink = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(inviteMessage)}`
      : null;

    return NextResponse.json({
      success: true,
      message: 'WhatsApp invitation logged successfully.',
      applicant: updated,
      inviteUrl,
      inviteMessage,
      waLink,
    });
  } catch (error) {
    console.error('Error logging WhatsApp invite:', error);
    return NextResponse.json(
      { error: 'Server error processing WhatsApp invite.' },
      { status: 500 }
    );
  }
}
