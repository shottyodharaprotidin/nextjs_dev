import { fetchAPI } from "@/lib/strapi";

/**
 * Get Youtube videos
 * @param {string} locale
 */
export async function getYoutubeVideos(locale = 'bn') {
  const queryParams = new URLSearchParams({
    locale: locale,
    'sort[0]': 'createdAt:desc',
    populate: '*',
    'pagination[limit]': 5,
  });

  try {
    const data = await fetchAPI(`/latest-ytvideo-news?${queryParams}`);
    return data;
  } catch {
    return { data: [] };
  }
}

/**
 * Get Active Poll
 * @param {string} locale
 */
export async function getActivePoll(locale = 'bn') {
  const queryParams = new URLSearchParams({
    locale: locale,
    'filters[isActive][$eq]': 'true',
    'sort[0]': 'publishedAt:desc',
    populate: '*',
    'pagination[limit]': 1,
  });

  try {
    const data = await fetchAPI(`/polls?${queryParams}`);
    return data;
  } catch {
    return { data: [] };
  }
}
