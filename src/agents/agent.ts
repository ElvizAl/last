import { Agent } from '@anvia/core'
import { PrismaMemoryStore } from '@anvia/memory-prisma'
import { prisma } from '../lib/db/prisma.ts'
import { model } from './model.ts'
import { BASE_INSTRUCTIONS } from './prompt.ts'
import { createGetCatProfileTool } from './tools/get-cat-profile.ts'
import { createSearchPenyakitTool } from './tools/search-knowledge.ts'

export const memoryStore = new PrismaMemoryStore({ client: prisma })

export function createRagAgent(userId: string, catId: string) {
  const getCatProfile = createGetCatProfileTool(userId, catId)

  return new Agent({
    id: 'anabulcare-rag',
    name: 'Asisten Kesehatan Kucing',
    model,
    instructions: BASE_INSTRUCTIONS,
    tools: [getCatProfile, searchPenyakit],
    memory: { store: memoryStore, savePolicy: 'turn' },
    maxTurns: 8,
  })
}
