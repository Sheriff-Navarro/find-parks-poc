import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { ParkPopup } from '../components/map/ParkPopup'
import { getParkById } from '../data/parks'
import { ParkDetailPage } from './ParkDetailPage'

vi.mock('../components/map/ParkMap.tsx', () => ({
  ParkMap: () => <div data-testid="park-map" />,
}))

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })
})

afterEach(() => {
  cleanup()
})

describe('search round trip', () => {
  it('restores the search after Back to all parks from a list item', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    await user.type(screen.getByRole('searchbox'), 'prospect')
    expect(screen.queryByRole('link', { name: /riverside commons/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /prospect park/i }))
    expect(screen.getByRole('heading', { level: 1, name: 'Prospect Park' })).toBeInTheDocument()

    const backLink = screen.getByRole('link', { name: /back to all parks/i })
    expect(backLink).toHaveAttribute('href', '/?q=prospect')
    await user.click(backLink)

    expect(screen.getByRole('searchbox')).toHaveValue('prospect')
    expect(screen.getByRole('heading', { level: 1, name: /\(1 of \d+\)/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /prospect park/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /riverside commons/i })).not.toBeInTheDocument()
  })

  it('goes back to the unfiltered list when no search was active', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('link', { name: /prospect park/i }))
    const backLink = screen.getByRole('link', { name: /back to all parks/i })
    expect(backLink).toHaveAttribute('href', '/')
    await user.click(backLink)

    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByRole('link', { name: /riverside commons/i })).toBeInTheDocument()
  })

  it('keeps the search when opening details from a map popup', async () => {
    const user = userEvent.setup()
    const park = getParkById('prospect-park')
    if (park === null) throw new Error('prospect-park missing from data')

    render(
      <MemoryRouter initialEntries={['/?q=pro']}>
        <Routes>
          <Route path="/" element={<ParkPopup park={park} />} />
          <Route path="/park/:id" element={<ParkDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('link', { name: 'View details' }))

    expect(screen.getByRole('link', { name: /back to all parks/i })).toHaveAttribute(
      'href',
      '/?q=pro',
    )
  })
})
