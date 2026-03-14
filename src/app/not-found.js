"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "@/components/ltr/layout/layout";
import { getGlobalSettings } from "@/services/globalService";
import { getNotFoundSettings } from "@/services/notFoundService";
import { useLanguage } from "@/lib/LanguageContext";

export default function NotFound() {
  const { locale } = useLanguage();
  const [globalSettings, setGlobalSettings] = useState(null);
  const [notFoundSettings, setNotFoundSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getGlobalSettings(locale),
      getNotFoundSettings(locale)
    ])
      .then(([globalRes, notFoundRes]) => {
        const globalRaw = globalRes?.data || globalRes || null;
        setGlobalSettings(globalRaw?.attributes || globalRaw);
        
        const notFoundRaw = notFoundRes?.data || notFoundRes || null;
        setNotFoundSettings(notFoundRaw?.attributes || notFoundRaw);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [locale]);

  const title = notFoundSettings?.notFoundTitle || "404";
  const subtitle =
    notFoundSettings?.notFoundSubtitle ||
    (locale === "bn"
      ? "দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি।"
      : "Sorry, the page you are looking for could not be found.");

  return (
    <Layout hideMiddleHeader={true} globalSettings={globalSettings}>
      <main className="page_main_wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 text-center" style={{ minHeight: "60vh", padding: "80px 0" }}>
              <div className="error-content">
                <h1 className="not-found-title error-title fw-bold">
                  {title}
                </h1>
                <p className="error-desc fs-5" style={{ color: "var(--text-color, #6c757d)", marginBottom: "32px" }}>
                  {subtitle}
                </p>
                <div className="button-group mt-4">
                  <Link href="/" className="btn btn-news rounded-0 px-3 py-1 fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '14px' }}>
                    {notFoundSettings?.notFoundButtonLabel || (locale === "bn" ? "হোম পেজে ফিরে যান" : "Back to Home")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
