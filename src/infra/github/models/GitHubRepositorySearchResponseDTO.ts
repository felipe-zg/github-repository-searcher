import type { GitHubRepositoryDTO } from './GitHubRepositoryDTO'

export type GitHubRepositorySearchResponseDTO = {
  total_count: number
  incomplete_results: boolean
  items: GitHubRepositoryDTO[]
}