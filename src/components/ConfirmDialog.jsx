import React from 'react'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
			{/* Backdrop */}
			<div 
				className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
				onClick={onClose}
			/>
			
			{/* Dialog */}
			<div className="relative bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-6 max-w-md w-full mx-4 animate-scaleIn">
				{/* Title */}
				<h3 className="text-xl font-semibold text-white mb-3">
					{title}
				</h3>
				
				{/* Message */}
				<p className="text-gray-300 mb-6">
					{message}
				</p>
				
				{/* Actions */}
				<div className="flex gap-3 justify-end">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-md border border-gray-600 text-gray-200 hover:bg-gray-700 transition-all duration-200 hover:scale-105"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-all duration-200 hover:scale-105 shadow-lg"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	)
}

export default ConfirmDialog
