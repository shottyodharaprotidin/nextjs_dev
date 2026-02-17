
import dynamic from "next/dynamic";
import Link from "next/link";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import 'animate.css/animate.css'


if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}
// This is for Next.js. On Rect JS remove this line
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
  ssr: false,
});


const NewsTicker = ({ data = [], isLoading = false }) => {
  if (isLoading) {
    const placeholders = [
        { id: 1, attributes: { title: 'Loading trending news...', slug: '#' } },
        { id: 2, attributes: { title: 'Please wait while we fetch the latest updates...', slug: '#' } }
    ];
    return (
        <div className="container">
          <div className="newstricker_inner">
            <div className="trending">
              <strong>ট্রেন্ডিং</strong> এখন
            </div>
            <OwlCarousel className="news-ticker owl-theme"
              loop={true}
              items={1}
              dots={false}
              animateOut='animate__slideOutDown'
              animateIn='animate__flipInX'
              autoplay={true}
              autoplayTimeout={5000}
              autoplayHoverPause={true}
              nav={true}
              navText={[
                `<i class='fa fa-angle-left'></i>`,
                `<i class='fa fa-angle-right'></i>`
              ]}
            >
              {placeholders.map((article, index) => (
                  <div className="item" key={index}>
                    <p><Link href="#">{article.attributes.title}</Link></p>
                  </div>
              ))}
            </OwlCarousel>
          </div>
        </div>
      );
  }

  // If no data, don't show the ticker section at all
  if (data.length === 0) {
    return null;
  }

  return (
    <div className="container">
      <div className="newstricker_inner">
        <div className="trending">
          <strong>ট্রেন্ডিং</strong> এখন
        </div>
        <OwlCarousel className="news-ticker owl-theme"
          loop={true}
          items={1}
          dots={false}
          animateOut='animate__slideOutDown'
          animateIn='animate__flipInX'
          autoplay={true}
          autoplayTimeout={5000}
          autoplayHoverPause={true}
          nav={true}
          navText={[
            `<i class='fa fa-angle-left'></i>`,
            `<i class='fa fa-angle-right'></i>`
          ]}
        >
          {data.map((article) => {
            const articleData = article.attributes || article;
            const slug = articleData.slug;
            const title = articleData.title;

            return (
              <div className="item" key={article.id}>
                <p>
                  <Link href={`/bn/article/${slug}`}>{title}</Link>
                </p>
              </div>
            );
          })}
        </OwlCarousel>
      </div>
    </div>
  );
};

export default NewsTicker;