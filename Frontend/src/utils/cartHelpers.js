
export const validateCart = async (cartId) => {
  if (!cartId) return false
  
  try {
    const response = await fetch(`http://localhost:8000/api/carts/${cartId}/`)
    return response.ok
  } catch {
    return false
  }
}

export const clearInvalidCart = () => {
  localStorage.removeItem('cart_id')
  console.log('🛒 Invalid cart ID cleared')
}