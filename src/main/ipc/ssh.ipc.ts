import { type BrowserWindow, ipcMain } from 'electron'
import { IPC_CHANNELS } from '../../shared/config/ipc-channels'
import type { SSHService } from '../services/ssh.service'
import type { StorageService } from '../services/storage.service'

export function registerSSHHandlers(
  sshService: SSHService,
  storageService: StorageService,
  getMainWindow: () => BrowserWindow | null
) {
  ipcMain.handle(IPC_CHANNELS.SSH.CONNECT, async (_, connectionId: string) => {
    const connection = storageService.getConnectionById(connectionId)
    if (!connection) {
      throw new Error('Connection not found')
    }

    const session = await sshService.connect(connection)
    const mainWindow = getMainWindow()

    session.on('data', (data: Buffer) => {
      mainWindow?.webContents.send(IPC_CHANNELS.SSH.ON_DATA, session.id, data.toString('utf-8'))
    })

    session.on('close', () => {
      mainWindow?.webContents.send(IPC_CHANNELS.SSH.ON_CLOSE, session.id)
    })

    session.on('error', (error: Error) => {
      mainWindow?.webContents.send(IPC_CHANNELS.SSH.ON_ERROR, session.id, error.message)
    })

    storageService.updateLastConnected(connectionId)

    return {
      sessionId: session.id,
      connectionId: session.connectionId,
    }
  })

  ipcMain.handle(IPC_CHANNELS.SSH.DISCONNECT, async (_, sessionId: string) => {
    sshService.disconnect(sessionId)
    return true
  })

  ipcMain.on(IPC_CHANNELS.SSH.SEND_DATA, (_, sessionId: string, data: string) => {
    sshService.sendData(sessionId, data)
  })

  ipcMain.on(IPC_CHANNELS.SSH.RESIZE, (_, sessionId: string, cols: number, rows: number) => {
    sshService.resize(sessionId, cols, rows)
  })
}
