
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import type { SearchRepository } from '@/domain/use-cases/SearchRepository'
import type { RepositorySearchResult } from '@/domain/models'
import githubRepositoryReducer  from '@/state/githubRepository/githubRepositorySlice'

import { SearchPage } from './SearchPage'

const makeSearchResult = (): RepositorySearchResult => ({
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

const makeSut = () => {
  const search = vi.fn<SearchRepository['search']>()
    .mockResolvedValue(makeSearchResult())

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
          extraArgument: { searchRepository }
        }
      })
  })

  return {
    search,
    store
  }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('SearchPage integration', () => {
  it('should search repositories and display the results after the debounce delay', async () => {
    vi.useFakeTimers()

    const { search, store } = makeSut()

    render(
      <Provider store={store}>
        <SearchPage />
      </Provider>
    )

    const input = screen.getByRole('textbox')

    fireEvent.change(input, {
      target: { value: 'react' }
    })

    // The search should not execute before the debounce delay.
    expect(search).not.toHaveBeenCalled()

    // Advance the debounce timer.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })

    expect(search).toHaveBeenCalledTimes(1)

    expect(search).toHaveBeenCalledWith(
      {
        q: 'react',
        page: 1,
        per_page: 10
      },
      expect.any(AbortSignal)
    )

    // Verify that the repository is displayed.
    expect(
      screen.getByRole('link', {
        name: /facebook\/react/i
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText((_, element) =>
        element?.tagName.toLowerCase() === 'span' &&
        element.textContent?.includes('200,000') === true
      )
    ).toBeInTheDocument()
  })
})
