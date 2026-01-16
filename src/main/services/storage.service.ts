import Store from 'electron-store'
import { safeStorage } from 'electron'
import type { Connection, CreateConnectionDTO, UpdateConnectionDTO } from '../../renderer/entities/connection/model/types'
import { v4 as uuidv4 } from 'uuid'

interface StoredConnection extends Omit<Connection, 'password' | 'passphrase'> {
  encryptedPassword?: string
  encryptedPassphrase?: string
}

interface StoreSchema {
  connections: StoredConnection[]
}

export class StorageService {
  private store: Store<StoreSchema>

  constructor() {
    this.store = new Store<StoreSchema>({
      name: 'electron-ssh-config',
      defaults: {
        connections: []
      }
    })
  }

  private encrypt(text: string): string {
    if (!safeStorage.isEncryptionAvailable()) {
      return Buffer.from(text).toString('base64')
    }
    return safeStorage.encryptString(text).toString('base64')
  }

  private decrypt(encrypted: string): string {
    if (!safeStorage.isEncryptionAvailable()) {
      return Buffer.from(encrypted, 'base64').toString('utf-8')
    }
    return safeStorage.decryptString(Buffer.from(encrypted, 'base64'))
  }

  getAllConnections(): Omit<Connection, 'password' | 'passphrase'>[] {
    const connections = this.store.get('connections', [])
    return connections.map(({ encryptedPassword, encryptedPassphrase, ...rest }) => ({
      ...rest,
      hasPassword: !!encryptedPassword,
      hasPassphrase: !!encryptedPassphrase
    }))
  }

  getConnectionById(id: string): Connection | null {
    const connections = this.store.get('connections', [])
    const stored = connections.find((c) => c.id === id)
    if (!stored) return null

    const { encryptedPassword, encryptedPassphrase, ...rest } = stored
    return {
      ...rest,
      password: encryptedPassword ? this.decrypt(encryptedPassword) : undefined,
      passphrase: encryptedPassphrase ? this.decrypt(encryptedPassphrase) : undefined
    }
  }

  createConnection(dto: CreateConnectionDTO): Connection {
    const now = new Date().toISOString()
    const connection: StoredConnection = {
      id: uuidv4(),
      name: dto.name,
      host: dto.host,
      port: dto.port,
      username: dto.username,
      authMethod: dto.authMethod,
      privateKeyPath: dto.privateKeyPath,
      createdAt: now,
      updatedAt: now,
      encryptedPassword: dto.password ? this.encrypt(dto.password) : undefined,
      encryptedPassphrase: dto.passphrase ? this.encrypt(dto.passphrase) : undefined
    }

    const connections = this.store.get('connections', [])
    connections.push(connection)
    this.store.set('connections', connections)

    const { encryptedPassword, encryptedPassphrase, ...rest } = connection
    return {
      ...rest,
      password: dto.password,
      passphrase: dto.passphrase
    }
  }

  updateConnection(id: string, dto: UpdateConnectionDTO): Connection | null {
    const connections = this.store.get('connections', [])
    const index = connections.findIndex((c) => c.id === id)
    if (index === -1) return null

    const existing = connections[index]
    const updated: StoredConnection = {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
      encryptedPassword: dto.password !== undefined ? (dto.password ? this.encrypt(dto.password) : undefined) : existing.encryptedPassword,
      encryptedPassphrase: dto.passphrase !== undefined ? (dto.passphrase ? this.encrypt(dto.passphrase) : undefined) : existing.encryptedPassphrase
    }

    connections[index] = updated
    this.store.set('connections', connections)

    const { encryptedPassword, encryptedPassphrase, ...rest } = updated
    return {
      ...rest,
      password: encryptedPassword ? this.decrypt(encryptedPassword) : undefined,
      passphrase: encryptedPassphrase ? this.decrypt(encryptedPassphrase) : undefined
    }
  }

  deleteConnection(id: string): boolean {
    const connections = this.store.get('connections', [])
    const filtered = connections.filter((c) => c.id !== id)
    if (filtered.length === connections.length) return false

    this.store.set('connections', filtered)
    return true
  }

  updateLastConnected(id: string): void {
    const connections = this.store.get('connections', [])
    const index = connections.findIndex((c) => c.id === id)
    if (index !== -1) {
      connections[index].lastConnectedAt = new Date().toISOString()
      this.store.set('connections', connections)
    }
  }
}
