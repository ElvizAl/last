import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthLayout } from '#/modules/auth/components/auth-layout'

export const Route = createFileRoute('/_auth')({
  component: () => (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ),
})