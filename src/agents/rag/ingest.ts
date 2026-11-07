import { readFile } from 'node:fs/promises'
import { ingestVectorDocuments } from '@anvia/core/vector-store'
import { z } from 'zod'
import { embeddingModel, qdrantClient, store } from './store.ts'

const diseasesSchema = z
  .array(
    z.object({
      number: z.number().int().positive(),
      disease: z.string().trim().min(1),
      symptoms: z.string().trim().min(1),
      prevention: z.string().trim(),
      handling: z.string().trim(),
      pages: z.array(z.number().int().positive()).min(1),
    }),
  )
  .min(1)

try {
  const diseases = diseasesSchema.parse(
    JSON.parse(
      await readFile(
        new URL('../../../documents/dataset.json', import.meta.url),
        'utf8',
      ),
    ),
  )
  if (
    new Set(diseases.map((disease) => disease.number)).size !== diseases.length
  ) {
    throw new Error('Nomor penyakit harus unik.')
  }

  await store.ensure()
  // Anvia replaces documents using this payload field.
  await qdrantClient.createPayloadIndex(store.options.collectionName, {
    field_name: '__anvia_document_id',
    field_schema: 'keyword',
    wait: true,
  })

  const diseaseDocuments = diseases.map((disease) => ({
    id: `dataset-disease-${disease.number}`,
    text: [
      `Penyakit: ${disease.disease}`,
      `Gejala: ${disease.symptoms}`,
      `Pencegahan: ${disease.prevention}`,
      `Penanganan: ${disease.handling}`,
    ].join('\n'),
    metadata: {
      source: 'documents/dataset.json',
      title: 'Pengetahuan Kesehatan Kucing',
      disease: disease.disease,
      page: disease.pages[0],
      pages: disease.pages.join(', '),
      version: 2,
    },
  }))

  await ingestVectorDocuments({
    store,
    documents: diseaseDocuments,
    embeddingModel,
    chunking: { strategy: 'none' },
  })
  console.log(
    `${diseases.length} penyakit berhasil dimasukkan ke ${store.options.collectionName}.`,
  )
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
