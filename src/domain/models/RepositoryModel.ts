export type RepositoryModel = {
  id: number
  name: string
  fullName: string
  description: string | null
  htmlUrl: string
  owner: {
    login: string
    avatarUrl: string
    htmlUrl: string
  }
  language: string | null
  stargazersCount: number
  forksCount: number
  watchersCount: number
  openIssuesCount: number
  createdAt: string
  updatedAt: string
}
