
import { fetchAPI } from '@/lib/strapi';

export async function searchArticles(query, locale = 'bn', limit = 20) {
  const queryParams = new URLSearchParams({
    'filters[title][$containsi]': query,
    'populate': ['cover', 'category', 'author'],
    'pagination[limit]': limit,
    'locale': locale
  });
  
  return await fetchAPI(`/articles?${queryParams}`);
}
