"use client"
import StickyBox from "react-sticky-box";
import './globals.css'
import NewsTicker from "@/components/ltr/news-ticker-carousal/page";
import SunnyWeather from "@/components/ltr/sunny-wether/sunny-weather";
import { useBackgroundImageLoader } from "@/components/ltr/use-background-image/use-background-image";
import Layout from "@/components/ltr/layout/layout";
import YoutubeVideo from "@/components/ltr/youtube-video/youtube-video";
import useRemoveBodyClass from "@/components/ltr/useEffect-hook/useEffect-hook";
import DatePickerComponents from "@/components/ltr/date-picker/date-picker";
import PollWidget from "@/components/ltr/poll-widget/poll";
import HomeFeatureCarousal from "@/components/ltr/home-feature-carousal/home-feature-carousal";
import HomeCenterSlider from "@/components/ltr/home-center-slider/home-center-slider";
import Tags from "@/components/ltr/tags/tags";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getFeaturedArticles, getPopularArticles, getTrendingNews, getLatestArticles, getReviewArticles, getArticlesByCategory, getEditorPicks } from "@/services/articleService";
import { getYoutubeVideos, getActivePoll } from "@/services/mediaService";
import { getGlobalSettings, getTags } from "@/services/globalService";
import { getStrapiMedia, formatDate, toBengaliNumber } from "@/lib/strapi";

// Helper: get article data (supports both v4 and v5)
// Helper: get article data (supports both v4 and v5)
const getArt = (article) => {
  const d = article?.attributes || article || {};
  return {
    title: d.title || '',
    slug: d.slug || '#',
    image: getStrapiMedia(d.cover),
    category: d.category?.data?.attributes?.name || d.category?.name || 'সংবাদ',
    author: d.author?.data?.attributes?.name || d.author?.name || 'সম্পাদক',
    date: d.createdAt || d.publishedAt || new Date().toISOString(),
    excerpt: d.excerpt || '',
    id: article?.id || 0,
  };
};

const fmtDate = (dateStr) => {
  if (!dateStr) return '';
  // Use the centralized formatDate which enforces Bengali numerals
  return formatDate(dateStr, 'bn');
};

