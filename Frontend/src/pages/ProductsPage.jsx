
import { useState, useEffect } from 'react'
import ProductCard from '../components/features/ProductCard'
import { getApiUrl } from '../utils/apiHelpers'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async (searchTerm = '') => {
    console.log('🔍 Fetching products with search:', searchTerm)
    setLoading(true)
    
    try {
      let url = getApiUrl('/products/')
      if (searchTerm) {
        url = `${url}?search=${encodeURIComponent(searchTerm)}`
      }
      
      console.log('📡 Fetching URL:', url)
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Products received:', data.results?.length || 0, 'products')
      setProducts(data.results || [])
      setLoading(false)
    } catch (err) {
      console.error('❌ Fetch error:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])


  const handleSearch = (e) => {
    e.preventDefault()  
    console.log('🔍 Search submitted with:', search)
    fetchProducts(search)
  }

  const handleClear = () => {
    console.log('🧹 Clearing search')
    setSearch('')
    fetchProducts('')
  }


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      fetchProducts(search)
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
              <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Products</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchProducts(search)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">

      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 font-medium shadow-md hover:shadow-lg cursor-pointer"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-200 cursor-pointer"
            >
              Clear
            </button>
          )}
        </form>
        <div className="mt-2 text-sm text-gray-500">
          Found {products.length} products
        </div>
      </div>

  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found. Try adjusting your search.</p>
        </div>
      )}
    </div>
  )
}