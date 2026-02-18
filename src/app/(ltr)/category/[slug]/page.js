"use client"

import Layout from '@/components/ltr/layout/layout';
import useRemoveBodyClass from '@/components/ltr/useEffect-hook/useEffect-hook';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import StickyBox from 'react-sticky-box';
import dynamic from 'next/dynamic';
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import 'animate.css/animate.css';
import { getCategoryBySlug } from '@/services/categoryService';
import { getArticlesByCategoryEnhanced, getMostViewedArticles, getPopularArticles } from '@/services/articleService';
import { getGlobalSettings } from '@/services/globalService';
import { getStrapiMedia, formatDate } from '@/lib/strapi';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import Pagination from '@/components/ui/Pagination';

if (typeof window !== 'undefined') {
    window.$ = window.jQuery = require('jquery');
}
const OwlCarousel = dynamic(() => import('react-owl-carousel'), { ssr: false });

// ---- Skeleton placeholders ----
const SKELETON_ARTICLES = Array.from({ length: 9 }, (_, i) => ({ id: `sk-${i}`, _skeleton: true }));

const ArticleSkeleton = () => (
    <article>
        <figure>
            <a href="#" className="news-image">
                <img src="/default.jpg" alt="" className="img-fluid" />
            </a>
            <span className="post-category">লোড হচ্ছে...</span>
        </figure>
        <div className="post-info">
            <h3><a href="#">লোড হচ্ছে: সংবাদের শিরোনাম এখানে দেখাবে...</a></h3>
            <ul className="authar-info d-flex flex-wrap">
                <li><i className="ti ti-timer" /> লোডিং...</li>
            </ul>
        </div>
    </article>
);

const SliderSkeleton = () => (
    <div className="slider-post post-height-1">
        <a href="#" className="news-image">
            <img src="/default.jpg" alt="" className="img-fluid" />
        </a>
        <div className="post-text">
            <span className="post-category">লোড হচ্ছে...</span>
            <h2><a href="#">লোড হচ্ছে: সংবাদের শিরোনাম এখানে দেখাবে...</a></h2>
            <ul className="authar-info d-flex flex-wrap">
                <li className="authar"><a href="#">লোডিং...</a></li>
                <li className="date">লোডিং...</li>
            </ul>
        </div>
    </div>
);

// ---- Helper ----
function getAttr(article) {
    return article?.attributes || article || {};
}

function ArticleCard({ article, categoryName }) {
    const a = getAttr(article);
    const coverUrl = getStrapiMedia(a.cover, '/default.jpg');
    const slug = a.slug || article?.id || '#';
    const title = a.title || '';
    const date = formatDate(a.publishedAt || a.createdAt);
    const catName = categoryName || a.category?.data?.attributes?.name || a.category?.name || '';
    const authorName = a.author?.data?.attributes?.name || a.author?.name || '';

    return (
        <article>
            <figure>
                <Link href={`/article/${slug}`} className="news-image">
                    <ImageWithFallback
                        src={coverUrl}
                        height={242}
                        width={345}
                        alt={title}
                        className="img-fluid"
                    />
                </Link>
                <span className="post-category">{catName}</span>
            </figure>
            <div className="post-info">
                <h3><Link href={`/article/${slug}`}>{title}</Link></h3>
                <ul className="authar-info d-flex flex-wrap">
                    {date && <li><i className="ti ti-timer" /> {date}</li>}
                    {authorName && <li className="authar d-lg-block d-none"><a href="#">by {authorName}</a></li>}
                </ul>
            </div>
        </article>
    );
}

