
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiPackage, FiCheckCircle, FiClock, FiTruck, FiXCircle } from 'react-icons/fi'
import { getApiUrl } from '../utils/apiHelpers'
import toast from 'react-hot-toast'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          setError('Please login to view order details')
          setLoading(false)
          return
        }

        console.log('📡 Fetching order:', id)
        const response = await fetch(getApiUrl(`/orders/${id}/`), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Order not found')
          }
          throw new Error(`HTTP ${response.status}`)
        }
        
        const data = await response.json()
        console.log('✅ Order details:', data)
        setOrder(data)
        setLoading(false)
      } catch (err) {
        console.error('❌ Order detail error:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const getStatusIcon = (status) => {
    const icons = {
      'P': <FiClock className="w-6 h-6 text-yellow-500" />,
      'S': <FiTruck className="w-6 h-6 text-blue-500" />,
      'D': <FiCheckCircle className="w-6 h-6 text-green-500" />,
      'F': <FiXCircle className="w-6 h-6 text-red-500" />,
    }
    return icons[status] || <FiPackage className="w-6 h-6 text-gray-500" />
  }

  const getStatusColor = (status) => {
    const colors = {
      'P': 'bg-yellow-100 text-yellow-800',
      'S': 'bg-blue-100 text-blue-800',
      'D': 'bg-green-100 text-green-800',
      'F': 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status) => {
    const texts = {
      'P': 'Pending',
      'S': 'Shipped',
      'D': 'Delivered',
      'F': 'Failed',
    }
    return texts[status] || status
  }

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Order</h2>
          <p className="text-red-600">{error}</p>
          <Link to="/orders" className="inline-block mt-4 text-blue-600 hover:underline">
            ← Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container-custom py-8 text-center">
        <p className="text-gray-500">Order not found</p>
        <Link to="/orders" className="inline-block mt-4 text-blue-600 hover:underline">
          ← Back to Orders
        </Link>
      </div>
    )
  }

  const total = order.items?.reduce(
    (sum, item) => sum + (parseFloat(item.unit_price) || 0) * (item.quantity || 1),
    0
  ) || 0

  return (
    <div className="container-custom py-8">
      <Link to="/orders" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6">
        <FiArrowLeft className="mr-2" />
        Back to Orders
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">

        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Order #{order.id}
              </h1>
              <p className="text-gray-500 text-sm">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusIcon(order.status)}
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>
        </div>


        <div className="px-6 py-4">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                <img
                  src={item.product?.image || 'https://via.placeholder.com/60x60?text=No+Image'}
                  alt={item.product?.name || 'Product'}
                  className="w-16 h-16 object-cover rounded bg-gray-100"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/60x60?text=No+Image'
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {item.product?.name || 'Product'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">
                    ${(item.quantity * parseFloat(item.unit_price || 0)).toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-sm">
                    ${parseFloat(item.unit_price || 0).toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Order Total</span>
            <span className="text-2xl font-bold text-blue-600">
              ${total.toFixed(2)}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Payment ID: {order.payment_intent_id || 'Not provided'}
          </p>
        </div>
      </div>
    </div>
  )
}