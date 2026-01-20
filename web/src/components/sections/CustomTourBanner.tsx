'use client'
import SearchFilterBottom from '@/src/components/elements/SearchFilterBottom'
import Link from "next/link"

export default function CustomTourBanner() {
    return (
        <>
            <section className="section-box box-banner-home4 background-body">
                <div className="banner-marker wow fadeInUp">
                    <img className="mr-10 light-mode" src="/assets/imgs/page/homepage4/marker.svg" alt="Travile" />
                    <img className="mr-10 dark-mode" src="/assets/imgs/page/homepage4/marker.svg" alt="Travile" />
                </div>
                <div className="banner-plus wow fadeInUp">
                    <img className="mr-10 light-mode" src="/assets/imgs/page/homepage4/plus.svg" alt="Travile" />
                    <img className="mr-10 dark-mode" src="/assets/imgs/page/homepage4/plus-dark.svg" alt="Travile" />
                </div>
                <div className="banner-fly wow fadeInUp">
                    <img className="mr-10 light-mode" src="/assets/imgs/page/homepage4/fly.svg" alt="Travile" />
                    <img className="mr-10 dark-mode" src="/assets/imgs/page/homepage4/fly-dark.svg" alt="Travile" />
                </div>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 wow fadeInUp">
                            <span className="btn btn-brand-secondary">
                                <img className="mr-10" src="/assets/imgs/page/homepage4/earth.svg" alt="Travile" />
                                Create Your Perfect Journey
                            </span>
                            <h2 className="mt-20 mb-15 neutral-1000">
                                Design Your Dream<br className="d-none d-lg-block" />
                                Custom Tour Experience
                            </h2>
                            <h6 className="heading-6-medium neutral-500 mb-30">
                                Build Your Perfect Itinerary With Interactive Planning Tools
                            </h6>
                            <div className="box-custom-tour-cta background-card p-30 wow fadeInUp">
                                <div className="row align-items-center">
                                    <div className="col-lg-8 col-md-7">
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <div className="icon-wrapper">
                                                <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.542,8.382L2.958,4.902l-1.25,1.26c-0.18,0.17-0.14,0.45,0.07,0.58l11.083,6.465" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"/>
                                                    <path d="M17.884,17.581l7.374,12.642c0.13,0.209,0.41,0.25,0.58,0.07l1.26-1.25l-3.903-16.359" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"/>
                                                    <path d="M9.134,19.857l-6.336-0.715l-1.19,1.189c-0.18,0.18-0.13,0.48,0.09,0.6l3.787,1.975" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"/>
                                                    <path d="M8.109,24.625l2.958,5.677c0.12,0.221,0.42,0.271,0.6,0.091l1.19-1.19l-0.715-6.333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"/>
                                                    <path d="M7.328,24.673l0.4-0.011c0.12-0.01,2.81-0.14,4.88-2.22c0.63-0.58,14.51-13.32,15.99-14.811c2.2-2.2,2.15-5.149,1.54-5.77c-0.61-0.61-3.58-0.66-5.77,1.54c-1.5,1.5-14.23,15.359-14.82,16c-0.644,0.649-1.104,1.354-1.43,2.024" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"/>
                                                    <line stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" x1="10.5" x2="4" y1="21.5" y2="28"/>
                                                    <path d="M27.498,3.502c0.552,0,1,0.448,1,1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <h5 className="neutral-1000 mb-1">Start Your Journey</h5>
                                                <p className="text-sm neutral-500 mb-0">Select destinations • Choose hotels • Visualize routes</p>
                                            </div>
                                        </div>
                                        <div className="features-list d-flex flex-wrap gap-2">
                                            <span className="badge bg-success-subtle text-success">
                                                <svg className="me-1" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                                                </svg>
                                                Interactive Map
                                            </span>
                                            <span className="badge bg-primary-subtle text-primary">
                                                <svg className="me-1" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                                                </svg>
                                                Real-time Pricing
                                            </span>
                                            <span className="badge bg-warning-subtle text-warning">
                                                <svg className="me-1" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                                                </svg>
                                                Instant Availability
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-lg-2 col-md-5 text-end">
                                        <Link href="/custom-tour" className="btn modern-book-btn">
                                            <span className="btn-bg"></span>
                                            <span className="btn-ripple"></span>
                                            <span className="btn-inner">
                                                <span className="icon-circle">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        <path d="M21 16L13 8L5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M21 10L13 2L5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                                                    </svg>
                                                </span>
                                                <span className="btn-label">
                                                    <span className="label-top">Book Your</span>
                                                    <span className="label-bottom">Adventure</span>
                                                </span>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <style jsx>{`
                                .box-custom-tour-cta {
                                    border-radius: 16px;
                                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
                                    border: 2px solid var(--bs-primary-border-subtle);
                                    position: relative;
                                    overflow: hidden;
                                }
                                .box-custom-tour-cta::before {
                                    content: '';
                                    position: absolute;
                                    top: -50%;
                                    left: -50%;
                                    width: 200%;
                                    height: 200%;
                                    background: linear-gradient(45deg, transparent, var(--bs-primary-bg-subtle), transparent);
                                    animation: shine 3s infinite;
                                }
                                @keyframes shine {
                                    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                                    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
                                }
                                .icon-wrapper {
                                    width: 60px;
                                    height: 60px;
                                    border-radius: 12px;
                                    background: var(--bs-primary-bg-subtle);
                                    color: var(--bs-primary);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    animation: float 3s ease-in-out infinite;
                                }
                                @keyframes float {
                                    0%, 100% { transform: translateY(0px); }
                                    50% { transform: translateY(-10px); }
                                }
                                .badge {
                                    padding: 6px 12px;
                                    border-radius: 8px;
                                    font-weight: 500;
                                    font-size: 13px;
                                }
                                
                                /* Modern Button Styles */
                                .modern-book-btn {
                                    position: relative;
                                    padding: 20px 40px;
                                    border-radius: 16px;
                                    font-weight: 700;
                                    border: 3px solid #1e3a8a;
                                    overflow: hidden;
                                    background: transparent;
                                    color: #1e3a8a;
                                    cursor: pointer;
                                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                                    display: inline-block;
                                }
                                
                                .modern-book-btn:hover {
                                    transform: translateY(-8px) scale(1.02);
                                    border-color: #2563eb;
                                    box-shadow: 0 20px 50px rgba(37, 99, 235, 0.3);
                                    color: white;
                                }
                                
                                .btn-bg {
                                    position: absolute;
                                    inset: 0;
                                    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
                                    transform: scaleX(0);
                                    transform-origin: left;
                                    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                                    z-index: 0;
                                }
                                
                                .modern-book-btn:hover .btn-bg {
                                    transform: scaleX(1);
                                }
                                
                                .btn-ripple {
                                    position: absolute;
                                    inset: 0;
                                    border: 2px solid #3b82f6;
                                    border-radius: 16px;
                                    opacity: 0;
                                    animation: ripple 2s ease-out infinite;
                                }
                                
                                @keyframes ripple {
                                    0% {
                                        transform: scale(1);
                                        opacity: 0.6;
                                    }
                                    100% {
                                        transform: scale(1.3);
                                        opacity: 0;
                                    }
                                }
                                
                                .btn-inner {
                                    position: relative;
                                    z-index: 1;
                                    display: flex;
                                    align-items: center;
                                    gap: 15px;
                                }
                                
                                .icon-circle {
                                    width: 40px;
                                    height: 40px;
                                    border-radius: 50%;
                                    background: rgba(37, 99, 235, 0.1);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                                    border: 2px solid currentColor;
                                }
                                
                                .modern-book-btn:hover .icon-circle {
                                    background: rgba(255, 255, 255, 0.2);
                                    transform: rotate(180deg) scale(1.1);
                                }
                                
                                .icon-circle svg {
                                    transition: transform 0.4s ease;
                                }
                                
                                .modern-book-btn:hover .icon-circle svg {
                                    animation: rocketLaunch 0.8s ease-in-out infinite;
                                }
                                
                                @keyframes rocketLaunch {
                                    0%, 100% { transform: translateY(0); }
                                    50% { transform: translateY(-8px); }
                                }
                                
                                .btn-label {
                                    display: flex;
                                    flex-direction: column;
                                    align-items: flex-start;
                                    line-height: 1.2;
                                }
                                
                                .label-top {
                                    font-size: 11px;
                                    font-weight: 600;
                                    text-transform: uppercase;
                                    letter-spacing: 1px;
                                    opacity: 0.8;
                                    transition: all 0.3s ease;
                                }
                                
                                .label-bottom {
                                    font-size: 18px;
                                    font-weight: 800;
                                    transition: all 0.3s ease;
                                }
                                
                                .modern-book-btn:hover .label-top {
                                    opacity: 1;
                                    transform: translateX(5px);
                                }
                                
                                .modern-book-btn:hover .label-bottom {
                                    transform: translateX(5px);
                                    letter-spacing: 1px;
                                }
                                
                                @media (max-width: 768px) {
                                    .modern-book-btn {
                                        padding: 16px 28px;
                                    }
                                    .icon-circle {
                                        width: 35px;
                                        height: 35px;
                                    }
                                    .label-bottom {
                                        font-size: 16px;
                                    }
                                }
                            `}</style>
                        </div>
                    </div>
                    <div className="box-image-banner-home4">
                        <img src="/assets/imgs/page/homepage4/banner.png" alt="Custom Tour" />
                        <div className="shape-rate">
                            <img className="light-mode" src="/assets/imgs/page/homepage4/review.png" alt="TOURZ" />
                            <img className="dark-mode" src="/assets/imgs/page/homepage4/review-dark.png" alt="TOURZ" />
                        </div>
                        <div className="shape-phone">
                            <img className="light-mode" src="/assets/imgs/page/homepage4/hotline.png" alt="TOURZ" />
                            <img className="dark-mode" src="/assets/imgs/page/homepage4/hotline-dark.png" alt="TOURZ" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
