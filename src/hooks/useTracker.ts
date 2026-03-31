import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { SavedOpportunity, TrackerStatus } from '@/types'

type TrackerBoard = {
  want_to_apply: SavedOpportunity[]
  applied: SavedOpportunity[]
  heard_back: SavedOpportunity[]
}

export function useTracker() {
  const [tracker, setTracker] = useState<TrackerBoard>({
    want_to_apply: [],
    applied: [],
    heard_back: [],
  })
  const [loading, setLoading] = useState(true)

  const fetchTracker = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('saved_opportunities')
      .select('*')
      .order('deadline', { ascending: true })

    if (data) {
      const board: TrackerBoard = { want_to_apply: [], applied: [], heard_back: [] }
      for (const row of data) {
        const opp: SavedOpportunity = {
          id: row.id,
          name: row.name,
          type: row.type,
          organization: row.organization ?? '',
          deadline: row.deadline ?? '',
          description: row.description ?? '',
          url: row.url ?? '',
          whyMatch: row.why_match ?? '',
          fundingAmount: row.funding_amount,
          location: row.location ?? '',
          status: row.status as TrackerStatus,
          notes: row.notes ?? '',
        }
        const col = row.status as keyof TrackerBoard
        if (col in board) board[col].push(opp)
      }
      setTracker(board)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTracker()
  }, [fetchTracker])

  const moveOpp = async (id: string, newStatus: TrackerStatus) => {
    await supabase
      .from('saved_opportunities')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
    await fetchTracker()
  }

  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const updateNotes = (id: string, notes: string) => {
    // Optimistic update immediately
    setTracker((prev) => {
      const next = { ...prev }
      for (const col of Object.keys(next) as (keyof TrackerBoard)[]) {
        next[col] = next[col].map((o) => (o.id === id ? { ...o, notes } : o))
      }
      return next
    })

    // Debounce the DB write
    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id])
    }
    debounceTimers.current[id] = setTimeout(async () => {
      await supabase
        .from('saved_opportunities')
        .update({ notes, updated_at: new Date().toISOString() })
        .eq('id', id)
      delete debounceTimers.current[id]
    }, 500)
  }

  const deleteOpp = async (id: string) => {
    await supabase.from('saved_opportunities').delete().eq('id', id)
    setTracker((prev) => {
      const next = { ...prev }
      for (const col of Object.keys(next) as (keyof TrackerBoard)[]) {
        next[col] = next[col].filter((o) => o.id !== id)
      }
      return next
    })
  }

  return { tracker, loading, moveOpp, updateNotes, deleteOpp, refetch: fetchTracker }
}
