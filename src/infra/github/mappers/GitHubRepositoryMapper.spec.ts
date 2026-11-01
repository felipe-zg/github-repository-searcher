import { describe, it, expect } from 'vitest'

import { GitHubRepositoryMapper } from '@/infra/github/mappers'
import type {
  GitHubRepositoryDTO,
} from '@/infra/github/models'

const makeGitHubRepositoryDTO = (): GitHubRepositoryDTO => ({
  id: 123,
  name: 'react',
  full_name: 'facebook/react',
  description: 'A JavaScript library for building user interfaces',
  html_url: 'https://github.com/facebook/react',
  owner: {
    login: 'facebook',
    avatar_url: 'https://avatars.githubusercontent.com/u/69631',
    html_url: 'https://github.com/facebook'
  },
  language: 'JavaScript',
  stargazers_count: 200000,
  forks_count: 40000,
  watchers_count: 6500,
  open_issues_count: 1000,
  created_at: '2013-05-24T16:15:54Z',
  updated_at: '2026-10-30T12:00:00Z'
})

describe('GitHubRepositoryMapper', () => {
  describe('toDomain', () => {
    it('should map a GitHub repository DTO to a RepositoryModel', () => {
      const dto = makeGitHubRepositoryDTO()

      const result = GitHubRepositoryMapper.toDomain(dto)

      expect(result).toEqual({
        id: 123,
        name: 'react',
        fullName: 'facebook/react',
        description: 'A JavaScript library for building user interfaces',
        htmlUrl: 'https://github.com/facebook/react',
        owner: {
          login: 'facebook',
          avatarUrl: 'https://avatars.githubusercontent.com/u/69631',
          htmlUrl: 'https://github.com/facebook'
        },
        language: 'JavaScript',
        stargazersCount: 200000,
        forksCount: 40000,
        watchersCount: 6500,
        openIssuesCount: 1000,
        createdAt: '2013-05-24T16:15:54Z',
        updatedAt: '2026-10-30T12:00:00Z'
      })
    })

    it('should preserve null descriptions and languages', () => {
      const dto = makeGitHubRepositoryDTO()

      dto.description = null
      dto.language = null

      const result = GitHubRepositoryMapper.toDomain(dto)

      expect(result.description).toBeNull()
      expect(result.language).toBeNull()
    })

    it('should correctly map nested owner properties', () => {
      const dto = makeGitHubRepositoryDTO()

      const result = GitHubRepositoryMapper.toDomain(dto)

      expect(result.owner).toEqual({
        login: 'facebook',
        avatarUrl: 'https://avatars.githubusercontent.com/u/69631',
        htmlUrl: 'https://github.com/facebook'
      })
    })
  })
})