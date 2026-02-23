
import { fetchAPI, getStrapiLocale } from '@/lib/strapi';

export async function getArticles(params = {}, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  const defaultParams = {
    'populate[0]': 'cover',
    'populate[1]': 'author',
    'populate[2]': 'category',
    sort: ['createdAt:desc'],
    locale: strapiLocale,
  };

  const queryParams = new URLSearchParams({
    ...defaultParams,
    ...params,
  });

  return await fetchAPI(`/articles?${queryParams}`);
}

export async function getArticleBySlug(slug, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  const data = await fetchAPI(`/articles?filters[slug][$eq]=${slug}&populate=*&populate[seo][populate]=*&locale=${strapiLocale}`);
  return data?.data?.[0] || null;
}

export async function getArticleBySlugPreview(slug, locale = 'bn-BD') {
  // getStrapiLocale maps 'bn' -> 'bn-BD'. Passing 'bn-BD' directly falls through unchanged.
  const strapiLocale = getStrapiLocale(locale) || locale;
  // Strapi v5 uses status=draft instead of deprecated publicationState=preview
  const url = `/articles?filters[slug][$eq]=${slug}&populate=*&locale=${strapiLocale}&status=draft`;
  console.log('Fetching preview article by slug:', url);
  const data = await fetchAPI(url);
  console.log('Preview article data length:', data?.data?.length);
  return data?.data?.[0] || null;
}

export async function getArticleByDocumentIdPreview(documentId, locale) {
  // getStrapiLocale maps 'bn' -> 'bn-BD'. Passing 'bn-BD' directly falls through unchanged.
  const strapiLocale = locale ? (getStrapiLocale(locale) || locale) : null;
  const localeParam = strapiLocale ? `&locale=${strapiLocale}` : '';
  // Strapi v5 uses status=draft
  const url = `/articles?filters[documentId][$eq]=${documentId}&populate=*${localeParam}&status=draft`;
  console.log('Fetching preview article by documentId:', url);
  try {
      const data = await fetchAPI(url);
      console.log('Preview article data (by documentId):', data?.data?.length);
      return data?.data?.[0] || null;
  } catch (e) {
      console.warn('Failed to fetch by documentId:', e);
      return null;
  }
}


export async function getLatestArticles(page = 1, limit = 5, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  const queryParams = new URLSearchParams({
    'populate[0]': 'cover',
    'populate[1]': 'author',
    'populate[2]': 'category',
    'pagination[page]': page,
    'pagination[pageSize]': limit,
    'sort': 'createdAt:desc',
    'locale': strapiLocale,
  });

  return await fetchAPI(`/articles?${queryParams}`);
}

export async function getRelatedArticles(categorySlug, currentArticleId, limit = 4, locale = 'bn') {
    const strapiLocale = getStrapiLocale(locale);
    const queryParams = new URLSearchParams({
        'filters[category][slug][$eq]': categorySlug,
        'filters[id][$ne]': currentArticleId,
        'populate': 'cover',
        'pagination[limit]': limit,
        'sort': 'publishedAt:desc',
        'locale': strapiLocale
    });
    return await fetchAPI(`/articles?${queryParams}`);
}

export async function getFeaturedArticles(limit = 6, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  const queryParams = new URLSearchParams({
    'filters[isFeatured][$eq]': 'true',
    'populate[0]': 'cover',
    'populate[1]': 'author',
    'populate[2]': 'category',
    'pagination[limit]': limit,
    'sort': 'createdAt:desc',
    'locale': strapiLocale,
  });

  return await fetchAPI(`/articles?${queryParams}`);
}

export async function getTrendingNews(limit = 10, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    const queryParams = new URLSearchParams({
      'populate[0]': 'cover',
      'populate[1]': 'category',
      'pagination[limit]': limit,
      'sort[0]': 'viewCount:desc',
      'sort[1]': 'publishedAt:desc',
      'locale': strapiLocale,
    });

    const response = await fetchAPI(`/articles?${queryParams}`);
    
    if (!response?.data || response.data.length === 0) {
       return getLatestArticles(1, limit, locale);
    }

    return response;
  } catch (error) {
    return getLatestArticles(1, limit, locale);
  }
}

export async function getReviewArticles(limit = 4, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    const queryParams = new URLSearchParams({
      'populate[0]': 'cover',
      'populate[1]': 'category',
      'populate[2]': 'author',
      'pagination[limit]': limit,
      'sort': 'publishedAt:desc',
      'locale': strapiLocale,
    });

    return await fetchAPI(`/articles?${queryParams}`);
  } catch (error) {
    return getLatestArticles(1, limit, locale);
  }
}

