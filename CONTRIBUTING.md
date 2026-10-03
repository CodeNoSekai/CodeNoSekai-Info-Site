# Contributing to CodeNoSekai

Thank you for your interest in contributing to **CodeNoSekai**! 🎉

CodeNoSekai is an open-source developer collective dedicated to building cutting-edge web applications, AI automation tools, and developer utilities. Whether you are adding your developer profile, fixing a bug, designing new components, or improving documentation, every contribution is warmly welcomed.

Please take a moment to review this document to understand our contribution process and guidelines.

---

## 📜 Code of Conduct

All contributors and community participants are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to ensure a respectful and inclusive environment for everyone.

---

## 🌟 Ways to Contribute

There are multiple ways you can participate in CodeNoSekai:

1. **Add Your Member Profile**:
   - **Via the Website**: Visit the live website and head over to the **[Join Us](/join)** page. Fill out your details (name, GitHub username, skills, bio, etc.) for admin review.
   - **Via Pull Request**: Add your profile markdown file under `InfoDeveloper/<github-username>.md` detailing your background, skills, and projects.
2. **Report Bugs**:
   - Check existing [GitHub Issues](https://github.com/CodeNoSekai/CodeNoSekai-Info-Site/issues) to verify if the issue has already been reported.
   - Open a new issue with a clear title, reproduction steps, expected vs. actual behavior, and environment details (browser, OS).
3. **Suggest Features & Enhancements**:
   - Open a feature request issue describing the enhancement, motivation, and potential implementation ideas.
4. **Submit Code Contributions**:
   - Implement new components, improve responsiveness, optimize database queries, or resolve open issues.
5. **Improve Documentation**:
   - Fix typos, expand guides, or document architectural decisions.

---

## 🛠️ Local Development Setup

### 1. Prerequisites

Ensure you have the following installed on your machine:
* **Node.js**: `v18.17.0` or higher (Node.js 20+ recommended)
* **npm**: `v9.0.0` or higher (or pnpm / yarn)
* **Git**: Installed and configured
* **MongoDB**: A free MongoDB Atlas cluster URI or a local MongoDB server instance

### 2. Fork & Clone the Repository

```bash
# Fork the repository on GitHub, then clone your fork:
git clone https://github.com/YOUR_USERNAME/CodeNoSekai-Info-Site.git

# Navigate into the project folder:
cd CodeNoSekai-Info-Site
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and configure your credentials:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI="your-mongodb-connection-string"

# Founder Credentials
FOUNDER_USERNAME="admin"
FOUNDER_PASSWORD="your-founder-password"

# Admin Credentials
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-admin-password"

# Session Security Secret
SESSION_SECRET="your-generated-session-secret"

# WhatsApp Group Invite Link
WHATSAPP_GROUP_INVITE_URL="https://chat.whatsapp.com/your-invite-code"

# Optional: GitHub token for higher API rate limits when fetching repos
GITHUB_TOKEN=""
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🌿 Git Workflow & Branching

1. **Keep your fork up to date**:
   ```bash
   git remote add upstream https://github.com/CodeNoSekai/CodeNoSekai-Info-Site.git
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a dedicated branch for your change**:
   Use meaningful branch names:
   * `feat/user-profile-modal` (New feature)
   * `fix/admin-pagination-bug` (Bug fix)
   * `docs/update-contributing-guide` (Documentation)
   * `refactor/db-connection-helper` (Refactor)
   * `style/navbar-mobile-animation` (Design / CSS styling)

   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Commit your changes**:
   We encourage using [Conventional Commits](https://www.conventionalcommits.org/):
   * `feat: add filter toggle to member directory`
   * `fix: prevent duplicate email submission on join form`
   * `docs: update environment variable instructions in README`
   * `refactor: optimize mongo aggregate queries for admin stats`

   ```bash
   git add .
   git commit -m "feat: add filter toggle to member directory"
   ```

---

## 📐 Coding Standards & Guidelines

* **TypeScript**: Always write fully typed code. Avoid using `any` unless strictly necessary. Define interfaces in `data/` or type helper modules.
* **Component Architecture**:
  - Keep client components minimal by adding `'use client'` only where state or interactivity is needed.
  - Reusable presentation components belong in `components/ui/` or domain folders (`components/admin/`, `components/join/`).
* **Styling**:
  - Use Tailwind CSS utility classes.
  - Follow the cyber-dark design tokens defined in `tailwind.config.ts` and `app/globals.css`.
* **Testing & Linting**:
  - Before pushing code, run the build script locally to ensure there are no TypeScript or compilation errors:
    ```bash
    npm run build
    ```

---

## 🚀 Submitting a Pull Request (PR)

1. Push your branch to your GitHub fork:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Navigate to [https://github.com/CodeNoSekai/CodeNoSekai-Info-Site](https://github.com/CodeNoSekai/CodeNoSekai-Info-Site) and click **New Pull Request**.
3. Select your branch and fill out the pull request template:
   - **Summary**: Concise description of what changed and why.
   - **Related Issues**: Reference any linked issues (e.g., `Closes #12`).
   - **Testing**: Describe how you tested the changes.
   - **Screenshots / Recordings**: If UI changes were made, attach screenshots or a screen recording.
4. Ensure your PR passes all automated checks and builds.
5. Address any feedback or requested changes promptly during code review.

---

## 💬 Community & Support

Have questions, ideas, or need guidance?
* Reach out on our [GitHub Discussions](https://github.com/CodeNoSekai/CodeNoSekai-Info-Site/discussions)
* Join the [CodeNoSekai WhatsApp Community](https://chat.whatsapp.com/KxJbywxaRpwFwMOloFufPm)
* Follow our [WhatsApp Channel](https://whatsapp.com/channel/0029Vb90N7f1XquWg3QGZN36)

Thank you for helping make CodeNoSekai a thriving place for developers worldwide! 🚀
