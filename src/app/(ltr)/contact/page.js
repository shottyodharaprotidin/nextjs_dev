"use client"

import GoogleMapComponents from "@/components/ltr/google-map/google-map";
import Layout from "@/components/ltr/layout/layout";
import useRemoveBodyClass from "@/components/ltr/useEffect-hook/useEffect-hook";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import StickyBox from "react-sticky-box";
import { submitContact } from "@/services/contactService";
import { getGlobalSettings } from "@/services/globalService";

const dictionary = {
    en: {
        title: "Contact",
        subTitle: "Leave a Message",
        formName: "Full Name",
        formEmail: "Email",
        formWebsite: "Website",
        formSubject: "Subject",
        formMessage: "Type Your Message",
        formSubmit: "Send Message",
        formSubmitting: "Sending...",
        contactInfo: "Contact Info",
        joinFollowers: "Join",
        followers: "Followers",
        fans: "Fans",
        subscribers: "Subscribers",
        addressNotSet: "Address not set",
        phoneNotSet: "Phone not set",
        emailNotSet: "Email not set",
        successMessage: "Thank you! Your message has been sent successfully.",
        errorMessage: "Failed to send message. Please try again later."
    },
    bn: {
        title: "যোগাযোগ",
        subTitle: "একটি বার্তা রাখুন",
        formName: "পুরো নাম",
        formEmail: "ইমেল",
        formWebsite: "ওয়েবসাইট",
        formSubject: "বিষয়",
        formMessage: "আপনার বার্তা লিখুন",
        formSubmit: "বার্তা পাঠান",
        formSubmitting: "পাঠানো হচ্ছে...",
        contactInfo: "যোগাযোগ তথ্য",
        joinFollowers: "যোগ দিন",
        followers: "অনুসরণকারীরা",
        fans: "ফ্যান",
        subscribers: "সাবস্ক্রাইবার",
        addressNotSet: "ঠিকানা সেট করা হয়নি",
        phoneNotSet: "ফোন নম্বর সেট করা হয়নি",
        emailNotSet: "ইমেল সেট করা হয়নি",
        successMessage: "ধন্যবাদ! আপনার বার্তা সফলভাবে পাঠানো হয়েছে।",
        errorMessage: "বার্তা পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।"
    }
};

import { useLanguage } from '@/lib/LanguageContext';

// ... (rest of imports)

