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
		<div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
			<div className="max-w-md w-full p-8 bg-gray-800 rounded-lg border border-gray-700">
				<h1 className="text-xl font-semibold mb-4">Profile</h1>
				{user ? (
					<div className="space-y-2">
						<div><strong>Email:</strong> <span className="text-gray-300">{user.email || '—'}</span></div>
						<div><strong>ID Token:</strong> <span className="text-gray-400 break-all">{user.id_token ? user.id_token.slice(0,60) + '…' : '—'}</span></div>
						<div className="mt-4">
							<button onClick={logout} className="px-3 py-1 bg-indigo-600 rounded-md">Logout</button>
						</div>
					</div>
				) : (
					<div>
						<p className="text-gray-400">You are not signed in.</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default Profile
