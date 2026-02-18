import { fetchAPI, getStrapiLocale } from '@/lib/strapi';

/**
 * Get YouTube videos
 */
export async function getYoutubeVideos(limit = 10, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    return await fetchAPI(`/latest-ytvideo-news?populate=*&locale=${strapiLocale}&pagination[limit]=${limit}&sort=createdAt:desc`);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return { data: [] };
  }
}

/**
 * Get featured YouTube videos
 */
export async function getFeaturedVideos(limit = 5, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    return await fetchAPI(`/latest-ytvideo-news?filters[isFeatured][$eq]=true&populate=*&locale=${strapiLocale}&pagination[limit]=${limit}&sort=createdAt:desc`);
  } catch (error) {
    console.error('Error fetching featured videos:', error);
    return { data: [] };
  }
}
