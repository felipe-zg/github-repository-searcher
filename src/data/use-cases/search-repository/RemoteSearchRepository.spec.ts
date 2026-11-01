import { describe, it, expect, vi } from 'vitest'

import { RemoteSearchRepository } from '@/data/use-cases'
import type { HttpGetClient } from '@/data/protocols/http'
import { HttpStatusCode } from '@/data/protocols/http'
import type {
  GitHubRepositorySearchResponseDTO
} from '@/infra/github/models'

type GitHubRepositorySearchParams = {
  q: string
  page: number
  per_page: number
}

const makeGitHubResponse = (): GitHubRepositorySearchResponseDTO => ({
  total_count: 1,
  incomplete_results: false,
  items: [
    {
      id: 123,
      name: 'react',
      full_name: 'facebook/react',
      description: 'The library for web and native user interfaces',
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
    }
  ]
})

const makeSut = (
  response: GitHubRepositorySearchResponseDTO = makeGitHubResponse()
) => {
  const httpGetClient = {
    get: vi.fn().mockResolvedValue({
      statusCode: HttpStatusCode.ok,
      body: response
    })
  } as unknown as HttpGetClient<
    GitHubRepositorySearchParams,
    GitHubRepositorySearchResponseDTO
  >

  const sut = new RemoteSearchRepository(
    'https://api.github.com/search/repositories',
    httpGetClient
  )

  return {
    sut,
    httpGetClient,
    response
  }
}

describe('RemoteSearchRepository', () => {
  it('should call the HTTP client with the correct URL and parameters', async () => {
    const { sut, httpGetClient } = makeSut()

    await sut.search({
      q: 'react',
      page: 2,
      per_page: 10
    })

    expect(httpGetClient.get).toHaveBeenCalledWith({
      url: 'https://api.github.com/search/repositories',
      params: {
        q: 'react',
        page: 2,
        per_page: 10
      },
      signal: undefined
    })
  })

  it('should pass the AbortSignal to the HTTP client', async () => {
    const { sut, httpGetClient } = makeSut()
    const controller = new AbortController()

    await sut.search(
      {
        q: 'react',
        page: 1,
        per_page: 10
      },
      controller.signal
    )

    expect(httpGetClient.get).toHaveBeenCalledWith(
      expect.objectContaining({
        signal: controller.signal
      })
    )
  })

  it('should return mapped repository search results when the response is successful', async () => {
    const { sut } = makeSut()

    const result = await sut.search({
      q: 'react',
      page: 1,
      per_page: 10
    })

    expect(result).toEqual({
      repositories: [
        {
          id: 123,
          name: 'react',
          fullName: 'facebook/react',
          description: 'The library for web and native user interfaces',
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
        }
      ],
      totalCount: 1,
      incompleteResults: false
    })
  })
})