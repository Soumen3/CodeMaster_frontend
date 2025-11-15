import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import userService from '../services/userService'
import { getAvatarWithCache, clearCachedAvatar } from '../utils/avatarCache'

const Profile = () => {
	const navigate = useNavigate()
	const [stats, setStats] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	
	let user = null
	try {
		const raw = localStorage.getItem('user')
		user = raw ? JSON.parse(raw) : null
	} catch (e) {
		user = null
	}

	useEffect(() => {
		if (user) {
			fetchUserStats()
		} else {
			setLoading(false)
		}
	}, [])

	const fetchUserStats = async () => {
		try {
			setLoading(true)
			const data = await userService.getUserStats()
			setStats(data)
			setError(null)
		} catch (err) {
			console.error('Failed to fetch user stats:', err)
			setError('Failed to load statistics')
		} finally {
			setLoading(false)
		}
	}

	const logout = () => {
		try { 
			// Clear avatar cache on logout
			if (user?.id) {
				clearCachedAvatar(user.id)
			}
			localStorage.removeItem('user')
			localStorage.removeItem('access_token')
		} catch (e) {}
		navigate('/')
	}

	const getDifficultyColor = (difficulty) => {
		switch (difficulty) {
			case 'easy': return 'text-green-400'
			case 'medium': return 'text-yellow-400'
			case 'hard': return 'text-red-400'
			default: return 'text-gray-400'
		}
	}

	const getStatusColor = (status) => {
		switch (status) {
			case 'accepted': return 'text-green-400'
			case 'wrong_answer': return 'text-red-400'
			case 'time_limit_exceeded': return 'text-orange-400'
			case 'runtime_error': return 'text-red-400'
			case 'compilation_error': return 'text-red-400'
			default: return 'text-gray-400'
		}
	}

	const formatDate = (dateString) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
	}

	if (!user) {
		return (
			<div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center py-12 px-4">
				<div className="max-w-md w-full p-8 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
					<h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
					<div className="text-center">
						<p className="text-gray-400 mb-4">You are not signed in.</p>
						<button 
							onClick={() => navigate('/login')}
							className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors"
						>
							Go to Login
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header Section */}
				<div className="bg-gradient-to-r from-gray-800 to-gray-800/50 rounded-lg border border-gray-700 p-6 mb-6">
					<div className="flex flex-col md:flex-row items-center gap-6">
						{/* Avatar */}
						{user.avatar_url && (
							<img 
								src={getAvatarWithCache(user.id, user.avatar_url)} 
								alt="Profile" 
								className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg"
							/>
						)}
						
						{/* User Info */}
						<div className="flex-1 text-center md:text-left">
							<h1 className="text-3xl font-bold mb-2">{user.name || 'Anonymous User'}</h1>
							<p className="text-gray-400 mb-1">{user.email}</p>
							<div className="flex items-center justify-center md:justify-start gap-2 text-sm">
								<span className="px-3 py-1 bg-gray-700 rounded-full capitalize">{user.provider}</span>
								{stats && (
									<span className="text-gray-400">
										Joined {formatDate(stats.user.created_at)}
									</span>
								)}
							</div>
						</div>

						{/* Logout Button */}
						<button 
							onClick={logout} 
							className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition-colors"
						>
							Logout
						</button>
					</div>
				</div>

				{loading ? (
					<div className="flex items-center justify-center py-20">
						<div className="text-center">
							<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
							<p className="text-gray-400">Loading statistics...</p>
						</div>
					</div>
				) : error ? (
					<div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
						<p className="text-red-400">{error}</p>
						<button 
							onClick={fetchUserStats}
							className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm"
						>
							Try Again
						</button>
					</div>
				) : stats ? (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Left Column - Stats Cards */}
						<div className="lg:col-span-2 space-y-6">
							{/* Solved Problems Card */}
							<div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
								<h2 className="text-xl font-bold mb-4">Solved Problems</h2>
								
								{/* Progress Circle */}
								<div className="flex items-center gap-8 mb-6">
									<div className="relative w-32 h-32">
										<svg className="transform -rotate-90 w-32 h-32">
											<circle
												cx="64"
												cy="64"
												r="56"
												stroke="currentColor"
												strokeWidth="8"
												fill="transparent"
												className="text-gray-700"
											/>
											<circle
												cx="64"
												cy="64"
												r="56"
												stroke="currentColor"
												strokeWidth="8"
												fill="transparent"
												strokeDasharray={`${2 * Math.PI * 56}`}
												strokeDashoffset={`${2 * Math.PI * 56 * (1 - stats.solved.total / (stats.total_problems.easy + stats.total_problems.medium + stats.total_problems.hard || 1))}`}
												className="text-indigo-500 transition-all duration-1000"
												strokeLinecap="round"
											/>
										</svg>
										<div className="absolute inset-0 flex items-center justify-center flex-col">
											<span className="text-3xl font-bold">{stats.solved.total}</span>
											<span className="text-xs text-gray-400">Solved</span>
										</div>
									</div>
									
									<div className="flex-1">
										<p className="text-gray-400 text-sm mb-4">
											Total: {stats.total_problems.easy + stats.total_problems.medium + stats.total_problems.hard} problems
										</p>
										
										{/* Difficulty Breakdown */}
										<div className="space-y-3">
											{/* Easy */}
											<div>
												<div className="flex justify-between text-sm mb-1">
													<span className="text-green-400 font-medium">Easy</span>
													<span className="text-gray-400">{stats.solved.easy} / {stats.total_problems.easy}</span>
												</div>
												<div className="w-full bg-gray-700 rounded-full h-2">
													<div 
														className="bg-green-500 h-2 rounded-full transition-all duration-1000"
														style={{ width: `${(stats.solved.easy / stats.total_problems.easy || 0) * 100}%` }}
													/>
												</div>
											</div>
											
											{/* Medium */}
											<div>
												<div className="flex justify-between text-sm mb-1">
													<span className="text-yellow-400 font-medium">Medium</span>
													<span className="text-gray-400">{stats.solved.medium} / {stats.total_problems.medium}</span>
												</div>
												<div className="w-full bg-gray-700 rounded-full h-2">
													<div 
														className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
														style={{ width: `${(stats.solved.medium / stats.total_problems.medium || 0) * 100}%` }}
													/>
												</div>
											</div>
											
											{/* Hard */}
											<div>
												<div className="flex justify-between text-sm mb-1">
													<span className="text-red-400 font-medium">Hard</span>
													<span className="text-gray-400">{stats.solved.hard} / {stats.total_problems.hard}</span>
												</div>
												<div className="w-full bg-gray-700 rounded-full h-2">
													<div 
														className="bg-red-500 h-2 rounded-full transition-all duration-1000"
														style={{ width: `${(stats.solved.hard / stats.total_problems.hard || 0) * 100}%` }}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Submission Stats Card */}
							<div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
								<h2 className="text-xl font-bold mb-4">Submission Stats</h2>
								<div className="grid grid-cols-3 gap-4">
									<div className="bg-gray-700/50 rounded-lg p-4 text-center">
										<div className="text-2xl font-bold text-indigo-400">{stats.submissions.total}</div>
										<div className="text-sm text-gray-400 mt-1">Total</div>
									</div>
									<div className="bg-gray-700/50 rounded-lg p-4 text-center">
										<div className="text-2xl font-bold text-green-400">{stats.submissions.accepted}</div>
										<div className="text-sm text-gray-400 mt-1">Accepted</div>
									</div>
									<div className="bg-gray-700/50 rounded-lg p-4 text-center">
										<div className="text-2xl font-bold text-yellow-400">{stats.submissions.acceptance_rate}%</div>
										<div className="text-sm text-gray-400 mt-1">Acceptance</div>
									</div>
								</div>
							</div>

							{/* Recent Activity */}
							<div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
								<h2 className="text-xl font-bold mb-4">Recent Submissions</h2>
								{stats.recent_activity.length > 0 ? (
									<div className="space-y-2">
										{stats.recent_activity.map((activity) => (
											<div 
												key={activity.id}
												className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
												onClick={() => navigate(`/problems/${activity.problem_id}`)}
											>
												<div className="flex-1">
													<div className="font-medium">{activity.problem_title}</div>
													<div className="flex items-center gap-3 mt-1 text-xs">
														<span className={getDifficultyColor(activity.difficulty) + ' capitalize'}>
															{activity.difficulty}
														</span>
														<span className="text-gray-500">•</span>
														<span className="text-gray-400 capitalize">{activity.language}</span>
														<span className="text-gray-500">•</span>
														<span className="text-gray-400">{formatDate(activity.created_at)}</span>
													</div>
												</div>
												<div className={`font-semibold text-sm capitalize ${getStatusColor(activity.status)}`}>
													{activity.status === 'accepted' ? '✓ Accepted' : activity.status.replace('_', ' ')}
												</div>
											</div>
										))}
									</div>
								) : (
									<p className="text-gray-400 text-center py-8">No submissions yet</p>
								)}
							</div>
						</div>

						{/* Right Column - Languages & Info */}
						<div className="space-y-6">
							{/* Languages Card */}
							<div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
								<h2 className="text-xl font-bold mb-4">Languages Used</h2>
								{Object.keys(stats.languages).length > 0 ? (
									<div className="space-y-3">
										{Object.entries(stats.languages)
											.sort(([, a], [, b]) => b - a)
											.map(([language, count]) => (
											<div key={language}>
												<div className="flex justify-between text-sm mb-1">
													<span className="capitalize font-medium">{language}</span>
													<span className="text-gray-400">{count} solved</span>
												</div>
												<div className="w-full bg-gray-700 rounded-full h-2">
													<div 
														className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
														style={{ 
															width: `${(count / Math.max(...Object.values(stats.languages)) * 100)}%` 
														}}
													/>
												</div>
											</div>
										))}
									</div>
								) : (
									<p className="text-gray-400 text-center py-4">No languages used yet</p>
								)}
							</div>

							{/* Quick Stats */}
							<div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
								<h2 className="text-xl font-bold mb-4">Quick Stats</h2>
								<div className="space-y-3 text-sm">
									<div className="flex justify-between">
										<span className="text-gray-400">User ID</span>
										<span className="font-mono text-gray-300">#{user.id}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">Problems Solved</span>
										<span className="font-semibold text-indigo-400">{stats.solved.total}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">Total Submissions</span>
										<span className="font-semibold">{stats.submissions.total}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">Success Rate</span>
										<span className="font-semibold text-green-400">{stats.submissions.acceptance_rate}%</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</div>
	)
}

export default Profile
