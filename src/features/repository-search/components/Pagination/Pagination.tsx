import './Pagination.css'

type PaginationProps = {
  currentPage: number
  totalPages: number
  loading: boolean
  onPageChange: (page: number) => void
}

export const Pagination = ({
  currentPage,
  totalPages,
  loading,
  onPageChange
}: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1 || loading}
        onClick={() => onPageChange(currentPage - 1)}
      >
        前へ
      </button>

      <span>
        <strong>{currentPage}</strong> / {totalPages} ページ目
      </span>

      <button
        disabled={currentPage >= totalPages || loading}
        onClick={() => onPageChange(currentPage + 1)}
      >
        次へ
      </button>
    </div>
  )
}