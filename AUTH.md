# SheSignal — Auth Flow (Supabase)

## Auth Provider
Supabase Auth — supports email/password and Google OAuth.

## Setup (`/src/lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

## Auth Methods

### Sign up with email
```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { full_name: name } }
})
```

### Log in with email
```typescript
const { data, error } = await supabase.auth.signInWithPassword({ email, password })
```

### Log in with Google
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${window.location.origin}/auth/callback` }
})
```

### Log out
```typescript
await supabase.auth.signOut()
```

### Get current user
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

---

## `useAuth` Hook (`/src/hooks/useAuth.ts`)
```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
```

---

## Protected Routes
Wrap any page that requires login. If no user, redirect to `/login`.

```typescript
// /src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
```

### Apply to routes in your router:
```typescript
<Route path="/dashboard" element={
  <ProtectedRoute><Dashboard /></ProtectedRoute>
} />
<Route path="/tracker" element={
  <ProtectedRoute><Tracker /></ProtectedRoute>
} />
```

---

## User Flow
1. User lands on `/` — sees the SheSignal hero (public)
2. Clicks "Find My Signal" → redirected to `/login` if not authenticated
3. After login/signup → redirected to `/profile` to fill in their details
4. After profile submit → `/signals` with curated opportunities
5. User saves opportunities → stored in `saved_opportunities` table
6. `/tracker` shows their Kanban board (Want to Apply / Applied / Heard Back)

## Profile Completeness Check
After login, check if the user has filled in their profile:
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('field, stage, country')
  .eq('id', user.id)
  .single()

// If profile.field is null, redirect to /profile to complete setup
if (!profile?.field) navigate('/profile')
```

---

## Supabase Dashboard Setup Checklist
- [ ] Enable Email provider in Auth > Providers
- [ ] Enable Google provider — add Google OAuth client ID + secret
- [ ] Set Site URL to your deployed domain
- [ ] Add `http://localhost:8080` to Redirect URLs for local dev
- [ ] Run database migrations from `DATABASE.md`
- [ ] Add `ANTHROPIC_API_KEY` as Edge Function secret in Supabase Dashboard > Edge Functions > Secrets
