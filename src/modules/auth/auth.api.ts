import { createServerFn } from '@tanstack/react-start'
import type { LoginInput, RegisterInput } from './auth.schema'
import { loginSchema, registerSchema } from './auth.schema'
import { auth } from '#/lib/auth/auth'
import { dbMiddleware } from '#/middleware/db.middleware'

export const registerServerFn = createServerFn({ method: 'POST' })
  .validator((data: RegisterInput) => registerSchema.parse(data))
  .middleware([dbMiddleware])
  .handler(async ({ data, context }) => {
    try {
      const existingUser = await context.db.user.findUnique({
        where: {
          email: data.email,
        },
      })

      if (existingUser) {
        return {
          success: false,
          message: 'Email sudah digunakan, silakan gunakan email lain.',
        }
      }

      await auth.api.signUpEmail({
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      })

      return {
        success: true,
        message: 'Registrasi berhasil redirect ke halaman login',
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: 'Internal Server Error',
      }
    }
  })

export const loginServerFn = createServerFn({ method: 'POST' })
  .middleware([dbMiddleware])
  .validator((data: LoginInput) => loginSchema.parse(data))
  .handler(async ({ data, context }) => {
    try {
      const user = await context.db.user.findUnique({
        where: {
          email: data.email,
        },
      })

      if (!user) {
        return {
          success: false,
          message: 'Email atau kata sandi salah.',
        }
      }
      await auth.api.signInEmail({
        body: {
          email: data.email,
          password: data.password,
        },
      })

      return {
        success: true,
        message: 'Login berhasil',
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'Internal Server Error',
      }
    }
  })
