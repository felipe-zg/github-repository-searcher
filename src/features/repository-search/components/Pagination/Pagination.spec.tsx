import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Pagination } from './Pagination'

const makeSut = (props = {}) => {
  const onPageChange = vi.fn()

  render(
    <Pagination
      currentPage={2}
      totalPages={5}
      loading={false}
      onPageChange={onPageChange}
      {...props}
    />
  )

  return {
    onPageChange
  }
}

describe('Pagination', () => {
  it('should display the current page and total pages', () => {
    makeSut({
      currentPage: 2,
      totalPages: 5
    })

    const paginationText = screen.getByText((_, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' &&
        element.textContent?.replace(/\s+/g, ' ').trim() === '2 / 5 ページ目'
      )
    })

    expect(paginationText).toBeInTheDocument()
  })
})