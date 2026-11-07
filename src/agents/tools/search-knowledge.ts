import { createVectorSearchTool } from '@anvia/core/vector-store'
import type { EvidenceRegistry } from './grade-evidence.ts'
import { embeddingModel, store, sourceFilter } from '../rag/store.ts'

export function createSearchPenyakitTool(evidence: EvidenceRegistry) {
  const search = createVectorSearchTool({
    name: 'cari_penyakit',
    description:
      'Cari referensi kesehatan dan penyakit kucing berdasarkan gejala serta faktor risiko. Mengembalikan kutipan dokumen beserta sumber dan nomor halaman.',
    store,
    model: embeddingModel,
    minScore: 0.78,
    topK: 5,
    filter: sourceFilter,
  })

  return {
    ...search,
    call: async (
      input: Parameters<typeof search.call>[0],
      context?: Parameters<typeof search.call>[1],
    ) => {
      const results = await search.call(input, context)
      for (const result of results) evidence.set(result.id, result)
      return results
    },
  }
}
