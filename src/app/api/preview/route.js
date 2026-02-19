import { draftMode, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getArticleBySlugPreview, getArticleByDocumentIdPreview } from '@/services/articleService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  const locale = searchParams.get('locale') || 'bn-BD';

  if (!process.env.STRAPI_PREVIEW_SECRET) {
      return new Response('STRAPI_PREVIEW_SECRET not set', { status: 500 });
  }

  if (secret !== process.env.STRAPI_PREVIEW_SECRET) {
    console.error('Invalid token:', secret);
    return new Response('Invalid token', { status: 401 });
  }

  console.log('Preview route accessed:', { slug, locale });

  if (!slug) {
    return new Response('Missing slug', { status: 400 });
  }

  // 1. Try to fetch by slug (assuming slug param is a real slug)
  let article = await getArticleBySlugPreview(slug, locale);

  // 2. If not found, assume slug param is actually a documentId (Strapi behavior)
  if (!article) {
      console.log(`Article not found by slug '${slug}'. Trying as documentId...`);
      article = await getArticleByDocumentIdPreview(slug, locale);
  }

  if (!article) {
      return new Response('Article not found', { status: 404 });
  }

  // 3. Get the REAL slug from the fetched article
  const realSlug = article.attributes?.slug || article.slug;
  console.log('Redirecting to real slug:', realSlug);

  if (!realSlug) {
      return new Response('Article has no slug', { status: 500 });
  }

  // Map Strapi locale (bn-BD) to Next.js app locale (bn)
  const localeMap = { 'bn-BD': 'bn', 'en': 'en' };
  const appLocale = localeMap[locale] || locale;

  // Enable Draft Mode by setting the cookie
  draftMode().enable();

  // Also set the NEXT_LOCALE cookie so the web UI shows in the correct language
  cookies().set('NEXT_LOCALE', appLocale, { path: '/' });

  // Redirect using the app locale format
  redirect(`/article/${realSlug}?locale=${appLocale}`);
}
