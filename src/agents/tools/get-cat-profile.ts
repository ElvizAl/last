import { createTool } from '@anvia/core'
import { z } from 'zod'
import { prisma } from '../../lib/db/prisma.ts'

// Identitas dikunci oleh server, bukan dipilih oleh model melalui argumen tool.
export function createGetCatProfileTool(userId: string, catId: string) {
  return createTool({
    name: 'get_cat_profile',
    description:
      'Ambil profil terbaru kucing yang dipilih pada percakapan ini. Gunakan sebelum menilai gejala supaya umur, ras, vaksinasi, dan riwayat kesehatan tidak ditebak.',
    inputSchema: z.object({}),
    execute: async () => {
      const cat = await prisma.cat.findFirst({
        where: { id: catId, userId },
        select: {
          name: true,
          gender: true,
          birthDate: true,
          breed: true,
          vaccineStatus: true,
          healthHistory: true,
        },
      })

      if (!cat)
        return { found: false, message: 'Profil kucing tidak tersedia.' }

      return {
        found: true,
        name: cat.name,
        gender: cat.gender === 'LAKI_LAKI' ? 'Jantan' : 'Betina',
        birthDate: cat.birthDate?.toISOString().slice(0, 10) ?? null,
        currentDate: new Date().toISOString().slice(0, 10),
        breed: cat.breed,
        vaccineStatus:
          cat.vaccineStatus === 'VAKSIN' ? 'Sudah vaksin' : 'Belum vaksin',
        healthHistory: cat.healthHistory,
      }
    },
  })
}
