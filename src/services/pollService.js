import { fetchAPI, getStrapiLocale } from '@/lib/strapi';

/**
 * Get active polls
 */
export async function getActivePolls(locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    return await fetchAPI(`/polls?filters[isActive][$eq]=true&populate=*&locale=${strapiLocale}`);
  } catch (error) {
    console.error('Error fetching active polls:', error);
    return { data: [] };
  }
}

/**
 * Vote for a poll option
 */
export async function votePoll(pollId, optionIndex) {
  try {
    const response = await fetchAPI(`/polls/${pollId}`, {
      method: 'PUT',
      body: JSON.stringify({
        // Increment logic would go here
        // This would need custom controller in Strapi
      })
    });
    return response;
  } catch (error) {
    console.error('Error voting:', error);
    return { success: false, error: error.message };
  }
}
