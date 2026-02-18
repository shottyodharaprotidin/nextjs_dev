"use client";

import Link from "next/link";
import StickyBox from "react-sticky-box";
import { getStrapiMedia, formatDate, toBengaliNumber } from '@/lib/strapi';
import { useTranslations } from '@/lib/translations';
import ImageWithFallback from "@/components/ui/ImageWithFallback";

const ArticleSidebar = ({ mostViewed, popularNews, globalSettings, locale = 'bn' }) => {
  const { t } = useTranslations(locale);

  return (
    <StickyBox offsetTop={100} offsetBottom={20}>
      {/* START ADVERTISEMENT */}
      <div className="add-inner">
        <img
          src="/assets/images/add/sidebar.jpg"
          className="img-fluid"
          alt=""
          onError={(e) => e.target.src = '/default.jpg'}
        />
      </div>
      {/* END OF /. ADVERTISEMENT */}
      
      {/* START SOCIAL COUNTER TEXT */}
      <div className="align-items-center d-flex fs-6 justify-content-center mb-1 text-center social-counter-total">
        <i className="fa-solid fa-heart text-primary me-1" /> {t('joinFollowers')}{" "}
        <span className="fw-bold mx-1">2.5M</span> {t('followers')}
      </div>
      {/* END OF /. SOCIAL COUNTER TEXT */}

      {/* START SOCIAL ICON */}
      <div className="social-media-inner mb-2">
        <ul className="g-1 row social-media">
          <li className="col-4">
            <Link href="#" className="rss">
              <i className="fas fa-rss" />
              <div>2,035</div>
              <p className="social-text">{t('subscribers')}</p>
            </Link>
          </li>
          <li className="col-4">
            <Link href="#" className="fb">
              <i className="fab fa-facebook-f" />
              <div>3,794</div>
              <p className="social-text">{t('fans')}</p>
            </Link>
          </li>
          <li className="col-4">
            <Link href="#" className="insta">
              <i className="fab fa-instagram" />
              <div>941</div>
              <p className="social-text">{t('followers')}</p>
            </Link>
          </li>
          <li className="col-4">
            <Link href="#" className="you_tube">
              <i className="fab fa-youtube" />
              <div>7,820</div>
              <p className="social-text">{t('subscribers')}</p>
            </Link>
          </li>
          <li className="col-4">
            <Link href="#" className="twitter">
              <i className="fab fa-twitter" />
              <div>1,562</div>
              <p className="social-text">{t('followers')}</p>
            </Link>
          </li>
          <li className="col-4">
            <Link href="#" className="pin">
              <i className="fab fa-pinterest-p" />
              <div>1,310</div>
              <p className="social-text">{t('followers')}</p>
            </Link>
          </li>
        </ul>
      </div>
      {/* END OF /. SOCIAL ICON */}

      {/* START NAV TABS */}
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
              {t('mostViewed')}
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
              {t('popular')}
            </button>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="most-viewed-pane"
            role="tabpanel"
            aria-labelledby="most-viewed"
            tabIndex="0"
          >
            <div className="most-viewed">
              <ul id="most-today" className="content tabs-content">
                {mostViewed && mostViewed.length > 0 ? (
                    mostViewed.slice(0, 5).map((item, index) => {
                        const data = item.attributes || item;
                        return (
                            <li key={index}>
                              <span className="count">0{index + 1}</span>
                              <span className="text">
                                <Link href={`/${locale === 'en' ? 'en/article' : 'article'}/${data.slug}${locale === 'bn' ? '-bn' : ''}`}>
                                  {data.title}
                                </Link>
                              </span>
                            </li>
                        );
                    })
                ) : (
                    <li>No most viewed articles</li>
                )}
              </ul>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="popular-news-pane"
            role="tabpanel"
            aria-labelledby="popular-news"
            tabIndex="0"
          >
            <div className="popular-news">
             {popularNews && popularNews.length > 0 ? (
                popularNews.slice(0, 5).map((item, index) => {
                    const data = item.attributes || item;
                    return (
                      <div className="p-post" key={index}>
                        <h4>
                          <Link href={`/${locale === 'en' ? 'en/article' : 'article'}/${data.slug}${locale === 'bn' ? '-bn' : ''}`}>
                            {data.title}
                          </Link>
                        </h4>
                        <ul className="authar-info d-flex flex-wrap justify-content-center">
                          <li className="date">
                            <Link href="#">
                              <p className="social-text">{t('subscribers')}</p> {formatDate(data.publishedAt, locale)}
                            </Link>
                          </li>
                          <li className="like">
                            <Link href="#">
                              <i className="ti ti-thumb-up" />
                              {data.likes || 0} likes
                            </Link>
                          </li>
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
                })
            ) : (
                <p>No popular news</p>
            )}
            </div>
          </div>
        </div>
      </div>
    </StickyBox>
  );
};

export default ArticleSidebar;
