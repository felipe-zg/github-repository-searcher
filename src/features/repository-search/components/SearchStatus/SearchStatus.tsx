import './SearchStatus.css'

type SearchStatusProps = {
  query: string
  loading: boolean
  error: string | null
  repositoryCount: number
}

export const SearchStatus = ({
  query,
  loading,
  error,
  repositoryCount
}: SearchStatusProps) => {
  if (!query.trim()) {
    return (
      <div className="search-status">
        <p>キーワードを入力して、GitHub のリポジトリを検索しましょう。</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="search-status">
        <div className="search-status__spinner" />
        <p>リポジトリを検索しています...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="search-status search-status--error">
        <p>{error}</p>
      </div>
    )
  }

  if (repositoryCount === 0) {
    return (
      <div className="search-status">
        <p>「{query}」に一致するリポジトリは見つかりませんでした。</p>
        <span>別のキーワードで検索してみてください。</span>
      </div>
    )
  }

  return null
}