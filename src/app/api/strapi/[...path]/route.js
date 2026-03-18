const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://app.shottyodharaprotidin.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function proxyToStrapi(request, { params }) {
  const pathSegments = params?.path || [];
  const targetUrl = new URL(`${STRAPI_URL}/api/${pathSegments.join('/')}`);

  const incomingUrl = new URL(request.url);
  incomingUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const headers = new Headers();
  const contentType = request.headers.get('content-type');

  if (contentType) {
    headers.set('Content-Type', contentType);
  }

  if (STRAPI_API_TOKEN) {
    headers.set('Authorization', `Bearer ${STRAPI_API_TOKEN}`);
  }

  const requestInit = {
    method: request.method,
    headers,
    cache: 'no-store',
  };

  if (!['GET', 'HEAD'].includes(request.method)) {
    requestInit.body = await request.text();
  }

  const strapiResponse = await fetch(targetUrl.toString(), requestInit);
  const responseText = await strapiResponse.text();
  const responseContentType = strapiResponse.headers.get('content-type') || 'application/json';

  return new Response(responseText, {
    status: strapiResponse.status,
    headers: {
      'Content-Type': responseContentType,
    },
  });
}

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  return proxyToStrapi(request, context);
}

export async function POST(request, context) {
  return proxyToStrapi(request, context);
}

export async function PUT(request, context) {
  return proxyToStrapi(request, context);
}

export async function PATCH(request, context) {
  return proxyToStrapi(request, context);
}

export async function DELETE(request, context) {
  return proxyToStrapi(request, context);
}
