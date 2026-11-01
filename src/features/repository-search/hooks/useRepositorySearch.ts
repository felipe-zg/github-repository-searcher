import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from '@/state/store'
import {
  clearRepositories,
  fetchRepositories,
  setCurrentPage
} from '@/state/githubRepository/githubRepositorySlice'

export const useRepositorySearch = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [query, setQuery] = useState('')

  const {
    repositories,
    loading,
    error,
    currentPage,
    perPage,
    totalCount
  } = useSelector((state: RootState) => state.githubRepository)

  const handleSearch = (value: string) => {
    setQuery(value)
    dispatch(setCurrentPage(1))
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  useEffect(() => {
    if (!query.trim()) {
      dispatch(clearRepositories())
      return
    }

    let request: { abort: () => void } | undefined

    const timeout = setTimeout(() => {
      request = dispatch(
        fetchRepositories({
          q: query.trim(),
          page: currentPage,
          per_page: perPage
        })
      )
    }, 400)

    return () => {
      clearTimeout(timeout)
      request?.abort()
    }
  }, [query, currentPage, perPage, dispatch])

  const totalPages = Math.min(
    Math.ceil(totalCount / perPage),
    Math.ceil(1000 / perPage)
  )

  return {
    query,
    repositories,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    handleSearch,
    handlePageChange
  }
}