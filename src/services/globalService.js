
import { fetchAPI, getStrapiLocale } from '@/lib/strapi';

export async function getGlobalSettings(locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    return await fetchAPI(`/global?populate=*&locale=${strapiLocale}`, { silent: true });
  } catch (error) {
    // Silent fail for 404/403 as per user request (no global data yet)
    if (error.status !== 404 && error.status !== 403) {
      console.warn("getGlobalSettings failed.", error);
    }
    return { data: null };
  }
}

export async function getFooterData(locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    return await fetchAPI(`/footer?populate=*&locale=${strapiLocale}`, { silent: true });
  } catch (error) {
    console.warn("getFooterData failed.", error);
    return { data: null };
  }
}

export async function getAuthors(locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  return fetchAPI(`/authors?populate=*&locale=${strapiLocale}`);
}

export async function getTrendingCategories(limit = 5, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
      return await fetchAPI(`/categories?populate=*&filters[isTrending][$eq]=true&pagination[limit]=${limit}&locale=${strapiLocale}`);
  } catch (e) {
      console.warn("getTrendingCategories failed. Returning empty.", e);
      return { data: [] };
  }
}

export async function getCategories(limit = 10, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
      return await fetchAPI(`/categories?populate=*&pagination[limit]=${limit}&locale=${strapiLocale}`);
  } catch (e) {
      console.warn("getCategories failed. Returning empty.", e);
      return { data: [] };
  }
}

export async function getTags(limit = 10, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    const queryParams = new URLSearchParams({
      'pagination[limit]': limit,
      'locale': strapiLocale,
    });

    return await fetchAPI(`/tags?${queryParams}`);
  } catch (error) {
    console.warn("getTags failed. Returning empty.", error);
    return { data: [] };
  }
}

export async function getMenuItems(location = 'header', locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    const query = [
      `locale=${strapiLocale}`,
      `filters[location][$eq]=${location}`,
      'populate[menuItems][on][navigation.base-link][populate]=*',
      'populate[menuItems][on][navigation.menu-button][populate]=*',
      'populate[menuItems][on][navigation.dropdown-menu][populate][subMenus][on][navigation.base-link][populate]=*',
      'populate[menuItems][on][navigation.dropdown-menu][populate][subMenus][on][navigation.dropdown-header][populate]=*',
      'populate[menuItems][on][navigation.dropdown-menu][populate][subMenus][on][navigation.nested-dropdown][populate][subMenus]=*',
      'populate[menuItems][on][navigation.mega-menu][populate][sections][populate][links][populate]=*',
      'sort=id:asc'
    ].join('&');

    return await fetchAPI(`/menu-items?${query}`, { silent: true });
  } catch (error) {
    console.warn(`getMenuItems failed for location: ${location}`, error);
    return { data: [] };
  }
}

export async function getAdsManagement() {
  try {
    return await fetchAPI(`/ads-management?populate=*`, { silent: true });
  } catch (error) {
    console.warn('getAdsManagement failed.', error);
    return { data: null };
  }
}
