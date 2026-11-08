import { createVectorSearchTool } from '@anvia/core/vector-store'
import { embeddingModel, store, sourceFilter } from '../rag/store.ts'

export function createSearchPenyakitTool() {
  return createVectorSearchTool({
    name: 'cari_penyakit',
    description:
      'Cari referensi kesehatan dan penyakit kucing berdasarkan gejala serta faktor risiko. Mengembalikan kutipan dokumen beserta sumber dan nomor halaman.',
    store,
    model: embeddingModel,
    topK: 5,
    filter: sourceFilter,
  })
}
