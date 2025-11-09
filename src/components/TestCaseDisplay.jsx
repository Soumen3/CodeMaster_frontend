import PropTypes from 'prop-types';

const TestCaseDisplay = ({ testCases }) => {
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

  if (!testCases || testCases.length === 0) {
    return (
      <p className="text-gray-500 text-xs">No test cases available for this problem.</p>
    );
  }

  return (
    <div className="space-y-3">
      {testCases.map((testCase, index) => (
        <div 
          key={testCase.id} 
          className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50 hover:border-gray-600/50 transition-all"
        >
          <div className="text-xs font-semibold text-indigo-400 mb-2">
            Test Case {index + 1}
          </div>
          
          <div className="space-y-2">
            {/* Input */}
            <div>
              <div className="text-[10px] font-medium text-gray-400 mb-1">Input:</div>
              <div className="bg-gray-900/60 rounded p-2 text-xs text-gray-200 font-mono border border-gray-700/30">
                {formatTestCaseData(testCase.input_data)}
              </div>
            </div>
            
            {/* Expected Output */}
            <div>
              <div className="text-[10px] font-medium text-gray-400 mb-1">Expected Output:</div>
              <div className="bg-gray-900/60 rounded p-2 text-xs text-gray-200 font-mono border border-gray-700/30">
                {formatTestCaseData(testCase.expected_output)}
              </div>
            </div>
            
            {/* Explanation if available */}
            {testCase.explanation && (
              <div>
                <div className="text-[10px] font-medium text-gray-400 mb-1">Explanation:</div>
                <div className="text-xs text-gray-300 leading-relaxed">
                  {testCase.explanation}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

TestCaseDisplay.propTypes = {
  testCases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      input_data: PropTypes.string.isRequired,
      expected_output: PropTypes.string.isRequired,
      explanation: PropTypes.string,
    })
  ),
};

export default TestCaseDisplay;
