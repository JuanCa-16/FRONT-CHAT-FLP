import { useState } from 'react';

export const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const videoId = videoUrl.split('v=')[1];
	const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
	const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

	if (!isLoaded) {
		return (
			<div
				className='video-placeholder'
				onClick={() => setIsLoaded(true)}
				style={{
					width: '100%',
					aspectRatio: '16/9',
					backgroundImage: `url(${thumbnailUrl})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					borderRadius: '8px',
					cursor: 'pointer',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					position: 'relative',
				}}
			>
				{/* Icono de Play central */}
				<div
					style={{
						width: '68px',
						height: '48px',
						backgroundColor: 'rgba(0, 0, 0, 0.62)',
						borderRadius: '12px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<div
						style={{
							width: 0,
							height: 0,
							borderTop: '10px solid transparent',
							borderBottom: '10px solid transparent',
							borderLeft: '20px solid white',
						}}
					/>
				</div>
			</div>
		);
	}

	return (
		<iframe
			className='rounded'
			src={embedUrl}
			allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
			allowFullScreen
			style={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px', border: 'none' }}
		/>
	);
};
