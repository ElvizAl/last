import { agentToClientStream, parseClientStreamRequest } from '@anvia/client'
import { createClientStreamResponse } from '@anvia/server'
import { createFileRoute } from '@tanstack/react-router'
import { createRagAgent } from '#/agents/agent'
import { prisma } from '#/lib/db/prisma'
import { auth } from '#/lib/auth/auth'
import { readChatInput } from '#/modules/chat/chat-request'

const MAX_BODY_BYTES = 64_000

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = request.headers.get('origin')
        if (origin && origin !== new URL(request.url).origin) {
          return new Response('Origin tidak diizinkan.', { status: 403 })
        }

        try {
          // 1. Cek login.
          const session = await auth.api.getSession({
            headers: request.headers,
          })
          if (!session) return new Response('Silakan login.', { status: 401 })

          if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
            return new Response('Pesan terlalu panjang.', { status: 413 })
          }

          let raw = ''
          const reader = request.body?.getReader()
          if (reader) {
            let size = 0
            const decoder = new TextDecoder()
            try {
              for (;;) {
                const { done, value } = await reader.read()
                if (done) break
                size += value.byteLength
                if (size > MAX_BODY_BYTES) {
                  await reader.cancel()
                  return new Response('Pesan terlalu panjang.', { status: 413 })
                }
                raw += decoder.decode(value, { stream: true })
              }
              raw += decoder.decode()
            } finally {
              reader.releaseLock()
            }
          }

          // 2. Validasi pesan dan ID percakapan.
          let input: ReturnType<typeof readChatInput>
          try {
            input = readChatInput(parseClientStreamRequest(JSON.parse(raw)))
          } catch {
            return new Response(
              'Pesan tidak valid. Kirim teks 1–4.000 karakter dengan metadata.sessionId berupa UUID serta catId kucing yang dipilih.',
              { status: 400 },
            )
          }

          // 3. Periksa kepemilikan kucing sebelum menjalankan agent.
          const userId = session.user.id
          const cat = await prisma.cat.findFirst({
            where: { id: input.catId, userId },
            select: { id: true },
          })
          if (!cat)
            return new Response('Kucing tidak ditemukan.', { status: 404 })

          // Satu percakapan hanya untuk satu kucing, termasuk setelah reload.
          const conversation = await prisma.chatConversation.findUnique({
            where: { userId_sessionId: { userId, sessionId: input.sessionId } },
          })
          if (!conversation) {
            const oldMemory = await prisma.agentMemorySession.findFirst({
              where: { userId, sessionId: input.sessionId },
              select: { id: true },
            })
            if (oldMemory)
              return new Response(
                'Percakapan lama belum terhubung ke kucing. Mulai chat baru.',
                { status: 409 },
              )
          }
          const binding = await prisma.chatConversation.upsert({
            where: { userId_sessionId: { userId, sessionId: input.sessionId } },
            create: { userId, sessionId: input.sessionId, catId: cat.id },
            update: {},
          })
          if (binding.catId !== cat.id) {
            return new Response(
              'Kucing percakapan ini tidak bisa diganti. Mulai chat baru.',
              { status: 409 },
            )
          }

          const agent = createRagAgent(userId, cat.id)
          const events = agent.stream({
            prompt: input.prompt,
            session: {
              sessionId: input.sessionId,
              userId: session.user.id,
            },
            abortSignal: request.signal,
          })

          // 4. Kirim jawaban secara streaming.
          return createClientStreamResponse({
            events: agentToClientStream({
              events,
              mapError: () => ({
                message: 'Jawaban belum berhasil dimuat. Silakan coba lagi.',
              }),
            }),
            format: 'jsonl',
            headers: { 'Cache-Control': 'no-store' },
          })
        } catch {
          return new Response(
            'Layanan chat sedang tidak tersedia. Silakan coba lagi.',
            { status: 500 },
          )
        }
      },
    },
  },
})
