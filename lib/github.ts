import { FALLBACK_REPOSITORIES, RepositoryData } from '@/data/community';
import { getAllProjects } from '@/lib/db';

export async function getCodeNoSekaiRepos(): Promise<RepositoryData[]> {
  let dbProjects: RepositoryData[] = [];
  try {
    const custom = await getAllProjects();
    if (Array.isArray(custom)) {
      dbProjects = custom.map((p) => ({
        name: p.name,
        description: p.description,
        url: p.url,
        stars: p.stars || 0,
        forks: p.forks || 0,
        language: p.language || 'TypeScript',
        updatedAt: p.updatedAt || new Date().toISOString(),
        isArchived: Boolean(p.isArchived),
      }));
    }
  } catch (e) {
    // fallback
  }

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'CodeNoSekai-Portfolio-Site',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch('https://api.github.com/orgs/CodeNoSekai/repos?sort=pushed&per_page=30', {
      headers,
      next: { revalidate: 3600 }, // Cache on server for 1 hour
    });

    if (!res.ok) {
      console.warn(`[GitHub API] Returned ${res.status}: ${res.statusText}. Using database/fallback data.`);
      return dbProjects.length > 0 ? dbProjects : FALLBACK_REPOSITORIES;
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return dbProjects.length > 0 ? dbProjects : FALLBACK_REPOSITORIES;
    }

    const gitHubRepos: RepositoryData[] = data
      .filter((repo: any) => !repo.name.startsWith('.') && repo.name !== '.github')
      .map((repo: any) => ({
        name: repo.name,
        description: repo.description || 'Open source initiative developed by CodeNoSekai community.',
        url: repo.html_url,
        stars: repo.stargazers_count ?? 0,
        forks: repo.forks_count ?? 0,
        language: repo.language || 'Code',
        updatedAt: repo.pushed_at || repo.updated_at,
        isArchived: Boolean(repo.archived),
      }));

    // Merge custom database projects with GitHub repos (avoiding duplicates)
    const combined = [...dbProjects];
    for (const gh of gitHubRepos) {
      const exists = combined.some(
        (p) =>
          p.name.toLowerCase() === gh.name.toLowerCase() ||
          p.url.toLowerCase() === gh.url.toLowerCase()
      );
      if (!exists) {
        combined.push(gh);
      }
    }

    return combined.length > 0 ? combined : FALLBACK_REPOSITORIES;
  } catch (error) {
    console.error('[GitHub API] Failed to fetch repos:', error);
    return dbProjects.length > 0 ? dbProjects : FALLBACK_REPOSITORIES;
  }
}

export interface OrgMetadata {
  name: string;
  description: string;
  publicRepos: number;
  followers: number;
  totalMembers: number;
  totalStars: number;
}

export async function getCodeNoSekaiOrgInfo(): Promise<OrgMetadata> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'CodeNoSekai-Portfolio-Site',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch('https://api.github.com/orgs/CodeNoSekai', {
      headers,
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      return {
        name: data.name || 'Code No Sekai Community',
        description: data.description || 'We build AI chatbots, RESTful APIs, and open-source projects.',
        publicRepos: data.public_repos || 7,
        followers: data.followers || 46,
        totalMembers: 35,
        totalStars: 15,
      };
    }
  } catch (e) {
    // fallback
  }

  return {
    name: 'Code No Sekai Community',
    description: 'We build AI chatbots, RESTful APIs, and open-source projects while fostering collaboration and learning.',
    publicRepos: 7,
    followers: 46,
    totalMembers: 35,
    totalStars: 15,
  };
}
