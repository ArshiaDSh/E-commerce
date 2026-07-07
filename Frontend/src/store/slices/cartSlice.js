
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api'

// ========== ASYNC THUNKS ==========

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      let cartId = localStorage.getItem('cart_id')
      console.log('🛒 Fetching cart, current ID:', cartId)
 
      if (!cartId) {
        console.log('🛒 No cart found, creating new cart...')
        const response = await api.post('/carts/')
        cartId = response.data.id
        localStorage.setItem('cart_id', cartId)
        console.log('🛒 New cart created:', cartId)
        

        return { id: cartId, items: [], grand_total: 0 }
      }
      

      const response = await api.get(`/carts/${cartId}/`)
      console.log('🛒 Cart fetched successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Fetch cart error:', error)
      

      if (error.response?.status === 404) {
        console.log('🛒 Cart not found (404), clearing invalid ID...')
        localStorage.removeItem('cart_id')
        

        try {
          const response = await api.post('/carts/')
          const newCartId = response.data.id
          localStorage.setItem('cart_id', newCartId)
          console.log('🛒 New cart created after 404:', newCartId)
          return { id: newCartId, items: [], grand_total: 0 }
        } catch (createError) {
          console.error('❌ Failed to create new cart:', createError)
          return rejectWithValue('Failed to create new cart')
        }
      }
      
      return rejectWithValue(error.response?.data || 'Failed to fetch cart')
    }
  }
)


export const addToCart = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      let cartId = localStorage.getItem('cart_id')

      if (!cartId) {
        console.log('🛒 No cart found, creating new cart for add...')
        const createResponse = await api.post('/carts/')
        cartId = createResponse.data.id
        localStorage.setItem('cart_id', cartId)
        console.log('🛒 New cart created:', cartId)
      }
      

      console.log(`🛒 Adding product ${productId} x${quantity} to cart ${cartId}`)
      const response = await api.post(`/carts/${cartId}/items/`, {
        product_id: productId,
        quantity: quantity
      })
      console.log('🛒 Item added successfully:', response.data)

      const updatedCart = await api.get(`/carts/${cartId}/`)
      return updatedCart.data
    } catch (error) {
      console.error('❌ Add to cart error:', error)
      

      if (error.response?.status === 404) {
        console.log('🛒 Cart not found, clearing invalid ID...')
        localStorage.removeItem('cart_id')
        return rejectWithValue('Cart not found. Please try again.')
      }
      

      if (error.response?.status === 400 && error.response?.data?.non_field_errors) {
        console.log('🛒 Item may already exist, trying to update...')

        return rejectWithValue(error.response?.data?.non_field_errors[0] || 'Item already in cart')
      }
      
      return rejectWithValue(error.response?.data || 'Failed to add item')
    }
  }
)


export const updateCartItemQuantity = createAsyncThunk(
  'cart/update',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const cartId = localStorage.getItem('cart_id')
      if (!cartId) {
        throw new Error('No cart found')
      }
      
      console.log(`🛒 Updating item ${itemId} to quantity ${quantity}`)
      const response = await api.patch(`/carts/${cartId}/items/${itemId}/`, {
        quantity: quantity
      })
      console.log('🛒 Item updated successfully:', response.data)
      

      const updatedCart = await api.get(`/carts/${cartId}/`)
      return { 
        itemId, 
        quantity, 
        cartData: updatedCart.data 
      }
    } catch (error) {
      console.error('❌ Update item error:', error)
      
      if (error.response?.status === 404) {
        console.log('🛒 Cart or item not found, clearing invalid ID...')
        localStorage.removeItem('cart_id')
        return rejectWithValue('Cart not found. Please refresh.')
      }
      
      return rejectWithValue(error.response?.data || 'Failed to update item')
    }
  }
)


