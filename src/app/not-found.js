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
          <div
            className="d-flex flex-column align-items-center justify-content-center text-center"
            style={{ minHeight: "60vh", padding: "60px 20px" }}
          >
            <h1
              style={{
                fontSize: "clamp(80px, 15vw, 180px)",
                fontWeight: 800,
                lineHeight: 1,
                background: "linear-gradient(135deg, var(--bs-primary, #dc3545) 0%, #ff6b6b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "16px",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "clamp(16px, 2.5vw, 22px)",
                color: "var(--text-color, #6c757d)",
                maxWidth: "520px",
                marginBottom: "32px",
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </p>
            <Link
              href="/"
              className="btn btn-primary px-4 py-2"
              style={{
                fontSize: "16px",
                borderRadius: "8px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {locale === "bn" ? "হোম পেজে ফিরে যান" : "Back to Home"}
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
