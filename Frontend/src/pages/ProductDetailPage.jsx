
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { FiShoppingCart, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { getApiUrl } from '../utils/apiHelpers'
import { getImageUrl } from '../utils/imageHelpers'
import { getCategory } from '../api'

export default function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoryName, setCategoryName] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const url = getApiUrl(`/products/${id}/`)
        console.log('📡 Fetching product from:', url)
        
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        setProduct(data)
        setLoading(false)
        
        if (data.category) {
          try {
            const categoryResponse = await getCategory(data.category)
            setCategoryName(categoryResponse.data.name)
          } catch (catError) {
            console.error('Failed to fetch category:', catError)
          }
        }
      } catch (err) {
        console.error('Product detail error:', err)
        setError(err.message)
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && product && newQuantity <= product.inventory) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (!product || !product.id) {
      toast.error('Product not available')
      return
    }
    
    try {
      dispatch(addToCart({ productId: product.id, quantity }))
      toast.success(`Added ${quantity} ${product.name} to cart!`)
      setQuantity(1)
    } catch (error) {
      console.error('Add to cart error:', error)
      toast.error('Failed to add to cart')
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="bg-gray-200 rounded-lg h-96"></div>
            </div>
            <div className="md:w-1/2">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-24 bg-gray-200 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container-custom py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
        <Link to="/products" className="text-blue-600 hover:underline">
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6">
        <FiArrowLeft className="mr-2" />
        Back to Products
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'
              }}
            />
          </div>
        </div>

        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          

          <p className="text-gray-500 mb-4">
            Category: {categoryName || 'Uncategorized'}
          </p>
          
          <div className="text-3xl font-bold text-blue-600 mb-4">
            ${parseFloat(product.price).toFixed(2)}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{product.description || 'No description available.'}</p>
          </div>

          <div className="mb-6">
            <span className="font-semibold text-gray-700">Availability: </span>
            {product.inventory > 0 ? (
              <span className="text-green-600">{product.inventory} in stock</span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </div>

          {product.inventory > 0 && (
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  type="button"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.inventory}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  type="button"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                type="button"
              >
                <FiShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          )}

          {product.inventory === 0 && (
            <button
              disabled
              className="w-full px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-semibold"
              type="button"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  )
}