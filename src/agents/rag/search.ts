import { retrieveDocuments } from '@anvia/core/vector-store'
import { embeddingModel, store, sourceFilter } from './store.ts'

try {
  const query = process.argv.slice(2).join(' ').trim()
  if (!query) throw new Error('Gunakan: pnpm rag:search "gejala kucing"')

  const results = await retrieveDocuments({
    store,
    model: embeddingModel,
    query,
    minScore: 0.4,
    topK: 5,
    filter: sourceFilter,
  })
  console.log(JSON.stringify(results, null, 2))
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
