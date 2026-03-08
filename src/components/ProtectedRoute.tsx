import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-primary font-display text-2xl tracking-wider animate-pulse">SheSignal</div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
