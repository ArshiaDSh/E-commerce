// src/components/admin/OrderStatusBadge.jsx
export default function OrderStatusBadge({ status }) {
  const statusConfig = {
    'P': { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
    'S': { label: 'Shipped', className: 'bg-blue-100 text-blue-800' },
    'D': { label: 'Delivered', className: 'bg-green-100 text-green-800' },
    'F': { label: 'Failed', className: 'bg-red-100 text-red-800' },
  }

  const config = statusConfig[status] || statusConfig['P']

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}