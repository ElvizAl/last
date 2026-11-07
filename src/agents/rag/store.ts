import { OpenAIClient } from '@anvia/openai'
import { QdrantVectorClient } from '@anvia/qdrant'
import { QdrantClient } from '@qdrant/js-client-rest'
import type { TextDocument } from '@anvia/core/documents'
import 'dotenv/config'

const sumopod = new OpenAIClient({
  apiKey: process.env.SUMOPOD_API_KEY!,
  baseUrl: process.env.SUMOPOD_BASE_URL!,
})

export const embeddingModel = sumopod.embeddingModel({
  modelId: 'text-embedding-3-small',
})

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY,
})
const qdrant = new QdrantVectorClient({ client: qdrantClient })

export const store = qdrant.vectorStore<TextDocument>({
  collectionName: process.env.QDRANT_COLLECTION || 'anabulcare-dataset',
  dimensions: 1536,
  metric: 'cosine',
})
