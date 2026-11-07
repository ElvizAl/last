import { createVectorSearchTool } from '@anvia/core/vector-store'
import type { AnyTool } from '@anvia/core'
import { embeddingModel, store } from '../rag/store.ts'

export const searchPenyakit: AnyTool = createVectorSearchTool({
  name: 'cari_penyakit',
  description:
    'Cari referensi kesehatan dan penyakit kucing berdasarkan gejala serta faktor risiko. Mengembalikan kutipan dokumen beserta sumber dan nomor halaman.',
  store,
  model: embeddingModel,
  minScore: 0.78,
  topK: 5,
})
