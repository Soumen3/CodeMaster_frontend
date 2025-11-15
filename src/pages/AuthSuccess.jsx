import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Toast from '../components/Toast'
import { setCachedAvatar } from '../utils/avatarCache'

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
        
        // Cache the avatar for faster subsequent loads
        if (userData.id && userData.avatar_url) {
          setCachedAvatar(userData.id, userData.avatar_url)
        }
        
        // Dispatch custom event to notify navbar of login
        window.dispatchEvent(new Event('userLogin'))
        
        console.log('User authenticated:', userInfo)
        console.log('Token stored:', userData.token ? 'Yes' : 'No')
        console.log('Avatar cached:', userData.avatar_url ? 'Yes' : 'No')
        
        // Show success toast
        setUserName(userInfo.name || userInfo.email)
        setShowToast(true)
        
        // Navigate to home after showing toast
        setTimeout(() => {
          navigate('/')
          // Refresh the page to update all components
          window.location.reload()
        }, 1000)
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
