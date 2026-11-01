import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

  it('should call onChange when the user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <SearchBar
        value=""
        onChange={onChange}
      />
    )

    await user.type(
      screen.getByRole('textbox'),
      'react'
    )

    expect(onChange).toHaveBeenCalled()
    expect(onChange).toHaveBeenLastCalledWith('t')
  })

  it('should clear the search value when the clear button is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <SearchBar
        value="react"
        onChange={onChange}
      />
    )

    await user.click(
      screen.getByRole('button', {
        name: /クリア|clear/i
      })
    )

    expect(onChange).toHaveBeenCalledWith('')
  })
})