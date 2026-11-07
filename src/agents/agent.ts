import { Agent } from '@anvia/core'
import { model } from './model.ts'
import { BASE_INSTRUCTIONS } from './prompt.ts'
import { searchPenyakit } from './tools/search-knowledge.ts'

// Buat instance baru untuk setiap percakapan; belum menggunakan memory persisten.
export function createRagAgent() {
  return new Agent({
    id: 'anabulcare-rag',
    name: 'Asisten Kesehatan Kucing',
    model,
    instructions: BASE_INSTRUCTIONS,
    tools: [searchPenyakit],
    maxTurns: 8,
  })
}
