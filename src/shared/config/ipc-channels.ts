export const IPC_CHANNELS = {
  SSH: {
    CONNECT: 'ssh:connect',
    DISCONNECT: 'ssh:disconnect',
    SEND_DATA: 'ssh:send-data',
    RESIZE: 'ssh:resize',
    ON_DATA: 'ssh:on-data',
    ON_CLOSE: 'ssh:on-close',
    ON_ERROR: 'ssh:on-error',
  },
  CONNECTION: {
    GET_ALL: 'connection:get-all',
    GET_BY_ID: 'connection:get-by-id',
    CREATE: 'connection:create',
    UPDATE: 'connection:update',
    DELETE: 'connection:delete',
  },
  SESSION: {
    GET_ACTIVE: 'session:get-active',
  },
  DIALOG: {
    OPEN_FILE: 'dialog:open-file',
  },
} as const

export type IPCChannels = typeof IPC_CHANNELS
