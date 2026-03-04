import { fetchAPI, getStrapiLocale } from '@/lib/strapi';

export async function getNotFoundSettings(locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    return await fetchAPI(`/not-found?locale=${strapiLocale}`, { silent: true });
  } catch (error) {
    return { data: null };
  }
}
