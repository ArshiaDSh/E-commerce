
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { 
  fetchCart, 
  updateCartItemQuantity, 
  removeFromCart 
} from '../store/slices/cartSlice'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { getImageUrl } from '../utils/imageHelpers'

export default function CartPage() {
  const dispatch = useDispatch()
  const { items, grand_total, loading, error } = useSelector((state) => state.cart)


  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])


  const getProductData = (item) => {
    if (item.product && typeof item.product === 'object') {
      return item.product
    }
    if (item.product_id) {
      return {
        id: item.product_id,
        name: item.product_name || 'Product',
        price: item.unit_price || item.price || 0,
        image: item.product_image || null,
      }
    }

    if (item.id && item.name) {
      return item
    }

    return {
      id: item.id || 'unknown',
      name: 'Product',
      price: 0,
      image: null,
    }
  }


  const getItemId = (item) => {
    return item.id || item.item_id || null
  }


  const getQuantity = (item) => {
    return item.quantity || 1
  }


  const getTotalPrice = (item) => {
    if (item.total_price) return item.total_price
    const product = getProductData(item)
    const quantity = getQuantity(item)
    const price = parseFloat(product.price) || 0
    return price * quantity
  }

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (!itemId) {
      toast.error('Invalid item')
      return
    }
    if (newQuantity < 1) {
      dispatch(removeFromCart(itemId))
      toast.success('Item removed from cart')
      return
    }
    dispatch(updateCartItemQuantity({ itemId, quantity: newQuantity }))
  }

  const handleRemove = (itemId, productName) => {
    if (!itemId) {
      toast.error('Invalid item')
      return
    }
    dispatch(removeFromCart(itemId))
    toast.success(`${productName || 'Item'} removed from cart`)
  }
  console.log('🛒 Cart items:', items)

  if (loading && items.length === 0) {
    return (
      <div className="container-custom py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 border-b py-4">
              <div className="w-24 h-24 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
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
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Cart</h2>
          <p className="text-red-600">{typeof error === 'string' ? error : 'Failed to load cart'}</p>
          <button
            onClick={() => dispatch(fetchCart())}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="max-w-md mx-auto">
          <FiShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
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
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md">
            {items.map((item) => {

              const product = getProductData(item)
              const itemId = getItemId(item)
              const quantity = getQuantity(item)
              const totalPrice = getTotalPrice(item)
              const productName = product?.name || 'Product'
              const productPrice = parseFloat(product?.price) || 0
              const productImage = getImageUrl(product?.image)

              return (
                <div
                  key={itemId || Math.random()}
                  className="flex flex-col sm:flex-row items-center gap-4 p-4 border-b last:border-b-0"
                >
    
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-20 h-20 object-cover rounded bg-gray-100"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'
                    }}
                  />

                  <div className="flex-1 text-center sm:text-left">
                    <Link to={`/products/${product?.id || '#'}`}>
                      <h3 className="font-semibold text-gray-800 hover:text-blue-600">
                        {productName}
                      </h3>
                    </Link>
                    <p className="text-gray-600">
                      ${productPrice.toFixed(2)}
                    </p>
                  </div>


                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(itemId, quantity - 1)}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                      type="button"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(itemId, quantity + 1)}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                      type="button"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-blue-600 min-w-[80px] text-center">
                      ${totalPrice.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemove(itemId, productName)}
                      className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                      type="button"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="lg:w-80">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${(grand_total || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">${(grand_total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link to="/checkout">
              <button
                disabled={items.length === 0}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                type="button"
              >
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
        <details>
          <summary className="cursor-pointer font-medium">🔍 Debug: Cart Data Structure</summary>
          <pre className="mt-2 overflow-auto max-h-60">
            {JSON.stringify(items, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  )
}