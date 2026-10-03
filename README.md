<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:050814,50:00E5FF,100:00F5A0&height=220&section=header&text=CodeNoSekai&fontSize=48&fontColor=ffffff&fontFamily=Inter&animation=twinkling" width="100%" alt="CodeNoSekai Banner"/>

  <p align="center">
    <strong>A collaborative ecosystem for developers building next-generation AI bots, full-stack applications, and open-source tools.</strong>
  </p>

  <p align="center">
    <a href="https://github.com/CodeNoSekai/CodeNoSekai-Info-Site/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-00F5A0.svg?style=for-the-badge&logo=opensourceinitiative&logoColor=black" alt="License: MIT"/>
    </a>
    <a href="https://nextjs.org/">
      <img src="https://img.shields.io/badge/Next.js-15-black.svg?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15"/>
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5.4-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
    </a>
    <a href="https://www.mongodb.com/">
      <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
    </a>
    <a href="https://github.com/CodeNoSekai/CodeNoSekai-Info-Site/pulls">
      <img src="https://img.shields.io/badge/PRs-Welcome-00E5FF.svg?style=for-the-badge&logo=github" alt="PRs Welcome"/>
    </a>
  </p>

  <p align="center">
    <a href="#-about-codenosekai">About</a> •
    <a href="#-key-features">Key Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-environment-variables">Environment</a> •
    <a href="#-project-structure">Structure</a> •
    <a href="#-community--leadership">Community</a> •
    <a href="#-license">License</a>
  </p>

</div>

---

## 📖 About CodeNoSekai

**CodeNoSekai** (*World of Code*) is an energetic international developer collective. We bring together developers, bot architects, designers, and systems engineers to learn, collaborate, and ship high-impact open-source software.

This repository powers the official **CodeNoSekai Community Portal**, featuring our member directory, open-source projects, developer onboarding application pipeline, and an administrative control panel.

---

## ✨ Key Features

- **🌐 Modern Cyber-Dark Aesthetic**: Crafted with dark glassmorphism, responsive CSS grid layouts, glowing neon accents, and smooth transitions powered by Framer Motion.
- **👥 Interactive Member Directory**: Showcases community Founders, Admins, and Members with live GitHub avatars, badges, roles, and profiles.
- **📝 Seamless Onboarding & Join Form (`/join`)**: Interactive applicant submission form validating developer details, programming languages, GitHub profiles, and project interests directly into MongoDB.
- **🛡️ Role-Based Admin Dashboard (`/admin`)**:
  - Secure credential-based authentication separating Founder and Admin privileges.
  - Review applicant submissions with instant one-click **Approve** or **Decline** actions.
  - Generates secure WhatsApp community invite links for approved candidates.
  - Manage member roster, search applicants, and inspect submission details.
- **📦 Dynamic GitHub Repositories Showcase**: Fetches repository stats, stars, forks, and programming languages live using the GitHub REST API, with built-in fallback data for zero downtime.
- **⚡ High Performance & SEO Ready**: Built on Next.js 15 App Router with server-side rendering, OpenGraph social meta tags, and optimized asset delivery.

---

