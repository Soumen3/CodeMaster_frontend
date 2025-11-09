import apiClient from './apiClient';

/**
 * Get comprehensive statistics for the current user
 * @returns {Promise<Object>} User statistics including solved problems, submissions, etc.
 */
export const getUserStats = async () => {
  try {
    const response = await apiClient.get('/users/me/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

export default {
  getUserStats
};
