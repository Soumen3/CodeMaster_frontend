import apiClient from './apiClient';

const problemService = {
  /**
   * Get list of problems with optional filters
   * @param {Object} params - Query parameters
   * @param {number} params.skip - Number of records to skip
   * @param {number} params.limit - Maximum number of records to return
   * @param {string} params.difficulty - Filter by difficulty (easy/medium/hard)
   * @returns {Promise} - Promise with problems list
   */
  getProblems: async ({ skip = 0, limit = 100, difficulty = null } = {}) => {
    const params = { skip, limit };
    if (difficulty) {
      params.difficulty = difficulty;
    }
    const response = await apiClient.get('/problems', { params });
    return response.data;
  },

  /**
   * Get a specific problem by ID
   * @param {number} id - Problem ID
   * @returns {Promise} - Promise with problem details
   */
  getProblem: async (id) => {
    const response = await apiClient.get(`/problems/${id}`);
    return response.data;
  },

  /**
   * Get test cases for a problem
   * @param {number} id - Problem ID
   * @param {boolean} includeHidden - Whether to include hidden test cases
   * @returns {Promise} - Promise with test cases
   */
  getTestCases: async (id, includeHidden = false) => {
    const response = await apiClient.get(`/problems/${id}/testcases`, {
      params: { include_hidden: includeHidden }
    });
    return response.data;
  },

  /**
   * Create a new problem
   * @param {Object} problemData - Problem data
   * @returns {Promise} - Promise with created problem
   */
  createProblem: async (problemData) => {
    const response = await apiClient.post('/problems', problemData);
    return response.data;
  },

  /**
   * Update a problem
   * @param {number} id - Problem ID
   * @param {Object} problemData - Updated problem data
   * @returns {Promise} - Promise with updated problem
   */
  updateProblem: async (id, problemData) => {
    const response = await apiClient.put(`/problems/${id}`, problemData);
    return response.data;
  },

  /**
   * Delete a problem
   * @param {number} id - Problem ID
   * @returns {Promise}
   */
  deleteProblem: async (id) => {
    const response = await apiClient.delete(`/problems/${id}`);
    return response.data;
  }
};

export default problemService;
