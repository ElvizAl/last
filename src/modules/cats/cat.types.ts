import type { listCats } from './cat.api'

export type CatProfile = Awaited<ReturnType<typeof listCats>>['cats'][number]
