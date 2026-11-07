import { readFile } from 'node:fs/promises'
import { ingestVectorDocuments } from '@anvia/core/vector-store'
import { buildDiseaseDocuments, RAG_SOURCE } from './diseases.ts'
import { embeddingModel, qdrantClient, store } from './store.ts'

try {
  const pages: unknown = JSON.parse(
    await readFile(
      new URL('../../../documents/penyakit-pages.json', import.meta.url),
      'utf8',
    ),
  )
  const documents = buildDiseaseDocuments(pages)
  if (documents.length !== 50)
    throw new Error(
      `Sumber seharusnya berisi 50 entri; ditemukan ${documents.length}.`,
    )

  await store.ensure()
  for (const field of ['__anvia_document_id', 'source']) {
    await qdrantClient.createPayloadIndex(store.options.collectionName, {
      field_name: field,
      field_schema: 'keyword',
      wait: true,
    })
  }

  await ingestVectorDocuments({
    store,
    documents,
    embeddingModel,
    chunking: { strategy: 'none' },
  })
  console.log(
    `${documents.length} penyakit dari ${RAG_SOURCE} berhasil dimasukkan ke ${store.options.collectionName}.`,
  )
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
