import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { ParkDetailPage } from './ParkDetailPage'

function renderPark(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/park/${id}`]}>
      <Routes>
        <Route path="/park/:id" element={<ParkDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

afterEach(() => {
  cleanup()
})

describe('ParkDetailPage', () => {
  it('shows Highland Dog Park without an address or photos', () => {
    renderPark('highland-dog-park')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Highland Dog Park' }),
    ).toBeInTheDocument()
    expect(document.title).toBe('Highland Dog Park · Find a Park')
    expect(screen.getByRole('link', { name: /back to all parks/i })).toHaveAttribute(
      'href',
      '/',
    )
    expect(
      screen.getByText(
        'Fully fenced off-leash dog park with separate small-dog and large-dog areas, water fountains, and shade structures.',
      ),
    ).toBeInTheDocument()
    expect(screen.queryByText('No description available')).not.toBeInTheDocument()
    expect(screen.queryByText('Address')).not.toBeInTheDocument()
    expect(screen.getByText('Hours')).toBeInTheDocument()
    expect(screen.getByText('6:00 AM - 9:00 PM')).toBeInTheDocument()
    expect(screen.getByText('Size')).toBeInTheDocument()
    expect(screen.getByText('5 acres')).toBeInTheDocument()
    expect(screen.getByText('4.8 / 5')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Rated 4.8 out of 5' })).toBeInTheDocument()
    expect(screen.getByText('Dog run')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Photos' })).not.toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /photo of highland dog park/i })).not.toBeInTheDocument()
    expect(document.querySelector('img')).toBeNull()

    const placeholder = screen.getByRole('img', { name: 'No photo available' })
    expect(placeholder.parentElement?.className).toContain('md:rounded-3xl')

    const card = document.querySelector('[class*="rounded-t-3xl"]')
    expect(card).not.toBeNull()
    expect(card?.className).toContain('-mt-6')
    expect(card?.className).toContain('rounded-t-3xl')
    expect(card?.querySelector('[class*="w-12"][class*="rounded-full"]')).not.toBeNull()
    expect(document.querySelector('[class*="max-w-3xl"]')).not.toBeNull()
  })

  it('shows Cedar Hill Nature Preserve with no rating', () => {
    renderPark('cedar-hill-nature-preserve')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Cedar Hill Nature Preserve' }),
    ).toBeInTheDocument()
    expect(document.title).toBe('Cedar Hill Nature Preserve · Find a Park')
    expect(screen.getAllByText('Cedar Hill Rd').length).toBeGreaterThan(0)
    expect(
      screen.getByText(
        'Protected woodland with 4 miles of marked hiking trails and a birding blind overlooking a restored wetland.',
      ),
    ).toBeInTheDocument()
    expect(screen.queryByText('No description available')).not.toBeInTheDocument()
    expect(screen.getByText('No rating yet')).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /rated/i })).not.toBeInTheDocument()
    expect(screen.getByText('212 acres')).toBeInTheDocument()
    expect(screen.getByText('Dawn to dusk')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Photos' })).toBeInTheDocument()
  })

  it('shows Old Mill Botanical Garden with no description', () => {
    renderPark('old-mill-botanical-garden')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Old Mill Botanical Garden' }),
    ).toBeInTheDocument()
    expect(document.title).toBe('Old Mill Botanical Garden · Find a Park')
    expect(screen.getByText('No description available')).toBeInTheDocument()
    expect(screen.getAllByText('12 Old Mill Ln').length).toBeGreaterThan(0)
    expect(screen.getByText('4.6 / 5')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Rated 4.6 out of 5' })).toBeInTheDocument()
    expect(screen.getByText('34 acres')).toBeInTheDocument()
    expect(screen.getByText('Gardens')).toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: /old mill botanical garden photo/i })).toHaveLength(
      2,
    )
  })

  it('shows the placeholder when a photo URL fails', () => {
    renderPark('prospect-park')

    const photos = screen.getAllByRole('img', { name: /prospect park photo/i })
    expect(photos).toHaveLength(1)
    fireEvent.error(photos[0])

    expect(screen.getByRole('img', { name: 'No photo available' })).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /prospect park photo/i })).not.toBeInTheDocument()
  })

  it('shows Park not found with a link home for an unknown id', () => {
    renderPark('no-such-park')

    expect(screen.getByRole('heading', { level: 1, name: 'Park not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to all parks/i })).toHaveAttribute('href', '/')
    expect(document.title).toBe('Park not found · Find a Park')
    expect(screen.queryByRole('heading', { name: 'Photos' })).not.toBeInTheDocument()
  })
})
