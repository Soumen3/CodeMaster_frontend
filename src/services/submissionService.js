import apiClient from './apiClient';

/**
 * Get the user's last accepted submission for a problem
 * @param {number} problemId - The problem ID
 * @param {string} language - Optional language filter (python, cpp, java, c, javascript)
 * @returns {Promise<Object>} Accepted submission or null if not found
 */
export const getAcceptedSubmission = async (problemId, language = null) => {
  try {
    const url = language 
      ? `/submissions/problem/${problemId}/accepted?language=${language}`
      : `/submissions/problem/${problemId}/accepted`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    // console.error('Error fetching accepted submission:', error);
    // console.error('Error response data:', error.response?.data);
    // console.error('Error status:', error.response?.status);
    
    // Return null if no accepted submission found (404)
    if (error.response && error.response.status === 404) {
      return null;
    }
    // For auth errors, also return null (user not logged in)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      return null;
    }
    // For 400 errors, also return null (something went wrong, use default template)
    if (error.response && error.response.status === 400) {
      console.warn('Bad request when fetching accepted submission, using default template');
      return null;
    }
    throw error;
  }
};

export default {
  getAcceptedSubmission
};
