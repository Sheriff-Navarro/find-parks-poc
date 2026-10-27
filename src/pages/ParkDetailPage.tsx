import { useParams } from 'react-router-dom'

export function ParkDetailPage() {
  const { id } = useParams()

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-ink">Park details</h1>
      <p className="mt-2 text-muted">{id}</p>
    </main>
  )
}
