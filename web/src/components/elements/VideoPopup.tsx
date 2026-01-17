'use client'
import { useState } from 'react'
import ModalVideo from 'react-modal-video'
import "../../../node_modules/react-modal-video/css/modal-video.css"

export default function VideoPopup({ vdocls, style2, style3, style4,style5, notext }: any) {
	const [isOpen, setOpen] = useState<boolean>(false)
	return (
		<>
			<a onClick={() => setOpen(true)} className={`${vdocls ? vdocls : ""}`}>
				{style2 ? <>
					<img src="/assets/imgs/page/activities/video.svg" alt="T7wisa" />

					{notext ? "" : "Video Clips"}
				</> : null}

				{style3 ? <><img src="/assets/imgs/page/homepage5/play.svg" alt="T7wisa" />How It Work?</>:null}
				{style4 ? <><img className="mr-0" src="/assets/imgs/page/activities/btn-video.png" alt="T7wisa" /></>:null}
				{style5 ? <><img src="/assets/imgs/page/homepage10/play.png" alt="T7wisa" />How It Work?</>:null}
			</a>

			<ModalVideo channel='youtube' isOpen={isOpen} videoId="JXMWOmuR1hU" onClose={() => setOpen(false)} />
		</>
	)
}