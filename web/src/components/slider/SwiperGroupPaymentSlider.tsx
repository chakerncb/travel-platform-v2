'use client'
import { Swiper, SwiperSlide } from "swiper/react"
import { swiperGroupPayment } from "@/src/util/swiperOption"
import Link from 'next/link'

export default function SwiperGroupPaymentSlider() {
	return (
		<>
			<Swiper {...swiperGroupPayment}>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/payment-icons/cib-card.svg" alt="T7wisa" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /></div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/payment-icons/logo.svg" alt="T7wisa" /></div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/payment-icons/edahabia-card.svg" alt="T7wisa" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /></div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/payment-icons/chargily-logo.svg" alt="T7wisa" /></div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/payment-icons/cib-card.svg" alt="T7wisa" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /></div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/payment-icons/logo.svg" alt="T7wisa" /></div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/payment-icons/edahabia-card.svg" alt="T7wisa" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}/></div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="btn btn-payment"><img src="/assets/imgs/payment-icons/chargily-logo.svg" alt="T7wisa" /></div>
				</SwiperSlide>
			</Swiper>
		</>
	)
}
