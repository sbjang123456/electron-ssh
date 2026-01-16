import { create } from 'zustand'
import type { ConnectionSafe } from './types'

interface ConnectionStore {
  connections: ConnectionSafe[]
  selectedConnectionId: string | null
  isLoading: boolean
  error: string | null

  setConnections: (connections: ConnectionSafe[]) => void
  selectConnection: (id: string | null) => void
  addConnection: (connection: ConnectionSafe) => void
  updateConnection: (id: string, updates: Partial<ConnectionSafe>) => void
  removeConnection: (id: string) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  connections: [],
  selectedConnectionId: null,
  isLoading: false,
  error: null,

  setConnections: (connections) => set({ connections }),
  selectConnection: (id) => set({ selectedConnectionId: id }),
  addConnection: (connection) => set((state) => ({ connections: [...state.connections, connection] })),
  updateConnection: (id, updates) =>
    set((state) => ({
      connections: state.connections.map((c) => (c.id === id ? { ...c, ...updates } : c))
    })),
  removeConnection: (id) =>
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== id),
      selectedConnectionId: state.selectedConnectionId === id ? null : state.selectedConnectionId
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}))
