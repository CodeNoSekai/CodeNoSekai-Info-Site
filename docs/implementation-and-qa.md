# CodeNoSekai — Implementation, Performance & QA

This document defines how the redesign should be implemented and verified.

---

# 1. Implementation Order

Follow this sequence.

## Phase 1 — Audit

Inspect the existing project.

Understand:

* Architecture
* Form
* Admin
* APIs
* Data
* Dependencies
* Deployment

---

## Phase 2 — GitHub Discovery

Run:

```bash
gh auth status
```

Inspect CodeNoSekai.

Discover repositories and useful organization data.

Do not invent data.

---

## Phase 3 — Migration

Move the application to:

* Next.js
* React
* TypeScript
* Tailwind

Preserve required functionality.

---

## Phase 4 — Design System

Implement:

* Black/white colors
* Typography
* Borders
* Shadows
* Buttons
* Cards
* Inputs
* Navigation
* Layout
* Responsive system

---

## Phase 5 — Main Website

Implement:

* Navigation
* Hero
* Statistics
* Founder
* Admins
* Members
* Community links
* Projects
* Join section
* Footer

---

## Phase 6 — Join Form

Redesign the existing join form.

Keep working submission behavior.

Improve:

* UX
* Validation
* Accessibility
* Responsive behavior

---

## Phase 7 — Admin

Implement:

```text
/admin/login
/admin
```

with secure authentication.

Remove approval/rejection workflow.

---

## Phase 8 — GitHub Integration

Implement:

* Repository discovery
* Repository cards
* GitHub avatars
* GitHub profile links

Use server-side fetching and caching.

---

# 2. Responsive QA

Test:

```text
320px
375px
390px
430px
768px
1024px
1280px
1440px+
```

Check:

* Navigation
* Hero
* Member grid
* Project grid
* Form
* Admin table
* Dialogs
* Typography
* Images

There must be no accidental horizontal overflow.

---

# 3. Functional Testing

Verify:

### Navigation

* All links work
* Mobile navigation works

### Members

* Avatars load
* GitHub links work
* Missing usernames do not generate fake links

### Community links

* GitHub works
* WhatsApp Channel works
* WhatsApp Community works
* Discord icon does not point to a fake URL

### Projects

* Repository data loads
* GitHub links work
* Missing metadata does not break UI

### Form

* Validation works
* Successful submission works
* Error state works

### Admin

* Login works
* Invalid credentials fail
* Protected route works
* Responses load
* Logout works
* Logged-out users cannot access admin data

---

# 4. Build Verification

Run:

```bash
npm run build
```

Also run:

```bash
npm run lint
```

if available.

Fix all:

* TypeScript errors
* Build errors
* Lint errors
* Runtime errors

---

# 5. Browser QA

Run the development server.

Manually inspect:

```text
/
 /join
 /admin/login
 /admin
```

Check the browser console.

There should be no implementation-caused errors.

---

# 6. Performance

Optimize:

* Initial JavaScript
* Images
* Fonts
* GitHub requests
* Client components
* Animations
* API calls

Avoid unnecessary dependencies.

Do not fetch the same GitHub data repeatedly.

Use caching/revalidation.

---

# 7. Accessibility QA

Check:

* Keyboard navigation
* Focus states
* Screen-reader labels
* Button labels
* Image alt text
* Form labels
* Contrast
* Semantic HTML

---

# 8. Security QA

Check for:

* Hardcoded passwords
* Exposed environment variables
* Public admin APIs
* Insecure cookies
* Client-side authentication
* XSS
* Sensitive GitHub data exposure

Make sure:

```text
.env.local
```

is ignored by Git.

---

# 9. Final Design QA

Ask:

Does the website look like:

```text
A real developer community?
```

rather than:

```text
An AI-generated SaaS template?
```

The final design should have:

* Strong identity
* Brutalist character
* Good typography
* High contrast
* Intentional spacing
* Useful motion
* Strong responsive behavior

---

# 10. Final Quality Bar

The website must be:

* Production-ready
* Fast
* Responsive
* Secure
* Accessible
* SEO-friendly
* Maintainable

Use real CodeNoSekai data.

Do not invent:

* Members
* Projects
* GitHub usernames
* Statistics
* Discord links
* Testimonials
* Descriptions

If information is unavailable, handle it gracefully instead of making it up.

---

# 11. Completion Requirement

Do not consider the project complete until:

1. The application builds successfully.
2. The major routes work.
3. The form works.
4. Admin authentication works.
5. Admin responses are protected.
6. GitHub project data works.
7. Member profiles work.
8. Mobile layout works.
9. Desktop layout works.
10. No obvious security issues remain.
11. No major console errors remain.
12. The final UI matches the CodeNoSekai brutalist design direction.
