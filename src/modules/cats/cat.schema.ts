import { z } from 'zod'

export const catSchema = z.object({
  name: z.string().trim().min(1, 'Nama kucing wajib diisi').max(100),
  gender: z.enum(['LAKI_LAKI', 'PEREMPUAN']),
  birthDate: z
    .string()
    .refine(
      (value) =>
        value === '' ||
        (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
          !Number.isNaN(Date.parse(value)) &&
          new Date(value).toISOString().slice(0, 10) === value &&
          value <= new Date().toISOString().slice(0, 10)),
      'Tanggal lahir tidak valid atau di masa depan',
    ),
  breed: z.string().trim().max(100),
  vaccineStatus: z.enum(['TIDAK_VAKSIN', 'VAKSIN']),
  healthHistory: z.string().trim().max(5000),
})
export type CatInput = z.infer<typeof catSchema>
export const catIdSchema = z.object({ id: z.string().min(1) })
export const updateCatSchema = catSchema.extend({ id: z.string().min(1) })
