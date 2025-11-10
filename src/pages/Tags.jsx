import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import tagService from '../services/tagService'
import { getTagIcon, getTagColor } from '../utils/tagIcons'

const Tags = () => {
  const navigate = useNavigate()
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState(null)

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      setLoading(true)
      const data = await tagService.getTags()
      setTags(data)
    } catch (error) {
      console.error('Error fetching tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTagClick = (tag) => {
    setSelectedTag(tag)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    navigate(`/problems?tag=${tag.name}`)
  }

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Explore Topics
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Browse and filter problems by topic tags. Master each category to become a better problem solver.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8 animate-scaleIn">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        {!loading && (
          <div className="flex justify-center gap-8 mb-10 animate-fadeIn">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-400">{tags.length}</div>
              <div className="text-sm text-gray-400">Total Tags</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{filteredTags.length}</div>
              <div className="text-sm text-gray-400">Showing</div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
            </div>
            <p className="text-gray-400 animate-pulse">Loading tags...</p>
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-lg">No tags found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          /* Tags Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredTags.map((tag, index) => (
              <button
                key={tag.id}
                onClick={() => handleTagClick(tag)}
                className="group relative overflow-hidden rounded-xl p-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20 animate-fadeIn"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getTagColor(index)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Tag Icon */}
                <div className="relative flex items-center justify-center mb-2">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getTagColor(index)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {getTagIcon(tag.name)}
                  </div>
                </div>

                {/* Tag Name */}
                <div className="relative text-center">
                  <h3 className="font-semibold text-sm text-gray-200 group-hover:text-white transition-colors capitalize truncate">
                    {tag.name}
                  </h3>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Footer Message */}
        {!loading && filteredTags.length > 0 && (
          <div className="text-center mt-12 text-gray-500 text-sm animate-fadeIn">
            <p>Click on any tag to explore related problems</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tags
