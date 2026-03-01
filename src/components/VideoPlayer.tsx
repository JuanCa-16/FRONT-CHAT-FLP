import { useState } from 'react';
import Tag from './Btns/Tag';
import { YoutubeIcon } from './Icons';
import { bibliotecaService, type BibliotecaCreate } from '../services/bibliotecaService';

export const VideoPlayer = ({ videoUrl, nombre, id }: { videoUrl: string; nombre: string; id: string }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const videoId = videoUrl.split('v=')[1];
	const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
	const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

	const limpio = nombre
		.replace(/^video\s*-\s*\d+\.?\s*/, '') // quita "video - 5. "
		.replace(/\.txt$/, '');

	const agregarABiblioteca = async (payload: BibliotecaCreate) => {
		try {
			await bibliotecaService.agregarABiblioteca(payload);
		} catch (e) {
			console.log(e);
		}
	};

	const handleLoad = async () => {
		setIsLoaded(true);
		agregarABiblioteca({
			origen: 'VIDEO',
			documento_id: Number(id),
		});
	};
	if (!isLoaded) {
		return (
			<div>
				<Tag
					onOpenMenu={() => handleLoad()}
					text={limpio}
					Icon={<YoutubeIcon />}
				/>
				<div
					className='video-placeholder'
					onClick={() => handleLoad()}
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
						marginTop: '8px',
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
			</div>
		);
	}

	return (
		<div>
			<Tag
				onOpenMenu={() => {}}
				text={limpio}
				Icon={<YoutubeIcon />}
			/>
			<iframe
				className='rounded'
				src={embedUrl}
				allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
				allowFullScreen
				style={{
					width: '100%',
					aspectRatio: '16/9',
					borderRadius: '8px',
					border: 'none',
					marginTop: '8px',
				}}
			/>
		</div>
	);
};
