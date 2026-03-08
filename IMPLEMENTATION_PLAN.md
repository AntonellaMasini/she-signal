# SheSignal — Full-Stack Implementation Plan

## Context
The Lovable-built frontend is a complete static prototype: sessionStorage profile, localStorage tracker, mock opportunity data, no auth. This plan wires it up end-to-end — Supabase Auth + DB for persistence, a Supabase Edge Function that calls Claude with web search for real opportunities, and all frontend components updated to read/write from Supabase instead of browser storage.

## Decisions
- Results route: `/signals` (renamed from `/signal` — file stays `Signal.tsx`, only the path changes)
- Post-login redirect: **smart** — check `profiles.field` in Supabase; null → `/profile`; complete → `/signals`
- New Opportunity fields (`organization`, `fundingAmount`, `location`): stored in DB **and** shown in `OpportunityCard`
- Supabase CLI: setup instructions included in manual steps
- **User-supplied Anthropic API key**: users enter their own key in the Profile page; stored in `localStorage` as `shesignal-api-key`; passed to the Edge Function per-request so we never pay for API calls

---

## PHASE 1 — Manual: Supabase Dashboard Setup
> 🖐 = requires you to act in the browser or terminal

**1.1** 🖐 Create a Supabase project. Note your **Project URL** and **anon public key**.

**1.2** 🖐 Auth > Providers: enable **Email** and **Google** (Google needs a Google Cloud OAuth client ID + secret).

**1.3** 🖐 Auth > URL Configuration:
- Site URL: `http://localhost:8080` (for now)
- Redirect URLs: add `http://localhost:8080/**`

**1.4** 🖐 SQL Editor — run all SQL from `DATABASE.md`:
- `profiles` table + `handle_new_user` trigger
- `saved_opportunities` table
- All RLS policies for both tables

**1.5** 🖐 Install and link Supabase CLI:
```sh
brew install supabase/tap/supabase   # macOS
supabase login                        # browser OAuth
supabase init                         # run from repo root → creates /supabase dir
supabase link --project-ref <ref-id>  # ref in Dashboard > Project Settings > General
```

**1.6** 🖐 *(Optional)* After the Edge Function is deployed (Step 4.2), you can add a fallback secret in Dashboard > Edge Functions > Secrets:
- `ANTHROPIC_API_KEY` = your Anthropic key (only needed if you want a server-side fallback; users will use their own keys)

---

## PHASE 2 — Install Package & Env

**2.1** `npm install @supabase/supabase-js`

