# CodeNoSekai — Requirements & Project Discovery

You are working on the redesign and modernization of the **CodeNoSekai community website**.

Your first responsibility is to understand the existing project before making implementation decisions.

## 1. Existing Application

The current application is built using:

* HTML
* CSS
* JavaScript

It currently contains:

* Community website
* Member information
* Join form
* Admin panel
* Form response handling

Before modifying anything:

1. Inspect the entire repository.
2. Understand the current folder structure.
3. Identify all pages/routes.
4. Identify all existing JavaScript functionality.
5. Identify the existing join form.
6. Identify how form responses are stored.
7. Identify the current admin panel.
8. Identify any existing authentication.
9. Inspect environment variables.
10. Inspect package/dependency configuration.
11. Inspect deployment configuration.
12. Inspect existing assets.

Do not blindly rewrite the application.

Preserve useful existing functionality unless it is explicitly being replaced.

---

# 2. Target Stack

The application will ultimately use:

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Radix UI
* React Bits
* Motion / Framer Motion

The final application must be:

* Fast
* Responsive
* Accessible
* SEO-friendly
* Production-ready

---

# 3. CodeNoSekai Information

Community:

**CodeNoSekai**

GitHub:

https://github.com/CodeNoSekai

WhatsApp Channel:

https://whatsapp.com/channel/0029Vb90N7f1XquWg3QGZN36

WhatsApp Community:

https://chat.whatsapp.com/KxJbywxaRpwFwMOloFufPm

Founder:

**Salman Ahmad**

GitHub username:

**ahmmikun**

---

# 4. GitHub Organization Discovery

The CodeNoSekai GitHub organization is the primary source for dynamic project information.

Check whether GitHub CLI is authenticated:

```bash
gh auth status
```

If available, inspect the organization through GitHub CLI/API.

Discover:

* Organization information
* Public repositories
* Repository names
* Descriptions
* Languages
* Stars
* Forks
* Topics
* Activity
* Other useful public repository metadata

Do not invent GitHub information.

Do not expose GitHub credentials.

Do not expose private organization/member information on the public website.

---

# 5. Community Structure

The website must contain three major member categories:

1. Founder
2. Admins
3. Members

Founder:

| Name         | Username | Role            |
| ------------ | -------- | --------------- |
| Salman Ahmad | ahmmikun | Founder / Owner |

There are:

* 35 total accounts
* 8 owner accounts
* 27 member accounts

Since Salman Ahmad is the founder, he must not be duplicated inside the Admin section.

The remaining owners belong in the Admin section.

---

# 6. Admins

| Name              | Username             | Role  | Visibility |
| ----------------- | -------------------- | ----- | ---------- |
| 𝚪𝚯𝚴𝚰𝚴        | 7thRA-ONE            | Owner | Public     |
| ABRAHAM           | abrahamdw882         | Owner | Private    |
| Aeon-San          | Not specified        | Owner | Public     |
| Iron Man          | IRON-M4N             | Owner | Public     |
| Ditzzzy           | OhMyDitzzy           | Owner | Public     |
| haki              | shellhaki            | Owner | Private    |
| M Zain Ul Abideen | ZainulabdeenOfficial | Owner | Public     |

Do not invent a GitHub username for Aeon-San.

---

# 7. Members

| Name              | Username             | Visibility |
| ----------------- | -------------------- | ---------- |
| Alι Aryαɴ         | AliAryanTech         | Public     |
| Siraj             | BK9dev               | Public     |
| ZynXx             | Crazynotdev          | Private    |
| Daniel Scotfield  | Danscot              | Public     |
| Tylor             | Dark-Xploit          | Public     |
| Muhammad Ali      | Dev-Muhammad-Ali     | Private    |
| Empire Tech Labs  | efeurhobobullish     | Private    |
| Efeurhobo Bullish | empiretechlabs       | Public     |
| Gul Shair         | gulshairdev          | Public     |
| GURU SENSEI       | Guru322              | Public     |
| Hellstar          | hllstr               | Private    |
| ItsReimau         | itsreimau            | Private    |
| KING DAVID        | KING-DAVIDX          | Private    |
| Kiro Fyas Zuhdi   | KiroFyzu             | Private    |
| Kiyo Editz        | KiyoEditz            | Public     |
| maomaonsk         | lee-min-seo-official | Private    |
| Kennyy            | M3264                | Private    |
| Miftah            | miftahganzz          | Private    |
| Muhammad Restu    | MuhammadRestu999     | Public     |
| Ace.              | Mulandii             | Private    |
| Nopal Mau Makan   | NopalDev1            | Public     |
| Alex              | Paxsenix0            | Private    |
| Ronen singha      | Ronen6999            | Public     |
| Talha Irfan       | talhairfandev        | Private    |
| WHITE444YT        | Wota777FF            | Private    |
| ZEESHAN SARFRAZ   | xeeshan-zs           | Public     |
| Yanz Dev          | yanzdeev             | Private    |

---

# 8. Member Profile Requirements

Each profile should contain:

* Avatar
* Display name
* GitHub username where available
* GitHub icon
* GitHub profile link

GitHub avatars can be obtained using:

```text
https://github.com/{username}.png
```

Example:

```text
https://github.com/ahmmikun.png
```

GitHub profile:

```text
https://github.com/{username}
```

For missing usernames, use a fallback avatar and do not create fake links.

---

# 9. Community Links

The website must include:

### GitHub

https://github.com/CodeNoSekai

### WhatsApp Channel

https://whatsapp.com/channel/0029Vb90N7f1XquWg3QGZN36

### WhatsApp Community

https://chat.whatsapp.com/KxJbywxaRpwFwMOloFufPm

### Discord

Display a Discord icon.

There is currently no Discord URL.

Do not invent one.

---

# 10. Projects

At the end of the website, list CodeNoSekai projects.

Discover repositories from:

```text
https://github.com/CodeNoSekai
```

Use GitHub as the source of truth.

Display useful information such as:

* Repository name
* Description
* Language
* Stars
* Forks
* Topics
* GitHub URL

Do not invent descriptions or statistics.

---

# 11. Important Requirement

Before implementation, produce an internal understanding of:

* Current application
* Existing functionality
* Existing data flow
* Existing form flow
* Existing admin flow
* Existing dependencies
* Migration requirements

Then proceed to the implementation prompts defined in the other `.md` files.
