import Link from 'next/link'
import CurrencyDropdown from '@/src/components/elements/CurrencyDropdown'
import LanguageDropdown from '@/src/components/elements/LanguageDropdown'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { signOut, useSession } from "next-auth/react";
import ThemeSwitch from '../elements/ThemeSwitch';


export default function Sidebar({ isSidebar, handleSidebar, handleLogin }: any) {
	const { data: session, status } = useSession();
	return (
		<>

			<div className={`sidebar-canvas-wrapper perfect-scrollbar button-bg-2 ${isSidebar ? "sidebar-canvas-visible" : ""}`}>
				<PerfectScrollbar className="sidebar-canvas-container">
					<div className="sidebar-canvas-head">
						<div className="sidebar-canvas-logo"> <Link className="d-flex" href="/"><img className="light-mode" alt="TOURZ" src="/assets/imgs/template/logo.svg" /><img className="dark-mode" alt="TOURZ" src="/assets/imgs/template/logo-w.svg" /></Link></div>
						<div className="sidebar-canvas-lang">
							<LanguageDropdown />
							<ThemeSwitch />
							<a className="close-canvas" onClick={handleSidebar}> <img alt="TOURZ" src="/assets/imgs/template/icons/close.png" /></a>
						</div>
						
					</div>
						<div className="sidebar-canvas-content">
                      	  {session ?
                            <>
							<div className="box-author-profile">
								<div className="card-author">
									<div className="card-image"> 
										<img src="/assets/imgs/page/homepage1/author2.png" alt="TOURZ" /></div>
									<div className="card-info">
										<p className="text-md-bold neutral-1000">{session.user.name}</p>
										<p className="text-xs neutral-1000">{session.user.email}</p>
									</div>
								</div>
								<Link className="btn btn-black" onClick={() => signOut()} href="#">Logout</Link>
							</div>
							<div className="box-quicklinks">
								<h6 className="title-quicklinks neutral-1000">Quick Links</h6>
								<div className="box-list-quicklinks">
									<div className="item-quicklinks">
										<div className="item-icon"> <img src="/assets/imgs/template/icons/bookmark.svg" alt="TOURZ" />
										</div>
										<div className="item-info"> <Link href="/my-bookings">
											<h6 className="text-md-bold neutral-1000">My Bookings</h6>
										</Link>
											<p className="text-xs neutral-500">7 tours, 2 rooms</p>
										</div>
									</div>
									<div className="item-quicklinks">
										<div className="item-icon"> <img src="/assets/imgs/template/icons/wallet.svg" alt="TOURZ" />
										</div>
										<div className="item-info"> <Link href="#">
											<h6 className="text-md-bold neutral-1000">My Wallet</h6>
										</Link>
											<p className="text-xs neutral-500">$4500</p>
										</div>
									</div>
									<div className="item-quicklinks">
										<div className="item-icon"> <img src="/assets/imgs/template/icons/notify.svg" alt="TOURZ" />
										</div>
										<div className="item-info"> <Link href="#">
											<h6 className="text-md-bold neutral-1000">Notifications</h6>
										</Link>
											<p className="text-xs neutral-500 online">2 new messages</p>
										</div>
									</div>
									{/* <div className="item-quicklinks">
										<div className="item-icon"> <img src="/assets/imgs/template/icons/discount.svg" alt="TOURZ" />
										</div>
										<div className="item-info"> <Link href="#">
											<h6 className="text-md-bold neutral-1000">Discount</h6>
										</Link>
											<p className="text-xs neutral-500">Only today</p>
										</div>
									</div>
									<div className="item-quicklinks">
										<div className="item-icon"> <img src="/assets/imgs/template/icons/friends.svg" alt="TOURZ" />
										</div>
										<div className="item-info"> <Link href="#">
											<h6 className="text-md-bold neutral-1000">Friends</h6>
										</Link>
											<p className="text-xs neutral-500">Your team</p>
										</div>
									</div>
									<div className="item-quicklinks">
										<div className="item-icon"> <img src="/assets/imgs/template/icons/tickets.svg" alt="TOURZ" />
										</div>
										<div className="item-info"> <Link href="#">
											<h6 className="text-md-bold neutral-1000">Tickets</h6>
										</Link>
											<p className="text-xs neutral-500 resolved">3 resolved tickets</p>
										</div>
									</div> */}
									<div className="item-quicklinks">
										<div className="item-icon"> <img src="/assets/imgs/template/icons/settings.svg" alt="TOURZ" />
										</div>
										<div className="item-info"> <Link href="#">
											<h6 className="text-md-bold neutral-1000">Setting</h6>
										</Link>
											<p className="text-xs neutral-500">Your account</p>
										</div>
									</div>
								</div>
							</div>
							<div className="box-eventsdate">
								<h6 className="title-eventsdate neutral-1000">Event Dates</h6>
								<div className="box-calendar-events">
									<div id="calendar-events" />
								</div>
							</div>
							<div className="box-savedplaces">
								<h6 className="title-savedplaces neutral-1000">Saved Places</h6>
								<div className="box-list-places">
									<div className="card-place">
										<div className="card-image"> <img src="/assets/imgs/page/homepage1/place.png" alt="TOURZ" />
										</div>
										<div className="card-info background-card">
											<div className="card-info-top">
												<h6 className="text-xl-bold"> <Link className="neutral-1000" href="#">Machu Picchu</Link></h6>
												<p className="text-xs card-rate"> <img src="/assets/imgs/template/icons/star.svg" alt="TOURZ" />4/5</p>
											</div>
											<div className="card-info-bottom">
												<p className="text-xs-medium neutral-500">Carved by the Colorado River in Arizona,
													United States</p><Link href="#">
													<svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
														<path d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011" strokeLinecap="round" strokeLinejoin="round" />
													</svg></Link>
											</div>
										</div>
									</div>
									<div className="card-place">
										<div className="card-image"> <img src="/assets/imgs/page/homepage1/place2.png" alt="TOURZ" />
										</div>
										<div className="card-info background-card">
											<div className="card-info-top">
												<h6 className="text-xl-bold"> <Link className="neutral-1000" href="#">Machu Picchu</Link></h6>
												<p className="text-xs card-rate"> <img src="/assets/imgs/template/icons/star.svg" alt="TOURZ" />4/5</p>
											</div>
											<div className="card-info-bottom">
												<p className="text-xs-medium neutral-500">Carved by the Colorado River in Arizona,
													United States</p><Link href="#">
													<svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
														<path d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011" strokeLinecap="round" strokeLinejoin="round" />
													</svg></Link>
											</div>
										</div>
									</div>
									<div className="card-place">
										<div className="card-image"> <img src="/assets/imgs/page/homepage1/place3.png" alt="TOURZ" />
										</div>
										<div className="card-info background-card">
											<div className="card-info-top">
												<h6 className="text-xl-bold"> <Link className="neutral-1000" href="#">Machu Picchu</Link></h6>
												<p className="text-xs card-rate"> <img src="/assets/imgs/template/icons/star.svg" alt="TOURZ" />4/5</p>
											</div>
											<div className="card-info-bottom">
												<p className="text-xs-medium neutral-500">Carved by the Colorado River in Arizona,
													United States</p><Link href="#">
													<svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
														<path d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011" strokeLinecap="round" strokeLinejoin="round" />
													</svg></Link>
											</div>
										</div>
									</div>
								</div>
							</div>
							</>
							:
								<div className="box-signin-guest">
									<div className="text-center mb-20">
										<h6 className="neutral-1000 mb-10">Welcome to TOURZ</h6>
										<p className="text-sm neutral-500">Sign in to access your personalized travel experience</p>
									</div>
									<a className="btn btn-black w-100" onClick={handleLogin}>
										Sign In
									</a>
								</div>


							}
							
							<br />
							<br />
							
							<div className="box-contactus">
								<h6 className="title-contactus neutral-1000">Contact Us</h6>
								<div className="contact-info">
									<p className="address-2 text-md-medium neutral-1000">Algeria, Guelma, Guelaat Bou Sbaa</p>
									<p className="hour-work-2 text-md-medium neutral-1000">Hours: 8:00 - 17:00, Mon - Sat</p>
									<p className="email-2 text-md-medium neutral-1000">support@TOURZ.com</p>
								</div>
							</div>
						</div>
					
				</PerfectScrollbar>
			</div>

		</>
	)
}
