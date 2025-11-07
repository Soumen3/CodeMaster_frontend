import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import PropTypes from 'prop-types';

const CodeEditor = ({ problemId, onRunningChange }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('output');

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

  // Language templates
  const languageTemplates = {
    python: `def solution():
    # Write your code here
    pass

if __name__ == "__main__":
    result = solution()
    print(result)`,
    javascript: `function solution() {
    // Write your code here
    
}

console.log(solution());`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your code here
    
    return 0;
}`,
    java: `public class Solution {
    public static void main(String[] args) {
        // Write your code here
        
    }
}`,
    c: `#include <stdio.h>

int main() {
    // Write your code here
    
    return 0;
}`
  };

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
    // Set initial template if code is empty
    if (!code) {
      setCode(languageTemplates[language]);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // Load template for new language if editor is empty
    if (!code || code === languageTemplates[language]) {
      setCode(languageTemplates[newLanguage]);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setActiveTab('output');
    setOutput('Running code...\n');

    try {
      // TODO: Implement actual code execution via backend API
      // This is a placeholder - you'll need to create a backend endpoint for code execution
      setTimeout(() => {
        setOutput('Code execution feature coming soon!\n\nThis will run your code against test cases.');
        setIsRunning(false);
      }, 1500);

      // Example of what the actual implementation might look like:
      /*
      const response = await fetch(`http://localhost:8000/code/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          problem_id: problemId,
          code: code,
          language: language
        })
      });
      
      const result = await response.json();
      setOutput(result.output);
      setIsRunning(false);
      */
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    setIsRunning(true);
    setActiveTab('results');
    setOutput('Submitting code...\n');

    try {
      // TODO: Implement submission to backend
      setTimeout(() => {
        setOutput('Submission feature coming soon!\n\nThis will test your code against all test cases (including hidden ones).');
        setIsRunning(false);
      }, 1500);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(languageTemplates[language]);
    setOutput('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Language Selector - Fixed */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 shrink-0">
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-gray-600"
        >
          {Object.entries(languageConfigs).map(([key, config]) => (
            <option key={key} value={key}>
              {config.name}
            </option>
          ))}
        </select>
      </div>

      {/* Monaco Editor - Flexible, fills available space */}
      <div className="flex-1 min-h-0 overflow-hidden">
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
      </div>
    </div>
  );
};

CodeEditor.propTypes = {
  problemId: PropTypes.string.isRequired,
  onRunningChange: PropTypes.func,
};

export default CodeEditor;
