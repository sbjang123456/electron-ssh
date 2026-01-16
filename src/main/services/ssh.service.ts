import { EventEmitter } from 'node:events'
import { readFileSync } from 'node:fs'
import { Client, type ClientChannel } from 'ssh2'
import { v4 as uuidv4 } from 'uuid'
import type { Connection } from '../../renderer/entities/connection/model/types'

export interface SSHSession extends EventEmitter {
  id: string
  connectionId: string
  client: Client
  stream: ClientChannel | null
}

export class SSHService {
  private sessions: Map<string, SSHSession> = new Map()

  async connect(connection: Connection): Promise<SSHSession> {
    return new Promise((resolve, reject) => {
      const client = new Client()
      const sessionId = uuidv4()

      const session: SSHSession = Object.assign(new EventEmitter(), {
        id: sessionId,
        connectionId: connection.id,
        client,
        stream: null,
      })

      client.on('ready', () => {
        client.shell({ term: 'xterm-256color' }, (err, stream) => {
          if (err) {
            client.end()
            reject(err)
            return
          }

          session.stream = stream

          stream.on('data', (data: Buffer) => {
            session.emit('data', data)
          })

          stream.on('close', () => {
            session.emit('close')
            this.disconnect(sessionId)
          })

          stream.stderr.on('data', (data: Buffer) => {
            session.emit('data', data)
          })

          this.sessions.set(sessionId, session)
          resolve(session)
        })
      })

      client.on('error', (err) => {
        session.emit('error', err)
        reject(err)
      })

      client.on('close', () => {
        session.emit('close')
        this.sessions.delete(sessionId)
      })

      const connectConfig: Parameters<typeof client.connect>[0] = {
        host: connection.host,
        port: connection.port,
        username: connection.username,
        readyTimeout: 20000,
        keepaliveInterval: 10000,
      }

      if (connection.authMethod === 'password') {
        connectConfig.password = connection.password
      } else if (connection.authMethod === 'privateKey' && connection.privateKeyPath) {
        try {
          connectConfig.privateKey = readFileSync(connection.privateKeyPath)
          if (connection.passphrase) {
            connectConfig.passphrase = connection.passphrase
          }
        } catch (err) {
          reject(new Error(`Failed to read private key: ${(err as Error).message}`))
          return
        }
      }

      client.connect(connectConfig)
    })
  }

  sendData(sessionId: string, data: string): void {
    const session = this.sessions.get(sessionId)
    if (session?.stream) {
      session.stream.write(data)
    }
  }

  resize(sessionId: string, cols: number, rows: number): void {
    const session = this.sessions.get(sessionId)
    if (session?.stream) {
      session.stream.setWindow(rows, cols, 0, 0)
    }
  }

  disconnect(sessionId: string): void {
    const session = this.sessions.get(sessionId)
    if (session) {
      session.stream?.close()
      session.client.end()
      this.sessions.delete(sessionId)
    }
  }

  getSession(sessionId: string): SSHSession | undefined {
    return this.sessions.get(sessionId)
  }

  disconnectAll(): void {
    for (const sessionId of this.sessions.keys()) {
      this.disconnect(sessionId)
    }
  }
}
