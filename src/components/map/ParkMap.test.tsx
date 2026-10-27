import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import type { Park } from '../../types/park'
import { ParkMap } from './ParkMap'

function makePark(id: string, name: string, lat: number | null, lng: number | null): Park {
  return {
    id,
    name,
    description: null,
    location: { lat, lng, address: null },
    amenities: [],
    hours: null,
    images: [],
    acreage: null,
    rating: null,
  }
}

const alpha = makePark('alpha', 'Alpha Park', 40.7, -74.0)
const bravo = makePark('bravo', 'Bravo Park', null, null)
const charlie = makePark('charlie', 'Charlie Park', 40.72, -73.98)
const delta = makePark('delta', 'Delta Park', 40.74, -73.96)
const allParks = [alpha, bravo, charlie, delta]

function ui(parks: Park[]) {
  return (
    <MemoryRouter>
      <ParkMap parks={parks} />
    </MemoryRouter>
  )
}

function markerNames() {
  return screen
    .getAllByRole('button', { name: /, show details$/ })
    .map((el) => el.getAttribute('aria-label'))
}

function marker(name: string) {
  return screen.getByRole('button', { name: `${name}, show details` })
}

async function focusMarker(name: string) {
  const icon = marker(name)
  act(() => icon.focus())
  const link = await screen.findByRole('link', { name: 'View details' })
  return { icon, link }
}

afterEach(() => {
  cleanup()
})

describe('ParkMap keyboard access', () => {
  it('renders focusable, named markers in list order and skips parks without coordinates', () => {
    render(ui(allParks))

    const icons = screen.getAllByRole('button', { name: /, show details$/ })
    expect(icons).toHaveLength(3)
    for (const icon of icons) {
      expect(icon).toHaveAttribute('tabindex', '0')
      expect(icon).toHaveAttribute('role', 'button')
    }
    expect(markerNames()).toEqual([
      'Alpha Park, show details',
      'Charlie Park, show details',
      'Delta Park, show details',
    ])
    expect(icons[0]).toHaveAttribute('title', 'Alpha Park, show details')
  })

  it('keeps markers in list order after filtering and clearing', () => {
    const { rerender } = render(ui(allParks))

    rerender(ui([charlie]))
    expect(markerNames()).toEqual(['Charlie Park, show details'])

    rerender(ui(allParks))
    expect(markerNames()).toEqual([
      'Alpha Park, show details',
      'Charlie Park, show details',
      'Delta Park, show details',
    ])
  })

  it('does not make the map container a tab stop', () => {
    const { container } = render(ui(allParks))

    const mapEl = container.querySelector('.leaflet-container')
    expect(mapEl).not.toBeNull()
    expect(mapEl).not.toHaveAttribute('tabindex')
  })

  it('opens the popup when a marker receives focus', async () => {
    render(ui(allParks))

    const { link } = await focusMarker('Charlie Park')
    expect(link).toHaveAttribute('href', '/park/charlie')
    expect(screen.getByText('Charlie Park')).toBeInTheDocument()
  })

  it('moves focus from the marker into its popup link on Tab', async () => {
    render(ui(allParks))

    const { icon, link } = await focusMarker('Alpha Park')
    fireEvent.keyDown(icon, { key: 'Tab' })
    expect(link).toHaveFocus()
  })

  it('moves focus from the marker into its popup link on Enter', async () => {
    render(ui(allParks))

    const { icon, link } = await focusMarker('Alpha Park')
    fireEvent.keyDown(icon, { key: 'Enter' })
    expect(link).toHaveFocus()
  })

  it('returns to the marker on Shift+Tab and goes to the next marker on Tab from the link', async () => {
    render(ui(allParks))

    const { icon, link } = await focusMarker('Alpha Park')
    fireEvent.keyDown(icon, { key: 'Tab' })
    fireEvent.keyDown(link, { key: 'Tab', shiftKey: true })
    expect(icon).toHaveFocus()

    fireEvent.keyDown(icon, { key: 'Tab' })
    fireEvent.keyDown(link, { key: 'Tab' })
    expect(marker('Charlie Park')).toHaveFocus()
    const nextLink = await screen.findByRole('link', { name: 'View details' })
    expect(nextLink).toHaveAttribute('href', '/park/charlie')
  })

  it('closes the popup and returns focus to the marker on Escape', async () => {
    render(ui(allParks))

    const { icon, link } = await focusMarker('Delta Park')
    fireEvent.keyDown(icon, { key: 'Tab' })
    expect(link).toHaveFocus()

    fireEvent.keyDown(link, { key: 'Escape' })
    expect(icon).toHaveFocus()
    expect(screen.queryByRole('link', { name: 'View details' })).not.toBeInTheDocument()
  })
})
