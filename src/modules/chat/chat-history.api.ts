import { parseMessage } from '@anvia/core'
import { messageText } from '@anvia/client'
import { initialMessagesFromMemory } from '@anvia/react'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { z } from 'zod'
import { memoryStore } from '#/agents/agent'
import { prisma } from '#/lib/db/prisma'
import { auth } from '#/lib/auth/auth'

async function requireUserId() {
  const session = await auth.api.getSession({ headers: getRequestHeaders() })
  if (!session) throw new Error('Silakan login terlebih dahulu.')
  return session.user.id
}

function titleFromMessage(message: unknown) {
  try {
    const first = initialMessagesFromMemory([parseMessage(message)])[0]
    return messageText(first).trim().slice(0, 80) || 'Percakapan'
  } catch {
    return 'Percakapan'
  }
}

export const listChatConversations = createServerFn({ method: 'GET' }).handler(
  async () => {
    const userId = await requireUserId()
    const sessions = await prisma.agentMemorySession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 100,
      select: {
        sessionId: true,
        messages: {
          where: { role: 'user' },
          orderBy: { position: 'asc' },
          take: 1,
          select: { message: true },
        },
      },
    })

    const bindings = await prisma.chatConversation.findMany({
      where: {
        userId,
        sessionId: { in: sessions.map((item) => item.sessionId) },
      },
      select: { sessionId: true, catId: true, cat: { select: { name: true } } },
    })

    return sessions.map((session) => ({
      id: session.sessionId,
      catId:
        bindings.find((item) => item.sessionId === session.sessionId)?.catId ??
        null,
      catName:
        bindings.find((item) => item.sessionId === session.sessionId)?.cat
          ?.name ?? null,
      title: session.messages[0]
        ? titleFromMessage(session.messages[0].message)
        : 'Percakapan',
    }))
  },
)

export const loadChatConversation = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => z.object({ id: z.uuid() }).parse(data))
  .handler(async ({ data }) => {
    const userId = await requireUserId()
    const owned = await prisma.agentMemorySession.findFirst({
      where: { sessionId: data.id, userId },
      select: { id: true },
    })
    if (!owned) throw new Error('Percakapan tidak ditemukan.')

    const messages = await memoryStore.load({
      scope: { sessionId: data.id, userId },
    })
    const conversation = await prisma.chatConversation.findUnique({
      where: { userId_sessionId: { userId, sessionId: data.id } },
      select: { catId: true, cat: { select: { name: true } } },
    })
    return {
      messages: initialMessagesFromMemory(messages),
      catId: conversation?.catId ?? null,
      catName: conversation?.cat?.name ?? null,
    }
  })
