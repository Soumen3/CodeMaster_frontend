import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast'

const Login = () => {
	const navigate = useNavigate()
	const [showToast, setShowToast] = useState(false)
	const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false)

	useEffect(() => {
		// Check if user is already logged in
		try {
			const user = localStorage.getItem('user')
			const token = localStorage.getItem('access_token')
			
			if (user && token) {
				setIsAlreadyLoggedIn(true)
				setShowToast(true)
				
				// Redirect to home after showing toast
				setTimeout(() => {
					navigate('/')
				}, 1500)
			}
		} catch (e) {
			// Ignore errors
		}
	}, [navigate])

	const googleAuth = () => {
		// Redirect browser to backend OAuth endpoint for Google
		const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
		window.location.href = `${backendUrl}/auth/google`
	}

	const githubAuth = () => {
		// Redirect browser to backend OAuth endpoint for GitHub
		const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
		window.location.href = `${backendUrl}/auth/github`
	}

	// Show loading state while redirecting
	if (isAlreadyLoggedIn) {
		return (
			<>
				{showToast && (
					<Toast
						message="You are already logged in! Redirecting to home..."
						type="info"
						duration={1500}
						onClose={() => setShowToast(false)}
						position="top-center"
					/>
				)}
				<div className="min-h-screen bg-gray-900 flex items-center justify-center">
					<div className="text-center">
						<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
						<p className="text-gray-400">Redirecting...</p>
					</div>
				</div>
			</>
		)
	}

	return (
		<div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
			<div className="relative max-w-md w-full">
			<div className="absolute -inset-1 bg-linear-to-r from-indigo-600 via-purple-600 to-cyan-500 rounded-2xl blur opacity-30 animate-pulse" />
				<div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
					<h1 className="text-2xl font-bold text-white">Welcome back</h1>
					<p className="mt-2 text-sm text-gray-400">Sign in using one of the providers below. We only use OAuth and store minimal profile info.</p>

					<div className="mt-6 flex flex-col gap-3">
						<button
							onClick={googleAuth}
							className="w-full inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 px-4 py-2 rounded-lg shadow-sm transform hover:-translate-y-0.5 transition"
						>
							<svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
								<path d="M533.5 278.4c0-18.4-1.6-36.1-4.6-53.2H272v100.8h147.4c-6.4 34.4-25.6 63.5-54.6 83v68.9h88.3c51.6-47.5 81.9-117.7 81.9-199.5z" fill="#4285F4"/>
								<path d="M272 544.3c73.7 0 135.6-24.5 180.8-66.3l-88.3-68.9c-24.6 16.5-56.2 26.2-92.5 26.2-71 0-131.2-47.9-152.7-112.2H27.6v70.4C72.8 492.3 167.3 544.3 272 544.3z" fill="#34A853"/>
								<path d="M119.3 325.1c-8.7-25.7-8.7-53.6 0-79.3V175.4H27.6c-40.2 79.5-40.2 173.1 0 252.6l91.7-70.9z" fill="#FBBC05"/>
								<path d="M272 107.7c39.9 0 75.8 13.7 104 40.7l78-78C407.3 24.3 345.4 0 272 0 167.3 0 72.8 52 27.6 134.9l91.7 70.4C140.8 155.6 201 107.7 272 107.7z" fill="#EA4335"/>
							</svg>
							Continue with Google
						</button>

						<button
							onClick={githubAuth}
							className="w-full inline-flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-gray-100 px-4 py-2 rounded-lg border border-gray-700 shadow-sm transition transform hover:-translate-y-0.5"
						>
							<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
								<path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.833.091-.647.349-1.088.635-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.03-2.688-.103-.253-.447-1.27.098-2.646 0 0 .84-.27 2.75 1.025a9.564 9.564 0 012.5-.336c.848.004 1.705.115 2.5.336 1.91-1.295 2.75-1.025 2.75-1.025.546 1.376.202 2.393.1 2.646.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.31.679.923.679 1.86 0 1.342-.012 2.423-.012 2.752 0 .268.18.58.688.482C19.137 20.195 22 16.44 22 12.017 22 6.484 17.523 2 12 2z" clipRule="evenodd" />
							</svg>
							Continue with GitHub
						</button>
					</div>

					<p className="mt-6 text-xs text-gray-500">By continuing you agree to our Terms of Service and Privacy Policy.</p>
				</div>
			</div>
		</div>
	)
}

export default Login

