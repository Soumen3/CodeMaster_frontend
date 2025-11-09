import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import PropTypes from 'prop-types';
import codeExecutionService from '../services/codeExecutionService';
import problemService from '../services/problemService';

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
      console.log(response);
      
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

  // Initialize with dynamic template
  useEffect(() => {
    const loadInitialTemplate = async () => {
      setIsLoadingTemplate(true);
      setCode('// Loading code template...');
      const template = await fetchTemplate(language);
      setCode(template);
    };
    loadInitialTemplate();
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
      onOutputChange(output);
    }
  }, [output, onOutputChange]);

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
      setCode(codeCache[newLanguage]);
    } else {
      // Load template if no cached code
      setCode('// Loading code template...');
      const newTemplate = await fetchTemplate(newLanguage);
      setCode(newTemplate);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setActiveTab('output');
    setOutput('Running code...\n');

    try {
      const result = await codeExecutionService.runCode(problemId, code, language);
      console.log(result);
      
      const formattedOutput = codeExecutionService.formatTestResults(result);
      setOutput(formattedOutput);
      setIsRunning(false);
    } catch (error) {
      setOutput(`Error: ${error.message}\n\nPlease make sure the backend server is running.`);
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    setIsRunning(true);
    setActiveTab('results');
    setOutput('Submitting code...\n');

    try {
      const result = await codeExecutionService.submitCode(problemId, code, language);
      const formattedOutput = codeExecutionService.formatTestResults(result);
      setOutput(formattedOutput);
      setIsRunning(false);
    } catch (error) {
      setOutput(`Submission feature coming soon!\n\nThis will test your code against all test cases (including hidden ones).`);
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
