import { getArticleBySlug, getMostViewedArticles, getPopularArticles } from '@/services/articleService';
import { getGlobalSettings } from '@/services/globalService';
import { getStrapiMedia } from '@/lib/strapi';
import ClientArticleDetail from '@/components/article/article-details';

// Force dynamic rendering since we rely on request params and external data
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const locale = 'bn'; // Hardcoded for now
  const articleData = await getArticleBySlug(slug, locale);
  
  if (!articleData) {
    return {
      title: 'Article Not Found',
    };
  }

  const data = articleData.attributes || articleData;
  const imageUrl = getStrapiMedia(data.cover);

  return {
    title: data.title,
    description: data.excerpt,
    openGraph: {
      title: data.title,
      description: data.excerpt,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

const ArticleDetailPage = async ({ params }) => {
  const { slug } = params;
  const locale = 'bn';

  // Parallel Data Fetching with Error Handling
  let articleData = null;
  let mostViewedResponse = { data: [] };
  let popularResponse = { data: [] };
  let globalSettingsResponse = { data: null };

  try {
    const results = await Promise.allSettled([
      getArticleBySlug(slug, locale),
      getMostViewedArticles(5, locale),
      getPopularArticles(5, locale),
      getGlobalSettings(locale)
    ]);

    articleData = results[0].status === 'fulfilled' ? results[0].value : null;
    mostViewedResponse = results[1].status === 'fulfilled' ? results[1].value : { data: [] };
    popularResponse = results[2].status === 'fulfilled' ? results[2].value : { data: [] };
    globalSettingsResponse = results[3].status === 'fulfilled' ? results[3].value : { data: null };
  } catch (error) {
    console.error("Error fetching data for article page:", error);
  }

  if (!articleData) {
     // You might want to render a custom 404 component here
    return <div>Article not found</div>;
  }

  return (
    <ClientArticleDetail 
      article={articleData}
      mostViewed={mostViewedResponse?.data || []}
      popularNews={popularResponse?.data || []}
      globalSettings={globalSettingsResponse?.data}
      locale={locale}
    />
  );
};

export default ArticleDetailPage;
