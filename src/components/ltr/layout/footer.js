
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollToTopUI from '../scroll-to-top/scroll-to-top';
import { useBackgroundImageLoader } from '../use-background-image/use-background-image';
import { getLatestArticles } from '@/services/articleService';
import { getCategories, getTags } from '@/services/globalService';
import { getStrapiMedia, formatDate, toBengaliNumber } from '@/lib/strapi';

const Footer = () => {
  useBackgroundImageLoader();
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hotTopics, setHotTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentRes, catRes, tagRes] = await Promise.all([
          getLatestArticles(1, 3), // Fetch 3 recent posts
          getCategories(6), // Fetch 6 categories (generic)
          getTags(12) // Fetch 12 tags for hot topics
        ]);

        setRecentPosts(recentRes?.data || []);
        setCategories(catRes?.data || []);
        setHotTopics(tagRes?.data || []);
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Split categories into two columns
  const midIndex = Math.ceil(categories.length / 2);
  const leftCategories = categories.slice(0, midIndex);
  const rightCategories = categories.slice(midIndex);

  return (
    <>
       <ScrollToTopUI/>
      {/* *** START FOOTER *** */}
      <footer
        className="main-footer bg-img"
        data-image-src="assets/images/1920x1000-1.jpg"
      >
        <div className="container position-relative z-1">
          <div className="g-3 row">
            <div className="col-md-3">
              <img
                src="/assets/images/logo-white.png"
                alt="footer logo"
                className="img-fluid"
              />
            </div>
            <div className="col-md-5">
              <p className="text-white mb-0">
                সত্যধারা প্রতিদিন - সত্যের সন্ধানে সর্বদা। আমরা নিরপেক্ষ ও বস্তুনিষ্ঠ সংবাদ পরিবেশনে প্রতিশ্রুতিবদ্ধ।
              </p>
            </div>
            <div className="col-md-4">
              {/* Form */}
              <form className="row row-cols-lg-auto g-2 align-items-center justify-content-end">
                <div className="col-12">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="আপনার ইমেইল ঠিকানা লিখুন"
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-news m-0">
                    সাবস্ক্রাইব
                  </button>
                </div>
                <div className="form-text mt-2 text-white">
                  সাবস্ক্রাইব করার মাধ্যমে আপনি আমাদের
                  <a href="#" className="text-decoration-underline text-primary ms-1">
                    গোপনীয়তা নীতি
                  </a>
                  তে সম্মত হচ্ছেন।
                </div>
              </form>
            </div>
          </div>
          <hr className="mt-5 mb-4" />
          <div className="row">
            {/* START FOOTER BOX (Qr Code) */}
            <div className="col-sm-6 col-lg-3 footer-box py-4">
              <div className="about-inner text-center">
                <h5 className="wiget-title">অ্যাপ ডাউনলোড করুন</h5>
                <div className="bg-white mb-3 d-inline-block">
                  {/* Start Qr Code Image */}
                  <img
                    src="/assets/images/qr-code.png"
                    height={105}
                    width={105}
                    alt="Qr Code"
                  />
                  {/* /. End Qr Code Image */}
                </div>
                <p>কিউআর কোড স্ক্যান করুন এবং আমাদের অ্যাপ ডাউনলোড করুন।</p>
              </div>
            </div>
            {/*  END OF /. FOOTER BOX (Qr Code) */}
            
            {/* START FOOTER BOX (Social Contact - Was Twitter) */}
            <div className="col-sm-6 col-lg-3 footer-box py-4">
               <h5 className="wiget-title">সামাজিক যোগাযোগ</h5>
                <ul className="list-unstyled m-0 menu-services">
                    <li><a href="#">ফেসবুক</a></li>
                    <li><a href="#">টুইটার</a></li>
                    <li><a href="#">ইউটিউব</a></li>
                    <li><a href="#">ইনস্টাগ্রাম</a></li>
                </ul>
            </div>
            {/* END OF /. FOOTER BOX (Social Contact) */}

            {/* START FOOTER BOX (Category) */}
            <div className="col-sm-6 col-lg-3 footer-box py-4">
              <h5 className="wiget-title">বিভাগ</h5>
              <div className="row">
                <div className="col-6">
                  <ul className="list-unstyled m-0 menu-services">
                    {leftCategories.map((cat, i) => (
                      <li key={i}>
                        <Link href={`/bn/category/${cat.attributes?.slug || '#'}`}>
                          {cat.attributes?.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-6">
                  <ul className="list-unstyled m-0 menu-services">
                    {rightCategories.map((cat, i) => (
                      <li key={i}>
                        <Link href={`/bn/category/${cat.attributes?.slug || '#'}`}>
                          {cat.attributes?.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {/* END OF /. FOOTER BOX (Category) */}

            {/* START FOOTER BOX (Recent Post) */}
            <div className="col-sm-6 col-lg-3 footer-box py-4">
              <h5 className="wiget-title">সাম্প্রতিক পোস্ট</h5>
              <div className="footer-news-grid">
                {recentPosts.map((post, i) => {
                  const p = post.attributes || post;
                  const img = getStrapiMedia(p.cover);
                  const date = formatDate(p.createdAt || p.publishedAt);
                  // Manually convert date numbers if formatDate doesn't do it fully or just in case
                  // formatDate usually respects locale 'bn-BD' which handles numbers.
                  
                  return (
                    <div className="news-list-item" key={i}>
                      <div className="img-wrapper">
                        <Link href={`/article/${p.slug}`} className="thumb">
                          <img
                            src={img}
                            alt={p.title}
                            className="img-fluid"
                            onError={(e) => e.target.src = '/default.jpg'}
                          />
                        </Link>
                      </div>
                      <div className="post-info-2">
                        <h5>
                          <Link href={`/article/${p.slug}`} className="title">
                            {p.title}
                          </Link>
                        </h5>
                        <ul className="align-items-center authar-info d-flex flex-wrap gap-1">
                          <li>{date}</li>
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* END OF /. FOOTER BOX (Recent Post) */}

          </div>
          {/* START HOT TOPICS */}
          <h5 className="wiget-title">জনপ্রিয় টপিক</h5>
          <ul className="lh-lg list-inline mb-0 text-primary-hover hot-topics">
            {hotTopics.map((tag, i) => (
              <li className="list-inline-item" key={i}>
                <Link href={`/bn/tag/${tag.attributes?.slug || '#'}`}>
                   {tag.attributes?.name}
                </Link>
              </li>
            ))}
          </ul>
          {/* END OF /. HOT TOPICS */}
        </div>
      </footer>
      {/* *** END OF /. FOOTER *** */}

      {/* *** START SUB FOOTER *** */}
      <div className="sub-footer">
        <div className="container">
          <div className="align-items-center g-1 g-sm-3 row">
            <div className="col text-center text-sm-start">
              <div className="copy">স্বত্ব: ©️ {toBengaliNumber(2026)} সত্যধারা প্রতিদিন</div>
            </div>
            <div className="col-sm-auto">
              <ul className="footer-nav list-unstyled text-center mb-0">
                <li className="list-inline-item">
                  <a href="#">গোপনীয়তা</a>
                </li>
                <li className="list-inline-item">
                  <a href="#">যোগাযোগ</a>
                </li>
                <li className="list-inline-item">
                  <a href="#">আমাদের সম্পর্কে</a>
                </li>
                <li className="list-inline-item">
                  <a href="#">অনুদান</a>
                </li>
                <li className="list-inline-item">
                  <a href="#">প্রশ্নাবলী</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default Footer;