import '@fortawesome/fontawesome-free/css/all.min.css';
import "@icon/themify-icons/themify-icons.css"

import ImportJs from '@/components/ltr/import-js/import-js';
import Providers from './theme-providers';
import { getGlobalSettings } from '@/services/globalService';

export async function generateMetadata() {
  try {
    const globalRes = await getGlobalSettings('bn');
    const attrs = globalRes?.data?.attributes || {};
    const seo = attrs.defaultSeo || {};

    return {
      title: seo.metaTitle || attrs.siteName || 'Satyadhara Pratidin',
      description: seo.metaDescription || attrs.siteDescription || 'সত্যধারা প্রতিদিন - সত্যের সন্ধানে সর্বদা',
      icons: {
        icon: [
          { url: '/favicon.ico?v=5' },
          { url: '/favicon-16x16.png?v=5', sizes: '16x16', type: 'image/png' },
          { url: '/favicon-32x32.png?v=5', sizes: '32x32', type: 'image/png' },
        ],
        apple: ['/apple-touch-icon.png?v=5'],
        shortcut: ['/favicon.ico?v=5']
      }
    };
  } catch (error) {
    return {
      title: 'Satyadhara Pratidin',
      description: 'সত্যধারা প্রতিদিন - সত্যের সন্ধানে সর্বদা',
      icons: {
        icon: [
          { url: '/favicon.ico?v=5' },
          { url: '/favicon-16x16.png?v=5', sizes: '16x16', type: 'image/png' },
          { url: '/favicon-32x32.png?v=5', sizes: '32x32', type: 'image/png' },
        ],
        apple: ['/apple-touch-icon.png?v=5'],
        shortcut: ['/favicon.ico?v=5']
      }
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ImportJs />
      <body>
        <Providers>  
          {children}
        </Providers>
      </body>
    </html>
  )
}
