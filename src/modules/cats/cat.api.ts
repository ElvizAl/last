import { createServerFn } from '@tanstack/react-start'
import type { CatInput } from './cat.schema'
import { catIdSchema, catSchema, updateCatSchema } from './cat.schema'
import { ensureSession } from '#/lib/auth/auth-session'
import { dbMiddleware } from '#/middleware/db.middleware'

export const listCats = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware])
  .handler(async ({ context }) => {
    const session = await ensureSession()

    try {
      const cats = await context.db.cat.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
      })

      return { success: true, message: 'Daftar kucing berhasil dimuat.', cats }
    } catch (error) {
      console.error('List cats error:', error)
      return {
        success: false,
        message: 'Gagal memuat daftar kucing.',
        cats: [],
      }
    }
  })

export const createCat = createServerFn({ method: 'POST' })
  .validator((data: CatInput) => catSchema.parse(data))
  .middleware([dbMiddleware])
  .handler(async ({ data, context }) => {
    const session = await ensureSession()

    try {
      await context.db.cat.create({
        data: {
          name: data.name,
          gender: data.gender,
          birthDate: data.birthDate
            ? new Date(`${data.birthDate}T00:00:00.000Z`)
            : null,
          breed: data.breed || null,
          vaccineStatus: data.vaccineStatus,
          healthHistory: data.healthHistory || null,
          userId: session.user.id,
        },
      })

      return { success: true, message: 'Profil kucing berhasil ditambahkan.' }
    } catch (error) {
      console.error('Create cat error:', error)
      return { success: false, message: 'Gagal menambahkan profil kucing.' }
    }
  })

export const updateCat = createServerFn({ method: 'POST' })
  .validator((data: CatInput & { id: string }) => updateCatSchema.parse(data))
  .middleware([dbMiddleware])
  .handler(async ({ data, context }) => {
    const session = await ensureSession()

    try {
      const result = await context.db.cat.updateMany({
        where: { id: data.id, userId: session.user.id },
        data: {
          name: data.name,
          gender: data.gender,
          birthDate: data.birthDate
            ? new Date(`${data.birthDate}T00:00:00.000Z`)
            : null,
          breed: data.breed || null,
          vaccineStatus: data.vaccineStatus,
          healthHistory: data.healthHistory || null,
        },
      })

      if (!result.count) {
        return { success: false, message: 'Kucing tidak ditemukan.' }
      }

      return { success: true, message: 'Profil kucing berhasil diperbarui.' }
    } catch (error) {
      console.error('Update cat error:', error)
      return { success: false, message: 'Gagal memperbarui profil kucing.' }
    }
  })

export const deleteCat = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => catIdSchema.parse(data))
  .middleware([dbMiddleware])
  .handler(async ({ data, context }) => {
    const session = await ensureSession()

    try {
      const result = await context.db.cat.deleteMany({
        where: { id: data.id, userId: session.user.id },
      })

      if (!result.count) {
        return { success: false, message: 'Kucing tidak ditemukan.' }
      }

      return { success: true, message: 'Profil kucing berhasil dihapus.' }
    } catch (error) {
      console.error('Delete cat error:', error)
      return { success: false, message: 'Gagal menghapus profil kucing.' }
    }
  })
