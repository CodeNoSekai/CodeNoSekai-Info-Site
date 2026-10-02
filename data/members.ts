export interface Member {
  name: string;
  username?: string;
  role: 'founder' | 'admin' | 'member';
  title?: string;
  visibility: 'public' | 'private';
  bio?: string;
}

export const FOUNDER: Member = {
  name: 'Salman Ahmad',
  username: 'ahmmikun',
  role: 'founder',
  title: 'Founder & Full Stack Architect',
  visibility: 'public',
  bio: 'Visionary behind CodeNoSekai. Leading collaborative open-source ecosystems, AI bots, and modern web architectures.',
};

export const ADMINS: Member[] = [
  {
    name: '𝚪𝚯𝚴𝚰𝚴',
    username: '7thRA-ONE',
    role: 'admin',
    title: 'Core Administrator & Security Lead',
    visibility: 'public',
  },
  {
    name: 'ABRAHAM',
    username: 'abrahamdw882',
    role: 'admin',
    title: 'Full Stack Engineer & Admin',
    visibility: 'private',
  },
  {
    name: 'Aeon-San',
    role: 'admin',
    title: 'Core Systems Architect & Admin',
    visibility: 'public',
  },
  {
    name: 'Iron Man',
    username: 'IRON-M4N',
    role: 'admin',
    title: 'Backend Specialist & Infra',
    visibility: 'public',
  },
  {
    name: 'Ditzzzy',
    username: 'OhMyDitzzy',
    role: 'admin',
    title: 'Full Stack & Bot Developer',
    visibility: 'public',
  },
  {
    name: 'haki',
    username: 'shellhaki',
    role: 'admin',
    title: 'Systems & Security Admin',
    visibility: 'private',
  },
  {
    name: 'M Zain Ul Abideen',
    username: 'ZainulabdeenOfficial',
    role: 'admin',
    title: 'Frontend Lead & Tooling Creator',
    visibility: 'public',
  },
];

export const MEMBERS: Member[] = [
  {
    name: 'Alι Aryαɴ',
    username: 'AliAryanTech',
    role: 'member',
    title: 'Backend Developer',
    visibility: 'public',
  },
  {
    name: 'Siraj',
    username: 'BK9dev',
    role: 'member',
    title: 'Full Stack Developer',
    visibility: 'public',
  },
  {
    name: 'ZynXx',
    username: 'Crazynotdev',
    role: 'member',
    title: 'Software Developer',
    visibility: 'private',
  },
  {
    name: 'Daniel Scotfield',
    username: 'Danscot',
    role: 'member',
    title: 'Frontend Engineer',
    visibility: 'public',
  },
  {
    name: 'Tylor',
    username: 'Dark-Xploit',
    role: 'member',
    title: 'Security Researcher & Dev',
    visibility: 'public',
  },
  {
    name: 'Muhammad Ali',
    username: 'Dev-Muhammad-Ali',
    role: 'member',
    title: 'Full Stack Developer',
    visibility: 'private',
  },
  {
    name: 'Empire Tech Labs',
    username: 'efeurhobobullish',
    role: 'member',
    title: 'Mobile & Cloud Specialist',
    visibility: 'private',
  },
  {
    name: 'Efeurhobo Bullish',
    username: 'empiretechlabs',
    role: 'member',
    title: 'Systems Developer',
    visibility: 'public',
  },
  {
    name: 'Gul Shair',
    username: 'gulshairdev',
    role: 'member',
    title: 'Web & API Developer',
    visibility: 'public',
  },
  {
    name: 'GURU SENSEI',
    username: 'Guru322',
    role: 'member',
    title: 'Full Stack Engineer',
    visibility: 'public',
  },
  {
    name: 'Hellstar',
    username: 'hllstr',
    role: 'member',
    title: 'Backend Engineer',
    visibility: 'private',
  },
  {
    name: 'ItsReimau',
    username: 'itsreimau',
    role: 'member',
    title: 'Backend & Automation Dev',
    visibility: 'private',
  },
  {
    name: 'KING DAVID',
    username: 'KING-DAVIDX',
    role: 'member',
    title: 'Full Stack Developer',
    visibility: 'private',
  },
  {
    name: 'Kiro Fyas Zuhdi',
    username: 'KiroFyzu',
    role: 'member',
    title: 'Web Specialist',
    visibility: 'private',
  },
  {
    name: 'Kiyo Editz',
    username: 'KiyoEditz',
    role: 'member',
    title: 'UI/UX & Creative Dev',
    visibility: 'public',
  },
  {
    name: 'maomaonsk',
    username: 'lee-min-seo-official',
    role: 'member',
    title: 'Software Developer',
    visibility: 'private',
  },
  {
    name: 'Kennyy',
    username: 'M3264',
    role: 'member',
    title: 'JavaScript Developer',
    visibility: 'private',
  },
  {
    name: 'Miftah',
    username: 'miftahganzz',
    role: 'member',
    title: 'Bot & Web Developer',
    visibility: 'private',
  },
  {
    name: 'Muhammad Restu',
    username: 'MuhammadRestu999',
    role: 'member',
    title: 'Frontend Developer',
    visibility: 'public',
  },
  {
    name: 'Ace.',
    username: 'Mulandii',
    role: 'member',
    title: 'Cybersecurity Analyst & Pentester',
    visibility: 'private',
  },
  {
    name: 'Nopal Mau Makan',
    username: 'NopalDev1',
    role: 'member',
    title: 'Full Stack Developer',
    visibility: 'public',
  },
  {
    name: 'Alex',
    username: 'Paxsenix0',
    role: 'member',
    title: 'Automation & Node.js Dev',
    visibility: 'private',
  },
  {
    name: 'Ronen singha',
    username: 'Ronen6999',
    role: 'member',
    title: 'Backend Developer',
    visibility: 'public',
  },
  {
    name: 'Talha Irfan',
    username: 'talhairfandev',
    role: 'member',
    title: 'Full Stack Developer',
    visibility: 'private',
  },
  {
    name: 'WHITE444YT',
    username: 'Wota777FF',
    role: 'member',
    title: 'Mobile & Bot Engineer',
    visibility: 'private',
  },
  {
    name: 'ZEESHAN SARFRAZ',
    username: 'xeeshan-zs',
    role: 'member',
    title: 'Web & API Developer',
    visibility: 'public',
  },
  {
    name: 'Yanz Dev',
    username: 'yanzdeev',
    role: 'member',
    title: 'Bot & Backend Developer',
    visibility: 'private',
  },
];

export const ALL_COMMUNITY_MEMBERS: Member[] = [
  FOUNDER,
  ...ADMINS,
  ...MEMBERS,
];