// ... (rest of page component)
export default function Home() {
  const locale = 'bn';
  
  // Dummy data for loading state
  // Dummy data for loading state
  const dummyArticles = Array(12).fill({
    title: 'লোড হচ্ছে: সংবাদের শিরোনাম এখানে দেখাবে...',
    excerpt: 'সংবাদের বিস্তারিত বিবরণ এখানে লোড হবে। অনুগ্রহ করে অপেক্ষা করুন...',
    slug: '#',
    category: { data: { attributes: { name: 'ক্যাটাগরি' } } },
    author: { name: 'লোডিং...' },
    cover: null, // Set null to trigger getStrapiMedia fallback to '/default.jpg'
    createdAt: new Date().toISOString(),
    id: 'dummy'
  }).map((item, i) => ({ ...item, id: `dummy-${i}` }));

  // State untuk menyimpan data dari API
  const [featured, setFeatured] = useState([]);
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [youtubeData, setYoutubeData] = useState([]);
  const [pollData, setPollData] = useState(null);
  const [globalSettings, setGlobalSettings] = useState(null);
  const [tags, setTags] = useState([]);
  const [techArticles, setTechArticles] = useState([]);
  const [editorPicks, setEditorPicks] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const displayFeatured = loading ? dummyArticles : featured;
  const displayPopular = loading ? dummyArticles : popular;
  const displayTrending = loading ? dummyArticles : trending;
  const displayLatest = loading ? dummyArticles : latest;
  const displayTech = loading ? dummyArticles : techArticles;
  const displayEditor = loading ? dummyArticles : editorPicks;
  const displayReviews = loading ? dummyArticles : latestReviews;

  const handlePageChange = async (page) => {
    if (page < 1 || page > totalPages) return;
    setLoading(true); // Optional: show loading indicator specifically for this section
    try {
      const res = await getLatestArticles(page, 20, locale);
      
      if (res && res.data) {
        setLatest(res.data);
        setCurrentPage(page);
      }
      
      // Scroll to the latest articles section if needed
      const element = document.getElementById('latest-articles');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error changing page:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Remove RTL direction
    document.documentElement.removeAttribute('dir', 'rtl');
    
    // Fetch data dari API
    async function fetchData() {
      try {


        const [featuredRes, popularRes, trendingRes, latestRes, youtubeRes, pollRes, globalRes, tagsRes, techRes, editorRes, reviewRes] = await Promise.allSettled([
          getFeaturedArticles(10, locale),
          getPopularArticles(10, locale),
          getTrendingNews(15, locale),
          getLatestArticles(1, 20, locale),
          getYoutubeVideos(locale),
          getActivePoll(locale),
          getGlobalSettings(locale),
          getTags(10, locale),
          getArticlesByCategory('technology', 4, locale),
          getEditorPicks(5, locale),
          getReviewArticles(7, locale),
        ]);

        setFeatured(featuredRes.value?.data || []);
        setPopular(popularRes.value?.data || []);
        setTrending(trendingRes.value?.data || []);
        setLatest(latestRes.value?.data || []);
        setTotalPages(latestRes.value?.meta?.pagination?.pageCount || 1);
        setYoutubeData(youtubeRes.value?.data || []);
        setPollData(pollRes.value?.data?.[0] || null); // Poll returns array, take first
        setGlobalSettings(globalRes.value || null);
        setTags(tagsRes.value?.data || []);
        setTechArticles(techRes.value?.data || []);
        setEditorPicks(editorRes.value?.data || []);
        setLatestReviews(reviewRes.value?.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  {/* *** ADD AND REMOVE CLASS ON BODY TAG *** */ }
  useRemoveBodyClass(['home-nine'], ['home-six', 'home-seven', 'home-two', 'boxed-layout', 'layout-rtl']);
  {/* *** IMPORT BACKGROUND IMAGE *** */ }
  useBackgroundImageLoader()
  return (
    <Layout>
      {/* *** START PAGE MAIN CONTENT *** */}
      <main className="page_main_wrapper">
        {/* START NEWSTRICKER */}
        <NewsTicker data={trending} isLoading={loading} />
        {/*  END OF /. NEWSTRICKER */}
        {/* START FEATURE SECTION */}
        <div
          className="bg-img feature-section py-4 py-lg-3 py-xl-4"
          data-image-src="/default.jpg"
        >
          <div className="container">
            <HomeFeatureCarousal data={featured} isLoading={loading} />
          </div>
        </div>
        {/* END OF /. FEATURE SECTION */}
        {/* START POST BLOCK SECTION */}
        <section className="slider-inner">
          <div className="container-fluid p-0">
            <div className="row thm-margin">
              <div className="col-md-4 col-xxl-4 thm-padding d-md-none d-xxl-block">
                <div className="row slider-right-post thm-margin">
                  {(displayFeatured.length > 0 ? displayFeatured.slice(0, 2) : []).map((article, i) => {
                    const a = getArt(article);
                    const heights = ['post-height-4', 'post-height-4'];
                    return (
                      <div key={a.id || `left-${i}`} className={`${i < 2 ? 'col-6 col-sm-6' : 'col-md-12 col-sm-12 d-md-block d-none'} thm-padding`}>
                        <div className={`slider-post ${heights[i] || 'post-height-4'}`}>
                          <Link href={a.slug !== '#' ? `/bn/article/${a.slug}` : '#'} className="news-image">
                            <img src={a.image} alt={a.title} className="img-fluid" onError={(e) => e.target.src = '/default.jpg'} />
                          </Link>
                          <div className="post-text">
                            <span className="post-category">{a.category}</span>
                            <h4>
                              <Link href={a.slug !== '#' ? `/bn/article/${a.slug}` : '#'}>{a.title || 'লোড হচ্ছে...'}</Link>
                            </h4>
                            <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                              <li>By <span className="editor-name">{a.author}</span></li>
                              <li>{fmtDate(a.date)}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {displayFeatured.length > 2 && (() => {
                    const a = getArt(displayFeatured[2]);
                    return (
                      <div className="col-md-12 col-sm-12 d-md-block d-none thm-padding">
                        <div className="slider-post post-height-4">
                          <Link href={`/bn/article/${a.slug}`} className="news-image">
                            <img src={a.image} alt={a.title} className="img-fluid" onError={(e) => e.target.src = '/default.jpg'} />
                          </Link>
                          <div className="post-text">
                            <span className="post-category">{a.category}</span>
                            <h4><Link href={`/bn/article/${a.slug}`}>{a.title}</Link></h4>
                            <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                              <li>By <span className="editor-name">{a.author}</span></li>
                              <li>{fmtDate(a.date)}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div className="col-md-6 col-xxl-4 thm-padding">
                <div className="slider-wrapper">
                  <HomeCenterSlider data={displayPopular} isLoading={loading} />
                </div>
              </div>
              <div className="col-md-6 col-xxl-4 thm-padding">
                <div className="row slider-right-post thm-margin">
                  {(displayLatest.length > 0 ? displayLatest.slice(0, 3) : []).map((article, i) => {
                    const a = getArt(article);
                    return (
                      <div key={a.id || `right-${i}`} className={`${i === 0 ? 'col-md-12 col-sm-12 d-md-block d-none' : 'col-6 col-sm-6'} thm-padding`}>
                        <div className={`slider-post ${i === 0 ? 'post-height-2' : 'post-height-2'}`}>
                          <Link href={`/bn/article/${a.slug}`} className="news-image">
                            <img src={a.image} alt={a.title} className="img-fluid" onError={(e) => e.target.src = '/default.jpg'} />
                          </Link>
                          <div className="post-text">
                            <span className="post-category">{a.category}</span>
                            <h4><Link href={`/bn/article/${a.slug}`}>{a.title}</Link></h4>
                            <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                              <li>By <span className="editor-name">{a.author}</span></li>
                              <li>{fmtDate(a.date)}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END OF /. POST BLOCK SECTION */}
        <div className="container">
          <div className="row gx-lg-5">
            {/* START MAIN CONTENT */}
            <div className="col-md-3 leftSidebar d-none d-xl-block">
              <StickyBox >
                <div className="panel_header">
                  <h4>
                    <strong>শীর্ষ </strong> সংবাদ
                  </h4>
                </div>
                <div className="border-bottom posts">
                  <ul>
                    {(displayTrending.length > 0 ? displayTrending.slice(0, 3) : []).map((article, i) => {
                      const a = getArt(article);
                      return (
                        <li key={a.id || `ts-${i}`} className={`${i === 2 ? 'd-none d-xl-block ' : ''}post-grid`}>
                          <div className="posts-inner px-0">
                            <h6 className="posts-title">
                              <Link href={`/bn/article/${a.slug}`}>{a.title}</Link>
                            </h6>
                            <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                              <li><span className="post-category">{a.category}</span></li>
                              <li>{fmtDate(a.date)}</li>
                            </ul>
                            <p>{a.excerpt}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {/* START NAV TABS */}
                <div className="tabs-wrapper">
                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button className="nav-link border-0 active" id="most-viewed" data-bs-toggle="tab" data-bs-target="#most-viewed-pane" type="button" role="tab" aria-controls="most-viewed-pane" aria-selected="true">
                        সর্বাধিক পঠিত
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="nav-link border-0" id="popular-news" data-bs-toggle="tab" data-bs-target="#popular-news-pane" type="button" role="tab" aria-controls="popular-news-pane" aria-selected="false">
                        জনপ্রিয় সংবাদ
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="most-viewed-pane" role="tabpanel" aria-labelledby="most-viewed" tabIndex={0}>
                      <div className="most-viewed">
                        <ul id="most-today" className="content tabs-content">
                          {(displayPopular.length > 0 ? displayPopular.slice(0, 5) : []).map((article, i) => {
                            const a = getArt(article);
                            return (
                              <li key={a.id || `mv-${i}`}>
                                <span className="count">{String(i + 1).padStart(2, '0')}</span>
                                <span className="text">
                                  <Link href={`/bn/article/${a.slug}`}>{a.title}</Link>
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="popular-news-pane" role="tabpanel" aria-labelledby="popular-news" tabIndex={0}>
                      <div className="popular-news">
                        {(displayPopular.length > 0 ? displayPopular.slice(5, 8) : []).map((article, i) => {
                          const a = getArt(article);
                          return (
                            <div key={a.id || `pn-${i}`} className="p-post">
                              <h4><Link href={`/bn/article/${a.slug}`}>{a.title}</Link></h4>
                              <ul className="authar-info d-flex flex-wrap justify-content-center">
                                <li className="date"><i className="ti ti ti-timer" /> {fmtDate(a.date)}</li>
                              </ul>
                              <div className="reatting-2">
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="fas fa-star-half-alt" />
                                <i className="far fa-star" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                {/* END OF /. NAV TABS */}
              </StickyBox>
            </div>
            <div className="col-sm-7 col-md-8 col-xl-6 border-start border-end main-content">
              <StickyBox>
                {/* START POST CATEGORY STYLE ONE (Popular news) */}
                <div className="post-inner">
                  {/* post body */}
                  <div className="post-body py-0">
                    {displayPopular.length > 0 && (() => {
                      const a = getArt(displayPopular[0]);
                      return (
                        <article>
                          <figure>
                            <Link href={`/bn/article/${a.slug}`}>
                              <img src={a.image} width={345} alt={a.title} className="img-fluid" onError={(e) => e.target.src = '/default.jpg'} />
                            </Link>
                          </figure>
                          <div className="post-info">
                            <h3 className="fs-4"><Link href={`/bn/article/${a.slug}`}>{a.title}</Link></h3>
                            <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                              <li><span className="post-category mb-0">{a.category}</span></li>
                              <li>By <span className="editor-name">{a.author}</span></li>
                              <li>{fmtDate(a.date)}</li>
                            </ul>
                            <p>{a.excerpt}</p>
                          </div>
                        </article>
                      );
                    })()}
                  </div>
                </div>
                {/* END OF /. POST CATEGORY STYLE ONE (Popular news) */}
                <div className="news-grid-2 border-top pt-4 mb-4">
                  <div className="row gx-3 gx-lg-4 gy-4">
                    {(displayLatest.length > 3 ? displayLatest.slice(3, 9) : []).map((article, i) => {
                      const a = getArt(article);
                      const icons = ['fa-play', 'fa-camera', 'fa-camera', 'fa-play', 'fa-camera', 'fa-camera'];
                      return (
                        <div key={a.id || `grid-${i}`} className="col-6 col-md-4 col-sm-6">
                          <div className="grid-item mb-0">
                            <div className="grid-item-img">
                              <Link href={`/bn/article/${a.slug}`}>
                                <img src={a.image} className="img-fluid" alt={a.title} onError={(e) => e.target.src = '/default.jpg'} />
                                <div className="link-icon"><i className={`fa ${icons[i] || 'fa-camera'}`} /></div>
                              </Link>
                            </div>
                            <h5><Link href={`/bn/article/${a.slug}`} className="title">{a.title}</Link></h5>
                            <ul className="align-items-center authar-info d-flex flex-wrap gap-1 mb-0">
                              <li>{fmtDate(a.date)}</li>
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* START ADVERTISEMENT */}
                <div className="add-inner">
                  <img
                    src="/default.jpg"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                {/* END OF /. ADVERTISEMENT */}
              </StickyBox>
            </div>
            {/* END OF /. MAIN CONTENT */}
            {/* START SIDE CONTENT */}
            <div className="col-sm-5 col-md-4 col-xl-3 rightSidebar">
              <StickyBox>
                {/* START SOCIAL COUNTER TEXT */}
                <div className="align-items-center d-flex fs-6 justify-content-center mb-1 text-center social-counter-total">
                  <i className="fa-solid fa-heart text-primary me-1" /> যোগ দিন{" "}
                  <span className="fw-bold mx-1">{globalSettings?.socialTotalFollowers || '0'}</span> অনুসরণকারী
                </div>
                {/* END OF /. SOCIAL COUNTER TEXT */}
                {/* START SOCIAL ICON */}
                <div className="social-media-inner">
                  <ul className="g-1 row social-media">
                    <li className="col-4">
                      <a href={globalSettings?.socialRssUrl || '#'} className="rss" target="_blank">
                        <i className="fas fa-rss" />
                        <div>{globalSettings?.socialRssSubscribers || 0}</div>
                        <p>Subscribers</p>
                      </a>
                    </li>
                    <li className="col-4">
                      <a href={globalSettings?.socialFacebookUrl || '#'} className="fb" target="_blank">
                        <i className="fab fa-facebook-f" />
                        <div>{globalSettings?.socialFacebookFans || 0}</div>
                        <p>Fans</p>
                      </a>
                    </li>
                    <li className="col-4">
                      <a href={globalSettings?.socialInstagramUrl || '#'} className="insta" target="_blank">
                        <i className="fab fa-instagram" />
                        <div>{globalSettings?.socialInstagramFollowers || 0}</div>
                        <p>Followers</p>
                      </a>
                    </li>
                    <li className="col-4">
                      <a href={globalSettings?.socialYoutubeUrl || '#'} className="you_tube" target="_blank">
                        <i className="fab fa-youtube" />
                        <div>{globalSettings?.socialYoutubeSubscribers || 0}</div>
                        <p>Subscribers</p>
                      </a>
                    </li>
                    <li className="col-4">
                      <a href={globalSettings?.socialTwitterUrl || '#'} className="twitter" target="_blank">
                        <i className="fab fa-twitter" />
                        <div>{globalSettings?.socialTwitterFollowers || 0}</div>
                        <p>Followers</p>
                      </a>
                    </li>
                    <li className="col-4">
                      <a href={globalSettings?.socialPinterestUrl || '#'} className="pint" target="_blank">
                        <i className="fab fa-pinterest-p" />
                        <div>{globalSettings?.socialPinterestFollowers || 0}</div>
                        <p>Followers</p>
                      </a>
                    </li>
                  </ul>{" "}
                  {/* /.social icon */}
                </div>
                {/* END OF /. SOCIAL ICON */}
                {/* START TRENDING TOPICS */}
                <div className="panel_inner review-inner">
                  <div className="panel_header">
                    <h4><strong>ট্রেন্ডিং</strong> বিষয়</h4>
                  </div>
                  <div className="panel_body">
                    {(displayTrending.length > 3 ? displayTrending.slice(3, 8) : []).map((article, i) => {
                      const a = getArt(article);
                      return (
                        <div key={a.id || `tt-${i}`} className="text-center mb-2 card-bg-scale position-relative overflow-hidden bg-dark-overlay bg-img p-3" data-image-src={a.image || '/default.jpg'}>
                          <Link href={`/bn/article/${a.slug}`} className="btn-link fs-5 fw-bold stretched-link text-decoration-none text-white">
                            {a.category}
                          </Link>
                        </div>
                      );
                    })}
                    <div className="text-center mt-3">
                      <Link href="#" className="fw-bold text-primary-hover"><u>সব বিভাগ দেখুন</u></Link>
                    </div>
                  </div>
                </div>
                {/* END OF /. TRENDING TOPICS */}
                {/* START LATEST REVIEWS */}
                <div className="panel_inner review-inner">
                  <div className="panel_header">
                    <h4><strong>সাম্প্রতিক</strong> পর্যালোচনা</h4>
                  </div>
                  <div className="panel_body">
                  <div className="panel_body">
                    {displayReviews.length > 0 && (() => {
                      const a = getArt(displayReviews[0]);
                      return (
                        <div className="more-post">
                          <Link href={a.slug !== '#' ? `/bn/article/${a.slug}` : '#'} className="news-image">
                            <img src={a.image} alt={a.title} className="img-fluid w-100" onError={(e) => e.target.src = '/default.jpg'} />
                          </Link>
                          <div className="reatting">
                            <i className="fa fa-star" /><i className="fa fa-star" /><i className="fa fa-star" /><i className="fa fa-star-half-o" /><i className="fa fa-star-o" />
                          </div>
                          <div className="post-text">
                            <ul className="align-items-center authar-info d-flex flex-wrap gap-1 mb-1">
                              <li><span className="post-category mb-0">{a.category}</span></li>
                              <li>{fmtDate(a.date)}</li>
                            </ul>
                            <h4 className="mb-0">{a.title}</h4>
                          </div>
                        </div>
                      );
                    })()}
                    <div className="mt-4 news-list">
                      {(displayReviews.length > 1 ? displayReviews.slice(1, 4) : []).map((article, i) => {
                        const a = getArt(article);
                        return (
                          <div key={a.id || `rv-${i}`} className={`news-list-item p-0 ${i < 2 ? 'mb-4' : ''}`}>
                            <div className="img-wrapper">
                              <Link href={a.slug !== '#' ? `/bn/article/${a.slug}` : '#'} className="thumb">
                                <img src={a.image} alt={a.title} className="img-fluid" onError={(e) => e.target.src = '/default.jpg'} />
                                <div className="link-icon"><i className={`fa ${i % 2 === 0 ? 'fa-camera' : 'fa-play'}`} /></div>
                              </Link>
                            </div>
                            <div className="post-info-2">
                              <h5><Link href={a.slug !== '#' ? `/bn/article/${a.slug}` : '#'} className="title">{a.title}</Link></h5>
                              <div className="reviews-reatting">
                                <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star-half-alt" /><i className="far fa-star" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  </div>
                </div>
                {/* END OF /. LATEST REVIEWS */}
              </StickyBox>
            </div>
            {/* END OF /. SIDE CONTENT */}
          </div>
        </div>
        {/* START YOUTUBE VIDEO */}
        <div className="mb-4 py-5 position-relative video-section">
          <div className="container">
            <div className="row justify-content-center mb-5">
              <div className="col-md-6 text-center">
                <h3 className="text-white">সর্বশেষ ভিডিও সংবাদ</h3>
                <p className="text-white mb-0">
                  সাম্প্রতিক ঘটনাবলী ও গুরুত্বপূর্ণ সংবাদের ভিডিও দেখুন।
                </p>
              </div>
            </div>
            <YoutubeVideo data={youtubeData} isLoading={loading} />
          </div>
        </div>
        {/* END OF /. YOUTUBE VIDEO */}
        <section className="articles-wrapper">
          <div className="container">
            <div className="row gx-lg-5">
              <div className="col-md-3 leftSidebar d-none d-xl-block">
                <StickyBox>
                  {/* START TECH & INNOVATION */}
                  <div className="panel_inner">
                    <div className="panel_header">
                      <h4><strong>প্রযুক্তি ও</strong> উদ্ভাবন</h4>
                    </div>
                    <div className="panel_body">
                      {displayTech.length > 0 && (() => {
                        const a = getArt(displayTech[0]);
                        return (
                          <div className="border-bottom">
                            <Link href={a.slug !== '#' ? `/bn/article/${a.slug}` : '#'} className="d-block mb-3">
                              <img src={a.image} alt={a.title} className="img-fluid w-100" onError={(e) => e.target.src = '/default.jpg'} />
                            </Link>
                            <h5><Link href={a.slug !== '#' ? `/bn/article/${a.slug}` : '#'}>{a.title}</Link></h5>
                            <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                              <li><span className="post-category mb-0">{a.category}</span></li>
                              <li>{fmtDate(a.date)}</li>
                            </ul>
                            <p>{a.excerpt}</p>
                          </div>
                        );
                      })()}
                      {(displayTech.length > 1 ? displayTech.slice(1, 4) : []).map((article, i) => {
                        const a = getArt(article);
                        return (
                          <div key={a.id || `tech-${i}`} className={`${i < 2 ? 'border-bottom ' : ''}${i === 2 ? 'pb-0 ' : ''}py-3`}>
                            <h6 className="posts-title"><Link href={a.slug !== '#' ? `/bn/article/${a.slug}` : '#'}>{a.title}</Link></h6>
                            <ul className="align-items-center authar-info d-flex flex-wrap gap-1 mb-0">
                              <li>{fmtDate(a.date)}</li>
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* END OF /. TECH & INNOVATION */}
                  {/* START EDITOR'S PICKS */}
                  <div className="panel_inner mb-0">
                    <div className="panel_header">
                      <h4><strong>সম্পাদকের</strong> পছন্দ</h4>
                    </div>
                    <div className="panel_body">
                      {displayEditor.length > 0 && (() => {
                        const a = getArt(displayEditor[0]);
                        return (
                          <div className="border-bottom">
                            <Link href={a.slug !== '#' ? `/bn/article/${a.slug}` : '#'} className="d-block mb-3">
                              <img src={a.image} alt={a.title} className="img-fluid" onError={(e) => e.target.src = '/default.jpg'} />
                            </Link>
                            <h5><Link href={a.slug !== '#' ? `/bn/article/${a.slug}` : '#'}>{a.title}</Link></h5>
                            <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                              <li><span className="post-category mb-0">{a.category}</span></li>
                              <li>{fmtDate(a.date)}</li>
                            </ul>
                            <p>{a.excerpt}</p>
                          </div>
                        );
                      })()}
                      {(displayEditor.length > 1 ? displayEditor.slice(1, 4) : []).map((article, i) => {
                        const a = getArt(article);
                        return (
                          <div key={a.id || `ep-${i}`} className={`${i < 2 ? 'border-bottom ' : ''}${i === 2 ? 'pb-0 ' : ''}py-3`}>
                            <h6 className="posts-title"><Link href={a.slug !== '#' ? `/bn/article/${a.slug}` : '#'}>{a.title}</Link></h6>
                            <ul className="align-items-center authar-info d-flex flex-wrap gap-1 mb-0">
                              <li>{fmtDate(a.date)}</li>
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* END OF /. EDITOR'S PICKS */}
                </StickyBox>
              </div>
              <div className="col-sm-7 col-md-8 col-xl-6 border-start border-end main-content">
                <StickyBox>
                  {/* START POST CATEGORY STYLE FOUR (Latest articles ) */}
                  <div className="post-inner">
                    {/*post header*/}
                    <div className="post-head">
                      <h2 className="title">
                        <strong>সাম্প্রতিক</strong> নিবন্ধ
                      </h2>
                    </div>
                    {/* post body */}
                    <div className="post-body">
                      {(displayLatest.length > 0 ? displayLatest.slice(0, 5) : []).map((article, i) => {
                        const a = getArt(article);
                        return (
                          <div key={a.id || `la-${i}`} className="news-list-item articles-list">
                            <div className="img-wrapper">
                              <div className="align-items-center bg-primary d-flex justify-content-center position-absolute rounded-circle text-white trending-post z-1">
                                <i className="fa-solid fa-bolt-lightning" />
                              </div>
                              <Link href={`/bn/article/${a.slug}`} className="thumb">
                                <img src={a.image} alt={a.title} className="img-fluid w-100" onError={(e) => e.target.src = '/default.jpg'} />
                              </Link>
                            </div>
                            <div className="post-info-2">
                              <h4><Link href={`/bn/article/${a.slug}`} className="title">{a.title}</Link></h4>
                              <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                                <li><span className="post-category mb-0">{a.category}</span></li>
                                <li>By <span className="editor-name">{a.author}</span></li>
                                <li>{fmtDate(a.date)}</li>
                              </ul>
                              <p className="d-lg-block d-none">{a.excerpt}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>{" "}
                    {/* /. post body */}
                    {/*Post footer*/}
                    <div className="post-footer">
                      <div className="row thm-margin">
                        <div className="col-md-8 thm-padding">
                          {/* pagination */}
                          {totalPages > 1 && (
                            <ul className="pagination">
                              <li className={`${currentPage === 1 ? 'disabled' : ''}`}>
                                {currentPage === 1 ? (
                                  <span className="ti ti-angle-left" />
                                ) : (
                                  <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}>
                                    <span className="ti ti-angle-left" />
                                  </a>
                                )}
                              </li>
                              
                              {(() => {
                                const pages = [];
                                const maxVisible = 5;
                                
                                if (totalPages <= maxVisible + 1) {
                                  for (let i = 1; i <= totalPages; i++) {
                                    pages.push(i);
                                  }
                                } else {
                                  let startPage, endPage;
                                  
                                  if (currentPage <= 3) {
                                    startPage = 1;
                                    endPage = 5;
                                  } else if (currentPage >= totalPages - 2) {
                                    startPage = totalPages - 4;
                                    endPage = totalPages;
                                  } else {
                                    startPage = currentPage - 2;
                                    endPage = currentPage + 2;
                                  }
                                  
                                  if (startPage < 1) { startPage = 1; endPage = 5; }
                                  if (endPage > totalPages) { endPage = totalPages; startPage = totalPages - 4; }

                                  for (let i = startPage; i <= endPage; i++) {
                                    pages.push(i);
                                  }
                                  
                                  if (endPage < totalPages) {
                                     pages.push('...');
                                     pages.push(totalPages);
                                  }
                                }

                                return pages.map((page, index) => (
                                  <li key={index} className={`${currentPage === page ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
                                    {page === '...' ? (
                                      <span className="extend">...</span>
                                    ) : currentPage === page ? (
                                      <span>{page}</span>
                                    ) : (
                                      <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page); }}>
                                        {page}
                                      </a>
                                    )}
                                  </li>
                                ));
                              })()}

                              <li className={`${currentPage === totalPages ? 'disabled' : ''}`}>
                                {currentPage === totalPages ? (
                                  <span className="ti ti-angle-right" />
                                ) : (
                                  <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}>
                                    <i className="ti ti-angle-right" />
                                  </a>
                                )}
                              </li>
                            </ul>
                          )}{" "}
                          {/* /.pagination */}
                        </div>
                        <div className="col-md-4 d-md-block d-none thm-padding">
                          <div className="social">
                            <ul>
                              <li>
                                <div className="share transition">
                                  <a href="#" target="_blank" className="ico fb">
                                    <i className="fab fa-facebook-f" />
                                  </a>
                                  <a href="#" target="_blank" className="ico tw">
                                    <i className="fab fa-twitter" />
                                  </a>
                                  <a href="#" target="_blank" className="ico rs">
                                    <i className="fas fa-rss" />
                                  </a>
                                  <a href="#" target="_blank" className="ico pin">
                                    <i className="fab fa-pinterest-p" />
                                  </a>
                                  <i className="ti ti-share ico-share" />
                                </div>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="ti ti-heart" />
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="ti ti-twitter" />
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* /.Post footer*/}
                  </div>
                  {/* END OF /. POST CATEGORY STYLE FOUR (Latest articles ) */}
                  {/* START ADVERTISEMENT */}
                  <div className="add-inner mb-0">
                    <img
                      src="/default.jpg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  {/* END OF /. ADVERTISEMENT */}
                </StickyBox>
              </div>
              <div className="col-sm-5 col-md-4 col-xl-3 rightSidebar">
                <StickyBox>
                  {/* START WEATHER */}
                  <div className="weather-wrapper-2 weather-bg-2">
                    <div className="weather-temperature">
                      <div className="weather-now">
                        <span className="big-degrees">39</span>
                        <span className="circle">°</span>
                        <span className="weather-unit">C</span>
                      </div>
                      <div className="weather-icon-2">
                        <SunnyWeather />
                      </div>
                    </div>
                    <div className="weather-info">
                      <div className="weather-name">Partly Sunny</div>
                      <span>
                        Real Fell: 67 <sup>°</sup>
                      </span>
                      <span>Change of Rain</span>
                    </div>
                    <div className="weather-week-2">
                      <div className="weather-days">
                        <div className="day-0">Sun</div>
                        <div className="day-icon">
                          <i className="wi wi-day-sunny" />
                        </div>
                        <div className="day-degrees">
                          <span className="degrees-0">45</span>
                          <span className="td-circle">°</span>
                        </div>
                      </div>
                      <div className="weather-days">
                        <div className="day-1">Mon</div>
                        <div className="day-icon">
                          <i className="wi wi-day-cloudy-high" />
                        </div>
                        <div className="day-degrees">
                          <span className="degrees-1">21</span>
                          <span className="circle">°</span>
                        </div>
                      </div>
                      <div className="weather-days">
                        <div className="day-2">Tue</div>
                        <div className="day-icon">
                          <i className="wi wi-day-sleet" />
                        </div>
                        <div className="day-degrees">
                          <span className="degrees-2">29</span>
                          <span className="circle">°</span>
                        </div>
                      </div>
                      <div className="weather-days">
                        <div className="day-3">Wed</div>
                        <div className="day-icon">
                          <i className="wi wi-day-lightning" />
                        </div>
                        <div className="day-degrees">
                          <span className="degrees-3">19</span>
                          <span className="circle">°</span>
                        </div>
                      </div>
                      <div className="weather-days">
                        <div className="day-4">Thu</div>
                        <div className="day-icon">
                          <i className="wi wi-sleet" />
                        </div>
                        <div className="day-degrees">
                          <span className="degrees-4">54</span>
                          <span className="circle">°</span>
                        </div>
                      </div>
                      <div className="weather-days">
                        <div className="day-4">Fri</div>
                        <div className="day-icon">
                          <i className="wi wi-smog" />
                        </div>
                        <div className="day-degrees">
                          <span className="degrees-5">68</span>
                          <span className="circle">°</span>
                        </div>
                      </div>
                      <div className="weather-days">
                        <div className="day-4">Sat</div>
                        <div className="day-icon">
                          <i className="wi wi-lightning" />
                        </div>
                        <div className="day-degrees">
                          <span className="degrees-6">28</span>
                          <span className="circle">°</span>
                        </div>
                      </div>
                    </div>
                    <div className="weather-footer">
                      <div className="weather-date">{formatDate(new Date().toISOString(), 'bn')}</div>
                      <div className="weather-city">ঢাকা, বাংলাদেশ</div>
                    </div>
                  </div>
                  {/* END OF /. WEATHER */}
                  {/* START ADVERTISEMENT */}
                  <div className="add-inner">
                    <img
                      src="/default.jpg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  {/* END OF /. ADVERTISEMENT */}
                  {/* START ARCHIVE */}
                  <div className="archive-wrapper">
                    <DatePickerComponents />
                  </div>
                  {/* END OF /. ARCHIVE */}
                  {/* START POLL WIDGET */}
                  <PollWidget data={pollData} isLoading={loading} />
                  {/* END OF /. POLL WIDGET */}
                  {/* START TAGS */}
                  <Tags data={tags} isLoading={loading} />
                  {/* END OF /. TAGS */}
                </StickyBox>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* *** END OF /. PAGE MAIN CONTENT *** */}

    </Layout>

  )
}
