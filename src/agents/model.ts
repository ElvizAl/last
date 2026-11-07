import { OpenAIClient } from '@anvia/openai'
import 'dotenv/config'

export const client = new OpenAIClient({
  apiKey: process.env.OPENAI_API_KEY!,
  baseUrl: process.env.OPENAI_BASE_URL!,
})

export const embeddingsClient = new OpenAIClient({
  apiKey: process.env.SUMOPOD_API_KEY!,
  baseUrl: process.env.SUMOPOD_BASE_URL!,
})

export const model = client.completionModel({
  modelId: 'cx/gpt-6-luna',
  api: 'chat',
})
