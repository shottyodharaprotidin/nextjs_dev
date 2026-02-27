
import { fetchAPI } from '@/lib/strapi';

export async function submitContact(data) {
  // User explicitly requested to not save form submissions to Strapi anymore.
  // We return a simulated success.
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
}
export async function getContactInfo(locale = 'bn') {
  try {
    const data = await fetchAPI(`/contact?populate=*&locale=${locale}`);
    return data;
  } catch (error) {
    console.error('Error fetching contact API:', error);
    return null;
  }
}
