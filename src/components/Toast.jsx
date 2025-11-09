import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Toast/Message component for notifications
 * Supports different types: success, error, warning, info
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose, position = 'top-right' }) => {
	useEffect(() => {
		if (duration && onClose) {
			const timer = setTimeout(() => {
				onClose();
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [duration, onClose]);

	const getTypeStyles = () => {
		switch (type) {
			case 'success':
				return {
					container: 'bg-green-900/90 border-green-500/50 text-green-100',
					icon: (
						<svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
					)
				};
			case 'error':
				return {
					container: 'bg-red-900/90 border-red-500/50 text-red-100',
					icon: (
						<svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					)
				};
			case 'warning':
				return {
					container: 'bg-yellow-900/90 border-yellow-500/50 text-yellow-100',
					icon: (
						<svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
					)
				};
			case 'info':
			default:
				return {
					container: 'bg-blue-900/90 border-blue-500/50 text-blue-100',
					icon: (
						<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					)
				};
		}
	};

	const getPositionStyles = () => {
		switch (position) {
			case 'top-left':
				return 'top-4 left-4';
			case 'top-center':
				return 'top-4 left-1/2 transform -translate-x-1/2';
			case 'top-right':
			default:
				return 'top-4 right-4';
			case 'bottom-left':
				return 'bottom-4 left-4';
			case 'bottom-center':
				return 'bottom-4 left-1/2 transform -translate-x-1/2';
			case 'bottom-right':
				return 'bottom-4 right-4';
		}
	};

	const styles = getTypeStyles();

	return (
		<div 
			className={`
				fixed ${getPositionStyles()} z-50
				animate-slide-in-right
			`}
			role="alert"
		>
			<div 
				className={`
					${styles.container}
					backdrop-blur-sm
					border rounded-lg shadow-lg
					p-4 pr-12 min-w-[300px] max-w-md
					flex items-start gap-3
					animate-fade-in
				`}
			>
				{/* Icon */}
				<div className="flex-shrink-0 mt-0.5">
					{styles.icon}
				</div>

				{/* Message */}
				<div className="flex-1 text-sm font-medium">
					{message}
				</div>

				{/* Close Button */}
				{onClose && (
					<button
						onClick={onClose}
						className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
						aria-label="Close"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				)}
			</div>
		</div>
	);
};

Toast.propTypes = {
	message: PropTypes.string.isRequired,
	type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
	duration: PropTypes.number,
	onClose: PropTypes.func,
	position: PropTypes.oneOf([
		'top-left', 'top-center', 'top-right',
		'bottom-left', 'bottom-center', 'bottom-right'
	])
};

export default Toast;
