import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const AuthSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const dataParam = params.get('data')

    if (dataParam) {
      try {
        // Parse the structured JSON response from backend
        const userData = JSON.parse(dataParam)
        
        // Store complete user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData))
        console.log(userData);
        
        
        // Navigate to profile
        navigate('/profile')
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Signing you in…</h2>
        <p className="mt-2 text-sm text-gray-400">If you are not redirected, please click continue.</p>
      </div>
    </div>
  )
}

export default AuthSuccess
