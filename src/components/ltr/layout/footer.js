
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollToTopUI from '../scroll-to-top/scroll-to-top';
import { useBackgroundImageLoader } from '../use-background-image/use-background-image';
import { getLatestArticles } from '@/services/articleService';
import { getCategories, getTags, getFooterData } from '@/services/globalService';
import { getStrapiMedia, formatDate, toBengaliNumber } from '@/lib/strapi';
import { useLanguage } from '@/lib/LanguageContext';

const dictionary = {
  en: {
    description: "Satyadhara Pratidin - Always in search of truth. We are committed to serving neutral and objective news.",
    subscribe: {
      placeholder: "Enter your email address",
      btn: "Subscribe",
      text: "By subscribing you agree to our",
      privacy: "Privacy Policy",
      agree: "."
    },
    app: {
      title: "Download App",
      text: "Scan QR code and download our app."
    },
    social: "Social Contact",
    socialLinks: {
      fb: "Facebook",
      tw: "Twitter",
      yt: "Youtube",
      ig: "Instagram"
    },
    category: "Category",
    recentPost: "Recent Post",
    hotTopics: "Popular Topics",
    copyright: "Copyright: \u00A9 2026 Satyadhara Pratidin",
    links: {
      privacy: "Privacy",
      contact: "Contact",
      about: "About Us",
      donation: "Donation",
      faq: "FAQ"
    }
  },
  bn: {
    description: "সত্যধারা প্রতিদিন - সত্যের সন্ধানে সর্বদা। আমরা নিরপেক্ষ ও বস্তুনিষ্ঠ সংবাদ পরিবেশনে প্রতিশ্রুতিবদ্ধ।",
    subscribe: {
      placeholder: "আপনার ইমেইল ঠিকানা লিখুন",
      btn: "সাবস্ক্রাইব",
      text: "সাবস্ক্রাইব করার মাধ্যমে আপনি আমাদের",
      privacy: "গোপনীয়তা নীতি",
      agree: "তে সম্মত হচ্ছেন।"
    },
    app: {
      title: "অ্যাপ ডাউনলোড করুন",
      text: "কিউআর কোড স্ক্যান করুন এবং আমাদের অ্যাপ ডাউনলোড করুন।"
    },
    social: "সামাজিক যোগাযোগ",
    socialLinks: {
      fb: "ফেসবুক",
      tw: "টুইটার",
      yt: "ইউটিউব",
      ig: "ইনস্টাগ্রাম"
    },
    category: "বিভাগ",
    recentPost: "সাম্প্রতিক পোস্ট",
    hotTopics: "জনপ্রিয় টপিক",
    copyright: "স্বত্ব: \u00A9 ২০২৬ সত্যধারা প্রতিদিন",
    links: {
      privacy: "গোপনীয়তা",
      contact: "যোগাযোগ",
      about: "আমাদের সম্পর্কে",
      donation: "অনুদান",
      faq: "প্রশ্নাবলী"
    }
  }
};

