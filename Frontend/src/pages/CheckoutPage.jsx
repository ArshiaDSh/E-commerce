
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCart, localClearCart } from '../store/slices/cartSlice'
import { createOrder } from '../api'
import { FiCheck, FiShoppingBag } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { items, grand_total, id: cartId, loading } = useSelector((state) => state.cart)
    const { user, isAuthenticated } = useSelector((state) => state.auth)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orderError, setOrderError] = useState(null)

    useEffect(() => {
        if (!cartId) {
            dispatch(fetchCart())
        }
    }, [dispatch, cartId])

    const handlePlaceOrder = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to place an order')
            navigate('/login')
            return
        }

        if (!cartId || items.length === 0) {
            toast.error('Your cart is empty')
            return
        }

        setIsSubmitting(true)
        setOrderError(null)

        try {

            console.log('📦 Creating order...')
            const orderResponse = await createOrder(cartId)
            const orderId = orderResponse.data.id
            console.log('✅ Order created:', orderId)

  
            console.log('✅ Confirming order...')
            await confirmOrder(orderId, cartId)
            console.log('✅ Order confirmed')


            localStorage.removeItem('cart_id')
            dispatch(localClearCart())

            toast.success('Order placed successfully!')
            navigate('/orders')
        } catch (error) {
            console.error('❌ Order error:', error)


            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to place order'
            setOrderError(errorMessage)


            toast.error(errorMessage)
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="container-custom py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="container-custom py-16 text-center">
                <div className="max-w-md mx-auto">
                    <FiShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
                    <Link to="/products" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Start Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container-custom py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-8">Checkout</h1>

                <div className="grid md:grid-cols-3 gap-8">
 
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                            <div className="space-y-4">
                                {items.map((item) => {
                                    const product = item.product || {}
                                    const productName = product.name || 'Product'
                                    const productPrice = parseFloat(product.price) || 0
                                    const quantity = item.quantity || 1
                                    const totalPrice = item.total_price || (productPrice * quantity)
                                    const productImage = product.image || 'https://via.placeholder.com/60x60?text=No+Image'

                                    return (
                                        <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                                            <img
                                                src={productImage}
                                                alt={productName}
                                                className="w-16 h-16 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/60x60?text=No+Image'
                                                }}
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{productName}</h3>
                                                <p className="text-gray-600 text-sm">Qty: {quantity}</p>
                                            </div>
                                            <div className="font-bold">
                                                ${totalPrice.toFixed(2)}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${(grand_total || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-blue-600">${(grand_total || 0).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-4">Order Details</h2>

                            <div className="space-y-3 text-sm text-gray-600">
                                <p><span className="font-semibold">Customer:</span> {user?.username || 'Guest'}</p>
                                <p><span className="font-semibold">Items:</span> {items.reduce((sum, item) => sum + (item.quantity || 0), 0)}</p>
                                <p><span className="font-semibold">Total:</span> ${(grand_total || 0).toFixed(2)}</p>
                            </div>

                            {!isAuthenticated && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                                    Please login to place an order
                                </div>
                            )}

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isSubmitting || items.length === 0 || !isAuthenticated}
                                className="w-full mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                                type="button"
                            >
                                {isSubmitting ? (
                                    'Processing...'
                                ) : (
                                    <>
                                        <FiCheck />
                                        Place Order
                                    </>
                                )}
                            </button>

                            <Link to="/cart" className="block text-center mt-4 text-gray-600 hover:text-blue-600 text-sm">
                                ← Back to Cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}