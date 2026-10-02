export const COMMUNITY_LINKS = {
  github: 'https://github.com/CodeNoSekai',
  whatsappChannel: 'https://whatsapp.com/channel/0029Vb90N7f1XquWg3QGZN36',
  whatsappCommunity: 'https://chat.whatsapp.com/KxJbywxaRpwFwMOloFufPm',
  discord: null, // As specified in docs: no URL exists, do not invent one
  founderGithub: 'https://github.com/ahmmikun',
};

export interface RepositoryData {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string;
  isArchived: boolean;
}

export const FALLBACK_REPOSITORIES: RepositoryData[] = [
  {
    name: 'CodeNoSekai-Info-Site',
    description: 'The official modern web portal and member showcase for the CodeNoSekai developer community.',
    url: 'https://github.com/CodeNoSekai/CodeNoSekai-Info-Site',
    stars: 7,
    forks: 6,
    language: 'TypeScript',
    updatedAt: '2026-10-02T05:18:57Z',
    isArchived: false,
  },
  {
    name: 'wa-bulk-sender-template',
    description: 'WhatsApp Bulk Sender Template using Node.js, React & Socket.IO for automated team communications.',
    url: 'https://github.com/CodeNoSekai/wa-bulk-sender-template',
    stars: 5,
    forks: 2,
    language: 'JavaScript',
    updatedAt: '2025-12-07T14:12:30Z',
    isArchived: false,
  },
  {
    name: 'GitHub-Streak-Card',
    description: 'Track your coding journey in style! Showcase your GitHub streaks, contributions, and developer stats with visuals.',
    url: 'https://github.com/CodeNoSekai/GitHub-Streak-Card',
    stars: 1,
    forks: 0,
    language: 'TypeScript',
    updatedAt: '2025-10-02T09:37:24Z',
    isArchived: false,
  },
  {
    name: 'pixelify',
    description: 'Kotlin based project focusing on Android optimization and image rendering.',
    url: 'https://github.com/CodeNoSekai/pixelify',
    stars: 1,
    forks: 0,
    language: 'Kotlin',
    updatedAt: '2025-06-19T20:20:43Z',
    isArchived: false,
  },
  {
    name: 'CPP-Weather-Api',
    description: 'A repository where you can get the weather API code of CPP.',
    url: 'https://github.com/CodeNoSekai/CPP-Weather-Api',
    stars: 1,
    forks: 0,
    language: 'C++',
    updatedAt: '2025-03-13T02:31:58Z',
    isArchived: false,
  },
];
