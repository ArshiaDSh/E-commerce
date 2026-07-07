// src/pages/Admin/AdminUsers.jsx
import { useState, useEffect } from 'react'
import { getApiUrl } from '../../utils/apiHelpers'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Note: You'll need to create a users endpoint in your backend
    // For now, this is a placeholder
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">User management coming soon...</p>
        <p className="text-sm text-gray-400 mt-2">
          You'll need to create a /api/users/ endpoint in your backend.
        </p>
      </div>
    </div>
  )
}