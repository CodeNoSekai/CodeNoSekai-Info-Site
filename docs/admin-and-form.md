# CodeNoSekai — Join Form & Admin System

The existing website contains a form for people who want to join CodeNoSekai.

It also contains an existing admin panel that allows admins to approve or disapprove applicants.

The admin workflow must be redesigned.

---

# 1. Existing Form

First inspect the existing form.

Understand:

* Fields
* Validation
* Submission mechanism
* API/backend
* Database/storage
* Existing response format

Do not break the underlying response functionality unnecessarily.

---

# 2. Redesigned Join Form

Redesign the existing form using the new CodeNoSekai brutalist UI.

Requirements:

* Responsive
* Accessible
* Validated
* Clear
* Fast
* Mobile-friendly
* Good error handling

The form should visually match the rest of the website.

---

# 3. Admin Workflow Change

Completely remove the old workflow where admins:

* Approve applicants
* Reject applicants
* Change membership status

The new system should simply allow administrators to inspect form responses.

There should be no:

```text
APPROVE
REJECT
ACCEPT
DISAPPROVE
```

workflow.

---

# 4. Admin Dashboard

Create a protected admin dashboard.

Suggested route:

```text
/admin
```

It should show form responses.

Display useful information such as:

* Applicant name
* GitHub username
* Form answers
* Contact/community information collected by the form
* Submission date

Responses are for administrative review only.

Do not automatically add applicants to the community member list.

Do not automatically change GitHub organization membership.

---

# 5. Admin Login

Create:

```text
/admin/login
```

The admin credentials must be stored in environment variables.

Example:

```env
ADMIN_USERNAME=
ADMIN_PASSWORD=
```

Never hardcode credentials.

Never expose them to the client.

Never use:

```text
NEXT_PUBLIC_ADMIN_USERNAME
NEXT_PUBLIC_ADMIN_PASSWORD
```

---

# 6. Authentication

Authentication must happen server-side.

Use secure sessions/cookies.

Requirements:

* HttpOnly cookie
* Secure cookie in production
* SameSite protection
* Protected admin routes
* Logout
* No localStorage authentication
* No password sent back to the browser
* No client-side hardcoded credentials

---

# 7. Protected API

If form responses are exposed through an API endpoint, that endpoint must require admin authentication.

Do not create an endpoint where anyone can retrieve form submissions.

Example concept:

```text
GET /api/admin/responses
```

must require an authenticated admin session.

---

# 8. Admin UI

The dashboard should follow the brutalist design.

Possible structure:

```text
CODENOSEKAI / ADMIN

FORM RESPONSES
────────────────────────────

12 RESPONSES

Applicant
GitHub
Submitted

────────────────────────────

VIEW RESPONSE

────────────────────────────

LOGOUT
```

Use shadcn/Radix components where useful.

Potential components:

* Table
* Dialog
* Sheet
* Badge
* Button
* Input

Customize them to match the CodeNoSekai design.

---

# 9. Response Details

For long form responses, avoid making the main table excessively wide.

Use a:

* Dialog
* Drawer
* Detail page

to show full responses.

The interface should remain usable on mobile.

---

# 10. Authentication Errors

For invalid credentials, show a generic message.

Do not reveal whether:

* Username exists
* Password exists
* Account exists

Do not expose server stack traces.

---

# 11. Logout

Provide a clear logout action.

Logout must invalidate the admin session.

After logout, visiting `/admin` must redirect to:

```text
/admin/login
```

---

# 12. Security Review

Before completing the admin implementation, verify:

* Credentials are server-only
* Cookies are secure
* Admin API is protected
* Form responses cannot be publicly accessed
* No sensitive information is leaked
* No credentials are committed
* `.env.local` is ignored
* `.env.example` contains placeholders only

---

# 13. Important Rule

The admin panel is now a **form-response viewer**, not a membership approval system.

Do not recreate the old approval/disapproval behavior in another form.
