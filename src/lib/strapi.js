const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://app.shottyodharaprotidin.com';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

/**
 * Helper to make requests to Strapi API
 */
export async function fetchAPI(path, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add authorization if token is available
  if (API_TOKEN) {
    defaultOptions.headers.Authorization = `Bearer ${API_TOKEN}`;
  }

  const { silent, ...fetchOptions } = options;
  const mergedOptions = {
    ...defaultOptions,
    ...fetchOptions,
  };

  const requestUrl = `${STRAPI_URL}/api${path}`;
  
  try {
    const response = await fetch(requestUrl, mergedOptions);
    
    if (!response.ok) {
      if (!silent) {
        console.error(`Strapi API Error: ${response.status} ${response.statusText}`);
      }
      throw new Error(`Failed to fetch from Strapi: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (!silent) {
      console.error('Strapi fetch error:', error);
    }
    throw error;
  }
}

/**
 * Helper to get image URL from Strapi media
 * Supports both Strapi 4 (with .data.attributes) and Strapi 5 (flat structure)
 */
export function getStrapiMedia(media, fallback = '/default.jpg') {
  if (!media) return fallback;
  
  // Strapi 5 flat structure
  if (media.url) {
    return media.url.startsWith('http') ? media.url : `${STRAPI_URL}${media.url}`;
  }
  
  // Strapi 4 structure with data wrapper
  if (media.data?.attributes?.url) {
    const { url } = media.data.attributes;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }
  
  return fallback;
}

// Helper to convert English digits to Bengali
export const toBengaliNumber = (num) => {
  if (num === null || num === undefined) return '';
  const englishToBengali = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return String(num).replace(/[0-9]/g, (digit) => englishToBengali[digit] || digit);
};

export function getStrapiLocale(locale) {
  const mapping = {
    'bn': 'bn-BD',
    'en': 'en'
  };
  return mapping[locale] || locale;
}

/**
 * Format Strapi date to readable format
 * Supports 'bn' (Bengali) and 'en' (English)
 */
export function formatDate(dateString, localeArg) {
  const date = new Date(dateString);
  const locale = localeArg || 'bn'; 
  
  const formatted = date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Force Bengali numerals if locale is 'bn' or 'bn-BD'
  if (locale.startsWith('bn')) {
    return toBengaliNumber(formatted);
  }
  
  return formatted;
}
