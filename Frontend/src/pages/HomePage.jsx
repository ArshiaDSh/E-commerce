
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProductCard from '../components/features/ProductCard'
import { getApiUrl } from '../utils/apiHelpers'

export default function HomePage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = getApiUrl('/products/?ordering=-created_at')
                console.log('📡 Fetching from:', url)

                const response = await fetch(url)
                if (!response.ok) throw new Error(`HTTP ${response.status}`)
                const data = await response.json()
                setProducts(data.results?.slice(0, 4) || [])
                setLoading(false)
            } catch (err) {
                console.error('Home page error:', err)
                setError(err.message)
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    if (loading) {
        return (
            <div>
                <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
                    <div className="container-custom">
                        <div className="max-w-2xl">
                            <div className="h-12 bg-primary-500 rounded w-3/4 mb-4"></div>
                            <div className="h-6 bg-primary-500 rounded w-1/2"></div>
                        </div>
                    </div>
                </section>
                <section className="container-custom py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 rounded-lg h-64"></div>
                                <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container-custom py-8 text-center">
                <p className="text-red-500">Error loading products: {error}</p>
            </div>
        )
    }

    return (
        <>
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="container-custom">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl font-bold mb-4">
                            Welcome to ShopHub
                        </h1>
                        <p className="text-xl mb-8 text-blue-100">
                            Discover amazing products at great prices. Shop now and enjoy exclusive deals!
                        </p>
                        <Link
                            to="/products"
                            className="inline-block bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </section>

            <section className="container-custom py-12">
                <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </>
    )
}