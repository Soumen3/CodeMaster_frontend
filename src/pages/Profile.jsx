import React from 'react'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
	const navigate = useNavigate()
	let user = null
	try {
		const raw = localStorage.getItem('user')
		user = raw ? JSON.parse(raw) : null
	} catch (e) {
		user = null
	}

	const logout = () => {
		try { localStorage.removeItem('user') } catch (e) {}
		navigate('/')
	}

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center py-12 px-4">
			<div className="max-w-2xl w-full p-8 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
				<h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
				{user ? (
					<div className="space-y-6">
						{/* User Avatar */}
						{user.avatar_url && (
							<div className="flex justify-center">
								<img 
									src={user.avatar_url} 
									alt="Profile" 
									className="w-24 h-24 rounded-full border-2 border-indigo-500"
								/>
							</div>
						)}
						
						{/* User Information */}
						<div className="space-y-3">
							<div className="bg-gray-700/50 p-4 rounded-md">
								<strong className="text-gray-400">Name:</strong> 
								<span className="ml-3 text-gray-100">{user.name || '—'}</span>
							</div>
							
							<div className="bg-gray-700/50 p-4 rounded-md">
								<strong className="text-gray-400">Email:</strong> 
								<span className="ml-3 text-gray-100">{user.email || '—'}</span>
							</div>
							
							<div className="bg-gray-700/50 p-4 rounded-md">
								<strong className="text-gray-400">User ID:</strong> 
								<span className="ml-3 text-gray-300">{user.id || '—'}</span>
							</div>
							
							<div className="bg-gray-700/50 p-4 rounded-md">
								<strong className="text-gray-400">Provider:</strong> 
								<span className="ml-3 text-gray-100 capitalize">{user.provider || '—'}</span>
							</div>
						</div>

						{/* Logout Button */}
						<div className="flex justify-center mt-8">
							<button 
								onClick={logout} 
								className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors"
							>
								Logout
							</button>
						</div>
					</div>
				) : (
					<div className="text-center">
						<p className="text-gray-400 mb-4">You are not signed in.</p>
						<button 
							onClick={() => navigate('/login')}
							className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors"
						>
							Go to Login
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default Profile
