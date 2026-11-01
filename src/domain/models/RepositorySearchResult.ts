import type { RepositoryModel } from "./RepositoryModel"

export type RepositorySearchResult = {
  repositories: RepositoryModel[]
  totalCount: number
  incompleteResults: boolean
}