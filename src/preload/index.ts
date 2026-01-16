import { contextBridge, ipcRenderer } from 'electron'
import type {
  CreateConnectionDTO,
  UpdateConnectionDTO,
} from '../renderer/entities/connection/model/types'
import { IPC_CHANNELS } from '../shared/config/ipc-channels'

const api = {
  ssh: {
    connect: (connectionId: string) => ipcRenderer.invoke(IPC_CHANNELS.SSH.CONNECT, connectionId),
    disconnect: (sessionId: string) => ipcRenderer.invoke(IPC_CHANNELS.SSH.DISCONNECT, sessionId),
    sendData: (sessionId: string, data: string) =>
      ipcRenderer.send(IPC_CHANNELS.SSH.SEND_DATA, sessionId, data),
    resize: (sessionId: string, cols: number, rows: number) =>
      ipcRenderer.send(IPC_CHANNELS.SSH.RESIZE, sessionId, cols, rows),
    onData: (callback: (sessionId: string, data: string) => void) => {
      const listener = (_: Electron.IpcRendererEvent, sessionId: string, data: string) =>
        callback(sessionId, data)
      ipcRenderer.on(IPC_CHANNELS.SSH.ON_DATA, listener)
      return () => ipcRenderer.removeListener(IPC_CHANNELS.SSH.ON_DATA, listener)
    },
    onClose: (callback: (sessionId: string) => void) => {
      const listener = (_: Electron.IpcRendererEvent, sessionId: string) => callback(sessionId)
      ipcRenderer.on(IPC_CHANNELS.SSH.ON_CLOSE, listener)
      return () => ipcRenderer.removeListener(IPC_CHANNELS.SSH.ON_CLOSE, listener)
    },
    onError: (callback: (sessionId: string, error: string) => void) => {
      const listener = (_: Electron.IpcRendererEvent, sessionId: string, error: string) =>
        callback(sessionId, error)
      ipcRenderer.on(IPC_CHANNELS.SSH.ON_ERROR, listener)
      return () => ipcRenderer.removeListener(IPC_CHANNELS.SSH.ON_ERROR, listener)
    },
  },

  connection: {
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.CONNECTION.GET_ALL),
    getById: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.CONNECTION.GET_BY_ID, id),
    create: (connection: CreateConnectionDTO) =>
      ipcRenderer.invoke(IPC_CHANNELS.CONNECTION.CREATE, connection),
    update: (id: string, connection: UpdateConnectionDTO) =>
      ipcRenderer.invoke(IPC_CHANNELS.CONNECTION.UPDATE, id, connection),
    delete: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.CONNECTION.DELETE, id),
  },

  dialog: {
    openFile: (options?: Electron.OpenDialogOptions) =>
      ipcRenderer.invoke(IPC_CHANNELS.DIALOG.OPEN_FILE, options),
  },
}

contextBridge.exposeInMainWorld('electronAPI', api)

export type ElectronAPI = typeof api
