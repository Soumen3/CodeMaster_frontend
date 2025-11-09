import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import problemService from '../services/problemService';
import tagService from '../services/tagService';
import constraintService from '../services/constraintService';
import TagBadge from '../components/TagBadge';
import CodeEditor from '../components/CodeEditor';
import TestResults from '../components/TestResults';
import TestCaseDisplay from '../components/TestCaseDisplay';

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [problem, setProblem] = useState(null);
  const [tags, setTags] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [constraints, setConstraints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // Track if submission was successful
  const [resultTab, setResultTab] = useState('testcase');
  const [mobileTab, setMobileTab] = useState('description'); // 'description' or 'code'

  // Ref for Topics section
  const topicsRef = useRef(null);

  // Scroll to Topics section
  const scrollToTopics = () => {
    if (topicsRef.current) {
      topicsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Callbacks for code editor actions
  const handleRunCode = () => {
    setResultTab('result'); // Switch to Test Result tab when running
    // Trigger run code in CodeEditor
    window.dispatchEvent(new CustomEvent('runCode'));
  };

  const handleReset = () => {
    setOutput(''); // Clear output when resetting
    // Trigger reset in CodeEditor
    window.dispatchEvent(new CustomEvent('resetCode'));
  };

  const handleSubmit = () => {
    setResultTab('result'); // Switch to Test Result tab when submitting
    // Trigger submit in CodeEditor
    window.dispatchEvent(new CustomEvent('submitCode'));
  };

  useEffect(() => {
    fetchProblemData();
  }, [id]);

  const fetchProblemData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch problem details
      const problemData = await problemService.getProblem(id);
      setProblem(problemData);

      // Fetch tags for this problem
      const tagsData = await tagService.getProblemTags(id);
      setTags(tagsData);

      // Fetch test cases (only public ones)
      const testCasesData = await problemService.getTestCases(id, false);
      setTestCases(testCasesData);

      // Fetch constraints for this problem
      const constraintsData = await constraintService.getConstraintsForProblem(id);
      setConstraints(constraintsData);
    } catch (err) {
      console.error('Error fetching problem:', err);
      setError('Failed to load problem details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'hard':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const formatTestCaseData = (data) => {
    // If data is already a string, return it
    if (typeof data === 'string') {
      try {
        // Try to parse if it's a JSON string
        const parsed = JSON.parse(data);
        return formatParsedData(parsed);
      } catch {
        // If parsing fails, return as is
        return data;
      }
    }
    // If data is an object or array, format it
    return formatParsedData(data);
  };

  const formatParsedData = (data) => {
    if (data === null || data === undefined) {
      return 'null';
    }
    
    // Handle arrays
    if (Array.isArray(data)) {
      return `[${data.join(', ')}]`;
    }
    
    // Handle objects
    if (typeof data === 'object') {
      const entries = Object.entries(data);
      if (entries.length === 0) {
        return '{}';
      }
      // Format as key-value pairs
      return entries.map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key} = [${value.join(', ')}]`;
        } else if (typeof value === 'object' && value !== null) {
          return `${key} = ${JSON.stringify(value)}`;
        }
        return `${key} = ${value}`;
      }).join('\n');
    }
    
    // Return primitive values as is
    return String(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-black opacity-90" />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 relative z-10"></div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-black opacity-90" />
        </div>
        <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-sm rounded-lg p-8 max-w-md text-center relative z-10">
          <p className="text-red-400 text-lg mb-4">{error || 'Problem not found'}</p>
          <button
            onClick={() => navigate('/problems')}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all transform hover:-translate-y-0.5"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-gray-900 flex flex-col">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-black opacity-95" />
      </div>

      {/* 1. Top Navigation Bar - Fixed */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 h-12 shrink-0 z-20 sticky top-0">
        <div className="flex items-center justify-between px-4 h-full">
          {/* Left - Back Button and Problem Title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => navigate('/problems')}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Problems</span>
            </button>
            <div className="text-gray-400 shrink-0">/</div>
            <h1 className="text-white text-sm font-medium truncate">{problem.title}</h1>
          </div>

          {/* Right - Action Buttons */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 text-xs font-medium rounded transition-all transform hover:-translate-y-0.5"
            >
              Reset
            </button>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded transition-all transform hover:-translate-y-0.5 disabled:hover:translate-y-0"
            >
              Run
            </button>
            <button
              onClick={handleSubmit}
              disabled={isRunning}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white text-xs font-medium rounded transition-all transform hover:-translate-y-0.5 disabled:hover:translate-y-0"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Fixed Height */}
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row lg:overflow-hidden">
        {/* Mobile Tab Selector - Only visible on small/medium screens */}
        <div className="lg:hidden flex border-b border-gray-700/50 bg-gray-900/60 sticky top-12 z-10 shrink-0">
          <button
            onClick={() => setMobileTab('description')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              mobileTab === 'description'
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Description
            {mobileTab === 'description' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
            )}
          </button>
          <button
            onClick={() => setMobileTab('code')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              mobileTab === 'code'
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Code
            {mobileTab === 'code' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
            )}
          </button>
        </div>

        {/* 2. Left Panel - Problem Description */}
        <div className={`w-full lg:w-1/2 lg:border-r border-gray-700/50 flex flex-col shrink-0 bg-gray-900/40 backdrop-blur-sm lg:min-h-0 ${
          mobileTab === 'description' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* Problem Header - Fixed */}
          <div className="px-5 py-4 border-b border-gray-700/50 bg-gray-900/60 shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xl font-semibold text-white">{problem.title}</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              {tags.length > 0 && (
                <button
                  onClick={scrollToTopics}
                  className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 transition-all cursor-pointer"
                >
                  Topics
                </button>
              )}
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-5 py-4 lg:min-h-0 pb-6">
            <div className="text-gray-300 space-y-6">
              {/* Problem Description */}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{problem.description}</div>
              
              {/* Examples Section */}
              {testCases.length > 0 && (
                <div className="space-y-3">
                  {testCases.map((testCase, index) => (
                    <div key={testCase.id} className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 shadow-lg">
                      <div className="text-sm font-semibold text-white mb-3">Example {index + 1}:</div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs font-medium text-gray-400 mb-1">Input:</div>
                          <pre className="bg-gray-900/60 rounded p-3 text-sm text-gray-200 overflow-x-auto border border-gray-700/30">
                            {formatTestCaseData(testCase.input_data)}
                          </pre>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-400 mb-1">Output:</div>
                          <pre className="bg-gray-900/60 rounded p-3 text-sm text-gray-200 overflow-x-auto border border-gray-700/30">
                            {formatTestCaseData(testCase.expected_output)}
                          </pre>
                        </div>
                        {testCase.explanation && (
                          <div>
                            <div className="text-xs font-medium text-gray-400 mb-1">Explanation:</div>
                            <p className="text-sm text-gray-300 leading-relaxed">{testCase.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Constraints from Backend */}
              {constraints.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-white mb-3">Constraints:</h3>
                  <ul className="text-sm space-y-2 ml-4">
                    {constraints.map((constraint) => (
                      <li key={constraint.id} className="text-gray-400">• {constraint.description}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Topics Section */}
              {tags.length > 0 && (
                <div ref={topicsRef} className="pt-4 border-t border-gray-700/50">
                  <h3 className="text-base font-semibold text-white mb-3">Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <TagBadge key={tag.id} tag={tag} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor + Results */}
        <div className={`w-full lg:w-1/2 flex flex-col bg-gray-900/40 backdrop-blur-sm shrink-0 lg:min-h-0 ${
          mobileTab === 'code' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* 3. Code Editor Section - Fixed height, scrollable content */}
          <div className="h-[400px] lg:h-3/5 flex flex-col border-b border-gray-700/50 shrink-0">
            <CodeEditor 
              problemId={id} 
              onRunningChange={setIsRunning} 
              onOutputChange={(output, success) => {
                setOutput(output);
                setIsSuccess(success || false);
              }}
            />
          </div>

          {/* 4. Result Section - Fixed height, scrollable content */}
          <div className="h-[300px] lg:h-2/5 flex flex-col bg-gray-900/60 shrink-0 overflow-hidden">
            {/* Result Tabs - Fixed */}
            <div className="flex border-b border-gray-700/50 px-4 shrink-0">
              <button
                onClick={() => setResultTab('testcase')}
                className={`px-3 py-2 text-xs font-medium transition-colors relative ${
                  resultTab === 'testcase'
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Testcase
                {resultTab === 'testcase' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
                )}
              </button>
              <button
                onClick={() => setResultTab('result')}
                className={`px-3 py-2 text-xs font-medium transition-colors relative ${
                  resultTab === 'result'
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Test Result
                {resultTab === 'result' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
                )}
              </button>
            </div>

            {/* Result Content - Scrollable */}
            <div className="flex-1 p-3 overflow-y-auto min-h-0">
              {resultTab === 'testcase' ? (
                <TestCaseDisplay testCases={testCases} />
              ) : (
                <TestResults output={output} resultTab={resultTab} isSuccess={isSuccess} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
