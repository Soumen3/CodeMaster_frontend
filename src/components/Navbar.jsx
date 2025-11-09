import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";

/**
 * Enhanced Navbar component with improved design
 * - Modern glassmorphism effect
 * - Active link highlighting
 * - User avatar display
 * - Smooth animations
 * - Responsive mobile menu
 */
const Navbar = ({ brand = "CodeMaster" }) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [showLogoutDialog, setShowLogoutDialog] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		try {
			const raw = localStorage.getItem("user");
			if (!raw) return setUser(null);
			try {
				setUser(JSON.parse(raw));
			} catch (e) {
				setUser(raw);
			}
		} catch (e) {
			setUser(null);
		}
	}, []);

	const handleLogout = () => {
		setShowLogoutDialog(true);
	};
	
	const confirmLogout = () => {
		try {
			localStorage.removeItem("user");
			localStorage.removeItem("access_token");
		} catch (e) {
			// ignore
		}
		setUser(null);
		setShowLogoutDialog(false);
		navigate("/login");
	};
	
	const cancelLogout = () => {
		setShowLogoutDialog(false);
	};

	const isActive = (path) => {
		return location.pathname === path;
	};

	const NavLink = ({ to, children, mobile = false }) => {
		const active = isActive(to);
		return (
			<Link
				to={to}
				onClick={mobile ? () => setMenuOpen(false) : undefined}
				className={`
					relative transition-all duration-200
					${mobile ? 'block py-2 px-3 rounded-md' : 'px-3 py-2'}
					${active 
						? 'text-indigo-400 font-semibold' 
						: 'text-gray-300 hover:text-white'
					}
					${!mobile && active ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500 after:rounded-full' : ''}
					${mobile && active ? 'bg-indigo-600/20 border-l-2 border-indigo-500' : ''}
					${mobile && !active ? 'hover:bg-gray-800/50' : ''}
				`}
			>
				{children}
			</Link>
		);
	};

	return (
		<>
			<ConfirmDialog
				isOpen={showLogoutDialog}
				onClose={cancelLogout}
				onConfirm={confirmLogout}
				title="Confirm Logout"
				message="Are you sure you want to logout? You will need to sign in again to access your account."
			/>
			
			<nav 
				className={`
					sticky top-0 z-50 transition-all duration-300
					${scrolled 
						? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-700/50' 
						: 'bg-gray-900/80 backdrop-blur-sm border-b border-gray-800'
					}
				`} 
				role="navigation"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Logo/Brand */}
						<Link 
							to="/" 
							className="flex items-center gap-2 group" 
							aria-label="CodeMaster Home"
						>
							<div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-110">
								<span className="text-white font-bold text-lg">C</span>
							</div>
							<span className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
								{brand}
							</span>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center gap-1">
							<NavLink to="/">Home</NavLink>
							<NavLink to="/problems">Problems</NavLink>
							<NavLink to="/tags">Tags</NavLink>
						</div>

						{/* Right Side - User Section */}
						<div className="flex items-center gap-3">
							{user ? (
								<>
									{/* User Profile Button */}
									<Link 
										to="/profile" 
										className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800/50 transition-all duration-200 group"
										title={typeof user === "object" ? user.name || user.email : user}
									>
										{typeof user === "object" && user.avatar_url ? (
											<img 
												src={user.avatar_url} 
												alt="Profile" 
												className="w-7 h-7 rounded-full border-2 border-indigo-500 group-hover:border-indigo-400 transition-colors"
											/>
										) : (
											<div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
												{(typeof user === "object" ? user.name?.[0] || user.email?.[0] : user[0])?.toUpperCase()}
											</div>
										)}
										<span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors max-w-[120px] truncate">
											{typeof user === "object" ? user.name || user.email || "Profile" : user}
										</span>
									</Link>

									{/* Logout Button */}
									<button 
										className="px-4 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 hover:border-red-400/50 transition-all duration-200 text-sm font-medium"
										onClick={handleLogout}
									>
										Logout
									</button>
								</>
							) : (
								<Link 
									className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/50 transform hover:scale-105 transition-all duration-200"
									to="/login"
								>
									Login
								</Link>
							)}

							{/* Mobile Menu Button */}
							<button 
								aria-label="Toggle menu" 
								className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 text-gray-300 transition-all duration-200"
								onClick={() => setMenuOpen((v) => !v)}
							>
								<svg 
									className={`w-6 h-6 transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}
									fill="none" 
									stroke="currentColor" 
									viewBox="0 0 24 24"
								>
									{menuOpen ? (
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									) : (
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
									)}
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Menu */}
				<div 
					className={`
						md:hidden overflow-hidden transition-all duration-300 ease-in-out
						${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
					`}
				>
					<div className="px-4 py-4 space-y-1 bg-gray-800/30 backdrop-blur-sm border-t border-gray-700/50">
						<NavLink to="/" mobile>
							<span className="flex items-center gap-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
								</svg>
								Home
							</span>
						</NavLink>
						<NavLink to="/problems" mobile>
							<span className="flex items-center gap-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								Problems
							</span>
						</NavLink>
						<NavLink to="/tags" mobile>
							<span className="flex items-center gap-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
								</svg>
								Tags
							</span>
						</NavLink>
						
						{user && (
							<>
								<div className="border-t border-gray-700/50 my-2 pt-2">
									<NavLink to="/profile" mobile>
										<span className="flex items-center gap-2">
											{typeof user === "object" && user.avatar_url ? (
												<img 
													src={user.avatar_url} 
													alt="Profile" 
													className="w-5 h-5 rounded-full border border-indigo-500"
												/>
											) : (
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
												</svg>
											)}
											Profile
										</span>
									</NavLink>
								</div>
								<button 
									className="w-full text-left px-3 py-2 rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 flex items-center gap-2"
									onClick={handleLogout}
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
									</svg>
									Logout
								</button>
							</>
						)}
					</div>
				</div>
			</nav>
		</>
	);
};

export default Navbar;
