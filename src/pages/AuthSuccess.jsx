import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Toast from '../components/Toast'

const AuthSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showToast, setShowToast] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const dataParam = params.get('data')

    if (dataParam) {
      try {
        // Parse the structured JSON response from backend
        const userData = JSON.parse(dataParam)
        
        // Extract and store the JWT token for API authentication
        if (userData.token) {
          localStorage.setItem('access_token', userData.token)
        }
        
        // Store user info (without sensitive tokens)
        const userInfo = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar_url: userData.avatar_url,
          provider: userData.provider
        }
        localStorage.setItem('user', JSON.stringify(userInfo))
        
        console.log('User authenticated:', userInfo)
        console.log('Token stored:', userData.token ? 'Yes' : 'No')
        
        // Show success toast
        setUserName(userInfo.name || userInfo.email)
        setShowToast(true)
        
        // Navigate to home after showing toast
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } catch (e) {
        console.error('Failed to parse auth data:', e)
        // Fallback: navigate to login on error
        navigate('/login')
      }
    } else {
      // No data received, redirect to login
      navigate('/login')
    }
  }, [location, navigate])

  return (
    <>
      {showToast && (
        <Toast
          message={`Welcome back, ${userName}! Login successful.`}
          type="success"
          duration={2000}
          onClose={() => setShowToast(false)}
          position="top-center"
        />
      )}
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <h2 className="text-xl font-semibold">Signing you in…</h2>
          <p className="mt-2 text-sm text-gray-400">Please wait while we complete your authentication.</p>
        </div>
      </div>
    </>
  )
}

export default AuthSuccess
