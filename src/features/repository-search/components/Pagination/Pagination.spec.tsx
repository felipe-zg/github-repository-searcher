import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

  it('should navigate to the next page', async () => {
    const user = userEvent.setup()
    const { onPageChange } = makeSut()

    await user.click(
      screen.getByRole('button', {
        name: '次へ'
      })
    )

    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('should navigate to the previous page', async () => {
    const user = userEvent.setup()
    const { onPageChange } = makeSut()

    await user.click(
      screen.getByRole('button', {
        name: '前へ'
      })
    )

    expect(onPageChange).toHaveBeenCalledWith(1)
  })
})