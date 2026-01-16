import { createHashRouter, RouterProvider } from 'react-router-dom'
import { TerminalPage } from '@/pages/terminal'

const router = createHashRouter([
  {
    path: '/',
    element: <TerminalPage />
  }
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