function SliderItem({ article, categoryName }) {
    const a = getAttr(article);
    const coverUrl = getStrapiMedia(a.cover, '/default.jpg');
    const slug = a.slug || article?.id || '#';
    const title = a.title || '';
    const date = formatDate(a.publishedAt || a.createdAt);
    const catName = categoryName || a.category?.data?.attributes?.name || a.category?.name || '';
    const authorName = a.author?.data?.attributes?.name || a.author?.name || '';
    const views = a.viewCount || 0;

    return (
        <div className="item">
            <div className="slider-post post-height-1">
                <Link href={`/article/${slug}`} className="news-image">
                    <img
                        src={coverUrl}
                        alt={title}
                        className="img-fluid"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '400px' }}
                        onError={(e) => { e.target.src = '/default.jpg'; e.target.onerror = null; }}
                    />
                </Link>
                <div className="post-text">
                    <span className="post-category">{catName}</span>
                    <h2><Link href={`/article/${slug}`}>{title}</Link></h2>
                    <ul className="authar-info d-flex flex-wrap">
                        {authorName && <li className="authar"><a href="#">by {authorName}</a></li>}
                        {date && <li className="date">{date}</li>}
                        {views > 0 && <li className="view"><a href="#">{views} views</a></li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function GridItem({ article, categoryName }) {
    const a = getAttr(article);
    const coverUrl = getStrapiMedia(a.cover, '/default.jpg');
    const slug = a.slug || article?.id || '#';
    const title = a.title || '';
    const date = formatDate(a.publishedAt || a.createdAt);
    const catName = categoryName || a.category?.data?.attributes?.name || a.category?.name || '';
    const authorName = a.author?.data?.attributes?.name || a.author?.name || '';

    return (
        <div className="col-6 col-sm-6 thm-padding">
            <div className="slider-post post-height-2">
                <Link href={`/article/${slug}`} className="news-image">
                    <ImageWithFallback
                        src={coverUrl}
                        alt={title}
                        className="img-fluid"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '190px' }}
                    />
                </Link>
                <div className="post-text">
                    <span className="post-category">{catName}</span>
                    <h4><Link href={`/article/${slug}`}>{title}</Link></h4>
                    <ul className="authar-info d-flex flex-wrap">
                        {authorName && <li className="authar d-lg-block d-none"><a href="#">by {authorName}</a></li>}
                        {date && <li className="d-md-block d-none">{date}</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}

const carouselOptions = {
    loop: true,
    items: 1,
    dots: true,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    nav: true,
    navText: ["<i class='ti ti ti-angle-left'></i>", "<i class='ti ti ti-angle-right'></i>"],
};

const CategoryPage = () => {
    useRemoveBodyClass(['None'], ['home-seven', 'home-nine', 'boxed-layout', 'home-six', 'home-two']);
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params?.slug || '';
    const page = Number(searchParams.get('page')) || 1;

    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');
    const [featuredImage, setFeaturedImage] = useState(null);
    const [articles, setArticles] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [mostViewed, setMostViewed] = useState([]);
    const [popularNews, setPopularNews] = useState([]);
    const [globalSettings, setGlobalSettings] = useState(null);

    useEffect(() => {
        if (!slug) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const [catData, articlesRes, mostViewedRes, popularRes, globalRes] = await Promise.all([
                    getCategoryBySlug(slug).catch(() => null),
                    getArticlesByCategoryEnhanced(slug, 19, { page }).catch(() => ({ data: [] })),
                    getMostViewedArticles(5).catch(() => ({ data: [] })),
                    getPopularArticles(5).catch(() => ({ data: [] })),
                    getGlobalSettings().catch(() => ({ data: null })),
                ]);
                const name = catData?.attributes?.name || catData?.name || slug;
                setCategoryName(name);
                setFeaturedImage(catData?.attributes?.featuredImage || catData?.featuredImage || null);
                setArticles(articlesRes?.data || []);
                setPagination(articlesRes?.meta?.pagination || null);
                setMostViewed(mostViewedRes?.data || []);
                setPopularNews(popularRes?.data || []);
                setGlobalSettings(globalRes?.data?.attributes || globalRes?.attributes || null);
            } catch (e) {
                console.error('CategoryPage fetch error:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug, page]);

    // Split articles into sections
    const sliderArticles = loading ? SKELETON_ARTICLES.slice(0, 5) : articles.slice(0, 5);
    const gridArticles = loading ? SKELETON_ARTICLES.slice(0, 4) : articles.slice(5, 9);
    const mainArticles = loading ? SKELETON_ARTICLES : articles.slice(9);

    return (
        <Layout hideMiddleHeader={true} globalSettings={globalSettings}>
            {/* START PAGE TITLE */}
            <div className="page-title">
                <div className="container">
                    <div className="align-items-center row">
                        <div className="col">
                            <h1 className="mb-sm-0">
                                <strong>{loading ? 'লোড হচ্ছে...' : categoryName}</strong>
                            </h1>
                        </div>
                        <div className="col-12 col-sm-auto">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb d-inline-block">
                                    <li className="breadcrumb-item">
                                        <Link href="/">হোম</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        {loading ? 'লোড হচ্ছে...' : categoryName}
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {/* END OF /. PAGE TITLE */}

            {/* *** START PAGE MAIN CONTENT *** */}
            <main className="page_main_wrapper">
                {/* START POST BLOCK SECTION */}
                <section className="slider-inner">
                    <div className="container">
                        <div className="row thm-margin">
                            {/* LEFT: Slider */}
                            <div className="col-md-6 thm-padding">
                                <div className="slider-wrapper" style={{ minHeight: '400px' }}>
                                    {loading ? (
                                        <SliderSkeleton />
                                    ) : sliderArticles.length > 0 ? (
                                        <OwlCarousel key={`slider-${articles.length}`} id="owl-slider" className="owl-theme" {...carouselOptions}>
                                            {sliderArticles.map((article) => (
                                                <SliderItem key={article.id} article={article} categoryName={categoryName} />
                                            ))}
                                        </OwlCarousel>
                                    ) : (
                                        <SliderSkeleton />
                                    )}
                                </div>
                            </div>
                            {/* RIGHT: 2x2 grid */}
                            <div className="col-md-6 thm-padding">
                                <div className="row slider-right-post thm-margin">
                                    {loading
                                        ? SKELETON_ARTICLES.slice(0, 4).map((_, i) => (
                                            <div className="col-6 col-sm-6 thm-padding" key={i}>
                                                <div className="slider-post post-height-2">
                                                    <a href="#" className="news-image">
                                                        <img src="/default.jpg" alt="" className="img-fluid" />
                                                    </a>
                                                    <div className="post-text">
                                                        <span className="post-category">লোড হচ্ছে...</span>
                                                        <h4><a href="#">লোড হচ্ছে: সংবাদের শিরোনাম এখানে দেখাবে...</a></h4>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        : gridArticles.map((article) => (
                                            <GridItem key={article.id} article={article} categoryName={categoryName} />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* END OF /. POST BLOCK SECTION */}

                <div className="container">
                    <div className="row row-m">
                        {/* START MAIN CONTENT */}
                        <div className="col-sm-7 col-md-8 col-p main-content">
                            <StickyBox>
                                <div className="post-inner categoty-style-1">
                                    <div className="post-body">
                                        <div className="row row-m">
                                            {loading
                                                ? SKELETON_ARTICLES.map((_, i) => (
                                                    <div className="col-md-6 col-p" key={i}>
                                                        <ArticleSkeleton />
                                                    </div>
                                                ))
                                                : mainArticles.length === 0 && articles.length === 0
                                                    ? (
                                                        <div className="col-12 text-center py-5">
                                                            <p>এই বিভাগে কোনো সংবাদ পাওয়া যায়নি।</p>
                                                        </div>
                                                    )
                                                    : mainArticles.map((article) => (
                                                        <div className="col-md-6 col-p" key={article.id}>
                                                            <ArticleCard article={article} categoryName={categoryName} />
                                                        </div>
                                                    ))
                                            }
                                        </div>
                                        {/* Pagination */}
                                        {pagination && (
                                            <Pagination
                                                currentPage={pagination.page}
                                                totalPages={pagination.pageCount}
                                                basePath={`/category/${slug}`}
                                            />
                                        )}
                                    </div>
                                </div>
                            </StickyBox>
                        </div>
                        {/* END OF /. MAIN CONTENT */}

                        {/* START SIDE CONTENT */}
                        <div className="col-sm-5 col-md-4 col-p rightSidebar">
                            <StickyBox>
                                {/* SOCIAL COUNTER */}
                                <div className="align-items-center d-flex fs-6 justify-content-center mb-1 text-center social-counter-total">
                                    <i className="fa-solid fa-heart text-primary me-1" /> Join{" "}
                                    <span className="fw-bold mx-1">
                                        {globalSettings?.socialTotalFollowers ? parseFloat(globalSettings.socialTotalFollowers / 1000000).toFixed(1) + 'M' : '2.5M'}
                                    </span> Followers
                                </div>
                                {/* SOCIAL ICONS */}
                                <div className="social-media-inner mb-2">
                                    <ul className="g-1 row social-media">
                                        <li className="col-4">
                                            <a href={globalSettings?.socialRssUrl || '#'} className="rss" target="_blank" rel="noopener noreferrer">
                                                <i className="fas fa-rss" />
                                                <div>{globalSettings?.socialRssSubscribers || '0'}</div>
                                                <p>Subscribers</p>
                                            </a>
                                        </li>
                                        <li className="col-4">
                                            <a href={globalSettings?.socialFacebookUrl || '#'} className="fb" target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-facebook-f" />
                                                <div>{globalSettings?.socialFacebookFans || '0'}</div>
                                                <p>Fans</p>
                                            </a>
                                        </li>
                                        <li className="col-4">
                                            <a href={globalSettings?.socialInstagramUrl || '#'} className="insta" target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-instagram" />
                                                <div>{globalSettings?.socialInstagramFollowers || '0'}</div>
                                                <p>Followers</p>
                                            </a>
                                        </li>
                                        <li className="col-4">
                                            <a href={globalSettings?.socialYoutubeUrl || '#'} className="you_tube" target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-youtube" />
                                                <div>{globalSettings?.socialYoutubeSubscribers || '0'}</div>
                                                <p>Subscribers</p>
                                            </a>
                                        </li>
                                        <li className="col-4">
                                            <a href={globalSettings?.socialTwitterUrl || '#'} className="twitter" target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-twitter" />
                                                <div>{globalSettings?.socialTwitterFollowers || '0'}</div>
                                                <p>Followers</p>
                                            </a>
                                        </li>
                                        <li className="col-4">
                                            <a href={globalSettings?.socialPinterestUrl || '#'} className="pint" target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-pinterest-p" />
                                                <div>{globalSettings?.socialPinterestFollowers || '0'}</div>
                                                <p>Followers</p>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                {/* ADVERTISEMENT */}
                                <div className="add-inner">
                                    <ImageWithFallback
                                        src={getStrapiMedia(featuredImage, '/default.jpg')}
                                        className="img-fluid"
                                        alt={categoryName}
                                        width={300}
                                        height={250}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </div>
                                {/* NAV TABS */}
                                <div className="tabs-wrapper">
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link border-0 active"
                                                id="most-viewed"
                                                data-bs-toggle="tab"
                                                data-bs-target="#most-viewed-pane"
                                                type="button"
                                                role="tab"
                                                aria-controls="most-viewed-pane"
                                                aria-selected="true"
                                            >
                                                সর্বাধিক দেখা
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link border-0"
                                                id="popular-news"
                                                data-bs-toggle="tab"
                                                data-bs-target="#popular-news-pane"
                                                type="button"
                                                role="tab"
                                                aria-controls="popular-news-pane"
                                                aria-selected="false"
                                            >
                                                জনপ্রিয় সংবাদ
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="tab-content" id="myTabContent">
                                        {/* Most Viewed Tab */}
                                        <div
                                            className="tab-pane fade show active"
                                            id="most-viewed-pane"
                                            role="tabpanel"
                                            aria-labelledby="most-viewed"
                                            tabIndex={0}
                                        >
                                            <div className="most-viewed">
                                                <ul id="most-today" className="content tabs-content">
                                                    {loading
                                                        ? Array.from({ length: 5 }, (_, i) => (
                                                            <li key={i}>
                                                                <span className="count">{String(i + 1).padStart(2, '0')}</span>
                                                                <span className="text"><a href="#">লোড হচ্ছে: সংবাদের শিরোনাম এখানে দেখাবে...</a></span>
                                                            </li>
                                                        ))
                                                        : mostViewed.map((article, i) => {
                                                            const a = getAttr(article);
                                                            const s = a.slug || article?.id || '#';
                                                            return (
                                                                <li key={article.id}>
                                                                    <span className="count">{String(i + 1).padStart(2, '0')}</span>
                                                                    <span className="text">
                                                                        <Link href={`/article/${s}`}>{a.title}</Link>
                                                                    </span>
                                                                </li>
                                                            );
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        {/* Popular News Tab */}
                                        <div
                                            className="tab-pane fade"
                                            id="popular-news-pane"
                                            role="tabpanel"
                                            aria-labelledby="popular-news"
                                            tabIndex={0}
                                        >
                                            <div className="popular-news">
                                                {loading
                                                    ? Array.from({ length: 3 }, (_, i) => (
                                                        <div className="p-post" key={i}>
                                                            <h4><a href="#">লোড হচ্ছে: সংবাদের শিরোনাম এখানে দেখাবে...</a></h4>
                                                            <ul className="authar-info d-flex flex-wrap justify-content-center">
                                                                <li className="date"><a href="#"><i className="ti ti-timer" /> লোডিং...</a></li>
                                                            </ul>
                                                            <div className="reatting-2">
                                                                <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" />
                                                                <i className="fas fa-star-half-alt" /><i className="far fa-star" />
                                                            </div>
                                                        </div>
                                                    ))
                                                    : popularNews.map((article) => {
                                                        const a = getAttr(article);
                                                        const s = a.slug || article?.id || '#';
                                                        const date = formatDate(a.publishedAt || a.createdAt);
                                                        return (
                                                            <div className="p-post" key={article.id}>
                                                                <h4><Link href={`/article/${s}`}>{a.title}</Link></h4>
                                                                <ul className="authar-info d-flex flex-wrap justify-content-center">
                                                                    {date && (
                                                                        <li className="date">
                                                                            <a href="#"><i className="ti ti-timer" /> {date}</a>
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                                <div className="reatting-2">
                                                                    <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" />
                                                                    <i className="fas fa-star-half-alt" /><i className="far fa-star" />
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* END OF /. NAV TABS */}
                            </StickyBox>
                        </div>
                        {/* END OF /. SIDE CONTENT */}
                    </div>
                </div>
            </main>
            {/* *** END OF /. PAGE MAIN CONTENT *** */}
        </Layout>
    );
};

export default CategoryPage;
