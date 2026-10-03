import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import {
  getAllProjects,
  addProject,
  updateProject,
  deleteProject,
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

    const projects = await getAllProjects();

    return NextResponse.json({
      success: true,
      count: projects.length,
      role: session.role,
      projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Server error retrieving projects.' },
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
        { error: 'Forbidden. Only Founder can add new projects to the website.' },
        { status: 403 }
      );
    }
    const body = await req.json();
    const { name, description, url, stars, forks, language, isArchived } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Valid project name is required (minimum 2 characters).' },
        { status: 400 }
      );
    }

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return NextResponse.json(
        { error: 'Valid project URL is required (e.g. https://github.com/...).' },
        { status: 400 }
      );
    }

    const newProject = await addProject({
      name,
      description,
      url,
      stars: Number(stars) || 0,
      forks: Number(forks) || 0,
      language: language || 'TypeScript',
      isArchived: Boolean(isArchived),
    });

    return NextResponse.json({
      success: true,
      message: 'Project successfully added to the website ecosystem.',
      project: newProject,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Server error creating project.' },
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
        { error: 'Forbidden. Only Founder can edit projects.' },
        { status: 403 }
      );
    }
    const body = await req.json();
    const { id, name, description, url, stars, forks, language, isArchived } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required.' },
        { status: 400 }
      );
    }

    const updated = await updateProject(id, {
      name,
      description,
      url,
      stars,
      forks,
      language,
      isArchived,
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Project not found or could not be updated.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully.',
      project: updated,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Server error updating project.' },
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
        { error: 'Forbidden. Only Founder can delete projects.' },
        { status: 403 }
      );
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required for deletion.' },
        { status: 400 }
      );
    }

    const success = await deleteProject(id);

    return NextResponse.json({
      success,
      message: success
        ? 'Project removed successfully.'
        : 'Project not found or already deleted.',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Server error deleting project.' },
      { status: 500 }
    );
  }
}
