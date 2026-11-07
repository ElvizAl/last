import { createTool } from '@anvia/core'
import { z } from 'zod'

export const askFollowup = createTool({
  name: 'ask_followup',
  description:
    'Tampilkan maksimal dua pertanyaan untuk melengkapi gejala, durasi, atau informasi pembeda yang belum diketahui. Setelah memanggil tool ini, tunggu jawaban pengguna melalui pesan chat berikutnya. Jangan gunakan untuk menunda arahan darurat.',
  inputSchema: z.object({
    questions: z.array(z.string().trim().min(1).max(500)).min(1).max(2),
  }),
  execute: ({ questions }) => ({
    status: 'awaiting_user_reply',
    questions,
    message: 'Pertanyaan ditampilkan di chat. Tunggu jawaban pengguna.',
  }),
})
