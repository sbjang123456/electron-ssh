import { ipcMain, dialog, BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '../../shared/config/ipc-channels'

export function registerDialogHandlers(getMainWindow: () => BrowserWindow | null) {
  ipcMain.handle(IPC_CHANNELS.DIALOG.OPEN_FILE, async (_, options?: Electron.OpenDialogOptions) => {
    const mainWindow = getMainWindow()
    if (!mainWindow) return { canceled: true, filePaths: [] }

    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'All Files', extensions: ['*'] }],
      ...options
    })

    return result
  })
}
