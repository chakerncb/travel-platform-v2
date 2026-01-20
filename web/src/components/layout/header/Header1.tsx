'use client'
import CurrencyDropdown from '@/src/components/elements/CurrencyDropdown'
import LanguageDropdown from '@/src/components/elements/LanguageDropdown'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { signOut, useSession } from "next-auth/react";
import { authService } from '@/src/services'
import { use, useEffect, useState } from 'react'

const ThemeSwitch = dynamic(() => import('@/src/components/elements/ThemeSwitch'), {
	ssr: false,
})
export default function Header1({ scroll, handleLogin, handleMobileMenu, handleRegister, handleSidebar }: any) {

	const { data: session, status } = useSession();
	const [userEcoPoints, setUserEcoPoints] = useState<number>(0);

	const getEcoPoints = () => {
		const res = authService.getProfile()
		res.then((data) => {
			setUserEcoPoints(data.user.eco_points || 0);
			return data.user.eco_points || 0;
		}).catch((error) => {
			console.error("Error fetching user profile:", error);
			return 0;
		});
	}

	useEffect(() => {
		if (status === 'authenticated') {
			// Use session eco points if available, otherwise fetch
			if (session?.user?.ecoPoints !== undefined) {
				setUserEcoPoints(session.user.ecoPoints);
			} else {
				getEcoPoints();
			}
		}
	}, [status, session]);

	return (
		<>
			<header className={`header sticky-bar ${scroll ? "stick" : ""}`}>
				<div className="container-fluid background-body">
					<div className="main-header">
						<div className="header-left">
							<div className="header-logo">
								<Link className="d-flex text-black text-xl" href="/">
								  <Link className="d-flex" href="/"><img className="light-mode" alt="T7wisa" src="/assets/imgs/template/logo-w.svg" /><img className="dark-mode" alt="T7wisa" src="/assets/imgs/template/logo.svg" /></Link>
								   {/* <b>TOURZ</b> */}
								</Link>
							</div>
							<div className="header-nav">
								<nav className="nav-main-menu">
									<ul className="main-menu">
										<li className="mega-li"><Link className="active" href="/">Home</Link></li>
										<li className="mega-li-small"><Link href="/tours">Tours</Link></li>
										<li className="mega-li-small"><Link href="/destinations">Destinations</Link></li>
										<li className=""><Link href="/hotels">Hotels</Link></li>
										<li><Link href="/blog">Blog</Link></li>
										<li><Link href="/contact">Contact</Link></li>
									</ul>
								</nav>
							</div>
						</div>
						<div className="header-right">
							
							<LanguageDropdown />
							
							{session?.user && (
								<div className="eco-points-badge align-middle mr-15 d-none d-md-inline-block">
									<div className="badge-container" style={{
										display: 'inline-flex',
										alignItems: 'center',
										gap: '8px',
										padding: '8px 16px',
										backgroundColor: 'var(--primary-color, #22c55e)',
										borderRadius: '20px',
										color: 'white',
										fontWeight: '600',
										fontSize: '14px',
										boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
									}}>
										<svg 
											width="20" 
											height="20" 
											viewBox="0 0 512 512" 
											fill="currentColor" 
											xmlns="http://www.w3.org/2000/svg"
										>
											<g>
												<g>
													<path d="M504.237,56.503c-2.58-3.862-7.774-4.913-11.678-2.357c-3.895,2.556-4.979,7.799-2.448,11.707    c0.397,0.616,9.668,15.259,1.786,31.461c-6.106,12.547-23.052,27.724-66.259,38.429c-6.728-16.341-17.922-31.283-33.028-43.11    C335.46,47.89,243.153,55.569,145.651,113.198C-43.81,225.152,5.681,450.425,6.202,452.683c0.835,3.631,3.945,6.286,7.659,6.542    c0.198,0.017,0.397,0.025,0.595,0.025c3.482,0,6.641-2.142,7.907-5.425c0.405-1.05,41.708-105.168,153.609-113.166    c136.803-9.768,229.061-61.351,253.111-141.517c4.685-15.615,5.086-31.804,1.644-47.291c40.714-10.317,66.385-26.18,76.546-47.431    C519.207,79.454,504.857,57.43,504.237,56.503z M412.856,194.278c-21.917,73.045-108.691,120.245-238.092,129.492    c-87.155,6.219-135.215,65.751-155.85,99.999c-6.426-59.804-6.939-211.908,135.356-295.99    c52.882-31.246,103.712-47.125,147.124-47.125c31.519,0,59.143,8.374,80.77,25.316c12.04,9.425,21.079,20.891,26.805,33.404    c-13.764,2.639-29.648,4.879-48.052,6.551c-188.841,17.17-249.902,135.145-252.408,140.157c-2.084,4.177-0.397,9.255,3.779,11.347    c1.216,0.612,2.514,0.901,3.788,0.901c3.101,0,6.087-1.704,7.576-4.656c0.141-0.289,14.887-28.996,51.509-59.3    c33.785-27.954,93.705-63.071,187.295-71.577c19.123-1.739,36.423-4.168,51.931-7.265    C417.14,168.154,416.735,181.356,412.856,194.278z"/>
												</g>
											</g>
										</svg>
										<span>{userEcoPoints.toLocaleString()} Points</span>
									</div>
								</div>
							)}

							<div className="d-none d-xxl-inline-block align-middle mr-15">
								<ThemeSwitch />
								{session?.user ? 
									<></> 
								: 
									<a className="btn btn-default btn-signin" onClick={handleLogin}>Signin</a>
								}
							</div>
							<div className="burger-icon-2 burger-icon-white" onClick={handleSidebar}>
								<img src="/assets/imgs/template/icons/menu.svg" alt="TOURZ" />
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	)
}