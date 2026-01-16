export type AuthMethod = 'password' | 'privateKey'

export interface Connection {
  id: string
  name: string
  host: string
  port: number
  username: string
  authMethod: AuthMethod
  password?: string
  privateKeyPath?: string
  passphrase?: string
  createdAt: string
  updatedAt: string
  lastConnectedAt?: string
}

export interface CreateConnectionDTO {
  name: string
  host: string
  port: number
  username: string
  authMethod: AuthMethod
  password?: string
  privateKeyPath?: string
  passphrase?: string
}

export interface UpdateConnectionDTO extends Partial<CreateConnectionDTO> {}

export interface ConnectionSafe extends Omit<Connection, 'password' | 'passphrase'> {
  hasPassword: boolean
  hasPassphrase: boolean
}
