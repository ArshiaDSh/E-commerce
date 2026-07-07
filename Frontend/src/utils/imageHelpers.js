
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/300x300?text=No+Image'
  }
  

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'

  const baseUrlWithoutApi = baseUrl.replace('/api/', '/')
  

  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  
 
  if (cleanPath.startsWith('media/')) {
    return `${baseUrlWithoutApi}${cleanPath}`
  }
  
  return `${baseUrlWithoutApi}${cleanPath}`
}