const Footer = () => {
  useBackgroundImageLoader();
  const { locale } = useLanguage();
  const t = dictionary[locale] || dictionary.bn;
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hotTopics, setHotTopics] = useState([]);

  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentRes, catRes, tagRes, footerDataRes] = await Promise.all([
          getLatestArticles(1, 3, locale), // Fetch 3 recent posts
          getCategories(6, locale), // Fetch 6 categories (generic)
          getTags(12, locale), // Fetch 12 tags for hot topics
          getFooterData(locale) // Fetch footer data
        ]);

        setRecentPosts(recentRes?.data || []);
        setCategories(catRes?.data || []);
        setHotTopics(tagRes?.data || []);
        setFooterData(footerDataRes?.data || null);
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  // Split categories into two columns
  const midIndex = Math.ceil(categories.length / 2);
  const leftCategories = categories.slice(0, midIndex);
  const rightCategories = categories.slice(midIndex);

  return (
    <>
       <ScrollToTopUI/>
      {/* *** START FOOTER *** */}
      <footer
        id="footer"
        className="main-footer bg-img"
        data-image-src={getStrapiMedia(footerData?.attributes?.backgroundImage) || "/assets/images/1920x1000-1.jpg"}
      >
        <div className="container position-relative z-1">
          <div className="g-3 row">
            <div className="col-md-3">
              <img
                src={getStrapiMedia(footerData?.attributes?.logo) || "/assets/images/logo-white.png"}
                alt="footer logo"
                className="img-fluid"
              />
            </div>
            <div className="col-md-5">
              <p className="text-white mb-0">
                {footerData?.attributes?.description || t.description}
              </p>
            </div>
            <div className="col-md-4">
              {/* Form */}
              <form className="row row-cols-lg-auto g-2 align-items-center justify-content-end">
                <div className="col-12">
                  <input
                    type="email"
                    className="form-control"
                    placeholder={t.subscribe.placeholder}
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-news m-0">
                    {t.subscribe.btn}
                  </button>
                </div>
                <div className="form-text mt-2 text-white">
                  {footerData?.attributes?.newsletterText || t.subscribe.text}
                  <a href="#" className="text-decoration-underline text-primary ms-1">
                    {t.subscribe.privacy}
                  </a>
                  {t.subscribe.agree}
                </div>
              </form>
            </div>
          </div>
          <hr className="mt-5 mb-4" />
          <div className="row">
            {/* START FOOTER BOX (Qr Code) */}
            <div className="col-sm-6 col-lg-3 footer-box py-4">
              <div className="about-inner text-center">
                <h5 className="wiget-title">{t.app.title}</h5>
                <div className="bg-white mb-3 d-inline-block">
                  {/* Start Qr Code Image */}
                  <img
                    src={getStrapiMedia(footerData?.attributes?.appQrImage) || "/assets/images/qr-code.png"}
                    height={105}
                    width={105}
                    alt="Qr Code"
                  />
                  {/* /. End Qr Code Image */}
                </div>
                <p>{footerData?.attributes?.appDescription || t.app.text}</p>
              </div>
            </div>
            {/*  END OF /. FOOTER BOX (Qr Code) */}
            
            {/* START FOOTER BOX (Social Contact - Was Twitter) */}
            <div className="col-sm-6 col-lg-3 footer-box py-4">
               <h5 className="wiget-title">{t.social}</h5>
                <ul className="list-unstyled m-0 menu-services">
                    <li><a href="#">{t.socialLinks.fb}</a></li>
                    <li><a href="#">{t.socialLinks.tw}</a></li>
                    <li><a href="#">{t.socialLinks.yt}</a></li>
                    <li><a href="#">{t.socialLinks.ig}</a></li>
                </ul>
            </div>
            {/* END OF /. FOOTER BOX (Social Contact) */}

            {/* START FOOTER BOX (Category) */}
            <div className="col-sm-6 col-lg-3 footer-box py-4">
              <h5 className="wiget-title">{t.category}</h5>
              <div className="row">
                <div className="col-6">
                  <ul className="list-unstyled m-0 menu-services">
                    {leftCategories.map((cat, i) => (
                      <li key={i}>
                        <Link href={`/category/${cat.attributes?.slug || cat.slug || '#'}`}>
                          {cat.attributes?.name || cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-6">
                  <ul className="list-unstyled m-0 menu-services">
                    {rightCategories.map((cat, i) => (
                      <li key={i}>
                        <Link href={`/category/${cat.attributes?.slug || cat.slug || '#'}`}>
                          {cat.attributes?.name || cat.name}
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
              <h5 className="wiget-title">{t.recentPost}</h5>
              <div className="footer-news-grid">
                {recentPosts.map((post, i) => {
                  const p = post.attributes || post;
                  const img = getStrapiMedia(p.cover);
                  const date = formatDate(p.createdAt || p.publishedAt, locale);
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
          <h5 className="wiget-title">{t.hotTopics}</h5>
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
              <div className="copy">{t.copyright}</div>
            </div>
            <div className="col-sm-auto">
              <ul className="footer-nav list-unstyled text-center mb-0">
                <li className="list-inline-item">
                  <Link href={footerData?.attributes?.privacyLink || 'http://localhost:3000/privacy-policy'}>{t.links.privacy}</Link>
                </li>
                <li className="list-inline-item">
                  <Link href={footerData?.attributes?.contactLink || 'http://localhost:3000/contact'}>{t.links.contact}</Link>
                </li>
                <li className="list-inline-item">
                  <Link href={footerData?.attributes?.aboutLink || 'http://localhost:3000/about'}>{t.links.about}</Link>
                </li>
                <li className="list-inline-item">
                  <Link href={footerData?.attributes?.donationLink || 'http://localhost:3000/donation'}>{t.links.donation}</Link>
                </li>
                <li className="list-inline-item">
                  <Link href={footerData?.attributes?.faqLink || 'http://localhost:3000/faq'}>{t.links.faq}</Link>
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