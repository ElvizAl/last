import type { ClientStreamRequest } from '@anvia/client'
import { z } from 'zod'

const metadataSchema = z.object({
  sessionId: z.uuid(),
  catId: z.string().trim().min(1).max(100),
})

export function readChatInput(body: ClientStreamRequest) {
  if (body.type !== 'messages')
    throw new Error('Respons interaksi belum didukung.')

  const lastMessage = body.messages.at(-1)
  if (lastMessage?.role !== 'user') {
    throw new Error('Kirim pesan teks terlebih dahulu.')
  }

  const metadata = metadataSchema.safeParse(lastMessage.metadata)
  if (!metadata.success) throw new Error('ID percakapan tidak valid.')

  const content = lastMessage.content
  if (
    Array.isArray(content) &&
    !content.every((part) => part.type === 'text')
  ) {
    throw new Error('Kirim pesan teks terlebih dahulu.')
  }
  const prompt =
    typeof content === 'string'
      ? content.trim()
      : content
          .map((part) => part.text)
          .join('\n')
          .trim()
  if (!prompt || prompt.length > 4000) {
    throw new Error('Pesan harus berisi 1–4.000 karakter.')
  }

  return {
    sessionId: metadata.data.sessionId,
    catId: metadata.data.catId,
    prompt,
  }
}
