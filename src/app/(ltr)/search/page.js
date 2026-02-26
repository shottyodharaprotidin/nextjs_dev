"use client"

import Layout from '@/components/ltr/layout/layout';
import useRemoveBodyClass from '@/components/ltr/useEffect-hook/useEffect-hook';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, Suspense } from 'react';
import { searchArticles } from '@/services/articleService';
import { getGlobalSettings } from '@/services/globalService';
import { getStrapiMedia, formatDate } from '@/lib/strapi';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import Pagination from '@/components/ui/Pagination';
import { useLanguage } from '@/lib/LanguageContext';

const dictionary = {
    en: {
        loading: "Loading Search Results...",
        home: "Home",
        noNews: "No matching results found for your search.",
        searchTitle: "Search Results for"
    },
    bn: {
        loading: "অনুসন্ধানের ফলাফল লোড হচ্ছে...",
        home: "হোম",
        noNews: "আপনার অনুসন্ধানের জন্য কোনো ফলাফল পাওয়া যায়নি।",
        searchTitle: "অনুসন্ধানের ফলাফল"
    }
};

// ---- Helper ----
function getAttr(article) {
    return article?.attributes || article || {};
}

function GridArticleCard({ article, locale }) {
    const a = getAttr(article);
    const coverUrl = getStrapiMedia(a.cover, '/default.jpg');
    const slug = a.slug || article?.id || '#';
    const title = a.title || '';
    const date = formatDate(a.publishedAt || a.createdAt, locale);

    // Determines icon type based on video presence, similar to home page
    const iconClass = a.videoUrl ? 'fa-play' : 'fa-camera';

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="grid-item mb-0 h-100 d-flex flex-column">
                <div className="grid-item-img">
                    <Link href={`/article/${slug}`}>
                        <img 
                            src={coverUrl} 
                            className="img-fluid" 
                            alt={title} 
                            onError={(e) => e.target.src = '/default.jpg'} 
                            style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                        />
                        <div className="link-icon"><i className={`fa ${iconClass}`} /></div>
                    </Link>
                </div>
                <h5 className="mt-3 flex-grow-1">
                    <Link href={`/article/${slug}`} className="title">{title}</Link>
                </h5>
                <ul className="align-items-center authar-info d-flex flex-wrap gap-1 mb-0 mt-2">
                    <li>{date}</li>
                </ul>
            </div>
        </div>
    );
}

const SearchGridContent = () => {
    useRemoveBodyClass(['None'], ['home-seven', 'home-nine', 'boxed-layout', 'home-six', 'home-two']);
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const page = Number(searchParams.get('page')) || 1;
    const { locale } = useLanguage();
    const t = dictionary[locale] || dictionary.bn;

    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [globalSettings, setGlobalSettings] = useState(null);

    useEffect(() => {
        if (!query) {
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                const limit = 12; // 12 items per page for a 4-column grid (3 rows)
                const [articlesRes, globalRes] = await Promise.all([
                    searchArticles(query, limit, page, locale).catch(() => ({ data: [] })),
                    getGlobalSettings(locale).catch(() => ({ data: null })),
                ]);
                setArticles(articlesRes?.data || []);
                setPagination(articlesRes?.meta?.pagination || null);
                setGlobalSettings(globalRes?.data?.attributes || globalRes?.attributes || null);
            } catch (e) {
                console.error('Search fetch error:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [query, page, locale]);

    const displayName = `"${query}"`;

    return (
        <Layout hideMiddleHeader={true} globalSettings={globalSettings}>
            {/* START PAGE TITLE */}
            <div className="page-title py-4 bg-light">
                <div className="container">
                    <div className="align-items-center row">
                        <div className="col">
                            <h1 className="mb-sm-0 fs-2">
                                <strong>{loading ? t.loading : `${t.searchTitle}: ${displayName}`}</strong>
                            </h1>
                        </div>
                        <div className="col-12 col-sm-auto mt-3 mt-sm-0">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb d-inline-block m-0">
                                    <li className="breadcrumb-item">
                                        <Link href="/">{t.home}</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        {t.searchTitle}
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {/* END OF /. PAGE TITLE */}

            {/* *** START PAGE MAIN CONTENT *** */}
            <main className="page_main_wrapper py-5">
                <div className="container">
                    <div className="row">
                        {loading ? (
                            <div className="col-12 text-center py-5">
                                <div className="spinner-border text-danger" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : articles.length === 0 ? (
                            <div className="col-12 text-center py-5">
                                <h3>{t.noNews}</h3>
                            </div>
                        ) : (
                            articles.map((article) => (
                                <GridArticleCard key={article.id} article={article} locale={locale} />
                            ))
                        )}
                    </div>
                    
                    {/* Pagination */}
                    {!loading && pagination && pagination.pageCount > 1 && (
                        <div className="row mt-4">
                            <div className="col-12 d-flex justify-content-center">
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.pageCount}
                                    basePath={`/search?q=${encodeURIComponent(query)}`}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
            {/* *** END OF /. PAGE MAIN CONTENT *** */}
        </Layout>
    );
};

export default function Page() {
    return (
        <Suspense fallback={<div className="text-center py-5">Loading search...</div>}>
            <SearchGridContent />
        </Suspense>
    );
}
