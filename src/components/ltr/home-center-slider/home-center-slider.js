import dynamic from "next/dynamic";
import Link from "next/link";
import { getStrapiMedia } from "@/lib/strapi";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import 'animate.css/animate.css'
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
  }
  // This is for Next.js. On Rect JS remove this line
  const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
  })
const HomeCenterSlider = ({ data = [], isLoading = false }) => {
  
  if (isLoading) {
    const placeholders = [
      { id: 1, attributes: { title: 'Loading popular articles...', slug: '#', category: { data: { attributes: { name: 'News' } } }, cover: { data: { attributes: { url: '/default.jpg' } } }, author: { data: { attributes: { name: 'Loading...' } } }, createdAt: '2024-01-01' } },
      { id: 2, attributes: { title: 'Please wait while fetching data from server...', slug: '#', category: { data: { attributes: { name: 'Politics' } } }, cover: { data: { attributes: { url: '/default.jpg' } } }, author: { data: { attributes: { name: 'Loading...' } } }, createdAt: '2024-01-01' } }
    ];
    
    return (
      <OwlCarousel id="owl-slider" className="owl-theme" {...optionEight}>
        {placeholders.map((article, index) => renderItem(article, index, true))}
      </OwlCarousel>
    );
  }

  // If no data, don't show anything
  if (data.length === 0) {
    return null;
  }
  
  const displayData = data.slice(0, 5);


  const optionEight = {
    loop: true,
    items: 1,
    dots: true,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    autoplay: true,
    autoplayTimeout: 4000, //Set AutoPlay to 4 seconds
    autoplayHoverPause: true,
    nav: true,
    navText: [
      `<i class='ti ti-angle-left'></i>`,
      `<i class='ti ti-angle-right'></i>`
    ]
  }
    return (
        <OwlCarousel id="owl-slider" className="owl-theme" {...optionEight}>
        {displayData.map((article, index) => renderItem(article, index))}
      </OwlCarousel>
    );
};

const optionEight = {
    loop: true,
    items: 1,
    dots: true,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    autoplay: true,
    autoplayTimeout: 4000, 
    autoplayHoverPause: true,
    nav: true,
    navText: [
      `<i class='ti ti-angle-left'></i>`,
      `<i class='ti ti-angle-right'></i>`
    ]
};

const renderItem = (article, index, isPlaceholder = false) => {
  const articleData = article.attributes || article;
  const imageUrl = getStrapiMedia(articleData.cover);
  const category = articleData.category?.data?.attributes?.name || articleData.category?.name || "সংবাদ";
  const slug = articleData.slug;
  const title = articleData.title;
  const authorName = articleData.author?.data?.attributes?.name || articleData.author?.name || "সম্পাদক";
  const date = new Date(articleData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="item" key={article.id || index}>
      <div className="slider-post post-height-1">
        <Link href={isPlaceholder ? '#' : `/bn/article/${slug}`} className="news-image">
          <img 
            src={imageUrl} 
            alt={title} 
            className="img-fluid" 
            onError={(e) => e.target.src = '/default.jpg'}
          />
        </Link>
        <div className="post-text">
          <span className="post-category">{category}</span>
          <h1>
            <Link href={isPlaceholder ? '#' : `/bn/article/${slug}`}>{title}</Link>
          </h1>
          <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
            <li className="post-atuthor-list">
              <div className="post-atuthor">
                <span>
                  By <Link href="#">{authorName}</Link>
                </span>
              </div>
            </li>
            <li className="post-date">{date}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeCenterSlider;