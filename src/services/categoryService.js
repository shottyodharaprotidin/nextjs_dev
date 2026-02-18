
import { fetchAPI, getStrapiLocale } from '@/lib/strapi';

// Get all categories (for navigation menu)
export async function getAllCategories(locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    return await fetchAPI(`/categories?populate=*&locale=${strapiLocale}&sort=name:asc`);
  } catch (error) {
    console.error('Error fetching all categories:', error);
    return { data: [] };
  }
}

export async function getCategories(locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  return await fetchAPI(`/categories?populate=*&locale=${strapiLocale}`);
}

export async function getCategoryBySlug(slug, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  const data = await fetchAPI(`/categories?populate=*&filters[slug][$eq]=${encodeURIComponent(slug)}&locale=${strapiLocale}`);
  return data?.data?.[0] || null;
}
