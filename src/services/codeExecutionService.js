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
    const response = await apiClient.post('/submissions/submit', {
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
 * @param {boolean} isSubmission - Whether this is a submission (vs run code)
 * @returns {string} Formatted output text
 */
export const formatTestResults = (result, isSubmission = false) => {
  // For submissions, use condensed format
  if (isSubmission) {
    return formatSubmissionResults(result);
  }
  
  // For "Run Code", show all test cases
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

/**
 * Format submission results (condensed format)
 * Shows success message if all pass, or first failed test case details
 * @param {Object} result - The submission result from backend
 * @returns {string} Formatted output text
 */
export const formatSubmissionResults = (result) => {
  const allPassed = result.passed_tests === result.total_tests;
  
  let outputText = '';
  
  if (allPassed) {
    // All test cases passed - show success message
    outputText += '🎉 SUCCESS! All Test Cases Passed!\n\n';
    outputText += `✅ Passed: ${result.passed_tests}/${result.total_tests}\n`;
    outputText += `⏱️  Execution Time: ${result.execution_time?.toFixed(3)}s\n\n`;
    outputText += '═══════════════════════════════════════\n';
    outputText += 'Congratulations! Your solution is correct.\n';
    outputText += 'All test cases (including hidden ones) passed successfully.';
  } else {
    // Some test cases failed - show first failure
    outputText += `❌ Submission Failed\n\n`;
    outputText += `Passed: ${result.passed_tests}/${result.total_tests} test cases\n`;
    outputText += `Failed: ${result.total_tests - result.passed_tests} test case(s)\n\n`;
    
    // Find first failed test case
    if (result.test_results && result.test_results.length > 0) {
      const firstFailure = result.test_results.find(test => !test.passed);
      
      if (firstFailure) {
        const failureIndex = result.test_results.indexOf(firstFailure);
        outputText += '═══════════════════════════════════════\n';
        outputText += `First Failed Test Case (${failureIndex + 1}):\n\n`;
        outputText += `Input: ${firstFailure.input}\n`;
        outputText += `Expected: ${firstFailure.expected_output}\n`;
        
        if (firstFailure.actual_output) {
          outputText += `Got: ${firstFailure.actual_output}\n`;
        }
        
        if (firstFailure.error) {
          outputText += `Error: ${firstFailure.error}\n`;
        }
        
        if (firstFailure.execution_time) {
          outputText += `Time: ${firstFailure.execution_time.toFixed(3)}s\n`;
        }
        outputText += '═══════════════════════════════════════\n\n';
        outputText += '💡 Tip: Fix this test case and try again!';
      }
    }
  }
  
  return outputText;
};

export default {
  runCode,
  submitCode,
  formatTestResults,
  formatSubmissionResults
};
