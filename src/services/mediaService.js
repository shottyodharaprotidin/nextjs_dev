import { fetchAPI } from "@/lib/strapi";

/**
 * Get Youtube videos
 * @param {string} locale
 */
export async function getYoutubeVideos(locale = 'bn') {
  const data = await fetchAPI(`/youtubes`, {
    locale: locale,
    sort: ['publishedAt:desc'],
    populate: '*',
    pagination: {
      limit: 5,
    },
  });
  return data;
}

/**
 * Get Active Poll
 * @param {string} locale
 */
export async function getActivePoll(locale = 'bn') {
  const data = await fetchAPI(`/polls`, {
    locale: locale,
    filters: {
      isActive: {
        $eq: true,
      },
    },
    sort: ['publishedAt:desc'],
    populate: '*',
    pagination: {
      limit: 1,
    },
  });
  return data;
}