export async function getPopularArticles(limit = 5, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    const queryParams = new URLSearchParams({
      'populate[0]': 'cover',
      'populate[1]': 'author',
      'populate[2]': 'category',
      'pagination[limit]': limit,
      'sort[0]': 'viewCount:desc',
      'sort[1]': 'createdAt:desc',
      'locale': strapiLocale,
    });

    const response = await fetchAPI(`/articles?${queryParams}`);
    if (!response?.data || response.data.length === 0) {
      return getLatestArticles(1, limit, locale);
    }
    return response;
  } catch (error) {
    return getLatestArticles(1, limit, locale);
  }
}

export async function getMostViewedArticles(limit = 5, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    const queryParams = new URLSearchParams({
      'populate[0]': 'cover',
      'populate[1]': 'category',
      'pagination[limit]': limit,
      'sort[0]': 'viewCount:desc',
      'sort[1]': 'createdAt:desc',
      'locale': strapiLocale,
    });

    const response = await fetchAPI(`/articles?${queryParams}`);
    if (!response?.data || response.data.length === 0) {
      return getLatestArticles(1, limit, locale);
    }
    return response;
  } catch (error) {
    return getLatestArticles(1, limit, locale);
  }
}

export async function getVideoArticles(limit = 6, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    const queryParams = new URLSearchParams({
      'filters[videoUrl][$notNull]': 'true',
      'populate[0]': 'cover',
      'populate[1]': 'category',
      'pagination[limit]': limit,
      'sort': 'createdAt:desc',
      'locale': strapiLocale,
    });

    return await fetchAPI(`/articles?${queryParams}`);
  } catch (error) {
    return getLatestArticles(1, limit, locale);
  }
}

export async function getYoutubeVideos(limit = 5, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    const queryParams = new URLSearchParams({
      'populate': '*',
      'pagination[limit]': limit,
      'sort': 'createdAt:desc',
      'locale': strapiLocale,
    });
    return await fetchAPI(`/latest-ytvideo-news?${queryParams}`);
  } catch (error) {
    return { data: [] };
  }
}

export async function getEditorPicks(limit = 4, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  try {
    const queryParams = new URLSearchParams({
      'populate[0]': 'cover',
      'populate[1]': 'author',
      'populate[2]': 'category',
      'pagination[limit]': limit,
      'sort': 'createdAt:desc',
      'locale': strapiLocale,
    });

    return await fetchAPI(`/articles?${queryParams}`);
  } catch (error) {
    return getLatestArticles(1, limit, locale);
  }
}

export async function getArticlesByCategorySlug(categorySlug, limit = 20, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  const queryParams = new URLSearchParams({
    'filters[category][slug][$eq]': categorySlug,
    'populate[0]': 'cover',
    'populate[1]': 'category',
    'populate[2]': 'author',
    'pagination[limit]': limit,
    'sort': 'publishedAt:desc',
    'locale': strapiLocale,
  });

  return await fetchAPI(`/articles?${queryParams}`);
}

export async function getArticlesByCategory(categorySlug, limit = 10, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  const queryParams = new URLSearchParams({
    'filters[category][slug][$eq]': categorySlug,
    'populate[0]': 'cover',
    'populate[1]': 'author',
    'populate[2]': 'category',
    'pagination[limit]': limit,
    'sort': 'createdAt:desc',
    'locale': strapiLocale,
  });

  return await fetchAPI(`/articles?${queryParams}`);
}

export async function getArticlesByCategoryEnhanced(categorySlug, limit = 10, options = {}, locale = 'bn') {
  const strapiLocale = getStrapiLocale(locale);
  const queryParams = new URLSearchParams({
    'filters[category][slug][$eq]': categorySlug,
    'populate': '*', 
    'pagination[pageSize]': limit,
    'pagination[page]': options.page || 1,
    'sort': options.sort || 'createdAt:desc',
    'locale': strapiLocale,
  });

  return await fetchAPI(`/articles?${queryParams}`);
}


export async function incrementViewCount(articleId, currentViews) {
  try {
    return await fetchAPI(`/articles/${articleId}`, {
      method: 'PUT',
      body: JSON.stringify({
        data: {
          viewCount: (currentViews || 0) + 1,
        },
      }),
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return null;
  }
}
