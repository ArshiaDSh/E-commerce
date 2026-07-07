// src/components/layout/Layout.jsx
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

// ✅ Make sure this is a default export
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}