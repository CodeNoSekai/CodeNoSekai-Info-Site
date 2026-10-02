# CodeNoSekai — Technical Architecture & Engineering

Migrate the existing CodeNoSekai website from:

* HTML
* CSS
* JavaScript

to:

* Next.js
* React
* TypeScript
* Tailwind CSS

Use:

* shadcn/ui
* Radix UI
* React Bits
* Motion / Framer Motion

---

# 1. Architecture

Create a clean, maintainable Next.js architecture.

Suggested structure:

```text
app/
├── page.tsx
├── layout.tsx
├── globals.css
├── admin/
│   ├── login/
│   │   └── page.tsx
│   └── page.tsx
├── join/
│   └── page.tsx
└── api/
    ├── ...
    └── admin/
        └── ...

components/
├── layout/
├── navigation/
├── hero/
├── community/
├── founder/
├── members/
├── projects/
├── join/
├── admin/
└── ui/

lib/
├── github/
├── auth/
├── data/
└── utils/
```

Adapt this structure if the existing project requires something different.

Do not create unnecessary abstractions.

---

# 2. Server Components

Use React Server Components whenever possible.

Only use:

```text
"use client"
```

when client-side behavior is actually required.

Examples requiring client components:

* Search
* Filters
* Interactive navigation
* Animations
* Form interactions
* Admin UI interactions

---

# 3. GitHub Integration

GitHub is the source of truth for dynamic repository data.

Check:

```bash
gh auth status
```

Use GitHub CLI/API during development to inspect the organization.

For production:

* Keep GitHub API access server-side
* Never expose tokens
* Never expose authenticated API requests to the browser
* Use environment variables
* Cache/revalidate data

---

# 4. Repository Discovery

Fetch CodeNoSekai repositories.

Collect:

* Name
* URL
* Description
* Language
* Stars
* Forks
* Topics
* Updated date
* Archived status where useful

Do not manually duplicate repository statistics.

---

# 5. GitHub Caching

Do not call GitHub on every browser request.

Use Next.js server-side caching/revalidation.

The website should remain usable if GitHub temporarily fails.

Create a graceful fallback.

---

# 6. Avatar System

For known usernames:

```text
https://github.com/{username}.png
```

Example:

```text
https://github.com/ahmmikun.png
```

GitHub links:

```text
https://github.com/{username}
```

Use Next.js image optimization where appropriate.

Provide fallback avatars for missing/broken images.

---

# 7. Static Community Data

Store community-controlled member data separately from components.

For example:

```text
data/members.ts
```

Structure the data cleanly:

```ts
{
  name: "Salman Ahmad",
  username: "ahmmikun",
  role: "founder",
  visibility: "public"
}
```

Do not place the entire member dataset directly inside JSX.

---

# 8. Dynamic vs Static Data

Static:

* Founder
* Member roles
* Display names
* Community links
* Community structure

Dynamic:

* GitHub repositories
* Stars
* Forks
* Languages
* Topics
* Repository descriptions

Keep these responsibilities separate.

---

# 9. Environment Variables

Use `.env.local`.

Example:

```env
ADMIN_USERNAME=
ADMIN_PASSWORD=
```

If GitHub credentials are required, they must remain server-side.

Never use:

```text
NEXT_PUBLIC_ADMIN_PASSWORD
```

or any equivalent client-exposed secret.

Create `.env.example` containing only variable names/placeholders.

---

# 10. Security

Audit:

* API routes
* Admin endpoints
* Authentication
* Cookies
* Environment variables
* XSS
* Unsafe HTML
* GitHub API access
* Sensitive data exposure

Never return:

* Passwords
* Tokens
* GitHub credentials
* Private API responses

---

# 11. Performance

Optimize:

* Images
* Fonts
* JavaScript
* API requests
* GitHub calls
* Animations
* Rendering

Prefer:

* Server components
* Cached data
* Lazy loading
* Optimized images

Avoid unnecessary client state.

---

# 12. SEO

Implement Next.js metadata:

* Title
* Description
* Open Graph
* Twitter/X
* Canonical URL
* Favicon

Suggested title:

```text
CodeNoSekai — Developer Community
```

---

# 13. Error Handling

Handle:

* GitHub API failure
* Broken avatar
* Missing repository description
* Form errors
* Authentication errors
* Missing data

Do not show stack traces to users.

---

# 14. Accessibility

Use:

* Semantic HTML
* Keyboard navigation
* Focus states
* ARIA where necessary
* Accessible forms
* Good contrast
* Proper image alt text

---

# 15. Engineering Principles

Follow:

* KISS
* DRY where useful
* Clear naming
* Small reusable components
* Strong TypeScript typing
* Minimal dependencies
* No unnecessary architecture

Do not overengineer the project.
