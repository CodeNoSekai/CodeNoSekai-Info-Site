import { NextRequest, NextResponse } from 'next/server';
import { addApplicant, checkExistingEmail } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, whatsapp, github, expertise, experience, message } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Valid full name is required (minimum 2 characters).' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    // Check if email already applied
    const emailExists = await checkExistingEmail(email);
    if (emailExists) {
      return NextResponse.json(
        { error: 'An application has already been submitted with this email address.' },
        { status: 409 }
      );
    }

    const savedApplicant = await addApplicant({
      name: name.trim(),
      email: email.trim(),
      whatsapp: typeof whatsapp === 'string' ? whatsapp.trim() : '',
      github: typeof github === 'string' ? github.trim().replace(/^@/, '') : '',
      expertise: typeof expertise === 'string' ? expertise.trim() : 'general',
      experience: Number(experience) || 0,
      message: typeof message === 'string' ? message.trim() : '',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your application has been received successfully!',
        applicant: {
          id: savedApplicant.id,
          name: savedApplicant.name,
          created_at: savedApplicant.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred while processing your application.' },
      { status: 500 }
    );
  }
}
