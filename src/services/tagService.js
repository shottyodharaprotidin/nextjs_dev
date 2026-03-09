
import { fetchAPI, getStrapiLocale } from '@/lib/strapi';

export async function getPopularTags(limit = 20, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    const queryParams = new URLSearchParams({
      'pagination[limit]': limit,
      'locale': strapiLocale,
    });

    return await fetchAPI(`/tags?${queryParams}`);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return { data: [] };
  }
}

export async function getTagBySlug(slug, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    const data = await fetchAPI(`/tags?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}&locale=${strapiLocale}`);
    return data?.data?.[0] || null;
  } catch (error) {
    console.error("Error fetching tag by slug:", error);
    return null;
  }
}
