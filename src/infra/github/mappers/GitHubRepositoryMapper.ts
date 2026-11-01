import type { RepositoryModel } from '@/domain/models'
import type { GitHubRepositoryDTO } from '@/infra/github/models'

export class GitHubRepositoryMapper {
  static toDomain(repository: GitHubRepositoryDTO): RepositoryModel {
    return {
      id: repository.id,
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      htmlUrl: repository.html_url,
      owner: {
        login: repository.owner.login,
        avatarUrl: repository.owner.avatar_url,
        htmlUrl: repository.owner.html_url
      },
      language: repository.language,
      stargazersCount: repository.stargazers_count,
      forksCount: repository.forks_count,
      watchersCount: repository.watchers_count,
      openIssuesCount: repository.open_issues_count,
      createdAt: repository.created_at,
      updatedAt: repository.updated_at
    }
  }
}