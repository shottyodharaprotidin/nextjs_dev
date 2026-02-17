
import dynamic from "next/dynamic";
import Link from "next/link";
import { getStrapiMedia } from "@/lib/strapi";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import 'animate.css/animate.css'
import React from 'react';

if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}
// This is for Next.js. On Rect JS remove this line
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
  ssr: false,
});



const HomeFeatureCarousal = ({ data = [], isLoading = false }) => {
  // If loading, show placeholders
  if (isLoading) {
     const placeholders = [
      { id: 1, attributes: { title: 'Loading featured articles...', slug: '#', category: { data: { attributes: { name: 'News' } } }, cover: { data: { attributes: { url: '/default.jpg' } } } } },
      { id: 2, attributes: { title: 'Please wait...', slug: '#', category: { data: { attributes: { name: 'Sports' } } }, cover: { data: { attributes: { url: '/default.jpg' } } } } },
      { id: 3, attributes: { title: 'Loading content...', slug: '#', category: { data: { attributes: { name: 'Travel' } } }, cover: { data: { attributes: { url: '/default.jpg' } } } } },
      { id: 4, attributes: { title: 'Fetching data...', slug: '#', category: { data: { attributes: { name: 'Business' } } }, cover: { data: { attributes: { url: '/default.jpg' } } } } }
    ];
    
    return (
      <OwlCarousel className="owl-theme featured-carousel"
        loop={true}
        margin={10}
        nav={false}
        dots={false}
        responsive={{
          0: { items: 1, autoplay: true },
          576: { items: 2 },
          768: { items: 2.5 },
          992: { items: 3.5 },
          1200: { items: 4 }
        }}
      >
        {placeholders.map((article, index) => renderItem(article, index, true))}
      </OwlCarousel>
    );
  }

  // If not loading and no data, don't show anything
  if (data.length === 0) {
    return null;
  }
  
  return (
    <OwlCarousel className="owl-theme featured-carousel"
      loop={true}
      margin={10}
      nav={false}
      dots={false}
      responsive={{
        0: {
          items: 1,
          autoplay: true
        },
        576: {
          items: 2
        },
        768: {
          items: 2.5
        },
        992: {
          items: 3.5
        },
        1200: {
          items: 4
        }
      }}
    >
      {data.map((article, index) => renderItem(article, index))}
    </OwlCarousel>
  );
};

const renderItem = (article, index, isPlaceholder = false) => {
  const articleData = article.attributes || article;
  const imageUrl = getStrapiMedia(articleData.cover);
  const category = articleData.category?.data?.attributes?.name || articleData.category?.name || "সংবাদ";
  const slug = articleData.slug;
  const title = articleData.title;

  return (
    <div key={article.id || index} className="news-list-item">
      <div className="img-wrapper">
        <Link href={isPlaceholder ? '#' : `/bn/article/${slug}`} className="thumb">
          <img
            src={imageUrl}
            alt={title}
            className="img-fluid"
            onError={(e) => e.target.src = '/default.jpg'}
          />
          <div className="link-icon">
            <i className="fa fa-camera" />
          </div>
        </Link>
      </div>
      <div className="post-info-2">
        <span className="post-category">{category}</span>
        <h5 className="mb-0">
          <Link href={isPlaceholder ? '#' : `/bn/article/${slug}`} className="title">
            {title}
          </Link>
        </h5>
      </div>
    </div>
  );
};


export default HomeFeatureCarousal;