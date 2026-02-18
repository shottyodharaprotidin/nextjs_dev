import Layout from "@/components/ltr/layout/layout";
import Link from "next/link";
import { getFaqs } from "@/services/faqService";
import { getGlobalSettings } from "@/services/globalService";
import { getStrapiMedia } from "@/lib/strapi";
import BodyClassCleaner from "@/components/ltr/useEffect-hook/BodyClassCleaner";

export default async function FaqPage() {
    const locale = 'bn'; // Default locale, can be dynamic later
    const translations = {
        en: {
            title: 'Frequently Asked Questions',
            description: 'Find answers to your common questions about Rasel News.',
        },
        bn: {
            title: 'সচরাচর জিজ্ঞাসিত প্রশ্ন',
            description: 'রাসেল নিউজ সম্পর্কে আপনার বিভিন্ন প্রশ্নের উত্তর এখানে পাবেন।',
        }
    };
    const t = translations[locale] || translations.bn;

    const [faqsResponse, globalSettingsResponse] = await Promise.all([
        getFaqs(locale),
        getGlobalSettings(locale),
    ]);
    const faqs = faqsResponse?.data || [];
    const globalSettings = globalSettingsResponse?.data || null;
    const headerImage = getStrapiMedia(globalSettings?.faqHeaderImage, "/default.jpg");

    return (
        <Layout hideMiddleHeader={true} globalSettings={globalSettings}>
            {/* *** START PAGE MAIN CONTENT *** */}
            <main className="page_main_wrapper">
                <BodyClassCleaner remove={['home-nine', 'home-six', 'home-seven', 'home-two', 'boxed-layout', 'layout-rtl']} />
                {/* START PAGE HEADER */}
                <section
                    className="inner-head bg-img"
                    data-image-src={headerImage}
                >
                    <div className="container position-relative">
                        <div className="row">
                            <div className="col-sm-12">
                                <h1 className="entry-title">{t.title}</h1>
                                {t.description && <p className="text-white mt-2">{t.description}</p>}
                                <div className="breadcrumb">
                                    <ul className="clearfix">
                                        <li className="ib">
                                            <Link href="/">Home</Link>
                                        </li>
                                        <li className="ib current-page">F.A.Q</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* END OF /. PAGE HEADER */}
                <section className="faq-inner">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-sm-12">
                                {faqs.length === 0 ? (
                                    <div className="text-center py-5">
                                        <p>কোনো FAQ পাওয়া যায়নি।</p>
                                    </div>
                                ) : (
                                    <div className="panel-group" id="accordion" role="tablist">
                                        {faqs.map((faq, index) => {
                                            const collapseId = `collapse-faq-${faq.id}`;
                                            const headingId = `heading-faq-${faq.id}`;
                                            const isFirst = index === 0;
                                            return (
                                                <div className="panel" key={faq.id}>
                                                    <div className="panel-heading" role="tab" id={headingId}>
                                                        <h4 className="panel-title">
                                                            <a
                                                                role="button"
                                                                data-bs-toggle="collapse"
                                                                data-parent="#accordion"
                                                                href={`#${collapseId}`}
                                                                aria-controls={collapseId}
                                                                className={isFirst ? "" : "collapsed"}
                                                            >
                                                                {faq.question}
                                                            </a>
                                                        </h4>
                                                    </div>
                                                    <div
                                                        id={collapseId}
                                                        className={`panel-collapse collapse${isFirst ? " in" : ""}`}
                                                        role="tabpanel"
                                                        aria-labelledby={headingId}
                                                    >
                                                        <div className="panel-body">
                                                            <p>{faq.answer}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            {/* *** END OF /. PAGE MAIN CONTENT *** */}
        </Layout>
    );
}