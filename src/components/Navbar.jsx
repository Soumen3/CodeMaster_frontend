import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";

/**
 * Simple Navbar component
 * - Uses localStorage 'user' entry (JSON string or simple string) to show logged-in state
 * - Provides links to /, /problems, /tags, /profile, /login
 * - Logout clears localStorage 'user' and redirects to /login
 */
const Navbar = ({ brand = "CodeMaster" }) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [showLogoutDialog, setShowLogoutDialog] = useState(false);
	const navigate = useNavigate();

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
		// Show confirmation dialog
		setShowLogoutDialog(true);
	};
	
	const confirmLogout = () => {
		try {
			localStorage.removeItem("user");
		} catch (e) {
			// ignore
		}
		setUser(null);
		setShowLogoutDialog(false);
		// navigate to login page
		navigate("/login");
	};
	
	const cancelLogout = () => {
		setShowLogoutDialog(false);
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
				
				<nav className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800 shadow-sm" role="navigation">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-14">
						<Link to="/" className="font-bold text-lg text-white animate-pulse" aria-label="CodeMaster Home">
							{brand}
						</Link>

						<div className="hidden md:flex items-center gap-6">
							<Link className="text-gray-200 hover:text-indigo-300 transition-colors duration-200 pb-1" to="/">
								Home
							</Link>
							<Link className="text-gray-200 hover:text-indigo-300 transition-colors duration-200 pb-1" to="/problems">
								Problems
							</Link>
							<Link className="text-gray-200 hover:text-indigo-300 transition-colors duration-200 pb-1" to="/tags">
								Tags
							</Link>
						</div>

						<div className="flex items-center gap-3">
							{user ? (
								<>
									<Link className="hidden sm:inline text-gray-200 hover:text-indigo-300 transition-colors duration-200" to="/profile" title={typeof user === "object" ? user.username || user.email : user}>
										{typeof user === "object" ? user.username || user.email || "Profile" : user}
									</Link>
									<button className="px-3 py-1 rounded-md border border-gray-700 hover:bg-gray-800 text-gray-200 transition" onClick={handleLogout}>
										Logout
									</button>
								</>
							) : (
								<Link className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:shadow-md transform hover:-translate-y-1 transition" to="/login">
									Login
								</Link>
							)}

							<button aria-label="Toggle menu" className="md:hidden p-2 text-2xl text-gray-200" onClick={() => setMenuOpen((v) => !v)}>
								☰
							</button>
						</div>
					</div>
				</div>

				{menuOpen && (
					<div className="md:hidden px-4 pb-4 flex flex-col gap-2 border-t border-gray-800 bg-gray-900">
						<Link className="text-gray-200 hover:text-indigo-300 transition-colors duration-200" to="/" onClick={() => setMenuOpen(false)}>
							Home
						</Link>
						<Link className="text-gray-200 hover:text-indigo-300 transition-colors duration-200" to="/problems" onClick={() => setMenuOpen(false)}>
							Problems
						</Link>
						<Link className="text-gray-200 hover:text-indigo-300 transition-colors duration-200" to="/tags" onClick={() => setMenuOpen(false)}>
							Tags
						</Link>
						{user ? (
							<>
								<Link className="text-gray-200 hover:text-indigo-300 transition-colors duration-200" to="/profile" onClick={() => setMenuOpen(false)}>
									Profile
								</Link>
								<button className="px-3 py-1 rounded-md border border-gray-700 hover:bg-gray-800 text-gray-200 transition" onClick={handleLogout}>
									Logout
								</button>
							</>
						) : (
							<Link className="text-gray-200 hover:text-indigo-300 transition-colors duration-200" to="/login" onClick={() => setMenuOpen(false)}>
								Login
							</Link>
						)}
					</div>
				)}
			</nav>
		</>
	);
};

export default Navbar;
