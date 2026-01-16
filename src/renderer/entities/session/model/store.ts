import { create } from 'zustand'
import type { Session, SessionStatus } from './types'

interface SessionStore {
  sessions: Session[]
  activeSessionId: string | null

  addSession: (session: Session) => void
  removeSession: (id: string) => void
  setActiveSession: (id: string | null) => void
  updateSessionStatus: (id: string, status: SessionStatus, error?: string) => void
  getSessionByConnectionId: (connectionId: string) => Session | undefined
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  activeSessionId: null,

  addSession: (session) =>
    set((state) => ({
      sessions: [...state.sessions, session],
      activeSessionId: session.id
    })),

  removeSession: (id) =>
    set((state) => {
      const newSessions = state.sessions.filter((s) => s.id !== id)
      return {
        sessions: newSessions,
        activeSessionId: state.activeSessionId === id ? (newSessions[0]?.id ?? null) : state.activeSessionId
      }
    }),

  setActiveSession: (id) => set({ activeSessionId: id }),

  updateSessionStatus: (id, status, error) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id
          ? {
              ...s,
              status,
              error,
              disconnectedAt: status === 'disconnected' ? new Date().toISOString() : s.disconnectedAt
            }
          : s
      )
    })),

  getSessionByConnectionId: (connectionId) => get().sessions.find((s) => s.connectionId === connectionId)
}))
