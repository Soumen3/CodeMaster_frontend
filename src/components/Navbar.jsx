import React, { useEffect, useState } from "react";

/**
 * Simple Navbar component
 * - Uses localStorage 'user' entry (JSON string or simple string) to show logged-in state
 * - Provides links to /, /problems, /tags, /profile, /login
 * - Logout clears localStorage 'user' and redirects to /login
 * This implementation is intentionally dependency-light (no react-router) so it works
 * even if router/context hooks aren't set up yet.
 */
const Navbar = ({ brand = "CodeMaster" }) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [user, setUser] = useState(null);

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
		try {
			localStorage.removeItem("user");
		} catch (e) {
			// ignore
		}
		setUser(null);
		// navigate to login page
		window.location.href = "/login";
	};

		return (
			<nav className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800 shadow-sm" role="navigation">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-14">
						<a href="/" className="font-bold text-lg text-white animate-pulse" aria-label="CodeMaster Home">
							{brand}
						</a>

						<div className="hidden md:flex items-center gap-6">
							<a className="text-gray-200 hover:text-indigo-300 transition-colors duration-200 pb-1" href="/">
								Home
							</a>
							<a className="text-gray-200 hover:text-indigo-300 transition-colors duration-200 pb-1" href="/problems">
								Problems
							</a>
							<a className="text-gray-200 hover:text-indigo-300 transition-colors duration-200 pb-1" href="/tags">
								Tags
							</a>
						</div>

						<div className="flex items-center gap-3">
							{user ? (
								<>
									<a className="hidden sm:inline text-gray-200 hover:text-indigo-300 transition-colors duration-200" href="/profile" title={typeof user === "object" ? user.username || user.email : user}>
										{typeof user === "object" ? user.username || user.email || "Profile" : user}
									</a>
									<button className="px-3 py-1 rounded-md border border-gray-700 hover:bg-gray-800 text-gray-200 transition" onClick={handleLogout}>
										Logout
									</button>
								</>
							) : (
								<a className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:shadow-md transform hover:-translate-y-1 transition" href="/login">
									Login
								</a>
							)}

							<button aria-label="Toggle menu" className="md:hidden p-2 text-2xl text-gray-200" onClick={() => setMenuOpen((v) => !v)}>
								☰
							</button>
						</div>
					</div>
				</div>

				{menuOpen && (
					<div className="md:hidden px-4 pb-4 flex flex-col gap-2 border-t border-gray-800 bg-gray-900">
						<a className="text-gray-200 hover:text-indigo-300 transition-colors duration-200" href="/">
							Home
						</a>
						<a className="text-gray-200 hover:text-indigo-300 transition-colors duration-200" href="/problems">
							Problems
						</a>
						<a className="text-gray-200 hover:text-indigo-300 transition-colors duration-200" href="/tags">
							Tags
						</a>
						{user ? (
							<>
								<a className="text-gray-200 hover:text-indigo-300 transition-colors duration-200" href="/profile">
									Profile
								</a>
								<button className="px-3 py-1 rounded-md border border-gray-700 hover:bg-gray-800 text-gray-200 transition" onClick={handleLogout}>
									Logout
								</button>
							</>
						) : (
							<a className="text-gray-200 hover:text-indigo-300 transition-colors duration-200" href="/login">
								Login
							</a>
						)}
					</div>
				)}
			</nav>
		);
};

export default Navbar;
