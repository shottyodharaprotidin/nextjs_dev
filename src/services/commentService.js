
import { fetchAPI } from '@/lib/strapi';

export async function getCommentsByArticle(articleSlug) {
  try {
    const queryParams = new URLSearchParams({
      'filters[article][slug][$eq]': articleSlug,
      'filters[parent][$null]': 'true', // Only fetch top-level comments
      'populate[children][fields][0]': 'content',
      'populate[children][fields][1]': 'authorName',
      'populate[children][fields][2]': 'authorEmail',
      'populate[children][fields][3]': 'website',
      'populate[children][fields][4]': 'subject',
      'populate[children][fields][5]': 'createdAt',
      'sort': 'createdAt:desc',
      'pagination[limit]': 100,
    });

    return await fetchAPI(`/comments?${queryParams}`);
  } catch (error) {
    console.warn('getCommentsByArticle failed:', error);
    return { data: [] };
  }
}

export async function createComment(articleDocumentId, authorName, authorEmail, content, website, subject, parentId = null) {
  try {
    const data = {
      content,
      authorName,
      authorEmail: authorEmail || null,
      website: website || null,
      subject: subject || null,
      article: articleDocumentId,
    };
    if (parentId) {
      data.parent = parentId;
    }
    return await fetchAPI('/comments', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  } catch (error) {
    console.error('createComment failed:', error);
    throw error;
  }
}
