import type { RepositorySearchResult } from '@/domain/models'

export type SearchRepositoryParams = {
  q: string
  page: number
  per_page: number
}

export interface SearchRepository {
  search: (
    params: SearchRepositoryParams,
    signal?: AbortSignal
  ) => Promise<RepositorySearchResult>
}