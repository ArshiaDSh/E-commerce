
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, useDispatch } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { store } from './store'
import { router } from './routes'
import { fetchCart } from './store/slices/cartSlice'
import { checkAuth } from './store/slices/authSlice'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})


function AppInitializer() {
  const dispatch = useDispatch()
  
  useEffect(() => {

    dispatch(checkAuth()).then((result) => {

      if (result.payload?.isAuthenticated) {
        dispatch(fetchCart())
      }
    })
  }, [dispatch])
  
  return null
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppInitializer />
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)