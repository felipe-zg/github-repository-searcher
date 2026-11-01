import { SearchBar } from '@/features/repository-search/components/SearchBar/SearchBar'
import { RepositoryList } from '@/features/repository-search/components/RepositoryList/RepositoryList'
import { Pagination } from '@/features/repository-search/components/Pagination/Pagination'
import { SearchStatus } from '@/features/repository-search/components/SearchStatus/SearchStatus'
import { useRepositorySearch } from '@/features/repository-search/hooks/useRepositorySearch'

import './SearchPage.css'
import { useEffect } from 'react'

export const SearchPage = () => {
  const {
    query,
    repositories,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    handleSearch,
    handlePageChange
  } = useRepositorySearch()

  const showRepositories =
    !loading && !error && repositories.length > 0

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [currentPage])

  return (
    <main className="search-page">
      <header className="search-page__header">
        <h2>
          <span>気になるリポジトリを見つけましょう</span>
        </h2>

        <SearchBar
          value={query}
          onChange={handleSearch}
        />
      </header>

      <section className="search-page__results">
        {totalCount > 0 && (
          <div className="search-page__results-header">
            <h2>検索結果</h2>
            <span>
              {totalCount.toLocaleString()} 件のリポジトリが見つかりました
            </span>
          </div>
        )}

        <SearchStatus
          query={query}
          loading={loading}
          error={error}
          repositoryCount={repositories.length}
        />

        {showRepositories && (
          <>
            <RepositoryList repositories={repositories} />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              loading={loading}
              onPageChange={handlePageChange}
            />

            <p className="search-page__showing">
              {repositories.length} 件のリポジトリを表示しています
            </p>
          </>
        )}
      </section>
    </main>
  )
}