## 🛠 Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) | React framework with App Router, API routes, and Server Components |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type safety and enhanced developer experience |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS with cyber-dark custom theme tokens |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Smooth UI transitions, interactive cards, and page motion |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, lightweight SVG icon system |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) | Document database for applicants and member data |
| **Deployment** | [Vercel](https://vercel.com/) / Node Server | Optimized cloud hosting & serverless edge runtime |

---

## 📂 Project Structure

```text
CodeNoSekai-Info-Site/
├── app/
│   ├── admin/               # Admin dashboard and authentication page
│   ├── api/                 # API route handlers (admin, join, members, repos)
│   ├── join/                # Join application page for new members
│   ├── globals.css          # Global styling, cyberpunk glow utilities, scrollbars
│   ├── layout.tsx           # Root layout with SEO metadata & dark theme
│   └── page.tsx             # Main landing page (hero, repos, members, CTA)
├── components/
│   ├── admin/               # Admin panel tabs, applicant cards, approval actions
│   ├── join/                # Multi-step applicant form components & validation
│   ├── ui/                  # Reusable UI elements (cards, buttons, modals, badges)
│   ├── Footer.tsx           # Global footer with community & social links
│   ├── Navbar.tsx           # Sticky responsive navigation with mobile drawer
│   ├── ProjectsSection.tsx  # Dynamic GitHub repositories showcase
│   └── TeamSection.tsx      # Core leadership & community member grid
├── data/
│   ├── community.ts         # Community social links, WhatsApp URLs, fallback repos
│   └── members.ts           # Core member registry, admin roster, and roles
├── InfoDeveloper/           # Individual developer bio markdown files
├── lib/
│   ├── auth.ts              # Authentication & session token management
│   ├── db.ts                # MongoDB connection singleton & caching
│   └── models/              # Mongoose schemas (Application, Member, etc.)
├── public/                  # Static assets, logos, and icons
├── docs/                    # Design, architectural & technical specifications
├── .env.example             # Example environment configuration
├── CONTRIBUTING.md          # Contribution guidelines & workflow
├── CODE_OF_CONDUCT.md       # Community standards & Contributor Covenant
├── LICENSE                  # MIT License
└── package.json             # Project dependencies and npm scripts
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (`18.17.0` or later, Node 20+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection string or a local MongoDB database

### 1. Clone the Repository

```bash
git clone https://github.com/CodeNoSekai/CodeNoSekai-Info-Site.git
cd CodeNoSekai-Info-Site
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy `.env.example` to create your `.env` file:

```bash
cp .env.example .env
```

Fill in your configuration variables in `.env` (refer to the [Environment Variables](#-environment-variables) section below).

### 4. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser. The page reloads automatically when you edit files.

### 5. Production Build

To build and run the production application:

```bash
npm run build
npm run start
```

---

## 🔐 Environment Variables

The following environment variables are supported. Configure them in your `.env` file:

| Variable | Description | Required | Example |
| :--- | :--- | :---: | :--- |
| `NODE_ENV` | Application environment mode | Optional | `development` / `production` |
| `PORT` | Local server port | Optional | `3000` |
| `MONGODB_URI` | MongoDB connection string | **Yes** | `mongodb+srv://user:pass@cluster.mongodb.net/cns` |
| `FOUNDER_USERNAME` | Username for Founder admin access | **Yes** | `admin` |
| `FOUNDER_PASSWORD` | Password for Founder admin access | **Yes** | `StrongFounderPassword!@#` |
| `ADMIN_USERNAME` | Username for general Admin access | **Yes** | `admin` |
| `ADMIN_PASSWORD` | Password for general Admin access | **Yes** | `StrongAdminPassword!@#` |
| `SESSION_SECRET` | Secret key used to sign session cookies | **Yes** | `random-64-character-secret-string` |
| `WHATSAPP_GROUP_INVITE_URL` | Official WhatsApp Developer group invite link | **Yes** | `https://chat.whatsapp.com/inviteCode` |
| `GITHUB_TOKEN` | Personal GitHub token for higher API rate limits | Optional | `ghp_xxxxxxxxxxxxxxxxxxxx` |

---

## 🤝 Contributing

We love contributions! You can contribute in several ways:

1. **Add your developer profile**: Submit an application via the web app at `/join` or create a file in `InfoDeveloper/<your-username>.md`.
2. **Improve the code**: Pick an open issue, fix a bug, enhance the UI, or add new features.
3. **Enhance documentation**: Suggest edits or add tutorials.

Please review our [**Contributing Guide**](CONTRIBUTING.md) for full setup instructions, branching conventions, and pull request procedures.

All participants are expected to follow our [**Code of Conduct**](CODE_OF_CONDUCT.md).

---

## 👑 Community & Leadership

### Founder & Full Stack Architect
<a href="https://github.com/ahmmikun">
  <img src="https://github.com/ahmmikun.png" width="90" height="90" style="border-radius: 50%;" alt="Salman Ahmad (@ahmmikun)"/>
</a>

**Salman Ahmad ([@ahmmikun](https://github.com/ahmmikun))**  
*Visionary behind CodeNoSekai. Leading collaborative open-source ecosystems, AI bots, and modern web architectures.*

---

### Core Administrators & Team
A huge thank you to all our core administrators and contributors who maintain and support the community:

- 𝚪𝚯𝚴𝚰𝚴 ([@7thRA-ONE](https://github.com/7thRA-ONE)) — *Core Administrator & Security Lead*
- Iron Man ([@IRON-M4N](https://github.com/IRON-M4N)) — *Backend Specialist & Infra*
- Ditzzzy ([@OhMyDitzzy](https://github.com/OhMyDitzzy)) — *Full Stack & Bot Developer*
- M Zain Ul Abideen ([@ZainulabdeenOfficial](https://github.com/ZainulabdeenOfficial)) — *Frontend Lead & Tooling Creator*
- Aeon-San — *Core Systems Architect & Admin*
- haki ([@shellhaki](https://github.com/shellhaki)) — *Systems & Security Admin*
- Abraham ([@abrahamdw882](https://github.com/abrahamdw882)) — *Full Stack Engineer & Admin*

*...and all our active members and contributors across the globe!*

---

## 🌐 Community Links

Stay connected with CodeNoSekai:
- **GitHub Organization**: [https://github.com/CodeNoSekai](https://github.com/CodeNoSekai)
- **WhatsApp Community**: [Join Community Group](https://chat.whatsapp.com/KxJbywxaRpwFwMOloFufPm)
- **WhatsApp Channel**: [Follow Official Channel](https://whatsapp.com/channel/0029Vb90N7f1XquWg3QGZN36)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for complete details.

---

<div align="center">
  <sub>Built with ❤️ by the <strong>CodeNoSekai</strong> Community.</sub>
</div>
