import apiClient from './apiClient';

/**
 * Execute code against test cases
 * @param {number} problemId - The problem ID
 * @param {string} code - The user's code
 * @param {string} language - Programming language (python, javascript, cpp, java, c)
 * @returns {Promise<Object>} Execution results
 */
export const runCode = async (problemId, code, language) => {
  try {
    const response = await apiClient.post('/compile_problem', {
      problem_id: parseInt(problemId),
      code: code,
      language: language
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Failed to execute code');
    }
    throw new Error(error.message || 'Failed to execute code');
  }
};

/**
 * Submit code for final evaluation (including hidden test cases)
 * @param {number} problemId - The problem ID
 * @param {string} code - The user's code
 * @param {string} language - Programming language
 * @returns {Promise<Object>} Submission results
 */
export const submitCode = async (problemId, code, language) => {
  try {
    // TODO: Implement submission endpoint when backend is ready
    const response = await apiClient.post('/submit_problem', {
      problem_id: parseInt(problemId),
      code: code,
      language: language
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Failed to submit code');
    }
    throw new Error(error.message || 'Failed to submit code');
  }
};

/**
 * Format test results into readable output text
 * @param {Object} result - The execution result from backend
 * @returns {string} Formatted output text
 */
export const formatTestResults = (result) => {
  let outputText = `${result.message}\n\n`;
  outputText += `Total Tests: ${result.total_tests}\n`;
  outputText += `Passed: ${result.passed_tests}\n`;
  outputText += `Failed: ${result.total_tests - result.passed_tests}\n`;
  outputText += `Execution Time: ${result.execution_time?.toFixed(3)}s\n\n`;
  
  if (result.test_results && result.test_results.length > 0) {
    outputText += '═══════════════════════════════════════\n';
    result.test_results.forEach((testResult, index) => {
      outputText += `\nTest Case ${index + 1}: ${testResult.passed ? '✓ PASSED' : '✗ FAILED'}\n`;
      outputText += `Input: ${testResult.input}\n`;
      outputText += `Expected: ${testResult.expected_output}\n`;
      
      if (testResult.actual_output) {
        outputText += `Got: ${testResult.actual_output}\n`;
      }
      
      if (testResult.error) {
        outputText += `Error: ${testResult.error}\n`;
      }
      
      if (testResult.execution_time) {
        outputText += `Time: ${testResult.execution_time.toFixed(3)}s\n`;
      }
      outputText += '───────────────────────────────────────\n';
    });
  }
  
  return outputText;
};

export default {
  runCode,
  submitCode,
  formatTestResults
};