export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (itemId, { rejectWithValue }) => {
    try {
      const cartId = localStorage.getItem('cart_id')
      if (!cartId) {
        throw new Error('No cart found')
      }
      
      console.log(`🛒 Removing item ${itemId} from cart`)
      await api.delete(`/carts/${cartId}/items/${itemId}/`)
      console.log('🛒 Item removed successfully')
      
     
      const updatedCart = await api.get(`/carts/${cartId}/`)
      return { 
        itemId, 
        cartData: updatedCart.data 
      }
    } catch (error) {
      console.error('❌ Remove item error:', error)
      
      if (error.response?.status === 404) {
        console.log('🛒 Cart or item not found, clearing invalid ID...')
        localStorage.removeItem('cart_id')
        return rejectWithValue('Cart not found. Please refresh.')
      }
      
      return rejectWithValue(error.response?.data || 'Failed to remove item')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      const cartId = localStorage.getItem('cart_id')
      if (cartId) {
        console.log(`🛒 Deleting cart: ${cartId}`)
        await api.delete(`/carts/${cartId}/`)
        localStorage.removeItem('cart_id')
        console.log('🛒 Cart deleted successfully')
      }
      return {}
    } catch (error) {
      console.error('❌ Clear cart error:', error)

      localStorage.removeItem('cart_id')
      return rejectWithValue(error.response?.data || 'Failed to clear cart')
    }
  }
)

// ========== SLICE ==========
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    id: null,
    items: [],
    grand_total: 0,
    loading: false,
    error: null,
    itemCount: 0,
  },
  reducers: {
    localClearCart: (state) => {
      state.id = null
      state.items = []
      state.grand_total = 0
      state.itemCount = 0
      state.error = null
      localStorage.removeItem('cart_id')
      console.log('🛒 Cart cleared locally')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== FETCH CART =====
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.id = action.payload.id
        state.items = action.payload.items || []
        state.grand_total = action.payload.grand_total || 0
        state.itemCount = state.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
        console.log('🛒 Cart stored in state:', state.items.length, 'items')
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch cart'
        console.error('🛒 Fetch cart rejected:', state.error)
      })
      
      // ===== ADD TO CART =====
      .addCase(addToCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false
        state.id = action.payload.id
        state.items = action.payload.items || []
        state.grand_total = action.payload.grand_total || 0
        state.itemCount = state.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
        console.log('🛒 Cart updated after add:', state.items.length, 'items')
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to add item'
        console.error('🛒 Add to cart rejected:', state.error)
      })
      
      // ===== UPDATE QUANTITY =====
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false
        const { cartData } = action.payload
        if (cartData) {
          state.id = cartData.id
          state.items = cartData.items || []
          state.grand_total = cartData.grand_total || 0
          state.itemCount = state.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
        }
        console.log('🛒 Cart updated after quantity change:', state.items.length, 'items')
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to update quantity'
        console.error('🛒 Update quantity rejected:', state.error)
      })
      
      // ===== REMOVE FROM CART =====
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false
        // Update the cart with fresh data from backend
        const { cartData } = action.payload
        if (cartData) {
          state.id = cartData.id
          state.items = cartData.items || []
          state.grand_total = cartData.grand_total || 0
          state.itemCount = state.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
        }
        console.log('🛒 Cart updated after removal:', state.items.length, 'items')
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to remove item'
        console.error('🛒 Remove from cart rejected:', state.error)
      })
      
      // ===== CLEAR CART =====
      .addCase(clearCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false
        state.id = null
        state.items = []
        state.grand_total = 0
        state.itemCount = 0
        state.error = null
        localStorage.removeItem('cart_id')
        console.log('🛒 Cart cleared successfully')
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false
        state.id = null
        state.items = []
        state.grand_total = 0
        state.itemCount = 0
        localStorage.removeItem('cart_id')
        state.error = action.payload || 'Failed to clear cart'
        console.error('🛒 Clear cart rejected:', state.error)
      })
  }
})

export const { localClearCart, clearError } = cartSlice.actions
export default cartSlice.reducer