// src/pages/Admin/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { FiPackage, FiShoppingBag, FiDollarSign } from 'react-icons/fi'
import { getApiUrl } from '../../utils/apiHelpers'
import StatsCard from '../../components/admin/StatsCard'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token')
        
        // Fetch products
        const productsRes = await fetch(getApiUrl('/products/'), {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const productsData = await productsRes.json()
        
        // Fetch orders
        const ordersRes = await fetch(getApiUrl('/orders/'), {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const ordersData = await ordersRes.json()
        
        const orders = ordersData.results || ordersData || []
        let totalRevenue = 0
        orders.forEach(order => {
          if (order.items) {
            order.items.forEach(item => {
              totalRevenue += (item.quantity || 0) * (parseFloat(item.unit_price) || 0)
            })
          }
        })

        setStats({
          totalProducts: productsData.count || productsData.results?.length || 0,
          totalOrders: orders.length,
          totalRevenue: totalRevenue,
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={FiPackage}
          color="blue"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={FiShoppingBag}
          color="green"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={FiDollarSign}
          color="yellow"
        />
      </div>
    </div>
  )
}