
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiChevronRight } from 'react-icons/fi'
import { getApiUrl } from '../utils/apiHelpers'
import { getOrders } from '../api'
import toast from 'react-hot-toast'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          setError('Please login to view your orders')
          setLoading(false)
          return
        }

        console.log('📡 Fetching orders...')
        const response = await getOrders()
        console.log('✅ Orders response:', response.data)
        

        const ordersData = Array.isArray(response.data) 
          ? response.data 
          : response.data.results || []
        
        setOrders(ordersData)
        setLoading(false)
      } catch (err) {
        console.error('❌ Orders error:', err)
        

        if (err.response?.status === 401) {
          setError('Please login to view your orders')
        } else if (err.response?.status === 500) {
          setError('Server error. The orders endpoint might need configuration.')

          console.error('Server error details:', err.response?.data)
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to load orders')
        }
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

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
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32 mb-4"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Orders</h2>
          <p className="text-red-600 mb-4">{error}</p>
          {error.includes('Server error') && (
            <div className="bg-gray-50 p-4 rounded text-sm text-gray-600 mb-4">
              <p className="font-semibold">Possible Causes:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>The backend OrderSerializer might be missing fields</li>
                <li>The Order model might have a field that doesn't exist in the serializer</li>
                <li>CORS or authentication issues</li>
              </ul>
              <p className="mt-2 font-semibold">Check Django console for detailed error</p>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="max-w-md mx-auto">
          <FiPackage className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-8">
            You haven't placed any orders. Start shopping to see your orders here.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const total = order.items?.reduce(
            (sum, item) => sum + (parseFloat(item.unit_price) || 0) * (item.quantity || 1),
            0
          ) || 0

          return (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <h3 className="font-semibold text-gray-800">
                      Order #{order.id}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    {order.status === 'P' && (
                      <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                        ⏳ Payment Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>


                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {order.items?.slice(0, 3).map((item) => (
                      <span key={item.id} className="text-sm text-gray-600">
                        {item.product?.name || 'Product'} × {item.quantity}
                      </span>
                    ))}
                    {order.items?.length > 3 && (
                      <span className="text-sm text-gray-400">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>


                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-bold text-blue-600">
                      ${total.toFixed(2)}
                    </p>
                  </div>
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <FiChevronRight className="w-6 h-6" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}