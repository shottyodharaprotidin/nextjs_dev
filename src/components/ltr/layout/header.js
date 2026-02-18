
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { formatDate, getStrapiMedia } from '@/lib/strapi';
import { getYoutubeVideos } from '@/services/youtubeService';
import { getInstagramPhotos } from '@/services/instagramService';
import { WiDayLightning } from 'weather-icons-react';
import ThemeChanger from '../style-selectors/style-selector';
const HomeLinks = [
    { href: '/', text: 'Home – Layout 1', badge: 'NEW' },
    { href: '/home-two', text: 'Home – Layout 2', badge: 'POPULAR' },
    { href: '/category-style', text: 'Category - layout 1' },
    { href: '/post-template', text: 'Post - layout 1' },
    { href: '/about', text: 'About Us' },
    { href: '/typography', text: 'Typography' },
    { href: '/contact', text: 'Contact' },
    { href: '/faq', text: 'Faq' },
   
];
const Header = ({ hideMiddleHeader = false, globalSettings }) => {
    const [isSidebarActive, setSidebarActive] = useState(false);
    const [isOverlayActive, setOverlayActive] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const path = usePathname()
   
    const toggleSidebar = () => {
        setSidebarActive(!isSidebarActive);
        setOverlayActive(!isOverlayActive);
    };

    const closeSidebar = () => {
        setSidebarActive(false);
        setOverlayActive(false);
    };

    const [currentDate, setCurrentDate] = useState('');
    const [videos, setVideos] = useState([]);

    const [isLoadingVideos, setIsLoadingVideos] = useState(true);
    const [instagrams, setInstagrams] = useState([]);
    const [isLoadingInstagrams, setIsLoadingInstagrams] = useState(true);

    useEffect(() => {
        setIsLoadingInstagrams(true);
        getInstagramPhotos(6).then(res => {
            setInstagrams(res?.data || []);
        }).finally(() => {
            setIsLoadingInstagrams(false);
        });
    }, []);

    useEffect(() => {
        // Fetch videos for menu
        setIsLoadingVideos(true);
        getYoutubeVideos(5).then(res => {
             setVideos(res?.data || []);
        }).finally(() => {
             setIsLoadingVideos(false);
        });
    }, []);

    useEffect(() => {
        // Set current date on mount to avoid hydration mismatch
        // Using bn-BD locale which will be intercepted by our modified formatDate
        setCurrentDate(formatDate(new Date().toISOString(), 'bn'));
    }, []);

    useEffect(() => {
        const dismissOverlay = document.querySelector('#dismiss');
        const overlay = document.querySelector('.overlay');
        const navIcon = document.querySelector('#nav-icon');

        if (dismissOverlay && overlay) {
            dismissOverlay.addEventListener('click', closeSidebar);
            overlay.addEventListener('click', closeSidebar);
        }

        if (navIcon) {
            navIcon.addEventListener('click', toggleSidebar);
        }

        // Cleanup function for removing event listeners
        return () => {
            if (dismissOverlay && overlay) {
                dismissOverlay.removeEventListener('click', closeSidebar);
                overlay.removeEventListener('click', closeSidebar);
            }
            if (navIcon) {
                navIcon.removeEventListener('click', toggleSidebar);
            }
        };
    }, [isSidebarActive, isOverlayActive]); // R
    useEffect(() => {
        const fullSkinSearch = () => {
            let wHeight = window.innerHeight;

            // Search bar middle alignment
            const fullscreenSearchform = document.getElementById('fullscreen-searchform');
            fullscreenSearchform.style.top = `${wHeight / 2}px`;

            // Reform search bar on window resize
            window.addEventListener('resize', () => {
                wHeight = window.innerHeight;
                fullscreenSearchform.style.top = `${wHeight / 2}px`;
            });
        };

        fullSkinSearch(); // Call the function once the component is mounted

        // Cleanup function if needed
        return () => {
            // Remove event listeners or perform cleanup if required
        };
    }, []);

    const handleSearchButtonClick = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleCloseButtonClick = () => {
        setIsSearchOpen(false);
    };

    return (
        <>
            {/* *** START PAGE HEADER SECTION *** */}
            <header>
                {/* START HEADER TOP SECTION */}
                <div className="header-top">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                {/* Start top left menu */}
                                <div className="d-flex top-left-menu">
                                    <ul className="align-items-center d-flex flex-wrap">
                                        <li>
                                            {/* Start header social */}
                                            <div className="header-social">
                                                <ul className="align-items-center d-flex gap-2">
                                                    <li>
                                                        <Link href="#">
                                                            <i className="fab fa-facebook-f" />
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="#">
                                                            <i className="fab fa-twitter" />
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="#">
                                                            <i className="fab fa-vk" />
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="#">
                                                            <i className="fab fa-instagram" />
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="#">
                                                            <i className="fab fa-youtube" />
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="#">
                                                            <i className="fab fa-vimeo-v" />
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* End of /. header social */}
                                        </li>
                                        <li className="d-none d-sm-block">
                                            <Link href="#">Contact</Link>
                                        </li>
                                        <li className="d-none d-sm-block">
                                            <Link href="#">Donation</Link>
                                        </li>
                                    </ul>
                                </div>
                                {/* End of /. top left menu */}
                            </div>
                            {/* Start header top right menu */}
                            <div className="col-auto ms-auto">
                                <div className="header-right-menu">
                                    <ul className="d-flex justify-content-end">
                                        <li className="d-md-block d-none">
                                            Currency:{" "}
                                            <Link href="#" className="fw-bold">
                                                USD
                                            </Link>
                                        </li>
                                        <li className="d-md-block d-none">
                                            Wishlist:{" "}
                                            <Link href="#" className="fw-bold">
                                                12
                                            </Link>
                                        </li>
                                        <li>
                                            {" "}
                                            <Link href="#">
                                                <i className="fa fa-lock" /> Sign Up{" "}
                                            </Link>
                                            <span className="fw-bold">or</span>
                                            <Link href="#"> Login</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* end of /. header top right menu */}
                        </div>
                        {/* end of /. row */}
                    </div>
                    {/* end of /. container */}
                </div>
                {/* END OF /. HEADER TOP SECTION */}
                {/* START MIDDLE SECTION */}
                {hideMiddleHeader ? (
                    <div className="d-md-block d-none header-mid">
                        <div className="container">
                            <div className="align-items-center row">
                                <div className="col-sm-4">
                                    <Link href="/">
                                        <img
                                            src="/assets/images/logo.png"
                                            className="img-fluid header-logo header-logo_dark"
                                            alt=""
                                        />
                                        <img
                                            src="/assets/images/logo-white.png"
                                            className="img-fluid header-logo_white"
                                            alt=""
                                        />
                                    </Link>
                                </div>
                                <div className="col-sm-8">
                                    <Link href={globalSettings?.adBannerTopLink || '#'}>
                                        <img
                                            src={getStrapiMedia(globalSettings?.adBannerTop, "/assets/images/add728x90-1.jpg")}
                                            className="img-fluid"
                                            alt="Top Banner"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                <div className="d-md-block d-none header-mid">
                    <div className="container">
                        <div className="align-items-center row justify-content-center">
                            <div className="col">
                                <div className="hstack gap-3">
                                    <div id="nav-icon" className={isSidebarActive ? 'open' : ''}>
                                        <span />
                                        <span />
                                        <span />
                                    </div>
                                    <div className="vr" />
                                    <span className="fw-semibold text-uppercase menu-text">
                                        All Section
                                    </span>
                                </div>
                            </div>
                            <div className="col-auto">
                                <div className="align-items-center d-flex gap-3">
                                    {/* Start weather text */}
                                    <div className="fs-5 fw-semibold weather-text">
                                        <WiDayLightning size={28} /> 11.23°C
                                    </div>
                                    {/* Start logo */}
                                    <Link href="/" className="header-logo">
                                        <img
                                            src="assets/images/logo.png"
                                            className="header-logo_dark"
                                            alt=""
                                        />
                                        <img
                                            src="assets/images/logo-white.png"
                                            className="header-logo_white"
                                            alt=""
                                        />
                                    </Link>
                                    {/* Start language dropdown */}
                                    <div className="dropdown language-dropdown">
                                        <button
                                            className="btn p-0 dropdown-toggle d-flex align-items-center gap-2"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i className="fa-solid fa-earth-americas" />
                                            <div className="fw-semibold">En</div>
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <Link className="dropdown-item active" href="#">
                                                    <i className="sl-flag flag-de" />
                                                    <span className="language-text">De</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" href="#">
                                                    <i className="sl-flag flag-usa" />
                                                    <span className="language-text">En</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col text-end fw-semibold text-uppercase date-text">
                                {currentDate}
                            </div>
                        </div>
                    </div>
                </div>
                )}
                {/* END OF /. MIDDLE SECTION */}
                {/* START NAVIGATION */}
                <nav className="custom-navbar navbar navbar-expand-lg sticky-top flex-column no-logo no-logo">
                    {/* Start Fullscreen Search */}
                    <div className={`fullscreen-search-overlay ${isSearchOpen ? 'fullscreen-search-overlay-show' : ''}`} >
                        <Link
                            href="#"
                            className="fullscreen-close"
                            onClick={handleCloseButtonClick}
                            id="fullscreen-close-button"
                        >
                            <i className="ti ti-close" />
                        </Link>
                        <div id="fullscreen-search-wrapper">
                            <form method="get" id="fullscreen-searchform">
                                <input
                                    type="text"
                                    defaultValue=""
                                    placeholder="Type keyword(s) here"
                                    id="fullscreen-search-input"
                                />
                                <i className="ti ti-search fullscreen-search-icon">
                                    <input value="" type="submit" />
                                </i>
                            </form>
                        </div>
                    </div>
                    {/* /. End Fullscreen Search */}
                    <div className="container position-relative">
                        {/* Start Navbar Brand*/}
                        <Link className="navbar-brand d-md-none" href="/">
                            {/* <img class="logo-dark" src="assets/images/logo.png" alt=""> */}
                            <img
                                src="assets/images/logo.png"
                                className="header-logo_dark"
                                alt=""
                            />
                            <img
                                src="assets/images/logo-white.png"
                                className="header-logo_white"
                                alt=""
                            />
                        </Link>
                        {/* End Navbar Brand*/}
                        {/* Start Search Button */}
                        <button
                                type="button"
                                className="btn btn-search_two  ms-auto ms-md-0 d-lg-none"
                                onClick={handleSearchButtonClick}
                            >
                                <i className="fa fa-search" />
                            </button>
                          
                        {/* End Search Button */}
                        {/* Start Theme Switcher for Mobile */}
                        <div className="d-lg-none ms-2">
                            <ThemeChanger />
                        </div>
                        {/* End Theme Switcher */}
                        {/* Start Navbar Toggler Buton */}
                        <button
                            className={`navbar-toggler ms-1`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >

                            <span className="navbar-toggler-icon" />
                        </button>
                        {/* End Navbar Toggler Buton */}
                        <div className={`collapse navbar-collapse`} id="navbarSupportedContent">
                            {/* Start Navbar Collapse Header */}
                            <div className="align-items-center border-bottom d-flex d-lg-none  justify-content-between mb-3 navbar-collapse__header pb-3">
                                {/* Start Brand Logo For Mobile */}
                                <div className="collapse-brand flex-shrink-0">
                                    <Link href="/">
                                        <img
                                            src="assets/images/logo.png"
                                            className="header-logo_dark"
                                            alt=""
                                        />
                                    </Link>
                                    <Link href="/">
                                        <img
                                            src="assets/images/logo-white.png"
                                            className="header-logo_white"
                                            alt=""
                                        />
                                    </Link>
                                </div>
                                {/* End Brand Logo For Mobile */}
                                {/* Start Collapse Close Button */}
                                <div className="flex-grow-1 ms-3 text-end">
                                    <button
                                        type="button"
                                        className="bg-transparent border-0 collapse-close p-0 position-relative"
                                        data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
                                    >
                                        <span /> <span />
                                    </button>
                                </div>
                                {/* End Collapse Close Button */}
                            </div>
                            {/* End Navbar Collapse Header */}
                            <ul className="navbar-nav">
                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" href="#" id="dropdownMenuButton1" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                        Home
                                    </Link>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">

                                        {HomeLinks.slice(0, 9).map((link, index) => (
                                            <li key={index}>
                                                <Link className={`dropdown-item ${path === link.href ? 'active' : ''}`} href={link.href}>
                                                    {link.text} {link.badge && <span className="menu-badge">{link.badge}</span>}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="nav-item dropdown mega-menu-content d-none d-lg-block">
                                    <Link className="nav-link dropdown-toggle" href="#" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                        Mega Menu
                                    </Link>
                                    {/* Mega Menu */}
                                    <ul className="dropdown-menu mega-menu p-3 megamenu-content" aria-labelledby="dropdownMenuButton2">
                                        <li>
                                            <div className="row">
                                                <div className="col-menu col-md-3">
                                                    <h6 className="title">Accessories</h6>
                                                    <div className="content">
                                                        <ul className="menu-col">
                                                            <li>
                                                                <Link href="#">Beanies</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Caps &amp; Hats</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Glasses</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Gloves</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Jewellery</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Scarves</Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                {/* end col-3 */}
                                                <div className="col-menu col-md-3">
                                                    <h6 className="title">Sports</h6>
                                                    <div className="content">
                                                        <ul className="menu-col">
                                                            <li>
                                                                <Link href="#">Cricket</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Football</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Golf</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Leggings</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Cycling</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Shorts</Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                {/* end col-3 */}
                                                <div className="col-menu col-md-3">
                                                    <h6 className="title">Tops</h6>
                                                    <div className="content">
                                                        <ul className="menu-col">
                                                            <li>
                                                                <Link href="#">Cardigans</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Coats</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Hoodies &amp; Sweatshirts</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Jumpers</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Polo Shirts</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Shirts</Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-menu col-md-3">
                                                    <h6 className="title">Accessories</h6>
                                                    <div className="content">
                                                        <ul className="menu-col">
                                                            <li>
                                                                <Link href="#">Olympic</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Bomber jackets</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Denim Jackets</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Duffle Coats</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Leather Jackets</Link>
                                                            </li>
                                                            <li>
                                                                <Link href="#">Parkas</Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                {/* end col-3 */}
                                            </div>
                                            {/* end row */}
                                        </li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown mega-menu-content d-none d-lg-block" >
                                    <Link className="nav-link dropdown-toggle" href="#" id="dropdownMenuButton3" data-bs-toggle="dropdown" aria-expanded="false">
                                        Video
                                    </Link>
                                    {/* Mega Menu */}
                                    <ul className="dropdown-menu mega-menu p-3 megamenu-content" aria-labelledby="dropdownMenuButton3">
                                        <li className="g-3 row">
                                            {isLoadingVideos ? (
                                                <>
                                                    {Array(5).fill(0).map((_, i) => (
                                                        <div key={i} className="col-menu-video col-md-3">
                                                            <div className="img-wrapper" style={{ height: '160px', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite ease-in-out', borderRadius: '4px' }}></div>
                                                            <div className="mt-2" style={{ height: '15px', width: '90%', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite ease-in-out', borderRadius: '4px' }}></div>
                                                            <div className="mt-1" style={{ height: '15px', width: '60%', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite ease-in-out', borderRadius: '4px' }}></div>
                                                        </div>
                                                    ))}
                                                    <style jsx>{`
                                                        @keyframes pulse {
                                                            0% { opacity: 0.6; }
                                                            50% { opacity: 1; }
                                                            100% { opacity: 0.6; }
                                                        }
                                                    `}</style>
                                                </>
                                            ) : videos.length > 0 ? videos.slice(0, 5).map((video, index) => {
                                                const data = video.attributes || video;
                                                return (
                                                    <div key={index} className="col-menu-video col-md-3">
                                                        <a className="video-nav-item d-block" href={data.youtubeUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                                                            <div className="img-wrapper">
                                                                <img
                                                                    src={getStrapiMedia(data.thumbnail) || "assets/images/gallery-235x160-1.jpg"}
                                                                    alt={data.title}
                                                                    className="img-fluid"
                                                                    style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                                                                />
                                                                <div className="link-icon">
                                                                    <i className="ti ti-video-camera" />
                                                                </div>
                                                            </div>
                                                            <h4 className="mt-2" style={{ fontSize: '14px', lineHeight: '1.4', color: '#333', whiteSpace: 'normal' }}>
                                                                {data.title && data.title.length > 60 ? `${data.title.substring(0, 60)}...` : data.title}
                                                            </h4>
                                                        </a>
                                                    </div>
                                                );
                                            }) : (
                                                <div className="p-3 text-center w-100">No videos available</div>
                                            )}
                                        </li>
                                    </ul>
                                </li>

                                <li className="nav-item dropdown">
                                    <Link
                                        className="nav-link dropdown-toggle active"
                                        href="#"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        data-bs-auto-close="outside"
                                        aria-expanded="false"

                                    >
                                        Pages
                                    </Link>
                                    <ul className="dropdown-menu">
                                        <li className="nav-item dropdown dropend">
                                            <Link
                                                className="dropdown-item dropdown-toggle"
                                                href="#"
                                                role="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                Home
                                            </Link>
                                            <ul className="dropdown-menu">
                                                {HomeLinks.slice(0, 9).map((link, index) => (
                                                    <li key={index}>
                                                        <Link className={`dropdown-item ${path === link.href ? 'active' : ''}`} href={link.href}>
                                                            {link.text} {link.badge && <span className="menu-badge">{link.badge}</span>}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>

                                        <li className="nav-item dropdown dropend">
                                            <Link
                                                className="dropdown-item dropdown-toggle"
                                                href="#"
                                                role="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                Category layout
                                            </Link>
                                            <ul className="dropdown-menu">
                                                {HomeLinks.slice(9, 12).map((link, index) => (
                                                    <li key={index}>
                                                        <Link className={`dropdown-item ${path === link.href ? 'active' : ''}`} href={link.href}>
                                                            {link.text} {link.badge && <span className="menu-badge">{link.badge}</span>}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li className="nav-item dropdown dropend">
                                            <Link className="dropdown-item dropdown-toggle" href="#">
                                                Post template
                                            </Link>
                                            <ul className="dropdown-menu">
                                                {HomeLinks.slice(12, 15).map((link, index) => (
                                                    <li key={index}>
                                                        <Link className={`dropdown-item ${path === link.href ? 'active' : ''}`} href={link.href}>
                                                            {link.text} {link.badge && <span className="menu-badge">{link.badge}</span>}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        {HomeLinks.slice(15, 19).map((link, index) => (
                                                    <li key={index}>
                                                        <Link className={`dropdown-item ${path === link.href ? 'active' : ''}`} href={link.href}>
                                                            {link.text} {link.badge && <span className="menu-badge">{link.badge}</span>}
                                                        </Link>
                                                    </li>
                                                ))}
                                    </ul>
                                </li>
                                {HomeLinks.slice(4, 8).map((link, index) => (
                                                    <li key={index} className="nav-item">
                                                        <Link className={`nav-link ${path === link.href ? 'active' : ''}`} href={link.href}>
                                                            {link.text} {link.badge && <span className="menu-badge">{link.badge}</span>}
                                                        </Link>
                                                    </li>
                                                ))}
                               
                            </ul>
                        </div>
                        <div className="w-100 w-lg-auto d-none d-lg-flex">
                            {/* Start Search Button */}
                            <div className='d-flex align-items-center gap-3'>
                                <button type="button" className="btn btn-search_two ms-auto" onClick={handleSearchButtonClick} >
                                    <i className="fa fa-search fa-lg" />
                                </button>
                                {/* Theme Switcher */}
                                <ThemeChanger />
                            </div>
                            {/* End Search Button */}
                        </div>
                        {/* End Color Change Button */}
                    </div>
                </nav>
                {/* END OF/. NAVIGATION */}
                {/* START SIDEBAR */}
                {/* START SIDEBAR */}
                <nav id="sidebar" className={isSidebarActive ? "active p-4" : "p-4"} >
                    <div id="dismiss" onClick={closeSidebar}>
                        <i className="fas fa-arrow-left" />
                    </div>
                    <div className="d-flex flex-column h-100">
                        <div className="">
                            <Link href="/" className="d-inline-block my-3">
                                {globalSettings?.data?.attributes?.favicon?.data ? (
                                    <img src={getStrapiMedia(globalSettings.data.attributes.favicon)} alt={globalSettings?.data?.attributes?.siteName || "Logo"} height={50} />
                                ) : (
                                    <img src="assets/images/logo-white.png" alt="Logo" height={50} />
                                )}
                            </Link>
                            <p>
                                {globalSettings?.data?.attributes?.siteDescription || "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."}
                            </p>
                        </div>
                        <ul className="nav d-block flex-column my-4">
                            <li className="nav-item h5">
                                <Link className="nav-link" href="/">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item h5">
                                <Link className="nav-link" href="/about">
                                    About
                                </Link>
                            </li>
                            <li className="nav-item h5">
                                <Link className="nav-link" href="#">
                                    Our Journal
                                </Link>
                            </li>
                            <li className="nav-item h5">
                                <Link className="nav-link" href="/contact">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                        <h5 className="wiget-title">Instagram</h5>
                        {isLoadingInstagrams ? (
                             <ul className="g-1 insta_thumb list-unstyled p-0 row">
                                {Array(4).fill(0).map((_, i) => (
                                    <li key={i} className="col-6">
                                        <div className="insta_effect d-inline-block position-relative" style={{ width: '100%', height: '100px', backgroundColor: '#e0e0e0', animation: 'pulse 1.5s infinite ease-in-out', borderRadius: '4px' }}></div>
                                    </li>
                                ))}
                            </ul>
                        ) : instagrams.length > 0 ? (
                            <ul className="g-1 insta_thumb list-unstyled p-0 row">
                                {instagrams.slice(0, 4).map((item, index) => {
                                     const imgUrl = getStrapiMedia(item?.attributes?.image);
                                     return (
                                        <li key={index} className="col-6">
                                            <a href={item?.attributes?.link || "#"} target="_blank" rel="noopener noreferrer" className="insta_effect d-inline-block position-relative w-100">
                                                <img
                                                    src={imgUrl || "assets/images/instagram-1.jpg"}
                                                    className="img-fluid w-100"
                                                    alt="Instagram"
                                                    style={{ height: '100px', objectFit: 'cover' }}
                                                />
                                            </a>
                                        </li>
                                     );
                                })}
                            </ul>
                        ) : (
                             <p>No Instagram posts available.</p>
                        )}
                        
                        <div className="mt-auto pb-3">
                            {/* Address */}
                            <p className="mb-2 fw-bold">{globalSettings?.data?.attributes?.siteName || "New York, USA (HQ)"}</p>
                            <address className="mb-0">
                                {globalSettings?.data?.attributes?.contactAddress || "1123 Fictional St, San Francisco, CA 94103"}
                            </address>
                            <p className="mb-2">
                                Call:{" "}
                                <a href={`tel:${globalSettings?.data?.attributes?.contactPhone}`} className="text-white">
                                    <u>{globalSettings?.data?.attributes?.contactPhone || "(123) 456-7890"}</u>
                                </a>{" "}
                            </p>
                            <a href={`mailto:${globalSettings?.data?.attributes?.contactEmail}`} className="d-block text-white">
                                {globalSettings?.data?.attributes?.contactEmail || "hello@shottyodharaprotidin.com"}
                            </a>
                        </div>
                    </div>
                </nav>
                {/* END OF /. SIDEBAR */}
                <div className={isOverlayActive ? "overlay active" : "overlay"} />

            </header>
            {/* *** END OF /. PAGE HEADER SECTION *** */}

        </>
    );
};

export default Header;