const page = () => {
    useRemoveBodyClass(['None'], ['home-seven', 'home-nine','boxed-layout','home-six','home-two']);
    
    const { locale } = useLanguage();
    const t = dictionary[locale] || dictionary.bn;
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        website: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [globalSettings, setGlobalSettings] = useState(null);

    useEffect(() => {
        getGlobalSettings('bn').then(res => {
            const data = res?.data?.attributes || res?.data || null;
            setGlobalSettings(data);
        }).catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            await submitContact(formData);
            setStatus({ 
                type: 'success', 
                message: t.successMessage 
            });
            setFormData({
                name: '',
                email: '',
                website: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: t.errorMessage 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout hideMiddleHeader={true} globalSettings={globalSettings}>
            {/* START PAGE TITLE */}
            <div className="page-title">
                <div className="container">
                    <div className="align-items-center row">
                        <div className="col">
                            <h1 className="mb-sm-0">
                                <strong>{t.title}</strong>
                            </h1>
                        </div>
                        <div className="col-12 col-sm-auto">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb d-inline-block">
                                    <li className="breadcrumb-item">
                                        <Link href="/">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Contact
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {/* END OF /. PAGE TITLE */}
          
            {/* *** START PAGE MAIN CONTENT *** */}
            <main className="page_main_wrapper">
                <div className="container">
                    <div className="row row-m">
                        <div className="col-sm-7 col-md-8 main-content col-p">
                            <StickyBox>
                                {/* START CONTACT FORM AREA */}
                                <div className="contact_form_inner">
                                    <div className="panel_inner">
                                        <div className="panel_header">
                                            <h4>
                                                <strong>{t.subTitle}</strong>
                                            </h4>
                                        </div>
                                        <div className="panel_body">
                                            <p>
                                                Lorem Ipsum is simply dummy text of the printing and
                                                typesetting industry. Lorem Ipsum has been the industry's
                                                standard dummy text ever since the 1500s, when an unknown
                                                printer took a galley of type and scrambled it to make a
                                                type specimen book. It has survived not only five centuries,
                                                but also the leap into electronic typesetting, remaining
                                                essentially unchanged.
                                            </p>
                                            <form className="comment-form" onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <div className="form-group">
                                                            <label htmlFor="name">{t.formName}*</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="name"
                                                                name="name"
                                                                value={formData.name}
                                                                onChange={handleChange}
                                                                placeholder={t.formName}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor="email">{t.formEmail}*</label>
                                                        <div className="form-group">
                                                            <input
                                                                type="email"
                                                                className="form-control"
                                                                id="email"
                                                                name="email"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                                placeholder={t.formEmail}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="form-group">
                                                            <label htmlFor="website">{t.formWebsite}</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="website"
                                                                name="website"
                                                                value={formData.website}
                                                                onChange={handleChange}
                                                                placeholder={t.formWebsite}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <label htmlFor="subject">{t.formSubject}</label>
                                                        <div className="form-group">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="subject"
                                                                name="subject"
                                                                value={formData.subject}
                                                                onChange={handleChange}
                                                                placeholder={t.formSubject}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="message">{t.formMessage}*</label>
                                                    <textarea
                                                        className="form-control"
                                                        id="message"
                                                        name="message"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        placeholder={t.formMessage}
                                                        rows={5}
                                                        required
                                                    />
                                                </div>
                                                
                                                {status.message && (
                                                    <div className={`alert alert-${status.type === 'success' ? 'success' : 'danger'} mt-3`} role="alert">
                                                        {status.message}
                                                    </div>
                                                )}

                                                <button type="submit" className="btn btn-news" disabled={isSubmitting}>
                                                    {isSubmitting ? t.formSubmitting : t.formSubmit}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                {/* END OF CONTACT FORM AREA */}
                            </StickyBox>
                        </div>
                        <div className="col-sm-5 col-md-4 rightSidebar col-p">
                            <StickyBox>
                                {/* START CONTACT INFO */}
                                <div className="panel_inner">
                                    <div className="panel_header">
                                        <h4>
                                            <strong>{t.contactInfo}</strong>
                                        </h4>
                                    </div>
                                    <div className="panel_body">
                                        <address>
                                            {" "}
                                            <strong>{globalSettings?.siteName || 'News'}</strong>
                                            <br /> {globalSettings?.contactAddress || 'Address not set'}
                                            <br /> <abbr title="Phone">P:</abbr> {globalSettings?.contactPhone || 'Phone not set'}{" "}
                                        </address>
                                        <address>
                                            {" "}
                                            <strong>Email</strong>
                                            <br /> <a href={`mailto:${globalSettings?.contactEmail}`}>
                                                {globalSettings?.contactEmail || 'Email not set'}
                                            </a>{" "}
                                        </address>
                                    </div>
                                </div>
                                {/* END OF /. CONTACT INFO */}
                                {/* START SOCIAL COUNTER TEXT */}
                                <div className="align-items-center d-flex fs-6 justify-content-center mb-2 text-center social-counter-total">
                                    <i className="fa-solid fa-heart text-primary me-1" /> {t.joinFollowers}{" "}
                                    <span className="fw-bold mx-1">{globalSettings?.socialTotalFollowers || 0}</span> {t.followers}
                                </div>
                                {/* END OF /. SOCIAL COUNTER TEXT */}
                                {/* START SOCIAL ICON */}
                                <div className="social-media-inner">
                                    <ul className="g-1 row social-media">
                                        <li className="col-4">
                                            <a href={globalSettings?.socialRssUrl || '#'} className="rss" target="_blank" rel="noopener noreferrer">
                                                <i className="fas fa-rss" />
                                                <div>{globalSettings?.socialRssSubscribers || 0}</div>
                                                <p>{t.subscribers}</p>
                                            </a>
                                        </li>
                                        <li className="col-4">
                                            <a href={globalSettings?.socialFacebookUrl || '#'} className="fb" target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-facebook-f" />
                                                <div>{globalSettings?.socialFacebookFans || 0}</div>
                                                <p>{t.fans}</p>
                                            </a>
                                        </li>
                                        <li className="col-4">
                                            <a href={globalSettings?.socialInstagramUrl || '#'} className="insta" target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-instagram" />
                                                <div>{globalSettings?.socialInstagramFollowers || 0}</div>
                                                <p>{t.followers}</p>
                                            </a>
                                        </li>
                                        <li className="col-4">
                                            <a href={globalSettings?.socialYoutubeUrl || '#'} className="you_tube" target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-youtube" />
                                                <div>{globalSettings?.socialYoutubeSubscribers || 0}</div>
                                                <p>{t.subscribers}</p>
                                            </a>
                                        </li>
                                        <li className="col-4">
                                            <a href={globalSettings?.socialTwitterUrl || '#'} className="twitter" target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-twitter" />
                                                <div>{globalSettings?.socialTwitterFollowers || 0}</div>
                                                <p>{t.followers}</p>
                                            </a>
                                        </li>
                                        <li className="col-4">
                                            <a href={globalSettings?.socialPinterestUrl || '#'} className="pint" target="_blank" rel="noopener noreferrer">
                                                <i className="fab fa-pinterest-p" />
                                                <div>{globalSettings?.socialPinterestFollowers || 0}</div>
                                                <p>{t.followers}</p>
                                            </a>
                                        </li>
                                    </ul>{" "}
                                    {/* /.social icon */}
                                </div>
                                {/* END OF /. SOCIAL ICON */}
                            </StickyBox>
                        </div>
                    </div>
                    <div className="panel_inner">
                        <div className="panel_body">
                            {/* The element that will contain Google Map. This is used in both the Javascript and CSS above. */}
                            <GoogleMapComponents 
                                lat={globalSettings?.contactMapLat} 
                                lng={globalSettings?.contactMapLng} 
                            />
                        </div>
                    </div>
                </div>
            </main>
            {/* *** END OF /. PAGE MAIN CONTENT *** */}
        </Layout>

    );
};

export default page;