'use client'
import { useState } from 'react'


export default function VideoPopup({ vdocls, style2, style3, style4,style5, notext }: any) {
	const [isOpen, setOpen] = useState<boolean>(false)
	return (
		<>
			<a onClick={() => setOpen(true)} className={`${vdocls ? vdocls : ""}`}>
				{style2 ? <>
					<img src="/assets/imgs/page/activities/video.svg" alt="TOURZ" />
\n+\t\t\t\t\t{notext ? "" : "Video Clips"}
				</> : null}

				{style3 ? <><img src="/assets/imgs/page/homepage5/play.svg" alt="TOURZ" />How It Work?</>:null}
				{style4 ? <><img className="mr-0" src="/assets/imgs/page/activities/btn-video.png" alt="TOURZ" /></>:null}
				{style5 ? <><img src="/assets/imgs/page/homepage10/play.png" alt="TOURZ" />How It Work?</>:null}
			</a>

			{isOpen && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100vw',
						height: '100vh',
						background: 'rgba(0,0,0,0.7)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 9999
					}}
					onClick={() => setOpen(false)}
				>
					<div style={{ position: 'relative', background: '#000', borderRadius: 8, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
						<video
							src="/assets/video/video1.mp4"
							controls
							autoPlay
							style={{ width: '80vw', maxWidth: 800, height: 'auto', background: '#000' }}
						/>
						<button
							onClick={() => setOpen(false)}
							style={{
								position: 'absolute',
								top: 8,
								right: 8,
								background: 'rgba(0,0,0,0.5)',
								color: '#fff',
								border: 'none',
								borderRadius: 4,
								padding: '4px 8px',
								cursor: 'pointer',
								zIndex: 2
							}}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</>
	)
}