import { BrowserWindow } from 'electron'
import { registerConnectionHandlers } from './connection.ipc'
import { registerSSHHandlers } from './ssh.ipc'
import { registerDialogHandlers } from './dialog.ipc'
import { StorageService } from '../services/storage.service'
import { SSHService } from '../services/ssh.service'

export function registerAllHandlers(
  storageService: StorageService,
  sshService: SSHService,
  getMainWindow: () => BrowserWindow | null
) {
  registerConnectionHandlers(storageService)
  registerSSHHandlers(sshService, storageService, getMainWindow)
  registerDialogHandlers(getMainWindow)
}
