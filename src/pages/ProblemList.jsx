import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import problemService from '../services/problemService';
import tagService from '../services/tagService';
import TagBadge from '../components/TagBadge';

const ProblemList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [problems, setProblems] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);
  const problemsPerPage = 20;

  useEffect(() => {
    fetchTags();
    
    // Check if there's a tag parameter in the URL
    const tagParam = searchParams.get('tag');
    if (tagParam) {
      setSearchQuery(''); // Clear search when coming from tag filter
    }
  }, []);

  useEffect(() => {
    // Set selected tag from URL parameter
    const tagParam = searchParams.get('tag');
    if (tagParam && tags.length > 0) {
      // Find the tag by name
      const tag = tags.find(t => t.name.toLowerCase() === tagParam.toLowerCase());
      if (tag) {
        setSelectedTag(tag.id.toString());
      }
    }
  }, [searchParams, tags]);

  useEffect(() => {
    fetchProblems();
  }, [currentPage, selectedDifficulty, selectedTag]);

  const fetchTags = async () => {
    try {
      const data = await tagService.getTags({ limit: 1000 });
      setTags(data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const fetchProblems = async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = (currentPage - 1) * problemsPerPage;
      const params = {
        skip,
        limit: problemsPerPage,
        difficulty: selectedDifficulty || null
      };

      let data;
      if (selectedTag) {
        // Fetch problems by tag
        data = await tagService.getProblemsByTag(selectedTag);
        setProblems(data);
        setTotalProblems(data.length);
      } else {
        // Fetch all problems with filters
        data = await problemService.getProblems(params);
        setProblems(data.problems || data);
        setTotalProblems(data.total || data.length);
      }
    } catch (err) {
      console.error('Error fetching problems:', err);
      setError('Failed to load problems. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleProblemClick = (problemId) => {
    navigate(`/problems/${problemId}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getDifficultyBgColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/10 border-green-500/20';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'hard':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const filteredProblems = problems.filter(problem => {
    if (searchQuery) {
      return problem.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
             problem.description?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const totalPages = Math.ceil(totalProblems / problemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setSelectedDifficulty('');
    setSelectedTag('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-black opacity-90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {/* Compact Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">
            Problems
          </h1>
        </div>

        {/* Compact Filters */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 mb-4 border border-gray-700/50">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-700/50 border border-gray-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="w-32">
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-sm bg-gray-700/50 border border-gray-600/50 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="">Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Tag Filter */}
            <div className="w-40">
              <select
                value={selectedTag}
                onChange={(e) => {
                  setSelectedTag(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-sm bg-gray-700/50 border border-gray-600/50 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedDifficulty || selectedTag || searchQuery) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-md transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Problems List */}
        {!loading && !error && (
          <>
            {filteredProblems.length === 0 ? (
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-8 text-center border border-gray-700/50">
                <p className="text-gray-400">No problems found matching your criteria.</p>
              </div>
            ) : (
              <>
                {/* Problems Table */}
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/50">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-900/60 border-b border-gray-700/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16">
                            Status
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-28">
                            Difficulty
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/30">
                        {filteredProblems.map((problem, index) => (
                          <tr
                            key={problem.id}
                            onClick={() => handleProblemClick(problem.id)}
                            className="hover:bg-gray-700/20 cursor-pointer transition-colors"
                          >
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {/* Status icon placeholder */}
                              <div className="w-4 h-4 rounded-full border-2 border-gray-600"></div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-white font-medium hover:text-indigo-400 transition-colors">
                                  {(currentPage - 1) * problemsPerPage + index + 1}. {problem.title}
                                </span>
                                {problem.tags && problem.tags.length > 0 && (
                                  <div className="flex gap-1">
                                    {problem.tags.slice(0, 2).map((tag) => (
                                      <span key={tag.id} className="text-xs text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded">
                                        {tag.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                                {problem.difficulty}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Compact Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <div className="text-gray-400">
                      {filteredProblems.length} / {totalProblems} problems
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-700/50 text-white rounded hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        ←
                      </button>
                      
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-1 rounded transition ${
                                currentPage === pageNum
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-700/50 text-white rounded hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Coming Soon Message */}
            <div className="mt-6 relative bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-lg p-6 border border-indigo-500/20 animate-fade-in-up overflow-hidden">
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <svg className="w-5 h-5 text-indigo-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-semibold text-white animate-slide-in-left">More Problems Coming Soon!</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed animate-slide-in-right relative z-10">
                We're constantly adding new challenges to help you develop your logic skills, master algorithms, and sharpen your problem-solving abilities. 
                Stay tuned for fresh problems across various difficulty levels and topics! 🚀
              </p>
              
              {/* Animated decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ProblemList;
