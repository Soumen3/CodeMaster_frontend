import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const AuthSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const id_token = params.get('id_token')
    const access_token = params.get('access_token')
    const email = params.get('email')

    const user = {}
    if (email) user.email = email
    if (id_token) user.id_token = id_token
    if (access_token) user.access_token = access_token

    try {
      localStorage.setItem('user', JSON.stringify(user))
    } catch (e) {
      // ignore storage errors
    }

    // navigate to profile or home
    navigate('/profile')
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
