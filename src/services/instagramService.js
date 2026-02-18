
import { fetchAPI, getStrapiLocale } from '@/lib/strapi';

export async function getInstagramPhotos(limit = 6, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    const queryParams = new URLSearchParams({
      'pagination[limit]': limit,
      'populate': '*',
      'sort[0]': 'order:asc',
      'locale': strapiLocale,
    });
    return await fetchAPI(`/instagrams?${queryParams}`);
  } catch (error) {
    console.warn("getInstagramPhotos failed.", error);
    return { data: [] };
  }
}
