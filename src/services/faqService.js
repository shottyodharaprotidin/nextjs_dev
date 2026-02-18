
import { fetchAPI, getStrapiLocale } from '@/lib/strapi';

export async function getFaqs(locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    return await fetchAPI(
      `/faqs?populate=*&sort=order:asc&filters[isActive][$eq]=true&locale=${strapiLocale}&pagination[limit]=100`
    );
  } catch (error) {
    console.warn('getFaqs failed. Returning empty.', error);
    return { data: [] };
  }
}
