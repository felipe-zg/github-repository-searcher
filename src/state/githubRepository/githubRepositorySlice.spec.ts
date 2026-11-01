import { describe, it, expect, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'

import type { SearchRepository } from '@/domain/use-cases/SearchRepository'
import type { RepositorySearchResult } from '@/domain/models'

import githubRepositoryReducer, {
  fetchRepositories,
} from './githubRepositorySlice'

const makeSearchResult = (): RepositorySearchResult => ({
  repositories: [
    {
      id: 123,
      name: 'react',
      fullName: 'facebook/react',
      description: 'A JavaScript library',
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

const makeSut = () => {
  const search = vi.fn<SearchRepository['search']>()

  const searchRepository: SearchRepository = {
    search
  }

  const store = configureStore({
    reducer: {
      githubRepository: githubRepositoryReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            searchRepository
          }
        }
      })
  })

  return {
    store,
    search,
    searchRepository
  }
}

describe('githubRepositorySlice', () => {
  it('should set loading to true when a search request starts', async () => {
    const { store, search } = makeSut()

    search.mockResolvedValue(makeSearchResult())

    const request = store.dispatch(
      fetchRepositories({
        q: 'react',
        page: 1,
        per_page: 10
      })
    )

    expect(store.getState().githubRepository.loading).toBe(true)

    await request
  })

  it('should store repositories and totalCount when a search succeeds', async () => {
    const { store, search } = makeSut()

    search.mockResolvedValue(makeSearchResult())

    await store.dispatch(
      fetchRepositories({
        q: 'react',
        page: 1,
        per_page: 10
      })
    )

    const state = store.getState().githubRepository

    expect(state.repositories).toHaveLength(1)
    expect(state.repositories[0].fullName).toBe('facebook/react')
    expect(state.totalCount).toBe(1)
    expect(state.currentPage).toBe(1)
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
  })
})