import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('should display the current search value', () => {
    render(
      <SearchBar
        value="react"
        onChange={vi.fn()}
      />
    )

    expect(screen.getByRole('textbox')).toHaveValue('react')
  })
})