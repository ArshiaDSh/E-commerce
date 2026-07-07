
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { addToCart } from '../../store/slices/cartSlice'
import { FiShoppingCart } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { getImageUrl } from '../../utils/imageHelpers'
import { getCategory } from '../../api'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const [categoryName, setCategoryName] = useState('')
  const [loadingCategory, setLoadingCategory] = useState(false)


  useEffect(() => {
    if (product?.category) {
      setLoadingCategory(true)
      getCategory(product.category)
        .then(response => {
          setCategoryName(response.data.name)
          setLoadingCategory(false)
        })
        .catch(err => {
          console.error('Failed to fetch category:', err)
          setLoadingCategory(false)
        })
    }
  }, [product?.category])

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!product || !product.id) {
      toast.error('Product not available')
      return
    }
    
    try {
      dispatch(addToCart({ productId: product.id, quantity: 1 }))
      toast.success(`Added ${product.name} to cart!`)
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const productId = product?.id
  const productName = product?.name || 'Unnamed Product'
  const productPrice = product?.price ? parseFloat(product.price).toFixed(2) : '0.00'
  const productImage = getImageUrl(product?.image)
  const productInventory = product?.inventory ?? 0

  if (!product) {
    return <div className="bg-white rounded-lg shadow-md p-4">Product data missing</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <Link to={`/products/${productId}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
            }}
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${productId}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 line-clamp-1">
            {productName}
          </h3>
        </Link>
        
        {/* ✅ Show category name */}
        {categoryName && (
          <p className="text-sm text-gray-500 mt-1">
            {categoryName}
          </p>
        )}
        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            ${productPrice}
          </span>
          {productInventory === 0 ? (
            <span className="text-sm text-red-500 font-medium">Out of Stock</span>
          ) : (
            <button
              onClick={handleAddToCart}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
              title="Add to cart"
              type="button"
            >
              <FiShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}