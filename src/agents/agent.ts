import { Agent } from '@anvia/core'
import { PrismaMemoryStore } from '@anvia/memory-prisma'
import { prisma } from '../lib/db/prisma.ts'
import { model } from './model.ts'
import { BASE_INSTRUCTIONS } from './prompt.ts'
import { createGetCatProfileTool } from './tools/get-cat-profile.ts'
import { createSearchPenyakitTool } from './tools/search-knowledge.ts'
import { askFollowup } from './tools/ask-followup.ts'
import { createAssessUrgencyTool } from './tools/assess-urgency.ts'
import { createGradeEvidenceTool } from './tools/grade-evidence.ts'
import type { EvidenceRegistry } from './tools/grade-evidence.ts'

export const memoryStore = new PrismaMemoryStore({ client: prisma })

// Saat generate/stream, sertakan sessionId dan userId dari session autentikasi server.
export function createRagAgent(
  userId: string,
  catId: string,
  userMessage: string,
) {
  const evidence: EvidenceRegistry = new Map()
  const searchPenyakit = createSearchPenyakitTool(evidence)
  const assessUrgency = createAssessUrgencyTool(userMessage)
  const gradeEvidence = createGradeEvidenceTool(evidence)
  const getCatProfile = createGetCatProfileTool(userId, catId)

  return new Agent({
    id: 'anabulcare-rag',
    name: 'Asisten Kesehatan Kucing',
    model,
    instructions: BASE_INSTRUCTIONS,
    tools: [
      getCatProfile,
      searchPenyakit,
      askFollowup,
      assessUrgency,
      gradeEvidence,
    ],
    memory: { store: memoryStore, savePolicy: 'turn' },
    maxTurns: 8,
  })
}
