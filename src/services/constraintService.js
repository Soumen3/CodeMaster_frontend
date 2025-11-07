import apiClient from './apiClient';

const constraintService = {
  /**
   * Get all constraints for a specific problem
   * @param {number} problemId - Problem ID
   * @returns {Promise} - Promise with constraints list
   */
  getConstraintsForProblem: async (problemId) => {
    const response = await apiClient.get(`/constraints/problem/${problemId}`);
    return response.data;
  },

  /**
   * Get a specific constraint by ID
   * @param {number} id - Constraint ID
   * @returns {Promise} - Promise with constraint details
   */
  getConstraint: async (id) => {
    const response = await apiClient.get(`/constraints/${id}`);
    return response.data;
  },

  /**
   * Create a new constraint
   * @param {Object} constraintData - Constraint data (problem_id, description, order)
   * @returns {Promise} - Promise with created constraint
   */
  createConstraint: async (constraintData) => {
    const response = await apiClient.post('/constraints', constraintData);
    return response.data;
  },

  /**
   * Update a constraint
   * @param {number} id - Constraint ID
   * @param {Object} constraintData - Updated constraint data
   * @returns {Promise} - Promise with updated constraint
   */
  updateConstraint: async (id, constraintData) => {
    const response = await apiClient.put(`/constraints/${id}`, constraintData);
    return response.data;
  },

  /**
   * Delete a constraint
   * @param {number} id - Constraint ID
   * @returns {Promise}
   */
  deleteConstraint: async (id) => {
    const response = await apiClient.delete(`/constraints/${id}`);
    return response.data;
  }
};

export default constraintService;
