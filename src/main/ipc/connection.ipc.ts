import { ipcMain } from 'electron'
import type {
  CreateConnectionDTO,
  UpdateConnectionDTO,
} from '../../renderer/entities/connection/model/types'
import { IPC_CHANNELS } from '../../shared/config/ipc-channels'
import type { StorageService } from '../services/storage.service'

export function registerConnectionHandlers(storageService: StorageService) {
  ipcMain.handle(IPC_CHANNELS.CONNECTION.GET_ALL, () => {
    return storageService.getAllConnections()
  })

  ipcMain.handle(IPC_CHANNELS.CONNECTION.GET_BY_ID, (_, id: string) => {
    return storageService.getConnectionById(id)
  })

  ipcMain.handle(IPC_CHANNELS.CONNECTION.CREATE, (_, dto: CreateConnectionDTO) => {
    const connection = storageService.createConnection(dto)
    return {
      ...connection,
      password: undefined,
      passphrase: undefined,
      hasPassword: !!connection.password,
      hasPassphrase: !!connection.passphrase,
    }
  })

  ipcMain.handle(IPC_CHANNELS.CONNECTION.UPDATE, (_, id: string, dto: UpdateConnectionDTO) => {
    const connection = storageService.updateConnection(id, dto)
    if (!connection) return null
    return {
      ...connection,
      password: undefined,
      passphrase: undefined,
      hasPassword: !!connection.password,
      hasPassphrase: !!connection.passphrase,
    }
  })

  ipcMain.handle(IPC_CHANNELS.CONNECTION.DELETE, (_, id: string) => {
    return storageService.deleteConnection(id)
  })
}
