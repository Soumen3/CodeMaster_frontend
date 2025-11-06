import apiClient from './apiClient';

const tagService = {
  /**
   * Get list of tags
   * @param {Object} params - Query parameters
   * @param {number} params.skip - Number of records to skip
   * @param {number} params.limit - Maximum number of records to return
   * @returns {Promise} - Promise with tags list
   */
  getTags: async ({ skip = 0, limit = 1000 } = {}) => {
    const response = await apiClient.get('/tags', { params: { skip, limit } });
    return response.data;
  },

  /**
   * Get a specific tag by ID
   * @param {number} id - Tag ID
   * @returns {Promise} - Promise with tag details
   */
  getTag: async (id) => {
    const response = await apiClient.get(`/tags/${id}`);
    return response.data;
  },

  /**
   * Get tags for a specific problem
   * @param {number} problemId - Problem ID
   * @returns {Promise} - Promise with tags
   */
  getProblemTags: async (problemId) => {
    const response = await apiClient.get(`/tags/problem/${problemId}`);
    return response.data;
  },

  /**
   * Get problems by tag
   * @param {number} tagId - Tag ID
   * @returns {Promise} - Promise with problems
   */
  getProblemsByTag: async (tagId) => {
    const response = await apiClient.get(`/tags/tag/${tagId}/problems`);
    return response.data;
  },

  /**
   * Create a new tag
   * @param {Object} tagData - Tag data
   * @returns {Promise} - Promise with created tag
   */
  createTag: async (tagData) => {
    const response = await apiClient.post('/tags', tagData);
    return response.data;
  },

  /**
   * Assign a tag to a problem
   * @param {number} problemId - Problem ID
   * @param {number} tagId - Tag ID
   * @returns {Promise} - Promise with assignment result
   */
  assignTag: async (problemId, tagId) => {
    const response = await apiClient.post('/tags/assign', { problem_id: problemId, tag_id: tagId });
    return response.data;
  },

  /**
   * Remove a tag from a problem
   * @param {number} problemId - Problem ID
   * @param {number} tagId - Tag ID
   * @returns {Promise}
   */
  removeTag: async (problemId, tagId) => {
    const response = await apiClient.delete('/tags/assign', {
      params: { problem_id: problemId, tag_id: tagId }
    });
    return response.data;
  }
};

export default tagService;
