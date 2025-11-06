import PropTypes from 'prop-types';

const TagBadge = ({ tag, onClick, removable = false, onRemove }) => {
  const getTagColor = (tagName) => {
    // Generate consistent colors based on tag name
    const colors = [
      { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400' },
      { bg: 'bg-green-500/20', border: 'border-green-500/40', text: 'text-green-400' },
      { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400' },
      { bg: 'bg-pink-500/20', border: 'border-pink-500/40', text: 'text-pink-400' },
      { bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', text: 'text-yellow-400' },
      { bg: 'bg-indigo-500/20', border: 'border-indigo-500/40', text: 'text-indigo-400' },
      { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400' },
      { bg: 'bg-teal-500/20', border: 'border-teal-500/40', text: 'text-teal-400' },
      { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-400' },
      { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400' },
    ];

    // Simple hash function to get consistent color for each tag
    const hash = tagName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const handleClick = (e) => {
    if (onClick) {
      e.stopPropagation();
      onClick(tag);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(tag);
    }
  };

  const colorScheme = getTagColor(tag.name);

  return (
    <span
      onClick={handleClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${colorScheme.bg} ${colorScheme.border} ${colorScheme.text} ${
        onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
      }`}
    >
      <span>{tag.name}</span>
      {removable && (
        <button
          onClick={handleRemove}
          className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${tag.name} tag`}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

TagBadge.propTypes = {
  tag: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
  removable: PropTypes.bool,
  onRemove: PropTypes.func,
};

export default TagBadge;
