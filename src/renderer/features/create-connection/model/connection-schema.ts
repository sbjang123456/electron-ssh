import { z } from 'zod'

export const connectionSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    host: z.string().min(1, 'Host is required'),
    port: z.coerce.number().min(1).max(65535).default(22),
    username: z.string().min(1, 'Username is required'),
    authMethod: z.enum(['password', 'privateKey']),
    password: z.string().optional(),
    privateKeyPath: z.string().optional(),
    passphrase: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.authMethod === 'password') {
        return !!data.password
      }
      if (data.authMethod === 'privateKey') {
        return !!data.privateKeyPath
      }
      return true
    },
    {
      message: 'Password or Private Key path is required based on auth method',
      path: ['password'],
    }
  )

export type ConnectionFormData = z.infer<typeof connectionSchema>
