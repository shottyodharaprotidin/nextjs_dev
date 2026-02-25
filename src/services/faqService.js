
import { fetchAPI, getStrapiLocale } from '@/lib/strapi';

export async function getFaqs(locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    // FAQ is now a single type with `faqHeaderImage` and `items` (repeatable component)
    return await fetchAPI(
      `/faq?populate[faqHeaderImage]=true&populate[items]=true&locale=${strapiLocale}`
    );
  } catch (error) {
    console.warn('getFaqs failed. Returning empty.', error);
    return { data: null };
  }
}
