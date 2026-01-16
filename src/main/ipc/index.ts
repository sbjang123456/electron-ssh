import type { BrowserWindow } from 'electron'
import type { SSHService } from '../services/ssh.service'
import type { StorageService } from '../services/storage.service'
import { registerConnectionHandlers } from './connection.ipc'
import { registerDialogHandlers } from './dialog.ipc'
import { registerSSHHandlers } from './ssh.ipc'

export function registerAllHandlers(
  storageService: StorageService,
  sshService: SSHService,
  getMainWindow: () => BrowserWindow | null
) {
  registerConnectionHandlers(storageService)
  registerSSHHandlers(sshService, storageService, getMainWindow)
  registerDialogHandlers(getMainWindow)
}
