import PropTypes from 'prop-types';

const TestResults = ({ output, resultTab, isSuccess = false }) => {
  if (!output) {
    return (
      <p className="text-gray-500 text-xs">
        {resultTab === 'testcase' 
          ? 'You must select a testcase or click "Run" to see results.' 
          : 'You must click "Submit" to see test results.'}
      </p>
    );
  }

  // If it's a success submission, show special green-themed display
  if (isSuccess && output.includes('🎉 SUCCESS')) {
    return (
      <div className="space-y-3">
        <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/30 backdrop-blur-sm rounded-lg p-6 border-2 border-green-500/50 shadow-lg shadow-green-500/20">
          <div className="text-center space-y-3">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-xl font-bold text-green-400">SUCCESS!</div>
            <div className="text-sm text-green-300 font-medium">All Test Cases Passed!</div>
            
            {/* Extract and display stats */}
            {output.split('\n').map((line, idx) => {
              if (line.includes('Passed:') || line.includes('Execution Time:')) {
                return (
                  <div key={idx} className="text-xs text-green-200 font-mono">
                    {line}
                  </div>
                );
              }
              return null;
            })}
            
            <div className="pt-3 border-t border-green-500/30 mt-4">
              <p className="text-xs text-green-300/80">
                Congratulations! Your solution is correct.
              </p>
              <p className="text-xs text-green-300/80">
                All test cases (including hidden ones) passed successfully.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const lines = output.split('\n');
  const summary = [];
  const testCaseCards = [];
  let currentTestCase = null;
  
  lines.forEach((line, index) => {
    // Summary section (first few lines)
    if (line.includes('test case') || line.startsWith('Total Tests:') || 
        line.startsWith('Passed:') || line.startsWith('Failed:') || 
        line.startsWith('Execution Time:')) {
      summary.push({ line, index });
    }
    // Test case header
    else if (line.includes('Test Case')) {
      if (currentTestCase) {
        testCaseCards.push(currentTestCase);
      }
      currentTestCase = {
        header: line,
        lines: [],
        isPassed: line.includes('✓ PASSED')
      };
    }
    // Test case content
    else if (currentTestCase && !line.includes('═══') && !line.includes('───')) {
      if (line.trim()) {
        currentTestCase.lines.push(line);
      }
    }
  });
  
  // Add last test case
  if (currentTestCase) {
    testCaseCards.push(currentTestCase);
  }

  const getSummaryLineClass = (line) => {
    if (line.startsWith('Passed:')) {
      return 'text-green-400 font-semibold';
    } else if (line.startsWith('Failed:')) {
      return 'text-red-400 font-semibold';
    } else if (line.startsWith('Total Tests:') || line.startsWith('Execution Time:')) {
      return 'text-cyan-400 font-medium';
    }
    return 'text-gray-300';
  };

  const getTestCaseLineClass = (line, isPassed) => {
    if (line.startsWith('Input:')) {
      return 'text-yellow-300 font-medium';
    } else if (line.startsWith('Expected:')) {
      return 'text-blue-300 font-medium';
    } else if (line.startsWith('Got:')) {
      return isPassed ? 'text-green-300 font-medium' : 'text-orange-300 font-medium';
    } else if (line.startsWith('Error:')) {
      return 'text-red-300 font-medium';
    } else if (line.startsWith('Time:')) {
      return 'text-cyan-300 text-[10px]';
    }
    return 'text-gray-300';
  };

  return (
    <div className="space-y-3">
      {/* Summary Section */}
      {summary.length > 0 && (
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
          {summary.map(({ line, index }) => (
            <div key={index} className={`text-xs font-mono ${getSummaryLineClass(line)}`}>
              {line}
            </div>
          ))}
        </div>
      )}
      
      {/* Test Case Cards */}
      {testCaseCards.map((testCase, idx) => (
        <div 
          key={idx} 
          className={`rounded-lg p-3 border backdrop-blur-sm transition-all hover:shadow-lg ${
            testCase.isPassed 
              ? 'bg-green-900/20 border-green-500/30 hover:border-green-500/50' 
              : 'bg-red-900/20 border-red-500/30 hover:border-red-500/50'
          }`}
        >
          {/* Test Case Header */}
          <div className={`text-xs font-mono font-semibold mb-2 flex items-center gap-2 ${
            testCase.isPassed ? 'text-green-400' : 'text-red-400'
          }`}>
            <span>{testCase.header}</span>
          </div>
          
          {/* Test Case Details */}
          <div className="space-y-1">
            {testCase.lines.map((line, lineIdx) => (
              <div 
                key={lineIdx} 
                className={`text-xs font-mono ${getTestCaseLineClass(line, testCase.isPassed)}`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

TestResults.propTypes = {
  output: PropTypes.string,
  resultTab: PropTypes.string.isRequired,
  isSuccess: PropTypes.bool,
};

export default TestResults;
