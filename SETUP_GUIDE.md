# Setup guide: MongoDB Atlas, first admin, deploy

Everything below is free. Takes about 15 minutes.

## 1. Create the database (MongoDB Atlas)

1. Go to **mongodb.com/atlas** and sign up.
2. **Create a cluster** and choose the free **M0** tier. Pick the region closest to your users (for Bangladesh, Mumbai or Singapore). Name it anything.
3. **Database Access** (left menu) → **Add New Database User** → username + password (choose *Password* auth). Give it **Read and write to any database**. Use letters and numbers only in the password, to avoid URL-encoding problems. Save it somewhere.
4. **Network Access** → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`). Vercel's IP addresses change, so a fixed IP will not work. Your password is what protects the database.
5. **Database** → **Connect** → **Drivers** → copy the connection string. It looks like:
   `mongodb+srv://USER:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   Replace `<password>` with your real password (no `<` `>`).

You do **not** need to create collections or indexes. The app creates them on first use.

## 2. Run it on your computer

```bash
npm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
```

Edit `.env.local`:

```
MONGODB_URI=mongodb+srv://USER:YOURPASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=primary_visual_lab
```

```bash
npm run dev
```

Open http://localhost:3000, click **Sign up**, create your account.

## 3. Make yourself the admin

Sign-up only offers *Student* and *Teacher*. Nobody can make themselves admin on the site. After you have signed up:

```bash
npm run make-admin -- you@example.com
```

Sign out and sign in again. You now have **Admin console** in the sidebar.
(Alternative with no code: Atlas → Browse Collections → `primary_visual_lab` → `users` → edit your document → set `role` to `"admin"`.)

Other roles work the same way: `npm run make-admin -- someone@example.com reviewer`.
Normal path for authors: a user applies from their dashboard, and you approve it in **Admin console → Applications**.

## 4. Deploy to Vercel

1. Push the project to GitHub.
2. **vercel.com** → **Add New Project** → import the repo. Framework: Next.js (auto-detected).
3. **Environment Variables** → add:
   - `MONGODB_URI` = your connection string
   - `MONGODB_DB` = `primary_visual_lab`
4. **Deploy.** Open the site, sign up, then run `make-admin` locally against the same `MONGODB_URI` (your `.env.local`) to promote yourself.

### For the judges
Add `ENABLE_DEMO_ACCOUNTS` = `true` in Vercel and redeploy. The login page then shows one-click Student / Teacher / Author / Reviewer / Admin buttons. These accounts have **no password**, so there is nothing to leak. **Remove the variable after judging** and redeploy: the buttons disappear and the endpoint returns 404.

## 5. Check it works

- Signed out, open `/bn/lessons`: you land on the login page.
- Sign up, finish the subtraction lesson, open **Dashboard**: your attempt shows up.
- Atlas → Browse Collections: `users`, `sessions`, `attempts`, `audit_logs` have documents. Passwords are scrypt hashes; session tokens are stored only as hashes.

## Troubleshooting

| You see | Cause / fix |
|---|---|
| "Database not connected" screen | `MONGODB_URI` missing in Vercel (or `.env.local`). Add it and redeploy. |
| `bad auth` / "Authentication failed" in logs | Wrong DB user or password in the URI. Special characters in the password must be URL-encoded. |
| Timeout / `ECONNREFUSED` | Atlas **Network Access** does not allow `0.0.0.0/0`. |
| Signed up but no Admin console | Run `make-admin`, then sign out and back in. |
| "Too many tries" on login | 5 wrong passwords lock that email for 15 minutes (by design). |
| Works locally, accounts vanish on Vercel | You are running without `MONGODB_URI` (in-memory store). Production refuses to do this unless `ALLOW_MEMORY_DB=true`. |

## What changed in this version (security)

- Login is a server session in an HttpOnly, SameSite cookie (no token in `localStorage`). Only a hash of the token is stored.
- Passwords use scrypt; old hashes are upgraded automatically on next login.
- Rate limiting on login and sign-up; same-origin checks on all cookie-authenticated writes.
- Private pages (`/dashboard`, `/lessons`, `/manipulatives`) and the slide downloads require login.
- `/api/attempts` always uses the signed-in user (it used to trust a `userId` from the request).
- `/api/lessons` hides drafts from other users; `/api/workflows/[id]` needs publish permission.
- Sign-up can no longer create contributors; teachers no longer have lesson-review rights.
- No public demo passwords. Demo sign-in is opt-in and passwordless.
