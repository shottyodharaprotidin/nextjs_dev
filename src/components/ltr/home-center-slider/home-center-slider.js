import dynamic from "next/dynamic";
import Link from "next/link";
import { getStrapiMedia } from "@/lib/strapi";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import 'animate.css/animate.css'
if (typeof window !== "undefined") {
    window.$ = window.jQuery = require("jquery");
  }
  const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
    ssr: false,
  })

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

const HomeCenterSlider = ({ data = [], isLoading = false }) => {
  // Use data from props (which handles dummy data from parent)
  const items = data.slice(0, 5);

  if (!isLoading && items.length === 0) return null;

  return (
    <OwlCarousel key={isLoading ? 'loading' : 'loaded'} id="owl-slider" className="owl-theme" {...optionEight}>
      {items.map((article, index) => renderItem(article, index, isLoading))}
    </OwlCarousel>
  );
};

const renderItem = (article, index, isPlaceholder = false) => {
  const articleData = article.attributes || article;
  const imageUrl = getStrapiMedia(articleData.cover);
  // robust access
  const category = articleData.category?.name || articleData.category?.data?.attributes?.name || "সংবাদ";
  const slug = articleData.slug || '#';
  const title = articleData.title || 'Loading...';
  // robust author access
  const authorName = articleData.author?.name || articleData.author?.data?.attributes?.name || "সম্পাদক";
  const date = new Date(articleData.createdAt || articleData.publishedAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="item" key={article.id || index}>
      <div className="slider-post post-height-1">
        <Link href={isPlaceholder ? '#' : `/article/${slug}`} className="news-image">
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
            <Link href={isPlaceholder ? '#' : `/article/${slug}`}>{title}</Link>
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