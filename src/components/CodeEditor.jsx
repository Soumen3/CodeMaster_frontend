import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import PropTypes from 'prop-types';
import codeExecutionService from '../services/codeExecutionService';
import problemService from '../services/problemService';
import submissionService from '../services/submissionService';

const CodeEditor = ({ problemId, onRunningChange, onOutputChange }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('output');
  const [templateCache, setTemplateCache] = useState({});
  const [codeCache, setCodeCache] = useState({}); // Cache for user-written code per language
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Track if submission was successful

  // Fetch dynamic template from backend
  const fetchTemplate = async (lang) => {
    // Check cache first
    const cacheKey = `${problemId}_${lang}`;
    if (templateCache[cacheKey]) {
      return templateCache[cacheKey];
    }

    try {
      setIsLoadingTemplate(true);
      const response = await problemService.getCodeTemplate(problemId, lang);
      
      const template = response.code;
      
      // Cache the template
      setTemplateCache(prev => ({
        ...prev,
        [cacheKey]: template
      }));
      
      return template;
    } catch (error) {
      console.error('Failed to fetch template:', error);
      // Return a basic fallback comment
      return '// Failed to load template. Please check your connection.';
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  // Initialize with dynamic template or accepted submission
  useEffect(() => {
    const loadInitialCode = async () => {
      setIsLoadingTemplate(true);
      setCode('// Loading...');
      
      try {
        // First, try to get accepted submission (if user is logged in)
        const acceptedSubmission = await submissionService.getAcceptedSubmission(problemId);
        
        if (acceptedSubmission && acceptedSubmission.code && acceptedSubmission.language) {
          // User has an accepted submission - load it
          console.log('Loading accepted submission:', acceptedSubmission);
          setLanguage(acceptedSubmission.language);
          setCode(acceptedSubmission.code);
          console.log('✅ Loaded accepted solution');
        } else {
          // No accepted submission - load template
          const template = await fetchTemplate(language);
          setCode(template);
          console.log('📝 Loaded default template');
        }
      } catch (error) {
        console.error('Error loading initial code:', error);
        // Fallback to template on error
        const template = await fetchTemplate(language);
        setCode(template);
      } finally {
        setIsLoadingTemplate(false);
      }
    };
    
    loadInitialCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId]); // Run when problemId changes

  // Listen for external events from ProblemDetail
  useEffect(() => {
    const handleRunCode = () => runCode();
    const handleReset = () => resetCode();
    const handleSubmit = () => submitCode();

    window.addEventListener('runCode', handleRunCode);
    window.addEventListener('resetCode', handleReset);
    window.addEventListener('submitCode', handleSubmit);

    return () => {
      window.removeEventListener('runCode', handleRunCode);
      window.removeEventListener('resetCode', handleReset);
      window.removeEventListener('submitCode', handleSubmit);
    };
  }, [language, code]);

  // Update parent component when running state changes
  useEffect(() => {
    if (onRunningChange) {
      onRunningChange(isRunning);
    }
  }, [isRunning, onRunningChange]);

  // Update parent component when output changes
  useEffect(() => {
    if (onOutputChange) {
      onOutputChange(output, isSuccess); // Pass isSuccess along with output
    }
  }, [output, isSuccess, onOutputChange]);

  // Language configurations
  const languageConfigs = {
    python: { id: 'python', name: 'Python', extension: '.py' },
    javascript: { id: 'javascript', name: 'JavaScript', extension: '.js' },
    cpp: { id: 'cpp', name: 'C++', extension: '.cpp' },
    java: { id: 'java', name: 'Java', extension: '.java' },
    c: { id: 'c', name: 'C', extension: '.c' }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = async (newLanguage) => {
    if (newLanguage === language) return; // No change needed
    
    // Save current code to cache before switching
    setCodeCache(prev => ({
      ...prev,
      [language]: code
    }));
    
    console.log('Changing language to:', newLanguage);
    setLanguage(newLanguage);
    
    // Check if we have cached code for the new language
    if (codeCache[newLanguage]) {
      // Use cached code if available
      console.log('📝 Loading cached code for', newLanguage);
      setCode(codeCache[newLanguage]);
    } else {
      // No cached code - check for accepted submission in this language
      setCode('// Loading...');
      
      try {
        // Pass the language parameter to get language-specific submission
        const acceptedSubmission = await submissionService.getAcceptedSubmission(problemId, newLanguage);
        
        if (acceptedSubmission) {
          console.log('✅ Loading accepted submission for', newLanguage);
          setCode(acceptedSubmission.code);
        } else {
          // No accepted submission in this language - load template
          console.log('📝 Loading template for', newLanguage);
          const newTemplate = await fetchTemplate(newLanguage);
          setCode(newTemplate);
        }
      } catch (error) {
        console.error('Error loading code for language change:', error);
        // Fallback to template on error
        const newTemplate = await fetchTemplate(newLanguage);
        setCode(newTemplate);
      }
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setActiveTab('output');
    setOutput('⏳ Running your code...\n\nCompiling and executing against sample test cases.\nPlease wait...');
    setIsSuccess(false); // Reset success state

    try {
      const result = await codeExecutionService.runCode(problemId, code, language);
      console.log(result);
      
      const formattedOutput = codeExecutionService.formatTestResults(result);
      setOutput(formattedOutput);
      setIsSuccess(false); // Run code doesn't show success theme
      setIsRunning(false);
    } catch (error) {
      setOutput(`Error: ${error.message}\n\nPlease make sure the backend server is running.`);
      setIsSuccess(false);
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    
    console.log('=== Submit Debug Info ===');
    console.log('Token exists:', !!token);
    console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'null');
    console.log('User exists:', !!user);
    console.log('User data:', user ? JSON.parse(user) : null);
    
    if (!token) {
      console.log("Token Not Found - showing auth required message");
      
      setActiveTab('results');
      setOutput('⚠️  Authentication Required\n\nYou must be logged in to submit code.\n\nPlease login with Google or GitHub to save your submissions and track your progress.');
      setIsSuccess(false);
      return;
    }

    setIsRunning(true);
    setActiveTab('results');
    setOutput('⏳ Submitting your code...\n\nRunning against all test cases (including hidden ones).\nThis may take a few moments...\n\nPlease wait...');
    setIsSuccess(false); // Reset success state

    try {
      console.log('Calling submitCode API...');
      const result = await codeExecutionService.submitCode(problemId, code, language);
      console.log('Submit result:', result);
      
      // Check if all tests passed
      const allPassed = result.passed_tests === result.total_tests;
      setIsSuccess(allPassed); // Set success state for green theme
      
      const formattedOutput = codeExecutionService.formatTestResults(result, true); // Pass true for submission
      setOutput(formattedOutput);
      setIsRunning(false);
    } catch (error) {
      console.error('Submit error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      setIsSuccess(false);
      
      // Check if it's an authentication error
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        const errorDetail = error.response.data?.detail || error.message;
        setOutput(`⚠️  Authentication Error\n\nStatus: ${error.response.status}\nError: ${errorDetail}\n\nThis usually means your token is invalid or expired.\n\nPlease try:\n1. Logout from the navbar\n2. Login again with Google or GitHub\n3. Try submitting again`);
      } else if (error.message.includes('401') || error.message.includes('403') || error.message.includes('credentials')) {
        setOutput(`⚠️  Authentication Error\n\nYour session may have expired. Please login again to submit your code.\n\nError: ${error.message}`);
      } else {
        setOutput(`❌ Submission Failed\n\n${error.message}\n\nPlease try again or contact support if the issue persists.`);
      }
      setIsRunning(false);
    }
  };

  const resetCode = async () => {
    setCode('// Loading code template...');
    const template = await fetchTemplate(language);
    setCode(template);
    
    // Clear cached code for current language when reset
    setCodeCache(prev => {
      const newCache = { ...prev };
      delete newCache[language];
      return newCache;
    });
    
    setOutput('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Language Selector - Fixed */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={isRunning || isLoadingTemplate}
            className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {Object.entries(languageConfigs).map(([key, config]) => (
              <option key={key} value={key}>
                {config.name}
              </option>
            ))}
          </select>
          {isLoadingTemplate && (
            <span className="text-xs text-gray-400">Loading template...</span>
          )}
        </div>
      </div>

      {/* Monaco Editor - Flexible, fills available space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {isLoadingTemplate && code === '// Loading code template...' ? (
          <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
              <p className="text-gray-400 text-sm">Loading code template...</p>
            </div>
          </div>
        ) : (
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              wordWrap: 'off',
              bracketPairColorization: { enabled: true },
              padding: { top: 8 },
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

CodeEditor.propTypes = {
  problemId: PropTypes.string.isRequired,
  onRunningChange: PropTypes.func,
  onOutputChange: PropTypes.func,
};

export default CodeEditor;
