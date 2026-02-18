
import { fetchAPI } from '@/lib/strapi';

export async function submitContact(data) {
  try {
    const response = await fetchAPI('/contacts', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
    return response;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
}