**2.2** 🖐 Create `.env.local` in repo root:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```
(`.env.local` is covered by `.gitignore` — confirm before committing anything)

---

## PHASE 3 — Foundation Files (all new)

**3.1** `src/lib/supabase.ts`
- `createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)` — export single `supabase` instance

**3.2** `src/types/index.ts`
- `Opportunity` — full shape from PROMPTS.md (adds `organization`, `fundingAmount`, `location` to what exists)
- `UserProfile` — `{ id, name, field, stage, country, interests }`
- `TrackerStatus` = `'want_to_apply' | 'applied' | 'heard_back'`
- `SavedOpportunity` extends Opportunity + `{ id: string; status: TrackerStatus; notes: string }`

**3.3** `src/lib/calendar.ts`
- Extract `buildCalendarUrl(name, deadline)` and `buildReminderUrl(name, deadline)` out of `OpportunityCard.tsx` where they're currently inlined
- `OpportunityCard.tsx` will import from here (Phase 6.5)

**3.4** `src/hooks/useAuth.ts`
- Exact implementation from `AUTH.md`
- Returns `{ user, loading }`; listens to `onAuthStateChange`

**3.5** `src/components/ProtectedRoute.tsx`
- Pattern from `AUTH.md`
- While `loading === true`: show spinner (reuse `SignalBeam` scanning animation)
- If no user: `<Navigate to="/login" replace />`

---

## PHASE 4 — Edge Function

**4.1** `supabase/functions/get-opportunities/index.ts`
- Full implementation from `PROMPTS.md` as base
- Include full `SYSTEM_PROMPT` const from `PROMPTS.md`
- Accept `userApiKey` in the request body alongside the profile fields
- Key resolution: `const apiKey = userApiKey || Deno.env.get('ANTHROPIC_API_KEY')`
- If neither is present: return 400 `{ error: 'No API key provided. Please add your Anthropic API key in your profile settings.' }`
- Model: `claude-sonnet-4-20250514`; tool: `web_search_20250305`
- CORS headers + OPTIONS handling included
- Parse JSON text block from Claude's `content`; return `{ opportunities }`

**4.2** 🖐 Deploy:
```sh
supabase functions deploy get-opportunities
```
The server-side `ANTHROPIC_API_KEY` secret is optional (Step 1.6) — if absent, each user must supply their own key.

---

## PHASE 5 — New: Login Page

**5.1** Create `src/pages/Login.tsx` *(does not exist at all currently)*
- Two modes: **Sign In** / **Sign Up** (tab toggle)
- Sign In: email + password → `supabase.auth.signInWithPassword`
- Sign Up: name + email + password → `supabase.auth.signUp` with `options.data.full_name`
- Google button → `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: origin + '/signals' }})`
- On success: fetch `profiles.field` — null → `/profile`, set → `/signals`
- Visual style: dark bg, gold primary button with `signal-glow`, Bebas Neue heading

---

## PHASE 6 — Wire Existing Pages & Components

**6.1** `src/App.tsx` — surgical changes:
- Add `/login` route → `<Login />`
- Change `/signal` → `/signals`
- Wrap `/signals` and `/tracker` in `<ProtectedRoute>`
- Remove unused `Index` placeholder import/route

**6.2** `src/components/Navbar.tsx` — additions only:
- Import `useAuth` + `supabase`
- Right side: if no `user` → show `<Link to="/login">Sign In</Link>`; if `user` → show truncated email + Logout button (`supabase.auth.signOut()`)
- All existing links unchanged

**6.3** `src/pages/Profile.tsx`:
- On mount: if no user → redirect `/login`; fetch existing profile → pre-fill form state
- Add **API Key section** at the bottom of the form:
  - Password-type `<Input>` labelled "Your Anthropic API Key"
  - Helper text: "Get a free key at console.anthropic.com — we never send it to our servers, it stays in your browser."
  - On mount: pre-fill from `localStorage.getItem('shesignal-api-key')`
  - On change: immediately `localStorage.setItem('shesignal-api-key', value)` (live save, no submit needed)
  - Show a small warning badge if the field is empty: "⚠ Required to fetch opportunities"
- `handleSubmit`: upsert to `profiles` (`id: user.id, name, field, stage, country, interests, updated_at`)
- Change `navigate('/signal')` → `navigate('/signals')`

**6.4** `src/pages/Signal.tsx`:
- Remove all `sessionStorage` logic
- On mount: redirect to `/login` if no user; fetch profile from `profiles`; if incomplete redirect to `/profile`
- Read `userApiKey` from `localStorage.getItem('shesignal-api-key')` before invoking
- If `userApiKey` is empty: show an inline error — "No API key set. [Go to profile →]" — and skip the fetch
- Replace `fetch('/api/opportunities')` with `supabase.functions.invoke('get-opportunities', { body: { ...profile, userApiKey } })`
- Keep mock fallback when invoke fails (dev UX)
- `trackOpportunity`: replace localStorage with `supabase.from('saved_opportunities').insert(...)` — check for existing row first to prevent duplicates
- Import `Opportunity` from `@/types`

**6.5** `src/components/OpportunityCard.tsx` — surgical additions:
- Remove inline `export interface Opportunity` — import from `@/types` instead
- Remove inline `buildCalendarUrl` / `buildReminderUrl` — import from `@/lib/calendar`
- Display `organization` (small muted text below name)
- Display `location` (small pill/badge)
- Display `fundingAmount` in gold if present

**6.6** Create `src/hooks/useTracker.ts`:
- `fetchTracker()` → `supabase.from('saved_opportunities').select('*').order('deadline')` → shape by status
- `moveOpp(id, newStatus)` → `.update({ status, updated_at })`
- `updateNotes(id, notes)` → `.update({ notes, updated_at })`
- `deleteOpp(id)` → `.delete().eq('id', id)`
- Returns `{ tracker, loading, moveOpp, updateNotes, deleteOpp, refetch }`

**6.7** `src/pages/Tracker.tsx`:
- Replace all `useState` + localStorage with `useTracker()` hook
- Map display columns to DB status values: `want` → `want_to_apply`, `applied` → `applied`, `heard` → `heard_back`
- Add delete button (trash icon) to each card
- Loading state: skeleton cards while `loading === true`
- On mount: redirect to `/login` if no user

---

## PHASE 7 — Types Cleanup

After `src/types/index.ts` exists:
- Remove `export interface Opportunity` from `OpportunityCard.tsx` (replaced by import)
- Remove `interface TrackedOpp` from `Tracker.tsx` (replaced by `SavedOpportunity`)

---

## ENV Variables Reference

| Variable | Location |
|---|---|
| `VITE_SUPABASE_URL` | `src/lib/supabase.ts` (via `import.meta.env`) |
| `VITE_SUPABASE_ANON_KEY` | `src/lib/supabase.ts` (via `import.meta.env`) |
| `ANTHROPIC_API_KEY` | Supabase Dashboard > Edge Function Secrets — optional server fallback only |
| `shesignal-api-key` | User's Anthropic key — **localStorage only**, never sent to DB, passed per-request to Edge Function |
| `STRIPE_SECRET_KEY` | Not used yet (future) |

---

## Order of Operations

| # | Step | Who |
|---|---|---|
| 1 | Supabase project + DB migrations + Auth providers | 🖐 You |
| 2 | Supabase CLI install + init + link | 🖐 You |
| 3 | `npm install @supabase/supabase-js` | Code |
| 4 | Create `.env.local` with Supabase URL + anon key | 🖐 You |
| 5 | `src/lib/supabase.ts` | Code |
| 6 | `src/types/index.ts` | Code |
| 7 | `src/lib/calendar.ts` | Code |
| 8 | `src/hooks/useAuth.ts` | Code |
| 9 | `src/components/ProtectedRoute.tsx` | Code |
| 10 | `supabase/functions/get-opportunities/index.ts` | Code |
| 11 | Deploy edge function + add `ANTHROPIC_API_KEY` secret | 🖐 You |
| 12 | `src/pages/Login.tsx` | Code |
| 13 | `src/App.tsx` updates | Code |
| 14 | `src/components/Navbar.tsx` updates | Code |
| 15 | `src/pages/Profile.tsx` updates | Code |
| 16 | `src/pages/Signal.tsx` updates | Code |
| 17 | `src/components/OpportunityCard.tsx` updates | Code |
| 18 | `src/hooks/useTracker.ts` | Code |
| 19 | `src/pages/Tracker.tsx` updates | Code |
| 20 | Types cleanup | Code |

---

## Files Changed / Created

| Action | File |
|---|---|
| CREATE | `src/lib/supabase.ts` |
| CREATE | `src/lib/calendar.ts` |
| CREATE | `src/types/index.ts` |
| CREATE | `src/hooks/useAuth.ts` |
| CREATE | `src/hooks/useTracker.ts` |
| CREATE | `src/components/ProtectedRoute.tsx` |
| CREATE | `src/pages/Login.tsx` |
| CREATE | `supabase/functions/get-opportunities/index.ts` |
| EDIT | `src/App.tsx` |
| EDIT | `src/components/Navbar.tsx` |
| EDIT | `src/components/OpportunityCard.tsx` |
| EDIT | `src/pages/Profile.tsx` |
| EDIT | `src/pages/Signal.tsx` |
| EDIT | `src/pages/Tracker.tsx` |

---

## Verification Checklist

After all steps:
1. `npm run dev` — app loads at `localhost:8080` with no console errors
2. `/` hero visible; clicking "Find My Signal" redirects to `/login`
3. Sign up with email → smart redirect → `/profile` (incomplete profile)
4. Fill profile + paste an Anthropic API key → submit → `/signals`
5. `/signals`: if no key stored → shows inline error with link back to profile
6. With key set → scanning beam → 6–10 real Claude-curated opportunities from web search
7. "Track This" → Tracker page shows opp in "Want to Apply"; row exists in Supabase
8. Move opp to "Applied" → Supabase row `status` updates
9. Sign out → Navbar shows "Sign In"; `/signals` and `/tracker` redirect to `/login`
10. Sign back in → smart redirect skips profile (already complete) → `/signals`
