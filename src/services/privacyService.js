import { fetchAPI, getStrapiLocale } from '@/lib/strapi';

export async function getPrivacyData(locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    const queryParams = new URLSearchParams({
      'locale': strapiLocale,
      'populate[heroImage][fields][0]': 'url',
      'populate[heroImage][fields][1]': 'alternativeText',
    });

    // Endpoint name matches standard Strapi single type naming
    return await fetchAPI(`/privacy-policy?${queryParams}`);
  } catch (error) {
    console.warn('getPrivacyData failed:', error);
    return { data: null };
  }
}
