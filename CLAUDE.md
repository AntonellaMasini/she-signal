# SheSignal — Claude Code Project Guide

## What This Project Is
SheSignal is a web app that helps women in STEM discover opportunities (hackathons, scholarships, conferences, grants) personalized to their profile. Users log in, get AI-curated results with deadlines, save opportunities to a tracker board, and add deadlines to Google Calendar.

## Tech Stack
- **Frontend**: React + Tailwind (built in Lovable — do not restructure or rename existing components unless explicitly asked)
- **AI Engine**: Anthropic Claude API (`claude-sonnet-4-20250514`) with web search tool enabled
- **Auth**: Supabase Auth (email/password + Google OAuth)
- **Database**: Supabase (Postgres) — stores user profiles and saved opportunities
- **Calendar**: Google Calendar URL API (no OAuth — just link generation)

## Project Structure
```
/src
  /components       ← Lovable-generated UI components (edit carefully)
  /pages            ← Route-level pages
  /lib
    supabase.ts     ← Supabase client init
    anthropic.ts    ← Claude API call logic (DO NOT call this client-side)
    calendar.ts     ← Google Calendar URL builder
  /hooks            ← Custom React hooks (useAuth, useOpportunities, useTracker)
  /types            ← Shared TypeScript types (Opportunity, UserProfile, TrackerStatus)
/supabase
  /functions
    get-opportunities/  ← Edge function that calls Claude API (keeps key server-side)
  /migrations           ← SQL migration files
```

## Core Rules for Claude Code
1. **Frontend is Lovable-generated** — make surgical edits only. Do not rewrite whole components unless explicitly asked.
2. **Never expose the Anthropic API key client-side** — all Claude calls go through the Supabase Edge Function `/supabase/functions/get-opportunities/`
3. **Supabase for all persistence** — user profiles, saved opportunities, tracker status live in Supabase
4. **All prompt logic lives in `PROMPTS.md`** — when editing AI behavior, update the prompt there and reflect it in the edge function
5. **Calendar is URL-only** — see `calendar.ts`, no Google OAuth required

## ENV Variables
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=          ← Supabase Edge Function secret (never in VITE_)
STRIPE_SECRET_KEY=          ← optional, future use
```

## Related Docs
- `PROMPTS.md` — Full Claude system prompt with curated seed list of known opportunities
- `DATABASE.md` — Supabase schema, table definitions, RLS policies
- `AUTH.md` — Auth flow, protected routes, session handling
