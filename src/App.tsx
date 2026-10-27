import { Link, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage.tsx'
import { ParkDetailPage } from './pages/ParkDetailPage.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/park/:id" element={<ParkDetailPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function NotFound() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2">
        <Link
          to="/"
          className="text-primary underline focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Back to all parks
        </Link>
      </p>
    </main>
  )
}
