import { FALLBACK_REPOSITORIES, RepositoryData } from '@/data/community';

export async function getCodeNoSekaiRepos(): Promise<RepositoryData[]> {
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
      console.warn(`[GitHub API] Returned ${res.status}: ${res.statusText}. Using fallback data.`);
      return FALLBACK_REPOSITORIES;
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return FALLBACK_REPOSITORIES;
    }

    const repos: RepositoryData[] = data
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

    return repos.length > 0 ? repos : FALLBACK_REPOSITORIES;
  } catch (error) {
    console.error('[GitHub API] Failed to fetch repos:', error);
    return FALLBACK_REPOSITORIES;
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
